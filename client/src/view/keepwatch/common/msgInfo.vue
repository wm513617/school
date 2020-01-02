<template>
  <div>
    <dragBoxs width="890px" title="巡更异常"  v-if="isAlarmMoal" @close="modalClose" :index="1000" :modalBorder="border">
      <div class="modol-body" style="height: 500px; width: 880px; padding: 24px 22px">
        <div class="patrol-video">
          <Tabs :animated="false">
              <TabPane label="位置">
                <LocateInMap style="width:500px;height:400px" type="single" :geo="patrolAlarmGeo"></LocateInMap>
              </TabPane>
              <TabPane label="视频">
                <PatrolVideo :width="500" :height="400" :url="videoUrl" :type="showType"></PatrolVideo>
              </TabPane>

          </Tabs>
        </div>
        <div style="float:right;width:40%" class="patrol-left">
          <p class="patrol-title">{{msgInfo.title}}</p>
            <div class="patrol-info">
              <div class="info-top">
                <p style="float:left;" class="patrol-sponsor">
                  <span><i class="font-common icon iconfont icon-admin"></i>{{msgInfo.sender}}</span>
                </p>
                <p class="patrol-sponsor" style="margin-left:156px">
                  <span><i class="font-common icon iconfont icon-Location"></i>{{msgInfo.position}}</span>
                </p>
                <p class="patrol-sponsor">
                  <span><i class="font-common icon iconfont icon-shijian"></i>{{msgInfo.date}}</span>
                </p>
                <p class="patrol-sponsor">
                  <span>{{msgInfo.content}}</span>
                </p>
              </div>
              <p style="width:100%;height:4px;border-bottom:1px solid #6f7d92"></p>
            </div>
        </div>
        <div class="infoRightInfo">
          <div class="infoDetail">
            <div class="infoLabel">警情处理</div>
            <div class="infoValue">
              <Select v-model="planAlarmSelId" size="small" style="width:174px" disabled>
                <Option v-for="item in planAlarmList" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </div>
          </div>
          <div class="infoDetail" style="margin:12px 0 12px 0;display: inline-block;" >
            <div class="infoLabel">警情确认</div>
            <div class="infoValue">
              <Select v-model="pointSelectionPlanId" size="small" style="width:174px" :disabled="!!msgInfo.planName">
                <Option @click.native="selectWarnPlan(item)" v-for="item in warnPlanListOpt" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
          </div>
          <div class="infoDetail">
            <div class="infoLabel">警情信息</div>
            <div class="infoValue">
              <Input type="textarea" :autosize="{minRows: 3,maxRows: 4}" v-model="selectedPlan.content" :disabled="!!msgInfo.planName"></Input>
            </div>
          </div>
        </div>
        <div class="patrol-foot">
          <Button type="ghost" style="margin-right:40px" @click="confirmAlarm('unProcess')" :disabled="!!msgInfo.planName">清除报警</Button>
          <Button style="margin-right:37px" @click="replyClick" :disabled="!!msgInfo.planName">回复</Button>
          <Button type="primary" @click="confirmAlarm('process')" :disabled="!!msgInfo.planName">确认报警</Button>
        </div>
      </div>
    </dragBoxs>
    <div v-if="isRuleModal">
      <dragBoxs v-model="isRuleModal" width="890px" title="消息详情" @close="modalClose" :index="1000" :modalBorder="border">
        <div class="msg-content" style="padding: 24px 22px">
          <div class="msg-content-left">
            <p style="margin-bottom: 12px">{{msgInfo.title}}</p>
            <div class="patrol-video">
            <PatrolVideo :width="400" :height="300" :url="videoUrl" :type="showType"></PatrolVideo>
          </div>
          </div>
          <div class="msg-content-right">
            <p>
              <span>
                <Icon type="ios-location-outline" size="24" style="margin-right:5px"/>{{msgInfo.position}}
              </span>
              <span>
                <Icon type="android-time" size="24" style="margin-right:5px"/>{{msgInfo.date}}
              </span>
            </p>
            <textarea class="msgInfo-content" disabled v-model="msgInfo.content">
            </textarea>
          </div>
        </div>
        <div>
          <p v-show="!repairInfor" class="patrol-btn">
              <Button  size="large" @click="pointAlarmClose" :disabled="!!msgInfo.planName">关闭</Button>
              <Button  type="primary" size="large" @click="replyClick" :disabled="!!msgInfo.planName">回复</Button>
          </p>
        </div>
      </dragBoxs>
    </div>
    <Modal class="mapAlarm" width="680px" v-model="isShowModal" title="消息回复" >
        <Form class="msg-form" :rules="messageRole" ref="msgAdd" :model="emailMsgInfo" :label-width="80" label-position="left">
        <div class="sender">
          <img :src="emailMsgInfo.senderImg" alt="发送人头像">
          <span>{{emailMsgInfo.sender}}</span>
        </div>
        <div class="msg-info">
          <FormItem label="标题" prop="title" :required="true">
            <Input type="text" v-model="emailMsgInfo.title"></Input>
          </FormItem>
          <FormItem label="收件人" prop="receiver">
            <Input readonly :value="receiverStr.toString()">
            <Button @click="modalRightShow" slot="append" :icon="modalRight?'arrow-left-a':'arrow-right-a'"></Button>
            </Input>
          </FormItem>
          <FormItem label="详情" prop="content" :required="true">
            <Input v-model="emailMsgInfo.content" type="textarea" :rows="10"></Input>
          </FormItem>
        </div>
        </Form>
        <div v-show="modalRight" class="modal-right">
          <VTree :isSaveState="false" @handlecheckedChange="handlecheckedChange" ref="sentryTree" :options="{showFolder:false,showInput:true}" :treeData="treeData"></VTree>
        </div>
        <div slot="footer">
          <Button type="ghost" size="large" @click="cancel">取消</Button>
          <Button type="primary" :loading="modalLoading" size="large" @click="modalOk">发送</Button>
        </div>
      </Modal>
  </div>
</template>

<script>
import defaultImg from '../../../../static/noSolider.jpg'
import cxtImg from '../../../../static/car/vehicleMap1.jpg'
import { mapState, mapActions, mapMutations } from 'vuex'
import PatrolVideo from '../../../components/video/PatrolVideo'
import moment from 'moment'
import dragBoxs from '../../../components/dragx/Dragx.vue'
import toTree from '../../../assets/js/toTreeData'
import LocateInMap from '../../../components/map/LocateInMap'
export default {
  components: {
    PatrolVideo,
    dragBoxs,
    LocateInMap
  },
  props: {
    replyUserModal: {
      type: Object
    },
    data: {
      type: Object
    },
    modalType: {
      type: Number
    }
  },
  data() {
    return {
      alarmType: '',
      dealState: '',
      border: '1px #0a111c solid',
      isShowALLModal: 1,
      emailMsgInfo: {
        title: '',
        content: '',
        receiver: [],
        sender: '',
        senderImg: defaultImg
      },
      isShowModal: false,
      treeData: [],
      modalLoading: false,
      messageRole: {
        receiver: [
          { validator: this.$bsValidate.validateMsgReceiver, trigger: 'change' }
        ],
        title: [
          { validator: this.$bsValidate.validateStr64, trigger: 'blur' }
        ],
        content: [
          { validator: this.$bsValidate.validateStr512, trigger: 'blur' }
        ]
      },
      modalRight: false,
      emailModal: true,
      pointSelectionPlan: '',
      planAlarmSelId: '',
      planAlarmList: [],
      showType: '',
      isRuleModal: false,
      videoUrl: '',
      repairInfor: false,
      defaultImg: defaultImg,
      isAlarmMoal: false,
      warnPlanListOpt: [],
      msgInfo: {
        phoneNumber: '',
        pointLeader: '',
        remarks: '',
        position: '',
        pointName: '',
        title: '',
        content: '',
        receiver: [],
        sender: '',
        senderId: {
          photo: '',
          _id: ''
        },
        senderImg: defaultImg
      },
      selectedPlan: {
        value: '',
        label: '',
        content: ''
      },
      cxtImg: cxtImg,
      videoSrc: '/static/car/car-video.mp4',
      receiverStr: [],
      patrolAlarmGeo: '',
      pointSelectionPlanId: ''
    }
  },
  computed: {
    ...mapState({
      keepMsgModal: ({ patrol }) => {
        return patrol.keepMsgModal
      },
      loginUser: state => {
        return state.user
      }
    })
  },
  watch: {
    modalType: function(val) {
      this.isShowALLModal = val
      // this.isShowModal = true
    },
    'emailMsgInfo.receiver': {
      handler: function(val) {
        this.receiverStr = []
        val.map(item => {
          this.receiverStr.push(item.realName)
        })
      },
      deep: true
    },
    'replyUserModal': {
      handler: function(val) {
        this.emailMsgInfo.receiver = []
        this.receiverStr = []
        this.emailMsgInfo.title = ''
        this.emailMsgInfo.content = ''
        this.emailMsgInfo.receiver.push({
          realName: this.replyUserModal.realName,
          userId: this.replyUserModal.userId
        })
      },
      deep: true
    },
    // modalInfoIsShow: function(val) {
    //   this.modal = val
    //   this.selectedPlan.value = ''
    //   this.selectedPlan.label = ''
    //   this.selectedPlan.content = ''
    // },
    data: {
      handler: function(val) {
        this.msgInfo = JSON.parse(JSON.stringify(val))
        console.log(this.msgInfo, 'this.msgInfo')
        this.patrolAlarmGeo = this.msgInfo.geo
        // this.alarmType = this.msgInfo.alarmType
        this.msgInfo.date = moment(this.msgInfo.date * 1000).format('YYYY-MM-DD') + ' ' + this.msgInfo.moment
        if (this.msgInfo.type === 0) {
          this.isRuleModal = true
          this.isAlarmMoal = false
        } else {
          this.isAlarmMoal = true
          this.isRuleModal = false
        }
        if (this.msgInfo.photo && this.msgInfo.platform === 'app') {
          this.videoUrl = this.msgInfo.photo
          this.showType = 'image'
        } else if (this.msgInfo.video && this.msgInfo.platform === 'app') {
          this.videoUrl = this.msgInfo.video
          this.showType = 'video'
        } else {
          this.showType = ''
          this.videoUrl = ''
        }
        if (this.msgInfo.planName) {
          this.warnPlanListOpt.map(item => {
            if (item.value === this.msgInfo.planId) {
              this.pointSelectionPlanId = item.value
              this.selectedPlan.content = item.content
            }
          })
          this.planAlarmSelId = this.msgInfo.planDeal
        } else {
          this.pointSelectionPlan = this.warnPlanListOpt[0].label
          this.pointSelectionPlanId = this.warnPlanListOpt[0].value
          this.selectedPlan.content = this.warnPlanListOpt[0].content
        }
      },
      deep: true
    }
  },
  created() {
    this.emailMsgInfo.sender = this.loginUser.username
    this.emailMsgInfo.senderImg = this.loginUser.loginInforImg || defaultImg
    // // 获取报警管理处预案
    // this.getPrearranged({ page: 1, limit: 50 })
    //   .then(suc => {
    //     let warnPlanList = JSON.parse(JSON.stringify(suc.data))
    //     this.warnPlanListOpt = []
    //     for (let i = 0; i < warnPlanList.length; i++) {
    //       this.msgInfo.planContent = warnPlanList[0].content
    //       this.warnPlanListOpt.push({
    //         value: warnPlanList[i]._id,
    //         label: warnPlanList[i].name,
    //         content: warnPlanList[i].content
    //       })
    //     }
    //   })
    //   .catch(err => {
    //     console.log('getPrearranged error: ' + err)
    //   })
    this.getalarmDealList()
    this.getAlarmTypeList()
  },
  methods: {
    ...mapActions(['getPrearranged', 'updateTaskMessage', 'getMapAlarmDealList', 'getPrearranged', 'getSentryUserTree', 'massageReplay']),
    ...mapMutations(['SAVE_PATROL_RELY_STUATES']),
    /**
     * 点击选择收件人
     */
    modalRightShow() {
      if (this.modalRight) {
        this.modalRight = false
      } else {
        this.getSentryUserTree().then(res => {
          this.treeData = toTree(res)
          this.modalRight = true
        }).catch(err => console.log(err))
      }
    },
    /**
     * 树选择收件人赋值文本框
     */
    handlecheckedChange() {
      let selectNode = this.$refs.sentryTree.getSelectedNodes()
      let arr = []
      selectNode.map(item => {
        if (!item.isOrg) {
          arr.push({
            realName: item.name,
            userId: item._id
          })
        }
      })
      this.emailMsgInfo.receiver = arr
    },
    /**
     * 确认发送
     */
    modalOk() {
      this.$refs['msgAdd'].validate(valid => {
        if (valid) {
          if (this.emailMsgInfo.receiver.length && this.emailMsgInfo.title.length) {
            if (!this.modalLoading) {
              this.modalLoading = true
              this.massageReplay(this.emailMsgInfo).then(res => {
                this.$Notice.success({
                  title: '创建成功'
                })
                this.modalRight = false
                this.isShowModal = false
                // this.$emit('pointAlarmModal', true)
                this.$emit('senderSuccess', true)
                this.SAVE_PATROL_RELY_STUATES(false)
                this.modalLoading = false
              }).catch(err => {
                this.$emit('senderSuccess', false)
                this.errorMsg(err.response.data.message)
                console.log(err)
                this.modalLoading = false
              })
            }
          } else {
            this.$Notice.error({
              title: '收件人或标题不能为空，请重新编辑消息！'
            })
          }
        }
      })
    },
    /**
     * 取消发送
     */
    cancel() {
      if (this.isShowALLModal === 0) {
        this.isRuleModal = true
        this.isAlarmMoal = false
        this.isShowModal = false
      } else {
        this.isRuleModal = false
        this.isAlarmMoal = true
        this.isShowModal = false
      }
      // this.$emit('pointAlarmModal', true)
      // this.SAVE_PATROL_RELY_STUATES(false)
    },
    // 警情处理列表
    getalarmDealList() {
      this.getMapAlarmDealList({ page: 1, limit: 100, type: 'alarm' }).then(res => {
        let alarmDealList = []
        res.data.forEach(item => {
          alarmDealList.push({ label: item.name, value: item.name })
          this.planAlarmList = alarmDealList
          // this.planAlarmSelId = this.planAlarmList[0].value
        })
        if (this.planAlarmList.length > 0) {
          this.planAlarmSelId = this.planAlarmList[0].value
        }
      }).catch(err => {
        console.log('getFireAlarmDealList error: ', err)
        this.errorMsg('警情处理列表获取失败')
      })
    },
    // 警情确认列表
    getAlarmTypeList() {
      this.getPrearranged({ page: 1, limit: 50 }).then(res => {
        let warnAlarmList = []
        res.data.forEach(item => {
          warnAlarmList.push({ label: item.name, value: item._id, content: item.content })
          this.warnPlanListOpt = warnAlarmList
        })
        if (this.warnPlanListOpt.length > 0) {
          this.pointSelectionPlan = this.warnPlanListOpt[0].label
          this.pointSelectionPlanId = this.warnPlanListOpt[0].value
          this.selectedPlan.content = this.warnPlanListOpt[0].content
        }
      }).catch(err => {
        console.log('getAlarmTypeList error: ', err)
        this.errorMsg('警情确认列表获取失败')
      })
    },
    pointAlarmClose() {
      // this.$Modal.confirm({
      //   title: '提示',
      //   content: '<p>确认该报警吗？</p>',
      //   onOk: () => {
      //     this.$emit('closeConventionMsg', this.msgInfo._id)
      //     this.isRuleModal = false
      //     this.successMsg('报警确认成功')
      //   }
      // })
      this.$emit('closeConventionMsg', this.msgInfo._id)
      this.isRuleModal = false
    },
    modalClose() {
      // this.$emit('update:modalInfoIsShow', false)
      this.isRuleModal = false
      this.isAlarmMoal = false
    },
    selectWarnPlan(data) {
      this.selectedPlan.label = data.label
      this.selectedPlan.value = data.value
      this.selectedPlan.content = data.content
    },
    confirmAlarm(data) {
      // if (data === '') {
      //   this.successMsg('报警清除成功')
      //   this.isRuleModal = false
      //   this.isAlarmMoal = false
      //   this.$emit('notarizeClick', this.msgInfo._id)
      //   return
      // }
      if (this.pointSelectionPlan && this.planAlarmSelId) {
        this.$Modal.confirm({
          title: '提示',
          content: `<p>确定执行报警预案<span style="color:#E7505A;font-size:20px">${
            this.selectedPlan.label
          }</span>吗？</p>`,
          onOk: () => {
            const alarmSureInfo = {
              alarmDeal: this.planAlarmSelId,
              situationType: this.selectedPlan.label || this.pointSelectionPlan,
              alarmContent: this.selectedPlan.content
            }
            if (data === 'ignore') {
              this.dealState = 'ignore'
            } else if (data === 'process') {
              this.dealState = 'process'
            } else {
              this.dealState = 'unProcess'
            }
            const param = {
              id: this.msgInfo._id || this.msgInfo.uniqueId,
              planId: this.selectedPlan.value || this.pointSelectionPlanId,
              planName: this.selectedPlan.label || this.pointSelectionPlan,
              planDeal: this.planAlarmSelId,
              remark: this.selectedPlan.content,
              dealState: this.dealState,
              ackContent: JSON.stringify(alarmSureInfo)
            }
            this.updateTaskMessage(param)
              .then(res => {
                if (this.msgInfo.senderId._id) {
                  this.$emit('confirmAlarm', this.msgInfo.senderId._id)
                }
                if (this.msgInfo.devId) {
                  // 巡更报警处理
                  this.$emit('confirmAlarm', this.msgInfo.devId)
                }
                // this.$emit('update:modalInfoIsShow', false)
                this.successMsg('报警确认成功')
                this.isRuleModal = false
                this.isAlarmMoal = false
                this.$emit('notarizeClick', this.msgInfo._id)
              })
              .catch(err => this.errorMsg(err.response.data.message))
          }
        })
      } else {
        this.errorMsg('请选择警情')
      }
    },
    replyClick() {
      this.$emit('replyClick', this.msgInfo)
      // this.$emit('update:modalInfoIsShow', false)
      this.isRuleModal = false
      this.isAlarmMoal = false
      this.isShowModal = true
    }
  }
}
</script>
<style lang="less" scoped>
.patrol-video {
  float: left;
  width: 60%;
}
.msg-form {
  display: flex;
  .msg-info {
    flex: 1;
    height: 396px;
  }
}
.msg-content {
  display: flex;
  .msg-content-left {
    width: 440px;
    padding: 5px;
  }
  .msg-content-right {
    width: 400px;
    span {
      margin-right: 120px;
    }
  }
}
.patrol-left {
  padding-left: 20px;
  .patrol-title {
    text-align: center;
    margin: 10px 0;
  }
  .patrol-info{
    height: 196px;
    .info-top{
      height: 184px;
      .patrol-sponsor {
        height: 40px;
        line-height: 40px;
        // margin: 2px 0 15px 0;
      }
      .sponsor {
        float: left;
        margin-right: 20px;
      }
    }
  }
  .infoDetail {
    display: block;
  }
  .info-top span i {
    margin-right: 10px;
  }
}
.infoRightInfo {
  float: left;
  padding-left: 20px;
  height: 154px;
  .infoDetail {
    width: 100%;
    height: 26px;
    line-height: 26px;
    clear: both;
    .infoLabel {
      width: 74px;
      float: left;
    }
    .alarmHostBtn {
      width: 100%;
      float: left;
      margin: 12px 0;
    }
    .infoValue {
      float: left;
      .infoValueHeight {
        width: 100%;
        height: 100px;
        border: 1px solid #444;
        padding-left: 5px;
        .alarmIncountItem {
          cursor: pointer;
          height: 22px;
          line-height: 22px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &:hover {
            color: #20adff;
          }
        }
      }
    }
  }
}
.infoRight .infoRightInfo-top {
  height: 130px;
  .infoDetail{
    height: 30px;
    line-height: 30px;
  }
}
.patrol-foot {
  float: right;
  padding: 20px;
}
.msgInfo-content {
  height: 296px;
  width: 100%;
  overflow-y: auto;
  background: #535f77;
  color: #ccc;
  border-radius: 4px;
  padding: 5px;
  line-height: 20px;
  margin-top: 10px;
  border: 1px solid #5676a9;
}
.patrol-btn {
  display: flex;
  justify-content: space-around;
  margin-bottom: 14px;

}
  .msg-form {
    display: flex;
    .sender {
      flex: 0 0 120px;
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
      span {
        padding: 10px;
        font-size: 16px;
      }
    }
    .msg-info {
      flex: 1;
    }
}
.modal-right {
  padding: 10px;
  position: absolute;
  top: 0;
  border-left: 1px solid #171717;
  right: -240px;
  width: 240px;
  height: 100%;
  overflow: auto;
  background: #1c3053;
}
</style>
