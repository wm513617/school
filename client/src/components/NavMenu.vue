<template>
  <transition name="menu">
    <div v-if="loggedIn" id="app-menu">
      <router-link class="logo-wrapper" to="/" exact>{{$t('menu.main')}}</router-link>
      <Menu @on-select="seletRoute" :theme="'dark'" :router="true">
        <Menu-item name="/map">
          <Icon type="ios-paper"></Icon>
          {{$t('menu.map')}}
        </Menu-item>
        <Menu-item name="/tvboard">
          <Icon type="ios-people"></Icon>
          {{$t('menu.tvBoard')}}
        </Menu-item>
        <Menu-item name="/settings">
          <Icon type="settings"></Icon>
          {{$t('menu.settings')}}
        </Menu-item>
      </Menu>
    </div>
  </transition>
</template>
<script>
import { mapGetters } from 'vuex'
import locales from 'locales/menu'

export default {
  name: 'NaveMenu',
  locales,
  computed: {
    ...mapGetters(['loggedIn'])
  },
  methods: {
    seletRoute(name) {
      // console.log(name)
      // this.$route.path = name
      this.$router.replace({ path: name })
    }
  } /*,
  components: {
    [Menu.name]: Menu,
    [Submenu.name]: Submenu,
    [MenuItem.name]: MenuItem,
    [MenuItemGroup.name]: MenuItemGroup
  } */
}
</script>
<style lang="less">
@import '../assets/css/variable';

.menu-enter-active, .menu-leave-active {
  transition: all 0.5s;
}

.menu-enter, .menu-leave-active {
  margin-left: -(@menu-width);
}

#app-menu {
  width: @menu-width;
  min-width: @menu-width;
  background-color: @color-black-light;
  overflow: auto;

  .logo-wrapper {
    display: block;
    padding-left: 1rem;
    height: @header-height;
    line-height: @header-height;
    color: #fff;
    font-size: 1.25rem;
    background-color: #435065;
  }

  .el-submenu, .el-menu-item {
    .iconfont {
      margin-right: 10px;
    }
  }
}
</style>
