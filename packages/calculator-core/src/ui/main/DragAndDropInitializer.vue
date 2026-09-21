<script setup lang="ts">
import { Feedback, PointerActivationConstraints, PointerSensor } from '@dnd-kit/dom';
import { RestrictToWindow } from '@dnd-kit/dom/modifiers';
import { DragDropProvider } from '@dnd-kit/vue';

const modifiers = [RestrictToWindow];
const plugins = (defaults: unknown[]) => [...defaults, Feedback.configure({ dropAnimation: null })];
const sensors = () => [
    PointerSensor.configure({
        activationConstraints: [
            new PointerActivationConstraints.Distance({ value: 8 }),
            new PointerActivationConstraints.Delay({ value: 400, tolerance: Infinity }),
        ],
    }),
];
</script>

<template>
    <DragDropProvider :modifiers="modifiers" :plugins="plugins" :sensors="sensors">
        <slot />
    </DragDropProvider>
</template>
