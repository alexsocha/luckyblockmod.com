import * as path from 'path';
import express from 'express';
import handlebars from 'express-handlebars';
import {
    getDistFileExtension,
    isValidProjectName,
    ProjectName,
    readProjectDistMetas,
    SortedProjectDistMetas,
} from './project-dist-meta';

const baseDir = path.join(__dirname, '..');
const clientDir = path.join(baseDir, '../client');
const docsDir = path.join(baseDir, '../docs');
//const distDir = path.join(baseDir, '../../luckyblock-dist');
const distDir = path.join(baseDir, '../../luckyblock/dist');

interface TemplateVars {
    projects: SortedProjectDistMetas;
    readonly layout: boolean;
}

const main = async () => {
    const app = express();
    const publicDomain = 'luckyblockmod.com';
    const port = 8080;

    app.set('views', [path.join(clientDir, 'dist/pages'), path.join(docsDir, 'dist')]);
    app.use(express.static(path.join(clientDir, 'dist')));

    // handlebars engines
    app.engine('html', handlebars({ extname: 'html' }));
    app.engine('txt', handlebars({ extname: 'txt' }));
    app.engine('md', handlebars({ extname: 'md' }));

    const templateVars: TemplateVars = {
        projects: await readProjectDistMetas(distDir),
        layout: false,
    };

    // check for new versions every 5 minutes
    setInterval(async () => {
        templateVars.projects = await readProjectDistMetas(distDir);
    }, 1000 * 60 * 5);

    app.get('/', (_, res) => {
        res.render('index.html', templateVars);
    });
    app.get('/info', (_, res) => {
        res.render('info.html', templateVars);
    });
    app.get('/download', (_, res) => {
        res.render('download.html', templateVars);
    });

    app.get('/version-log-:projectName', (req, res) => {
        const { projectName } = req.params;
        if (isValidProjectName(projectName)) {
            res.render(`version-log-${projectName}.txt`, templateVars);
        } else {
            res.status(404).send();
        }
    });

    app.get('/download/:projectName/:version', (req, res) => {
        const { projectName, version } = req.params;
        if (isValidProjectName(projectName)) {
            const meta = templateVars.projects[projectName].find((v) => v.version == version);
            res.render(`download-${projectName}.html`, { ...templateVars, meta });
        } else {
            res.status(404).send();
        }
    });

    app.get('/download/:projectName/:version/download', (req, res) => {
        const { projectName, version } = req.params;
        if (isValidProjectName(projectName)) {
            const host = req.get('host') ?? '';
            const referrerUrl = new URL(req.get('referrer') ?? '');

            // make sure that other sites don't link directly to the download
            if (referrerUrl.host !== host && !referrerUrl.host.includes(publicDomain))
                res.redirect('/');

            const file = path.join(
                distDir,
                `${projectName}-${version}`,
                `${projectName}-${version}.jar`
            );
            res.download(file);
        } else {
            res.status(404).send();
        }
    });
    app.get('/instant-download/:projectName/:version', (req, res) => {
        const { projectName, version } = req.params;
        if (isValidProjectName(projectName)) {
            // make sure that the main mod can't be downloaded instantly
            if (projectName in [ProjectName.LUCKY_BLOCK_FORGE, ProjectName.LUCKY_BLOCK_FABRIC])
                res.redirect('/');

            const file = path.join(
                distDir,
                `${projectName}-${version}`,
                `${projectName}-${version}.${getDistFileExtension(projectName)}`
            );
            res.download(file);
        } else {
            res.status(404).send();
        }
    });

    app.get('/docs', (_, res) => {
        res.render('docs.html', templateVars);
    });
    app.get('/docs/:path', (req, res) => {
        res.render(req.params['path'], templateVars);
    });

    // compatibility
    app.get('/projects/lucky_block/download/version/version_log.txt', (_, res) => {
        res.redirect('/version-log-forge');
    });
    app.get('/version-log', (_, res) => {
        res.redirect('/version-log-forge');
    });
    app.get('/projects/*', (_, res) => {
        res.redirect('/');
    });

    app.listen(port, () => console.log(`App listening to port ${port}`));
};

main();
