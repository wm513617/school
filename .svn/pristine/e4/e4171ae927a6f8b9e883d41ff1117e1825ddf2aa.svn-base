import Vue from 'vue'
import 'eventsource-polyfill'
import 'babel-polyfill'
import lodash from 'lodash'
import moment from 'moment'
import axios from 'axios'
import echarts from 'echarts'
import CryptoJS from 'crypto-js'
import dotProp from 'dot-prop'
import { sync } from 'vuex-router-sync'
import iView from 'bs-iview'
import Vuelidate from 'vuelidate'
import SuperMapCesium from '../static/supermapcesium/index'
import opengis from '../static/opengis/index'
import bsvue from './components/bsvue'
import { TimePicker, DatePicker, Pagination, Input, Tree, ButtonGroup, Button, Dialog, Form, FormItem, MessageBox, checkbox } from 'element-ui'
import './assets/js/indexedDb'
import './stored'
import './locales'
import 'jquery'
import bsValidate from './validate'
import store from './store'
import router, { hook as routerHook } from './router'

import '../src/assets/bsks-theme/index.less'
import '../src/assets/bsks-theme/echart.less'
import '../src/assets/bsks-theme/moudle.less'
import '../src/assets/bsks-theme/bsks.less'
import '../src/assets/js/directive-resize'
import './http'
import { formatIP } from 'http/video.api'
import './components'
import Notice from '../src/components/notice'
import App from './App'

Vue.use(bsvue)
Vue.use(opengis)
Vue.use(SuperMapCesium)
Vue.prototype.$lodash = Vue.lodash = lodash
Vue.prototype.$moment = Vue.moment = moment
Vue.prototype.$bsValidate = Vue.bsValidat = bsValidate
Vue.prototype.$CryptoJS = Vue.CryptoJS = CryptoJS
Vue.prototype.$dotProp = Vue.dotProp = dotProp
Vue.prototype.$formatDevIp = formatIP
Vue.prototype.$PageInfo = Vue.PageInfo = {
  limit: 100,
  size: [25, 50, 100, 200]
}
Vue.prototype.$http = Vue.http = axios
axios.defaults.baseURL = '/api'
Vue.prototype.$BShasPower = Vue.BShasPower = function(tag) {
  return true
  // const user = read('user.username')
  // if (user === 'admin') {
  //   return true
  // } else {
  //   const tagList = JSON.parse(read('BStagList'))
  //   return tagList.includes(tag)
  // }
}
Vue.prototype.$echarts = Vue.echarts = echarts
Vue.prototype.$chartList = Vue.chartList = []
window.onresize = function() {
  if (Vue.chartList.length > 0) {
    Vue.chartList.map(chart => {
      chart.resize()
    })
  }
}

sync(store, router)

Vue.use(iView)
Vue.use(Vuelidate)
Vue.config.keyCodes.ChangeFocus = [32, 110, 190]
iView.Message.config({
  top: 75
})

routerHook()

Vue.prototype.$Notice = Vue.$Notice = Notice
Vue.$Notice.config({
  errShow: store.state.config.tipError.show,
  errDur: store.state.config.tipError.dur,
  warningShow: store.state.config.tipWarning.show,
  warningDur: store.state.config.tipWarning.dur
})
Vue.prototype.errorMsg = msg => Notice.error({ title: '错误', desc: msg })
Vue.prototype.warningMsg = msg => Notice.warning({ title: '警告', desc: msg })
Vue.prototype.successMsg = msg => Notice.success({ title: '成功', desc: msg, duration: 2 })

Vue.ScrollOption = {
  color: '#657ca8',
  margin: '6px',
  width: '4px',
  background: '#14284b'
}

Vue.prototype.requestFullscreen = (element) => {
  element = element || document.documentElement
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen()
  }
}
Vue.prototype.exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen()
  }
}
Vue.component('el-input', Input)
Vue.component('el-tree', Tree)
Vue.component('el-buttongroup', ButtonGroup)
Vue.component('el-button', Button)
Vue.component('el-dialog', Dialog)
Vue.component('el-form', Form)
Vue.component('el-fotmitem', FormItem)
Vue.component('el-checkbox', checkbox)
Vue.prototype.$confirm = MessageBox.confirm
Vue.use(TimePicker)
Vue.use(DatePicker)
Vue.use(Pagination)

const opt = {
  router,
  store,
  ...App
}
const app = new Vue(opt)
app.$mount('app')
window.onbeforeunload = function() {
  app.$destroy()
}
