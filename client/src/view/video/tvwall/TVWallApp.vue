<template>
  <div style="height: 100%;position:relative;">
    <div class="theme-bg">
      <div class="tvwall-title">
        <span class="title-item" :title='curSceneName'>当前场景： {{curSceneName}}</span>
        <span class="title-item" :title='curPlanName'>当前预案： {{curPlanName}}</span>
        <span class="title-item" :title='curLayoutName'>当前布局： {{curLayoutName}}</span>
        <span class="title-item last-item" :title='curpollingName'>当前轮询：{{curpollingName}}</span>
      </div>
    </div>
    <div class="video-con">
      <div class="no-plugin" :style="{height: '100%', background: '#404040'}" v-if="showDownload">
        <a :href="pluginDownloadUrl" target="_blank">{{showTips}}</a>
        <Icon type="help-circled" title="安装后仍然提示?" @click.native="showHelp" />
      </div>
      <div class="tv" v-else v-for="(tv, index) in tvs"
        :style="{
          width: tv.width || wd,
          height: tv.height || ht,
          top: tv.top,
          left: tv.left,
          bottom: tv.bottom,
          position: tv.posit,
          right: tv.right,
          zIndex: 100 - index}"
        :class="{'a-frame': index == activedIndex}" :key="index" @click="activedIndex=index" @dragover.prevent.stop @drop.prevent.stop="handleDrop">
        <bs-video :style="{height: bsHeight, position:'relative'}" ref="frame" :showNum="tv.panecount" :count="16" :pluginCOM="TVWallVideoPlugin" :COMprops="Array(16).fill({pindex: index, bgColor: bgColors})" @update:activedVM="avm => activedPane = avm.index " @on-dblclick="i => dblclickEvent(index, i)">
          <bs-cover class="showbignum" v-show="showNumber" v-model="showNumber">{{tv.code}}</bs-cover>
        </bs-video>
        <div class="theme-pane" v-if="!enableController" style="position:relative;height:30px;line-height:30px;padding-left: 10px;width:100%;">
          <span class="tvname">{{tv.name1 || tv.name}}</span>
          <Checkbox v-if="!tv.nodef && !isManual"  style="position:absolute; right: 5px" :value="tv.type === 2" @on-change="v => changeAlarm(v, index)">设为报警屏</Checkbox>
        </div>
        <!-- </VideoFrame> -->
      </div>
      <div class="bg-box" v-if="enableController && !showDownload">
        <div :style="bgBoxStyle" v-for="(tv, index) in bgTV" :key="index">
          <span class="inner-number">{{index + 1}}</span>
        </div>
      </div>
    </div>
    <div class="bottom">
      <i class="icon iconfont" :class="!isManual?'icon-auto-control':'icon-manual-control'" :title="!isManual?'自动控制':'手动控制'" @click="(!showDownload) && (isManual=!isManual)"></i>
      <i class="icon iconfont" :class="state.isPlay?'icon-preview-stop':'icon-preview'" :title="state.isPlay?'停止预览':'打开预览'" @click="(!showDownload) && (state.isPlay?closePlay():openPlay())"></i>
      <i class="icon iconfont icon-preview-stopall" title="全部停止预览" @click="closeAll"></i>
      <i class="icon iconfont icon-decode-stop" title="停止解码" v-show="!isManual" @click="closeTV"></i>
      <i class="icon iconfont icon-decode-stopall" title="全部停止解码" v-show="!isManual" @click="closeAllTV"></i>
      <i class="icon iconfont icon-yuntai" :title="state.isPTZ? '关闭云台': '云台控制'" @click="dome"></i>
      <i class="icon iconfont" :class="state.isVolumeOpen?'icon-volume':'icon-mute'" :title="state.isVolumeOpen?'关闭音频':'打开音频'" v-show="!isManual" @click="state.isVolumeOpen?closeVolume():openVolume()"></i>

      <div v-show="!isManual" class="dp-con" @mouseenter="(showscreenShow=true)&&(hoverShowscreen=selectedShowscreen)" @mouseleave="showscreenShow=false">
        <!-- <button class="theme-btn tv-btn" :class="{'tvbtn-hover':showscreenShow}">窗口分割</button> -->
        <i class="icon iconfont icon-multi-screen" title="窗口分割"></i>
        <ul v-show="showscreenShow">
          <i></i>
          <li v-for="screen in showscreenList" :key="screen.value" @mouseenter="hoverShowscreen=screen.value" @click="setShowscreen1(screen.value)" :class="{active: screen.value===hoverShowscreen}">{{screen.label+'画面'}}</li>
        </ul>
      </div>

      <i class="icon iconfont" :class="showNumber? 'icon-number-hide': 'icon-number-display'" :title="showNumber? '隐藏编号': '显示编号'" @click="toggleShownum"></i>
    </div>
  </div>
</template>
<script>
import TVWallVideoPlugin from './TVWallVideoPlugin'
import $ from 'jquery'
import { find } from 'lodash'
import { mapState, mapActions, mapGetters } from 'vuex'
import common from './tvcommon'
import planTimer from './planTimer'
import versionCheck from '../../../components/video/pluginVersionCheck.js'
export default {
  mixins: [common, planTimer, versionCheck],
  data() {
    return {
      TVWallVideoPlugin,
      isManual: true,
      state: {
        showscreen: 0,
        isPlay: false,
        isVolumeOpen: false,
        isPTZ: false
      },
      showscreenList: [
        {
          value: 1,
          label: '单'
        },
        {
          //   value: 3,
          //   label: '三'
          // }, {
          value: 4,
          label: '四'
        },
        {
          value: 9,
          label: '九'
        },
        {
          value: 16,
          label: '十六'
        }
      ],
      showscreenShow: false,
      hoverShowscreen: 1,
      activedIndex: 0, // 激活的监视器
      activedPane: -1, // 激活的窗格
      activeAll: [],
      showNumber: false,
      playingIndex: null,
      resType: '', // 镜头的类型
      usePage: 'video',
      tvList: [],
      row: 0,
      clo: 0,
      bgColors: { color: '' }
    }
  },
  computed: {
    ...mapState({
      scenes: ({ tvwall }) => tvwall.sceneList,
      tvwall: ({ tvwall }) => tvwall.tvwall,
      plans: ({ tvwall }) => tvwall.planList,
      rtscene: ({ tvwall }) => tvwall.rtscene,
      monitors: ({ tvwall }) => tvwall.monitorList,
      enableController: ({ tvwall }) => tvwall.enableController
    }),
    ...mapGetters(['layout', 'bgColor', 'bgBoxStyle', 'bgTV']),
    bsHeight() {
      return this.enableController ? '100%' : 'calc(100% - 30px)'
    },
    isNowAlarmScreen() {
      return this.tvs[this.activedIndex].type === 2
    },
    infos() {
      if (!this.rtscene) {
        return []
      }
      this.rtscene.info.length > 0 ? (this.bgColors.color = '#000') : (this.bgColors.color = 'rgb(204, 204, 204)')
      return this.rtscene.info
    },
    curSceneName() {
      if (this.tvwall.selectedscene) {
        const result = this.$lodash.find(this.scenes, item => item._id === this.tvwall.selectedscene)
        return result !== undefined ? result.name : '未定义'
      } else {
        return '未定义'
      }
    },
    curLayoutName() {
      return this.layout.name
    },
    curpollingName() {
      if (this.rtscene.polling && this.rtscene.polling.length > 0) {
        return this.rtscene.polling
          .map(obj => {
            return obj.name
          })
          .toString()
      } else {
        return '未执行'
      }
    },
    curPlanName() {
      if (this.tvwall.selectedplan) {
        const plan = find(this.plans, item => item._id === this.tvwall.selectedplan)
        return plan ? plan.name : '未执行'
      } else {
        return '未执行'
      }
    },
    tvs() {
      if (this.showDownload) {
        return []
      }
      if (this.enableController) {
        this.setControllerList()
      } else {
        const count = this.layout.column * this.layout.row
        if (count === 0) {
          return []
        }
        this.setTvsList(count)
      }
      return this.tvList
    },
    wd() {
      return !this.enableController
        ? (1 / this.layout.column) * 100 + '%'
        : this.layout.screeninfo.width * this.row + 'px'
    },
    ht() {
      return !this.enableController
        ? (1 / this.layout.row) * 100 + '%'
        : this.layout.screeninfo.height * this.clo + 'px'
    },
    frame() {
      return this.$refs.frame[this.activedIndex]
    },
    frames() {
      return this.$refs.frame
    },
    selectedShowscreen() {
      return this.state.showscreen
    },
    disablePTZ() {
      return this.resType === 0 || this.resType === 1
    }
  },
  watch: {
    activedIndex(i) {
      this.changeActive()
    },
    activedPane(old, val) {
      // 公共组件抛出值从1开始
      this.changeActive()
    },
    tvs(val) {
      if (this.showDownload || this.tvs.length < 1) {
        return
      }
      this.$nextTick(this.setFrameNum)
    }
  },
  methods: {
    ...mapActions([
      'updateRtScene',
      'openWall',
      'closeWall',
      'getSingleResource',
      'closeAllWall',
      'setScreenSplit',
      'toggleShowNumAPI',
      'fullDisplay',
      'recordLog'
    ]),
    proportionRow() {
      if (!this.layout.screeninfo) {
        return 0
      }
      // 横向
      const row = this.layout.row
      const clientWidth = document.body.clientWidth - 332 // 浏览器可是区域宽度
      const physicalWidth =
        this.layout.screeninfo.width * this.layout.column + (row - 1) * this.layout.screeninfo.hinterval // 物理宽度
      this.row = clientWidth / physicalWidth
    },
    proportionClo() {
      if (!this.layout.screeninfo) {
        return 0
      }
      // 纵向
      const clo = this.layout.column
      const clientHeight = document.body.clientHeight - 238.6 // 浏览器可是区域高度
      const physicalHeight =
        this.layout.screeninfo.height * this.layout.row + (clo - 1) * this.layout.screeninfo.vinterval // 物理宽度
      this.clo = clientHeight / physicalHeight
    },
    setControllerList() {
      this.tvList.length = 0
      this.proportionRow()
      this.proportionClo()
      // 暂且当做监视器列表等于拼接屏下的监视器列表
      this.layout.wininfo.length > 0 &&
        this.layout.wininfo.forEach(item => {
          for (let i = 0; i < this.monitors.length; i++) {
            if (this.monitors[i]._id === item.monitor) {
              const obj = {
                nodef: false,
                posit: 'absolute',
                monitor: true, // 都有监视器
                resources: [],
                ...this.monitors[i]
              }
              obj.top = `${item.top * this.clo}px`
              obj.bottom = `${item.bottom * this.clo}px`
              obj.left = `${item.left * this.row}px`
              obj.right = `${item.right * this.row}px`
              if (item.hasOwnProperty('top') && item.hasOwnProperty('bottom')) {
                obj.height = `${(item.bottom - item.top) * this.clo}px`
              }
              if (item.hasOwnProperty('left') && item.hasOwnProperty('right')) {
                obj.width = `${(item.right - item.left) * this.row}px`
              }
              return this.tvList.push(obj)
            }
          }
        })
      if (this.infos.length > 0) {
        console.log(this.infos, '45454545')
        this.infos.forEach(item => {
          if (this.tvList.length > 0) {
            this.tvList.forEach(tv => {
              if (item.monitor === tv._id) {
                tv.resources = item.resources ? item.resources : []
              }
            })
          }
        })
      }
      if (this.tvList.length > 0) {
        this.state.showscreen = this.tvList[0].panecount
      }
    },
    setTvsList(count) {
      this.tvList = []
      for (let i = 0; i < count; i++) {
        this.tvList.push({
          name: '未设置',
          nodef: true,
          panecount: 4,
          type: 0
        })
      }
      if (this.infos.length > 0) {
        this.infos.forEach(item => {
          if (item.monitor) {
            const mInfo = this.$lodash.find(this.monitors, function(it) {
              return it._id === item.monitor
            })
            if (mInfo && mInfo.position < count) {
              this.tvList[mInfo.position] = {
                ...mInfo,
                ...item,
                monitor: mInfo._id,
                name1: mInfo.name + '-' + mInfo.code
              }
              this.tvList[mInfo.position]._id = item._id
            }
          }
        })
      }
      if (this.tvList.length > 0) {
        this.state.showscreen = this.tvList[0].panecount
      }
    },
    dome() {
      if (!this.state.isPlay || this.showDownload) {
        this.warningMsg('请开启预览')
        return
      }
      if (this.disablePTZ) {
        this.warningMsg('该镜头不支持云台功能')
        return
      }
      const COM = this.frame.getCOM(this.activedPane)
      if (this.state.isPTZ) {
        COM.closeDome()
      } else {
        COM.openDome()
      }
      this.changeActive()
    },
    dblclickEvent(index, pane) {
      if (this.tvs[index].name === '未设置') {
        return
      }
      const nowPane = this.tvs[index].panecount
      const params = {
        monitor: this.enableController ? this.tvs[index]._id : this.tvs[index].monitor,
        pane: pane + 1
      }
      if (nowPane === 1) {
        params.showMax = 0
        this.fullDisplay(params)
          .then(() => {
            this.$Notice.success({
              title: '提示',
              desc: '设置成功',
              duration: 2
            })
          })
          .catch(error => {
            this.$Notice.error({
              title: '错误',
              desc: error.response.data.message
            })
          })
      } else {
        params.showMax = 1
        this.fullDisplay(params)
          .then(() => {
            this.$Notice.success({
              title: '提示',
              desc: '设置成功',
              duration: 2
            })
          })
          .catch(error => {
            this.$Notice.error({
              title: '错误',
              desc: error.response.data.message
            })
          })
      }
    },
    changeActive() {
      this.state.showscreen = this.tvs[this.activedIndex].panecount
      if (this.activedPane === -1) {
        return
      }
      const COM = this.frames[this.activedIndex].getCOM(this.activedPane)
      this.state.isPlay = COM.isPlay
      this.state.isVolumeOpen = COM.isVolumeOpen
      this.state.isPTZ = COM.isPTZ
    },
    checkAlarmScreen() {
      if (this.isNowAlarmScreen) {
        this.warningMsg('报警屏无法操作')
        return true
      }
      return false
    },
    toggleShownum() {
      if (this.showDownload) {
        return
      }
      this.commonAPIHandle(
        this.toggleShowNumAPI({
          show: !this.showNumber,
          monitors: this.tvs.filter(item => !item.nodef).map(item => (this.enableController ? item._id : item.monitor))
        }),
        '',
        'showno'
      ).then(() => {
        this.showNumber = !this.showNumber
        this.setFrameNum()
      })
    },
    setFrameNum() {
      if (this.frames.length > 0) {
        this.frames.forEach((frame, index) => {
          for (let i = 0; i < this.tvs[index].panecount; i++) {
            frame.getCOM(i).setShowTVNum(this.showNumber)
          }
        })
      }
    },
    handleDrop(e) {
      let data = e.dataTransfer.getData('Text')
      if (/^\{.*\}$/.test(data)) {
        data = JSON.parse(data)
        let target = $(e.target)
        target.click()
        if (target.is('object')) {
          target = target.parent()
        }
        const index = +target.attr('index')
        if (index === null || index === undefined) {
          return
        }
        this.setResource(data, index)
      }
    },
    setResource(res, index) {
      if (this.checkAlarmScreen()) {
        return
      }
      const info = this.tvs[this.activedIndex]
      const code = index + 1
      if (info.nodef) {
        this.warningMsg('未设置的屏幕无法设置上墙资源')
        return
      }
      console.log('setResource', res)
      this.recordLog({
        logType: '操作日志',
        module: '电视墙',
        operateName: '拖拽上墙',
        operateContent: '拖拽上墙',
        target: res.name,
        deviceIp: res.nodeId ? res.gbPlaDevIp : res.eid.ip // 设备ip String
      })
      this.commonAPIHandle(
        this.openWall({
          monitor: this.enableController ? info._id : info.monitor,
          number: code,
          resource: res._id
        }),
        '上墙',
        'openWall'
      )
    },
    changeAlarm(v, index) {
      this.tvs[index].type = this.tvs[index].type === 2 ? 0 : 2
      this.commonAPIHandle(this.updateChange(), '设置', 'changeAlarm')
    },
    updateChange() {
      console.log('应用模块', this.tvs)
      return this.updateRtScene({ info: this.tvs.filter(item => !item.nodef) })
    },
    closeIndex(index) {
      const frame = this.frames[index]
      const count = this.tvs[index].panecount
      for (let i = 0; i < count; i++) {
        frame.getCOM(i).close()
        this.changeActive()
      }
    },
    setShowscreen1(num) {
      if (this.checkAlarmScreen()) {
        return
      }
      // 手动切换的需要单独调
      this.setShowscreen(num, false)
        .then(() => {
          // this.frame.setShowscreen(num)
        })
        .catch(e => {})
    },
    setShowscreen(num, isMouse = true) {
      const tv = this.tvs[this.activedIndex]
      if (tv.nodef) {
        this.warningMsg('未设置的屏幕无法设置分割')
        return new Promise((resolve, reject) => {})
      }
      return this.commonAPIHandle(
        this.setScreenSplit({
          monitor: this.enableController ? tv._id : tv.monitor,
          panecount: num,
          isMouse
        }),
        '设置',
        'setSplit'
      )
    },
    closePlaying() {
      if (this.playingIndex !== null) {
        this.closeIndex(this.playingIndex)
      }
    },
    async openPlay() {
      if (this.checkAlarmScreen()) {
        return
      }
      this.closePlaying()
      const monitor = this.tvs[this.activedIndex]
      if (monitor.monitor) {
        const resource = monitor.resources.filter(item => item.code === this.activedPane + 1)
        console.log(monitor, 'monitor')
        if (resource.length) {
          const res = await this.getSingleResource(resource[0].resource)
          this.resType = res.monitortype
          if (res) {
            let p = {
              id: res._id,
              ip: res.eid.ip,
              port: res.eid.cport,
              channel: res.chan,
              streamType: res.stream,
              type: 'video',
              vendor: res.eid.manufacturer
            }
            if (res.nodeId) {
              p = {
                ...p,
                gbDevId: res.nodeId,
                shareServer: res.shareServer
              }
            }
            await this.frame.getCOM(this.activedPane).open(p)
            this.playingIndex = this.activedIndex
            this.activeAll.push(this.activedIndex)
            this.changeActive()
          }
        } else {
          this.warningMsg('未配置镜头')
        }
      } else {
        this.warningMsg('未配置监视器')
      }
    },
    closePlay() {
      if (this.checkAlarmScreen()) {
        return
      }
      // this.closeIndex(this.activedIndex)
      // this.playingIndex = null
      const frame = this.frames[this.activedIndex]
      frame.getCOM(this.activedPane).close()
      this.changeActive()
      this.playingIndex = null
    },
    closeAll() {
      if (this.showDownload) {
        return
      }
      this.activeAll = Array.from(new Set(this.activeAll))
      this.activeAll.forEach(v => {
        this.closeIndex(v)
      })
      this.playingIndex = null
      // this.closePlay()
      // this.closePlaying()
    },
    closeTV() {
      debugger
      if (this.checkAlarmScreen()) {
        return
      }
      this.closePlaying()

      const info = this.tvs[this.activedIndex]
      if (info.nodef) {
        this.warningMsg('未设置的屏幕无法操作')
        return
      }
      const code = this.activedPane + 1
      // if (info.startcode) {
      //   code += Number(info.startcode)
      // }
      this.commonAPIHandle(
        this.closeWall({
          monitor: this.enableController ? info._id : info.monitor,
          number: code
        }),
        '停止解码',
        'closeWall'
      )
    },
    closeAllTV() {
      this.closeAll()
      this.commonAPIHandle(this.closeAllWall(), '全部停止解码', 'closeAllWall')
    },
    openVolume() {
      if (this.checkAlarmScreen()) {
        return
      }
      this.frame.getCOM(this.activedPane).openSound()
      this.changeActive()
    },
    closeVolume() {
      if (this.checkAlarmScreen()) {
        return
      }
      this.frame.getCOM(this.activedPane).closeSound()
      this.changeActive()
    },
    setProportion() {
      this.proportionRow()
      this.proportionClo()
      this.setControllerList()
    }
  },
  created() {
    if (this.enableController) {
      window.addEventListener('resize', this.setProportion)
    }
  },
  beforeDestroy() {
    if (this.enableController) {
      window.removeEventListener('setProportion', this.setProportion)
    }
  }
}
</script>
<style lang="less" scoped>
.video-con {
  position: absolute;
  left: 0;
  right: 0;
  top: 38px;
  bottom: 72px;
}

.bottom {
  position: absolute;
  bottom: 16px;
  height: 56px;
  width: 100%;
  background: #1b3153;
  padding-top: 14px;
  cursor: pointer;
  border-top: 1px solid rgba(58, 90, 139, 0.4);
}

.tv {
  z-index: 10;
  display: inline-block;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  vertical-align: middle;
}

.tv-btn {
  padding: 4px 12px;
  font-size: 12px;
  border-radius: 3px;
  cursor: pointer;
  margin: 0 5px;
  border: 1px solid transparent;
}

.a-frame .tvname {
  color: #00a5e3;
}

.tvname {
  display: inline-block;
  width: calc(~'100% - 88px');
  white-space: pre;
  overflow: hidden;
  text-overflow: ellipsis;
}

iframe {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  border: 0 none;
}

.iconfont {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  padding: 0 11px;
}

.iconfont:hover {
  color: #fda54b;
}
.iconfont:active {
  color: #c47019;
}

.iconfont.disable:hover,
.iconfont.disable {
  color: rgba(255, 255, 255, 0.5);
}

.dp-con:hover .iconfont {
  color: #fda54b;
}
.dp-con:active .iconfont {
  color: #c47019;
}
.dp-con {
  position: relative;
  display: inline-block;
  ul {
    position: absolute;
    height: 40px;
    padding-top: 10px;
    bottom: -4px;
    left: 42px;
    width: 300px;
    background: #335589;
    border-radius: 4px;

    li {
      color: #fff;
      height: 20px;
      line-height: 20px;
      text-align: center;
      cursor: pointer;
      position: relative;
      display: inline-block;
      padding: 0 15px;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
    }

    li:last-child {
      border-right: 0;
    }

    i {
      display: block;
      position: absolute;
      background: #335589;
      width: 14px;
      height: 14px;
      z-index: 0;
      transform: rotate(45deg);
      bottom: 12px;
      left: -7px;
    }

    .active {
      color: #c47019;
    }
  }
}

.tv-pane {
  border: 0 none;

  &:hover {
    color: #fff;
    background: #171717;
  }
}

.showbignum {
  color: #171717;
  background: #bfbfbf;
  height: 30px;
  width: 30px;
  line-height: 30px;
  font-size: 18px;
  position: absolute;
  text-align: center;
  left: calc(~'50% - 15px');
  bottom: -15px;
  z-index: 20;
}
.no-plugin {
  position: relative;

  & a {
    position: absolute;
    font-size: 24px;
    top: 50%;
    left: 50%;
    margin-left: -120px;
    transform: translateY(-50%);
    color: #00a5e3;
  }

  & .ivu-icon {
    position: absolute;
    font-size: 24px;
    top: 50%;
    left: 50%;
    margin-left: 124px;
    transform: translateY(-50%);
    cursor: help;
    color: #00a5e3;
  }
}
.bg-box {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  z-index: 1;
  top: 0;
}
.inner-number {
  display: inline-block;
  border: 1px solid #fff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  font-size: 24px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.theme-bg {
  background: #0f2343;
  line-height: 38px;
  height: 38px;
  color: #fff;
}
.tvwall-title {
  width: 100%;
  display: flex;
}

.tvwall-title .title-item {
  display: inline-block;
  padding-left: 30px;
  width: 200px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.last-item{
  flex: 1;
}
</style>
