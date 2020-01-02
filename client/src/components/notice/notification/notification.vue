<template>
  <div class="box" :class="classes" :style="styles">
    <iframe class="iframe"></iframe>
    <Notice v-for="notice in notices" :key="notice.name" :prefix-cls="prefixCls" :styles="notice.styles" :type="notice.type" :content="notice.content" :duration="notice.duration" :closable="notice.closable" :name="notice.name" :transition-name="notice.transitionName" :on-close="notice.onClose">
    </Notice>
  </div>
</template>
<script>
import Notice from './notice.vue'

const prefixCls = 'ivu-notification'
let seed = 0
const now = Date.now()

function getUuid() {
  return 'ivuNotification_' + now + '_' + seed++
}

export default {
  components: { Notice },
  props: {
    prefixCls: {
      type: String,
      default: prefixCls
    },
    styles: {
      type: Object,
      default: function() {
        return {
          top: '65px',
          left: '50%'
        }
      }
    },
    content: {
      type: String
    },
    className: {
      type: String
    }
  },
  data() {
    return {
      notices: []
    }
  },
  computed: {
    classes() {
      return [
        `${this.prefixCls}`,
        {
          [`${this.className}`]: !!this.className
        }
      ]
    }
  },
  methods: {
    add(notice) {
      const name = notice.name || getUuid()

      const _notice = Object.assign(
        {
          styles: {
            right: '50%'
          },
          content: '',
          duration: 1.5,
          closable: false,
          name: name
        },
        notice
      )
      if (this.notices.length > 2) {
        this.notices.shift()
      }
      this.notices.push(_notice)
    },
    close(name) {
      const notices = this.notices
      for (let i = 0; i < notices.length; i++) {
        if (notices[i].name === name) {
          this.notices.splice(i, 1)
          break
        }
      }
    },
    closeAll() {
      this.notices = []
    }
  }
}
</script>
<style scoped>
.box{
  z-index: 10000;
}
.iframe {
  border: none;
  position: absolute;
  width: 100%;
  height: calc(100% - 10px);
  z-index: 2000;
  top: 0;
  left: 0;
}
</style>
