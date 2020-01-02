import Vue from 'vue'
import {mapGetters} from 'vuex'
import store from '../../../../store'
import router from '../../../../router'
function MyComponent(options) {
  let MyComponent = Vue.extend(options)
  let itemComponent = new MyComponent()
  itemComponent.$store = store
  itemComponent.router = router
  return itemComponent.$mount('#FMPopInfoWindow')
}
export function getComponent(params) {
  if (params.pointsType === 'AttrAlarm') {
    let options = {
      template: '<div id="AttrAlarm">' +
               '<div class="attr-video attr-panel attr-arrow">' +
               '<header> <span class="title">报警点位</span></header>' +
               '<div class="info">' +
               '<span>{{attrInfo.name}}</span>' +
               '<button type="button" @click="alarmClick">点击</button>' +
               '</div>' +
               '</div>' +
               '</div>',
      methods: {
        alarmClick() {
          console.log(123)
          console.log(this)
        }
      },
      computed: {
        ...mapGetters('fengMapPoint', {
          attrInfo: 'getFengMapResourceAttributes'
        })
      }
    }
    return MyComponent(options)
  }
}
