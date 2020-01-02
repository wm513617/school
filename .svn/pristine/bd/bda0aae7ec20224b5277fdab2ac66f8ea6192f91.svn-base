<template>
  <div class="left-con">
    <div class="tabs-box">
      <div class="tabs" :class="{'active-tab': tabIndex===index}" v-for="(label, index) in tabLabels" :key="label" @click="SET_TABLE_INDEX(index)">
        {{label}}
      </div>
      <div class="fresh-con">
        <i class="icon iconfont icon-refresh theme-link" @click="refresh"></i>
      </div>
    </div>
    <div class="tab-pane" v-show="tabIndex===0">
      <tvmenu></tvmenu>
    </div>
    <div class="tab-pane" v-show="tabIndex===1">
      <layout></layout>
    </div>
    <div class="tab-pane" v-show="tabIndex===2">
      <tvsource></tvsource>
    </div>
  </div>
</template>
<script>
import tvmenu from 'components/videoMenu/TVwallMenu'
import tvsource from './TVsource.vue'
import layout from './layOut.vue'
import { mapActions, mapMutations, mapState } from 'vuex'
import common from '../tvwall/tvcommon'
export default {
  components: {
    tvmenu,
    tvsource,
    layout
  },
  mixins: [common],
  props: {
    enableController: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      key: '1',
      tabLabels: ['机构']
    }
  },
  computed: {
    ...mapState({
      tabIndex: ({ tvwall }) => tvwall.tabIndex
    })
  },
  watch: {},
  methods: {
    ...mapActions([
      // 'getvideoOrg',
      'getPolling',
      'getScenes',
      'getPlans',
      'getOrigin',
      'getAllLayoutList',
      'updateLayout'
    ]),
    ...mapMutations(['SET_TABLE_INDEX']),
    refresh() {
      switch (this.tabIndex) {
        case 0:
          // this.commonAPIHandle(this.getvideoOrg(), '刷新机构', 'getVideoOrg')
          break
        case 1:
          this.commonAPIHandle(this.getPolling(), '刷新轮巡', 'getPollings')
          break
        case 2:
          this.commonAPIHandle(this.getScenes(), '刷新场景', 'getScenes')
          break
        case 3:
          this.commonAPIHandle(this.getPlans(), '刷新预案', 'getPlans')
          break
        case 4:
          this.getLayout()
          break
        case 5:
          this.commonAPIHandle(this.getOrigin(), '刷新源', 'getOrigin')
          break
      }
    },
    changeTabels() {
      if (this.enableController) {
        if (this.tabLabels.length === 1) {
          this.tabLabels = this.tabLabels.concat(['布局', '源'])
        }
      } else {
        if (this.tabLabels.length !== 4) {
          this.tabLabels = ['机构']
        }
      }
    },
    getLayout() {
      this.getAllLayoutList().then(() => {
        this.commonAPIHandle(this.updateLayout(), '刷新布局', 'updateLayout')
      })
    }
  },
  created() {
    this.changeTabels()
  }
}
</script>
<style scoped>
.left-con .tabs.active-tab {
  color: #fff;
  background: #1b3153;
}
.left-con {
  width: 300px;
  height: calc(100% - 16px);
  position: relative;
  background: #1b3153;
}
.fresh-con {
  cursor: pointer;
  color: #fff;
  background: #0f2343;
  width: 34px;
  height: 40px;
  line-height: 38px;
  text-align: center;
}
.left-con .tabs-box {
  background: #0f2343;
  display: flex;
}
.left-con .tabs {
  flex: 1;
  padding: 11px 10px;
  /* margin-bottom: -1px; */
  color: #fff;
  cursor: pointer;
  background: #0f2343;
  border-right: 2px solid #0f1e3b;
  text-align: center;
}

.tab-pane {
  height: calc(100% - 38px);
  position: absolute;
  width: 100%;
}
.tabs:hover {
  color: #4699f9;
}
</style>

<style lang="less">
.left-con .list-item {
  background: #2a436a;
  padding: 0 80px 0 20px;
  height: 30px;
  line-height: 30px;
  border-top: 1px solid #171717;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;

  & > label {
    white-space: nowrap;
  }
}

.left-con .list-icons {
  position: absolute;
  right: 10px;
  top: 0;
  vertical-align: middle;
  height: 30px;

  & .icon {
    cursor: pointer;
    margin: 0 2px;

    &:hover {
      color: #00a5e3;
    }
  }
}

.left-con .title-new {
  display: inline-block;
  height: 20px;
  line-height: 20px;
  cursor: pointer;
  color: #00a5e3;
  margin-left: 10px;

  & .iconfont {
    vertical-align: middle;
  }

  & label {
    cursor: inherit;
  }
}

.left-con .label-input {
  display: inline-block;
  width: 200px;
  & .ivu-select-dropdown {
    width: 200px;
  }
}

.left-con .ivu-table-cell {
  padding-left: 5px;
  padding-right: 5px;
}
.left-con .ivu-table-cell span {
  white-space: nowrap;
}
.left-con .ivu-table th,
.left-con .ivu-table td {
  text-align: center;
}

.left-con .ivu-table-header table {
  // position: absolute;
  width: auto !important;
}

.left-con .left-con-list {
  height: calc(~'100% - 75px');
}
.left-con .treeul .treeliBox {
  cursor: default;
}

.left-con .treeul .leaf .treeliBox {
  cursor: pointer;
}
</style>
