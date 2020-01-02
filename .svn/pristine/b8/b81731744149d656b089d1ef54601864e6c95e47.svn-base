<template>
  <div class="container">
    <Row class="bs-content">
      <div class="bs-left">
        <div class="sidebar">
          <a @click="orgClick">机构资源</a>
          <div class="tree-org">
            <BsOrgTree :isSetting="$BShasPower('BS-SETTING-FACE-ORG')" @call="getResDataClick" :isSearch="isSearch" :orgType="2" :isShowTitle="false" orgTitle="机构资源"></BsOrgTree>
          </div>
        </div>
        <div class="sidebarDark">
          <Menu ref="menu" theme="dark" width="100%" :active-name="route">
            <Menu-group title="人脸分析参数配置">
              <Menu-item name="/settings/face/faceServer">
                智能分析服务器管理
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
import BsOrgTree from '../../components/DevBSorgTree.vue'
import { save } from '../../storage'
import './facePage/tree.css'
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
    getResDataClick() {
      if (this.$route.path !== '/settings/face/faceChannel') {
        this.$router.replace('/settings/face/faceChannel')
      } else {
        this.isSearch = false
        this.$refs['firstRow'].getResData(1)
      }
      this.route = ''
    },
    orgClick() {
      if (this.$route.path !== '/settings/face/faceChannel') {
        this.$router.replace('/settings/face/faceChannel')
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
  }

  .sidebar {
    width: 100%;
    height: auto;
  }

  .sidebar > a {
    display: block;
    height: 38px;
    line-height: 38px;
    font-size: 14px;
    color: #fff;
    padding-left: 20px;
    background-color: #0f2243;
  }

  .tree-org {
    height: 565px;
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
