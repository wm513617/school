<template>
  <div class="tv-body" style="flex:1">
    <div>
      <div class="tabs" :class="{'active-tab': tabIndex===index}" v-for="(item, index) in moreWall" :key="index" @click="changeTabIndex(index)">
        {{item.name}}
      </div>
      <div v-if="moreWall.length && isLayout" class="tabs move" :class="{'active-tab': tabIndex === moreWall.length}" @click="changeTabIndex(-1)">
        +
      </div>
      <div v-if="moreWall.length && isLayout" class="tabs move" :class="{'active-tab': delIndex === (moreWall.length + 1)}" style="left:-8px;" @click="deleteTabIndex">
        -
      </div>
    </div>
    <div v-for="(item, index) in moreWall" :key="index" :style="tabIndex===index?'height:100%;':'height:0'">
      <TVwallTab v-if="tabIndex===index" :tvWallData="allTvWallList[index]"></TVwallTab>
    </div>
    <bs-modal v-model="delStatus" title="提示" :width="416" :mask-closable="false" @on-ok="delWall" @on-cancel="delStatus=false">
      <div>
        <i class="ivu-icon ivu-icon-help-circled" style="color:#ff9900;font-size:36px;vertical-align:middle;margin:10px 20px 10px"></i>确定要删除电视墙吗?
      </div>
    </bs-modal>
  </div>
</template>
<script>
import alarm from '../../socket/alarm'
import TVwallTab from './tvwall/TVwallTab'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  components: {
    TVwallTab
  },
  data() {
    return {
      isAddTVWall: null,
      tabIndex: 0,
      delIndex: -1,
      delStatus: false
    }
  },
  computed: {
    ...mapState({
      allTvWallList: ({ tvwall }) => tvwall.allTvWallList,
      wallNames: ({ tvwall }) => tvwall.wallNames,
      isLayout: ({ tvwall }) => tvwall.isLayout,
      tvwall: ({ tvwall }) => tvwall.tvwall,
      errorInfoArray: ({ tvwall }) => tvwall.errorInfoArray
    }),
    moreWall() {
      return this.wallNames || []
    }
  },
  watch: {
    allTvWallList(list) {
      this.isAddTVWall = !list.length
    }
  },
  methods: {
    ...mapActions(['getTVList', 'deleteWall', 'saveErrorInfo']),
    ...mapMutations(['SET_TABLE_INDEX', 'SET_TVWALL', 'SET_INDEX']),
    cancel() {
      this.allTvWallList.length ? (this.isAddTVWall = false) : this.$router.replace('/navigation')
    },
    changeTabIndex(i) {
      if (i === -1) {
        this.isAddTVWall = true
      } else {
        this.tabIndex = i
        this.SET_TVWALL(this.allTvWallList[this.tabIndex])
        this.SET_INDEX(this.tabIndex)
        this.getTVList()
      }
      this.SET_TABLE_INDEX(0)
    },
    deleteTabIndex() {
      this.delStatus = true
      this.delIndex = this.moreWall.length + 1
    },
    delWall() {
      this.deleteWall(this.tvwall._id)
        .then(() => {
          this.delIndex = -1
          this.delStatus = false
          this.changeTabIndex(0)
        })
        .catch(() => {
          this.$Notice.error({
            title: '失败',
            desc: '删除电视墙失败！',
            duration: 0
          })
        })
    },
    preplanNotice(data) {
      this.changeTabIndex(this.tabIndex)
    }
  },
  created() {
    alarm.on('preplan', this.preplanNotice)
    this.SET_TABLE_INDEX(0)
    this.getTVList().catch(err => {
      // 此action没有返回对象  如果有对象则是报错了
      if (err) {
        this.$Notice.error({
          title: '错误',
          desc: '电视墙接口获取失败',
          duration: 0
        })
      }
    })
  },
  beforeDestroy() {
    alarm.remove('preplan', this.preplanNotice)
  }
}
</script>
<style lang="less" scoped>
.tv-body {
  overflow: hidden;
}
.one-wall-tab {
  display: flex;
  width: 100%;
  padding-top: 16px;
  height: ~'calc(100% - 43px)';
}
.tv-body .tabs {
  display: inline-block;
  padding: 10px 16px;
  margin-bottom: -1px;
  color: #fff;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  background: #0f2343;
  min-width: 80px;
}
.tv-body .tabs.move {
  position: relative;
  left: -4px;
}
.tv-body .tab-pane {
  height: calc(100% - 32px);
  position: absolute;
  width: 100%;
}
.tv-body .tabs:hover {
  color: #4699f9;
}
.tv-body .tabs.active-tab {
  color: #c47019;
  background: #1b3153;
}
</style>
<style>
.tv-body .theme-btn {
  background: #4699f9;
  color: #fff;
  border: 0 none;
}
.tv-body .theme-btn:hover {
  background: #4699f9;
}
.tv-body .theme-btn:active {
  background: #287fe0;
}
.tv-body .theme-btn[disabled] {
  background: #535f77;
  color: #cacaca;
}
.tv-body .theme-bg {
  background: #1f2224;
  color: #bfbfbf;
}
.tv-body .theme-pane {
  background: #1b3153;
  color: #bfbfbf;
}
.tv-body .theme-title {
  background: #0f2343;
  color: #fff;
}
.tv-body .theme-link {
  color: #fff;
}
.tv-body .theme-link:hover {
  color: #00a5e3;
}
.tv-body .theme-btn-cancel {
  border: 1px solid #878782;
  background: #878782;
  color: #fff;
}
.tv-body .theme-btn-cancel:hover {
  color: #00a5e3;
  border: 1px solid #00a5e3;
  background: transparent;
}
.wall-tabs .ivu-tabs-bar {
  margin-bottom: 0;
}
</style>
