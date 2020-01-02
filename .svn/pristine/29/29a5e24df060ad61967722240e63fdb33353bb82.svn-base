<!-- 车辆轨迹查询表单 -->
<template>
  <div>
    <div class="trackContent">
      <Form :rules="validateRules" ref="vehicleForm" :model="vehicleForm" :label-width="100" label-position="left">
        <FormItem label="车牌号" prop="plateNumber">
          <Input v-model="vehicleForm.plateNumber" placeholder="" style="width:350px;" />
        </FormItem>
        <FormItem label="经过时间">
          <DatePicker type="datetime" placeholder="开始时间" style="width: 155px; margin-right: 10px;"></DatePicker>
          <span>至</span>
          <DatePicker type="datetime" placeholder="结束时间" style="width: 155px; margin-left: 10px;"></DatePicker>
        </FormItem>
        <div style="margin: -20px 0 10px 0;"><Checkbox v-model="vehicleForm.searchAll">全部查询</Checkbox></div>
        <FormItem label="查询范围">
          <Input v-model="vehicleForm.searchScope" placeholder="" style="width:350px;" />
        </FormItem>
      </Form>
    </div>
    <div class="trackFoot">
      <Button type="primary" @click="confirmSearch">确认</Button>
      <Button type="text" @click="cannelSearch">取消</Button>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
export default {
  name: 'VehicleForm',
  data() {
    return {
      vehicleForm: {
        plateNumber: '', // 车牌号
        searchAll: true, // 是否全部查询
        searchScope: '' // 查询范围
      },
      validateRules: { // 表单校验规则
        plateNumber: [{ required: true, message: '请输入车牌号', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      showTrackModal: ({ tdIndex }) => tdIndex.showTrackModal, // 是否显示轨迹查询弹出框---韩杰---2018-10-25
      showDrawTrack: ({ tdIndex }) => tdIndex.showDrawTrack // 是否显示绘制轨迹---韩杰---2018-10-25
    })
  },
  methods: {
    ...mapActions(['setShowTrackModal', 'setShowDrawTrack']),
    cannelSearch() { // 取消查询
      this.setShowTrackModal(false)
    },
    confirmSearch() { // 确认查询
      this.setShowTrackModal(false)
    }
  }
}
</script>

<style scoped>
  /* 内容样式 */
  .trackContent {
    padding: 0 60px;
    min-height: 100px;
    height: auto;
  }
  /* 尾部部样式 */
  .trackFoot {
    background: #0f2343;
    height: 40px;
    padding: 0 24px;
    margin: 0 -6px -24px -6px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px
  }
  .trackFoot button {
    height: 30px;
    float: right;
    margin: 5px 8px 5px 8px;
  }
  .trackFoot button:first-child {
    float: right;
    margin-right: 0;
  }
</style>
