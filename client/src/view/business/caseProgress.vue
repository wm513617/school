<template>
  <!-- 案件进展 -->
  <div v-if="openModal">
    <Modal v-model="modalToggle" width="1000px" class="caseMangementModel" footer-hide @on-cancel="cancel" title="案件进展">
      <div class="modal-main">
        <div class="tab" style="overflow: hidden;">
          <span :class="{activeTab:toggleTab === 0}" @click="() => {toggleTab = 0}" style=" border-radius: 4px 0px 0px 4px;">事件信息</span>
          <span :class="{activeTab:toggleTab === 1}" @click="() => {toggleTab = 1}">录像调取</span>
          <span :class="{activeTab:toggleTab === 2, tabRadius:!formData.trackingInfo}" @click="() => {toggleTab = 2}">事件备注</span>
          <span :class="{activeTab:toggleTab === 3}" @click="() => {toggleTab = 3}" v-show="formData.trackingInfo">事件追踪</span>
        </div>
      </div>
      <!-- 事件信息 -->
      <div v-show="toggleTab === 0">
        <div class="event-xx">
          <div><span>事件编号：</span><span>{{formData.eventCode}}</span></div>
          <div><span>事件名称：</span><span>{{formData.eventName}}</span></div>
          <div><span>报警人：</span><span>{{formData.person}}</span></div>
          <div><span>联系电话：</span><span>{{formData.phone}}</span></div>
          <div><span>事发地点：</span><span>{{formData.incidentAddress}}</span></div>
          <div><span>事发特征：</span><span>{{formData.description}}</span></div>
        </div>
      </div>
      <!-- 录像调取 -->
      <div v-show="toggleTab === 1" style="overflow: hidden;margin-top: 30px;display: flex;">
        <div class="videotape-left">
          <div v-for="(item, i) of formData.resourceList" :key = i style="width: 100%; height: auto; border-bottom: 1px solid #203863">
            <div style="margin: 5px 0;">
              <span>录像机名称：</span>
              <span>{{item.resource.name}}</span>
            </div>
            <div>
              <div v-for="(row, j) of item.tagTime" :key = j style="margin: 14px;">
                <div style="margin-bottom:5px;display:flex" :title="row.tagName">
                  标记段：
                  <!-- icon iconfont icon-pause  icon-play-->
                  <span class='spaceWord'>{{row.tagName || '默认标记段'}}</span>
                  <i class="icon iconfont" :class="{ 'icon-play':!row._isHighLight, 'icon-pause':row._isHighLight }" style="cursor: pointer;" @click="clickVideoList(item, row)" :title="[row._isHighLight? '暂停': '播放']"></i>
                </div>
                <div :class="{ 'bgkStatus_no':!row._isHighLight,  'bgkStatus_yes':row._isHighLight }">
                  <span>{{row.startTime ? $moment(row.startTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''}}</span>
                  <span style="padding: 0 5px;">至</span>
                  <span>{{row.endTime ? $moment(row.endTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="videotape-right">
          <div style="width: 100%; height: 35px; font-size: 14px;">
            <span style="float: left; width: 30%;">录像调阅人： {{userName}}</span>
            <span style="float: left; width: 70%;">录像时间： {{trackTmp.startTime ? $moment(trackTmp.startTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''}} 至 {{trackTmp.endTime ? $moment(trackTmp.endTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''}}</span>
          </div>
          <div class="videotape-video">
            <playbackPlugin :configuration="configurationVideotape"  @playStatus="updateState" :defaultPane='1' ref="plugiChildren"></playbackPlugin>
          </div>
        </div>
        <!--  内层弹框 -->
        <div class="nei-btn" v-if="!formData.trackingInfo">
          <Button style="margin-top: 9px; margin-left: 9px;" icon="edit" title="事件追踪" @click="trinkClick" :disabled="JSON.stringify(playParams) === '{}'"></Button>
        </div>
      </div>
      <!-- 事件备注 -->
      <div v-show="toggleTab === 2" style="margin-left: 100px;">
        <div class="inputRemark">
          <span>输入备注：</span>
          <Input v-model="inputRemark" type="textarea" :autosize="true" placeholder="输入备注"/>
          <Button type="primary" style="margin-left: 12px" @click="save" :disabled="!inputRemark">确定</Button>
        </div>
        <div class="timeLine">
          <span style="float: left">备注记录：</span>
          <Timeline style="display: inline-block">
            <TimelineItem v-for="(item, index) of detail" :key="index">
              <p class="time">{{item.handleTime ? $moment(item.handleTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''}}</p>
              <div class="content"><span class="msg">{{item.detail}}</span><i class="icon iconfont icon-error" @click="del(index)" title="删除"></i></div>
            </TimelineItem>
          </Timeline>
        </div>
      </div>
      <!-- 事件追踪 -->
      <div v-show="toggleTab === 3" v-if="formData.trackingInfo" style="overflow: hidden; margin-top: 30px;">
        <div class="track-left">
          <div>
            <span>事件名称：</span>
            <span>{{formData.trackingInfo.name}}</span>
          </div>
          <div>
            <span>案件开始时间：</span>
            <span>{{$moment(formData.startTime * 1000).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </div>
          <div>
            <span>追踪镜头列表：</span>
            <ul style="width: auto; height: auto;">
              <li v-for="(item, index) of formData.trackingInfo.mapList" @click="selTrackLisy(item)" :key="index">
                <span>{{item.resource.name}}</span>
                <p v-if="item.startTime">{{item.startTime ? $moment(item.startTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''}} - {{item.endTime ? $moment(item.endTime * 1000).format('YYYY-MM-DD HH:mm:ss') : $moment(strackEndTime * 1000).format('YYYY-MM-DD HH:mm:ss') }}</p>
              </li>
            </ul>
          </div>
          <div>
            <span>备注：</span>
            <span>{{formData.trackingInfo.mark}}</span>
          </div>
        </div>
        <div class="track-right">
          <div class="track-video">
            <playbackPlugin :configuration="configurationTrack" :defaultPane='1' ref="pluginChildren"></playbackPlugin>
          </div>
        </div>
      </div>
    </Modal>
    <!-- 内层弹框 -->
    <Modal v-model="trackToggle" title="新建追踪事件" width="580px" :closable="false" :mask-closable="false">
      <iframe></iframe>
      <!-- 追踪事件信息 -->
      <div class="eventInfoBox">
        <Form label-position="left" :label-width="120" :model="modalData" ref="formValidate" :rules="ruleValidate">
          <FormItem label="追踪事件名称" prop="name">
            <Input v-model="modalData.name" placeholder="追踪事件名称"></Input>
          </FormItem>
          <FormItem label="追踪镜头列表">
            <ul style="width: auto; height: auto;">
              <li>
                <span style="float: left; width: 30%; height: 30px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{trackTmp.name}}</span>
                <span style="float: left; width: 70%;">{{$moment(trackTmp.startTime * 1000).format('YYYY-MM-DD HH:mm:ss')}} - {{$moment(trackTmp.endTime * 1000).format('YYYY-MM-DD HH:mm:ss')}}</span>
              </li>
            </ul>
          </FormItem>
          <FormItem label="追踪事件备注" prop="mark">
            <Input v-model="modalData.mark" placeholder="备注详情" type="textarea"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <div style="text-align: center">
          <Button type="primary" style="margin-left: 16px;" @click="cancelTrack">取消</Button>
          <Button type="primary" style="margin-left: 16px;" @click="StartTrack">开始追踪</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import playbackPlugin from '@src/components/videoComponentsNew/playbackPlugin'
import { setCaseAlarmDetails } from '@src/http/business/caseProcessing.api'
import { setTracking } from '@src/http/business/tracking.api'
import { mapActions } from 'vuex'
export default {
  name: 'caseProgress',
  components: { playbackPlugin },
  props: {
    openModal: {
      // 是否打开弹窗
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => {
        return {
          eventCode: '',
          eventName: '',
          person: '',
          phone: '',
          incidentAddress: '',
          description: '',
          resourceList: [],
          detail: []
        }
      }
    }
  },
  data() {
    // 追踪事件名称字数
    const eventNumber = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('不能为空'))
      } else {
        var phoneReg = /^\S{0,64}$/
        if (!phoneReg.test(value)) {
          callback(new Error('字符不能超过64位'))
        } else {
          callback()
        }
      }
    }
    // 追踪事件备注字数限制
    const desNumber = (rule, value, callback) => {
      if (value.length > 200) {
        callback(new Error('字符不能超过200位'))
      } else {
        callback()
      }
    }
    return {
      // 视频组件配置
      configurationTrack: {
        progressBar: true,
        timeline: false,
        buttos: ['showmodeShow', 'stop', 'stopAll', 'xiazai', 'screenshot', 'onTheWall']
      },
      // 视频组件配置
      configurationVideotape: {
        progressBar: false,
        timeline: false,
        buttos: ['showmodeShow', 'stop', 'stopAll', 'xiazai', 'screenshot', 'onTheWall']
      },
      // 正则
      ruleValidate: {
        name: [{ required: true, validator: eventNumber, trigger: 'change' }],
        mark: [{ validator: desNumber }]
      },
      userName: window.sessionStorage['user.username'], // 录像调阅人
      trackTmp: {}, // 生成【接力追踪事件】临时存储
      detail: [], // 事件备注data
      inputRemark: '', // 事件备注输入框
      toggleTab: 0, // 显示的Tab
      playParams: {},
      modalToggle: false, // 主窗口 是否打开
      trackToggle: false, // 新建接力追踪弹窗 是否打开
      // 追踪事件信息
      modalData: {
        name: '',
        mark: ''
      },
      bgkStatus: false, // pandu
      strackEndTime: '', // 接力追踪事件的最大时间
      saveId: '' // 存储当前id
    }
  },
  watch: {
    formData: {
      handler(val) {
        this.detail = this.$lodash.cloneDeep(val.detail)
        this.resourceList = this.$lodash.cloneDeep(val.resourceList)
        if (val.trackingInfo) {
          let _str = []
          let _end = []
          val.trackingInfo.mapList.map(e => {
            _str.push(e.startTime)
            _end.push(e.endTime)
          })
          _str.sort((a, b) => b - a)
          _end.sort((a, b) => b - a)
          if (_str[0] >= _end[0]) {
            this.strackEndTime = _str[0] + 10
          } else {
            this.strackEndTime = _end[0]
          }
        }
      },
      deep: true
    },
    // 解决案件进展,切换录像调取视频播放问题
    toggleTab(val) {
      if (val === 1 && !this.$lodash.isEmpty(this.playParams)) {
        this.$refs.plugiChildren.openPlayback([this.playParams])
      }
    },
    openModal: {
      handler(val) {
        if (val) {
          this.modalToggle = val
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['getCameraPower']),
    updateState(state) {
      // if (state === 1) {
      //   this.formData.resourceList.map(val => {
      //     if (val._isHighLight) {
      //       // val._isHighLight = false
      //       this.$set(val, '_isHighLight', false)
      //     }
      //   })
      //   console.log(this.formData.resourceList, '1')
      // } else if (state === 3) {
      //   this.formData.resourceList.map(val => {
      //     if (val._id === this.saveId) {
      //       // val._isHighLight = true
      //       this.$set(val, '_isHighLight', true)
      //     } else {
      //       this.$set(val, '_isHighLight', false)
      //     }
      //   })
      //   console.log(this.formData.resourceList, '3')
      // }
    },
    // 选择录像段
    async clickVideoList(item, tagTime) {
      let power = await this.getCameraPower(item.resource._id)
      if (!power || !power.includes('playback')) {
        this.$Notice.warning({ desc: '没有权限', title: '警告' })
        return
      }
      this.saveId = item._id
      this.trackTmp = {
        name: item.resource.name,
        startTime: tagTime.startTime,
        endTime: tagTime.endTime,
        resource: item.resource._id
      }
      let _data = [
        {
          channel: item.resource.chan,
          startTime: tagTime.startTime,
          endTime: tagTime.endTime,
          devIp: item.resource.eid.ip,
          name: item.name,
          devPort: item.resource.eid.cport
        }
      ]
      this.playParams = Object.assign({}, this.playParams, _data[0])

      if (this.$refs.plugiChildren.selectedObj.isPlay) {
        this.formData.resourceList.map(val => {
          val.tagTime.map(itemVal => {
            if (tagTime._id === itemVal._id) {
              if (!itemVal._isHighLight) {
                itemVal._isHighLight = true
                this.$refs.plugiChildren.playStop()
                this.$refs.plugiChildren.openPlayback(_data)
              } else {
                itemVal._isHighLight = false
                this.$refs.plugiChildren.playStop()
              }
            } else {
              itemVal._isHighLight = false
            }
          })
        })
      } else {
        this.$refs.plugiChildren.openPlayback(_data)
        this.formData.resourceList.map(val => {
          val.tagTime.map(itemVal => {
            if (tagTime._id === itemVal._id) {
              itemVal._isHighLight = true
            } else {
              itemVal._isHighLight = false
            }
          })
        })
      }
    },
    // 保存备注
    save() {
      let detail = this.$lodash.cloneDeep(this.detail)
      detail.push({
        handleTime: this.$moment().unix(),
        detail: this.inputRemark
      })
      this.setCaseAlarmDetails(detail)
    },
    del(index) {
      let detail = this.$lodash.cloneDeep(this.detail)
      let _tmp = detail.splice(index, 1)
      this.$Modal.confirm({
        title: '警告',
        content: `<p>是否<span style="color:red"> 删除 </span>备注时间为：<span>${this.$moment(
          _tmp[0].handleTime * 1000
        ).format('YYYY-MM-DD HH:mm:ss')}</span></p><br/><p>备注内容为：<span>${
          _tmp[0].detail
        }</span></p><br/><p>的备注信息</p>`,
        closable: true,
        width: '500px',
        onOk: () => {
          this.setCaseAlarmDetails(detail)
        }
      })
    },
    setCaseAlarmDetails(detail) {
      // 封装 修改数据
      setCaseAlarmDetails(this.formData._id, { detail })
        .then(res => {
          this.successMsg('事件备注保存成功')
          this.inputRemark = ''
          this.detail = this.$lodash.cloneDeep(detail)
        })
        .catch(err => {
          console.log(err)
          this.errorMsg('事件备注保存失败，请稍后重试')
        })
    },
    // 取消
    cancel() {
      this.$emit('cancelModal', false)
    },
    // 新建接力追踪事件 弹窗
    trinkClick() {
      this.trackToggle = true
    },
    // 取消 新建接力追踪弹窗
    cancelTrack() {
      this.trackToggle = false
    },
    // 内层弹框确认
    StartTrack() {
      this.$refs['formValidate'].validate(v => {
        if (v) {
          let _t = this.$lodash.cloneDeep(this.trackTmp)
          delete _t.name
          let _data = {
            ...this.modalData,
            mapList: [_t],
            resourceList: [_t],
            eventId: this.formData._id
          }
          setTracking(_data)
            .then(res => {
              this.$router.push({
                name: '/map/2D',
                params: {
                  id: res.data._id,
                  path: '/business/caseManagement'
                }
              })
            })
            .catch(err => {
              console.log(err)
              this.errorMsg('接力追踪事件创建失败，请稍后重试')
            })
        }
      })
    },
    // 点击视频列表
    async selTrackLisy(val) {
      let power = await this.getCameraPower(val.resource._id)
      if (!power || !power.includes('playback')) {
        this.$Notice.warning({ desc: '没有权限', title: '警告' })
        return
      }
      if (!val.startTime) {
        return
      }
      let _data = [
        {
          channel: val.resource.chan,
          startTime: val.startTime,
          endTime: val.endTime || this.strackEndTime,
          devIp: val.resource.eid.ip,
          name: val.resource.name,
          devPort: val.resource.eid.cport
        }
      ]
      this.$refs.pluginChildren.openPlayback(_data)
    }
  }
}
</script>

<style scoped lang="less">
iframe {
  position: absolute;
  width: 97%;
  height: 83%;
  z-index: 0;
  border: 0 none;
}
.spaceWord {
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.bgkStatus_no {
  background: inherit;
  padding: 0;
}
.bgkStatus_yes {
  background: rgb(70, 153, 249);
  padding: 0;
}
.modal-main {
  min-width: 100%;
}
.tab {
  padding: 0 5px;
  text-align: center;
  .tabRadius {
    border-right: 1px solid #5676a9;
    border-radius: 0px 4px 4px 0px;
  }
  & > span {
    float: left;
    background: #3c5073;
    width: 200px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    border: 1px solid #5676a9;
    border-right: none;
  }
  & > span:last-child {
    border-right: 1px solid #5676a9;
    border-radius: 0px 4px 4px 0px;
  }
  & > span.activeTab {
    background: #4699f9;
  }
}
.event-xx {
  width: 70%;
  margin: 0 auto;
  div {
    margin-top: 25px;
    span + span {
      word-break: break-all;
    }
  }
}
.inputRemark .ivu-input-wrapper {
  width: 72%;
  margin: 30px 0;
}
.timeLine {
  margin-top: 15px;
  height: 400px;
  overflow-y: auto;
}
textarea.ivu-input {
  height: 80px;
}
.track-left {
  width: 30%;
  float: left;
  margin-left: 4%;
  div {
    margin: 20px 0;
    spsn {
      font-size: 14px;
      line-height: 26px;
    }
  }
  li {
    cursor: pointer;
    margin: 5px 0;
    span {
      margin-left: 5px;
    }
    p {
      padding-left: 25px;
    }
  }
}
.track-right {
  width: 66%;
  float: left;
}
.track-video {
  width: 96%;
  height: 450px;
  background-color: #000;
}
// .videotape-left {
//   width: 30%;
// }
.videotape-right {
  width: 65%;
  margin-left: 4%;
}
.videotape-video {
  width: 96%;
  height: 450px;
  background-color: #000;
}
.ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
  padding-left: 0px;
}
/deep/ .ivu-timeline-item-tail {
  left: 155px;
  border-left: 1px solid #5676a9;
}
/deep/ .ivu-timeline-item-head {
  margin-left: 149px;
}
/deep/ .content {
  padding: 0 0 0 145px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .msg {
    width: 500px;
  }
  .icon {
    cursor: pointer;
    margin: 2px;
    user-select: none;
  }
}
/deep/ .ivu-modal-body {
  min-height: 593px;
}
.nei-btn {
  width: 50px;
  height: 68px;
  position: absolute;
  left: 885px;
  top: 562px;
  z-index: 9999999;
}
/deep/ .ivu-modal-footer {
  position: relative;
  z-index: 999999;
}
.eventInfoBox {
  margin: 0 20px 0 10px;
}
</style>
