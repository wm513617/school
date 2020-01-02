<template>
  <div class="container">
    <Row class="bs-content">
      <div class="bs-left" v-if="expend">
        <div class="sidebar">
          <Menu ref="menu" theme="dark" width="100%" :active-name="route">
            <Menu-item name="/structure/statistics/todayData">
              今日数据
            </Menu-item>
            <Menu-item name="/structure/statistics/recordAnalysis">
              统计分析
            </Menu-item>
          </Menu>
        </div>
        <div class="arrow" @click="toggle">
          <!--<Icon custom="i-icon i-icon-shop_fill" size="24" />-->
          <Icon type="ios-arrow-back" size="24"/>
        </div>
      </div>
      <div class="bs-left" style="flex: 0 0 50px;" v-else>
        <div class="sidebar" >
          <Menu ref="menu" theme="dark" width="100%" :active-name="route">
            <Menu-item name="/structure/statistics/todayData">
              今日数据
            </Menu-item>
            <Menu-item name="/structure/statistics/recordAnalysis">
              统计分析
            </Menu-item>
          </Menu>
        </div>
        <div class="arrow" @click="toggle">
          <Icon type="ios-arrow-forward" size="24" />
        </div>
      </div>
      <router-view ref="dataRecordContent"></router-view>
    </Row>
  </div>
</template>

<script>
import { save } from '@src/storage'
import Vue from 'vue'
export default {
  data() {
    return {
      route: '',
      expend: false
    }
  },
  created() {
    this.route = this.$route.path
    if (this.$route.path !== '/structure/statistics/todayData') {
      this.$router.replace('/structure/statistics/todayData')
    }
    this.route = '/structure/statistics/todayData'
  },
  methods: {
    isNowPathActive(name) { // 监听视频结构化分析参数配置菜单的点击事件
      save('routerVideoStructured', 'videoStructured')
      this.$router.replace(name)
      this.route = name
    },
    toggle() {
      if (this.expend) {
        this.expend = false
      } else {
        this.expend = true
      }
      if (this.$chartList.length > 0) {
        this.$chartList.map(chart => {
          chart._dom.children[0].style.width = '100%'
          chart._dom.children[0].children[0].style.width = '100%'
        })
      }
    }
  },
  mounted() {
    this.$refs['menu'].$on('on-select', this.isNowPathActive.bind(this))
  },
  beforeDestroy() {
    this.$refs['menu'].$off('on-select')
  }
}
</script>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
  }
  .bs-content{
    height: 100%;
    width: 100%;
  }
  .bs-left{
    position: relative;
  }
  .arrow{
    position: absolute;
    right: 0;
    top: 50%;
    color: #ffffff;
    cursor: pointer;
  }
</style>
