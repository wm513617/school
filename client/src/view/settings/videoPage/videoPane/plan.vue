<template>
  <div class="plan-box bs-main main-page-bg">
    <div class="left-box">
      <div class="left-head">
        <div class="custom-button">
          <Button type="ghost" @click="selfDefine">自定义</Button>
          <Button type="primary" :disabled="isManage" @click="savePlans">保存</Button>
        </div>
        <h4 style="marginLeft:10px;fontSize:14px">计划模板</h4>
      </div>
      <div class="left-content">
        <bs-scroll>
          <div class="selet-model" :class="{'check-color':currentIndex === index}" @click="checkModel(index)" v-for="(item, index) in plans" :key="index">
            <div class="edit-box">
              <div class="query-style edit-child" @click="delectMould(index)">
                <Icon type="close-round"></Icon>
              </div>
              <div class="query-style edit-child" @click="editMould(index)">
                <Icon type="edit"></Icon>
              </div>
            </div>
            <span v-show="!item.isAct">{{item.name}}</span>
            <Input @on-blur="done(index)" ref="Input" v-show="item.isAct" :maxlength="14" v-model.trim="item.name" style="width: 150px" :key="item.index"></Input>
          </div>
        </bs-scroll>
      </div>
    </div>
    <div class="right-box">
      <PlanTimeTable :buttonWidth="642.5" :timetable="datas"></PlanTimeTable>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import PlanTimeTable from '../../../../components/common/timePick/PlanTimeTable'
export default {
  name: 'timeTemplate',
  components: {
    PlanTimeTable
  },
  data() {
    return {
      isManage: false,
      loading: false,
      customNum: 0,
      currentIndex: 0,
      plans: [],
      datas: [],
      originalLength: 0,
      middle: []
      // defaultList: [
      //   {
      //     name: '全天',
      //     isAct: false,
      //     dates: [
      //       { week: 1, timeList: [] },
      //       { week: 2, timeList: [] },
      //       { week: 3, timeList: [] },
      //       { week: 4, timeList: [] },
      //       { week: 5, timeList: [] },
      //       { week: 6, timeList: [] },
      //       { week: 7, timeList: [] },
      //       { week: 8, timeList: [] }]
      //   },
      //   {
      //     name: '工作时间',
      //     isAct: false,
      //     dates: [
      //       { week: 1, timeList: [] },
      //       { week: 2, timeList: [] },
      //       { week: 3, timeList: [] },
      //       { week: 4, timeList: [] },
      //       { week: 5, timeList: [] },
      //       { week: 6, timeList: [] },
      //       { week: 7, timeList: [] },
      //       { week: 8, timeList: [] }]
      //   },
      //   {
      //     name: '工作日24小时',
      //     isAct: false,
      //     dates: [
      //       { week: 1, timeList: [] },
      //       { week: 2, timeList: [] },
      //       { week: 3, timeList: [] },
      //       { week: 4, timeList: [] },
      //       { week: 5, timeList: [] },
      //       { week: 6, timeList: [] },
      //       { week: 7, timeList: [] },
      //       { week: 8, timeList: [] }]
      //   }, {
      //     name: '节假日',
      //     isAct: false,
      //     dates: [
      //       { week: 1, timeList: [] },
      //       { week: 2, timeList: [] },
      //       { week: 3, timeList: [] },
      //       { week: 4, timeList: [] },
      //       { week: 5, timeList: [] },
      //       { week: 6, timeList: [] },
      //       { week: 7, timeList: [] },
      //       { week: 8, timeList: [] }]
      //   }
      // a.unshift(); // 添加到第一个位置
      // ]
    }
  },
  computed: {
    ...mapGetters(['getPlan', 'tipWarningConfig', 'tipErrorConfig'])
  },
  methods: {
    ...mapActions(['getplanByUser', 'addPlanByUser', 'delectPlanByUser', 'changePlanByUser']),
    // 点击删除模板图标
    delectMould(index) {
      // if (this.plans[index].name === '全天' || this.plans[index].name === '工作时间' || this.plans[index].name === '工作日24小时' || this.plans[index].name === '节假日') {
      //   this.$Notice.warning({
      //     title: '提示',
      //     desc: '默认模板不能删除',
      //     duration: 2
      //   })
      // } else {
      this.delId = this.plans[index].id
      this.delIndex = index
      this.$Modal.confirm({
        title: '警告',
        content: '<p>您确认要删除此模板?</p>',
        onOk: () => {
          this.okDelect()
        }
      })
      // }
    },
    // 确认删除模板
    okDelect() {
      if (this.plans[this.currentIndex]._id) {
        this.delectPlanByUser({ _id: this.plans[this.currentIndex]._id })
          .then(suc => {
            this.plans.splice(this.currentIndex, 1)
            this.currentIndex = 0
            this.datas = this.plans[0].dates
            this.initGetPlanByUser()
            this.$Notice.success({
              title: '提示',
              desc: '删除成功',
              duration: 2
            })
          })
          .catch(err => {
            if (err.response.data.code === 4104 && this.tipErrorConfig.show) {
              this.$Notice.error({
                title: '提示',
                desc: '模板已被使用不能删除',
                duration: this.tipErrorConfig.dur
              })
            } else {
              if (this.tipErrorConfig.show) {
                this.$Notice.error({
                  title: '提示',
                  desc: '删除失败',
                  duration: this.tipErrorConfig.dur
                })
              }
            }
            console.log('delect temeplate err:' + err)
          })
      } else {
        this.plans.splice(this.currentIndex, 1)
        this.$Notice.success({
          title: '提示',
          desc: '删除成功',
          duration: 2
        })
      }
    },
    // 点击编辑文本框
    editMould(index) {
      this.$set(this.plans[index], 'isAct', true)
      setTimeout(() => {
        this.$refs.Input[index].focus()
      }, 0)
    },
    // 失焦之后
    done(index) {
      this.$set(this.plans[index], 'isAct', false)
      if (this.plans[index].name === '') {
        this.errorMsg('计划模板名称不能为空')
      }
    },
    // 选择模板
    checkModel(index) {
      this.currentIndex = index
      if (this.middle[index]) {
        this.plans[index].dates = JSON.parse(JSON.stringify(this.middle[index].dates))
      } else {
        this.plans[index].dates = [
          { week: 1, timeList: [] },
          { week: 2, timeList: [] },
          { week: 3, timeList: [] },
          { week: 4, timeList: [] },
          { week: 5, timeList: [] },
          { week: 6, timeList: [] },
          { week: 7, timeList: [] },
          { week: 8, timeList: [] }
        ]
      }
      this.datas = []
      this.datas = this.plans[index].dates
    },
    // 添加模板
    selfDefine() {
      this.customNum++
      this.plans.push({
        name: '自定义' + this.customNum,
        isAct: true,
        dates: [
          { week: 1, timeList: [] },
          { week: 2, timeList: [] },
          { week: 3, timeList: [] },
          { week: 4, timeList: [] },
          { week: 5, timeList: [] },
          { week: 6, timeList: [] },
          { week: 7, timeList: [] },
          { week: 8, timeList: [] }
        ]
      })
      this.currentIndex = this.plans.length - 1
      this.editMould(this.currentIndex)
      this.datas = this.plans[this.currentIndex].dates
    },
    // 保存模板
    savePlans() {
      this.loading = true
      for (let i = 0; i < this.plans.length; i++) {
        for (let j = i + 1; j < this.plans.length; j++) {
          if (i !== j && this.plans[i].name === this.plans[j].name && this.tipErrorConfig.show) {
            this.$Notice.error({
              title: '提示',
              desc: '添加的模板名称不能重名',
              duration: this.tipErrorConfig.dur
            })
            this.loading = false
            return
          }
        }
      }
      var addPlanList = []
      for (let i = 0; i < this.plans.length; i++) {
        if (!this.plans[i]._id) {
          addPlanList.push(this.plans[i])
        }
      }
      var changeList = []
      this.middle.map((val, index) => {
        this.plans.map((v, i) => {
          if (v._id === val._id) {
            if (v.name !== val.name) {
              changeList.push(i)
            } else {
              v.dates.map((v1, i1) => {
                if (v1.timeList.length !== val.dates[i1].timeList.length) {
                  changeList.push(i)
                } else {
                  v1.timeList.map((v2, i2) => {
                    if (
                      v2.startHouer !== val.dates[i1].timeList[i2].startHouer ||
                      v2.endMin !== val.dates[i1].timeList[i2].endMin ||
                      v2.startMin !== val.dates[i1].timeList[i2].startMin ||
                      v2.endHouer !== val.dates[i1].timeList[i2].endHouer
                    ) {
                      changeList.push(i)
                    }
                  })
                }
              })
            }
          }
        })
      })
      var changeIndexList = changeList.filter(function(element, index, self) {
        return self.indexOf(element) === index
      })
      var saveChangeList = []
      for (let i = 0; i < changeIndexList.length; i++) {
        saveChangeList.push(JSON.parse(JSON.stringify(this.plans[changeIndexList[i]])))
      }
      saveChangeList = this.formatSubmit(saveChangeList)
      saveChangeList.map((v, i) => {
        this.changePlanByUser({ v })
          .then(suc => {
            this.originalLength = this.originalLength + addPlanList.length
            if (i === saveChangeList.length - 1 && addPlanList.length === 0) {
              this.getplanByUser()
                .then(suc1 => {
                  this.middle = this.formatPlans(JSON.parse(JSON.stringify(suc1.data)))
                  this.plans = this.formatPlans(JSON.parse(JSON.stringify(suc1.data)))
                  this.originalLength = this.plans.length
                  this.datas = this.plans[this.currentIndex].dates
                })
                .catch(err => {
                  console.log('get holiday err' + err)
                })
              this.$Notice.success({
                title: '提示',
                desc: '参数保存成功',
                duration: 2
              })
            }
            this.loading = false
          })
          .catch(err => {
            this.loading = false
            console.log('save change err:' + err)
          })
      })
      addPlanList = this.formatSubmit(addPlanList)
      addPlanList.map((v, i) => {
        this.addPlanByUser(v)
          .then(suc => {
            this.originalLength = this.originalLength + addPlanList.length
            this.loading = false
            if (i === addPlanList.length - 1) {
              this.getplanByUser()
                .then(suc1 => {
                  this.middle = this.formatPlans(JSON.parse(JSON.stringify(suc1.data)))
                  this.plans = this.formatPlans(JSON.parse(JSON.stringify(suc1.data)))
                  this.originalLength = this.plans.length
                  this.datas = this.plans[this.currentIndex].dates
                })
                .catch(err => {
                  console.log('get holiday err' + err)
                })
              this.$Notice.success({
                title: '提示',
                desc: '参数保存成功',
                duration: 2
              })
            }
          })
          .catch(err => {
            this.loading = false
            console.log('add plan err' + err)
          })
      })
      if (saveChangeList.length === 0 && addPlanList.length === 0) {
        this.loading = false
        if (this.tipWarningConfig.show) {
          this.$Notice.warning({
            title: '提示',
            desc: '您未做任何修改！',
            duration: this.tipWarningConfig.dur
          })
        }
      }
    },
    // 格式化返回的数据
    formatPlans(reciveList) {
      const planLists = []
      reciveList.map(item => {
        const arr = [
          { timeList: [] },
          { timeList: [] },
          { timeList: [] },
          { timeList: [] },
          { timeList: [] },
          { timeList: [] },
          { timeList: [] },
          { timeList: [] }
        ]
        try {
          item.elements.map((v, i) => {
            arr[v.week - 1] = {
              timeList: v.timeList.map((value, index) => {
                return {
                  startHouer: parseInt(value.beginTime / 3600),
                  startMin: parseInt((value.beginTime % 3600) / 60),
                  endHouer: parseInt(value.endTime / 3600),
                  endMin: parseInt((value.endTime % 3600) / 60),
                  isActive: false
                }
              })
            }
          })
        } catch (err) {
          console.log(err)
        }
        planLists.push({
          name: item.name,
          _id: item._id,
          dates: arr
        })
      })
      return planLists
    },
    // 提交数据时将数据格式化为服务器需要的格式
    // 格式化返回的数据
    formatSubmit(reciveList) {
      const planSubmit = []
      reciveList.map(item => {
        const arr = [
          { timeList: [], week: '1' },
          { timeList: [], week: '2' },
          { timeList: [], week: '3' },
          { timeList: [], week: '4' },
          { timeList: [], week: '5' },
          { timeList: [], week: '6' },
          { timeList: [], week: '7' },
          { timeList: [], week: '8' }
        ]
        try {
          item.dates.map((v, i) => {
            arr[i] = {
              timeList: v.timeList.map((value, index) => {
                return {
                  beginTime: parseInt(value.startHouer * 3600 + value.startMin * 60),
                  endTime: parseInt(value.endHouer * 3600 + value.endMin * 60)
                }
              }),
              week: i + 1 + ''
            }
          })
        } catch (err) {
          console.log(err)
        }
        planSubmit.push({
          name: item.name,
          _id: item._id,
          elements: arr
        })
      })
      return planSubmit
    },
    initGetPlanByUser() {
      this.getplanByUser()
        .then(suc => {
          this.middle = this.formatPlans(JSON.parse(JSON.stringify(suc.data)))
          this.plans = this.formatPlans(JSON.parse(JSON.stringify(suc.data)))
          // var defualtIndex = _.findIndex(this.plans, function (chr) {
          //   return chr.name === '全天'
          // })
          // console.log(this.plans[0].name, defualtIndex)
          // if (defualtIndex < 0) {
          //   this.plans = this.defaultList.concat(this.plans)
          // }
          this.originalLength = this.plans.length
          this.datas = this.plans[0].dates
        })
        .catch(err => {
          console.log('get holiday err' + err)
        })
    }
  },
  created() {
    this.isManage = !this.$BShasPower('BS-SETTING-VIDEO-PLAN-MANAGE')
    this.initGetPlanByUser()
  }
}
</script>
<style scoped>
.selet-model .edit-box {
  display: none;
}

.selet-model:hover .edit-box {
  display: block;
}

.plan-box {
  min-height: 600px;
  background: #1c3053;
  width: 100%;
}

.left-box {
  background: #0f2243;
  margin: 10px 0 0 10px;
  width: 290px;
  height: 570px;
  float: left;
}

.right-box {
  height: 500px;
  float: left;
  margin-top: 45px;
  margin-left: 45px;
  padding: 15px;
}

.plan-box .left-head {
  height: 50px;
  line-height: 50px;
}

.left-title {
  text-align: center;
  margin-bottom: 10px;
}

.list-height {
  height: 500px;
}

.left-content {
  width: 290px;
  height: 500px;
  border-top: 1px solid #1c3053;
  background: #0f2243;
}

.plan {
  width: 100%;
  height: 40px;
}

.plan:hover {
  color: #20a0ff;
}

.plan > div {
  height: 40px;
  line-height: 40px;
}

.plan-box .custom-button {
  float: right;
  margin-right: 10px;
}

.check-color {
  background-color: #2a436a;
}

.plan-box .selet-model {
  height: 40px;
  line-height: 40px;
  width: 100%;
  padding: 0 20px;
}

.plan-box .selet-model:hover {
  background-color: #20365c;
}

.plan-box .edit-child {
  width: 40px;
  text-align: center;
  cursor: pointer;
}

.save-box {
  padding: 20px 0px;
  clear: both;
}
</style>
