/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import * as fs from 'node:fs';
import * as path from 'node:path';
import {marked} from 'marked';

//npx ts-node render-docs.ts
//node --loader ts-node/esm --inspect-brk render-docs.ts

const _dirname = __dirname;
const _docs = path.join(_dirname, 'docs');
const _target = path.join(_dirname, 'dist', 'docs');
const _css = path.join(_dirname, 'node_modules', 'github-markdown-css');
/*
TODO:
use github api to convert markdown to html (will require online connection, will work in action?)
see https://docs.github.com/en/rest/repos/contents
curl -L -H "Accept: application/vnd.github.html" https://api.github.com/repos/doubleaxe/daxfb-calculator/contents/docs/README.md
or see https://docs.github.com/en/rest/markdown
also https://github.com/octokit/octokit.js
*/
(async function() {
    console.log('building docs...');
    fs.rmSync(_target, {recursive: true, force: true});
    fs.mkdirSync(_target, {recursive: true});

    const ignoreFiles: Record<string, boolean> = {
        '_config.yml': true,
        'template.html': true,
    };
    copyFolderRecursiveSync(_docs, _target, ignoreFiles);

    const markdown = fs.readFileSync(path.join(_docs, 'README.md'), 'utf8');
    const template = fs.readFileSync(path.join(_docs, 'template.html'), 'utf8');
    const html = await marked(markdown, {
        gfm: true,
        async: true,
    });
    fs.writeFileSync(path.join(_target, 'index.html'), template.replace('__MARKDOWN_CONTENT__', html), 'utf8');
    for(const css of ['github-markdown.css', 'github-markdown-light.css', 'github-markdown-dark.css']) {
        fs.copyFileSync(path.join(_css, css), path.join(_target, 'assets', css));
    }
})()
.catch((err) => {
    console.error(err.stack);
    process.exit(1);
});

function copyFolderRecursiveSync(source: string, target: string, ignoreFiles?: Record<string, boolean>) {
    const files = fs.readdirSync(source);
    for(const file of files) {
        if(ignoreFiles?.[file])
            continue;
        const sourceFile = path.join(source, file);
        const targetFile = path.join(target, file);
        if(fs.lstatSync(sourceFile).isDirectory()) {
            fs.mkdirSync(targetFile);
            copyFolderRecursiveSync(sourceFile, targetFile);
        } else {
            fs.copyFileSync(sourceFile, targetFile);
        }
    }
}
