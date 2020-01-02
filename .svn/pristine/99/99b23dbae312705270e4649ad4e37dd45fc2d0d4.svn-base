<template>
  <div class="interconnect">
    <section class="container">
      <nav class="switch">
        <ul>
          <li v-if="$BShasPower('BS-INTERCONNECT-LOCAL')" :class="{'active': activeTab === 'Present'}" @click="activeTab = 'Present'">本级</li>
          <li v-if="$BShasPower('BS-INTERCONNECT-UP')" :class="{'active': activeTab === 'Upunion'}" @click="activeTab = 'Upunion'">上联</li>
          <li v-if="$BShasPower('BS-INTERCONNECT-DOWN')" :class="{'active': activeTab === 'Downunion'}" @click="activeTab = 'Downunion'">下联</li>
        </ul>
      </nav>
      <section class="main">
        <!-- 本级 -->
        <Present v-show="activeTab === 'Present' && $BShasPower('BS-INTERCONNECT-LOCAL')" />
        <!-- 上联 -->
        <Upunion v-show="activeTab === 'Upunion' && $BShasPower('BS-INTERCONNECT-UP')" />
        <!-- 下联 -->
        <Downunion v-show="activeTab === 'Downunion' && $BShasPower('BS-INTERCONNECT-DOWN')" />
      </section>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Present from './Present.vue'
import Upunion from './Upunion.vue'
import Downunion from './Downunion.vue'

export default {
  components: {
    Present,
    Upunion,
    Downunion
  },
  data() {
    return {
      activeTab: 'Present'
    }
  },
  computed: {
    ...mapState({
      upServers: ({ interconnect }) => interconnect.upServers
    })
  },
  created() {
    Promise.all([this.getOrgTree(), this.getVideoOrgResource(), this.getAlarmOrgResource()]).then(() => {
      this.getUpServers().catch(() => {
        this.$Notice.error({
          title: '获取上级服务器列表失败！'
        })
      })
      this.getDownServers().catch(() => {
        this.$Notice.error({
          title: '获取下级服务器列表失败！'
        })
      })
    }).catch(() => {
      this.$Notice.error({
        title: '获取本地资源失败！'
      })
    })
  },
  methods: {
    ...mapActions(['getOrgTree', 'getVideoOrgResource', 'getAlarmOrgResource', 'getUpServers', 'getDownServers'])
  }
}
</script>

<style lang="less" scoped>
  .interconnect {
    flex: auto;
    min-height: 720px;
    padding: 20px;
    .container {
      flex: auto;
      height: 100%;
      display: flex;
      flex-direction: column;
      .switch {
        flex: 0 0 40px;
        line-height: 40px;
        overflow: hidden;
        background: #0f2243;
        ul {
          li {
            float: left;
            padding: 0 16px;
            border-right: 2px solid #0f1e3b;
            cursor: pointer;
            &.active {
              background: #1c3054;
            }
          }
        }
      }
      .main {
        flex: auto;
        height: 100%;
        background: #1c3054;
        padding: 12px 24px;
      }
    }
  }
</style>
