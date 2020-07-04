import * as R from 'ramda';
import * as Handlebars from 'handlebars';
import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import * as jsyaml from 'js-yaml';
import { promisify } from 'util';

const publicFolder = 'public';

const globAsync = promisify(glob);

const registerPartials = async () => {
    const filePaths = await globAsync('src/partials/**/*.html');
    for await (const filePath of filePaths) {
        const contents = await fs.promises.readFile(filePath, 'utf-8');
        Handlebars.registerPartial(path.basename(filePath, path.extname(filePath)), contents);
    }
};

const readData = async (): Promise<{}> => {
    const filePaths = await globAsync('src/data/**/*.yaml');
    return await filePaths.reduce(async (acc, filePath) => {
        const contents = await fs.promises.readFile(filePath, 'utf-8');
        const data = jsyaml.safeLoad(contents) as object;
        return { ...acc, ...data };
    }, {});
};

const generatePages = async (templateData: {}) => {
    const filePaths = await globAsync('src/pages/**/*.html');
    for await (const filePath of filePaths) {
        const contents = await fs.promises.readFile(filePath, 'utf-8');
        const template = Handlebars.compile(contents);

        const publicPath = path.join(publicFolder, path.relative('src/pages', filePath));
        await fs.promises.mkdir(path.dirname(publicPath), { recursive: true });
        await fs.promises.writeFile(publicPath, template(templateData));
    }
};

const copyStatic = async () => {
    const filePaths = await globAsync('src/static/**/*.*');
    for await (const filePath of filePaths) {
        const publicPath = path.join(publicFolder, path.relative('src/static', filePath));
        await fs.promises.mkdir(path.dirname(publicPath), { recursive: true });
        await fs.promises.copyFile(filePath, publicPath);
    }
};

const main = async () => {
    await registerPartials();

    const templateData = await readData();
    await generatePages(templateData);

    await copyStatic();
};

main();
