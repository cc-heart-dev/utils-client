'use strict';

var shard = require('./shard.cjs');

exports.requestType = void 0;
(function (requestType) {
    requestType["GET"] = "GET";
    requestType["POST"] = "POST";
    requestType["PUT"] = "PUT";
    requestType["DELETE"] = "DELETE";
    requestType["PATCH"] = "PATCH";
})(exports.requestType || (exports.requestType = {}));
// type ContentType =
//   | "application/x-www-form-urlencoded"
//   | "application/json"
//   | "multipart/form-data";
function isSpecifyResponseType(contentType, reg) {
    return reg.test(contentType);
}
function getFullPath(url, params) {
    let enCodeParams = shard.objectToParams(params);
    enCodeParams = enCodeParams.trim() !== '' ? `?${enCodeParams}` : '';
    const fullPath = url + enCodeParams;
    return fullPath;
}
function getBody(params) {
    let body = '';
    try {
        body = JSON.stringify(params);
    }
    catch (error) {
        console.error('params transform error:', error);
    }
    finally {
        return body;
    }
}
function getRequestBody(params) {
    let body;
    if (params instanceof FormData) {
        body = params;
    }
    else {
        body = getBody(params || {});
    }
    return body;
}
// TODO: Blob ArrayBuffer 的判断
// function isResponseText(contentType: string): boolean {
//   return isSpecifyResponseType(contentType, /text\/html/)
// }
// type requestBodyType = ArrayBuffer | Blob | FormData | string | Record<string, any>
function isResponseJson(contentType) {
    return isSpecifyResponseType(contentType, /application\/json/);
}
async function fetchRequest(url = '', data = { method: 'GET' }, interceptor = {}) {
    // request interceptor
    const { requestInterceptor, responseInterceptor, errorInterceptor } = interceptor;
    requestInterceptor &&
        requestInterceptor.reduce((value, fn) => {
            fn(value);
            return value;
        }, data);
    return fetch(url, data)
        .then((response) => {
        const ContentType = response.headers.get('content-type') || '';
        if (isResponseJson(ContentType)) {
            return response.json();
        }
        return response.text();
    })
        .then((res) => {
        // response interceptor
        return Promise.resolve(Array.isArray(responseInterceptor)
            ? responseInterceptor.reduce((res, fn) => {
                fn(res);
                return res;
            }, res)
            : res);
    })
        .catch((error) => {
        return Promise.reject(Array.isArray(errorInterceptor) &&
            errorInterceptor.reduce((error, fn) => {
                fn(error);
                return error;
            }, error));
    });
}
function request(url, method, requestInit, interceptor) {
    let headers = requestInit.headers;
    if (!headers) {
        headers = {};
    }
    if (!Reflect.get(headers, 'Content-type') &&
        !(requestInit.body instanceof FormData)) {
        Reflect.set(headers, 'Content-type', 'application/json');
    }
    return fetchRequest(url, Object.assign({}, requestInit, { headers, method }), interceptor);
}

exports.getFullPath = getFullPath;
exports.getRequestBody = getRequestBody;
exports.request = request;
