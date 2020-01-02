<template>
  <div>
    <div class="bs-cover-container">
      <slot></slot>
    </div>
    <iframe class="bs-cover-frame" v-if="value"></iframe>
  </div>
</template>
<script>
export default {
  name: 'bs-cover',
  props: {
    value: {
      required: true,
      type: Boolean
    }
  }
}
</script>
<style>
.bs-cover-container{
  position: relative;
  z-index: 100;
  width: 100%;
  height: 100%;
}
.bs-cover-frame {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 99;
  left: 0;
  top: 0;
  margin: 0;
  padding: 0;
  border: 0 none;
}
</style>
