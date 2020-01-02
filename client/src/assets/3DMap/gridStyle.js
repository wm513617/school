// 网格相关-----表单的默认样式-----
const gridStyle = {
  // 默认样式
  styleDefault: {
    // 边框样式   实线 solid/虚线 dashed/点线 dotted
    borderstyle: 'solid',
    // 边框宽度
    borderwidth: 1,
    // 边框颜色
    bordercolor: '#009944',
    // 边框透明度
    bodertransparency: 100,
    // 填充颜色
    fillcolor: '#FF0000',
    // 填充透明度
    fillcolortransparency: 50,
    // 字体颜色
    fontcolor: '#FF0000',
    // 字体
    font: '微软雅黑',
    // 字体粗细
    fontregular: 'normal',
    // 字体大小
    fontsize: '12px'
  },
  // 默认样式
  areaDefault: {
    // 边框样式   实线 solid/虚线 dashed/点线 dotted
    borderStyle: 'solid',
    // 边框宽度
    borderWidth: '1',
    // 边框颜色
    borderColor: '#FF0000',
    // 边框透明度
    borderTransparency: 100,
    // 填充颜色
    fillColor: '#FF0000',
    // 填充透明度
    fillColorTransparency: 50,
    // 字体颜色
    fontColor: '#FF0000',
    // 字体
    font: '微软雅黑',
    // 字体粗细
    fontRegular: 'normal',
    // 字体大小
    fontSize: '12'
  },
  gridStartDrawStyle: {
    textStyle: {
      label: '单击绘制网格',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/grid.png',
      anchor: [0, 15],
      scale: 0.1
    },
    strokeStyle: {
      outLineColor: '#ff0000',
      outLineWidth: 1,
      lineDash: [1]
    },
    fillColor: 'rgba(255,0,0,0.25)'
  },
  // 网格绘制完成
  gridDrawEndStyle: {
    strokeStyle: {
      outLineColor: '#ff0000',
      outLineWidth: 1,
      lineDash: [1]
    },
    fillColor: 'rgba(255,0,0,0.5)'
  },
  // 编辑网格时样式
  gridEditStyle: {
    strokeStyle: {
      outLineColor: '#009944',
      outLineWidth: 3,
      lineDash: [1]
    },
    fillColor: 'rgba(235,71,128,0.6)'
  },
  statisticsDraw: {
    textStyle: {
      label: '单击绘制统计区域,双击结束',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/grid.png',
      anchor: [0, 15],
      scale: 0.1
    },
    strokeStyle: {
      outLineColor: '#009944',
      outLineWidth: 1,
      lineDash: [1]
    },
    fillColor: 'rgba(67,204,190,0.1)'
  },
  statisticsStartDraw: {
    textStyle: {
      label: '单击继续绘制，双击结束',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/grid.png',
      anchor: [0, 15],
      scale: 0.1
    },
    strokeStyle: {
      outLineColor: '#009944',
      outLineWidth: 1,
      lineDash: [1]
    },
    fillColor: 'rgba(67,204,190,0.1)'
  },
  statisticsDrawEnd: {
    strokeStyle: {
      outLineColor: '#009944',
      outLineWidth: 1,
      lineDash: [1]
    },
    fillColor: 'rgba(67,204,190,0.4)'
  }
}
export default gridStyle
