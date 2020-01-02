<!--应用模式 左边树结构 -->
<template>
  <div class="mapAppTree">
    <div class="input" style="width:100%;padding:0 10px;">
      <Input v-model="searchVal" icon="ios-search-strong" placeholder="请输入..." />
    </div>
    <bs-scroll class="mapAppTreeHome">
      <VTree ref='tree' :activeId='activeNodeId' :searchVal="searchVal" :treeData="mapOrgTree" :options="options" @node-click='handleNode'></VTree>
    </bs-scroll>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import VTree from '../../../../components/tree/VTree.vue'
export default {
  components: {
    VTree
  },
  data() {
    return {
      videoShow: true,
      activeNodeId: '',
      searchVal: '',
      options: {
        showSearch: false,
        showOpenPreview: false,
        showOpenAllPreview: false,
        showCollection: false,
        showPoint: true
      }
    }
  },
  computed: {
    ...mapState({
      mapOrgTree: ({ mapGisData }) => mapGisData.mapOrgTree, // 地图结构树
      activeMap: ({ mapGisData }) => mapGisData.activeMap // 当前地图id
    })
  },
  watch: {
    activeMap(val) {
      this.searchVal = ''
    }
  },
  methods: {
    ...mapActions(['getOneGrid', 'getOneBuild', 'getOneLevel', 'getFloorDatasById']),
    handleNode(node) {
      if (!node.isroot && node.type) {
        this.$store.commit('SET_APPTREENODE_INFO', node)
      }
      if (node.type === 'grid') {
        // 获取网格信息
        this.getOneGrid(node._id)
          .then(res => {})
          .catch(err => {
            this.errorMsg('参数获取失败')
            console.log(err)
          })
      } else if (node.type === 'building') {
        this.$store.commit('SET_ISAPPOUTER_STATE', true) // 胡红勋
        // 获取楼宇信息
        this.getOneBuild(node._id)
          .then(res => {})
          .catch(err => {
            this.errorMsg('参数获取失败')
            console.log(err)
          })
        // this.getFloorDatasById(node._id).then(result => {
        //   console.log(result)
        // })
      } else if (node.type === 'storey') {
        this.$store.commit('SET_ISAPPOUTER_STATE', false) // 胡红勋
        // 获取楼层信息
        this.$store.commit('SET_FLOOR_ID', node._id) // 胡红勋添加
        this.getOneLevel(node._id)
          .then(res => {})
          .catch(err => {
            this.errorMsg('参数获取失败')
            console.log('getOneLevel', err)
          })
      }
    }
  }
}
</script>
<style scoped>
.mapAppTree {
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
}
.mapAppTree .mapAppTreeHome {
  width: 272px;
  height: calc(100% - 24px);
  padding-right: 10px;
}
.mapAppTree .mapAppTreeTittle {
  height: 30px;
  padding-left: 20px;
}
.mapEditTittle {
  width: 100%;
  height: 40px;
}
.mapEditTittle > ul {
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  text-align: center;
  /* background: #1b3153; */
}

.mapEditTittle > ul li {
  width: 33.333%;
  float: left;
  cursor: pointer;
  height: 40px;
  background: #0f2343;
  border-right: 1px solid rgb(16, 27, 49);
}
.mapEditTittle > ul li.active {
  background: #1b3153;
}
</style>
