// 编辑模式绘制网格、楼宇的样式;应用模式绘制统计的样式
const areaStyle = {
  // 默认样式
  styleDefault: {
    // 边框样式   实线 solid/虚线 dashed/点线 dotted
    borderstyle: 'solid',
    // 边框宽度
    borderwidth: 1,
    // 边框颜色
    bordercolor: '#FF0000',
    // 边框透明度
    bodertransparency: 100,
    // 填充颜色
    fillcolor: '#FF0000',
    // 填充透明度
    fillcolortransparency: 50,
    // 字体
    font: '微软雅黑',
    // 字体颜色
    fontcolor: '#FF0000',
    // 字体粗细
    // fontregular: 'normal',
    // 字体大小
    fontsize: '12px'
  },
  // 网格绘制时样式
  gridDraw: {
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
      url: '../../../../static/grid.png',
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
  gridStartDraw: {
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
      url: '../../../../static/grid.png',
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
  // 网格绘制完成
  gridDrawEnd: {
    strokeStyle: {
      outLineColor: '#009944',
      outLineWidth: 1,
      lineDash: [1]
    },
    fillColor: 'rgba(67,204,190,0.4)'
  },
  // 编辑网格时样式
  gridHighLight: {
    strokeStyle: {
      outLineColor: '#009944',
      outLineWidth: 1,
      lineDash: [1]
    },
    fillColor: 'rgba(235,71,128,0.6)',
    textStyle: {
      label: '',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#FED202',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    }
  },
  // 网格样式
  gridStyle: {
    strokeStyle: {
      outLineColor: '#009944',
      outLineWidth: 1,
      lineDash: [1]
    },
    fillColor: 'rgba(67,204,190,0.4)',
    textStyle: {
      label: '',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#FE021A',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    }
  },
  // 楼宇绘制时样式
  buildDraw: {
    textStyle: {
      label: '单击绘制楼宇',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '../../../../static/building.png',
      anchor: [0, 15],
      scale: 0.1
    },
    strokeStyle: {
      outLineColor: '#1bd3fb',
      outLineWidth: 1,
      lineDash: [1]
    },
    fillColor: 'rgba(6,61,187,0.1)'
  },
  buildStartDraw: {
    textStyle: {
      label: '单击绘制楼宇',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '../../../../static/building.png',
      anchor: [0, 15],
      scale: 0.1
    },
    strokeStyle: {
      outLineColor: '#1bd3fb',
      outLineWidth: 1,
      lineDash: [1]
    },
    fillColor: 'rgba(6,61,187,0.1)'
  },
  // 楼宇绘制完成
  buildDrawEnd: {
    strokeStyle: {
      outLineColor: '#1bd3fb',
      outLineWidth: 1,
      lineDash: [1]
    },
    fillColor: 'rgba(6,61,187,0.4)'
  },
  // 编辑楼宇时样式
  buildHighLight: {
    strokeStyle: {
      outLineColor: '#1bd3fb',
      outLineWidth: 1,
      lineDash: [1]
    },
    fillColor: 'rgba(6,61,187,0.6)',
    textStyle: {
      label: '',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#06E3B2',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    }
  },
  // 楼宇样式
  buildStyle: {
    strokeStyle: {
      outLineColor: '#1bd3fb',
      outLineWidth: 1,
      lineDash: [1]
    },
    fillColor: 'rgba(6,61,187,0.4)',
    textStyle: {
      label: '',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#FED202',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1]
    }
  },
  // 统计绘制时样式
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
      url: '../../../../static/grid.png',
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
      url: '../../../../static/grid.png',
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
  // 统计绘制完成
  statisticsDrawEnd: {
    strokeStyle: {
      outLineColor: '#009944',
      outLineWidth: 1,
      lineDash: [1]
    },
    fillColor: 'rgba(67,204,190,0.4)'
  }
}
export default areaStyle
