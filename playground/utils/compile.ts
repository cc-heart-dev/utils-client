export async function compile(scssStr: string) {
  const data = await import('sass')
  if (data.compileStringAsync) {
    return data.compileStringAsync(scssStr)
  }
}