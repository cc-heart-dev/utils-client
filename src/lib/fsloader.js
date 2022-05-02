const fs = require('fs')
const path = require('path')
const isFile = require('./tool').isFile
const isAppointFile = require('./tool').isAppointFile
const getFilesName = require('./tool').getFilesName
const entry = {}
const filePath = 'html'
const htmlTemplateAttribute = []
/**
 * @param p path
 */
function getEntryAsync(p) {
  try {
    const dirent = fs.readdirSync(p, { withFileTypes: true })
    dirent.forEach((val) => {
      if (!isFile(val.name)) {
        getEntryAsync(path.resolve(p, val.name))
      } else if (isAppointFile(val.name, 'js')) {
        const fileName = getFilesName(val.name)
        if (fileName) {
          const fileLastName = p.split('/')
          if (fileLastName.length > 1) {
            const prefixFile = fileLastName[fileLastName.length - 1]
            entry[prefixFile + '-' + fileName] = p + '/' + val.name
          }
        }
      } else if (isAppointFile(val.name, 'ts')) {
        const fileName = getFilesName(val.name)
        if (fileName) {
          const fileLastName = p.split('/')
          if (fileLastName.length > 1) {
            const prefixFile = fileLastName[fileLastName.length - 1]
            entry[prefixFile + '-' + fileName] = p + '/' + val.name
            const index = dirent.findIndex((val) => val.name === [fileName, filePath].join('.'))
            if (index > -1) {
              htmlTemplateAttribute.push({
                template: p + '/' + val.name.replace('ts', filePath),
                filename: prefixFile + '-' + fileName + '.' + filePath,
                chunks: [prefixFile + '-' + fileName],
              })
            }
          }
        }
      }
    })
  } catch (e) {
    console.error(e)
  }
}
getEntryAsync('./src/pages')
module.exports = {
  entry,
  htmlTemplateAttribute,
}
