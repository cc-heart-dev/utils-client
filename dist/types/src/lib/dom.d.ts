/**
 * @description add element class attribute
 * @param { Element } el
 * @param { String } className
 */
export declare function addClassName(el: Element, className: string): void;
/**
 * @description remove element class attribute
 * @param { Element } el
 * @param { String } className
 **/
export declare function removeClassName(el: Element, className: string): void;
/**
 * @description add element style attribute for example:
 * addStyles(document.body, { color: 'ff0' })
 * @param { Element } el
 * @param el
 * @param styles
 */
export declare function addStyles(el: HTMLElement, styles: Record<string, unknown>): void;
/**
 * @description remove element style attribute
 * @param { Element } el
 * @param { String | String[] } styles
 **/
export declare function removeStyles(el: HTMLElement, styles: string | string[]): void;
/**
 * @description get element style attribute value
 * @param { Element } el
 * @param { String | null } styles
 * @returns { String | null }
 */
export declare function getStyles(el: HTMLElement, styles: string): string | null;
