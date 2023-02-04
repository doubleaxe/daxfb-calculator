# Calculator/Factory Builder for factory management games

This project was initially developed as calculator/factory builder for Evospace game.
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
