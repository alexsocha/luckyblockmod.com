import * as R from 'ramda';
import * as fs from 'fs';
import * as path from 'path';
import * as jsyaml from 'js-yaml';
import * as express from 'express';
import * as handlebars from 'express-handlebars';
import * as marked from 'marked';
import * as semver from 'semver';
import * as moment from 'moment';
import { promisify } from 'util';

const baseDir = path.join(__dirname, '..');
const clientDir = path.join(baseDir, '../client');
const docsDir = path.join(baseDir, '../docs');
const downloadDistDir = path.join(baseDir, '../../luckyblock-dist');

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
interface DistTemplateVars {
    readonly versions: ReadonlyArray<DistMeta>;
    readonly versionIndexMap: { readonly [k: string]: number };
}
const readDist = async (): Promise<DistTemplateVars> => {
    const distFolders = await fs.promises.readdir(downloadDistDir).catch((err) => {
        console.error(`${downloadDistDir} is empty`);
        return [];
    });

    const distMetas = await Promise.all(
        R.map(async (folderName) => {
            const metaStr = await fs.promises.readFile(
                path.join(downloadDistDir, folderName, 'meta.yaml'),
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

    const versions = R.sortWith(
        [(a, b) => semver.compare(b.mc_version, a.mc_version), R.descend(R.prop('subversion'))],
        distMetas
    );
    const versionIndexMap = R.addIndex<DistMeta, {}>(R.reduce)(
        (acc, v, i) => ({ ...acc, [v.version]: i }),
        {},
        versions
    );
    return { versions, versionIndexMap };
};

const genToken = (): string => {
    return Math.random().toString(36).substr(2);
};

const main = async () => {
    const app = express();
    const port = 8080;

    app.set('views', path.join(clientDir, 'dist/pages'));
    app.use(express.static(path.join(clientDir, 'dist')));
    app.use(express.static(path.join(clientDir, 'static')));
    app.use('/docs', express.static(path.join(docsDir, 'dist')));

    // page engine
    app.engine(
        'html',
        handlebars({
            extname: 'html',
            partialsDir: path.join(clientDir, 'src/partials'),
            layoutsDir: path.join(clientDir, 'src/layouts'),
        })
    );

    // docs engine
    app.engine(
        'md',
        handlebars({
            extname: 'html',
            partialsDir: path.join(docsDir, 'partials'),
        })
    );

    let validTokens = [genToken(), genToken()];

    let templateData = {
        ...(await readDist()),
        layout: false,
        token: validTokens[1],
    };

    // check for new versions every 5 minutes
    setInterval(async () => {
        templateData = { ...templateData, ...(await readDist()) };
    }, 1000 * 60 * 5);

    // change tokens every hour
    setInterval(async () => {
        validTokens = [validTokens[1], genToken()];
        templateData = { ...templateData, token: validTokens[1] };
    }, 1000 * 60 * 60);

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
        const version = req.params['version'];
        const meta = templateData.versions[templateData.versionIndexMap[version]];
        res.render('download-version.html', { ...templateData, meta, layout: 'download-version' });
    });
    app.get('/download/:version/:token', (req, res) => {
        const version = req.params['version'];
        const token = req.params['token'];
        if (R.includes(token, validTokens)) {
            const file = path.join(downloadDistDir, version, `luckyblock-${version}.jar`);
            res.download(file);
        }
    });

    app.get('/docs', (req, res) => {
        res.render('docs.html', templateData);
    });
    app.get('/docs/*.md', (req, res) => {
        res.render(req.path.substring(1), templateData);
    });

    // compatibility
    app.get('/projects/lucky_block/download/version/version_log.txt', (req, res) => {
        res.redirect('/version_log.txt');
    });

    app.get('/projects/*', (req, res) => {
        res.redirect('/');
    });

    app.listen(port, () => console.log(`App listening to port ${port}`));
};

main();
