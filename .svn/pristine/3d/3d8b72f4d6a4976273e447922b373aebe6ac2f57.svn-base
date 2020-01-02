<template>
  <div class="bs-content" id="alarmCenter">
    <div class="bs-left">
      <div class="sidebar">
        <ul class="config-list" style="height: calc(100% - 264px)">
          <li style="list-style:none;" v-for="(config,index) in configTopList" :key="index" :class="{active: config.isActive}" @click="leftTopBoxActive(config)">
            {{config.name}}
          </li>
        </ul>
        <ul class="config-list">
          <a class="bottom-title">服务器配置</a>
          <li style="list-style:none;" @click="isNowPathActive" :class="{active: configBottomList[0].isActive}">对讲服务器配置</li>
        </ul>
      </div>
    </div>
    <div class="bs-mains">
      <!--对讲台麦-->
      <talkMicroPhone v-if="configTopList[0].isActive"></talkMicroPhone>
      <!--对讲终端-->
      <talkTerminal v-if="configTopList[1].isActive"></talkTerminal>
      <!--对讲服务器配置-->
      <talkServer v-if="configBottomList[0].isActive"></talkServer>
    </div>
  </div>
</template>

<script>
import allPage from './allPage.js'
import talkServer from './talkServer'
import talkTerminal from './talkTerminal.vue'
import talkMicroPhone from './talkMicrophone'
export default {
  name: 'alarmCenter',
  components: {
    talkTerminal,
    talkServer,
    talkMicroPhone
  },
  mixins: [allPage],
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped>
.sidebar {
  width: 100%;
  height: 100%;
}

.sidebar > a {
  display: block;
  text-align: center;
  font-size: 14px;
  color: #fff;
  background-color: #0f2243;
  height: 40px;
  line-height: 40px;
  margin-bottom: 10px;
  width: 300px;
}

.config-list li {
  position: relative;
  cursor: pointer;
  /*transition: all .2 ease-in-out;*/
  height: 48px;
  line-height: 48px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  border-right: 2px solid transparent;
  background: #1c3053;
  border-top: 1px solid #263e69;
  border-bottom: 1px solid #263e69;
  box-shadow: 0px -1px 2px #142441 inset;
  padding: 0 0 0 40px;
}

.config-list li:hover {
  background: #2b426b;
  color: #ffffff;
}
.sidebar > .config-list > .active {
  color: #4699f9;
  border-right: 2px solid #4699f9;
  background-color: #2f497a;
  z-index: 2;
}

.bs-content {
  padding: 16px 0 !important;
  width: 100%;
  position: relative;
  display: flex;
}

.bs-mains {
  flex-grow: 1;
  overflow: hidden;
  width: 100%;
  background: #1c3053;
  min-height: 670px;
  padding: 16px 0 0 0;
}

.lf {
  float: left;
}

.rt {
  float: right;
}

.bottom-title {
  display: block;
  text-align: center;
  font-size: 14px;
  color: #fff;
  background-color: #0f2243;
  height: 40px;
  line-height: 40px;
  width: 100%;
}
</style>
