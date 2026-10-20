<script setup lang="ts">
import { css, cx } from '@daxfb/styles/css';
import Button from 'primevue/button';
</script>

<template>
    <Button
        :class="
            cx(
                css({
                    position: 'absolute',
                    borderRadius: '[0]',
                    minHeight: '0',
                    minWidth: '0',
                    padding: '0',
                    _light: {
                        backgroundColor: 'surface.50',
                        borderColor: 'sky.600',
                    },
                    _dark: {
                        backgroundColor: 'surface.800',
                        borderColor: 'sky.700',
                    },
                    _hover: {
                        _light: {
                            backgroundColor: 'surface.200',
                        },
                        _dark: {
                            backgroundColor: 'surface.700',
                        },
                    },
                })
            )
        "
        severity="secondary"
        size="small"
        variant="outlined"
    >
        <slot />
    </Button>
</template>
