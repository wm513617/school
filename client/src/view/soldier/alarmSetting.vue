<template>
  <div class="bs-main alarm-setting">
    <div class="alarm-connent">
      <div class="alarm-check">
      <Checkbox v-model="single" @on-change="showSetting">启用点位报警</Checkbox>
      </div>
      <div v-show="single">
        <Form ref="taskInfo" :model="taskInfo" :label-width="60" label-position="left">
          <FormItem label="逗留时长">
            <InputNumber :min="10" :max="120" :step="5" v-model="taskInfo.duration" editable></InputNumber>
            <span>mins</span>
          </FormItem>
          <FormItem label="位置偏移">
            <InputNumber :min="10" :max="50" :step="1" v-model="taskInfo.meter" editable></InputNumber>
            <span>m</span>
          </FormItem>
          <Button  @click="onSave">保存</Button>
        </Form>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  components: {
  },
  data() {
    return {
      single: false,
      taskInfo: {
        duration: 10,
        meter: 10
      }
    }
  },
  computed: {
    ...mapState({
    })
  },
  methods: {
    ...mapActions(['setPointInfo', 'getUserSetting']),
    // 配置向显隐
    showSetting(val) {
      this.single = val
      this.setPointInfo({start: false})
    },
    // 保存
    onSave() {
      this.setPointInfo({duration: this.taskInfo.duration, meter: this.taskInfo.meter, start: true}).then(res => {
        this.$Notice.success({
          title: '设置成功'
        })
      }
      ).catch(err => {
        this.errorMsg(err.response.data.message)
        console.log(err)
      })
    }
  },
  created() {
    this.getUserSetting().then(res => {
      this.taskInfo.duration = res[0].duration
      this.taskInfo.meter = res[0].meter
      this.single = res[0].start
    })
  }
}
</script>
<style lang="less" scoped>
.alarm-connent {
  padding: 30px 50px;
  .alarm-check {
    padding: 24px 0px;
  }
  button {
    margin-left: 36px;
  }
}
</style>
