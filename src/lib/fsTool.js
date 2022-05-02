'use strict'
/**
 * 是否是文件名
 * @param str
 * @returns boolean
 */
function isFile(str) {
  const reg = /.*?\..*$/g
  return reg.test(str)
}
/**
 * 是否为指定文件
 * @param str
 * @param options
 * @returns boolean
 */
function isAppointFile(str, options) {
  const reg = new RegExp(`.*?\\.${options}$`, 'g')
  return reg.test(str)
}
/**
 * 获取文件名
 * @param str
 * @returns
 */
function getFilesName(str) {
  const reg = /\/?(.*)\..*$/g
  if (reg.test(str)) {
    return RegExp.$1
  }
  return null
}
module.exports = {
  isAppointFile,
  isFile,
  getFilesName,
}
