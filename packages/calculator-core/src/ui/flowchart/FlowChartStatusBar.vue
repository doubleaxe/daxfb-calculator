<script setup lang="ts">
import { css } from '@daxfb/styles/css';
import { hstack } from '@daxfb/styles/patterns';

import { useStatusBarStore } from '#core/stores/StatusBarStore.js';

const statusBarStore = useStatusBarStore();
</script>

<template>
    <div
        :class="
            hstack({
                alignItems: 'stretch',
                width: 'full',
                height: '7',
                flexShrink: 0,
                fontSize: 'sm',
                lineHeight: 'tight',
                borderTop: '[1px solid {colors.content.border}]',
            })
        "
    >
        <div
            :class="
                hstack({
                    alignItems: 'center',
                    width: '[16rem]',
                    flexShrink: 0,
                    paddingInline: '2',
                    overflow: 'hidden',
                })
            "
        >
            <span
                :class="
                    css({
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: 'text.muted',
                    })
                "
            >
                {{ statusBarStore.hoveredItem }}
            </span>
        </div>
        <div
            :class="
                hstack({
                    alignItems: 'center',
                    width: '[16rem]',
                    flexShrink: 0,
                    paddingInline: '2',
                    overflow: 'hidden',
                })
            "
        >
            <span
                :class="
                    css({
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: 'selected.text',
                    })
                "
            >
                {{ statusBarStore.selectedItem }}
            </span>
        </div>
    </div>
</template>
