// browser
declare module globalThis {
  interface FormData {
    entries(): Array<[string, any]>
    append(key: string, value: any): void
  }
}
