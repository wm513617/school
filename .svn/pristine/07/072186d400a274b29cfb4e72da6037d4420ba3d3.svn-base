<template>
  <div v-if="modal">
    <Modal width="680px" v-model="modal" :title="modalTitle" :mask-closable="false" @on-cancel="modalClose">
      <Form class="msg-form" :rules="messageRole" ref="msgAdd" :model="msgInfo" :label-width="80" label-position="left">
        <div class="sender">
          <img :src="msgInfo.senderImg" alt="发送人头像">
          <span>{{msgInfo.sender}}</span>
        </div>
        <div class="msg-info">
          <FormItem label="收件人" prop="receiver">
            <Input readonly :value="receiverStr.toString()">
            <Button @click="modalRightShow" slot="append" :icon="modalRight?'arrow-left-a':'arrow-right-a'"></Button>
            </Input>
          </FormItem>
          <FormItem label="标题" prop="title" :required="true">
            <Input type="text" v-model="msgInfo.title"></Input>
          </FormItem>
          <FormItem label="详情" prop="content">
            <Input v-model="msgInfo.content" type="textarea" :rows="10"></Input>
          </FormItem>
        </div>
      </Form>
      <div v-show="modalRight" class="modal-right">
        <VTree :isSaveState="false" @handlecheckedChange="handlecheckedChange" ref="sentryTree" :options="{showFolder:false,showInput:true}" :treeData="treeData"></VTree>
      </div>
      <div slot="footer">
        <!-- <Button type="ghost" size="large" @click="cancel">取消</Button> -->
        <Button type="primary" size="large" :loading="modal_loading" @click="modalOk">发送</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import patrol from '../common/patrol'
import toTree from '../../../assets/js/toTreeData'
import defaultImg from '../../../../static/noSolider.jpg'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'msgModal',
  props: {
    modalIsShow: {
      type: Boolean
    },
    singleMesInfos: {
      type: Array,
      default: () => {
        return []
      }
    },
    replyUser: {
      type: Object
    },
    modalType: {
      type: Number,
      default: 1
    },
    isSingleAlarm: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modalTitle: '新建消息',
      treeData: [],
      modal_loading: false,
      modalRight: false,
      modal: false,
      messageRole: {
        receiver: [{ validator: this.$bsValidate.validateMsgReceiver, trigger: 'change' }],
        title: [{ validator: this.$bsValidate.validateStr64, trigger: 'blur' }],
        content: [{ validator: this.$bsValidate.validateStr512, trigger: 'blur' }]
      },
      msgInfo: {
        title: '',
        content: '',
        receiver: [],
        sender: '',
        senderImg: defaultImg
      },
      receiverStr: []
    }
  },
  computed: {
    ...mapState({
      loginUser: state => {
        return state.user
      }
    })
  },
  watch: {
    'msgInfo.receiver': {
      handler: function(val) {
        this.receiverStr = []
        val.map(item => {
          this.receiverStr.push(item.realName)
        })
      },
      deep: true
    },
    modalIsShow: function(val) {
      this.msgInfo.receiver = []
      this.receiverStr = []
      this.msgInfo.title = ''
      this.msgInfo.content = ''
      if (this.modalType === 2) {
        this.modalTitle = '消息回复'
        this.msgInfo.receiver.push({
          realName: this.replyUser.realName,
          userId: this.replyUser.userId
        })
      } else {
        this.modalTitle = '新建消息'
        this.singleMesInfos.map(item => {
          this.msgInfo.receiver.push({
            realName: item.realName,
            userId: item.userId
          })
        })
      }
      this.modal = val
    }
  },
  created() {
    this.msgInfo.sender = this.loginUser.username
    this.msgInfo.senderImg = this.loginUser.loginInforImg || defaultImg
  },
  methods: {
    ...mapActions(['getSentryUserTree', 'addMessage', 'recordLog']),
    modalRightShow() {
      if (this.modalRight) {
        this.modalRight = false
      } else {
        this.getSentryUserTree()
          .then(res => {
            this.treeData = toTree(res)
            this.modalRight = true
            patrol.selectSender(this.msgInfo.receiver, this.treeData)
          })
          .catch(err => console.log(err))
      }
    },
    modalOk() {
      this.$refs['msgAdd'].validate(valid => {
        if (valid) {
          if (this.msgInfo.receiver.length && this.msgInfo.title.length) {
            if (!this.modal_loading) {
              this.modal_loading = true
              this.addMessage(this.msgInfo)
                .then(res => {
                  // 单兵无需提示
                  if (!this.isSingleAlarm) {
                    this.$Notice.success({
                      title: '发送成功'
                    })
                  }
                  this.modalRight = false
                  this.modal = false
                  this.$emit('update:modalIsShow', false)
                  this.$emit('addOK', true)
                  this.modal_loading = false
                })
                .catch(err => {
                  this.errorMsg(err.response.data.message)
                  console.log(err)
                  this.modal_loading = false
                })
              this.recordLog({logType: '操作日志', module: '电子巡查', operateName: '发送消息', operateContent: '发送消息 至 收件人', target: this.msgInfo.title})
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
      this.modal = false
      this.$emit('singleCancel', false)
      // this.$emit('pointAlarmModal', false)
      // this.SAVE_PATROL_RELY_STUATES(false)
    },
    modalClose() {
      this.modalRight = false
      this.$refs['msgAdd'].resetFields()
      this.$emit('update:modalIsShow', false)
      patrol.clearCheckedTreeNode(this.$refs.sentryTree.treeNode)
    },
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
      this.msgInfo.receiver = [...new Set(arr)]
    }
  }
}
</script>

<style lang="less" scoped>
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
