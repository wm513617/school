<template>
  <div class="treeNode" :class="[]" :draggable="true" @dragstart.stop="handleDragStart(treeData,$event)" @dblclick="dblclickNode(treeData)" v-if="showNode(treeData)&&treeData[label]&&visible">
    <span class="treeliBox" :class="[treeData._id === activeNode._id ? 'active': '',treeData._id === activeId ? 'active': '',(searched)?'searched': '']" @click="handleNode(treeData)">

      <span :style="{'width':left + 'px','height':'100%'}" class="suojin"></span>

      <i @click.stop='handleNodeExpand(treeData, open)' class="openflag" :class="[open? 'tree-open':'tree-close','icon']" v-if="treeData.children && treeData.children.length > 0">
        <Icon type="arrow-down-b" v-if='open'></Icon>
        <Icon type="arrow-right-b" v-if='!open'></Icon>
      </i>
      <!--无子节点缩进对齐-->
      <span style="width:14px;" v-if="!(treeData.children && treeData.children.length > 0)" class="orgsj"></span>

      <!--选择框-->
      <span class="checkbox" v-if="showCheckbox" >
        <span class="ivu-checkbox" :class="{'ivu-checkbox-checked':checked,'ivu-checkbox-indeterminate':halfChecked, 'ivu-checkbox-disabled':!selective(treeData)}" @click.stop="handlecheckedChange(treeData)">
          <span class="ivu-checkbox-inner"> </span>
        </span>
      </span>

      <!--node节点-->
      <slot :node="treeData" :orgPath="orgPath"></slot>
      <!-- <span class="item" :title="treeData.name"><i class="icon-organise iconfont"></i>{{treeData.name}}</span> -->

    </span>
    <div v-if="treeData.children && treeData.children.length > 0 && open">
      <Bsr-Tree v-model="activeNode" v-for="(item, i) in treeData.children" :key="i" :tree-data="item" :parentNode="treeData.children" :index="i" :paddingLeft="left" :showCheckbox="showCheckbox" :selectNode="checkedIds" :isSearch="isSearch" :searchedIds="searchedIds" :searchVal="searchVal" :label="label" :parentPath="orgPath" :showNode="showNode" :selective="selective" :isHalfCheck="isHalfCheck" @node-dblclick="dblclickNode" @node-click="handleNode" @expand-node="expandNode" @on-expand="$emit('on-expand')" @handlechecked="handlechecked">
        <template slot-scope="{ node, orgPath }">
           <slot :node="node" :orgPath="orgPath"></slot>
        </template>
      </Bsr-Tree>
    </div>
  </div>
</template>
<script>
export default {
  name: 'BsrTree',
  props: {
    // 节点信息
    treeData: {
      type: Object,
      default: () => {}
    },
    // 节点索引
    index: {
      type: [String, Number],
      default: 0
    },
    // 父节点
    parentNode: {
      type: Array,
      default: () => []
    },
    // 选中节点id
    selectNode: {
      type: Array,
      default: () => []
    },
    // 节点缩进
    paddingLeft: {
      type: [String, Number],
      default: 0
    },
    value: {
      type: Object,
      default: () => {}
    },
    // 显示选择框
    showCheckbox: {
      type: Boolean,
      default: false
    },
    // 是否搜索
    isSearch: {
      type: Boolean,
      default: false
    },
    // 搜索匹配到的id集合
    searchedIds: {
      type: Array,
      default: () => []
    },
    // 搜索值
    searchVal: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'name'
    },
    parentPath: {
      type: String,
      default: ''
    },
    // 节点显示与否
    showNode: {
      type: Function,
      default: () => true
    },
    isHalfCheck: {
      type: Boolean,
      default: false
    },
    // 是否可选
    selective: {
      type: Function,
      default: () => true
    },
    // 新树选中项
    activeId: {
      type: [ Number, String ]
    }
  },
  data() {
    return {
      activeNode: this.value || {},
      isTree: true,
      open: !this.$parent.isTree || false,
      checkedIds: [...this.selectNode], // 所有选中节点id集合
      selectNum: 0,
      isChildSearch: false,
      handleTimer: null
    }
  },
  watch: {
    value(item) {
      this.activeNode = item
    },
    selectNode(val) {
      this.checkedIds = [...val]
    },
    treeData(val) {
      console.log(this.treeData.children)
      console.log('open', this.open)
      console.log('treeData', JSON.parse(JSON.stringify(val)))
    }
  },
  computed: {
    left() {
      return this.paddingLeft + 10
    },
    checked: {
      // 节点选中状态
      get() {
        if (!this.showCheckbox) {
          return false
        }
        // id存在于集合中即被选中
        return this.checkedIds.includes(this.treeData._id)
      },
      set(val) {
        this.checked = val
      }
    },
    halfChecked: {
      // 节点半选状态
      get() {
        if (!this.showCheckbox || this.isHalfCheck) {
          return false
        }
        // id存在于集合中，就不是半选
        if (this.checkedIds.length === 0 || this.checkedIds.includes(this.treeData._id)) {
          return false
        }
        let num = 0
        if (this.treeData.children && this.treeData.children.length) {
          // 获取子节点选中的数量
          num = this.treeData.children.filter(item => this.checkedIds.includes(item._id)).length
          if (num === 0) {
            // 计算孙子节点被选中的数量
            this.hasChildSelect(this.treeData)
            if (this.selectNum) {
              return true
            }
            return false
          } else if (num === this.treeData.children.length) {
            this.addCheckedId(this.treeData._id)
            return false
          } else {
            return true
          }
        }
        return false
      },
      set(val) {
        this.halfChecked = val
      }
    },
    searched: {
      // 节点被搜索匹配中状态
      get() {
        if (!this.isSearch) {
          return false
        }
        return this.searchedIds.includes(this.treeData._id)
      },
      set(val) {
        this.checked = val
      }
    },
    visible: {
      // 节点是否可见状态(用于搜索)
      get() {
        if (!this.isSearch || this.searchVal === '') {
          return true
        }
        if (this.searchedIds.includes(this.treeData._id)) {
          this.setOpen(true)
          return true
        }
        this.hasChildSearch(this.treeData)
        if (this.isChildSearch) {
          this.setOpen(true)
          return true
        }
        this.setOpen(false)
        return false
      },
      set(val) {
        this.checked = val
      }
    },
    orgPath() {
      return this.parentPath + '/' + this.treeData[this.label]
    }
  },
  methods: {
    setOpen(bool) {
      this.open = bool
      if (!bool) {
        this.open = !this.$parent.isTree || false
      }
    },
    expandNode(node, open) {
      this.$emit('expand-node', node, open)
    },
    /**
     * 节点展开/收起事件
     * node 当前的节点
     */
    handleNodeExpand(node, open) {
      this.expandNode(node, open)
      this.open = !this.open
      this.$emit('on-expand')
    },
    /**
     * checkBox 点击事件
     * node 当前的节点
     */
    handlecheckedChange(node) {
      if (!this.showCheckbox || !this.selective(node)) {
        return
      }
      this.loopSetChecked(node, !this.checked)
      this.$emit('handlechecked', this.checkedIds)
    },
    /**
     * checkBox变化父级响应事件
     */
    handlechecked(item) {
      this.selectNum = 0
      this.checkedIds = [...item]
      let has = false
      if (this.isHalfCheck) { // 半选节点可以选中
        this.hasChildChecked(this.treeData, false)
        has = this.isChildSelect
      } else { // 半选节点不可选中
        const childSelectNum = this.treeData.children.filter(item => this.checkedIds.includes(item._id)).length
        has = this.treeData.children.length === childSelectNum
      }
      if (has) {
        this.addCheckedId(this.treeData._id)
      } else {
        this.deleteCheckedId(this.treeData._id)
      }
      return this.$emit('handlechecked', this.checkedIds)
    },
    /**
     * checkBox变化子级响应事件
     */
    loopSetChecked(item, checked) {
      // 遍历所有子节点是否选中
      if (checked) {
        this.addCheckedId(item._id)
      } else {
        this.deleteCheckedId(item._id)
      }
      if (item.children && item.children.length > 0) {
        item.children.forEach(item => this.loopSetChecked(item, checked))
      }
    },
    /**
     * 向选中节点id集合中添加
     */
    addCheckedId(id) {
      if (!this.checkedIds.includes(id)) {
        this.checkedIds.push(id)
      }
    },
    /**
     * 从选中节点id集合中删除
     */
    deleteCheckedId(id) {
      if (this.checkedIds.includes(id)) {
        for (let index = 0; index < this.checkedIds.length; index++) {
          if (id === this.checkedIds[index]) {
            this.checkedIds.splice(index, 1)
            break
          }
        }
      }
    },
    /**
     * 判断子节点及孙子节点是否有选中的
     * selectNum  子节点选中的个数
     * 子节点全部选中，父节点也选中，用于初次匹配
     */
    hasChildSelect(node) {
      if (this.checkedIds.includes(node._id)) {
        this.selectNum += 1
      } else if (node.children && node.children.length > 0) {
        const num = node.children.filter(item => this.checkedIds.includes(item._id)).length
        if (num === node.children.length) {
          this.addCheckedId(node._id)
          this.selectNum += node.children.length + 1
        } else {
          node.children.forEach(item => {
            this.hasChildSelect(item)
          })
        }
      }
    },
    /**
     * 判断子节点及孙子节点是否有选中的
     * bool  自身是否参与计算
     */
    hasChildChecked(node, bool = true) {
      this.isChildSelect = false
      if (bool && this.checkedIds.includes(node._id)) {
        this.isChildSelect = true
        return
      }
      if (node.children && node.children.length > 0) {
        for (let index = 0; index < node.children.length; index++) {
          this.hasChildChecked(node.children[index])
          if (this.isChildSelect) {
            break
          }
        }
      }
    },
    /**
     * 判断子节点及孙子节点是否搜索匹配(用于搜索)
     */
    hasChildSearch(node) {
      this.isChildSearch = false
      if (this.searchedIds.includes(node._id)) {
        this.isChildSearch = true
        return
      }
      if (node.children && node.children.length > 0) {
        for (let index = 0; index < node.children.length; index++) {
          this.hasChildSearch(node.children[index])
          if (this.isChildSearch) {
            break
          }
        }
      }
    },
    /**
     * 节点点击事件
     * node 点击的节点
     * index 节点的索引
     * setTimeout解决双击触发两次单击事件
     */
    handleNode(node, obj) {
      if (node.children && node.children.length > 0 && !this.open) {
        this.handleNodeExpand(node)
      }
      clearTimeout(this.handleTimer)
      this.handleTimer = setTimeout(() => {
        this.activeNode = node
        if (!obj) {
          const nodeData = this.parentNode || []
          obj = {
            index: this.index,
            isroot: node.isroot,
            parent: nodeData,
            previousNode: this.index - 1 < 0 ? null : nodeData[this.index - 1],
            nextNode: this.index + 1 >= nodeData.length ? null : nodeData[this.index + 1]
          }
        }
        this.$emit('node-click', node, obj)
      }, node._id === this.treeData._id ? 200 : 0)
    },
    /**
     * 节点双击事件
     * node 点击的节点
     * index 节点的索引
     */
    dblclickNode(node) {
      clearTimeout(this.handleTimer)
      if (!node.children) {
        this.$emit('node-dblclick', node)
      }
    },
    /**
     * 节点拖拽事件
     * node 点击的节点
     * index 节点的索引
     */
    handleDragStart(item, e) {
      e.dataTransfer.setData('Text', JSON.stringify(item))
    },
    /**
     * 获取CheckBox选中的节点
     */
    getSelectedNodes() {
      const selectedNodes = []
      const _getNodes = node => {
        node.forEach(item => {
          if (this.checkedIds.includes(item._id)) {
            selectedNodes.push(item)
          }
          if (item.children && item.children.length) {
            _getNodes(item.children)
          }
        })
      }
      if (this.checkedIds.includes(this.treeData._id)) {
        selectedNodes.push(this.treeData)
      }
      this.treeData.children && this.treeData.children.length && _getNodes(this.treeData.children)
      return selectedNodes
    },
    getSelectedDeepIds(type = 'eid') { // 获取选中的镜头ID
      const selectedNodes = []
      const _getNodes = node => {
        node.forEach(item => {
          if (this.checkedIds.includes(item._id) && !item.children && type in item) {
            selectedNodes.push(item._id)
          }
          if (item.children && item.children.length) {
            _getNodes(item.children)
          }
        })
      }
      this.treeData.children && this.treeData.children.length && _getNodes(this.treeData.children)
      return selectedNodes
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {
    this.checkedIds = null
  }
}
</script>
<style scoped>
.treeNode:hover {
  cursor: pointer;
}

.treeNode .treeliBox {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #fffafa;
  font-size: 12px;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 5px;
  position: relative;
  line-height: 34px;
}

.treeNode .treeliBox > * {
  padding: 0 3px;
}

.treeNode .treeliBox:after {
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

.treeNode .treeliBox .suojin,
.treeNode .treeliBox .orgsj {
  flex-shrink: 0;
}

.treeNode .treeliBox:hover {
  background: #20365c;
}

.treeNode .treeliBox .item {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.treeNode .treeliBox .item.offline {
  color: #4f6281;
}

.treeNode .treeliBox .item.playing {
  color: #4699f9;
}

.icon {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 20px;
}

.treeNode .treeliBox.active {
  background: #2a436a;
  color: #fffafa;
}

.treeNode {
  margin: 0;
  position: relative;
  list-style: none;
}

.treeliBox > i {
  text-align: center;
  font-size: 16px;
}

.tree-close {
  width: 14px;
  height: 14px;
}

.tree-open {
  width: 14px;
  height: 14px;
}

.ivu-icon {
  font-size: 18px !important;
}

.treeliBox.searched .item {
  /* background: #449af8; */
  color: #449af8;
}

.treeliBox .item .right-btn {
  position: absolute;
  right: 5px;
  display: none;
  padding: 0 3px;
  background: #1b3153;
  /* color: #fffafa; */
}

.treeliBox:hover .item .right-btn {
  display: inline;
  background: #20365c;
}

.treeliBox.active .item .right-btn {
  background: #2a436a;
}

.treeliBox .item .right-btn i {
  margin-left: 5px;
}

.treeliBox .item .right-btn i:hover {
  color: #449af8;
}

.treeliBox .disChecked * {
  cursor: not-allowed;
}
</style>
