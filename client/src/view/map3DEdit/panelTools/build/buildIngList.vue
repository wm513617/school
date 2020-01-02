<template>
  <div class="areaHome" v-resize='scrollUpdate'>
    <div class="buildTableSearch">
      <Input v-model="searchVal" @on-enter="buildSearch(searchVal)">
        <Button slot="append" icon="ios-search" @click="buildSearch(searchVal)">搜索</Button>
      </Input>
    </div>
    <div class="table-height">
      <bs-scroll ref="scroller" class="table-height">
        <Table border :columns="buildEditColumns" :data="buildList"></Table>
      </bs-scroll>
      <div class="page-margin">
        <Page :transfer="true" placement='bottom' size="small" :page-size-opts="$PageInfo.size" :total="buildPage.count" :page-size="buildPage.limit" :current="buildPage.cur" @on-change="changePage" @on-page-size-change="pageSizeChange" show-sizer show-total></Page>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      searchVal: '',
      buildEditColumns: [
        {
          title: '楼宇名称',
          key: 'name',
          width: 85,
          align: 'center',
          ellipsis: true,
          render: (h, params) => {
            return h('div', [h('strong', params.row.name)])
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 179,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: { marginRight: '16px' },
                  on: {
                    click: () => {
                      this.editBuildingInfo(params.row.code)
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: { marginRight: '16px' },
                  on: {
                    click: () => {
                      this.removeBuildingInfo(params.row._id, params.index)
                    }
                  }
                },
                '删除'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.addFloorBtn(params.row, params.row._id)
                    }
                  }
                },
                '楼层'
              )
            ])
          }
        }
      ],
      buildPage: {
        cur: 1,
        limit: this.$PageInfo.limit,
        count: 0
      }
    }
  },
  computed: {
    ...mapState({
      buildList: ({ tdBuild }) => tdBuild.buildList
    })
  },
  methods: {
    ...mapActions([
      'getBuildListByPaging',
      'getAllBuild',
      'setRightPanelShow',
      'setRightPanelType',
      'deleteOneBuildById',
      'setGobackToBuildList',
      'getAllFloorsById',
      'getOneBuildById',
      'setBuildData'
    ]),
    changePage(val) {
      this.getBuildListByPaging({ page: val, name: this.searchVal, limit: this.buildPage.limit }).then(res => {
        this.buildPage.count = res.count
      })
    },
    pageSizeChange(val) {
      this.buildPage.limit = val
      this.buildPage.cur = 1
      this.getPaging(this.searchVal)
    },
    buildSearch(val) {
      this.getPaging(val)
    },
    getPaging(val) {
      this.getBuildListByPaging({
        page: 1,
        id: this.activeMap,
        name: val,
        limit: this.buildPage.limit
      }).then(res => {
        this.buildPage.count = res.count
        this.scrollUpdate()
      })
    },
    scrollUpdate() {
      this.$refs.scroller.update()
    },
    // 编辑楼宇信息
    editBuildingInfo(code) {
      this.getOneBuildById(code).then(res => {
        this.setGobackToBuildList(true)
        this.setRightPanelType('buildForm')
      })
    },
    // 删除楼宇
    removeBuildingInfo(code, index) {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除所选楼宇吗？</p>',
        onOk: () => {
          this.deleteOneBuildById(code)
            .then(res => {
              this.getPaging(this.searchVal)
              // this.buildEditList.splice(index, 1)
              this.$Notice.success({
                title: '删除成功！',
                desc: ''
              })
            })
            .catch(err => {
              console.log(err)
              this.$Notice.error({
                title: '删除失败！',
                desc: ''
              })
            })
        },
        onCancel: () => {}
      })
    },
    addFloorBtn(data, val) {
      this.setBuildData(data)
      this.getAllFloorsById(val).then(res => {
        this.setRightPanelType('floorList')
      })
    }
  },
  mounted() {
    this.buildPage.count = this.buildList.length
  }
}
</script>

<style scoped>
.areaHome {
  width: 300px;
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 80%;
  min-height: 450px;
  background: #1c3053;
  padding: 10px;
}
.buildTableSearch {
  margin-bottom: 10px;
}
.buildTableSearch + div {
  flex: 1;
}
.table-height {
  height: calc(100% - 48px) !important;
  overflow: hidden;
}
.page-margin {
  margin-top: 16px;
}
</style>
