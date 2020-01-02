<template>
  <div class="halo-tree">
    <div class="input" v-if="defaultOptions.showSearch">
      <Input v-model="search" icon="ios-search-strong" placeholder="请输入..." />
    </div>
    <tree-node :activeId="activeId" :treeData='treeStoreRoot' :pollId='pollId' :pollingId='pollingId' :options="defaultOptions" :playingIds="playingIds" :alarmIds="alarmIds" @handlechecked="handlecheckedChange"></tree-node>
    <div v-if="(!searchData || searchData === -1)&&defaultOptions.showNoneData" style="padding:7px 16px;background: #2a436a;">
      <div class="treeloading" v-if="searchData === -1"></div>
      <span v-if='!searchData'>无结果</span>
    </div>
  </div>
</template>
<script>
import { extend } from 'jquery'
import TreeNode from './tree-node.vue'
import TreeStore from './tree-store'
export default {
  name: 'tree',
  components: { TreeNode },
  props: {
    searchVal: {
      default: ''
    },
    treeData: {
      type: Array
    },
    playingIds: {
      type: Array
    },
    alarmIds: {
      type: Array
    },
    options: {
      type: Object,
      default: () => {
        return {}
      }
    },
    activeId: {
      type: [String, Number],
      default: ''
    },
    pollId: {
      type: [String, Number],
      default: ''
    },
    pollingId: {
      type: [Object, Array],
      default: () => {
        return []
      }
    },
    nowTime: {
      default: ''
    },
    isUpChecked: {
      default: true
    }
  },
  data() {
    return {
      search: this.searchVal,
      store: null,
      checkedClick: false,
      nowNode: null,
      searchData: -2,
      defaultOptions: {
        showCheckbox: true,
        showSearch: false,
        showFolder: true,
        showInput: false,
        showOpenPreview: false,
        showOpenAllPreview: false,
        showCollection: false,
        showDelete: false,
        showEdit: false,
        showPoint: false,
        halfCheckedStatus: true,
        moreRoot: false,
        showNoneData: true,
        isMapDate: true,
        search: {
          useInitial: false,
          useEnglish: false,
          customFilter: null,
          onlyLeaf: false
        }
      }
    }
  },
  computed: {
    treeStoreRoot() {
      if (this.store && this.store.root) {
        return this.store.root
      } else {
        return []
      }
    }
  },
  watch: {
    searchVal(val) {
      this.search = val
    },
    search: function(val) {
      this.filterSearch(val)
    },
    nowTime() {
      let item = this.$parent.treeNode
      this.store = null
      if (!item) { return }
      this.store = new TreeStore({
        root: item,
        last: null
      }, this.options.isMapDate === false)
      this.upTreeChecked(item)
      this.$forceUpdate()
    },
    options: {
      deep: true,
      handler: function(data) {
        for (const i in this.options) {
          this.defaultOptions[i] = this.options[i]
        }
      }
    }
  },
  methods: {
    syncOfflineState(data) {
      const _getNodes = (node) => {
        node.forEach(item => {
          if (item.eid && data[item.eid._id]) {
            item.status = data[item.eid._id].status ? 1 : 0
          }
          if (item.children && item.children.length) {
            _getNodes(item.children)
          }
        })
      }
      _getNodes(this.store.root)
    },
    filterSearch(val) {
      if (!this.store) {
        return
      }
      const count = this.store.filterNodes(val, this.defaultOptions.search)
      this.searchData = count
      if (val === '') {
        this.setTreeOpen(this.store.root)
      }
      this.$emit('searchCount', count === -1 ? 0 : count)
    },
    setTreeOpen(arr) {
      function changeOpen(data) {
        for (const i in data) {
          data[i].open = false
          if (data[i].children && data[i].children.length) {
            changeOpen(data[i].children)
          }
        }
      }
      changeOpen(arr)
      arr[0].open = true
    },
    handlecheckedChange(node) {
      this.checkedClick = true
      // node.checked = !node.checked
      // if (this.defaultOptions.halfCheckedStatus) {
      //   this.store.changeCheckHalfStatus(node)
      //   this.$forceUpdate()
      // } else {
      //   this.store.changeCheckStatus(node)
      // }
      this.$emit('handlecheckedChange')
    },
    upTreeChecked(data) {
      if (!this.isUpChecked) { return }
      if (this.checkedClick) { return }
      if (!this.defaultOptions.showInput) { return }
      for (const i in data) {
        if (this.defaultOptions.halfCheckedStatus) {
          // console.log(data[i].name, data[i]._id)
          this.changeHalfCheck(data[i])
          // this.store.changeCheckHalfStatus(data[i])
        } else {
          this.changeCheck(data[i])
          // this.store.changeCheckStatus(data[i])
        }
        if (data[i].children && data[i].children.length) {
          this.upTreeChecked(data[i].children)
        }
      }
    },
    getSelectedNodes() {
      // const allnodes = this.store.datas
      const selectedNodes = []
      // for (const [, node] of allnodes) {
      //   if (node.checked) {
      //     selectedNodes.push(node)
      //   }
      // }
      const _getNodes = (node) => {
        node.forEach(item => {
          if (item.checked) {
            selectedNodes.push(item)
          }
          if (item.children && item.children.length) {
            _getNodes(item.children)
          }
        })
      }
      _getNodes(this.store.root)
      return selectedNodes
    },
    getSelectedNodeIds() {
      const allnodes = this.store.datas
      const selectedNodeIds = []
      for (const [, node] of allnodes) {
        if (node.checked) {
          selectedNodeIds.push(node._id)
        }
      }
      return selectedNodeIds
    },
    getSelectedDeepNameIds(type = 'eid') {
      const allnodes = this.store.datas
      const selectedNodeIds = []
      const selectedNodeNames = []
      let count = 0
      for (const [, node] of allnodes) {
        if (!node.children && type in node) {
          count++
          if (node.checked) {
            selectedNodeIds.push(node._id)
            selectedNodeNames.push(node.name)
          }
        }
      }
      return {
        count: count,
        id: selectedNodeIds,
        name: selectedNodeNames
      }
    },
    getSelectedDeepIps() {
      let type = 'eid'
      const allnodes = this.store.datas
      const selectedNodeIds = []
      const selectedNodeNames = []
      const selectedNodeIps = []
      let count = 0
      for (const [, node] of allnodes) {
        if (!node.children && type in node) {
          count++
          if (node.checked) {
            selectedNodeIds.push(node._id)
            selectedNodeNames.push(node.name)
            selectedNodeIps.push(node.eid.ip)
          }
        }
      }
      return {
        count: count,
        id: selectedNodeIds,
        name: selectedNodeNames,
        ip: selectedNodeIps
      }
    },
    getSelectedDeepIds(type = 'eid') {
      const allnodes = this.store.datas
      const selectedNodeIds = []
      for (const [, node] of allnodes) {
        if (node.checked && !node.children && type in node) {
          selectedNodeIds.push(node._id)
        }
      }
      return selectedNodeIds
    },
    getSelectedDeepCameraCode(type = 'eid') {
      const allnodes = this.store.datas
      const selectedNodeIds = []
      for (const [, node] of allnodes) {
        if (node.checked && !node.children && type in node) {
          selectedNodeIds.push(node.cameraCode)
        }
      }
      return selectedNodeIds
    },
    getSelectedDeepChannels(type = 'videoStructure') {
      const allnodes = this.store.datas
      const selectedNodeChannels = []
      for (const [, node] of allnodes) {
        if (node.checked && !node.children && type in node && 'structureServer' in node[type] && 'channelId' in node[type] && 'ip' in node[type]['structureServer']) {
          selectedNodeChannels.push(node.videoStructure.structureServer.ip + '-' + node.videoStructure.channelId)
        }
      }
      return selectedNodeChannels
    },
    getSelectedDeepChannelid() {
      const allnodes = this.store.datas
      const selectedNodeIds = []
      for (const [, node] of allnodes) {
        if (node.checked && 'channelid' in node) {
          selectedNodeIds.push(node.channelid)
        }
      }
      return selectedNodeIds
    },
    getStoreRoot() {
      return this.$lodash.cloneDeep(this.store.root)
    },
    nodeclick(a) {},
    // getNode(node, id) {
    //   this.nowNode = null
    //   const filNode = (node, id) => {
    //     for (const i in node) {
    //       if (node[i]._id === id) {
    //         this.nowNode = node[i]
    //       }
    //       if (node[i].children && node[i].children.length) {
    //         filNode(node[i].children, id)
    //       }
    //     }
    //   }
    //   filNode(node, id)
    //   if (this.nowNode) {
    //     return this.nowNode
    //   }
    // },
    getNode(key) {
      return this.store.datas.get(key)
    },
    getCurnode(id) {
      const curNode = this.getNode(id)
      const pNode = this.getNode(curNode.pid)
      let obj = {}
      if (pNode.children && pNode.children.length) {
        obj = {
          index: 0,
          isroot: curNode.isroot,
          parent: pNode
        }
        pNode.children.forEach((x, i) => {
          if (x._id !== id) {
            obj.index = i
            obj.previousNode = i - 1 < 0 ? null : pNode.children[i - 1] // eslint-disable-line
            obj.nextNode = i + 1 >= pNode.children.length ? null : pNode.children[i + 1]
          }
        })
      }
    },
    silibingChecked(pid, currentId) {
      // const parent = this.getNode(this.store.root, pid)
      const parent = this.store.datas.get(pid)
      const sbIds = []
      if (parent && parent.children && parent.children.length) {
        parent.children.forEach(x => {
          if (x._id !== currentId) { sbIds.push(x._id) }
        })
      }
      for (const _id of sbIds) {
        // const node = this.getNode(this.store.root, _id)
        const node = this.getNode(_id)
        if (!node.checked) { return false }
      }
      return true
    },
    changeCheck(node) {
      const _traverseUp = node => {
        if (node.checked && node.pid) {
          // const parent = this.getNode(this.store.root, node.pid)
          const parent = this.getNode(node.pid)
          parent.checked = this.silibingChecked(node.pid, node._id)
          _traverseUp(parent)
        } else {
          if (!node.checked && node.pid) {
            // const upparent = this.getNode(this.store.root, node.pid)
            const upparent = this.getNode(node.pid)
            upparent.checked = false
            if (upparent.pid) {
              _traverseUp(upparent)
            }
          }
        }
      }
      _traverseUp(node)
    },
    // 半选上冒
    changeHalfCheck(node) {
      // let flag = false
      // 如果勾选的是子节点，父节点默认打上勾
      const _traverseUp = (node, flag = false) => {
        let parent = null
        if (node.checked) {
          // 打钩
          if (node.pid) {
            // parent = this.getNode(this.store.root, node.pid)
            parent = this.getNode(node.pid)
            if (!parent) { return }
            if (flag) {
              parent.checked = true
              parent.nodeSelectNotAll = true
              _traverseUp(parent, true)
            } else {
              parent.checked = true
              parent.nodeSelectNotAll = this.silibingHalfChecked(true, parent, node.pid, node._id) === 'half' // 返回true则全钩，false为半钩
              _traverseUp(parent)
            }
          }
        } else {
          // 去钩
          if (node.pid) {
            // parent = this.getNode(this.store.root, node.pid)
            parent = this.getNode(node.pid)
            if (!parent) { return }
            if (this.silibingHalfChecked(false, parent, node.pid, node._id) === 'none') {
              // 返回true则全没钩，false为半钩
              parent.checked = false
              parent.nodeSelectNotAll = false
            } else {
              parent.checked = true
              parent.nodeSelectNotAll = true
            }
            _traverseUp(parent, true)
          }
        }
      }
      _traverseUp(node)
    },
    silibingHalfChecked(status, parent, pid, currentId) {
      const sbIds = []
      // const currentNode = this.getNode(this.store.root, currentId)
      const currentNode = this.getNode(currentId)
      if (parent && parent.children) {
        parent.children.forEach(x => {
          if (!currentNode.nodeSelectNotAll && x._id !== currentId) { sbIds.push(x._id) } // 除去当前节点的剩下节点
        })
      }

      if (status) {
        // 打钩
        if (sbIds.length !== 0) {
          for (const _id of sbIds) {
            // 子节点只要有一个被选中则父框打黑，全选打钩，全没有被选无状态
            // const node = this.getNode(this.store.root, _id)
            const node = this.getNode(_id)
            if (!node.checked || node.nodeSelectNotAll) {
              // 节点没勾选
              return 'half' // 表示父框半钩的状态
            }
          }
        } else {
          if (currentNode.nodeSelectNotAll) {
            return 'half' // 表示全钩的状态
          }
        }
        return 'all' // 表示全钩的状态
      } else {
        // 去钩
        if (sbIds.length !== 0) {
          for (const _id of sbIds) {
            // 子节点只要有一个被选中则父框打黑，全选打钩，全没有被选无状态
            // const node = this.getNode(this.store.root, _id)
            const node = this.getNode(_id)
            if (node.checked || node.nodeSelectNotAll) {
              // 有节点被勾选，父框半钩的状态
              return 'half'
            }
          }
        } else {
          if (currentNode.nodeSelectNotAll) {
            return 'half' // 表示全钩的状态
          }
        }
        return 'none'
      }
    }
  },
  created() {
    this.isTree = true
    // for (const i in this.options) {
    //   this.defaultOptions[i] = this.options[i]
    // }
    extend(true, this.defaultOptions, this.options)
    if (!this.treeData || !this.treeData[0]) { return }
    if (this.defaultOptions.moreRoot) {
      this.store = new TreeStore({
        root: this.treeData,
        last: null
      }, this.options.isMapDate === false)
    } else {
      this.store = new TreeStore({
        root: (this.treeData || []).slice(0),
        last: null
      }, this.options.isMapDate === false)
    }
    this.upTreeChecked(this.store.root)
    this.$forceUpdate()
  },
  beforeDestroy() {
    this.store = null
  }
}
</script>
<style scoped>
* {
  font-size: 13px;
  font-family: '\5FAE\8F6F\96C5\9ED1';
}

.input {
  width: 95%;
  position: relative;
  margin: 0 auto;
  padding: 10px;
}

.input span {
  position: absolute;
  top: 7px;
  right: 5px;
}
</style>
<style>
.treeloading {
  margin: 5px auto;
  font-size: 16px;
  height: 0.1em;
  width: 0.1em;
  box-shadow: -0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor,
    -0.2em -0.2em 0 0.1em currentcolor;
  animation: loader 4s infinite;
}
@keyframes loader {
  0% {
    box-shadow: -0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor,
      -0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor;
  }
  8.33% {
    box-shadow: -0.2em -0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor,
      0.2em -0.2em 0 0.1em currentcolor;
  }
  16.66% {
    box-shadow: -0.2em -0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor,
      0.2em 0.2em 0 0.1em currentcolor;
  }
  24.99% {
    box-shadow: -0.2em -0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor,
      -0.2em 0.2em 0 0.1em currentcolor;
  }
  33.32% {
    box-shadow: -0.2em -0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor,
      -0.2em -0.2em 0 0.1em currentcolor;
  }
  41.65% {
    box-shadow: 0.2em -0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor,
      0.2em -0.2em 0 0.1em currentcolor;
  }
  49.98% {
    box-shadow: 0.2em 0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor,
      0.2em 0.2em 0 0.1em currentcolor;
  }
  58.31% {
    box-shadow: -0.2em 0.2em 0 0.1em currentcolor, -0.2em 0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor,
      -0.2em 0.2em 0 0.1em currentcolor;
  }
  66.64% {
    box-shadow: -0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor,
      -0.2em 0.2em 0 0.1em currentcolor;
  }
  74.97% {
    box-shadow: -0.2em -0.2em 0 0.1em currentcolor, 0.2em -0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor,
      -0.2em 0.2em 0 0.1em currentcolor;
  }
  83.3% {
    box-shadow: -0.2em -0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor, 0.2em 0.2em 0 0.1em currentcolor,
      -0.2em 0.2em 0 0.1em currentcolor;
  }
  91.63% {
    box-shadow: -0.2em -0.2em 0 0.1em currentcolor, -0.2em 0.2em 0 0.1em currentcolor, -0.2em 0.2em 0 0.1em currentcolor,
      -0.2em 0.2em 0 0.1em currentcolor;
  }
  100% {
    box-shadow: -0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor,
      -0.2em -0.2em 0 0.1em currentcolor, -0.2em -0.2em 0 0.1em currentcolor;
  }
}
</style>
