<template>
  <section class="server-attr">
    <header>服务器属性</header>
    <article>
      <Form class="form-table" ref="editform" :rules="ruleValidate" :model="serverAttrs" :label-width="134" label-position="left">
        <FormItem label="名称">属性</FormItem>
        <FormItem :class="{'label-hidden': key === 'sipAuth'}" :prop="key" v-for="(value, key) in serverAttrs" :key="key" :label="dictionaries[key]" v-if="renderFilter(key)">
          <Input
            :disabled="!serverAttrs['sipAuth'] && (key === 'password' || key === 'username')"
            :type="key === 'password' ? 'password' : 'text'"
            class="form-item input-transparent"
            v-model="serverAttrs[key]"
            v-if="key != 'protocol' && key != 'vender' && key != 'sipAuth'"
          />
          <Select class="form-item select-transparent" v-model="serverAttrs[key]" v-if="key === 'protocol'">
            <Option v-for="(v, k) in protocols" :value="k" :key="k">{{ v }}</Option>
          </Select>
          <Select class="form-item select-transparent" v-model="serverAttrs[key]" v-if="key === 'vender'">
            <Option v-for="(v, k) in venders" :value="k" :key="k">{{ v }}</Option>
          </Select>
          <span v-if="key === 'sipAuth'" style="text-indent: 4px;"><Checkbox v-model="serverAttrs[key]">{{serverAttrs[key] ? '启用' : '禁用'}}</Checkbox></span>
        </FormItem>
      </Form>
    </article>
    <footer>
      <Button type="primary" @click="saveInfo" :disabled="isLimit">保存</Button>
    </footer>
  </section>
</template>
<script>
export default {
  props: ['activeServerInfo', 'isLimit'],
  data() {
    return {
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
      },
      protocols: {
        GB28181_2009: 'GB28181-2009',
        GB28181_2011: 'GB28181-2011',
        GB28181_2016: 'GB28181-2016'
      },
      venders: {
        HIK_IVMS: 'HIK IVMS',
        bstar: '蓝色星际',
        uniview: '宇视'
      },
      serverAttrs: {},
      dictionaries: {
        serverName: '服务器名称',
        serverAddr: '服务器地址',
        serverId: '服务器ID',
        sipport: '端口',
        sipfield: 'SIP域',
        protocol: '级联协议',
        vender: '厂家/型号',
        sipAuth: 'SIP认证',
        username: 'SIP用户认证ID',
        password: '密码',
        validTime: '注册有效期',
        heartRate: '心跳周期',
        maxTimeout: '最大心跳超时次数'
      }
    }
  },
  created() {
    this.serverAttrs = this.$lodash.cloneDeep(this.activeServerInfo)
  },
  watch: {
    activeServerInfo() {
      this.serverAttrs = this.$lodash.cloneDeep(this.activeServerInfo)
    }
  },
  methods: {
    saveInfo() {
      // 验证表单
      let flag = null
      this.$refs.editform.validate(valid => (flag = valid))
      if (!flag) { return }

      this.$emit('editServer', this.serverAttrs)
    },
    renderFilter(key) {
      return !['_id', 'shareData', 'videoShare', 'alarmShare'].includes(key)
    }
  }
}
</script>
<style lang="less" scoped>
section {
  flex: 0 0 420px;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-right: 40px;
  header {
    font-size: 14px;
    font-weight: bold;
    flex: 0 0 40px;
    line-height: 40px;
  }
  article {
    flex: 1 1 auto;
    height: 100%;
    border: 1px solid #4699f9;
  }
  footer {
    height: 40px;
    padding-top: 10px;
  }
}
</style>
<style lang="less">
.input-transparent {
  .ivu-input {
    border: none;
  }
}
.select-transparent {
  .ivu-select-selection {
    border: none;
  }
}
.form-table {
  .ivu-form-item {
    border-top: 1px solid #4699f9;
    margin-bottom: 0px;
    &:first-child {
      border: none;
      .ivu-form-item-content {
        text-indent: 7px;
      }
    }
    &:last-child {
      border-bottom: 1px solid #4699f9;
    }
    .ivu-form-item-label {
      border-right: 1px solid #4699f9;
      text-indent: 7px;
    }
    .ivu-form-item-content {
      .ivu-form-item-error-tip {
        width: 120px;
        top: 0;
        left: calc(100% + 5px);
        line-height: inherit;
        padding-top: 0;
        background: #fafafa;
        border-radius: 6px;
        text-align: center;
        z-index: 1;
        &:before {
          content: ' ';
          position: absolute;
          width: 0;
          height: 0;
          border: 4px solid transparent;
          border-right-color: #fafafa;
          top: 50%;
          right: 100%;
          margin-top: -4px;
        }
      }
    }
  }
}
</style>
