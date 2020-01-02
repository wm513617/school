<template>
  <div class="case-tree">
    <el-tree ref="tree" class="eltree" :data="treeData" :props="defaultProps" node-key="_id" @node-click="nodeClick" default-expand-all highlight-current :expand-on-click-node="false" :filter-node-method="filterNode">
      <p class="tree-item" @dblclick.stop="dblclick(node,data)" slot-scope="{ node, data }">
        <!-- 节点左侧图标 -->
        <span class="treeIcon leftIcon">
          <i v-if="type === 'caselist'" class="iconfont" :class="getCaseNodeIcon(data).class" :title="getCaseNodeIcon(data).title === '机构'?'':getCaseNodeIcon(data).title" ></i>
          <i v-else-if="type === 'tracklist'" class="iconfont" :class="getTrackNodeIcon(data).class" :title="getTrackNodeIcon(data).title === '机构'?'':getTrackNodeIcon(data).title" ></i>
        </span>
        <!-- 节点文字内容 -->
        <span v-if="type === 'caselist'" class="treeText" :class="getTextColor(node, data)" :title="setNodetext(node, data).title">{{ setNodetext(node, data).label }}</span>
        <span v-else-if="type === 'tracklist'" class="treeText" :title="setNodetext(node, data).title">{{ setNodetext(node, data).label }}</span>
        <!-- 根节点的【保存】、【关闭】按钮 -->
        <span class="treeIcon rightIcon" v-if="data.root" >
          <i class="iconfont icon-refresh" style="font-size: 18px;" title="关闭" @click.stop="close(node, data)"></i>
          <i class="iconfont icon-save" v-if="type === 'caselist'" :class="{'disabled': disabledSaveIcon ? isMarkFun(data) : true}" title="保存" @click.stop="saveVideo(node, data)"></i>
        </span>
      </p>
    </el-tree>
  </div>
</template>

<script>
/**
 * node-click 节点被点击时的回调
 * data 展示数据
 * props 配置选项
 * - label 指定节点标签为节点对象的某个属性值 string, function(data, node)
 * - children 指定子树为节点对象的某个属性值 string
 * default-expand-all 是否默认展开所有节点
 * highlight-current 是否高亮当前选中节点，默认值是 false。
 * node-key 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
 * expand-on-click-node 是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。
 */
import { Tree } from 'element-ui'
import { getCaseNodeIcon, getTrackNodeIcon } from '@src/components/BStreeNew/commonMethods.js'
export default {
  name: 'case-tree',
  components: {
    'el-tree': Tree
  },
  props: {
    // 获得的数据
    treeData: {
      type: Array
    },
    // 使用的类型
    type: {
      type: String
    },
    // 搜索内容
    search: {
      type: [String, Number, Boolean]
    },
    // 是否禁用【保存】按钮
    disabledSaveIcon: {
      type: [String, Number, Boolean]
    }
  },
  data() {
    return {
      // 机构树，配置选项
      defaultProps: {
        children: 'resource',
        label: 'eventName'
      },
      checkList: [] // 复选框选中项
    }
  },
  watch: {
    type(val) {
      if (val === 'caselist') {
      } else if (val === 'tracklis') {
      }
    },
    search(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 监听机构树上的资源是否设置了绘制了【案件录像】
    getTextColor(node, data) {
      if (node.level === 3) {
        for (let item of this.treeData[0].resource[0].resourceList) {
          if (item.resource === data._id && item.tagTime.length) {
            return 'haveData'
          }
        }
      }
      return ''
    },
    // 案件列表图标
    getCaseNodeIcon(item) {
      return getCaseNodeIcon(item)
    },
    // 追踪列表图标
    getTrackNodeIcon(item) {
      return getTrackNodeIcon(item)
    },
    // 过滤节点文字内容
    setNodetext(node, data) {
      let _d = {
        title: '',
        label: ''
      }
      if (this.type === 'caselist') {
        if (node.level === 1) {
          _d.title = data.eventName
          _d.label = data.eventName
        } else if (node.level === 2) {
          _d.title = data.eventName + ' — ' + data.person
          _d.label = data.eventName + ' — ' + data.person
        } else {
          _d.title = data.ip ? `${data.name}\nIP:${data.ip}` : data.name
          _d.label = data.name
        }
      } else if (this.type === 'tracklist') {
        if (node.level < 5) { // 节点名 || 事件名
          _d.title = data.eventName || data.name
          _d.label = data.eventName || data.name
        } else { // 资源
          _d.title = data.resource.name
          _d.label = data.resource.name
        }
      }
      return _d
    },
    // 判断是否修改
    isMarkFun(data) {
      if (
        !data ||
        !data.resource.length ||
        !data.resource[0].resourceList.length ||
        !data.resource[0].resourceList[0].tagTime
      ) {
        return true
      }
      let a = 0
      let b = 0
      for (let item of data.resource[0].resourceList) {
        a++
        if (item.tagTime.length) {
          b++
        }
      }
      if (!b) {
        // 若无修改则禁用
        return true
      } else if (a === b && a !== 0) {
        // 若都修改，且不为0时，则可用
        return false
      } else if (b) {
        // 若有修改 则可用
        // return false
      }
    },
    // el-tree 筛选
    filterNode(value, data, node) {
      // 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
      // 没有输入时全部显示
      if (!value) {
        return true
      }
      // 有查找到时，显示事件和资源
      if (node.level === 3) { // 显示事件
        let _data = data.name || data.eventName
        return _data.indexOf(value) !== -1
      } else if (node.level === 5) { // 显示资源
        let _data = node.parent.parent.data.name || node.parent.parent.data.eventName
        return _data.indexOf(value) !== -1
      }
      // 没有查找到时，显示1-2级机构树
      if (node.level === 2) {
        return true
      }
    },
    // 单击
    nodeClick(data, node, dom) {
      this.$emit('nodeClick', [node, data])
      // console.log('data', JSON.parse(JSON.stringify(data)))
      // console.log('node', node)
    },
    // 双击
    dblclick(node, data) {
      if (node.level > 2) {
        this.$emit('dblclickData', [node, data])
      }
    },
    // 关闭
    close() {
      this.$emit('close')
    },
    // 保存录像
    saveVideo(node, data) {
      if (node.level === 1) {
        if (this.disabledSaveIcon ? true : this.isMarkFun(data)) {
          this.$emit('saveVideo')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.case-tree {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  background-color: transparent;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    border-radius: 5px;
  }
  &::-webkit-scrollbar-track-piece {
    background-color: #14284b;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #657ca8;
    border-radius: 5px;
  }
  * {
    font-size: 13px;
  }
  // el-tree 树的样式
  .el-tree {
    /* 树的背景颜色 */
    background-color: transparent;
    width: 100%;
    &::-webkit-scrollbar-track {
      border-radius: 5px;
    }
    &::-webkit-scrollbar-track-piece {
      background-color: #14284b;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #657ca8;
      border-radius: 5px;
    }
    & /deep/ .el-tree-node {
      position: relative;
      .el-tree-node__content {
        /* item的高度 */
        background-color: transparent;
        height: 36px;
        position: relative;
        .el-icon-caret-right {
          font-size: 18px;
          color: #fff;
          &.is-leaf {
            color: transparent;
          }
        }
        &:hover {
          /* 树的鼠标移入样式 */
          background-color: #2a436a;
          & .treeText {
            color: #449af8;
          }
        }
        &::after {
          /* 分割线 */
          content: '';
          display: block;
          position: absolute;
          width: 90%;
          height: 0;
          border-top: 1px solid #3a5a8b66;
          bottom: 0;
          left: 50%;
          margin-left: -45%;
        }
      }
      /* 选中的样式 */
      &.is-current > .el-tree-node__content {
        background-color: #2a436a;
        .treeText {
          color: #449af8;
        }
      }
    }
    // 在el-tree上添加的东西
    .tree-item {
      /* 树的图标和文字的公共样式 */
      background-color: transparent;
      color: #fff;
      line-height: 20px;
      padding: 3px 0;
      text-align: left;
      vertical-align: middle;
      -webkit-font-smoothing: antialiased;
      -webkit-tap-highlight-color: #fff;
      width: 100%;
      width: calc(~'100% - 31px');
      // 图标的公共样式
      .treeIcon {
        display: inline-block;
        text-decoration: none;
        border-radius: 3px;
        i {
          font-size: 14px;
        }
      }
      // 左侧图标
      .leftIcon {
        padding-right: 3px;
      }
      // 右侧图标
      .rightIcon {
        float: right;
        margin-right: 7px;
        i {
          padding: 0 3px;
          &:hover {
            color: #449af8;
          }
        }
        .disabled {
          cursor: not-allowed;
          color: #9298a4;
        }
      }
      // 树的文字样式
      .treeText {
        display: inline-block;
        user-select: none;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: sub;
        max-width: calc(~'100% - 30px');
        &.haveData {
          color: green;
        }
      }
    }
  }
}
</style>
