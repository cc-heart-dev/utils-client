import { Request, createFetchRequest } from "../dist/index.js";
const el = document.getElementById("file");

const baseUrl = "http://localhost:3000";
const prefix = "";
const request = new Request([baseUrl, prefix].join("/"));

export function Post(url, params, requestInit) {
  return request.Post(url, params, requestInit);
}
request.useResponseInterceptor((data) => {
  console.log(data, "one");
});

request.useResponseInterceptor((data) => {
  console.log(data, "two");
});

request.useErrorInterceptor((err) => {
  console.log(err.name);
});

// const { abort, data } = request.Post('add')
// data.catch(err => {
// })

const useFetch = createFetchRequest(request);

useFetch("add", { method: "Post" });
// abort.abort()
// el.addEventListener('change', (e) => {
//   const files = e.target.files[0]
//   const data = new FormData()
//   data.set('file', files)
//   // const headers = new Headers({})
//   debugger
//   Post('/upload/file', data)
// })
