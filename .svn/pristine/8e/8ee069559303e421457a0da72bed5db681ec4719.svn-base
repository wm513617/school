<template>
  <div v-if="modal"
    class="carDetailInfo"
    @click.stop>
    <iframe v-if="modal"/>
    <div class="car-detail-body">
      <div class="car-detail-header">
        <h3>车辆详情</h3>
        <span
          class="close-icon"
          @click="cancel">
          <Icon type="ios-close-empty"/>
        </span>
      </div>
      <div class="car-detail-content">
        <Tabs :value="item"
          @on-click="showItem">
          <Tab-pane label="过车信息"
            name="过车信息"/>
          <Tab-pane label="过车录像"
            name="过车录像"/>
          <Tab-pane v-if="hasLicence"
            label="行车轨迹"
            name="行车轨迹"/>
        <!-- <Tab-pane :disabled="!deployState" label="布控信息" name="布控信息"></Tab-pane> -->
        </Tabs>
        <div v-if="item==='过车信息'"
          class="detail-info">
          <div class="car-pass">
            <div class="car-img">
              <span v-if="deployState"
                class="deploy_Icon">布控</span>
              <img v-if="car.image"
                :src="'/api/upload?id='+car.image"
                :alt="car.image">
              <img v-else
                :src="img">
            </div>
            <div class="content">
              <div class="section"
                style="width:100%">
                <div class="count">
                  <span class="dif fs-28">{{ car.licence }}</span>
                </div>
                <div class="title">车牌号</div>
              </div>
              <div class="section split">
                <div class="count">
                  <span class="fs-14">{{ car.brand }} {{ car.model }}</span>
                </div>
                <div class="title">车辆品牌</div>
              </div>
              <div class="section">
                <div class="count">
                  <span class="fs-14">{{ $moment.unix(Number(car.timeStamp)).format('YYYY-MM-DD HH:mm:ss') }}</span>
                </div>
                <div class="title">抓拍时间</div>
              </div>
              <div class="section  split">
                <div class="count">
                  <span class="fs-14">{{ car.colorName }}</span>
                </div>
                <div class="title">车辆颜色</div>
              </div>
              <div class="section">
                <div class="count">
                  <span class="fs-14">{{ car.resourceName }}</span>
                </div>
                <div class="title">抓拍设备</div>
              </div>
              <div class="section split">
                <div class="count">
                  <span class="fs-14">{{ car.vehicleList }}</span>
                </div>
                <div class="title">车辆类型</div>
              </div>
              <div class="section">
                <div class="count">
                  <span class="fs-14">{{ car.direction }}</span>
                </div>
                <div class="title">车行方向</div>
              </div>
              <div v-if="deployState"
                class="section"
                style="width:100%">
                <div class="count">
                  <span class="fs-14">{{ defenseInfo.name }}</span>
                </div>
                <div class="title">布控原因</div>
              </div>
              <div v-if="deployState"
                class="section"
                style="width:100%">
                <div class="count">
                  <span class="fs-14">{{ $moment.unix(Number(defenseInfo.startTime)).format('YYYY-MM-DD') }}---{{ $moment.unix(Number(defenseInfo.endTime)).format('YYYY-MM-DD') }}</span>
                </div>
                <div class="title">布控时间</div>
              </div>
            </div>
          </div>
        </div>
        <div v-show="item==='过车录像'"
          class="detail-info">
          <div style="flex:1;padding:10px;">
            <PlayBack ref="playbackcom"
              :videoParam="videoParam"
              :show="videoShow"/>
          </div>
        </div>
        <div v-if="item==='行车轨迹'"
          class="detail-info">
          <div style="flex:1;text-align:center">
            <BSMap :isConfig="false">
              <bs-layer :id="trackLayer.id"
                :name="trackLayer.name"
                :features="vehicleTrackFeatures"
                :zIndex="1"/>
            </BSMap>
            <!-- <img height="100%" width="100%" src="/static/car/vehicleMap2.jpg" alt="行车轨迹"> -->
          </div>
        </div>
      </div>
      <div class="car-detail-footer">
        <Button type="primary"
          @click="cancel">关闭</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
// import BSmap from './common/BSMap'
import img1 from '../assets/images/mbh.png'
import PlayBack from './vehicleFace/videoBack'
import layerConfig from '../assets/map/MapConfig.js'
import appCarTrack from '../assets/map/app/appCarTrack'

export default {
  name: 'BScarDetail',
  components: {
    // BSmap,
    PlayBack
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      vehicleTrackFeatures: [], // 车辆轨迹数组
      trackLayer: layerConfig.layers.vehicleTrack, // 车辆轨迹图层
      videoParam: {},
      videoShow: false,
      hasLicence: true,
      deployState: false,
      img: img1,
      item: '过车信息',
      modal: false,
      state: {
        isPlay: '',
        isBoost: '',
        isRecording: '',
        isVolumeOpen: '',
        volumeValue: 0
      },
      defenseInfo: {
        name: '',
        licence: '',
        colorName: '',
        typeName: '',
        brand: '',
        model: '',
        startTime: '',
        endTime: ''
      },
      car: {
        level: '',
        licence: '',
        color: '黑色',
        type: 4,
        manageType: '',
        brand: '',
        model: '',
        startTime: '',
        endTime: '',
        reason: '',
        allArea: true
      },
      carInfo: {}
    }
  },
  computed: {
    plugin() {
      return this.$refs.playbackcom.plugin
    }
  },
  watch: {
    value: {
      handler: function(val) {
        if (val) {
          this.item = '过车信息'
          this.car = val
          this.videoShow = false
          this.videoParam = {}
          if (val.defenseInfo) {
            this.deployState = true
            this.defenseInfo = val.defenseInfo
          } else {
            this.deployState = false
            this.defenseInfo = {
              name: '',
              licence: '',
              colorName: '',
              typeName: '',
              brand: '',
              model: '',
              startTime: '',
              endTime: ''
            }
          }
        }
      },
      deep: true
    },
    show(val) {
      if (val !== this.modal) {
        this.modal = val
      }
    },
    modal(newValue) {
      this.$emit('update:show', newValue)
    }
  },
  methods: {
    ...mapActions(['getResourceInfo']),
    playBack(param) {
      this.plugin.setPluginType('record')
      this.plugin.recordOpen()
    },
    showItem(val) {
      if (val === '过车录像') {
        this.getResourceInfo({ id: this.car.resourceId })
          .then(res => {
            const data = res.data
            this.videoParam = {
              devIp: data.ip,
              devPort: data.eid.cport,
              channel: data.chan,
              eventType: ['vehicle'],
              typeName: '',
              typeContent: '',
              startTime: this.car.createTime - 10,
              endTime: this.car.createTime + 10,
              streamType: data.stream
            }
            this.videoShow = true
          })
          .catch(() => {
            this.$Notice.warning({
              desc: '没有录像资源!',
              title: '提示'
            })
          })
      } else {
        this.videoShow = false
      }
      this.item = val
      if (val === '行车轨迹') {
        this.initVechileTrack() // 添加车辆轨迹
      }
    },
    cancel() {
      this.videoShow = false
      this.modal = false
    },
    initVechileTrack() {
      const data = this.car
      let mapData = {
        current: null,
        list: []
      }
      mapData.current = data
      if (data && data.list) {
        data.list.map(item => {
          let isDevHas = false
          if (mapData.list.length) {
            mapData.list.map(unit => {
              if (item.channelid === unit.channelid) {
                isDevHas = true
              }
            })
          }
          if (!isDevHas) {
            mapData.list.push({
              point: item.point,
              channelid: item.channelid,
              crossName: item.crossName,
              timeList: []
            })
          }
        })
      }
      mapData.list.map(item => {
        data.list.map(temp => {
          if (item.channelid === temp.channelid) {
            item.timeList.push(temp.timeStamp)
          }
        })
      })
      this.addVehicleTrack(mapData)
    },
    // 加载车辆轨迹
    addVehicleTrack(mapData) {
      const objFea = appCarTrack.drawCarTrack(mapData)
      this.vehicleTrackFeatures = objFea.features
    }
  }
}
</script>
<style lang="less" scoped>
#carDetailInfo {
  width: 800px;
  height: 600px;
  position: absolute;

  top: 100px;
  left: 50vw;
  z-index: 9999;

  margin-left: -400px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}

.car-detail-content {
  padding: 20px;
}

iframe {
  background: transparent;
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 4px;
  background: #0a111c;
  border: 1px solid #ccc;
}

.car-detail-body {
  position: absolute;
  z-index: 9999999;
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  background: #1c3053;
}

.car-detail {
  .ivu-modal {
    height: 600px;
  }
}

.car-detail-header {
  position: relative;
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  background: #0f2243;
  span {
    position: absolute;
    top: 0px;
    right: 10px;
    font-size: 36px;
    color: #ccc;
    cursor: pointer;
    &:hover {
      color: #fff;
    }
  }
}

.detail-info {
  height: 400px;
  min-height: 400px;
  display: flex;
  padding: 0 10px;
  background: #1c3053;
  .modal-left {
    flex: 0 0 50%;
  }
}

.car-pass {
  padding-top: 30px;
  display: flex;
  flex: 1;
  .car-img {
    position: relative;
    flex: 0 0 300px;
    padding-left: 10px;
    text-align: center;
    img {
      width: 280px;
      height: 210px;
      border: 1px solid #ccc;
    }
  }
  .car-info {
    flex: 1;
    padding: 0 20px;
    .info-item {
      width: 50%;
      float: left;
      line-height: 30px;
      display: flex;
      label {
        width: 80px;
        text-align: right;
        display: inline-block;
        padding-right: 10px;
      }
      span {
        flex: 1;
      }
    }
  }
}

.denfense-item label {
  width: 80px;
  text-align: right;
  display: inline-block;
  padding-right: 10px;
  color: #00a5e3;
}

.time-rang {
  display: flex;
  span {
    width: 50px;
    text-align: center;
  }
}

.ivu-form-item {
  margin-bottom: 15px;
}

.carDetail {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 0;
  left: 0;
  top: 0;
  background: #ffffff;
}

.car-detail-footer {
  position: absolute;
  width: 100%;
  bottom: 0px;
  height: 50px;
  text-align: right;
  padding-right: 30px;
}

.video-handle {
  height: 50px;
  display: flex;
  align-items: center;
  .iconfont {
    width: 27px;
    height: 30px;
    font-size: 24px;
    line-height: 32px;
    cursor: pointer;
    margin: 0 3px;
    &:hover {
      color: #00a5e3;
    }
  }
}

.deploy_Icon {
  position: absolute;
  border-radius: 50%;
  width: 40px;
  right: 10px;
  top: 5px;
  height: 38px;
  line-height: 36px;
  text-align: center;
  border: 1px solid red;
  color: red;
  background: rgba(255, 255, 255, 0.5);
}
</style>
