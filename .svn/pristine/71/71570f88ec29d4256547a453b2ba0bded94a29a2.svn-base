process.on('message', async ({ filePath, rows, columns, sheetName, type, style, hasHeader }) => {
  try {
    if (type === 'export') {
      await generateExcel(columns, rows, sheetName, filePath, style)
      process.send({ code: 200, message: '导出成功' })
    } else {
      const rows = await extractExcel(columns, filePath, hasHeader)
      process.send({ code: 200, message: '导入成功', data: rows })
    }
    process.exit()
  } catch (error) {
    console.log('exceljs export file. Error:', error)
    process.send({ code: 200, message: error.message })
    process.exit()
  }
})

const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const moment = require('moment')
const Excel = require('exceljs/modern.nodejs')
const { randomString } = require('./tools')

const extractExcel = async (column, filename, hasHeader) => {
  try {
    const rows = []
    let [meidaIndex, cells] = [0, 0]
    const workbook = new Excel.Workbook()
    await workbook.xlsx.readFile(filename)
    const worksheet = await workbook.getWorksheet(1)
    cells = hasHeader ? worksheet.getRow(1).values.length : 0
    worksheet.eachRow((row, index) => {
      if (hasHeader) {
        hasHeader = false
        return
      }
      const meta = {}
      for (let i = 1; i < cells; i++) {
        let value = row.getCell(i).value
        if (row.getCell(i).type === Excel.ValueType.RichText) {
          value = richText2String(value)
        }
        getRowValue(workbook, column, meidaIndex, i, value, meta)
      }
      rows.push(meta)
      meidaIndex++
    })
    return rows
  } catch (error) {
    console.log(error)
  }
}

const getRowValue = (workbook, column, meidaIndex, cellIndex, value, row) => {
  try {
    const descriptor = _.find(column, { index: cellIndex })
    switch (descriptor.type) {
      case 'Image':
        try {
          if (meidaIndex < workbook.media.length) {
            const image = workbook.media[meidaIndex]
            const filePath = path.join(descriptor.baseUri, randomString(12) + '.jpg')
            fs.writeFileSync(filePath, image.buffer)
            _.set(row, descriptor.key, getUrlPath(filePath))
          } else {
            _.set(row, descriptor.key, '')
          }
        } catch (error) {
          _.set(row, descriptor.key, '')
        }
        break
      case 'String':
        // 处理相同字段具有不同用户情况下，避免漏掉其他字段值，其他字段需要使用cb来实现
        if (!_.get(row, descriptor.key)) {
          _.set(row, descriptor.key, (descriptor.cb && descriptor.cb(value)) || value || '')
        }
        if (descriptor.link) {
          _.set(row, descriptor.link, (descriptor.cb && descriptor.cb(value)) || value || '')
        }
        break
      case 'Number':
        if (!_.get(row, descriptor.key)) {
          _.set(row, descriptor.key, (descriptor.cb && descriptor.cb(value)) || Number(value) || '')
        }
        break
      case 'Date':
        _.set(row, descriptor.key, value ? moment(value).format(descriptor.format || 'X') : '')
        break
      case 'Enum':
        _.set(row, descriptor.key, getEmunValue(descriptor.enum, value))
        break
      default:
        _.set(row, descriptor.key, '错误类型')
    }
  } catch (error) {
    console.log(error)
  }
}

/**
 * 导出excel文件
 * @param {*Array} columns  列头信息
 * @param {*Array} rows  行数据
 * @param {String} sheetName  工作表名称
 * @param {*path} savePath  文件保存路径
 */
const generateExcel = async (columns, rows, sheetName, savePath, style = { row: { height: 100 } }) => {
  try {
    var workbook = new Excel.Workbook()
    var sheet = workbook.addWorksheet(sheetName)
    // 设置表头
    sheet.columns = columns.map(column => {
      return { header: column.name, width: column.size, key: column.key }
    })
    // 设置表头单元格样式与对齐方式
    var rowHeader = sheet.getRow(1)
    for (var i = 1; i <= sheet.columns.length; i++) {
      rowHeader.getCell(i).font = { name: 'Arial Black', size: 12, bold: true }
      rowHeader.getCell(i).alignment = { wrapText: false, horizontal: 'center' }
    }
    // 填充数据
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index]
      const data = setRowVaules(columns, row, index, sheet, workbook)
      sheet.addRow(data)
      sheet.getRow(index + 2).height = style.row.height
    }
    await workbook.xlsx.writeFile(savePath)
  } catch (error) {
    console.log(error)
  }
}
/**
 * 根据列类型描述收集行数据，由于增加了图片类型，需要同时写入sheet
 * @param {*} columns 数据列描述对象
 * @param {*} row 行数数据项
 * @param {*} rowIndex 行号
 * @param {*} sheet 工作表
 * @param {*} workbook 工作簿
 */
const setRowVaules = (columns, row, rowIndex, sheet, workbook, style) => {
  const rowData = []
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i]
    switch (column.type) {
      case 'Image':
        let filePath = getImagePath(_.get(row, column.key, ''), column.baseUri)
        if (filePath === '.') {
          rowData.push('')
        } else if (fs.existsSync(filePath)) {
          rowData.push('')
          const imageid = workbook.addImage({ buffer: fs.readFileSync(filePath), extension: 'jpeg' })
          sheet.addImage(imageid, {
            tl: { col: 0.01 + i, row: rowIndex + 1 },
            ext: { width: 100, height: 100 }
          })
        } else {
          rowData.push('未知的图片')
        }
        break
      case 'String':
      case 'Number':
        rowData.push(_.get(row, column.key, ''))
        break
      case 'Date':
        _.get(row, column.key)
          ? rowData.push(moment(_.get(row, column.key, '') * 1000).format('YYYY-MM-DD HH:mm:ss'))
          : rowData.push('')
        break
      case 'Enum':
        rowData.push(column.default[_.get(row, column.key, '')] || '')
        break
      default:
        rowData.push('未知类型的数据')
    }
  }
  return rowData
}

/**
 * 获取枚举值
 * @param {*} enums 枚举对象
 * @param {*} cellValue 单元格值
 */
const getEmunValue = (enums, cellValue) => {
  const pairs = Object.entries(enums).find(item => item[1] === cellValue)
  const value = pairs && Number(pairs[0])
  if (typeof value === 'number') {
    return value
  } else {
    return pairs && pairs[0]
  }
}
/**
 * 获取图片的磁盘映射路径
 * @param {*} fllePath url路径
 * @param {*} dir 磁盘映射目录
 */
const getImagePath = (filePath, prefix) => {
  const lastPath = path.basename(prefix)
  const regex = new RegExp(`.*/${lastPath}`)
  return path.normalize(filePath.replace(regex, prefix))
}

/**
 * 获取图片的磁盘映射路径
 * @param {*} fllePath url路径
 * @param {*} dir 磁盘映射目录
 */
const getUrlPath = (filePath, separator = 'pic') => {
  return path.normalize(`/image${filePath.split(separator).pop()}`)
}

/**
 * excel富文本格式转换成字符串
 * @param {*} values 富文本对象
 */
const richText2String = values => {
  let str = ''
  for (const [, value] of Object.entries(values.richText)) {
    str += _.get(value, 'text', '')
  }
  return str
}
