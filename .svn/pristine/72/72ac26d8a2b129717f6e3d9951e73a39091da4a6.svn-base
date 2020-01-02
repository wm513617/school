<template>
  <div class="timing-box" ref="tableBox">
    <div class="manage-head">
      <label>抓图</label>
      <Select :disabled="!isDisable" class="select-style" @click.native="waringChange" v-model="resetData.openState" style="width:200px" placeholder="请选择">
        <Option v-for="item in checkOptions" :value="item.value" @click.native="startChange(item.value)" :key="item.value">{{ item.name }}</Option>
      </Select>
      <label>定时抓图</label>
      <Select :disabled="!isDisable" class="select-style" @click.native="waringChange" v-model="resetData.timeGap" style="width:200px" placeholder="请选择">
        <Option v-for="item in PlanMoldename" :value="item._id" @click.native="timeChange(item._id)" :key="item._id">{{ item.name }}</Option>
      </Select>
      <label>事件抓图</label>
      <Select :disabled="!isDisable" class="select-style" @click.native="waringChange" v-model="resetData.eventsGap" style="width:200px" placeholder="请选择">
        <Option v-for="item in PlanMoldename" :value="item._id" @click.native="eventsChange(item._id)" :key="item._id">{{ item.name }}</Option>
      </Select>
      <Button type="ghost" @click="OneKeyConfig" :disabled="!(resetData.openState&&resetData.timeGap&&resetData.eventsGap)">配置全部</Button>
      <Checkbox style="marginLeft:10px" v-model="resetData.sonFlag">显示子区域</Checkbox>
      <div class="query-style">
        <Input @on-enter="storeSearch" v-model="resetData.fillvalue" placeholder="按名称或IP地址查询" style="width: 250px;marginRight: 10px">
        <Button slot="append" type="ghost" @click="storeSearch">搜索</Button>
        </Input>
      </div>
    </div>
    <div class="table-box">
      <Table size="small" :height="tableHeight" :highlight-row="true"  @on-selection-change="select" :columns="columns4" :data="captureData"></Table>
      <div class="table-footer">
        <Page show-total show-elevator show-sizer class="query-style top-margin" @on-change="pageChange" :total='totalPage' :current='currentPage' :page-size='pageSize' :page-size-opts="$PageInfo.size" @on-page-size-change="sizeChange"></Page>
      </div>
      <div>
        <Button :disabled="!isDisable" type="primary" class="top-margin-botton" :loading="loading" style="width: 100px" @click="saveCapture">保存</Button>
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
      tableHeight: 433,
      middleObject: {}, // 获取树的数据
      captureData: [],
      key: 0,
      PlanMoldename: [],
      oldList: [],
      checkOptions: [
        {
          value: 'disabled',
          name: '禁止'
        },
        {
          value: 'enable',
          name: '启用'
        }
      ],
      columns4: [
        {
          type: 'selection',
          width: 70
        },
        {
          width: 130,
          title: '启用',
          render: (h, params) => {
            if (Object.getOwnPropertyNames(params.row).length !== 4) {
              var _that = this
              var enablekase = params.row.conf ? params.row.conf.enable : ''
              return h(
                'Select',
                {
                  props: {
                    value: enablekase,
                    disabled: !this.isDisable
                  },
                  on: {
                    'on-change'(v, index = params.index) {
                      _that.captureData[index].conf.enable = v
                      for (let i = 0; i < _that.changeLIst.length; i++) {
                        _that.captureData[_that.changeLIst[i]]._checked = true
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
                    v.name
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
          align: 'left',
          width: 150
        },
        {
          title: '状态',
          key: 'state',
          width: 70,
          render: (h, params) => {
            if (Object.getOwnPropertyNames(params.row).length !== 4) {
              var color = params.row.status === 1 ? '#19be6b' : '#ed3f14'
              var status = params.row.status === 1 ? '在线' : '离线'
              return h('div', { style: { color: color, marginLeft: '8px' } }, status)
            }
          }
        },
        {
          title: '定时抓图',
          // width: '20%',
          render: (h, params) => {
            if (Object.getOwnPropertyNames(params.row).length !== 4) {
              var that = this
              var timing = params.row.conf ? params.row.conf.timePlanTemplateId : ''
              return h('div', { style: { marginLeft: '5px' } }, [
                h(
                  'Select',
                  {
                    props: {
                      value: timing,
                      disabled: !that.isDisable
                    },
                    on: {
                      'on-change'(v, index = params.index) {
                        that.captureData[index].conf.timePlanTemplateId = v
                        for (let i = 0; i < that.changeLIst.length; i++) {
                          that.captureData[that.changeLIst[i]]._checked = true
                        }
                      }
                    }
                  },
                  this.PlanMoldename.map(v => {
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
        },
        {
          title: '事件抓图',
          // width: '20%',
          render: (h, params) => {
            if (Object.getOwnPropertyNames(params.row).length !== 4) {
              var _this = this
              var eventsMiddle = params.row.conf ? params.row.conf.eventPlanTemplateId : ''
              return h('div', { style: { marginLeft: '10px' } }, [
                h(
                  'Select',
                  {
                    props: {
                      value: eventsMiddle,
                      disabled: !_this.isDisable
                    },
                    on: {
                      'on-change'(v, index = params.index) {
                        _this.captureData[index].conf.eventPlanTemplateId = v
                        for (let i = 0; i < _this.changeLIst.length; i++) {
                          _this.captureData[_this.changeLIst[i]]._checked = true
                        }
                      }
                    }
                  },
                  this.PlanMoldename.map(v => {
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
      model1: '',
      changeLIst: []
    }
  },
  computed: {
    ...mapState({
      isUpdate: ({ equipment }) => equipment.isUpdate
    }),
    ...mapGetters([
      'getSelectTree',
      'getSnapshot',
      'sysConfrole',
      'monmentVideoTabs',
      'tipWarningConfig',
      'tipErrorConfig'
    ])
  },
  watch: {
    getSelectTree() {
      if (this.monmentVideoTabs === 'capture') {
        this.getStoreFun(1)
      }
    },
    'resetData.sonFlag'(newval) {
      this.getStoreFun(1)
    },
    isUpdate(newval) {
      if (this.monmentVideoTabs === 'capture') {
        this.getStoreFun(this.currentPage, true)
      }
    },
    monmentVideoTabs(news) {
      if (news === 'capture') {
        this.getStoreFun(1)
      }
    }
  },
  methods: {
    ...mapActions(['getplanName', 'getStorageByTree', 'changeSnapshotByTree', 'changeAllConfig', 'recordLog']),
    waringChange() {
      if (this.changeLIst.length === 0) { return }
      if (this.changeLIst.length === 0 && this.isDisable && this.tipWarningConfig.show) {
        this.$Notice.warning({
          title: '提示',
          desc: '请选择摄像机',
          duration: this.tipWarningConfig.dur
        })
      }
    },
    getStoreFun(page, state) {
      var recursion = this.resetData.sonFlag === true ? 1 : 0
      this.getStorageByTree({
        collection: 'snapshot',
        org: this.getSelectTree,
        page: page,
        limit: this.pageSize,
        recursion: recursion,
        key: this.resetData.fillvalue
      })
        .then(suc => {
          this.captureData = addChecked(JSON.parse(JSON.stringify(suc.data.result)))
          this.oldList = addChecked(JSON.parse(JSON.stringify(suc.data.result)))
          // if (this.captureData.length === 0 && !state && this.tipWarningConfig.show) {
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
          console.log('get capture err:' + err)
        })
    },
    // 页码改变
    pageChange(page) {
      this.getStoreFun(page)
    },
    // 切换每页条数时的回调，返回切换后的每页条数
    sizeChange(size) {
      this.pageSize = size
      this.getStoreFun(1)
    },
    storeSearch() {
      this.getStoreFun(1)
    },
    // 保存
    saveCapture() {
      this.loading = true
      var saveChangeList = []
      this.captureData.map((val, index) => {
        if (!val.conf.enable || !val.conf.eventPlanTemplateId || !val.conf.timePlanTemplateId) { return }
        saveChangeList.push({
          resource: this.captureData[index].resouceId,
          _id: this.captureData[index].conf._id,
          enable: this.captureData[index].conf.enable,
          eventPlanTemplateId: this.captureData[index].conf.eventPlanTemplateId,
          timePlanTemplateId: this.captureData[index].conf.timePlanTemplateId
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
      this.changeSnapshotByTree(saveChangeList)
        .then(suc => {
          this.getStoreFun(this.currentPage)
          this.$Notice.success({
            title: '提示',
            desc: '参数保存成功',
            duration: 2
          })
          this.loading = false
          let compare = new Compare(this.oldList, this.captureData)
          compare.obj.forEach((val, index) => {
            this.recordLog({
              logType: '操作日志',
              module: '录像管理',
              operateName: '抓图计划',
              operateContent: '保存',
              target: val.name,
              deviceIp: val.ip
            })
          })
        })
        .catch(err => {
          this.loading = false
          console.log('capture save err:' + err)
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
        for (let j = 0; j < this.captureData.length; j++) {
          if (this.captureData[j].resouceId === selection[i].resouceId) {
            this.changeLIst.push(j)
          }
        }
      }
    },
    startChange(val) {
      console.log(1)
      this.captureData = addChecked(this.captureData)
      for (let i = 0; i < this.changeLIst.length; i++) {
        this.captureData[this.changeLIst[i]].conf.enable = val
        this.captureData[this.changeLIst[i]]._checked = true
      }
    },
    timeChange(val) {
      this.captureData = addChecked(this.captureData)
      for (let i = 0; i < this.changeLIst.length; i++) {
        this.captureData[this.changeLIst[i]].conf.timePlanTemplateId = val
        this.captureData[this.changeLIst[i]]._checked = true
      }
    },
    eventsChange(val) {
      this.captureData = addChecked(this.captureData)
      for (let i = 0; i < this.changeLIst.length; i++) {
        this.captureData[this.changeLIst[i]].conf.eventPlanTemplateId = val
        this.captureData[this.changeLIst[i]]._checked = true
      }
    },
    // 一键配置
    OneKeyConfig() {
      var recursion = this.resetData.sonFlag === true ? 1 : 0
      this.changeAllConfig({
        collection: 'snapshot',
        org: this.getSelectTree,
        recursion: recursion,
        // takeType: 'timeVideo',
        enable: this.resetData.openState,
        timePlanTemplateId: this.resetData.timeGap,
        eventPlanTemplateId: this.resetData.eventsGap
      })
        .then(suc => {
          this.successMsg('配置成功')
          this.getStoreFun(1)
          const body = {
            logType: '操作日志',
            module: '录像管理',
            operateName: '抓图计划',
            operateContent: '配置全部'
          }
          this.recordLog(body)
        })
        .catch(err => {
          console.log('changeAllConfig err' + err)
          this.errorMsg(err)
        })
    }
  },
  created() {
    this.isDisable = this.$BShasPower('BS-SETTING-VIDEO-PRINTSCREEN-MANAGE')
    if (this.getSelectTree && this.monmentVideoTabs === 'capture') {
      this.getStoreFun(1)
    }
    this.getplanName()
      .then(suc => {
        this.PlanMoldename = suc.data
      })
      .catch(err => {
        console.log('get plan err:' + err)
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
