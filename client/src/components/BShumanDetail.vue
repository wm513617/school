<template>
  <div id="humanDetail" v-if="modal" @click.stop>
    <iframe v-if="modal">
    </iframe>
    <div class="human-detail-body">
      <div class="human-detail-header">
        <h3>人员详情</h3>
      </div>
      <div class="human-detail-content">
        <Tabs type="card" :value="item" @on-click="showItem">
          <Tab-pane label="人员信息" name="人员信息"></Tab-pane>
          <Tab-pane label="人员录像" name="人员录像"></Tab-pane>
          <!-- <Tab-pane v-if="human.deployState" label="布控信息" name="布控信息"></Tab-pane> -->
          <Tab-pane label="人员轨迹" name="人员轨迹"></Tab-pane>
        </Tabs>
        <div class="detail-info" v-if="item==='人员信息'">
          <div class="human-pass">
            <div class="human-img">
              <img :src="human.snapshot" :alt="human.snapshot" />
            </div>
            <div class="human-info">
              <div class="info-item" v-if="human.snapshotTime">
                <label for="">对比时间：</label>
                <span>{{human.snapshotTime}}</span>
              </div>
              <div class="info-item" v-if="human.resourcePoint">
                <label for="">抓拍位置：</label>
                <span>{{human.resourcePoint}}</span>
              </div>
              <div class="info-item" v-if="human.username">
                <label for="">人员姓名：</label>
                <span>{{human.username}}</span>
              </div>
              <div class="info-item" v-if="human.mold">
                <label for="">比对类型：</label>
                <span>{{human.mold}}</span>
              </div>
              <div class="info-item" v-if="human.age">
                <label for="">年龄：</label>
                <span>{{human.age}}</span>
              </div>
              <div class="info-item" v-if="human.idNumber">
                <label for="">身份证号：</label>
                <span>{{human.idNumber}}</span>
              </div>
              <div class="info-item" v-if="human.gender">
                <label for="">性别：</label>
                <span>{{human.gender}}</span>
              </div>
              <div class="info-item" v-if="human.similarity">
                <label for="">相似度：</label>
                <span>{{human.similarity}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="detail-info" v-show="item==='人员录像'">
          <div style="flex:1;padding:10px;">
            <PlayBack :videoParam="videoParam" :show="videoShow" ref="playbackcom"></PlayBack>
          </div>

        </div>
        <div class="detail-info" v-if="item==='人员轨迹'">
          <div style="flex:1;text-align:center">
            <!-- <img height="100%" width="100%" src="/static/car/vehicleMap2.jpg" alt="人员轨迹" /> -->
            <BSMap :isConfig="false">
              <bs-layer :id="peopleTrack.id" :name="peopleTrack.name" :features="peopleTrackFeatures" :zIndex="1"></bs-layer>
            </BSMap>
          </div>
        </div>
      </div>
      <div class="human-detail-footer">
        <Button @click="cancel" type="primary">关闭</Button>
      </div>
    </div>

  </div>
</template>
<script>
import { mapActions } from 'vuex'
import BSMap from './common/BSMap'
import PlayBack from './vehicleFace/videoBack'
import layerConfig from 'assets/map/MapConfig.js'
import appCarTrack from 'assets/map/app/appCarTrack.js'
export default {
  name: 'BShumanDetail',
  components: {
    BSMap,
    PlayBack
  },
  data() {
    return {
      peopleTrackFeatures: [],
      peopleTrack: layerConfig.layers.peopleTrack, // 车辆轨迹图层
      humanInfo: null,
      videoParam: {},
      videoShow: false,
      item: '人员信息',
      modal: false,
      startTime: 0,
      endTime: 0,
      state: {
        isPlay: '',
        isBoost: '',
        isRecording: '',
        isVolumeOpen: '',
        volumeValue: 0
      },
      human: {
        age: 0,
        gender: '-',
        idNumber: '0',
        mold: '无',
        picture: '/static/defaultFace.jpg',
        resource: '无',
        similarity: '0%',
        snapshot: '/static/defaultFace.jpg',
        snapshotTime: '0000-00-00 00:00:00',
        timeStamp: '0000-00-00 00:00:00',
        username: '无',
        resourcePoint: '无',
        _id: '',
        trackStart: '',
        trackEnd: ''
      }
    }
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
  created() {
  },
  computed: {
    plugin() {
      return this.$refs.playbackcom.plugin
    }
  },
  methods: {
    ...mapActions(['getHumanInquiryTrajectory']),
    track() {
      const objFea = appCarTrack.drawPeopleTrack(this.humanInfo)
      this.peopleTrackFeatures = objFea.features
    },
    showItem(val) {
      this.item = val
      if (val === '人员录像') {
        this.videoParam = { 'devIp': this.humanInfo.record.ip, 'devPort': this.humanInfo.record.port, 'channel': this.humanInfo.record.channel, 'eventType': ['face'], 'typeName': '', 'typeContent': '', 'startTime': this.humanInfo.record.time - 10, 'endTime': this.humanInfo.record.time + 10, 'streamType': this.humanInfo.record.stream }
        this.videoShow = true
      } else {
        this.videoShow = false
      }
      if (val === '人员轨迹') {
        this.track()
      }
    },
    cancel() {
      this.videoShow = false
      this.modal = false
    }
  },
  watch: {
    value: {
      handler: function(val) {
        if (val) {
          this.item = '人员信息'
          this.human = val
          this.videoShow = false
          this.videoParam = {}
          const param = {
            id: this.human._id,
            statr: this.human.trackStart,
            end: this.human.trackEnd
          }
          this.humanInfo = null
          // const url = '/human/inquiry/trajectory?id=' + this.human._id + '&start=' + this.human.trackStart + '&end=' + this.human.trackEnd
          this.getHumanInquiryTrajectory(param).then((res) => {
            this.humanInfo = res.data
          }).catch(err => {
            console.log('get /human/inquiry/trajectory error:' + err)
          })
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
#humanDetail {
  width: 800px;
  height: 600px;
  position: absolute;
  background: #171717;
  border: 1px solid #e4e4e4;
  top: 100px;
  left: 50vw;
  z-index: 9999;
  border-radius: 4px;
  margin-left: -400px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}

.human-detail-content {
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
  border: 0 none;
}

.human-detail-body {
  background:#1c3053;
  position: absolute;
  z-index: 9999999;
  top: 2px;
  left: 2px;
  bottom: 2px;
  right: 2px;
}

.human-detail {
  .ivu-modal {
    height: 600px;
  }
}

.human-detail-header {
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  background: #0f2343;
}

.detail-info {
  height: 400px;
  min-height: 400px;
  display: flex;
  padding: 0 10px;
  .modal-left {
    flex: 0 0 50%;
  }
}

.human-pass {
  display: flex;
  flex: 1;
  .human-img {
    flex: 0 0 300px;
    padding-left: 10px;
    img {
      width: 100%;
      border: 1px solid #ccc;
    }
  }
  .human-info {
    flex: 1;
    padding: 0 20px;
    .info-item {
      width: 50%;
      float: left;
      line-height: 50px;
      display: flex;
      label {
        display: inline-block;
        width: 80px;
        text-align: right;
        padding-right: 10px;
      }
      span {
        display: inline-block;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
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

.humanDetail {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 0;
  left: 0;
  top: 0;
  background: #ffffff;
}

.human-detail-footer {
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
      color: #00a5e3
    }
  }
}
</style>
