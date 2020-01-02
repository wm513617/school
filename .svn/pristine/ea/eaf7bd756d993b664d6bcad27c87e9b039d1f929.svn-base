<template>
<div>
  <input type="text" v-model="searchkey"/>
  <Tree :data="baseData" @on-select-change="cnode">
  </Tree>
</div>
</template>
<script>
import $ from 'jquery'
export default {
  name: 'STree',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      baseData: [],
      searchkey: ''
    }
  },
  watch: {
    searchkey() {
      this.filterSearch()
    }
  },
  created() {
    this.toBaseData()
  },
  mounted() {
    $('.ivu-tree').off('dblclick.tree').on('dblclick.tree', '.ivu-tree-title', () => {
      this.dcnode()
    })
  },
  beforeDestroy() {
    $('.ivu-tree').off('dblclick.tree')
  },
  methods: {
    filterSearch() {
      if (!this.searchkey) {
        this.baseData = this.copyData()
      } else {
        const data = this.copyData()
        this.checkKey(this.searchkey, { title: '', children: data })
        this.baseData = this.filterData({ root: true, children: data })
      }
    },
    copyData() {
      return JSON.parse(JSON.stringify(this.dataBK))
    },
    toBaseData() {
      this.dataBK = JSON.parse(JSON.stringify(this.data))
      this.baseData = this.dataBK
    },
    filterData(obj) {
      const arr = obj.children
      if (!arr) { return [] }
      const farr = arr.filter(item => item.ck)
      if (farr.length) {
        obj.children = farr
      } else {
        if (obj.root) {
          return []
        }
      }
      obj.expand = true
      obj.children.forEach(item => this.filterData(item))
      return obj.children
    },
    checkKey(key, node) {
      if (node.children && node.children.length) {
        // ck-> contains key
        let ck = false
        node.children.forEach(item => {
          if (this.checkKey(key, item)) {
            ck = true
          }
        })
        node.ck = node.title.indexOf(key) !== -1 || ck
      } else {
        node.ck = node.title.indexOf(key) !== -1
      }
      return node.ck
    },
    cnode(node) {
      if (node.length) {
        this.choosedNode = node
      }
      this.$emit('on-click', this.choosedNode)
    },
    dcnode() {
      this.$emit('on-dblclick', this.choosedNode)
    }
  }
}
</script>
