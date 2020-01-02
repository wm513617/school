<template>
  <div class="edit-select ivu-select ivu-select-single" :class="{'ivu-select-visible': isDropDown}" style="width:180px;position:relative;" @mouseleave="hideColorPicker" >
    <Input ref="dropInput" :maxlength="7" v-model="newValue" style="width:180px;" @on-focus="showColorPicker" @click="toggleDropDown"></Input>
    <i class="ivu-icon ivu-icon-ios-close ivu-select-arrow" style="display:none"></i>
    <i class="ivu-icon ivu-icon-arrow-down-b ivu-select-arrow" style="cursor:pointer;" @click="toggleDropDown"></i>
    <div v-if="isDropDown" class="ivu-select-dropdown" style="width: 180px; transform-origin: center top 0px; position: absolute; top: 28px; left: 0px; will-change: top, left;" x-placement="bottom">
      <ul class="ivu-select-dropdown-list">
        <Sketch :value="newValue" @input="changeValue"></Sketch>
      </ul>
    </div>
  </div>
</template>

<script>
import { Sketch } from 'vue-color'
export default {
  props: {
    value: String
  },
  components: {
    Sketch
  },
  data() {
    return {
      isDropDown: false,
      newValue: this.value
    }
  },
  watch: {
    newValue(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.newValue = val
    }
  },
  methods: {
    changeValue(val) {
      this.newValue = val.hex
    },
    toggleDropDown() {
      this.isDropDown = !this.isDropDown
      if (this.isDropDown) {
        this.$refs.dropInput.focus()
      } else {
        this.$refs.dropInput.blur()
      }
    },
    showColorPicker() {
      this.isDropDown = true
      this.$refs.dropInput.focus()
    },
    hideColorPicker() {
      this.isDropDown = false
      this.$refs.dropInput.blur()
    }
  }
}
</script>

<style scoped lang='less'>
.edit-select .vue-color__sketch,
.edit-select .vc-sketch {
  width: 178px;
  height: 300px;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
<style>
.edit-select .ivu-input {
  cursor: pointer;
}
</style>
