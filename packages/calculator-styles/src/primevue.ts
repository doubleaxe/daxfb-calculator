import MaterialPreset from '@primeuix/themes/material';
import type { Preset } from '@primeuix/themes/types';

// panda is primary source of truth, we build primevue theme based on it
// override everything, do not merge (definePreset is deepMerge)
// remove now unused base color palette
const Material = MaterialPreset.default ?? MaterialPreset;
const Panda: Preset = {
    components: Material.components,
    semantic: {},
};

export default Panda;
