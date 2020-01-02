<template>
  <ul class="searchList">
    <li v-for="(item, index) in resList" :key="index" :class="{ 'active': item._id === curNodeId }" :style="{color: getNodeColor(item)}" @click="resClick(item)">
      <span class="item" :title="item.name"><i class='iconfont icon-qiangji1'></i> {{item.name}}</span>
    </li>
    <li v-if="!resList.length&&!isSearching">{{noData}}</li>
  </ul>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'searchList',
  props: {
    searchVal: {
      default: ''
    },
    oid: String,
    type: {
      default: '0'
    }
  },
  data() {
    return {
      resList: [],
      activeRes: '',
      curNodeId: '',
      isSearching: false,
      noData: ''
    }
  },
  mounted() {
    this.searchRes = this.$lodash.debounce(this._searchRes.bind(this), 1000)
  },
  beforeDestroy() {
    this.searchRes = null
  },
  watch: {
    searchVal(value) {
      this.resList = []
      this.searchRes(value)
    }
  },
  methods: {
    ...mapActions(['searchChannel', 'searchPassGroup']),
    resClick(item) {
      if (item.type === 'face') {
        item._id = item.id
      }
      this.curNodeId = item._id
      this.$emit('resClick', item)
    },
    _searchRes(value) {
      this.noData = ''
      if (/\s+/g.test(value)) {
        this.warningMsg('请输入关键字且不含空格')
        this.resList = []
        return
      }
      this.isSearching = true
      let resType = {}
      if (this.type === '6') {
        // 通行地库搜索接口与其他不同
        this.searchPassGroup({name: value}).then(res => {
          this.searchData(res)
        }).catch(err => {
          this.isSearching = false
          this.noData = '无结果'
          console.log(err.message)
        })
        return
      }
      switch (this.type) {
        case '0':
          resType = {resType: 0, type: 'video'}
          break
        case '1':
          resType = {resType: '1,9'}
          break
        case '2':
          resType = {resType: 11}
          break
        case '3':
          resType = {deviceType: 'alarmhelp', resType: 0}
          break
        case '5':
          resType = {faceType: '1'}
          break
      }
      this.searchChannel({
        seek: value,
        ...resType
      }).then(suc => {
        this.searchData(suc)
      }).catch(err => {
        this.isSearching = false
        this.noData = '无结果'
        console.log(err.message)
      })
    },
    searchData(suc) {
      this.resList = suc.data
      if (this.resList[0]) {
        this.resClick(this.resList[0])
      }
      this.isSearching = false
      if (!suc.data.length) { this.noData = '无结果' }
    },
    getNodeColor(node) {
      if (node.type === 'face') {
        node._id = node.id
      }
      return this.$parent.$parent.$parent.getNodeColor(node)
    }
  }
}
</script>

<style scoped lang="less">
.searchList {
  width: 100%;
  height: 100%;
  li {
    cursor: pointer;
    color: #fffafa;
    font-size: 12px;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 5px;
    position: relative;
    line-height: 36px;
    height: 36px;
    padding: 0 10px;
    &:hover {
      background: #20365c;
    }
    &.active{
      background: #2a436a;
      color: #fffafa;
    }
    &.offline {
      color: #4f6281;
    }
    .item{
      width: calc(~'100% - 20px');
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: inline-block;
      border-bottom: 1px solid rgba(58, 90, 139, 0.4);
    }
  }
}
</style>
