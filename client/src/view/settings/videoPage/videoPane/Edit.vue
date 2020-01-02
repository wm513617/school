<template>
  <div class="edit-container edit">
    <Modal :mask-closable="false" v-model="vueShow" width="450" :title="titlename" @on-cancel="cancel">
      <div class="holiday-form-list">
        <Form ref="formCustom" label-position="left" :model="ruleData" :rules="ruleCustom" :label-width="100" style="width:430px">
          <Form-item label="节假日名称：" prop="filtrateName" style="width:420px">
            <Input :maxlength="14" v-model="ruleData.filtrateName" placeholder="请输入..."></Input>
          </Form-item>
          <Form-item label="类型：" prop="holidayModel" style="width:420px">
            <Select v-model="holidayModel">
              <Option v-for="item in modelOption" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item>
          <Form-item v-if="holidayModel === 'date'" label="开始时间：" prop="monthStart" style="width:420px">
            <Date-picker style="width:320px" :editable="false" type="date" v-model="monthStart" :clearable="false" placeholder="选择日期"></Date-picker>
          </Form-item>
          <Form-item v-if="holidayModel === 'date'" label="结束时间：" prop="monthEnd" style="width:420px">
            <Date-picker style="width:320px" :editable="false" type="date" v-model="monthEnd" :clearable="false" placeholder="选择日期"></Date-picker>
          </Form-item>
          <Form-item v-if="holidayModel === 'month'" label="开始时间：" prop="passwd" style="width:420px">
            <Select v-model="startMonth" @on-change="monthStartmFun" style="width:158px">
              <Option v-for="item in monthList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="startDay" @on-change="monthStartdFun" style="width:158px">
              <Option v-for="item in dayListStart" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item>
          <Form-item v-if="holidayModel === 'month'" label="结束时间：" prop="passwd" style="width:420px">
            <Select v-model="endMonth" @on-change="monthEndmFun" style="width:158px">
              <Option v-for="item in monthList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="endDay" @on-change="monthEnddFun" style="width:158px">
              <Option v-for="item in dayListEnd" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="cancel" type="ghost">取消</Button>
        <Button @click="affirm" type="primary">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'Edit',
  props: {
    showModal: {
      type: Boolean
    },
    newOrChangeData: {
    },
    modalType: {
      type: String
    }
  },
  data() {
    const deFiltrateName = (rule, value, callback) => {
      // var deName = /^ +| +$/g
      var deName = /^[^ ]+$/
      if (!value) {
        return callback(new Error('节假日名称不可以为空'))
      } else if (!deName.test(value)) {
        return callback(new Error('不可输入空格'))
      } else {
        callback()
      }
    }
    return {
      titlename: '修改节假日',
      ruleCustom: {
        filtrateName: [
          { required: true, validator: deFiltrateName, trigger: 'change' },
          { required: true, validator: deFiltrateName, trigger: 'blur' }
        ]
      },
      EditShow: true,
      ruleData: {
        filtrateName: ''
      },
      reverseData: {},
      holidayModel: 'date',
      monthStart: '',
      monthEnd: '',
      startMonth: '',
      startDay: '',
      endMonth: '',
      endDay: '',
      dayListStart: [],
      dayListEnd: [],
      monthList: [
        { label: '01', value: '01' },
        { label: '02', value: '02' },
        { label: '03', value: '03' },
        { label: '04', value: '04' },
        { label: '05', value: '05' },
        { label: '06', value: '06' },
        { label: '07', value: '07' },
        { label: '08', value: '08' },
        { label: '09', value: '09' },
        { label: '10', value: '10' },
        { label: '11', value: '11' },
        { label: '12', value: '12' }
      ],
      modelOption: [
        {
          value: 'date',
          label: '按日期'
        },
        {
          value: 'month',
          label: '按月份'
        }
      ]
    }
  },
  computed: {
    vueShow: {
      // getter
      get: function() {
        return this.showModal
      },
      // setter
      set: function() {
        return this.showModal
      }

    }
  },
  watch: {
    monthStart(newval) {
      const moment = this.$moment
      if (parseInt(moment(newval).format('YYYYMMDD')) > parseInt(moment(this.monthEnd).format('YYYYMMDD'))) {
        this.$set(this, 'monthEnd', newval)
      }
    },
    monthEnd(newval) {
      const moment = this.$moment
      if (parseInt(moment(this.monthStart).format('YYYYMMDD')) > parseInt(moment(newval).format('YYYYMMDD'))) {
        this.$set(this, 'monthStart', newval)
      }
    },
    startMonth(newval) {
      this.dayListStart = this.dayListFun(newval)
      if (newval > this.endMonth) { }
    },
    startDay(newval) {

    },
    endMonth(newval) {
      this.dayListEnd = this.dayListFun(newval)
    },
    endDay(newval) {

    },
    showModal(vewval) {
      this.assienment(vewval)
    }
  },
  methods: {
    assienment(val) {
      const moment = this.$moment
      if (val) {
        if (this.modalType === 'new') {
          this.titlename = '添加节假日'
          this.ruleData.filtrateName = ''
          this.holidayModel = 'date'
          this.startMonth = this.addZero((moment().startOf('day').toDate()).getMonth() + 1)
          this.startDay = this.addZero((moment().startOf('day').toDate()).getDate())
          this.endMonth = this.addZero((moment().startOf('second').toDate()).getMonth() + 1)
          this.endDay = this.addZero((moment().startOf('second').toDate()).getDate())
          this.monthStart = moment(moment().startOf('day').toDate()).format('YYYY-MM-DD')
          this.monthEnd = moment(moment().startOf('second').toDate()).format('YYYY-MM-DD')
          console.log(this.startMonth, this.startDay, this.endMonth, this.endDay, this.monthStart, this.monthEnd)
        } else if (this.modalType === 'change') {
          this.titlename = '修改节假日'
          this.ruleData.filtrateName = this.newOrChangeData.holidayName
          this.holidayModel = this.newOrChangeData.type
          if (this.holidayModel === 'date') {
            this.startMonth = moment(this.newOrChangeData.startTime).format('MM')
            this.startDay = moment(this.newOrChangeData.startTime).format('DD')
            this.endMonth = moment(this.newOrChangeData.endTime).format('MM')
            this.endDay = moment(this.newOrChangeData.endTime).format('DD')
            this.monthStart = moment(this.newOrChangeData.startTime).format('YYYY-MM-DD')
            this.monthEnd = moment(this.newOrChangeData.endTime).format('YYYY-MM-DD')
          } else if (this.holidayModel === 'month') {
            console.log(this.newOrChangeData.startTime, this.newOrChangeData.endTime)
            this.startMonth = this.newOrChangeData.startTime.split('-')[0] + ''
            this.startDay = this.newOrChangeData.startTime.split('-')[1] + ''
            this.endMonth = this.newOrChangeData.endTime.split('-')[0] + ''
            this.endDay = this.newOrChangeData.endTime.split('-')[1] + ''
            this.monthStart = moment().format('YYYY') + '-' + this.newOrChangeData.startTime
            this.monthEnd = moment().format('YYYY') + '-' + this.newOrChangeData.endTime
            console.log(this.monthStart, this.monthEnd)
          }
        }
      }
    },
    monthStartmFun(val) {
      if (parseInt(val) > parseInt(this.endMonth)) {
        this.endMonth = val
        if (parseInt(this.startDay) > parseInt(this.endDay)) {
          this.endDay = this.startDay
        }
      }
    },
    monthStartdFun(val) {
      if (parseInt(this.startMonth) === parseInt(this.endMonth)) {
        if (parseInt(val) > parseInt(this.endDay)) {
          this.endDay = val
        }
      }
    },
    monthEndmFun(val) {
      if (parseInt(val) < parseInt(this.startMonth)) {
        this.startMonth = val
        if (parseInt(this.startDay) > parseInt(this.endDay)) {
          this.startDay = this.endDay
        }
      }
    },
    monthEnddFun(val) {
      if (parseInt(this.startMonth) === parseInt(this.endMonth)) {
        if (parseInt(val) < parseInt(this.startDay)) {
          this.startDay = val
        }
      }
    },
    affirm() {
      const moment = this.$moment
      this.$refs.formCustom.validate((valid) => {
        if (valid) {
          this.reverseData.index = this.newOrChangeData.index
          this.reverseData.holidayName = this.ruleData.filtrateName
          this.reverseData.type = this.holidayModel
          if (this.holidayModel === 'date') {
            this.reverseData.startTime = moment(this.monthStart).format('YYYY-MM-DD')
            this.reverseData.endTime = moment(this.monthEnd).format('YYYY-MM-DD')
          } else {
            this.reverseData.startTime = this.startMonth + '-' + this.startDay
            this.reverseData.endTime = this.endMonth + '-' + this.endDay
          }
          var middleObj = JSON.parse(JSON.stringify(this.reverseData))
          this.$emit('click-save', middleObj, this.modalType)
        }
      })
    },
    cancel() {
      this.$emit('click-cancel')
    },
    addZero(arg) {
      if (parseInt(arg) < 10) {
        return '0' + arg
      } else {
        return arg + ''
      }
    },
    // 生成日期列表
    dayListFun(arg) {
      var tempLists = []
      var date = new Date()
      var year = date.getFullYear()
      if (arg === '02') {
        if ((year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0)) {
          for (var j = 1; j <= 29; j++) {
            tempLists.push({ label: this.addZero(j), value: this.addZero(j) })
          }
        } else {
          for (let j = 1; j <= 28; j++) {
            tempLists.push({ label: this.addZero(j), value: this.addZero(j) })
          }
        }
      } else if (arg === '01' || arg === '03' || arg === '05' || arg === '07' || arg === '08' || arg === '10' || arg === '12') {
        for (var s = 1; s <= 31; s++) {
          tempLists.push({ label: this.addZero(s), value: this.addZero(s) })
        }
      } else if (arg === '04' || arg === '06' || arg === '09' || arg === '11') {
        for (var p = 1; p <= 30; p++) {
          tempLists.push({ label: this.addZero(p), value: this.addZero(p) })
        }
      }
      return tempLists
    }
  },
  created() {
    this.assienment(this.showModal)
  }
}
</script>

<style>
.holiday-form-list .ivu-picker-panel-body {
  overflow: hidden;
  width: 320px !important;
}

.holiday-form-list .ivu-date-picker-cells {
  width: 300px !important;
}

.holiday-form-list .ivu-date-picker-cells span {
  width: calc(100% / 7 - 4px);
}

.holiday-form-list span.ivu-date-picker-cells-cell {
  width: calc(100% / 7);
  text-align: center;
}
</style>
