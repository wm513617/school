import Vue from 'vue'
import store from '../../../../store'
import router from '../../../../router'
import attrAlarm from '../../components/PTattributes/attributes/AttrAlarm'
import attrAlarmHelp from '../../components/PTattributes/attributes/AttrAlarmHelp'
import attrDoorControl from '../../components/PTattributes/attributes/AttrDoorControl'
import attrPatrol from '../../components/PTattributes/attributes/AttrPatrol'
import attrSingle from '../../components/PTattributes/attributes/AttrSingle'
import attrVideo from '../../components/PTattributes/attributes/AttrVideo'
export function componentMountToFMPopInfoWindow(params) {
  let option = {store, router}
  switch (params.pointsType) {
    case 'AttrAlarm' : // 报警属性面板
      Object.assign(option, attrAlarm)
      break
    case 'AttrAlarmHelp' : // 报警求助属性面板
      Object.assign(option, attrAlarmHelp)
      break
    case 'AttrDoorControl' : // 门禁属性面板
      Object.assign(option, attrDoorControl)
      break
    case 'AttrPatrol' : // 巡更属性面板
      Object.assign(option, attrPatrol)
      break
    case 'AttrSingle' : // 单兵属性面板
      Object.assign(option, attrSingle)
      break
    case 'AttrVideo' : // 视频属性面板
      Object.assign(option, attrVideo)
  }
  $('.fm-control-popmarker').css({background: '#1b3153',height:'auto'})
  $('.fm-control-popmarker-top').css({borderColor: '#1b3153 transparent transparent'})
  $('.fm-control-popmarker-closebtn').css({background: 'none', color: '#ffffff', cursor: 'pointer', top: '13px'})
  $('.fm-control-popmarker>div').css({overflow:'visible',height:'auto'})
  return new Vue(option).$mount('#FMPopInfoWindow')
}
