<template>
  <div class="BStreeNewSear" :style="scroll?'':'overflow-y: initial;'">
    <ul>
      <li v-for="(data, index) in resList" :key="index" @click="resClick(data, index)" @dblclick="resDbclick(data)" draggable="true" :class="classStyle(data, index)" @dragstart.stop="handleDragStart(data,$event)">
        <el-checkbox v-if="checkBox" @change="isCheck(data)"></el-checkbox>
        <span class="item" :title="setNodeTitle(data)"><i class='iconfont' :class="[getNodeIcon(data).class]" :title="getNodeIcon(data).title" :style="(mapSpecial==='2D'&&data.point)||(mapSpecial==='3D'&&data.point3D)?'color:#25790f;':''"></i> {{data.name}}</span>
        <span class="right-btn center-video" v-if="iconToggle&&centerVideoIds.includes(data._id)">
          <i class="iconfont icon-zhongxinluxiang" title="中心录像" ></i>
        </span>
        <span class="right-btn" v-if="iconToggle">
          <i class="iconfont icon-preview" v-if="iconRight.includes('preview')" title="开启预览" @click="$emit('previewData', data)"></i>
          <i class="iconfont icon-collection" v-if="iconRight.includes('collect')" title="收藏" @click="$emit('favData', data)"></i>
        </span>
        <span class="right-btn" v-if="!iconToggle&&delIcon&&(mapSpecial==='2D'&&data.point)||(mapSpecial==='3D'&&data.point3D)">
          <i class="iconfont icon-delete" title="删除" @click="$emit('delData', data)"></i>
        </span>
      </li>
      <li v-if="!resList.length&&!isSearching">{{noData}}</li>
      <Spin size="large" fix style="height: 100px;background: none;" v-if="!resList.length&&isSearching"></Spin>
    </ul>
  </div>
</template>

<script>
import { getNodeIcon } from './commonMethods.js'
export default {
  name: 'BStreeNewSear',
  props: {
    orgType: {
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
      type: Array,
      default: () => {
        return [0]
      }
    },
    rootId: {
      type: String,
      default: ''
    },
    checkBox: {
      type: Boolean,
      default: false
    },
    iconToggle: {
      type: Boolean,
      default: true
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
    resourceToggle: {
      // 是否显示资源，true-显示；false-不显示
      type: Boolean,
      default: false
    },
    equipmentToggle: {
      type: Boolean,
      default: false
    },
    scroll: {
      // 是否滚动
      type: Boolean,
      default: true
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
    }
  },
  data() {
    return {
      resList: [],
      noData: '',
      isSearching: false,
      checkedIds: [],
      activeRes: '',
      curNodeId: '',
      ischeck: [],
      number: '',
      getvideoOrg: null,
      newFieldVal: '' // 为监听加入字段实时改变
    }
  },
  methods: {
    // class样式
    classStyle(item, index) {
      return `${this.getPlayingId(item)}${this.active(index)}`
    },
    // 点击样式
    active(index) {
      if (this.number === index) {
        return ' active'
      }
      return ''
    },
    // 机构树 在线/离线/停用/播放 样式
    getPlayingId(data) {
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
    // 复选框
    isCheck(data) {
      data.ischeck = !data.ischeck
      if (data.ischeck) {
        this.ischeck.push(data)
      } else {
        this.ischeck.splice(this.ischeck.indexOf(data), 1)
      }
      this.$emit('checksData', this.ischeck)
    },
    // 单击
    resClick(data, index) {
      this.number = index
      this.active()
      this.curNodeId = data._id
      this.$emit('clickData', data)
    },
    // 双击
    resDbclick(data) {
      if (data.tierType === 'res') {
        this.$emit('dbclickData', data)
      }
    },
    // title的name
    setNodeTitle(data) {
      if (data.tierType === 'res') {
        if (data.eid.ip) {
          return `${data.name}\nIP:${data.eid.ip}`
        } else {
          return data.name
        }
      } else {
        return data.name
      }
    },
    // 查询数据
    _searchRes(data) {
      this.ischeck = []
      this.noData = ''
      this.isSearching = true
      let url = `onetree/seek?`
      if (this.resourceToggle) {
        // 搜索资源
        url += `&restype=${this.resType.join(',')}&resseek=${encodeURIComponent(data)}&orgtype=${this.orgType}`
      } else {
        // 搜索机构
        url += `&orgtype=${this.orgType}&orgseek=${encodeURIComponent(data)}`
      }
      if (this.newFieldVal !== '') {
        url += this.newFieldVal
      }
      this.$http
        .get(url)
        .then(res => {
          // if (this.checkBox) {
          //   for (let item of res.data) {
          //     item.ischeck = false
          //   }
          // }
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
    },
    // 图标
    getNodeIcon(item) {
      return getNodeIcon(item)
    },
    // 拖拽
    handleDragStart(data, event) {
      event.dataTransfer.setData('Text', JSON.stringify(data))
      this.$emit('dragData', JSON.parse(JSON.stringify(data)))
    }
  },
  watch: {
    resList(val) {
      console.log('resList', val)
    },
    newField: {
      handler(val) {
        this.newFieldVal = val
      },
      immediate: true
    }
  },
  updated() {
    this.$emit('on-expand')
  },
  mounted() {
    // debounce 使一个函数一定时间只执行一次
    this.searchRes = this.$lodash.debounce(this._searchRes.bind(this), 1000)
  },
  beforeDestroy() {
    this.searchRes = null
  }
}
</script>

<style scoped>
.BStreeNewSear {
  height: 100%;
  overflow-y: auto;
  margin-right: 6px;
}
.BStreeNewSear::-webkit-scrollbar-track {
  border-radius: 5px;
}
.BStreeNewSear::-webkit-scrollbar-track-piece {
  background-color: #14284b;
}
.BStreeNewSear::-webkit-scrollbar-thumb {
  background-color: #657ca8;
  border-radius: 5px;
}
.BStreeNewSear > ul {
  width: 100%;
  height: 100%;
  position: relative;
}
.BStreeNewSear > ul li {
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
}
.BStreeNewSear > ul li:hover {
  background: #20365c;
}
.BStreeNewSear > ul li.playing {
  color: #4699f9;
}
.BStreeNewSear > ul li.online {
  /* 在线 */
  color: #fff;
}
.BStreeNewSear > ul li.outline {
  /* 离线 */
  color: rgb(79, 98, 129);
}
.BStreeNewSear > ul li.off {
  /* 停用 */
  color: gold;
}
.BStreeNewSear > ul li .item {
  width: calc(100% - 20px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
}
.BStreeNewSear > ul li .item > i {
  vertical-align: middle;
}
li .el-checkbox {
  left: 5px;
  top: -12px;
  margin-right: 10px;
}
.BStreeNewSear > ul > li > .el-checkbox + .item {
  width: calc(100% - 30px);
}
li .right-btn {
  position: absolute;
  right: 5px;
  display: none;
  padding: 0 3px;
  background: #1b3153;
  /* color: #fffafa; */
}
li .right-btn.center-video {
  background-color: #1b3153;
  display: inline;
}
li:hover .right-btn.center-video {
  display: none;
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
.added {
  color: #4996f9 !important;
  opacity: 1;
}
.BStreeNewSear li.active {
  background: #2a436a;
}
</style>
