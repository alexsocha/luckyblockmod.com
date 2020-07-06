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

app.set('views', 'pages');
app.use(express.static('static'));

app.set('view engine', 'html');
app.engine(
    'html',
    handlebars({
        partialsDir: 'partials',
        extname: 'html',
    })
);

readData().then((data) => {
    const templateData = { ...data, layout: false };

    app.get('/', (req, res) => {
        res.render('index.html', templateData);
    });
    app.get('/luckyblock', (req, res) => {
        res.render('luckyblock.html', templateData);
    });
    app.get('/luckyblock/info', (req, res) => {
        res.render('luckyblock/info.html', templateData);
    });
    app.get('/luckyblock/download', (req, res) => {
        res.render('luckyblock/download.html', templateData);
    });
    app.get('/luckyblock/download', (req, res) => {
        res.render('luckyblock/download.html', templateData);
    });
    app.get('/luckyblock/download/:version', (req, res) => {
        res.render('luckyblock/download-version.html', templateData);
    });
});

app.listen(port, () => console.log(`App listening to port ${port}`));
