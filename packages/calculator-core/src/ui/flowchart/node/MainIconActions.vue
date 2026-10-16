<script setup lang="ts">
import { css, cx } from '@daxfb/styles/css';
import { PhCaretDoubleDown, PhCaretDoubleUp, PhMinus, PhPlus } from '@phosphor-icons/vue';

import type { FactoryNodeProps } from '#core/types/flowchart/node/types.js';

import FactoryMainButton from './FactoryMainButton.vue';
import SideButton from './SideButton.vue';

const { data } = defineProps<FactoryNodeProps>();

const cssVars = css({
    '--action-icon-size': '20px',
    '--central-border': '2px',
    '--central-padding': '2px',
});

const cssVarsUpgradable = css({
    '--total-size-y':
        'calc(var(--action-icon-size) * 2 + var(--central-border) * 2 + var(--central-padding) * 2 + var(--game-icon-size))',
    '--total-size-x': 'var(--total-size-y)',
    '--side-offset-y': 'calc(var(--action-icon-size) / 2)',
    '--side-height':
        'calc(var(--action-icon-size) + var(--central-border) + var(--central-padding) + var(--game-icon-size))',
});

const cssVarsNonUpgradable = css({
    '--total-size-y': 'calc(var(--central-border) * 2 + var(--central-padding) * 2 + var(--game-icon-size))',
    '--total-size-x': 'calc(var(--action-icon-size) * 2 + var(--total-size-y))',
    '--side-offset-y': '0px',
    '--side-height': 'var(--total-size-y)',
});
</script>

<template>
    <div
        :class="
            cx(
                cssVars,
                data.upgradable ? cssVarsUpgradable : cssVarsNonUpgradable,
                css({
                    position: 'relative',
                    width: 'var(--total-size-x)',
                    height: 'var(--total-size-y)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                })
            )
        "
    >
        <template v-if="data.upgradable">
            <SideButton
                :class="css({ top: '0', left: '0', width: 'var(--total-size-x)', height: 'var(--action-icon-size)' })"
            >
                <PhCaretDoubleUp />
            </SideButton>
            <SideButton
                :class="
                    cx(css({ bottom: '0', left: '0', width: 'var(--total-size-x)', height: 'var(--action-icon-size)' }))
                "
            >
                <PhCaretDoubleDown />
            </SideButton>
        </template>
        <SideButton
            :class="
                css({
                    left: '0',
                    top: 'var(--side-offset-y)',
                    width: 'var(--action-icon-size)',
                    height: 'var(--side-height)',
                })
            "
        >
            <PhMinus />
        </SideButton>
        <SideButton
            :class="
                css({
                    right: '0',
                    top: 'var(--side-offset-y)',
                    width: 'var(--action-icon-size)',
                    height: 'var(--side-height)',
                })
            "
        >
            <PhPlus />
        </SideButton>
        <FactoryMainButton :data="data" />
    </div>
</template>
