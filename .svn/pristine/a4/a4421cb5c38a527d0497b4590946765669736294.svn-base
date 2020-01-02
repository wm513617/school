<template>
  <div class="container">
    <Row class="bs-content">
      <div class="bs-left">
        <div class="sidebar">
          <!-- <a @click="orgClick" style="text-align:center;">机构资源</a> -->
          <div class="tree-org">
            <BsOrgTree @call="getResDataClick" :isSearch="isSearch" :orgType="6" orgTitle="机构资源" @clickTitle="orgClick"></BsOrgTree>
          </div>
        </div>
        <div class="sidebar">
          <Menu ref="menu" theme="dark" width="100%" :active-name="route">
            <Menu-group title="人脸分析参数配置">
              <Menu-item name="/setting/veriface/server">
                智能分析服务器管理
              </Menu-item>
              <Menu-item name="/setting/veriface/argumentSet">
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
import BsOrgTree from '../../../components/DevBSorgTree'
import { save } from '../../../storage'
export default {
  components: {
    BsOrgTree
  },
  data() {
    return {
      route: '',
      isSearch: false
    }
  },
  computed: {},
  methods: {
    // 点击顶部的资源机构
    getResDataClick() {
      // 如果当前不是资源机构页面  就切换到资源  反之 就重置资源机构中的状态
      if (this.$route.path !== '/setting/veriface/org') {
        this.$router.replace('/setting/veriface/org')
      } else {
        this.isSearch = false
        this.$refs['firstRow'].getResData(true)
      }
      this.route = ''
    },
    orgClick() {
      if (this.$route.path !== '/setting/veriface/org') {
        this.$router.replace('/setting/veriface/org')
      }
      this.route = ''
    },
    isNowPathActive(name) {
      save('routerface', 'face')
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

</style>
