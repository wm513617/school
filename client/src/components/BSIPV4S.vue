<template>
  <div class="ipv4">
    <label class="ip_label"
           :class="{'disabledAll':disabled}">
      <input class="ip_input"
             v-model="one"
             type="text"
             :disabled="disabled"
             @input="input('one')" />.
      <input class="ip_input"
             v-model="two"
             type="text"
             :disabled="disabled"
             @input="input('two')" />.
      <input class="ip_input"
             v-model="three"
             type="text"
             :disabled="disabled"
             @input="input('three')" />.
      <input class="ip_input"
             v-model="four"
             type="text"
             :disabled="disabled"
             @input="input('four')" />-
      <input class="ip_input"
             v-model="five"
             type="text"
             :disabled="disabled"
             @input="input('five')" />
    </label>
  </div>
</template>

<script>
// import { prompt } from '../../assets/js/alertMess.js'
export default {
  name: 'ipv4s',
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
    }
  },
  data() {
    return {
      one: '',
      two: '',
      three: '',
      four: '',
      five: ''
    }
  },
  created() {
    this.init()
  },
  computed: {
    totalValue() {
      return [this.one, this.two, this.three, this.four, this.five]
    }
  },
  methods: {
    init() {
      const arr = this.value.split('.')
      this.one = arr[0]
      this.two = arr[1]
      this.three = arr[2]
      this.four = arr[3].split('-')[0]
      this.five = arr[3].split('-')[1]
    },
    input(attr) {
      this[attr] = this[attr].replace(/[^0-9]/g, '')
      if (parseInt(this['five']) - parseInt(this['four']) > 80) {
        // prompt('提示：', '超出设备接入能力，允许添加设备数量80', 'danger')
        this.five = 0
      }
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
    }
  },
  watch: {
    totalValue(newValue) {
      if (newValue) {
        const str = `${newValue.shift()}.${newValue.shift()}.${newValue.shift()}.${newValue.shift()}-${newValue.shift()}`
        const valueList = str.split('.')
        this.one = valueList[0]
        this.two = valueList[1]
        this.three = valueList[2]
        this.four = valueList[3].split('-')[0]
        this.five = valueList[3].split('-')[1]
        let newStr = []
        for (let i = parseInt(this.four); i <= parseInt(this.five); i++) {
          this.six = i
          newStr.push(`${this.one}.${this.two}.${this.three}.${this.six}`)
        }
        this.$emit('input', newStr.join(','))
      }
    }
  }
}
</script>

<style scoped>
.disabledAll {
  background: #eee;
  cursor: no-drop;
}

.ip_label {
  width: 100%;
  height: 100%;
  font-weight: normal;
  border-radius: 2px;
  border: 1px solid #c5c5c5;
  display: inline-block;
  text-align: left;
  padding: 0px;
}

.ip_input {
  margin: 0px;
  height: 22px;
  width: 17%;
  text-align: center;
  border: none;
  background-color: #5d5d5d;
  color: #fff;
}

.ip_input:disabled {
  background: #eee;
  cursor: no-drop;
}
</style>
