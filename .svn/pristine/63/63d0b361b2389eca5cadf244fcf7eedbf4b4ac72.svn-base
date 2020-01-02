// 默认线样式
export const defaultLineStyle = {
  // 设置线的宽度
  lineWidth: 5,
  // 设置线的透明度
  alpha: 0.9,
  // 箭头
  url: '/static/fengMap/resource/style/wedgets/img/arrow.png',
  // 是否开启平滑线功能
  smooth: true,
  // 设置线的颜色，十六进制颜色值 带箭头的线
  godColor: '#00c663',
  // 设置边线的颜色,十六进制颜色值 带箭头的线
  godEdgeColor: '#00c663',
  // 设置边线的颜色,十六进制颜色值 实线
  color: '#00c663',
  // 设置线的类型
  lineType: null,
  // 设置线动画,false为动画
  noAnimate: false,
  // 设置线的类型的数组index值
  lineTypeDes: 3
}

// 样式转换
export const getLineStyle = (defaultStyle, style) => {
  const lineStyle = defaultStyle.url ? defaultStyle : defaultLineStyle
  const lineStringStyle = JSON.parse(JSON.stringify(lineStyle))
  if (style) {
    if (style.lineType || style.lineType === 0) { lineStringStyle.lineTypeDes = style.lineType }
    if (style.lineWidth || style.lineWidth === 0) { lineStringStyle.lineWidth = style.lineWidth }
    if (style.alpha || style.alpha === 0) { lineStringStyle.alpha = style.alpha }
    if (style.color || style.color === '') {
      lineStringStyle.color = style.color
      lineStringStyle.godColor = style.color
      lineStringStyle.godEdgeColor = style.color
    }
  }
  return lineStringStyle
}
