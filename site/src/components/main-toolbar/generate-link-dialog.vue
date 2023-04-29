<!--
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
-->
<script setup lang="ts">
import {useErrorHandler, useLinkApi} from '@/composables';
import {injectGameData} from '@/scripts/data';
import {BlueprintEncoder, FileNameHandler} from '@/scripts/model/serializer';
import {injectBlueprintModel} from '@/scripts/model/store';
import {mdiClose, mdiContentCopy, mdiCheck} from '@mdi/js';
import {useClipboard, useLocalStorage, useVModel} from '@vueuse/core';
import {computed, onUnmounted, ref, unref, watch} from 'vue';
import {__DEBUG__} from '@/scripts/debug';
import {injectSettings} from '@/scripts/settings';

const props = defineProps<{
    modelValue: boolean;
}>();
const emit = defineEmits(['update:modelValue']);
const dialog = useVModel(props, 'modelValue', emit);
const {copy, copied, isSupported: isClipboardSupported} = useClipboard();
const {showError} = useErrorHandler();
const {exec, abortController} = useLinkApi();
const gameData = injectGameData();
const settings = injectSettings();
const blueprintModel = injectBlueprintModel();

const generatedLink = ref('');
const copyIcon = computed(() => {
    if(!unref(isClipboardSupported) || !unref(generatedLink)) {
        return '';
    }
    return unref(copied) ? mdiCheck : mdiContentCopy;
});
const isLoading = ref(false);
const blueprintName = ref('');
let linkId = '';

function buildBlueprintData() {
    const encoder = new BlueprintEncoder(gameData, {
        blueprintCompress: true,
    });
    const encoded = encoder.encode(blueprintModel.save());
    return encoded;
}

function regenerateLinkText() {
    if(!linkId)
        return;

    //you don't want to share your file:/// address, do you?
    const baseUrl = __DEBUG__ ?
        [location.protocol, '//', location.host, location.pathname].join('') :
        'https://doubleaxe.github.io/daxfb-calculator/';

    let _generatedLink = `${baseUrl}?link=${encodeURIComponent(linkId)}`;
    if(settings.appendFileNameToLink) {
        let fileName = FileNameHandler.blueprintNameToFileName(unref(blueprintName));
        const match = /^(.*)\.txt$/i.exec(fileName);
        if(match) {
            fileName = match[1];
        }
        _generatedLink += `&name=${encodeURIComponent(fileName)}`;
    }
    generatedLink.value = _generatedLink;
}

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
                const _blueprintName = unref(blueprintName);
                const blueprintData = buildBlueprintData();
                const {link} = await exec<GenerateLinkResponse>('save', {
                    sessionId,
                    gameId,
                    name: _blueprintName,
                    data: blueprintData,
                });

                linkId = link;
                regenerateLinkText();
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
        linkId = '';
        generatedLink.value = '';
        blueprintName.value = blueprintModel.blueprintName;
    }
});
watch(blueprintName, (value) => {
    if(!value) {
        blueprintName.value = blueprintModel.getDefaultBlueprintName();
    }
    blueprintModel.blueprintName = unref(blueprintName);
    regenerateLinkText();
});
watch(() => settings.appendFileNameToLink, regenerateLinkText);
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
                    I will keep this server online as long as possible, but in the event of failure, all shared blueprints may be lost.
                </v-alert>
                <v-row dense class="mt-2">
                    <v-col>
                        <v-text-field
                            v-model="blueprintName"
                            label="Edit Blueprint Description"
                            density="comfortable"
                            hide-details
                            clearable
                            @click:clear="blueprintName = blueprintModel.getDefaultBlueprintName()"
                        />
                    </v-col>
                    <v-col cols="4">
                        <v-checkbox
                            v-model="settings.appendFileNameToLink"
                            label="Embed file name (as a hint) inside generated link"
                            density="compact"
                            hide-details
                        />
                    </v-col>
                </v-row>
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
