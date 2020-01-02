<template>
  <div class="bs-content" id="manageID">
    <div class="bs-left">
      <BsOrgTree @call="clickTree" :orgType="4" orgTitle="机构" :isSetting="$BShasPower('BS-SETTING-POINT-ORG')"></BsOrgTree>
    </div>
    <div class="bs-main">
      <div class="table-header">
        <Button class="ghost" type="ghost" v-if="$BShasPower('BS-SETTING-POINT-MANAGE')" icon="plus" @click="add" :disabled="isRootOrg">添加</Button>
        <Button class="ghost" type="ghost" v-if="$BShasPower('BS-SETTING-POINT-MANAGE')" icon="trash-a" @click="delModel" :disabled="isRemove">删除</Button>
        <Button class="ghost" type="ghost" icon="refresh" @click="fresh">刷新</Button>
        <div class="actions-search">
          <Input placeholder="支持按名称、编码查询" v-model="searchString" style="width: 240px" icon="ios-search-strong" @on-click="searchList(1)">
          </Input>
        </div>
      </div>
      <div class="table-content" ref="tableBox">
        <div class="table-body">
          <Table :height="tableHeight" size="small" :highlight-row="true" :columns="columns" :data="pointData.list" @on-selection-change="selectChange"></Table>
        </div>
      </div>
      <div class="table-footer">
        <div style="float: right;">
          <Page show-total show-elevator show-sizer :total="pointData.count" :current="pointData.curPage" :page-size='pointData.limit' @on-change="changePage" :page-size-opts="$PageInfo.size" @on-page-size-change="sizeChange"></Page>
        </div>
      </div>
    </div>
    <PointModal ref="PointModal" :modalShow="modalShow" :isEdit="isEdit" :formData="formData" :orgActiveName="orgActiveName" @save="saveData" @cancel="cancelData"></PointModal>
  </div>
</template>
<script>
import BsOrgTree from '../../components/DevBSorgTree.vue'
import PointModal from './modal/pointModal'
import { mapState, mapActions } from 'vuex'
import './row.css'
export default {
  components: {
    BsOrgTree,
    PointModal
  },
  data() {
    return {
      tableHeight: 432,
      // 页数限制
      pageLimit: this.$PageInfo.limit,
      modalShow: false,
      isEdit: false,
      formData: {},
      columns: [
        {
          type: 'selection',
          align: 'left',
          minWidth: 30
        },
        {
          title: '序号',
          align: 'left',
          type: 'index',
          minWidth: 30
        },
        {
          title: '设备名称',
          key: 'devName',
          align: 'left',
          minWidth: 100,
          ellipsis: true
        },
        {
          title: '设备ID',
          key: 'devId',
          align: 'left',
          width: 150,
          ellipsis: true
        },
        {
          title: '设备编码',
          key: 'devCode',
          align: 'left',
          minWidth: 100,
          ellipsis: true
        },
        {
          title: '所属机构',
          key: 'affiliation',
          align: 'left',
          minWidth: 150,
          ellipsis: true,
          render: (h, params) => {
            return h('span', params.row.affiliation.name)
          }
        },
        {
          title: '设备类型',
          key: 'devType',
          align: 'left',
          minWidth: 100
        },
        {
          title: '负责人',
          key: 'charger',
          align: 'left',
          minWidth: 80,
          ellipsis: true
        },
        // {
        //   title: '状态',
        //   key: 'status',
        //   align: 'left'
        // },
        {
          title: '备注',
          key: 'remark',
          align: 'left',
          ellipsis: true
        },
        {
          title: '操作',
          key: 'operate',
          width: 150,
          align: 'left',
          ellipsis: true,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'ghost',
                    size: 'small',
                    disabled: !this.$BShasPower('BS-SETTING-POINT-MANAGE')
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.edit(params.row._id)
                    }
                  }
                },
                '修改'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'ghost',
                    size: 'small',
                    disabled: !this.$BShasPower('BS-SETTING-POINT-MANAGE')
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: e => {
                      e.stopPropagation()
                      this.checkAll = [params.row._id]
                      this.delModel()
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      isRemove: true,
      checkAll: [],
      searchString: '',
      isSearch: false
    }
  },
  computed: {
    ...mapState({
      newPointID: ({ sentry }) => sentry.newPointID,
      pointData: ({ sentry }) => sentry.pointData,
      pointDataOne: ({ sentry }) => sentry.pointDataOne,
      orgActiveId: ({ orgSetting }) => orgSetting.orgActiveId,
      orgActiveName: ({ orgSetting }) => orgSetting.orgActiveName,
      isRootOrg: ({ orgSetting }) => orgSetting.isRootOrg
    })
  },
  created() {},
  methods: {
    ...mapActions([
      'getPointList',
      'getPointID',
      'getPointOne',
      'addPoint',
      'editPoint',
      'deletePoint',
      'getSeekPointList'
    ]),
    clickTree() {
      this.getPointData(1)
    },
    // 获取pointList
    getPointData(num) {
      this.getPointList({
        page: num,
        limit: this.pageLimit
      })
        .then(() => {})
        .catch(err => {
          this.errorMsg(err.response.data.message)
          console.log('getPointList error: ' + err)
        })
    },
    // 点击添加
    add() {
      this.getPointID()
        .then(res => {
          this.isEdit = false
          this.modalShow = true
          this.formData = {
            devName: '',
            devId: this.newPointID,
            devCode: '',
            devType: 'NFC',
            affiliation: this.orgActiveId,
            charger: '',
            phone: '',
            remark: ''
          }
        })
        .catch(err => {
          // this.errorMsg(err)
          console.log('getPointID error: ' + err)
        })
    },
    // 点击修改
    edit(id) {
      this.getPointOne(id)
        .then(res => {
          this.isEdit = true
          this.modalShow = true
          delete this.pointDataOne.createdAt
          delete this.pointDataOne.updatedAt
          this.formData = JSON.parse(JSON.stringify(this.pointDataOne))
        })
        .catch(err => {
          // this.errorMsg(err)
          console.log('getPointOne error: ' + err)
        })
    },
    // 删除的方法
    // deviceDeleteOpen() {
    //   if (this.deviceSelectIds.length === 0) {
    //     this.errorMsg('请选择需要删除的点位')
    //     return
    //   }
    //   this.delModel()
    // },
    delModel() {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除所选点位吗？</p>',
        onOk: () => {
          this.remove()
        },
        onCancel: () => {}
      })
    },
    remove() {
      this.deletePoint(this.checkAll)
        .then(res => {
          this.checkAll = []
          this.isRemove = true
          this.getPointData(1)
          this.successMsg('点位信息删除成功')
        })
        .catch(err => {
          this.errorMsg(err)
          console.log('deletePoint error: ' + err)
        })
    },
    cancelData() {
      this.modalShow = false
    },
    saveData(data, name) {
      if (!this.isEdit) {
        this.addPoint(data)
          .then(() => {
            this.modalShow = false
            this.$refs['PointModal'].$refs[name].resetFields()
            this.getPointData(1)
            this.successMsg('点位信息添加成功')
          })
          .catch(err => {
            this.errorMsg(err.response.data.message)
            console.log('addPoint error: ' + err)
          })
      } else {
        this.editPoint(data)
          .then(() => {
            this.modalShow = false
            this.successMsg('点位信息修改成功')
            this.$refs['PointModal'].$refs[name].resetFields()
            this.getPointData(1)
          })
          .catch(err => {
            this.errorMsg(err.response.data.message)
            console.log('edit error: ' + err)
          })
      }
    },
    // 页码改变
    changePage(n) {
      if (this.isSearch) {
        this.searchList(n)
      } else {
        this.getPointData(n)
      }
    },
    // 切换每页条数时的回调，返回切换后的每页条数
    sizeChange(size) {
      this.pageLimit = size
      this.changePage(1)
    },
    // 复选变化
    selectChange(val) {
      this.checkAll = []
      for (let item of val) {
        this.checkAll.push(item._id)
      }
      if (this.checkAll.length > 0) {
        this.isRemove = false
      } else {
        this.isRemove = true
      }
    },
    // 刷新
    fresh() {
      this.getPointData(1)
      this.checkAll = []
      this.isRemove = true
      this.successMsg('数据刷新成功')
    },
    // 搜索
    searchList(num) {
      this.isSearch = true
      this.getSeekPointList({
        page: num,
        limit: this.pageLimit,
        type: 4,
        seek: this.searchString
      })
        .then(() => {})
        .catch(err => {
          this.errorMsg(err.response.data.message)
          console.log('getSeekPointList error: ' + err)
        })
    }
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight
  }
}
</script>

<style  scoped>
.bs-main {
  flex-direction: column;
  background: #1c3053;
}
.table-header {
  /* margin: 10px; */
  padding: 12px 24px;
}

.table-header .ghost {
  margin-right: 8px;
  height: 32px;
}

.actions-search {
  float: right;
  /* margin-top: 9px; */
}
.table-content {
  position: relative;
  flex: 1;
}
.table-footer {
  height: 40px;
}
</style>
