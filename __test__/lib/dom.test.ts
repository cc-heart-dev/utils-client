import { getByText } from '@testing-library/dom'

import {
  removeStyles,
  addStyles,
  addClassName,
  removeClassName,
  getStyles,
  classNames,
  getPadding,
  isHidden,
} from '../../src/lib/dom'

function getButtonDOM() {
  const container = document.createElement('div')
  container.innerHTML = `
    <button style="color:red;border-radius:50%">example</button>
  `
  return container
}

function getClassDOM() {
  const container = document.createElement('div')
  container.innerHTML = `
    <div class="fr">example</div>
  `
  return container
}

function getFloatElement() {
  const el = document.createElement('div')
  el.innerHTML = `
    <div style="float:left">float example</div>
  `
  return el
}

describe('testing className methods', () => {
  it('add clearfix class attribute when invoke addClassName', () => {
    const container = getClassDOM()
    const el = getByText(container, 'example')
    addClassName(el, 'clearfix')
    expect(el).toHaveClass('clearfix')
  })

  it('remove fr class attribute when invoke removeClassName', () => {
    const container = getClassDOM()
    const el = getByText(container, 'example')
    removeClassName(el, 'fr')
    expect(el.classList.length).toBe(0)
  })
})

describe('testing styles methods', () => {
  it('delete style attribute when invoke removeStyles', () => {
    const div = getButtonDOM()
    const el = getByText(div, 'example')
    removeStyles(el, 'color')
    removeStyles(el, 'borderRadius')
    expect(el.style.color).toBe('')
    expect(el.style.borderRadius).toBe('')
  })

  it('delete style attribute array when invoke removeStyles', () => {
    const container = getButtonDOM()
    const el = getByText(container, 'example')
    removeStyles(el, ['borderRadius', 'color'])
    expect(el.style.borderRadius).toBe('')
    expect(el.style.color).toBe('')
  })

  it('add style attribute when invoke addStyles', () => {
    const container = getButtonDOM()
    const el = getByText(container, 'example')
    addStyles(el, { color: 'blue', borderRadius: '5%' })
    expect(el.style.color).toBe('blue')
    expect(el.style.borderRadius).toBe('5%')
  })
})

describe('get element style attribute value', () => {
  it('get float element attribute value', () => {
    const container = getFloatElement()
    const el = getByText(container, 'float example')
    const attributeValue = getStyles(el, 'float')
    expect(attributeValue).toBe('left')
  })

  it('should return a null when get invalid element or style', () => {
    // @ts-ignore
    expect(getStyles(null, 'float')).toBeNull();

    expect(getStyles(document.createElement('div'), '')).toBeNull()
  })
})

describe('classNames', () => {
  it('should return an empty string for no arguments', () => {
    expect(classNames()).toBe('')
  })

  it('should return a single class for a single string argument', () => {
    expect(classNames('foo')).toBe('foo')
    expect(classNames(true)).toBe('true')
    expect(classNames(123)).toBe('123')
  })

  it('should return multiple classes for multiple string arguments', () => {
    expect(classNames('foo', 'bar')).toBe('foo bar')
    expect(classNames(true, false)).toBe('true')
    expect(classNames(123, 456)).toBe('123 456')
    expect(classNames(['foo', 'bar'])).toBe('foo bar')
    expect(classNames(['foo', 'bar'], ['baz', 'qux'])).toBe('foo bar baz qux')
    expect(classNames({ foo: true, bar: false })).toBe('foo')
    expect(
      classNames({ foo: true, bar: false }, { baz: true, qux: false }),
    ).toBe('foo baz')
    expect(classNames('foo', true, 123, ['bar', 'baz'], { qux: false })).toBe(
      'foo true 123 bar baz',
    )
  })
})

describe('getPadding function', () => {
  it('should return correct padding values for an element', () => {
    const mockElement = document.createElement('div');
    mockElement.style.paddingLeft = '10px';
    mockElement.style.paddingRight = '20px';
    mockElement.style.paddingTop = '30px';
    mockElement.style.paddingBottom = '40px';

    const padding = getPadding(mockElement);

    expect(padding.left).toBe(10);
    expect(padding.right).toBe(20);
    expect(padding.top).toBe(30);
    expect(padding.bottom).toBe(40);
  });
});


describe('isHidden function', () => {
  let _get = Range.prototype.getBoundingClientRect
  beforeEach(() => {
    Range.prototype.getBoundingClientRect = () => {
      return {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      } as DOMRect
    }
  })

  afterEach(() => {
    Range.prototype.getBoundingClientRect = _get
  })

  it('should return false for a visible element', () => {
    const mockElement = document.createElement('div');
    mockElement.style.width = '100px';
    mockElement.style.height = '100px';

    const isElementHidden = isHidden(mockElement);

    expect(isElementHidden).toBe(false);
  });

  it('should return true when element has larger range height than its height', () => {
    const mockElement = document.createElement('div');
    mockElement.style.width = '100px';
    mockElement.style.height = '50px';

    jest.spyOn(mockElement, 'getBoundingClientRect').mockReturnValue({
      width: 0,
      height: 50
    } as DOMRect);

    Range.prototype.getBoundingClientRect = () => {
      return {
        width: 0,
        height: 70,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      } as DOMRect
    }

    const isElementHidden = isHidden(mockElement);

    expect(isElementHidden).toBe(true);
  });

});