import { Request } from "../dist/index.js"
const el = document.getElementById('file')

const baseUrl = 'http://localhost:30002'
const prefix = 'v1'
const request = new Request([baseUrl, prefix].join('/'))

export function Post(url, params, requestInit) {
  return request.Post(url, params, requestInit)
}

el.addEventListener('change', (e) => {
  const files = e.target.files[0]
  const data = new FormData()
  data.set('file', files)
  // const headers = new Headers({})
  debugger
  Post('/upload/file', data)
})