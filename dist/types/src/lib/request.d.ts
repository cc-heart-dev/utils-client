import { params, requestInit, requestType, type IInterceptor } from "../utils/request.js";
import type { func } from "../types/helper.js";
type requestRepose<U> = {
    data: Promise<U>;
    abort: AbortController;
};
export declare class Request<Response> {
    private readonly baseUrl;
    private requestInterceptor;
    private responseInterceptor;
    private errorInterceptor;
    constructor(baseUrl?: string);
    get interceptor(): {
        requestInterceptor: func[];
        responseInterceptor: func[];
        errorInterceptor: func[];
    };
    mergeInterceptor(interceptor: IInterceptor): {
        requestInterceptor: func[];
        responseInterceptor: func[];
        errorInterceptor: func[];
    };
    abortFactory(): AbortController;
    request<Res = Response, U extends params | FormData = params>(url: string, method: requestType, body?: U, requestInit?: requestInit & {
        body?: RequestInit["body"];
    }, interceptor?: IInterceptor): requestRepose<Res>;
    Get<Res = Response, U extends params = params>(url: string, params?: U, requestInit?: requestInit, interceptor?: IInterceptor): requestRepose<Res>;
    Post: <Res = Response, U extends params = params>(url: string, params?: U | undefined, requestInit?: requestInit | undefined, interceptor?: IInterceptor) => requestRepose<Res>;
    Put: <Res = Response, U extends params = params>(url: string, params?: U | undefined, requestInit?: requestInit | undefined, interceptor?: IInterceptor) => requestRepose<Res>;
    Patch: <Res = Response, U extends params = params>(url: string, params?: U | undefined, requestInit?: requestInit | undefined, interceptor?: IInterceptor) => requestRepose<Res>;
    Delete: <Res = Response, U extends params = params>(url: string, params?: U | undefined, requestInit?: requestInit | undefined, interceptor?: IInterceptor) => requestRepose<Res>;
    useRequestInterceptor(callback: func): void;
    useResponseInterceptor(callback: func): void;
    useErrorInterceptor(callback: func): void;
    getRequestUrl(path: string): string;
}
interface useFetchOptions {
    method?: requestType;
    body?: params;
}
export declare function createFetchRequest<T>(instance?: Request<T>): (url: string, options?: useFetchOptions) => requestRepose<T> | undefined;
export {};
