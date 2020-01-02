<template>
  <div class="control-box">
    <div class='control-title'>
      <h3 class="title-text">选择机构</h3>
    </div>
    <tree ref='tree' :treeData="treeData" :options="options" @node-click="getChildNode" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Tree from '../../../components/tree/tree.vue'
export default {
  name: 'videoControl',
  components: {
    Tree
  },
  data() {
    return {
      treeData: [],
      options: {
        showSearch: false,
        showOpenPreview: false,
        showOpenAllPreview: false,
        showDelete: false,
        showEdit: false,
        moreRoot: false
      }
    }
  },
  computed: {
    ...mapGetters(['getTree'])
  },
  methods: {
    // 删除数据的open属性
    // deleteOpen(current) {
    //   for (let i = 0; i < current.length; i++) {
    //     if ((current[i].children) && (current[i].children.length > 0)) {
    //       delete current[i].open
    //       this.deepCopy(current[i].children)
    //     }
    //   }
    // },
    // 点击某个节点
    getChildNode(node) {
      console.log('88888')
      this.$store.commit('TREE_SET_NODE', node)
    }
    // 展开函数
    // deepCopy(current) {
    //   for (let i = 0; i < current.length; i++) {
    //     if ((current[i].children) && (current[i].children.length > 0)) {
    //       current[i].open = true
    //       this.deepCopy(current[i].children)
    //     }
    //   }
    // }
  },
  created() {
    this.treeData = JSON.parse(JSON.stringify(this.getTree))
    var milldata = JSON.parse(JSON.stringify(this.treeData))
    this.$store.commit('TREE_SET_NODE', milldata[0])
  }
}
</script>
<style lang="less" scoped>
.control-box {
  width: 290px;
  height: 100%;
  border: 1px solid #e3e8ee;
  position: absolute;
  top:10px;
  margin: 0;
  left: 0px;
  padding: 0;
}

.control-title {
  height: 60px;
  background-color: #f5f7f9  ;
  width: 287px;
  line-height: 60px;
}

.control-title .title-text {
  padding: 0 0 0 20px;
}

.control-box .tree-style {
  padding: 0 0 0 40px;
}

.tree-style .ivu-tree-children {
  font-size :18px;
}

</style>
