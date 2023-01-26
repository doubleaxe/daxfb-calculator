import type {Item} from '@/scripts/data/data';
import {createSharedComposable} from '@vueuse/core';
import {useDragAndDrop} from './drag-n-drop';

export const useLeftPanelDragAndDrop = createSharedComposable(() => useDragAndDrop<Item>({useDelay: true}));
