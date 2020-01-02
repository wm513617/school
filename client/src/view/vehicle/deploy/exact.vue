<template>
  <div class="bs-main exactTenRow vehicle main-page-bg">
    <BScarDeploy ref="BScarDeploy" :show.sync="modal" :value="carInfo" @input="getDeployInfo" :Data="treeData"></BScarDeploy>
    <div class="table-header">
      <div class="btns">
        <Button v-if="$BShasPower('BS-VEHICLE-DEPLOY')" type="ghost" @click="add" icon="plus">添加</Button>
        <Button v-if="$BShasPower('BS-VEHICLE-DEPLOY')" type="ghost" @click="removeBatch" icon="trash-a" :disabled="isViable">删除</Button>
        <Button v-if="$BShasPower('BS-VEHICLE-DEPLOY')" type="ghost" @click="cancelBatch" :disabled="isViable"><i class="ivu-icon iconfont icon-zongchefang"></i>&nbsp;撤控</Button>
        <Button v-if="$BShasPower('BS-VEHICLE-DEPLOY')" type="ghost" @click="restartBatch" :disabled="isViable"><i class="ivu-icon iconfont icon-shebei_bufang" style="font-size: 14px;"></i>&nbsp;重新布控</Button>
      </div>
      <div class="searchs">
        <Input v-model="searchData.licence" placeholder="请输入车牌号" class="searchStyle"></Input>
        <span class="spanMargin">状态</span>
        <Select placeholder="全部" v-model="searchData.state" class="searchStyle">
          <Option v-for="item in searchState" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <span class="spanMargin">品牌</span>
        <Select placeholder="全部" multiple v-model="searchData.brand" style="width:140px;margin-right:10px">
          <Option v-for="item in carBrand" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <span class="spanMargin">布控时间</span>
        <Date-picker type="date" :value="searchData.startTime" @on-change="chanStartTime" placeholder="选择日期" style="width:150px"></Date-picker>
        <span class="spanMargin">至</span>
        <Date-picker type="date" :value="searchData.endTime" @on-change="chanEndTime" placeholder="选择日期" class="searchStyle"></Date-picker>
        <Button type="ghost" @click="search" class="spanMargin"><i class="ivu-icon ivu-icon-ios-search"></i>&nbsp;查询</Button>
        <Button type="ghost" @click="reset"><i class="ivu-icon iconfont icon-fuwei"></i>&nbsp;复位</Button>
      </div>
    </div>
    <div class="car-list" ref="tableBox">
      <div class="table-box">
        <Table size="small" :height="tableHeight" :data="deployCar.list" @on-selection-change="carSelect" :columns="tableColumns" :highlight-row="true"></Table>
      </div>
      <div class="table-footer">
        <div style="float: right;">
          <Page show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :page-size="pageLimit" show-total show-elevator :total="deployCar.count" :current="deployCar.curPage" @on-change="changePage"></Page>
        </div>
      </div>
    </div>
    <div v-if="restart">
      <Modal title="重新布控" v-model="restart" :mask-closable="false" :width="500">
        <div style="height:70px" id="restartClass">
          <Date-picker type="date" v-model="startTime" :clearable="false" placeholder="选择日期" :options="{ disabledDate(date) { return (date && endTime) && date.valueOf() >= endTime } }"></Date-picker>
          <span style="margin: 0 6px;">至</span>
          <Date-picker type="date" v-model="endTime" :clearable="false" placeholder="选择日期" :options="{ disabledDate(date) { return date && date.valueOf() <= startTime || date.valueOf() <= nowTime } }"></Date-picker>
        </div>
        <Button type="ghost" slot="footer" @click="restartCancel">取消</Button>
        <Button type="primary" slot="footer" @click="restartSubmit">确定</Button>
      </Modal>
    </div>
  </div>
</template>
<script>
import BScarDeploy from '../../../components/BScarDeploy'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  components: {
    BScarDeploy
  },
  data() {
    const moment = this.$moment
    return {
      str: '',
      page: 1,
      modal: false,
      restart: false,
      checkAll: [],
      tableHeight: 435,
      carInfo: {},
      searchData: {
        licence: '',
        state: '',
        brand: [],
        startTime: '',
        endTime: ''
      },
      // 是否检索过
      isSearch: false,
      searchPayload: {},
      normalPayload: {},
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '任务名称',
          key: 'name',
          ellipsis: true
        },
        {
          title: '布控级别',
          key: 'level'
        },
        {
          title: '状态',
          key: 'state',
          render: (h, param) => {
            let text = param.row.state === 1 ? '布控中' : '已撤销'
            const color = param.row.state === 1 ? 'rgb(25, 190, 107)' : 'white'
            return h(
              'span',
              {
                style: {
                  color: color
                }
              },
              text
            )
          }
        },
        {
          title: '车牌号码',
          key: 'licence'
        },
        {
          title: '开始时间',
          key: 'startTime',
          render: (h, param) => {
            let startTime = param.row.startTime
            let text = startTime ? moment.unix(Number(startTime)).format('YYYY-MM-DD') : ''
            return h('span', {}, text)
          }
        },
        {
          title: '结束时间',
          key: 'endTime',
          render: (h, param) => {
            let endTime = param.row.endTime
            let text = endTime ? moment.unix(Number(endTime)).format('YYYY-MM-DD') : ''
            return h('span', {}, text)
          }
        },
        {
          title: '品牌',
          key: 'brand',
          ellipsis: true
        },
        {
          title: '颜色',
          key: 'color',
          render: (h, param) => {
            let color = Number(param.row.color)
            let x
            for (let item of this.carColor) {
              if (color === item.value) {
                x = item.label
              }
            }
            return h('span', {}, x)
          }
        },
        // {
        //   title: '布控范围',
        //   key: 'isDefenseAll',
        //   render: (h, param) => {
        //     let text = param.row.isDefenseAll ? '全部' : '部分'
        //     return h('span', {
        //     }, text)
        //   }
        // },
        {
          title: '操作',
          key: 'action',
          width: 200,
          render: (h, param) => {
            if (this.$BShasPower('BS-VEHICLE-DEPLOY')) {
              let text = param.row.state === 1 ? '撤控' : '布控'
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'ghost',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.edit(param)
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
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.remove(param)
                      }
                    }
                  },
                  '删除'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'ghost',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        param.row.state === 1 ? this.cancelState(param) : this.restartState(param)
                      }
                    }
                  },
                  text
                )
              ])
            }
          }
        }
      ],
      treeData: [],
      // 按钮禁用
      isViable: true,
      searchState: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '布控中',
          value: 1
        },
        {
          label: '已撤销',
          value: 2
        }
      ],
      startTime: new Date(new Date().setHours(0, 0, 0, 0)),
      endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 15)).setHours(0, 0, 0, 0)),
      nowTime: new Date(new Date().setHours(0, 0, 0, 0)),
      pageLimit: this.$PageInfo.limit
    }
  },
  computed: {
    ...mapGetters(['carBrand', 'carColor', 'tipWarningConfig', 'tipErrorConfig']),
    ...mapState({
      deployCar({ vehicle }) {
        return vehicle.deployCar
      },
      videoOrg({ vehicle }) {
        return vehicle.videoOrg
      }
    })
  },
  created() {
    this.getAccurateDeploy({ limit: this.pageLimit })
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 40
  },
  methods: {
    ...mapActions([
      'getAccurateDeploy',
      'editDeploy',
      'addDeploy',
      'deleteDeploy',
      'deleteBatchDeploy',
      'editBatchDeploy',
      'AccurateDeploy'
    ]),
    // 树组件选中
    _getNode(node, idArr) {
      for (const i in node) {
        if (idArr.indexOf(node[i].channelid) > -1) {
          node[i].checked = true
        }
        if (node[i].children && node[i].children.length) {
          this._getNode(node[i].children, idArr)
        }
      }
    },
    defChecked(data, idArr) {
      this._getNode(data, idArr)
      return data
    },
    // 添加
    add() {
      this.modal = true
      this.str = 'add'
      this.carInfo = {
        type: 1,
        name: '',
        level: 1,
        licence: '',
        brand: '',
        model: '',
        vehicleType: '',
        color: '',
        direction: '',
        startTime: new Date(new Date().setHours(0, 0, 0, 0)),
        endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 15)).setHours(0, 0, 0, 0)),
        isDefenseAll: false,
        videoChannels: []
      }
      this.treeData = this.$lodash.cloneDeep(this.videoOrg)
      function _getNode(node) {
        for (const i in node) {
          node[i].checked = true
          if (node[i].children && node[i].children.length) {
            _getNode(node[i].children)
          }
        }
      }
      _getNode(this.treeData)
    },
    // 修改
    edit(param) {
      this.modal = true
      this.$refs.BScarDeploy.$refs.treeDeploy.$refs.tree.checkedClick = false
      this.carInfo = JSON.parse(JSON.stringify(param.row))
      this.carInfo.startTime = this.$moment(param.row.startTime * 1000)._d
      this.carInfo.endTime = this.$moment(param.row.endTime * 1000)._d
      const setTreeData = this.$lodash.cloneDeep(
        this.defChecked(this.$lodash.cloneDeep(this.videoOrg), this.carInfo.videoChannels)
      )
      this.treeData = []
      this.treeData = setTreeData
      this.str = 'edit'
    },
    // 单条删除
    remove(param) {
      let _this = this
      this.$Modal.confirm({
        title: '警告',
        content: '确定删除吗?',
        cancelText: '取消',
        onOk: function() {
          _this
            .deleteDeploy(param.row._id)
            .then(() => {
              if (_this.deployCar.list.length === 1) {
                if (_this.isSearch) {
                  _this.searchPayload.page = 1
                  _this.getAccurateDeploy(_this.searchPayload)
                } else {
                  _this.normalPayload.page = 1
                  _this.getAccurateDeploy(_this.normalPayload)
                }
              } else {
                _this.isSearch
                  ? _this.getAccurateDeploy(_this.searchPayload)
                  : _this.getAccurateDeploy(_this.normalPayload)
              }
              _this.isViable = true
            })
            .catch(err => {
              if (_this.tipErrorConfig.show) {
                _this.$Notice.error({ title: '删除布控失败!', duration: _this.tipErrorConfig.dur })
              }
              console.log('remove error: ' + err)
            })
        }
      })
    },
    // 复选框
    carSelect(value) {
      this.checkAll = value
      if (this.checkAll.length > 0) {
        this.isViable = false
      } else {
        this.isViable = true
      }
    },
    // 批量删除
    removeBatch() {
      if (this.checkAll.length > 0) {
        let _this = this
        this.$Modal.confirm({
          title: '警告',
          content: '确定删除吗?',
          cancelText: '取消',
          onOk: function() {
            let idList = []
            _this.checkAll.forEach(item => {
              idList.push(item._id)
            })
            _this
              .deleteBatchDeploy(idList)
              .then(() => {
                if (_this.deployCar.list.length === idList.length && _this.page === _this.deployCar.pages) {
                  if (_this.isSearch) {
                    _this.searchPayload.page = 1
                    _this.getAccurateDeploy(_this.searchPayload)
                  } else {
                    _this.normalPayload.page = 1
                    _this.getAccurateDeploy(_this.normalPayload)
                  }
                } else {
                  _this.isSearch
                    ? _this.getAccurateDeploy(_this.searchPayload)
                    : _this.getAccurateDeploy(_this.normalPayload)
                }
                _this.isViable = true
              })
              .catch(err => {
                if (_this.tipErrorConfig.show) {
                  _this.$Notice.error({ title: '删除布控失败!', duration: _this.tipErrorConfig.dur })
                }
                console.log('removeBatch error: ' + err)
              })
          }
        })
      }
    },
    // 分页
    changePage(n) {
      this.page = n
      if (this.isSearch) {
        this.searchPayload.page = n
        this.getAccurateDeploy(this.searchPayload)
      } else {
        this.normalPayload.page = n
        this.getAccurateDeploy(this.normalPayload)
      }
      this.checkAll = []
      this.isViable = true
    },
    pageSizeChange(n) {
      this.page = 1
      this.pageLimit = n
      if (this.isSearch) {
        this.searchPayload.page = 1
        this.searchPayload.limit = n
        this.getAccurateDeploy(this.searchPayload)
      } else {
        this.normalPayload.page = 1
        this.normalPayload.limit = n
        this.getAccurateDeploy(this.normalPayload)
      }
      this.checkAll = []
      this.isViable = true
    },
    // 添加及修改 确定
    getDeployInfo(data, name) {
      let startTime = Date.parse(data.startTime) / 1000
      let endTime = Date.parse(data.endTime) / 1000
      let info = JSON.parse(JSON.stringify(data))
      info.startTime = startTime
      info.endTime = endTime
      if (this.str === 'add') {
        this.addDeploy(info)
          .then(() => {
            this.modal = false
            // 是否检索过
            if (this.isSearch) {
              this.searchPayload.page = 1
              this.getAccurateDeploy(this.searchPayload)
            } else {
              this.normalPayload.page = 1
              this.getAccurateDeploy(this.normalPayload)
            }
            this.$refs['BScarDeploy'].$refs[name].resetFields()
          })
          .catch(err => {
            if (this.tipErrorConfig.show) {
              this.$Notice.error({ title: err.response.data.message, duration: this.tipErrorConfig.dur })
            }
            console.log('addDeploy error: ' + err)
          })
      } else if (this.str === 'edit') {
        this.editDeploy(info)
          .then(() => {
            this.isSearch ? this.getAccurateDeploy(this.searchPayload) : this.getAccurateDeploy(this.normalPayload)
            this.$refs['BScarDeploy'].$refs[name].resetFields()
            this.modal = false
          })
          .catch(err => {
            if (this.tipErrorConfig.show) {
              this.$Notice.error({ title: err.response.data.message, duration: this.tipErrorConfig.dur })
            }
            console.log('editDeploy error: ' + err)
          })
      }
    },
    // 单条撤控
    cancelState(param) {
      let _this = this
      this.$Modal.confirm({
        title: '警告',
        content: '确定撤销布控任务吗?',
        cancelText: '取消',
        onOk: function() {
          param.row.state = 2
          _this
            .editDeploy(param.row)
            .then(() => {
              _this.isSearch
                ? _this.getAccurateDeploy(_this.searchPayload)
                : _this.getAccurateDeploy(_this.normalPayload)
              _this.isViable = true
            })
            .catch(err => {
              if (_this.tipErrorConfig.show) {
                _this.$Notice.error({ title: '撤销布控失败!', duration: _this.tipErrorConfig.dur })
              }
              console.log('cancelState error: ' + err)
            })
        }
      })
    },
    // 单条重启
    restartState(param) {
      const moment = this.$moment
      let _this = this
      this.$Modal.confirm({
        title: '警告',
        content: '确定重新布控任务吗?',
        cancelText: '取消',
        onOk: function() {
          param.row.state = 1
          if (param.row.endTime && Number(param.row.endTime) < Number(moment().format('X'))) {
            param.row.startTime = Number(moment().format('X'))
            param.row.endTime = Number(
              moment()
                .add(15, 'days')
                .format('X')
            )
            _this
              .editDeploy(param.row)
              .then(() => {
                _this.isSearch
                  ? _this.getAccurateDeploy(_this.searchPayload)
                  : _this.getAccurateDeploy(_this.normalPayload)
                _this.isViable = true
              })
              .catch(err => {
                if (_this.tipErrorConfig.show) {
                  _this.$Notice.error({ title: '重新布控失败!', duration: _this.tipErrorConfig.dur })
                }
                console.log('restartState1 error: ' + err)
              })
          } else {
            _this
              .editDeploy(param.row)
              .then(() => {
                _this.isSearch
                  ? _this.getAccurateDeploy(_this.searchPayload)
                  : _this.getAccurateDeploy(_this.normalPayload)
                _this.isViable = true
              })
              .catch(err => {
                if (_this.tipErrorConfig.show) {
                  _this.$Notice.error({ title: '重新布控失败!', duration: _this.tipErrorConfig.dur })
                }
                console.log('restartState2 error: ' + err)
              })
          }
        }
      })
    },
    // 批量撤销
    cancelBatch() {
      let _this = this
      this.$Modal.confirm({
        title: '警告',
        content: '确定撤销布控任务吗?',
        cancelText: '取消',
        onOk: function() {
          let data = {
            body: {},
            list: []
          }
          _this.checkAll.forEach(item => {
            data.list.push(item._id)
          })
          data.body = {
            state: 2
          }
          _this
            .editBatchDeploy(data)
            .then(() => {
              _this.isSearch
                ? _this.getAccurateDeploy(_this.searchPayload)
                : _this.getAccurateDeploy(_this.normalPayload)
              _this.isViable = true
            })
            .catch(err => {
              if (_this.tipErrorConfig.show) {
                _this.$Notice.error({ title: '撤销布控失败!', duration: _this.tipErrorConfig.dur })
              }
              console.log('cancelBatch error: ' + err)
            })
        }
      })
    },
    // 批量重启
    restartBatch() {
      this.restart = true
    },
    // 批量重启--弹窗取消
    restartCancel() {
      this.restart = false
    },
    // 批量重启--弹窗确定
    restartSubmit() {
      let data = {
        body: {},
        list: []
      }
      this.checkAll.forEach(item => {
        data.list.push(item._id)
      })
      data.body = {
        state: 1,
        startTime: Date.parse(this.startTime) / 1000,
        endTime: Date.parse(this.endTime) / 1000
      }
      this.editBatchDeploy(data)
        .then(() => {
          this.restart = false
          this.isSearch ? this.getAccurateDeploy(this.searchPayload) : this.getAccurateDeploy(this.normalPayload)
          this.isViable = true
        })
        .catch(err => {
          if (this.tipErrorConfig.show) {
            this.$Notice.error({ title: '重新布控失败!', duration: this.tipErrorConfig.dur })
          }
          console.log('restartSubmit error: ' + err)
        })
    },
    chanStartTime(val) {
      this.searchData.startTime = val
    },
    chanEndTime(val) {
      this.searchData.endTime = val
    },
    search() {
      let re = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/
      if (this.searchData.licence.length && this.searchData.licence.search(re) === -1) {
        if (this.tipErrorConfig.show) {
          this.$Notice.error({ title: '请输入正确的车牌号', duration: this.tipErrorConfig.dur })
        }
      } else {
        if (new Date(this.searchData.endTime) - new Date(this.searchData.startTime) < 0) {
          if (this.tipWarningConfig.show) {
            this.$Notice.warning({ title: '开始日期不能大于结束日期', duration: this.tipWarningConfig.dur })
          }
        } else {
          const moment = this.$moment
          let payload = JSON.parse(JSON.stringify(this.searchData))
          payload.startTime = this.searchData.startTime ? Number(moment(this.searchData.startTime).format('X')) : ''
          payload.endTime = this.searchData.endTime ? Number(moment(this.searchData.endTime).format('X')) : ''
          payload.brand = encodeURI(payload.brand.join(','))
          this.getAccurateDeploy(payload)
            .then(() => {
              this.isSearch = true
              this.searchPayload = JSON.parse(JSON.stringify(payload))
            })
            .catch(err => {
              console.log('getAccurateDeploy error' + err)
            })
        }
      }
    },
    reset() {
      this.getAccurateDeploy()
        .then(res => {
          this.searchData = {
            licence: '',
            state: '',
            brand: [],
            startTime: '',
            endTime: ''
          }
          this.searchPayload = this.searchData
        })
        .catch(err => {
          console.log('reset error' + err)
        })
    }
  }
}
</script>

<style scoped>
.bs-main {
  flex-direction: column;
}

.table-header {
  flex: 0 0 54px;
  display: flex;
  justify-content: space-between;
}
.car-list {
  flex: 1;
}
.table-header .btns {
  padding: 10px 10px 10px 20px;
}
.table-header .btns button {
  height: 32px;
  margin-right: 8px;
}

.table-header .searchs {
  display: flex;
  line-height: 32px;
  padding: 10px 24px 10px 10px;
}

.table-header .searchs .spanMargin {
  margin: 0 8px 0 3px;
}

.searchStyle {
  width: 110px;
  margin-right: 10px;
}

#restartClass .ivu-date-picker {
  display: inline-block;
}
</style>
