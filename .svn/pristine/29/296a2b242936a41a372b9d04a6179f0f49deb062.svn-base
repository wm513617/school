const config = require('../../../config').backend

// 导出excel时列明与数据库字段的映射关系以及相关配置
const columns = [
  {
    name: '身份',
    type: 'Enum',
    key: 'identityType',
    default: { 0: '职工', 1: '学生', 2: '外聘', 3: '家属', 4: '其他' },
    size: 12.5
  },
  { name: '姓名', type: 'String', key: 'name', size: 12.5 },
  {
    name: '教工号/学工号/身份证号',
    type: 'String',
    key: 'indentityInfo.indentityNo',
    size: 18
  },
  { name: '联系电话', type: 'String', key: 'tel', size: 12.5 },
  { name: '性别', type: 'Enum', key: 'sex', default: { 0: '男', 1: '女' }, size: 12.5 },
  { name: '年龄', type: 'Number', key: 'age', size: 12.5 },
  { name: '住址', type: 'String', key: 'address', size: 25 },
  { name: '购买时间', type: 'String', key: 'nonVehiclesInfos.buyTime', size: 15 },
  { name: '牌照', type: 'String', key: 'nonVehiclesInfos.numberPlate', size: 18 },
  { name: '校内编号', type: 'String', key: 'nonVehiclesInfos.schoolCardNo', size: 18 },
  { name: '品牌', type: 'String', key: 'nonVehiclesInfos.brand', size: 15 },
  { name: '颜色', type: 'String', key: 'nonVehiclesInfos.color', size: 15 },
  {
    name: '状态',
    type: 'Enum',
    key: 'nonVehiclesInfos.state',
    size: 18,
    default: {
      0: '正常',
      1: '伪造车证',
      2: '涂改车证',
      3: '转接车证',
      4: '辱骂车辆管理人员',
      5: '与车辆管理人员发生纠纷'
    }
  },
  { name: '备注', type: 'String', key: 'remark', size: 12.5 },
  {
    name: '非机动车图片',
    type: 'Image',
    key: 'nonVehiclesInfos.image',
    size: 14.5,
    baseUri: config.fileDirs.nonVehicleDir
  },
  {
    name: '二维码图片',
    type: 'Image',
    key: 'nonVehiclesInfos.codeImage',
    size: 14.5,
    baseUri: config.fileDirs.nonVehicleDir
  }
]

const identityType = {
  职工: 0,
  学生: 1,
  外聘: 2,
  家属: 3,
  其他: 4
}

const sex = {
  男: 0,
  女: 1
}

const state = {
  正常: 0,
  伪造车证: 1,
  涂改车证: 2,
  转接车证: 3,
  辱骂车辆管理人员: 4,
  与车辆管理人员发生纠纷: 5
}

const studentType = {
  非留学生: 0,
  留学生: 1
}

const personType = {
  家属: 0,
  居委会: 1
}

// 在读取excel时指定列的位置必须与当前映射的位置相同
const dataMap = [
  {
    key: 'identityType',
    index: 1,
    type: 'Enum',
    enum: { 0: '职工', 1: '学生', 2: '外聘', 3: '家属', 4: '其他' },
    default: undefined
  },
  { key: 'indentityInfo.indentityNo', index: 2, type: 'String' },
  { key: 'indentityInfo.indentityNo', index: 3, type: 'String' },
  {
    key: 'indentityInfo.studentType',
    index: 4,
    type: 'Enum',
    enum: { 0: '非留学生', 1: '留学生' },
    default: undefined
  },
  { key: 'indentityInfo.registerTime', index: 5, type: 'String' },
  {
    key: 'indentityInfo.indentityNo',
    index: 6,
    link: 'indentityInfo.cardNo',
    type: 'String'
  },
  { key: 'indentityInfo.personType', index: 7, type: 'Enum', enum: { 0: '家属', 1: '居委会' } },
  { key: 'name', index: 8, type: 'String' },
  { key: 'sex', index: 9, type: 'Enum', enum: { 0: '男', 1: '女' } },
  { key: 'tel', index: 10, type: 'String' },
  { key: 'address', index: 11, type: 'String' },
  { key: 'age', index: 12, type: 'Number' },
  { key: 'remark', index: 13, type: 'String' },
  { key: 'nonVehiclesInfos.isOneSelf', index: 14, type: 'Enum', enum: { 0: '否', 1: '是' } },
  { key: 'nonVehiclesInfos.isInvoice', index: 15, type: 'Enum', enum: { 0: '无', 1: '有' } },
  { key: 'nonVehiclesInfos.buyTime', index: 16, type: 'String' },
  {
    key: 'nonVehiclesInfos.numberPlateType',
    index: 17,
    type: 'Enum',
    enum: { 0: '临时', 1: '正式' }
  },
  { key: 'nonVehiclesInfos.numberPlate', index: 18, type: 'String' },
  { key: 'nonVehiclesInfos.periodOfValidity', index: 19, type: 'String' },
  { key: 'nonVehiclesInfos.schoolCardNo', index: 20, type: 'String' },
  { key: 'nonVehiclesInfos.brand', index: 21, type: 'String' },
  { key: 'nonVehiclesInfos.color', index: 22, type: 'String' },
  { key: 'nonVehiclesInfos.image', index: 23, type: 'Image', baseUri: config.fileDirs.nonVehicleDir }
]

module.exports = {
  columns,
  identityType,
  sex,
  state,
  studentType,
  personType,
  dataMap
}
