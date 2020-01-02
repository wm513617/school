<template>
  <Form :model="carInfoData" ref="carInfoData" id="CarForm" :rules="ruleCustom" label-position="left" :label-width="80">
    <Form-item label="车牌号" prop="plateNumber">
      <Input v-model="carInfoData.plateNumber" placeholder="请输入"></Input>
    </Form-item>
    <Form-item label="颜色">
      <Select v-model="carInfoData.color" placeholder="请选择车身颜色">
        <Option value="1">白色</Option>
        <Option value="2">黑色</Option>
        <Option value="3">红色</Option>
      </Select>
    </Form-item>
    <Form-item label="品牌">
      <Select v-model="carInfoData.brand" placeholder="请选择车辆品牌">
        <Option value="1">奔驰</Option>
        <Option value="2">宝马</Option>
        <Option value="3">奥迪</Option>
      </Select>
    </Form-item>
    <Form-item label="类型">
      <Select v-model="carInfoData.type" placeholder="请选择车辆类型">
        <Option value="1">轿车</Option>
        <Option value="2">商务</Option>
        <Option value="3">卡车</Option>
      </Select>
    </Form-item>
    <Form-item label="开始时间">
      <Row>
        <Date-picker type="date" placeholder="选择日期"></Date-picker>
      </Row>
    </Form-item>
    <Form-item label="结束时间">
      <Row>
        <Date-picker type="date" placeholder="选择日期"></Date-picker>
      </Row>
    </Form-item>
    <Form-item label="设备">
      <Select v-model="carInfoData.videoChannel" multiple>
        <Option-group label="热门城市">
          <Option v-for="item in cityList1" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Option-group>
        <Option-group label="其它城市">
          <Option v-for="item in cityList2" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Option-group>
      </Select>
    </Form-item>
    <Form-item>
      <Button type="primary" @click="handleSubmit('carInfoData')">提交</Button>
      <Button type="ghost" @click="handleReset('carInfoData')" style="margin-left: 8px">重置</Button>
    </Form-item>
  </Form>
</template>
<script>
export default {
  name: 'BScarForm',
  props: ['value'],
  data() {
    const validatePlateNumber = (rule, value, callback) => {
      const re = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/
      if (value.search(re) === -1) {
        return callback(new Error('格式不正确'))
      } else {
        callback()
      }
    }
    return {
      carInfoData: {
        plateNumber: '',
        color: '',
        brand: '',
        videoChannel: [],
        beginDate: '',
        endDate: '',
        beginTime: '',
        endTime: ''
      },
      cityList: [
        {
          value: '1',
          label: '北京市'
        },
        {
          value: '2',
          label: '上海市'
        },
        {
          value: '3',
          label: '深圳市'
        },
        {
          value: '4',
          label: '杭州市'
        },
        {
          value: '5',
          label: '南京市'
        },
        {
          value: '6',
          label: '重庆市'
        }
      ],
      cityList1: [
        {
          value: '1',
          label: '北京市'
        },
        {
          value: 'shanghai',
          label: '上海市'
        },
        {
          value: '3',
          label: '深圳市'
        }
      ],
      cityList2: [
        {
          value: '4',
          label: '杭州市'
        },
        {
          value: '5',
          label: '南京市'
        },
        {
          value: '6',
          label: '重庆市'
        }
      ],
      ruleCustom: {
        plateNumber: [
          { validator: validatePlateNumber, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // ruleCustom () {

    // },
    getDateRang(val) {
      this.carInfoData.beginDate = val.split(' - ')[0]
      this.carInfoData.endDate = val.split(' - ')[1]
    },
    getTimeRang(val) {
      this.carInfoData.beginTime = val[0]
      this.carInfoData.endTime = val[1]
    },
    handleReset(name) {
      this.carInfoData = {
        plateNumber: '',
        color: '',
        brand: '',
        videoChannel: [],
        beginDate: '',
        endDate: '',
        beginTime: '',
        endTime: ''
      }
    },
    handleSubmit(name) {
      this.$emit('handle', this.carInfoData)
    }
  },
  computed: {
    dateRang: function() {
      return [this.carInfoData.beginDate, this.carInfoData.endDate]
    },
    timeRang: function() {
      return [this.carInfoData.beginTime, this.carInfoData.endTime]
    }
  },
  watch: {
    value: {
      handler: function(val) {
        if (val) {
          this.carInfoData = val
        }
      },
      deep: true
    }
  }

}
</script>
