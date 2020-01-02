<template>
  <div class="safe">
    <div class="safe-rank">
      <div class="safe-title">密码安全等级设置</div>
      <div class="safe-content">
        <RadioGroup v-model="policy.passwordType" size="large" vertical>
          <Radio class="radio-style" label="low">
            <div class="radio-content">
              <div class="radio-name">风险密码</div>
              <div class="radio-info">纯数字或字母</div>
            </div>
          </Radio>
          <Radio class="radio-style" label="weak">
            <div class="radio-content">
              <div class="radio-name">弱密码</div>
              <div class="radio-info">数字字母组合</div>
            </div>
          </Radio>
          <Radio class="radio-style" label="middle">
            <div class="radio-content">
              <div class="radio-name">中密码</div>
              <div class="radio-info">数字特殊字符组合或字母特殊字符组合</div>
            </div>
          </Radio>
          <Radio class="radio-style" label="strong">
            <div class="radio-content">
              <div class="radio-name">强密码</div>
              <div class="radio-info">数字、字母、特殊字符组合</div>
            </div>
          </Radio>
        </RadioGroup>
      </div>
    </div>
    <div class="lock-set">
      <div class="lock-title">账户锁定设置</div>
      <div class="lock-content">
        <Form :model="policy" label-position="left" :label-width="150">
          <FormItem label="登录次数">
            <InputNumber :min="1" :max="30" class="input-style" v-model="policy.loginCount"></InputNumber >
          </FormItem>
          <FormItem label="登录锁定时间">
            <InputNumber :min="0" :max="3600" class="input-style" v-model="policy.lockTime"></InputNumber ><span style="margin-left: 10px;">秒</span>
          </FormItem>
        </Form>
      </div>
    </div>
    <div class="password-set">
      <div class="password-title">密码设置</div>
      <div class="password-content">
        <Form ref="pwdValidate" :rules="safeValidate" :model="policy" label-position="left" :label-width="150">
          <FormItem label="密码长度" prop="length">
            <InputNumber :min="3" :max="32" class="input-style" v-model="policy.length"></InputNumber><span style="margin-left: 10px;">密码长度为3 - 32</span>
          </FormItem>
          <FormItem label="初始密码" prop="initPassword">
            <Input class="input-style" v-model="policy.initPassword"></Input>
          </FormItem>
        </Form>
      </div>
    </div>
    <Button type="primary" class="save-style"  @click="savePolicy('pwdValidate')">保存</Button>
  </div>
</template>
<script>
import FormValidate from '../formValidate.js'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'safe',
  mixins: [FormValidate],
  data() {
    const riskPwd = (rule, value, callback) => {
      if (/\s+/g.test(value)) {
        callback(new Error('请勿输入空格'))
      } else {
        this.riskPwdTest(value, callback)
      }
    }
    return {
      policy: {
        passwordType: 'low',
        loginCount: 6,
        lockTime: 1,
        length: 5,
        initPassword: '123456'
      },
      passwordWeight: {
        'low': 0,
        'weak': 2,
        'middle': 3,
        'strong': 5
      },
      safeValidate: {
        initPassword: [
          { type: 'string', required: true, message: '请输入密码', trigger: 'blur' },
          { validator: riskPwd, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getPolicy()
  },
  computed: {
    ...mapState({
      policyData: ({securityPolicy}) => securityPolicy.policyData
    })
  },
  methods: {
    ...mapActions([
      'getSafePolicy',
      'editSafePolicy'
    ]),
    /**
     * 获取安全策略
     * @method getPolicy
     */
    getPolicy() {
      this.getSafePolicy().then(suc => {
        this.policy = JSON.parse(JSON.stringify(this.policyData))
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 保存安全策略
     * @method savePolicy
     * @param {string} name 表单ref
     */
    savePolicy(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.editSafePolicy(this.policy).then(suc => {
            this.successMsg('保存成功')
            this.getPolicy()
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.warningMsg('请完善初始密码')
        }
      })
    },
    riskPwdTest(value, callback) {
      const nativecode = value.split('')
      let len = nativecode.length
      let number = 0
      let letter = 0
      let special = 0
      let Invalid = 0
      for (let i = 0; i < nativecode.length; i++) {
        if (nativecode[i].match(/[0-9]/)) {
          number = number === 0 ? 1 : 1
        } else if (nativecode[i].match(/[A-Za-z]/)) {
          letter = letter === 0 ? 2 : 2
        } else if (nativecode[i].match(/[~!,.?￥、/<>{}:;""“”‘’''()@#$%^&*+_=-]/)) {
          special = special === 0 ? 3 : 3
        } else {
          Invalid = -1
        }
      }
      if (len < 3) {
        callback(new Error('密码长度过短'))
      }
      if (len > this.policy.length) {
        callback(new Error(`密码最大长度${this.policy.length}位字符`))
      }
      if (Invalid === -1) {
        callback(new Error('密码中包含无效字符'))
      }
      let rank = number + letter + special
      if (rank > this.passwordWeight[this.policy.passwordType]) {
        callback()
      } else {
        callback(new Error('密码强度太低'))
      }
    }
  }
}
</script>
<style lang="less" scoped>
.title-public {
  height: 38px;
  line-height: 38px;
  padding-left: 24px;
  background-color: #0f2343;
}
.radio-style {
  margin-right: 48px;
  .radio-content {
    display: inline-block;
    .radio-name {
      display: inline-block;
      width: 200px;
    }
    .radio-info {
      display: inline-block;
    }
  }
}
.safe {
  flex: 1;
  background-color: #1b3153;
  overflow: auto;
  .login-way {
    .login-title {
      .title-public;
    }
    .login-content {
      padding: 24px;
    }
  }
  .safe-rank {
    .safe-title {
      .title-public;
    }
    .safe-content {
      padding: 24px;
      .radio-style {
        margin-right: 48px;
      }
    }
  }
  .lock-set {
    .lock-title {
      .title-public;
    }
    .lock-content {
      padding: 24px;
      .input-style {
        width: 200px;
      }
    }
  }
  .password-set {
    .password-title {
      .title-public;
    }
    .password-content {
      padding: 24px 24px 0 24px;
      .input-style {
        width: 200px;
      }
    }
  }
  .save-style {
    margin: 0 24px 24px 24px;
  }
}
</style>
