<template>
  <div class="Upunion">
    <ServerList
      ref="upServerList"
      :isLimit="!$BShasPower('BS-INTERCONNECT-UP-MANAGE')"
      title="上级服务器"
      :serverList="serverList"
      :activeServer.sync="activeServer"
      @addServer="addServer"
      @delServer="delServer"
      @refresh="refreshList"
    />
    <ServerAttr
      :isLimit="!$BShasPower('BS-INTERCONNECT-UP-MANAGE')"
      :activeServerInfo="serverAttrs"
      @editServer="editServer"
    />
    <ShareRes
      ref="shareres"
      :isLimit="!$BShasPower('BS-INTERCONNECT-UP-MANAGE')"
      :videoTree="videoLocTree"
      :alarmTree="alarmLocTree"
      :videoCheckedList="videoCheckedList"
      :alarmCheckedList="alarmCheckedList"
      :selectResource.sync="selectResource"
      @checkedChange="checkedChange"
      :activeServer="activeServer"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ServerList from './common/ServerList'
import ServerAttr from './common/ServerAttr'
import ShareRes from './common/ShareRes'
export default {
  components: {ServerList, ServerAttr, ShareRes},
  data() {
    return {
      selectResource: 'video',
      serverList: [],
      activeServer: 0
    }
  },
  computed: {
    ...mapState({
      upServers: ({ interconnect }) => interconnect.upServers,
      videoLocTree: ({ interconnect }) => interconnect.videoLocTree,
      alarmLocTree: ({ interconnect }) => interconnect.alarmLocTree
    }),
    serverAttrs() {
      return this.serverList[this.activeServer]
    },
    videoCheckedList() {
      let checkedList = []
      if (this.serverAttrs && this.serverAttrs.shareData && this.serverAttrs.shareData.videoRes && this.serverAttrs.shareData.videoOrg) {
        checkedList = this.serverAttrs.shareData.videoRes.concat(this.serverAttrs.shareData.videoOrg)
      }
      return checkedList
    },
    alarmCheckedList() {
      let checkedList = []
      if (this.serverAttrs && this.serverAttrs.shareData && this.serverAttrs.shareData.alarmRes && this.serverAttrs.shareData.alarmOrg) {
        checkedList = this.serverAttrs.shareData.alarmRes.concat(this.serverAttrs.shareData.alarmOrg)
      }
      return checkedList
    }
  },
  watch: {
    upServers() {
      this.serverList = this.$lodash.cloneDeep(this.upServers)
    }
  },
  methods: {
    ...mapActions(['getUpServers', 'addUpServer', 'editUpServer', 'delUpServer', 'shareResource']),
    addServer(info) {
      this.addUpServer(info).then(() => {
        this.$Notice.success({
          title: '添加成功！'
        })
        this.$refs.upServerList.isshow = false
      }).catch(() => {
        this.$Notice.error({
          title: '添加上级服务器失败！'
        })
      })
    },
    editServer(info) {
      this.editUpServer(info).then(() => {
        this.$Notice.success({
          title: '修改成功！'
        })
      }).catch(() => {
        this.$Notice.error({
          title: '修改失败！'
        })
      })
    },
    delServer(_id) {
      this.delUpServer(_id).catch(() => {
        this.$Notice.error({
          title: '删除失败！'
        })
      })
    },
    checkedChange(orgs) {
      this.shareResource({_id: this.serverAttrs._id, orgs, type: this.selectResource}).then(() => {
        // console.log('共享成功')
      }).catch(() => {
        this.$Notice.error({
          title: '共享失败!'
        })
      })
    },
    refreshList() {
      this.getUpServers().then(() => {
        this.$Notice.success({
          title: '刷新成功！'
        })
      }).catch(() => {
        this.$Notice.error({
          title: '刷新失败！'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .Upunion {
    flex: auto;
    height: 100%;
    display: flex;
    flex-direction: row;
  }
</style>
