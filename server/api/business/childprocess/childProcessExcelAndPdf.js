/*
 * @Description: 案件管理和接力追踪导出 excel 和 pdf 压缩包的的子进程
 * @Author: wanglei
 * @Date: 2019-11-04 14:24:32
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-11-11 19:42:04
 */
'use strict'
const path = require('path')
const childProcess = require('child_process')

// 导出 excel 和生成 pdf 的压缩包
exports.childProcessZip = (pdfParams) => {
  return new Promise((resolve, reject) => {
    const workerModule = path.resolve(__dirname, './exportExcelAndPdfZip.js')
    // '--inspect-brk=0.0.0.0:9230'
    const worker = childProcess.spawn('node', [workerModule], {
      stdio: [null, null, null, 'ipc']
    })
    worker.send(pdfParams)
    worker.on('message', result => {
      resolve(result)
    })
  })
}

// 导出 excel 子进程，调用系统现有公共导出方法
exports.childProcessExecl = async params => {
  return new Promise((resolve, reject) => {
    const workerModule = path.resolve(__dirname, '../../../common/excel.tool.js')
    const worker = childProcess.spawn('node', [workerModule], {
      stdio: [null, null, null, 'ipc']
    })
    worker.send(params)
    worker.on('message', async result => {
      resolve(result)
    })
  })
}
