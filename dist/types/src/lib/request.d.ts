import { params, requestInit, _Delete, _Get, _Post, _Put, type func, type requestType } from "../utils/request.js";
type cb = typeof _Delete | typeof _Get | typeof _Post | typeof _Put;
type requestRepose<U> = {
    data: Promise<U>;
    abort: AbortController;
};
export declare class Request<Response> {
    private readonly baseUrl;
    private requestInterceptor;
    private responseInterceptor;
    private errorInterceptor;
    get interceptor(): {
        requestInterceptor: func[];
        responseInterceptor: func[];
        errorInterceptor: func[];
    };
    constructor(baseUrl?: string);
    request<Res = Response, U extends params | FormData = params>(url: string, cb: cb, params?: U, requestInit?: requestInit): Promise<Res>;
    abortFactory<Res = Response, U extends params = params>(url: string, callback: cb, params?: U, requestInit?: requestInit): requestRepose<Res>;
    Get<Res = Response, U extends params = params>(url: string, params?: U, requestInit?: requestInit): requestRepose<Res>;
    Post: <Res = Response, U extends params = params>(url: string, params?: U | undefined, requestInit?: requestInit | undefined) => requestRepose<Res>;
    Put: <Res = Response, U extends params = params>(url: string, params?: U | undefined, requestInit?: requestInit | undefined) => requestRepose<Res>;
    Delete: <Res = Response, U extends params = params>(url: string, params?: U | undefined, requestInit?: requestInit | undefined) => requestRepose<Res>;
    useRequestInterceptor(callback: func): void;
    useResponseInterceptor(callback: func): void;
    useErrorInterceptor(callback: func): void;
    getRequestUrl(path: string): string;
}
interface useFetchOptions {
    method?: requestType;
    body?: params;
}
export declare function createFetchRequest<T>(instance?: Request<T>): (url: string, options?: useFetchOptions) => requestRepose<T>;
export {};
