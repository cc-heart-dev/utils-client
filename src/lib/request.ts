import {
  params,
  requestInit,
  request,
  requestType,
  getFullPath,
  getRequestBody,
  type IInterceptor,
} from "../utils/request.js";
import type { func } from "../types/helper.js";
import { isHasHttpPrefix } from "../utils/shard.js";

type requestRepose<U> = { data: Promise<U>; abort: AbortController };
export class Request<Response> {
  private requestInterceptor: Array<func> = [];
  private responseInterceptor: Array<func> = [];
  private errorInterceptor: Array<func> = [];

  constructor(private readonly baseUrl: string = "") {}

  get interceptor() {
    return {
      requestInterceptor: this.requestInterceptor,
      responseInterceptor: this.responseInterceptor,
      errorInterceptor: this.errorInterceptor,
    };
  }

  mergeInterceptor(interceptor: IInterceptor) {
    return {
      requestInterceptor: [
        ...this.requestInterceptor,
        ...(interceptor.requestInterceptor || []),
      ],
      responseInterceptor: [
        ...this.responseInterceptor,
        ...(interceptor.responseInterceptor || []),
      ],
      errorInterceptor: [
        ...this.errorInterceptor,
        ...(interceptor.errorInterceptor || []),
      ],
    };
  }

  abortFactory(): AbortController {
    const abort = new AbortController();
    return abort;
  }

  request<Res = Response, U extends params | FormData = params>(
    url: string,
    method: requestType,
    body?: U,
    requestInit: requestInit & { body?: RequestInit["body"] } = {},
    interceptor?: IInterceptor
  ): requestRepose<Res> {
    const abort = this.abortFactory();
    const { signal } = abort;
    requestInit = { ...requestInit, signal, method };
    let path = this.getRequestUrl(url);
    if ([requestType.GET, requestType.DELETE].includes(method)) {
      path = getFullPath(path, body || {});
    } else if ([requestType.POST, requestType.PUT].includes(method)) {
      requestInit = { ...requestInit, body: getRequestBody(body || {}) };
    }
    interceptor = !!interceptor
      ? this.mergeInterceptor(interceptor)
      : this.interceptor;
    return { data: request(path, method, requestInit, interceptor), abort };
  }

  Get<Res = Response, U extends params = params>(
    url: string,
    params?: U,
    requestInit?: requestInit,
    interceptor?: IInterceptor
  ): requestRepose<Res> {
    return this.request(url, requestType.GET, params, requestInit, interceptor);
  }

  Post = <Res = Response, U extends params | FormData = params>(
    url: string,
    params?: U,
    requestInit?: requestInit,
    interceptor?: IInterceptor
  ): requestRepose<Res> => {
    return this.request(
      url,
      requestType.POST,
      params,
      requestInit,
      interceptor
    );
  };

  Put = <Res = Response, U extends params = params>(
    url: string,
    params?: U,
    requestInit?: requestInit,
    interceptor?: IInterceptor
  ): requestRepose<Res> => {
    return this.request(url, requestType.PUT, params, requestInit, interceptor);
  };

  Patch = <Res = Response, U extends params = params>(
    url: string,
    params?: U,
    requestInit?: requestInit,
    interceptor?: IInterceptor
  ): requestRepose<Res> => {
    return this.request(
      url,
      requestType.PATCH,
      params,
      requestInit,
      interceptor
    );
  };

  Delete = <Res = Response, U extends params = params>(
    url: string,
    params?: U,
    requestInit?: requestInit,
    interceptor?: IInterceptor
  ): requestRepose<Res> => {
    return this.request(
      url,
      requestType.DELETE,
      params,
      requestInit,
      interceptor
    );
  };

  useRequestInterceptor(callback: func) {
    if (!this.requestInterceptor.includes(callback))
      this.requestInterceptor.push(callback);
  }

  useResponseInterceptor(callback: func) {
    if (!this.responseInterceptor.includes(callback))
      this.responseInterceptor.push(callback);
  }

  useErrorInterceptor(callback: func) {
    if (!this.errorInterceptor.includes(callback))
      this.errorInterceptor.push(callback);
  }

  getRequestUrl(path: string) {
    if (!isHasHttpPrefix(path)) {
      return this.baseUrl + path;
    }
    return path;
  }
}

interface useFetchOptions {
  method?: requestType;
  body?: params;
}
export function createFetchRequest<T>(instance?: Request<T>) {
  instance = instance || new Request();
  return function useFetch(url: string, options?: useFetchOptions) {
    options = options || {};
    const { method = "GET", body = {}, ...initRequest } = options;
    let _method: requestType;
    switch (String.prototype.toLocaleUpperCase.call(method)) {
      case "GET":
        _method = requestType.GET;
        break;
      case "POST":
        _method = requestType.POST;
        break;
      case "PUT":
        _method = requestType.PUT;
        break;
      default:
        _method = requestType.DELETE;
    }
    return instance?.request(url, _method, body, initRequest);
  };
}
