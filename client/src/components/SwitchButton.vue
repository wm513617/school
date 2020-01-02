<template>
  <div id="switch">
    <label class="switch-btn">
      <input class="checked-switch" type="checkbox" :id="name" v-model="checked" />
      <span class="text-switch" :data-yes="$t('video.open')" :data-no="$t('video.close')"></span>
      <span class="toggle-btn"></span>
    </label>
  </div>
</template>
<script>
import $ from 'jquery'
export default {
  name: 'SwitchButton',
  props: {
    name: String
  },
  data() {
    return {
      checked: false
    }
  },
  mounted: function() {
    let _this = this
    $('#' + this.name).on('change', function(event, state) {
      _this.$emit('change', this.checked)
    })
  }
}
</script>
<style lang="less">
.switch-btn {
  position: relative;
  display: block;
  vertical-align: top;
  width: 45px;
  height: 20px;
  border-radius: 18px;
  cursor: pointer;
}
.checked-switch {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}
.text-switch {
  background-color: #e5e5e5;
  border-radius: inherit;
  color: #444444;
  display: block;
  font-size: 10px;
  height: inherit;
  position: relative;
  font-family: Microsoft Yahei;
  font-weight: normal;
}
.text-switch:before,
.text-switch:after {
  position: absolute;
  top: 50%;
  margin-top: -.5em;
  line-height: 1;
  -webkit-transition: inherit;
  -moz-transition: inherit;
  -o-transition: inherit;
  transition: inherit;
}
.text-switch:before {
  content: attr(data-no);
  right: 10px;
}
.text-switch:after {
  content: attr(data-yes);
  left: 10px;
  color: #FFFFFF;
  opacity: 0;
}
.checked-switch:checked ~ .text-switch {
  background-color: #20a0ff;

}
.checked-switch:checked ~ .text-switch:before {
  opacity: 0;
}
.checked-switch:checked ~ .text-switch:after {
  opacity: 1;
}
.toggle-btn {
  background: linear-gradient(#eee, white);
  border-radius: 100%;
  height: 18px;
  left: 1px;
  position: absolute;
  top: 1px;
  width: 18px;
}
.toggle-btn::before {
  color: #aaaaaa; content: "";
  display: inline-block;
  font-size: 10px;
  letter-spacing: -2px;
  padding: 4px 0;
  vertical-align: middle;
}
.checked-switch:checked ~ .toggle-btn {
  left:26px;
}
 .text-switch, .toggle-btn {
  transition: All 0.3s ease;
  -webkit-transition: All 0.3s ease;
  -moz-transition: All 0.3s ease;
  -o-transition: All 0.3s ease;
}
</style>
