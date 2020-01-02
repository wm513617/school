<template>
  <ul class="treeul">
    <li v-for='(item, i) in nodeList' v-show="item.visible&&!item.isapi" :key="i" :class="[((item.children && item.children.length > 0)||item.creator||!('eid' in item)) ? '':'leaf', !item.nodeId&&(item.eid && item.status !== 1) ? 'offline': '' ]" :draggable="(!item.children&&('eid' in item))||item.creator" @dragstart.stop="handleDragStart(item,$event)" @dblclick="dblclickNode(item)">
      <span class="treeliBox" :class="[item._id==activeId?'active':'',getPlayingId(item._id)?'playing':'',getAlarmId(item._id)?'alarm':'']" @click="handleNode(item, i, nodeData)">

        <div class="jiexian" v-if="nodeData.length !==(i+1)&&item._id!==activeId"></div>

        <span :style="{'width':left + 'px','height':'100%'}" class="suojin"></span>

        <i v-if="isArrow(item)" @click.stop='handleNodeExpand(item)' class="openflag" :class="[item.open? 'tree-open':'tree-close','icon']">
          <Icon type="arrow-down-b" v-if='item.open'></Icon>
          <Icon type="arrow-right-b" v-if='!item.open'></Icon>
        </i>
        <!--无子节点缩进对齐-->
        <span style="width:14px;" v-if="!isArrow(item)" class="orgsj"></span>

        <!--选择框-->
        <span v-if='options.showInput' class="checkbox">
          <span class="ivu-checkbox" :class="{'ivu-checkbox-checked':item.checked,'ivu-checkbox-indeterminate':item.nodeSelectNotAll}" v-if="options.showCheckbox&&options.halfCheckedStatus" @click.stop="handlecheckedChange(item)">
            <span class="ivu-checkbox-inner"> </span>
          </span>
          <!-- <input type="checkbox" class="check" :class="{notAllNodes:item.nodeSelectNotAll}" v-if="options.showCheckbox&&options.halfCheckedStatus" v-model='item.checked' @click.stop="handlecheckedChange(item)" style="opacity: 0;margin-left: -15px;" /> -->

          <span class="ivu-checkbox" :class="{'ivu-checkbox-checked':item.checked}" v-if="options.showCheckbox&&!options.halfCheckedStatus" @click.stop="handlecheckedChange(item)">
            <span class="ivu-checkbox-inner"> </span>
          </span>
          <!-- <input type="checkbox" class="check" v-if="options.showCheckbox&&!options.halfCheckedStatus" v-model='item.checked' @click.stop="handlecheckedChange(item)" style="opacity: 0;margin-left: -15px;" /> -->
        </span>
        <!--文件夹/摄像头图标-->
        <!--<span v-if="(item.children && item.children.length > 0&&options.showFolder)||item.creator"><i class='iconfont icon-organise'></i></span>-->
        <span class="folder" v-if="options.showFolder||item.creator">
          <!-- <span v-if="!item.children&&('eid' in item)"> -->
          <span v-if="item.type === 0 || item.hasOwnProperty('monitortype')" :class="{'iconIsOuter':mapStore(item)}">
            <i class='iconfont icon-Tree-DVR-CH' v-if="item.eid&&item.eid.type === 'nvr'" title="NVR" style="font-size: 12px"></i>
            <i class='iconfont icon-alarm-input' v-else-if="item.eid&&item.eid.type === 1" title="报警输入"></i>
            <i class='iconfont icon-baojingzhu1' v-else-if="item.eid&&item.eid.type === 'alarmPillar'" title="报警柱"></i>
            <i class='iconfont icon-baojingxiang2' v-else-if="item.eid&&item.eid.type === 'alarmBox'" title="报警箱"></i>
            <i class='iconfont icon-qiangji' v-else-if="(item.monitoryPointGenera === 0 || item.monitoryPointGenera === undefined) && item.monitortype === 0" title="枪机" ></i>
            <i class='iconfont icon-hongwaiqiangji' v-else-if="(item.monitoryPointGenera === 0 || item.monitoryPointGenera === undefined) && item.monitortype === 1" title="红外枪机"></i>
            <i class='iconfont icon-banqiu' v-else-if="(item.monitoryPointGenera === 0 || item.monitoryPointGenera === undefined) && item.monitortype === 2" title="半球"></i>
            <i class='iconfont icon-kuaiqiu' v-else-if="(item.monitoryPointGenera === 0 || item.monitoryPointGenera === undefined) && item.monitortype === 3" title="快球"></i>
            <i class='iconfont icon-quanjing' v-else-if="(item.monitoryPointGenera === 0 || item.monitoryPointGenera === undefined) && item.monitortype === 4" title="全景"></i>
            <i class='iconfont icon-renxiangshibie' v-else-if="item.monitoryPointGenera === 1" title="人脸抓拍"></i>
            <i class='iconfont icon-jiaotongshibie' v-else-if="item.monitoryPointGenera === 2" title="交通抓拍"></i>
            <i class='iconfont icon-video-gun' v-else title="枪机" ></i>
          </span>
          <span v-else-if="item.type === 1" :class="{'iconIsOuter':mapStore(item)}">
            <i class='iconfont icon-alarm-input' title="报警输入"></i>
            <!-- <i class='iconfont icon-baojing-xian' v-else-if="item.mapsign && item.mapsign.signtype === 1" title="报警输入线"></i>
            <i class='iconfont icon-baojing-mian' v-else-if="item.mapsign && item.mapsign.signtype === 2" title="报警输入区域"></i> -->
          </span>
          <span v-else-if="item.type === 4" :class="{'iconIsOuter':mapStore(item)}">
            <i class='iconfont icon-menjin1' title="门禁"></i>
            <!-- <i class='iconfont icon-baojing-xian' v-else-if="item.mapsign && item.mapsign.signtype === 1" title="报警输入线"></i>
            <i class='iconfont icon-baojing-mian' v-else-if="item.mapsign && item.mapsign.signtype === 2" title="报警输入区域"></i> -->
          </span>
          <span v-else-if="item.type === 9" :class="{'iconIsOuter':mapStore(item)}">
            <i class='iconfont icon-baojingzhuji' title="报警主机"></i>
            <!-- <i class='iconfont icon-baojing-xian' v-else-if="item.mapsign && item.mapsign.signtype === 1" title="报警主机线"></i>
            <i class='iconfont icon-baojing-mian' v-else-if="item.mapsign && item.mapsign.signtype === 2" title="报警主机区域"></i> -->
          </span>
          <span v-else-if="item.type === 11" :class="{'iconIsOuter':mapStore(item)}">
            <i class='iconfont icon-xiaofangcailiao' title="消防报警"></i>
            <!-- <i class='iconfont icon-baojing-xian' v-else-if="item.mapsign && item.mapsign.signtype === 1" title="消防报警线"></i>
            <i class='iconfont icon-baojing-mian' v-else-if="item.mapsign && item.mapsign.signtype === 2" title="消防报警区域"></i> -->
          </span>
          <span v-else-if="item.alarmEid">
            <i class='iconfont icon-qiangji1' title="报警通道"></i>
          </span>
          <span v-else-if="item.laneNumber">
            <i class='iconfont icon-intersection' title="路口"></i>
          </span>
          <span v-else-if="('direction' in item)">
            <i class='iconfont icon-roadway' title="车道"></i>
          </span>
          <span v-else-if="('equip' in item)">
            <i class='iconfont icon-equipment' title="设备"></i>
          </span>
          <span v-else-if="('powerType' in item)">
            <i class='iconfont icon-jurisdiction' title="权限"></i>
          </span>
          <span v-else-if="(item.affiliation && !item.type)"></span>
          <span v-else :class="{'iconIsOuter':mapStore(item)}">
            <i class='iconfont icon-grid' v-if="item.type === 'grid'" title="网格"></i>
            <i class='iconfont icon-loufangdianwei' v-else-if="item.type === 'building'" title="楼宇"></i>
            <i class='iconfont icon-tuceng' v-else-if="item.type === 'storey'" title="楼层"></i>
            <i class='iconfont icon-dianzixungeng' v-else-if="item.type === 'patrol'" title="巡更点位"></i>
            <i class='iconfont icon-organise' v-else title="机构"></i>
          </span>
        </span>

        <!--node节点-->
        <span class="item" :class="{'node-selected':(item.checked && !options.showCheckbox) || item.searched, 'active':item._id==activeId,'nodeItem': !item.children&&(options.showOpenPreview||options.showCollection||options.showDelete)&&('eid' in item)}" :title="setNodeTitle(item)">{{item.name}}</span>

        <!--父节点操作按钮-->
        <span class="operat parent" v-if="((item.children && item.children.length > 0)&&(options.showOpenAllPreview||options.showEdit||options.showDelete))&&(hasChildren (item)||('tag' in item))||item.creator">
          <span v-show="options.showOpenAllPreview && item.children.length > 0" @click.stop="openAllPreviewClick(item)">
            <i class='iconfont' :title="isPoll(item)?'关闭轮巡':(item.ispolling&&item.ispolling==='true'?'开启轮巡':'开启所有预览')" :class="isPoll(item)?'icon-polling-stop':(item.ispolling&&item.ispolling==='true'?'icon-polling':'icon-preview-all')"></i>
          </span>
          <span v-show="options.showEdit" @click.stop="editClick(item)">
            <i class='iconfont icon-edit' title="编辑"></i>
          </span>
          <span v-show="options.showDelete" @click.stop="deleteClick(item)">
            <i class='iconfont icon-delete' title="删除"></i>
          </span>
        </span>
        <!--子节点操作按钮-->
        <span class="operat children" v-if="!item.children&&(((options.showOpenPreview||options.showCollection||options.showDelete)&&('eid' in item))||mapStore(item))">
          <!-- <span v-show="options.showOpenPreview" @click.stop="openPreviewClick(item)">
                <i class='iconfont'
                :class="[options.showOpenPreview&&getPlayingId(item._id)?'icon-preview-stop':'icon-preview']"
                :title="options.showOpenPreview&&getPlayingId(item._id)?'关闭预览':'开启预览'"></i>
              </span> -->
          <span v-show="options.showOpenPreview" @click.stop="openPreviewClick(item)">
            <i class='iconfont icon-preview' title="开启预览"></i>
          </span>
          <span v-show="options.showCollection" @click.stop="collectionClick(item)">
            <i class='iconfont icon-collection' title="收藏"></i>
          </span>
          <span v-show="options.showDelete" @click.stop="deleteClick(item)">
            <i class='iconfont icon-delete' title="删除"></i>
          </span>
          <span v-show="mapStore(item)" @click.stop="deleteClick(item)">
            <i class='iconfont icon-delete' title="删除"></i>
          </span>
        </span>

      </span>
      <tree-node v-if="item.children && item.children.length > 0 && item.open" :options="options" @handlecheckedChange="handlecheckedChange" @handlechecked="handlechecked(item)" v-show='item.visible' :tree-data="item.children" :activeId="activeId" :playingIds="playingIds" :alarmIds="alarmIds" :paddingLeft="left"></tree-node>
    </li>
  </ul>
</template>
<script>
// import $ from 'jquery'
export default {
  name: 'treeNode',
  props: {
    treeData: {
      type: Array
    },
    playingIds: {
      type: Array,
      default: () => {
        return []
      }
    },
    alarmIds: {
      type: Array,
      default: () => {
        return []
      }
    },
    options: {
      type: Object
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
    paddingLeft: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      // nodeData: []
      nodeList: [],
      nodeAllnum: 0,
      nodeCurNum: 0
    }
  },
  watch: {
    treeData: {
      deep: true,
      handler: function(data) {
        if (!this.tree.checkedClick || !this.options.showInput) {
          if (this.timer) {
            clearTimeout(this.timer)
          }
          this.nodeAllnum = this.treeData.length
          this.nodeList = []
          for (let i = 0; i < 40; i++) {
            if (i < this.nodeAllnum) {
              this.$set(this.nodeList, i, this.treeData[i])
            }
          }
          this.nodeCurNum = this.nodeList.length
          this.lazyLoading()
          this.$forceUpdate()
        }
      }
    }
  },
  computed: {
    nodeData() {
      if (this.options.moreRoot) {
        return this.treeData
      } else {
        return (this.treeData || []).slice(0)
      }
    },
    left() {
      return this.paddingLeft + 10
    }
  },
  methods: {
    mapStore(item, options = this.options) {
      return (
        (item.point && options.showPoint === '2d') || ((item.point3D || item.point3d) && options.showPoint === '3d')
      )
    },
    handleNodeExpand(node) {
      this.$parent.checkedClick = true
      node.open = !node.open
      this.tree.$emit('handleNodeExpand', node)
    },
    handlecheckedChange(node) {
      this.loopSetChecked(node, !node.checked)
      // this.$emit('handlecheckedChange', node)
      this.$emit('handlechecked', node)
    },
    handlechecked(item) {
      if (item.children) {
        const childLength = item.children.length
        const checkedLength = item.children.filter(({ checked }) => checked === true).length // 子节点选中的个数
        const noCheckedLength = item.children.filter(({ checked }) => checked === false).length // 子节点未选中的个数

        if (checkedLength === childLength) {
          item.checked = true
          item.nodeSelectNotAll = false
        } else if (noCheckedLength === childLength) {
          item.checked = false
          item.nodeSelectNotAll = false
          // 如果子节点都没选中，再次查找子节点有没有半选状态
          if (item.children.filter(({ nodeSelectNotAll }) => nodeSelectNotAll).length) {
            item.nodeSelectNotAll = true
          }
        } else {
          item.checked = false
          item.nodeSelectNotAll = true
        }
      }
      return this.$emit('handlechecked')
    },
    loopSetChecked(item, checked) {
      // 遍历所有子节点是否选中
      item.checked = checked
      item.nodeSelectNotAll = false
      if (item.children) {
        item.children.forEach(item => this.loopSetChecked(item, checked))
      }
    },
    handleNode(node, i, nodeData) {
      if (node.children && node.children.length > 0 && !node.open) {
        this.handleNodeExpand(node)
      }
      if (this.tree.store.last) {
        if (this.tree.store.last._id === node._id) {
          // this.tree.store.last.checked = !this.tree.store.last.checked
        } else {
          // // this.tree.store.last.checked = false
          // node.checked = true
          this.tree.store.last = node
        }
      } else {
        this.tree.store.last = node
        // node.checked = true
      }
      let parent = null
      if (!('eid' in node) && !node.isroot) {
        if (!this.$parent.nodeData) {
          parent = null
        } else {
          this.$parent.nodeData.forEach(item => {
            if (item._id === node.pid) {
              parent = item
            }
          })
        }
      }
      let obj = {
        index: i,
        isroot: node.isroot,
        parent: parent,
        previousNode: i - 1 < 0 ? null : nodeData[i - 1],
        nextNode: i + 1 >= nodeData.length ? null : nodeData[i + 1]
      }
      this.tree.$emit('node-click', node, obj)
    },
    dblclickNode(node) {
      if (!node.children) {
        this.tree.$emit('node-dblclick', node)
      }
    },
    openPreviewClick(node) {
      this.tree.$emit('openPreviewClick', node)
    },
    openAllPreviewClick(node) {
      this.tree.$emit('openAllPreviewClick', node)
    },
    collectionClick(node) {
      this.tree.$emit('collectionClick', node)
    },
    deleteClick(node) {
      this.tree.$emit('deleteClick', node)
    },
    editClick(node) {
      this.tree.$emit('editClick', node)
    },
    handleDragStart(item, e) {
      e.dataTransfer.setData('Text', JSON.stringify(item))
    },
    getPlayingId(id) {
      id = id + ''
      return id && this.playingIds.includes(id.split('_')[0])
      // for (let i = 0; i < this.playingIds.length; i++) {
      //   if (id.split('_')[0] === this.playingIds[i]) {
      //     return true
      //   }
      // }
      // return false
    },
    getAlarmId(id) {
      for (let i = 0; i < this.alarmIds.length; i++) {
        if (id === this.alarmIds[i]) {
          return true
        }
      }
      return false
    },
    isArrow(item) {
      if (item.children && item.children.length > 0) {
        for (let i = 0; i < item.children.length; i++) {
          if (item.children[i]._id && !item.children[i].isapi) {
            return true
          }
        }
        return false
      } else if (item.creator) {
        return true
      } else {
        return false
      }
    },
    isPoll(item) {
      if (item._id === this.pollId) {
        return true
      } else {
        for (const i in this.pollingId) {
          if (this.pollingId[i].id === item._id) {
            return true
          }
        }
      }
      return false
    },
    hasChildren(item) {
      if (item.children && item.children.length > 0) {
        for (let i = 0; i < item.children.length; i++) {
          if ('eid' in item.children[i]) {
            return true
          }
        }
        return false
      }
      return false
    },
    loadMore() {
      if (this.nodeCurNum >= this.nodeAllnum) {
        return
      }
      for (let i = this.nodeCurNum; i < this.nodeCurNum + 30; i++) {
        if (i < this.nodeAllnum) {
          this.$set(this.nodeList, i, this.treeData[i])
        }
      }
      this.nodeCurNum = this.nodeList.length
      this.lazyLoading()
      this.tree.$emit('loadMore')
    },
    lazyLoading() {
      if (this.nodeCurNum >= this.nodeAllnum) {
        return
      }
      this.timer = setTimeout(() => {
        this.loadMore()
      }, 1000)
    },
    setNodeTitle(node) {
      return node.eid ? (node.eid.ip ? `${node.name}\nIP:${node.eid.ip}` : node.name) : node.name
    }
  },
  created() {
    this.nodeAllnum = this.treeData.length
    this.nodeList = []
    for (let i = 0; i < 40; i++) {
      if (i < this.nodeAllnum) {
        this.$set(this.nodeList, i, this.treeData[i])
      }
    }
    this.nodeCurNum = this.nodeList.length
    this.lazyLoading()
    const parent = this.$parent
    if (parent.isTree) {
      this.tree = parent
    } else {
      this.tree = parent.tree
    }

    const tree = this.tree
    if (!tree) {
      console.warn('找不到树节点')
    }

    this.tree.$emit('creatTreeStart', this.treeData.length)
    // if (this.options.moreRoot) {
    //   this.nodeData = this.treeData
    // } else {
    //   this.nodeData = (this.treeData || []).slice(0)
    // }
  },
  mounted() {
    this.tree.$emit('creatTreeEnd')
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  }
}
</script>
<style scoped>
li:hover {
  cursor: pointer;
}

.halo-tree li.offline .treeliBox .folder i.iconfont,
.offline span {
  color: #4f6281;
}

.treeul .treeliBox {
  display: block;
  color: #fffafa;
  font-size: 12px;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 5px;
  position: relative;
  line-height: 36px;
}

.treeul .treeliBox .jiexian {
  position: absolute;
  width: 90%;
  height: 0;
  border-top: 1px solid rgba(58, 90, 139, 0.4);
  /* border-bottom: 1px solid #263e69; */
  bottom: 0;
  left: 50%;
  margin-left: -45%;
}

.treeul .treeliBox:hover {
  background: #20365c;
}

.icon {
  display: inline-block;
  margin-right: 10px;
  vertical-align: middle;
  margin-bottom: 10px;
}

.halo-tree {
  font-size: 14px;
  min-height: 20px;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}

.node-selected,
li .treeliBox > span.active.node-selected {
  background-color: #00a5e3;
  color: #fff;
}

.halo-tree li .treeliBox.active,
.halo-tree li.leaf .treeliBox.active,
.halo-tree li .treeliBox.active .folder i {
  background: #2a436a;
  color: #fffafa;
}

.halo-tree li .treeliBox.playing,
.halo-tree li.leaf .treeliBox.playing,
.halo-tree li .treeliBox.playing .folder i {
  color: #4699f9;
}

.halo-tree li .treeliBox.alarm,
.halo-tree li.leaf .treeliBox.alarm,
.halo-tree li .treeliBox.alarm .folder i {
  color: red;
}

.halo-tree li {
  margin: 0;
  position: relative;
  list-style: none;
}

.halo-tree li .treeliBox > span,
.halo-tree li .treeliBox > i,
.halo-tree li .treeliBox > a {
  line-height: 20px;
  vertical-align: middle;
}

.halo-tree li .treeliBox > span.checkbox {
  padding-top: 0;
}

.halo-tree li .treeliBox > i {
  text-align: center;
  font-size: 16px;
}

.halo-tree li .treeliBox > .operat {
  float: right;
  padding: 0;
  padding-right: 6px;
  line-height: 22px;
  position: absolute;
  top: 3px;
  right: 2px;
  display: none;
  background: none;
}

.halo-tree li .treeliBox > .operat > * {
  margin-top: 2px;
}

.halo-tree li .treeliBox > .operat .iconfont {
  margin-right: 2px;
}

.halo-tree li .treeliBox:hover > .operat {
  display: inline;
  background: #20365c;
}

.halo-tree li:hover > .treeliBox > .operat.parent {
  display: inline;
}

.halo-tree li:hover > .treeliBox.active > .operat.parent {
  background: none;
  background: #2a436a;
}

.halo-tree li .treeliBox.active:hover > .operat {
  background: #2a436a;
}

.halo-tree li .treeliBox > .operat i:hover {
  color: #449af8;
}

.halo-tree li:after,
.halo-tree li:before {
  content: '';
  left: -8px;
  right: auto;
  border-width: 1px;
}

.halo-tree li:before {
  bottom: 50px;
  height: 100%;
  top: -8px;
  width: 1px;
}

.halo-tree li:after {
  height: 20px;
  top: 17px;
  width: 12px;
}

.halo-tree li .treeliBox span {
  display: inline-block;
  padding: 3px 0px;
  text-decoration: none;
  border-radius: 3px;
}

.nodeItem,
.halo-tree li .treeliBox span.item {
  width: calc(100% - 75px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.halo-tree li .treeliBox:hover .nodeItem {
  width: calc(100% - 120px);
}

.halo-tree li .treeliBox:last-child::before {
  height: 26px;
}

.halo-tree > ul {
  padding-left: 0;
}

.halo-tree li.leaf {
  background: #1b3153;
}

.halo-tree li.leaf:after {
  content: '';
  left: -8px;
  right: auto;
  border-width: 1px;
  height: 20px;
  top: 17px;
  width: 12px;
}

.check {
  display: inline-block;
  top: 4px;
}

.halo-tree .icon {
  margin-right: 0;
}

.tree-close {
  width: 14px;
  height: 14px;
}

.tree-open {
  width: 14px;
  height: 14px;
}

.search {
  width: 14px;
  height: 14px;
}

.check.notAllNodes {
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  width: 13px;
}

.ivu-icon {
  font-size: 18px !important;
}

.folder img {
  width: 14px;
  height: 14px;
}

.folder i {
  font-size: 14px;
  margin: 0 2px;
  color: #fffafa;
}

.folder .iconIsOuter i,
.halo-tree li.offline .treeliBox .folder .iconIsOuter i.iconfont {
  color: #25790f;
}
.folder .icon-qiangji1:before {
  font-size: 16px !important;
}
</style>
