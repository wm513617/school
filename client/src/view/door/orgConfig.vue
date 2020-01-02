<template>
  <div class="orgConfig">
    <div class="bsMainChild" v-if="$BShasPower('BS-SETTING-DOOR-LIST-PAGE')">
      <div class="tab-content-alarm">
        <div class="feature-btn">
          <div class="btn">
            <Input v-model="inSearchName" icon="ios-search" placeholder="请输入门禁编号、门禁名称" style="width: 250px;margin-right: 10px;" class="rt" @on-click="getSearchDoor"></Input>
            <!-- <Button v-if="$BShasPower('BS-SETTING-DOOR-LIST')" @click="synDoor" type="ghost" icon="ios-copy" :disabled='menuStatus'>获取门禁</Button> -->
             <Button @click="synDoor" type="ghost" icon="ios-copy">获取门禁</Button>
             <!-- <Button type="ghost" icon="refresh" @click="refresh">刷新</Button> -->
          </div>
        </div>
        <div class="table-relative" ref="tableBox">
          <Table v-if = 'tableHeight && tableWidth' @on-selection-change="rowSelect" size="small" :columns = "importTitle" :data = "dataSource" :height = "tableHeight" :width = 'tableWidth'></Table>
        </div>
        <div class="page-style">
          <Page class="rt" show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :current="Number(current)" :total="Number(this.dataSource.length)" :page-size="Number(limit)" @on-change="pageChange" show-elevator show-total></Page>
        </div>
      </div>
   </div>
  </div>
</template>
<script>
import './common.css'
// import doorManage from './modal/doorManage.vue'
import mixinLink from './mixinLink'
import { mapState, mapActions } from 'vuex'
import toTreeData from 'assets/js/toTreeData'
export default {
  name: 'orgConfig',
  // components: {
  //   doorManage
  // },
  mixins: [mixinLink],
  data() {
    return {
      ButtonGroup: true, // 按钮组禁用
      // 表格
      importTitle: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '门禁编号',
          key: 'devId',
          align: 'center'
        },
        {
          title: '门禁名称',
          key: 'devName',
          align: 'center'
        },
        {
          title: '门禁类型',
          key: 'devType',
          align: 'center'
        },
        {
          title: 'IP地址',
          key: 'devIp',
          align: 'center'
        },
        {
          title: '绑定摄像机',
          key: 'status',
          align: 'center'
        }
      ],
      // 搜索框中的内容
      inSearchName: '',

      deviceResTree: [], // 设备树数据快照
      mode: 0, // 0|设备列表接口1|关键字查询接口
      // 分页
      total: 0,
      limit: this.$PageInfo.limit,
      current: 1,
      // 表格数据
      dataSource: [],
      doorManage: {
        doorManageModal: false,
        title: ''
      },
      // 列表高度
      tableHeight: '',
      tableWidth: ''
    }
  },
  created() {
    // 获取机构资源树
    this.getDoorTree()
      .then(res => {
        this.deviceResTree = toTreeData([res])
      })
      .catch(err => {
        console.log('this.getVideoTree :' + err)
      })
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = this.$refs['tableBox'].offsetHeight
      this.tableWidth = this.$refs['tableBox'].offsetWidth
    })
  },
  computed: {
    ...mapState({
      treeNode: ({ sysDoor }) => sysDoor.treeNode,
      getDoorHeader: ({ sysDoor }) => sysDoor.getDoorHead
    }),
    menuStatus() {
      return this.treeNode === ''
    }
  },
  methods: {
    ...mapActions(['getDoorSyn', 'queryDoors', 'getDoorList', 'getDoorTree']),
    rowSelect(select) {
      if (select.length !== 0) {
        this.ButtonGroup = false
      } else {
        this.ButtonGroup = true
      }
    },
    // 树的回显
    matchFun(tree, ids) {
      tree.forEach(item => {
        if (item.children && item.children.length > 0) {
          item.children.forEach(oneRes => {
            if (ids.includes(oneRes._id)) {
              oneRes.checked = true
            }
          })
        }
        if (item && item.children) {
          this.matchFun(item.children, ids)
        }
      })
    },
    // 点击获取门禁按钮
    synDoor() {
      this.$Spin.show({
        render: h => {
          return h('div', [
            h('Icon', {
              class: 'demo-spin-icon-load',
              props: {
                type: 'load-c',
                size: 50
              }
            }),
            h('div', '正在获取数据。。。')
          ])
        }
      })
      this.getDoorSyn({
        id: this.treeNode,
        data: {
          page: 1,
          limit: this.limit
        }
      })
        .then(res => {
          // this.dataSource = res
          this.handlePage()
          this.mode = 0
          this.$Spin.hide()
        })
        .catch(err => {
          this.$Spin.hide()
          if (err.response.data.code === 3008) {
            this.errorMsg(err.response.data.message)
          } else if (err.response.data.code === 3011) {
            this.errorMsg(err.response.data.message)
          } else {
            this.errorMsg('同步该门禁系统列表失败！')
          }
        })
    },
    // 获取门禁列表
    getDoor(page) {
      this.current = page || 1
      const postData = {
        id: this.treeNode,
        data: {
          page: this.current,
          limit: this.limit
        }
      }
      // 获取该门禁系统列表
      this.getDoorList(postData)
        .then(res => {
          this.dataSource = res
          this.handlePage()
          this.mode = 0
        })
        .catch(err => {
          this.errorMsg('获取该门禁系统列表失败！')
          console.log('this.getDoorList :' + err)
        })
    },
    // 刷新按钮
    refresh() {
      this.current = 1
      this.getDoor()
    },
    // 搜索门禁
    getSearchDoor() {
      this.getQueryDoor(1)
    },
    getQueryDoor(page) {
      this.current = page || 1
      const param = {
        _id: this.treeNode,
        data: {
          key: encodeURIComponent(this.inSearchName),
          page: this.current,
          limit: this.limit
        }
      }
      this.queryDoors(param)
        .then(res => {
          this.dataSource = res
          this.handlePage()
          this.mode = 1
        })
        .catch(err => {
          this.errorMsg('搜索门禁失败！')
          console.log('this.queryDoors :' + err)
        })
    },
    // 公共方法  表格及分页数据
    handlePage() {
      this.current = this.getDoorHeader.current
      this.total = this.getDoorHeader.counts
      this.limit = this.getDoorHeader.limits
    },
    // 分页功能
    pageChange(page) {
      this.current = page
      this.mode ? this.getQueryDoor(page) : this.getDoor(page)
    },
    pageSizeChange(size) {
      this.limit = size
      this.mode ? this.getQueryDoor(1) : this.getDoor(1)
    }
  }
}
</script>
<style lang="less" scoped>
.orgConfig {
  width: 100%;
  height: 100%;
  .bsMainChild {
    height: 100%;
    background-color: #1c3053;
    .tab-content-alarm {
      height: 100%;
      display: flex;
      flex-direction: column;
      .feature-btn {
        height: 64px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 64px;
        align-items: center;
        .rt {
          margin-right: 12px;
        }
        .btn {
          margin-left: 24px;
        }
      }
      .table-relative {
        flex: 1;
        overflow-y: auto;
      }
      .page-style {
        height: 40px;
        line-height: 40px;
        padding-right: 16px;
        background-color: #244575;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
      }
    }
    .org-tree {
      width: 100%;
      height: 400px;
      overflow: auto;
      margin-top: 10px;
    }
  }
}
</style>
<style>
.demo-spin-icon-load {
  animation: animate 1s linear infinite;
}
@keyframes animate {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
