import { requestType, getFullPath, getRequestBody, request } from '../utils/request.js';
import { isHasHttpPrefix } from '../utils/shard.js';

class Request {
    baseUrl;
    requestInterceptor = [];
    responseInterceptor = [];
    errorInterceptor = [];
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
    }
    get interceptor() {
        return {
            requestInterceptor: this.requestInterceptor,
            responseInterceptor: this.responseInterceptor,
            errorInterceptor: this.errorInterceptor,
        };
    }
    mergeInterceptor(interceptor) {
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
    abortFactory() {
        const abort = new AbortController();
        return abort;
    }
    request(url, method, body, requestInit = {}, interceptor) {
        const abort = this.abortFactory();
        const { signal } = abort;
        requestInit = { ...requestInit, signal, method };
        let path = this.getRequestUrl(url);
        if ([requestType.GET, requestType.DELETE].includes(method)) {
            path = getFullPath(path, body || {});
        }
        else if ([requestType.POST, requestType.PUT].includes(method)) {
            requestInit = { ...requestInit, body: getRequestBody(body || {}) };
        }
        interceptor = !!interceptor
            ? this.mergeInterceptor(interceptor)
            : this.interceptor;
        return { data: request(path, method, requestInit, interceptor), abort };
    }
    Get(url, params, requestInit, interceptor) {
        return this.request(url, requestType.GET, params, requestInit, interceptor);
    }
    Post = (url, params, requestInit, interceptor) => {
        return this.request(url, requestType.POST, params, requestInit, interceptor);
    };
    Put = (url, params, requestInit, interceptor) => {
        return this.request(url, requestType.PUT, params, requestInit, interceptor);
    };
    Patch = (url, params, requestInit, interceptor) => {
        return this.request(url, requestType.PATCH, params, requestInit, interceptor);
    };
    Delete = (url, params, requestInit, interceptor) => {
        return this.request(url, requestType.DELETE, params, requestInit, interceptor);
    };
    useRequestInterceptor(callback) {
        if (!this.requestInterceptor.includes(callback))
            this.requestInterceptor.push(callback);
    }
    useResponseInterceptor(callback) {
        if (!this.responseInterceptor.includes(callback))
            this.responseInterceptor.push(callback);
    }
    useErrorInterceptor(callback) {
        if (!this.errorInterceptor.includes(callback))
            this.errorInterceptor.push(callback);
    }
    getRequestUrl(path) {
        if (!isHasHttpPrefix(path)) {
            return this.baseUrl + path;
        }
        return path;
    }
}
function createFetchRequest(instance) {
    instance = instance || new Request();
    return function useFetch(url, options) {
        options = options || {};
        const { method = 'GET', body = {}, ...initRequest } = options;
        let _method;
        switch (String.prototype.toLocaleUpperCase.call(method)) {
            case 'GET':
                _method = requestType.GET;
                break;
            case 'POST':
                _method = requestType.POST;
                break;
            case 'PUT':
                _method = requestType.PUT;
                break;
            default:
                _method = requestType.DELETE;
        }
        return instance?.request(url, _method, body, initRequest);
    };
}

export { Request, createFetchRequest };
