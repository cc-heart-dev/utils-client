import { handleInvoke } from './shard'

function _copyTextToClipboard(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
    return
  }
  console.warn('clipboard is not exist of navigator')
}

export const copyTextToClipboard = handleInvoke(_copyTextToClipboard)
