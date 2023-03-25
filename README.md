# daxfb-calculator
Calculator/Factory Planner for factory management games.

This project was initially developed as calculator/factory planner for Evospace game.
Later it turned out this project is quite universal and could be used for other factory management games.

### Builds for currently supported games

#### Common startup page for all games

[https://doubleaxe.github.io/daxfb-calculator/](https://doubleaxe.github.io/daxfb-calculator/)

#### Direct links for specific games

- Sample - demo game to build help pages.
Calculator link: [https://doubleaxe.github.io/daxfb-calculator/?gameId=sample](https://doubleaxe.github.io/daxfb-calculator/?gameId=sample).
- [Evospace](https://store.steampowered.com/app/1013540/Evospace/).
Calculator link: [https://doubleaxe.github.io/daxfb-calculator/?gameId=evospace](https://doubleaxe.github.io/daxfb-calculator/?gameId=evospace).

# How to use

Help is available as separate page [https://doubleaxe.github.io/daxfb-calculator/docs/](https://doubleaxe.github.io/daxfb-calculator/docs/).
Help sources are located inside `docs` folder in this repository.

# Building

- Install `node.js` version `18` or later.
- Perform `npm install`.
- Run `npm run build`.

# Offline usage

Released packages can be downloaded from 'release' page or self-built.
Then it is possible to just open `index.html` included in release archive locally in browser.
The only remote dependency is `https://polyfill.io/` which is used to make it work inside unsupported browsers.
Query string `?gameId=<game>` may be added to quickly open desired game, for example `daxfb-calculator/dist/index.html?gameId=evospace`.

# TODO list

- Drag-Scroll Firefox issues
- Color/Icon states for link and item (overflow, underflow, warning, etc..)
- Move/Delete entire blueprint, production chain or multiple factories (selection, edit)
- Apply counts calculated in locked mode to current factories
- Use `\R\N` for Windows saved files instead of `\N`
- Use `https://github.com/bcakmakoglu/vue-flow/` for nicer graph display? (will require almost full rewrite)
