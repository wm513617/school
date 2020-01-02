<template>
  <div class="strong">
    <Row>
      <Col span="6" class="activeDefault1" v-bind:class="{activeLow: isActive === 1}"> 风险
      </Col>
      <Col span="6" class="activeDefault_middle" v-bind:class="{activeWeak: isActive === 2}"> 弱
      </Col>
      <Col span="6" class="activeDefault_middle" v-bind:class="{activeMiddle: isActive === 3}"> 中
      </Col>
      <Col span="6" class="activeDefault2" v-bind:class="{activeStrong: isActive === 4}"> 强
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  name: 'VerifyPassword',
  props: ['password'],
  data() {
    return {
      isActive: 0
    }
  },
  methods: {
  },
  watch: {
    password(val) {
      let password = this.password
      const spec1 = /^[a-zA-Z]{1,16}$/
      const spec2 = /^[\d]{1,16}$/

      const spec3 = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{1,16}$/ // 数字、字母的组合

      const spec4 = /^(?![0-9]+$)(?![~!,.?￥、/<>{}:;""“”‘’'')(@#$%^&*+_=-]+$)[0-9~!,.?￥、/<>{}:;""“”‘’'')(@#$%^&*+_=-]{1,16}$/ // 必须包含数字和和特殊字符
      const spec5 = /^(?![a-zA-Z]+$)(?![~!,.?￥、/<>{}:;""“”‘’'')(@#$%^&*+_=-]+$)[a-zA-Z~!,.?￥、/<>{}:;""“”‘’'')(@#$%^&*+_=-]{1,16}$/ // 必须包含字母和和特殊字符
      const spec6 = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!,.?￥、/<>{}:;""“”‘’'')(@#$%^&*+_=-])[\da-zA-Z~!,.?￥、/<>{}:;""“”‘’'')(@#$%^&*+_=-]{1,16}$/ // 数字、字母、特殊字符的组合
      if (spec1.test(password) || spec2.test(password)) { this.isActive = 1 }
      if (spec3.test(password)) { this.isActive = 2 }
      if (spec4.test(password) || spec5.test(password)) { this.isActive = 3 }
      if (spec6.test(password)) { this.isActive = 4 }
    }
  }
}
</script>
<style scoped>
.strong {
  width: 100%;
}

.activeDefault1 {
  background: #2b4168;
  text-align: center;
  /* border-radius: 10px; */
  border-bottom-left-radius: 10px;
  border-top-left-radius: 10px;
  height: 20px;
  line-height: 21px;
}
.activeDefault2 {
  background: #2b4168;
  text-align: center;
  /* border-radius: 10px; */
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
  height: 20px;
  line-height: 21px;
}
.activeDefault_middle {
  background: #2b4168;
  text-align: center;
  /* border-radius: 10px; */
  height: 20px;
  line-height: 21px;
}

.activeLow {
  background: #871c1f;
}

.activeWeak {
  background: #bc881d;
}

.activeMiddle {
  background: #6a9815;
}
.activeStrong {
  background: #118e10;
}
</style>
