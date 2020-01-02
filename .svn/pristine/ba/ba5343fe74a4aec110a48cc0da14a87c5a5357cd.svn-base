<template>
  <div class="timing-box" ref="tableBox">
    <div class="manage-head">
      <label>事件录像</label>
      <Select :disabled="!isDisable" class="select-style" @click.native="waringChange" v-model="resetData.openState" style="width:200px" placeholder="请选择">
        <Option v-for="item in checkOptions" :value="item.value" @click.native="startChange(item.value)" :key="item.value">{{ item.label }}</Option>
      </Select>
      <label>录像码流</label>
      <Select :disabled="!isDisable" class="select-style" @click.native="waringChange" v-model="resetData.codeStream" style="width:200px" placeholder="请选择">
        <Option v-for="item in codeOptions" :value="item.value" @click.native="streamChange(item.value)" :key="item.value">{{ item.label }}</Option>
      </Select>
      <label>录像计划</label>
      <Select :disabled="!isDisable" class="select-style" @click.native="waringChange" v-model="resetData.codePlan" style="width:200px" placeholder="请选择">
        <Option v-for="item in planOptions" :value="item._id" @click.native="videoChange(item._id)" :key="item._id">{{ item.name }}</Option>
      </Select>
      <Button type="ghost" @click="OneKeyConfig" :disabled="!(resetData.openState&&resetData.codeStream&&resetData.codePlan)">配置全部</Button>
      <Checkbox style="marginLeft:10px" v-model="resetData.sonFlag">显示子区域</Checkbox>
      <div class="query-style">
        <Input @on-enter="storeSearch" v-model="resetData.fillvalue" placeholder="按名称或IP地址查询" style="width: 250px;marginRight: 10px">
        <Button slot="append" type="ghost" @click="storeSearch">搜索</Button>
        </Input>
      </div>
    </div>
    <div class="table-box">
      <Table size="small" :height="tableHeight" :highlight-row="true" @on-selection-change="select" :columns="columns4" :data="recordList"></Table>
      <div class="table-footer">
        <Page show-total show-elevator show-sizer class="query-style top-margin" @on-change="pageChange" :total='totalPage' :current='currentPage' :page-size='pageSize' :page-size-opts="$PageInfo.size" @on-page-size-change="sizeChange"></Page>
      </div>
      <div>
        <Button type="primary" :loading="loading" class="top-margin-botton" style="width: 100px" @click="saveIncident">保存</Button>
      </div>
    </div>
  </div>
</template>
<script>
import { addChecked, Compare } from './video.js'
import { mapGetters, mapActions, mapState } from 'vuex'
import '../style/manage.css'
export default {
  name: 'incident',
  components: {},
  props: {
    resetData: {
      type: Object
    }
  },
  data() {
    return {
      isDisable: true,
      loading: false,
      pageSize: this.$PageInfo.limit,
      currentPage: 1,
      totalPage: 0,
      changeLIst: [],
      recordList: [],
      tableHeight: 433,
      oldList: [],
      middleObject: {}, // 获取树的数据
      // timingData: [],
      key: 0,
      columns4: [
        {
          type: 'selection',
          width: 70
        },
        {
          title: '启用',
          width: 130,
          render: (h, params) => {
            if (Object.getOwnPropertyNames(params.row).length !== 4) {
              var _this = this
              var middle = params.row.conf ? params.row.conf.enable : ''
              return h(
                'Select',
                {
                  props: {
                    value: middle,
                    disabled: !this.isDisable
                  },
                  on: {
                    'on-change'(v, index = params.index) {
                      _this.recordList[index].conf.enable = v
                      for (let i = 0; i < _this.changeLIst.length; i++) {
                        _this.recordList[_this.changeLIst[i]]._checked = true
                      }
                    }
                  }
                },
                this.checkOptions.map(v => {
                  return h(
                    'Option',
                    {
                      props: {
                        value: v.value,
                        key: v.value
                      }
                    },
                    v.label
                  )
                })
              )
            }
          }
        },
        {
          title: '监控点名称',
          key: 'name'
        },
        {
          title: 'IP地址',
          key: 'ip',
          width: 150
        },
        {
          title: '状态',
          width: 70,
          render: (h, param) => {
            if (Object.getOwnPropertyNames(param.row).length !== 4) {
              var color = param.row.status === 1 ? '#19be6b' : '#ed3f14'
              var state = param.row.status === 1 ? '在线' : '离线'
              return h(
                'div',
                { style: { color: color, marginLeft: '8px' } },
                state
              )
            }
          }
        },
        {
          title: '录像码流',
          // width: '20%',
          render: (h, params) => {
            if (Object.getOwnPropertyNames(params.row).length !== 4) {
              var that = this
              var streamMiddle = params.row.conf
                ? params.row.conf.streamType
                : ''
              return h('div', { style: { marginLeft: '5px' } }, [
                h(
                  'Select',
                  {
                    props: {
                      value: streamMiddle,
                      disabled: !that.isDisable
                    },
                    on: {
                      'on-change'(v, index = params.index) {
                        that.recordList[index].conf.streamType = v
                        for (let i = 0; i < that.changeLIst.length; i++) {
                          that.recordList[that.changeLIst[i]]._checked = true
                        }
                      }
                    }
                  },
                  this.codeOptions.map(v => {
                    return h(
                      'Option',
                      {
                        props: {
                          value: v.value,
                          key: v.value
                        }
                      },
                      v.label
                    )
                  })
                )
              ])
            }
          }
        },
        {
          title: '录像计划',
          key: 'server',
          // width: '20%',
          render: (h, params) => {
            if (Object.getOwnPropertyNames(params.row).length !== 4) {
              var _that = this
              var defaultValue = params.row.conf
                ? params.row.conf.planTemplateId
                : ''
              return h('div', { style: { marginLeft: '10px' } }, [
                h(
                  'Select',
                  {
                    props: {
                      value: defaultValue,
                      disabled: !_that.isDisable
                    },
                    on: {
                      'on-change'(v, index = params.index) {
                        _that.recordList[index].conf.planTemplateId = v
                        for (let i = 0; i < _that.changeLIst.length; i++) {
                          _that.recordList[_that.changeLIst[i]]._checked = true
                        }
                      }
                    }
                  },
                  this.planOptions.map(v => {
                    return h(
                      'Option',
                      {
                        props: {
                          value: v._id,
                          key: v._id
                        }
                      },
                      v.name
                    )
                  })
                )
              ])
            }
          }
        }
      ],
      planOptions: [],
      codeOptions: [
        {
          value: 'main',
          label: '主码流'
        },
        {
          value: 'sub1',
          label: '子码流'
        },
        {
          value: 'sub2',
          label: '第三码流'
        }
      ],
      checkOptions: [
        {
          value: 'disabled',
          label: '禁止'
        },
        {
          value: 'enable',
          label: '启用'
        }
      ],
      model1: ''
    }
  },
  computed: {
    ...mapState({
      isUpdate: ({ equipment }) => equipment.isUpdate
    }),
    ...mapGetters([
      'getSelectTree',
      'getPlanMolde',
      'getRecord',
      'sysConfrole',
      'monmentVideoTabs',
      'tipWarningConfig',
      'tipErrorConfig'
    ])
  },
  watch: {
    getSelectTree() {
      if (this.monmentVideoTabs === 'incident') {
        this.getEventData(1)
      }
    },
    'resetData.sonFlag'(newval) {
      this.getEventData(1)
    },
    isUpdate(newval) {
      if (this.monmentVideoTabs === 'incident') {
        this.getEventData(this.currentPage, true)
      }
    },
    monmentVideoTabs() {
      if (this.monmentVideoTabs === 'incident') {
        this.getEventData(1)
      }
    }
  },
  methods: {
    ...mapActions(['getplanName', 'getStorageByTree', 'changeRecordByTree', 'changeAllConfig', 'recordLog']),
    waringChange() {
      if (this.changeLIst.length === 0) { return }
      if (
        this.changeLIst.length === 0 &&
        this.isDisable &&
        this.tipWarningConfig.show
      ) {
        this.$Notice.warning({
          title: '提示',
          desc: '请选择摄像机',
          duration: this.tipWarningConfig.dur
        })
      }
    },
    getEventData(page, state) {
      var recursion = this.resetData.sonFlag === true ? 1 : 0
      this.getStorageByTree({
        collection: 'event',
        org: this.getSelectTree,
        page: page,
        limit: this.pageSize,
        recursion: recursion,
        key: this.resetData.fillvalue
      })
        .then(suc => {
          this.recordList = addChecked(
            JSON.parse(JSON.stringify(suc.data.result))
          )
          this.oldList = addChecked(
            JSON.parse(JSON.stringify(suc.data.result))
          )
          // if (this.recordList.length === 0 && !state && this.tipWarningConfig.show) {
          //   this.$Notice.warning({
          //     title: '提示',
          //     desc: '获取参数列表为空',
          //     duration: this.tipWarningConfig.dur
          //   })
          // }
          this.totalPage = parseInt(suc.headers['x-bsc-count'])
          this.currentPage = parseInt(suc.headers['x-bsc-cur'])
          this.changeLIst = []
        })
        .catch(err => {
          if (!state && this.tipErrorConfig.show) {
            this.$Notice.error({
              title: '提示',
              desc: '获取参数列表失败',
              duration: this.tipErrorConfig.dur
            })
          }
          console.log('get storage err' + err)
        })
    },
    // 页码改变
    pageChange(page) {
      this.getEventData(page)
    },
    // 切换每页条数时的回调，返回切换后的每页条数
    sizeChange(size) {
      this.pageSize = size
      this.getEventData(1)
    },
    storeSearch() {
      this.getEventData(1)
    },
    saveIncident() {
      this.loading = true
      var saveChangeList = []
      this.recordList.map((val, index) => {
        if (!val.conf.enable || !val.conf.streamType || !val.conf.planTemplateId) { return }
        saveChangeList.push({
          resource: this.recordList[index].resouceId,
          _id: this.recordList[index].conf._id,
          enable: this.recordList[index].conf.enable,
          streamType: this.recordList[index].conf.streamType,
          planTemplateId: this.recordList[index].conf.planTemplateId,
          takeType: 'eventVideo'
        })
      })
      if (saveChangeList.length === 0 && this.tipWarningConfig.show) {
        this.$Notice.warning({
          title: '提示',
          desc: '您没有修改配置!',
          duration: this.tipWarningConfig.dur
        })
        this.loading = false
        return
      }
      this.changeRecordByTree(saveChangeList)
        .then(suc => {
          this.getEventData(this.currentPage)
          this.$Notice.success({
            title: '提示',
            desc: '参数保存成功',
            duration: 2
          })
          this.loading = false
          let compare = new Compare(this.oldList, this.recordList)
          compare.obj.forEach((val, index) => {
            this.recordLog({
              logType: '操作日志',
              module: '录像管理',
              operateName: '事件录像计划',
              operateContent: '保存',
              target: val.name,
              deviceIp: val.ip
            })
          })
        })
        .catch(err => {
          this.loading = false
          console.log('change record err' + err)
          if (this.tipErrorConfig.show) {
            this.$Notice.error({
              title: '提示',
              desc: '参数保存失败',
              duration: this.tipErrorConfig.dur
            })
          }
        })
    },
    // table选中方法
    select(selection) {
      this.changeLIst = []
      for (let i = 0; i < selection.length; i++) {
        for (let j = 0; j < this.recordList.length; j++) {
          if (this.recordList[j].resouceId === selection[i].resouceId) {
            this.changeLIst.push(j)
          }
        }
      }
    },
    startChange(val) {
      this.recordList = addChecked(this.recordList)
      for (let i = 0; i < this.changeLIst.length; i++) {
        this.recordList[this.changeLIst[i]].conf.enable = val
        this.recordList[this.changeLIst[i]]._checked = true
      }
    },
    streamChange(val) {
      this.recordList = addChecked(this.recordList)
      for (let i = 0; i < this.changeLIst.length; i++) {
        this.recordList[this.changeLIst[i]].conf.streamType = val
        this.recordList[this.changeLIst[i]]._checked = true
      }
    },
    videoChange(val) {
      this.recordList = addChecked(this.recordList)
      for (let i = 0; i < this.changeLIst.length; i++) {
        this.recordList[this.changeLIst[i]].conf.planTemplateId = val
        this.recordList[this.changeLIst[i]]._checked = true
      }
    },
    // 一键配置
    OneKeyConfig() {
      var recursion = this.resetData.sonFlag === true ? 1 : 0
      this.changeAllConfig({
        collection: 'event',
        org: this.getSelectTree,
        takeType: 'eventVideo',
        recursion: recursion,
        enable: this.resetData.openState,
        streamType: this.resetData.codeStream,
        planTemplateId: this.resetData.codePlan
      }).then((suc) => {
        this.successMsg('配置成功')
        this.getEventData(1)
        const body = {
          logType: '操作日志',
          module: '录像管理',
          operateName: '事件录像计划',
          operateContent: '配置全部'
        }
        this.recordLog(body)
      }).catch((err) => {
        console.log('changeAllConfig err' + err)
        this.errorMsg(err)
      })
    }
  },
  created() {
    this.isDisable = this.$BShasPower('BS-SETTING-VIDEO-EVENT-MANAGE')
    if (this.getSelectTree && this.monmentVideoTabs === 'incident') {
      this.getEventData(1)
    }
    this.getplanName()
      .then(suc => {
        this.planOptions = suc.data
      })
      .catch(err => {
        console.log('get plan err' + err)
      })
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 100
  }
}
</script>
<style scoped>
.timing-box {
  width: 100%;
  height: calc(100% - 100px);
}

.footer-padding {
  padding: 20px 0;
}

.manage-head label {
  margin-left: 13px;
}

.top-margin-botton {
  margin: 16px 0 10px 16px;
}

.table-box {
  margin: 0;
  /* // position absolute */
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.page-style {
  float: right;
}
</style>
