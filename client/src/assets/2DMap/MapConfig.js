/**
 * 地图、图层配置文件   胡红勋 2015-5-24
 */
import areaStyle from '../../view/map/style/areaStyle'
import SymbolConfig from './SymbolConfig'
export default {
  layers: {
    fireAlarmLayer: {
      id: 'fireAlarmLayer',
      name: '消防报警图层'
    },
    // 胡红勋添加 2018-09-06
    alarmHelpLayer: {
      id: 'alarmHelpLayer',
      name: '报警求助'
    },
    peopleTrack: {
      name: '人员轨迹',
      id: 'peopleTrack'
    },
    vehicleTrack: {
      name: '车辆轨迹',
      id: 'vehicleTrack'
    },
    videoIpc: {
      name: '视频点位',
      id: 'videoIpc',
      type: 'Point'
    },
    alarmIpc: {
      id: 'alarmIpc',
      name: '报警点位',
      type: 'Point',
      actived: false
    },
    alarming: {
      id: 'alarming',
      name: '报警图层',
      type: 'Point',
      actived: false
    },
    singleIpc: {
      id: 'singleIpc',
      name: '移动单兵点位',
      type: 'Point',
      actived: false
    },
    alarmingIpc: {
      id: 'alarmingIpc',
      name: '报警中的点位',
      type: 'Point',
      actived: false
    },
    patrolIpc: {
      id: 'patrolIpc',
      name: '巡更点位',
      type: 'Point',
      actived: false
    },
    patrolline: {
      id: 'patrolline',
      name: '巡更任务',
      type: 'Point',
      actived: false
    },
    sector: {
      name: '视频点位可视域',
      id: 'sector'
    },
    ipcPosition: {
      name: '点位定位图层',
      id: 'ipcPosition'
    },
    // 视频点位绘制
    pointDraw: {
      id: 'pointLayer',
      name: '点位图层',
      type: 'Point',
      actived: false,
      drawIpcStyle: null // 绘制点位draw控件的样式
    },
    vedioDraw: {
      id: 'videoIpc',
      name: '视频点位',
      type: 'Point',
      actived: false,
      drawIpcStyle: null // 绘制点位draw控件的样式
    },
    alarmDraw: {
      id: 'alarmIpc',
      name: '报警点位',
      type: 'Point',
      actived: false,
      drawIpcStyle: SymbolConfig.alarmPointUnSSymbol
    },
    patrolDraw: {
      id: 'patrolIpc',
      name: '巡更点位',
      type: 'Point',
      actived: false,
      drawIpcStyle: SymbolConfig.patrolUnSSymbol
    },
    // 网格楼宇绘制
    areaDraw: {
      id: '',
      name: '区域添加',
      type: 'MultiPolygon',
      actived: false,
      gridStyle: null,
      layerStyle: null
    },
    // 网格楼宇的编辑图层
    edit: {
      name: '编辑',
      id: 'editLayer',
      type: 'Polygon',
      ref: 'edit'
    },
    building: {
      name: '楼宇',
      id: 'buildingLayer',
      ref: 'buildLayer',
      type: 'Polygon'
    },
    grid: {
      name: '网格',
      id: 'gridLayer',
      ref: 'gridLayer',
      type: 'Polygon'
    },
    floor: {
      name: '楼层',
      id: 'floorLayer'
    },
    measure: {
      name: '量算',
      id: 'measureLayer',
      type: 'LineString',
      actived: false
    },
    draw: {
      name: '绘制',
      id: 'drawLayer'
    },
    statistic: {
      id: 'statistics',
      name: '统计',
      type: 'MultiPolygon',
      actived: false,
      drawStyle: areaStyle.statisticsDraw,
      layerStyle: areaStyle.statisticsDrawEnd
    },
    people: {
      name: '人员',
      id: 'peoplelayer'
    },
    car: {
      name: '车辆',
      id: 'carlayer'
    },
    carTrack: {
      name: '车辆轨迹',
      id: 'carTrackLayer'
    },
    element: {
      name: '元素',
      id: 'elementsLayer'
    },
    center: {
      name: '中心点',
      id: 'center'
    },
    navigate: {
      name: '导航',
      id: 'navigate'
    },
    positionHighLightLayer: {
      name: '定位高亮图层',
      id: 'positionHighLightLayer',
      isTop: true
    },
    buffer: {
      name: '缓冲区分析地址',
      url: '',
      id: 'buffer'
    }
  },
  gridType: {
    value: 'grid',
    label: '网格'
  },
  gridAppType: {
    value: 'gridApp',
    label: '网格'
  },
  buildType: {
    value: 'build',
    label: '楼宇'
  },
  buildAppType: {
    value: 'buildApp',
    label: '楼宇'
  }
}
