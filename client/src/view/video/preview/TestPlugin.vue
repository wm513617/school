<template>
  <div id="test-plugin"
       v-if="!value">
    <a class="download-link"
       download="BlueSkyWebPlayerSetup.exe"
       :href="src">{{title}}</a>
    <object id="testPlugin"
            type="application/x-webplayercontrol">
    </object>
  </div>
</template>

<script>
import { read } from 'src/store/modules/init.js'
import { pluginInit } from 'src/plugin/webPlugin.js'
export default {
  props: ['value'],
  data() {
    return {
      src: '/cgi-bin/downloadplus.py?session=' + read().session,
      title: '',
      pluginMix: null
    }
  },
  mounted() {
    this.pluginMix = pluginInit(this.$el.querySelector('#testPlugin'))
    this.title = this.pluginMix.toolTips
    this.$emit('input', this.pluginMix.valid)
  },
  beforeDestroy() {
    this.pluginMix = null
  }
}
</script>

<style scoped>
#test-plugin {
  width: 100%;
  height: 100%;
  position: relative;
}

.download-link {
  position: absolute;
  width: 100%;
  height: 26px;
  font-size: 26px;
  line-height: 26px;
  text-align: center;
  top: 50%;
  margin-top: -13px;
  cursor: pointer;
}

h3:hover {
  color: #fc6e30;
}

#testPlugin {
  position: fixed;
  top: -200px;
  left: -200px;
  width: 100px;
  height: 100px;
}
</style>
