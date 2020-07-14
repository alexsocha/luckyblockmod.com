import * as R from 'ramda';
import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as marked from 'marked';
import { promisify } from 'util';

const baseDir = __dirname;
const srcDir = path.join(baseDir, 'src');
const distDir = path.join(baseDir, 'dist');

const globAsync = promisify(glob);

const renderMd = async () => {
    const filePaths = await globAsync(path.join(srcDir, 'pages/**/*.md'));
    await R.forEach(async (filePath) => {
        const contents = await fs.promises.readFile(filePath, 'utf-8');
        const html = marked(contents);

        const fileName = path.basename(filePath);
        const publicFilePath = path.join(
            distDir,
            path.relative('src', path.dirname(filePath)),
            path.basename(filePath, '.md') + '.html'
        );
        await mkdirp(path.dirname(publicFilePath));
        await fs.promises.writeFile(publicFilePath, html);
    }, filePaths);
};

const copyHtml = async () => {
    const filePaths = await globAsync(
        path.join(srcDir, 'pages/**/*.html')
    );
    await R.forEach(async (filePath) => {
        const relFilePath = path.relative('src', filePath);
        const publicFilePath = path.join(distDir, path.relative('src', filePath));

        await mkdirp(path.dirname(publicFilePath));
        await fs.promises.copyFile(filePath, publicFilePath);
    }, filePaths);
};

const main = async () => {
    await copyHtml();
    await renderMd();
};

main();
