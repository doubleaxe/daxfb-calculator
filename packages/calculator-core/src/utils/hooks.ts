import { onMounted, onUnmounted } from 'vue';

export function useInitRef<T>(init: () => T): T {
    return init();
}

export function useWindowClick(callback: (event: MouseEvent) => void) {
    onMounted(() => {
        window.addEventListener('click', callback);
    });
    onUnmounted(() => {
        window.removeEventListener('click', callback);
    });
}
