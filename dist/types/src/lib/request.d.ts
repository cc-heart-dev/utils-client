import { params, requestInit, _Delete, _Get, _Post, _Put } from "../utils/request.js";
type func = (...args: any[]) => void;
type cb = typeof _Delete | typeof _Get | typeof _Post | typeof _Put;
export declare class Request<Response> {
    private readonly baseUrl;
    private requestInterceptor;
    private responseInterceptor;
    private errorInterceptor;
    get interceptor(): {
        requestInterceptor: func;
        responseInterceptor: func;
        errorInterceptor: func;
    };
    constructor(baseUrl: string);
    request<Res = Response, U extends params | FormData = params>(url: string, cb: cb, params?: U, requestInit?: requestInit): Promise<Res>;
    Get<Res = Response, U extends params = params>(url: string, params?: U, requestInit?: requestInit): Promise<Res>;
    Post: <Res = Response, U extends params = params>(url: string, params?: U, requestInit?: requestInit) => Promise<Res>;
    Put: <Res = Response, U extends params = params>(url: string, params?: U, requestInit?: requestInit) => Promise<Res>;
    Delete: <Res = Response, U extends params = params>(url: string, params?: U, requestInit?: requestInit) => Promise<Res>;
    useRequestInterceptor(callback: func): void;
    useResponseInterceptor(callback: func): void;
    useErrorInterceptor(callback: func): void;
    getRequestUrl(path: string): string;
}
export {};
