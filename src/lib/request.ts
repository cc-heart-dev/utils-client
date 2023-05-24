import {
  params,
  requestInit,
  _Delete,
  _Get,
  _Post,
  _Put,
  type func,
  type requestType,
} from "../utils/request.js";
import { isHasHttpPrefix } from "../utils/shard.js";

type cb = typeof _Delete | typeof _Get | typeof _Post | typeof _Put;

type requestRepose<U> = { data: Promise<U>; abort: AbortController };
export class Request<Response> {
  private requestInterceptor: Array<func> = [];
  private responseInterceptor: Array<func> = [];
  private errorInterceptor: Array<func> = [];

  get interceptor() {
    return {
      requestInterceptor: this.requestInterceptor,
      responseInterceptor: this.responseInterceptor,
      errorInterceptor: this.errorInterceptor,
    };
  }

  constructor(private readonly baseUrl: string = "") {}

  request<Res = Response, U extends params | FormData = params>(
    url: string,
    cb: cb,
    params?: U,
    requestInit?: requestInit
  ): Promise<Res> {
    const path = this.getRequestUrl(url);
    return cb<Res, U>(path, params, requestInit, this.interceptor);
  }
  abortFactory<Res = Response, U extends params = params>(
    url: string,
    callback: cb,
    params?: U,
    requestInit?: requestInit
  ): requestRepose<Res> {
    const abort = new AbortController();
    const { signal } = abort;
    requestInit = requestInit || {};
    const data: Promise<Res> = this.request(url, callback, params, {
      ...requestInit,
      signal,
    });
    return { data, abort };
  }
  Get<Res = Response, U extends params = params>(
    url: string,
    params?: U,
    requestInit?: requestInit
  ): requestRepose<Res> {
    return this.abortFactory(url, _Get, params, requestInit);
  }

  Post = <Res = Response, U extends params | FormData = params>(
    url: string,
    params?: U,
    requestInit?: requestInit
  ): requestRepose<Res> => {
    return this.abortFactory(url, _Post, params, requestInit);
  };

  Put = <Res = Response, U extends params = params>(
    url: string,
    params?: U,
    requestInit?: requestInit
  ): requestRepose<Res> => {
    return this.abortFactory(url, _Put, params, requestInit);
  };

  Delete = <Res = Response, U extends params = params>(
    url: string,
    params?: U,
    requestInit?: requestInit
  ): requestRepose<Res> => {
    return this.abortFactory(url, _Delete, params, requestInit);
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
    let _method: cb;
    switch (String.prototype.toLocaleUpperCase.call(method)) {
      case "GET":
        _method = _Get;
        break;
      case "POST":
        _method = _Post;
        break;
      case "PUT":
        _method = _Put;
        break;
      default:
        _method = _Delete;
    }
    return instance!.abortFactory(url, _method, body, {
      method,
      ...initRequest,
    });
  };
}
