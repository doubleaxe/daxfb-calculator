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
                    borderRadius: 0,
                    minHeight: 0,
                    minWidth: 0,
                    borderColor: 'primary',
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
