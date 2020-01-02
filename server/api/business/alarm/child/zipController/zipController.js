/*
* 案件管理和接力追踪压缩ZIP包逻辑
* */
const config = require('../../../../../../config').backend
const fs = require('fs')
const moment = require('moment')
const zipdir = require('zip-dir')
const path = require('path')
const _ = require('lodash')
const Excel = require('exceljs')

module.exports = {
  async zip (mongoData, type, info) {
    console.log('进入压缩任务')
    if (type === 'alarm') { // 如果是案件管理的下载
      const templatePath = path.resolve(__dirname, '../../template.xml')
      const template = fs.readFileSync(templatePath)
      let templateStr = template.toString()
      let resourceList = ''
      let detailList = ``
      _.get(mongoData, 'resourceList', []).map(item => {
        _.get(item, 'tagTime', []).map(tag => {
          resourceList += `   <tr height="24" style='height:14.40pt;'>
        <td class="xl72" height="24" colspan="2" style='height:14.40pt;border-right:none;border-bottom:none;' x:str>
         ${_.get(item, 'resource.name', '')}-${moment(_.get(tag, 'startTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')}-${moment(_.get(tag, 'endTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')}
        </td>
        <td colspan="4" style='mso-ignore:colspan;'></td>
       </tr>`
        })
      })
      _.get(mongoData, 'detail', []).map(item => {
        detailList += `   <tr height="24" style='height:14.40pt;'>
      <td class="xl71" height="24" style='height:14.40pt;' x:str="'${moment(_.get(item, 'handleTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')}">${moment(_.get(item, 'handleTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')}</td>
      <td x:str>${item.detail}</td>
      <td colspan="4" style='mso-ignore:colspan;'></td>
     </tr>`
      })
      const name = `${_.get(mongoData, 'eventName', '')}-${_.get(mongoData, 'person', '')}`
      console.log('新的文件名是======================', name)
      const data = new Map([
        [/{eventName-person}/, name],
        [/{eventName}/, mongoData.eventName || ''],
        [/{person}/, mongoData.person || ''],
        [/{gender}/, _.get(mongoData, 'gender', 1) === 1 ? '男' : '女'],
        [/{age}/, mongoData.age || ''],
        [/{nationality}/, mongoData.nationality || ''],
        [/{department}/, mongoData.department || ''],
        [/{identityNum}/, mongoData.identityNum || ''],
        [/{address}/, mongoData.address || ''],
        [/{phone}/, mongoData.phone || ''],
        [/{incidentAddress}/, mongoData.incidentAddress || ''],
        [/{mark}/, mongoData.mark || ''],
        [/{studentNum}/, mongoData.studentNum || ''],
        [/{isRecode}/, mongoData.isRecode === true ? '是' : '否'],
        [/{startTime}/, moment(_.get(mongoData, 'startTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')],
        [/{startTimestr}/, `"'${moment(_.get(mongoData, 'startTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')}"`],
        [/{endTime}/, moment(_.get(mongoData, 'endTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')],
        [/{endTimestr}/, `"'${moment(_.get(mongoData, 'endTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')}"`],
        [/{alarmTime}/, moment(_.get(mongoData, 'alarmTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')],
        [/{alarmTimestr}/, `"'${moment(_.get(mongoData, 'alarmTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')}"`],
        [/{description}/, mongoData.description || ''],
        [/{resourceList}/, resourceList || ''],
        [/{detailList}/, detailList || '']
      ])
      data.forEach((value, key) => {
        templateStr = templateStr.replace(key, value)
      })
      let buffer = Buffer.from(templateStr)
      let timeStr = moment(Date.now()).format('YYYY-MM-DD')
      // ${alarmInfo.eventCode}
      if (!fs.existsSync(`${config.fileDirs.alarmBackUpDir}/${mongoData.eventCode}`)) { // 检查该文件目录是否存在
        fs.mkdirSync(`${config.fileDirs.alarmBackUpDir}/${mongoData.eventCode}`)
      }
      let excelName = `${config.fileDirs.alarmBackUpDir}/${mongoData.eventCode}/${name}-` + timeStr + '.xlsx'
      fs.writeFileSync(excelName, buffer)
      // fs.writeFileSync(`${config.fileDirs.alarmBackUpDir}/${name}-` + timeStr + '.xlsx', buffer)
      console.log('这是子进程的数据', mongoData)
      mongoData.images.forEach((item) => {
        let fileName = item.path.split('/')[3]
        if (fs.existsSync(`/opt/bstar/pic/common/${fileName}`)) { // 检查文件是否存在
          console.log('这是图片已经存在================', `/opt/bstar/pic/common/${fileName}`)
          let readStream = fs.createReadStream(`/opt/bstar/pic/common/${fileName}`)
          let writeStream = fs.createWriteStream(`${config.fileDirs.alarmBackUpDir}/${mongoData.eventCode}/${fileName}`)
          readStream.pipe(writeStream)
        }
      })
      console.log('准备进入压缩任务', `${config.fileDirs.alarmBackUpDir}/${mongoData.eventCode}`)
      function createZipFile () {
        return new Promise((resolve, reject) => {
          if (fs.existsSync(`${config.fileDirs.alarmBackUpDir}/${mongoData.eventCode}`)) { // 检查目录是否存在
            if (fs.existsSync(`${config.fileDirs.alarmBackUpDir}/${mongoData.eventCode}.zip`)) { // 如果zip文件已经存在则删除，重新打包
              fs.unlinkSync(`${config.fileDirs.alarmBackUpDir}/${mongoData.eventCode}.zip`)
            }
            zipdir(`${config.fileDirs.alarmBackUpDir}/${mongoData.eventCode}`, { saveTo: `${config.fileDirs.alarmBackUpDir}/${mongoData.eventCode}.zip` }, (err, buffer) => {
              if (err) {
                console.log('压缩失败')
              } else {
                console.log('压缩成功')
                resolve('压缩成功')
              }
            })
          }
        })
      }
      await createZipFile()
    } else if (type === 'tracking') { // 如果是接力追踪的下载
      console.log('接力追踪的下载')
      const workbook = new Excel.Workbook()
      workbook.creator = 'bst'
      workbook.lastModifiedBy = 'bst'
      workbook.created = new Date()
      workbook.modified = new Date()
      let sheet = workbook.addWorksheet(`${info.name}`)
      sheet.columns = [
        { header: `${info.name}`, width: 18 },
        { width: 54 }
      ]
      sheet.addRows([
        ['追踪事件信息'],
        ['追踪事件名称', info.name],
        ['备注', info.mark]
      ])
      // sheet.setColumnKey.font = {}
      sheet.getCell('A1').font = {
        // 字体名
        name: '宋体',
        // Font family for fallback. An integer value.
        family: 4,
        // 字体大小
        size: 16,
        // 加粗
        bold: true
      }
      sheet.mergeCells('A1:B1')
      sheet.getCell('A1').alignment = {
        vertical: 'middle',
        horizontal: 'center'
      }
      sheet.mergeCells('A2:B2')
      sheet.getCell('A2').font = {
        // 加粗
        bold: true
      }
      sheet.getCell('A2').alignment = {
        vertical: 'middle',
        horizontal: 'left'
      }
      sheet.getCell('B4').alignment = { wrapText: true }
      let notEvent = true
      if (info.eventId) {
        const evenData = [
          ['案件信息'],
          ['关联事件编号', _.get(info, 'eventId.eventCode', '')],
          ['事件名称', _.get(info, 'eventId.eventName', '')],
          ['报警人', _.get(info, 'eventId.person', '')],
          ['联系电话', _.get(info, 'eventId.phone', '')],
          ['事发地点', _.get(info, 'eventId.incidentAddress', '')],
          ['事件特征', _.get(info, 'eventId.description', '')]
        ]
        sheet.addRows(evenData)
        sheet.mergeCells('A5:B5')
        sheet.getCell('A5').font = {
          // 加粗
          bold: true
        }
        sheet.getCell('A5:B5').alignment = {
          vertical: 'middle',
          horizontal: 'left'
        }
        notEvent = false
      }
      let nameStartTime = 0 // 最早的开始时间
      let nameEndTime = 0 // 最晚的结束时间
      if (_.get(info, 'resourceList.length', 0) > 0) {
        sheet.addRows([['录像文件名称']])
        sheet.mergeCells(notEvent ? 'A5:B5' : 'A12:B12')
        const position = notEvent ? 'A5' : 'A12'
        sheet.getCell(position).font = {
          // 加粗
          bold: true
        }
        sheet.getCell(position).alignment = {
          vertical: 'middle',
          horizontal: 'left'
        }
        let i = 0

        for (let item of info.resourceList) {
          i += 1
          const stimeNumber = moment(_.get(item, 'startTime', 0) * 1000)
          const etimeNumber = moment(_.get(item, 'endTime', 0) * 1000)
          let sTime = moment(stimeNumber).format('YYYY-MM-DD HH:mm:ss')
          let eTime = moment(etimeNumber).format('YYYY-MM-DD HH:mm:ss')
          if (nameStartTime === 0 || nameEndTime === 0) {
            nameStartTime = stimeNumber
            nameEndTime = etimeNumber
          } else {
            nameStartTime = sTime < stimeNumber ? sTime : stimeNumber
            nameEndTime = eTime > etimeNumber ? eTime : etimeNumber
          }

          sheet.addRows([[`${info.name}-${item.resource.name}-${sTime}-${eTime}-${i}`]])
          sheet.mergeCells(`A${(notEvent ? 5 : 12) + i}: B${(notEvent ? 5 : 12) + i} `)
        }
      }
      const buff = await workbook.xlsx.writeBuffer()
      // const info = await trackingService.getOne(paramsInfo)
      // const { name, buff } = await trackingService.exPort(info)
      let name = `${info.name}-${moment(nameStartTime).format('YYYY-MM-DD HH:mm:ss')}-${moment(nameEndTime).format('YYYY-MM-DD HH:mm:ss')}`
      if (!fs.existsSync(`${config.fileDirs.alarmBackUpDir}/${mongoData._id}`)) { // 检查该文件目录是否存在
        fs.mkdirSync(`${config.fileDirs.alarmBackUpDir}/${mongoData._id}`)
      }
      fs.writeFileSync(`${config.fileDirs.alarmBackUpDir}/${mongoData._id}/${name}.xlsx`, buff)
      function createZip () {
        return new Promise((resolve, reject) => {
          if (fs.existsSync(`${config.fileDirs.alarmBackUpDir}/${mongoData._id}`)) { // 检查目录是否存在
            if (fs.existsSync(`${config.fileDirs.alarmBackUpDir}/${mongoData._id}.zip`)) { // 如果zip文件已经存在则删除，重新打包
              fs.unlinkSync(`${config.fileDirs.alarmBackUpDir}/${mongoData._id}.zip`)
            }
            zipdir(`${config.fileDirs.alarmBackUpDir}/${mongoData._id}`, { saveTo: `${config.fileDirs.alarmBackUpDir}/${mongoData._id}.zip` }, (err, buffer) => {
              if (err) {
                console.log('压缩失败')
              } else {
                console.log('压缩成功')
                resolve('压缩成功')
              }
            })
          }
        })
      }
      await createZip()
    }
  }
}
