import type { func } from '../types/helper.js';
export declare enum requestType {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH"
}
export interface IInterceptor {
    requestInterceptor?: Array<func>;
    responseInterceptor?: Array<func>;
    errorInterceptor?: Array<func>;
}
export type params = Record<string, any> | FormData;
export type requestInit = Omit<RequestInit, 'body'>;
export declare function getFullPath(url: string, params: params): string;
export declare function getRequestBody(params: params): string | FormData;
export declare function request<T>(url: string, method: requestType, requestInit: RequestInit, interceptor?: IInterceptor): Promise<T>;
