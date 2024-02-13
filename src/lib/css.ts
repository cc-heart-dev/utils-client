/**
 * Generate a function that creates BEM blocks with a given namespace.
 * @param prefix - the namespace for the BEM blocks
 */
export function generateCssNamespaceFn(prefix: string) {
  return function defineCssNamespace(namespace: string) {
    const cls = namespace ? `${prefix}-${namespace}` : prefix

    /**
     * Create a BEM block with an optional block suffix.
     * @param blockSuffix - the optional block suffix
     */
    const b = (blockSuffix?: string) => {
      return blockSuffix ? `${cls}-${blockSuffix}` : cls
    }

    /**
     * Create a BEM element with an optional element name.
     * @param element - the optional element name
     */
    const e = (element?: string) => {
      return element ? `${cls}__${element}` : cls
    }

    /**
     * Create a BEM modifier with an optional modifier name.
     * @param modifier - the optional modifier name
     */
    const m = (modifier?: string) => {
      return modifier ? `${cls}--${modifier}` : cls
    }

    /**
     * Create a BEM block-element combination with an optional block suffix and element name.
     * @param blockSuffix - the optional block suffix
     * @param element - the optional element name
     */
    const be = (blockSuffix?: string, element?: string) => {
      return (
        (blockSuffix && element && `${cls}-${blockSuffix}__${element}`) || ''
      )
    }

    /**
     * Create a BEM block-modifier combination with an optional block suffix and modifier name.
     * @param blockSuffix - the optional block suffix
     * @param modifier - the optional modifier name
     */
    const bm = (blockSuffix?: string, modifier?: string) => {
      return (
        (blockSuffix && modifier && `${cls}-${blockSuffix}--${modifier}`) || ''
      )
    }

    /**
     * Create a BEM element-modifier combination with an optional element name and modifier name.
     * @param element - the optional element name
     * @param modifier - the optional modifier name
     */
    const em = (element?: string, modifier?: string) => {
      return (element && modifier && `${cls}__${element}--${modifier}`) || ''
    }

    /**
     * Create a BEM block-element-modifier combination with an optional block suffix, element name, and modifier name.
     * @param blockSuffix - the optional block suffix
     * @param element - the optional element name
     * @param modifier - the optional modifier name
     */
    const bem = (blockSuffix?: string, element?: string, modifier?: string) => {
      return (
        (blockSuffix &&
          element &&
          modifier &&
          `${cls}-${blockSuffix}__${element}--${modifier}`) ||
        ''
      )
    }

    /**
     * Generate CSS styles from a map of CSS variable names and values.
     * @param target - a map of CSS variable names and values
     */
    const genCssVar = (target: Record<string, string>) => {
      const styles: Record<string, string> = {}
      Object.keys(target).forEach((key) => {
        if (target[key]) {
          styles[`--${cls}-${key}`] = target[key]
        }
      })
      return styles
    }

    /**
     * Get the value of a CSS variable.
     * @param key - the name of the CSS variable
     */
    const getCssVar = (key: string) => `--${cls}-${key}`

    return {
      cls,
      b,
      e,
      m,
      be,
      bm,
      em,
      bem,
      genCssVar,
      getCssVar,
    }
  }
}
