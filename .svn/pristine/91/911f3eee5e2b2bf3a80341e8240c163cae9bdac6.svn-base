<template>
  <div>
    <div style='width: 100%;height:100%;'>
      <div class="doorTitle">门禁机构
        <i class="iconfont icon-refresh refresh" style="float:right;font-size: 22px;margin-right:15px;" @click='refresh'></i>
      </div>
      <el-buttongroup class="btnGroup">
          <el-button class="btnStyle" title="添加" style="float: inherit!important;"><i class="iconfont icon-add"></i></el-button>
          <el-button class="btnStyle" title="删除" style="float: inherit!important;"><i class="iconfont icon-delete"></i></el-button>
          <el-button class="btnStyle" title="编辑" style="float: inherit!important;"><i class="iconfont icon-edit1"></i></el-button>
          <el-button class="btnStyle" title="刷新"  @click='refresh' style="float: inherit!important;"><i class="iconfont icon-shuaxin"></i></el-button>
      </el-buttongroup>
      <div style="padding:12px 16px;" class="left-part-style">
        <Input v-model="searchKey" icon="ios-search-strong" @click="searchDoor" size="small" placeholder="请输入..." />
      </div>
      <!--门禁机构树-->
      <DoorTree :doorData='data4' @treeClick='tiggerSrvListStatus'></DoorTree>
    </div>
    <div class="bottomPart" v-if="$BShasPower('BS-SETTING-DOOR-SERVER-PAGE') && srvCfg">
      <Menu ref="menu" theme="dark" width="100%" :active-name="route" @on-select="tiggerSrvList">
        <Menu-group class='doorParam' title="门禁系统参数配置">
          <Menu-item name='/settings/door/manage'>门禁服务器管理</Menu-item>
        </Menu-group>
      </Menu>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations } from 'vuex'
import DoorTree from '../../components/BStreeNew/doorTree'
import Vue from 'vue'
import { ButtonGroup, Button } from 'element-ui'

import './common.css'
Vue.component('el-buttongroup', ButtonGroup)
Vue.component('el-button', Button)
export default {
  components: { DoorTree },
  data() {
    return {
      searchKey: '', // 搜索内容
      route: '',
      data4: [
        {
          id: 1,
          label: '斯麦尔大门禁系统-1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1'
                },
                {
                  id: 10,
                  label: '三级 1-1-2'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '斯麦尔大门禁系统-2',
          children: [
            {
              id: 4,
              label: '二级 2-1',
              children: [
                {
                  id: 9,
                  label: '三级 2-1-1'
                },
                {
                  id: 10,
                  label: '三级 2-1-2'
                }
              ]
            }
          ]
        }
      ]
    }
  },
  props: {
    srvCfg: {
      type: Boolean,
      default: true
    }
  },
  created() {
    this.getDoorList()
  },
  watch: {},
  methods: {
    ...mapMutations(['GET_CURRENT_SRV', 'PANEL_SWIFCH']),
    ...mapActions(['getDoorList', 'doorServerList', 'getDoorSyn']),
    // 获取该门禁系统列表
    getDoorList() {
      const postData = {
        page: '1',
        limit: 100
      }
      // 获取该门禁系统列表
      this.doorServerList(postData)
        .then(res => {
          this.dataSource = res
          res.forEach(ele => {
            this.getDoorListItem(ele._id)
          })
          console.log(res)
        })
        .catch(() => {
          this.errorMsg('获取该门禁系统列表失败！')
        })
    },
    getDoorListItem(id) {
      this.getDoorSyn({
        id: id
      })
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          this.errorMsg('同步该门禁系统列表失败！')
          console.log(err)
        })
    },
    // 刷新
    refresh() {
      this.getDoorList()
    },
    // 搜索门禁服务器
    searchDoor() {
      console.log(this.searchKey)
    },
    //  触发获取门禁列表
    tiggerSrvList(name) {
      this.route = name
      // tigger-door
      this.$emit('tigger-server')
    },
    tiggerSrvListStatus() {
      this.route = ''
    }
  }
}
</script>
<style scoped>
.doorTitle {
  width: 100%;
  height: 38px;
  line-height: 38px;
  text-align: center;
  font-size: 16px;
  background-color: #0f2243;
}
.active {
  background-color: #2f497a;
}
.refresh:hover {
  cursor: pointer;
}
.bottomPart {
  width: 100%;
  margin-top: 20px;
}
.jiexian {
  position: absolute;
  width: 90%;
  height: 0;
  border-top: 1px solid rgba(58, 90, 139, 0.4);
  left: 50%;
  margin-left: -45%;
}
</style>
