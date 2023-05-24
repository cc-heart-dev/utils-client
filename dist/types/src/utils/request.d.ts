export declare enum requestType {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}
export type func = (...args: any[]) => any;
interface IInterceptor {
    requestInterceptor?: Array<func>;
    responseInterceptor?: Array<func>;
    errorInterceptor?: Array<func>;
}
export type params = Record<string, any> | FormData;
export type requestInit = Omit<RequestInit, "body">;
export declare function _Get<Response, U extends params = params>(url: string, params?: U, requestInit?: requestInit, interceptor?: IInterceptor): Promise<Response>;
export declare function _Post<Response, U extends params = params>(url: string, params?: U, requestInit?: requestInit, interceptor?: IInterceptor): Promise<Response>;
export declare function _Put<Response, U extends params = params>(url: string, params?: U, requestInit?: requestInit, interceptor?: IInterceptor): Promise<Response>;
export declare function _Delete<Response, U extends params = params>(url: string, params?: U, requestInit?: requestInit, interceptor?: IInterceptor): Promise<Response>;
export {};
