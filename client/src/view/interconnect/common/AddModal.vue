<template>
  <Modal v-model="isshow" :title="title" :mask-closable="false" @on-cancel="cancel">
    <div>
      <Form ref="form" label-position="left" :label-width="120" :model="formdata" :rules="ruleValidate">
        <FormItem label="服务器名称：" prop="serverName">
          <Input style="width:300px;" v-model="formdata.serverName"/>
        </FormItem>
        <FormItem label="服务器地址：" prop="serverAddr">
          <Input style="width:300px;" v-model="formdata.serverAddr"/>
        </FormItem>
        <FormItem label="服务器ID：" prop="serverId">
          <Input style="width:300px;" v-model="formdata.serverId" />
        </FormItem>
        <FormItem label="SIP域：">
          <Input style="width:300px;" v-model="formdata.sipfield" />
        </FormItem>
        <FormItem label="端口：" prop="sipport">
          <Input style="width:300px;" v-model="formdata.sipport" />
        </FormItem>
        <FormItem label="级联协议：">
          <Select v-model="formdata.protocol" style="width:300px">
            <Option v-for="(v, k) in protocols" :value="k" :key="k">{{ v }}</Option>
          </Select>
        </FormItem>
        <FormItem label="厂商/型号：">
          <Select v-model="formdata.vender" style="width:300px">
            <Option v-for="(v, k) in venders" :value="k" :key="k">{{ v }}</Option>
          </Select>
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
        <FormItem label="注册有效期：" prop="validTime">
          <Input style="width:300px;" v-model="formdata.validTime" />
        </FormItem>
        <FormItem label="心跳周期：" prop="heartRate">
          <Input style="width:300px;" v-model="formdata.heartRate" />
        </FormItem>
        <FormItem label="心跳超时次数：" prop="maxTimeout">
          <Input style="width:300px;" v-model="formdata.maxTimeout" />
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <Button type="ghost" @click="cancel">取消</Button>
      <Button type="primary" @click="submitForm">保存</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: ['isshow', 'title'],
  data() {
    return {
      formdata: {
        serverName: '', // 必填，服务器名称
        serverAddr: '', // 必填，服务器地址
        serverId: '34020000001240000001', // 必填，服务器ID
        sipfield: '3402000000', // 选填，SIP域
        sipport: '7100', // 必填，端口
        protocol: 'GB28181_2016', // 必填，下拉框，级联协议
        vender: 'HIK_IVMS', // 必填,下拉框，厂商/型号
        sipAuth: false, // SIP认证
        username: '', // 用户名，选填
        password: '', // 密码，选填
        validTime: 86400, // 必填，注册有效期
        heartRate: 60, // 必填，心跳周期
        maxTimeout: 3 // 必填，心跳超时次数
      },
      protocols: {
        GB28181_2009: 'GB28181_2009',
        GB28181_2011: 'GB28181_2011',
        GB28181_2016: 'GB28181_2016'
      },
      venders: {
        HIK_IVMS: 'HIK IVMS',
        bstar: '蓝色星际',
        uniview: '宇视'
      },
      ruleValidate: {
        username: [{
          type: 'string',
          trigger: 'change',
          validator(rule, value, callback) {
            if (value.length > 128) {
              return callback(new Error('1-128个字符'))
            }
            callback()
          }
        }],
        password: [{
          type: 'string',
          trigger: 'change',
          validator(rule, value, callback) {
            if (value.length > 64) {
              return callback(new Error('1-64个字符'))
            }
            callback()
          }
        }],
        serverName: [{
          type: 'string',
          trigger: 'change',
          validator(rule, value, callback) {
            if (value.length < 1 || value.length > 128) {
              return callback(new Error('1-128个字符'))
            }
            callback()
          },
          required: true
        }],
        serverAddr: [{
          required: true,
          type: 'string',
          trigger: 'change',
          validator(rule, value, callback) {
            if (!/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(value)) {
              return callback(new Error('必填，ipv4地址'))
            }
            callback()
          }}],
        serverId: [{
          required: true,
          type: 'string',
          trigger: 'change',
          validator(rule, value, callback) {
            if (!/^[0-9]{20}$/.test(value)) {
              return callback(new Error('20个数字'))
            }
            callback()
          }
        }],
        sipfield: [{
          required: true,
          type: 'string',
          trigger: 'change',
          validator(rule, value, callback) {
            if (!/^[0-9]{10}$/.test(value)) {
              return callback(new Error('10个数字'))
            }
            callback()
          }
        }],
        sipport: [{
          required: true,
          type: 'string',
          trigger: 'change',
          validator(rule, value, callback) {
            if (!/^[0-9]+$/.test(value) || parseInt(value) > 65535) {
              return callback(new Error('整数，不能大于65535'))
            }
            callback()
          }
        }],
        validTime: [{
          required: true,
          type: 'string',
          trigger: 'change',
          validator(rule, value, callback) {
            if (!/^[0-9]+$/.test(value) || parseInt(value) > 2592000 || parseInt(value) < 3600) {
              return callback(new Error('3600-2592000'))
            }
            callback()
          }
        }],
        heartRate: [{
          required: true,
          type: 'string',
          trigger: 'change',
          validator(rule, value, callback) {
            if (!/^[0-9]+$/.test(value) || parseInt(value) > 300 || parseInt(value) < 10) {
              return callback(new Error('10-300'))
            }
            callback()
          }
        }],
        maxTimeout: [{
          required: true,
          type: 'string',
          trigger: 'change',
          validator(rule, value, callback) {
            if (!/^[0-9]+$/.test(value) || parseInt(value) > 10 || parseInt(value) < 1) {
              return callback(new Error('1-10'))
            }
            callback()
          }
        }]
      }
    }
  },
  methods: {
    initParams() {
      this.formdata = {
        serverName: '', // 必填，服务器名称
        serverAddr: '', // 必填，服务器地址
        serverId: '34020000001240000001', // 必填，服务器ID
        sipfield: '3402000000', // 选填，SIP域
        sipport: '7100', // 必填，端口
        protocol: 'GB28181_2016', // 必填，下拉框，级联协议
        vender: 'HIK_IVMS', // 必填,下拉框，厂商/型号
        sipAuth: false, // SIP认证
        username: '', // 用户名，选填
        password: '', // 密码，选填
        validTime: 86400, // 必填，注册有效期
        heartRate: 60, // 必填，心跳周期
        maxTimeout: 3 // 必填，心跳超时次数
      }
    },
    submitForm() {
      let flag = null
      this.$refs.form.validate(valid => (flag = valid))
      if (!flag) { return }
      this.$emit('addServer', this.formdata)
      this.initParams()
    },
    cancel() {
      this.$emit('update:isshow', false)
      this.initParams()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
