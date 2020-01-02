<template>
<!-- 广播 -->
  <Dragx title="广播" showPanel :index="3" @close="close" eventType="broast">
    <!-- <object ref="plugins" type="application/x-webplayercontrol" style="position:absolute;left:0;top:0;"></object> -->
    <div class="content-left">
      <div class="left-top">
        <div class="photo">
          <img v-for="(item, index) in imgLists.slice(0, 4)" :key="index" class="avator" :src="item ? item : '/static/noSolider.jpg'" alt="加载失败" :style="{marginLeft: index ?'-30px':'0'}">
        </div>
        <div class="solider-names">{{names.slice(0, 4).join(' ')}}等{{names.length}}人</div>
        <div class="time">{{hour}}:{{minute}}:{{second}}</div>
      </div>
      <div class="left-bottom">
        <div class="iconfont talk-icon" :class="{'icon-shipinlei-duijiang': talkOpen, 'icon-shipinleiduijiangjinyong': !talkOpen}" @click="toggleTalk"></div>
        <div style="display:flex;margin-left:70px;">
          <div class="circle" :style="{backgroundColor: recording ? 'red' : '#5676a9'}"></div>
          <i-switch size="large" v-model="recording" @on-change="toggleRecord">
            <span slot="open">ON</span>
            <span slot="close">OFF</span>
          </i-switch>
        </div>
      </div>
    </div>
    <div slot="panel" class="content-right">
      <div class="title">单兵列表</div>
      <div class="right-panel">
        <bs-scroll ref="inTreeScroll" style="width:100%;height:100%;overflow:auto;">
          <bsr-tree :treeData="panelList" :selectNode="ids" ref="inTree" @on-expand="treeExpand" showCheckbox @handlechecked="handlecheck">
            <template slot-scope="{ node }">
              <span :class="{'item': true}" :title="node.name">
                {{node.name}}
              </span>
            </template>
          </bsr-tree>
        </bs-scroll>
      </div>
    </div>
  </Dragx>
</template>

<script>
// imgList: 单兵人员头像 Array
// soliderInfos: 单兵人员信息 Object {names, ids}
// $emit('close'): 关闭事件
import alarm from 'src/socket/alarm.js'
import Dragx from '../dragx/Dragx.vue'
import { read } from '../../storage/index.js'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    Dragx
  },
  props: {
    imgList: { // 单兵人员头像
      type: Array,
      default: () => {
        return []
      }
    },
    soliderInfos: { // 广播的单兵人员 [{name,id,sn},...]
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    ...mapGetters(['plugins']),
    names() {
      const arr = [...this.soliderInfos, ...this.newAddSolider]
      return arr.map(item => {
        return item.name
      })
      // return this.soliderInfos.names.split(',').slice(0, 4)
    }
  },
  data() {
    return {
      imgLists: JSON.parse(JSON.stringify(this.imgList)),
      talkOpen: true, // 广播开启
      recording: true, // 是否开始录音
      options: {
        showCheckbox: true,
        showInput: true
      },
      panelList: {},
      time: 0,
      hour: '00',
      minute: '00',
      second: '00',
      callInfo: null,
      ids: [],
      newAddSolider: [], // 新加单兵人员
      recordId: '',
      isTruelyClose: false // 是否是正常操作关闭
    }
  },
  created() {
    // 监听 广播途中 单兵人员退出登录
    alarm.on('singleStatus', this.changeSoliders)
    this.ids = this.soliderInfos.map(item => {
      return item.id
    })
    console.log(this.plugins.OpenSpeechEx, 'plugins')
    this.getSentryUserTree().then(res => {
      this.panelList = res[0]
    })
    // 获取流地址
    this.getBroadcastURL({name: read('user.username')}).then(res => {
      console.log(res, 'getBroadcastURL')
      this.callInfo = res.data
      this.connectComplete()
    }).catch(err => {
      console.log(err, '广播失败')
    })
  },
  methods: {
    ...mapActions(['getSentryUserTree', 'startBroadcast', 'openPhoneBroadcast', 'getBroadcastURL', 'stopBroadcast', 'stopPhoneBroadcast', 'addBroadcastApp', 'startRecord', 'stopRecord', 'createBroadcastRecord', 'refrashBroadcastRecord', 'startBroadcastRecord']),
    close() {
      this.isTruelyClose = true
      if (this.callInfo) {
        this.stopBroadcast({url: this.callInfo.url, destId: this.ids}).then(res => {
          return this.stopPhoneBroadcast({url: this.callInfo.url})
        }).then(async suc => {
          this.stopRecord({url: this.callInfo.url}).then(() => {
            if (this.recordId) {
              const param = {
                id: this.recordId,
                body: {
                  endTime: Date.now(),
                  phoneAudioInfo: this.soliderInfos.map(item => {
                    return {sn: item.sn, name: item.name}
                  })
                }
              }
              return this.refrashBroadcastRecord(param)
            }
          }).catch(err => {
            console.log(err, '录音关闭失败')
          })
          await this.plugins.StopSpeech()
          const state = await this.plugins.CloseSpeech()
          console.log(state, 'stop plugin')
          this.$emit('close')
        }).catch(err => {
          console.log(err, 'stopBroadcast error')
          this.warningMsg('挂断广播失败！')
        })
      } else {
        this.$emit('close')
      }
    },
    toggleTalk() {
      this.close()
    },
    toggleRecord(flag) {
      if (!this.callInfo) { return }
      if (flag) {
        const param = {
          url: this.callInfo.url,
          dsId: this.callInfo.dsId,
          dir: this.callInfo.dir,
          appInfo: this.soliderInfos.map(item => {
            return {sn: item.sn, name: item.name}
          })
        }
        this.startBroadcastRecord(param)
      } else {
        this.stopRecord({url: this.callInfo.url})
      }
    },
    // 与单兵App连接成功，开始计时 广播
    connectComplete() {
      const soliders = this.soliderInfos.map(item => {
        return {sn: item.sn, name: item.name}
      })
      const param = {
        url: this.callInfo.url,
        dsId: this.callInfo.dsId, // dsServerId
        dir: this.callInfo.dir, // 存储目录
        appInfo: soliders
      }
      this.openPhoneBroadcast(param).then(async res => {
        const value = {
          webName: read('user.username'),
          taskType: 1,
          startTime: Date.now(),
          dsIp: res.data.taIp,
          phoneAudioInfo: soliders
        }
        const obj = {
          port: res.data.taPort + '',
          ip: res.data.taIp,
          cmdStr: JSON.stringify({
            talkMode: 2,
            url: this.callInfo.url
          })
        }
        console.log(obj, 'plugin param')
        const state = await this.plugins.OpenSpeechEx(JSON.stringify(obj))
        console.log(state, 'openplugin state')
        if (state === 0) {
          console.log(this.plugins.StartSpeechMobile, 'this.plugins.StartSpeechMobile')
          const state1 = this.plugins.StartSpeechMobile(false)
          console.log(state1, 'state1')
          const destId = this.soliderInfos.map(item => {
            return item.id
          })
          this.createBroadcastRecord(value).then(res => {
            console.log(res.data, '创建记录')
            this.recordId = res.data._id
          }).catch(err => {
            console.log(err, '创建记录失败')
          })
          this.startBroadcast({url: this.callInfo.url, destId}).then(() => {
            this.startBroadcastRecord(param).then(suc => {
              const result = suc.data
              const data = {
                id: this.recordId,
                body: {
                  startTime: result ? (result.startTime ? result.startTime : Date.now()) : Date.now(),
                  phoneAudioInfo: this.soliderInfos.map(item => {
                    return {sn: item.sn, name: item.name}
                  })
                }
              }
              this.refrashBroadcastRecord(data)
            }).catch(err => {
              console.log(err, '录像开启失败')
            })
            this.startTiming()
            this.successMsg('开启广播成功')
          }).catch(err => {
            console.log(err, 'startBroadcast err')
            this.warningMsg('开启广播失败')
          })
        } else {
          this.warningMsg('开启广播失败')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    startTiming() {
      this.time++
      let h = parseInt(this.time / 3600)
      let m = parseInt((this.time - h * 3600) / 60)
      let s = this.time - h * 3600 - m * 60
      this.hour = h < 10 ? `0${h}` : (h + '')
      this.minute = m < 10 ? `0${m}` : (m + '')
      this.second = s < 10 ? `0${s}` : (s + '')
      setTimeout(() => {
        this.startTiming()
      }, 1000)
    },
    treeExpand() {
      this.$refs.inTreeScroll.update()
    },
    handlecheck() {
      let arr = []
      let ids = []
      const allSoldier = [...this.soliderInfos, ...this.newAddSolider]
      let apps = this.$refs.inTree.getSelectedNodes()
      apps.filter(item => {
        return !item.isOrg
      }).map(item => {
        const i = allSoldier.findIndex(ele => {
          return ele.id === item._id
        })
        if (i === -1) {
          arr.push({name: item.name, id: item._id})
          ids.push(item._id)
        }
      })
      if (!ids.length) { return }
      const param = {
        destId: ids,
        name: read('user.username'),
        srcId: read('userId'),
        avInfo: {
          url: this.callInfo.url
        }
      }
      this.addBroadcastApp(param).then(res => {
        let unlines = []
        // this.ids = this.ids.concat(ids)
        if (res.data.usrid && res.data.usrid.length !== 0) {
          res.data.usrid.forEach(item => {
            let index = arr.findIndex(info => {
              return info.id === item
            })
            unlines.push(arr[index].name)
            arr.splice(index, 1)
            ids.splice(index, 1)
          })
          this.warningMsg(unlines.join(',') + '不在线，无法加入广播')
        }
        arr.forEach(item => {
          this.newAddSolider.push(item)
        })
        this.ids = this.ids.concat(ids)
      }).catch(err => {
        this.warningMsg('单兵人员加入广播失败')
        console.log(err)
      })
    },
    changeSoliders(data) {
      if (data.status === 'offline' && this.ids.includes(data.userid)) {
        let arr = [...this.soliderInfos, ...this.newAddSolider]
        let index = arr.findIndex(item => {
          return item.id === data.userid
        })
        let idIndex = this.ids.findIndex(item => {
          return item === data.userid
        })
        this.ids.splice(idIndex, 1)
        if (index < this.soliderInfos.length) {
          this.soliderInfos.splice(index, 1)
          this.imgLists.splice(index, 1)
        } else {
          this.newAddSolider.splice(index - this.soliderInfos.length, 1)
        }
      }
    }
  },
  beforeDestroy() {
    if (!this.isTruelyClose) {
      this.close()
    }
    alarm.remove('intercomComplete', this.startBroadcast)
    alarm.remove('singleStatus', this.changeSoliders)
  }
}
</script>

<style scoped lang='less'>
.content-left {
  width: 300px;
  height: 360px;
  border-left: 1px solid rgba(58, 90, 139, 0.4);
  border-bottom: 1px solid rgba(58, 90, 139, 0.4);
  border-right: 1px solid rgba(58, 90, 139, 0.4);
  .left-top {
    height: 280px;
    border-bottom: 1px solid rgba(58, 90, 139, 0.4);
    font-size: 14px;
    .photo {
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      .avator {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        float: left;
        background-size: contain;
      }
    }
    .solider-names {
      height: 60px;
      line-height: 60px;
      text-align: center;
    }
    .time {
      height: 120px;
      line-height: 120px;
      text-align: center;
    }
  }
  .left-bottom {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    .talk-icon {
      cursor: pointer;
      font-size: 24px;
    }
    .circle {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      margin-right: 12px;
    }
  }
}
.content-right {
  width: 220px;
  height: 400px;
  .right-panel {
    width: 100%;
    height: 360px;
    text-align: left;
    border-right: 1px solid rgba(58, 90, 139, 0.4);
    border-bottom: 1px solid rgba(58, 90, 139, 0.4);
  }
}
</style>
