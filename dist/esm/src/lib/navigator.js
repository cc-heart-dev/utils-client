import { handleInvoke } from './shard.js';

function clipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        return;
    }
    console.warn('clipboard is not exist of navigator');
}
const copy = handleInvoke(clipboard);

export { copy };
