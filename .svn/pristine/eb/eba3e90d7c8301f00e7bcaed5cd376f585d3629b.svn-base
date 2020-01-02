<template src="./CarDetail.html">
</template>

<script>
import PlayBack from 'components/vehicleFace/videoBack'
import BSmap from 'components/common/BSMap'
import img1 from 'src/assets/images/mbh.png'
import track from 'src/assets/map/app/appCarTrack'
import { mapActions } from 'vuex'

export default {
  name: 'CarDetail',
  components: {
    BSmap,
    PlayBack
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object
    }
  },
  data() {
    return {
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
    },
    cancel() {
      this.$emit('detailModalClose', false)
      this.videoShow = false
      this.modal = false
    },
    setMap(map) {
      // track.init(map)
      let data = this.car
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
      track.drawTrack(mapData)
    }
  },
  watch: {
    value: {
      handler: function(val) {
        if (val) {
          console.log(val, 240)
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
  }
}
</script>
<style lang="less" scoped>
.car-detail {
  .ivu-modal {
    height: 600px;
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
  padding-top: 10px;
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
