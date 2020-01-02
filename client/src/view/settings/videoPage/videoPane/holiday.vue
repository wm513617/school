<template>
  <div class="holiday bs-main main-page-bg" id="holiday" ref="tableBox">
    <div class="manage-head" style="margin:12px 0 12px 20px;height: auto;padding: 0;">
      <Button icon="plus" type="ghost" @click="newShow" :disabled="!$BShasPower('BS-SETTING-VIDEO-HOLIDAY-MANAGE')">新建</Button>
    </div>
    <div class="promp-style">
      <h4 class="query-style">同等类型的假日时间不能交叉</h4>
      <h4>假日配置</h4>
    </div>
    <div class="bs-table-box">
      <Table width="100%" :height="tableHeight" size="small" :highlight-row="true" :columns="columns7" :data="holidayList"></Table>
      <div class="footer">
        <Button type="primary" :disabled="isManage" style="width: 100px;margin-left:10px" @click='savEnable'>保存</Button>
      </div>
    </div>
    <div v-if="changeModal">
      <Edit :showModal="changeModal" :newOrChangeData="newOrChangeData" :modalType="modalType" @click-save="saveChange" @click-cancel="changeModal = false"></Edit>
    </div>
    <Modal :mask-closable="false" v-model="showModalDelect" title="提示" width="300">
      <div class="model-body">
        <Icon type="information-circled" size="40" color="#ff9900"></Icon>
        <div>确认删除此假日?</div>
      </div>
      <div slot="footer">
        <Button type="ghost" @click="cancelDel">取消</Button>
        <Button type="primary" @click="sureDel">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import Edit from './Edit'
import '../style/manage.css'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    Edit
  },
  data() {
    return {
      isManage: false,
      momentDel: 0,
      oriHoliday: [],
      showModalDelect: false,
      emptyLen: 0,
      newOrChangeData: '',
      changeindexFlag: '',
      filtrateValue: '',
      changeModal: false,
      modalType: 'change',
      tableHeight: 500,
      modelOption: [
        {
          value: 'month',
          label: '按月份'
        },
        {
          value: 'date',
          label: '按日期'
        }
      ],
      columns7: [
        {
          title: '启用',
          width: 90,
          render: (h, params) => {
            if (params.row._index < this.emptyLen) {
              var checkValue
              if (params.row.enable === 'enable') {
                checkValue = true
              } else {
                checkValue = false
              }
              return h('div', {}, [
                h('Checkbox', {
                  props: {
                    value: checkValue
                  },
                  on: {
                    'on-change': () => {
                      this.getCheck(params.index)
                    }
                  }
                })
              ])
            }
          }
        },
        {
          title: '序号',
          width: 80,
          render: (h, params) => {
            if (params.row._index < this.emptyLen) {
              return h('span', {}, params.index + 1)
            }
          }
        },
        {
          title: '节日名称',
          key: 'holidayName'
        },
        {
          title: '类型',
          render: (h, params) => {
            var dataType // = params.row.type === 'month' ? '按月份' : '按日期'
            if (params.row.type === 'month') {
              dataType = '按月份'
            } else if (params.row.type === 'date') {
              dataType = '按日期'
            }
            return h('span', {}, dataType)
          }
        },
        {
          title: '开始日期',
          key: 'startTime'
        },
        {
          title: '结束日期',
          key: 'endTime'
        },
        {
          title: '操作',
          key: 'action',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  on: {
                    click: () => {
                      this.changeShow(params.index)
                    }
                  },
                  props: {
                    size: 'small',
                    type: 'ghost'
                  },
                  style: {
                    marginRight: '15px'
                  }
                },
                '修改'
                // [
                //   h('Icon', {
                //     props: {
                //       type: 'edit'
                //     }
                //   })
                // ]
              ),
              h(
                'Button',
                {
                  on: {
                    click: () => {
                      this.remove(params.index)
                    }
                  },
                  props: {
                    size: 'small',
                    type: 'ghost'
                  }
                },
                '删除'
                // [
                //   h('Icon', {
                //     props: {
                //       type: 'close-round'
                //     }
                //   })
                // ]
              )
            ])
          }
        }
      ],
      holidayList: []
    }
  },
  methods: {
    ...mapActions([
      'getHolidayByUser',
      'changeHolidayByUser',
      'addHolidayByUser',
      'delHolidayByUser'
    ]),
    savEnable() {
      const moment = this.$moment
      var that = this
      var IndexFlag = 0
      this.holidayList.map(function(v, i) {
        if (
          v._id === that.oriHoliday[i]._id &&
          v.enable !== that.oriHoliday[i].enable
        ) {
          var addData = {}
          if (v.type === 'date') {
            addData.startTime = moment(v.startTime).format('X')
            addData.endTime = moment(v.endTime).format('X')
          } else {
            console.log(v.startTime, v.endTime)
            var A = moment().format('YYYY') + '-' + v.startTime
            var B = moment().format('YYYY') + '-' + v.endTime
            addData.startTime = moment(A).format('X')
            addData.endTime = moment(B).format('X')
          }
          addData._id = v._id
          addData.enable = v.enable
          that
            .changeHolidayByUser(addData)
            .then(suc => {
              that.getHolidayFun()
              if (!IndexFlag) {
                that.$Notice.success({
                  title: '提示',
                  desc: '参数保存成功',
                  duration: 2
                })
                IndexFlag++
              }
            })
            .catch(err => {
              console.log('change holiday err:' + err)
              if (!IndexFlag) {
                that.$Notice.error({
                  title: '提示',
                  desc: '参数保存失败',
                  duration: 2
                })
                IndexFlag++
              }
            })
        }
      })
    },
    getHolidayFun() {
      this.getHolidayByUser()
        .then(suc => {
          this.emptyLen = suc.data.length
          this.oriHoliday = JSON.parse(JSON.stringify(suc.data))
          this.holidayList = this.formatTime(
            JSON.parse(JSON.stringify(suc.data))
          )
        })
        .catch(err => {
          console.log('get holiday err' + err)
        })
    },
    // 起否启用
    getCheck(index) {
      this.holidayList[index].enable =
        this.holidayList[index].enable === 'enable' ? 'disabled' : 'enable'
    },
    // 修改模板
    changeShow(index) {
      this.modalType = 'change'
      this.newOrChangeData = this.holidayList[index]
      this.changeModal = true
      this.changeindexFlag = index
    },
    // 新建模板
    newShow() {
      this.modalType = 'new'
      this.changeModal = true
    },
    remove(index) {
      this.showModalDelect = true
      this.momentDel = index
    },
    cancelDel() {
      this.showModalDelect = false
    },
    sureDel() {
      this.delHolidayByUser({ _id: this.holidayList[this.momentDel]._id })
        .then(() => {
          this.getHolidayFun()
          this.showModalDelect = false
          this.$Notice.success({
            title: '提示',
            desc: '参数保存成功',
            duration: 2
          })
        })
        .catch(err => {
          console.log('delect holiday err:' + err)
          if (this.tipErrorConfig.show) {
            this.$Notice.error({
              title: '提示',
              desc: '参数保存失败',
              duration: this.tipErrorConfig.dur
            })
          }
        })
    },
    // 提示框确认
    saveChange(data, type) {
      const moment = this.$moment
      this.changeModal = false
      var addData = {}
      // var pushIndex = '1'
      // for (let i = 0; i < this.holidayList.length; i++) {
      //   if (parseInt(this.holidayList[i]._id) > parseInt(pushIndex)) {
      //     pushIndex = this.holidayList[i]._id
      //   }
      // }
      // data._id = (parseInt(pushIndex) + 1) + '',
      if (data.type === 'date') {
        addData.startTime = moment(data.startTime).format('X')
        addData.endTime = moment(data.endTime).format('X')
      } else {
        var A = moment().format('YYYY') + '-' + data.startTime
        var B = moment().format('YYYY') + '-' + data.endTime
        addData.startTime = moment(A).format('X')
        addData.endTime = moment(B).format('X')
      }
      addData.type = data.type
      addData.holidayName = data.holidayName
      addData.enable = 'enable'
      if (type === 'new') {
        for (let i = 0; i < this.oriHoliday.length; i++) {
          if (this.oriHoliday[i].type === data.type) {
            var middleStartTime = parseInt(addData.startTime)
            var middleEndTime = parseInt(addData.endTime)
            if (
              this.oriHoliday[i].startTime === middleStartTime ||
              this.oriHoliday[i].endTime === middleEndTime ||
              (this.oriHoliday[i].startTime < middleStartTime &&
                this.oriHoliday[i].endTime > middleStartTime) ||
              (this.oriHoliday[i].startTime > middleStartTime &&
                this.oriHoliday[i].startTime < middleEndTime) ||
              (this.oriHoliday[i].startTime < middleStartTime &&
                this.oriHoliday[i].endTime > middleEndTime)
            ) {
              if (this.tipErrorConfig.show) {
                this.$Notice.error({
                  title: '提示',
                  desc: '同等类型的假日时间不能交叉',
                  duration: this.tipErrorConfig.dur
                })
              }
              return
            }
          }
          if (
            this.oriHoliday[i].holidayName === data.holidayName &&
            this.tipErrorConfig.show
          ) {
            this.$Notice.error({
              title: '提示',
              desc: '模板名称已存在！',
              duration: this.tipErrorConfig.dur
            })
            return
          }
        }
        this.addHolidayByUser(addData)
          .then(suc => {
            this.getHolidayFun()
            this.$Notice.success({
              title: '提示',
              desc: '参数保存成功',
              duration: 2
            })
          })
          .catch(err => {
            console.log('add holiday err:' + err)
            if (this.tipErrorConfig.show) {
              this.$Notice.error({
                title: '提示',
                desc: '参数保存失败',
                duration: this.tipErrorConfig.dur
              })
            }
          })
      } else {
        addData._id = this.holidayList[this.changeindexFlag]._id
        for (let i = 0; i < this.oriHoliday.length; i++) {
          if (this.oriHoliday[i].type === data.type) {
            const middleStartTime = parseInt(addData.startTime)
            const middleEndTime = parseInt(addData.endTime)
            if (this.oriHoliday[i]._id !== addData._id) {
              if (
                this.oriHoliday[i].startTime === middleStartTime ||
                this.oriHoliday[i].endTime === middleEndTime ||
                (this.oriHoliday[i].startTime < middleStartTime &&
                  this.oriHoliday[i].endTime > middleStartTime) ||
                (this.oriHoliday[i].startTime > middleStartTime &&
                  this.oriHoliday[i].startTime < middleEndTime) ||
                (this.oriHoliday[i].startTime < middleStartTime &&
                  this.oriHoliday[i].endTime > middleEndTime)
              ) {
                if (this.tipErrorConfig.show) {
                  this.$Notice.error({
                    title: '提示',
                    desc: '同等类型的假日时间不能交叉',
                    duration: this.tipErrorConfig.dur
                  })
                }
                return
              }
            }
          }
          if (
            this.oriHoliday[i].holidayName === data.holidayName &&
            i !== this.changeindexFlag &&
            this.tipErrorConfig.show
          ) {
            this.$Notice.error({
              title: '提示',
              desc: '模板名称已存在！',
              duration: this.tipErrorConfig.dur
            })
            return
          }
        }
        this.changeHolidayByUser(addData)
          .then(suc => {
            this.getHolidayFun()
            this.$Notice.success({
              title: '提示',
              desc: '参数保存成功',
              duration: 2
            })
          })
          .catch(err => {
            console.log('change holiday err:' + err)
            if (this.tipErrorConfig.show) {
              this.$Notice.error({
                title: '提示',
                desc: '参数保存失败',
                duration: this.tipErrorConfig.dur
              })
            }
          })
      }
    },
    // 将时间戳转化为普通时间
    getLocalTime(nS) {
      const moment = this.$moment
      var time = new Date(parseInt(nS) * 1000)
      time = moment(time).format('YYYY-MM-DD HH:mm:ss')
      return time
      // return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ')
    },
    // 格式化数据里的时间戳
    formatTime(arg) {
      const moment = this.$moment
      for (let i = 0; i < arg.length; i++) {
        if (arg[i].type === 'date') {
          var middleTime1 = this.getLocalTime(arg[i].startTime)
          var middleTime2 = this.getLocalTime(arg[i].endTime)
          arg[i].startTime = moment(middleTime1).format('YYYY-MM-DD')
          arg[i].endTime = moment(middleTime2).format('YYYY-MM-DD')
        } else {
          var middleTime3 = this.getLocalTime(arg[i].startTime)
          var middleTime4 = this.getLocalTime(arg[i].endTime)
          arg[i].startTime = moment(middleTime3).format('MM-DD')
          arg[i].endTime = moment(middleTime4).format('MM-DD')
        }
      }
      // if (arg.length < 10) {
      //   var addlen = 10 - arg.length
      //   for (let i = 0; i < addlen; i++) {
      //     arg.push({})
      //   }
      // }
      return arg
    }
  },
  computed: {
    ...mapGetters(['getHoliday', 'tipWarningConfig', 'tipErrorConfig'])
  },
  created() {
    this.getHolidayFun()
    this.isManage = !this.$BShasPower('BS-SETTING-VIDEO-HOLIDAY-MANAGE')
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 165
  }
}
</script>
<style lang="less" scoped>
.holiday {
  flex-direction: column;
  overflow: auto;
}

.promp-style {
  height: 40px;
  line-height: 40px;
  margin-bottom: 10px 0;
  padding: 0 20px;
  background: #0f2243;
}

.holiday-form-list {
  height: 50px;
  line-height: 50px;
  margin: 0 auto;
  width: 300px;
}

.holiday .footer {
  margin: 20px 0;
}

.model-body {
  position: relative;
  padding-left: 15px;
}

.model-body div {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  position: absolute;
  top: 0;
  font-size: 16px;
  margin-left: 20px;
}
</style>
