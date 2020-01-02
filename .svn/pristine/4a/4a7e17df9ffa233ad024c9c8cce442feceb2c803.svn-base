<template>
  <ul class='searchResList'>
    <li v-for="(item, index) in resList" :key="index" @click="resClick(item)" @dblclick="resDbclick(item)" draggable="true" @dragstart.stop="handleDragStart(item,$event)" :class="{active: curNodeId===item._id,'add':(item.eid&&mapType==='3D'),'added': ((item.point3D || item.map3D)&&mapType==='3D'), offline: (!item.nodeId&&item.eid && item.status !== 1), playing: getPlayingId(item)}">
      <span class="item" :title="setNodeTitle(item)">
        <span class="checkbox" v-if="showCheckbox">
          <span class="ivu-checkbox" :class="{'ivu-checkbox-checked':checkedIds.includes(item._id)}" @click.stop="handlecheckedChange(item)"><span class="ivu-checkbox-inner"> </span>
          </span>
        </span>
        <i class='iconfont' :class="[getNodeIcon(item).class]" :title="getNodeIcon(item).title"></i> {{item.name}}</span>
      <span class="right-btn" v-if="($route.fullPath === '/play_video/realtime')">
        <i class="iconfont icon-preview" title="开启预览" @click="$emit('openPreviewClick', item)"></i>
        <i class="iconfont icon-collection" title="收藏" @click="$emit('collectionClick', item)"></i>
      </span>
    </li>
    <li v-if="!resList.length&&!isSearching">{{noData}}</li>
    <Spin size="large" fix style="height: 100px;background: none;" v-if="!resList.length&&isSearching"></Spin>
  </ul>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { getNodeIcon } from 'components/BStree/commonMethods.js'
export default {
  name: 'searchResList',
  components: {},
  props: {
    searchVal: {
      default: ''
    },
    type: {
      default: '0'
    },
    oid: String,
    mapType: String,
    storeyId: String,
    showCheckbox: Boolean
  },
  data() {
    return {
      resList: [],
      activeRes: '',
      curNodeId: '',
      isSearching: false,
      noData: '',
      checkedIds: []
    }
  },
  computed: {
    ...mapState({
      playingIds: ({ videoOrg }) => videoOrg.playingIds
    })
  },
  watch: {},
  methods: {
    ...mapActions(['getResSearch']),
    /**
     * 当前节点是否正在播放
     */
    getPlayingId(item) {
      if (item.eid) {
        let id = item._id + ''
        return id && this.playingIds.includes(id.split('_')[0])
      }
      return false
    },
    getNodeIcon(item) {
      return getNodeIcon(item)
    },
    resClick(item) {
      this.curNodeId = item._id
      this.$emit('resClick', item)
    },
    resDbclick(item) {
      this.$emit('resDbclick', item)
    },
    handleDragStart(item, event) {
      event.dataTransfer.setData('Text', JSON.stringify(item))
    },
    _searchRes(value) {
      if (value === '') {
        this.resList = []
        this.noData = ''
      } else {
        this.isSearching = true
        this.getResSearch({
          types: this.type,
          oid: this.oid,
          seek: encodeURIComponent(value),
          mapType: this.mapType,
          storeyId: this.storeyId
        })
          .then(res => {
            this.resList = res.data
            this.isSearching = false
            this.$emit('on-expand')
            if (!res.data.length) {
              this.noData = '无结果'
            }
          })
          .catch(err => {
            this.isSearching = false
            this.noData = '无结果'
            console.log(err)
          })
      }
    },
    handlecheckedChange(item) {
      const id = item._id
      if (!this.checkedIds.includes(id)) {
        this.checkedIds.push(id)
      } else {
        for (let index = 0; index < this.checkedIds.length; index++) {
          if (id === this.checkedIds[index]) {
            this.checkedIds.splice(index, 1)
            break
          }
        }
      }
    },
    getSelectedNodes() {
      if (!this.showCheckbox || !this.resList.length) {
        return []
      }
      let selectedNodes = []
      selectedNodes = this.resList.filter(item => this.checkedIds.includes(item._id))
      return selectedNodes
    },
    setNodeTitle(node) {
      return node.eid ? (node.eid.ip ? `${node.name}\nIP:${node.eid.ip}` : node.name) : node.name
    }
  },
  updated() {
    this.$emit('on-expand')
  },
  created() {},
  mounted() {
    this.searchRes = this.$lodash.debounce(this._searchRes.bind(this), 1000)
  },
  beforeDestroy() {
    this.searchRes = null
  }
}
</script>

<style scoped lang="less">
.searchResList {
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
    line-height: 34px;
    height: 36px;
    padding: 0 10px;
    &:hover {
      background: #20365c;
    }
    &.active {
      background: #2a436a;
      color: #fffafa;
    }
    &.offline {
      color: #4f6281;
    }
    &.playing {
      color: #4699f9;
    }
    .item {
      width: calc(~'100% - 20px');
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: inline-block;
    }
  }
}

li .right-btn {
  position: absolute;
  right: 5px;
  display: none;
  padding: 0 3px;
  background: #1b3153;
  // color: #fffafa;
}

li:hover .right-btn {
  display: inline;
  background: #20365c;
}

li.active .right-btn {
  background: #2a436a;
}

li .right-btn i {
  margin-left: 5px;
}

li .right-btn i:hover {
  color: #449af8;
}
.add {
  color: #4996f9 !important;
  opacity: 0.5;
}
.added {
  color: #4996f9 !important;
  opacity: 1;
}
</style>
