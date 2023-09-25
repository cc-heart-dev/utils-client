import { handleInvoke } from './shard'

function clipboard(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
    return
  }
  console.warn('clipboard is not exist of navigator')
}

export const copy = handleInvoke(clipboard)
