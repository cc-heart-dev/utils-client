import { getByText } from '@testing-library/dom'

import {
  removeStyles,
  addStyles,
  addClassName,
  removeClassName,
  getStyles,
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
})
