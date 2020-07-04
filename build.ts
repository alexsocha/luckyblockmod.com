import * as R from 'ramda';
import * as Handlebars from 'handlebars';
import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const publicFolder = './public';

const globAsync = promisify(glob);

const registerPartials = async () => {
    const filePaths = await globAsync('src/partials/**/*.hbs');
    for await (const filePath of filePaths) {
        const contents = await fs.promises.readFile(filePath, 'utf-8');
        Handlebars.registerPartial(path.basename(filePath, '.hbs'), contents);
    }
};

const generatePages = async () => {
    const filePaths = await globAsync('src/pages/**/*.{hbs,html}');
    for await (const filePath of filePaths) {
        const contents = await fs.promises.readFile(filePath, 'utf-8');
        const template = Handlebars.compile(contents);

        const publicPath = path.join(publicFolder, path.relative('src/pages', filePath));
        await fs.promises.mkdir(path.dirname(publicPath), { recursive: true });
        await fs.promises.writeFile(publicPath, contents);
    }
};

const main = async () => {
    await registerPartials();
    await generatePages();
    const template = Handlebars.compile('hello {{> navbar }}');
    //console.log(template({ foo: 'test' }));
};

main();
