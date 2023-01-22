import type {Item} from '../data/data';
import type {BlueprintItemModel, RecipeIOModel} from '../model/store';
import type {InterfaceOf} from '../types';

export type SelectedObject = BlueprintItemModel | RecipeIOModel | Item | undefined;

export class PoinAndClickImpl {
    private _pointAndClickEnabled = true;
    private _selectedObject: SelectedObject = undefined;

    get pointAndClickEnabled() { return this._pointAndClickEnabled; }
    set pointAndClickEnabled(pointAndClickEnabled: boolean) {
        this._pointAndClickEnabled = pointAndClickEnabled;
        if(!pointAndClickEnabled)
            this._selectedObject = undefined;
    }
    get selectedObject() { return this._selectedObject; }

    selectObject(selectedObject: SelectedObject) {
        if(this._pointAndClickEnabled)
            this._selectedObject = selectedObject;
    }

}
export type PoinAndClick = InterfaceOf<PoinAndClickImpl>;
