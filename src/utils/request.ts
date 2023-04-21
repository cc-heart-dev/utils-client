import { objectToParams } from "./shard.js";

enum requestType {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

type func = (...args: any[]) => any;

interface IInterceptor {
  requestInterceptor?: func;
  responseInterceptor?: func;
  errorInterceptor?: func;
}

export type params = Record<string, any> | FormData;
export type requestInit = Omit<RequestInit, "body">;
type ContentType =
  | "application/x-www-form-urlencoded"
  | "application/json"
  | "multipart/form-data";

function isSpecifyResponseType(contentType: string, reg: RegExp): boolean {
  return reg.test(contentType);
}

function getFullPath(params: Record<string, unknown>, url: string) {
  let enCodeParams = objectToParams(params);
  enCodeParams = enCodeParams.trim() !== "" ? `?${enCodeParams}` : "";
  const fullPath = url + enCodeParams;
  return fullPath;
}

function getBody(params: Record<string, unknown>) {
  let body = "";
  try {
    body = JSON.stringify(params);
  } catch (error) {
    console.error("params transform error:", error);
  } finally {
    return body;
  }
}

// TODO: Blob ArrayBuffer formData 的判断
// function isResponseText(contentType: string): boolean {
//   return isSpecifyResponseType(contentType, /text\/html/)
// }
// type requestBodyType = ArrayBuffer | Blob | FormData | string | Record<string, any>

function isResponseJson(contentType: string): boolean {
  return isSpecifyResponseType(contentType, /application\/json/);
}

async function request<T>(
  url = "",
  data: RequestInit = { method: "GET" },
  interceptor: IInterceptor = {}
): Promise<T> {
  // request interceptor
  const { requestInterceptor, responseInterceptor, errorInterceptor } =
    interceptor;
  requestInterceptor instanceof Function && requestInterceptor(data);
  return fetch(url, data)
    .then((response) => {
      const ContentType = response.headers.get("content-type") || "";
      if (isResponseJson(ContentType)) {
        return response.json();
      }
      return response.text();
    })
    .then((res) => {
      // response interceptor
      return Promise.resolve(
        responseInterceptor instanceof Function
          ? (responseInterceptor(res) as T)
          : res
      );
    })
    .catch((error) => {
      return Promise.reject(
        errorInterceptor instanceof Function ? errorInterceptor(error) : error
      );
    });
}

function requestMethod<T>(
  url: string,
  method: requestType,
  requestInit: RequestInit,
  interceptor?: IInterceptor,
  ContentType?: ContentType
): Promise<T> {
  let headers = requestInit.headers;
  if (!headers) {
    headers = {};
  }
  if (!headers["Content-type"] && !(requestInit.body instanceof FormData)) {
    headers["Content-type"] = ContentType || "application/json";
  }

  return request(
    url,
    Object.assign({}, requestInit, { headers, method }),
    interceptor
  );
}

export function _Get<Response, U extends params = params>(
  url: string,
  params?: U,
  requestInit: requestInit = {},
  interceptor?: IInterceptor
): Promise<Response> {
  let enCodeParams = objectToParams(params);
  enCodeParams = enCodeParams.trim() !== "" ? `?${enCodeParams}` : "";
  const fullPath = url + enCodeParams;
  return requestMethod(fullPath, requestType.GET, requestInit, interceptor);
}

export function _Post<Response, U extends params = params>(
  url: string,
  params?: U,
  requestInit: requestInit = {},
  interceptor?: IInterceptor
): Promise<Response> {
  let body: string | FormData
  if (params instanceof FormData) {
    body = params
  }
  else {
    body = getBody(params || {});
  }

  return requestMethod(
    url,
    requestType.POST,
    { ...requestInit, body },
    interceptor
  );
}

export function _Put<Response, U extends params = params>(
  url: string,
  params?: U,
  requestInit: requestInit = {},
  interceptor?: IInterceptor
): Promise<Response> {
  let body: string | FormData
  if (params instanceof FormData) {
    body = params
  }
  else {
    body = getBody(params || {});
  }
  return requestMethod(
    url,
    requestType.PUT,
    { ...requestInit, body },
    interceptor
  );
}

export function _Delete<Response, U extends params = params>(
  url: string,
  params?: U,
  requestInit: requestInit = {},
  interceptor?: IInterceptor
): Promise<Response> {
  const fullPath = getFullPath(params as Record<string, any> || {}, url);
  return requestMethod(fullPath, requestType.DELETE, requestInit, interceptor);
}