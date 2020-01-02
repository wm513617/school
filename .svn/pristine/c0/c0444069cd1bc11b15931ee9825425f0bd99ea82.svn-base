/**
 * 地图、图层配置文件   胡红勋 2015-5-24
 */
import gridStyle from './gridStyle'
import {GeometryType} from './GeometryType'
export default {
  layers: {
    fireAlarmLayer: {
      id: 'fireAlarmLayer',
      name: '消防报警图层'
    },
    alarmHelpLayer: {
      id: 'alarmHelpLayer',
      name: '报警求助'
    },
    alarmBoxLayer: {
      id: 'alarmBoxLayer',
      name: '报警箱'
    },
    alarmColumnLayer: {
      id: 'alarmColumnLayer',
      name: '报警柱'
    },
    vedioLayer: {
      name: '视频点位',
      id: 'vedioLayer'
    },
    commonAlarmLayer: {
      id: 'commonAlarmLayer',
      name: '报警点位'
    },
    alarmingLayer: {
      id: 'alarmingLayer',
      name: '报警图层'
    },
    patrolLayer: {
      id: 'patrolLayer',
      name: '巡更点位',
      type: 'Point',
      actived: false
    },
    // 绘制要素时的临时图层--
    pointLayer: {
      id: 'pointLayer',
      name: '点位图层',
      type: 'Point',
      actived: false,
      drawIpcStyle: null // 绘制点位draw控件的样式
    },
    // 编辑要素时的临时图层
    editLayer: {
      name: '编辑',
      id: 'editLayer',
      type: 'Polygon',
      ref: 'edit'
    },
    gridLayer: {
      name: '网格',
      id: 'gridLayer',
      ref: 'gridLayer',
      type: 'Polygon'
    },
    positionHighLightLayer: {
      name: '定位高亮图层',
      id: 'positionHighLightLayer',
      isTop: true
    },
    // 绘制工具的相关配置-----
    drawConfig: {
      id: 'pointLayer',
      name: '点位图层',
      type: 'Point',
      actived: false,
      drawStyle: null // 绘制点位draw控件的样式
    },
    gridConfig: {
      name: '网格',
      id: 'gridLayer',
      type: 'MultiPolygon',
      actived: false,
      drawStyle: gridStyle.gridStartDrawStyle
    },
    areaQuery: {
      id: 'areaQuery',
      name: '区域查询',
      type: 'MultiPolygon',
      actived: false,
      drawStyle: gridStyle.statisticsDraw,
      layerStyle: gridStyle.statisticsDrawEnd
    },
    measure: { // 测量
      id: 'measureLayer',
      name: 'measure',
      type: GeometryType.POLYLINE,
      actived: false,
      clear: false // 是否清空
    }
  }
}
