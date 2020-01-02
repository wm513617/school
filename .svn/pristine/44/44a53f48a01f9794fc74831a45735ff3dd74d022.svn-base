<template>
  <div class="org-actions-box" :class="{orgHeight: !isShowTitle}">
    <a class="box-title" v-if="isShowTitle" @click="$emit('clickTitle')">{{orgTitle}}</a>
    <div class="box-btn" v-if="isSetting && isHandle">
      <Button-group>
        <Button icon="plus" @click="openAddModal('add')" title="添加"></Button>
        <Button icon="edit" @click="openAddModal('edit')" title="编辑"></Button>
        <Button icon="trash-a" @click="createOrgDelModel" title="删除" :disabled="isRootOrg"></Button>
        <!-- <Button icon="arrow-up-c" @click="openMoveModal('up')" title="上移" :disabled=" !couldSortOrg || isTopOrg || isRootOrg"></Button> -->
        <!-- <Button icon="arrow-down-c" @click="openMoveModal('down')" title="下移" :disabled=" !couldSortOrg || isBottomOrg || isRootOrg"></Button> -->
        <!-- <Button @click="openMoveModal('left')" title="升级" :disabled="!couldSortOrg || isHighOrg || isRootOrg"><i class="icon iconfont icon-upper-level"></i></Button> -->
        <!-- <Button @click="openMoveModal('right')" title="降级" :disabled="!couldSortOrg || isRootOrg || isTopOrg"><i class="icon iconfont icon-nextlower"></i></Button> -->
        <Button icon="refresh" @click="refresh" title="刷新"></Button>
      </Button-group>
    </div>
    <div class="input" style="width:100%;padding:10px;">
      <Input v-model="searchVal" icon="ios-search-strong" placeholder="请输入..."></Input>
    </div>
    <div class="box-tree" style="padding:0px;height:calc(100% - 122px)">
      <bs-scroll ref="scroller">
        <v-tree ref='tree' style="height:100%;" :treeData="treeData" :options="options" @node-click="handleNode" :activeId="activeId" :searchVal="searchVal" @on-expand="$refs.scroller.update()"></v-tree>
      </bs-scroll>
    </div>
    <Modal :mask-closable="false" v-model="orgAddModal" :title="isNew ? '机构添加' : '机构修改' " width="450">
      <div class="org-modal-form">
        <Form :model="orgFormData" label-position="left" :label-width="100" ref="orgFormData" :rules="orgFormRole">
          <Form-item label="上级机构">
            <div class="ivu-form-item-content-span">{{ upOrgName }}</div>
          </Form-item>
          <Form-item label="机构编号" v-if="isNew" prop="code">
            <Input v-model="orgFormData.code" placeholder="范围：0-65535" :maxlength="5"></Input>
          </Form-item>
          <Form-item label="机构名称" prop="name">
            <Input v-model="orgFormData.name" :maxlength="64"></Input>
          </Form-item>
          <!-- <Form-item label="流媒体服务器">
                <Select placeholder="请选择服务器">
                  <Option value="beijing">192.168.12.5</Option>
                  <Option value="shanghai">UDP</Option>
                  <Option value="shenzhen">192.122.5.5</Option>
                </Select>
              </Form-item> -->
          <Form-item label="预览路数上限" prop="previewmax">
            <Input v-model="orgFormData.previewmax" :maxlength="5" placeholder="范围：0-65535"></Input>
          </Form-item>
          <Form-item label="回放路数上限" prop="playbackmax">
            <Input v-model="orgFormData.playbackmax" :maxlength="5" placeholder="范围：0-65535"></Input>
          </Form-item>
          <Form-item label="机构联系人" prop="contact">
            <Input v-model="orgFormData.contact" :maxlength="64"></Input>
          </Form-item>
          <Form-item label="联系方式" prop="contactway">
            <Input v-model="orgFormData.contactway" :maxlength="64"></Input>
          </Form-item>
          <Form-item label="备注信息" prop="remark">
            <Input v-model="orgFormData.remark" type="textarea" :autosize="{minRows: 2,maxRows: 3}" placeholder="请输入..."></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button type="ghost" @click="orgCancel">取消</Button>
        <Button type="primary" @click="orgSave" :loading="modalloading">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
// import dotProp from 'dot-prop'
export default {
  name: 'BSorgTree',
  components: {},
  props: {
    orgType: {
      type: Number,
      default: 0
    },
    isRoot: {
      type: Boolean
    },
    orgTitle: {
      type: String
    },
    isHandle: {
      type: Boolean,
      default: true
    },
    isShowTitle: {
      type: Boolean,
      default: true
    },
    isSetting: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const verifyName = (rule, value, callback) => {
      const nativecode = value.split('')
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
        return callback(new Error('不能超过64位字符'))
      } else {
        callback()
      }
    }
    const verifyCon = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback()
      } else {
        const nativecode = value.split('')
        let len = 0
        for (let i = 0; i < nativecode.length; i++) {
          const code = Number(nativecode[i].charCodeAt(0))
          if (code > 127) {
            len += 2
          } else {
            len++
          }
        }
        if (len > 64) {
          return callback(new Error('不能超过64位字符'))
        } else {
          callback()
        }
      }
    }
    const verifyPhone = (rule, value, callback) => {
      if (value === '' || value === undefined || value === null) {
        callback()
      }
      const r = /^[0-9]*$/
      if (r.test(value)) {
        if (value.length > 64) {
          return callback(new Error('联系方式过长'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('请输入有效数字'))
      }
    }
    const verifyRemark = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback()
      } else {
        const nativecode = value.split('')
        let len = 0
        for (let i = 0; i < nativecode.length; i++) {
          const code = Number(nativecode[i].charCodeAt(0))
          if (code > 127) {
            len += 2
          } else {
            len++
          }
        }
        if (len > 512) {
          return callback(new Error('不能超过512位字符'))
        } else {
          callback()
        }
      }
    }
    const waysMax = (rule, value, callback) => {
      if (value === '' || value === undefined || value === null) {
        callback()
      }
      const r = /(^[1-9]([0-9]*)$|^[0-9]$)/
      if (r.test(value)) {
        if (Number(value) > 65535) {
          return callback(new Error('超过最大值'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('请输入有效数字'))
      }
    }
    const verifyNumber = (rule, value, callback) => {
      const r = /(^[1-9]([0-9]*)$|^[0-9]$)/
      if (value === '') {
        return callback(new Error('不可以为空'))
      }
      if (r.test(value)) {
        if (Number(value) > 65535) {
          return callback(new Error('超过最大值'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('请输入有效数字'))
      }
    }
    const noSpace = (rule, value, callback) => {
      const r = /\s+/g
      if (r.test(value)) {
        return callback(new Error('不可以输入空格！'))
      } else {
        callback()
      }
    }
    return {
      options: {
        showFolder: true
      },
      orgAddModal: false,
      modalLoading: false,
      activeId: '',
      previousId: '',
      nextId: '',
      parentId: '',
      grandpaId: '',
      direction: '',
      searchVal: '',
      treeData: [],
      upOrgName: '',
      isNew: false,
      orgFormData: {
        code: 0,
        name: '',
        previewmax: 24,
        playbackmax: 24,
        contact: '',
        contactway: '',
        remark: ''
      },
      isTopOrg: false,
      isBottomOrg: false,
      isHighOrg: false,
      isLowOrg: false,
      modalloading: false,
      orgFormRole: {
        name: [
          { required: true, message: '机构名称不能为空', trigger: 'change' },
          { validator: noSpace, trigger: 'change' },
          { validator: verifyName, trigger: 'change' }
        ],
        code: [{ required: true, validator: verifyNumber, trigger: 'change' }],
        previewmax: [{ validator: waysMax, trigger: 'change' }],
        playbackmax: [{ validator: waysMax, trigger: 'change' }],
        contact: [{ validator: verifyCon, trigger: 'change' }],
        contactway: [{ validator: verifyPhone, trigger: 'change' }],
        remark: [{ validator: verifyRemark, trigger: 'change' }]
      },
      true: true
    }
  },
  computed: {
    ...mapState({
      orgTreeData: ({ orgSetting }) => orgSetting.orgTreeData,
      isRootOrg: ({ orgSetting }) => orgSetting.isRootOrg
    }),
    ...mapGetters(['sysConfrole'])
  },
  created() {
    this.getOrgAll()
  },
  methods: {
    ...mapActions([
      'getOrgTree',
      'getOrgInfo',
      'setOrgActiveId',
      'setOrgActiveName',
      'addOrg',
      'editOrg',
      'moveOrgUpDown',
      'moveOrgLeftRight',
      'deleteOrg',
      'getOrgInfoById',
      'setIsRootOrg'
    ]),
    getOrgAll() {
      this.getOrgTree(this.orgType)
        .then(() => {
          this.treeData = JSON.parse(JSON.stringify(this.orgTreeData))
          this.activeId = this.treeData[0]._id
          this.setOrgActiveId(this.treeData[0]._id)
          this.setOrgActiveName(this.treeData[0].name)
          this.setIsRootOrg(true)
          if (this.$route.path === '/settings/face/faceServer') {
          } else {
            this.$emit('call')
          }
        })
        .catch(err => {
          console.log('getOrgTree error: ' + err)
        })
    },
    handleNode(node, mark) {
      this.activeId = node._id
      this.setOrgActiveId(node._id)
      this.setOrgActiveName(node.name)
      this.setIsRootOrg(node.isroot)
      // node.isroot && (this.isRoot = true)
      // this.previousId = mark.previousNode._id
      // this.nextId = mark.nextNode._id      console.log(mark)
      // this.parentId = node.pid
      if (mark.previousNode) {
        this.previousId = mark.previousNode._id
        this.isTopOrg = false
      } else {
        this.previousId = ''
        this.isTopOrg = true
      }
      if (mark.nextNode && mark.nextNode._id) {
        this.nextId = mark.nextNode._id
        this.isBottomOrg = false
      } else {
        this.nextId = ''
        this.isBottomOrg = true
      }
      if (mark.parent) {
        this.grandpaId = mark.parent.pid
        this.isHighOrg = mark.parent.isroot
      } else {
        this.grandpaId = ''
        this.isHighOrg = true
      }
      // if (node.children) {
      //   this.isLowOrg = false
      // } else {
      //   this.isLowOrg = true
      // }
      this.$emit('call')
      this.$emit('shareServer', node)
      // console.log('node')
      // console.log(node)
      // console.log('mark')
      // console.log(mark)
      // console.log('isTopOrg ' + this.isTopOrg)
      // console.log('isLowOrg ' + this.isLowOrg)
      // console.log('isBottomOrg ' + this.isBottomOrg)
      // console.log('isHighOrg ' + this.isHighOrg)
      // console.log('isRootOrg ' + this.isRootOrg)
    },
    openAddModal(way) {
      this.$refs.orgFormData.resetFields()
      this.getOrgInfo(this.orgType)
        .then(suc => {
          const orgInfo = suc
          if (orgInfo.isroot) {
            if (way === 'add') {
              this.upOrgName = orgInfo.name
              // const codeRandom = parseInt(Math.random() * 655)
              this.isNew = true
              this.orgFormData = {
                code: '',
                pid: this.activeId,
                type: this.orgType,
                previewmax: 24,
                playbackmax: 24,
                contact: '',
                contactway: '',
                remark: ''
              }
            } else {
              this.upOrgName = '无'
              this.isNew = false
              this.orgFormData = orgInfo
            }
            this.orgAddModal = true
          } else {
            this.getOrgInfoById({
              id: orgInfo.pid,
              type: this.orgType
            })
              .then(suc => {
                if (way === 'add') {
                  this.upOrgName = orgInfo.name
                  // const codeRandom = parseInt(Math.random() * 655)
                  this.isNew = true
                  this.orgFormData = {
                    code: '',
                    pid: this.activeId,
                    type: this.orgType,
                    previewmax: 24,
                    playbackmax: 24,
                    contact: '',
                    contactway: '',
                    remark: ''
                  }
                } else {
                  this.upOrgName = suc.name
                  this.isNew = false
                  this.orgFormData = orgInfo
                }
                this.orgAddModal = true
              })
              .catch(err => {
                console.log('getOrgInfoById error: ' + err)
              })
          }
        })
        .catch(err => {
          console.log('getOrgInfo error: ' + err)
        })
    },
    orgSave() {
      this.$refs.orgFormData.validate(valid => {
        if (valid) {
          this.modalloading = true
          if (this.isNew) {
            this.addOrg(this.orgFormData)
              .then(() => {
                this.$Notice.success({
                  title: '提示',
                  desc: '添加机构成功',
                  duration: 1
                })
                this.orgAddModal = false
                this.orgRefresh()
                this.modalloading = false
              })
              .catch(err => {
                this.modalloading = false
                console.log('addOrg error: ' + err)
                this.$Notice.error({
                  title: '提示',
                  desc: err,
                  duration: 1
                })
              })
          } else {
            this.editOrg(this.orgFormData)
              .then(() => {
                this.$Notice.success({
                  title: '提示',
                  desc: '修改成功',
                  duration: 1
                })
                this.orgRefresh()
                this.orgAddModal = false
                this.modalloading = false
              })
              .catch(err => {
                this.modalloading = false
                console.log('editOrg error: ' + err)
                this.$Notice.error({
                  title: '提示',
                  desc: err,
                  duration: 1
                })
              })
          }
        }
      })
    },
    orgCancel() {
      this.orgAddModal = false
      this.$refs.orgFormData.resetFields()
    },
    createOrgDelModel() {
      this.$Modal.confirm({
        title: '提示',
        content:
          '<p>确认删除所选机构吗？</p><p style="color: red">删除所选机构会同时删除此机构下所有设备</p>',
        onOk: () => {
          this.orgDelete()
        },
        onCancel: () => { }
      })
    },
    orgDelete() {
      // this.modalLoading = true
      this.deleteOrg()
        .then(res => {
          this.$Notice.success({
            title: '提示',
            desc: '删除成功',
            duration: 1
          })
          this.orgRefresh()
          this.getOrgAll()
        })
        .catch(err => {
          console.log('deleteOrg error: ' + err)
          this.$Notice.error({
            title: '提示',
            desc: err,
            duration: 1.5
          })
        })
    },
    openMoveModal(dir) {
      // this.createOrgMoveModel()
      this.direction = dir
      this.orgMove()
    },
    createOrgMoveModel() {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认移动所选机构吗？</p>',
        onOk: () => {
          this.orgMove()
        },
        onCancel: () => { }
      })
    },
    orgMove() {
      if (this.direction === 'up') {
        this.moveOrgUpDown(this.previousId)
          .then(() => {
            this.$Notice.success({
              title: '提示',
              desc: '移动成功',
              duration: 1
            })
            this.orgRefreshRoot()
          })
          .catch(err => {
            console.log('moveOrgUpDown error: ' + err)
            this.$Notice.error({
              title: '提示',
              desc: err,
              duration: 1
            })
          })
      }
      if (this.direction === 'down') {
        this.moveOrgUpDown(this.nextId)
          .then(() => {
            this.$Notice.success({
              title: '提示',
              desc: '移动成功',
              duration: 1
            })
            this.orgRefreshRoot()
          })
          .catch(err => {
            console.log('moveOrgUpDown error: ' + err)
            this.$Notice.error({
              title: '提示',
              desc: err,
              duration: 1
            })
          })
      }
      if (this.direction === 'left') {
        this.moveOrgLeftRight({
          id: this.grandpaId,
          isLeft: true
        })
          .then(() => {
            this.$Notice.success({
              title: '提示',
              desc: '移动成功',
              duration: 1
            })
            this.orgRefreshRoot()
          })
          .catch(err => {
            console.log('moveOrgLeftRight error: ' + err)
            this.$Notice.error({
              title: '提示',
              desc: err,
              duration: 1
            })
          })
      }
      if (this.direction === 'right') {
        this.moveOrgLeftRight({
          id: this.previousId,
          isLeft: false
        })
          .then(() => {
            this.$Notice.success({
              title: '提示',
              desc: '移动成功',
              duration: 1
            })
            this.orgRefreshRoot()
          })
          .catch(err => {
            console.log('moveOrgLeftRight error: ' + err)
            this.$Notice.error({
              title: '提示',
              desc: err,
              duration: 1
            })
          })
      }
    },
    orgRefresh() {
      this.getOrgTree(this.orgType)
        .then(() => {
          this.treeData = JSON.parse(JSON.stringify(this.orgTreeData))
        })
        .catch(err => {
          console.log('getOrgTree error: ' + err)
        })
    },
    orgRefreshRoot() {
      this.getOrgTree(this.orgType)
        .then(() => {
          this.refreshThen()
        })
        .catch(err => {
          console.log('getOrgTree error: ' + err)
        })
    },
    refresh() {
      this.getOrgTree(this.orgType)
        .then(() => {
          this.refreshThen()
          this.successMsg('刷新成功')
        })
        .catch(err => {
          console.log('getOrgTree error: ' + err)
        })
    },
    refreshThen() {
      this.treeData = JSON.parse(JSON.stringify(this.orgTreeData))
      this.activeId = this.treeData[0]._id
      this.setOrgActiveId(this.treeData[0]._id)
      this.setOrgActiveName(this.treeData[0].name)
      this.setIsRootOrg(true)
      this.$emit('call')
    }
  },
  beforeDestroy() {
    this.treeData = null
  }
}
</script>
<style scoped>
.ivu-form-item-content-span{
  overflow: hidden;
  text-overflow: ellipsis;
}
.org-actions-box {
  width: 100%;
  box-sizing: border-box;
  height: 100%;
}
.org-actions-box .box-title {
  display: inline-block;
  /* padding-left: 20px; */
  text-align: center;
  font-size: 14px;
  color: #fff;
  background-color: #0f2243;
  height: 38px;
  line-height: 38px;
  width: 272px;
}
.org-actions-box .box-btn {
  padding-left: 10px;
  padding-right: 6px;
  margin-top: 10px;
}
.org-actions-box .box-btn .ivu-btn-group {
  width: 100%;
}
.org-actions-box .box-btn .ivu-btn-group .ivu-btn {
  padding: 0;
  width: 25%;
  height: 24px;
}
.org-actions-box .box-tree {
  font-size: 12px;
  width: 100%;
}
.org-modal-form {
  padding: 0 10px;
}
.iconfont {
  font-size: 14px;
}
</style>
