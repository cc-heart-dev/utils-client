'use strict';

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
    if (typeof styles === 'string') {
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

exports.addClassName = addClassName;
exports.addStyles = addStyles;
exports.getStyles = getStyles;
exports.removeClassName = removeClassName;
exports.removeStyles = removeStyles;
