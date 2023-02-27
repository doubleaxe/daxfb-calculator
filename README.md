# Calculator/Factory Planner for factory management games

This project was initially developed as calculator/factory planner for Evospace game.
Later it turned out this project is quite universal and could be used for other factory management games.

### Builds for currently supported games

- Sample - demo game to build help pages.
Calculator link: [https://doubleaxe.github.io/daxfb/sample/](https://doubleaxe.github.io/daxfb/sample/).
- [Evospace](https://store.steampowered.com/app/1013540/Evospace/).
Calculator link: [https://doubleaxe.github.io/daxfb/evospace-calculator/](https://doubleaxe.github.io/daxfb/evospace-calculator/).

# How to use

Help is available as separate page [https://doubleaxe.github.io/daxfb-calculator/](https://doubleaxe.github.io/daxfb-calculator/).
Help sources are located inside `docs` folder in this repository.

# Building

- Install `node.js` version `18` or later.
- Perform `npm install`.
- Set environment variable `GAME` to target game, then run `npm run build`.
For example `GAME=sample npm run build` or `GAME=evospace npm run build`.

# Offline usage

Released packages can be downloaded from 'release' page or self-built.
Then it is possible to just open `index.html` included in release archive locally in browser.
The only remote dependency is `https://polyfill.io/` which is used to make it work inside unsupported browsers.

# TODO list

- Conveyors/Robotic arms/Pipes/etc.. support for link
- Color/Icon states for link and item (overflow, underflow, warning, etc..)
- On load - scroll first factory into view, goto nearest factory
- Move/Delete entire blueprint, production chain or multiple factories (selection, edit)
- Infinite item/resource storages to help taking items somewhere and calculating sums
- Apply counts calculated in locked mode to current factories
- Naming blueprints, remember loaded file name, name saved files according to opened file or blueprint name
- Use `\R\N` for Windows saved files instead of `\N`
- Show total energy, heat, items, etc.. for open ends
- Drag-n-drop flickering fix
- Look into scrollbar expanding bugs
- Use `https://github.com/bcakmakoglu/vue-flow/` for nicer graph display? (will require almost full rewrite)
