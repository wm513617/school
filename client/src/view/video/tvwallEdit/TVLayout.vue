<template>
  <div style="height:100%;position:relative;">
    <p v-if="showLayoutModal" class="layout-titie">电视墙布局模板编辑模式</p>
    <div class="theme-bg" v-if="!showLayoutModal">
      <div class="tvwall-title">
        <span class="title-item" :title='curSceneName'>当前场景： {{curSceneName}}</span>
        <span class="title-item" :title='curPlanName'>当前预案： {{curPlanName}}</span>
        <span class="title-item last-item" :title='curpollingName'>当前轮询：{{curpollingName}}</span>
      </div>
      <!-- <div class="top-con" v-if="showControllerModel" style="float:right;">
        产品沟通：拼控的拆分合并不做、暂做注释
        <ul class="top-btns">
          <li>
            <Button type="ghost" :disabled="false" @click="mergeTV">合并</Button>
          </li>
          <li>
            <Button type="ghost" :disabled="false" @click="splitTV">拆分</Button>
          </li>
        </ul>
      </div> -->
    </div>
    <div class="video-con" :style="videoConStyle">
        <div class="left-list" v-if="showLayoutModal">
          <p class="list-titie">电视墙布局模板</p>
          <bs-scroll ref="scorlls" style="height: calc(100% - 140px);">
            <ul class="layout-list">
              <li v-for="(item, v) in layoutArr" :key="v" :class="{active: v===layoutIndex}" @click="changeLayoutIndex(v)">
                <span @dblclick="rename(item)">{{item.name}}</span>
                <div class="bottom-btn">
                  <i class='iconfont icon-edit' title="修改" @click.stop.prevent="changeLayout(item, v)"></i>
                  <i class='iconfont icon-delete' title="删除" @click.stop.prevent="deleteLayout(item._id)"></i>
                </div>
              </li>
            </ul>
          </bs-scroll>
          <div class="left-bottom-btn">
            <Button type="ghost" @click="saveLayout(isInit = true)">添加</Button>
            <Button @click="dropOut">退出</Button>
          </div>
        </div>
      <div class="right-con">
        <div class="top-con" v-if="showLayoutModal">
          <ul class="top-btns">
            <li>
              <Button type="ghost" :disabled="initLayout" icon="plus" @click="openCreateModel">添加</Button>
            </li>
            <li>
              <Button type="ghost" :disabled="disableclear" icon="trash-a" @click="delMonitor(getTVName())">删除</Button>
            </li>
            <li>
              <Button type="ghost" :disabled="initLayout || disableAllDel" icon="close-round" @click="delAllMonitor">清除</Button>
            </li>
            <li>
              <Button type="ghost" :disabled="initLayout" icon="android-checkbox-outline" @click="saveLayout(isInit = false)">保存</Button>
            </li>
          </ul>
        </div>
        <div class="videos-box" :style="videoBoxStyle">
          <div v-for="(tv, index) in tvs" :key="index" :style="{
              width: tv.width || wd,
              height: tv.height || ht,
              top: tv.top,
              left: tv.left,
              bottom: tv.bottom,
              right: tv.right,
              position: tv.posit
            }" :class="['tvs']">
            <div class="tv" v-for="(innerTv, v) in tv.panecount"
              :key="v"
              :style="{background: bgColor, width: countWdHt(tv.panecount), height: countWdHt(tv.panecount, true)}"
              :class="{active: v === activedPane && index === activeIndex}"
              :index="v"
              @click="clickTV(tv, index, v)"
              @dragover.prevent.stop
              @drop.prevent.stop="handleDrop">
              <span class="show-num" v-if="showNumber">{{v | showNum}}</span>
            </div>

            <div class="bottom theme-pane tvname">
              <span>{{getTVName(tv)}}</span>
              <Checkbox v-if="tv.settle" style="position:absolute; right: 5px" :value="tv.type === 2" @on-change="v => changeAlarm(v, index)">设为报警屏</Checkbox>
            </div>
            <div class="show-big-num" v-if="showNumber">{{tv.code}}</div>
          </div>
        </div>
        <div class="bg-box" v-if="enableController">
          <div :style="bgBoxStyle" v-for="(tv, index) in bgTV" :key="index">
            <span class="inner-number">{{index + 1}}</span>
          </div>
        </div>
        <div class="bottom-btns" v-if="showLayoutModal">
          <ul class="bot-btns">
            <li>
              <Button type="ghost" :disabled="true">合并</Button>
            </li>
            <li>
              <Button type="ghost" :disabled="true">拆分</Button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="bottom-con sadasdasd" v-if="!showLayoutModal">
      <i class="icon iconfont icon-add" v-if="selectedTv && selectedTv.nodef && !enableController" style="margin-top: -2px;" @click.stop.prevent="openAddModal" title="添加"></i>
      <i class="icon iconfont icon-edit" v-if="selectedTv &&!selectedTv.nodef" @click.stop.prevent="openAltModal" title="修改"></i>
      <i class="icon iconfont icon-delete" v-if="!enableController" @click.stop.prevent="delMonitor(getTVName())" title="删除"></i>
      <i class="icon iconfont icon-decode-stop" title="停止解码" @click="closeTV"></i>
      <i class="icon iconfont icon-decode-stopall" title="全部停止解码" @click="closeAllTV"></i>
      <i class="icon iconfont" :class="showNumber? 'icon-number-hide': 'icon-number-display'" :title="showNumber? '隐藏编号': '显示编号'" @click="toggleShownum"></i>
      <div class="dp-con" @mouseenter="(showscreenShow=true)&&(hoverShowscreen=selectedShowscreen)" @mouseleave="showscreenShow=false">
        <i class="icon iconfont icon-multi-screen" title="窗口分割"></i>
        <ul v-show="showscreenShow">
          <i></i>
          <li v-for="screen in showScreenList" :key="screen.value" @mouseenter="hoverShowscreen=screen.value" @click="setShowscreen(screen.value)" :class="{active: screen.value===hoverShowscreen}">{{screen.label+'画面'}}</li>
        </ul>
      </div>
      <div class="dp-con" v-if="!enableController" @mouseenter="hoverLayout=selectedLayout; showlayout=true" @mouseleave="showlayout=false">
        <i class="icon iconfont icon-gaibianbuju" title="更改布局"></i>
        <ul v-show="showlayout">
          <i></i>
          <li v-for="layt in layoutArr" :key="layt._id" @mouseenter="hoverLayout=layt._id" @click="setLayout(layt)" :class="{active: layt._id===hoverLayout}">{{layt.name}}</li>
        </ul>
      </div>
    </div>
    <Modal v-model="showModal" :title="modalTitle" :width="480" :mask-closable="false">
      <div style="padding: 20px 10px 0 10px">
        <Form label-position="left" :label-width="100" :model="monitor" :rules="ruleValidate" ref="form">
          <Form-item label="监视器编号" prop="code" >
            <Input v-model="monitor.code" />
          </Form-item>
          <Form-item label="监视器名称" prop="name">
            <Input v-model="monitor.name" />
          </Form-item>
          <Form-item label="解码器名称" prop="equipment" v-show="!enableController">
            <i-select :disabled="enableController" v-model="monitor.equipment" @on-change="equipmentChange">
              <i-option v-for="item in decoderCfg" :value="item.value" :key="item.value">{{item.label}}</i-option>
            </i-select>
          </Form-item>
          <Form-item label="解码器IP" prop="ip" v-if="!enableController">
            <Input disabled :value="monitor.ip" />
          </Form-item>
          <Form-item label="解码通道" prop="channel" v-if="!enableController">
            <i-select :disabled="enableController" v-model="monitor.channel">
              <i-option v-for="item in channelCfg" :value="item.value" :key="item.value">{{item.label}}</i-option>
            </i-select>
          </Form-item>
          <Form-item label="拼接控制器信源" prop="splicingController" v-if="false">
            <i-select v-model="controllerValue" :disabled="true">
              <i-option v-for="item in controllerCfg" :value="item.value" :key="item.value">{{item.label}}</i-option>
            </i-select>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button type="ghost" @click="showModal=false">取消</Button>
        <Button type="ghost" @click="modalOK">确定</Button>
      </div>
    </Modal>
    <Modal title="创建电视墙" v-model="creatModal" :width="600" :mask-closable="false" @on-visible-change="closeCreateModel">
      <div class="creatLayout" :style="{height: `${50 * 8 + 100}px`, width: '100%', position: 'relative'}">
        <!-- <div class="creatLayout" :style="{height: `${50 * 8 + 100}px`, width: '100%', position: 'relative'}"> -->
        <div class="wrap-layout" :style="{width:wrapLayoutWidth}" @click="isClickBox = !isClickBox" @mouseleave="initLayoutWrap()">
          <span v-for="(div, v) in innerBoxData" :key="v" @mouseenter="innetBoxEnter(div)" @click="clickBox(div)" :class="[div.active ? 'active' : '']"></span>
        </div>
      </div>
      <Form label-position="left" :label-width="50" :model="layform" :rules="layValidate" ref="layform" class="inner-form">
        <Form-item label="横向" prop="column" style="width:40%;float:left">
          <Input v-model="layform.column" number />
        </Form-item>
        <Form-item label="纵向" prop="row" style="width:40%;float:right">
          <Input v-model="layform.row" number />
        </Form-item>
      </Form>
      <div slot="footer" style="position:relative;z-index:99">
        <Button type="ghost" @click="insertModel">插入</Button>
      </div>
    </Modal>
    <Modal v-model="renameModel" title="重命名布局" :mask-closable="false">
      <bs-cover v-if="renameModel" v-model="renameModel">
        <Input v-model="changeLayoutData.name" autofocus/>
      </bs-cover>
      <div slot="footer" style="position:relative;z-index:99">
        <Button type="ghost" @click="renameModel=false">取消</Button>
        <Button type="ghost" @click="renameModel=false||saveRename()">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
// import { GET_DECODER_ABILITY } from 'http/tvwall.api'
import { generateMonitorValidator, layoutValidator } from '../tvwall/tvform.validator'
import common from '../tvwall/tvcommon'
export default {
  mixins: [common],
  data() {
    return {
      showlayout: false,
      hoverLayout: '1',
      selectValue: {},
      showModal: false,
      showLayoutModal: false,
      showControllerModel: false,
      renameModel: false,
      creatModal: false,
      modalTitle: '添加监视器',
      layform: { // 修改布局的表单
        row: '',
        column: ''
      },
      monitor: { // 临时存储监视器变量
        code: 0,
        name: '',
        ip: '',
        equipment: '',
        channel: '',
        settle: false
      },
      controllerValue: '', // 拼接控制器信源
      defaultMonitor: {
        code: '001',
        name: '解码器',
        ip: '',
        equipment: '',
        channel: '',
        settle: false
      }, // 添加监视器表单默认是
      ruleValidate: generateMonitorValidator(this), // form表单校验
      layValidate: layoutValidator, // 布局表单校验
      videoConStyle: {
        top: '38px',
        bottom: '72px'
      },
      videoBoxStyle: {
        height: '100%',
        position: 'relative'
      },
      initLayout: true, // 初始化按钮的禁用
      disableAllDel: true,
      disableclear: true,
      innerBoxData: [], // 修改布局表格data
      isClickBox: false, // 是否点击box窗格
      isInsert: false, //  是否插入
      changeLayoutData: {
        id: '',
        name: '',
        row: '',
        column: ''
      }, // 修改布局临时变量
      layoutIndex: 0,
      activeIndex: 0,
      activedPane: 0,
      tvList: [], // 最终页面展示监视器列表
      showNumber: false,
      showScreenList: [
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
      hoverShowscreen: 4,
      state: {
        showscreen: 4
      }
    }
  },
  computed: {
    ...mapState({
      tvwall: ({ tvwall }) => tvwall.tvwall,
      layoutList: ({ tvwall }) => tvwall.allLayoutList,
      channelList: ({ tvwall }) => tvwall.channelList,
      decoderList: ({ tvwall }) => tvwall.decoderList,
      rtscene: ({ tvwall }) => tvwall.rtscene,
      monitors: ({ tvwall }) => tvwall.monitorList,
      enableController: ({ tvwall }) => tvwall.enableController,
      controllerCfg: ({ tvwall }) => tvwall.controllerCfg,
      originList: ({ tvwall }) => tvwall.originList,
      sceneList: ({ tvwall }) => tvwall.sceneList,
      planList: ({ tvwall }) => tvwall.planList
    }),
    ...mapGetters(['layout', 'jointcontroller', 'bgBoxStyle', 'bgTV']),
    wd() {
      if (this.showLayoutModal && !this.enableController) {
        return this.isInsert
          ? (1 / this.changeLayoutData.column) * 100 + '%'
          : (1 / this.layoutList[this.layoutIndex].column) * 100 + '%'
      }
      return !this.enableController
        ? (1 / this.layout.column) * 100 + '%'
        : this.layout.screeninfo.width * this.row + 'px'
    },
    ht() {
      if (this.showLayoutModal && !this.enableController) {
        return this.isInsert
          ? (1 / this.changeLayoutData.row) * 100 + '%'
          : (1 / this.layoutList[this.layoutIndex].row) * 100 + '%'
      }
      return !this.enableController
        ? (1 / this.layout.row) * 100 + '%'
        : this.layout.screeninfo.height * this.clo + 'px'
    },
    wrapLayoutWidth() {
      return `${50 * 8 + 8 * 5}px`
    },
    // 添加监视器可用通道数组
    // channelValue: {
    //   get: function() {
    //     const l = this.channelCfg.filter(item => item.value === this.monitor.channel)
    //     if (l.length) {
    //       return this.monitor.channel
    //     } else if (this.channelCfg.length) {
    //       return this.channelCfg[0].value
    //     } else {
    //       return ''
    //     }
    //   },
    //   set: function(v) {
    //     this.monitor.channel = v || ''
    //   }
    // },
    // 添加监视器可用监视器列表
    // decoderValue: {
    //   get: function() {
    //     const l = this.decoderCfg.filter(item => item.value === this.monitor.equipment._id)
    //     if (l.length) {
    //        return this.monitor.equipment._id
    //     } else if (this.decoderCfg.length) {
    //       return this.decoderCfg[0].value
    //     } else {
    //       return ''
    //     }
    //   },
    //   set: function(v) {
    //     this.monitor.equipment = v || ''
    //     if (this.enableController) {
    //       return
    //     }
    //     const l = this.decoderCfg.filter(item => item.value === v)
    //     if (l.length) {
    //       this.monitor.ip = l[0].ip
    //       this.monitor.port = l[0].cport
    //     } else {
    //       this.monitor.ip = ''
    //       this.monitor.port = ''
    //     }
    //   }
    // },
    // 解码器名称
    decoderCfg() {
      return this.decoderList.map(item => {
        return {
          value: item._id,
          label: item.name,
          ...item
        }
      })
    },
    // 通道名称
    channelCfg: {
      get() {
        const list = this.channelList.map(item => {
          return {
            value: item._id,
            label: item.name,
            ...item
          }
        })
        return list
      },
      set() {

      }
    },
    // 最终页面展示监视器列表
    tvs() {
      if (this.showLayoutModal && this.layoutArr.length === 0) {
        return []
      }
      var count = 0
      count = this.compuTvCount()
      if (count === 0) {
        return []
      }
      if (this.enableController) {
        this.setControllerList()
        if (this.originList.length > 0) {
          this.originList.forEach(item => {
            this.tvList.forEach(tv => {
              if (!item.jointorigin || tv.jointorigin) {
                return
              }
              if (item.jointorigin._id === tv.jointorigin) {
                return (tv.orginName = item.origin)
              }
            })
          })
        }
      } else {
        this.setList(count)
      }
      return this.tvList
    },
    layoutArr() {
      const arr = this.layoutList.map(item => {
        return {
          _id: item._id,
          name: item.name,
          column: item.column,
          row: item.row
        }
      })
      if (!this.showLayoutModal) {
        arr.push({ _id: 'new', name: '模板编辑' })
      }
      return arr
    },
    selectedLayout() {
      return this.layout._id
    },
    bgColor() {
      return this.rtscene.info.length > 0 ? '#000' : 'rgb(204, 204, 204)'
    },
    curSceneName() {
      /* this.$store.dispatch('getScenes').then(function(res) {
        console.log(res)
      }) */
      // console.log(this.sceneList)
      if (this.tvwall.selectedscene) {
        const result = this.$lodash.find(this.sceneList, item =>
          item._id === this.tvwall.selectedscene
        )
        return result !== undefined ? result.name : '未定义'
      } else {
        return '未定义'
      }
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
        const plan = this.$lodash.find(this.planList, item => item._id === this.tvwall.selectedplan)
        return plan ? plan.name : '未执行'
      } else {
        return '未执行'
      }
    },
    // 选中的积分个
    selectedShowscreen() {
      return this.state.showscreen
    },
    infos() {
      if (!this.rtscene) {
        return []
      }
      return this.rtscene.info
    },
    // 选中的监视器
    selectedTv() {
      return this.tvs[this.activeIndex]
    }
  },
  filters: {
    // 显示编号的过滤
    showNum(val) {
      let s = ''
      val = val + 1
      if (val <= 9) {
        s += '0'
      }
      s += val
      return s
    }
  },
  watch: {
    decoderCfg: {
      handler(f) {
        this.monitor.equipment = f[0] ? f[0].value : ''
        this.defaultMonitor.equipment = f[0] ? f[0].value : ''
        this.defaultMonitor.ip = f[0] ? f[0].ip : ''
      },
      deep: true,
      immediate: true
    },
    channelCfg(list) {
      this.defaultMonitor.channel = list.length ? list[0].value : ''
    },
    'monitor.equipment': function(v) {
      if (v) {
        v = typeof v === 'object' ? v._id : v
        this.getChannelCfg(v).then(res => {
          this.monitor.channel = this.channelCfg[0].value
        })
      }
    },
    layform: {
      deep: true,
      handler: function(v) {
        if (v.row === '' || v.column === '' || v.row === 0 || v.column === 0 || v.row > 8 || v.colum > 8) {
          return
        }
        this.changeActive(v)
      }
    },
    activeIndex(index) {
      if (this.tvs[index].settle) {
        this.disableclear = false
      } else {
        this.disableclear = true
      }
      this.state.showscreen = this.tvList[index].panecount
    },
    showModal(val) {
      if (!val) {
        this.$refs.form.resetFields()
      }
    }
  },
  methods: {
    ...mapActions([
      'getAllLayoutList',
      'getDecoderList',
      'setTVLayout',
      'addLayout',
      'delLayout',
      'chanLayout',
      'setDecoder',
      'addDecoder',
      'deleteDecoder',
      'getChannelCfg',
      'clearCfg',
      'recordLog',
      'setScreenSplit',
      'toggleShowNumAPI',
      'closeWall',
      'closeAllWall',
      'openWall',
      'updateRtScene',
      'getScenes',
      'getPlans'
    ]),
    equipmentChange(val) {
      let dcode = this.decoderCfg.filter(item => {
        return item.value === val
      })
      if (val) {
        this.monitor.ip = dcode[0].ip
      }
    },
    countWdHt(val, isHeight) {
      return !isHeight
        ? `${100 / Math.sqrt(val)}%`
        : `calc(${100 / Math.sqrt(val)}% - ${30 / Math.sqrt(val)}px)`
    },
    // 计算比例
    proportionRow() {
      if (!this.layout.screeninfo) {
        return 0
      }
      // 横向
      const row = this.layout.row // 数量
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
      const clo = this.layout.column // 数量
      const clientHeight = document.body.clientHeight - 238.6 // 浏览器可是区域高度
      const physicalHeight =
        this.layout.screeninfo.height * this.layout.row + (clo - 1) * this.layout.screeninfo.vinterval // 物理宽度
      this.clo = clientHeight / physicalHeight
    },
    // 设置监视器信息
    setList(count) {
      this.tvList.length = 0
      for (let i = 0; i < count; i++) {
        this.tvList.push({
          name: '未设置',
          settle: false,
          posit: 'relative',
          nodef: true,
          panecount: 4,
          type: 0
        })
      }

      if (this.monitors && this.monitors.length > 0) {
        this.disableAllDel = false
      }
      console.log(this.infos, this.monitors, '4545465656')
      //       if (this.infos.length > 0) {
      //         this.infos.forEach(item => {
      //           if (item.monitor) {
      //             const mInfo = this.$lodash.find(this.monitors,function(it) {
      //               return  it._id === item.monitor
      //             })
      //             if (mInfo && mInfo.position < count) {
      //               this.tvList[mInfo.position] = {
      //                 ...mInfo,
      //                 ...item,
      // /*                equipment:mInfo.equipment._id ,
      //                 channel:mInfo.channel._id,
      // /!*                monitor: mInfo._id,
      //                 *!/*/
      //                 name1: mInfo.name + '-' + mInfo.code,
      //                 settle: true, //true
      //                 isClick: false,
      //                 posit: 'relative',
      //               }
      //               this.tvList[mInfo.position]._id = mInfo._id
      //             }
      //           }
      //         })
      //       }
      this.monitors.length > 0 &&
        this.monitors.forEach(item => {
          let mInfo = ''
          if (this.infos.length > 0) {
            mInfo = this.$lodash.find(this.infos, function(it) {
              return it.monitor === item._id
            })
          }
          if (!mInfo) {
            mInfo = {
              monitor: item._id,
              type: 0,
              resources: []
            }
          }
          if (!item.panecount) {
            item.panecount = 4
          }
          // delete item._id
          console.log(mInfo, 'ffffffffffffffff')
          const it = {
            settle: true,
            isClick: false,
            posit: 'relative',
            name1: item.name + '-' + item.code,
            ...item,
            ...mInfo
          }
          // it.equipment = item.equipment._id || item.equipment
          // it.channel = item.channel._id || item.channel
          this.tvList[item.position] && (this.tvList[item.position] = it)
          this.tvList[item.position]._id = item._id
        })
      console.log(this.tvList, '12121212')
      if (this.tvList.length > 0) {
        this.state.showscreen = this.tvList[0].panecount
      }
    },
    // 设置启用拼控监视器信息
    setControllerList() {
      this.tvList.length = 0
      this.proportionRow()
      this.proportionClo()
      // 暂且当做监视器列表等于拼接屏下得监视器列表
      if (this.layout.wininfo.length > 0) {
        this.layout.wininfo.forEach(item => {
          for (let i = 0; i < this.monitors.length; i++) {
            if (this.monitors[i]._id === item.monitor) {
              const obj = {
                settle: true,
                posit: 'absolute',
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
      }
    },
    // 计算窗口数
    compuTvCount(count) {
      if (this.showLayoutModal) {
        if (this.isInsert) {
          count = this.changeLayoutData.row * this.changeLayoutData.column
        } else {
          let tempLayout = this.layoutList[this.layoutIndex]
          count = tempLayout.row * tempLayout.column
        }
      } else {
        count = this.layout.row * this.layout.column
      }
      return count
    },
    setLayout(v) {
      this.showlayout = false
      if (v._id === 'new') {
        this.videoConStyle.top = '54px'
        this.videoConStyle.bottom = '16px'
        this.videoBoxStyle.height = 'calc(100% - 96px)'
        this.showLayoutModal = true
      } else if (v._id !== this.layout._id) {
        this.recordLog({
          logType: '操作日志',
          module: '电视墙',
          operateName: '切换布局',
          operateContent: `切换布局: ${this.layout.name}`
        })
        this.commonAPIHandle(this.setTVLayout({ _id: v._id }), '切换布局', 'setLayout')
      }
    },
    getTVName(tv = this.selectedTv) {
      // console.log(this.selectedTv)
      if (tv.settle) {
        return tv.name + '-' + tv.code
      } else {
        return tv.name
      }
    },
    // 检测（轮询 || 预案 || 场景）是否使用
    checkUsing(index) {
      if (this.rtscene.info) {
        const info = this.rtscene.info[index]
        if (info && info.resources) {
          if (info.resources.filter(item => !!item).length) {
            return true
          }
        }
      }
      return false
    },
    openAddModal() {
      this.modalTitle = '添加监视器'
      Object.assign(this.monitor, this.defaultMonitor)
      // if (!this.enableController) {
      //   this.decoderValue = this.defaultMonitor.equipment
      // }
      this.monitor.code = this.getcode(this.activeIndex + 1)
      console.log(this.monitor.code, 'tainija')
      console.log(this.monitor)
      this.showModal = true
    },
    openAltModal() {
      const isUsing = this.checkUsing(this.activeIndex)
      if (isUsing) {
        return this.$Notice.error({
          title: '错误',
          desc: '该监视器正在使用, 无法修改',
          duration: 3
        })
      }
      this.modalTitle = '修改监视器'
      for (const key in this.selectedTv) {
        if (['equipment', 'channel'].includes(key)) {
          this.monitor[key] = this.selectedTv[key]._id
          continue
        }
        this.monitor[key] = this.selectedTv[key]
        this.monitor.ip = this.selectedTv.equipment.ip
      }
      // this.decoderValue = this.selectedTv.equipment._id
      // console.log(this.monitor, this.selectedTv)
      // console.log(this.monitor)
      this.showModal = true
    },
    getcode(code) {
      const c = '000' + code
      return c.slice(-3)
    },
    async delMonitor(name) {
      if (!this.selectedTv.settle) {
        return this.warningMsg('未设置的屏幕无法删除')
      }
      const res = await this.confirmModal(`确定要删除"${name}"吗?`)
      if (!res) {
        return
      }
      this.deleteDecoder([this.selectedTv._id])
        .then(resp => {
          // debugger
          if (resp) {
            this.disableclear = true
            this.$Notice.success({
              title: '成功',
              desc: '删除监视器成功',
              duration: 3
            })
          }
        })
        .catch(err => {
          this.$Notice.error({
            title: '错误',
            desc: err.response.data.message,
            duration: 3
          })
        })
    },
    async modalOK() {
      const valid = await this.validInput()
      if (!valid) {
        return
      }
      const param = {
        code: this.monitor.code,
        name: this.monitor.name,
        equipment: this.monitor.equipment,
        channel: this.monitor.channel,
        number: 1
      }
      if (this.enableController) {
        param.jointorigin = this.controllerValue
      }
      if (this.monitor.settle) {
        param.id = this.monitor._id
        this.commonAPIHandle(this.setDecoder(param), '修改', 'setDecoder')
      } else {
        param.position = this.activeIndex
        this.commonAPIHandle(this.addDecoder(param), '添加', 'addDecoder')
      }
      this.showModal = false
    },
    // 表单验证
    validInput() {
      return new Promise(resolve => {
        this.$refs.form.validate(valid => {
          resolve(valid)
        })
      })
    },
    // requestMonitorNumber() {
    //   return GET_DECODER_ABILITY({
    //     id: 2,
    //     ip: this.monitor.ip,
    //     port: this.monitor.port
    //   })
    // },
    validLayInput() {
      return new Promise(resolve => {
        this.$refs.layform.validate(valid => {
          resolve(valid)
        })
      })
    },
    async saveLayout(isInit) {
      if (isInit) {
        this.layform = {
          column: '',
          row: ''
        }
        let name = `布局${this.layoutArr.length + 1}`
        this.layoutArr.forEach(item => {
          if (item.name === name) {
            name = `布局${this.layoutArr.length + 2}`
          }
        })
        return this.addLayout({
          row: 0,
          column: 0,
          name: name,
          isTvwall: true
        })
          .then(resp => {
            this.changeLayoutData.id = resp.data._id
            this.getAllLayoutList().then(() => {
              this.scorll()
              this.layoutIndex = this.layoutArr.length - 1
              this.initLayout = false
            })
            this.$Notice.success({
              title: '成功',
              desc: '添加布局成功',
              duration: 3
            })
          })
          .catch(err => {
            this.$Notice.error({
              title: '错误',
              desc: err.response.data.message,
              duration: 3
            })
          })
      }
      const param = {
        row: this.changeLayoutData.row,
        column: this.changeLayoutData.column,
        id: this.changeLayoutData.id
      }
      this.chanLayout(param)
        .then(() => {
          this.$Notice.success({
            title: '成功',
            desc: '修改成功',
            duration: 3
          })
          this.getAllLayoutList()
        })
        .catch(err => {
          this.$Notice.error({
            title: '错误',
            desc: err.response.data.message,
            duration: 3
          })
        })
      this.creatModal = false
    },
    async insertModel() {
      const res = await this.validLayInput()
      if (!res) {
        return
      }
      this.changeLayoutData.row = this.layform.row
      this.changeLayoutData.column = this.layform.column
      this.isInsert = true
      this.creatModal = false
    },
    // 激活窗格
    clickTV(tv, index, v) {
      this.activeIndex = index
      this.activedPane = v
    },
    openCreateModel() {
      this.layform.row = this.changeLayoutData.row
      this.layform.column = this.changeLayoutData.column
      this.creatModal = true
      this.changeActive(this.layform)
    },
    closeCreateModel(val) {
      if (!val) {
        this.$refs.layform.resetFields()
        this.isClickBox = false
      }
    },
    deleteLayout(id) {
      if (id === this.selectedLayout) {
        return this.$Notice.error({
          title: '错误',
          desc: '该布局正在使用, 无法删除',
          duration: 3
        })
      }
      this.delLayout(id)
        .then(() => {
          this.getAllLayoutList().then(() => {
            this.initLayout = true
            this.layoutIndex = this.layoutArr.length - 1
            this.changeLayoutIndex(this.layoutIndex)
            this.scorll()
            this.$Notice.success({
              title: '成功',
              desc: '删除成功',
              duration: 3
            })
          })
        })
        .catch(err => {
          console.error('delLayout', err)
          this.$Notice.error({
            title: '错误',
            desc: '删除失败',
            duration: 3
          })
        })
    },
    // 改变选中布局
    changeLayoutIndex(index) {
      this.layoutIndex = index
      this.initLayout = true
      this.isInsert = false
      this.activeIndex = 0
    },
    changeLayout(obj, index) {
      if (obj._id === this.selectedLayout) {
        return this.$Notice.error({
          title: '错误',
          desc: '该布局正在使用, 无法修改',
          duration: 3
        })
      }
      this.layoutIndex = index
      this.changeLayoutData.id = obj._id
      this.changeLayoutData.name = obj.name
      this.layform.column = this.changeLayoutData.column = obj.column
      this.layform.row = this.changeLayoutData.row = obj.row
      this.initLayout = false // 右侧添加按钮可用
      this.isInsert = false
    },
    delAllMonitor() {
      const delList = []
      this.tvs.forEach(tv => {
        if (tv.settle) {
          delList.push(tv._id)
        }
      })
      console.log(delList, 'qingchu')
      this.commonAPIHandle(this.deleteDecoder(delList), '删除', 'deleteDecoder')
    },
    // 模板编辑退出
    dropOut() {
      this.videoConStyle.top = '38px'
      this.videoConStyle.bottom = '72px'
      this.videoBoxStyle.height = '100%'
      this.showLayoutModal = false
      this.initLayout = true
      this.activeIndex = 0
      this.layoutIndex = 0
    },
    // 布局重命名
    rename(val) {
      this.changeLayoutData.id = val._id
      this.changeLayoutData.name = val.name
      this.renameModel = true
    },
    saveRename() {
      if (!this.changeLayoutData.name || this.changeLayoutData.name.replace(/\s+/g, '') === '') {
        this.$nextTick(() => {
          this.showModal = true
        })
        this.$Notice.error({
          title: '错误',
          desc: '布局名称不能为空',
          duration: 3
        })
      } else {
        this.chanLayout({
          id: this.changeLayoutData.id,
          name: this.changeLayoutData.name
        })
          .then(() => {
            this.getAllLayoutList()
            this.$Notice.success({
              title: '成功',
              desc: '修改布局名称成功',
              duration: 3
            })
          })
          .catch(err => {
            console.error('chanLayout', err)
            this.$Notice.error({
              title: '错误',
              desc: '修改布局名称失败',
              duration: 3
            })
          })
      }
    },
    // 根据传入对象，变更所有数据的active
    changeActive(obj = { column: 0, row: 0 }, arr = this.innerBoxData) {
      arr.forEach(item => {
        if (item.row <= obj.row) {
          item.column <= obj.column ? (item.active = true) : (item.active = false)
        } else {
          if (item.active) {
            item.active = false
          }
        }
      })
    },
    // 点击innetBox
    clickBox(item) {
      this.layform.row = item.row
      this.layform.column = item.column
      this.changeActive(item)
    },
    innetBoxEnter(td) {
      if (this.isClickBox) {
        return
      }
      this.layform.column = td.column
      this.layform.row = td.row
      this.changeActive(td)
    },
    initLayoutWrap() {
      if (this.isClickBox) {
        return
      }
      this.$refs.layform.resetFields()
      this.changeActive()
    },
    // 计算table的data值
    computerTableData(row = 8, col = 8, arr = this.innerBoxData) {
      arr.length = 0
      for (let i = 0; i < row * col; i++) {
        let obj = {
          column: i < 8 ? i + 1 : (i % col) + 1,
          row: i < 8 ? 1 : Math.ceil((i + 1) / row),
          active: false
        }
        arr.push(obj)
      }
    },
    setProportion() {
      this.proportionRow()
      this.proportionClo()
      this.setControllerList()
      this.showLayoutModal && this.scorll()
    },
    scorll() {
      if (this.$refs.scorlls) {
        this.$refs.scorlls.update()
      }
    },
    closeTV() {
      if (this.selectedTv.nodef) {
        this.warningMsg('未设置的屏幕无法操作')
        return
      }
      const code = this.activedPane + 1
      this.commonAPIHandle(
        this.closeWall({
          monitor: this.selectedTv._id,
          number: code
        }),
        '停止解码',
        'closeWall'
      )
    },
    closeAllTV() {
      this.commonAPIHandle(this.closeAllWall(), '全部停止解码', 'closeAllWall')
    },
    handleDrop(e) {
      let data = e.dataTransfer.getData('Text')
      if (/^\{.*\}$/.test(data)) {
        data = JSON.parse(data)
        let target = e.target
        target.click()
        this.setResource(data, +target.getAttribute('index'))
      }
    },
    setResource(res, index) {
      const code = index + 1
      if (this.selectedTv.nodef) {
        this.warningMsg('未设置的屏幕无法设置上墙资源')
        return
      }
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
          monitor: this.selectedTv._id,
          number: code,
          resource: res._id
        }),
        '上墙',
        'openWall'
      )
    },
    toggleShownum() {
      this.showNumber = !this.showNumber
      this.commonAPIHandle(
        this.toggleShowNumAPI({
          show: this.showNumber,
          monitors: this.tvs.filter(item => !item.nodef).map(item => item._id)
        }),
        '',
        'showno'
      )
    },
    changeAlarm(v, index) {
      this.tvs[index].type = this.tvs[index].type === 2 ? 0 : 2
      this.commonAPIHandle(this.updateChange(), '设置', 'changeAlarm')
    },
    updateChange() {
      console.log('设置模块', this.tvs)
      return this.updateRtScene({ info: this.tvs.filter(item => !item.nodef) })
    },
    setShowscreen(num, isMouse = false) {
      if (this.selectedTv.nodef) {
        this.warningMsg('未设置的屏幕无法设置分割')
        return new Promise((resolve, reject) => {})
      }
      return this.commonAPIHandle(
        this.setScreenSplit({
          monitor: this.selectedTv._id,
          panecount: num,
          isMouse
        }),
        '设置',
        'setSplit'
      )
    }
  },
  created() {
    this.getDecoderList()
    this.computerTableData()
    this.getScenes()
    this.getPlans()
    if (this.enableController) {
      window.addEventListener('resize', this.setProportion)
      if (this.activeIndex !== 0) {
        this.activeIndex = 0
      }
    }
  },
  beforeDestroy() {
    this.clearCfg()
    if (this.enableController) {
      window.removeEventListener('resize', this.setProportion)
    }
  }
}
</script>
<style lang="less" scoped>
.tvname {
  width: 100%;
  white-space: pre;
  overflow: hidden;
  text-overflow: ellipsis;
}

.video-con {
  position: absolute;
  left: 0;
  right: 0;
  top: 38px;
  display: flex;
}
.video-con .right-con {
  flex: 1;
}
.video-con .bottom-btns {
  height: 56px;
  line-height: 56px;
  width: 100%;
  background: #1b3153;
}

.theme-btn.tvbtn-hover {
  background: #434343;
  border: 1px solid #00a5e3;
}
// .videos-box .active {
//   border: 1px solid #00a5e3;
//   box-sizing: border-box;
// }
.bg-box {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  z-index: 1;
  top: -100%;
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
.tvs {
  display: inline-block;
  vertical-align: middle;
  z-index: 10;
  cursor: pointer;
  .bottom {
    width: 100%;
    bottom: 0;
    height: 30px;
    padding-left: 10px;
    line-height: 30px;
  }
  .tv {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    border: 1px solid #444;
    .iconfont {
      font-size: 30px;
      &:hover {
        color: #00a5e3;
      }
    }
  }
  .active {
    border: 1px solid #00a5e3;
    box-sizing: border-box;
  }
}

.tvs.dragging {
  transform: scale(1.1);
  border-color: #555;

  .bottom {
    background: #555;
  }
}

.form {
  margin: 50px 0 100px;
  width: 450px;
  text-align: center;
  padding: 0 10px;

  .item {
    label {
      display: inline-block;
      width: 80px;
      height: 40px;
      line-height: 40px;
    }

    input {
      padding: 2px;
      width: 160px;
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

.bottom-con {
  position: absolute;
  bottom: 16px;
  height: 56px;
  line-height: 28px;
  width: 100%;
  background: #1b3153;
  border-top: 1px solid rgba(58, 90, 139, 0.4);
  display: flex;
  padding: 16px;
}

.tv-btn {
  padding: 4px 12px;
  font-size: 12px;
  border-radius: 3px;
  cursor: pointer;
  margin: 0 5px;
  border: 1px solid transparent;
}
.iconfont {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  padding: 0 11px;
  vertical-align: middle;
  display: table-cell;
}
.iconfont:hover {
  color: #fda54b;
}

.dp-con {
  ul {
    position: relative;
    height: 40px;
    line-height: 43px;
    background: #335589;
    bottom: 36px;
    left: 43px;
    margin-left: -1px;
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
      top: 12px;
      left: -7px;
    }

    .active {
      color: #c47019;
    }
  }
}

iframe {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  border: 0 none;
}

.inbl {
  display: inline-block;
  width: 160px;
}
.layout-titie {
  width: 100%;
  height: 38px;
  line-height: 38px;
  font-size: 14px;
  background: #1b3153;
  padding-left: 24px;
  margin-bottom: 16px;
}
.left-list {
  width: 272px;
  margin-right: 16px;
  background: #1b3153;
  overflow: hidden;
}
.left-list li {
  display: flex;
  line-height: 36px;
  border-bottom: 1px solid rgba(58, 90, 139, 0.4);
  padding: 0 16px;
  box-sizing: border-box;
}
.left-list li:hover {
  background: #2a436a;
}
.left-list span {
  flex: 1;
  cursor: pointer;
  padding-right: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.iconfont {
  color: #fff;
  margin: 0 2px;
  cursor: pointer;
}
.left-bottom-btn {
  width: 100%;
  margin-top: 40px;
  text-align: center;
}
.list-titie {
  height: 40px;
  line-height: 40px;
  padding: 0 16px;
  background: rgb(15, 35, 67);
}
.left-list button {
  margin: 0 6px;
}
.top-con {
  height: 40px;
  padding-left: 18px;
}
.bottom-btns {
  padding-left: 18px;
  border-top: 1px solid rgba(58, 90, 139, 0.4);
}
.top-btns,
.bot-btns {
  text-align: center;
  float: left;
}
.top-btns li,
.bot-btns li {
  margin: 0 6px;
  display: inline-block;
}
.wrap-layout {
  margin: 0 auto;
}
.wrap-layout span {
  width: 50px;
  height: 50px;
  margin-right: 5px;
  display: inline-block;
  border: 1px solid #fff;
}
.wrap-layout .active {
  background: #000;
  border-color: #f00;
}
.inner-form {
  height: 34px;
  width: 400px;
  position: absolute;
  bottom: 100px;
  left: 100px;
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

.show-num {
  color: #bfbfbf;
  position: absolute;
  width: 30px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  top: calc(~'50% - 10px');
  left: calc(~'50% - 15px');
}

.show-big-num {
  color: #171717;
  background: #bfbfbf;
  height: 30px;
  width: 30px;
  line-height: 30px;
  font-size: 18px;
  position: absolute;
  text-align: center;
  left: calc(~'50% - 15px');
  bottom: calc(~'50%');
  z-index: 20;
}
</style>
