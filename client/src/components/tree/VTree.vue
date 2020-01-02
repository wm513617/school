<template>
  <div class="vtree">
    <tree ref='tree' :treeData="treeNode" :isUpChecked="isUpChecked" :options="options" :activeId="activeId" :playingIds="playingIds" :alarmIds="alarmIds" :pollId='pollId' :pollingId='pollingIds' :searchVal="searchVal" :nowTime='nowTime' @searchCount="count => $emit('searchCount', count)" @handlecheckedChange="handlecheckedChange" @handleNodeExpand="handleNodeExpand" @node-click='handleNode' @node-dblclick="nodeDblclick" @editClick="editClick" @deleteClick="deleteClick" @openPreviewClick='openPreviewClick' @openAllPreviewClick='openAllPreviewClick' @collectionClick='collectionClick' @creatTreeEnd="$emit('creatTreeEnd')" @creatTreeStart="n => $emit('creatTreeStart', n)" @loadMore="$emit('loadMore')" />
  </div>
</template>
<script>
import Tree from './tree.vue'
import toTreeData from '../../assets/js/toTreeData'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'VTree',
  components: {
    Tree
  },
  props: {
    searchVal: {
      default: ''
    },
    treeData: {
      type: Array
    },
    alarmIds: {
      type: Array
    },
    synchro: {
      default: false
    },
    options: {
      default() {
        return {
          showSearch: true,
          showOpenPreview: true,
          showOpenAllPreview: true,
          showCollection: true
        }
      }
    },
    activeId: {
      type: [String, Number],
      default: ''
    },
    isSaveState: {
      default: true
    },
    isUpChecked: {
      default: true
    }
  },
  data() {
    return {
      treeState: [],
      treeNode: null,
      treeDataChanged: true,
      nowTime: new Date()
    }
  },

  watch: {
    treeData: {
      deep: true,
      handler: function(data) {
        this.updata()
      }
    },
    synchro(s) {
      if (!s) {
        this.uncheckNode(this.treeNode)
      }
    }
  },
  computed: {
    ...mapState({
      playingIds: ({ videoOrg }) => videoOrg.playingIds,
      pollId: ({ videoOrg }) => videoOrg.pollId
    }),
    ...mapGetters(['pollingIds'])
  },
  methods: {
    updata(data) {
      let obj
      if (data) {
        obj = JSON.parse(JSON.stringify(data))
      } else if (this.treeData) {
        obj = JSON.parse(JSON.stringify(this.treeData))
      } else {
        return
      }
      obj = toTreeData(obj)
      this.initTreeData(obj)
      this.setTreeOpen(obj)
      if (this.treeState.length > 0 && this.searchVal === '' && this.isSaveState) {
        this.$lodash.merge(obj, this.treeState)
        this.fileTreeData(obj)
      }
      if (obj[0]) { obj[0].isroot = true }
      this.treeNode = obj
      this.nowTime = new Date()
    },
    initTreeData(data, node) {
      for (const i in data) {
        if (data[i].constructor === String) { return }
        if (!data[i].open) {
          data[i].open = false
        }
        if (data[i].checked === 0) {
          data[i].checked = false
          data[i].nodeSelectNotAll = false
        } else if (data[i].checked === 1) {
          data[i].checked = false
          data[i].nodeSelectNotAll = true
        } else if (data[i].checked === 2) {
          data[i].checked = true
          data[i].nodeSelectNotAll = false
        } else {
          if (!data[i].checked) {
            data[i].checked = false
          }
          if (!data[i].nodeSelectNotAll) {
            data[i].nodeSelectNotAll = false
          }
        }

        data[i].visible = true
        if (!data[i].searched) {
          data[i].searched = false
        }
        data[i].iKey = node ? node.iKey + '.' + i : i
        data[i].orgPath = node ? node.orgPath + '/' + data[i].name : data[i].name
        data[i].pid = data[i].pid || (node ? node._id : '')
        if (data[i].children && data[i].children.length) {
          this.initTreeData(data[i].children, data[i])
        }
      }
      this.catchPinyin(data)
    },
    catchPinyin(data) {
      for (const i in data) {
        const node = data[i]
        if (node.name && !node.wordFilter) {
          this.catchWordFilter(node)
        }
      }
    },
    catchWordFilter(node) {
      node.wordFilter = [node.name.toLowerCase() + node.name]
      if (node.pinyin) {
        node.wordFilter.push(node.pinyin)
        // node.wordFilter.push(node.pinyin.split(' ').map(m => m[0]).join(''))
        node.wordFilter.push(node.pinyin.split(' ').join(''))
      }
      if (node.eid) {
        node.wordFilter.push(node.eid.ip)
      }
    },
    uncheckNode(node) {
      if (node && node.length) {
        node.forEach(item => {
          item.checked = false
          this.uncheckNode(item.children)
        })
      }
    },
    setTreeOpen(data) {
      // for (const n in data) {
      if (data[0] && !data[0].open) {
        data[0].open = true
      }
      // }
    },
    saveTreeState(data, arr) {
      data.forEach(val => {
        const obj = {}
        arr.push(obj)
        obj.open = val.open
        obj.checked = val.checked
        obj.nodeSelectNotAll = val.nodeSelectNotAll
        if (val.children && val.children.length) {
          obj.children = []
          this.saveTreeState(val.children, obj.children)
        }
      })
    },
    fileTreeData(obj) {
      for (const i in obj) {
        if (!obj[i] || !obj[i]._id || !obj[i].name) {
          obj.length ? obj.splice(i, 1) : delete obj[i]
        }
        if (obj[i] && obj[i].children && obj[i].children.length) {
          this.fileTreeData(obj[i].children, obj[i])
        }
      }
    },
    handleNode(node, obj) {
      let item = this.$lodash.cloneDeep(node)
      this.$emit('node-click', item, obj)
    },
    nodeDblclick(node) {
      this.$emit('node-dblclick', node)
    },
    openPreviewClick(node) {
      this.$emit('openPreviewClick', node)
    },
    openAllPreviewClick(node) {
      this.$emit('openAllPreviewClick', node)
    },
    collectionClick(node) {
      this.$emit('collectionClick', node)
    },
    editClick(node) {
      this.$emit('editClick', node)
    },
    deleteClick(node) {
      this.$emit('deleteClick', node)
    },
    getSelectedNodeIds() {
      return this.$refs.tree.getSelectedNodeIds()
    },
    getSelectedDeepChannelid() {
      return this.$refs.tree.getSelectedDeepChannelid()
    },
    getSelectedDeepNameIds(type) {
      return this.$refs.tree.getSelectedDeepNameIds(type)
    },
    getSelectedDeepIps() {
      return this.$refs.tree.getSelectedDeepIps()
    },
    getSelectedDeepChannels() {
      return this.$refs.tree.getSelectedDeepChannels()
    },
    getSelectedDeepIds(type) {
      return this.$refs.tree.getSelectedDeepIds(type)
    },
    getSelectedDeepCameraCode(type) {
      return this.$refs.tree.getSelectedDeepCameraCode(type)
    },
    getSelectedNodes() {
      return this.$refs.tree.getSelectedNodes()
    },
    getStoreRoot() {
      return this.$refs.tree.getStoreRoot()
    },
    handlecheckedChange() {
      this.$emit('handlecheckedChange')
      this.handleNodeExpand()
      return this.$refs.tree.getStoreRoot()
    },
    handleNodeExpand(node) {
      this.$emit('on-expand', node)
      if (this.searchVal !== '') { return }
      this.treeState = []
      this.saveTreeState(this.$refs.tree.getStoreRoot(), this.treeState)
    }
  },
  created() {
    this.updata()
  },
  beforeDestroy() {
    this.treeNode = null
  }
}
</script>
<style scoped>
.vtree {
  height: 100%;
  /*overflow-x:auto;*/
}
</style>
