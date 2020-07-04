import * as R from 'ramda';
import * as Handlebars from 'handlebars';
import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);
const globAsync = promisify(glob);

const registerPartials = async () => {
    const filePaths = await globAsync('src/partial/**/*.hbs');
    for await (const filePath of filePaths) {
        const contents = await readFileAsync(filePath, 'utf-8');
        Handlebars.registerPartial(path.basename(filePath, '.hbs'), contents);
    }
};

const main = async () => {
    await registerPartials();
    const template = Handlebars.compile('hello {{> navbar }}');
    console.log(template({ foo: 'test' }));
};

main();
