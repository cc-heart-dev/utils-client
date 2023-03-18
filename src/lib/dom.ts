/**
 * @description add element class attribute
 * @param { Element } el
 * @param { String } className
 */
export function addClassName(el: Element, className: string): void {
  el.classList.add(className);
}

/**
 * @description remove element class attribute
 * @param { Element } el
 * @param { String } className
 **/
export function removeClassName(el: Element, className: string): void {
  el.classList.remove(className);
}

/**
 * @description add element style attribute for example:
 * addStyles(document.body, { color: 'ff0' })
 * @param { Element } el
 * @param el
 * @param styles
 */
export function addStyles(el: HTMLElement, styles: Record<string, unknown>) {
  Object.assign(el.style, styles);
}

/**
 * @description remove element style attribute
 * @param { Element } el
 * @param { String | String[] } styles
 **/
export function removeStyles(el: HTMLElement, styles: string | string[]): void {
  if (typeof styles === "string") {
    el.style[styles] = "";
  } else {
    styles.forEach((key) => {
      el.style[key] = "";
    });
  }
}

/**
 * @description get element style attribute value
 * @param { Element } el
 * @param { String | null } styles
 * @returns { String | null }
 */
export function getStyles(el: HTMLElement, styles: string): string | null {
  if (!el || !styles) return null;
  if (styles === 'float') {
    styles = 'cssFloat'
  }
  return el.style[styles]
}
