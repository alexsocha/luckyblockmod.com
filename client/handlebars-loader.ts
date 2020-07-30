import * as handlebars from 'handlebars';

const hbsLayoutHelper = require('handlebars-layouts');
const hbsMarkdownHelper = require('helper-markdown');

const glob = require('glob');
const fs = require('fs');
const path = require('path');

const baseDir = __dirname;

const registerPartials = (hbsInst: typeof handlebars, partialsGlob: string, prefix: string) => {
    glob.sync(partialsGlob).forEach((filePath: string) => {
        const contents = fs.readFileSync(filePath, 'utf-8');
        hbsInst.registerPartial(prefix + path.parse(filePath).name, contents);
    });
}

registerPartials(handlebars, 'src/partials/*.html', '');
registerPartials(handlebars, 'src/layouts/*.html', 'layouts/');

handlebars.registerHelper('markdown', hbsMarkdownHelper());
handlebars.registerHelper(hbsLayoutHelper(handlebars));

const hbsLoader = (content: string) => {
    const result = handlebars.compile(content)({});
    return result;
}

export default hbsLoader;
