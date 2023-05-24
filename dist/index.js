/**
 * @description Append according to the initial time
 * @param { Date } date
 * @param { Number} dayTime
 * @returns Date
 */
function dateManipulation(date, dayTime, type, dateType = "date") {
    const time = new Date(date);
    let curTime;
    const isDateType = dateType === "date";
    const getter = isDateType ? "getDate" : "getMonth";
    const setter = isDateType ? "setDate" : "setMonth";
    switch (type) {
        case "increment":
            curTime = time[getter]() + dayTime;
            break;
        default:
            curTime = time[getter]() - dayTime;
    }
    time[setter](curTime);
    return time;
}
function dateAddTime(date, dayTime) {
    return dateManipulation(date, dayTime, "increment", "date");
}
function dateDivideTime(date, dayTime) {
    return dateManipulation(date, dayTime, "decrement", "date");
}
function dateAddMonth(date, month) {
    return dateManipulation(date, month, "increment", "month");
}
function dateDivideMonth(date, dayTime) {
    return dateManipulation(date, dayTime, "decrement", "month");
}

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
// TODO: Blob ArrayBuffer formData 的判断
// function isResponseText(contentType: string): boolean {
//   return isSpecifyResponseType(contentType, /text\/html/)
// }
// type requestBodyType = ArrayBuffer | Blob | FormData | string | Record<string, any>
function isResponseJson(contentType) {
    return isSpecifyResponseType(contentType, /application\/json/);
}
async function request(url = "", data = { method: "GET" }, interceptor = {}) {
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
function requestMethod(url, method, requestInit, interceptor, ContentType) {
    let headers = requestInit.headers;
    if (!headers) {
        headers = {};
    }
    if (Reflect.get(headers, "Content-type") &&
        !(requestInit.body instanceof FormData)) {
        Reflect.set(headers, "Content-type", ContentType || "application/json");
    }
    return request(url, Object.assign({}, requestInit, { headers, method }), interceptor);
}
function _Get(url, params, requestInit = {}, interceptor) {
    return requestMethod(getFullPath(url, params || {}), requestType.GET, requestInit, interceptor);
}
function _Post(url, params, requestInit = {}, interceptor) {
    const body = getRequestBody(params || {});
    return requestMethod(url, requestType.POST, { ...requestInit, body }, interceptor);
}
function _Put(url, params, requestInit = {}, interceptor) {
    const body = getRequestBody(params || {});
    return requestMethod(url, requestType.PUT, { ...requestInit, body }, interceptor);
}
function _Delete(url, params, requestInit = {}, interceptor) {
    const fullPath = getFullPath(url, params || {});
    return requestMethod(fullPath, requestType.DELETE, requestInit, interceptor);
}

class Request {
    baseUrl;
    requestInterceptor = [];
    responseInterceptor = [];
    errorInterceptor = [];
    get interceptor() {
        return {
            requestInterceptor: this.requestInterceptor,
            responseInterceptor: this.responseInterceptor,
            errorInterceptor: this.errorInterceptor,
        };
    }
    constructor(baseUrl = "") {
        this.baseUrl = baseUrl;
    }
    request(url, cb, params, requestInit) {
        const path = this.getRequestUrl(url);
        return cb(path, params, requestInit, this.interceptor);
    }
    abortFactory(url, callback, params, requestInit) {
        const abort = new AbortController();
        const { signal } = abort;
        requestInit = requestInit || {};
        const data = this.request(url, callback, params, {
            ...requestInit,
            signal,
        });
        return { data, abort };
    }
    Get(url, params, requestInit) {
        return this.abortFactory(url, _Get, params, requestInit);
    }
    Post = (url, params, requestInit) => {
        return this.abortFactory(url, _Post, params, requestInit);
    };
    Put = (url, params, requestInit) => {
        return this.abortFactory(url, _Put, params, requestInit);
    };
    Delete = (url, params, requestInit) => {
        return this.abortFactory(url, _Delete, params, requestInit);
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
        return instance.abortFactory(url, _method, body, {
            method,
            ...initRequest,
        });
    };
}

export { Request, addClassName, addStyles, copy, createFetchRequest, dateAddMonth, dateAddTime, dateDivideMonth, dateDivideTime, getStyles, removeClassName, removeStyles };
