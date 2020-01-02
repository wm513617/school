
<script>
import Vue from 'vue'
import $ from 'jquery'
import 'jquery-mousewheel'
import 'malihu-custom-scrollbar-plugin'
import '../assets/css/jquery.mCustomScrollbar.css'

Vue.directive('scroll', {
  bind(el, { value }) {
    if (value && value.useScroll === false) {
      return
    }
    Vue.nextTick(() => {
      $(el).mCustomScrollbar({
        mouseWheelPixels: 60,
        mouseWheel: true,
        theme: 'dark',
        callbacks: value
      })
    })
  },
  update(el) {
    $(el).mCustomScrollbar('update')
  },
  unbind(el) {
    // $(el).mCustomScrollbar("destroy");
  }
})
</script>
<style>
.mCSB_inside > div.mCSB_container {
  margin-right: 0;
}

.mCSB_scrollTools .mCSB_dragger div.mCSB_dragger_bar {
  width: 6px;
  margin: 0;
}

div.mCSB_scrollTools {
  width: 6px;
  opacity: 1;
}

.mCSB_draggerRail {
  display: none;
}

div.mCS-dark.mCSB_scrollTools .mCSB_dragger:active .mCSB_dragger_bar,
div.mCS-dark.mCSB_scrollTools
  .mCSB_dragger.mCSB_dragger_onDrag
  .mCSB_dragger_bar {
  background: #909090;
}

div.mCS-dark.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar,
div.mCS-dark.mCSB_scrollTools:hover .mCSB_dragger .mCSB_dragger_bar {
  background: #666666;
}

div.mCSB_scrollTools .mCSB_draggerContainer {
  background: #444444;
  border-radius: 3px;
  margin-top: 1px;
}
</style>
