<!--
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {mdiCheck, mdiPlusBox, mdiMinusBox} from '@mdi/js';
import {useNumberInputHelper} from '@/composables';
import {unref, watch} from 'vue';

const props = defineProps<{
    modelValue: number;
    min?: number;
    defaultMin?: number;
    max?: number;
    defaultMax?: number;
    defaultValue?: number;
    spinIcons?: boolean;
}>();
const emit = defineEmits(['update:modelValue']);

const {
    updateNumber,
    tempNumber,
    addNumber,
    resetNumber,
} = useNumberInputHelper({
    ...props,
    apply(value) { emit('update:modelValue', value); },
});

watch(() => props.modelValue, (value) => {
    if(unref(tempNumber) != value)
        tempNumber.value = value;
});
</script>

<template>
    <v-text-field
        v-model="tempNumber"
        density="compact"
        hide-details
        clearable
        persistent-clear
        type="number"
        :max="props.max"
        :min="props.min"
        :append-icon="props.spinIcons ? mdiPlusBox : undefined"
        :prepend-icon="props.spinIcons ? mdiMinusBox : undefined"
        :append-inner-icon="mdiCheck"
        @blur="updateNumber"
        @click:append-inner="updateNumber"
        @click:clear="resetNumber"
        @click:append="addNumber(1)"
        @click:prepend="addNumber(-1)"
    />
</template>
