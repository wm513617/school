/*
 * @Author: zhangminbo
 * @Date: 2018-06-28 11:12:12
 * @Last Modified by: zhangminbo
 * @Last Modified time: 2018-06-28 20:00:10
 */

const JSZip = require('jszip')
const xlsx = require('node-xlsx')
const gfs = require('./gridfs.util')

/**
 * 导出压缩文件
 * @param {*} option 配置项
 * {
 *  data: 数据
 *  gfsObj: 函数,返回gfs获取文件配置项
 *  fileName: 函数,返回文件名称
 *  ctx: 上下文
 *  field: 文件字段名称
 *  zipName: 压缩文件名
 * }
 */
exports.zipFile = async (option) => {
  var zip = new JSZip()
  for (var i = 0; i < option.data.length; i++) {
    var fileObj = option.data[i]
    if (fileObj[option['field']]) {
      const bufferdata = await gfs.getFileBufferById(option.gfsObj(fileObj))
      zip.file(option.fileName(fileObj, i), bufferdata, {
        base64: false
      })
    }
  }
  option.ctx.set('Content-Type', 'application/x-zip-compressed')
  option.zipName && option.ctx.attachment(option.zipName)
  option.ctx.body = await zip.generateAsync({
    type: 'nodebuffer'
  })
}

exports.excle = async (option) => {
  xlsx.build()
}
