<template>
  <div class="intelligentAlarmList">
    <div class="alarm-header">
      <h3 class="header">智能报警</h3>
      <div class="alarm-select">
        <Select v-model="alarmSelect" size="small">
          <Option v-for="item in alarmSelectList" :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
      </div>
    </div>
    <div class="alarm-scroll">
      <!-- 普通报警消息列表 -->
      <bs-scroll ref="scroller">
        <div v-for="(item, index) in filterAlarmList" :key="index">
          <div class="alarm-item" v-if="item.eventType !== 'faceControl'">
            <div class="item-left" @click="getNearestSingleAndPlanData(item)">
              <div class="item-left-main">
                <div class="main-left" :title="item.eventTypeName">{{item.eventTypeName}}</div>
                <div class="main-right" :title="item.srcName">{{item.srcName}}</div>
              </div>
              <div class="item-left-main">
                <div class="main-left-b" :title="changeFormatTime(item.time)">{{changeFormatTime(item.time) }}</div>
                <div class="main-right">{{item.level}}级</div>
              </div>
              <div class="item-left-main">
                <div v-if="item.eventType === 'vioRetrograde' || item.eventType === 'vioPark' || item.eventType === 'vioTurnLeft' || item.eventType === 'vioTurnRight'" class="main-all">
                  <span style="width: 33.33%;">{{item.carNum === undefined ? '' : item.carNum}}</span>
                  <span style="width: 33.33%;">{{item.carType === undefined ? '' : carType[item.carType]}}</span>
                  <span style="width: 33.33%;">{{item.carDirect === undefined ? '' : carDirect[item.carDirect]}}</span>
                </div>
                <div v-else class="main-all" :title="item.organization">{{item.organization}}</div>
              </div>
            </div>
            <div class="item-right">
              <div class="item-right-btn" :class="{'no-allowed': showVideo}" @click="openModal(item, index)">处理</div>
              <div class="item-right-btn" :class="{'no-allowed': showVideo && itemAlarmInput.alarmId === item.alarmId}" @click="ignoreAlarm(item)">清除</div>
            </div>
          </div>
          <!-- 人像布控折叠模式显示 -->
          <div v-else-if="item.eventType === 'faceControl' && item.isFold">
            <div v-show="!item.isDropDown" class="alarm-item" style="height:130px;display:flex;">
              <div class="fold-img">
                <img :src="item.userImage ? item.userImage : '/static/noImg1.png'" alt="暂无图片">
              </div>
              <div class="fold-right">
                <div class="face-item"  style="width:145px;">
                  <i class="font-common icon iconfont icon-admin"></i>{{item.userName}}
                </div>
                <div class="face-item"  style="width:145px;">
                  <i class="font-common icon iconfont icon-blacklist"></i>{{item.groupName}}
                </div>
                <div class="circle" @click="changeFoldStatus(item, 1)">{{item.foldList.length}}</div>
              </div>
            </div>
            <div v-show="item.isDropDown" style="border: 1px solid #fff;margin:15px 10px 5px;">
              <div class="alarm-item face-alarm-item fold-title" style="height: 32px;line-height: 32px;display:flex;margin:0 0 15px;width:100%;">
                <span class="title-item">{{item.groupName}}</span>
                <span class="title-item">{{item.userName}}</span>
                <span class="title-item">{{item.foldList.length}}次</span>
                <i class="iconfont icon-arrow-up" style="cursor:pointer;" @click="changeFoldStatus(item, 0)"></i>
              </div>
              <div>
                <div v-for="(info, index) in item.foldList" :key="index">
                  <div class="face-fold-alarm">
                    <div class="face-alarm-item">
                      <div><i class="font-common icon iconfont icon-Location"></i>{{info.resName}}</div>
                      <i class="font-common icon iconfont icon-guijichaxun1" :class="{'trail': info.isOpenTrail}" style="cursor: pointer;" @click.stop="openTrail(info, index)"></i>
                    </div>
                    <div style="display:flex;padding:0 5px;" @click="getNearestSingleAndPlanData(info)">
                      <div class="img-box" :style="{'borderColor': item.color}"  @click="openModal(info)">
                        <img :src="info.faceImage ? info.faceImage : '/static/noImg1.png'" alt="暂无图片">
                        <img :src="info.userImage ? info.userImage : '/static/noImg1.png'" alt="暂无图片">
                        <div class="similarity">{{info.similar + '%'}}</div>
                      </div>
                      <div class="face-alarm-right">
                        <div class="face-item"  style="width:101px;">
                          <i class="font-common icon iconfont icon-admin"></i>{{info.userName}}
                        </div>
                        <div class="face-item"  style="width:101px;">
                          <i class="font-common icon iconfont icon-blacklist"></i>{{info.groupName}}
                        </div>
                        <div class="face-item"  style="width:101px;" :title="changeFormatTime(info.time)">
                          <i class="font-common icon iconfont icon-shijian"></i>{{changeFormatTime(info.time)}}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="alarm-item" style="height:130px;">
            <div class="face-alarm-item">
              <div><i class="font-common icon iconfont icon-Location"></i>{{item.resName}}</div>
              <i class="font-common icon iconfont icon-guijichaxun1" :class="{'trail': item.isOpenTrail}" style="cursor: pointer;" @click.stop="openTrail(item, index)"></i>
            </div>
            <div style="display:flex;padding:0 5px;" @click="getNearestSingleAndPlanData(item)">
              <div class="img-box" :style="{'borderColor': item.color}"  @click="openModal(item)">
                <img :src="item.faceImage ? item.faceImage : '/static/noImg1.png'" alt="暂无图片">
                <img :src="item.userImage ? item.userImage : '/static/noImg1.png'" alt="暂无图片">
                <div class="similarity">{{item.similar + '%'}}</div>
              </div>
              <div class="face-alarm-right">
                <div class="face-item">
                  <i class="font-common icon iconfont icon-admin"></i>{{item.userName}}
                </div>
                <div class="face-item">
                  <i class="font-common icon iconfont icon-blacklist"></i>{{item.groupName}}
                </div>
                <div class="face-item" :title="changeFormatTime(item.time)">
                  <i class="font-common icon iconfont icon-shijian"></i>{{changeFormatTime(item.time)}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </bs-scroll>
    </div>
  </div>
  </div>
</template>
<script>
import alarm from 'src/socket/alarm.js'
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import './alarm.less'
import confirmAlarmFun from '../../alarmFun/confirmAlarmFun'
export default {
  name: 'alarmInputList',
  components: {
  },
  data() {
    return {
      alarmPower: {},
      alarmSelectList: [{
        label: '全部',
        value: 'all'
      }, {
        label: '智能报警',
        value: 'intelligentAlarm'
      }, {
        label: '违章报警',
        value: 'violationAlarm'
      }, {
        label: '人像布控',
        value: 'faceAlarm'
      }],
      alarmSelect: 'all',
      foldAlarmList: [], // 折叠模式 列表数据结构
      oldFoldAlarmList: [] // 用于与新数据比对，记录上次折叠状态
      // foldAlarmList: [
      //   {
      //     eventType: 'faceControl',
      //     userName: 'admin',
      //     groupName: '',
      //     userImage: '',
      //     isFold: true,
      //     isDropDown: true,
      //     foldList: [
      //       {
      //         resName: 'zhangsan',
      //         similar: 80,
      //         color: 'red',
      //         userName: 'admin',
      //         groupName: '黑名单布控',
      //         time: 1563150311
      //       }
      //     ]
      //   }
      // ]
    }
  },
  mixins: [confirmAlarmFun],
  computed: {
    ...mapState({
      showVideo: ({ fengMapAlarm }) => fengMapAlarm.showVideo,
      itemAlarmInput: ({ fengMapAlarm }) => fengMapAlarm.itemAlarmInput,
      intelligentAlarmList: ({ fengMapAlarm }) => fengMapAlarm.intelligentAlarmList,
      alarmModalType: ({ fengMapAlarm }) => fengMapAlarm.alarmModalType,
      isModalSureOrClean: ({ fengMapAlarm }) => fengMapAlarm.isModalSureOrClean,
      filterState: ({ fengMapApplyInteractive }) => fengMapApplyInteractive.filterState, // 报警过滤状态
      filterLevel: ({ fengMapApplyInteractive }) => fengMapApplyInteractive.filterLevel,
      selectedFaceAlarmArr: ({ fengMapAlarm }) => fengMapAlarm.selectedFaceAlarmArr
    }),
    ...mapGetters('fengMapAlarm', ['alarmTypeList', 'alarmTypeData', 'carType', 'carDirect']),
    filterAlarmList() {
      let filterList = []
      switch (this.alarmSelect) {
        case 'all':
          filterList = JSON.parse(JSON.stringify(this.foldAlarmList))
          break
        case 'intelligentAlarm':
          filterList = this.foldAlarmList.filter(item => {
            return Object.keys(this.alarmTypeData.intelligent).includes(item.eventType)
          })
          break
          // 人脸报警
        case 'faceAlarm':
          filterList = this.foldAlarmList.filter(item => {
            return item.eventType === 'faceControl'
          })
          break
        default:
          filterList = this.foldAlarmList.filter(item => {
            return Object.keys(this.alarmTypeData.violation).includes(item.eventType)
          })
          break
      }
      return filterList
    },
    alarmInputList() {
      return JSON.parse(JSON.stringify(this.intelligentAlarmList))
    }
  },
  watch: {
    alarmInputList: {
      handler: function(val) {
        if (val.length !== 0) {
          this.$emit('isUnread', true)
        } else {
          this.$emit('isUnread', false)
        }
        // 构建折叠模式下 列表数据结构
        let arr = JSON.parse(JSON.stringify(this.intelligentAlarmList))
        let newList = []
        arr.forEach(item => {
          if (item.eventType === 'faceControl') {
            const flag = arr.filter(a => {
              return a.userName === item.userName
            })
            if (flag.length >= 2) {
              const index = newList.findIndex(data => {
                return data.isFold && data.userName === item.userName
              })
              if (index === -1) {
                const foldAlarm = this.oldFoldAlarmList.find(val => {
                  return val.isFold && val.userName === item.userName
                })
                const param = {
                  eventType: 'faceControl',
                  userName: item.userName,
                  groupName: item.groupName,
                  userImage: item.userImage,
                  isFold: true,
                  isDropDown: foldAlarm ? foldAlarm.isDropDown : true,
                  foldList: []
                }
                param.foldList.push(item)
                newList.push(param)
              } else {
                newList[index].foldList.push(item)
              }
            } else {
              newList.push(item)
            }
          } else {
            newList.push(item)
          }
        })
        this.foldAlarmList = newList
        this.oldFoldAlarmList = JSON.parse(JSON.stringify(newList))
        // this.SAVE_INTELLIGENT_ALARM_LIST(val)
      },
      deep: true
    },
    alarmSelect: {
      handler: function(val) {
        this.SAVE_ALARM_CHANGE(val)
      },
      deep: true
    },
    intelligentAlarmList(newVal, oldVal) {
      if (newVal.length <= 20 && oldVal >= 20) {
        const payload = {
          limit: 30,
          map: '2D',
          type: 'intelligent',
          param: {
            flag: true,
            intelligent: {
              flag: true,
              level: 1
            },
            violation: {
              flag: true,
              level: 1
            },
            face: {
              flag: true,
              level: 1
            },
            dealState: 'unProcess'
          }
        }
        this.getMapAlarmList({type: 'intelligentAlarmList', payload})
      }
    }
  },
  methods: {
    ...mapActions(['alarmToBeSure', 'nearestSingle', 'emergencyAction', 'getMapAlarmPower']),
    ...mapActions('fengMapApplyInteractive', ['changeOpenAlarmPanel']),
    ...mapActions('fengMapAlarm', ['getMapAlarmList']),
    ...mapMutations('fengMapAlarm', ['CHANGE_SHOWVIDEO', 'SAVE_ITEM_ALARM_INPUT', 'SAVE_INTELLIGENT_ALARM_LIST', 'GET_ALARM_MODAL_TYPE', 'SET_ALARM_NEW_ONE', 'SET_MAP2D_ALARM_LIST', 'SPLICE_MAP2D_ALARM_LIST', 'SET_ACTIVE_ALARM_INFO', 'CHANGE_FACEALARM_TRAIL', 'SAVE_ALARM_CHANGE']),
    /* 改变 折叠状态 */
    changeFoldStatus(item, flag) {
      const index = this.foldAlarmList.findIndex(val => {
        return val.isFold && val.userName === item.userName
      })
      if (index !== -1) {
        this.foldAlarmList[index].isDropDown = Boolean(flag)
        this.foldAlarmList = JSON.parse(JSON.stringify(this.foldAlarmList))
        this.oldFoldAlarmList = JSON.parse(JSON.stringify(this.foldAlarmList))
      }
    },
    expand() {
      this.$refs.scroller.update()
    },
    /** 查看，视频弹框控制
     * 入参：当前报警信息
     * return：index
     */
    openModal(val, index) {
      if (this.showVideo) { return }
      this.CHANGE_SHOWVIDEO(true)
      this.changeOpenAlarmPanel(true)
      if (val.eventType === 'faceControl') {
        this.GET_ALARM_MODAL_TYPE('FaceAlarm')
      } else if (val.eventType === 'vioRetrograde' || val.eventType === 'vioPark' || val.eventType === 'vioTurnLeft' || val.eventType === 'vioTurnRight') {
        this.GET_ALARM_MODAL_TYPE('vioAlarm')
      } else {
        this.GET_ALARM_MODAL_TYPE('IntelligentAlarm')
      }
      this.SAVE_ITEM_ALARM_INPUT(val)
      this.emergencyAction({ planId: '9,10,11' }) // 智能报警预案
    },
    /**
     * 时间戳格式转换
     * 入参：报警时间戳
     * return：转换格式的时间
     */
    changeFormatTime(time) {
      return this.$moment(parseInt(time) * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    /** 清除报警
     *  入参：当前报警信息
     * return：index
     */
    ignoreAlarm(val) {
      if (val.alarmId === this.itemAlarmInput.alarmId) { return }
      if (val.alarmPermission.alarmClean) {
        this.$Modal.confirm({
          title: '警告',
          content: '<p>确认清除此报警吗?</p>',
          loading: true,
          onOk: () => {
            let alarmArr = []
            alarmArr.push({
              _id: val.alarmId,
              ackContent: '',
              devIp: val.devIp,
              devPort: val.devPort,
              channel: val.channel,
              eventType: val.eventType,
              devId: val.devId,
              channelId: val.channelId,
              ackType: 'ignore'
            })
            this.alarmToBeSure(alarmArr).then(res => {
              // 报警列表清除该项
              const index = this.intelligentAlarmList.findIndex(item => {
                return item.alarmId === val.alarmId
              })
              index !== -1 && this.SPLICE_MAP2D_ALARM_LIST({type: 'intelligentAlarmList', index})
              setTimeout(() => {
                this.$Modal.remove()
              }, 0)
            }).catch(() => {
              this.errorMsg('清除报警失败')
            })
          }
        })
      } else {
        this.warningMsg('该报警资源没有权限')
      }
    },
    /** 报警消息格式处理
     *  入参：收到的报警信息
     */
    receiveAlarmInput(data) {
      let infoData = data.alarmInfo
      // 添加到地图点位上的报警接收
      if (infoData.point) {
        if (!this.filterState.isIntelligence.checked) { return }
        let isVideoAlarm = false
        for (let key in this.alarmTypeData.intelligent) {
          if (infoData.eventType === key && this.filterState.isIntelligence.alarmIntelligence && infoData.level >= this.filterLevel.intelligenceLevel) {
            infoData.alarmTypeToMap = 'intelligent'
            isVideoAlarm = true
            break
          }
        }
        if (!isVideoAlarm) {
          for (let key in this.alarmTypeData.violation) {
            if (infoData.eventType === key && this.filterState.isIntelligence.alarmPeccancy && infoData.level >= this.filterLevel.peccancyLevel) {
              infoData.alarmTypeToMap = 'violation'
              isVideoAlarm = true
              break
            }
          }
        }
        // 是否是 人像布控报警
        if (!isVideoAlarm) {
          if (infoData.eventType === 'faceControl' && this.filterState.isIntelligence.faceOn && infoData.level >= this.filterLevel.faceLevel && infoData.verifaceMsg && infoData.verifaceMsg.isdefense && infoData.verifaceMsg.faceImage) {
            infoData = {
              ...infoData,
              ...infoData.verifaceMsg
            }
            // if (this.filterState.isIntelligence.isFold) {
            //   infoData.isFold = true
            // }
            infoData.alarmTypeToMap = 'faceAlarm'
            infoData.isOpenTrail = false
            infoData.channelId = infoData.res
            isVideoAlarm = true
          }
        }
        if (!isVideoAlarm) { return }
        this.SET_ALARM_NEW_ONE(infoData)
        this.getMapAlarmPower({resId: infoData.channelId || infoData.devId, type: '0'}).then(res => {
          this.alarmPower = {}
          if (res.data && res.data.properties.length) {
            res.data.properties.forEach(item => {
              this.alarmPower[item] = item
            })
          }
          infoData.eventTypeName = this.alarmTypeList[infoData.eventType.toString()]
          infoData.alarmPermission = this.alarmPower
          // this.alarmInputList.unshift(infoData)
          this.SET_MAP2D_ALARM_LIST({type: 'intelligentAlarmList', data: infoData})
        }).catch(err => {
          console.log('getMapAlarmPower', err)
          this.errorMsg('权限获取失败')
        })
      }
    },
    /** 收到自动确认消息，清除页面报警
     *  入参：收到的ackInfo字段内报警信息
     */
    autoSureAlarm(data) {
      const anctionAlarm = this.itemAlarmInput
      if (this.showVideo && anctionAlarm && data.alarmId === anctionAlarm.alarmId) {
        this.CHANGE_SHOWVIDEO(false)
      }
      let isVideoAlarm = false
      if (data.eventType === 'vioRetrograde' || data.eventType === 'vioPark' || data.eventType === 'vioTurnLeft' || data.eventType === 'vioTurnRight' || data.eventType === 'faceControl') {
        isVideoAlarm = true
      } else {
        for (let key in this.alarmTypeData.intelligent) {
          if (data.eventType === key) {
            isVideoAlarm = true
            break
          }
        }
      }
      if (isVideoAlarm) {
        let arr = []
        arr = this.intelligentAlarmList
        this.$nextTick(() => {
          arr.forEach((item, index) => {
            if (data.alarmId === item.alarmId) {
              // this.alarmInputList.splice(index, 1)
              this.SPLICE_MAP2D_ALARM_LIST({type: 'intelligentAlarmList', index})
            }
          })
        })
      }
    },
    // 打开人像轨迹
    openTrail(item) {
      let alarmList = JSON.parse(JSON.stringify(this.alarmInputList))
      const index = alarmList.findIndex(val => {
        return val.alarmId === item.alarmId
      })
      alarmList[index].isOpenTrail = !alarmList[index].isOpenTrail
      if (item.alarmId === this.itemAlarmInput.alarmId) {
        this.SAVE_ITEM_ALARM_INPUT(alarmList[index])
      }
      // 人像轨迹处理
      let param = { index: index, context: this.$context2D }
      if (this.selectedFaceAlarmArr.length >= 5) {
        if (item.isOpenTrail) {
          this.CHANGE_FACEALARM_TRAIL(param)
        }
      } else {
        this.CHANGE_FACEALARM_TRAIL(param)
      }
    },
    /** 获取报警附件的单兵及地图点位定位 */
    getNearestSingleAndPlanData(val) {
      this.SET_ACTIVE_ALARM_INFO(val)
    }
  },
  created() {
    alarm.on('all', this.receiveAlarmInput)
    alarm.on('confirmAlarm', this.autoSureAlarm)
  },
  destroyed() {
    alarm.remove('all', this.receiveAlarmInput)
    alarm.remove('confirmAlarm', this.autoSureAlarm)
    this.$emit('isUnread', false)
  }
}
</script>

<style lang="less" scoped>
.face-alarm-item {
  display: flex;
  justify-content: space-between;
  height: 32px;
  line-height: 32px;
  padding: 0 10px;
}
.face-picture {
  width: 125px;
  height: 90px;
  margin-right: 5px;
}
.face-alarm-right {
  display: inline;
}
.fold-right {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.font-common {
  margin-right: 5px;
}
.face-item {
  width: 105px;
  height: 32px;
  line-height: 32px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  .icon {
    vertical-align: middle;
  }
}
.img-box {
  border: 1px solid #ddd;
  overflow: hidden;
  height: 88px;
  margin-right: 4px;
  position: relative;
  // display: flex;
  img {
    // height: 88px;
    width: 50%;
    float: left;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    // display: flex;
    // flex: 1;
    cursor: pointer;
    // &:first-child {
    //   margin-right: 2px;
    // }
  }
}
.similarity {
  width: 55px;
  height: 20px;
  position: absolute;
  bottom: -1px;
  font-size: 12px;
  font-weight: 700;
  left: 50%;
  text-align: center;
  line-height: 20px;
  z-index: 10;
  background: url('../../../../../static/similarity.png') no-repeat;
  background-size: 100% 100%;
  transform: translateX(-50%);
}
.trail {
  color: red;
}
.fold-title {
  height: 32px;
  line-height: 32px;
  display: flex;
  margin-bottom: 15px !important;
}
.face-fold-alarm {
  height: 130px;
  margin: 0 auto 5px;
  width: 94%;
  background-color: #50617a;
  border-radius: 5px;
}
.fold-img {
  flex: 1;
  text-align: center;
  line-height: 130px;
  img {
    width: 88px;
    height: 110px;
    vertical-align: middle;
  }
}
.circle {
  position: absolute;
  right: 5px;
  top: 8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: red;
  text-align: center;
  cursor: pointer;
}
.title-item {
  display: inline-block;
  max-width: 30%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
