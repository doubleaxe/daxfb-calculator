<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {useErrorHandler, useLinkApi} from '@/composables';
import {injectGameData} from '@/scripts/data';
import {mdiClose, mdiContentCopy, mdiCheck} from '@mdi/js';
import {useClipboard, useLocalStorage, useVModel} from '@vueuse/core';
import {computed, onUnmounted, ref, unref, watch} from 'vue';

const props = defineProps<{
    modelValue: boolean;
    blueprintData: string;
}>();
const emit = defineEmits(['update:modelValue']);
const dialog = useVModel(props, 'modelValue', emit);
const {copy, copied, isSupported: isClipboardSupported} = useClipboard();
const {showError} = useErrorHandler();
const {exec, abortController} = useLinkApi();
const gameData = injectGameData();

const generatedLink = ref('');
const copyIcon = computed(() => {
    if(!unref(isClipboardSupported) || !unref(generatedLink)) {
        return '';
    }
    return unref(copied) ? mdiCheck : mdiContentCopy;
});
const isLoading = ref(false);

const linkSession = useLocalStorage('linkapi-session', {sessionId: ''});
async function generateLink() {
    type LoginResponse = {
        sessionId: string;
    };
    type GenerateLinkResponse = {
        link: string;
    };

    isLoading.value = true;
    try {
        let attempts = 0;
        for(;;) {
            let sessionId = unref(linkSession).sessionId;
            if(!sessionId) {
                ({sessionId} = await exec<LoginResponse>('login', {}));
                unref(linkSession).sessionId = sessionId;
            }

            try {
                const gameId = gameData.gameDescription.name;
                const {link} = await exec<GenerateLinkResponse>('save', {
                    sessionId,
                    gameId,
                    data: props.blueprintData,
                });
                const baseUrl = [location.protocol, '//', location.host, location.pathname].join('');
                generatedLink.value = `${baseUrl}?link=${encodeURIComponent(link)}&gameId=${encodeURIComponent(gameId)}`;
                break;
            } catch(err) {
                if(attempts >= 1) {
                    throw err;
                }
                if((err as Error)?.name === 'err:session') {
                    unref(linkSession).sessionId = '';
                    attempts++;
                } else {
                    throw err;
                }
            }
        }
    } catch(err) {
        if((err as Error)?.name !== 'AbortError') {
            showError('Failed to generate link', err);
        }
    } finally {
        isLoading.value = false;
    }
}

onUnmounted(() => {
    unref(abortController)?.abort();
});
watch(() => props.modelValue, (value, oldValue) => {
    if(!value) {
        unref(abortController)?.abort();
    } else if(value && !oldValue) {
        generatedLink.value = '';
    }
});
</script>

<template>
    <v-dialog v-model="dialog">
        <v-sheet>
            <v-toolbar>
                <v-toolbar-title>Generate Link For Blueprint</v-toolbar-title>
                <v-spacer />
                <v-btn
                    :icon="mdiClose"
                    @click="dialog = false"
                />
            </v-toolbar>
            <v-container style="position: relative;">
                <v-alert type="info">
                    Links are intended to be used for sharing blueprints with other people.
                    They were not designed as local file storage replacement.
                    In order to generate link, blueprint data will be uploaded to remote (my) server.
                    I will try to keep this server online as long as possible, but in the event of failure, all shared blueprints will be lost.
                </v-alert>
                <v-row dense class="mt-2">
                    <v-col>
                        <v-text-field
                            v-model="generatedLink"
                            label="Generated Link"
                            density="comfortable"
                            hide-details
                            readonly
                            :append-inner-icon="copyIcon"
                            @click:append-inner="copy(generatedLink)"
                        />
                    </v-col>
                </v-row>
                <v-row dense class="mt-2">
                    <v-btn
                        color="primary"
                        block
                        @click="generateLink()"
                    >
                        Generate Link
                    </v-btn>
                </v-row>
                <v-overlay
                    v-model="isLoading"
                    contained
                    class="d-flex align-center"
                >
                    <div class="d-flex justify-center">
                        <v-progress-circular indeterminate color="primary" />
                    </div>
                </v-overlay>
            </v-container>
        </v-sheet>
    </v-dialog>
</template>
