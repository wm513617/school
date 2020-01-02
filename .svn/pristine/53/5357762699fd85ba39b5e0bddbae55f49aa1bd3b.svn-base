<template>
  <iframe :src="trafficServer"></iframe>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      trafficServer: 'http://192.168.14.142'
    }
  },
  created() {
    this.getTrafficServerURL()
      .then(res => {
        if (/^https?:\/\//i.test(res.data)) {
          return this.errorMsg('服务器地址不正确')
        } else {
          this.trafficServer = res.data.url
        }
      })
      .catch(err => console.log(err))
  },
  methods: {
    ...mapActions(['getTrafficServerURL'])
  }
}
</script>
<style scoped>
iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
