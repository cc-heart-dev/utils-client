/**
 * @description add element class attribute
 * @param { Element } el
 * @param { String } className
 */
function addClassName(el, className) {
    el.classList.add(className);
}
/**
 * @description remove element class attribute
 * @param { Element } el
 * @param { String } className
 **/
function removeClassName(el, className) {
    el.classList.remove(className);
}
/**
 * @description add element style attribute for example:
 * addStyles(document.body, { color: 'ff0' })
 * @param { Element } el
 * @param el
 * @param styles
 */
function addStyles(el, styles) {
    Object.assign(el.style, styles);
}
/**
 * @description remove element style attribute
 * @param { Element } el
 * @param { String | String[] } styles
 **/
function removeStyles(el, styles) {
    if (typeof styles === "string") {
        Reflect.set(el.style, styles, '');
    }
    else {
        styles.forEach((key) => {
            Reflect.set(el.style, key, '');
        });
    }
}
/**
 * @description get element style attribute value
 * @param { Element } el
 * @param { String | null } styles
 * @returns { String | null }
 */
function getStyles(el, styles) {
    if (!el || !styles)
        return null;
    if (styles === 'float') {
        styles = 'cssFloat';
    }
    return Reflect.get(el.style, styles);
}

function copy(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        return;
    }
    console.warn("clipboard is not exist of navigator");
}

function objectToParams(obj) {
    if (typeof obj === "object") {
        let params = "";
        let flag = true;
        for (const key in obj) {
            params += (flag ? "" : "&") + `${key}=${encodeURI(obj[key])}`;
            flag = false;
        }
        return params;
    }
    return "";
}
function isHasHttpPrefix(path) {
    return /^http/.test(path);
}

var requestType;
(function (requestType) {
    requestType["GET"] = "GET";
    requestType["POST"] = "POST";
    requestType["PUT"] = "PUT";
    requestType["DELETE"] = "DELETE";
})(requestType || (requestType = {}));
// type ContentType =
//   | "application/x-www-form-urlencoded"
//   | "application/json"
//   | "multipart/form-data";
function isSpecifyResponseType(contentType, reg) {
    return reg.test(contentType);
}
function getFullPath(url, params) {
    let enCodeParams = objectToParams(params);
    enCodeParams = enCodeParams.trim() !== "" ? `?${enCodeParams}` : "";
    const fullPath = url + enCodeParams;
    return fullPath;
}
function getBody(params) {
    let body = "";
    try {
        body = JSON.stringify(params);
    }
    catch (error) {
        console.error("params transform error:", error);
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
async function fetchRequest(url = "", data = { method: "GET" }, interceptor = {}) {
    // request interceptor
    const { requestInterceptor, responseInterceptor, errorInterceptor } = interceptor;
    requestInterceptor &&
        requestInterceptor.reduce((value, fn) => {
            fn(value);
            return value;
        }, data);
    return fetch(url, data)
        .then((response) => {
        const ContentType = response.headers.get("content-type") || "";
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
    if (!Reflect.get(headers, "Content-type") &&
        !(requestInit.body instanceof FormData)) {
        Reflect.set(headers, "Content-type", "application/json");
    }
    return fetchRequest(url, Object.assign({}, requestInit, { headers, method }), interceptor);
}

class Request {
    baseUrl;
    requestInterceptor = [];
    responseInterceptor = [];
    errorInterceptor = [];
    constructor(baseUrl = "") {
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
            requestInterceptor: [...this.requestInterceptor, ...(interceptor.requestInterceptor || [])],
            responseInterceptor: [...this.responseInterceptor, ...(interceptor.responseInterceptor || [])],
            errorInterceptor: [...this.errorInterceptor, ...(interceptor.errorInterceptor || [])],
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
        interceptor = !!interceptor ? this.mergeInterceptor(interceptor) : this.interceptor;
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
        const { method = "GET", body = {}, ...initRequest } = options;
        let _method;
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

export { Request, addClassName, addStyles, copy, createFetchRequest, getStyles, removeClassName, removeStyles };
