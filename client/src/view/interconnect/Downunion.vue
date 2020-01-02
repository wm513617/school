<template>
  <div class="Downunion">
    <ServerList
      ref="downServerList"
      :isLimit="!$BShasPower('BS-INTERCONNECT-DOWN-MANAGE')"
      title="下级服务器"
      :serverList="serverList"
      :activeServer.sync="activeServer"
      @addServer="addServer"
      @delServer="delServer"
      @refresh="refreshList"
    />
    <ServerAttr
      :isLimit="!$BShasPower('BS-INTERCONNECT-DOWN-MANAGE')"
      :activeServerInfo="serverAttrs"
      @editServer="editServer"
    />
    <ShareRes
      :isLimit="!$BShasPower('BS-INTERCONNECT-DOWN-MANAGE')"
      :videoTree="videoLocTree"
      :alarmTree="alarmLocTree"
      :showLocal="true"
      :shareTree="shareTree"
      @save="saveMappingShare"
      :selectResource.sync="selectResource"
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
  components: { ServerList, ServerAttr, ShareRes },
  data() {
    return {
      selectResource: 'video',
      serverList: [],
      videoTree: [
        {
          _id: '5b56df75a209b75d03f58942',
          name: 'video根节点-现场',
          children: [
            {
              _id: 'dsf',
              name: 'video二级节点-1',
              pid: '5b56df75a209b75d03f58942'
            },
            {
              _id: 'dsf11',
              name: 'video二级节点-2',
              pid: '5b56df75a209b75d03f58942',
              children: [
                {
                  _id: '54654',
                  name: 'video三级节点-1',
                  pid: 'dsf11'
                }
              ]
            }
          ]
        }
      ],
      alarmTree: [
        {
          _id: '5b56df75a209b75d03f58942',
          name: 'alarm根节点-现场',
          children: [
            {
              _id: 'dsf',
              name: 'alarm二级节点-1',
              pid: '5b56df75a209b75d03f58942'
            },
            {
              _id: 'dsf11',
              name: 'alarm二级节点-2',
              pid: '5b56df75a209b75d03f58942',
              children: [
                {
                  _id: '54654',
                  name: 'alarm三级节点-1',
                  pid: 'dsf11'
                }
              ]
            }
          ]
        }
      ],
      activeServer: 0
    }
  },
  computed: {
    ...mapState({
      downServers: ({ interconnect }) => interconnect.downServers,
      shareTrees: ({ interconnect }) => interconnect.shareTrees,
      videoLocTree: ({ interconnect }) => interconnect.videoLocTree,
      alarmLocTree: ({ interconnect }) => interconnect.alarmLocTree
    }),
    serverAttrs() {
      return this.serverList[this.activeServer]
    },
    shareTree() {
      return this.serverAttrs && this.shareTrees[this.serverAttrs._id]
        ? this.shareTrees[this.serverAttrs._id][this.selectResource] || []
        : []
    }
  },
  watch: {
    downServers() {
      this.serverList = this.$lodash.cloneDeep(this.downServers)
    },
    serverList() {
      this.getShareTreeWrap()
    },
    selectResource() {
      this.getShareTreeWrap()
    },
    activeServer() {
      this.getShareTreeWrap()
    }
  },
  methods: {
    ...mapActions(['getDownServers', 'addDownServer', 'editDownServer', 'delDownServer', 'getshareTree', 'mappingTree']),
    addServer(info) {
      this.addDownServer(info)
        .then(() => {
          this.$Notice.success({
            title: '添加成功！'
          })
          this.$refs.downServerList.isshow = false
        })
        .catch(() => {
          this.$Notice.error({
            title: '添加下级服务器失败！'
          })
          this.$refs.downServerList.isshow = false
        })
    },
    editServer(info) {
      this.editDownServer(info)
        .then(() => {
          this.$Notice.success({
            title: '修改成功！'
          })
        })
        .catch(() => {
          this.$Notice.error({
            title: '修改失败！'
          })
        })
    },
    delServer(_id) {
      this.delDownServer(_id)
        .catch(() => {
          this.$Notice.error({
            title: '删除失败！'
          })
        })
    },
    saveMappingShare({ orgs, orgId }) {
      if (orgId && orgs.length > 0) {
        this.mappingTree({ orgs, orgId, type: this.selectResource, serverId: this.serverAttrs._id })
          .then(() => {
            this.$Notice.success({
              title: '映射成功！'
            })
          })
          .catch(() => {
            this.$Notice.error({
              title: '映射失败！'
            })
          })
      } else {
        this.$Notice.warning({
          title: '未选择共享资源或映射机构'
        })
      }
    },
    getShareTreeWrap() {
      if (this.serverAttrs) {
        this.getshareTree({
          _id: this.serverAttrs._id,
          type: this.selectResource
        }).catch(() => {
          this.$Notice.error({
            title: '获取共享资源失败！'
          })
        })
      }
    },
    refreshList() {
      this.getDownServers().then(() => {
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
.Downunion {
  flex: auto;
  height: 100%;
  display: flex;
  flex-direction: row;
}
</style>
