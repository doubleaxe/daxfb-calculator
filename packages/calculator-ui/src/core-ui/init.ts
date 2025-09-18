import { configure } from 'mobx';

export function initApplication() {
    configure({
        computedRequiresReaction: true,
        reactionRequiresObservable: false,
        observableRequiresReaction: true,
        disableErrorBoundaries: true,
    });
}
