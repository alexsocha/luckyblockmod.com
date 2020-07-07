import * as R from 'ramda';
import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import * as jsyaml from 'js-yaml';
import * as express from 'express';
import * as handlebars from 'express-handlebars';
import { promisify } from 'util';

const globAsync = promisify(glob);

const readData = async (): Promise<{}> => {
    const filePaths = await globAsync('data/**/*.yaml');
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

const app = express();
const port = 8080;

app.set('views', path.join(__dirname, 'pages'));
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.engine(
    'html',
    handlebars({
        partialsDir: path.join(__dirname, 'partials'),
        extname: 'html',
    })
);
app.engine('md', handlebars({ extname: 'md' }));

readData().then((data) => {
    const templateData = { ...data, layout: false };

    app.get('/', (req, res) => {
        res.render('index.html', templateData);
    });
    app.get('/info', (req, res) => {
        res.render('info.html', templateData);
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
});

app.listen(port, () => console.log(`App listening to port ${port}`));
