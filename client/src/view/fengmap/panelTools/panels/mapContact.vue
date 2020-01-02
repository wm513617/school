<template>
    <div class="contactHome" style="height:100%">
      <div class="contactHeader">
        <p class="contactText">通讯录</p>
        <Input v-model="searchVal" @on-change="searchAll" search size="small" enter-button placeholder="请输入..." />
        <Button type="primary" icon="ios-search" size="small" @click="searchContact(searchVal)"></Button>
      </div>
      <div class="contactTable tree">
        <div class="contactCollect" v-show="isShowCollectList && (!isShowCollect && !!contactCollectData.length || isShowCollect)">
          <p class="typeTitle">收藏夹</p>
          <el-tree lazy ref="collectTree" @node-click="handleNodeClick" node-key="id" :default-expanded-keys="expandArr" :expand-on-click-node="false" :node-collapse="nodeCollapse" :props="defaultProps" :load="loadTreeNodes" :data="contactCollectData" :render-content="renderContent" style="background: none"></el-tree>
          <!-- <Tree ref="collectTree" :data="contactCollectData" :render="renderContent"></Tree> -->
        </div>
        <div class="contact" v-if="!isShowCollect">
          <el-tree lazy ref="tree" @node-click="handleNodeClick" node-key="id" :default-expanded-keys="expandArr" :expand-on-click-node="false" :node-collapse="nodeCollapse" :props="defaultProps" :load="loadTreeNodes" :data="contactData" :render-content="renderContent" style="background: none"></el-tree>
        </div>
      </div>
      <div class="contactFooter" :class="validateLabel ? 'contactTelephone' : ''">
        <Select v-model="telephonePrefix" style="width: 90px; text-align: left; height: 24px;">
          <Option v-for="item in telephoneOptions" :value="item.value" :key="item.value" style="text-align: left; padding: 7px;">{{ item.label }}</Option>
        </Select>
        <Input v-model="customTelephone" @on-change="telephoneValueValidate" @on-blur="validateLabel = ''" size="small" placeholder="请输入电话号码" style="width: 130px; margin-right: 5px;" @keyup.enter.native="dailTelephone()" />
        <Icon :title="isCall && customTelephone && selectedMobile === customTelephone ? '挂断电话' : '拨打电话'" class="icon iconfont" :class="isCall && customTelephone && selectedMobile === customTelephone ? 'icon-guaduan customGuaduan' : ((!customTelephone || selectedId || isCall) ? 'icon-dianhua customForbid' : 'icon-dianhua customDianhua')" size="small" @click="dailTelephone"></Icon>
        <div style="position: absolute; left: 100px; top: -18px;color: #ed3f14;" v-if="validateLabel">{{ validateLabel }}</div>
      </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import seatListFun from '../seatModel/seatListFun'
import _ from 'lodash'
export default {
  data() {
    return {
      searchVal: '', // 搜索关键词
      isShowCollectList: true, // 是否只显示收藏列表flag
      contactList: [], // 获取到的全部联系人数据
      contactData: [], // 处理后的全部联系人数据
      collectContactList: [], // 获取到的收藏列表数据
      contactCollectData: [], // 处理后的收藏列表数据
      isShowCollect: null, // 决定搜索全部联系人列表还是收藏联系人列表
      selectedId: '', // 当前选中的联系人id
      customTelephone: '', // 自定义电话
      validateLabel: '', // 校验提示语
      lastSelected: {
        node: '',
        nodeKey: ''
      },
      defaultProps: {
        isLeaf: 'leaf',
        label: 'title'
      },
      expandArr: [],
      expand: false,
      telephonePrefix: 'telephone',
      telephoneOptions: [
        {
          value: 'telephone',
          label: '手机/座机'
        },
        {
          value: 'extension',
          label: '分机'
        }
      ]
    }
  },
  mixins: [seatListFun],
  methods: {
    ...mapActions([
      'getPrincipal',
      'getAddressbook',
      'getCollectAddressbook',
      'searchAddressbook',
      'getEditCollectSetting',
      'searchCollectAddressbook'
    ]),
    renderContent(h, { root, node, data }) {
      let self = this
      return h(
        'span',
        {
          attrs: {
            class: 'render-class'
          },
          style: {
            display: 'inline-block',
            width: '100%',
            cursor: 'pointer'
          }
        },
        [
          h('span', {
            attrs: {
              title: data.title
            },
            domProps: {
              innerHTML: data.type === 'other' && !data.isGroup ? `<i class="tree-label">${data.currentType !== 'mobile' ? '' : data.name}</i><i class="tree-value">${data.phone}</i>` : data.title
            },
            style: {
              display: 'inline-block',
              width: '170px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              verticalAlign: 'bottom'
            }
          }),
          h(
            'span',
            {
              style: {
                display: 'inline-block',
                float: 'right',
                marginRight: '15px',
                cursor: self.isCall && data.id !== self.selectedId ? 'not-allowed' : 'pointer'
              }
            },
            [
              h('Icon', {
                attrs: {
                  title: self.isCall && data.id === self.selectedId ? '挂断电话' : '拨打电话',
                  id: data._id
                },
                class: self.isCall && data.id === self.selectedId ? 'icon iconfont icon-guaduan' : 'icon iconfont icon-dianhua',
                style: {
                  color: self.isCall && data.id === self.selectedId ? 'red' : 'white',
                  fontSize: '12px',
                  display: data.isGroup || !data.mobile ? 'none' : 'block',
                  lineHeight: '20px'
                },
                on: {
                  click: (datainfo, e) => {
                    if (self.isCall && data.id !== self.selectedId) {
                      return
                    }
                    if (self.isCall) {
                      self.selectedId = ''
                    } else {
                      self.selectedId = data.id
                    }
                    const obj = {
                      currentTarget: {
                        id: data.type === 'other' ? data[data.currentType] : data.mobile,
                        seatPrefix: data.currentType
                      }
                    }
                    self.eventOperation(obj)
                  }
                }
              })
            ]
          )
        ]
      )
    },
    // 懒加载数据
    loadTreeNodes(node, resolve) {
      if (this.expand) {
        const nodes = []
        node.childNodes.forEach(item => {
          nodes.push(item.data)
        })
        return resolve(nodes)
      }
      if (node.level >= 1) {
        if (node.hasPrincipal) {
          resolve([])
        } else {
          this.getCurrentData(node.data._id, resolve)
        }
      }
    },
    // 关闭树状结构
    nodeCollapse(data) {
      const index = this.expanded.indexOf(data._id)
      index > -1 && this.expanded.splice(index, 1)
    },
    // 点击节点事件
    handleNodeClick(data) {
      const treeRef = data.treeRef === 'tree' ? 'collectTree' : 'tree'
      this.$refs[treeRef].getCurrentKey() && this.$refs[treeRef].setCurrentKey(null)
    },
    // 数据转换
    getTree(type, tree = [], treeRef, isSearch) {
      let arr = []
      if (!!tree && tree.length !== 0) {
        tree.forEach(item => {
          let obj = {}
          obj.title = item.name
          if (item.type === 'storey') {
            obj.title = item.storeyId.name
            item.name && (obj.title += (' ' + item.name))
          }
          item.mobile && (obj.title += (' ' + item.mobile))
          obj.isGroup = type === 'group' // 可以自行添加属性
          obj.type = item.type
          obj._id = item._id
          obj.id = item._id + treeRef
          obj.treeRef = treeRef
          obj.expanded = true
          obj.collect = item.collect
          obj.mobile = item.mobile
          obj.name = item.name
          obj.loading = false
          if (isSearch) {
            if (item.type === 'building' && item.storeys && item.storeys.length) {
              item.storeys.forEach(sto => {
                let obj = sto.principal
                obj.type = 'storey'
                obj.storeyId = {name: sto.name}
                item.principals.push(obj)
              })
            }
            item.principals.forEach(pri => {
              pri.type !== 'storey' && (pri.type = item.type)
            })
            obj.children = this.getTree('info', item.principals) // 递归调用
            this.expandArr.push(obj.id)
          }
          obj.leaf = isSearch ? false : !item.hasPrincipal
          item.type === 'building' && !obj.isGroup ? arr.unshift(obj) : arr.push(obj)
          if (obj.type === 'other' && !obj.isGroup) {
            obj.currentType = 'mobile'
            obj.mobile2 = item.mobile2
            obj.telephone = item.telephone
            obj.extension = item.extension
            obj.phone = item.mobile
            obj.id += 'mobile'
            if (item.mobile2) {
              let obj1 = _.cloneDeep(obj)
              obj1.title = item.name + ' ' + item.mobile2
              obj1.phone = item.mobile2
              obj1.currentType = 'mobile2'
              obj1.id += 'mobile2'
              arr.push(obj1)
            }
            if (item.telephone) {
              let obj2 = _.cloneDeep(obj)
              obj2.title = item.name + ' ' + item.telephone
              obj2.phone = item.telephone
              obj2.currentType = 'telephone'
              obj2.id += 'telephone'
              arr.push(obj2)
            }
            if (item.extension) {
              let obj3 = _.cloneDeep(obj)
              obj3.title = item.name + ' ' + item.extension
              obj3.phone = item.extension
              obj3.currentType = 'extension'
              obj3.id += 'extension'
              arr.push(obj3)
            }
          }
        })
      }
      return arr
    },
    // 搜索联系人
    searchContact(name) {
      if (this.isShowCollect) {
        this.searchCollectAddressbook({
          keyword: name,
          mapId: this.activeMap
        })
          .then(res => {
            this.isShowCollectList = true
            this.contactCollectData = this.getTree('info', res.data, 'collectTree')
            this.expand = true
            console.log(this.contactCollectData)
          }).catch(err => {
            this.errorMsg(err.response.data.message)
          })
      } else {
        this.searchAddressbook({
          keyword: name,
          mapId: this.activeMap
        })
          .then(res => {
            this.isShowCollectList = false
            this.contactData = this.getTree('group', res.data, 'tree', true)
            this.expand = true
          }).catch(err => {
            this.errorMsg(err.response.data.message)
          })
      }
    },
    // 搜索全部
    searchAll() {
      if (this.searchVal === '') {
        this.isShowCollectList = true
        this.getCollectContactList()
        this.getContactList()
      }
    },
    // 获取已收藏通讯录列表
    getCollectContactList() {
      this.getCollectAddressbook(this.activeMap)
        .then(res => {
          this.collectContactList = res.data
          console.log(this.collectContactList)
          this.contactCollectData = this.getTree('info', this.collectContactList, 'collectTree')
          this.expand = false
          console.log(this.contactCollectData)
        })
    },
    // 获取通讯录列表
    getContactList() {
      this.getAddressbook(this.activeMap)
        .then(res => {
          this.contactList = res.data
          console.log(this.contactList)
          this.contactData = this.getTree('group', this.contactList, 'tree')
          this.expand = false
          console.log(this.contactData)
        })
    },
    // 获取分组下的联系人
    getCurrentData(_id, resolve) {
      this.getPrincipal({_id: _id, mapId: this.activeMap}).then(res => {
        const result = this.getTree('info', res.data, 'tree')
        resolve(result)
        console.log(res)
      }).catch(err => {
        resolve([])
        console.log(err)
      })
    },
    // 自定义电话外呼
    dailTelephone() {
      if (this.customTelephone && (!this.isCall || (this.isCall && this.selectedMobile === this.customTelephone))) {
        this.telephoneValueValidate()
        if (!this.validateLabel) {
          const obj = {
            currentTarget: {
              id: this.customTelephone,
              seatPrefix: this.telephonePrefix || 'telephone'
            }
          }
          this.eventOperation(obj)
          this.selectedId = ''
        }
      }
    },
    // 自定义电话校验
    telephoneValueValidate() {
      const length = 18
      if (this.customTelephone.split('').length > length) {
        this.validateLabel = `不能超过${length}个字符`
      } else if (!/^[0-9]*$/.test(this.customTelephone)) {
        this.validateLabel = '请输入正确的数字'
      } else {
        this.validateLabel = ''
      }
    }
  },
  computed: {
    ...mapState({
      activeMap: ({ mapIndex }) => mapIndex.activeMapConfig._id, // 当前地图id
      selectedMobile: ({ phone }) => phone.selectedMobile
    })
  },
  watch: {
    activeMap(val) {
      if (val) {
        this.getContactList()
        this.getCollectContactList()
      }
    },
    selectedMobile(val) {
      console.log('selectedMobile --- ' + val)
      if (!val) { this.selectedId = '' }
    },
    // 判断是获取联系人或搜索联系人
    expand(val) {
      if (!val) {
        this.expandArr = []
      }
    }
  },
  mounted() {
    this.getEditCollectSetting()
      .then(res => {
        this.isShowCollect = res.data.isShowCollect
      })
    if (this.activeMap) {
      this.getContactList()
      this.getCollectContactList()
    }
  }
}
</script>

<style>
.contactHome {
  display: flex;
  height: 100%;
  flex-direction: column;
  user-select: none;
  -webkit-user-select: none;
}
.contactHome .contactHeader {
  height: 40px;
  width: 100%;
  line-height: 40px;
  clear: both;
  background-color: #0f2343;
  cursor: default;
  padding: 0 10px;
}
.contactHome .contactHeader .contactText {
  font-size: 14px;
  margin-right: 68px;
  display: inline-block;
}

.contactHome .contactHeader .contactMoveIcon {
  font-size: 15px;
  margin: 0 5px;
  cursor: pointer;
}
.contactHome .contactHeader .contactMoveIcon:hover {
  color: #20adff;
}

.contactHome .ivu-input-wrapper {
  margin-left: 10px;
  width: 40%;
}
.contactHeader .ivu-input-wrapper-small .ivu-input-icon {
  line-height: 27px;
}
.contactTable {
  height: 100%;
  padding: 10px;
  background-color: #1c3054;
}
.contactTable .contactCollect{
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(58, 90, 139, 0.4);
}
.contactTable .typeTitle{
  font-size: 14px;
}
.contactTable.tree {
  overflow-y: scroll;
  overflow-x: hidden;
}
.contactFooter {
  height: 36px;
  padding: 4px 5px 4px 0;
  text-align: right;
  position: relative;
}
.customGuaduan {
  color: red;
  cursor: pointer;
}
.customDianhua {
  cursor: pointer;
  color: #fff;
}
.customForbid {
  cursor: not-allowed;
  color: #878282;
}
.ivu-tree{
  margin: 10px 0;
}
.ivu-tree ul {
  font-size: 13px;
}
.contactTable .icon-large,
.contactBottom .icon-large {
  cursor: pointer;
}
.contactTable .addContacts .icon {
  font-size: 14px;
  margin-left: 5px;
}
.contactTable .ivu-tree-title-selected,
.contactTable .ivu-tree-title-selected:hover,
.contactTable .ivu-tree-title:hover {
  background-color: #5faaff;
}
.contactTable .sortList li {
  font-size: 14px;
  cursor: pointer;
  padding: 4px 10px;
  margin-top: 2px;
}
.contactTable .sortList li:hover {
  background: #5faaff;
}
.contactTable .sortList .active {
  background: #5faaff;
}
.contactBottom {
  padding: 5px 10px;
  background-color: #0f2343;
  display: flex;
  justify-content: space-between;
  height: 30px;
}
.addContact {
  display: flex;
  justify-content: space-between;
  flex: 1;
  flex-direction: column;
}
.addContact .inputName,
.addContact .inputPhone {
  margin: 30px 0;
  padding: 0 20px;
}
/*定义滚动条高宽及背景*/
.contactTable.tree::-webkit-scrollbar
{
    width: 5px;  /*滚动条宽度*/
    height: 10px;  /*滚动条高度*/
    background-color:  #14284b;
}

/*定义滑块 内阴影+圆角*/
.contactTable.tree::-webkit-scrollbar-thumb
{
    box-shadow:0px 1px 3px rgba(0,0,0,0.3) inset;
    border-radius: 10px;
    background-color: #657ca8;
}
.tree-label {
  display: inline-block;
  width: 70px;
  vertical-align: middle;
  font-style: normal;
}
.tree-value {
  display: inline-block;
  vertical-align: middle;
  font-style: normal;
}
.el-tree-node:focus .el-tree-node__content {
  background: none !important;
}
.el-tree-node:hover .el-tree-node__content {
  background: none !important;
}
.contactTable .el-tree__empty-block .el-tree__empty-text {
  color: #fff;
}
.contactTable .render-class {
  color: #fff;
}
.contactTable .is-current>.el-tree-node__content .render-class {
  color: #2d8cf0 !important;
}
.contactTable .is-expanded .is-current .render-class {
  color: #2d8cf0 !important;
}
</style>

<style lang="less">
.contactTelephone .ivu-input {
  border: 1px solid #ed3f14;
}
.contactFooter .ivu-select-single .ivu-select-selection {
  height: 24px;
}
.contactFooter .ivu-select-single .ivu-select-selection .ivu-select-placeholder,.contactFooter .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
  height: 22px;
  line-height: 22px;
}
</style>
