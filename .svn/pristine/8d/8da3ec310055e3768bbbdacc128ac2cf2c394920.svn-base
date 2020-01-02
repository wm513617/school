/*
 * @Author: litao
 * @Date: 2019-05-27 11:55:13
 * @Last Modified time: 2019-07-05 13:15:42
 * 该模块主要提供生成二维码功能
 */
require('babel-polyfill')
const qr = require('branded-qr-code')
const path = require('path')
const fs = require('fs')

const generateCode = async (code, savePath) => {
  const opts = {
    text: code,
    path: path.join(__dirname, './renda_logo.png'),
    ratio: 4,
    opt: {
      errorCorrectionLevel: 'H',
      margin: 1,
      scale: 4,
      width: 500,
      color: {
        dark: '#003C81FF',
        light: '#ffffffff'
      }
    }
  }

  const buf = await qr.generate(opts)
  fs.writeFileSync(savePath, buf)
}

module.exports = {
  generateCode
}
