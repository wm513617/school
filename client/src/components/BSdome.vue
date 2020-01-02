<template>
  <div class="dome">
    <ul>
      <li title="左上" @mouseup="$emit('stop', 'swayUpLeft')" @mousedown="$emit('start', 'swayUpLeft')">
        <img src="/static/yuntai/ptz-hover.png" class="hover" ondragstart="return false;" />
        <img src="/static/yuntai/ptz-active.png" class="active" ondragstart="return false;" />
      </li>
      <li title="上" @mouseup="$emit('stop', 'tiltUp')" @mousedown="$emit('start', 'tiltUp')">
        <img src="/static/yuntai/ptz-hover.png" class="hover" ondragstart="return false;" />
        <img src="/static/yuntai/ptz-active.png" class="active" ondragstart="return false;" /></li>
      <li title="右上" @mouseup="$emit('stop', 'swayUpRight')" @mousedown="$emit('start', 'swayUpRight')">
        <img src="/static/yuntai/ptz-hover.png" class="hover" ondragstart="return false;" />
        <img src="/static/yuntai/ptz-active.png" class="active" ondragstart="return false;" /></li>
      <li title="右" @mouseup="$emit('stop', 'panRight')" @mousedown="$emit('start','panRight')">
        <img src="/static/yuntai/ptz-hover.png" class="hover" ondragstart="return false;" />
        <img src="/static/yuntai/ptz-active.png" class="active" ondragstart="return false;" /></li>
      <li title="右下" @mouseup="$emit('stop', 'swayDownRight')" @mousedown="$emit('start','swayDownRight')">
        <img src="/static/yuntai/ptz-hover.png" class="hover" ondragstart="return false;" />
        <img src="/static/yuntai/ptz-active.png" class="active" ondragstart="return false;" /></li>
      <li title="下" @mouseup="$emit('stop', 'tiltDown')" @mousedown="$emit('start','tiltDown')">
        <img src="/static/yuntai/ptz-hover.png" class="hover" ondragstart="return false;" />
        <img src="/static/yuntai/ptz-active.png" class="active" ondragstart="return false;" /></li>
      <li title="左下" @mouseup="$emit('stop', 'swayDownLeft')" @mousedown="$emit('start','swayDownLeft')">
        <img src="/static/yuntai/ptz-hover.png" class="hover" ondragstart="return false;" />
        <img src="/static/yuntai/ptz-active.png" class="active" ondragstart="return false;" /></li>
      <li title="左" @mouseup="$emit('stop', 'panLeft')" @mousedown="$emit('start','panLeft')">
        <img src="/static/yuntai/ptz-hover.png" class="hover" ondragstart="return false;" />
        <img src="/static/yuntai/ptz-active.png" class="active" ondragstart="return false;" /></li>
      <div class="stop" title="停止" @mousedown.stop="$emit('start','stopAll')"></div>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'BSdome'
}
</script>

<style scoped>
.dome {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  background: url("/static/yuntai/ptz.png") no-repeat;
  cursor: pointer;
  transform: scale(0.9);
}
.dome .stop {
  width: 83px;
  height: 83px;
  border-radius: 50%;
  position: absolute;
  top: 51px;
  left: 46px;
}
.dome .stop:hover {
  background: url("/static/yuntai/stop-hover.png") no-repeat;
}
.dome .stop:active {
  background: url("/static/yuntai/stop-active.png") no-repeat;
}

ul {
  width: 176px;
  height: 176px;
  top: 10px;
  left: -3px;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
  margin: 300px 0 0 300px;
  margin: 0 auto;
}
li {
  left: 0px;
  top: 0px;
  position: absolute;
  width: 88px;
  height: 88px;
  color: #fff;
  overflow: hidden;
  -webkit-transform-origin: 100% 100%;
  -moz-transform-origin: 100% 100%;
  -ms-transform-origin: 100% 100%;
  transform-origin: 100% 100%;
  -webkit-transform: rotate(45deg) skew(45deg);
  -moz-transform: rotate(45deg) skew(45deg);
  -ms-transform: rotate(45deg) skew(45deg);
  transform: rotate(45deg) skew(45deg);
}
li span {
  position: absolute;
  right: 27px;
  bottom: 15px;
  display: block;
  border-radius: 50%;
  color: #fff;
  text-align: center;
  -webkit-transform: skew(-45deg) rotate(-45deg) scale(1);
  -moz-transform: skew(-45deg) rotate(-45deg) scale(1);
  -ms-transform: skew(-45deg) rotate(-45deg) scale(1);
  transform: skew(-45deg) rotate(-65deg) scale(1);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  pointer-events: auto;
}

li img.hover {
  position: absolute;
  right: 0px;
  bottom: 11px;
  display: none;
  -webkit-transform: skew(-45deg) rotate(-45deg) scale(1);
  -moz-transform: skew(-45deg) rotate(-45deg) scale(1);
  -ms-transform: skew(-45deg) rotate(-45deg) scale(1);
  transform: skew(-45deg) rotate(-65deg) scale(1);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  pointer-events: auto;
}
li img.active {
  position: absolute;
  right: 7px;
  bottom: -1px;
  display: none;
  -webkit-transform: skew(-48deg) rotate(-118deg) scale(1);
  -moz-transform: skew(-48deg) rotate(-118deg) scale(1);
  -ms-transform: skew(-48deg) rotate(-118deg) scale(1);
  transform: skew(-48deg) rotate(-118deg) scale(1);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  pointer-events: auto;
}

li:nth-child(1) {
  transform: rotate(22.5deg) skew(45deg);
  /*z-index: 999;*/
}
li:nth-child(2) {
  transform: rotate(67.5deg) skew(45deg);
}
li:nth-child(3) {
  transform: rotate(112.5deg) skew(45deg);
}
li:nth-child(4) {
  transform: rotate(157.5deg) skew(45deg);
}
li:nth-child(5) {
  transform: rotate(202.5deg) skew(45deg);
}
li:nth-child(6) {
  transform: rotate(247.5deg) skew(45deg);
}
li:nth-child(7) {
  transform: rotate(292.5deg) skew(45deg);
}
li:nth-child(8) {
  transform: rotate(337.5deg) skew(45deg);
}
li:hover img.hover {
  display: block;
}
li:active img.active {
  display: block;
}
li:active img.hover {
  display: none;
}
</style>
