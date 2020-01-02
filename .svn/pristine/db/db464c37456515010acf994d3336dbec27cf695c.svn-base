<!--
  author: cookie
  props: {
    type: 必选，支持text、number、password
    v-model: 必选，双向绑定的value
    style:可选
    class:可选同style，都是给span.vInput添加的不直接作用在真实input，请注意,
    @input:可选，input事件，注意，input事件的回调方法参数是input组件的val，其他事件回调方法参数均为event
    @change:可选，change事件
    @focus:可选，focus事件
    @blur:可选，blur事件
    @click:可选，click事件
    @dblclick:可选，dblclick事件
    :disabled =  true/false
    :warn: 可选，如果为trueborder为红色
    :warnText: 可选，与warn连用，如果warn为true，warnText文本显示在输入框后面
  }
-->
<template>
  <div class="vInput">
    <input ref="vInput" :type="validateType" :value="inputVal" @input="inputChange" @change="$emit('change',$event)" @focus="handleFocus" @blur="handleBlur" @click="$emit('click',$event)" @dblclick="$emit('dblclick',$event)" :maxlength="maxlength" :disabled="disabled" :readonly="readonly" :class="{'warn': warn, 'disabled': disabled}" :tabindex="tabindex " />
    <button v-show="test" class="vInput_close iconfont icon-close1" @click.stop.prevent="handleClose"></button>
    <span class="warnText">{{warn ? warnText : ''}}</span>
  </div>
</template>
<script>
export default {
  name: 'VInput',
  props: {
    type: {
      type: String,
      default: 'text'
    },
    maxlength: {
      type: [String, Number]
    },
    warnText: {
      type: String
    },
    disabled: {
      type: Boolean
    },
    warn: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean
    },
    value: [String, Number],
    payload: [String, Number, Boolean, Object],
    tabindex: [String, Number]
  },
  computed: {
    validateType() {
      switch (this.type) {
        case 'password':
          return 'password'
        case 'number':
          return 'number'
        default:
          return 'text'
      }
    },
    test() {
      return this.inputVal !== '' && this.focusFlag
    }
  },
  methods: {
    handleClose(e) {
      this.inputVal = ''
      this.$refs.vInput.focus()
      this.inputChange(e)
    },
    inputChange(e) {
      this.focusFlag = true
      this.inputVal = e.target.value
      this.$emit('input', e.target.value, this.payload)
    },
    handleFocus(e) {
      this.focusFlag = true
      this.$emit('focus', e)
    },
    handleBlur(e) {
      const _self = this
      setTimeout(() => {
        _self.focusFlag = false
        _self.$emit('blur', e)
      }, 220)
    }
  },
  data() {
    return {
      inputVal: this.value,
      focusFlag: false
    }
  },
  beforeUpdate() {
    if (this.inputVal !== '') {
      this.inputVal = this.value
    }
  },
  watch: {
    value(newval) {
      this.inputVal = newval
    }
  }
}
</script>
<style scoped>
input::-ms-clear,
input::-ms-reveal {
  display: none;
}

 ::-ms-clear {
  display: none;
}

 ::-ms-reveal {
  display: none;
}

input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.vInput {
  position: relative;
  display: inline-block;
  height: 26px;
}

.vInput {
  position: relative;
  display: inline-block;
  height: 26px;
}

.vInput input {
  width: 100%;
  height: 100%;
  padding-right: 22px;
  padding-left: 10px;
  border: 1px solid #5676a9;
  border-radius: 4px;
  color: #fff;
  outline: none;
  padding-right: 0\9;
  background-color: #1c3053;
  transition: border .5s;
}

.vInput .disabled {
  background: #eee;
  color: #999;
  cursor: default;
}

.vInput input:focus,
.vInput input:hover {
  border: 1px solid #4699f9;
}

.vInput .vInput_close {
  display: none\9;
  position: absolute;
  top: 50%;
  margin-top: -6px;
  right: 10px;
  width: 12px;
  height: 12px;
  color: #a8a8a8;
  text-align: center;
  line-height: 0;
  border: none;
  background: none;
  outline: none;
  font-size: 10px;
  padding: 0;
}

@media screen and (-ms-high-contrast: active),
(-ms-high-contrast: none) {
  .vInput .vInput_close {
    display: block;
  }
}

.vInput .vInput_close:focus {
  outline: none;
  border: none;
}

.vInput .warn {
  border-color: #ff4949 !important;
}

.vInput .warnText {
  position: absolute;
  color: #ff4949;
  top: 0;
  left: 104%;
}
</style>
