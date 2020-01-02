/*
 * @Description: 案件管理和接力追踪 execl 和 pdf 文件导出子进程
 * @Author: wanglei
 * @Date: 2019-10-31 17:39:26
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-11-12 09:51:30
 * @Attention 由于 依赖的包 pdfmake 对中文支持不友好，所以需要自己添加中文字体文件，这里使用的宋体
 * 打包的时候需要注意！！！
 * 新增字体文件需要替换 node_modules/pdfmake/build/vfs_fonts.js
 * 步骤
 * 1. 下载 pdfmake 源码 git clone https://github.com/bpampuch/pdfmake.git
 * 2. 将新增字体文件复制到 pdfmake/example/fonts 目录下
 * 3. npm install 安装依赖
 * 4. 执行 gulp buildFonts 命令
 * 5. 将生成的 vfs_foonts.js 文件复制到项目 node_modules/pdfmake/build 下，替换旧的文件
 *
 * 经测试，在引入中文字体的情况下，也不需要去替换原 pdfmake 包中的 vfs_fonts.js 文件
 */
'use strict'

const fs = require('fs')
const path = require('path')
const zipdir = require('zip-dir')
const moment = require('moment')
const _ = require('lodash')
const PdfPrinter = require('pdfmake/src/printer')
const fonts = {
  simsun: {
    normal: path.resolve(__dirname, './font/SimSun.ttf'),
    bold: path.resolve(__dirname, './font/SimSun.ttf'),
    italics: path.resolve(__dirname, './font/SimSun.ttf'),
    bolditalics: path.resolve(__dirname, './font/SimSun.ttf')
  }
}

process.on('message', async ({ type, dirPath, filePath, data }) => {
  try {
    const result = await createAlarmEventPdf(type, data)
    fs.writeFileSync(filePath, result)
    const zipPath = await createZipFile(dirPath)
    process.send({ code: 200, message: '导出成功', zipPath: zipPath })
    process.exit()
  } catch (error) {
    console.error('zip excel and pdf file file', error)
    process.send({ code: 500, message: `导出失败` })
    process.exit()
  }
})

// 将文件压缩成 zip 包
const createZipFile = dirPath => {
  return new Promise((resolve, reject) => {
    zipdir(dirPath, { saveTo: `${dirPath}.zip` }, (error, buffer) => {
      if (error) {
        console.log('压缩失败', error.message)
      } else {
        console.log('压缩成功')
        resolve(`${dirPath}.zip`)
      }
    })
  })
}

const getGender = gender => {
  const v = (gender === 1 && '男') || (gender === 2 && '女') || ''
  return v
}

const formatTime = v => {
  return v ? moment(v * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
}

const getDocDefinitionContent = (type, data) => {
  try {
    let content = []
    if (type === 'alarmEvent') {
      for (const item of data) {
        content.push(
          { text: `案件编号: ${item.eventCode}` },
          { text: `案件名称: ${item.eventName}` },
          { text: `事发地址: ${item.incidentAddress}` },
          { text: `报案人: ${item.person || ''}` },
          { text: `性别: ${getGender(item.gender)}` },
          { text: `年龄: ${item.age || ''}` },
          { text: `学号: ${item.studentNum || ''}` },
          { text: `联系电话: ${item.phone || ''}` },
          { text: `民族: ${item.nationality || ''}` },
          { text: `单位/院系: ${item.department || ''}` },
          { text: `住址: ${item.address || ''}` },
          { text: `身份证号: ${item.identityNum || ''}` },
          { text: `状态: ${item.state || ''}` },
          { text: `案件开始时间: ${formatTime(item.startTime) || ''}` },
          { text: `案件结束时间: ${formatTime(item.endTime) || ''}` },
          { text: `报警时间: ${formatTime(item.alarmTime) || ''}` },
          { text: `创建时间: ${formatTime(item.createTime) || ''}` },
          { text: `事件描述: ${item.description || ''}` },
          { text: `备注: ${item.mark || ''}` },
          { text: '                                                      ' },
          { text: '                                                      ' },
          { text: '                                                      ' }
        )
      }
    }
    if (type === 'tracking') {
      for (const item of data) {
        content.push(
          { text: `追踪名称: ${item.name || ''}` },
          { text: `开始时间: ${formatTime(item.startTime)}` },
          { text: `结束时间: ${formatTime(item.endTime)}` },
          { text: `关联案件: ${_.get(item, 'eventId.eventName', '')}` },
          { text: `追踪状态: ${item.close || ''}` },
          { text: `备注: ${item.mark || ''}` },
          { text: '                                                      ' },
          { text: '                                                      ' },
          { text: '                                                      ' }
        )
      }
    }
    return content
  } catch (error) {
    throw Error(error)
  }
}

const createAlarmEventPdf = (type, data) => {
  return new Promise((resolve, reject) => {
    const printer = new PdfPrinter(fonts)
    const docDefinition = {
      pageSize: 'A4',
      content: getDocDefinitionContent(type, data),
      defaultStyle: {
        font: 'simsun',
        fontSize: 10
      }
    }
    const pdfDoc = printer.createPdfKitDocument(docDefinition)
    const chunks = []
    let result = null
    pdfDoc.on('data', (chunk) => {
      chunks.push(chunk)
    })
    pdfDoc.on('error', err => {
      console.error('导出 PDF 出错', err)
      resolve()
    })
    pdfDoc.on('end', () => {
      result = Buffer.concat(chunks)
      resolve(result)
    })
    pdfDoc.end()
  })
}
