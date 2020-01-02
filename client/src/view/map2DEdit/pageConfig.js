// 编辑模式 网格、楼宇 右边编辑页面需要用到的数据结构，线、字体样式
export default {
  buildOneData: {
    name: '', // 楼宇名称
    charge: '', // 负责单位
    loc: '', // 位置信息
    code: '', // 楼宇编号
    desc: '', // 简介
    picture: '', // 楼宇图片
    center: '', // 楼宇中心点位
    rgbcolor: 'rgba(255, 0, 0, 0.5)',
    gid: {
      _id: '',
      loc: ''
    }, // 所属网格
    pid: [{ // 联系人列表
      name: '',
      mobile: ''
    }],
    mapId: '',
    style: {
      // 边框样式   实线 solid/虚线 dashed/点线 dotted
      borderstyle: 'solid',
      // 边框宽度
      borderwidth: '1',
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
      fontregular: 'normal',
      // 字体大小
      fontsize: '12'
    }
  },
  // borderStyleSelect
  borderStyleSelect: [{ // 线样式
    value: 'solid',
    label: '实线'
  }, {
    value: 'dashed',
    label: '虚线'
  }, {
    value: 'dotted',
    label: '点线'
  }],
  borderWidthSelect: [{ // 线粗细
    value: '1',
    label: '1px'
  }, {
    value: '2',
    label: '2px'
  }, {
    value: '3',
    label: '3px'
  }],
  fontSelect: [{ // 字体样式 -暂时没用
    value: '微软雅黑',
    label: '微软雅黑'
  }, {
    value: '宋体',
    label: '宋体'
  }, {
    value: '楷体',
    label: '楷体'
  }, {
    value: '仿宋',
    label: '仿宋'
  }, {
    value: 'Times New Roman',
    label: 'Times New Roman'
  }],
  regularSelect: [{ // 字体粗细
    value: 'normal',
    label: 'Regular'
  }, {
    value: '100',
    label: 'Light'
  }, {
    value: 'bold',
    label: 'Bold'
  }],
  fontSizeSelset: [{ // 字体大小
    value: '12',
    label: '12px'
  }, {
    value: '14',
    label: '14px'
  }, {
    value: '16',
    label: '16px'
  }],
  gridOneData: {
    name: '', // 网格名称
    charge: '', // 负责单位
    loc: '', // 位置信息
    code: '', // 网格编号
    desc: '', // 简介
    // picture: '', // 楼宇图片
    // center: '', // 楼宇中心点位,
    rgbcolor: 'rgba(255, 0, 0, 0.5)',
    gid: {
      _id: '',
      loc: ''
    }, // 所属网格
    pids: [{ // 联系人列表
      name: '',
      mobile: ''
    }],
    mapId: '',
    style: {
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
      // 字体
      font: '微软雅黑',
      // 字体颜色
      fontColor: '#FF0000',
      // 字体粗细
      fontRegular: 'normal',
      // 字体大小
      fontSize: '12'
    }
  }
}
