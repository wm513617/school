<template>
  <iframe :src="'http://'+koalaServer">

  </iframe>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      koalaServer: '192.168.4.199'
    }
  },
  created() {
    console.log(this.$chartList, 16)
    this.getKoalaServer().then(res => {
      this.koalaServer = res.data.host
    })
  },
  methods: {
    ...mapActions(['getKoalaServer'])
  }
}
</script>
<style lang="less" scoped>
iframe {
  width: 100%;
  height: 100%;

  border: none;
}
</style>
