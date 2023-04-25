import type {BlueprintModel} from '@/scripts/model/store';
import {unref, type Ref} from 'vue';
import {BlueprintDecoder, FileNameHandler} from '@/scripts/model/serializer';
import {ErrorCollector} from '@/scripts/error-collector';
import {useErrorHandler} from '@/composables';
import type {GameData} from '@/scripts/data';

export function loadBlueprint(
    gameData: GameData,
    blueprintModel: BlueprintModel,
    encodedBlueprint: string,
    fileName: Ref<string | undefined> | string | undefined,
) {
    const {showError} = useErrorHandler();
    const ERROR_TITLE = 'Error loading blueprint';

    let blueprintName: string | undefined;
    ({blueprintName, encodedBlueprint} = FileNameHandler.decodeBlueprintNameHeader(encodedBlueprint));
    const _fileName = unref(fileName);
    if(!blueprintName && _fileName) {
        blueprintName = FileNameHandler.fileNameToBlueprintName(_fileName);
    }

    const errorCollector = new ErrorCollector();
    const decoder = new BlueprintDecoder(gameData, errorCollector);
    const decoded = decoder.decode(encodedBlueprint);
    if(!decoded || errorCollector.haveErrors) {
        showError(ERROR_TITLE, errorCollector);
        return;
    }
    blueprintModel.load(decoded, errorCollector);
    if(blueprintName) {
        blueprintModel.blueprintName = blueprintName;
    }
    if(errorCollector.haveErrors) {
        showError('Blueprint possibly wasn\'t loaded correctly', errorCollector, true);
    }
}
