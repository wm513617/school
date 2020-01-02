<template>
  <div v-resize="scorll" style="height:100%;overflow:hidden; padding:0 10px;">
    <div class="input">
      <Input v-model="searchVal" icon="ios-search-strong" size="small" style="width:100% !important" placeholder="请输入..." />
    </div>
    <div v-show="!showDetail">
      <div class="title-new" @click="addDetails">
        <i class="icon iconfont icon-large"></i>
        <label>新建轮巡</label>
      </div>
    </div>
    <div v-show="!showDetail && !noResult" class="left-con-list">
      <bs-scroll>
        <div class="list-item" v-for="(item, index) in list" v-show="item.show" :key="item.name">
          <label for="">{{item.name}}</label>
          <div class="list-icons">
            <i class="icon iconfont icon-edit" @click="altDetails(index)" title="修改"></i>
            <i class="icon iconfont icon-delete" @click="del(index)" title="删除"></i>
            <i class="icon iconfont icon-execute" @click="executePolling(item)" title="执行"></i>
          </div>
        </div>
      </bs-scroll>
    </div>
    <div class="list-item" v-show="noResult">无结果</div>
    <div class="details" style="height: calc(100% - 50px)">
      <div v-show="showDetail" :style="{height: detailHeight}">
        <bs-scroll ref="scorlls">
          <div style="padding-left: 10px">
            <label class="lbl" style="height: 30px;line-height:30px;">轮巡名称</label>
            <Input :class="{'label-input': true, invalid: !nameValid}" v-model="details.name" @on-blur="blurcheck('name')" />
            <label class="tips" :style="{visibility: nameValid? 'hidden': 'visible'}">轮巡名称不能为空且不能超过256个字符</label>
          </div>
          <div style="padding-left: 10px;">
            <label class="lbl" style="height: 30px;line-height:30px">轮巡间隔</label>
            <Input :class="{'label-input': true, invalid: !intValid}" style="width: 160px" v-model="details.interval" @on-blur="blurcheck('interval')" />
            <span style="margin-left:5px">s</span>
            <label class="tips" :style="{visibility: intValid? 'hidden': 'visible'}">轮巡间隔必须为5 ~ 3600间的整数</label>
          </div>
          <div style="padding-left: 10px;">
            <label class="lbl" style="height: 30px;line-height:30px">轮询组编号</label>
            <Input :class="{'label-input': true, invalid: !codeValid}" style="width: 160px" v-model="details.code" @on-blur="blurcheck('code')" />
            <label class="tips" :style="{visibility: codeValid? 'hidden': 'visible'}">轮巡间隔必须为1 ~ 9999间的整数</label>
          </div>
          <div style="padding-left: 10px;padding-top:40px;position:relative">
            <label class="lbl">轮巡组列表</label>
            <div class="ul-list" style="height: 160px">
              <bs-scroll ref="scroller">
                <div v-for="channel in details.channelNodes" :key="channel._id" style="padding: 6px 0 6px 6px;height:30px;">
                  <div :class="{selected: selectedChannel == channel._id}" @click="selectedChannel = channel._id" :title="channel.name">
                    <Checkbox v-model="channel.checked" :class="'list-it'" style="width:170px;">{{channel.name}}</Checkbox>
                  </div>
                </div>
              </bs-scroll>
            </div>
            <div style="height:30px;padding-right:14px;position:absolute;top:10px;right:4px;width:100px;user-select:none;">
              <div class="list-icons">
                <i class="icon iconfont icon-move-up" @click="upChannel" title="上移"></i>
                <i class="icon iconfont icon-move-down" @click="downChannel" title="下移"></i>
                <i class="icon iconfont icon-add" @click="(showModal=true)&&(resources=details.channelNodes)" title="添加"></i>
                <i class="icon iconfont icon-delete" @click="delChannel" title="删除"></i>
              </div>
            </div>
          </div>
          <div style="padding-left: 10px;margin-top: 10px">
            <label class="lbl">轮巡目标</label>
            <div class="ul-list">
              <bs-scroll>
                <div v-for="(v, index) in monitors" :key="v._id" style="padding: 6px 10px 6px 6px">
                  <div :class="{selected: selectedIndex == index}" @click="selectedIndex = index">
                    <Checkbox :class="'list-it'" style="width:170px;" :disabled="v.disabled&&!details.monitorChs[index]" :title="v.disabled&&!details.monitorChs[index] ? '已设置为报警屏' : ''" v-model="details.monitorChs[index]">{{getMonitorName(v)}}</Checkbox>
                  </div>
                </div>
              </bs-scroll>
            </div>
          </div>
          <div style="padding-right:16px;margin-top:10px">
            <button class="theme-btn" style="border:1px solid #00a5e3;float: right; padding: 4px 12px;border-radius:3px;cursor:pointer" @click="save">保存</button>
            <button class="theme-btn-cancel" style="float: right; padding: 4px 12px;border-radius:3px;margin-right: 10px;cursor:pointer" @click="showDetail=false">取消</button>
          </div>
        </bs-scroll>
      </div>
    </div>
    <Modal v-model="showModal" title="添加镜头" :width="622" :mask-closable="false">
      <Spin fix v-if='isSpin' style='color:#fff;font-size: 16px;z-index: 10000000;background: rgba(0,0,0,0.3)'>
          <Icon type="load-c" size=24 class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
      </Spin>
      <bs-cover v-model="showModal">
        <Transfer v-if="showModal" :groupListData="details.channelNodes" @spinChange='spinChange' @changeData="emitChangeData"></Transfer>
      </bs-cover>
      <div slot="footer" style="position:relative;z-index:99">
        <Button type="ghost" @click="(resources=null)||(showModal=false)">取消</Button>
        <Button type="primary" @click="sure">确定</Button>
      </div>
    </Modal>
    <Modal v-model="delectModal" width='416' title='提示'>
      <bs-cover v-if="delectModal" v-model="delectModal">
        <div style='line-height: 36px;position: relative; padding-left: 40px'>
          <i class="ivu-icon ivu-icon-help-circled" style='color: #ff9900; font-size:30px;position: absolute;left: 0'></i>
          确认删除"{{delectName}}"吗
        </div>
      </bs-cover>
      <div slot="footer" style="position:relative;z-index:99">
        <Button type="ghost" @click="delectModal=false">取消</Button>
        <Button type="primary" @click="delectModal=false||delect()">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Transfer from 'components/videoMenu/Transfers'
import { some, forEachRight } from 'lodash'
import { getPinyin, isMatchPinyin } from './pinyin'
import common from './tvcommon'
import 'components/Scroll'
// import { setTimeout } from 'timers'
export default {
  components: {
    Transfer
  },
  mixins: [common],
  data() {
    return {
      searchVal: '',
      showDetail: false,
      isSpin: false,
      saveIndex: -1,
      showModal: false,
      resources: null,
      selectedChannel: -1,
      selectedIndex: -1,
      details: {
        name: '',
        code: '',
        channels: [],
        monitorsinfo: [],
        channelNodes: [],
        monitorChs: [],
        interval: 10
      },
      nameValid: true,
      intValid: true,
      codeValid: true,
      noResult: false,
      delectModal: false,
      delectId: '',
      delectName: '',
      detailHeight: 'calc(100% - 50px)'
    }
  },
  computed: {
    ...mapState({
      videoOrgData: ({ videoOrg }) => videoOrg.videoOrgData,
      pollingList: ({ tvwall }) => tvwall.pollingList,
      scenes: ({ tvwall }) => tvwall.sceneList,
      tvwall: ({ tvwall }) => tvwall.tvwall,
      monitorList: ({ tvwall }) => tvwall.monitorList,
      rtscene: ({ tvwall }) => tvwall.rtscene,
      tabIndex: ({ tvwall }) => tvwall.tabIndex,
      enableController: ({ tvwall }) => tvwall.enableController
    }),
    ...mapGetters({
      layout: 'layout'
    }),
    monitors() {
      const arr = []
      const s = new Set()
      if (!this.layout) {
        return arr
      }
      let infos = this.rtscene && (this.rtscene.info || []).filter(item => item)
      if (this.tvwall.jointcontroller) {
        infos.forEach((val, index) => {
          this.layout.wininfo.forEach((item, index) => {
            if (item.monitor === val.monitor) {
              s.add(val)
            }
          })
        })
        infos = Array.from(s)
      }
      let count = this.layout.column * this.layout.row
      while (count--) {
        arr.push({})
      }
      infos &&
        infos.forEach((info, index) => {
          const monitor = this.$lodash.find(this.monitorList, item => item._id === info.monitor)
          if (monitor && monitor.position < arr.length) {
            arr[monitor.position] = {
              _id: monitor._id,
              name: monitor.name,
              code: monitor.code,
              panecount: info.panecount
            }
            if (info.type === 2) {
              arr[monitor.position].disabled = true
            }
          } else if (this.enableController && monitor) {
            arr[index] = {
              _id: monitor._id,
              name: monitor.name,
              code: monitor.code,
              panecount: info.panecount
            }
            if (info.type === 2) {
              arr[index].disabled = true
            }
          }
        })
      return arr.filter(item => item._id)
    },
    list() {
      if (!this.pollingList) {
        return
      }
      const list = JSON.parse(JSON.stringify(this.pollingList))
      list.forEach(item => {
        item.show = true
        item.pinyin = getPinyin(item)
      })
      return list
    },
    newDetails() {
      // 避免重复名称
      let name = ''
      let sameName = false
      let add = 0
      do {
        add++
        name = '轮巡方案' + (this.list.length + add)
        sameName = this.$lodash.find(this.list, item => item.name === name)
      } while (sameName)

      return {
        _id: -1,
        name,
        channels: [],
        monitorsinfo: [],
        channelNodes: [],
        monitorChs: this.catchMonitorChs([]),
        interval: 10
      }
    },
    saveMonitor() {
      return this.monitors
        .filter((item, index) => {
          return this.details.monitorChs[index]
        })
        .map(item => item._id)
    }
  },
  watch: {
    searchVal(v) {
      let noOne = true
      this.list.forEach(item => {
        item.show = isMatchPinyin(v, item.pinyin)
        if (item.show) {
          noOne = false
        }
      })
      this.noResult = noOne
    },
    showDetail(v) {
      this.$nextTick(() => {
        if (v) {
          this.detailHeight = '100%'
        } else {
          this.detailHeight = 'calc(100% - 50px)'
          this.details.code = ''
        }
      })
    },
    tabIndex(val) {
      if (val === 3) {
        this.scorll()
      }
    }
  },
  methods: {
    ...mapActions(['getPolling', 'deletePolling', 'addPolling', 'setPolling', 'exePolling', 'recordLog']),
    sure() {
      this.$set(this.details, 'channelNodes', this.resources)
      this.showModal = false
    },
    scroll() {
      if (this.$refs.scroller) {
        this.$refs.scroller.update()
      }
    },
    spinChange(val) {
      this.isSpin = val
    },
    blurcheck(type) {
      if (type === 'name') {
        if (this.details.name === '' || this.details.name.replace(/\s+/g, '') === '') {
          this.nameValid = null
        } else if (this.details.name.length > 256) {
          this.nameValid = false
        } else {
          this.nameValid = true
        }
      } else if (type === 'code') {
        const num = this.details.code
        if (!/^\d+$/.test(num)) {
          this.codeValid = false
        } else if (num < 1) {
          this.codeValid = null
        } else if (num > 9999) {
          this.codeValid = undefined
        } else {
          this.codeValid = true
        }
      } else {
        const num = this.details.interval
        if (!/^\d+$/.test(num)) {
          this.intValid = false
        } else if (num < 5) {
          this.intValid = null
        } else if (num > 3600) {
          this.intValid = undefined
        } else {
          this.intValid = true
        }
      }
    },
    addDetails() {
      this.scroll()
      this.showDetail = true
      this.saveIndex = -1
      Object.assign(this.details, this.newDetails)
      console.log(this.monitors, '2121222')
      this.monitors.sort((a, b) => {
        return a.name.localeCompare(b.name)
      })
    },
    altDetails(index) {
      this.getPolling()
      const id = this.list[index]._id
      if (id === this.rtscene.polling) {
        this.showError('轮巡正在执行，无法修改')
        return
      }
      this.showDetail = true
      this.saveIndex = index
      this.details = {
        ...this.list[index],
        channelNodes: this.list[index].channels,
        monitorChs: this.catchMonitorChs(this.list[index].monitorsinfo)
      }
    },
    showError(msg) {
      this.$Notice.error({
        title: '错误',
        desc: msg,
        duration: 2
      })
    },
    validInput() {
      if (!this.details.channelNodes.length) {
        this.showError('至少选择一个镜头')
      } else if (!this.saveMonitor.length) {
        this.showError('至少选择一个监视器')
      } else {
        return true
      }
    },
    save() {
      if (this.nameValid !== true) {
        return this.blurcheck('name')
      }
      if (this.codeValid !== true) {
        return this.blurcheck('code')
      }
      if (this.intValid !== true) {
        return this.blurcheck()
      }
      if (!this.validInput()) {
        return
      }
      const param = {
        name: this.details.name,
        code: this.details.code,
        interval: this.details.interval,
        channels: this.details.channelNodes.map(item => item._id),
        monitorsinfo: this.saveMonitor
      }
      if (this.saveIndex !== -1) {
        param.id = this.list[this.saveIndex]._id
        this.commonAPIHandle(this.setPolling(param), '修改', 'setPolling')
      } else {
        this.commonAPIHandle(this.addPolling(param), '添加', 'addPolling')
      }
      this.showDetail = false
    },
    async del(index) {
      // const res = await this.confirmModal(`确认删除"${this.list[index].name}"吗?`)
      // if (!res) {
      //   return
      // }
      const id = this.list[index]._id
      this.delectId = this.list[index]._id
      // console.log(id, this.$lodash.find(this.rtscene.polling, item => item))
      if (this.$lodash.find(this.rtscene.polling, item => item._id === id)) {
        // console.log('111111111111')
        this.showError('轮巡正在执行，无法删除')
      } else {
        this.delectModal = true
        this.delectName = this.list[index].name
      }
    },
    delect() {
      this.delectModal = false
      this.commonAPIHandle(this.deletePolling(this.delectId), '删除', 'deletePolling')
    },
    emitChangeData(data) {
      this.resources = data.map(item => {
        return {
          ...item,
          checked: false
        }
      })
    },
    delChannel() {
      this.details.channelNodes = this.details.channelNodes.filter(item => !item.checked)
    },
    upChannel() {
      const list = []
      this.details.channelNodes.forEach((item, index) => {
        if (item.checked) {
          list.push(index)
        }
      })
      list.forEach(index => {
        this._upChannel(index)
      })
    },
    _upChannel(index) {
      const nodes = this.details.channelNodes
      if (index !== 0) {
        const item1 = nodes[index - 1]
        const item2 = nodes[index]
        nodes.splice(index - 1, 2, item2, item1)
      }
    },
    downChannel() {
      const list = []
      this.details.channelNodes.forEach((item, index) => {
        if (item.checked) {
          list.push(index)
        }
      })
      forEachRight(list, index => {
        this._downChannel(index)
      })
    },
    _downChannel(index) {
      const nodes = this.details.channelNodes
      if (index !== nodes.length - 1) {
        const item1 = nodes[index]
        const item2 = nodes[index + 1]
        nodes.splice(index, 2, item2, item1)
      }
    },
    catchMonitorChs(list) {
      return this.monitors.map(item => {
        return some(list, monitorId => monitorId === item._id)
      })
    },
    getMonitorName(monitor) {
      if (!monitor) {
        return '未配置'
      }
      return monitor.name
    },
    executePolling(polling) {
      this.recordLog({
        logType: '操作日志',
        module: '电视墙',
        operateName: '执行轮巡',
        operateContent: `执行轮巡: ${polling.name}`
      })
      const monitors = polling.monitorsinfo
      const infos = (this.rtscene.info || []).filter(item => item)
      let valid = true
      let noScreen = false
      monitors.forEach(monitorId => {
        const info = this.$lodash.find(infos, item => item.monitor === monitorId)
        if (!info) {
          noScreen = true
          return false
        } else if (info.type === 2) {
          valid = false
          return false
        }
      })
      if (noScreen) {
        this.$Notice.error({
          title: '错误',
          desc: '轮巡目标屏幕不存在，无法执行',
          duration: 2
        })
      } else if (!valid) {
        this.$Notice.error({
          title: '错误',
          desc: '轮巡目标包含报警屏，无法执行',
          duration: 2
        })
      } else {
        this.commonAPIHandle(
          this.exePolling({
            // polling: polling._id,
            // isSceneswitch: false,
            // info: infos
            id: polling._id
          }),
          '执行轮巡',
          'executePolling'
        )
      }
    },
    showMsg(msg) {
      this.$Notice.success({
        title: '提示',
        desc: msg,
        duration: 2
      })
    },
    scorll() {
      if (this.$refs.scorlls) {
        this.$refs.scorlls.update()
      }
    }
  },
  created() {
    this.getPolling().catch(err => {
      console.error('getPolling', err)
    })
  }
}
</script>
<style lang="less" scoped>
.demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
label.ivu-checkbox-wrapper {
  margin-right: 0;
}
.ivu-input-wrapper {
  width: auto;
}
.input {
  padding: 10px 0;
}

.ivu-checkbox-wrapper-disabled {
  color: #bbb;
}

.ul-list {
  display: inline-block;
  width: 175px;
  height: 160px;
  border: 1px solid #203863;
  background: #0f2343;
  border-radius: 3px;
}

.details {
  .lbl {
    display: inline-block;
    vertical-align: top;
  }

  input {
    width: 160px;
  }
}

.details > div > div {
  min-height: 30px;
}

label.ivu-checkbox-wrapper {
  display: block;
}

.list-it {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tips {
  margin-left: 75px;
  color: #ed3f14;
}
</style>
