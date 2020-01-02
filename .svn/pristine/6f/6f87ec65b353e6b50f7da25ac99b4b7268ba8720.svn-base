<template>
  <!--报警配置 模态框-->
  <div v-if="alarmModal">
    <Modal :mask-closable="false" v-model="alarmModal" title="卡口设备报警配置" width="500" @on-cancel="cancel('formData')">
      <Form :model="formData" :label-width="100" :rules="formValidate" ref="formData" label-position="left" style="padding: 0 20px;">
        <Form-item label="报警分类">
          <Select v-model="formData.alarmtype" @on-change="alarmTypeChange">
            <Option v-for="item in this.enabledSort" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        <Form-item label="报警级别">
          <Select v-model="formData.level">
            <Option v-for="item in enabledLevel" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        <Form-item label="布撤防时间">
          <Select v-model="formData.alarmtemplate">
            <Option v-for="item in this.enabledTemp" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        <!-- <Form-item label="最大延时" prop="maxdelaytime">
          <Input v-model="formData.maxdelaytime"></Input>
        </Form-item> -->
        <!-- <Form-item label="最小间隔" prop="minintervaltime">
          <Input v-model="formData.minintervaltime"></Input>
        </Form-item> -->
        <div class="confirm">
          <div style="width:100px;">
            报警确认
          </div>
          <div>
            <Radio-group v-model="wayGroup" @on-change="showRadio">
              <Radio label="自动确认"></Radio>
              <Input-number class="confirm-time" prop="maxDelay" :disabled="inputIsShow" :min="0" :max="3600" v-model="formData.alarmaffirm.autoaffirm.intervaltime"></Input-number>
              <br>
              <Radio label="手动确认"></Radio>
            </Radio-group>
          </div>
        </div>
      </Form>
      <div slot="footer">
        <Button type="ghost" @click="cancel('formData')">取消</Button>
        <Button type="primary" @click="save('formData')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'alarmconfig',
  components: {
  },
  computed: {
    ...mapGetters(['enabledSort', 'enabledTemp'])
  },
  data() {
    return {
      enabledLevel: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 }
      ],
      alarmModal: false,
      // 验证规则
      formValidate: {
      },
      formData: {
        level: 1,
        alarmtype: '', // 报警分类
        alarmtemplate: '',
        // maxdelaytime: 300,
        // minintervaltime: 300,
        alarmaffirm: { // 报警确认
          affirmflag: true,
          autoaffirm: {
            status: false,
            intervaltime: 20
          },
          handaffirm: {
            status: true
          }
        }
      },
      wayGroup: '',
      inputIsShow: false
    }
  },
  props: {
    // 弹窗展示
    alarmModalShow: {
      type: Boolean,
      default: false
    },
    // 弹窗数据
    modalData: {
      type: Object
    }
  },
  watch: {
    // 监听弹窗知否展示
    alarmModalShow(val) {
      if (val !== this.alarmModal) {
        this.alarmModal = val
        // this.$refs.formData.$forceUpdate()
      }
    },
    // 监听弹窗数据是否发生变化
    modalData: {
      handler: function(val) {
        if (val) {
          this.formData = JSON.parse(JSON.stringify(val))
          if (this.formData.alarmaffirm.autoaffirm.status) {
            this.wayGroup = '自动确认'
            this.inputIsShow = false
          } else {
            this.wayGroup = '手动确认'
            this.inputIsShow = true
          }
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(['getAlarmSortOne']),
    // 取消
    cancel(name) {
      // this.$refs[name].resetFields()
      this.$emit('cancel', name)
    },
    // 保存
    save(name) {
      // this.$refs[name].validate((valid) => {
      // if (valid) {
      let formData = JSON.parse(JSON.stringify(this.formData))
      if (formData.alarmtemplate === '') {
        delete formData.alarmtemplate
      }
      if (formData.alarmtype === '') {
        delete formData.alarmtype
      }
      this.$emit('save', formData, name)
      // } else {
      // console.log('验证失败')
      // }
      // })
    },
    // 手动确认，自动确认转换
    showRadio(select) {
      if (select === '手动确认') {
        this.inputIsShow = true
        this.formData.alarmaffirm.autoaffirm.status = false
        this.formData.alarmaffirm.handaffirm.status = true
      } else {
        this.inputIsShow = false
        this.formData.alarmaffirm.autoaffirm.status = true
        this.formData.alarmaffirm.handaffirm.status = false
      }
    },
    alarmTypeChange(id) {
      this.enabledSort.forEach((item) => {
        if (item.value === id) {
          this.formData = {
            alarmtype: item.value,
            level: item.level ? item.level : '',
            alarmtemplate: item.alarmtemplate ? item.alarmtemplate : '',
            // maxdelaytime: item.maxdelaytime,
            // minintervaltime: item.minintervaltime,
            alarmaffirm: item.alarmaffirm
          }
          if (this.formData.alarmaffirm.autoaffirm.status) {
            this.wayGroup = '自动确认'
            this.inputIsShow = false
          } else {
            this.wayGroup = '手动确认'
            this.inputIsShow = true
          }
        }
      })
    }
  }
}
</script>
<style scoped>
.confirm {
  margin-bottom: 10px;
  display: flex;
}

.confirm-time {
  width: 150px;
  margin-left: 20px;
}
.confirm-upload {
  height: 30px;
  display: flex;
  margin-left: 20px;
}
</style>
