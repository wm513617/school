<template>
    <div class="webSocketBSechart"></div>
</template>

<script>
export default {
  name: 'webSocketBSechart',
  props: ['options'],
  data() {
    return {
      chart: null
    }
  },
  methods: {
    drawPie(el) {
      this.chart = this.$echarts.init(el)
      if (this.options) {
        this.chart.setOption(this.options)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.drawPie(this.$el)
    })
  },
  watch: {
    options: {
      handler: function(val) {
        if (this.chart) {
          this.chart.setOption(val)
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
