/*
 * @Author: litao
 * @Date: 2019-07-27 11:55:13
 * 该模块实现导入、导出excel文件的核心功能
 * -----------------------------README-----------------------------
 * reader()      读取excel文件
 * writer()      导出excel文件
 */

/*
 *接收主进程消息
 *@params Object
 *@type 操作类型 import:导入  export:导出
 *@options 操作excel所需要的必要信息
 */
process.on('message', async ({ type, options }) => {
  try {
    const result = (type === 'import' && (await reader(options))) || (type === 'export' && (await writer(options)))
    process.send(result)
    process.exit()
  } catch (error) {
    console.log(error)
    process.exit()
  }
})

const Excel = require('exceljs')
const _ = require('lodash')
const path = require('path')
const fs = require('fs')
const xl = require('excel4node')
const config = require('../../../../config').backend

const reader = ({ filePath, map, image, codeImage }) => {
  return new Promise((resolve, reject) => {
    const result = {
      success: true,
      datas: null,
      total: 0
    }

    try {
      const workbook = new Excel.Workbook()
      workbook.xlsx.readFile(filePath).then(wb => {
        // 获取excel中所有的图片
        // const medias = wb.model.media
        // 获取excel第一个工作区中所有的行信息
        const rows = wb.model.sheets[0].rows
        // 获取excel第一个工作区中每一行所对应的图片信息
        // const rowMedias = wb.model.sheets[0].media

        const _models = []

        // for (let i = 0, j = rowMedias.length; i < j; i++) {
        for (let i = 1, j = rows.length; i < j; i++) {
          const _data = {}

          // 获取在excel中图片的编号
          // const _id = rowMedias[i].imageId
          // 根据图片的编号获取excel中图片的字节流
          // const _buffer = _.find(medias, { index: _id }).buffer
          const _row = rows[i].cells

          Object.keys(map).forEach(o => {
            if (_.isObject(map[o])) {
              _data[o] = {}
              Object.keys(map[o]).forEach(n => {
                const _arr = map[o][n]
                if (_.isArray(_arr)) {
                  const _res = _arr.filter(m => _row[m].value !== '/')
                  _data[o][n] = _row[_res[0]].value
                } else {
                  const _cell = _row[map[o][n]].value
                  if (_cell !== '/') {
                    _data[o][n] = _cell
                  }
                }
              })
            } else {
              const _cell = _row[map[o]].value
              if (_cell !== '/') {
                _data[o] = _cell
              }
            }
          })

          // if (image) {
          //   const _name = _.get(_data, image.dbName)
          //   const savePath = path.join(image.basePath, `/${_name}.jpg`)
          //   _.set(_data, image.name, `${image.proxyPath}/${_name}.jpg`)
          //   ;(async () => {
          //     await fs.writeFileSync(savePath, _buffer)
          //   })()
          // }

          // 为了匹配非机动车管理所作的修改
          // if (codeImage) {
          //   // const opts = {
          //   //   size: 100
          //   // }
          //   ;(async () => {
          //     const code = _.get(_data, codeImage.dbName)
          //     const savePath = path.join(codeImage.basePath, `/code-${code}.jpg`)
          //     // const buf = await qr.imageSync(code, opts)
          //     await generateCode(code, savePath)
          //     _.set(_data, codeImage.name, `${codeImage.proxyPath}/code-${code}.jpg`)
          //     // await fs.writeFileSync(savePath, buf)
          //   })()
          // }

          _models.push(_data)
        }

        resolve(Object.assign(result, { total: rows.length - 1, datas: _models }))
      })
    } catch (error) {
      reject(Object.assign(result, { success: false }))
    }
  })
}

const writer = ({ columns, rows, sheetName, fileName }) => {
  const filePath = path.join(config.fileDirs.tempDir, fileName)
  return new Promise((resolve, reject) => {
    const wb = new xl.Workbook()
    let ws = wb.addWorksheet(sheetName)

    // 设置统一的样式
    const myStyle = wb.createStyle({
      font: {
        bold: true
      },
      alignment: {
        wrapText: true,
        horizontal: 'center',
        vertical: 'center'
      }
    })

    columns.forEach((column, columnIndex) => {
      ws.column(columnIndex + 1).setWidth(column.size.width)
      ws.cell(1, columnIndex + 1)
        .string(column.name)
        .style(myStyle)
      rows.forEach((row, rowIndex) => {
        ws.row(rowIndex + 2).setHeight(column.size.height)
        const cell = ws.cell(rowIndex + 2, columnIndex + 1)

        switch (!_.isEmpty(column.type)) {
          case column.type === 'Image':
            const imgArr = _.get(row, column.dbName).split('/')
            const imgName = imgArr.pop()
            const fullPath = path.join(`${column.baseUri}/${imgName}`)
            // if ((path.extname(imgName) === '.jpg' || path.extname(imgName) === '.png' || path.extname(imgName) === '.bmp' || path.extname(imgName) === '.jpeg') && fs.existsSync(fullPath)) {
            if (
              ['.jpg', '.png', '.bmp', '.jpeg'].includes(path.extname(imgName).toLocaleLowerCase()) &&
              fs.existsSync(fullPath)
            ) {
              const buffer = fs.readFileSync(fullPath)
              ws.addImage({
                image: buffer,
                type: 'picture',
                position: {
                  type: 'twoCellAnchor',
                  from: {
                    col: columnIndex + 1,
                    colOff: 0,
                    row: rowIndex + 2,
                    rowOff: 0
                  },
                  to: {
                    col: columnIndex + 2,
                    colOff: 0,
                    row: rowIndex + 3,
                    rowOff: 0
                  }
                }
              })
            } else {
              cell.string('未找到图片').style(myStyle)
            }
            break
          case column.type === 'String':
            cell.string(_.get(row, column.dbName)).style(myStyle)
            break
          case column.type === 'Number':
            cell.string(_.get(row, column.dbName).toString()).style(myStyle)
            break
          case column.type === 'Date':
            cell.string(_.get(row, column.dbName)).style(myStyle)
            break
          case column.type === 'Enum':
            cell.string(column.default[_.get(row, column.dbName)]).style(myStyle)
            break
          default:
            cell.string('未知类型的数据').style(myStyle)
        }
      })
    })
    wb.write(filePath, function (err) {
      if (err) {
        resolve('')
      } else {
        resolve(filePath)
      }
    })
  })
}
