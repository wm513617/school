const config = require('../../../../../config').backend

const columns = [
  { name: '人员编号 ', type: 'String', key: 'code', size: 18 },
  { name: '姓名', type: 'String', key: 'name', size: 18 },
  { name: '性别', type: 'Enum', key: 'gender', default: { 0: '男', 1: '女' }, size: 18 },
  { name: '联系电话', type: 'String', key: 'tel', size: 18 },
  { name: '车牌号', type: 'String', key: 'plateNo', size: 18 },
  { name: '状态', type: 'Enum', key: 'state', size: 18, default: { 0: '正常', 1: '过期' } },
  { name: '备注', type: 'String', key: 'remark', size: 18 },
  {
    name: '驾驶员照片',
    type: 'Image',
    key: 'driverPic1',
    size: 14.5,
    baseUri: config.fileDirs.motorDriverPicDir
  },
  {
    name: '驾驶员照片',
    type: 'Image',
    key: 'driverPic2',
    size: 14.5,
    baseUri: config.fileDirs.motorDriverPicDir
  },
  {
    name: '驾驶员照片',
    type: 'Image',
    key: 'driverPic3',
    size: 14.5,
    baseUri: config.fileDirs.motorDriverPicDir
  }
]

// const dataMap = {
//   code: 0,
//   name: 1,
//   gender: 2,
//   tel: 3,
//   plateNo: 4,
//   state: 5,
//   startTime: 6,
//   endTime: 7,
//   remark: 8
// }

const dataMap = [
  { key: 'driverPic1', index: 1, baseUri: config.fileDirs.motorDriverPicDir, type: 'Image' },
  { key: 'code', index: 2, type: 'String' },
  { key: 'name', index: 3, type: 'String' },
  { key: 'gender', index: 4, type: 'Enum', default: { 0: '男', 1: '女' } },
  { key: 'tel', index: 5, type: 'String' },
  { key: 'plateNo', index: 6, type: 'String' },
  { key: 'state', index: 7, type: 'Enum', default: { 0: '正常', 1: '过期' } },
  { key: 'startTime', index: 8, type: 'Date', fommat: 'X' },
  { key: 'endTime', index: 9, type: 'Date', fommat: 'X' },
  { key: 'remark', index: 10, type: 'String' }
]

module.exports = {
  columns,
  dataMap
}
