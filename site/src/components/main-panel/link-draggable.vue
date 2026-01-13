<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import { unref, computed, reactive, toRaw, ref, watch, nextTick } from "vue";
import {
  injectBlueprintModel,
  type BlueprintItemModel,
  type RecipeIOModel,
} from "@/scripts/model/store";
import { Rect, type ReadonlyPointType } from "@/scripts/geometry";
import {
  BlueprintItemState,
  type BlueprintItemStateValues,
} from "@/scripts/types";
import {
  screenToClient,
  SelectedClassType,
  useLinkDragAndDrop,
  usePointAndClick,
  useSharedBlueprintSurface,
} from "@/composables/drag-helpers";
import { useEventHook } from "@/composables";
import { injectSettings } from "@/scripts/settings";

const emit = defineEmits<{
  (
    e: "output-dropped-empty",
    productName: string,
    screenPosition: ReadonlyPointType
  ): void;
}>();

type BetweenSelfIo = {
  upper?: RecipeIOModel;
  upperIndex?: number;
  lower?: RecipeIOModel;
  lowerIndex?: number;
};

const blueprintModel = injectBlueprintModel();
const settings = injectSettings();
let hoveringItem: BlueprintItemModel | undefined = undefined;
let hoveringBetweenIo: BetweenSelfIo | undefined = undefined;

const { hooks, isDragging, currentItem, movableElem } = useLinkDragAndDrop();
const { notifySelected } = usePointAndClick();
const { boundingRect } = useSharedBlueprintSurface();

const draggableClass = ref("");
const draggableStyle = computed(() => {
  const _isDragging = unref(isDragging);
  const _dragRect = unref(currentItem)?.dragging?.rect;
  //keep far offscreen, so drag-n-drop processor could get width and height
  if (!_isDragging || !_dragRect) {
    return {};
  }
  return {
    left: `${_dragRect.x}px`,
    top: `${_dragRect.y}px`,
  };
});

watch(
  isDragging,
  (value) => {
    if (!value) {
      draggableClass.value = "link-draggable-hidden";
    } else {
      //this is against flickering, so first position is set, and next icon is shown
      //otherwise it sometimes jump out of somewhere
      nextTick(() => {
        draggableClass.value = "";
      });
    }
  },
  { immediate: true }
);

function clearHoveringItem() {
  if (hoveringItem) {
    hoveringItem.updateLinkState();
    hoveringItem = undefined;
  }
}

function clearHoveringBetweenIo() {
  if (hoveringBetweenIo) {
    if (hoveringBetweenIo.lower) {
      hoveringBetweenIo.lower.setHighlightBorder(0);
    }
    if (hoveringBetweenIo.upper) {
      hoveringBetweenIo.upper.setHighlightBorder(0);
    }
    hoveringBetweenIo = undefined;
  }
}

type BlueprintItemWithElement = {
  item: BlueprintItemModel;
  element: HTMLElement;
};
function detectItemFromPoint(screenPoint: ReadonlyPointType) {
  const elements = document.elementsFromPoint(screenPoint.x, screenPoint.y);
  let item: Partial<BlueprintItemWithElement> = {};
  elements.find((element) => {
    const itemId = element.getAttribute("data-item-id");
    if (itemId) {
      const blueprintItem = blueprintModel.itemByKey(itemId);
      if (blueprintItem) {
        item = { item: blueprintItem, element: element as HTMLElement };
        return true;
      }
    }
    return false;
  });
  return item;
}

type SourceItemWithElement = {
  sourceItem: BlueprintItemModel;
  sourceElem: HTMLElement;
};
function getSelfLinkNeighbourIo(
  { sourceItem, sourceElem }: SourceItemWithElement,
  sourceIo: RecipeIOModel,
  screenPoint: ReadonlyPointType
) {
  const clientPoint = screenToClient(
    sourceElem,
    Rect.assign(screenPoint),
    settings.scale
  ).offsetBy(sourceItem.rect);
  //check if mouse point is between io rects
  const neighbourIo =
    (sourceIo.isInput
      ? sourceItem.selectedRecipe?.visibleInput()
      : sourceItem.selectedRecipe?.visibleOutput()) || [];

  const betweenIo: BetweenSelfIo = {};
  for (let i = 0; i < neighbourIo.length; i++) {
    const io1 = neighbourIo[i];
    const midPoint1 = io1.rect.middleRectPoint();
    //if midpoint is above client rect, then mouse is in between this io and previous io
    if (midPoint1.y > clientPoint.y) {
      betweenIo.lowerIndex = i;
      betweenIo.lower = io1;
      if (i > 0) {
        betweenIo.upperIndex = i - 1;
        betweenIo.upper = neighbourIo[betweenIo.upperIndex];
      }
      break;
    }
  }
  //if lower is found, then mouse is below last io
  if (!betweenIo.lower) {
    betweenIo.upperIndex = neighbourIo.length - 1;
    betweenIo.upper = neighbourIo[betweenIo.upperIndex];
  }
  return betweenIo;
}

function processSelfLinkInsertionPoint(betweenIo: BetweenSelfIo) {
  if (!betweenIo.upper && !betweenIo.lower) {
    //impossible, maybe exactly midpoint
    clearHoveringBetweenIo();
    return;
  }
  if (
    betweenIo.lowerIndex === hoveringBetweenIo?.lowerIndex &&
    betweenIo.upperIndex === hoveringBetweenIo?.upperIndex
  ) {
    return;
  }
  clearHoveringBetweenIo();
  //on lower io highlight upper border
  betweenIo.lower?.setHighlightBorder(1);
  betweenIo.upper?.setHighlightBorder(-1);
  hoveringBetweenIo = betweenIo;
}

function processOtherFactoryLink(
  sourceIo: RecipeIOModel,
  draggingIo: RecipeIOModel,
  targetItem: BlueprintItemModel
) {
  hoveringItem = targetItem;
  hoveringItem.updateLinkState(sourceIo);
  draggingIo.setFlipped(targetItem.isFlipped);
}

function processTargetItem(
  sourceItem: RecipeIOModel,
  draggingItem: RecipeIOModel,
  screenPoint: ReadonlyPointType
) {
  const { item, element } = detectItemFromPoint(screenPoint);
  if (!item || !element) {
    clearHoveringItem();
    clearHoveringBetweenIo();
    return;
  }
  if (toRaw(item) === toRaw(sourceItem?.ownerItem)) {
    clearHoveringItem();
    const betweenIo = getSelfLinkNeighbourIo(
      { sourceItem: item, sourceElem: element },
      sourceItem,
      screenPoint
    );
    processSelfLinkInsertionPoint(betweenIo);
    return;
  }
  if (toRaw(item) === toRaw(hoveringItem)) {
    return;
  }
  clearHoveringItem();
  clearHoveringBetweenIo();
  processOtherFactoryLink(sourceItem, draggingItem, item);
}

function processSwapIo(betweenIo: BetweenSelfIo, sourceIo: RecipeIOModel) {
  if (!betweenIo.upper && !betweenIo.lower) {
    return false;
  }
  if (
    toRaw(betweenIo.lower) === toRaw(sourceIo) ||
    toRaw(betweenIo.upper) === toRaw(sourceIo)
  ) {
    return false;
  }
  const selectedRecipe = sourceIo.ownerItem?.selectedRecipe;
  if (!selectedRecipe) {
    return false;
  }
  selectedRecipe.swapIo(sourceIo.key, [
    betweenIo.upperIndex,
    betweenIo.lowerIndex,
  ]);
  return true;
}

function processLink(
  sourceItem: RecipeIOModel,
  _hoveringItem: BlueprintItemModel,
  hoveringState: BlueprintItemStateValues
) {
  if (hoveringState === BlueprintItemState.CanLinkTarget) {
    _hoveringItem.createLink(sourceItem);
    return true;
  } else if (hoveringState === BlueprintItemState.CanLinkWithRecipeChange) {
    const recipe = _hoveringItem.possibleRecipeForIo(sourceItem);
    if (recipe) {
      _hoveringItem.selectRecipe(recipe);
      _hoveringItem.createLink(sourceItem);
    }
    return true;
  }
  return false;
}

useEventHook(hooks.notifyStart, (param) => {
  const item = param.item;
  const { link, target } = reactive(item.source.createTempLink());
  target.setFlipped(item.source.isFlipped);
  item.link = link;
  item.dragging = target;
});

useEventHook(hooks.notifyDrop, (param) => {
  const sourceItem = param.item.source;
  if (sourceItem && hoveringItem) {
    processLink(sourceItem, hoveringItem, hoveringItem.state);
  } else if (sourceItem && hoveringBetweenIo) {
    processSwapIo(hoveringBetweenIo, sourceItem);
  } else if (sourceItem && !sourceItem.isInput) {
    // Output dropped in empty space - emit event to show recipe suggestions
    const productName = sourceItem.name;
    if (productName) {
      emit("output-dropped-empty", productName, param.screenRect);
    }
  }
  clearHoveringItem();
  clearHoveringBetweenIo();
  blueprintModel.clearTempLink();
});

useEventHook(hooks.notifyCancel, () => blueprintModel.clearTempLink());

useEventHook(hooks.notifyMove, (param) => {
  const draggingItem = param.item.dragging;
  if (draggingItem) {
    draggingItem.setRect(param.clientRect.limit(unref(boundingRect)));
    processTargetItem(param.item.source, draggingItem, param.screenRect);
  }
});

useEventHook(notifySelected, (param) => {
  if (param.item.clazz != SelectedClassType.RecipeIOModel) {
    return;
  }
  const sourceItem = param.item.item as RecipeIOModel;
  const { item: _hoveringItem, element } = detectItemFromPoint(
    param.screenPosition
  );
  if (!_hoveringItem || !element) {
    return;
  }
  if (toRaw(_hoveringItem) === toRaw(sourceItem?.ownerItem)) {
    const betweenIo = getSelfLinkNeighbourIo(
      { sourceItem: _hoveringItem, sourceElem: element },
      sourceItem,
      param.screenPosition
    );
    if (processSwapIo(betweenIo, sourceItem)) {
      param.wasHandled();
    }
    return;
  }
  const linkState = _hoveringItem.calculateLinkState(sourceItem);
  if (processLink(sourceItem, _hoveringItem, linkState)) {
    param.wasHandled();
  }
});
</script>

<template>
  <v-sheet
    ref="movableElem"
    class="rounded dragging-elevation link-draggable hover-background"
    :class="draggableClass"
    :style="draggableStyle"
  >
    <icon-component :image="currentItem?.source?.image || ''" />
  </v-sheet>
</template>

<style scoped>
.link-draggable {
  position: absolute;
  z-index: 5000;
  touch-action: none;
}
</style>
