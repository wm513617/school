<template></template>
<script>
import Vue from 'vue'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
export default {
  name: 'NProgress',
  props: {
    parent: String
  },
  created() {
    if (this.parent) {
      nprogress.configure({ parent: this.parent })
    }
    this.$router.beforeEach((to, from, next) => {
      nprogress.start()
      next()
    })
    this.$router.afterEach(() => {
      nprogress.done()
    })
    Vue.http.interceptors.request.use(request => {
      nprogress.start()
      return request
    })
    Vue.http.interceptors.response.use(response => {
      nprogress.done()
      return response
    })
  }
}
</script>
<style lang="less">
.nprogress-custom-parent #nprogress .spinner,
#nprogress .spinner {
  display: none;
}

</style>
