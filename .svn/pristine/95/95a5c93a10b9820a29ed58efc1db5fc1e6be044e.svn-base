<template>
  <div class="ipv4">
    <div class="ip_label" :class="{'disabledAll':disabled, 'warning': (danger && isLegal && !disabled)}">
      <input class="ip_input" ref="one" @keydown.ChangeFocus="typeTab('one')" v-model="one" type="text" :disabled="disabled" @input="input('one')" @blur="ipBlur" />.
      <input class="ip_input" ref="two" @keydown.ChangeFocus="typeTab('two')" v-model="two" type="text" :disabled="disabled" @input="input('two')" @blur="ipBlur" />.
      <input class="ip_input" ref="three" @keydown.ChangeFocus="typeTab('three')" v-model="three" type="text" :disabled="disabled" @input="input('three')" @blur="ipBlur" />.
      <input class="ip_input" ref="four" @keydown.ChangeFocus="typeTab('four')" v-model="four" type="text" :disabled="disabled" @input="input('four')" @blur="ipBlur" />
    </div>
    <div class="danger" v-show="danger && isLegal">{{warning}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ipv4',
  props: {
    propsdata: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isLegal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      one: '',
      two: '',
      three: '',
      four: '',
      danger: false,
      warning: ''
    }
  },
  created() {
    this.init()
  },
  computed: {
    totalValue() {
      return [this.one, this.two, this.three, this.four]
    }
  },
  methods: {
    init() {
      const arr = this.value.split('.')
      this.one = arr[0]
      this.two = arr[1]
      this.three = arr[2]
      this.four = arr[3]
    },
    input(attr) {
      this[attr] = this[attr].replace(/[^0-9]/g, '')
      if (this[attr] === '') {
        this[attr] = '0'
      }
      const num = Number(this[attr])
      if (num < 0) {
        this[attr] = '0'
      } else if (num > 255) {
        this[attr] = '255'
      } else {
        this[attr] = num
      }
      this.ipBlur()
    },
    typeTab(a) {
      if (a === 'one') {
        this.$refs.one.blur()
        this.$refs.two.focus()
      } else if (a === 'two') {
        this.$refs.two.blur()
        this.$refs.three.focus()
      } else if (a === 'three') {
        this.$refs.three.blur()
        this.$refs.four.focus()
      } else if (a === 'four') {
        this.$refs.four.blur()
        this.$refs.five.focus()
      }
    },
    ipBlur() {
      if (!this.isLegal) { return }
      // const seq = /^[1,2][0-5]{0,1}[0-4]{0,1}$/
      // 四个框都是数字 且根据可使用的ip范围  第一位和第四位不能不能为0和255
      if (+this.one <= 0 || +this.four <= 0 || +this.one >= 255 || +this.four >= 255) {
        this.danger = true
        this.warning = 'ip地址不合法'
      } else {
        this.danger = false
        this.warning = ''
      }
    }
  },
  watch: {
    value(newvalue) {
      this.init()
    },
    totalValue(newValue) {
      if (newValue) {
        this.$emit('input', newValue.join('.'))
      }
    }
  },
  beforeDestroy() {
    this.danger = false
  }
}
</script>

<style scoped>
.ipv4 {
  width: 100%;
  position: relative;
}

.disabledAll {
  background: #eee;
  cursor: default;
  color: #999;
}

.ip_label {
  width: 100%;
  height: 100%;
  font-weight: normal;
  border-radius: 2px;
  border: 1px solid #5676a9;
  display: inline-block;
  text-align: left;
  padding: 0px;
  margin: 0px;
}

.ip_input {
  height: 23px;
  line-height: 23px;
  width: 20%;
  margin-top: 0;
  margin-right: 0;
  margin-left: 2%;
  text-align: center;
  border: none;
  background-color: #1c3053;
  color: #fff;
}

.ip_input:disabled {
  background: #eee;
  cursor: default;
  color: #999;
}

.danger {
  display: inline-block;
  width: 200px;
  font-size: 12px;
  color: #ed3f14;
  position: absolute;
  bottom: -28px;
  left: 0;
  font-size: 12px;
}

.warning {
  border-color: #ed3f14;
}
</style>
