<template>
  <div class="contactHome">

    <div class="contactHeader">
      <p class="contactText" v-if="contactEdit === 'show'">通讯录</p>
      <p class="contactText" v-if="contactEdit === 'sort'">组排序</p>
      <p class="contactText" v-if="contactEdit === 'addContact'">添加联系人</p>
      <p class="contactText" v-if="contactEdit === 'addGroup'">添加分组</p>
      <span class="sortBtn" style="margin-right:10px;" v-if="contactEdit === 'show'">
        <Button type="primary" size="small" @click="sortGroupStart()">组排序</Button>
      </span>
      <span class="sortIcon" v-if="contactEdit === 'sort'">
        <i class="icon iconfont icon-move-down contactMoveIcon" title="向下移动" @click="moveDown()"></i>
        <i class="icon iconfont icon-move-up contactMoveIcon" title="向上移动" @click="moveUp()"></i>
      </span>
      <!-- <Input v-model="searchVal" size="small" icon="ios-search-strong" v-if="contactEdit === 'show'" search placeholder="请输入..." /> -->
      <Input v-model="searchVal" @on-change="searchAll" search size="small" enter-button placeholder="请输入..." v-if="contactEdit === 'show'" />
      <Button type="primary" icon="ios-search" size="small" v-if="contactEdit === 'show'" @click="searchContact(searchVal)"></Button>
    </div>
    <div class="contactTable tree" v-if="contactEdit === 'show'">
        <el-tree lazy ref="tree" @node-click="handleNodeClick" node-key="id" :default-expanded-keys="expandArr" :expand-on-click-node="false" :node-collapse="nodeCollapse" :props="defaultProps" :load="loadTreeNodes" :data="contactData" :render-content="renderContent" style="background: none"></el-tree>
        <p class="addContacts">添加分组<i class="icon iconfont icon-large" @click="detail('addGroup')"></i></p>
    </div>

    <div class="contactBottom" v-if="contactEdit === 'show'">
      <Checkbox v-model="showContacts" @on-change="showCollectContacts">应用界面仅显示收藏联系人</Checkbox>
      <i :class="['icon', 'iconfont', 'icon-large', !(selectedNode && selectedNode.isGroup) ? 'disabled' :'']"  @click="selectedNode && selectedNode.isGroup ? detail('addContact') : ''"></i>
    </div>

    <!-- 排序列表 -->
    <div class="contactTable" v-if="contactEdit === 'sort'">
      <bs-scroll ref="scroller">
        <ul class="sortList" v-if='contactData.length'>
          <li v-for="(item, index) in contactData" :class="{'active':chooseIndex===index}" @click="chooseOne(index)" :key="index">
            {{item.title}}
          </li>
        </ul>
      </bs-scroll>
    </div>

    <!-- 排序按钮组 -->
    <div class="sortBtn" v-if="contactEdit === 'sort'">
      <Button @click="back()">返回</Button>
      <Button type="primary" @click="saveSortContact()" >保存</Button>
    </div>

    <!-- 添加分组 -->
    <div class="addContact" v-if="contactEdit === 'addGroup'">
      <Form label-position="left" ref="group" :rules="validateRule" :model="group">
        <div class="inputGroup">
          <FormItem label="组名：" prop="addGroupName" class="inputName">
            <Input v-model="group.addGroupName" :rules="validateRule" placeholder="" clearable style="width: 190px" />
          </FormItem>
        </div>
      </Form>
        <div class="btnGroup">
          <Button type="default" ghost @click="back()">取消</Button>
          <Button type="default" ghost @click="addContactGroup(group.addGroupName)">保存</Button>
        </div>
    </div>

    <!-- 添加联系人 -->
    <div class="addContact" v-if="contactEdit === 'addContact'">
      <Form label-position="left" ref="contact" :rules="validateRule" :model="contact" :label-width="65">
        <div class="inputGroup">
          <FormItem label="姓名：" prop="addContactName" class="inputName">
            <Input v-model="contact.addContactName" :rules="validateRule" placeholder="" clearable style="width: 190px" />
          </FormItem>
          <FormItem :label="selectedNode.type === 'other' ? '电话1：' : '电话：'" prop="addContactPhone" class="inputPhone">
            <Input v-model="contact.addContactPhone" :rules="validateRule" placeholder="" style="width: 190px" />
          </FormItem>
          <FormItem label="电话2：" prop="addContactPhone2" class="inputPhone" v-if="selectedNode.type === 'other'">
            <Input v-model="contact.addContactPhone2" :rules="validateRule" placeholder="" style="width: 190px" />
          </FormItem>
          <FormItem label="座机：" prop="addContactTelephone" class="inputPhone" v-if="selectedNode.type === 'other'">
            <Input v-model="contact.addContactTelephone" :rules="validateRule" placeholder="" style="width: 190px" />
          </FormItem>
          <FormItem label="分机：" prop="addContactExtension" class="inputPhone" v-if="selectedNode.type === 'other'">
            <Input v-model="contact.addContactExtension" :rules="validateRule" placeholder="" style="width: 190px" />
          </FormItem>
        </div>
      </Form>
      <div class="btnGroup">
        <Button type="default" ghost @click="back()">取消</Button>
        <Button type="default" ghost @click="addContactOne()">保存</Button>
      </div>
    </div>

    <!-- 弹窗 -->
    <Modal
        :title="this.isGroup ? '编辑组' : '编辑联系人'"
        v-model="showEditModal"
        @on-ok="editContact">
      <Form label-position="left" ref="edit" :rules="validateRule" :model="edit">
        <FormItem label="名称：" prop="editName">
          <Input v-model="edit.editName" :rules="validateRule" clearbale :disabled="edit.type === 'securityPerson'" />
        </FormItem>
        <FormItem v-if="this.type !== 'other' || this.isGroup !== true" :label="this.type === 'other' ? '电话1：' : '电话：'" prop="editPhone">
          <Input v-model="edit.editPhone" :rules="validateRule" clearbale />
        </FormItem>
        <FormItem label="电话2：" prop="editPhone2" v-if="this.type === 'other' && this.isGroup !== true">
          <Input v-model="edit.editPhone2" :rules="validateRule" clearbale />
        </FormItem>
        <FormItem label="座机：" prop="editTelephone" v-if="this.type === 'other' && this.isGroup !== true">
          <Input v-model="edit.editTelephone" :rules="validateRule" clearbale />
        </FormItem>
        <FormItem label="分机：" prop="editExtension" v-if="this.type === 'other' && this.isGroup !== true">
          <Input v-model="edit.editExtension" :rules="validateRule" clearbale />
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="default" ghost @click="showEditModal=false">取消</Button>
        <Button type="default" ghost @click="editContact()">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import _ from 'lodash'

const validateName = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('不可为空!'))
  }
  let strlen = 0
  for (let i = 0; i < value.length; i++) {
    if (value.charCodeAt(i) > 255) {
      // 如果是汉字，则字符串长度加2
      strlen += 2
    } else {
      strlen++
    }
  }
  if (strlen > 16) {
    return callback(new Error('不得超过16个字符'))
  } else {
    return callback()
  }
}

const validateNum = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('不可为空!'))
  }
  let test = /^([0-9]|[-])+$/g.test(value)
  if (!test) {
    return callback(new Error('仅支持输入数字和\'-\''))
  }
  let strlen = 0
  for (let i = 0; i < value.length; i++) {
    if (value.charCodeAt(i) > 255) {
      // 如果是汉字，则字符串长度加2
      strlen += 2
    } else {
      strlen++
    }
  }
  if (strlen > 18) {
    return callback(new Error('不得超过18个字符'))
  } else {
    return callback()
  }
}

const validateNum2 = (rule, value, callback) => {
  if (!value) {
    return callback()
  }
  let test = /^([0-9]|[-])+$/g.test(value)
  if (!test) {
    return callback(new Error('仅支持输入数字和\'-\''))
  }
  let strlen = 0
  for (let i = 0; i < value.length; i++) {
    if (value.charCodeAt(i) > 255) {
      // 如果是汉字，则字符串长度加2
      strlen += 2
    } else {
      strlen++
    }
  }
  if (strlen > 18) {
    return callback(new Error('不得超过18个字符'))
  } else {
    return callback()
  }
}

export default {
  data() {
    return {
      showEditModal: false, // 显示编辑窗口
      searchVal: '', // 搜索
      showContacts: null, // 控制应用中的视图显示
      colorFlag: true, // star 颜色的控制
      contactEdit: 'show', // addContact, addGroup, sort  控制组件展示
      contact: {
        addContactName: '', // 添加联系人姓名
        addContactPhone: null, // 添加联系人电话
        addContactPhone2: null, // 添加联系人姓名
        addContactTelephone: null, // 添加联系人电话
        addContactExtension: null // 添加联系人姓名
      },
      group: {
        addGroupName: '' // 添加组名称
      },
      edit: {
        type: '', // 编辑联系人的类型
        editName: '', // 修改联系人姓名
        editPhone: null, // 修改联系人电话
        editPhone2: null,
        editTelephone: null,
        editExtension: null
      },
      type: '',
      id: '',
      isGroup: null,
      isCollect: null,
      sortContactData: [], // 生成排序用数据
      chooseIndex: 0,
      validateRule: {
        addContactName: [{ required: true, validator: validateName, trigger: 'change' }],
        addContactPhone: [{ required: true, validator: validateNum, trigger: 'change' }],
        addContactPhone2: [{ required: false, validator: validateNum2, trigger: 'change' }],
        addContactTelephone: [{ required: false, validator: validateNum2, trigger: 'change' }],
        addContactExtension: [{ required: false, validator: validateNum2, trigger: 'change' }],
        addGroupName: [{ required: true, validator: validateName, trigger: 'change' }],
        editName: [{ required: true, validator: validateName, trigger: 'change' }],
        editPhone: [{ required: true, validator: validateNum, trigger: 'change' }],
        editPhone2: [{ required: false, validator: validateNum2, trigger: 'change' }],
        editExtension: [{ required: false, validator: validateNum2, trigger: 'change' }],
        editTelephone: [{ required: false, validator: validateNum2, trigger: 'change' }]
      },
      contactList: [], // 获取到的数据
      contactData: [],
      selectedNode: null, // 选中的通讯组
      defaultProps: {
        isLeaf: 'leaf',
        label: 'title'
      },
      expandArr: [],
      expand: false
    }
  },
  methods: {
    ...mapActions(['getAddressbook',
      'getPrincipal',
      'searchAddressbook',
      'addAddressbookGroup',
      'addAddressbookOne',
      'addAddressbookOneForPoint',
      'editAddressbook',
      'collectAddressbook',
      'collectAddressbookGroup',
      'deleteAddressbook',
      'sortAddressbook',
      'deleteAddressbookNewGroup',
      'editAddressbookNewGroup',
      'setEditCollectSetting',
      'getEditCollectSetting']),
    ...mapGetters({
      activeMapConfig: 'activeMapConfig' // 当前地图配置数据
    }),
    // 渲染树状结构
    renderContent(h, { root, node, data }) {
      if (data.type === 'videoPoint') {
        console.log(data)
      }
      return h('span', {
        attrs: {
          class: 'render-class'
        },
        style: {
          display: 'inline-block',
          width: '100%',
          cursor: 'pointer',
          background: 'none'
        }
      }, [
        h('span', {
          attrs: {
            title: data.title
          },
          domProps: {
            innerHTML: data.type === 'other' && !data.isGroup ? `<i class="tree-label">${data.currentType !== 'mobile' ? '' : data.name}</i><i class="tree-value">${data.phone}</i>` : data.title
          },
          style: {
            display: 'inline-block',
            width: '168px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            verticalAlign: 'bottom'
          }
        }),
        h('span', {
          style: {
            display: 'inline-block',
            float: 'right',
            marginRight: '15px'
          }
        }, [
          h('Icon', {
            attrs: {
              title: '删除'
            },
            props: {
              // 新组及普通联系人需要显示的图标功能
              type: data.type === 'other' ? 'trash-a' : data.isGroup ? '' : 'trash-a'
            },
            style: {
              marginRight: '8px',
              color: 'white',
              display: data.type === 'securityPerson' || (data.type === 'other' && !data.isGroup && data.currentType !== 'mobile') ? 'none' : 'unset'
            },
            on: {
              click: (e) => {
                this.$Modal.confirm({
                  title: '警告',
                  content: '<p>确认删除所选联系人吗？</p>',
                  onOk: () => {
                    this.stopProp(e)
                    this.type = data.type
                    this.id = data._id
                    this.isGroup = data.isGroup
                    this.deleteContact()
                  },
                  onCancel: () => {}
                })
              }
            }
          }),
          h('Icon', {
            attrs: {
              title: '编辑'
            },
            props: {
              // 新组及普通联系人需要显示的图标功能
              type: data.type === 'other' ? 'compose' : data.isGroup ? '' : 'compose'
            },
            style: {
              marginRight: '8px',
              color: 'white',
              display: data.type === 'other' && !data.isGroup && data.currentType !== 'mobile' ? 'none' : 'unset'
            },
            on: {
              click: (e) => {
                console.log('编辑通讯录信息：', data)
                this.edit.type = data.type
                this.stopProp(e)
                if (data.type === 'storey') {
                  // 楼层联系人的情况
                  this.edit.editName = data.title.trim().split(' ')[1]
                  this.edit.editPhone = data.title.trim().split(' ')[2]
                } else {
                  // 联系人的情况
                  if (data.type === 'other' && !data.isGroup) {
                    this.edit.editName = data.name
                    this.edit.editPhone = data.mobile
                    this.edit.editPhone2 = data.mobile2
                    this.edit.editTelephone = data.telephone
                    this.edit.editExtension = data.extension
                  } else {
                    this.edit.editName = data.title.trim().split(' ')[0]
                    this.edit.editPhone = data.title.trim().split(' ')[1]
                  }
                }
                this.type = data.type
                this.id = data._id
                this.isGroup = data.isGroup
                this.showEditModal = true
              }
            }
          }),
          h('Icon', {
            attrs: {
              title: '收藏'
            },
            props: {
              // 所有都支持收藏
              type: 'star'
            },
            style: {
              color: data.collect ? 'yellow' : 'white',
              display: data.type === 'other' && !data.isGroup && data.currentType !== 'mobile' ? 'none' : 'unset'
            },
            on: {
              click: (datainfo, e) => {
                this.stopProp(e)
                let theColor = datainfo.path[0].style.color
                this.colorFlag = theColor === 'white'
                this.colorFlag = !this.colorFlag
                datainfo.path[0].style.color = this.colorFlag ? 'white' : 'yellow'
                this.type = data.type
                this.isGroup = data.isGroup
                this.id = data._id
                this.isCollect = !data.collect
                this.collectContact()
              }
            }
          })
        ])
      ])
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
      this.type = data.type
      this.selectedNode = data
      console.log('selected contact group: ', data)
    },
    // 阻止事件冒泡
    stopProp(e) {
      window.event ? window.event.cancelBubble = true : e.stopPropagation()
    },
    // 改变视图
    detail(val) {
      if (val === 'addContact') {
        let {_id, type} = this.selectedNode
        if (type === 'securityPerson') { // 添加单兵联系人时
          this.warningMsg('禁止添加单兵联系人！')
        } else if (type === 'grid' || type === 'building') {
          this.getCurrentData(_id, result => {
            let contacts = result.filter(contact => contact.type === type)
            if (contacts.length >= 3) {
              this.warningMsg((type === 'grid' ? '网格' : '楼宇') + '最多添加三个联系人！')
            } else {
              this.contactEdit = val
            }
          })
        } else {
          this.contactEdit = val
        }
      } else {
        this.contactEdit = val
      }
    },
    // 组排序
    sortGroupStart() {
      this.detail('sort')
    },
    // 排序时的选中
    chooseOne(index) {
      this.chooseIndex = index
    },
    // 排序时的上移
    moveUp() {
      if (this.chooseIndex > 0) {
        let chooseOne = this.contactData.splice(this.chooseIndex, 1)
        this.contactData.splice(this.chooseIndex - 1, 0, chooseOne[0])
        this.chooseIndex -= 1
      }
    },
    // 排序时的下移
    moveDown() {
      if (this.chooseIndex < this.contactData.length - 1) {
        let chooseOne = this.contactData.splice(this.chooseIndex, 1)
        this.contactData.splice(this.chooseIndex + 1, 0, chooseOne[0])
        this.chooseIndex += 1
      }
    },
    // 数据转换
    getTree(type, tree = [], isSearch) {
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
          obj.id = item._id
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
            this.expandArr.push(item._id)
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
      this.searchAddressbook({
        keyword: name,
        mapId: this.activeMap
      }).then(res => {
        this.contactData = this.getTree('group', res.data, true)
        this.expand = true
      }).catch(err => {
        this.errorMsg(err.response.data.message)
      })
    },
    // 搜索全部
    searchAll() {
      if (this.searchVal === '') {
        this.getContactList()
      }
    },
    // 添加新分组
    addContactGroup(groupName) {
      this.$refs.group.validate(val => {
        if (val) {
          this.addAddressbookGroup({
            name: groupName,
            mapId: this.activeMap
          }).then(res => {
            this.successMsg('添加分组成功!')
            this.getContactList()
          }).catch(err => {
            this.errorMsg(err.response.data.message)
          })
        }
      })
    },
    // 添加新联系人
    addContactOne() {
      this.$refs.contact.validate(val => {
        if (val) {
          let param = {
            name: this.contact.addContactName,
            mobile: this.contact.addContactPhone,
            id: this.selectedNode._id
          }
          if (this.selectedNode.type === 'other') {
            param.mobile2 = this.contact.addContactPhone2
            param.telephone = this.contact.addContactTelephone
            param.extension = this.contact.addContactExtension
          }
          this.addAddressbookOne(param).then(res => {
            this.successMsg('添加新联系人成功!')
            this.type = ''
            this.getContactList()
          }).catch(err => {
            if (this.type === '') {
              this.errorMsg('请先选择分组!')
            } else {
              this.errorMsg(err.response.data.message)
            }
          })
        }
      })
    },
    // 编辑联系人 或 编辑新组
    editContact() {
      this.$refs.edit.validate(val => {
        if (val) {
          // 新组的可编辑情况
          if (this.type === 'other' && this.isGroup === true) {
            this.editAddressbookNewGroup({
              name: this.edit.editName,
              id: this.id
            }).then(res => {
              this.successMsg('修改成功!')
              this.type = ''
              this.showEditModal = false
              this.getContactList()
            }).catch(err => {
              this.errorMsg(err.response.data.message)
            })
          } else {
            // 普通的联系人编辑
            let param = {
              name: this.edit.editName,
              mobile: this.edit.editPhone,
              _id: this.id
            }
            if (this.type === 'other') {
              param.mobile2 = this.edit.editPhone2
              param.telephone = this.edit.editTelephone
              param.extension = this.edit.editExtension
            }
            this.editAddressbook(param).then(res => {
              this.successMsg('修改成功!')
              this.type = ''
              this.showEditModal = false
              this.getContactList()
            }).catch(err => {
              this.errorMsg(err.response.data.message)
            })
          }
        }
      })
    },
    // 收藏联系人 或 收藏分组
    collectContact() {
      if (this.isGroup) {
        // 组收藏的情况
        this.collectAddressbookGroup({
          id: this.id,
          collect: this.isCollect
        }).then(res => {
          this.colorFlag ? this.successMsg('操作成功!') : this.successMsg('操作成功!')
          this.type = ''
          this.getContactList()
        }).catch(err => {
          this.errorMsg(err.response.data.message)
        })
      } else {
        // 收藏联系人的情况
        this.collectAddressbook({
          _id: this.id,
          collect: this.isCollect
        }).then(res => {
          this.colorFlag ? this.successMsg('操作成功!') : this.successMsg('操作成功!')
          this.type = ''
          this.getContactList()
        }).catch(err => {
          this.errorMsg(err.response.data.message)
        })
      }
    },
    // 删除联系人 或 删除新分组
    deleteContact() {
      if (this.type === 'securityPerson') { // 单兵联系人不允许删除
        this.warningMsg('禁止删除单兵联系人！')
        return
      }
      // 新组的可删除情况
      if (this.type === 'other' && this.isGroup === true) {
        this.deleteAddressbookNewGroup(this.id).then(res => {
          this.successMsg('删除成功!')
          this.type = ''
          this.getContactList()
        }).catch(err => {
          this.errorMsg(err.response.data.message)
        })
      } else {
        // 普通的联系人删除
        this.deleteAddressbook({
          _id: this.id
        }).then(res => {
          this.successMsg('删除成功!')
          this.type = ''
          this.getContactList()
        }).catch(err => {
          this.errorMsg(err.response.data.message)
        })
      }
    },
    // 保存通讯录排序
    saveSortContact() {
      this.sortContactData = []
      this.contactData.forEach(item => {
        this.sortContactData.push(item._id)
      })
      this.sortAddressbook(this.sortContactData)
        .then(res => {
          this.successMsg('排序成功!')
          this.getContactList()
        }).catch(err => {
          this.errorMsg(err.response.data.message)
        })
    },
    // 应用界面仅显示收藏联系人
    showCollectContacts() {
      this.setEditCollectSetting({
        isShowCollect: this.showContacts
      })
        .then(res => {
          this.successMsg('操作成功!')
        }).catch(err => {
          this.errorMsg(err.response.data.message)
        })
    },
    // 返回首页
    back() {
      this.type = ''
      this.getContactList()
      this.clearForm()
    },
    // 清理表单
    clearForm() {
      this.contact = {}
      this.group = {}
    },
    // 获取通讯录分组列表
    getContactList() {
      this.getAddressbook(this.activeMap)
        .then(res => {
          this.contactList = res.data
          this.contactData = this.getTree('group', this.contactList)
          this.expand = false
          this.clearForm()
        })
      this.detail('show')
    },
    // 获取分组下的联系人
    getCurrentData(_id, resolve) {
      this.getPrincipal({_id: _id, mapId: this.activeMap}).then(res => {
        const result = this.getTree('info', res.data)
        resolve(result)
        console.log(res)
      }).catch(err => {
        resolve([])
        console.log(err)
      })
    }
  },
  computed: {
    ...mapState({
      activeMap: ({ mapIndex }) => mapIndex.activeMapConfig._id // 当前地图id
    })
  },
  watch: {
    activeMap(val) {
      if (val) {
        this.getContactList()
      }
    },
    // 判断是获取联系人或搜索联系人
    expand(val) {
      if (!val) {
        this.expandArr = []
      }
    }
  },
  mounted() {
    // 获取是否选中 应用界面仅显示收藏联系人
    this.getEditCollectSetting()
      .then(res => {
        this.showContacts = res.data.isShowCollect
      })
    // 获取所有分组
    this.activeMap && this.getContactList()
  }
}
</script>

<style>
.contactHome {
  display: flex;
  flex: 1;
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
  margin-right: 20px;
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
  flex: 1;
  padding: 0 10px;
}
.contactTable.tree{
  overflow: scroll;
  overflow-x: hidden;
}
.ivu-tree ul{
  font-size: 13px;
}
.contactTable .icon-large,
.contactBottom .icon-large{
    cursor: pointer;
}
.contactBottom .icon-large.disabled {
  color: #ccc;
  cursor: not-allowed;
}
.contactTable .addContacts .icon{
    font-size: 14px;
    margin-left: 5px;
}
.contactTable .ivu-tree-title-selected,
.contactTable .ivu-tree-title-selected:hover,
.contactTable .ivu-tree-title:hover {
  background-color: #5faaff;
}
.contactTable .sortList li{
  font-size: 14px;
  cursor: pointer;
  padding: 4px 10px;
  margin-top: 2px;
}
.contactTable .sortList li:hover{
  background: #5faaff;
}
.contactTable .sortList .active{
  background: #5faaff;
}
.contactBottom {
  padding:5px 10px;
  background-color: #0f2343;
  display: flex;
  justify-content: space-between;
  height: 30px;
}
.addContact{
  display: flex;
  justify-content: space-between;
  flex: 1;
  flex-direction: column;
}
.addContact .inputName,
.addContact .inputPhone{
  margin: 30px 0;
  padding: 0 20px;
}
.btnGroup{
  padding: 10px 60px;
  display: flex;
  justify-content: space-around;
}
.sortBtn {
  margin: 10px auto;
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
.ivu-tree-children{
  width: 270px;
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
