<template>
  <div>
    <bsr-tree :treeData="treeData" :showCheckbox="showCheckbox" :selectNode="selectNode" :isSearch="isSearch" :searchedIds="searchedIds" :searchVal="searchVal" ref="bsrtree" @node-click="(item1,item2) => $emit('node-click', item1, item2)" @node-dblclick="item => $emit('node-dblclick', item)" @on-expand="$emit('on-expand')" @handlechecked="item => $emit('handlechecked', item)" v-show="searching||!(searchVal&&searchedIds.length===0)" :activeId = "activeId">
      <template slot-scope="{ node }">
        <slot :node="node"></slot>
      </template>
    </bsr-tree>
    <p v-if="(searchVal&&searchedIds.length===0&&showNoData&&!searching)" style="line-height:36px; padding:0 15px;">无结果</p>
  </div>
</template>
<script>
export default {
  name: 'TreeSearch',
  props: {
    treeData: {
      type: Object,
      default: () => {}
    },
    selectNode: {
      type: Array,
      default: () => []
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    isSearch: {
      type: Boolean,
      default: true
    },
    showNoData: {
      type: Boolean,
      default: true
    },
    searchVal: {
      type: String,
      default: ''
    },
    isOnlyLeaf: { // 枝叶搜索，不含树干
      type: Boolean,
      default: false
    },
    isFuzzy: { // 模糊搜索
      type: Boolean,
      default: false
    },
    activeId: { // 点中？
      type: [ String, Number ]
    }
  },
  data() {
    return {
      searchedIds: [],
      searching: false,
      mapData: null
    }
  },
  computed: {},
  watch: {
    searchVal(item) {
      this.timer && clearTimeout(this.timer)
      this.searching = true
      this.timer = setTimeout(() => {
        if (item && this.isSearch) {
          let reg
          if (this.isFuzzy) {
            let str = ''
            item.split('').forEach(val => { str += '\\S*' + val })
            str = str.substring(3)
            reg = new RegExp(str, 'i')
          }
          this.searchedIds = this.filterNodes(item, this.mapData, reg) || []
        } else {
          this.searchedIds = []
          this.$refs.bsrtree.$children.forEach(item => { item.open = false })
        }
        this.searching = false
        this.$emit('on-expand')
      }, 200)
    },
    treeData() {
      this.mapData = null
      this.creatMapData()
    }
  },
  methods: {
    syncOfflineState(data) {
      this.$refs.bsrtree.syncOfflineState(data)
    },
    getSelectedNodes() {
      return this.$refs.bsrtree.getSelectedNodes()
    },
    /**
     * 匹配每个节点的name和拼音，把匹配到的节点id保存起来
     */
    filterNodes(keyworld, mapData, regular) {
      let arr = []
      const _filterNode = (val, item) => {
        if (!val) { return true }
        const match = item.filter((fil, i) => {
          let has = true
          if (this.isFuzzy) {
            has = !regular.test(fil)
          } else {
            has = (fil ? fil.indexOf(keyworld) : -1) === -1
          }
          if (has) {
            return false
          } else {
            if (i === 2) { // 匹配ip
              if (keyworld !== fil || keyworld === 0) { return false }
            }
            return true
          }
        }).length
        if (match) {
          return true
        } else {
          return false
        }
      }
      for (let [key, item] of mapData) {
        if (_filterNode(keyworld, item)) {
          arr.push(key)
        }
      }
      return arr
    },
    /**
     * 展平节点
     */
    creatMapData() {
      if (this.isSearch) {
        this.mapData = new Map()
        // 把所有节点展成平级，键-id，值-[name, 拼音]
        const _traverseNodes = (nodeData) => {
          for (const node of nodeData) {
            if (node && node.name) {
              if (!(this.isOnlyLeaf && node.children && node.children.length > 0)) {
                let arr = [node.name.toLowerCase() + ' ' + node.name]
                if (node.pinyin) {
                  arr.push(node.pinyin + ' ' + node.pinyin.split(' ').join(''))
                }
                this.mapData.set(node._id, arr)
              }
              if (node.children && node.children.length > 0) { _traverseNodes(node.children) }
            }
          }
        }
        _traverseNodes([this.treeData])
      }
    }
  },
  mounted() {
    this.creatMapData()
  },
  beforeDestroy() {
    this.mapData = null
  }
}
</script>
