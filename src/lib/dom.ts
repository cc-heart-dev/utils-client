import { isBool, isObject } from '@cc-heart/utils'

/**
 * Adds one or more class names to the class list of the given element.
 *
 * @param el - The element to which the class names will be added.
 * @param classNames - The class names to be added.
 */
export function addClassName(el: Element, ...classNames: string[]): void {
  el.classList.add(...classNames)
}

/**
 * Removes one or more class names from the class list of the given element.
 *
 * @param el - The element from which the class name will be removed.
 * @param classNames - The class names to be removed.
 */
export function removeClassName(el: Element, ...classNames: string[]): void {
  el.classList.remove(...classNames)
}

/**
 * @description add element style attribute for example:
 * addStyles(document.body, { color: 'ff0' })
 * @param { Element } el
 * @param el
 * @param styles
 */
export function addStyles(el: HTMLElement, styles: Record<string, unknown>) {
  Object.assign(el.style, styles)
}

/**
 * @description remove element style attribute
 * @param { Element } el
 * @param { String | String[] } styles
 **/
export function removeStyles(el: HTMLElement, styles: string | string[]): void {
  if (typeof styles === 'string') {
    Reflect.set(el.style, styles, '')
  } else {
    styles.forEach((key) => {
      Reflect.set(el.style, key, '')
    })
  }
}

/**
 * @description get element style attribute value
 * @param { Element } el
 * @param { String | null } styles
 * @returns { String | null }
 */
export function getStyles(el: HTMLElement, styles: string): string | null {
  if (!el || !styles) return null
  if (styles === 'float') {
    styles = 'cssFloat'
  }
  return Reflect.get(el.style, styles)
}

/**
 * Generates a string of class names from the provided arguments.
 *
 * @param params - The arguments can be a mix of strings, numbers, booleans, arrays of strings, or objects.
 * Strings, numbers, and truthy booleans are added directly to the class names.
 * Arrays are flattened and their string elements are added to the class names.
 * Objects are treated as {className: condition} pairs; class names with truthy conditions are added.
 *
 * @returns A string of class names separated by spaces.
 */
export function classNames(
  ...params: (string | boolean | number | string[] | Record<string, any>)[]
) {
  return params
    .reduce<string[]>((acc, cur) => {
      if (Array.isArray(cur)) {
        return [...acc, ...cur.filter(Boolean)]
      }

      if (isObject(cur)) {
        return [
          ...acc,
          ...Object.entries(cur)
            .filter(([, value]) => value)
            .map(([key]) => key),
        ]
      }

      if (isBool(cur) && !cur) return acc

      return [...acc, cur]
    }, [])
    .join(' ')
}

/**
 * Retrieves the padding values of an HTML element.
 *
 * @param el - The HTML element for which to get the padding.
 * @returns An object containing the left, right, top, and bottom padding values of the element.
 */
export const getPadding = (el: HTMLElement) => {
  const parseInt = (target: string) => Number.parseInt(target) || 0

  const style = window.getComputedStyle(el, null)
  const left = parseInt(style.paddingLeft)
  const right = parseInt(style.paddingRight)
  const top = parseInt(style.paddingTop)
  const bottom = parseInt(style.paddingBottom)

  return { left, right, top, bottom }
}

/**
 * Checks if a given HTML element is hidden.
 *
 * @param el - The HTML element to be checked.
 * @returns Returns true if the element is hidden, otherwise false.
 */
export const isHidden = (el: HTMLElement) => {
  const range = document.createRange()
  range.setStart(el, 0)
  range.setEnd(el, el.childNodes.length)

  const { width: rangeWidth, height: rangeHeight } =
    range.getBoundingClientRect()
  const { width, height } = el.getBoundingClientRect()

  const { left, top, bottom, right } = getPadding(el)
  const verPadding = top + bottom
  const horPadding = left + right

  return (
    rangeHeight + verPadding > height ||
    rangeWidth + horPadding > width ||
    el.scrollWidth > el.clientWidth
  )
}