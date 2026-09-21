# calculator-core

Vue 3 library for building factory-planner UIs for management games. It provides the generic
game-data parser, the flowchart graph model, the injection stores, the drag-and-drop
initialization, the factory palette, and the generic flowchart node/edge components. Game
packages subclass the abstract model/parser classes and compose the core components into an app.

## Stack

| Concern       | Choice                                                                    |
| ------------- | ------------------------------------------------------------------------- |
| Framework     | `vue` 3.5 (`<script setup lang="ts">`, Composition API only)              |
| UI components | `primevue` 4 (`Button`, `AutoComplete`, `Paginator`, `Divider`)           |
| Flowchart     | `@vue-flow/core`, `@vue-flow/background`, `@vue-flow/controls`            |
| Drag & drop   | `@dnd-kit/vue` + `@dnd-kit/dom` (pointer sensor, feedback overlay)        |
| Reactivity    | `vue` `reactive` + `@vueuse/core` (`createInjectionState`, `useDark`)     |
| Events        | `nanoevents` (`flowChartModel.events`)                                    |
| Icons         | `@phosphor-icons/vue`                                                     |
| Styling       | Panda CSS (`@doubleaxe/daxfb-calculator-styles`) + PrimeVue CSS variables |
| Data types    | `@doubleaxe/daxfb-shared` (JSON gamedata types, `PublicInterfaceOf`)      |

Internal imports use the alias `#core/*` → `./src/*`.

## Directory map

```
src/
  game/
    parser/                 game-data parsing + injection
      ParsedGameData.ts     abstract Impl classes for game/item/recipe/IO/dictionary
      GameContextBase.ts    useProvideGameDataBase / useGameDataBase
      GameDataUtils.ts      isAbstractClassItem
      index.ts              public parser surface
    model/                  flowchart graph model + injection
      FlowChartModel.ts     abstract FlowChartModelBaseImpl
      FactoryModel.ts       abstract FactoryModelBaseImpl
      RecipeModel.ts        abstract RecipeModelBaseImpl
      RecipeIOModel.ts      abstract RecipeIOModelBaseImpl
      IOLinkModel.ts        abstract IOLinkModelBaseImpl
      ItemModel.ts          base item
      constants.ts          NodeStatus / EdgeStatus / NodeEdgeStatus
      types.ts              PublicInterfaceOf exports + FactoryConnection
      FlowChartContextBase.ts  useProvideFlowChartModelBase / useFlowChartModelBase
      FlowChartEvents.ts    FlowChartEventsBase + useFlowChartEvents
      internal.ts           newId / resetIdStore
      index.ts              public model surface
  stores/
    FactoryPaletteState.ts  palette open/selected-factory state + injection
    FilterStoreBase.ts      palette filter (key + direction) + injection
    FlowConnectionState.ts  live connection state (origin/possible/connected) + injection
  styles/                   Panda recipes/styles
    StatusIcons.ts          StatusIconColor cva
    ActionIconIndicator.ts  indicator glow/animation
    DraggableSelectable.ts  hover/selected/transition recipe
    Dragging.ts             [data-dragging] style
  types/flowchart/
    node/types.ts           FactoryNodeTypeName, FactoryNodeData, FactoryNodeType, FactoryNodeProps
    edge/types.ts           FactoryEdgeTypeName, FactoryEdgeData, FactoryEdgeType, FactoryEdgeProps
    types.ts                FlowChartDroppable id
  ui/
    MantineInit.vue                 color-scheme provider (toggles `.dark` on <html>)
    init.ts                         initApplication() hook
    helpers/UniversalProvider.vue   generic provide wrapper
    main/
      DragAndDropInitializer.vue    dnd-kit DragDropProvider setup
      InternalStoresInitializer.vue provides all stores + model
      AppWindowBase.vue             app shell layout (named slots)
    toolbar/ToolBarBase.vue
    components/
      ActionButton.vue              icon-only PrimeVue button
      GameIcon.vue                  sprite-sheet icon
      GameIconDraggableSelectableBase.vue
      GameIconDragging.vue          drag preview
    factory-palette/
      FactoryPalette.vue
      FilterFactoryItem.vue
      FactoryPaletteItemList.vue
      GameIconDraggableSelectable.vue
    flowchart/
      flow.css                      Vue Flow base/theme css
      FlowChartFrame.vue            droppable pane wrapper
      FlowChart.vue                 VueFlow host
      FlowChartConnectionManager.ts connection composable
      FlowChartDropManager.ts       palette-drop composable
      FlowChartDropIndicator.vue
      node/  FactoryNode, FactorySurface, TitleRow, FactoryIO,
             MainIconActions, FactoryMainButton, IOConnectionMarker
      edge/  FactoryEdge, ConnectionLine
  utils/
    hooks.ts                useInitRef, useWindowClick
    main/StylesInitializer.ts  useStylesInitializer (game icon CSS vars)
```

## Runtime data flow

```
GameDataBase (frozen)                 FlowChartModelBase (reactive)
  gameItemsArray                        items / links (Maps)
  gameFactoriesArray                    itemsGeneration / linksGeneration
  getGameItem(key)                      events (nanoevents)
  getItemRecipeDictionary(item)         addItem / createLink / findConnectable / findIo
        │                                      │
        │ useGameDataBase()                    │ useFlowChartModelBase()
        ▼                                      ▼
              UI components / stores (injected, reactive)
                        │
        FactoryPaletteState / FilterStoreBase / FlowConnectionState
                        │
                        ▼
   AppWindowBase(toolbar, factoryPalette, flowChart)
     ToolBarBase
     FactoryPalette(FilterFactoryItem, FactoryPaletteItemList)
     FlowChartFrame > FlowChart(VueFlow) > FactoryNode/FactoryEdge
```

The model is the source of truth for the graph; the UI observes it through Vue reactivity and
mutates it only through model methods. `itemsGeneration` / `linksGeneration` counters exist so the
flowchart can re-sync Vue Flow nodes/edges when items/links are added or removed.

## Dependency injection

All shared state is provided/injected through `@vueuse/core` `createInjectionState`. Each module
exports a `useProvideX` (call in a provider component `setup`) and a `useX` (call in any
descendant `setup`; throws if missing).

| State            | Provide                               | Inject                     | Provided by                 |
| ---------------- | ------------------------------------- | -------------------------- | --------------------------- |
| Game data        | `useProvideGameDataBase(gameData)`    | `useGameDataBase()`        | game package (app shell)    |
| Flow chart model | `useProvideFlowChartModelBase(model)` | `useFlowChartModelBase()`  | `InternalStoresInitializer` |
| Palette state    | `useProvideFactoryPaletteState(s)`    | `useFactoryPaletteState()` | `InternalStoresInitializer` |
| Filter store     | `useProvideFilterStoreBase(s)`        | `useFilterStoreBase()`     | `InternalStoresInitializer` |
| Connection state | `useProvideFlowConnectionState(s)`    | `useFlowConnectionState()` | `InternalStoresInitializer` |

Store instances and the flow-chart model are wrapped in `reactive()` at provide time, so all
consumers observe field mutations. Mutate via the store/model methods or fields.

## Game data layer (`#core/game/parser`)

Abstract classes to subclass per game:

- `ParsedGameDataBaseImpl<...>` — parses raw JSON into items/recipes, materializes abstract
  recipes, cross-links items ↔ recipes, freezes everything.
- `GameDataBaseImpl<...>` — runtime index built from parsed data. Public accessors:
  `gameItemsArray`, `gameAbstractItems`, `gameItemsByType`, `gameFactoriesArray`, `description`,
  `getGameItem(key)`, `getItemRecipeDictionary(item)`.
- `GameItemBaseImpl`, `GameRecipeBaseImpl`, `GameRecipeIOBaseImpl`, `GameRecipeDictionaryBaseImpl`
  — item/recipe/IO/dictionary implementations. Public read-only types are exported as
  `GameItemBase`, `GameRecipeBase`, `GameRecipeIOBase`, `GameRecipeDictionaryBase`, `GameDataBase`.

Helpers: `isAbstractClassItem(item)`, flag enums `GameItemFlagsBase`, `GameItemTypeBase`,
`GameRecipeIOFlagsBase`.

## Flow chart model (`#core/game/model`)

Abstract classes to subclass per game (constructor injection of child factories):

```ts
class FlowChartModelBaseImpl {
    constructor(gameData, factoryConstructor, ioLinkConstructor);
    // items, links, itemsGeneration, linksGeneration, events
    // itemByKey, linkByKey, findIo, findConnectable
    // addItem, createLink, createLinkAuto, requestSolveGraph
}

class FactoryModelBaseImpl extends ItemModelBaseImpl {
    constructor(flowChart, key, recipeConstructor);
    // status, isFlipped, position, selectedRecipe, upgradable
    // setPosition, selectRecipe, deleteItem, deleteAllLinks
}

class RecipeModelBaseImpl {
    constructor(factory, key, ioConstructor);
    // key, input, output, visibleInput/visibleOutput, invisibleInput/invisibleOutput
}

class RecipeIOModelBaseImpl extends ItemModelBaseImpl {
    constructor(recipe, io);
    // status, isInput, isHidden, isFlipped, factory, links, linksCount, isConnectable
}

class IOLinkModelBaseImpl {
    constructor(input, output);
    // linkId, input, output, getOtherSide, deleteLink
}
```

Public read-only interfaces (use these in component props):
`FlowChartModelBase`, `FactoryModelBase`, `RecipeModelBase`, `RecipeIOModelBase`,
`IOLinkModelBase` — all derived from the Impl classes via `PublicInterfaceOf`.

Status constants: `NodeStatus` (`None`, `ConnectionOrigin`, `ConnectionDest`, `PossibleDest`,
`ConnectedDest`) and `EdgeStatus` (`None`, `ConnectionOrigin`, `ConnectionDest`, `ConnectedDest`).

Events (`flowChartModel.events`, nanoevents):

```ts
type FlowChartEventsBase = {
    paneClickAnywhere: (event: MouseEvent) => void;
    solveGraph: (changedItems: FactoryModelBase[]) => void;
};
```

Subscribe in a component with `useFlowChartEvents(() => [flowChartModel.events.on('event', cb)])`;
the returned unsubscribers are disposed with the component scope.

## Stores (`#core/stores`)

- `FactoryPaletteState` — `factoryPaletteOpened`, `itemSearchOpened`, `selectedFactory`;
  `toggleFactoryPalette`, `setItemSearchOpened`, `setSelectedFactory`.
- `FilterStoreBase` — `filter` (grouped `GameItemBase[][]`), `key`, `direction`; `setKey`,
  `setDirection`. `direction` is `-1` inputs, `0` both, `1` outputs.
- `FlowConnectionState` — `origin`, `possibleDests`, `connectedDests`, `connectionMode`;
  `startConnection(io, mode)`, `clearActiveConnection()`. `ConnectionMode` = `None | Click | Drag`.

## Styling

- Use Panda helpers from `@doubleaxe/daxfb-calculator-styles/css`: `css`, `cx`, `cva`, `css.raw`,
  and `@doubleaxe/daxfb-calculator-styles/patterns`: `hstack`, `vstack`, `stack`.
- Do **not** add scoped or inline styles. For dynamic values (e.g. drag indicator position) bind a
  CSS custom property through `:style` and consume it in a Panda `css()` rule.
- No Tailwind. Express layout/spacing/colors with the Panda stack patterns (`hstack`/`vstack`/
  `stack`) or `css()` using Panda theme tokens, e.g. `padding: '2'`, `gap: '2px'`,
  `borderRadius: 'lg'` (resolves to `var(--panda-radii-lg)`).
- Light/dark conditions are `_light` = `:root:not(.dark) &` and `_dark` = `.dark &`. The `.dark`
  class is toggled on `<html>` by `MantineInit.vue` (`useDark`).
- Color tokens are PrimeVue CSS variables (`var(--p-primary-color)`, `var(--p-surface-*)`,
  `var(--p-text-color)`, `var(--p-blue-700)`, …). Use `color-mix(...)` when alpha is needed.
- Game icon variables are injected by `useStylesInitializer`: `--game-icon-path`,
  `--game-icon-size`, `--game-icon-size-half`, `--game-icon-size-quarter`.
- Node-local variables set by `MainIconActions.vue`: `--action-icon-size`, `--central-border`,
  `--central-padding`, `--total-size-x`, `--total-size-y`, `--side-offset-y`, `--side-height`.
- Shared recipes live in `src/styles/` (`draggableSelectableStyles`, `draggingStyle`,
  `StatusIconColor`, `actionIconIndicatorStyle`).

## UI composition root

Providers, outer → inner:

1. `MantineInit.vue` — color scheme. Slot: default.
2. `DragAndDropInitializer.vue` — `DragDropProvider` with `RestrictToWindow`, `Feedback`
   (no drop animation), pointer sensors (distance 8 / delay 400). Slot: default.
3. `InternalStoresInitializer.vue` — provides filter store, palette state, flow chart model,
   connection state. Props: `flowChartModel: () => FlowChartModelBase`, `store?: () => FilterStoreBase`.
   Slot: default.
4. `AppWindowBase.vue` — shell layout. Slots: `toolbar`, `factoryPalette`, `flowChart`.
   Header is 60px; the palette is a collapsible left column (`190px`, `260px` at `lg`); the main
   area is padded.

`useProvideGameDataBase(...)` must be called by an ancestor of `InternalStoresInitializer`.

## Component catalog

### Shell / toolbar

| Component                   | File                                    | Props                                                                        | Emits | Slots                                    |
| --------------------------- | --------------------------------------- | ---------------------------------------------------------------------------- | ----- | ---------------------------------------- |
| `MantineInit`               | `ui/MantineInit.vue`                    | —                                                                            | —     | default                                  |
| `UniversalProvider`         | `ui/helpers/UniversalProvider.vue`      | `init: () => unknown`, `useProvide: (value: unknown) => unknown`             | —     | default                                  |
| `DragAndDropInitializer`    | `ui/main/DragAndDropInitializer.vue`    | —                                                                            | —     | default                                  |
| `InternalStoresInitializer` | `ui/main/InternalStoresInitializer.vue` | `flowChartModel: () => FlowChartModelBase`, `store?: () => FilterStoreBase`  | —     | default                                  |
| `AppWindowBase`             | `ui/main/AppWindowBase.vue`             | —                                                                            | —     | `toolbar`, `factoryPalette`, `flowChart` |
| `ToolBarBase`               | `ui/toolbar/ToolBarBase.vue`            | —                                                                            | —     | —                                        |
| `ActionButton`              | `ui/components/ActionButton.vue`        | `icon: Component`; all other attrs fall through (`title`, `class`, `@click`) | —     | —                                        |

### Icons / drag previews

| Component                         | File                                                | Props                                                 | Emits               |
| --------------------------------- | --------------------------------------------------- | ----------------------------------------------------- | ------------------- |
| `GameIcon`                        | `ui/components/GameIcon.vue`                        | `image: GameItemImageJson \| undefined`               | —                   |
| `GameIconDraggableSelectableBase` | `ui/components/GameIconDraggableSelectableBase.vue` | `image`, `isSelected?`, `borderStyle?`, `elementRef?` | `click(MouseEvent)` |
| `GameIconDragging`                | `ui/components/GameIconDragging.vue`                | `item: GameItemBase \| undefined`                     | —                   |

### Factory palette

| Component                     | File                                                 | Props                                               | Emits | Slots                     |
| ----------------------------- | ---------------------------------------------------- | --------------------------------------------------- | ----- | ------------------------- |
| `FactoryPalette`              | `ui/factory-palette/FactoryPalette.vue`              | —                                                   | —     | `filterPanel`, `itemList` |
| `FilterFactoryItem`           | `ui/factory-palette/FilterFactoryItem.vue`           | —                                                   | —     | —                         |
| `FactoryPaletteItemList`      | `ui/factory-palette/FactoryPaletteItemList.vue`      | —                                                   | —     | —                         |
| `GameIconDraggableSelectable` | `ui/factory-palette/GameIconDraggableSelectable.vue` | `item: GameItemBase`, `isSelected?`, `borderStyle?` | —     | —                         |

`FilterFactoryItem` renders a PrimeVue `AutoComplete` (debounced 400 ms) with direction buttons
in the header and a `Paginator` in the footer; selecting an option calls
`filterStore.setKey(item.key)`. `FactoryPaletteItemList` renders `filterStore.filter` groups of
`GameIconDraggableSelectable` and a `Teleport`-ed `DragOverlay` preview.

### Flowchart

| Component                | File                                       | Props                                                           | Notes                                                                                           |
| ------------------------ | ------------------------------------------ | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `FlowChartFrame`         | `ui/flowchart/FlowChartFrame.vue`          | —                                                               | `useDroppable(FlowChartDroppable)`, emits `paneClickAnywhere` on the model, renders `FlowChart` |
| `FlowChart`              | `ui/flowchart/FlowChart.vue`               | —                                                               | hosts `VueFlow`; syncs nodes/edges from model generations; `#connection-line` slot              |
| `FlowChartDropIndicator` | `ui/flowchart/FlowChartDropIndicator.vue`  | `x: number`, `y: number`, `visible?`, `item?`                   | floating drag preview                                                                           |
| `FactoryNode`            | `ui/flowchart/node/FactoryNode.vue`        | `id: string`, `dragging?: boolean` (Vue Flow node props)        | `inheritAttrs: false`; reads `flowChartModel.itemByKey(id)`                                     |
| `TitleRow`               | `ui/flowchart/node/TitleRow.vue`           | `data: FactoryModelBase`, `dragging?: boolean`                  | drag handle has `NodeDragHandleClass`                                                           |
| `FactorySurface`         | `ui/flowchart/node/FactorySurface.vue`     | `data: FactoryModelBase`                                        | left/right IO columns + center actions                                                          |
| `FactoryIO`              | `ui/flowchart/node/FactoryIO.vue`          | `io: RecipeIOModelBase`                                         | Vue Flow `Handle` + label                                                                       |
| `MainIconActions`        | `ui/flowchart/node/MainIconActions.vue`    | `data: FactoryModelBase`                                        | upgrade/minus/plus + main button                                                                |
| `FactoryMainButton`      | `ui/flowchart/node/FactoryMainButton.vue`  | `data: FactoryModelBase`                                        | central icon, status marker, conditional connection handle                                      |
| `IOConnectionMarker`     | `ui/flowchart/node/IOConnectionMarker.vue` | `status: EdgeStatus`                                            | status arrow/cross                                                                              |
| `FactoryEdge`            | `ui/flowchart/edge/FactoryEdge.vue`        | Vue Flow edge props (`id`, `sourceX/Y`, `targetX/Y`, positions) | bezier edge from model link                                                                     |
| `ConnectionLine`         | `ui/flowchart/edge/ConnectionLine.vue`     | Vue Flow connection-line props (+ `sourceHandle`)               | in-progress connection path                                                                     |

Custom node/edge components are registered on `VueFlow` via `:node-types` / `:edge-types` keyed by
`FactoryNodeTypeName` / `FactoryEdgeTypeName`.

## Composables

- `useFlowChartConnectionManager(flowChartModel)` (`ui/flowchart/FlowChartConnectionManager.ts`)
  returns `onClickConnectStart`, `onClickConnectEnd`, `onConnectStart`, `onConnectEnd`,
  `onConnect`, `isValidConnection`. Bind these to the matching `VueFlow` events and the
  `:is-valid-connection` prop.
- `useFlowChartDropManager(flowChartModel)` (`ui/flowchart/FlowChartDropManager.ts`) returns
  `onPaneMouseLeave`, `onPaneMouseMove`, `onPaneClick`, and a `dragIndicator` ref. It handles
  dropping a palette item onto the chart and click-to-place via `screenToFlowCoordinate`.
- `useStylesInitializer({ gameData, iconsPath })` (`utils/main/StylesInitializer.ts`) injects the
  game icon CSS variables on mount and removes them on unmount.
- `useFlowChartEvents(subscriber)` (`game/model/FlowChartEvents.ts`) subscribes to model events and
  disposes them with the component scope.
- `useInitRef(init)` and `useWindowClick(cb)` (`utils/hooks.ts`).

## App wiring example

```vue
<script setup lang="ts">
import DragAndDropInitializer from '#core/ui/main/DragAndDropInitializer.vue';
import InternalStoresInitializer from '#core/ui/main/InternalStoresInitializer.vue';
import MantineInit from '#core/ui/MantineInit.vue';
import AppWindowBase from '#core/ui/main/AppWindowBase.vue';
import ToolBarBase from '#core/ui/toolbar/ToolBarBase.vue';
import FactoryPalette from '#core/ui/factory-palette/FactoryPalette.vue';
import FilterFactoryItem from '#core/ui/factory-palette/FilterFactoryItem.vue';
import FactoryPaletteItemList from '#core/ui/factory-palette/FactoryPaletteItemList.vue';
import FlowChartFrame from '#core/ui/flowchart/FlowChartFrame.vue';
import { useProvideGameDataBase } from '#core/game/parser/index.js';
import useStylesInitializer from '#core/utils/main/StylesInitializer.js';

// gameData + flowChartModel come from the game package
useProvideGameDataBase(gameData);
useStylesInitializer({ gameData, iconsPath });
</script>

<template>
    <MantineInit>
        <DragAndDropInitializer>
            <InternalStoresInitializer :flow-chart-model="() => flowChartModel">
                <AppWindowBase>
                    <template #toolbar><ToolBarBase /></template>
                    <template #factoryPalette>
                        <FactoryPalette>
                            <template #filterPanel><FilterFactoryItem /></template>
                            <template #itemList><FactoryPaletteItemList /></template>
                        </FactoryPalette>
                    </template>
                    <template #flowChart><FlowChartFrame /></template>
                </AppWindowBase>
            </InternalStoresInitializer>
        </DragAndDropInitializer>
    </MantineInit>
</template>
```

## Conventions for new components

- Use `<script setup lang="ts">` and `defineProps` / `defineEmits`. No Options API.
- Read shared state through the `useX()` injectors; never import a store singleton.
- Import sibling components with the `.vue` extension and `.ts` modules with `.js`.
- Use Panda patterns (`hstack`/`vstack`/`stack`) and `css()` for layout/styling; use PrimeVue
  components for controls. No Tailwind, no scoped or inline styles; dynamic values go through CSS
  custom properties consumed by `css()`.
- Keep model logic in `game/model` and `stores`; components only read/observe and call methods.
- Keep generic logic in `calculator-core`; game-specific parsing/model subclasses and page wiring
  belong to the game package.
