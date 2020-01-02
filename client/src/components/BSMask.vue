<template>
  <div>
    <div class="maskbox" v-show="visible">
      <div :class="{'maskdome':maskState,'maskdome-s':!maskState}">
        <iframe frameborder="0" scrolling="no" v-show="showIframe" style="position: absolute; z-index: 10; width:100%; height:100%; top: 0;left:0;"></iframe>
        {{display}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BSMask',
  data() {
    return {
      visible: false
    }
  },
  props: {
    maskState: {
      type: Boolean,
      default: true
    },
    showIframe: {
      type: Boolean,
      default: false
    },
    display: {
      type: String
    },
    show: {
      type: Boolean
    },
    style: {
      type: Object,
      default: function() {
        return { color: '#fff', fontSize: '18px' }
      }
    }
  },
  created() {
    this.visible = this.show
  },
  methods: {
    checkshow: function() {
      this.visible = false
      this.$emit('hide', false)
    }
  },
  watch: {
    show(newVal) {
      this.visible = newVal
    }
  }
}
</script>

<style type="text/css" scoped>
.maskbox {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 99999;
}
.maskdome {
  text-align: center;
  width: 100%;
  font-size: 30px;
  color: red;
  margin: 0 auto;
  height: auto;
  position: absolute;
  top: 40%;
  left: 50%;
  margin-left: -50%;
}
.maskdome-s {
  text-align: center;
  width: 220px;
  font-size: 30px;
  color: red;
  margin: 0 auto;
  height: auto;
  position: absolute;
  top: 40%;
  left: 50%;
  margin-left: -10%;
  background: rgba(0, 0, 0, 0.629);
}
</style>
