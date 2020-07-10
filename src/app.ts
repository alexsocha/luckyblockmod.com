import * as R from 'ramda';
import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as jsyaml from 'js-yaml';
import * as express from 'express';
import * as handlebars from 'express-handlebars';
import * as marked from 'marked';
import * as semver from 'semver';
import * as moment from 'moment';
import { promisify } from 'util';

const baseDir = path.join(__dirname, '..');
const publicDir = path.join(baseDir, 'public');
const distDir = path.join(baseDir, '../luckyblock-dist');

const globAsync = promisify(glob);

const readData = async (): Promise<{}> => {
    const filePaths = await globAsync(path.join(__dirname, 'data/**/*.yaml'));
    return await R.reduce(
        async (acc, filePath) => {
            const contents = await fs.promises.readFile(filePath, 'utf-8');
            const data = jsyaml.safeLoad(contents) as object;
            return { ...acc, ...data };
        },
        {},
        filePaths
    );
};

interface RawDistMeta {
    readonly subversion: number;
    readonly mc_version: string;
    readonly forge_version: string;
    readonly datetime: Date;
}
interface DistMeta extends RawDistMeta {
    readonly version: string;
    readonly datetime_str: string;
}
const readDist = async (): Promise<ReadonlyArray<DistMeta>> => {
    const distFolders = await fs.promises.readdir(distDir);
    const distMetas = await Promise.all(
        R.map(async (folderName) => {
            const metaStr = await fs.promises.readFile(
                path.join(distDir, folderName, 'meta.yaml'),
                'utf-8'
            );
            const distMeta = jsyaml.safeLoad(metaStr) as RawDistMeta;
            return {
                ...distMeta,
                version: distMeta.mc_version + '-' + distMeta.subversion,
                datetime_str: moment(distMeta.datetime).format('YYYY-MM-DD HH:mm'),
            };
        }, distFolders)
    );

    return R.sortWith(
        [(a, b) => semver.compare(b.mc_version, a.mc_version), R.descend(R.prop('subversion'))],
        distMetas
    );
};

const prerenderMarkdown = async () => {
    const filePaths = await globAsync(path.join(__dirname, 'pages/*.md'));
    await R.forEach(async (filePath) => {
        const contents = await fs.promises.readFile(filePath, 'utf-8');
        const html = marked(contents);

        const fileName = path.basename(filePath);
        const publicFilePath = path.join(
            publicDir,
            path.relative('src', path.dirname(filePath)),
            path.basename(filePath, '.md') + '.html'
        );
        await mkdirp(path.dirname(publicFilePath));
        await fs.promises.writeFile(publicFilePath, html);
    }, filePaths);
};

const copyHtml = async () => {
    const filePaths = await globAsync(path.join(__dirname, 'pages/**/*.html'));
    await R.forEach(async (filePath) => {
        const publicFilePath = path.join(publicDir, path.relative('src', filePath));
        await mkdirp(path.dirname(publicFilePath));
        await fs.promises.copyFile(filePath, publicFilePath);
    }, filePaths);
};

const main = async () => {
    const app = express();
    const port = 8080;

    await copyHtml();
    await prerenderMarkdown();

    app.set('views', path.join(publicDir, 'pages'));
    app.use(express.static(path.join(__dirname, 'static')));
    app.use(express.static(publicDir));

    app.engine(
        'html',
        handlebars({
            partialsDir: path.join(__dirname, 'partials'),
            layoutsDir: path.join(__dirname, 'layouts'),
            extname: 'html',
        })
    );
    app.engine('md', handlebars({ extname: 'md' }));

    let templateData = {
        ...(await readData()),
        versions: await readDist(),
        layout: false,
    };
    // check for new versions every 5 minutes
    setInterval(async () => {
        templateData = { ...templateData, versions: await readDist() };
    }, 1000 * 60 * 5);
    console.log(templateData);

    app.get('/', (req, res) => {
        res.render('index.html', templateData);
    });
    app.get('/info', (req, res) => {
        res.render('info.html', { ...templateData, layout: 'markdown-page' });
    });
    app.get('/download', (req, res) => {
        res.render('download.html', templateData);
    });
    app.get('/download', (req, res) => {
        res.render('download.html', templateData);
    });
    app.get('/download/:version', (req, res) => {
        res.render('download-version.html', templateData);
    });

    app.get('/docs', (req, res) => {
        res.render('docs/index.html', templateData);
    });
    app.get('/docs/*.md', (req, res) => {
        res.render(req.path.substring(1), templateData);
    });

    app.listen(port, () => console.log(`App listening to port ${port}`));
};

main();
