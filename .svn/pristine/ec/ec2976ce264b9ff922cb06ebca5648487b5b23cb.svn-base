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
      <!-- <VTree ref='tree' :activeId='activeNodeId' :searchVal="searchVal" :treeData="mapSourceList" :options="options" @deleteClick='deleteClick' @node-click='mapViseoSource' @node-dblclick='videoPreview'></VTree> -->
      <BStreeNewBox ref="treebox" :iconToggle="false" :searchToggle="false" :searchType="0" :searchVal="searchVal" :equipmentToggle="false" :resourceToggle="true" :orgType="0" :resType="[0]"  @clickData="mapViseoSource" mapSpecial="2D" :newField="queryParam" :delIcon="true" @delData="deleteClick" @dbclickData="videoPreview"></BStreeNewBox>
    </div>
    <div id="alarm" v-if="$BShasPower('BS-FIRE-ALARMIN') && tabShow==='alarm'" class="mapEditTreeHome ">
      <!-- <VTree ref='tree' :activeId='activeNodeId' :searchVal="searchVal" :treeData="mapAlarmList" @deleteClick='deleteClick' :options="options" @node-click='mapAlarmSource'></VTree> -->
      <BStreeNewBox ref="treebox" :iconToggle="false" :searchToggle="false" :searchType="0" :searchVal="searchVal" :equipmentToggle="false" :resourceToggle="true" :orgType="0" :resType="[1,9,11]"  @clickData="mapAlarmSource" mapSpecial="2D" :newField="queryParam" :delIcon="true" @delData="deleteClick"></BStreeNewBox>
    </div>
    <div v-if="$BShasPower('BS-FIRE-ALARMIN') && tabShow==='alarmHelp'" class="mapEditTreeHome patrol-area">
      <VTree ref='tree' :activeId='activeNodeId' :searchVal="searchVal" :treeData="alarmHelpTreeData" @deleteClick='deleteClick' :options="options" @node-click='mapAlarmHelpSource'></VTree>
    </div>
    <div v-if="$BShasPower('BS-SETTING-POINT-MANAGE') && tabShow==='patrol'" class="mapEditTreeHome patrol-area">
      <VTree ref='tree' :activeId='activeNodeId' :searchVal="searchVal" :treeData="partrolData" @deleteClick='deletePatrolPoint' :options="options" @node-click='mapPatrolSource'></VTree>
    </div>
    <div v-if="$BShasPower('BS-SETTING-POINT-MANAGE') && tabShow==='doorControl'" class="mapEditTreeHome patrol-area">
      <VTree ref='tree' :activeId='activeNodeId' :searchVal="searchVal" :treeData="doorControlTreeData" :options="options" @deleteClick='deleteDoorControlPoint' @node-click='mapDoorControlSource'></VTree>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex'
import { RESOURCETYPE, VIDEOTYPEKEY, RESICONOID, MAPMODE, CAMERATYPE } from 'assets/2DMap/meta/common'
import VTree from '../../../components/tree/VTree.vue'
import BStreeNewBox from 'components/BStreeNew/BStreeNewBox'
// import SearchResList from '../../../components/videoMenu/SearchResList'
export default {
  components: {
    VTree,
    BStreeNewBox
    // SearchResList
  },
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
      mapSourceList: ({ mapPoint }) => mapPoint.mapSourceList, // 资源树
      alarmHelpTreeData: ({ mapPoint }) => mapPoint.alarmHelpTreeData, // 报警求助资源树
      mapAlarmList: ({ mapPoint }) => mapPoint.mapAlarmList, // 报警资源树
      partrolData: ({ mapPoint }) => mapPoint.partrolData, // 巡更点位
      doorControlTreeData: ({ mapPoint }) => mapPoint.doorControlTreeData, // 门禁资源树数据
      levelData: ({ mapArea }) => mapArea.currentFloor,
      isOuter: ({ mapIndex }) => mapIndex.isMapOuter, // 楼层内还是楼层外
      activeMap: ({ mapIndex }) => mapIndex.activeMapConfig.mapId, // 当前地图id
      mapConfigArr: ({ mapIndex }) => mapIndex.mapConfigArr, // 当前配置列表
      editVedioIpcList: ({ mapGisData }) => mapGisData.editVedioIpcList, // 编辑模式视频点位数组
      editVedioSectorList: ({ mapGisData }) => mapGisData.editVedioSectorList, // 编辑模式视频点位可视域数组
      editCurrentVedioFeature: ({ mapGisData }) => mapGisData.editCurrentVedioFeature, // 当前编辑的视频对象数组
      editVedioSectorInMapList: ({ mapGisData }) => mapGisData.editVedioSectorInMapList,
      editCheckList: ({ mapVedioData }) => mapVedioData.editCheckList,
      editPatrolList: ({ patrolData }) => patrolData.editPatrolList,
      editAlarmList: ({ mapAlarmData }) => mapAlarmData.editAlarmList
    }),
    ...mapGetters('map2DEditIX', ['editTreeChangeCounter']),
    orgId() {
      return this.mapSourceList[0] ? this.mapSourceList[0]._id : ''
    }
  },
  watch: {
    activeMap(val) {
      this.searchVal = ''
      if (val) {
        this.queryParam = '&storeyId=1&mapType=2D'
        this.getPatrolPointTree()
        this.getDoorControlTree()
        this.get2DAlarmHelpOrgTree({ mapType: MAPMODE.mode2D })
      }
    },
    searchVal(value) {
      // if (this.$BShasPower('BS-SETTING-RESOURCE-VIDEO-MANAGE') && this.tabShow === 'video') {
      //   this.$refs.SearchResList.isSearching = true
      //   this.$refs.SearchResList.searchRes(value)
      // }
    },
    levelData(data) {
      this.searchVal = ''
      if (this.isOuter) {
        this.queryParam = '&storeyId=1&mapType=2D'
        this.getPatrolPointTree()
        this.getDoorControlTree()
        this.get2DAlarmHelpOrgTree({ mapType: MAPMODE.mode2D })
      } else {
        this.queryParam = '&storeyId=' + data._id + '&mapType=2D'
        this.getPatrolPointTree(data._id)
        this.getDoorControlTree(data._id)
        this.get2DAlarmHelpOrgTree({ mapType: MAPMODE.mode2D, floorId: data._id })
      }
    },
    editTreeChangeCounter: { // 编辑树计数器变化
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
    isOuter(flag) {
      this.searchVal = ''
      if (flag) {
        this.queryParam = '&storeyId=1&mapType=2D'
      }
    }
  },
  methods: {
    ...mapActions('map2DEditIX', ['changeEditTreeChangeCounter']),
    ...mapActions([
      'getPatrolPointTree',
      'getDoorControlTree', // 获取2d门禁资源树方法
      'delOnePointApi',
      'loadVideosByMapId',
      'loadCommonAlarmsByMapId',
      'loadFireAlarmsByMapId',
      'loadAlarmHostsByMapId',
      'loadVideosByFloorId',
      'loadResourceByFloorId',
      'get2DAlarmHelpOrgTree',
      'getCommonPointResById', // 根据id获取点位资源
      'getPatrolPointResById', // 根据id获取巡更点位资源
      'loadPatrolsByMapId',
      'loadPatrolByFloorId',
      'queryDefaultIconByOid', // 根据oid查询点位默认图标
      'deletePatrolPointRes', // 删除巡更点位资源数据
      'setActiveMapConfig', // 设置当前地图配置
      'queryAlarmHelpRes', // 查询报警求助资源数据
      'updatePointVideoList',
      'loadSubVideosByMapId',
      'loadSubVideosByFloorId',
      'deleteDoorControlPointRes', // 删除门禁资源点位
      'loadDoorControlByMapId', // 根据地图标识加载门禁数据
      'loadDoorControlByFloorId', // 根据楼层标识加载门禁数据
      'getDoorControlPointResById', // 获取门禁点位资源数据
      'setSelectedTreeNode' // 设置选中的树节点
    ]),
    ...mapMutations([
      'SET_FEATURE_EDIT_ACTIVE', // 设置要素编辑状态
      'SET_POINT_DRAW_ACTIVE', // 设置点位绘制激活状态
      'SET_LINE_DRAW_ACTIVE', // 设置线绘制激活状态
      'SET_AREA_DRAW_ACTIVE', // 设置面位绘制激活状态
      'SET_SELECTED_MAP_POINT_RES', // 设置地图选中的点位资源
      'SET_EDIT_RIGHT_PAGE_STATE', // 设置右侧编辑页面
      'SET_DEFAULT_POINT_ICON' // 默认点位图标文件
    ]),
    videoPreview(node) { // 视频预览
      if (node.isOrg) { // 点击机构时不进行处理
        return
      }
      this.getCommonPointResById(node._id).then(res => {
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
    // 获取地图点位资源
    getMapResource(type, monitortype, monitoryPointGenera) {
      if (type === RESOURCETYPE.video) { // 视频
        let counter = {optTab: 'video', count: this.editTreeChangeCounter.count + 1}
        this.changeEditTreeChangeCounter(counter)
        if (this.isOuter) {
          this.loadSubVideosByMapId({monitortype, mapId: this.activeMap, monitoryPointGenera})
        } else {
          this.loadSubVideosByFloorId({monitortype, floorId: this.levelData._id, monitoryPointGenera})
        }
      } else if (type === RESOURCETYPE.commonAlarm) { // 普通报警
        let counter = {optTab: 'alarm', count: this.editTreeChangeCounter.count + 1}
        this.changeEditTreeChangeCounter(counter)
        if (this.isOuter) {
          this.loadCommonAlarmsByMapId(this.activeMap)
        } else {
          this.loadResourceByFloorId({ floorId: this.levelData._id, channelTypes: RESOURCETYPE.commonAlarm })
        }
      } else if (type === RESOURCETYPE.alarmHost) { // 报警主机报警
        let counter = {optTab: 'alarm', count: this.editTreeChangeCounter.count + 1}
        this.changeEditTreeChangeCounter(counter)
        if (this.isOuter) {
          this.loadAlarmHostsByMapId(this.activeMap)
        } else {
          this.loadResourceByFloorId({ floorId: this.levelData._id, channelTypes: RESOURCETYPE.alarmHost })
        }
      } else if (type === RESOURCETYPE.fireAlarm) { // 消防报警
        let counter = {optTab: 'alarm', count: this.editTreeChangeCounter.count + 1}
        this.changeEditTreeChangeCounter(counter)
        if (this.isOuter) {
          this.loadFireAlarmsByMapId(this.activeMap)
        } else {
          this.loadResourceByFloorId({ floorId: this.levelData._id, channelTypes: RESOURCETYPE.fireAlarm })
        }
      } else if (type === RESOURCETYPE.alarmColumn || type === RESOURCETYPE.alarmBox) { // 报警柱或报警箱
        this.loadAlarmHelpResources(type)
        if (this.isOuter) {
          this.get2DAlarmHelpOrgTree({ mapType: MAPMODE.mode2D })
        } else {
          this.get2DAlarmHelpOrgTree({ mapType: MAPMODE.mode2D, floorId: this.levelData._id })
        }
      } else if (type === RESOURCETYPE.patrol) { // 巡更
        if (this.isOuter) {
          this.getPatrolPointTree()
          this.loadPatrolsByMapId(this.activeMap)
        } else {
          this.getPatrolPointTree(this.levelData._id)
          this.loadPatrolByFloorId(this.levelData._id)
        }
      } else if (type === RESOURCETYPE.doorControl) { // 门禁
        if (this.isOuter) {
          this.getDoorControlTree()
          this.loadDoorControlByMapId(this.activeMap)
        } else {
          this.getDoorControlTree(this.levelData._id)
          this.loadDoorControlByFloorId(this.levelData._id)
        }
      }
    },
    loadAlarmHelpResources(type) { // 加载报警求助点位资源
      let query = {alarm: type}
      if (this.isOuter) {
        query.mapId = this.activeMap
      } else { // 楼层地图，根据楼层标识加载
        query.sId = this.levelData._id
      }
      this.queryAlarmHelpRes(query)
    },
    deleteClick(node) {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除吗?</p>',
        onOk: () => {
          let {_id, type, eid, monitortype, monitoryPointGenera} = node
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
          this.delOnePointApi(_id)
            .then(res => {
              this.successMsg(resLabel + '点位删除成功')
              this.SET_FEATURE_EDIT_ACTIVE(false) // 关闭编辑视频点位的控件
              this.SET_EDIT_RIGHT_PAGE_STATE({ page: '', detail: 'show' })
              monitoryPointGenera = (typeof monitoryPointGenera === 'undefined') ? CAMERATYPE.normalipc : monitoryPointGenera
              this.getMapResource(type, monitortype, monitoryPointGenera) // 获取地图点位资源
            })
            .catch(err => {
              console.log(err)
              this.errorMsg(resLabel + '点位删除失败')
            })
        }
      })
    },
    deletePatrolPoint(node) { // 删除巡更报警资源
      console.log('删除巡更资源节点信息: ', node)
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除吗?</p>',
        onOk: () => {
          let {_id, type} = node
          this.deletePatrolPointRes(_id).then(res => {
            this.successMsg('巡更点位删除成功')
            this.SET_FEATURE_EDIT_ACTIVE(false) // 关闭编辑视频点位的控件
            this.SET_EDIT_RIGHT_PAGE_STATE({ page: '', detail: 'show' })
            this.getMapResource(type) // 获取地图点位资源
          }).catch(err => {
            console.log(err)
            this.errorMsg('巡更点位删除失败')
          })
        }
      })
    },
    deleteDoorControlPoint(node) { // 删除门禁资源
      console.log('删除门禁资源节点信息: ', node)
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除吗?</p>',
        onOk: () => {
          let {_id, type} = node
          this.deleteDoorControlPointRes(_id).then(res => {
            this.successMsg('门禁点位删除成功')
            this.SET_FEATURE_EDIT_ACTIVE(false) // 关闭编辑控件
            this.SET_EDIT_RIGHT_PAGE_STATE({ page: '', detail: 'show' })
            this.getMapResource(type) // 获取地图点位资源
          }).catch(err => {
            console.log(err)
            this.errorMsg('门禁点位删除失败')
          })
        }
      })
    },
    mapViseoSource(node) { // 视频资源树点击处理
      // console.log('点击视频节点数据：', node)
      if (node.isOrg || node.isroot) { // 点击机构时不进行处理
        return
      }
      this.getCommonPointResById(node._id).then(res => {
        let data = JSON.parse(JSON.stringify(res))
        data.rType = data.type
        this.setSelectedTreeNode(node)
        // console.log('获取到的视频资源数据：', data)
        if (data.point) { // 已添加点位
          let editPage = { page: 'videoPage', detail: 'edit' }
          this.SET_SELECTED_MAP_POINT_RES(data) // 设置当前地图选中的点位资源
          this.SET_EDIT_RIGHT_PAGE_STATE(editPage)
          this.SET_FEATURE_EDIT_ACTIVE(true) // 开启编辑点位位置的控件
          const mapId = data.point.mapId
          if (mapId && mapId !== this.activeMap) { // 不在当前地图时
            for (const config of this.mapConfigArr) {
              if (mapId === config.mapId) {
                this.setActiveMapConfig(config) // 设置当前地图配置
                break
              }
            }
          }
        } else {
          let editPage = { page: '', detail: 'show' }
          this.SET_EDIT_RIGHT_PAGE_STATE(editPage) // 关闭编辑面板
          let { monitortype, monitoryPointGenera } = data
          monitoryPointGenera = (typeof monitoryPointGenera === 'undefined') ? CAMERATYPE.normalipc : monitoryPointGenera
          let oid = null // 资源标识
          if (monitoryPointGenera === CAMERATYPE.normalipc) { // 普通ipc
            if (monitortype === VIDEOTYPEKEY.boltipc) {
              oid = RESICONOID.boltipc
            } else if (monitortype === VIDEOTYPEKEY.redBoltipc) {
              oid = RESICONOID.redBoltipc
            } else if (monitortype === VIDEOTYPEKEY.halfBallipc) {
              oid = RESICONOID.halfBallipc
            } else if (monitortype === VIDEOTYPEKEY.fastBallipc) {
              oid = RESICONOID.fastBallipc
            } else if (monitortype === VIDEOTYPEKEY.allViewipc) {
              oid = RESICONOID.allViewipc
            }
          } else if (monitoryPointGenera === CAMERATYPE.verfaceipc) { // 人脸抓拍
            oid = RESICONOID.verfaceipc
          } else if (monitoryPointGenera === CAMERATYPE.trafficipc) { // 交通抓拍
            oid = RESICONOID.trafficipc
          }
          if (oid) {
            this.queryDefaultIconByOid(oid).then(res => {
              // console.log('根据oid查询点位默认图标数据：', res)
              let pointIcon = JSON.parse(JSON.stringify(res))
              if (!pointIcon) {
                pointIcon = {oid: oid}
              }
              this.SET_DEFAULT_POINT_ICON(pointIcon) // 设置默认点位图标文件
              this.SET_SELECTED_MAP_POINT_RES(data) // 设置当前地图选中的点位资源
              this.SET_POINT_DRAW_ACTIVE(true) // 激活点位绘制状态
            })
          }
        }
      })
    },
    mapAlarmSource(node) { // 报警资源树点击处理
      // console.log('点击报警节点数据：', node)
      if (node.isOrg || node.isroot) { // 点击机构时不进行处理
        return
      }
      this.getCommonPointResById(node._id).then(res => {
        let data = JSON.parse(JSON.stringify(res))
        data.rType = data.type
        this.setSelectedTreeNode(node)
        // console.log('获取到的报警资源数据：', data)
        if (data.point) { // 已添加点位
          let editPage = { page: 'alarmPage', detail: 'edit' }
          this.SET_SELECTED_MAP_POINT_RES(data) // 设置当前地图选中的点位资源
          this.SET_EDIT_RIGHT_PAGE_STATE(editPage) // 设置地图右侧编辑页面
          this.SET_FEATURE_EDIT_ACTIVE(true) // 开启编辑点位位置的控件
          const mapId = data.point.mapId
          if (mapId && mapId !== this.activeMap) { // 不在当前地图时
            for (const config of this.mapConfigArr) {
              if (mapId === config.mapId) {
                this.setActiveMapConfig(config) // 设置当前地图配置
                break
              }
            }
          }
        } else { // 未添加点位
          let editPage = { page: '', detail: 'show' }
          this.SET_EDIT_RIGHT_PAGE_STATE(editPage) // 关闭编辑面板
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
            this.queryDefaultIconByOid(oid).then(res => {
              // console.log('根据oid查询点位默认图标数据：', res)
              let pointIcon = JSON.parse(JSON.stringify(res))
              if (!pointIcon) {
                pointIcon = {oid: oid}
              }
              this.SET_DEFAULT_POINT_ICON(pointIcon) // 设置默认点位图标文件
              this.SET_SELECTED_MAP_POINT_RES(data) // 设置当前地图选中的点位资源
              this.SET_POINT_DRAW_ACTIVE(true) // 激活点位绘制状态
            })
          }
        }
      })
    },
    mapAlarmHelpSource(node) { // 报警求助资源树点击处理
      // console.log('报警求助资源节点：', node)
      if (node.isOrg || node.isroot) { // 点击机构时不进行处理
        return
      }
      this.getCommonPointResById(node._id).then(res => {
        let data = JSON.parse(JSON.stringify(res))
        let eid = data.eid
        if (eid && eid.type) {
          data.rType = eid.type
          node.type = eid.type
        }
        this.setSelectedTreeNode(node)
        // console.log('获取到的报警求助资源数据：', data)
        if (data.point) { // 已添加点位
          let editPage = { page: 'alarmHelp', detail: 'edit' }
          this.SET_SELECTED_MAP_POINT_RES(data) // 设置当前地图选中的点位资源
          this.SET_EDIT_RIGHT_PAGE_STATE(editPage) // 设置地图右侧编辑页面
          this.SET_FEATURE_EDIT_ACTIVE(true) // 开启编辑点位位置的控件
          const mapId = data.point.mapId
          if (mapId && mapId !== this.activeMap) { // 不在当前地图时
            for (const config of this.mapConfigArr) {
              if (mapId === config.mapId) {
                this.setActiveMapConfig(config) // 设置当前地图配置
                break
              }
            }
          }
        } else { // 未添加点位
          let editPage = { page: '', detail: 'show' }
          this.SET_EDIT_RIGHT_PAGE_STATE(editPage) // 关闭编辑面板
          let {rType} = data
          let oid = null
          if (rType === RESOURCETYPE.alarmColumn) { // 报警柱
            oid = RESICONOID.alarmColumn
          } else if (rType === RESOURCETYPE.alarmBox) { // 报警箱
            oid = RESICONOID.alarmBox
          }
          if (oid) {
            this.queryDefaultIconByOid(oid).then(res => {
              // console.log('根据oid查询点位默认图标数据：', res)
              let pointIcon = JSON.parse(JSON.stringify(res))
              if (!pointIcon) {
                pointIcon = {oid: oid}
              }
              this.SET_DEFAULT_POINT_ICON(pointIcon) // 设置默认点位图标文件
              this.SET_SELECTED_MAP_POINT_RES(data) // 设置当前地图选中的点位资源
              this.SET_POINT_DRAW_ACTIVE(true) // 激活点位绘制状态
            })
          }
        }
      })
    },
    mapPatrolSource(node) { // 巡更资源树点击处理
      // console.log('点击的巡更节点数据：', node)
      if (node.isOrg || node.isroot) { // 点击机构时不进行处理
        return
      }
      this.getPatrolPointResById(node._id).then(res => {
        let data = JSON.parse(JSON.stringify(res))
        data.rType = data.device
        node.type = data.device
        this.setSelectedTreeNode(node)
        // console.log('获取到的巡更资源数据：', data)
        if (data.point) { // 已添加点位
          let editPage = { page: 'patrolEditPage', detail: 'edit' }
          this.SET_SELECTED_MAP_POINT_RES(data) // 设置当前地图选中的点位资源
          this.SET_EDIT_RIGHT_PAGE_STATE(editPage) // 设置地图右侧编辑页面
          this.SET_FEATURE_EDIT_ACTIVE(true) // 开启编辑点位位置的控件
          const mapId = data.point.mapid
          if (mapId && mapId !== this.activeMap) { // 不在当前地图时
            for (const config of this.mapConfigArr) {
              if (mapId === config.mapId) {
                this.setActiveMapConfig(config) // 设置当前地图配置
                break
              }
            }
          }
        } else { // 未添加点位
          let editPage = { page: '', detail: 'show' }
          this.SET_EDIT_RIGHT_PAGE_STATE(editPage) // 关闭编辑面板
          let oid = RESICONOID.commonPatrol
          this.queryDefaultIconByOid(oid).then(res => {
            // console.log('根据oid查询点位默认图标数据：', res)
            let pointIcon = JSON.parse(JSON.stringify(res))
            if (!pointIcon) {
              pointIcon = {oid: oid}
            }
            this.SET_DEFAULT_POINT_ICON(pointIcon) // 设置默认点位图标文件
            this.SET_SELECTED_MAP_POINT_RES(data) // 设置当前地图选中的点位资源
            this.SET_POINT_DRAW_ACTIVE(true) // 激活点位绘制状态
          })
        }
      })
    },
    mapDoorControlSource(node) { // 点击门禁资源处理方法
      // console.log('点击的门禁节点数据：', node)
      if (node.isOrg || node.isroot) { // 点击机构时不进行处理
        return
      }
      this.getDoorControlPointResById(node._id).then(res => {
        // console.log('获取到的门禁资源数据：', data)
        let data = JSON.parse(JSON.stringify(res))
        data.rType = data.type
        node.type = data.type
        this.setSelectedTreeNode(node)
        if (data.point) { // 已添加点位
          this.SET_SELECTED_MAP_POINT_RES(data) // 设置当前地图选中的点位资源
          let editPage = { page: 'doorControlEditPage', detail: 'edit' }
          this.SET_EDIT_RIGHT_PAGE_STATE(editPage) // 设置地图右侧编辑页面
          this.SET_FEATURE_EDIT_ACTIVE(true) // 开启编辑点位位置的控件
          const mapId = data.point.mapId
          if (mapId && mapId !== this.activeMap) { // 不在当前地图时
            for (const config of this.mapConfigArr) {
              if (mapId === config.mapId) {
                this.setActiveMapConfig(config) // 设置当前地图配置
                break
              }
            }
          }
        } else { // 未添加点位
          this.SET_EDIT_RIGHT_PAGE_STATE({ page: '', detail: 'show' }) // 关闭编辑面板
          let oid = RESICONOID.doorControl
          this.queryDefaultIconByOid(oid).then(res => {
            // console.log('根据oid查询点位默认图标数据：', res)
            let pointIcon = JSON.parse(JSON.stringify(res))
            if (!pointIcon) {
              pointIcon = {oid: oid}
            }
            this.SET_DEFAULT_POINT_ICON(pointIcon) // 设置默认点位图标文件
            this.SET_SELECTED_MAP_POINT_RES(data) // 设置当前地图选中的点位资源
            this.SET_POINT_DRAW_ACTIVE(true) // 激活点位绘制状态
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
      this.SET_POINT_DRAW_ACTIVE(false) // 关闭点位绘制
      this.SET_LINE_DRAW_ACTIVE(false) // 关闭线绘制
      this.SET_AREA_DRAW_ACTIVE(false) // 关闭面绘制
      this.SET_FEATURE_EDIT_ACTIVE(false) // 关闭编辑视频点位的控件
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
