// 网格、楼宇要素构造方法
import { GEOMETRYTYPE } from '../../meta/common'
// 区域加载管理函数 areaArr区域数组 区域样式style 区域类型type
function transFeatures(areaArr, style, layerConfig) {
  let arr = []
  for (let i = 0; i < areaArr.length; i++) {
    let area = areaArr[i]
    let styleC = JSON.parse(JSON.stringify(style)) // 深拷贝样式
    styleC = convertStyleToSymbol(styleC, area.style)
    styleC.textStyle.label = layerConfig.label + ':' + area.name
    arr.push({
      geom: {
        type: GEOMETRYTYPE.MULTIPOLYGON,
        points: area.loc
      },
      symbol: styleC,
      attributes: {
        id: area._id,
        type: layerConfig.name,
        rType: layerConfig.rType,
        loc: area.loc,
        label: area.name,
        style: area.style
      }
    })
  }
  return arr
}

/**
 * 单个区域加载管理函数
 * @param {*} area 区域数据
 * @param {*} style 样式
 * @param {*} layerConfig 图层配置
 */
function transOneFeature(area, style, layerConfig) {
  let styleC = JSON.parse(JSON.stringify(style)) // 深拷贝样式
  styleC = convertStyleToSymbol(styleC, area.style)
  styleC.textStyle.label = layerConfig.label + ':' + area.name
  return {
    geom: {
      type: GEOMETRYTYPE.MULTIPOLYGON,
      points: area.loc
    },
    symbol: styleC,
    attributes: {
      id: area._id,
      type: layerConfig.name,
      rType: layerConfig.rType,
      loc: area.loc,
      label: area.name,
      style: area.style
    }
  }
}

/**
 * 将设置或从数据库中获取的样式转换为openlayer地图需要的样式格式
 */
function convertStyleToSymbol(symbol, style) {
  let borderStyle = style.borderStyle || style.borderstyle // 边框样式
  let borderWidth = style.borderWidth || style.borderwidth // 边框宽度
  let borderColor = style.borderColor || style.bordercolor // 边框颜色
  let borderTransparency = style.borderTransparency || style.bodertransparency // 边框透明度
  let fillColor = style.fillColor || style.fillcolor // 填充颜色
  let fillColorTransparency = style.fillColorTransparency || style.fillcolortransparency // 填充透明度
  let font = style.font // 字体
  let fontColor = style.fontColor || style.fontcolor // 字体颜色
  let fontSize = style.fontSize || style.fontsize // 字体大小

  let newSymbol = JSON.parse(JSON.stringify(symbol))
  borderColor = changeColorFormat(borderColor)
  borderTransparency = borderTransparency / 100
  borderColor = transformColor(borderColor, borderTransparency)
  fillColor = changeColorFormat(fillColor)
  fillColorTransparency = fillColorTransparency / 100
  fillColor = transformColor(fillColor, fillColorTransparency)
  borderStyle = getBorderStyle(borderStyle)
  if (newSymbol) {
    if (newSymbol.fillColor) {
      newSymbol.fillColor = fillColor
    }
    if (newSymbol.strokeStyle) {
      newSymbol.strokeStyle.lineDash = borderStyle
      newSymbol.strokeStyle.outLineColor = borderColor
      newSymbol.strokeStyle.outLineWidth = parseFloat(borderWidth) // 需要数字
    }
    if (newSymbol.textStyle) {
      newSymbol.textStyle.fontFamily = font
      newSymbol.textStyle.fillColor = fontColor
      newSymbol.textStyle.fontSize = parseFloat(fontSize) / 10
    }
  }
  return newSymbol
}

/**
 * 改变颜色格式为rgb格式
 * @param {*} color 颜色值
 * @returns
 */
function changeColorFormat(color) {
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  if (color) {
    let sColor = color.toLowerCase()
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        let sColorNew = '#'
        for (let i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
        }
        sColor = sColorNew
      }
      // 处理六位的颜色值
      let sColorChange = []
      for (let j = 1; j < 7; j += 2) {
        sColorChange.push(parseInt('0x' + sColor.slice(j, j + 2)))
      }
      return 'rgb(' + sColorChange.join(',') + ')'
    } else {
      return sColor
    }
  }
}

/**
 * 转换颜色值
 * @param {*} color 颜色
 * @param {*} opcity 透明度
 * @returns
 */
function transformColor(color, opcity) {
  if (color) {
    let newColor = changeColorFormat(color)
    let hasOpcity = newColor.indexOf('rgba')
    let index = newColor.lastIndexOf(',')
    let num = newColor.indexOf(')')
    let colorStr = null
    if (hasOpcity > -1) {
      colorStr = newColor.substring(0, index + 1)
      colorStr = colorStr + opcity + ')'
    } else {
      colorStr = newColor.substring(3, num)
      colorStr = 'rgba' + colorStr + ',' + opcity + ')'
    }
    return colorStr
  }
}

/**
 * 获取边框样色
 * @param {*} style
 * @returns
 */
function getBorderStyle(style) {
  let symbol = null
  if (style === 'solid') {
    symbol = [1]
  }
  if (style === 'dashed') {
    symbol = [2, 4]
  }
  if (style === 'dotted') {
    symbol = [4, 6, 4]
  }
  return symbol
}

export default {
  transFeatures,
  transOneFeature,
  convertStyleToSymbol
}
