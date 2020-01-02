<!--编辑模式 视频、报警、巡更点位的左边树结构页面-->
<template>
  <div class="mapEditTree">
    <div class="input" style="width:100%;padding:0 10px;">
      <Input v-model="searchVal" icon="ios-search-strong" placeholder="请输入..." />
    </div>
    <div class="mapEditTittle">
      <ul>
        <li v-if="$BShasPower('BS-SETTING-RESOURCE-VIDEO-MANAGE')" @click="resTabClick( 'video');searchVal=''" :class="{'active': tabShow==='video'}"><i class="iconfont icon-video-gun1" title="视频" :class="{'active': tabShow==='video'}"></i></li>
        <li v-if="$BShasPower('BS-FIRE-ALARMIN')" @click="resTabClick('alarm');searchVal=''" :class="{'active': tabShow==='alarm'}"><i class="iconfont icon-putongbaojing1" title="报警" :class="{'active': tabShow==='alarm'}"></i></li>
        <li v-if="$BShasPower('BS-FIRE-ALARMIN')" @click="resTabClick('alarmHelp');searchVal=''" :class="{'active': tabShow==='alarmHelp'}"><i class="iconfont icon-baojingzhu1" title="报警求助" :class="{'active': tabShow==='alarmHelp'}"></i></li>
        <li v-if="$BShasPower('BS-SETTING-POINT-MANAGE')" @click="resTabClick('patrol');searchVal=''" :class="{'active': tabShow==='patrol'}"><i class="iconfont icon-dianzixungeng" title="巡更" :class="{'active': tabShow==='patrol'}"></i></li>
        <li v-if="$BShasPower('BS-SETTING-POINT-MANAGE')" @click="resTabClick('doorControl');searchVal=''" :class="{'active': tabShow==='doorControl'}"><i class="iconfont icon-menjin1" title="门禁" :class="{'active': tabShow==='doorControl'}"></i></li>
      </ul>
    </div>
    <div id="video" v-if="$BShasPower('BS-SETTING-RESOURCE-VIDEO-MANAGE') && tabShow==='video'" class="mapEditTreeHome">
      <BStreeNewBox ref="treebox" :iconToggle="false" :searchToggle="false" :searchType="0" :searchVal="searchVal" :equipmentToggle="false" :resourceToggle="true" :orgType="0" :resType="[0]"  @clickData="mapViseoSource" mapSpecial="2D" :newField="queryParam" :delIcon="true" @delData="deleteClick" @dbclickData="videoPreview"></BStreeNewBox>
    </div>
    <div id="alarm" v-if="$BShasPower('BS-FIRE-ALARMIN') && tabShow==='alarm'" class="mapEditTreeHome ">
      <BStreeNewBox ref="treebox" :iconToggle="false" :searchToggle="false" :searchType="0" :searchVal="searchVal" :equipmentToggle="false" :resourceToggle="true" :orgType="0" :resType="[1,9,11]"  @clickData="mapAlarmSource" mapSpecial="2D" :newField="queryParam" :delIcon="true" @delData="deleteClick"></BStreeNewBox>
    </div>
    <div v-if="$BShasPower('BS-FIRE-ALARMIN') && tabShow==='alarmHelp'" class="mapEditTreeHome patrol-area">
      <VTree ref='tree' :activeId='activeNodeId' :searchVal="searchVal" :treeData="alarmHelpFMTree" @deleteClick='deleteClick' :options="options" @node-click='mapAlarmHelpSource'></VTree>
    </div>
    <div v-if="$BShasPower('BS-SETTING-POINT-MANAGE') && tabShow==='patrol'" class="mapEditTreeHome patrol-area">
      <VTree ref='tree' :activeId='activeNodeId' :searchVal="searchVal" :treeData="partrolData" @deleteClick='deletePatrolPoint' :options="options" @node-click='mapPatrolSource'></VTree>
    </div>
    <div v-if="$BShasPower('BS-SETTING-POINT-MANAGE') && tabShow==='doorControl'" class="mapEditTreeHome patrol-area">
      <VTree ref='tree' :activeId='activeNodeId' :searchVal="searchVal" :treeData="doorControlFMTree" :options="options" @deleteClick='deleteDoorControlPoint' @node-click='mapDoorControlSource'></VTree>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex'
import { RESOURCETYPE, RESICONOID, MAPMODE } from 'assets/2DMap/meta/common'
import VTree from 'components/tree/VTree.vue'
import BStreeNewBox from 'components/BStreeNew/BStreeNewBox'
import eventCtrl from '../baseMap/ctrl/event'
import pointResource from '../baseMap/layers/pointResource'
export default {
  components: {
    VTree,
    BStreeNewBox
    // SearchResList
  },
  mixins: [pointResource, eventCtrl],
  data() {
    return {
      tabShow: 'video',
      activeNodeId: '',
      searchVal: '',
      options: {
        showSearch: false,
        showOpenPreview: false,
        showOpenAllPreview: false,
        showCollection: false,
        showPoint: '2d'
      },
      treeOptions: {
        showSearch: false,
        showOpenPreview: false,
        showOpenAllPreview: false,
        showCollection: false,
        isMapDate: false,
        showPoint: '2d'
      },
      queryParam: '&storeyId=1&mapType=2D' // 楼层查询条件
    }
  },
  computed: {
    ...mapState({
      alarmHelpFMTree: ({ fengMap }) => fengMap.alarmHelpFMTree, // 报警求助资源树
      partrolFMTree: ({ fengMap }) => fengMap.partrolFMTree, // 巡更资源树
      doorControlFMTree: ({ fengMap }) => fengMap.doorControlFMTree, // 门禁资源树数据
      isfmOuter: ({ fengMap }) => fengMap.isfmOuter,
      activeFMap: ({ fengMap }) => fengMap.activeFMap
    }),
    ...mapGetters('fengMap', ['editFMTreeChangeCounter'])
  },
  watch: {
    activeFMap(val) { // 当前地图
      this.searchVal = ''
      if (val) {
        this.queryParam = '&storeyId=1&mapType=2D'
        this.getPatrolPointFMTree()
        this.getDoorControlFMTree()
        this.getAlarmHelpFMTree({ mapType: MAPMODE.mode2D })
      }
    },
    editFMTreeChangeCounter: { // 编辑树计数器变化
      handler(newData, oldData) {
        if (newData.count > oldData.count) { // 计数变化
          if (newData.optTab === this.tabShow || (['video', 'alarm'].includes(this.tabShow) && !newData.optTab)) { // 操作树是当前显示的树 或 当前树时懒加载树并且计数器操作树为空时，刷新懒加载树
          }
          let treebox = this.$refs.treebox
          treebox && treebox.builtInRefreshs()
        }
      },
      deep: true
    },
    isfmOuter(flag) {
      this.searchVal = ''
      if (flag) {
        this.queryParam = '&storeyId=1&mapType=2D'
      }
    }
  },
  methods: {
    ...mapActions('fengMap', [
      // 获取资源树
      'getPatrolPointFMTree',
      'getDoorControlFMTree',
      'getAlarmHelpFMTree',
      // 通过id获取资源详细信息
      'getfmResourceById', // 视频、普通报警、报警主机、消防报警、报警柱、报警箱
      'getDoorfmPointResById',
      'getfmPatrolResById',
      // 设置当前点击的树节点，以定位地图中心
      'setSelectedfmTreeNode',
      // 设置当前选中的资源
      'setSelectedMapPointRes',
      // 获取默认图标
      'queryDefaultfmIconByOid',
      // 删除地图上的资源
      'delOneFMPoint', // 视频、普通报警、报警主机、消防报警、报警柱、报警箱
      'deletefmDoorPointRes',
      'deletefmPatrolRes'
    ]),
    ...mapActions([
      'setActiveMapConfig', // 设置当前地图配置
      'updatePointVideoList'
    ]),
    ...mapMutations('fengMap', [
      'SET_POINT_FMDRAW_ACTIVE', // 设置点位绘制激活状态
      'SET_LINE_FMDRAW_ACTIVE', // 设置线绘制激活状态
      'SET_DEL_MARKER_POINT' // 设置要删除的资源
    ]),
    videoPreview(node) { // 视频预览
      if (node.isOrg) { // 点击机构时不进行处理
        return
      }
      this.getfmResourceById(node._id).then(res => {
        if (res && res.point) { // 已添加设备
          if (res.status) { // 设备在线
            let eid = res.eid
            if (eid && (!eid.hasOwnProperty('deviceStatus') || eid.deviceStatus)) { // 设备启用
              this.updatePointVideoList(res) // 预览视频
            } else {
              this.warningMsg('该设备已禁用！')
            }
          } else {
            this.warningMsg('该设备不在线！')
          }
        }
      })
    },
    updateTrees(type) { // 删除资源后，刷新相应资源树
      if (type === RESOURCETYPE.video) { // 视频
        this.updatePointTreeCount('video')
      } else if (type === RESOURCETYPE.commonAlarm) { // 普通报警
        this.updatePointTreeCount('alarm')
      } else if (type === RESOURCETYPE.alarmHost) { // 报警主机报警
        this.updatePointTreeCount('alarm')
      } else if (type === RESOURCETYPE.fireAlarm) { // 消防报警
        this.updatePointTreeCount('alarm')
      } else if (type === RESOURCETYPE.alarmColumn || type === RESOURCETYPE.alarmBox) { // 报警柱或报警箱
        this.loadAlarmHelpTree()
      } else if (type === RESOURCETYPE.patrol) { // 巡更
        this.loadPatrolTree()
      } else if (type === RESOURCETYPE.doorControl) { // 门禁
        this.loadDoorTree()
      }
    },
    loadAlarmHelpTree() { // 报警求助资源树
      if (this.isfmOuter) {
        this.get2DAlarmHelpFMTree({ mapType: MAPMODE.mode2D })
      } else {
        this.get2DAlarmHelpFMTree({ mapType: MAPMODE.mode2D, floorId: this.levelData._id })
      }
    },
    loadDoorTree() { // 门禁资源树
      if (this.isfmOuter) {
        this.getDoorControlFMTree()
      } else {
        this.getDoorControlFMTree(this.levelData._id)
      }
    },
    loadPatrolTree() { // 巡更资源树
      if (this.isfmOuter) {
        this.getPatrolPointTree()
      } else {
        this.getPatrolPointTree(this.levelData._id)
      }
    },
    deleteClick(node) {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除吗?</p>',
        onOk: () => {
          let {_id, type, eid} = node
          let resLabel = '视频'
          if (type === RESOURCETYPE.video) {
            if (eid && eid.type) {
              if (eid.type === RESOURCETYPE.alarmColumn) { // 报警柱
                type = RESOURCETYPE.alarmColumn
                resLabel = '报警柱'
              } else if (eid.type === RESOURCETYPE.alarmBox) { // 报警箱
                type = RESOURCETYPE.alarmBox
                resLabel = '报警箱'
              }
            }
          } else if (type === RESOURCETYPE.commonAlarm) { // 普通报警
            resLabel = '普通报警'
          } else if (type === RESOURCETYPE.fireAlarm) { // 消防报警
            resLabel = '消防报警'
          } else if (type === RESOURCETYPE.fireAlarm) { // 报警主机
            resLabel = '报警主机'
          }
          this.delOneFMPoint(_id).then(res => {
            this.successMsg(resLabel + '点位删除成功')
            this.updateTrees(type) // 更新资源树
            const markertype = this.getVideoSubtype(node)
            // 设置 删除信息 以 监听 删除图标
            this.SET_DEL_MARKER_POINT({type: markertype, channelId: _id})
          }).catch(err => {
            console.log(err)
            this.errorMsg(resLabel + '点位删除失败')
          })
        }
      })
    },
    deletePatrolPoint(node) { // 删除巡更报警资源
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除吗?</p>',
        onOk: () => {
          let {_id, type} = node
          this.deletefmPatrolRes(_id).then(res => {
            this.successMsg('巡更点位删除成功')
            this.updateTrees(type)
          }).catch(err => {
            console.log(err)
            this.errorMsg('巡更点位删除失败')
          })
        }
      })
    },
    deleteDoorControlPoint(node) { // 删除门禁资源
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除吗?</p>',
        onOk: () => {
          let {_id, type} = node
          this.deletefmDoorPointRes(_id).then(res => {
            this.successMsg('门禁点位删除成功')
            this.updateTrees(type) // 更新资源树
            // 设置 删除信息 以 监听 删除图标
            this.SET_DEL_MARKER_POINT({type: RESICONOID.doorControl, channelId: _id})
          }).catch(err => {
            console.log(err)
            this.errorMsg('门禁点位删除失败')
          })
        }
      })
    },
    mapViseoSource(node) { // 点击视频资源树
      if (node.isOrg || node.isroot) { // 点击机构时不进行处理
        return
      }
      this.getfmResourceById(node._id).then(res => {
        let data = JSON.parse(JSON.stringify(res))
        data.rType = data.type
        this.setSelectedfmTreeNode(node) // 设置当前选中的节点，以定位地图中心
        if (data.point) { // 已添加点位
          this.setSelectedMapPointRes(data) // 设置当前地图选中的点位资源
          this.changeEditPoint({ page: 'videoPage', detail: 'edit' })
          // const mapId = data.point.mapId
          // 判断点位是否在当前地图，不在当前地图则跳转地图
        } else {
          this.changeEditPoint({ page: '', detail: 'show' }) // 关闭编辑面板
          let oid = this.getVideoSubtype(data)
          if (oid) {
            this.queryDefaultfmIconByOid(oid).then(res => {
              let pointIcon = JSON.parse(JSON.stringify(res))
              if (!pointIcon) {
                pointIcon = {oid: oid}
              }
              // 设置默认图标、当前选中资源、以及点位绘制状态
              this.setPointStatus(pointIcon, data)
            })
          }
        }
      })
    },
    mapAlarmSource(node) { // 点击报警资源树
      if (node.isOrg || node.isroot) { // 点击机构时不进行处理
        return
      }
      this.getfmResourceById(node._id).then(res => {
        let data = JSON.parse(JSON.stringify(res))
        data.rType = data.type
        this.setSelectedfmTreeNode(node)
        if (data.point) { // 已添加点位
          this.setSelectedMapPointRes(data) // 设置当前地图选中的点位资源
          this.changeEditPoint({ page: 'alarmPage', detail: 'edit' })
          // const mapId = data.point.mapId
          // 判断点位是否在当前地图，不在当前地图则跳转地图
        } else { // 未添加点位
          this.changeEditPoint({ page: '', detail: 'show' }) // 关闭编辑面板
          let { type } = data
          let oid = null // 资源标识
          if (type === RESOURCETYPE.commonAlarm) { // 普通报警
            oid = RESICONOID.commonAlarm
          } else if (type === RESOURCETYPE.alarmHost) { // 报警主机
            oid = RESICONOID.alarmHost
          } else if (type === RESOURCETYPE.fireAlarm) { // 消防报警
            oid = RESICONOID.fireAlarm
          }
          if (oid) { // 查询资源默认图标数据
            this.queryDefaultfmIconByOid(oid).then(res => {
              let pointIcon = JSON.parse(JSON.stringify(res))
              if (!pointIcon) {
                pointIcon = {oid: oid}
              }
              // 设置默认图标、当前选中资源、以及点位绘制状态
              this.setPointStatus(pointIcon, data)
            })
          }
        }
      })
    },
    mapAlarmHelpSource(node) { // 点击报警求助资源树
      if (node.isOrg || node.isroot) { // 点击机构时不进行处理
        return
      }
      this.getfmResourceById(node._id).then(res => {
        let data = JSON.parse(JSON.stringify(res))
        let eid = data.eid
        if (eid && eid.type) {
          data.rType = eid.type
          node.type = eid.type
        }
        this.setSelectedfmTreeNode(node)
        if (data.point) { // 已添加点位
          this.setSelectedMapPointRes(data) // 设置当前地图选中的点位资源
          this.changeEditPoint({ page: 'alarmHelp', detail: 'edit' })
          // const mapId = data.point.mapId
          // 判断点位是否在当前地图，不在当前地图则跳转地图
        } else { // 未添加点位
          this.changeEditPoint({ page: '', detail: 'show' }) // 关闭编辑面板
          let {rType} = data
          let oid = null
          if (rType === RESOURCETYPE.alarmColumn) { // 报警柱
            oid = RESICONOID.alarmColumn
          } else if (rType === RESOURCETYPE.alarmBox) { // 报警箱
            oid = RESICONOID.alarmBox
          }
          if (oid) {
            this.queryDefaultfmIconByOid(oid).then(res => {
              let pointIcon = JSON.parse(JSON.stringify(res))
              if (!pointIcon) {
                pointIcon = {oid: oid}
              }
              // 设置默认图标、当前选中资源、以及点位绘制状态
              this.setPointStatus(pointIcon, data)
            })
          }
        }
      })
    },
    mapPatrolSource(node) { // 点击巡更资源树
      if (node.isOrg || node.isroot) { // 点击机构时不进行处理
        return
      }
      this.getfmPatrolResById(node._id).then(res => {
        let data = JSON.parse(JSON.stringify(res))
        data.rType = data.device
        node.type = data.device
        this.setSelectedfmTreeNode(node)
        if (data.point) { // 已添加点位
          this.setSelectedMapPointRes(data) // 设置当前地图选中的点位资源
          this.changeEditPoint({ page: 'patrolEditPage', detail: 'edit' })
          // const mapId = data.point.mapId
          // 判断点位是否在当前地图，不在当前地图则跳转地图
        } else { // 未添加点位
          this.changeEditPoint({ page: '', detail: 'show' }) // 关闭编辑面板
          let oid = RESICONOID.commonPatrol
          this.queryDefaultfmIconByOid(oid).then(res => {
            let pointIcon = JSON.parse(JSON.stringify(res))
            if (!pointIcon) {
              pointIcon = {oid: oid}
            }
            // 设置默认图标、当前选中资源、以及点位绘制状态
            this.setPointStatus(pointIcon, data)
          })
        }
      })
    },
    mapDoorControlSource(node) { // 点击门禁资源树
      if (node.isOrg || node.isroot) { // 点击机构时不进行处理
        return
      }
      this.getDoorfmPointResById(node._id).then(res => {
        let data = JSON.parse(JSON.stringify(res))
        data.rType = data.type
        node.type = data.type
        this.setSelectedfmTreeNode(node)
        if (data.point) { // 已添加点位
          this.setSelectedMapPointRes(data) // 设置当前地图选中的点位资源
          this.changeEditPoint({ page: 'doorControlEditPage', detail: 'edit' })
          // const mapId = data.point.mapId
          // 判断点位是否在当前地图，不在当前地图则跳转地图
        } else { // 未添加点位
          this.changeEditPoint({ page: '', detail: 'show' }) // 关闭编辑面板
          let oid = RESICONOID.doorControl
          this.queryDefaultfmIconByOid(oid).then(res => {
            let pointIcon = JSON.parse(JSON.stringify(res))
            if (!pointIcon) {
              pointIcon = {oid: oid}
            }
            // 设置默认图标、当前选中资源、以及点位绘制状态
            this.setPointStatus(pointIcon, data)
          })
        }
      })
    },
    tabClick(val) {
      let isRefresh = ['video', 'alarm'].includes(this.tabShow) // 判断是否是懒加载树，懒加载树需要刷新
      this.tabShow = val
      this.$nextTick(() => {
        if (isRefresh) { // tab 从非懒加载树切回去 会造成组件自己刷新 故不能再调刷新
          let treebox = this.$refs.treebox
          treebox && treebox.$refs.treeLazy && treebox.$refs.treeLazy.refresh && treebox.$refs.treeLazy.refresh()
        }
      })
      this.SET_POINT_FMDRAW_ACTIVE(false) // 关闭点位绘制
      this.SET_LINE_FMDRAW_ACTIVE(false) // 关闭线绘制
      // this.SET_AREA_DRAW_ACTIVE(false) // 关闭面绘制
      this.changeEditPoint(false)
    }
  },
  mounted() {
    this.resTabClick = this.$lodash.throttle(this.tabClick, 1000)
  },
  beforeDestroy() {
    this.resTabClick = null
  }
}
</script>
<style scoped>
.mapEditTree {
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
}

.mapEditTree .mapEditTreeHome {
  width: 330px;
  display: flex;
  flex: 1;
  flex-direction: column;
}

.mapEditTree .mapEditTreeHome.patrol-area {
  overflow-y:auto;
}

.mapEditTittle {
  width: 100%;
  height: 40px;
}

.mapEditTittle > ul {
  width: 100%;
  line-height: 40px;
  font-size: 14px;
  text-align: center;
  /* background: #1b3153; */
}

.mapEditTittle > ul li {
  width: 45px;
  float: left;
  margin: 0 10px;
  cursor: pointer;
  height: 40px;
  list-style: none;
}

.mapEditTittle > ul li.active {
  border-bottom: 1px solid #4996f9;
}
.mapEditTittle > ul li i {
  font-size: 20px;
}
.mapEditTittle > ul li i.active {
  color: #4996f9;
}
.treeliBox .icon-qiangji1:before {
  font-size: 16px !important;
}
</style>
