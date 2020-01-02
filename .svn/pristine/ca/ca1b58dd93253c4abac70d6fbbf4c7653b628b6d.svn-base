<template>
  <div class="Present">
    <Form ref="form" label-position="left" :label-width="120" :model="formdata" :rules="ruleValidate">
      <!-- <FormItem class="label-hidden">
        <Checkbox v-model="formdata.isGB28181">启用GB28181</Checkbox>
      </FormItem> -->
      <FormItem label="本级服务器名称：" style="margin-top: 14px">
        <Input style="width:300px;" v-model="formdata.servername" disabled/>
      </FormItem>
      <FormItem label="本级服务器ID：" prop="serverId">
        <Input style="width:300px;" v-model="formdata.serverId" />
      </FormItem>
      <FormItem label="本级SIP域：" prop="sipfield">
        <Input style="width:300px;" v-model="formdata.sipfield" />
      </FormItem>
      <FormItem label="本级SIP端口：" prop="sipport">
        <Input style="width:300px;" v-model="formdata.sipport" />
      </FormItem>
      <FormItem class="label-hidden">
        <Checkbox v-model="formdata.sipAuth">SIP认证</Checkbox>
      </FormItem>
      <FormItem label="用户名：" prop="username">
        <Input style="width:300px;" v-model="formdata.username" :disabled="!formdata.sipAuth" />
      </FormItem>
      <FormItem label="密码：" prop="password">
        <Input style="width:300px;" v-model="formdata.password" :disabled="!formdata.sipAuth" />
      </FormItem>
      <FormItem>
        <Button type="primary" @click="submitForm" :disabled="!$BShasPower('BS-INTERCONNECT-LOCAL-MANAGE')">保存</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      formdata: {},
      ruleValidate: {
        username: [{
          type: 'string',
          trigger: 'change',
          validator(rule, value, callback) {
            if (value && value.length > 128) {
              return callback(new Error('1-128个字符'))
            }
            callback()
          }
        }],
        password: [{
          type: 'string',
          trigger: 'change',
          validator(rule, value, callback) {
            if (value && value.length > 64) {
              return callback(new Error('1-64个字符'))
            }
            callback()
          }
        }],
        sipport: [
          {
            required: true,
            type: 'string',
            trigger: 'change',
            validator(rule, value, callback) {
              if (!/^[0-9]+$/.test(value) || parseInt(value) > 65535) {
                return callback(new Error('整数，不能大于65535'))
              }
              callback()
            }
          }
        ],
        serverId: [
          {
            required: true,
            type: 'string',
            trigger: 'change',
            validator(rule, value, callback) {
              if (!/^[0-9]{20}$/.test(value)) {
                return callback(new Error('必填，正整数20位'))
              }
              callback()
            }
          }
        ],
        sipfield: [
          {
            message: '选填，正整数',
            type: 'string',
            min: 1,
            trigger: 'change',
            validator(rule, value, callback) {
              if (value === '') { callback() }
              if (!/^[0-9]+$/.test(value)) {
                return callback(new Error('选填，正整数'))
              }
              callback()
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      locServer: ({ interconnect }) => interconnect.locServer
    })
  },
  watch: {
    locServer() {
      this.formdata = { ...this.locServer }
    }
  },
  created() {
    this.getLocServer()
      .then(() => {
        this.formdata = { ...this.locServer }
      })
      .catch(() => {
        this.$Notice.error({
          title: '获取服务器信息失败！'
        })
      })
  },
  methods: {
    ...mapActions(['getLocServer', 'setLocServer']),
    submitForm() {
      let flag = null
      this.$refs.form.validate(valid => (flag = valid))
      if (!flag) { return }
      this.setLocServer(this.formdata)
        .then(() => {
          this.$Notice.success({
            title: '保存成功！'
          })
        })
        .catch(() => {
          this.$Notice.error({
            title: '保存失败！'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.Present {
  flex: auto;
}
</style>
<style lang="less">
.label-hidden {
  .ivu-form-item-content {
    margin-left: 0 !important;
  }
}
</style>
