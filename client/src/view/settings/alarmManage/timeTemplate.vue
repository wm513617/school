<template>
  <div class="bs-main bsMainChild timeTemplate">
    <div class="left-box">
      <div class="left-head">
        <div class="left-title">计划模板</div>
        <div class="time-btns">
          <Button class="add-plan" v-if="$BShasPower('BS-ALARM-TIMEPLATE-ACTION')" type="ghost" @click="selfDefine">添加</Button>
          <Button type="primary" v-if="$BShasPower('BS-ALARM-TIMEPLATE-ACTION')" @click="saveTime" class="save-btn">保存</Button>
        </div>
      </div>
      <div class="left-content">
        <bs-scroll style="height: 560px;">
          <ul class="plan-list">
            <li v-for="(item, index) in planData" :key="index" style="list-style-type:none;">
              <div class="plan" :class="{'check-color':currentIndex === index}" @click="checkModel(index)">
                <div class="name">
                  <span v-show="!item.isActive">{{item.name}}</span>
                  <Input @on-blur="done(index)" :maxlength="14" ref="Input" v-show="item.isActive" v-model="item.name" :key="item.index" />
                </div>
                <div class="operate">
                  <span @click.stop="delName(index)" v-if="$BShasPower('BS-ALARM-TIMEPLATE-ACTION')">
                    <Icon class="icon" type="close-round"></Icon>
                  </span>
                  <span @click="editName(index)" v-if="$BShasPower('BS-ALARM-TIMEPLATE-ACTION')">
                    <Icon class="icon" type="edit"></Icon>
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </bs-scroll>
      </div>
    </div>
    <div class="right-box">
      <PlanTimeTable :buttonWidth="642.5" :timetable="timeData" :tablewidth="878" :showDel="$BShasPower('BS-ALARM-TIMEPLATE-ACTION')"></PlanTimeTable>
    </div>
  </div>
</template>
<script>
import PlanTimeTable from '../../../components/common/timePick/PlanTimeTable'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'timeTemplate',
  components: {
    PlanTimeTable
  },
  data() {
    return {
      timeData: [],
      planData: [],
      orgData: [], // 用于对比处理后的原始数据
      orgLength: '', // 原始数据的长度
      delIndex: '',
      currentIndex: '',
      customNum: 0
    }
  },
  computed: {
    ...mapState({
      getTempData: ({ timeTemplate }) => timeTemplate.tempData
    }),
    ...mapGetters(['tipWarningConfig', 'tipErrorConfig'])
  },
  methods: {
    ...mapActions(['getAlarmTemp', 'addAlarmTemp', 'editAlarmTemp', 'delAlarmTemp', 'getNewPlan']),
    getTimeTemp() {
      this.getAlarmTemp()
        .then(suc => {
          this.planData = this.dealData(JSON.parse(JSON.stringify(this.getTempData)))
          this.orgData = this.stringData(JSON.parse(JSON.stringify(this.planData)))
          this.orgLength = this.planData.length
          if (this.planData.length === 0) {
            this.selfDefine()
          } else {
            this.checkModel(0)
          }
        })
        .catch(err => {
          console.log('logout error:' + err)
          if (this.tipErrorConfig.show) {
            this.$Notice.error({
              title: '警告',
              desc: '时间模板数据获取失败',
              duration: this.tipErrorConfig.dur,
              top: 200
            })
          }
        })
    },
    // 切换计划模板并联动
    checkModel(index) {
      this.currentIndex = index
      this.timeData = this.planData[index].timeData
    },
    // 创建新计划
    selfDefine() {
      if (this.planData.length !== 0) {
        this.planData.map(item => {
          item.isActive = false
        })
      }
      this.customNum++
      this.planData.push({
        name: '自定义' + this.customNum,
        isActive: true,
        timeData: [
          { timeList: [] },
          { timeList: [] },
          { timeList: [] },
          { timeList: [] },
          { timeList: [] },
          { timeList: [] },
          { timeList: [] },
          { timeList: [] }
        ]
      })
      this.timeData = this.planData[this.planData.length - 1].timeData
      if (this.planData.length !== 0) {
        this.currentIndex = this.planData.length - 1
        setTimeout(() => {
          this.$refs.Input[this.planData.length - 1].focus()
        }, 0)
      }
    },
    // 删除计划
    delName(index) {
      setTimeout(() => {
        this.$refs.Input[index].focus()
      }, 0)
      this.delIndex = index
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除吗?</p>',
        onOk: () => {
          this.sureDel()
        }
      })
    },
    sureDel() {
      let id = this.planData[this.delIndex]._id
      if (id) {
        this.delAlarmTemp(id)
          .then(suc => {
            this.orgData = this.stringData(JSON.parse(JSON.stringify(this.planData)))
            this.orgLength = this.planData.length
            this.getTimeTemp()
          })
          .catch(err => {
            if (err.response.data.code === -1) {
              this.errorMsg('模板已被使用不能删除')
            } else {
              this.errorMsg('删除失败请重试')
            }
            console.log('delect temeplate err:' + err)
          })
      } else {
        this.planData.splice(this.delIndex, 1)
        this.currentIndex = this.currentIndex - 1
        this.timeData = this.planData[this.delIndex - 1].timeData
      }
    },
    // 修改计划
    editName(index) {
      this.planData[index].isActive = true
      setTimeout(() => {
        this.$refs.Input[index].focus()
      }, 0)
    },
    done(index) {
      if (this.planData[index].name === '') {
        this.errorMsg('名称不能为空')
      } else {
        this.planData[index].isActive = false
      }
    },
    // 数据对比转换方法
    stringData(data) {
      let orglist = []
      for (let i = 0; i < data.length; i++) {
        let name = data[i].name
        let dataList = data[i].elements
        let dataArr = []
        dataArr.push(name)
        if (dataList) {
          for (let item in dataList) {
            let weekData = dataList[item]
            let dayData = item
            for (let j = 0; j < weekData.length; j++) {
              dayData += String(weekData[j].beginTime) + String(weekData[j].endTime)
            }
            dataArr.push(dayData)
          }
        }
        orglist.push(dataArr)
      }
      let dealArr = []
      for (let x = 0; x < orglist.length; x++) {
        dealArr.push(orglist[x].join(''))
      }
      return dealArr
    },
    // 检查数据是否修改
    inspectData() {},
    // 保存计划
    saveTime() {
      for (let i = 0; i < this.planData.length; i++) {
        if (this.planData[i].name === '') {
          this.errorMsg('名称不能为空')
          return
        }
        for (let j = i + 1; j < this.planData.length; j++) {
          if (i !== j && this.planData[i].name === this.planData[j].name) {
            this.errorMsg('名称不能重复')
            return
          }
        }
      }
      this.timeArrdeal()
      let nowData = this.stringData(this.planData)
      // 进行过修改的数组
      let changed = []
      for (let z = 0; z < this.orgLength; z++) {
        let result = this.orgData.indexOf(nowData[z])
        if (result === -1) {
          changed.push(this.planData[z])
        }
      }
      changed.map((v, i) => {
        this.editAlarmTemp(v)
          .then(suc => {
            if (i === changed.length - 1) {
              this.getTimeTemp()
            }
          })
          .catch(err => {
            console.log('logout error:' + err)
            this.errorMsg('保存失败请重试')
          })
      })
      // 新添加的数组
      let add = []
      for (let i = 0; i < this.planData.length; i++) {
        if (!this.planData[i]._id) {
          add.push(this.planData[i])
        }
      }
      add.map((v, i) => {
        this.addAlarmTemp(v)
          .then(suc => {
            if (i === add.length - 1) {
              this.getTimeTemp()
            }
          })
          .catch(() => {
            this.errorMsg('保存失败请重试')
          })
      })
      if (changed.length === 0 && add.length === 0) {
        this.errorMsg('保存失败请重试')
        this.getTimeTemp()
      }
    },
    // 服务端到页面-时间模板数据处理
    dealData(data) {
      const dataList = []
      // 遍历所有计划模板
      for (let i = 0; i < data.length; i++) {
        data[i].isActive = false
        let planList = data[i].elements
        let timesInfo = [
          { timeList: [] },
          { timeList: [] },
          { timeList: [] },
          { timeList: [] },
          { timeList: [] },
          { timeList: [] },
          { timeList: [] },
          { timeList: [] }
        ]
        // 遍历周计划所有
        for (let week in planList) {
          let dayPlan = planList[week]
          let index = Number(week.slice(4)) - 1
          // 遍历天计划所有
          for (let day in dayPlan) {
            let startTime = dayPlan[day].beginTime
            let endTime = dayPlan[day].endTime
            let time = this.analyTime(startTime, endTime)
            timesInfo[index].timeList.push(time)
          }
        }
        data[i].timeData = timesInfo
        dataList.push(data[i])
      }
      return dataList
    },
    // 服务端到页面-时间转换
    analyTime(startTime, endTime) {
      let start = Number(startTime)
      let end = Number(endTime)
      const hour = 60 * 60
      const minute = 60
      let startHouer = parseInt(start / hour)
      let startMin = (start % hour) / minute
      let endHouer = parseInt(end / hour)
      let endMin = (end % hour) / minute
      let analyTime = {
        startHouer: startHouer,
        startMin: startMin,
        endHouer: endHouer,
        endMin: endMin,
        isActive: false
      }
      return analyTime
    },
    // 页面到服务端-时间模板处理
    timeArrdeal() {
      for (let a = 0; a < this.planData.length; a++) {
        let weekData = this.planData[a].timeData
        if (weekData !== undefined) {
          // 存放处理后的发送服务器的时间数据
          let elements = {
            week1: [],
            week2: [],
            week3: [],
            week4: [],
            week5: [],
            week6: [],
            week7: [],
            week8: []
          }
          // 遍历 周
          for (let i = 0; i < weekData.length; i++) {
            let dayTimeData = weekData[i].timeList
            let key = 'week' + (i + 1)
            // 遍历 天
            for (let j = 0; j < dayTimeData.length; j++) {
              let startHouer = dayTimeData[j].startHouer
              let startMin = dayTimeData[j].startMin
              let endHouer = dayTimeData[j].endHouer
              let endMin = dayTimeData[j].endMin
              let beginTime = startHouer * 3600 + startMin * 60
              let endTime = endHouer * 3600 + endMin * 60
              let plan = {
                beginTime: parseInt(beginTime),
                endTime: parseInt(endTime)
              }
              elements[key].push(plan)
            }
          }
          // elements中无数据的week删除
          for (let item in elements) {
            if (elements[item].length === 0) {
              delete elements[item]
            }
          }
          this.planData[a].elements = elements
          delete this.planData[a].isActive
          delete this.planData[a].timeData
        }
      }
    }
  },
  created() {
    // if (this.planData.length === 0) {
    //   this.selfDefine()
    // }
    this.getTimeTemp()
  }
}
</script>
<style scoped>
.bs-main {
  display: flex;
  flex: 1;
  font-size: 12px;
  /*background-color: #1c3053;*/
  width: 100%;
  /*min-height: 900px;*/
  height: 100%;
}

.box {
  margin-left: 20px;
  margin-top: 20px;
}

.left-box {
  background: #0f2243;
  margin: 10px 0 0 10px;
  width: 290px;
  height: 570px;
  float: left;
}

.left-head {
  height: 50px;
  line-height: 50px;
  margin: 0;
  padding: 0 10px 0 0;
}

.right-box {
  width: 930px;
  height: 500px;
  float: left;
  margin-top: 80px;
  margin-left: 100px;
  padding: 15px;
}

.left-title {
  display: inline-block;
  height: 50px;
  line-height: 50px;
  margin-left: -80px;
  font-size: 14px;
  font-weight: 10;
}

.left-content {
  margin-top: 0px;
  background: #0f2243;
  width: 100%;
  height: 100%;
  border-top: 1px solid #1c3053;
  /*border: 1px solid #5d5d5d;*/
}

.plan {
  width: 100%;
  height: 56px;
}

.plan:hover {
  color: #20a0ff;
  background-color: #20365c;
}

/* .plan > div { */
/* min-width: 100px;
  height: 56px;
  line-height: 56px; */
/* } */

.name {
  margin-left: 20px;
  float: left;
  min-width: 120px;
  height: 60%;
  height: 56px;
  line-height: 56px;
}

.operate {
  float: right;
  height: 39%;
  height: 56px;
  line-height: 56px;
  padding-right: 24px;
}

.operate span {
  float: right;
  width: 30px;
  height: 56px;
  line-height: 56px;
  cursor: pointer;
}

.operate span i {
  margin-left: 10px;
}

.plan-list .check-color {
  background-color: #2a436a;
}

.time-btns {
  float: right;
  display: inline-block;
}

.plan-list {
  height: 100%;
  width: 100%;
}
</style>
