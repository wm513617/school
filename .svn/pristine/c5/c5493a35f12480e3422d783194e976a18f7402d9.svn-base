import bsCover from './components/cover.vue'
import bsVideo from './components/videoFrame.vue'
import bsScroll from './components/scroll/scroll.vue'
import bsCrumb from './components/crumb.vue'
import bsProgressBar from './components/progressBar.vue'
import bsrSelect from './components/select.vue'
import playback from './videoImp/playback'
import preview from './videoImp/preview'
import local from './videoImp/local'
import disable from './directives/disable'
import 'font-awesome/css/font-awesome.min.css'

const components = {
  bsScroll,
  bsCover,
  bsVideo,
  bsCrumb,
  bsProgressBar,
  bsrSelect
}

const directives = {
  disable
}

const bsvue = {
  install(Vue) {
    Object.keys(components).forEach(item => Vue.component(components[item].name, components[item]))
    Object.keys(directives).forEach(item => Vue.directive(directives[item].name, directives[item]))
  },
  ...components,
  ...directives
}

export default bsvue
export { playback, preview, local }
