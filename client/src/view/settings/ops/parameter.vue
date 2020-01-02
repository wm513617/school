<template>
  <div class="parameter bs-content">
    <div class="bs-main">
      <div class="bsMainChild">
        <div style="margin:48px 0 24px 48px">
          <Form :model="deviceFormData" label-position="left" :label-width="120" ref="deviceVideOneForm" :rules="timeCheck">
            <FormItem label="录像监测间隔：" prop="minite">
              <Input v-model="deviceFormData.minite" style="width:280px"></Input>
              <span>分钟（20 - 1440）</span>
            </FormItem>
          </Form>
        </div>
        <Button type="primary" style="margin-left:394px;height:32px;">保存</Button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    const checkTime = (rule, value, callback) => {
      let reg = /^\d+$/
      if (!value) {
        callback(new Error('不能为空'))
      } else if (!reg.test(value)) {
        return callback(new Error('请输入数字'))
      } else if (Number(value) > 1440) {
        return callback(new Error('超过最大值'))
      } else if (Number(value) < 20) {
        return callback(new Error('小于最小值'))
      } else {
        callback()
      }
    }
    return {
      deviceFormData: {
        minite: '30'
      },
      timeCheck: {
        minite: [{ required: true, validator: checkTime, trigger: 'change' }]
      }
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
  }
}
</script>

<style scoped>
.bs-main {
  min-height: 670px;
  background: #1c3053;
}
.bsMainChild {
  width: 100%;
  background: #1c3053;
  position: relative;
}
</style>
