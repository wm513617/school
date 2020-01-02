/* eslint-disable camelcase */
require('dotenv').config()
const {
  NODE_ENV,
  WEB_PORT,
  NODE_HOST,
  NODE_PORT,
  SECRET,
  VIDEOUPLOAD_DIR,
  TEMPPIC_DIR,
  MODELFILE_DIR,
  MODELPICTURE_DIR,
  ICONPICTURE_DIR,
  PICCOMMON_DIR,
  VIDEOCOMMON_DIR,
  ALARM_URI,
  BSTARTCP_SERVER,
  BSTARTCP_PORT,
  PROXY_API,
  websockUrl,
  serviceUrl,
  mongoUri,
  mongoLogUri,
  mongoUserName,
  mongoPassword,
  BASE_DIR,
  FACEUSERPICUURE_DIR,
  FACEPASSERPICUURE_DIR,
  DEFENSEAUDIO_DIR,
  STOREYPIC_DIR,
  BUILDINGPIC_DIR,
  MAP_DIR,
  EXPORTALARMEXCELFILE_DIR,
  EXPORTPASSBYEXCELFILE_DIR,
  EXPORTIMAGEEXCELFILEDIR,
  NONVEHICLE_DIR,
  NONVEHICLETEMP_DIR,
  PEOPLE_DIR,
  PASSAGE_DIR,
  ALARMBACKUPDIR,
  downloadAlarmUrl,
  EXPORTSTRUCALARMEXCELFILE_DIR,
  EXPORTSTRUCINTEGRATEFILE_DIR,
  EXPORTSTRUCIMAGEFILE_DIR,
  MOTORDRIVERPIC_DIR,
  PASSVEHICLEPIC_DIR,
  MOTORDRIVERTEMP_DIR,
  ROADVEHICLEPIC_DIR,
  ALARMEVENTEXECLANDPDF_DIR,
  TRACKINGEXECLANDPDF_DIR
} = process.env

var path = require('path')
var _ = require('lodash')
var backendBase = {
  // Root path of server
  root: path.normalize(__dirname),
  // Server port
  port: NODE_PORT || 20000,
  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: SECRET || 'bs-security-secret'
  },
  // List of user roles
  userRoles: ['admin', 'user'],
  // MongoDB connection options
  mongo: {
    options: {
      useNewUrlParser: true,
      poolSize: 20
    },
    authOptions: {
      useNewUrlParser: true,
      poolSize: 20,
      user: mongoUserName,
      pass: Buffer.from(mongoPassword, 'base64').toString()
    }
  },
  // struct video upload dir
  videoDir: VIDEOUPLOAD_DIR || path.resolve(__dirname, './client/static/video'),
  fileDirs: {
    // base dir
    baseDir: BASE_DIR || path.resolve(__dirname, './server/public'),
    // temp dir
    tempDir: TEMPPIC_DIR || path.resolve(__dirname, './server/public/temp'),
    // 3d model file dir
    modelFileDir: MODELFILE_DIR || path.resolve(__dirname, './server/public/modelFile'),
    // 3d model picture dir
    modelPictureDir: MODELPICTURE_DIR || path.resolve(__dirname, './server/public/modelPicture'),
    // 2d map icon picture dir
    iconPictureDir: ICONPICTURE_DIR || path.resolve(__dirname, './server/public/iconPicture'),
    // common picture upload dier
    picCommon: PICCOMMON_DIR || path.resolve(__dirname, './server/public/common'),
    // common video upload dier
    videoCommon: VIDEOCOMMON_DIR || path.resolve(__dirname, './server/public/common'),
    // face image upload dir
    faceUserPictureDir: FACEUSERPICUURE_DIR || path.resolve(__dirname, './server/public/face/user'),
    facePasserPictureDir: FACEPASSERPICUURE_DIR || path.resolve(__dirname, './server/public/face/passer'),
    // faceUserPictureDir
    defenseAudioDir: DEFENSEAUDIO_DIR || path.resolve(__dirname, './client/static/face/audio'),
    // 楼层图片存储路径，2D 和 3D 的楼层图片在一起
    storeyPicDir: STOREYPIC_DIR || path.resolve(__dirname, './server/public/storey'),
    // 楼宇图片存储路径，只有 2D 楼宇有图片
    buildingPicDir: BUILDINGPIC_DIR || path.resolve(__dirname, './server/public/building'),
    // 静态地图图片
    mapPicDir: MAP_DIR || path.resolve(__dirname, './server/public/map'),
    //非机动车图片目录
    nonVehicleDir: NONVEHICLE_DIR || path.resolve(__dirname, './server/public/nonVehicle'),
    //非机动车上传临时目录
    nonVehicleTempDir: NONVEHICLETEMP_DIR || path.resolve(__dirname, './server/public/nonVehicleTemp'),
    // 人员通行模块人员管理上传目录
    peopleDir: PEOPLE_DIR || path.resolve(__dirname, './server/public/peopleDir'),
    // 人员通行模块人员通行刷身份证图片保存目录
    peoplePassage: PASSAGE_DIR || path.resolve(__dirname, './server/public/peoplePassage'),
    //报警记录备份目录
    alarmBackUpDir: ALARMBACKUPDIR || path.resolve(__dirname, './server/public/video/case'),
    // 机动车驾驶员照片
    motorDriverPicDir: MOTORDRIVERPIC_DIR || path.resolve(__dirname, './server/public/motorVehicle/driver'),
    // 机动车信息导入临时目录
    motorDriverTempDir: MOTORDRIVERTEMP_DIR || path.resolve(__dirname, './server/public/motorVehicle/temp'),
    // 过车图片路径
    passVehiclePicDir: PASSVEHICLEPIC_DIR || path.resolve(__dirname, './server/public/motorVehicle/passVehicle'),
    // 海康9600抓拍的主干道的过车图片
    roadVehiclePicDir: ROADVEHICLEPIC_DIR || './server/public/roadVehicle',
    // 结构化服务导出文件存储
    exportStrucAlarmExcelFileDir:
      EXPORTSTRUCALARMEXCELFILE_DIR || path.resolve(__dirname, './server/public/strucAlarm'),
    exportStrucIntegrateExcelFileDir:
      EXPORTSTRUCINTEGRATEFILE_DIR || path.resolve(__dirname, './server/public/strucIntegrate'),
    exportstrucImageExcelFileDir: EXPORTSTRUCIMAGEFILE_DIR || path.resolve(__dirname, './server/public/strucImage'),
    // 业务管理 案件管理导出 execl 和 pdf 文件的目录
    alarmEventExeclAndPdfDir: ALARMEVENTEXECLANDPDF_DIR || path.resolve(__dirname, './server/public/business/alarmEvent'),
    // 业务管理 接力追踪导出 execl 和 pdf 文件的目录
    trackingExeclAndPdfDir: TRACKINGEXECLANDPDF_DIR || path.resolve(__dirname, './server/public/business/tracking')
  },
  veriface: {
    cameraCfg: {
      pixel: 48, // 最小人脸像素
      interval: 1000,
      ambiguity: 0.7, // 模糊度
      roll: 25, // 翻滚角
      yaw: 27, // 偏航角
      pitch: 180 // 俯仰角
    }
  },
  // 核验分数，保存天数(人车同检)
  intelligentTraffic: {
    score: 70,
    days: 30
  },
  // 人车同检抓拍到的驾驶员图片裁剪参数
  driverPicParam: {
    left: 3796,
    top: 0,
    width: 300,
    height: 300
  },
  // frontend folder
  frontend: path.resolve(__dirname, './client/dist'),
  // white list
  whiteList: ['/api/security/auth/local', '/'],
  // bstar server url
  serviceUrl: serviceUrl || 'http://127.0.0.1',
  // alarm websocket server url
  websockUrl: websockUrl || 'ws://127.0.0.1/api/ws/alarm',
  // send alarm to alarm machine
  sendAlarmUrl: ALARM_URI || 'http://127.0.0.1:5000',
  /**
   * 文件分表间隔时间
   * eg:
   *   {second:x ,minute: x, hour: x, day: x, month: x, dayofweek: x}
   * or '* * * * * *'  (秒 分 时 日 月 年 )
   */
  createFileConnectTime: {
    second: 0,
    minute: 0,
    hour: 0
  }
}
const development = {
  frontend: {
    port: WEB_PORT,
    assetsRoot: path.resolve(__dirname, './client/src'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api/socket.io': {
        // target: 'http://192.168.78.109',
        target: PROXY_API,
        changeOrigin: true,
        ws: true
      },
      '/image/face': {
        // target: 'http://192.168.78.109',
        target: PROXY_API,
        changeOrigin: true
      },
      '/api/record': {
        target: serviceUrl,
        changeOrigin: true
      },
      '/api/ctl': {
        // target: 'http://192.168.78.109',
        target: serviceUrl,
        changeOrigin: true
      },
      '/api': {
        // target: 'http://127.0.0.1:' + backendBase.port
        // target: 'http://192.168.78.109'
        target: PROXY_API
      }
    },
    cssSourceMap: false
  },
  backend: _.merge({}, backendBase, {
    mongo: {
      uri: mongoUri || 'mongodb://192.168.20.51:27017/bs-security',
      logUri: mongoLogUri || 'mongodb://192.168.20.51:27017/bstar',
      logUriAuth: { user: mongoUserName, pass: Buffer.from(mongoPassword, 'base64').toString() }
    },
    // bstar server url
    serviceUrl: serviceUrl || 'http://192.168.20.7:80',
    // bstar tcp server host
    tcpServer: BSTARTCP_SERVER || '192.168.14.127',
    // bstar tcp server prot
    tcpPort: BSTARTCP_PORT || 7000,
    // alarm websocket server url
    websockUrl: websockUrl || 'ws://192.168.8.113/api/ws/alarm',
    //下载报警视频地址
    downloadAlarmUrl: downloadAlarmUrl || 'http://192.168.14.67:9002/rest/2.0/school/auth_none'
  })
}
const production = {
  frontend: {
    port: WEB_PORT,
    index: path.resolve(__dirname, './client/dist/index.html'),
    assetsRoot: path.resolve(__dirname, './client/dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    cssSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    proxyTable: {
      '/api/socket.io': {
        target: 'http://localhost:' + backendBase.port,
        changeOrigin: true,
        ws: true
      },
      '/api': {
        target: 'http://localhost:' + backendBase.port,
        changeOrigin: true
      }
    }
  },
  backend: _.merge({}, backendBase, {
    // whether backend servers the frontend,
    // you can use nginx to server frontend and proxy to backend services
    // if set to true, you need no web services like nginx
    serverFrontend: true,
    // Server IP
    ip: NODE_HOST || '0.0.0.0',
    // Server port
    port: NODE_PORT || 20000,
    // MongoDB connection options
    mongo: {
      uri: mongoUri || 'mongodb://127.0.0.1:27017/bs-security',
      logUri: mongoLogUri || 'mongodb://127.0.0.1:27017/bstar',
      logUriAuth: { user: mongoUserName, pass: Buffer.from(mongoPassword, 'base64').toString() }
    },
    fileDirs: {
      // base dir
      baseDir: BASE_DIR || '/opt/bstar/pic',
      // temp dir
      tempDir: TEMPPIC_DIR || '/opt/bstar/pic/temp',
      // 3d model file dir
      modelFileDir: MODELFILE_DIR || '/opt/bstar/pic/model/file',
      // 3d model picture dir
      modelPictureDir: MODELPICTURE_DIR || '/opt/bstar/pic/model/picture',
      // 2d map icon picture dir
      iconPictureDir: ICONPICTURE_DIR || '/opt/bstar/pic/icon/picture',
      // common picture upload dier
      picCommon: PICCOMMON_DIR || '/opt/bstar/pic/common',
      // common video upload dier
      videoCommon: VIDEOCOMMON_DIR || '/opt/bstar/video/common',
      // face image upload dir
      faceUserPictureDir: FACEUSERPICUURE_DIR || '/opt/bstar/pic/face/user',
      // face image upload dir
      facePasserPictureDir: FACEPASSERPICUURE_DIR || '/opt/bstar/pic/face/passer',
      // defense audio dir
      defenseAudioDir: DEFENSEAUDIO_DIR || '/static/face/audio',
      // 楼层图片存储路径，2D 和 3D 的楼层图片在一起
      storeyPicDir: STOREYPIC_DIR || '/opt/bstar/pic/storey',
      // 楼宇图片存储路径，只有 2D 楼宇有图片
      buildingPicDir: BUILDINGPIC_DIR || '/opt/bstar/pic/building',
      // 静态地图图片
      mapPicDir: MAP_DIR || '/opt/bstar/pic/map',
      //export excel data (alarm、passby、image)
      exportAlarmExcelFileDir: EXPORTALARMEXCELFILE_DIR || '/opt/bstar/data/excel/alarm',
      exportPassbyExcelFileDir: EXPORTPASSBYEXCELFILE_DIR || '/opt/bstar/data/excel/passby',
      exportImageExcelFileDir: EXPORTIMAGEEXCELFILEDIR || '/opt/bstar/data/excel/image',
      // 结构化服务导出文件存储
      exportStrucAlarmExcelFileDir: EXPORTSTRUCALARMEXCELFILE_DIR || '/opt/bstar/data/excel/strucAlarm',
      exportStrucIntegrateExcelFileDir: EXPORTSTRUCINTEGRATEFILE_DIR || '/opt/bstar/data/excel/strucIntegrate',
      exportstrucImageExcelFileDir: EXPORTSTRUCIMAGEFILE_DIR || '/opt/bstar/data/excel/strucImage',

      //非机动车图片目录
      nonVehicleDir: NONVEHICLE_DIR || '/opt/bstar/pic/nonVehicle',
      //非机动车临时目录(保存上传的excel文件)
      nonVehicleTempDir: NONVEHICLETEMP_DIR || '/opt/bstar/pic/nonVehicleTemp',
      // 人员通行模块人员管理上传目录
      peopleDir: PEOPLE_DIR || path.resolve(__dirname, '/opt/bstar/pic/peopleDir'),
      // 人员通行模块人员通行刷身份证图片保存目录
      peoplePassage: PASSAGE_DIR || path.resolve(__dirname, '/opt/bstar/pic/peoplePassage'),
      //报警记录备份目录
      alarmBackUpDir: ALARMBACKUPDIR || path.resolve(__dirname, '/opt/bstar/video/case'),
      // 机动车驾驶员备案照片
      motorDriverPicDir: MOTORDRIVERPIC_DIR || '/opt/bstar/pic/motorVehicle/driver',
      // 机动车信息导入临时目录
      motorDriverTempDir: MOTORDRIVERTEMP_DIR || '/opt/bstar/pic/motorVehicle/temp',
      // 过车图片路径
      passVehiclePicDir: PASSVEHICLEPIC_DIR || '/opt/bstar/pic/motorVehicle/passVehicle',
      // 海康9600抓拍的主干道的过车图片
      roadVehiclePicDir: ROADVEHICLEPIC_DIR || '/opt/bstar/pic/roadVehicle',
      // 业务管理 案件管理导出 execl 和 pdf 文件的目录
      alarmEventExeclAndPdfDir: ALARMEVENTEXECLANDPDF_DIR || '/opt/bstar/data/excel/business/alarmEvent',
      // 业务管理 接力追踪导出 execl 和 pdf 文件的目录
      trackingExeclAndPdfDir: TRACKINGEXECLANDPDF_DIR || '/opt/bstar/data/excel/business/tracking'
    },
    // frontend folder
    frontend: path.resolve(__dirname, './client/dist'),
    // bstar server url
    serviceUrl: serviceUrl || 'http://127.0.0.1',
    // bstar tcp server host
    tcpServer: BSTARTCP_SERVER || '127.0.0.1',
    // bstar tcp server prot
    tcpPort: BSTARTCP_PORT || 7000,
    // alarm websocket server url
    websockUrl: websockUrl || 'ws://127.0.0.1/api/ws/alarm',
    //下载报警视频地址
    downloadAlarmUrl: downloadAlarmUrl || 'http://192.168.14.67:9002/rest/2.0/school/auth_none'
  })
}
module.exports = _.assign({}, NODE_ENV === 'production' ? production : development)
