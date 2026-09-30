<script setup lang="ts">
import { Feedback, PointerActivationConstraints, PointerSensor } from '@dnd-kit/dom';
import { RestrictToWindow } from '@dnd-kit/dom/modifiers';
import { DragDropProvider } from '@dnd-kit/vue';

const modifiers = [RestrictToWindow];
const sensors = [
    PointerSensor.configure({
        activationConstraints: [
            new PointerActivationConstraints.Distance({ value: 8 }),
            new PointerActivationConstraints.Delay({ value: 400, tolerance: Infinity }),
        ],
    }),
];
</script>

<template>
    <DragDropProvider
        :modifiers="modifiers"
        :plugins="(defaults) => [...defaults, Feedback.configure({ dropAnimation: null })]"
        :sensors="sensors"
    >
        <slot />
    </DragDropProvider>
</template>
