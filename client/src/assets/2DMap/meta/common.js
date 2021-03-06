/**
 * 要素变量配置
 **/
// 几何要素类型
const GEOMETRYTYPE = {
  POINT: 'Point', // 点
  CIRCLE: 'Circle', // 圆
  POLYLINE: 'LineString', // 线
  POLYGON: 'Polygon', // 面
  MULTIPOINT: 'MultiPoint', // 多点
  MULTIPOLYLINE: 'MultiLineString', // 多线
  MULTIPOLYGON: 'MultiPolygon' // 多面
}
// 投影坐标系
const PROJ = {
  PREID: 'EPSG:', // OGC 投影坐标系前缀
  EPSG4326: 'EPSG:4326', // WGS84 经纬度坐标系
  EPSG3857: 'EPSG:3857', // WGS84 墨卡托投影坐标系（官方）
  EPSG900913: 'EPSG:900913', // 墨卡托投影坐标系（非官方）
  EPSG102113: 'EPSG:102113', // 墨卡托投影坐标系（非官方）———ArcGis 用
  GCJ02: 'GCJ02' // 墨卡托投影坐标系（非官方）———ArcGis 用
}
// 视频点位类型
const VIDEOTYPE = {
  boltipc: 'boltipc', // 枪机
  redBoltipc: 'redBoltipc', // 红外枪机
  halfBallipc: 'halfBallipc', // 半球
  fastBallipc: 'fastBallipc', // 快球
  allViewipc: 'allViewipc', // 全景
  verfaceipc: 'verfaceipc', // 人脸抓拍
  trafficipc: 'trafficipc' // 交通抓拍
}
// 视频点位类型key值
const VIDEOTYPEKEY = {
  boltipc: 0, // 枪机
  redBoltipc: 1, // 红外枪机
  halfBallipc: 2, // 半球
  fastBallipc: 3, // 快球
  allViewipc: 4, // 全景
  verfaceipc: 5, // 人脸抓拍
  trafficipc: 6 // 交通抓拍
}
// 监控点类型-业务类型
const CAMERATYPE = {
  normalipc: 0, // 普通
  verfaceipc: 1, // 人脸抓拍
  trafficipc: 2 // 交通抓拍
}
// 设备元素
const DEVELEMENT = {
  video: 'video', // 视频
  videSector: 'videSector', // 视频可视域
  commonAlarm: 'commonAlarm', // 普通报警
  alarmHost: 'alarmHost', // 报警主机
  fireAlarm: 'fireAlarm', // 消防报警
  alarmBox: 'alarmBox', // 报警箱
  alarmColumn: 'alarmColumn', // 报警柱
  patrol: 'patrol' // 巡更
}
// 地图标志key
const MPSIGNKEY = {
  point: 0, // 点
  lineString: 1, // 线
  polygon: 2 // 面
}
// 地图模式
const MAPMODE = {
  mode2D: '2D', // 2D地图
  point2D: 'point', // 2D地图点位信息字段
  mode3D: '3D', // 3D地图
  point3D: 'point3D', // 3D地图点位信息字段
  mapType3D: {superMap: 'SuperMap', fengMap: 'FengMap'}
  // modeEdit: 'param' // 地图配置参数
}
// 资源类型
const RESOURCETYPE = {
  video: 0, // 视频
  commonAlarm: 1, // 普通报警
  doorControl: 4, // 门禁
  fireAlarm: 11, // 消防报警
  alarmHost: 9, // 报警主机报警
  alarmBox: 'alarmBox', // 报警箱
  alarmColumn: 'alarmPillar', // 报警柱
  patrol: 'patrol', // 巡更
  single: 'single', // 单兵
  assist: 'assist', // 辅助
  grid: 'grid', // 网格
  building: 'building', // 楼宇
  floor: 'storey', // 楼层
  alarming: 'pointalarming',
  buildingAlarm: 'buildingAlarm'
}
// 资源要素类型
const FEATURETYPE = {
  icon: 'icon', // 图标
  geometry: 'geometry', // 几何图形
  label: 'label' // 标注
}
// 模型资源标识
const RESICONOID = {
  video: '0', // 视频
  videoArr: ['0', '00', '01', '02', '03', '04', '05', '06'], // 视频数组
  boltipc: '00', // 枪机
  redBoltipc: '01', // 红外枪机
  halfBallipc: '02', // 半球
  fastBallipc: '03', // 快球
  allViewipc: '04', // 全景
  verfaceipc: '05', // 人脸抓拍
  trafficipc: '06', // 交通抓拍
  alarmArr: ['1', '10', '90', '110'], // 报警数组
  alarm: '1', // 报警
  commonAlarm: '10', // 普通报警
  alarmHost: '90', // 报警主机
  fireAlarm: '110', // 消防报警
  doorControlArr: ['4', '41'], // 门禁数组
  doorControl: '41', // 门禁
  alarmHelpArr: ['13', '129', '130'], // 报警求助数组
  alarmHelp: '13', // 报警求助
  alarmBox: '130', // 报警箱
  alarmColumn: '129', // 报警柱
  patrol: '14', // 巡更
  patrolArr: ['14', '140', '141'], // 巡更数组
  commonPatrol: '140', // 常规巡更
  cluasterPatrol: '141', // 聚合巡更
  single: '151', // 单兵
  singleArr: ['15', '151'], // 单兵数组
  assist: '161', // 辅助
  assistArr: ['16', '161'] // 辅助数组
}
// 点位状态
const POINTSTATE = {
  SAVE: 'save',
  DRAW: 'draw',
  EDIT: 'edit',
  SELECT: 'select',
  ONLINE: 'online', // 在线
  OFFLINE: 'offline', // 离线
  UNUSE: 'stopped', // 禁用
  ALARM: 'alarm', // 报警
  ARMIMG: 'arming',
  UNARM: 'unarm',
  ALARMIMG: 'alarmimg',
  OPEN: 'open', // 门禁-开启
  CLOSE: 'close', // 门禁-关闭
  ABNORMAL: 'abnormal' // 门禁-异常
}
// 视频点位图标图层map
const VIDEOLABELLAYERMAP = new Map([
  ['boltipc', 'boltipcLabelLayer'], // 枪机
  ['redBoltipc', 'redBoltipcLabelLayer'], // 红外枪机
  ['halfBallipc', 'halfBallipcLabelLayer'], // 半球
  ['fastBallipc', 'fastBallipcLabelLayer'], // 快球
  ['allViewipc', 'allViewipcLabelLayer'], // 全景
  ['verfaceipc', 'verfaceipcLabelLayer'], // 交通抓拍
  ['trafficipc', 'atrafficipcLabelLayer'] // 人脸抓拍
])
// 视频点位标注图层map
const VIDEOICONLAYERMAP = new Map([
  ['boltipc', 'boltipc'], // 枪机
  ['redBoltipc', 'redBoltipc'], // 红外枪机
  ['halfBallipc', 'halfBallipc'], // 半球
  ['fastBallipc', 'fastBallipc'], // 快球
  ['allViewipc', 'allViewipc'], // 全景
  ['verfaceipc', 'verfaceipc'], // 交通抓拍
  ['trafficipc', 'trafficipc'] // 人脸抓拍
])
// 默认参数
const DEFAULTOPS = {
  singleTrackOpcity: 0.5, // 单兵轨迹颜色透明度
  singleHeadImg: '/static/noSolider.jpg', // 单兵头像图片
  locatePre: 'locate_',
  ballIpcTypes: [VIDEOTYPEKEY.fastBallipc, VIDEOTYPEKEY.halfBallipc, VIDEOTYPEKEY.allViewipc], // 球类ipc类型
  rotateIpcTypes: [RESICONOID.boltipc, RESICONOID.redBoltipc, RESICONOID.verfaceipc, RESICONOID.trafficipc], // 旋转ipc类型
  ballIpcAdjustAngle: 270, // 球类ipc调整角度
  outdoorLabelColor: '#000000', // 室外名称标签的颜色
  indoorLabelColor: '#ffffff' // 室内名称标签的颜色
}
export {
  GEOMETRYTYPE,
  PROJ,
  VIDEOTYPE,
  MAPMODE,
  DEVELEMENT,
  MPSIGNKEY,
  VIDEOTYPEKEY,
  CAMERATYPE,
  RESOURCETYPE,
  FEATURETYPE,
  POINTSTATE,
  RESICONOID,
  VIDEOICONLAYERMAP,
  VIDEOLABELLAYERMAP,
  DEFAULTOPS
}
