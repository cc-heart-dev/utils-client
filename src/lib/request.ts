import {
  params,
  requestInit,
  _Delete,
  _Get,
  _Post,
  _Put,
} from "../utils/request.js";
import { isHasHttpPrefix } from "../utils/shard.js";

type func = (...args: any[]) => void;

type cb = typeof _Delete | typeof _Get | typeof _Post | typeof _Put;
const noop = () => { }
export class Request<Response> {
  private requestInterceptor: func = noop;
  private responseInterceptor: func = noop;
  private errorInterceptor: func = noop;

  get interceptor() {
    return {
      requestInterceptor: this.requestInterceptor,
      responseInterceptor: this.responseInterceptor,
      errorInterceptor: this.errorInterceptor,
    };
  }

  constructor(private readonly baseUrl: string) { }

  request<Res = Response, U extends params | FormData = params>(
    url: string,
    cb: cb,
    params?: U,
    requestInit?: requestInit
  ): Promise<Res> {
    const path = this.getRequestUrl(url);
    return cb<Res, U>(path, params, requestInit, this.interceptor);
  }

  Get<Res = Response, U extends params = params>(
    url: string,
    params?: U,
    requestInit?: requestInit
  ): Promise<Res> {
    return this.request(url, _Get, params, requestInit);
  }

  Post = <Res = Response, U extends params | FormData = params>(
    url: string,
    params?: U,
    requestInit?: requestInit
  ): Promise<Res> => {
    return this.request(url, _Post, params, requestInit);
  };

  Put = <Res = Response, U extends params = params>(
    url: string,
    params?: U,
    requestInit?: requestInit
  ): Promise<Res> => {
    return this.request(url, _Put, params, requestInit);
  };

  Delete = <Res = Response, U extends params = params>(
    url: string,
    params?: U,
    requestInit?: requestInit
  ): Promise<Res> => {
    return this.request(url, _Delete, params, requestInit);
  };

  useRequestInterceptor(callback: func) {
    this.requestInterceptor = callback;
  }

  useResponseInterceptor(callback: func) {
    this.responseInterceptor = callback;
  }

  useErrorInterceptor(callback: func) {
    this.errorInterceptor = callback;
  }

  getRequestUrl(path: string) {
    if (!isHasHttpPrefix(path)) {
      return this.baseUrl + path;
    }
    return path;
  }
}
