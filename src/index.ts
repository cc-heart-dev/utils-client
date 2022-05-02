interface process {
  template: string[]
}

const temp = (process as unknown as process).template

console.log(temp)
