/**
 * 是否是文件名
 * @param str
 * @returns boolean
 */
function isFile(str: string): boolean {
  const reg = /.*?\..*$/g
  return reg.test(str)
}

/**
 * 是否为指定文件
 * @param str
 * @param options
 * @returns boolean
 */
function isAppointFile(str: string, options: string): boolean {
  const reg = new RegExp(`.*?\\.${options}$`, 'g')
  return reg.test(str)
}

/**
 * 获取文件名
 * @param str
 * @returns
 */
function getFilesName(str: string): string | null {
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
