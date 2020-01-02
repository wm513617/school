<template>
  <div v-if="modal">
    <Modal width="900px" v-model="modal" title="巡更报警" :mask-closable="false" @on-cancel="modalClose">
      <Form class="msg-form" ref="msgInfo" :model="msgInfo" :label-width="80" label-position="left" :rules="ruleValidate">
        <div class="msgImg">
          <div class="info-file">
            <video v-if="msgInfo.video" :poster="msgInfo.photo+'&t='+ Math.random()" width="100% " controls="controls " :src="msgInfo.photo+'&t='+ Math.random()"></video>
            <img class="msg-img" v-if="msgInfo.photo" :src="msgInfo.photo" alt="">
          </div>
        </div>
        <div class="msg-info">
          <FormItem label="单兵姓名">
            <Input disabled type="text" v-model="msgInfo.sender"></Input>
          </FormItem>
          <FormItem label="巡更点">
            <Input disabled type="text" v-model="msgInfo.position"></Input>
          </FormItem>
          <FormItem label="发送时间">
            <!-- <Input disabled type="text" :value="$moment.unix(msgInfo.date).format('YYYY-MM-DD') + ' ' + msgInfo.moment"></Input> -->
            <Input disabled type="text" :value="msgInfo.creatAt.slice(0,10)+' '+msgInfo.moment"></Input>
          </FormItem>
          <FormItem label="标题">
            <Input disabled type="text" :value="msgInfo.title"></Input>
          </FormItem>
          <FormItem label="详情">
            <textarea class="msgInfo-content" disabled v-model="msgInfo.content"></textarea>
          </FormItem>
          <FormItem label="选择预案" prop="plan">
            <Select v-model="msgInfo.plan">
              <Option @click.native="selectWarnPlan(item)" v-for="item in warnPlanListOpt" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="预案内容">
            <Input v-model="selectPlan.content" disabled type="textarea" :rows="5" placeholder="请输入预案内容..."></Input>
          </FormItem>
        </div>
      </Form>
      <div slot="footer">
        <Button v-if="$BShasPower('BS-PATROL-MESSAGE')" type="ghost" size="large" @click="modalClose">取消</Button>
        <Button v-if="$BShasPower('BS-PATROL-MESSAGE')" type="primary" size="large" @click="replyClick">回复</Button>
        <Button v-if="$BShasPower('BS-PATROL-MESSAGE')" type="warning" size="large" @click="alarmSubmit">确认报警</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import defaultImg from '../../../../static/noSolider.jpg'
import cxtImg from '../../../../static/car/vehicleMap1.jpg'
import { mapActions } from 'vuex'
export default {
  props: {
    modalInfoIsShow: {
      type: Boolean
    },
    data: {
      type: Object
    }
  },
  data() {
    const nameRule = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请选择预案'))
      } else {
        callback()
      }
    }
    return {
      defaultImg: defaultImg,
      modal: false,
      msgInfo: {
        pointName: '',
        title: '',
        content: '',
        receiver: [],
        sender: '',
        moment: '',
        senderId: {
          photo: '',
          _id: ''
        },
        senderImg: defaultImg,
        plan: '',
        planContent: ''
      },
      warnPlanList: [],
      warnPlanListOpt: [
        {
          value: 100,
          label: '预案加载中',
          content: ''
        }
      ],
      cxtImg: cxtImg,
      videoSrc: '/static/car/car-video.mp4',
      receiverStr: [],
      ruleValidate: {
        plan: [
          { required: true, validator: nameRule, trigger: 'change' }
        ]
      },
      selectPlan: {
        content: '',
        plan: ''
      }
    }
  },
  created() {
    // 获取报警管理处预案
    this.getPrearranged({ page: 1, limit: 50 }).then(suc => {
      this.warnPlanList = JSON.parse(JSON.stringify(suc.data))
      this.warnPlanListOpt = []
      if (this.warnPlanList.length !== 0) {
        for (let i = 0; i < this.warnPlanList.length; i++) {
          this.msgInfo.plan = this.warnPlanList[0]._id
          this.msgInfo.planContent = this.warnPlanList[0].content
          this.warnPlanListOpt.push({
            value: this.warnPlanList[i]._id,
            label: this.warnPlanList[i].name,
            content: this.warnPlanList[i].content
          })
        }
      }
    }).catch(err => {
      console.log('getPrearranged error: ' + err)
    })
  },
  watch: {
    modalInfoIsShow: function(val) {
      this.modal = val
    },
    data: {
      handler: function(val) {
        this.msgInfo = JSON.parse(JSON.stringify(val))
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(['getPrearranged']),
    modalClose() {
      this.$emit('update:modalInfoIsShow', false)
    },
    replyClick() {
      this.$emit('replyClick', this.msgInfo)
      this.$emit('update:modalInfoIsShow', false)
    },
    alarmSubmit() {
      this.$emit('alarmSubmit', this.msgInfo)
    },
    selectWarnPlan(data) {
      this.selectPlan.content = data.content
      this.selectPlan.plan = data.value
      this.msgInfo.plan = data.value
      this.msgInfo.planContent = data.content
    }
  },
  mounted() {
  }
}
</script>
<style lang="less" scoped>
.msg-form {
  display: flex;
  .msgImg{
    width: 500px;
    height: 582px;
    margin-right: 20px;
  }
  .msg-img{
    width: 500px;
    height: 582px;
    // margin-right: 20px;
  }
  .msg-info {
    flex: 1;
    .info-file {
      width: 560px;
      img{
        width: 560px;
        height: 360px;
      }
    }
  }
}
.msgInfo-content{
  height:120px;
  width: 100%;
  overflow-y:auto;
  background:#535f77;
  color: #ccc;
  border-radius: 4px;
  padding: 5px;
  line-height: 20px;
  border: 1px solid #5676a9;
}
</style>
