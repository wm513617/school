<template>
  <div class="tv-box" style="flex:1">
    <div class="one-wall-tab">
      <TVWallLeft @changeToAuto="changeToAuto" :enableController="enableController"></TVWallLeft>
      <div class="right-con">
        <div id="btns">
          <Button-group size="small" style="border:1px solid #287fe0;border-radius: 4px;color: rgba(255, 255, 255, 0.5">
            <Button v-if="!enableController" :class="{'active-btn': isControl}" @click="collageControl">启用拼控</Button>
            <Button :class="{'active-btn': !isControl}" @click="switchLayout(false)">应用模式</Button>
          </Button-group>
        </div>
        <div>
          <div v-if="isControl" class="control-box">
            <iframe :src="'http://' + url.replace('http://', '')"></iframe>
          </div>
          <TVWallApp ref="tvwallapp"></TVWallApp>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TVWallLeft from './TVWallLeft'
import TVWallApp from './TVWallApp'
import common from './tvcommon'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  components: {
    TVWallLeft,
    TVWallApp
  },
  mixins: [common],
  data() {
    return {
      isControl: false,
      collageControlConfig: false,
      brandList: [
        {
          value: 0,
          label: '海康'
        }
      ],
      controlConfigCustom: {
        brand: 0,
        address: '',
        port: ''
      },
      url: ''
    }
  },
  props: {
    tvWallData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  computed: {
    ...mapState({
      rtscene: ({ tvwall }) => tvwall.rtscene
    }),
    enableController() {
      const item = this.tvWallData.jointcontroller
      if (item) {
        this.SET_ENABLE_CONTROLLER(item.checked)
        return item.checked
      } else {
        this.SET_ENABLE_CONTROLLER(false)
        this.getControls()
        return false
      }
    }
  },
  methods: {
    ...mapActions(['getControl', 'addControl', 'getAllLayoutList', 'getMonitorList']),
    ...mapMutations(['SET_ENABLE_CONTROLLER']),
    changeToAuto() { // 场景切换,兄弟组件通讯
      this.$refs.tvwallapp.isManual = true
      // this.$refs.tvwallapp.closeTV()//停止解码
    },
    switchLayout() {
      this.isControl = false
    },
    collageControl() {
      if (this.url === '') {
        return this.$Notice.error({
          title: '错误',
          desc: '请先配置拼控',
          duration: 3
        })
      }
      this.isControl = true
    },
    getControls() {
      this.getControl()
        .then(resp => {
          this.url = resp.data.port !== 0 ? `${resp.data.url}:${resp.data.port}` : resp.data.url
        })
        .catch(err => {
          console.error('getControl', err)
        })
    }
  },
  created() {
    this.getAllLayoutList()
    this.getMonitorList()
  }
}
</script>
<style lang="less" scoped>
.right-con {
  flex: 1;
  padding: 0 16px;
}
.right-con > div {
  height: 100%;
}
.tv-box {
  overflow: hidden;
  height: 100%;
}
.one-wall-tab {
  display: flex;
  width: 100%;
  padding-top: 16px;
  height: ~'calc(100% - 41px)';
}
#btns {
  margin-right: 16px;
  padding-top: 7px;
  position: absolute;
  z-index: 1000;
  height: 45px;
  top: 55px;
  right: 0;
}
#btns .active-btn {
  color: #fff;
  background: #287fe0;
}
.control-box {
  position: absolute;
  top: 129px;
  bottom: 16px;
  left: 316px;
  right: 16px;
  background: #fff;
  z-index: 999;
}
.control-box iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
