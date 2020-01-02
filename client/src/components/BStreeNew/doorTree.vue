<template>
  <div class="BStree">
    <el-tree
      :data="doorData"
      :props="defaultProps"
      :highlight-current='true'
      empty-text='暂无数据'
      node-key="id"
      :default-expanded-keys="[1]"
      :expand-on-click-node="true"
      @node-click='treeClick'
      >
        <span  slot-scope="{node, data}" class="tree_content">
            <span>
              <span class="iconfont icon-organise"></span>
              <span>{{data.label}}</span>
            </span>
        </span>
    </el-tree>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapMutations } from 'vuex'
import { Tree, Button } from 'element-ui'
Vue.component('el-tree', Tree)
Vue.component('el-button', Button)

export default {
  components: {},
  props: {
    doorData: {
      type: Array
    },
    defaultProps: {
      type: Object
    }
  },
  data() {
    return {}
  },
  watch: {},
  methods: {
    ...mapMutations(['PANEL_SWIFCH']),
    // 机构树点击方法
    treeClick(data, node) {
      console.log(data)
      console.log(node)
      this.$store.commit('PANEL_SWIFCH', true)
      this.$emit('treeClick', data)
    }
  }
}
</script>

<style scoped>
/*这里的样式引用校园平台的资源client\src\assets\fonts */
@import '../../assets/fonts/iconfont.css';
.BStree * {
  font-size: 12px;
}
.BStree .labelText {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  padding-right: 8px;
}
.BStree {
  height: 100%;
  width: 100%;
}
.tree_content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.BStree .el-tree {
  /* 树的背景颜色 */
  overflow-y: auto;
  overflow-x: hidden;
  background-color: transparent;
  color: #fff;
}
.BStree .el-tree::-webkit-scrollbar-track {
  border-radius: 5px;
}
.BStree .el-tree::-webkit-scrollbar-track-piece {
  background-color: #14284b;
}
.BStree .el-tree::-webkit-scrollbar-thumb {
  background-color: #657ca8;
  border-radius: 5px;
}
.BStree .el-tree >>> .el-tree-node__content .el-icon-caret-right.is-leaf {
  color: transparent;
}
.BStree .el-tree >>> .el-tree-node__content .el-icon-caret-right {
  font-size: 18px;
  color: #fff;
}
.BStree >>> .el-tree-node__content {
  /* item的高度 */
  background-color: transparent;
  height: 36px;
  position: relative;
}
.BStree >>> .el-tree-node__content:hover {
  /* 树的鼠标移入样式 */
  background-color: rgb(42, 67, 106);
}
.BStree >>> .el-tree-node__content::after {
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
.BStree .el-tree-node {
  position: relative;
}
.BStree .BStreeNew {
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
.BStree .BStreeNew.online {
  /* 在线 */
  color: #fff;
}
.BStree .BStreeNew.outline {
  /* 离线 */
  color: rgb(79, 98, 129);
}
.BStree .BStreeNew.off {
  /* 停用 */
  color: gold;
}
.BStree .BStreeNew.playing {
  /* 预览 */
  color: #4699f9;
}
.BStree .BStreeNew .streeIcon {
  /* 树的图标样式 */
  display: inline-block;
  text-decoration: none;
  border-radius: 3px;
  padding-right: 3px;
}
.BStree .BStreeNew .streeIcon > i {
  font-size: 16px;
}
.BStree .BStreeNew .streeIcon.rightIcon {
  position: absolute;
  right: 5px;
  background-color: rgb(42, 67, 106);
  display: none;
}
.BStree .BStreeNew .streeIcon.rightIcon.center-video {
  background-color: #1b3153;
  display: inline;
}
.BStree .el-tree-node__content:hover .BStreeNew .rightIcon.center-video {
  display: none;
}
.BStree .el-tree-node__content:hover .BStreeNew .rightIcon {
  display: inline;
}
.BStree .BStreeNew .streeIcon.rightIcon > i {
  padding: 0 3px;
  margin-left: 5px;
}
.BStree .BStreeNew .streeIcon.rightIcon > i:hover {
  color: #449af8;
}
.BStree .BStreeNew .treeText {
  /* 树的文字样式 */
  text-overflow: ellipsis;
  display: inline-block;
  /* width: calc(100% - 75px); */
  width: 192px;
}
.BStree >>> .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  /* 选中的样式 */
  background-color: rgb(42, 67, 106);
}
</style>
