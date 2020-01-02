<template>
  <div class="list-main userList">
    <div class="list-top">
      <Button-group>
        <Button icon="plus" :disabled="addPower" title="添加" @click="addUserModal"></Button>
        <Button icon="trash-a" title="删除" :disabled="delPower" @click="delUserModal"></Button>
        <Button icon="arrow-up-c" title="上移" :disabled="upPower" @click="moveNode(0)"></Button>
        <Button icon="arrow-down-c" title="下移" :disabled="downPower" @click="moveNode(1)"></Button>
      </Button-group>
    </div>
    <div class="list-btm">
      <bs-scroll ref="userScroll" class="scroll-style">
        <bsr-tree ref='tree' v-model="activeNode" :treeData="treeData" @on-expand="expand" @node-click='handleNode'>
          <template slot-scope="{ node }">
            <div class="user-tree children">
              <span class="user-name" :title="node.name">{{node.name}}</span>
              <span class="user-state" v-show="node.role">
                <i :style="{ background: node.state === 'online' ? '#00FF00' : (node.state === 'offline' ? '#C0C0C0' : '#FF0000') }"></i>
                {{ node.state === 'online' ? '在线' : (node.state === 'offline' ? '离线' : '过期') }}
              </span>
            </div>
          </template>
        </bsr-tree>
      </bs-scroll>
    </div>
    <Modal :mask-closable="false" v-model="addUserShow" width="450" title="新建用户" @on-cancel="addUserCancel('userValidate')">
      <Form ref="userValidate" :rules="userValidate" class="form-style" :model="addUserForm" label-position="left" :label-width="90">
        <FormItem label="所属角色" prop="role">
          <Input readonly v-model.trim="addUserForm.role" class="input-style"></Input>
        </FormItem>
        <FormItem label="用户名" prop="name">
          <Input v-model.trim="addUserForm.name" class="input-style"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input type="password" v-model.trim="addUserForm.password" class="input-style"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="repeatPwd">
          <Input v-model.trim="addUserForm.repeatPwd" type="password" class="input-style"></Input>
        </FormItem>
        <FormItem label="真实姓名" prop="realName">
          <Input v-model.trim="addUserForm.realName" class="input-style"></Input>
        </FormItem>
        <FormItem label="级别" prop="rank">
          <Select v-model="addUserForm.rank" class="input-style">
            <Option v-for="item in 9" :value="item" :key="item">{{ item }}</Option>
          </Select>
        </FormItem>
        <FormItem label="有效期" prop="date">
          <DatePicker type="date" :disabled="picker" v-model="addUserForm.date" class="input-style"></DatePicker>
          <Checkbox v-model="addUserForm.Indefinitely" class="check-style" @on-change="dateCheck">无限期</Checkbox>
        </FormItem>
        <FormItem label="启用交接班" prop="duty">
          <Checkbox v-model="addUserForm.duty"></Checkbox>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="addUserCancel('userValidate')" type="ghost">取消</Button>
        <Button @click="addUserAffirm('userValidate')" type="primary">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import FormValidate from '../formValidate.js'
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'userList',
  components: {
  },
  mixins: [FormValidate],
  data() {
    return {
      activeUserId: '',
      picker: true,
      addUserShow: false,
      delPower: true,
      addPower: true,
      upPower: true,
      downPower: true,
      activeNode: {},
      treeData: {},
      activeOrg: {},
      othersNode: {},
      orgOptions: {
        onlineStatus: true
      },
      addUserForm: {
        name: '',
        password: '',
        realName: '',
        repeatPwd: '',
        role: '',
        rank: '',
        date: '',
        Indefinitely: true,
        duty: true
      }
    }
  },
  computed: {
    ...mapState({
      userList: ({userManage}) => userManage.userList
    })
  },
  created() {
    this.getUserTree()
  },
  methods: {
    ...mapActions([
      'getUserListTree',
      'addUserManage',
      'getUserInfo',
      'delUser',
      'moveUserNode'
    ]),
    /**
     * 手动调用bs-scroll的update
     * @method expand
     */
    expand() {
      this.$refs.userScroll.update()
    },
    /**
     * 获取选中用户列表信息
     * @method handleNode
     * @param {Object} node 选中节点信息
     */
    handleNode(node, mark) {
      this.activeOrg = {}
      this.activeUserId = ''
      this.othersNode = mark
      if (!node.pid && !node.role) {
        this.delPower = true
        this.addPower = true
        this.upPower = true
        this.downPower = true
        return
      }
      if (node.pid) {
        this.delPower = true
        this.addPower = false
        this.activeOrg = node
        this.upPower = mark.index === 0
        this.downPower = mark.index === mark.parent.length - 1
        return
      }
      if (node.role) {
        this.addPower = true
        this.delPower = node.name === 'admin'
        this.activeUserId = node._id
        this.upPower = mark.index === 0
        this.downPower = mark.index === mark.parent.length - 1
        this.$emit('getUserId', node._id)
      }
    },
    /**
     * 复选框选中状态
     * @method dateCheck
     * @param {Boolean} state 表单ref
     */
    dateCheck(state) {
      if (state) {
        this.addUserForm.date = ''
        this.picker = true
      } else {
        this.picker = false
      }
    },
    /**
     * 打开添加用户模态框
     * @method addUserModal
     */
    addUserModal() {
      if (this.activeOrg._id) {
        this.addUserShow = true
        this.addUserForm.role = this.activeOrg.name
        this.addUserForm.rank = ''
      } else {
        this.warningMsg('请选择添加用户所属的角色')
      }
    },
    /**
     * 取消添加用户
     * @method addUserCancel
     * @param {string} name 表单ref
     */
    addUserCancel(name) {
      this.$refs[name].resetFields()
      this.addUserShow = false
    },
    /**
     * 确认添加用户
     * @method addUserAffirm
     * @param {string} name 表单ref
     */
    addUserAffirm(name) {
      this.$refs[name].validate((valid) => {
        if (valid && (this.picker || this.addUserForm.date)) {
          if (this.addUserForm.rank === '') {
            this.warningMsg('请选择级别')
            return
          }
          if (this.addUserForm.name.length > 64) {
            this.warningMsg('用户名不能超过64个字符')
            return
          }
          const nativecode = this.addUserForm.name.split('')
          let len = 0
          for (let i = 0; i < nativecode.length; i++) {
            let code = Number(nativecode[i].charCodeAt(0))
            if (code > 127) {
              len += 2
            } else {
              len++
            }
          }
          if (len > 64) {
            this.warningMsg('用户名不能超过64个字符')
            return
          }
          let data = {
            name: this.addUserForm.name,
            pwd: this.$CryptoJS.MD5(this.addUserForm.password).toString(),
            realName: this.addUserForm.realName,
            exptime: this.picker ? -1 : moment(this.addUserForm.date).format('X'),
            level: this.addUserForm.rank,
            role: this.activeOrg._id,
            duty: this.addUserForm.duty ? 'yes' : 'no'
          }
          this.addUserManage(data).then(suc => {
            this.getUserTree()
            this.addUserShow = false
          }).catch(err => {
            this.addUserShow = false
            this.warningMsg(err.message)
            console.log(err.message)
          })
          this.$refs[name].resetFields()
        } else {
          this.warningMsg('请完善表单信息')
        }
      })
    },
    /**
     * 删除用户
     * @method delUserModal
     */
    delUserModal() {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>确认删除该用户？</p>',
        onOk: () => {
          this.delUser(this.activeUserId).then(suc => {
            this.getUserTree()
            this.activeUserId = ''
            this.$emit('updateInfoData', true)
          }).catch(err => {
            console.log(err.message)
          })
        }
      })
    },
    /**
     * 获取/更新用户数据
     * @method getUserTree
     */
    getUserTree() {
      this.getUserListTree().then(suc => {
        this.treeData = this.userList
      }).catch(err => {
        console.log(err.message)
      })
    },
    /**
     * 移动节点
     * @method moveNode
     * @param {Number} data 0=>上移 1=>下移
     */
    moveNode(type) {
      let data = {
        activeId: this.activeUserId ? this.activeUserId : this.activeOrg._id,
        replaceId: type === 0 ? this.othersNode.previousNode._id : this.othersNode.nextNode._id,
        type: this.activeUserId ? 'user' : 'role'
      }
      this.moveUserNode(data).then(suc => {
        this.getUserTree()
        this.activeNode = {}
        this.upPower = true
        this.downPower = true
      }).catch(err => {
        console.log(err.message)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.list-main {
  height: 100%;
  .list-top {
    padding: 8px;
    text-align: center;
    .ivu-btn-group {
      width: 100%;
      .ivu-btn {
        padding: 0;
        width: 25%;
        height: 24px;
      }
    }
  }
  .list-btm {
    height: calc(~'100% - 54px');
    .scroll-style {
      width: 100%;
      height: 100%;
      .user-tree{
        width: 100%;
        .user-name {
          float: left;
          width: 160px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .user-state {
          float: right;
          padding-right: 10px;
          i {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 5px;
          }
        }
      }
    }
  }
}
.form-style {
  .input-style {
    width: 240px;
  }
  .check-style {
    margin-left: 10px;
  }
}
</style>
