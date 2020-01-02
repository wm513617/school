/*
 * @Author: wenhaoFu
 * @Date: 2019-07-24 13:49:49
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-11-12 15:25:28
 * @Description: excel 导出可以使用公共导出的方法，但是改动会比较大
 */
// 数据导出 子进程执行文件
'use strict'

const xl = require('excel4node')
const resizeImg = require('resize-img')
const request = require('request-promise')
const { titleDict, dataDict } = require('./dataDict')
const _ = require('lodash')
const moment = require('moment')
const path = require('path')
const fs = require('fs')

process.on('message', async ({ fullPath, excalData, sheetName }) => {
  let newData = await dataMaptoString(excalData)
  exportExcleFile(fullPath, sheetName, newData)
    .then(result => {
      process.send(result)
      process.exit()
    })
    .catch(err => {
      process.send(err)
      process.exit()
    })
})

// 数据映射查字典
async function dataMaptoString (data) {
  let keys = Object.keys(data[0])
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < keys.length; j++) {
      if (keys[j] === 'time') {
        data[i][keys[j]] = moment(`${data[i][keys[j]]}`).format('YYYY-MM-DD HH:mm:ss')
      } else {
        data[i][keys[j]] = _.isEmpty(dataDict[keys[j]]) ? data[i][keys[j]] : dataDict[keys[j]][data[i][keys[j]]]
      }
    }
    console.log('正在导出 [准备数据]-----------------------', i, '/', data.length)
  }
  return data
}

// 文件导出插件
async function exportExcleFile (fullPath, sheetName, data) {
  return new Promise(async (resolve, reject) => {
    let wb = new xl.Workbook()
    let ws = wb.addWorksheet(sheetName)
    let arrayKey = Object.keys(data[0])
    arrayKey = arrayKey.filter(item => {
      return !_.isEmpty(titleDict[item])
    })

    console.log('所有的key', arrayKey)
    // 设置图片展示行宽度
    for (let i = 0; i < arrayKey.length; i++) {
      if (arrayKey[i] === 'smallImageUrl') {
        // bigImageUrl
        // ws.column(i + 1).setWidth(20)
      }
      ws.cell(1, i + 1).string(_.isEmpty(titleDict[arrayKey[i]]) ? arrayKey[i] : titleDict[arrayKey[i]])
    }
    for (let i = 0; i < data.length; i++) {
      ws.row(i + 2).setHeight(60)
      for (let j = 0; j < arrayKey.length; j++) {
        if (arrayKey[j] === 'smallImageUrl') {
          // bigImageUrl
          console.log(data[i][arrayKey[j]])
          let body = await request({
            url: data[i][arrayKey[j]],
            method: 'GET',
            encoding: null,
            headers: {
              'Accept-Encoding': 'gzip, deflate'
            }
          })
          if (body.length > 0) {
            let img = await resizeImg(body, { height: 72, width: 128 })
            ws.addImage({
              image: img,
              name: 'logo', // name is not required param
              type: 'picture',
              position: {
                type: 'twoCellAnchor',
                from: {
                  col: j + 1,
                  colOff: '.1mm',
                  row: i + 2,
                  rowOff: '.1mm'
                },
                to: {
                  col: j + 2,
                  colOff: 0,
                  row: i + 3,
                  rowOff: 0
                }
              }
            })
          }
        } else {
          if (typeof data[i][arrayKey[j]] === 'string') {
            ws.cell(i + 2, j + 1).string(data[i][arrayKey[j]])
          } else if (typeof data[i][arrayKey[j]] === 'number') {
            ws.cell(i + 2, j + 1).number(data[i][arrayKey[j]])
          }
        }
        // 缺少图片
      }
      console.log(i, '/', data.length)
    }

    wb.write(fullPath, function (err, stats) {
      if (err) {
        reject({ success: false, msg: err })
      } else {
        console.log(fullPath, ' 文件导出完成')
        resolve({ success: true })
      }
    })
  })
}
