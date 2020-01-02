<template>
  <div class="duty_tree">
    <el-input
      size="small"
      placeholder="输入关键字进行过滤"
      v-model="filterText"
      style="margin-bottom:5px"
       >
    </el-input>
    <el-tree
      :data="doorData"
      :highlight-current='true'
      empty-text="请先添加班组信息"
      node-key="id"
      :filter-node-method="filterNode"
      :expand-on-click-node="true"
       ref="teamTree"
      >
        <span  slot-scope="{node, data}" class="tree_content">
            <span>
              <span>{{data.title}}</span>
            </span>
            <span v-if="!data.isroot">
              <el-button style="font-size: 12px;" type="text"  @click='add(data)'>
                <span class="iconfont icon-add" ></span>
              </el-button>
              <el-button style="font-size: 12px;" type="text" @click="reduce(data)">
                <span class="iconfont icon-reduce"></span>
              </el-button>
            </span>
        </span>
    </el-tree>
  </div>
</template>

<script>
import Vue from 'vue'
import { Tree, Button } from 'element-ui'
Vue.component('el-tree', Tree)
Vue.component('el-button', Button)

export default {
  components: {},
  props: {
    doorData: {
      type: Array
    }
  },
  data() {
    return {
      filterText: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.teamTree.filter(val)
    },
    doorData(val) {
      // console.log(val, 'element')
    }
  },
  mounted() {},
  methods: {
    // 加
    add(data) {
      this.$emit('addData', data)
    },
    // 减
    reduce(data) {
      this.$emit('reduceData', data)
    },
    filterNode(value, data) {
      if (!value) {
        return true
      }
      return data.title.indexOf(value) !== -1
    }
  }
}
</script>
<style>
.duty_tree .el-input__inner {
  background: #1b3153 !important;
  border: 1px solid #5676a9 !important;
  color: #fff;
}
</style>
<style scoped>
/*这里的样式引用校园平台的资源client\src\assets\fonts */
@import '../../../assets/fonts/iconfont.css';
.duty_tree * {
  font-size: 12px;
}
.duty_tree .labelText {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  padding-right: 8px;
}
.duty_tree {
  height: 100%;
  width: 100%;
}
.tree_content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  padding-right: 8px;
}
.duty_tree .el-tree {
  /* 树的背景颜色 */
  overflow-y: auto;
  overflow-x: hidden;
  background-color: transparent;
  color: #fff;
}
.duty_tree .el-tree::-webkit-scrollbar-track {
  border-radius: 5px;
}
.duty_tree .el-tree::-webkit-scrollbar-track-piece {
  background-color: #14284b;
}
.duty_tree .el-tree::-webkit-scrollbar-thumb {
  background-color: #657ca8;
  border-radius: 5px;
}
.duty_tree .el-tree >>> .el-tree-node__content .el-icon-caret-right.is-leaf {
  color: transparent;
}
.duty_tree .el-tree >>> .el-tree-node__content .el-icon-caret-right {
  font-size: 18px;
  color: #fff;
}
.duty_tree >>> .el-tree-node__content {
  /* item的高度 */
  background-color: transparent;
  height: 36px;
  position: relative;
}
.duty_tree >>> .el-tree-node__content:hover {
  /* 树的鼠标移入样式 */
  background-color: rgb(42, 67, 106);
}
.duty_tree >>> .el-tree-node__content::after {
  /* 分割线 */
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
.duty_tree .el-tree-node {
  position: relative;
}
.duty_tree .BStreeNew {
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
}
.duty_tree .BStreeNew.online {
  /* 在线 */
  color: #fff;
}
.duty_tree .BStreeNew.outline {
  /* 离线 */
  color: rgb(79, 98, 129);
}
.duty_tree .BStreeNew.off {
  /* 停用 */
  color: gold;
}
.duty_tree .BStreeNew.playing {
  /* 预览 */
  color: #4699f9;
}
.duty_tree .BStreeNew .streeIcon {
  /* 树的图标样式 */
  display: inline-block;
  text-decoration: none;
  border-radius: 3px;
  padding-right: 3px;
}
.duty_tree .BStreeNew .streeIcon > i {
  font-size: 16px;
}
.duty_tree .BStreeNew .streeIcon.rightIcon {
  position: absolute;
  right: 5px;
  background-color: rgb(42, 67, 106);
  display: none;
}
.duty_tree .BStreeNew .streeIcon.rightIcon.center-video {
  background-color: #1b3153;
  display: inline;
}
.duty_tree .el-tree-node__content:hover .BStreeNew .rightIcon.center-video {
  display: none;
}
.duty_tree .el-tree-node__content:hover .BStreeNew .rightIcon {
  display: inline;
}
.duty_tree .BStreeNew .streeIcon.rightIcon > i {
  padding: 0 3px;
  margin-left: 5px;
}
.duty_tree .BStreeNew .streeIcon.rightIcon > i:hover {
  color: #449af8;
}
.duty_tree .BStreeNew .treeText {
  /* 树的文字样式 */
  text-overflow: ellipsis;
  display: inline-block;
  /* width: calc(100% - 75px); */
  width: 192px;
}
.duty_tree >>> .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  /* 选中的样式 */
  background-color: rgb(42, 67, 106);
}
</style>
