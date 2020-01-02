<template>
  <div class="bs-main main-page-bg">
    <div v-if="model">
      <Modal v-model="model" :mask-closable="false" title="黑名单布控" :width="450" @on-cancel="cancel">
        <Tabs type="card" :value="item" @on-click="showItem">
          <Tab-pane label="基础信息" name="基础信息"></Tab-pane>
          <Tab-pane label="布控点位" name="布控点位"></Tab-pane>
        </Tabs>
        <div v-show="item==='基础信息'" style="padding:0 10px;min-height:300px">
          <div class="modal-left">
            <Form ref="blackForm" :model="carInfo" :rules="rule" :label-width="100" label-position="left">
              <Form-item label="任务名称" prop="name">
                <Input v-model="carInfo.name" placeholder="请输入"></Input>
              </Form-item>
              <Form-item label="布控级别" prop="level">
                <Select v-model="carInfo.level" placeholder="请选择">
                  <Option v-for="item in level" :key="item.value" :value="item.value">{{item.label}}</Option>
                </Select>
              </Form-item>
              <Form-item label="黑名单车辆" prop="licence" v-if="isMultiple" key="licenceOne">
                <Select v-model="carInfo.licence" multiple placeholder="请选择">
                  <Option v-for="item in allBlackCar" :key="item.value" :value="item.value">{{item.value}}</Option>
                </Select>
              </Form-item>
              <Form-item label="黑名单车辆" prop="licence" v-if="!isMultiple" key="licenceTwo">
                <Input v-model="carInfo.licence" disabled></Input>
                <!-- <Select v-model="carInfo.licence"  disabled placeholder="请选择">
                  <Option v-for="item in allBlackCar" :key="item.value" :value="item.value">{{item.value}}</Option>
                </Select> -->
              </Form-item>
              <Form-item label="布控时间">
                <div class="time-rang">
                  <Date-picker type="date" v-model="carInfo.startTime" :clearable="false" placeholder="选择日期" :options="{ disabledDate(date) { return (date && carInfo.endTime) && date.valueOf() >= carInfo.endTime } }"></Date-picker>
                  <span>至</span>
                  <Date-picker type="date" v-model="carInfo.endTime" :clearable="false" placeholder="选择日期" :options="{ disabledDate(date) { return date && date.valueOf() <= carInfo.startTime || date.valueOf() <= nowTime } }"></Date-picker>
                </div>
              </Form-item>
              <Form-item label="车行方向">
                <Select v-model="carInfo.direction" placeholder="请选择">
                  <Option v-for="item in carBase.direction" :key="item.value" :value="item.value">{{item.label}}</Option>
                </Select>
              </Form-item>
            </Form>
          </div>
        </div>
        <div v-show="item==='布控点位'" style="padding:0 10px;height:300px;overflow-y:auto;">
          <bs-scroll ref="scroller">
            <VTree @on-expand="$refs.scroller.update()" :isSaveState='false' ref='treeDeploy' :treeData="copyData" :options="options"></VTree>
          </bs-scroll>
        </div>
        <div slot="footer">
          <Button type="ghost" @click="cancel">取消</Button>
          <Button type="primary" @click="submit('blackForm')">确定</Button>
        </div>
      </Modal>
    </div>
    <div class="table-header">
      <div class="btns">
        <Button type="ghost" v-if="$BShasPower('BS-VEHICLE-DEPLOY')" @click="add" icon="plus">添加</Button>
        <Button type="ghost" v-if="$BShasPower('BS-VEHICLE-DEPLOY')" @click="removeBatch" icon="trash-a" :disabled="isViable" >删除</Button>
        <Button type="ghost" v-if="$BShasPower('BS-VEHICLE-DEPLOY')" @click="cancelBatch" :disabled="isViable" ><i class="ivu-icon iconfont icon-zongchefang"></i>&nbsp;撤控</Button>
        <Button type="ghost" v-if="$BShasPower('BS-VEHICLE-DEPLOY')" @click="restartBatch" :disabled="isViable" ><i class="ivu-icon iconfont icon-shebei_bufang" style="font-size: 14px;"></i>&nbsp;重新布控</Button>
      </div>
      <div class="searchs">
        <Input v-model="searchData.licence" placeholder="请输入车牌号" class="searchStyle"></Input>
        <span class="spanMargin">状态</span>
        <Select placeholder="全部" v-model="searchData.state" class="searchStyle">
          <Option v-for="item in searchState" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <span class="spanMargin">布控时间</span>
        <Date-picker type="date" :value="searchData.startTime" @on-change="chanStartTime" placeholder="选择日期" style="width:150px"></Date-picker>
        <span class="spanMargin">至</span>
        <Date-picker type="date" :value="searchData.endTime" @on-change="chanEndTime" placeholder="选择日期" class="searchStyle"></Date-picker>
        <Button type="ghost" @click="search" class="spanMargin"><i data-v-6d60a6b1="" class="ivu-icon ivu-icon-ios-search"></i>&nbsp;查询</Button>
        <Button type="ghost" @click="reset"><i class="ivu-icon iconfont icon-fuwei"></i>&nbsp;复位</Button>
      </div>
    </div>
    <div class="car-list flex-1" ref="tableBox">
      <div class="table-box">
        <Table :height="tableHeight" size="small" :data="deployBlack.list" @on-selection-change="carSelect" :columns="tableColumns" :highlight-row="true"></Table>
      </div>
      <div class="table-footer">
        <div style="float: right;">
          <Page show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :page-size="pageLimit" show-total show-elevator :total="deployBlack.count" :current="deployBlack.curPage" @on-change="changePage"></Page>
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
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  data() {
    const moment = this.$moment
    const validateStr = (rule, value, callback) => {
      if (value) {
        // Unicode编码
        let strlen = 0
        for (let i = 0; i < value.length; i++) {
          if (value.charCodeAt(i) > 255) {
            // 如果是汉字，则字符串长度加2
            strlen += 2
          } else {
            strlen++
          }
        }
        if (strlen > 64) {
          return callback(new Error('名称不能超过64位字符'))
        } else {
          return callback()
        }
      } else {
        return callback(new Error('名称不能为空'))
      }
    }
    return {
      item: '基础信息',
      str: '',
      page: 1,
      model: false,
      restart: false,
      isMultiple: false,
      tableHeight: 435,
      checkAll: [],
      carInfo: {},
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
          render: (h, params) => {
            let text = params.row.state === 1 ? '撤控' : '布控'
            if (this.$BShasPower('BS-VEHICLE-DEPLOY')) {
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
                        this.edit(params)
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
                        this.remove(params)
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
                        params.row.state === 1 ? this.cancelState(params) : this.restartState(params)
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
      rule: {
        name: [{ required: true, validator: validateStr, trigger: 'change' }]
      },
      copyData: [],
      options: {
        showCheckbox: true,
        showInput: true
      },
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
      searchData: {
        licence: '',
        state: '',
        startTime: '',
        endTime: ''
      },
      // 是否检索过
      isSearch: false,
      searchPayload: {},
      normalPayload: {},
      startTime: new Date(new Date().setHours(0, 0, 0, 0)),
      endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 15)).setHours(0, 0, 0, 0)),
      nowTime: new Date(new Date().setHours(0, 0, 0, 0)),
      carList: [],
      pageLimit: this.$PageInfo.limit
    }
  },
  computed: {
    ...mapState({
      carBase({ vehicle }) {
        return vehicle.carBase
      },
      level({ vehicle }) {
        return vehicle.level
      },
      deployBlack({ vehicle }) {
        return vehicle.deployBlack
      },
      allBlackCar({ vehicle }) {
        return vehicle.allBlackCar
      },
      videoOrg({ vehicle }) {
        return vehicle.videoOrg
      }
    }),
    ...mapGetters(['tipWarningConfig', 'tipErrorConfig'])
  },
  methods: {
    ...mapActions([
      'getBlackDeploy',
      'addDeploy',
      'editDeploy',
      'deleteDeploy',
      'deleteBatchDeploy',
      'getAllBlackVehicle',
      'editBatchDeploy'
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
    // getStartTime(val) {
    //   this.carInfo.startTime = val
    // },
    // getEndTime(val) {
    //   this.carInfo.endTime = val
    // },
    // card切换
    showItem(val) {
      this.item = val
    },
    // 添加修改 确定
    submit(name) {
      let info = JSON.parse(JSON.stringify(this.carInfo))
      info.videoChannels = this.$refs.treeDeploy.getSelectedDeepChannelid()
      info.startTime = Date.parse(this.carInfo.startTime) / 1000
      info.endTime = Date.parse(this.carInfo.endTime) / 1000
      this.$refs[name].validate(valid => {
        if (!valid) {
          // this.$Notice.error({ title: '表单验证失败!' })
          if (this.item !== '基础信息') {
            this.item = '基础信息'
          }
        } else {
          if (this.str === 'add') {
            this.addDeploy(info)
              .then(() => {
                this.model = false
                // 是否检索过
                if (this.isSearch) {
                  this.searchPayload.page = 1
                  this.getBlackDeploy(this.searchPayload)
                } else {
                  this.normalPayload.page = 1
                  this.getBlackDeploy(this.normalPayload)
                }
                this.$refs[name].resetFields()
              })
              .catch(err => {
                if (this.tipErrorConfig.show) {
                  this.$Notice.error({ title: err.response.data.message, duration: this.tipErrorConfig.dur })
                }
                console.log('addDeploy error: ' + err)
              })
          } else {
            this.editDeploy(info)
              .then(() => {
                this.model = false
                this.isSearch ? this.getBlackDeploy(this.searchPayload) : this.getBlackDeploy(this.normalPayload)
                this.$refs[name].resetFields()
              })
              .catch(err => {
                if (this.tipErrorConfig.show) {
                  this.$Notice.error({ title: err.response.data.message, duration: this.tipErrorConfig.dur })
                }
                console.log('editDeploy error: ' + err)
              })
          }
        }
      })
    },
    // 添加修改 取消
    cancel() {
      this.model = false
      this.$refs['blackForm'].resetFields()
    },
    // 添加
    add() {
      this.str = 'add'
      this.getAllBlackVehicle({ list: 3 })
      this.isMultiple = true
      this.model = true
      this.carInfo = {
        type: 2,
        name: '',
        level: 1,
        licence: [],
        direction: '',
        startTime: new Date(new Date().setHours(0, 0, 0, 0)),
        endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 15)).setHours(0, 0, 0, 0)),
        isDefenseAll: false,
        videoChannels: []
      }
      this.copyData = this.$lodash.cloneDeep(this.videoOrg)
      function _getNode(node) {
        for (const i in node) {
          node[i].checked = true
          if (node[i].children && node[i].children.length) {
            _getNode(node[i].children)
          }
        }
      }
      _getNode(this.copyData)
    },
    // 修改
    edit(param) {
      this.str = 'edit'
      this.isMultiple = false
      this.model = true
      this.$refs.treeDeploy.$refs.tree.checkedClick = false
      this.carInfo = JSON.parse(JSON.stringify(param.row))
      this.carInfo.startTime = this.$moment(param.row.startTime * 1000)._d
      this.carInfo.endTime = this.$moment(param.row.endTime * 1000)._d
      const setTreeData = this.$lodash.cloneDeep(
        this.defChecked(this.$lodash.cloneDeep(this.videoOrg), this.carInfo.videoChannels)
      )
      this.copyData = []
      this.copyData = setTreeData
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
              if (_this.deployBlack.list.length === 1) {
                if (_this.isSearch) {
                  _this.searchPayload.page = 1
                  _this.getBlackDeploy(_this.searchPayload)
                } else {
                  _this.normalPayload.page = 1
                  _this.getBlackDeploy(_this.normalPayload)
                }
              } else {
                _this.isSearch ? _this.getBlackDeploy(_this.searchPayload) : _this.getBlackDeploy(_this.normalPayload)
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
                if (_this.deployBlack.list.length === idList.length && _this.page === _this.deployBlack.pages) {
                  if (_this.isSearch) {
                    _this.searchPayload.page = 1
                    _this.getBlackDeploy(_this.searchPayload)
                  } else {
                    _this.normalPayload.page = 1
                    _this.getBlackDeploy(_this.normalPayload)
                  }
                } else {
                  _this.isSearch ? _this.getBlackDeploy(_this.searchPayload) : _this.getBlackDeploy(_this.normalPayload)
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
        this.getBlackDeploy(this.searchPayload)
      } else {
        this.normalPayload.page = n
        this.getBlackDeploy(this.normalPayload)
      }
      this.checkAll = []
      this.isViable = true
    },
    pageSizeChange(n) {
      if (this.isSearch) {
        this.searchPayload.limit = n
        this.searchPayload.page = 1
        this.getBlackDeploy(this.searchPayload)
      } else {
        this.normalPayload.limit = n
        this.normalPayload.page = 1
        this.getBlackDeploy(this.normalPayload)
      }
      this.checkAll = []
      this.isViable = true
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
              _this.isSearch ? _this.getBlackDeploy(_this.searchPayload) : _this.getBlackDeploy(_this.normalPayload)
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
                _this.isSearch ? _this.getBlackDeploy(_this.searchPayload) : _this.getBlackDeploy(_this.normalPayload)
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
                _this.isSearch ? _this.getBlackDeploy(_this.searchPayload) : _this.getBlackDeploy(_this.normalPayload)
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
              _this.isSearch ? _this.getBlackDeploy(_this.searchPayload) : _this.getBlackDeploy(_this.normalPayload)
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
    // 批量重启--弹窗开始时间
    // restartStartTime(val) {
    //   this.startTime = val
    // },
    // 批量重启--弹窗结束时间
    // restartEndTime(val) {
    //   this.endTime = val
    // },
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
          this.isSearch ? this.getBlackDeploy(this.searchPayload) : this.getBlackDeploy(this.normalPayload)
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
          this.getBlackDeploy(payload)
            .then(() => {
              this.isSearch = true
              this.searchPayload = JSON.parse(JSON.stringify(payload))
            })
            .catch(err => {
              console.log('getBlackDeploy error' + err)
            })
        }
      }
    },
    reset() {
      this.getBlackDeploy()
        .then(res => {
          this.searchData = {
            licence: '',
            state: '',
            startTime: '',
            endTime: ''
          }
          this.searchPayload = this.searchData
        })
        .catch(err => {
          console.log('reset error' + err)
        })
    }
  },
  watch: {
    str() {
      if (this.str === 'add') {
        this.$set(this.rule, 'licence', [
          { required: true, type: 'array', min: 1, message: '至少选择一个车辆', trigger: 'change' }
        ])
      } else {
        delete this.rule.licence
      }
    }
  },
  created() {
    this.getBlackDeploy(this.normalPayload)
    this.getAllBlackVehicle({ list: 3 })
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 40
  }
}
</script>

<style scoped>
.bs-main {
  flex-direction: column;
}

.table-header {
  flex: 0 0 50px;
  display: flex;
  justify-content: space-between;
}
.table-header .btns {
  padding: 10px 10px 10px 20px;
}
.table-header .btns button {
  height: 32px;
  margin-right: 8px;
}

.table-header .searchs {
  padding: 10px 24px 10px 10px;
  display: flex;
  line-height: 32px;
}

.table-header .searchs .spanMargin {
  margin: 0 8px;
  height: 32px;
}

.ivu-menu-item-active {
  background: #ececec;
}

.modal-footer {
  display: flex;
}

.modal-footer button {
  width: 100px;
}

.modal-left {
  /* flex: 0 0 350px; */
  padding: 0 7px;
}

.time-rang {
  display: flex;
}

.time-rang span {
  width: 50px;
  text-align: center;
  line-height: 32px;
}

#restartClass .ivu-date-picker {
  display: inline-block;
}

.searchStyle {
  width: 150px;
  margin-right: 10px;
}
</style>
