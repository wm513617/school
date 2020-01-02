<template>
  <Modal :mask-closable="false" v-model="pointModal" width="550" :title="isEdit?'修改点位':'新建点位'" @on-cancel="cancel('point')">
    <!--基础信息部分-->
    <div>
      <Form ref="point" :model="pointFormData" :rules="ruleValidate" :label-width="80" label-position="left">
        <Form-item label="设备名称" prop="devName">
          <Input v-model.trim="pointFormData.devName" type="text" :maxlength="64"></Input>
        </Form-item>
        <Form-item label="设备ID" prop="devId">
          <Input v-model="pointFormData.devId" disabled></Input>
        </Form-item>
        <Form-item label="设备编码" prop="devCode">
          <Input v-model="pointFormData.devCode" type="text" :maxlength="64"></Input>
        </Form-item>
        <Form-item label="设备类型">
          <Select v-model="pointFormData.devType">
            <Option v-for="item in devTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        <Form-item label="所属机构">
          <Input v-model="orgActiveName" disabled></Input>
        </Form-item>
        <Form-item label="负责人" prop="charger">
          <Input v-model.trim="pointFormData.charger" :maxlength="64"></Input>
        </Form-item>
        <Form-item label="电话" prop="phone">
          <Input v-model.trim="pointFormData.phone" :maxlength="64"></Input>
        </Form-item>
        <Form-item label="备注" prop="remark">
          <Input v-model.trim="pointFormData.remark" type="textarea" :maxlength="512" :autosize="{minRows: 3,maxRows: 3}" placeholder="请输入..."></Input>
        </Form-item>
      </Form>
    </div>
    <div slot="footer">
      <Button type="ghost" @click="cancel('point')">取消</Button>
      <Button type="primary" @click="save('point')">确定</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  props: {
    modalShow: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object
    },
    orgActiveName: {
      type: String
    }
  },
  data() {
    // 64位字符
    const verifyName = (rule, value, callback) => {
      let nativecode = value.split('')
      let len = 0
      for (let i = 0; i < nativecode.length; i++) {
        let code = Number(nativecode[i].charCodeAt(0))
        if (code > 127) {
          len += 2
        } else {
          len++
        }
      }
      if (len > 64) {
        return callback(new Error('不能超过64位字符'))
      } else {
        callback()
      }
    }
    // 512 字符
    const verifyNameRemark = (rule, value, callback) => {
      let nativecode = value.split('')
      let len = 0
      for (let i = 0; i < nativecode.length; i++) {
        let code = Number(nativecode[i].charCodeAt(0))
        if (code > 127) {
          len += 2
        } else {
          len++
        }
      }
      if (len > 512) {
        return callback(new Error('不能超过512位字符'))
      } else {
        callback()
      }
    }
    // 电话号码
    // const validateTelephone = (rule, value, callback) => {
    //   let reg = /^1[34578]\d{9}$/
    //   if (!value || reg.test(value)) {
    //     callback()
    //   } else {
    //     return callback(new Error('请输入正确的电话号码'))
    //   }
    // }
    // 编码 数字+字母 最大限制64位
    const devCodeValidate = (rule, value, callback) => {
      let reg = /^[A-Za-z0-9]+$/
      if (!reg.test(value)) {
        callback(new Error('只能输入数字或者字母'))
      } else {
        callback()
      }
    }
    return {
      pointModal: false,
      pointFormData: {},
      devTypeList: [{ value: 'NFC', label: 'NFC' }],
      ruleValidate: {
        devName: [
          { required: true, message: '名称不能为空', trigger: 'change' },
          { validator: verifyName, trigger: 'change' }
        ],
        devCode: [
          { required: true, message: '编码不能为空', trigger: 'change' },
          { max: 64, message: '长度不得超过64位', trigger: 'change' },
          { validator: devCodeValidate, trigger: 'change' }
        ],
        charger: [
          { validator: verifyName, trigger: 'change' }
        ],
        // phone: [
        //   { validator: validateTelephone, trigger: 'change' }
        // ],
        remark: [
          { validator: verifyNameRemark, trigger: 'change' }
        ]
      }
    }
  },
  computed: {},
  watch: {
    modalShow(val) {
      if (val !== this.pointModal) {
        this.pointModal = val
      }
    },
    formData: {
      handler: function(val) {
        if (val) {
          this.pointFormData = val
        }
      },
      deep: true
    }
  },
  methods: {
    cancel(name) {
      this.$refs[name].resetFields()
      this.$emit('cancel')
    },
    save(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$emit('save', this.pointFormData, name)
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
