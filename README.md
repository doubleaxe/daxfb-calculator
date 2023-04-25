# daxfb-calculator
Calculator/Factory Planner for factory management games.

This project was initially developed as calculator/factory planner for Evospace game.
Later it turned out this project is quite universal and could be used for other factory management games.

### Builds for currently supported games

#### Common startup page for all games

[https://doubleaxe.github.io/daxfb-calculator/](https://doubleaxe.github.io/daxfb-calculator/)

#### Direct links for specific games

| Game | Calculator link |
|---|---|
| Sample | [https://doubleaxe.github.io/daxfb-calculator/?gameId=sample](https://doubleaxe.github.io/daxfb-calculator/?gameId=sample) |
| [Evospace](https://store.steampowered.com/app/1013540/Evospace/) | [https://doubleaxe.github.io/daxfb-calculator/?gameId=evospace](https://doubleaxe.github.io/daxfb-calculator/?gameId=evospace) |
| [Captain of Industry](https://www.captain-of-industry.com/) | [https://doubleaxe.github.io/daxfb-calculator/?gameId=coi](https://doubleaxe.github.io/daxfb-calculator/?gameId=coi) |

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

- Color/Icon states for link and item (overflow, underflow, warning, etc..)
- Apply counts calculated in locked mode to current factories
- Allow manual editing mode without auto-solver, check graph is balanced and show results
- Group by custom category, group by building type for CoI
- Multiselect / Move multi-selected factories
- Cut / Copy / Paste individual and multi-selected factories
- Undo / Redo
- Use `\R\N` for Windows saved files instead of `\N`
- Reorder input/output vertical position
- Use `https://github.com/bcakmakoglu/vue-flow/` for nicer graph display? (will require almost full rewrite)
- Automatically sort nodes. Use `elkjs` to automatically lay out graphs.
- Use `https://github.com/d0sboots/dyson-sphere-program`, `https://github.com/Martin-Pitt/dsp-parser/` `https://github.com/xunyinzhe/dsp-calculator/tree/gh-pages/icons`
- Use `https://github.com/greeny/SatisfactoryTools/blob/dev/bin/parseDocs.ts`
