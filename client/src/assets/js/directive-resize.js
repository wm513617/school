import Vue from 'vue'
Vue.directive('resize', {
  inserted(el, binding) {
    if (binding.value && typeof (binding.value) === 'function') {
      window.addEventListener('resize', binding.value)
    }
  },
  unbind(el, binding) {
    window.removeEventListener('resize', binding.value)
  }
})
