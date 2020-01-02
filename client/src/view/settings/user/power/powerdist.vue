<template>
  <div class="powerdist">
    <div class='addBgColor'>
      <bs-scroll ref="scroller" class='tree-box'>
        <Tree @on-toggle-expand="treeExpand()" @on-select-change="$refs.scroller.update()" class="sub-sys-manage-tree" ref="tree" :data="actionTree" :render='renderContent'></Tree>
      </bs-scroll>
      <Modal :class="{'no-cancel': modalType === 3}" :mask-closable="false" :loading="loading" v-model="showModal" :title="modalTitel" @on-ok="confirm" @on-cancel="cancel">
        <Form ref="form" :label-width="85" label-position="left" :model="option" :rules="optionRules">
          <FormItem label="名称" prop="name">
            <Input :disabled="inputDis" v-model="option.name"></Input>
          </FormItem>
          <FormItem label="图标" prop="icon">
            <Input :disabled="inputDis" placeholder="请输入iview icon名称" v-model="option.icon"></Input>
          </FormItem>
          <FormItem label="路径" prop="url">
            <Input :disabled="inputDis" v-model="option.url"></Input>
          </FormItem>
          <!-- <FormItem label="类型" prop="type">
            <Input :disabled="inputDis" v-model="option.type"></Input>
          </FormItem> -->
          <FormItem label="标签" prop="tag">
            <Input :disabled="inputDis" v-model="option.tag"></Input>
          </FormItem>
          <FormItem label="模块类型" prop="moduleType">
            <Select :disabled="inputDis" v-model="option.moduleType">
              <Option value="2">系统模块</Option>
              <Option value="1">功能模块</Option>
              <Option value="0">其他模块</Option>
            </Select>
          </FormItem>
          <FormItem label="是后台请求" prop="isapi">
            <Checkbox :disabled="inputDis" v-model="option.isapi"></Checkbox>
          </FormItem>
          <FormItem label="方法" prop="method" v-show="option.isapi">
            <Select :disabled="inputDis" v-model="option.method">
              <Option v-for="method in methods" :value="method" :key="method">{{method}}</Option>
            </Select>
          </FormItem>
        </Form>
      </Modal>
    </div>
  </div>
</template>
<script>
import './powerdist.css'
import { mapState, mapActions } from 'vuex'
import { setTimeout } from 'timers'
export default {
  data() {
    const typeTest = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('模块类型不能为空！'))
      } else {
        callback()
      }
    }
    return {
      loading: true,
      modalType: 0, //  增删改查
      methods: ['POST', 'GET', 'PUT', 'DELETE'],
      option: {
        name: '',
        moduleType: '',
        icon: '',
        url: '',
        method: '',
        tag: '',
        isapi: false
      },
      optionRules: {
        name: [
          { required: true, message: '名称不能为空！', trigger: 'change' }
        ],
        url: [{ required: true, message: '路径不能为空！', trigger: 'change' }],
        tag: [{ required: true, message: '标签不能为空！', trigger: 'change' }],
        moduleType: [{ required: true, validator: typeTest, trigger: 'change' }]
      },
      actionTree: [],
      showModal: false,
      treeTarget: {
        root: null,
        node: null,
        data: null
      },
      buttonProps: {
        type: 'ghost',
        size: 'small'
      }
    }
  },
  created() {
    this.initAction()
  },
  computed: {
    ...mapState({
      powerData: ({ powerDist }) => powerDist.powerData
    }),
    inputDis() {
      return this.modalType === 1 || this.modalType === 3
    },
    modalTitel() {
      switch (this.modalType) {
        case 0:
          return '添加子节点'
        case 1:
          return '删除该节点'
        case 2:
          return '修改该节点'
        case 3:
          return '查看该节点'
      }
    }
  },
  methods: {
    ...mapActions(['addAction', 'delAction', 'modifyAction', 'getAction']),
    renderContent(h, { root, node, data }) {
      return h(
        'span',
        {
          style: {
            display: 'inline-block',
            width: '100%'
          },
          on: {
            click: () => {
              if (data.selected) { return }
              this.$refs.tree.handleSelect(node.nodeKey)
            }
          }
        },
        [
          h('span', [
            h('Icon', {
              props: {
                // type: data.icon
                // type: 'ios-folder-outline'
              },
              style: {
                marginRight: '8px'
              }
            }),
            h(
              'span',
              {
                class: [
                  'ivu-tree-title',
                  {
                    'ivu-tree-title-selected': data.selected
                  }
                ],
                style: {
                  display: 'inline-block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100px',
                  whiteSpace: 'no-wrap'
                },
                attrs: {
                  title: data.name
                  // title: '数据'
                }
                // }, '数据')
              },
              data.name
            )
          ]),
          h(
            'span',
            {
              style: {
                display: 'inline-block',
                float: 'right',
                marginRight: '32px'
              }
            },
            [
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                  icon: 'arrow-up-c'
                  // disabled: !this.ACTIONS['funcManage.up']
                }),
                attrs: {
                  title: '上移'
                },
                style: {
                  marginRight: '8px'
                },
                on: {
                  click: () => this.up(root, node, data)
                }
              }),
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                  icon: 'arrow-down-c'
                  // disabled: !this.ACTIONS['funcManage.down']
                }),
                attrs: {
                  title: '下移'
                },
                style: {
                  marginRight: '8px'
                },
                on: {
                  click: () => this.down(root, node, data)
                }
              }),
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                  icon: 'plus'
                  // disabled: !this.ACTIONS['funcManage.add']
                }),
                attrs: {
                  title: '增加子节点'
                },
                style: {
                  marginRight: '8px'
                },
                on: {
                  click: () => this.nodeClick(0, { root, node, data }, false)
                }
              }),
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                  icon: 'minus',
                  disabled:
                    (data.children && data.children.length > 0) || !data.nodeKey
                  // disabled: !this.ACTIONS['funcManage.del']
                }),
                attrs: {
                  title: '删除该节点'
                },
                style: {
                  marginRight: '8px'
                },
                on: {
                  click: () => this.nodeClick(1, { root, node, data }, true)
                }
              }),
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                  icon: 'edit'
                  // disabled: !this.ACTIONS['funcManage.modify']
                }),
                attrs: {
                  title: '修改该节点'
                },
                style: {
                  marginRight: '8px'
                },
                on: {
                  click: () => this.nodeClick(2, { root, node, data }, true)
                }
              }),
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                  icon: 'information'
                  // disabled: !this.ACTIONS['funcManage.look']
                }),
                attrs: {
                  title: '查看该节点'
                },
                on: {
                  click: () => this.nodeClick(3, { root, node, data }, true)
                }
              })
            ]
          )
        ]
      )
    },
    swapItems(arr, index1, index2) {
      const data1 = arr[index1]
      const data2 = arr[index2]
      // [data1.order, data2.order] = [data2.order, data1.order]
      const order = JSON.parse(JSON.stringify(data1.order))
      data1.order = JSON.parse(JSON.stringify(data2.order))
      data2.order = order
      console.log(data1, data2)
      Promise.all([
        this.modifyAction({ id: data1._id, body: data1 }),
        this.modifyAction({ id: data2._id, body: data2 }),
        this.getAction()
      ])
        .then(([rsp1, rsp2]) => {
          // if (rsp1.data.code !== 4400 || rsp2.data.code !== 4400) return Promise.reject()
          arr[index1] = arr.splice(index2, 1, arr[index1])[0]
          this.successMsg('移动成功')
        })
        .catch(err => {
          console.log('modifyAction error:', err)
          this.errorMsg('移动失败')
        })
    },
    up(root, { parent, nodeKey }, data) {
      const father = root[parent]
      const index = father.children.findIndex(key => key === nodeKey)
      if (index === 0) { return }
      this.swapItems(father.node.children, index, index - 1)
    },
    down(root, { parent, nodeKey }, data) {
      const father = root[parent]
      const index = father.children.findIndex(key => key === nodeKey)
      if (index === father.children.length - 1) { return }
      this.swapItems(father.node.children, index, index + 1)
    },
    setOption() {
      const { name, moduleType, url, method, tag, icon, isapi } = this.treeTarget.data
      this.option = { name, moduleType, url, method, tag, icon, isapi }
    },
    nodeClick(modalType, treeTarget, setOption) {
      this.clearOption()
      this.treeTarget = treeTarget
      this.modalType = modalType
      if (setOption) { this.setOption() }
      this.showModal = true
    },
    confirm() {
      this.loading = true
      switch (this.modalType) {
        case 0:
          this.confirmAdd()
          break
        case 1:
          this.confirmDel()
          break
        case 2:
          this.confirmEdit()
          break
        case 3:
          this.confirmLook()
          break
      }
    },
    cancel() {
      this.clearOption()
    },
    confirmAdd() {
      this.$refs.form
        .validate()
        .then(isok => {
          // console.log(this.treeTarget, this.treeTarget.data)
          if (!isok) { return Promise.reject(new Error('数据校验失败')) }
          // const { id } = this.treeTarget.data
          this.addAction({ pid: this.treeTarget.data._id, ...this.option })
            .then(({ data }) => {
              // if (data.code !== 4000) return Promise.reject(data)
              const children = this.treeTarget.data.children || []
              // order的值换为后端添加
              // const lastChildren = children[children.length - 1]
              children.push({
                ...data
                // order: lastChildren ? lastChildren.order : 0
              })
              this.$set(this.treeTarget.data, 'children', children)
              this.showModal = false
              this.$refs.form.resetFields()
              this.successMsg('添加成功')
            })
            .catch(err => {
              this.loading = false
              console.log('addAction err:', err)
              this.errorMsg('添加失败')
            })
        })
        .catch(err => {
          this.loading = false
          console.log('addAction err:', err)
          this.errorMsg('表单验证失败')
        })
    },
    confirmDel() {
      const { root, node, data } = this.treeTarget
      this.delAction(data._id)
        .then(({ data }) => {
          // if (data.code !== 4300) return Promise.reject(data)
          const parentKey = root.find(el => el === node).parent
          const parent = root.find(el => el.nodeKey === parentKey).node
          const index = parent.children.indexOf(data)
          parent.children.splice(index, 1)
          this.showModal = false
          this.$refs.form.resetFields()
          this.successMsg('删除成功')
        })
        .catch(err => {
          this.loading = false
          console.log('delAction err:', err)
          this.errorMsg('删除失败')
        })
    },
    confirmEdit() {
      this.$refs.form
        .validate()
        .then(isok => {
          if (!isok) { return Promise.reject(new Error('数据校验失败')) }
          const postData = {
            id: this.treeTarget.data._id,
            body: {
              _id: this.treeTarget.data._id,
              pid: this.treeTarget.data.pid,
              ...this.option
            }
          }
          this.modifyAction(postData)
            .then(({ data }) => {
              // if (data.code !== 4400) return Promise.reject(data)
              Object.assign(this.treeTarget.data, this.option)
              this.showModal = false
              this.$refs.form.resetFields()
              this.successMsg('编辑成功')
            })
            .catch(err => {
              this.loading = false
              console.log('modifyAction err:', err)
              this.errorMsg('编辑失败')
            })
        })
        .catch(err => {
          this.loading = false
          console.log('addAction err:', err)
          this.errorMsg('表单验证失败')
        })
    },
    confirmLook() {
      this.showModal = false
    },
    clearOption() {
      this.option = {
        icon: '',
        name: '',
        moduleType: '',
        url: '',
        method: '',
        tag: '',
        isapi: false
      }
    },
    initAction() {
      this.getAction()
        .then(resp => {
          this.actionTree = JSON.parse(JSON.stringify(this.powerData))
        })
        .catch(err => {
          console.log('getAction err: ', err)
          this.errorMsg('获取树失败')
        })
    },
    treeExpand() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.scroller.update()
        }, 500)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.powerdist {
  margin: 10px 0px 0 0px;
  height: 100%;
  padding-bottom: 10px;
  overflow: auto;
  .addBgColor {
    width: 100%;
    height: 100%;
    background-color: #1c3054;
    .tree-box {
      min-width: 800px;
      max-height: 800px;
      .sub-sys-manage-tree {
        width: 35%;
        .ivu-tree-children {
          width: 35%;
          max-height: 800px;
        }
      }
    }
  }
}
</style>
