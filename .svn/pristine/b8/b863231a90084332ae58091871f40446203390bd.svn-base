<template>
  <div class="BStree">
    <!-- 懒加载树 -->
    <el-tree style="height:100%;" :highlight-current="true" :current-node-key="currentNodeKey" ref="treeNewLazy" :props="defaultProps" :load="loadNode" lazy :default-expanded-keys="nodeKey" @node-click="nodeClick" :show-checkbox="checkBox" :node-key="id" draggable :allow-drag="()=>{return true}" :allow-drop="()=>{return false}" @check="handleCheckChange" @node-drag-start="handleDragStart" :filter-node-method="filterNode" :indent="10" @node-expand="expand" @node-collapse="collapse">
      <span class="BStreeNew" @dblclick="() => dblclick(node, data)" :class="resourceStyle(data)" slot-scope="{ node, data }">
        <span class="streeIcon leftIcon">
          <i class="iconfont" :class="[getNodeIcon(data).class]" :title="getNodeIcon(data).title" :style="(mapSpecial==='2D'&&data.point)||(mapSpecial==='3D'&&data.point3D)?'color:#25790f;':''"></i>
        </span>
        <span class="treeText" :title="setNodeTitle(data)">{{ node.label }}</span>
        <!-- 子级右侧图标 -->
        <span class="streeIcon rightIcon center-video" v-if="iconToggle&&node.isLeaf&&centerVideoIds.includes(data._id)">
          <i class="iconfont icon-zhongxinluxiang" title="中心录像" ></i>
        </span>
        <span class="streeIcon rightIcon" v-if="iconToggle&&node.isLeaf">
          <i class="iconfont icon-bukong" v-if="iconRight.includes('preview')" title="开启预览" @click="throwData(0, node, data)"></i>
          <i class="iconfont icon-collection" v-if="iconRight.includes('collect')" title="收藏" @click="throwData(1, node, data)"></i>
        </span>
        <span class="streeIcon rightIcon" v-if="!iconToggle&&delIcon&&node.isLeaf&&(mapSpecial==='2D'&&data.point)||(mapSpecial==='3D'&&data.point3D)">
          <i class="iconfont icon-delete" title="删除" @click.stop="throwData(2, node, data)"></i>
        </span>
        <!-- 父级右侧图标 -->
        <span class="streeIcon rightIcon" v-if="iconToggle&&!node.isLeaf" v-show="node.childNodes.length">
          <i class="iconfont icon-preview-all" style="z-index:1;" title="开启全部预览" @click.stop="AllPreviewClick(node, data)"></i>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import { getNodeIcon } from './commonMethods.js'
/**
 * props 配置选项
 * label 指定节点标签为节点对象的某个属性值 string, function(data, node)
 * children 指定子树为节点对象的某个属性值 string
 * disabled 指定节点选择框是否禁用为节点对象的某个属性值 boolean, function(data, node)
 * isLeaf 指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效 boolean, function(data, node)
 *******
 * highlight-current 是否高亮当前选中节点
 * load 加载子树数据的方法，仅当 lazy 属性为true 时生效 function(node, resolve)
 * default-expanded-keys 默认展开的节点的 key 的数组 array
 * lazy 是否懒加载子节点，需与 load 方法结合使用 blooean
 * node-key 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的 String
 * node-click 节点被点击时的回调 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。
 * show-checkbox 节点是否可被选择 boolean
 * check 当复选框被点击的时候触发 共两个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性
 * draggable 是否开启拖拽节点功能
 * allow-drag 判断节点能否被拖拽
 * allow-drop 拖拽时判定目标节点能否被放置。type 参数有三种情况：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
 * node-drag-end 拖拽结束时（可能未成功）触发的事件 共四个参数，依次为：被拖拽节点对应的 Node、结束拖拽时最后进入的节点（可能为空）、被拖拽节点的放置位置（before、after、inner）、event
 * filter-node-method 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏 Function(value, data, node)
 * indent 相邻级节点间的水平缩进，单位为像素
 */
export default {
  name: 'BStreeNewLazy',
  props: {
    orgType: {
      // 组织类别：0：视频设备 1：报警主机 2：门禁设备 3：ip对讲 4：巡更设备 5：解码器
      type: Number,
      default: 0
    },
    equType: {
      type: Array,
      default: () => {
        return [0]
      }
    },
    resType: {
      // 0：视频通道 1：视频报警输入 2：视频报警输出通道 3：对讲通道 4：门禁通道 5：解码通道 6：音频通道 7：解码报警输入 8：解码报警输出 9：报警主机报警输入 10：报警主机报警输出 11：消防输入防区 12：消防输出防区 ,15 拼接输入通道
      type: Array,
      default: () => {
        return [0]
      }
    },
    resourceToggle: {
      // 是否显示资源，true-显示；false-不显示
      type: Boolean,
      default: false
    },
    equipmentToggle: {
      type: Boolean,
      default: false
    },
    checkBox: {
      // 是否显示复选框
      type: Boolean,
      default: false
    },
    btnGroup: {
      // 是否显示增删改按钮组
      type: Boolean,
      default: false
    },
    iconToggle: {
      // 是否显示数上的图标
      type: Boolean,
      default: false
    },
    iconRight: {
      // 单独显示右侧的小图标
      type: Array,
      default: () => {
        return ['collect', 'preview']
      }
    },
    playingIds: {
      // 开流成功的id数组
      type: Array,
      default: () => {
        return []
      }
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
      // 当前选中的节点
      type: String,
      default: ''
    }
  },
  data() {
    return {
      id: '_id',
      defaultProps: {
        // 机构树节点基本配置
        // 配置选项
        children: 'chlidren', // 指定子树为节点对象的某个属性值  类型：string, function(data, node)
        label: 'name', // 指定节点标签为节点对象的某个属性值   类型：string, function(data, node)
        // isLeaf: 'leaf' // 指定节点是否为叶子节点   类型：boolean, function(data, node)
        isLeaf: data => {
          if (data.tierType === 'res') {
            return true
          } else {
            return false
          }
          // if (data.tierType === 'org') {
          //   return false
          // } else if (data.tierType === 'equ') {
          //   if (this.resourceToggle) {
          //     return false
          //   } else {
          //     return true
          //   }
          // } else {
          //   return true
          // }
        }
      },
      initdata: [], // 返回的数据
      nodeKey: [], // 默认展开的节点的 key 的数组
      nodeKeyTmp: [], // 暂存的所选的节点的父级节点的 key
      isActive: {}, // 点中的节点
      node: {}, // 第一次请求的node数据
      resolve: '', // resolve方法
      resolves: {}, // 保存各节点的resolve方法，为【内置刷新】使用
      isFirst: true, // 保存根节点的node数据和resolve方法的开关
      refreshNotice: false, // 提示刷新成功
      newFieldVal: '' // 为监听加入字段实时改变
    }
  },
  watch: {
    checkBox() {
      this.id = ''
      setTimeout(() => {
        this.id = '_id'
      })
    },
    isActive(val) {
      this.$emit('isActive', val)
    },
    initdata(val) {
      this.$emit('clickData', val)
    },
    newField: {
      handler(val) {
        this.newFieldVal = val
        this.refresh()
      },
      immediate: true
    }
  },
  methods: {
    // 节点展开/闭合时
    collapse(dta, node, val) {
      this.$emit('on-expand')
    },
    expand(dta, node, val) {
      this.$emit('on-expand')
    },
    // 图标
    getNodeIcon(item) {
      return getNodeIcon(item)
    },
    // 过滤鼠标浮现名称
    setNodeTitle(data) {
      return data.tierType === 'res' ? (data.eid.ip ? `${data.name}\nIP:${data.eid.ip}` : data.name) : data.name
    },
    // 资源样式
    resourceStyle(data) {
      if (data.tierType === 'res') {
        // 资源
        if (!this.playingIds.length) {
          if (!this.equipmentToggle && this.resourceToggle) {
            // 机构-资源树
            if (data.eid.deviceStatus) {
              // 启用
              if (data.eid.status) {
                return 'online'
              } // 在线
              return 'outline' // 离线
            } else if (!data.eid.deviceStatus && data.eid.deviceStatus !== undefined) {
              return 'off' // 停用
            }
          } else if (this.equipmentToggle && this.resourceToggle) {
            // 机构-设备-资源树
            if (data.eid.status) {
              return 'online'
            } // 在线
            return 'outline' // 离线
          }
        } else {
          if (this.playingIds.includes(data._id)) {
            return 'playing'
          }
          if (!this.equipmentToggle && this.resourceToggle) {
            // 机构-资源树
            if (data.eid.deviceStatus) {
              // 启用
              if (data.eid.status) {
                return 'online'
              } // 在线
              return 'outline' // 离线
            } else if (!data.eid.deviceStatus && data.eid.deviceStatus !== undefined) {
              return 'off' // 停用
            }
          } else if (this.equipmentToggle && this.resourceToggle) {
            // 机构-设备-资源树
            if (data.eid.status) {
              return 'online'
            } // 在线
            return 'outline' // 离线
          }
        }
      }
    },
    // 刷新(手动)
    refresh() {
      this.refreshNotice = true
      this.node.childNodes = []
      this.isActive = {}
      this.loadNode(this.node, this.resolve)
    },
    // 刷新(内置)
    builtInRefreshs() {
      if (this.isActive && this.isActive.parent && this.isActive.key) {
        this.loadNode(this.isActive.parent, this.resolves[this.isActive.parent.key])
      }
    },
    // 加载子树数据的方法
    loadNode(node, resolve) {
      if (node !== undefined && node.level === 0) {
        this.node = node
        this.resolve = resolve
      }
      if (node.key !== undefined) {
        this.resolves[node.key] = resolve
      }
      this.$emit('rootId', node.key)

      let url = `/onetree?`
      if (node.level === 0) {
        url += `orgtype=${this.orgType}`
        this.$http
          .get(url)
          .then(res => {
            // let oid = res.data[0]._id
            this.nodeKey = [res.data[0]._id]
            this.getPower(res.data[0]._id)
            this.initdata = JSON.parse(JSON.stringify(res.data[0]))
            this.isFirst = false
            // 在这开始加载整棵树将数据塞入懒加载树中
            // this.$http(`/onetree/getChildNode?oid=${oid}&resource=${this.resourceToggle}&equipment=${this.equipmentToggle}&restype=${this.resType.join(',')}&equtype=${this.equType.join(',')}`).then(res => {
            //   // 递归便利添加数据节点
            //   let node = this.$refs.treeNewLazy.getNode(oid)
            //   let addUpdateKeyChildren = (data, node) => {
            //     if (data.children && data.children.length !== 0) {
            //       // 设置已加载状态
            //       node.loaded = true
            //       this.$refs.treeNewLazy.updateKeyChildren(data._id, data.children)
            //       let lengthIndex = data.children.length - 1
            //       for (let index = lengthIndex; index >= 0; index--) {
            //         addUpdateKeyChildren(data.children[index], node.childNodes[index])
            //       }
            //       if (!(node.childNodes && node.childNodes.length !== 0)) {
            //       // 纯机构不不删除空机构 只去掉机构前的箭头
            //         if (this.resourceToggle || this.equipmentToggle) {
            //           // 去掉空机构
            //           this.$refs.treeNewLazy.remove(node)
            //         } else {
            //           node.isLeaf = true
            //         }
            //       }
            //     } else {
            //       // 纯机构不不删除空机构
            //       if (data.tierType === 'org') {
            //         // 去掉空机构
            //         if (this.resourceToggle || this.equipmentToggle) {
            //           // 去掉空机构
            //           this.$refs.treeNewLazy.remove(node)
            //         } else {
            //           node.isLeaf = true
            //         }
            //       }
            //     }
            //   }
            //   addUpdateKeyChildren({_id: oid, children: res.data.tree}, node)
            // }).catch(err => {
            //   console.log('同步懒加载树失败:' + err)
            // })
            return resolve(res.data)
          })
          .catch(err => {
            console.log('first getOrg error: ' + err)
          })
      } else if (node.level > 0) {
        // url 的拼接
        if (node.data.tierType === 'org') {
          // 如果点击的是机构
          url += `oid=${node.key}`
        } else if (node.data.tierType === 'equ') {
          // 如果点击的是设备
          url += `eid=${node.key}`
        } else {
          return
        }
        if (this.resourceToggle && !this.equipmentToggle) {
          // 机构-资源
          url += `&resource=true&restype=${this.resType.join(',')}`
        }
        if (this.equipmentToggle) {
          // 机构-设备 || 机构-设备-资源
          url += `&equipment=true&equtype=${this.equType.join(',')}`
        }
        if (this.newFieldVal !== '') {
          url += this.newFieldVal
        }
        // 机构
        this.$http
          .get(url)
          .then(res => {
            if (this.nodeKeyTmp.length > 0) {
              this.nodeKey = this.nodeKey.concat(this.nodeKeyTmp)
              this.nodeKeyTmp = []
            }
            if (this.refreshNotice) {
              this.$emit('refreshSuc')
              this.refreshNotice = false
            }
            return resolve(res.data)
          })
          .catch(err => {
            console.log('next getOrg error: ' + err)
          })
      }
    },
    // 单击
    nodeClick(data, node, self) {
      // console.log('传递给 data 属性的数组中该节点所对应的对象', data)
      // console.log('当前节点的 Node 对象', node)
      // console.log('节点组件本身', self)
      // 人员同行权限
      this.initdata = JSON.parse(JSON.stringify(data))
      this.isActive = node
      // this.$emit('clickData', data)
    },
    // 双击
    dblclick(node, data) {
      // console.log('node', node)
      // console.log('data', data)
      if (data.tierType === 'res') {
        this.$emit('dbclickData', data)
      }
    },
    // 复选框点击
    handleCheckChange(data, status) {
      // 传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性
      // console.log('传递给 data 属性的数组中该节点所对应的对象', data, status)
      // console.log('树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性', status)
      this.$emit('checksData', JSON.parse(JSON.stringify(status.checkedNodes)), JSON.parse(JSON.stringify(data)), JSON.parse(JSON.stringify(status)))
    },
    // 拖拽
    handleDragStart(draggingNode, event) {
      // console.log('拖拽结束时（可能未成功）触发的事件')
      // console.log('被拖拽节点的放置位置（before、after、inner）', dropType)
      // console.log('event', event)
      event.dataTransfer.setData('Text', JSON.stringify(draggingNode.data))
      this.$emit('dragData', JSON.parse(JSON.stringify(draggingNode.data)))
    },
    // 搜索
    filterNode(value, data, node) {
      // console.log('要搜索的数据', value)
      // console.log('当前节点的数据', data)
      // console.log('当前节点的 Node 对象', node)
      if (!value) {
        return true
      }
      return data.name.indexOf(value) !== -1
    },
    // 抛出的数据
    throwData(index, node, data) {
      if (index === 0) {
        // 开启预览
        let path = [] // 制作路径
        setTimeout(() => {
          path.unshift('/', node.label)
          let _data = node
          for (let i = node.level; i > 1; i--) {
            _data = _data.parent
            path.unshift('/', _data.label)
          }
          this.$emit('previewData', data, path.join(''))
        })
      } else if (index === 1) {
        // 收藏
        setTimeout(() => {
          this.$emit('favData', this.initdata)
        })
      } else if (index === 2) {
        // 删除
        this.isActive = node
        this.$emit('delData', data)
      }
    },
    // 全部预览
    AllPreviewClick(node, data) {
      let val1 = {}
      val1 = data
      val1.children = []
      for (let item of node.childNodes) {
        if (item.data.tierType === 'res') {
          val1.children.push(item.data)
        }
      }
      let path = [] // 制作路径
      path.unshift('/', node.label)
      let val2 = node
      for (let i = node.level; i > 1; i--) {
        val2 = val2.parent
        path.unshift('/', val2.label)
      }
      this.$emit('previewAllData', val1, path.join(''))
    },
    // 获取权限
    getPower(orgId) {
      let url
      switch (this.orgType) {
        case 10: // 10 人员同行
          url = `/setting/role/assign?roleId=${sessionStorage.getItem('roleId')}&resId=${orgId}&type=6`
          break
        default:
          break
      }
      if (!url) { return }
      this.$http.get(url)
        .then(res => {
          this.$emit('power', res.data.properties)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
/*这里的样式引用校园平台的资源client\src\assets\fonts */
@import '../../assets/fonts/iconfont.css';
.BStree * {
  font-size: 12px;
}
.BStree {
  height: 100%;
  width: 100%;
}
.BStree .el-tree {
  /* 树的背景颜色 */
  overflow-y: auto;
  overflow-x: hidden;
  background-color: transparent;
}
.BStree .el-tree::-webkit-scrollbar-track {
  border-radius: 5px;
}
.BStree .el-tree::-webkit-scrollbar-track-piece {
  background-color: #14284b;
}
.BStree .el-tree::-webkit-scrollbar-thumb {
  background-color: #657ca8;
  border-radius: 5px;
}
.BStree .el-tree >>> .el-tree-node__content .el-icon-caret-right.is-leaf {
  color: transparent;
}
.BStree .el-tree >>> .el-tree-node__content .el-icon-caret-right {
  font-size: 18px;
  color: #fff;
}
.BStree >>> .el-tree-node__content {
  /* item的高度 */
  background-color: transparent;
  height: 36px;
  position: relative;
}
.BStree >>> .el-tree-node__content:hover {
  /* 树的鼠标移入样式 */
  background-color: rgb(42, 67, 106);
}
.BStree >>> .el-tree-node__content::after {
  /* 分割线 */
  content: '';
  display: block;
  position: absolute;
  width: 90%;
  height: 0;
  border-top: 1px solid rgba(58, 90, 139, 0.4);
  bottom: 0;
  left: 50%;
  margin-left: -45%;
}
.BStree .el-tree-node {
  position: relative;
}
.BStree .BStreeNew {
  /* 树的图标和文字的公共样式 */
  background-color: transparent;
  color: #fff;
  line-height: 20px;
  padding: 3px 0;
  text-align: left;
  vertical-align: middle;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: #fff;
  /* width: 100%; */
  width: calc(100% - 30px);
}
.BStree .BStreeNew.online {
  /* 在线 */
  color: #fff;
}
.BStree .BStreeNew.outline {
  /* 离线 */
  color: rgb(79, 98, 129);
}
.BStree .BStreeNew.off {
  /* 停用 */
  color: gold;
}
.BStree .BStreeNew.playing {
  /* 预览 */
  color: #4699f9;
}
.BStree .BStreeNew .streeIcon {
  /* 树的图标样式 */
  display: inline-block;
  text-decoration: none;
  border-radius: 3px;
  padding-right: 3px;
}
.BStree .BStreeNew .streeIcon > i {
  font-size: 16px;
}
.BStree .BStreeNew .streeIcon.rightIcon {
  position: absolute;
  right: 5px;
  background-color: rgb(42, 67, 106);
  display: none;
}
.BStree .BStreeNew .streeIcon.rightIcon.center-video {
  background-color: #1b3153;
  display: inline;
}
.BStree .el-tree-node__content:hover .BStreeNew .rightIcon.center-video {
  display: none;
}
.BStree .el-tree-node__content:hover .BStreeNew .rightIcon {
  display: inline;
}
.BStree .BStreeNew .streeIcon.rightIcon > i {
  padding: 0 3px;
  margin-left: 5px;
}
.BStree .BStreeNew .streeIcon.rightIcon > i:hover {
  color: #449af8;
}
.BStree .BStreeNew .treeText {
  /* 树的文字样式 */
  display: inline-block;
  /* width: calc(100% - 75px); */
  /* width: 192px; */
  width: calc(100% - 29px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: bottom;
}
.BStree >>> .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  /* 选中的样式 */
  background-color: rgb(42, 67, 106);
}
</style>
