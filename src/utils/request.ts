import { objectToParams } from './shard.js'
import type { func } from '../types/helper.js'
export enum requestType {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export interface IInterceptor {
  requestInterceptor?: Array<func>
  responseInterceptor?: Array<func>
  errorInterceptor?: Array<func>
}

export type params = Record<string, any> | FormData
export type requestInit = Omit<RequestInit, 'body'>

// type ContentType =
//   | "application/x-www-form-urlencoded"
//   | "application/json"
//   | "multipart/form-data";

function isSpecifyResponseType(contentType: string, reg: RegExp): boolean {
  return reg.test(contentType)
}

export function getFullPath(url: string, params: params) {
  let enCodeParams = objectToParams(params)
  enCodeParams = enCodeParams.trim() !== '' ? `?${enCodeParams}` : ''
  const fullPath = url + enCodeParams
  return fullPath
}

function getBody(params: Record<string, unknown>) {
  let body = ''
  try {
    body = JSON.stringify(params)
  } catch (error) {
    console.error('params transform error:', error)
  } finally {
    return body
  }
}

export function getRequestBody(params: params) {
  let body: string | FormData
  if (params instanceof FormData) {
    body = params
  } else {
    body = getBody(params || {})
  }
  return body
}

// TODO: Blob ArrayBuffer 的判断
// function isResponseText(contentType: string): boolean {
//   return isSpecifyResponseType(contentType, /text\/html/)
// }
// type requestBodyType = ArrayBuffer | Blob | FormData | string | Record<string, any>

function isResponseJson(contentType: string): boolean {
  return isSpecifyResponseType(contentType, /application\/json/)
}

export async function fetchRequest<T>(
  url = '',
  data: RequestInit = { method: 'GET' },
  interceptor: IInterceptor = {},
): Promise<T> {
  // request interceptor
  const { requestInterceptor, responseInterceptor, errorInterceptor } =
    interceptor
  requestInterceptor &&
    requestInterceptor.reduce((value, fn) => {
      fn(value)
      return value
    }, data)
  return fetch(url, data)
    .then((response) => {
      const ContentType = response.headers.get('content-type') || ''
      if (isResponseJson(ContentType)) {
        return response.json()
      }
      return response.text()
    })
    .then((res) => {
      // response interceptor
      if (!Array.isArray(responseInterceptor)) return res
      return Promise.resolve(
        responseInterceptor.reduce(async (res, fn) => {
          return await fn(res, { url, data, interceptor })
        }, res as Promise<T>)
      )
    })
    .catch((error) => {
      return Promise.reject(
        Array.isArray(errorInterceptor) &&
        errorInterceptor.reduce((error, fn) => {
          fn(error)
          return error
        }, error),
      )
    })
}

export function request<T>(
  url: string,
  method: requestType,
  requestInit: RequestInit,
  interceptor?: IInterceptor,
): Promise<T> {
  let headers = requestInit.headers
  if (!headers) {
    headers = {}
  }
  if (
    !Reflect.get(headers, 'Content-type') &&
    !(requestInit.body instanceof FormData)
  ) {
    Reflect.set(headers, 'Content-type', 'application/json')
  }

  return fetchRequest(
    url,
    Object.assign({}, requestInit, { headers, method }),
    interceptor,
  )
}
