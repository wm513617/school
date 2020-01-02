<template>
  <div class="system" style="flex:1;display:flex;">
    <div class="bs-content">
      <div class="bs-left">
        <Menu theme="dark" @on-select="seletRoute" width="100%">
          <Menu-group title="本地配置">
            <Menu-item name="confParameter">播放参数</Menu-item>
            <Menu-item name="confStorage">存储配置</Menu-item>
          </Menu-group>
        </Menu>
      </div>
      <div class="bs-main">
        <component :is='activeComponents'></component>
      </div>
    </div>
  </div>
</template>
<script>
import confParameter from './confParameter'
import confStorage from './confStorage'
export default {
  components: {
    confParameter,
    confStorage
  },
  data() {
    return {
      activeComponents: 'confParameter'
    }
  },
  computed: {
  },
  methods: {
    seletRoute(name) {
      this.activeComponents = name
    }
  }
}
</script>
<style scoped>
.bs-left,.bs-main {
  min-height: 865px;
}
</style>
