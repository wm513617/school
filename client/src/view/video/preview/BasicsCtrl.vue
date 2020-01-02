<template>

  <div class="BasicsCtrl">
    <div class="dome-box">
      <dome class="dome" @stop="ptzStop" @start="ptzCtrol">
      </dome>
      <div class="times-box">
        <times title="变倍" @startMinus="ptzCtrol('zoomIn')" @stopMinus="ptzStop('zoomIn')" @stopAdd="ptzStop('zoomOut')" @startAdd="ptzCtrol('zoomOut')">
        </times>
        <!-- <times title="光圈" @startMinus="ptzCtrol('irisClose')" @stopMinus="ptzStop('irisClose')" @stopAdd="ptzStop('irisOpen')" @startAdd="ptzCtrol('irisOpen')">
        </times>
        <times title="焦距" @startMinus="ptzCtrol('focusFar')" @stopMinus="ptzStop('focusFar')" @stopAdd="ptzStop('focusNear')" @startAdd="ptzCtrol('focusNear')">
        </times> -->
        <times title="光圈" @startMinus="ptzCtrol('irisClose')" @stopMinus="ptzCtrol('stopAll')" @stopAdd="ptzCtrol('stopAll')" @startAdd="ptzCtrol('irisOpen')">
        </times>
        <times title="焦距" @startMinus="ptzCtrol('focusFar')" @stopMinus="ptzCtrol('stopAll')" @stopAdd="ptzCtrol('stopAll')" @startAdd="ptzCtrol('focusNear')">
        </times>
        <div class="speed">
          <b>速度</b>
          <div class="slider-box">
            <slider color="#4699f8" :range="true" :size="5" :minValue='1' v-model="speed">
            </slider>
          </div>
        </div>
      </div>
    </div>

    <div class="ctrlBtn" v-if="showMore">
      <i class="iconfont icon-lighting" :class="{'active':openleLight}" title='灯光' @click="handleLight"></i>
      <i class="iconfont icon-wiper" title='雨刷' :class="{'active':openWiper}" @click="handleWiper"></i>
      <i class="iconfont icon-focusing" title='辅助对焦' :class="{'active':openFocus}" @click="handleFocus"></i>
      <i class="iconfont icon-d hide" title='3D控制' :class="{'active':open3Dctrl}" @click="handle3Dctrl"></i>
      <i class="iconfont icon-speed hide" title='激光变倍' :class="{'active':openLaserZoom}" @click="handleLaserZoom"></i>
      <i class="iconfont icon-chushihua" title='镜头初始化' @click="shotInit"></i>
      <i class="iconfont icon-patrol hide" title="一键守望"></i>
    </div>

    <!--高级控制-->
    <div class="advancedControl" v-if="showMore" ref="advancedControl">
      <div class="tit">
        <div class="jx l"></div>
        <div class="jx r"></div>
        <div class="title" @click='advancedOpen=!advancedOpen'>
          <Icon type="chevron-down" v-if="!advancedOpen"></Icon>
          <Icon type="chevron-up" v-if="advancedOpen"></Icon>
          &nbsp;高级控制
        </div>
      </div>
      <div class="advanceSelected" v-if='advancedOpen'>
        <ul>
          <li :class="{'active': advanceSelected === 'yuzhiwei'}" @click="advanceSelected = 'yuzhiwei'">预置位</li>
          <li :class="{'active': advanceSelected === 'xunhang'}" @click="advanceSelected = 'xunhang'">巡航</li>
          <li :class="{'active': advanceSelected === 'guiji'}" @click="advanceSelected = 'guiji'">轨迹</li>
          <li :class="{'active': advanceSelected === 'saomiao'}" @click="advanceSelected = 'saomiao'">扫描</li>
        </ul>
        <!--预置位-->
        <div v-show="advanceSelected === 'yuzhiwei'" class="yuzhiwei advance-item">
          <div class="advance-box clearFloat">
            <Select v-model="presetVal"
                      size='small'
                      :disabled='presetSetOpen'
                      style="width:140px;float:left; backgounrd: gray">
                <Option v-for="item in presetAllList"
                        :value="item.value"
                        :key="item.value">{{ item.label }}</Option>
              </Select>
            <!-- <Vselect :options="presetList" size="small" :disabled='presetList.length === 0||presetSetOpen' v-model="presetVal" style="width:140px;float:left;"></Vselect> -->

            <div class="advance-btn " :class="{'dis-btn': presetSetOpen}" @click="transPresset">调用</div>
            <div class="advance-icon" v-if="showMore" @click='presetSetOpen=!presetSetOpen'>
              <i class="iconfont icon-setting" :class="{'icon-recovery': presetSetOpen}"></i>
            </div>
          </div>

          <div class="advance-set" v-if='presetSetOpen'>
            <div class="setList clearFloat">
              <div style="width:80px;float:left;color:#fff;;line-height:32px">设置预置位</div>
              <!-- <Vselect :options="presetAllList" v-model="presetAllVal" style="width:120px;float:left;" :maxHeight="200"></Vselect> -->
              <Select v-model="presetAllVal" size='small' style="width:120px;float:left;" transfer>
                <Option v-for="item in presetAllList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <div class="advance-icon" @click="addPreset" :class="{'dis-icon': presetAllList.length === 0}">
                <i class="iconfont icon-save"></i>
              </div>
            </div>
            <div class="setList clearFloat">
              <div style="width:80px;float:left;color:#fff;line-height:32px">已设置预置位</div>
              <Select v-model="presetDelVal" size='small' style="width:120px;float:left;" transfer>
                <Option v-for="item in presetDelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <div class="advance-icon" @click="delPreset" :class="{'dis-icon': presetDelList.length === 0}">
                <i class="iconfont icon-delete"></i>
              </div>
            </div>
          </div>
        </div>
        <!--巡航-->
        <bs-scroll v-show="advanceSelected === 'xunhang'" class="xunhang advance-item" :height="xunhangHeight" :class="{cruiseSetOff: !cruiseSetOpen}">
          <div class="advance-box clearFloat">
            <Select v-model="cruiseVal" size='small' :disabled='cruiseList.length === 0 || cruiseSetOpen' style="width:140px;float:left;" transfer>
              <Option v-for="item in cruiseList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <div class="advance-btn " @click="transCuise" :class="{'dis-btn': cruiseList.length === 0 || cruiseSetOpen}">调用</div>
            <div class="advance-icon" v-if="showMore" @click='(cruiseSetOpen?xunhangHeight="25px":xunhangHeight="205px");cruiseSetOpen=!cruiseSetOpen'>
              <i class="iconfont icon-setting" :class="{'icon-recovery': cruiseSetOpen}"></i>
            </div>
          </div>

          <div class="advance-set" v-show='cruiseSetOpen'>
            <div class="setList clearFloat">
              <div style="width:60px;float:left;color:#fff;">巡航路径</div>
              <Select v-model="cruiseRouteVal" size='small' @on-change="cruiseRouteValCheng" style="width:110px;float:left;" transfer>
                <Option v-for="item in cruiseRouteList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <div class="advance-icon" @click="addPreseToCuise" :class="{'dis-icon': cruiseRouteList.length === 0}">
                <i class="iconfont icon-large"></i>
              </div>
              <div class="advance-icon" @click="saveCurisePreset" :class="{'dis-icon': cruiseRouteList.length === 0}">
                <i class="iconfont icon-save"></i>
              </div>
            </div>

            <div style="width:100%;max-height:52px">
              <table class="table">
                <tr>
                  <th>
                    <div style="width:60px">预置点</div>
                  </th>
                  <th>
                    <div style="width:50px">速度</div>
                  </th>
                  <th>
                    <div style="width:65px">时间（秒）</div>
                  </th>
                  <th>
                    <div style="width:50px">操作</div>
                  </th>
                </tr>

                <tr v-for="(item,i) in cruiseSetData" :key="i">
                  <td>
                    <Select v-model="item.preset" size='small' placement="top" style="width:60px;" transfer>
                      <Option v-for="item in presetAllList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </td>
                  <td>
                    <Select v-model="item.speed" size='small' placement="top" style="width:50px;" transfer>
                      <Option v-for="item in orbitSpeedList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </td>
                  <td>
                    <Input-number :max="3600" :min="5" v-model="item.time" size='small' style="width:65px;"></Input-number>
                  </td>
                  <td>
                    <i class="iconfont icon-delete" @click="delCruiseData(i,item)"></i>
                    <i class="iconfont icon-move-up" @click="upCruiseData(i)"></i>
                    <i class="iconfont icon-move-down" @click="downCruiseData(i)"></i>
                  </td>
                </tr>
              </table>
            </div>

          </div>
        </bs-scroll>
        <!--轨迹-->
        <div v-if="advanceSelected === 'guiji'" class="guiji advance-item">
          <div class="advance-box clearFloat">
            <Select v-model="orbitVal" size='small' :disabled='orbitList.length === 0 || orbitSetOpen' style="width:140px;float:left;">
              <Option v-for="item in orbitList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <div class="advance-btn " @click="transTraj" :class="{'dis-btn': orbitList.length === 0 || orbitSetOpen}">调用</div>
            <div class="advance-icon" v-if="showMore" @click='orbitSetOpen=!orbitSetOpen'>
              <i class="iconfont icon-setting" :class="{'icon-recovery': orbitSetOpen}"></i>
            </div>
          </div>

          <div class="advance-set" v-if='orbitSetOpen'>
            <div class="setList clearFloat">
              <div style="width:80px;float:left;color:#fff;" class="title">轨迹路径</div>
              <Select v-model="orbitRouteVal" size='small' style="width:120px;float:left;">
                <Option v-for="item in orbitRouteList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="setList clearFloat">
              <div style="width:80px;float:left;color:#fff;">轨迹速度</div>
              <Select v-model="orbitSpeedVal" size='small' style="width:120px;float:left;">
                <Option v-for="item in orbitSpeedList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="setList guijiSet clearFloat">
              <div class="advance-btn-big " @click="recordTraj?stopRecordTraj():startRecordTraj()" :class="{'dis-btn': orbitRouteList.length === 0}">{{recordTraj?'停止录制':'录制轨迹'}}</div>
            </div>
          </div>
        </div>
        <!--扫描-->
        <div v-if="advanceSelected === 'saomiao'" class="saomiao advance-item">
          <div class="advance-box clearFloat">
            <div class="advance-btn-big " @click="linearScan" :class="{'dis-btn': scanSetOpen}">随机扫描</div>
            <div class="advance-btn-big " @click="scanAuto" :class="{'dis-btn': scanSetOpen}">自动扫描</div>
            <div class="advance-icon" @click='scanSetOpen=!scanSetOpen' v-if="showMore">
              <i class="iconfont icon-setting" :class="{'icon-recovery': scanSetOpen}"></i>
            </div>
          </div>

          <div class="advance-set" v-if='scanSetOpen'>
            <div class="setList clearFloat">
              <div style="width:80px;float:left;color:#fff;">扫描速度</div>
              <Select v-model="scanSpeedVal" size='small' style="width:120px;float:left;">
                <Option v-for="item in scanSpeedList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="setList saomiaoSet clearFloat">
              <div class="advance-btn-big " @click="leftEdge" :class="{'dis-btn': scanSpeedList.length === 0}">设置左限位</div>
              <div class="advance-btn-big " @click="rightEdge" :class="{'dis-btn': scanSpeedList.length === 0}">设置右限位</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { YUNNAN_CTRL_SET, YUNNAN_CTRL_GET, recordUserLog } from '../../../http/video.api.js'
import Dome from '../../../components/BSdome'
import Times from '../../../components/BStimes'
import Slider from '../../../components/Slider'
import Vselect from '../../../components/common/VSelect'
// import Vselects from '../../../components/common/VSelects'
import { mapActions } from 'vuex'
export default {
  name: 'BasicsCtrl',
  components: {
    Dome,
    Times,
    Slider,
    Vselect
  },
  props: {
    showMore: {
      default: false
    }
  },
  data() {
    return {
      xunhangHeight: '25px',
      speed: 3,
      advanceSelected: 'yuzhiwei',
      advancedOpen: false,
      presetList: [], // 预置位
      presetVal: 1,
      presetAllList: [],
      presetAllVal: '',
      presetDelList: [
        {
          value: 'all',
          label: '全部'
        }
      ],
      presetDelVal: 1,
      isaddPreset: false,
      isdelPreset: false,
      cruiseList: [], // 巡航
      cruiseVal: 1,
      cruiseSetList: [],
      cruiseRouteList: [],
      cruiseRouteVal: 1,
      orbitList: [], // 轨迹
      orbitVal: 1,
      orbitRouteList: [],
      orbitRouteVal: 1,
      orbitSpeedList: [],
      orbitSpeedVal: 1,
      recordTraj: false,
      scanList: [], // 扫描
      scanVal: 1,
      scanSpeedList: [],
      scanSpeedVal: 1,
      presetSetOpen: false,
      cruiseSetOpen: false,
      orbitSetOpen: false,
      scanSetOpen: false,
      cruiseData: [
        {
          preset: 1,
          speed: 1,
          time: 5
        },
        {
          preset: 1,
          speed: 1,
          time: 5
        }
      ],
      resPreset: {},
      resTrial: {},
      resScan: {},
      resCuise: {},
      openleLight: false,
      openWiper: false,
      openFocus: false,
      open3Dctrl: false,
      openLaserZoom: false,
      cruiseSetData: []
    }
  },
  computed: {
    plugin() {
      return this.$parent.plugin
    }
  },
  watch: {
    'plugin.activedIndex'() {
      if (!this.plugin.pluginState.isPlay) {
        return
      }
      this.getYuntai()
    },
    'plugin.pluginState.isPlay'(b) {
      if (!this.plugin.pluginState.isPlay) {
        return
      }
      this.getYuntai()
    },
    cruiseRouteVal() {
      this.cruiseSetData = this.$lodash.cloneDeep(this.cruiseSetList[this.cruiseRouteVal - 1])
    },
    advanceSelected() {
      this.cruiseSetData = []
      if (this.advanceSelected === 'xunhang') {
        this.cruiseSetData = this.$lodash.cloneDeep(this.cruiseSetList[this.cruiseRouteVal - 1])
      }
    },
    speed(val) {
      this.setSpeedCtrl(val)
    }
  },
  methods: {
    ...mapActions(['setSpeedCtrl', 'getCameraPower']),
    getYuntai() {
      const res = this.plugin.pluginData[this.plugin.activedIndex]
      let devInfo = {}
      if (res && !res.gbDevId) {
        if (res.gbDevId) {
          const id = window.serverId[res.shareServer]
          devInfo = {
            gbPlaDevIp: id.ip,
            gbPlaDevPort: id.port,
            gbDevId: res.gbDevId,
            gbPlaNvrId: id.serverId
          }
        } else {
          devInfo = {
            devIp: res.ip,
            devPort: res.port
          }
        }
        const param = {
          devInfo: devInfo
        }
        this.getPresets(param)
        // this.getCuise(param)
        // this.getTrial(param)
        // this.getScan(param)
      }
    },
    getNumberArr(number) {
      const arr = []
      for (let i = 1; i <= number; i++) {
        arr.push({
          value: i,
          label: i
        })
      }
      return arr
    },
    ptzCtrol(cmd) {
      this.controlDome(cmd)
    },
    ptzStop(cmd) {
      this.controlDome(cmd, 0, 1, 1, 5, 1, 1, 'noNotice') // 不提示没有权限
    },
    // 灯光
    handleLight() {
      if (this.openleLight) {
        this.controlDome('lightPwrOn', 0).then(res => {
          if (res.status === 200) {
            this.openleLight = false
          }
        })
      } else {
        this.controlDome('lightPwrOn').then(res => {
          if (res.status === 200) {
            this.openleLight = true
          }
        })
      }
    },
    // 雨刷
    handleWiper() {
      if (this.openWiper) {
        this.controlDome('wiperPwrOn', 0).then(res => {
          if (res.status === 200) {
            this.openWiper = false
          }
        })
      } else {
        this.controlDome('wiperPwrOn').then(res => {
          if (res.status === 200) {
            this.openWiper = true
          }
        })
      }
    },
    // 对焦
    handleFocus() {
      if (this.openFocus) {
        this.controlDome('auxPwrOn1', -1).then(res => {
          if (res.status === 200) {
            this.openFocus = false
          }
        })
      } else {
        this.controlDome('auxPwrOn1').then(res => {
          if (res.status === 200) {
            this.openFocus = true
          }
        })
      }
    },
    // 激光变倍
    handleLaserZoom() {
      if (this.openLaserZoom) {
        // this.controlDome('auxPwron1', -1)
      } else {
        // this.controlDome('auxPwron1')
      }
      // this.openLaserZoom = !this.openLaserZoom
    },
    // 3D控制
    handle3Dctrl() {
      if (this.open3Dctrl) {
        // this.controlDome('auxPwron1', -1)
      } else {
        // this.controlDome('auxPwron1')
      }
      // this.open3Dctrl = !this.open3Dctrl
    },
    // 镜头初始化
    shotInit() {
      this.controlDome('initCamera')
        .then(res => {
          this.$Notice.success({ title: '提示', desc: '镜头初始化成功！' })
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: '镜头初始化失败！' })
          console.log(err)
        })
    },
    // 调用预置位
    transPresset() {
      // if (this.presetList.length === 0 && this.presetSetOpen) return
      if (this.presetSetOpen) {
        return
      }
      this.controlDome('gotoPreset', this.speed, this.presetVal)
        .then(res => {
          this.$Notice.success({ title: '提示', desc: '调用预置位成功！' })
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: '调用预置位失败！' })
          console.log(err)
        })
    },
    getPresets(param) {
      // 获取预置位
      YUNNAN_CTRL_GET.getpreset(param)
        .then(suc => {
          const arr = JSON.parse(JSON.stringify(suc.data.presetArr))
          console.log('getPresets', arr)
          this.presetList = []
          this.presetDelList = [
            {
              value: 'all',
              label: '全部'
            }
          ]
          arr.forEach(item => {
            this.presetList.push({ value: item, label: item })
            this.presetDelList.push({ value: item, label: item })
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    addPreset() {
      // 添加预置位
      if (this.isaddPreset) {
        return
      }
      for (var i = 0; i < this.presetList.length; i++) {
        // if (this.presetList[i].value === this.presetAllVal.label) {
        if (this.presetList[i].value === this.presetAllVal) {
          return
        }
      }
      this.isaddPreset = true
      this.controlDome('setPreset', this.speed, this.presetAllVal)
        .then(res => {
          if (res.status === 200) {
            // this.presetDelList.push({ value: this.presetAllVal.label, label: this.presetAllVal.label })
            // this.presetList.push({ value: this.presetAllVal.label, label: this.presetAllVal.label })
            this.presetDelList.push({ value: this.presetAllVal, label: this.presetAllVal })
            this.presetList.push({ value: this.presetAllVal, label: this.presetAllVal })
            this.$Notice.success({ title: '提示', desc: '预置位添加成功！' })
            console.log(this.presetDelList, this.presetList)
          }
          this.isaddPreset = false
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: '预置位添加失败！' })
          this.isaddPreset = false
          console.log(err)
        })
    },
    delPreset() {
      // 删除预置位
      if (this.isdelPreset) {
        return
      }
      this.isdelPreset = true
      if (this.presetDelVal === 'all') {
        this.presetDelList.forEach(item => {
          if (item.value !== 'all') {
            this.controlDome('clrPreset', this.speed, item.label)
          }
        })
        this.presetList = []
        this.presetDelList = [{ value: 'all', label: '全部' }]
        this.isdelPreset = false
        return
      }
      this.controlDome('clrPreset', this.speed, this.presetDelVal)
        .then(() => {
          for (var i = 0; i < this.presetList.length; i++) {
            if (this.presetList[i].value === this.presetDelVal) {
              this.presetList.splice(i, 1)
            }
          }
          for (var j = 0; j < this.presetDelList.length; j++) {
            console.log(this.presetDelList[j].value, this.presetDelVal)
            if (this.presetDelList[j].value === this.presetDelVal) {
              this.presetDelList.splice(j, 1)
            }
          }
          // 更新下拉框的当前值
          this.presetDelVal = this.presetDelList[this.presetDelList.length - 1].value
          this.isdelPreset = false
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: '预置位删除失败！' })
          this.isdelPreset = false
          console.log(err)
        })
    },
    // 巡航
    transCuise() {
      if (this.cruiseList.length === 0 && this.cruiseSetOpen) {
        return
      }
      this.controlDome('runSeq', this.speed, 1, this.cruiseVal)
        .then(itme => {
          this.$Notice.success({ title: '成功', desc: '巡航调用成功！' })
        })
        .catch(() => {
          this.$Notice.error({ title: '失败', desc: '巡航调用失败！' })
        })
      // .then(() => {
      //   this.isTranCuise = true
      // })
    },
    StopCuise() {
      this.controlDome('stopSeq', this.speed, 1, this.cruiseVal)
      // .then(() => {
      //   this.isTranCuise = false
      // })
    },
    getCuise(param) {
      YUNNAN_CTRL_GET.getcruisepath(param)
        .then(suc => {
          // const arr = JSON.parse(JSON.stringify(suc.data.seqArr))
          // this.cruiseList = []
          // arr.forEach((item) => {
          //   this.cruiseList.push({value: item, label: item})
          // })
          this.cruiseList = [].concat(this.cruiseRouteList)
        })
        .catch(err => err)
    },
    addPreseToCuise() {
      this.cruiseSetData.push({
        preset: 1,
        speed: 1,
        time: 5
      })
    },
    async saveCurisePreset() {
      this.cruiseSetList[this.cruiseRouteVal - 1] = this.cruiseSetData

      // this.cruiseSetData.forEach(item => {
      //   this.controlDome('fillPreSeq', item.speed, item.preset, this.cruiseRouteVal, item.time)
      //   this.controlDome('setSeqDwell', item.speed, item.preset, this.cruiseRouteVal, item.time)
      //   this.controlDome('setSeqSpeed', item.speed, item.preset, this.cruiseRouteVal, item.time)
      // })
      let result = true
      for (let i = this.cruiseSetData.length - 1; i >= 0; i--) {
        const item = this.cruiseSetData[i]
        await this.controlDome('fillPreSeq', item.speed, item.preset, this.cruiseRouteVal, item.time).catch(err => {
          if (err) {
            result = false
          }
        })
        await this.controlDome('setSeqDwell', item.speed, item.preset, this.cruiseRouteVal, item.time).catch(err => {
          if (err) {
            result = false
          }
        })
        await this.controlDome('setSeqSpeed', item.speed, item.preset, this.cruiseRouteVal, item.time).catch(err => {
          if (err) {
            result = false
          }
        })
      }
      if (result) {
        this.$Notice.success({ title: '成功', desc: '保存成功！' })
      } else {
        this.$Notice.error({ title: '失败', desc: '保存失败！' })
      }
    },
    delCruiseData(i, item) {
      this.cruiseSetData.splice(i, 1)
      this.controlDome('clrPreSeq', item.speed, item.preset, this.cruiseRouteVal, item.time)
        .then(() => {
          this.$Notice.success({ title: '成功', desc: '删除成功！' })
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: '删除失败！' })
          console.log(err)
        })
    },
    upCruiseData(i) {
      i = parseInt(i)
      if (i === 0) {
        return
      }
      const item = this.cruiseSetData[i - 1]
      this.cruiseSetData.splice(i - 1, 1)
      this.cruiseSetData.splice(i, 0, item)
    },
    downCruiseData(i) {
      i = parseInt(i)
      if (i === this.cruiseSetData.length - 1) {
        return
      }
      const item = this.cruiseSetData[i]
      this.cruiseSetData.splice(i, 1)
      this.cruiseSetData.splice(i + 1, 0, item)
    },
    cruiseRouteValCheng() {
      // console.log(122)
      this.cruiseSetData.length = 0
      // const arr = this.cruiseSetList[this.cruiseRouteVal - 1]
      // arr.forEach(item => {
      //   this.cruiseSetData.push({
      //     ...item
      //   })
      // })
    },
    // 轨迹
    getTrial(param) {
      YUNNAN_CTRL_GET.getcruiselocus(param)
        .then(suc => {
          // const arr = JSON.parse(JSON.stringify(suc.data.cruiseArr))
          // this.orbitList = []
          // arr.forEach((item) => {
          //   this.orbitList.push({value: item, label: item})
          // })
          this.orbitList = [].concat(this.orbitRouteList)
        })
        .catch(err => err)
    },
    transTraj() {
      if (this.orbitList.length === 0 && this.orbitSetOpen) {
        return
      }
      this.controlDome('runCruise', this.speed, 1, this.orbitVal)
      // .then(() => {
      //   this.isTranTraj = true
      // })
    },
    StopTraj() {
      this.controlDome('stopCruise', this.speed, 1, this.orbitVal)
      // .then(() => {
      //   this.isTranTraj = false
      // })
    },
    startRecordTraj() {
      this.controlDome('staMemCruise', this.orbitSpeedVal, 1, this.orbitRouteVal)
        .then(() => {
          this.recordTraj = true
          this.$Notice.success({ title: '提示', desc: '开始录制轨迹成功！' })
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: '开始录制轨迹失败！' })
          console.log(err)
        })
    },
    stopRecordTraj() {
      this.controlDome('stoMemCruise', this.orbitSpeedVal, 1, this.orbitRouteVal)
        .then(() => {
          this.recordTraj = false
          this.$Notice.success({ title: '提示', desc: '停止录制轨迹成功！' })
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: '停止录制轨迹失败！' })
          console.log(err)
        })
    },
    // 扫描
    getScan(param) {
      YUNNAN_CTRL_GET.getscan(param)
      // this.controlDome('initCamera')
      //   .then(suc => {
      //     if (!suc.arg) { return }
      //     this.saomiaoPathList = suc.arg.preSet
      //     const scan = []
      //     this.resScan.status.forEach((item, index) => {
      //       if (item === 'ON') { scan.push(++index) }
      //     })
      //     this.saomiaoUseList = scan
      //   })
    },
    scanAuto() {
      if (this.scanSetOpen) {
        return
      }
      this.controlDome('scanAuto')
    },
    linearScan() {
      console.log('随机扫描', this.scanSetOpen)
      if (this.scanSetOpen) {
        return
      }
      this.controlDome('linearScan')
        .then(res => {
          this.$Notice.success({ title: '提示', desc: '随机扫描成功！' })
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: '随机扫描失败！' })
          console.log(err)
        })
    },
    leftEdge() {
      this.controlDome('setLeftBorder', this.scanSpeedVal)
        .then(res => {
          this.$Notice.success({ title: '提示', desc: '设置左限位成功！' })
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: '设置左限位失败！' })
          console.log(err)
        })
    },
    rightEdge() {
      this.controlDome('setRightBorder', this.scanSpeedVal)
        .then(res => {
          this.$Notice.success({ title: '提示', desc: '设置右限位成功！' })
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: '设置右限位失败！' })
          console.log(err)
        })
    },
    async controlDome(
      ctrlCmdEnum,
      speed = this.speed,
      presetIndex = 1,
      route = 1,
      stopTime = 5,
      opt = 1,
      channel = 1,
      v
    ) {
      if (!this.$store.getters.plugin.valid) {
        this.$Notice.warning({ title: '警告', desc: '请先下载插件，或当前浏览器不支持插件！' })
        return Promise.reject(new Error(false))
      }
      // if (!this.plugin.pluginState.isPlay) { return this.$Notice.error({ title: '失败', desc: '请选择设备！' }) }
      const item = this.plugin.pluginData[this.plugin.activedIndex]
      if (!item) {
        return Promise.reject(new Error(false))
      }
      if (!this.power) {
        this.power = await this.getCameraPower(item.id)
      }
      if (!this.power || !this.power.includes('cloudControl')) {
        if (v !== 'noNotice') {
          this.$Notice.warning({ desc: `没有权限！`, title: '警告' })
        }
        return
      }
      let devInfo = {}
      if (item.gbDevId) {
        const id = window.serverId[item.shareServer]
        devInfo = {
          gbPlaDevIp: id.ip,
          gbPlaDevPort: id.port,
          gbDevId: item.gbDevId,
          gbPlaNvrId: id.serverId
        }
      } else {
        devInfo = {
          devIp: item.ip,
          devPort: item.port
        }
      }
      const param = {
        devCtl: {
          ctrlCmdEnum: ctrlCmdEnum,
          speed: speed,
          presetIndex: presetIndex,
          route: route,
          stopTime: stopTime,
          opt: opt,
          channel: item.channel || channel
        },
        devInfo: devInfo
      }
      recordUserLog({
        logType: '操作日志',
        module: '现场视频',
        operateName: '云台控制',
        operateContent: '云台控制',
        target: item.name,
        deviceIp: item.gbDevId ? window.serverId[item.shareServer].ip : item.ip // 设备ip String
      })
      return new Promise((resolve, reject) => {
        YUNNAN_CTRL_SET(param, item.id, item.type)
          .then(suc => {
            resolve(suc)
          })
          .catch(error => {
            reject(error)
            console.log(`云台控制${ctrlCmdEnum}接口错误码===？：`, speed)
            if (speed !== 0) {
              return this.$Notice.error({ title: '失败', desc: '云台操作错误或无设备！' })
            }
          })
      })
    }
  },
  created() {
    this.cruiseRouteList = this.getNumberArr(8)
    this.presetAllList = this.getNumberArr(255)
    this.orbitRouteList = this.getNumberArr(5)
    this.orbitList = this.getNumberArr(5)
    this.orbitSpeedList = this.getNumberArr(7)
    this.scanSpeedList = this.getNumberArr(5)
    this.cruiseList = [].concat(this.cruiseRouteList)

    this.cruiseRouteList.forEach(v => {
      this.cruiseSetList.push([])
    })
  }
}
</script>

<style scoped>
.BasicsCtrl {
  padding-left: 10px;
  /*height: 100%;*/
}
.dome-box .times-box::after,
.clearFloat::after {
  display: block;
  content: '';
  clear: both;
}

.dome-box .dome {
  margin-bottom: 10px;
}
.dome-box .times-box > * {
  float: left;
}

.speed b,
.slider b {
  float: left;
  height: 36px;
  line-height: 36px;
  width: 40px;
  text-align: center;
  font-weight: normal;
  user-select: none;
}

.speed .slider-box {
  float: right;
  width: 90px;
}

.slider .slider-box {
  float: left;
  width: 240px;
}

.slider input[type='text'] {
  margin: 0 !important;
}

.ctrlBtn {
  width: 100%;
  padding: 10px 14px;
}

.ctrlBtn *,
.iconfont {
  display: inline-block;
  font-size: 14px;
  text-align: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #5577a8;
  cursor: pointer;
  margin: 0 3px;
  color: #263756;
}
.ctrlBtn .iconfont.active,
.ctrlBtn .iconfont:hover,
.iconfont:hover {
  background: #fa8938;
  color: #fff;
}
.ctrlBtn .iconfont.active,
.ctrlBtn .iconfont:active,
.iconfont:active {
  background: #d66c23;
  color: #fff;
}
.ctrlBtn .iconfont.hide {
  background: #9298a4;
  color: #4a5363;
  cursor: not-allowed;
}
.advancedControl {
  width: 100%;
  padding-right: 2px;
  /*height: calc(100% - 172px);*/
}

.advancedControl .tit {
  width: 100%;
  font-size: 14px;
  height: 20px;
  position: relative;
}
.advancedControl .tit .title {
  text-align: center;
  width: 100%;
  cursor: pointer;
  position: absolute;
}
.advancedControl .tit div.jx {
  width: 50px;
  height: 0;
  top: 10px;
  position: absolute;
  border-top: 1px solid rgba(58, 90, 139, 0.4);
  /* border-bottom: 1px solid #263a69; */
}
.advancedControl .tit div.jx.l {
  left: 20px;
}
.advancedControl .tit div.jx.r {
  right: 20px;
}

.advanceSelected {
  width: 100%;
  height: calc(100% - 40px);
}

.xunhang {
  height: calc(100% - 50px);
  /* overflow: auto; */
}

.advanceSelected > ul {
  width: 100%;
  height: 30px;
  margin: 10px 0;
}

.advanceSelected > ul li {
  width: 24%;
  float: left;
  height: 30px;
  border: 1px solid #4699f8;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  color: #d0e4ff;
  border-right: 0;
  list-style-type: none;
}
.advanceSelected > ul li:nth-child(1) {
  border-radius: 3px 0 0 3px;
}
.advanceSelected > ul li:nth-child(4) {
  border-radius: 0px 3px 3px 0;
  border-right: 1px solid #4699f8;
}

.advanceSelected > ul li.active {
  color: #fff;
  background: #287fe0;
}
.advanceSelected > ul li:hover {
  color: #fff;
  background: #4699f8;
}

.advance-item {
  width: 100%;
  height: auto;
  padding: 0 0px;
}
.advance-item .iconfont {
  background: #4699f8;
  color: #fff;
}
.advance-item .iconfont:hover {
  background: #fa8a3b;
}
.advance-item .iconfont:active {
  background: #d66c23;
}
.advance-btn,
.advance-btn-big,
.advance-icon {
  float: left;
  cursor: pointer;
  background: #4699f8;
  color: #fff;
  line-height: 24px;
  width: 60px;
  text-align: center;
}

.advance-btn:hover,
.advance-btn-big:hover {
  background: #4699f8;
}

.advance-btn:active,
.advance-btn-big:active {
  background: #287fe0;
}

.advance-btn-big {
  width: 70px;
  margin: 0 10px;
  line-height: 26px;
}

.advance-icon {
  width: 30px;
  padding: 0 0 0 10px;
  /* color: #00a5e3; */
  background: none;
  font-size: 16px;
}

.advance-icon:hover {
  color: #fa8a3b;
}
.advance-icon:active {
  color: #d66c23;
}

.dis-btn,
.dis-btn:hover,
.dis-btn:active {
  background: #535f77;
  color: #cacaca;
}

.advance-set {
  width: 100%;
  padding-top: 10px;
}

.advance-set .setList {
  padding: 10px 0;
  color: #444;
  line-height: 22px;
}

.advance-set .saomiaoSet {
  padding-left: 40px;
}

.advance-set .guijiSet {
  padding-left: 130px;
}

.table tr,
.table td,
.table th {
  border: 1px solid #e4e4e4;
  text-align: center;
}
.table tr {
  height: 24px;
}
.table,
tr,
td {
  border-collapse: collapse;
  cursor: pointer;
}
.table td i.iconfont {
  width: 10px;
  display: inline-block;
  background: none;
  margin: 0;
}
.table td i.iconfont:hover,
.table td i.iconfont:active {
  background: none;
}
</style>

<style>
.advance-item .v-select.searchable .dropdown-toggle {
  height: 22px;
  padding: 0px 7px;
  box-sizing: content-box;
}
.advance-item .v-select .open-indicator {
  top: 8px;
}
.advance-item .v-select .dropdown-toggle.selectdisabled {
  background-color: #535f77;
}
.bs-scroll.cruiseSetOff .viewport {
  overflow: visible;
}
</style>
