<template>
  <div class="buildTable" v-resize='scrollUpdate'>
    <div class="floor-list-title">
      楼层列表
    </div>
    <div class="floor-search">
      <Input v-model="searchVal" @on-enter="floorSearch(searchVal)">
        <Button slot="append" icon="ios-search" @click="floorSearch(searchVal)">搜索</Button>
      </Input>
    </div>
    <p class="iconfont icon-large add-btn" @click="addFloor"></p>
    <p class="iconfont icon-shrink back-btn" @click="backToBuildList"></p>
    <div class="floors">
      <bs-scroll ref="scroller">
        <Table border :columns="floors" :data="newFloorList"></Table>
      </bs-scroll>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      floors: [
        {
          title: '楼层名称',
          key: 'name',
          width: 80,
          render: (h, params) => {
            return h('div', [
              // h("Icon", {
              //   props: {
              //     type: "person"
              //   }
              // }),
              h('strong', params.row.name)
            ])
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 198,
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
                  style: {
                    marginRight: '16px'
                  },
                  on: {
                    click: () => {
                      this.floorEdit(params.index)
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
                      this.levelRemove(params.row._id)
                    }
                  }
                },
                '删除'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.changemMap(params)
                    }
                  }
                },
                '查看楼层'
              )
            ])
          }
        }
      ],
      searchVal: '', // 搜索字段
      newFloorList: []
    }
  },
  computed: {
    ...mapState({
      buildOneData: ({ tdBuild }) => tdBuild.buildOneData,
      floorList: ({ tdBuild }) => tdBuild.floorList
    })
  },
  methods: {
    ...mapActions([
      'setRightPanelType',
      'getAllFloorsById',
      'getOneFloor',
      'removeFloor',
      'setIsOuter',
      'setFloorFlag',
      'SearchFloor'
    ]),
    floorEdit(val) {
      this.getOneFloor(this.floorList[val]._id)
        .then(res => {
          this.setRightPanelType('floorForm')
        })
        .catch(err => {
          this.$Message.error(err.response.data.message)
          this.getAllFloorsById(this.floorList[val].bid)
            .then(res => {})
            .catch(err => {
              console.log(err)
            })
        })
    },
    // 删除楼层
    levelRemove(id) {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除所选楼层吗？</p>',
        onOk: () => {
          this.removeFloor(id).then(res => {
            this.successMsg('删除楼层成功')
            this.newFloorList = this.newFloorList.filter(item => item._id !== id)
          }).catch(err => {
            console.log(err)
            this.errorMsg('删除楼层失败')
          })
        },
        onCancel: () => {}
      })
    },
    // 切换图层
    changemMap(param) {
      this.getOneFloor(param.row._id).then(res => {
        if (res) {
          this.setRightPanelType('floorForm')
          // 根据楼层id切换资源树
          this.setIsOuter(false)
        } else {
          this.getAllFloorsById(this.buildOneData._id)
            .then(res => {})
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    addFloor() {
      this.setFloorFlag(true)
      this.setRightPanelType('floorForm')
    },
    floorSearch(val) {
      this.getPaging(val)
      console.log(this.floorList[0].bid)
    },
    getPaging(val) {
      this.SearchFloor({
        id: this.floorList[0].bid,
        name: val
      }).then(res => {
        console.log(this.floorList)
        console.log(res.storey)

        this.newFloorList = res.storey
        this.scrollUpdate()
      })
    },
    backToBuildList() {
      this.setIsOuter(true)
      this.setRightPanelType('buildingList')
    },
    scrollUpdate() {
      this.$refs.scroller.update()
    }
  },
  mounted() {
    this.newFloorList = this.floorList
  }
}
</script>

<style scoped>
.buildTable {
  width: 300px;
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 80%;
  min-height: 450px;
  background: #1c3053;
  padding: 10px;
}
.buildTable .ivu-table-cell {
  padding-left: 5px;
  padding-right: 5px;
}
.floors {
  height: 99% !important;
  overflow: hidden;
}
.add-btn {
  position: absolute;
  right: 10px;
  top: 17px;
  z-index: 2;
}
.back-btn {
  position: absolute;
  left: 10px;
  top: 17px;
  z-index: 2;
}
.floor-list-title {
  display: flex;
  flex: 0 0 30px;
  line-height: 30px;
  text-align: center;
  text-indent: 9.5em;
}
.floor-search {
  display: flex;
  flex: 0 0 30px;
  margin: 7px 0;
}
</style>
<style>
.buildTable .ivu-table-cell {
  padding-left: 5px !important;
  padding-right: 5px !important;
}
</style>
