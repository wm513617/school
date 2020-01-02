<template>
  <!-- 左部结构树  （现场和回放都用这个） -->
  <div id="menu">
    <!--左边机构、收藏夹-->
    <ul>
      <li @click="menuTag='org'" :class="{'active':menuTag==='org'}">机构</li>
      <li @click="menuTag='fav';$refs.fav.expand()" v-show="parent!=='playback'" :class="{'active':menuTag==='fav'}">收藏夹</li>
      <!-- <li @click="menuTag='business'" v-if="caseProcessing ==='/business/caseProcessing'" :class="{'active':menuTag==='business'}">案件列表</li> -->
      <!-- <li v-show="parent==='playback' && caseProcessing !=='/business/caseProcessing'"></li> -->
      <li class="btn">
        <i class="iconfont icon-share" v-if="menuTag==='fav'" @click.stop="shareClick" title="分享"></i>&nbsp;
        <i class="iconfont icon-shuaxin1" @click.stop="refresh" title="刷新"></i>
      </li>
    </ul>
    <div class="input" style="width:100%;padding:10px;" >
      <Input v-model="searchVal" icon="ios-search-strong" placeholder="请输入..." />
    </div>
    <div style="padding:0px;height:calc(100% - 88px)" v-if="showTree">
      <!-- <keep-alive>
        <component :is="comp" :showAdd="showAdd" :ref="menuTag" :synchro="synchro" :searchVal="searchVal" @changeNodeId="changeNodeId">
        </component>
      </keep-alive> -->
      <!-- <CaseProcessingTree ref="caseTree" v-if="menuTag==='business'" :searchVal="searchVal"></CaseProcessingTree> -->
      <organization v-show="menuTag==='org'" :showAdd="showAdd" ref="org" :synchro="synchro" :searchVal="searchVal"  @changeNodeId="changeNodeId" :iconToggle="iconToggle">
      </organization>
      <favorites v-if="menuTag==='fav'" :showAdd="showAdd" ref="fav" :synchro="synchro" :searchVal="searchVal"  @changeNodeId="changeNodeId">
      </favorites>
    </div>

    <!--分享弹窗-->
    <div class="sharePanel" v-if="openSharePanel" @click.stop>
      <iframe v-if="openSharePanel"></iframe>
      <div class="sharePanelBox">
        <div class="header">
          <div class="title">共享收藏夹</div>
          <div class="flag" @click='cancel'>
            <Icon type="close"></Icon>
          </div>
        </div>

        <div class="content">
          <div class="item">
            <Select v-model="favoritesName" style="width:200px;float:left;" :disabled="favoritesList.length === 0">
              <Option v-for="item in favoritesList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <table>分享给以下用户</table>
          </div>

          <div class="table">

            <Table :columns="userColumns" class="s-table" ref="table" :data="favoriteUserList" size="small" @on-selection-change="selectChange" height="192"></Table>

          </div>
        </div>

        <div class="shareBtnBox">
          <Button type="primary" @click='save' :disabled='selectList.length===0 || favoritesList.length === 0'>分享</Button>
          <Button @click='educe' type="ghost" :disabled="favoritesList.length === 0||favoritesName===''">导出</Button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// import CaseProcessingTree from './caseProcessingTree'
import Organization from './Organization.vue'
import Favorites from './Favorites.vue'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'VideoMenu',
  components: {
    Organization,
    Favorites
    // CaseProcessingTree
  },
  props: {
    synchro: {
      default: false
    },
    parent: {
      default: ''
    },
    iconToggle: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      caseProcessing: '', // 判断 是否显示 案件处理机构树
      searchVal: '',
      empty: '',
      menuTag: 'org',
      favoritesList: [],
      favoritesName: '',
      userCheck: false,
      openSharePanel: false,
      selectList: [],
      userColumns: [
        {
          type: 'selection',
          width: '60px'
        },
        {
          title: '用户名',
          key: 'name',
          width: '145px'
        },
        {
          title: '角色',
          key: 'role',
          width: '145px'
        }
      ],
      column: [
        {
          title: '收藏夹名称',
          key: 'favName'
        },
        {
          title: '创建者',
          key: 'creator'
        },
        {
          title: '是否轮巡',
          key: 'ispolling'
        },
        {
          title: '轮巡时间',
          key: 'pollingtime'
        },
        {
          title: '通道名称',
          key: 'resName'
        },
        {
          title: '通道ID',
          key: 'resID'
        },
        {
          title: '通道IP',
          key: 'resIP'
        },
        {
          title: '拥有者',
          key: 'owners'
        }
      ],
      showAdd: true,
      showTree: false
    }
  },
  computed: {
    ...mapState({
      videoOrgData: ({ videoOrg }) => videoOrg.videoOrgData,
      favData: ({ videoOrg }) => videoOrg.favData,
      userList: ({ videoOrg }) => videoOrg.userList
    }),
    pluginFrame() {
      return this.$parent.$refs.frame
    },
    favoriteUserList() {
      let user = sessionStorage.getItem('user.username')
      return this.userList.filter(item => {
        return item.name !== user
      })
    }
  },
  created() {
    this.caseProcessing = this.$route.path
  },
  watch: {
    menuTag(t) {
      // if (t === 'org') {
      //   this.comp = Organization
      // } else {
      //   this.comp = Favorites
      // }
      this.searchVal = ''
    }
  },
  methods: {
    ...mapActions(['getFavorites', 'setFavorites', 'shareFavorites', 'getUserAll', 'getUserListApi']),
    shareClick() {
      this.openSharePanel = true
      this.favoritesName = '0'
      for (const i in this.favData) {
        this.favoritesList.push({
          label: this.favData[i].name,
          value: i
        })
      }
    },
    refresh() {
      this.searchVal = ''
      if (this.menuTag === 'org') {
        this.$refs.org.$refs.treebox.$refs.treeLazy.refresh()
        this.$Notice.success({ title: '刷新成功！' })
        // this.getvideoOrg().then(res => {
        //   this.$Notice.success({ title: '刷新成功！' })
        // }).catch(error => {
        //   this.$Notice.error({ title: '刷新失败！' })
        //   console.log(error)
        // })
      } else if (this.menuTag === 'fav') {
        this.getFavorites().then(res => {
          this.$Notice.success({ title: '刷新成功！' })
        }).catch(error => {
          this.$Notice.error({ title: '刷新失败！' })
          console.log(error)
        })
      } else {
        // this.$refs.caseTree.getTreeList(1)
      }
    },
    cancel() {
      this.favoritesName = ''
      this.favoritesList = []
      this.openSharePanel = false
      this.selectList.length = 0
      // this.$refs.org.cancel()
      // this.$refs.fav.delFavClose()
      // this.$refs.fav.openEditGroup = false
    },
    save() {
      if (this.selectList.length === 0 || this.favoritesList.length === 0) { return }
      const obj = this.$lodash.cloneDeep(this.favData[this.favoritesName])
      function hasuser(id) {
        obj.owners.forEach(val => {
          if (val === id) {
            return false
          }
        })
        return true
      }
      this.selectList.forEach(item => {
        if (hasuser(item._id)) {
          obj.owners.push(item._id)
        }
      })
      // obj.owners.push('bbbbbb')
      this.setFavorites(obj).then(res => {
        this.$Notice.success({ title: '分享成功！' })
      }).catch(error => {
        this.$Notice.error({ title: '分享失败！' })
        console.log(error)
      })
      this.cancel()
    },
    educe() {
      if (this.favoritesList.length === 0 || this.favoritesName === '') { return }
      const obj = this.$lodash.cloneDeep(this.favData[this.favoritesName])
      function _changeOwners(owners) {
        let str = ''
        owners.forEach((i) => {
          str = str + '、' + getUserName(i)
        })
        str = str.slice(1)
        return str
      }
      const _this = this
      function getUserName(id) {
        let userName = ''
        _this.userList.forEach(item => {
          if (id === item._id) {
            userName = item.name
          }
        })
        return userName
      }
      let educeData = []
      obj.children.forEach(val => {
        educeData.push({
          favName: obj.name,
          creator: getUserName(obj.creator),
          owners: _changeOwners(obj.owners),
          ispolling: obj.ispolling,
          pollingtime: obj.pollingtime,
          resName: val.name,
          resID: val._id,
          resIP: val.ip
        })
      })
      this.$refs.table.exportCsv({
        filename: '收藏夹',
        columns: this.column,
        data: educeData
      })
      // this.$Notice.success({ title: '收藏夹导出成功！' })
      this.cancel()
    },
    selectChange(list) {
      this.selectList = list
    },
    getSelectedNodes() {
      return this.$refs[this.menuTag].getSelectedNodes()
    },
    changeNodeId(id) {
      this.$emit('changeNodeId', id)
    }
  },
  mounted() {
    this.getUserListApi()
    this.showTree = true
    this.cancelEnt = function(e) { // 收藏夹弹窗，点击空白关闭事件
      if (this.cancel) { this.cancel() }
      if (this.$refs.org && this.$refs.org.cancel) { this.$refs.org.cancel() }
      if (this.$refs.fav && this.$refs.fav.delFavClose) { this.$refs.fav.delFavClose() }
      if (this.$refs.fav && this.$refs.fav.openEditGroup) { this.$refs.fav.openEditGroup = false }
    }.bind(this)
    // document.querySelector('body').addEventListener('click', this.cancelEnt, false)
  },
  beforeDestroy() {
    this.$store.commit('SET_CURNODE', '')
    // document.querySelector('body').removeEventListener('click', this.cancelEnt)
    delete this.cancelEnt
  }
}
</script>

<style scoped>
#menu {
  height: 100%;
}
#menu > ul {
  width: 100%;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  text-align: center;
  background: #1b3153;
}
#menu > ul li {
  width: 33.333%;
  float: left;
  cursor: pointer;
  height: 36px;
  background: #0f2343;
  border-top: 2px solid rgb(16, 27, 49);
  list-style: none;
  color: #8597ad;
}
#menu > ul li.active {
  background: #1b3153;
  color: #fff;
}
#menu > ul li.btn {
  float: right;
  font-size: 16px;
  border-right: 0;
}
#menu > ul li.btn > * {
  display: inline-block;
  margin: 1px;
}
#menu > ul li.btn > i:hover,
#menu > ul li:hover {
  color: #4699f9;
}

.sharePanel {
  width: 400px;
  height: 360px;
  position: absolute;
  background: #1b3153;
  top: 50vh;
  left: 50vw;
  margin-left: -200px;
  margin-top: -200px;
  z-index: 99999;
  color: #fff;
  border-radius: 8px;
}
.sharePanel iframe,
.sharePanelBox {
  background-color: transparent;
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 0 none;
}
.sharePanel .header {
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding: 0 24px;
  background: #0f2343;
  border-radius: 8px 8px 0 0;
}
.sharePanel .header .title {
  float: left;
}
.sharePanel .header .flag {
  float: right;
  cursor: pointer;
}
.sharePanel .content .item {
  padding: 10px 0px;
  width: 100%;
  height: 55px;
}
.sharePanel .content {
  width: 100%;
  padding: 0 15px;
}
.sharePanel .content .item table {
  width: 120px;
  line-height: 32px;
  float: left;
}
.content {
  border-bottom: 1px solid #203863;
}
.sharePanel .shareBtnBox {
  width: 135px;
  position: absolute;
  right: 20px;
  bottom: 12px;
}
.shareBtnBox * {
  margin: 0 4px;
}
.halo-tree .input .ivu-input-wrapper input.ivu-input {
  background: #2f3130;
}
/*.sharePanel .content table{
  width: 100%;
  border-collapse: collapse;
}*/
/*.checkbox{
  border-collapse: separate;
}*/
/*.sharePanel .content table th,.sharePanel .content table td{
  border: 1px solid #e4e4e4;
  line-height: 26px;
  text-align: center;
}*/
ul,
li {
  list-style: none;
}
</style>
<style>
.s-table .ivu-table-header table {
  width: 100% !important;
}
</style>
