export function objectToParams(obj: Record<string, any> | undefined): string {
  if (typeof obj === 'object') {
    let params = ''
    let flag = true
    for (const key in obj) {
      params += (flag ? '' : '&') + `${key}=${encodeURI(obj[key])}`
      flag = false
    }
    return params
  }
  return ''
}

export function isHasHttpPrefix(path: string): boolean {
  return /^http/.test(path)
}
