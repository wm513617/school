<template>
  <div class="org-actions-box">
    <div class="box-btn" v-if="$BShasPower('BS-SETTING-VEHICLE-ORG')">
      <Button-group>
        <Button icon="plus" @click="addModal" title="添加"></Button>
        <Button icon="edit" @click="editModal" title="编辑"></Button>
        <Button icon="trash-a" @click="deleteModel" title="删除" :disabled="isRootOrg"></Button>
        <Button icon="arrow-up-c" @click="moveModal('up')" title="上移" :disabled="isTopOrg || isRootOrg"></Button>
        <Button icon="arrow-down-c" @click="moveModal('down')" title="下移" :disabled="isBottomOrg || isRootOrg"></Button>
        <!-- <Button @click="moveModal('left')" title="升级" :disabled="isRootOrg || isHighOrg"><i class="icon iconfont icon-upper-level"></i></Button> -->
        <!-- <Button @click="moveModal('right')" title="降级" :disabled="isRootOrg || isTopOrg"><i class="icon iconfont icon-nextlower"></i></Button> -->
        <Button icon="refresh" @click="orgRefreshRoot" title="刷新"></Button>
      </Button-group>
    </div>
    <div class="input" style="width:100%;padding:10px;">
      <Input v-model="searchVal" icon="ios-search-strong" placeholder="请输入..."></Input>
    </div>
    <div class="box-tree">
      <bs-scroll ref="scroller">
        <VTree @on-expand="$refs.scroller.update()" ref='tree' :treeData="organTreeData" :options="options" @node-click="handleNode" :activeId="activeId" :searchVal="searchVal"></VTree>
      </bs-scroll>
    </div>
    <!--添加弹出框-->
    <div v-if="hasAddModel">
      <Modal v-model="hasAddModel" :mask-closable="false" title="添加机构" :width="450">
        <Form ref="addValidate" :model="organAddItem" :rules="organRuleValidate" :label-width="100" label-position="left" style="padding:0 10px">
          <Form-item label="父机构" prop="father">
            <Input v-model="organAddItem.father" disabled></Input>
          </Form-item>
          <Form-item label="机构名称" prop="name">
            <Input v-model.trim="organAddItem.name"></Input>
          </Form-item>
          <Form-item label="机构编号" prop="code">
            <Input v-model.trim="organAddItem.code"></Input>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="ghost" @click="cancel('hasAddModel')">取消</Button>
          <Button type="primary" @click="handleSubmit('addValidate')">确认</Button>
        </div>
      </Modal>
    </div>
    <!--修改弹出框-->
    <div v-if="hasEditModel">
      <Modal v-model="hasEditModel" :mask-closable="false" title="修改机构" :width="450">
        <Form ref="editValidate" :model="organEditItem" :rules="organRuleValidate" :label-width="100" label-position="left" style="padding:0 10px">
          <Form-item label="机构名称" prop="name">
            <Input v-model.trim="organEditItem.name"></Input>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="ghost" @click="cancel('hasEditModel')">取消</Button>
          <Button type="primary" @click="handleSubmit('editValidate')">确认</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState({
      organTreeData: state => state.vehicle.organTreeData
    }),
    ...mapGetters(['tipWarningConfig', 'tipErrorConfig'])
  },
  created() {
    this.getOrganTree().then(() => {
      this.TREE_ACTIVE_ID(this.organTreeData[0]._id)
      this.activeId = this.organTreeData[0]._id
      this.activeName = this.organTreeData[0].name
      this.isRootOrg = true
      if (this.$route.path === '/settings/vehicle/org') {
        this.$emit('orgActive')
      }
    })
  },
  watch: {},
  data() {
    const validateStr = (rule, value, callback) => {
      if (value) {
        // Unicode编码
        let strlen = 0
        for (let i = 0; i < value.length; i++) {
          if (value.charCodeAt(i) > 255) {
            // 如果是汉字，则字符串长度加2
            strlen += 2
          } else {
            strlen++
          }
        }
        if (strlen > 64) {
          return callback(new Error('不能超过64位字符'))
        } else {
          return callback()
        }
      } else {
        return callback(new Error('不能为空'))
      }
    }
    return {
      addTitle: '',
      hasAddModel: false,
      hasEditModel: false,
      organAddItem: {
        father: '',
        name: '',
        code: ''
      },
      organEditItem: {},
      organRuleValidate: {
        name: [{ required: true, validator: validateStr, trigger: 'change' }],
        code: [
          {
            required: true,
            validator: this.$bsValidate.validateStr,
            trigger: 'change'
          }
        ]
      },
      options: {},
      activeId: '',
      searchVal: '',
      isRootOrg: true,
      isTopOrg: false,
      isBottomOrg: false,
      isHighOrg: false,
      isLowOrg: false
    }
  },
  methods: {
    ...mapMutations(['TREE_ACTIVE_ID']),
    ...mapActions([
      'getOrganTree',
      'organAdd',
      'organEdit',
      'organDelete',
      'organUpDown',
      'organLeftRight',
      'getCrossList',
      'getCrossList'
    ]),
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (name === 'editValidate') {
            this.organEdit(this.organEditItem.name)
              .then(() => {
                this.$Notice.success({ title: '修改机构成功' })
                this.activeName = this.organEditItem.name
                this.hasEditModel = false
                this.getOrganTree()
                this.$refs[name].resetFields()
              })
              .catch(err => {
                if (this.tipErrorConfig.show) {
                  this.$Notice.error({
                    title: err,
                    duration: this.tipErrorConfig.dur
                  })
                }
                console.log('organEdit error: ' + err)
              })
          } else {
            this.organAdd({
              name: this.organAddItem.name,
              code: this.organAddItem.code
            })
              .then(() => {
                this.$Notice.success({ title: '添加机构成功' })
                this.getOrganTree()
                this.hasAddModel = false
                this.$refs[name].resetFields()
              })
              .catch(err => {
                if (this.tipErrorConfig.show) {
                  this.$Notice.error({
                    title: err,
                    duration: this.tipErrorConfig.dur
                  })
                }
                console.log('organAdd error: ' + err)
              })
          }
        }
      })
    },
    cancel(has) {
      has === 'hasEditModel' ? (this.hasEditModel = false) : (this.hasAddModel = false)
      this.organAddItem = {
        father: '',
        name: '',
        code: ''
      }
    },
    handleNode(node, obj) {
      this.isRootOrg = node.isroot
      this.activeId = node._id
      this.TREE_ACTIVE_ID(node._id)
      this.activeName = node.name
      if (obj.previousNode) {
        this.previousId = obj.previousNode._id
        this.isTopOrg = false
      } else {
        this.previousId = ''
        this.isTopOrg = true
      }
      if (obj.nextNode && obj.nextNode._id) {
        this.nextId = obj.nextNode._id
        this.isBottomOrg = false
      } else {
        this.nextId = ''
        this.isBottomOrg = true
      }
      if (obj.parent) {
        this.pidPid = obj.parent.pid
        this.isHighOrg = obj.parent.isroot
      } else {
        this.pidPid = ''
        this.isHighOrg = true
      }
      this.$emit('orgActive')
    },
    addModal() {
      this.hasAddModel = true
      this.organAddItem.father = this.activeName
    },
    editModal() {
      this.hasEditModel = true
      this.organEditItem.name = this.activeName
    },
    deleteModel() {
      const _this = this
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除所选机构吗？</p><p style="color: red">删除所选机构会同时删除此机构下所有设备</p>',
        onOk: function() {
          _this
            .organDelete()
            .then(() => {
              _this.$Notice.success({ title: '删除机构成功' })
              _this.orgRefreshRoot()
            })
            .catch(err => {
              if (_this.tipErrorConfig.show) {
                _this.$Notice.error({
                  title: err,
                  duration: _this.tipErrorConfig.dur
                })
              }
              console.log('organDelete error: ' + err)
            })
        }
      })
    },
    moveModal(dire) {
      const _this = this
      if (dire === 'up') {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确认上移所选机构吗？</p>',
          onOk: () => {
            _this
              .organUpDown(_this.previousId)
              .then(() => {
                _this.$Notice.success({ title: '上移机构成功' })
                _this.orgRefreshRoot()
              })
              .catch(err => {
                if (_this.tipErrorConfig.show) {
                  _this.$Notice.error({
                    title: err,
                    duration: _this.tipErrorConfig.dur
                  })
                }
                console.log('organUpDown error: ' + err)
              })
          }
        })
      }
      if (dire === 'down') {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确认下移所选机构吗？</p>',
          onOk: () => {
            _this
              .organUpDown(_this.nextId)
              .then(() => {
                _this.$Notice.success({ title: '下移机构成功' })
                _this.orgRefreshRoot()
              })
              .catch(err => {
                if (_this.tipErrorConfig.show) {
                  _this.$Notice.error({
                    title: err,
                    duration: _this.tipErrorConfig.dur
                  })
                }
                console.log('organUpDown error: ' + err)
              })
          }
        })
      }
      if (dire === 'left') {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确认升级所选机构吗？</p>',
          onOk: () => {
            _this
              .organLeftRight({
                id: _this.pidPid,
                isLeft: true
              })
              .then(() => {
                _this.$Notice.success({ title: '升级机构成功' })
                _this.orgRefreshRoot()
              })
              .catch(err => {
                if (_this.tipErrorConfig.show) {
                  _this.$Notice.error({
                    title: err,
                    duration: _this.tipErrorConfig.dur
                  })
                }
                console.log('organLeftRight error: ' + err)
              })
          }
        })
      }
      if (dire === 'right') {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确认降级所选机构吗？</p>',
          onOk: () => {
            _this
              .organLeftRight({
                id: _this.previousId,
                isLeft: false
              })
              .then(() => {
                _this.$Notice.success({ title: '降级机构成功' })
                _this.orgRefreshRoot()
              })
              .catch(err => {
                if (_this.tipErrorConfig.show) {
                  _this.$Notice.error({
                    title: err,
                    duration: _this.tipErrorConfig.dur
                  })
                }
                console.log('organLeftRight error: ' + err)
              })
          }
        })
      }
    },
    orgRefreshRoot() {
      this.getOrganTree()
        .then(() => {
          this.TREE_ACTIVE_ID(this.organTreeData[0]._id)
          this.activeId = this.organTreeData[0]._id
          this.activeName = this.organTreeData[0].name
          this.isRootOrg = true
          this.$emit('orgActive')
        })
        .catch(err => {
          console.log('getOrgTree error: ' + err)
        })
    }
  }
}
</script>
<style scoped>
.org-actions-box .box-btn {
  width: 100%;
  padding: 0 4px 0 10px;
}
.org-actions-box .box-btn .ivu-btn-group {
  width: 100%;
}
.org-actions-box .box-btn .ivu-btn-group .ivu-btn {
  padding: 0;
  width: 16.6666666%;
  height: 24px;
}
.org-actions-box .box-tree {
  font-size: 12px;
  width: 100%;
  height: 485px;
}
</style>
