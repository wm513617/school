<template>
<div style="width:100%">
  <theme></theme>
  <div class="flex flex-1"
       style="width:100%;height:calc(100% - 70px);position: relative;">
    <transition name="router"
                mode="out-in">
      <div class="router-view">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </div>
    </transition>
    <!-- 内嵌运维网页 -->
    <div class="ops-page" v-if="routerUrl !== 'false'"><iframe :src="routerUrl"></iframe></div>
  </div>
</div>
</template>
<script>
import theme from '../components/navigation/theme'
import { mapState } from 'vuex'
export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      routerUrl: ({ opsManage }) => opsManage.routerUrl
    })
  },
  components: {
    theme
  }
}
</script>
<style lang="less" scoped>
.router-enter-active,
.router-leave-active {
  transition: all 0.4s cubic-bezier(0, 0, 0, 1);
}

.router-enter,
.router-leave-active {
  opacity: 0.1;
}

.router-enter {
  transform: translate3D(100%, 0, 0);
}

.router-leave-active {
  transform: translate3D(-100%, 0, 0);
}

.router-view {
  flex: 1;
  display: flex;
}
.ops-page {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 99;
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
}
</style>
