/**
 * @author heart
 * @description 自定义事件
 * @Date 2022-08-14
 * @see https://developer.mozilla.org/zh-CN/docs/Web/API/CustomEvent#customeventinit
 */

/**
 * 页面需要
 * <button id="btn"> click me </button>
 * <input  id="input"/>
 */
// 创建事件
const customEvent = new CustomEvent('input', {
  // 表示是否可以冒泡
  bubbles: true,
  // 事件是否可以被撤销
  cancelable: true,
  // 事件初始化时传递的数据
  detail: {
    realData: true,
  },
})

const btn = document.getElementById('btn')
const input = document.getElementById('input')
let count = 0
if (input) {
  input.addEventListener('input', (e) => {
    console.log(e)
  })
}

if (btn) {
  // 按钮点击 触发自定义事件的分发
  btn.addEventListener('click', () => {
    if (input instanceof HTMLInputElement) {
      input.value = count + ''
      count++
      // 分发事件
      input.dispatchEvent(customEvent)
    }
  })
  btn.dispatchEvent(customEvent)
}
