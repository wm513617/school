function getShowStateByNum(obj) {
  let {
    online,
    offline,
    building
  } = obj
  let onlineShow
  let offlineShow
  let buildingShow = false
  if (online.toString() !== '0') {
    onlineShow = true
  }
  if (offline.toString() !== '0') {
    offlineShow = true
  }
  if (building.toString() !== '0') {
    buildingShow = true
  }
  return {
    onlineShow,
    offlineShow,
    buildingShow
  }
}
// 应用模式统计按钮
function addStaticPop(obj) {
  let {
    online,
    offline,
    building
  } = obj
  let result = getShowStateByNum(obj)
  let {
    onlineShow,
    offlineShow,
    buildingShow
  } = result
  let statChartOptions = {
    textStyle: {
      color: '#fff'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: [''],
      nameTextStyle: {
        padding: [10, 0, 0, 0]
      }
    },
    yAxis: {
      type: 'value',
      minInterval: 1
    },
    series: [{
      name: '在线设备',
      type: 'bar',
      stack: '总量',
      label: {
        normal: {
          show: onlineShow,
          formatter: '{a}--{c}'
        }
      },
      data: [online]
    }, {
      name: '离线设备',
      type: 'bar',
      stack: '总量',
      label: {
        normal: {
          show: offlineShow,
          formatter: '{a}--{c}'
        }
      },
      data: [offline]
    },
    // , {
    //   name: '网格数量',
    //   type: 'bar',
    //   label: {
    //     normal: {
    //       show: gridShow,
    //       formatter: '{a}--{c}'
    //     }
    //   },
    //   data: [grid]
    // }
    {
      name: '楼宇数量',
      type: 'bar',
      label: {
        normal: {
          show: buildingShow,
          formatter: '{a}--{c}'
        }
      },
      data: [building]
    }
    ]
  }
  return statChartOptions
}

function buildOrFlooorStaticPop(online, offline) {
  let onlineShow
  let offlineShow = false
  if (online.toString() !== '0') {
    onlineShow = true
  }
  if (offline.toString() !== '0') {
    offlineShow = true
  }
  let statChartOptions = {
    textStyle: {
      color: '#fff'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      top: '10px',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: [''],
      nameTextStyle: {
        padding: [10, 0, 0, 0]
      }
    },
    yAxis: {
      type: 'value',
      minInterval: 1
    },
    series: [{
      name: '在线设备',
      type: 'bar',
      stack: '总量',
      label: {
        normal: {
          show: onlineShow,
          formatter: '{a}--{c}'
        }
      },
      data: [online]
    }, {
      name: '离线设备',
      type: 'bar',
      stack: '总量',
      label: {
        normal: {
          show: offlineShow,
          formatter: '{a}--{c}'
        }
      },
      data: [offline]
    }]
  }
  return statChartOptions
}

function grigStaticPop(obj) {
  let {
    online,
    offline,
    building
  } = obj
  let result = getShowStateByNum(obj)
  let {
    onlineShow,
    offlineShow,
    buildingShow
  } = result
  let statChartOptions = {
    textStyle: {
      color: '#fff'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      top: '10px',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: [''],
      nameTextStyle: {
        padding: [10, 0, 0, 0]
      }
    },
    yAxis: {
      type: 'value',
      minInterval: 1
    },
    series: [{
      name: '在线设备',
      type: 'bar',
      stack: '总量',
      label: {
        normal: {
          show: onlineShow,
          formatter: '{a}--{c}'
        }
      },
      data: [online]
    }, {
      name: '离线设备',
      type: 'bar',
      stack: '总量',
      label: {
        normal: {
          show: offlineShow,
          formatter: '{a}--{c}'
        }
      },
      data: [offline]
    }, {
      name: '楼宇数量',
      type: 'bar',
      stack: '互联网',
      label: {
        normal: {
          show: buildingShow,
          formatter: '{a}--{c}'
        }
      },
      data: [building]
    }]
  }
  return statChartOptions
}

function allZoneStaticPop(obj) {
  let statChartOptions = {
    textStyle: {
      color: '#fff'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      top: '10px',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: [''],
      nameTextStyle: {
        padding: [10, 0, 0, 0]
      }
    },
    yAxis: {
      type: 'value',
      minInterval: 1
    },
    series: [{
      name: '在线设备',
      type: 'bar',
      stack: '总量',
      label: {
        normal: {
          show: true,
          formatter: '{a}--{c}'
        }
      },
      data: ['22']
    }, {
      name: '离线设备',
      type: 'bar',
      stack: '总量',
      label: {
        normal: {
          show: true,
          formatter: '{a}--{c}'
        }
      },
      data: ['2']
    }, {
      name: '楼宇数量',
      type: 'bar',
      stack: '互联网',
      label: {
        normal: {
          show: true,
          formatter: '{a}--{c}'
        }
      },
      data: ['1']
    }]
  }
  return statChartOptions
}
export default {
  addStaticPop,
  buildOrFlooorStaticPop,
  grigStaticPop,
  allZoneStaticPop
}
