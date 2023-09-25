function objectToParams(obj) {
    if (typeof obj === 'object') {
        let params = '';
        let flag = true;
        for (const key in obj) {
            params += (flag ? '' : '&') + `${key}=${encodeURI(obj[key])}`;
            flag = false;
        }
        return params;
    }
    return '';
}
function isHasHttpPrefix(path) {
    return /^http/.test(path);
}

export { isHasHttpPrefix, objectToParams };
