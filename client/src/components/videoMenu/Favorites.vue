<template>
  <div class="favorites" :style="{height: scroll ? '100%' : 'auto'}">
    <div v-if="scroll" class="treeBox" style="height:calc(100%);">
      <bs-scroll ref="scroller">
        <!-- style="height:calc(100% - 22px);" -->
        <VTree ref='tree' :treeData="favData" @on-expand="expand" @loadMore="expand" @creatTreeEnd="expand" :options="options" :activeId="activeFavId" :searchVal="searchVal" @searchCount="count => $emit('searchCount', count)" @node-click='handleNode' @node-dblclick="dblClick" @openPreviewClick='openPreviewClick' @openAllPreviewClick='openAllPreviewClick' @deleteClick='deleteClick' @editClick='editClick' />
        <div class="add" @click="openAddname=true" v-show="showAdds">
          <Icon type="ios-plus-outline"></Icon> &nbsp;
          <span v-if="!openAddname">新建一个收藏夹</span>
          <Input v-if="openAddname" v-model="addname" size="small" ref="addInput" icon="checkmark-round" placeholder="请输入..." @on-click='addFav' @on-blur='addFav' @on-enter="addFav" style="width:168px" />
        </div>
      </bs-scroll>
    </div>
    <div v-else class="treeBox" style="height:calc(100%);">
      <VTree ref='tree' :treeData="favData" @on-expand="$emit('on-expand')" @creatTreeEnd="$emit('on-expand')" :options="options" :activeId="activeFavId" :searchVal="searchVal" @searchCount="count => $emit('searchCount', count)" @node-click='handleNode' @node-dblclick="dblClick" @openPreviewClick='openPreviewClick' @openAllPreviewClick='openAllPreviewClick' @deleteClick='deleteClick' @editClick='editClick' />
      <div class="add" @click="openAddname=true" v-show="showAdds">
        <Icon type="ios-plus-outline"></Icon> &nbsp;
        <span v-if="!openAddname">新建一个收藏夹</span>
        <Input v-if="openAddname" v-model="addname" size="small" ref="addInput" icon="checkmark-round" placeholder="请输入..." @on-click='addFav' @on-blur='addFav' @on-enter="addFav" style="width:168px" />
      </div>
    </div>

    <!--删除收藏夹弹窗-->
    <div class="delFav" v-if="opendelFav" @click.stop>
      <iframe v-if="opendelFav"></iframe>
      <div class="delFavBox">
        <div class="header">
          <div class="title">删除收藏夹</div>
          <div class="flag" @click='delFavClose'>
            <Icon type="close"></Icon>
          </div>
        </div>

        <p class="content">
          确认删除该收藏夹及该收藏夹下的所有镜头吗？
        </p>
        <div class="delFavBtnBox">
          <Button type="ghost" @click='delFavClose'>取消</Button>
          <Button type="primary" @click='delFavSave'>确认</Button>
        </div>
      </div>
    </div>

    <EditGroup :openEditGroup='openEditGroup' :groupData="groupData" @editSave="editSave" @editCancel="openEditGroup = false"></EditGroup>
  </div>
</template>
<script>
import VTree from '../tree/VTree.vue'
import EditGroup from './EditGroup.vue'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
export default {
  name: 'Favorites',
  components: { VTree, EditGroup },
  props: {
    scroll: {
      default: true
    },
    searchVal: {
      default: ''
    },
    showAdd: {
      default: false
    },
    options: {
      default() {
        return {
          showSearch: false,
          showOpenPreview: true,
          showOpenAllPreview: true,
          showDelete: true,
          showEdit: true,
          moreRoot: true,
          search: {
            onlyLeaf: true
          }
        }
      }
    }
  },
  data() {
    return {
      currentId: '',
      treeData: [],
      openEditGroup: false,
      groupData: {},
      editId: '',
      addname: '',
      openAddname: false,
      opendelFav: false,
      showAdds: false
    }
  },
  computed: {
    ...mapGetters(['userId']),
    ...mapState({
      favData: ({ videoOrg }) => videoOrg.favData,
      activeFavId: ({ videoOrg }) => videoOrg.activeFavId,
      playingIds: ({ videoOrg }) => videoOrg.playingIds,
      pollId: ({ videoOrg }) => videoOrg.pollId,
      pollingId: ({ videoOrg }) => videoOrg.pollingId
    }),
    plugin() {
      return this.$parent.$parent.$refs.frame
    }
  },
  watch: {
    openAddname(val) {
      // console.log(this.$refs.addInput.focus)
      const _this = this
      const tiemOut = setTimeout(() => {
        if (val) {
          _this.$refs.addInput.focus()
        }
        clearTimeout(tiemOut)
      }, 100)
    }
  },
  methods: {
    ...mapActions(['getFavorites', 'addFavorites', 'deleteFavorites', 'setFavorites', 'upPlayindId']),
    ...mapMutations(['SET_CURNODE', 'SET_FAVID', 'SET_POLL']),
    expand() {
      this.$refs.scroller.update()
    },
    deepCopy(obj) {
      let newobj = obj && obj.constructor === Array ? [] : {}
      for (let i in obj) {
        if (typeof obj[i] === 'object') {
          newobj[i] = this.deepCopy(obj[i])
        } else {
          newobj[i] = obj[i]
        }
      }
      return newobj
    },
    addFav() {
      this.addname = ''.trim.call(this.addname)
      if (this.addname) {
        if (this.addname.length > 26) {
          this.warningMsg('收藏夹名字不能超过26个字符')
          return
        }
        this.addFavorites({ name: this.addname })
          .then(res => {
            this.successMsg('添加成功！')
          })
          .catch(error => {
            this.errorMsg('添加失败！' + error.response.data.message)
            console.log(error)
          })
      }
      this.addname = ''
      this.openAddname = false
    },
    handleNode(node) {
      // console.log(node)
      this.SET_FAVID(node._id)
      this.SET_CURNODE(node)
      this.$emit('changeNodeId', node._id)
    },
    isPoll(item) {
      if (item._id === this.pollId) {
        return true
      } else {
        for (const i in this.pollingId) {
          if (this.pollingId[i].id === item._id) {
            return true
          }
        }
      }
      return false
    },
    async openPreviewClick(node) {
      if (this.pollId) {
        const arr = this.plugin.clearTimedPlay()
        this.upPlayindId(arr)
        this.plugin.activedIndex = 0
        this.SET_POLL('')
      }
      let index = 1
      for (const i in this.plugin.pluginData) {
        index = parseInt(i) + 2
      }
      if (index > this.plugin.showscreen) {
        await this.plugin.stop(false)
      } else {
        this.plugin.nextEmptyPlugin()
        // for (let i = 0; i < this.plugin.showscreen; i++) {
        //   if (!this.plugin.pluginData[i]) {
        //     this.plugin.activedIndex = i
        //     break
        //   }
        // }
      }
      this.SET_CURNODE(node)
      let param = {
        id: node._id.split('_')[0],
        pid: node.eid._id,
        type: 'video',
        orgPath: node.orgPath,
        name: node.name,
        streamType: this.plugin.pluginState.streamType || 'main',
        ip: node.eid.ip,
        port: node.eid.cport,
        dport: node.eid.dport,
        channel: node.chan,
        vendor: node.eid.manufacturer,
        monitorType: node.monitortype
      }
      if (node.nodeId) {
        param = {
          ...param,
          gbDevId: node.nodeId,
          shareServer: node.shareServer
        }
      }
      this.plugin.open(param)
      // }
    },
    dblClick(node) {
      if (this.$route.fullPath === '/play_video/realtime') {
        this.openPreviewClick(node)
      }
    },
    async openAllPreviewClick(node) {
      if (this.isPoll(node)) {
        const arr = this.plugin.clearTimedPlay()
        this.upPlayindId(arr)
        this.plugin.stopAll(false)
        this.SET_POLL('')
        return
      }

      const _self = this
      const paramlist = []

      function loop(list, fn) {
        list.forEach(item => {
          const ret = fn.call(_self, item)
          if (ret.isDone === false) {
            loop(ret.children, fn)
          }
        })
      }

      loop(node.children, item => {
        if ('eid' in item) {
          let p = {
            id: item._id.split('_')[0],
            pid: item.eid._id,
            type: 'video',
            orgPath: item.orgPath,
            name: item.name,
            streamType: this.plugin.pluginState.streamType || 'main',
            ip: item.eid.ip,
            port: item.eid.cport,
            dport: item.eid.dport,
            channel: item.chan,
            vendor: item.eid.manufacturer,
            monitorType: item.monitortype
          }
          if (item.nodeId) {
            p = {
              ...p,
              gbDevId: item.nodeId,
              shareServer: item.shareServer
            }
          }
          paramlist.push(p)
        }
        return {
          isDone: !item.children,
          children: item.children ? item.children : null
        }
      })
      if (paramlist.length > this.plugin.showscreen && node.ispolling !== 'true') {
        paramlist.splice(this.plugin.showscreen)
      }
      await this.plugin.openAll(paramlist, node.ispolling === 'true')
      // 以上是打开多个节点， 如果是轮训的话开启一个定时任务
      if (node.ispolling === 'true') {
        this.SET_POLL(node._id)
        this.plugin.timedPlay(node.pollingtime)
      }
    },
    editClick(node) {
      if (node.creator !== this.userId) {
        this.warningMsg('无法编辑被分享的收藏夹')
        return
      }
      this.openEditGroup = true
      this.editId = node.id
      this.groupData = node
    },
    deleteClick(node) {
      if (node.ispolling && this.isPoll(node)) {
        this.warningMsg('无法删除正在轮巡的收藏夹')
        return
      }
      if (node.children) {
        this.currentId = node._id
        this.opendelFav = true
      } else {
        for (const i in this.favData) {
          if (this.favData[i]._id === node.pid) {
            let obj = this.$lodash.cloneDeep(this.favData[i])
            obj.resources = []
            for (const i in obj.children) {
              if (obj.children[i]._id !== node._id) {
                obj.resources.push(obj.children[i]._id.split('_')[0])
              }
            }
            delete obj.children
            this.setFavorites(obj)
              .then(res => {
                this.$Notice.success({ title: '提示', desc: '删除成功！' })
              })
              .catch(err => {
                console.log('logout error: ' + err)
                this.$Notice.error({ title: '失败', desc: '删除失败！' + err.response.data.message })
              })
          }
        }
      }
    },
    delFavClose() {
      this.opendelFav = false
    },
    delFavSave() {
      this.opendelFav = false
      // console.log(this.currentId)
      this.deleteFavorites(this.currentId)
        .then(res => {
          this.$Notice.success({ title: '提示', desc: '删除收藏夹成功！' })
        })
        .catch(err => {
          console.log('logout error: ' + err)
          this.$Notice.error({ title: '失败', desc: '删除失败！' + err.response.data.message })
        })
    },
    editSave(node) {
      this.setFavorites(node)
        .then(res => {
          this.$Notice.success({ title: '提示', desc: '修改成功！' })
        })
        .catch(err => {
          console.log('logout error: ' + err)
          this.$Notice.error({ title: '失败', desc: '编辑失败！' + err.response.data.message })
        })
    },
    getSelectedNodes() {
      return this.$refs.tree.getSelectedNodes()
    }
  },
  created() {
    this.getFavorites().then(() => {
      this.showAdds = this.showAdd
    })
  },
  updated() {
    this.$emit('on-expand')
  }
}
</script>
<style scoped>
.favorites {
  width: 100%;
  height: 100%;
}
.add {
  font-size: 14px;
  color: #4699f9;
  cursor: pointer;
  padding-left: 10px;
}

.delFav {
  width: 310px;
  height: 150px;
  position: absolute;
  background: #1b3153;
  top: 50vh;
  left: 50vw;
  margin-left: -155px;
  margin-top: -200px;
  z-index: 9999999;
  color: #fff;
  border-radius: 8px;
}
iframe,
.delFavBox {
  background-color: transparent;
  position: absolute;
  z-index: 101;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 0 none;
}
.delFav > .delFavBox .header {
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #0f2343;
  padding: 0 24px;
  margin-bottom: 10px;
  background: #0f2343;
  border-radius: 8px 8px 0 0;
}
.delFavBox > .header .title {
  float: left;
}
.delFavBox > .header .flag {
  float: right;
  cursor: pointer;
}
.delFavBox > .content {
  padding: 10px 24px;
  width: 100%;
  line-height: 1.5;
}

.delFavBtnBox {
  width: 135px;
  position: absolute;
  right: 15px;
  bottom: 12px;
}
.delFavBtnBox * {
  margin: 0 4px;
}
</style>
