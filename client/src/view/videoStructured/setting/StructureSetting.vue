<template>
  <div class="container">
    <Row class="bs-content">
      <div class="bs-left">
        <div class="sidebar">
          <!-- <a @click="orgClick" style="text-align:center;">机构资源</a> -->
          <!--<BsOrgTree @call="getResDataClick" :isSearch="isSearch" :orgType="8" orgTitle="机构资源" @clickTitle="orgClick"></BsOrgTree>-->
          <div class="tree-org">
            <BStreeNewBox :iconToggle="false"  :searchToggle="true" :searchType="0" :deleteAlertStyle='true' :equipmentToggle="false" :resourceToggle="false" :btnGroup="true" :orgType="8" :resType="[0]" @clickData="getDataClick"></BStreeNewBox>
          </div>
        </div>
        <div class="sidebar">
          <Menu ref="menu" theme="dark" width="100%" :active-name="route">
            <Menu-group title="视频结构化分析参数配置">
              <Menu-item name="/setting/structure/service">
                服务器配置
              </Menu-item>
              <Menu-item name="/setting/structure/arguments">
                高级参数设置
              </Menu-item>
            </Menu-group>
          </Menu>
        </div>
      </div>
      <router-view ref="firstRow"></router-view>
    </Row>
  </div>
</template>

<script>
import BStreeNewBox from '@src/components/BStreeNew/BStreeNewBox'
import { save } from '@src/storage'
import { mapActions } from 'vuex'
export default {
  components: {
    BStreeNewBox
  },
  data() {
    return {
      route: ''
    }
  },
  methods: {
    ...mapActions(['setOrgActiveId']),
    getDataClick(val) {
      this.setOrgActiveId(val._id)
      // 如果当前不是资源机构页面  就切换到资源  反之 就重置资源机构中的状态
      if (this.$route.path !== '/setting/structure/org') {
        this.$router.replace('/setting/structure/org')
      } else {
        this.$refs['firstRow'].getResData(true)
      }
      this.route = ''
    },
    isNowPathActive(name) { // 监听视频结构化分析参数配置菜单的点击事件
      save('routerVideoStructured', 'videoStructured')
      this.$router.replace(name)
      this.route = name
    }
  },
  created() {
    this.route = this.$route.path
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
    height: auto;
    position: relative;
    display: flex;
    /* bs-content */
    /* bs-left  */
  }

  .sidebar {
    width: 100%;
    height: auto;
    min-height: 120px;
  }

  .sidebar > a {
    display: block;
    height: 48px;
    line-height: 48px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    background-color: #0f2243;
  }

  .tree-org {
    /* padding-top: 10px; */
    height: 550px;
    /* overflow: auto; */
  }

  .config-list li {
    position: relative;
    cursor: pointer;
    border-bottom: 1px solid #5d5d5d;
    font-size: 14px;
    color: #80848f;
    border-right: 2px solid transparent;
  }

  .config-list li:hover {
    color: #fff;
  }

  .sidebar > .config-list > .active {
    color: #2d8cf0;
    border-right: 2px solid #2d8cf0;
    background-color: #444;
    z-index: 2;
  }

  li > div {
    padding: 14px 40px;
  }
.sidebar >>> textarea {
  color: #ffffff;
}
  .sidebar >>> .el-button--ghost{
    color: #ffffff;
    border: none;
    background: #3c5073;
  }
  .sidebar >>> .el-button--ghost:hover{
    background: #4699f9;
    color: #ffffff;
  }
</style>
