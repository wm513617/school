<template>
  <div v-if="isShowModal">
    <Modal class="mapAlarm" width="680px" v-model="isShowModal" title="消息回复" :mask-closable="false" @on-cancel="modalClose">
      <Form class="msg-form" :rules="messageRole" ref="msgAdd" :model="msgInfo" :label-width="80" label-position="left">
        <div class="sender">
          <img :src="msgInfo.senderImg" alt="发送人头像">
          <span>{{msgInfo.sender}}</span>
        </div>
        <div class="msg-info">
          <FormItem label="标题" prop="title" :required="true">
            <Input type="text" v-model="msgInfo.title"></Input>
          </FormItem>
          <FormItem label="收件人" prop="receiver">
            <Input readonly :value="receiverStr.toString()">
            <Button @click="modalRightShow" slot="append" :icon="modalRight?'arrow-left-a':'arrow-right-a'"></Button>
            </Input>
          </FormItem>
          <FormItem label="详情" prop="content" :required="true">
            <Input v-model="msgInfo.content" type="textarea" :rows="10"></Input>
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
import { mapState, mapActions, mapMutations } from 'vuex'
import defaultImg from '../../../../../../static/noSolider.jpg'
import toTree from 'assets/js/toTreeData'
export default {
  name: 'msgModal',
  props: {
    isShowMsgModal: {
      type: Boolean
    },
    replyUser: {
      type: Object
    },
    modalType: {
      type: String
    }
  },
  data() {
    return {
      isShowModal: false,
      treeData: [],
      modalLoading: false,
      msgInfo: {
        title: '',
        content: '',
        receiver: [],
        sender: '',
        senderImg: defaultImg
      },
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
    isShowMsgModal: function(val) {
      this.msgInfo.receiver = []
      this.receiverStr = []
      this.msgInfo.title = ''
      this.msgInfo.content = ''
      this.msgInfo.receiver.push({
        realName: this.replyUser.realName,
        userId: this.replyUser.userId
      })
      this.isShowModal = val
    }
  },
  created() {
    this.msgInfo.sender = this.loginUser.username
    this.msgInfo.senderImg = this.loginUser.loginInforImg || defaultImg
  },
  methods: {
    ...mapActions(['getSentryUserTree', 'massageReplay']),
    ...mapMutations(['SAVE_PATROL_RELY_STUATES']),
    modalClose() {
      this.modalRight = false
      this.$refs['msgAdd'].resetFields()
      this.SAVE_PATROL_RELY_STUATES(false)
      // this.$emit('update:modalIsShow', false)
      // patrol.clearCheckedTreeNode(this.$refs.sentryTree.treeNode)
    },
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
      this.msgInfo.receiver = arr
    },
    /**
     * 确认发送
     */
    modalOk() {
      this.$refs['msgAdd'].validate(valid => {
        if (valid) {
          if (this.msgInfo.receiver.length && this.msgInfo.title.length) {
            if (!this.modalLoading) {
              this.modalLoading = true
              this.massageReplay(this.msgInfo).then(res => {
                this.$Notice.success({
                  title: '创建成功'
                })
                this.modalRight = false
                // this.$emit('update:modalIsShow', false)
                this.$emit('pointAlarmModal', true)
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
      console.log('modalType', this.modalType)
      this.$emit('senderSuccess', false)
      this.$emit('pointAlarmModal', true)
      this.SAVE_PATROL_RELY_STUATES(false)
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
