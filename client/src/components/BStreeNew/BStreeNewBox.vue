<template>
  <div class="BStreeNewBox">
    <el-buttongroup class="btnGroup" v-if="btnGroup">
      <el-button class="btnStyle" @click="throwData(4)" :disabled="moveBtu('add')" title="添加"><i class="iconfont icon-add"></i></el-button>
      <el-button class="btnStyle" @click="throwData(2)" :disabled="moveBtu('eid')" title="编辑"><i class="iconfont icon-edit1"></i></el-button>
      <el-button class="btnStyle" @click="throwData(3)" :disabled="moveBtu('del')" title="删除"><i class="iconfont icon-delete"></i></el-button>
      <el-button class="btnStyle" @click="nodeMove('up')" :disabled="moveBtu('up')" title="上移"><i class="iconfont icon-move-up"></i></el-button>
      <el-button class="btnStyle" @click="nodeMove('down')" :disabled="moveBtu('down')" title="下移"><i class="iconfont icon-move-down"></i></el-button>
      <el-button class="btnStyle" @click="refresh" title="刷新"><i class="iconfont icon-shuaxin"></i></el-button>
    </el-buttongroup>
    <div class="BStreeSearInput" v-if="searchToggle">
      <el-input placeholder="请输入..." v-model="filterText" icon="el-icon-search" size="small" focus></el-input>
      <i class="ivu-icon ivu-icon-ios-search-strong ivu-input-icon ivu-input-icon-normal"></i>
    </div>
    <div class="tree" v-show="treeToggle" :style="heightStyle()">
      <treeLazy ref="treeLazy"  :currentNodeKey="currentNodeKey" :centerVideoIds="centerVideoIds"  :resType="resType" :equType="equType" :orgType="orgType" :iconToggle="iconToggle" :checkBox="checkBox" :resourceToggle="resourceToggle" :btnGroup="btnGroup" :equipmentToggle="equipmentToggle" :mapSpecial="mapSpecial" :newField="newFieldVal" :delIcon="delIcon" @rootId="(val)=>{rootId=val}" @previewData="previewData" @favData="(val)=>{this.$emit('favData',val)}" @previewAllData="(val)=>{this.$emit('previewAllData',val)}" @checksData="checksData" @clickData="clickData" @dbclickData="(val)=>{this.$emit('dbclickData',val)}" @dragData="(val)=>{this.$emit('dragData',val)}" @isActive="(val)=>{isActive=val}" @on-expand="$emit('on-expand')" @refreshSuc="$emit('refreshSuc')" @delData="(val)=>{this.$emit('delData',val)}" :playingIds="playingIds" :iconRight="iconRight" @power="(val)=>{power=val}"></treeLazy>
    </div>
    <div v-if="searchType === 0" v-show="!treeToggle" :style="heightStyle()">
      <treeSear ref="treeSear" :centerVideoIds="centerVideoIds"  :rootId="rootId" :orgType="orgType" :equType="equType" :resType="resType" :iconToggle="iconToggle" :checkBox="checkBox" :equipmentToggle="equipmentToggle" :resourceToggle="resourceToggle" :mapSpecial="mapSpecial" :newField="newFieldVal" :delIcon="delIcon" @clickData="clickData" @dbclickData="(val)=>{this.$emit('dbclickData',val)}" @dragData="(val)=>{this.$emit('dragData',val)}" @previewData="previewData" @favData="(val)=>{this.$emit('favData',val)}" @checksData="(val)=>{this.$emit('checksData',val)}" @delData="(val)=>{this.$emit('delData',val)}" :playingIds="playingIds" :scroll="scroll" :iconRight="iconRight"></treeSear>
    </div>
    <!-- 添加/修改 弹窗 -->
    <slot name='dialog' :orgName="orgName(isActive)" :visible="addVisible" :title="isNew ? '机构添加' : '机构修改'">
      <el-dialog class="dialog" :visible="addVisible" :title="isNew ? '机构添加' : '机构修改'" width="450px" :close-on-click-modal="true" :modal-append-to-body="true" :append-to-body="false" @close="orgCancel">
        <div class="org-modal-form">
          <el-form :model="formData" label-position="left" label-width="100px" ref="orgFormData" :rules="orgFormRole">
            <el-fotmitem label="上级机构">
              <div class="ivu-form-item-content-span">{{orgName(isActive)}}</div>
            </el-fotmitem>
            <el-fotmitem label="机构编号" v-if="isNew" prop="code">
              <el-input v-model="formData.code" placeholder="范围：0-65535" :maxlength="5" size="small"></el-input>
            </el-fotmitem>
            <el-fotmitem label="机构名称" prop="name">
              <el-input v-model="formData.name" :maxlength="64" size="small"></el-input>
            </el-fotmitem>
            <el-fotmitem label="预览路数上限" prop="previewmax">
              <el-input v-model="formData.previewmax" :maxlength="5" placeholder="范围：0-65535" size="small"></el-input>
            </el-fotmitem>
            <el-fotmitem label="回放路数上限" prop="playbackmax">
              <el-input v-model="formData.playbackmax" :maxlength="5" placeholder="范围：0-65535" size="small"></el-input>
            </el-fotmitem>
            <el-fotmitem label="机构联系人" prop="contact">
              <el-input v-model="formData.contact" :maxlength="64" size="small"></el-input>
            </el-fotmitem>
            <el-fotmitem label="联系方式" prop="contactway">
              <el-input v-model="formData.contactway" :maxlength="64" size="small"></el-input>
            </el-fotmitem>
            <el-fotmitem label="备注信息" prop="remark">
              <el-input v-model="formData.remark" type="textarea" :autosize="{minRows: 2,maxRows: 3}" placeholder="请输入..." size="small"></el-input>
            </el-fotmitem>
          </el-form>
        </div>
        <div slot="footer">
          <el-button type="ghost" @click="orgCancel" size="small">取消</el-button>
          <el-button type="primary" @click="orgSave(formData)" :loading="modalloading" size="small">确认</el-button>
        </div>
      </el-dialog>
    </slot>
  </div>

</template>

<script>
import treeLazy from './BStreeNewLazy.vue'
import treeSear from './BStreeNewSear.vue'
export default {
  name: 'BStreeNewBox',
  created() {
    this.refresh = this.$lodash.throttle(this._refresh, 1000)
  },
  components: {
    treeLazy,
    treeSear
  },
  props: {
    resType: {
      // 资源类型
      type: Array,
      default: () => {
        return [0]
      }
    },
    equType: {
      // 设备类型
      type: Array,
      default: () => {
        return [0]
      }
    },
    orgType: {
      // 机构类型
      type: Number,
      default: 0
    },
    iconToggle: {
      // 是否显示图标
      type: Boolean,
      default: true
    },
    iconRight: {
      // 单独显示右侧的小图标
      type: Array,
      default: () => {
        return ['collect', 'preview']
      }
    },
    checkBox: {
      // 是否使用复选框
      type: Boolean,
      default: false
    },
    resourceToggle: {
      // 是否显示资源
      type: Boolean,
      default: false
    },
    equipmentToggle: {
      // 是否显示设备
      type: Boolean,
      default: false
    },
    btnGroup: {
      // 是否使用按钮组
      type: Boolean,
      default: false
    },
    searchToggle: {
      // 是否有搜索
      type: Boolean,
      default: true
    },
    searchType: {
      // 使用什么类型的搜索 0，非懒加载；1，懒加载
      type: Number,
      default: 0
    },
    searchVal: {
      type: String,
      default: ''
    },
    playingIds: {
      // 开流成功的id数组
      type: Array,
      default: () => {
        return []
      }
    },
    scroll: {
      // 是否滚动
      type: Boolean,
      default: true
    },
    mapSpecial: {
      // 地图专用
      type: String,
      default: ''
    },
    newField: {
      // 向后端发送新增查询字段
      type: String,
      default: ''
    },
    delIcon: {
      // 资源删除按钮
      type: Boolean,
      default: false
    },
    centerVideoIds: {
      // 中心录像标识图标
      type: Array,
      default: () => []
    },
    currentNodeKey: {
      // 双向数据绑定（选中特定的节点）
      type: String,
      default: ''
    },
    delFun: {
      // 判断是否可以删除该节点，由外面判断该节点是否可删
      type: Function,
      default: () => {
        return {
          state: true,
          msg: ''
        }
      }
    }
  },
  data() {
    const verifyName = (rule, value, callback) => {
      let nativecode = value.split('')
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
        let nativecode = value.split('')
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
    }
    const verifyPhone = (rule, value, callback) => {
      if (value === '' || value === undefined || value === null) {
        callback()
      }
      let r = /^[0-9]*$/
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
        let nativecode = value.split('')
        let len = 0
        for (let i = 0; i < nativecode.length; i++) {
          let code = Number(nativecode[i].charCodeAt(0))
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
      let r = /(^[1-9]([0-9]*)$|^[0-9]$)/
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
      let r = /(^[1-9]([0-9]*)$|^[0-9]$)/
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
      let r = /\s+/g
      if (r.test(value)) {
        return callback(new Error('不可以输入空格！'))
      } else {
        callback()
      }
    }
    return {
      treeToggle: true, // 当有输入文字时，树隐藏
      filterText: '', // 搜索的数据
      resList: [], // 返回的值
      noData: '', // 没有数据
      rootId: '',
      isActive: {}, // tree组件点击时获得的tree的node信息
      initdata: {}, // tree组件点击时获得的tree的data信息
      addVisible: false, // 添加弹窗显隐
      isNew: true, // 判断弹窗是 添加/修改
      formData: {
        // form表单数据
        code: 0,
        name: '',
        previewmax: 24,
        playbackmax: 24,
        contact: '',
        contactway: '',
        remark: '',
        type: this.orgType,
        pid: ''
      },
      orgFormRole: {
        // 验证规则
        name: [
          { required: true, message: '不可以为空', trigger: 'change' },
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
      modalloading: false, // 模拟加载
      newFieldVal: '', // 为监听加入字段实时改变
      power: '' // 权限
    }
  },
  watch: {
    searchVal(val) {
      // 外部传值搜索
      this.searchTree(val)
    },
    filterText(val) {
      // 内部传值搜索
      this.searchTree(val)
    },
    initdata(val) {
      // console.log('initdata', val)
    },
    isActive(val) {
      // console.log('isActive', val)
    },
    newField: {
      handler(val) {
        this.newFieldVal = val
      },
      immediate: true
    }
  },
  methods: {
    previewData(data, path) {
      this.$emit('previewData', data, path)
    },
    _refresh() {
      // 刷新
      this.$refs.treeLazy.refresh()
      if (this.filterText !== '') {
        this.filterText = ''
      }
    },
    builtInRefreshs() {
      // 内置刷新
      if (this.searchVal === '' && this.filterText === '') {
        // lazytree
        this.$refs.treeLazy.builtInRefreshs()
      } else {
        // search tree
        this.$refs.treeSear._searchRes(this.searchVal || this.filterText)
      }
    },
    searchTree(data) {
      if (data && this.searchType === 0) {
        // 向数据库查询
        this.treeToggle = false
        this.$refs.treeSear.resList = []
        this.$refs.treeSear.isSearching = true
        this.$refs.treeSear.searchRes(data)
      } else if (data && this.searchType === 1) {
        // 在现有的查询(element-ui tree内置方法)
        this.$refs.treeLazy.$refs.treeNewLazy.filter(data)
      } else if (!data) {
        this.treeToggle = true
      }
    },
    orgName(data) {
      // 上级机构名称
      if (this.isNew) {
        return this.initdata.name
      } else {
        if (data.data === undefined) {
          return '无'
        } else {
          if (data.data.isroot) {
            return '无'
          } else {
            return data.parent.label
          }
        }
      }
    },
    clickData(data) {
      this.initdata = data
      this.$emit('clickData', data)
    },
    moveBtu(data) { // 按钮是否禁用(只有机构可以使用，设备、资源皆禁用)
      if (this.isActive.data !== undefined && this.isActive.data.isroot !== undefined) {
        if (data === 'add') {
          if (this.power) { // 有权限
            return !this.power.includes('createOrg')
          }
          return false
        } else if (data === 'up') {
          if (this.isActive.previousSibling !== null && this.isActive.previousSibling !== undefined) {
            if (this.isActive.previousSibling.data.isroot !== undefined) { // 是机构
              return false
            }
          }
        } else if (data === 'down') {
          if (this.isActive.nextSibling !== null && this.isActive.nextSibling !== undefined) {
            if (this.isActive.nextSibling.data.isroot !== undefined) { // 是机构
              return false
            }
          }
        } else if (data === 'del') {
          if (this.power) { // 有权限
            return !(this.power.includes('delOrg') && !this.initdata.isroot)
          }
          return false
        } else if (data === 'eid') {
          if (this.power) { // 有权限
            return !this.power.includes('updateOrg')
          }
          return false
        }
      }
      if (data === 'add') { // 初始化 不点击时
        if (this.power) { // 有权限
          return !this.power.includes('createOrg')
        }
        return false
      } else if (data === 'eid') { // 初始化 不点击时
        if (this.power) { // 有权限
          return !this.power.includes('updateOrg')
        }
        return false
      } else if (data === 'del') { // 初始化 不点击时
        if (this.power) { // 有权限
          return !(this.power.includes('delOrg') && !this.initdata.isroot)
        }
        return false
      }
      return true
    },
    nodeMove(data) {
      // 移动
      let param = {
        url: '/setting/org/' + this.isActive.key + '/updown',
        body: { previd: '' }
      }
      if (data === 'up') {
        param.body.previd = this.isActive.previousSibling.key
      } else if (data === 'down') {
        param.body.previd = this.isActive.nextSibling.key
      } else {
        return
      }
      this.$http
        .put(param.url, param.body)
        .then(() => {
          this.successMsg('移动成功')
          this.nodeMoveFun(data)
        })
        .catch(err => {
          console.log('moveOrgUpDown error: ' + err)
          this.errorMsg(err)
        })
    },
    nodeMoveFun(data) {
      // 封装函数
      let parent = this.isActive.parent
      let children = parent.childNodes
      let index = children.findIndex(d => d.key === this.isActive.key)
      let length = children.length - 1
      if (data === 'up') {
        if ((parent.level === 0 && index > 0) || (parent.level !== 0 && index > 0)) {
          let tmp1 = children[index - 1]
          let tmp2 = children[index]
          this.$set(children, index - 1, tmp2)
          this.$set(children, index, tmp1)
        }
      } else if (data === 'down') {
        if ((parent.level === 0 && index < length) || (parent.level !== 0 && index < length)) {
          let tmp1 = children[index + 1]
          let tmp2 = children[index]
          this.$set(children, index + 1, tmp2)
          this.$set(children, index, tmp1)
        }
      }
      this.$refs.treeLazy.nodeClick(this.initdata, this.isActive)
    },
    getOrgOne() {
      // 请求一个机构的数据
      this.$http
        .get(`/setting/org/${this.initdata._id}?type=${this.orgType}`)
        .then(res => {
          this.formData = res.data
          this.$emit('getOrgData', JSON.parse(JSON.stringify(this.formData)))
        })
        .catch(err => {
          console.log('getOrgOne error: ' + err)
        })
    },
    async throwData(data) {
      // 按钮event
      if (data === 2) { // 编辑
        this.isNew = false
        this.addVisible = true
        this.getOrgOne()
      } else if (data === 3) { // 删除
        // console.log('删除', this.initdata._id)
        let _res = await this.delFun(this.initdata)
        if (typeof _res.state === 'boolean') {
          if (_res.state) {
            this.$Modal.confirm({
              title: '提示',
              content: '<p>确认删除所选机构吗？</p><p style="color: #e62929">删除所选机构会同时删除此机构下所有设备</p>',
              onOk: () => {
                let param = { url: '/setting/org/' + this.initdata._id }
                this.$http
                  .delete(param.url)
                  .then(() => {
                    this.successMsg('删除成功')
                    let arr = []
                    let node = this.isActive.parent
                    for (let i = 1; i < this.isActive.level - 1; i++) {
                      arr.push(node.key)
                      node = node.parent
                    }
                    this.$emit('delData', this.initdata)
                    this.$refs.treeLazy.nodeKeyTmp = arr.reverse()
                    this.$emit('clickData', this.$refs.treeLazy.node.data) // 删除后自动触发点击【根机构】事件
                    this.refresh()
                  })
                  .catch(err => {
                    console.log('delete error: ' + err)
                    this.errorMsg(err)
                  })
              },
              onCancel: () => {}
            })
          } else {
            this.warningMsg(_res.msg || '未知错误，请联系管理员')
          }
        } else {
          this.errorMsg('参数错误，请联系管理员')
        }
      } else if (data === 4) { // 添加
        this.addVisible = true
        this.isNew = true
      }
    },
    orgSave(data) { // 保存验证
      // 确定
      this.$refs.orgFormData.validate(valid => {
        if (valid) {
          this.save(data) // 保存事件
        }
      })
    },
    save(data) { // 保存事件
      data.type = this.orgType
      this.modalloading = true
      let param = {
        url: '/setting/org/',
        body: data
      }
      if (this.isNew) {
        param.body.pid = this.initdata._id
        this.$http
          .post(param.url, param.body)
          .then(res => {
            this.successMsg('添加成功')
            this.addVisible = false
            this.refresh()
            this.modalloading = false
          })
          .catch(err => {
            this.modalloading = false
            console.log('addOrg error: ' + err)
            this.errorMsg(err.response.data.message)
          })
      } else {
        this.$http
          .put(`/setting/org/${this.formData._id}`, param.body)
          .then(() => {
            this.successMsg('修改成功')
            this.addVisible = false
            this.refresh()
            this.modalloading = false
            this.$refs.orgFormData && this.$refs.orgFormData.resetFields()
          })
          .catch(err => {
            this.modalloading = false
            console.log('editOrg error: ' + err)
            this.errorMsg(err)
          })
      }
    },
    orgCancel() {
      // 取消事件
      // 关闭弹窗
      this.addVisible = false
      this.$refs.orgFormData && this.$refs.orgFormData.resetFields()
    },
    heightStyle() {
      let h = 'height: calc(100%'
      if (this.btnGroup) {
        h += ' - 34px'
      }
      if (this.searchToggle) {
        h += ' - 52px'
      }
      h += ');'
      return h
    },
    getCheckedNodes() {
      // 获取【懒加载树】的选中事件
      return this.$refs.treeLazy.$refs.treeNewLazy.getCheckedNodes()
    },
    setCheckedKeys(val) {
      // 设置【懒加载树】的选中事件
      this.$refs.treeLazy.$refs.treeNewLazy.setCheckedKeys(val)
    },
    checksData(val, data, status) {
      let getOneChildNod = new Promise((resolve, reject) => { resolve() })
      let node = this.$refs.treeLazy.$refs.treeNewLazy.getNode(data._id)
      let checkedNodeKey = this.$refs.treeLazy.$refs.treeNewLazy.getCheckedKeys() || []
      if (node.checked) {
        getOneChildNod = new Promise((resolve, reject) => {
          this.$http(`/onetree/getChildNode?oid=${data._id}&resource=true`).then(res => {
            // 递归便利添加数据节点
            let addUpdateKeyChildren = (data) => {
              if (data.children && data.children.length !== 0) {
                this.$refs.treeLazy.$refs.treeNewLazy.updateKeyChildren(data._id, data.children)
                for (const iterator of data.children) {
                  addUpdateKeyChildren(iterator)
                }
              }
            }
            addUpdateKeyChildren({_id: data._id, children: res.data.tree})
            let checkedArr = [...res.data.orgId, ...res.data.resourceId, ...data._id, ...checkedNodeKey]
            this.$refs.treeLazy.$refs.treeNewLazy.setCheckedKeys(checkedArr)
            resolve(res)
          }).catch((err) => {
            reject(err)
          })
        })
      } else {
        // 取消勾选需要将该节点下所有的都取消勾选
        let checkedStatus = (node) => {
          node.checked = false
          if (node.childNodes.length !== 0) {
            for (const iterator of node.childNodes) {
              checkedStatus(iterator)
            }
          }
        }
        checkedStatus(node)
      }

      this.$emit('checksData', val, data, status, getOneChildNod, node.checked)
    }
  }
}
</script>

<style scoped>
/*这里的样式引用校园平台的资源client\src\assets\fonts */
@import '../../assets/fonts/iconfont.css';
.BStreeNewBox {
  height: 100%;
  position: relative;
}
.BStreeNewBox .btnGroup {
  width: 100%;
  padding: 10px;
  padding-bottom: 0;
}
.BStreeNewBox .btnGroup .btnStyle {
  /* 按钮样式*/
  background-color: rgb(60, 80, 115);
  border-color: rgb(86, 118, 169);
  border-width: 1px;
  border-style: solid;
  color: #fff;
  padding: 0;
  margin: 0;
  width: 16.6666666%;
  height: 24px;
}
.BStreeNewBox .btnGroup .btnStyle .iconfont {
  font-size: 14px;
}
.BStreeNewBox .btnGroup .btnStyle:hover {
  /* 按钮样式*/
  background: #4699f9;
}
.BStreeNewBox .btnGroup .btnStyle[disabled],
.BStreeNewBox .btnGroup .btnStyle[disabled]:hover {
  /* 禁用按钮样式*/
  background: #535777;
  color: #cacaca;
}
.BStreeNewBox .BStreeSearInput {
  width: 100%;
  padding: 10px;
  position: relative;
}
.BStreeNewBox .BStreeSearInput .el-input:hover {
  border-color: #6badfa;
}
.BStreeNewBox .BStreeSearInput .el-input >>> .el-input__inner {
  padding-right: 32px;
}
.BStreeNewBox .BStreeSearInput .ivu-icon {
  /* 搜索栏的图标 */
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
}
.BStreeNewBox .tree {
  padding: 0px;
  height: 100%;
  margin-right: 6px;
}
.BStreeNewBox >>> .el-dialog {
  background-color: #1b3153;
  border-radius: 8px;
}
.BStreeNewBox .dialog >>> .el-form-item .el-textarea__inner {
  background-color: #1b3153;
  border-color: #5676a9;
}
.BStreeNewBox .dialog >>> .el-form-item .el-form-item__label,
.BStreeNewBox .dialog >>> .el-form-item .el-form-item__content {
  font-size: 12px;
  color: #fff;
}
.BStreeNewBox .dialog >>> .el-dialog__header {
  background-color: #0f2343;
  border-radius: 8px 8px 0 0;
}
.BStreeNewBox .dialog >>> .el-dialog__header > .el-dialog__title {
  display: inline-block;
  width: 100%;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #fff;
}
.BStreeNewBox .dialog .org-modal-form {
  padding: 0 10px;
}
.BStreeNewBox .dialog >>> .el-dialog__body {
  padding-bottom: 5px;
}
</style>
