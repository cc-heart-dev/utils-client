export function isHasHttpPrefix(path: string): boolean {
  return /^http/.test(path)
}
