
<!--编辑模式 视频、报警、巡更点位的左边树结构页面-->
<template>
  <div class="mapEditTree" v-resize='scrollRefresh'>
    <div class="input" style="width:100%;padding:0 10px;">
      <Input v-model="searchVal" icon="ios-search-strong" placeholder="请输入..." />
    </div>
    <div class="mapEditTittle">
      <ul>
        <li v-if="is3DMapOuter" @click="treeTitleClick( 'layer')" :class="{ 'active': videoShow==='layer' }">图层</li>
        <li v-if="$BShasPower('BS-SETTING-RESOURCE-VIDEO-MANAGE')" @click="treeTitleClick( 'video');searchVal=''" :class="{ 'active': videoShow==='video' }">视频</li>
        <li v-if="$BShasPower('BS-FIRE-ALARMIN')" @click="treeTitleClick('alarm');searchVal=''" :class="{ 'active': videoShow==='alarm' } ">报警</li>
        <li v-if="$BShasPower('BS-SETTING-POINT-MANAGE')" @click="treeTitleClick('alarmhelp');searchVal=''" :class="{ 'active': videoShow==='alarmhelp' } ">报警求助</li>
        <li v-if="$BShasPower('BS-SETTING-POINT-MANAGE')" @click="treeTitleClick('patrol');searchVal=''" :class="{ 'active': videoShow==='patrol' } ">巡更</li>
      </ul>
    </div>
    <div v-if="is3DMapOuter && videoShow==='layer'" class="mapEditTreeHome ">
      <layer-control></layer-control>
    </div>
    <div v-if="$BShasPower('BS-SETTING-RESOURCE-VIDEO-MANAGE') && videoShow==='video'" class="mapEditTreeHome">
      <!-- <bs-scroll ref="scrollBar"> -->
        <!-- <bsr-tree ref='tree' :treeData="videoTreeData[0]||{}" @node-click='nodeClick' @node-dblclick='videoPreview' @on-expand='scrollRefresh' v-show="searchVal===''">
          <template slot-scope="{ node }">
            <span :class="{'item': true, 'add':(node.eid), 'offline': (node.eid && node.status !== 1), 'added': (node.point3D || node.map3D)}" :title="node.name">
              <i class="iconfont" :class="[getNodeIcon(node).class]" :title="getNodeIcon(node).title"></i>
              {{node.name}}
              <span class="right-btn" v-if="(!node.children && ('eid' in node)) && (node.point3D||node.point3d)">
                <i class="iconfont icon-delete" title="删除" @click.stop="deleteVideoPoint(node)"></i>
              </span>
            </span>
          </template>
        </bsr-tree>
        <SearchResList :oid="orgId" ref="SearchResList" v-show="searchVal!==''" type="0" @resClick="nodeClick" mapType="3D" :storeyId="(!is3DMapOuter&&floorData) ? floorData._id : ''"></SearchResList> -->
        <!-- <VTree ref='tree' :activeId='activeNodeId' :searchVal="searchVal" :treeData="videoTreeData" :options="options" @deleteClick="deleteVideoPoint" @node-click='nodeClick' @node-dblclick='videoPreview' @on-expand='scrollRefresh' @loadMore='scrollRefresh'></VTree>
      </bs-scroll> -->
      <BStreeNewBox ref="videotreebox" :iconToggle="false" :searchToggle="false" :searchType="0" :searchVal="searchVal" :equipmentToggle="false" :delIcon="true" :resourceToggle="true" :orgType="0" :resType="[0]" @clickData="nodeClick" mapSpecial="3D" :newField="queryParam" @delData="deleteVideoPoint"></BStreeNewBox>
    </div>
    <div v-if="$BShasPower('BS-FIRE-ALARMIN') &&videoShow==='alarm'" class="mapEditTreeHome ">
      <!-- <bs-scroll ref="scrollBar">
        <VTree ref='tree' :activeId='activeNodeId' :searchVal="searchVal" :treeData="alarmTreeData" :options="options" @deleteClick="deleteAlarmPoint" @node-click='nodeClick' @on-expand='scrollRefresh' @loadMore='scrollRefresh'></VTree>
      </bs-scroll> -->
       <BStreeNewBox ref="alarmtreebox" :iconToggle="false" :searchToggle="false" :searchType="0" :searchVal="searchVal" :equipmentToggle="false" :delIcon="true" :resourceToggle="true" :orgType="0" :resType="[1,9,11]" @clickData="nodeClick" mapSpecial="3D" :newField="queryParam" @delData="deleteAlarmPoint"></BStreeNewBox>
    </div>
    <div v-if="$BShasPower('BS-SETTING-POINT-MANAGE') &&videoShow==='patrol'" class="mapEditTreeHome ">
      <bs-scroll ref="scrollBar">
        <VTree ref='tree' :activeId='activeNodeId' :searchVal="searchVal" :treeData="partrolTreeData" :options="options" @deleteClick="deletePatrolPoint" @node-click='nodeClick' @on-expand='scrollRefresh' @loadMore='scrollRefresh'></VTree>
      </bs-scroll>
    </div>
    <div v-if="$BShasPower('BS-SETTING-POINT-MANAGE') &&videoShow==='alarmhelp'" class="mapEditTreeHome ">
      <bs-scroll ref="scrollBar">
        <VTree ref='tree' :activeId='activeNodeId' :searchVal="searchVal" :treeData="alarmHelpTreeData" :options="options" @deleteClick="deleteAlarmHelpPoint" @node-click='nodeClick' @on-expand='scrollRefresh' @loadMore='scrollRefresh'></VTree>
      </bs-scroll>
    </div>
  </div>
</template>
<script>
import { getNodeIcon } from 'components/BStree/commonMethods.js'
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import VTree from 'components/tree/VTree.vue'
import mapUtil from 'assets/3DMap/mapUtil.js'
import utils from 'assets/3DMap/utils/index.js'
// import SearchResList from 'components/videoMenu/SearchResList'
import LayerControl from './LayerControl'
import layerConfig from 'assets/2DMap/meta/layer'
import videoTrans from 'assets/2DMap/feature/edit/video'
import alarmTrans from 'assets/2DMap/feature/edit/alarm'
import transAlarmHelp from 'assets/2DMap/feature/edit/alarmHelp'
import transPatrol from 'assets/2DMap/feature/edit/patrol'
import BStreeNewBox from 'components/BStreeNew/BStreeNewBox'
import highLight from 'assets/2DMap/feature/edit/highLight'
import spaceUtil from 'assets/2DMap/spaceAnalysisUtil'
export default {
  components: {
    VTree,
    BStreeNewBox,
    LayerControl
  },
  data() {
    return {
      activeNodeId: '',
      searchVal: '',
      options: {
        showSearch: false,
        showOpenPreview: false,
        showOpenAllPreview: false,
        showCollection: false,
        showPoint: '3d'
      },
      videoShow: 'layer',
      treeOptions: {
        showSearch: false,
        showOpenPreview: false,
        showOpenAllPreview: false,
        showCollection: false,
        isMapDate: false,
        showPoint: '3d'
      },
      keyTypes: {},
      queryParam: '&storeyId=1&mapType=3D' // 楼层查询条件
    }
  },
  computed: {
    ...mapState({
      is3DMapOuter: ({ tdIndex }) => tdIndex.is3DMapOuter, // 判断是3d地图还是平面地图
      floorData: ({ tdFloor }) => tdFloor.floorData,
      ready: ({ tdIndex }) => tdIndex.ready, // 判断地图是否加载完毕----
      map3DConfig: ({ tdIndex }) => tdIndex.map3DConfig,
      mapMode: ({ tdIndex }) => tdIndex.mapMode,
      videoTreeData: ({ tdPoint }) => tdPoint.videoTreeData,
      alarmTreeData: ({ tdPoint }) => tdPoint.alarmTreeData,
      partrolTreeData: ({ tdPoint }) => tdPoint.partrolTreeData,
      alarmHelpTreeData: ({ tdPoint }) => tdPoint.alarmHelpTreeData,
      rightPanelType: ({ tdIndex }) => tdIndex.rightPanelType
    }),
    ...mapGetters('map3DApplyIX', ['editVideoPointTag3D', 'editAlarmPointTag3D']),
    orgId() {
      return this.videoTreeData[0] ? this.videoTreeData[0]._id : ''
    }
  },
  watch: {
    // searchVal(value) {
    //   if (this.$BShasPower('BS-SETTING-RESOURCE-VIDEO-MANAGE') && this.videoShow === 'video') {
    //     this.$refs.SearchResList.isSearching = true
    //     this.$refs.SearchResList.searchRes(value)
    //   }
    // },
    map3DConfig(val) {
      this.searchVal = ''
      if (val) {
        this.queryParam = '&storeyId=1&mapType=3D'
      }
    },
    floorData(data) {
      if (this.videoShow === 'video' || this.videoShow === 'alarm') {
        if (this.is3DMapOuter) {
          this.queryParam = '&storeyId=1&mapType=3D'
        } else {
          this.queryParam = '&storeyId=' + data._id + '&mapType=3D'
        }
      }
    },
    is3DMapOuter(flag) {
      this.searchVal = ''
      if (!flag && this.videoShow === 'layer') {
        this.treeTitleClick('video')
      }
      if (flag) {
        this.queryParam = '&storeyId=1&mapType=3D'
      } else {
        this.queryParam = '&storeyId=' + this.floorData._id + '&mapType=3D'
      }
    },
    editVideoPointTag3D() {
      if (this.videoShow === 'video') {
        let treebox = this.$refs.videotreebox
        treebox && treebox.builtInRefreshs()
      }
    },
    editAlarmPointTag3D() {
      if (this.videoShow === 'alarm') {
        let treebox = this.$refs.alarmtreebox
        treebox && treebox.builtInRefreshs()
      }
    }
  },
  methods: {
    ...mapActions([
      'getVedioResourceOrgTree', // 获取视频资源树的方法
      'getAlarmResourceOrgTree', // 获取报警资源树的方法
      'getPatrolOrgTree', // 获取巡更资源树的方法---
      'getSinglePatrolPoint', // 根据id获取单个巡更点位---
      'getAlarmHelpOrgTree', // 获取报警求助树的方法
      'getResourceById', // 根据id获取地图资源的方法
      'setHighLightList', // 根据经纬度定位资源点位
      'setTreeNodeType', // 保存当前单击树节点的类型
      'set3DActiveDraw', // 开启三维绘制工具---
      'set2DActiveDraw', // 开启二维绘制工具-----
      'setVideoPreviewFlag',
      'deletePatrolPointById',
      'deleteResourceById',
      'getResourcePointsByChannelType',
      'setVideoList',
      'setAlarmList',
      'setAlarmHelpList',
      'setPatrolList',
      'setRightPanelShow', // 右侧面板显隐
      'setRightPanelType', // 设置右侧面板的类型
      'setHighLightList', // 设置高亮要素列表
      'set2DActiveEdit', // 控制2D位置编辑
      'queryDefaultIconByOid3D', // 根据机构id获取默认图标信息
      'getOneFloorPatrols',
      'set2DActiveGridDraw'
    ]),
    ...mapMutations('map3DApplyIX', ['EDIT_VIDEO_POINT_TAG_3D', 'EDIT_ALARM_POINT_TAG_3D']),
    nodeClick(node) {
      if (node.children || node.isOrg) {
        this.scrollRefresh()
        return
      }
      let type = node.type
      if (this.rightPanelType === 'alarmEditPanel') {
        // type === mapUtil.CHANNELTYPE.commonAlarmResource || type === mapUtil.CHANNELTYPE.fireAlarmResource || type === mapUtil.CHANNELTYPE.alarmHostResource
        this.set2DActiveGridDraw(false) // 关闭二维绘制绘制
        // this.setRightPanelType('floorForm') // 信息面板显示视频点位信息
        this.setHighLightList([]) // 取消高亮样式
      }
      if (type === mapUtil.CHANNELTYPE.vedioResource) {
        // 视频点位时，判断是否是报警求助
        if (node.eid && node.eid.type) {
          if (
            node.eid.type === mapUtil.CHANNELTYPE.alarmColumnResource ||
            node.eid.type === mapUtil.CHANNELTYPE.alarmBoxResource
          ) {
            type = node.eid.type
          }
        }
      }
      this.setTreeNodeType(type)
      // 判断当前单击的树节点是否为巡更类型----
      if (type && type === mapUtil.CHANNELTYPE.patrol) {
        // 巡更点位编辑页面
        this.getSinglePatrolPoint(node._id)
          .then(res => {
            // console.log('获取到巡更资源数据：', res)
            // 判断该节点是否已经添加点位---
            if (res[this.mapMode] && res[this.mapMode].geo) {
              this.setRightPanelShow(true) // 显示右侧的信息面板
              this.setRightPanelType('patrolEditPanel') // 信息面板显示巡更点位信息
              this.postionToModelbyResult(res)
            } else {
              this.activeDrawDevicePoint(type, res) // 激活设备点位绘制
            }
          })
          .catch(err => {
            console.log(err)
            this.errorMsg('点位资源获取失败')
          })
      } else {
        this.getResourceById(node._id)
          .then(res => {
            // console.log('获取到设备资源数据：', res)
            if (res[this.mapMode]) {
              if (type === mapUtil.CHANNELTYPE.vedioResource) {
                this.setRightPanelShow(true) // 显示右侧的信息面板
                this.setRightPanelType('videoEditPanel') // 信息面板显示视频点位信息
              } else if (type === mapUtil.CHANNELTYPE.commonAlarmResource || type === mapUtil.CHANNELTYPE.fireAlarmResource || type === mapUtil.CHANNELTYPE.alarmHostResource) {
                // 报警点位（普通报警、消防报警、普通报警）
                this.setRightPanelShow(true) // 显示右侧的信息面板
                this.setRightPanelType('alarmEditPanel') // 信息面板显示报警点位信息
              } else if (type === mapUtil.CHANNELTYPE.alarmColumnResource || type === mapUtil.CHANNELTYPE.alarmBoxResource) { // 报警求助点位
                this.setRightPanelShow(true) // 显示右侧的信息面板
                this.setRightPanelType('alarmHelpEditPanel') // 信息面板显示视频点位信息
              }
              this.postionToModelbyResult(res)
            } else {
              this.activeDrawDevicePoint(type, res) // 激活设备点位绘制
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    activeDrawDevicePoint(type, res) { // 激活设备点位绘制
      if (this.is3DMapOuter) { // 楼外地图
        this.set3DActiveDraw(true)
      } else { // 楼层内地图
        let oid = this.getDeviceoOid(type, res) // 获取设备资源的机构id
        if (oid) {
          this.queryDefaultIconByOid3D(oid).then(res => {
            console.log('根据oid查询点位默认图标数据：', res)
            this.set2DActiveDraw(true)
          })
        }
      }
    },
    getDeviceoOid(type, res) { // 获取设备资源的机构id
      let oid = null
      if (type === mapUtil.CHANNELTYPE.vedioResource) { // 视频
        if (res.monitortype === mapUtil.VEDIOTYPEKEY.boltipc) { // 枪机
          oid = mapUtil.MODELOID.boltipc
        } else if (res.monitortype === mapUtil.VEDIOTYPEKEY.boltipc) { // 红外枪机
          oid = mapUtil.MODELOID.redBoltipc
        } else if (res.monitortype === mapUtil.VEDIOTYPEKEY.boltipc) { // 半球
          oid = mapUtil.MODELOID.halfBallipc
        } else if (res.monitortype === mapUtil.VEDIOTYPEKEY.boltipc) { // 快球
          oid = mapUtil.MODELOID.fastBallipc
        } else if (res.monitortype === mapUtil.VEDIOTYPEKEY.boltipc) { // 全景
          oid = mapUtil.MODELOID.allViewipc
        }
      } else if (type === mapUtil.CHANNELTYPE.commonAlarmResource) { // 普通报警
        oid = mapUtil.MODELOID.commonAlarm
      } else if (type === mapUtil.CHANNELTYPE.fireAlarmResource) { // 消防报警
        oid = mapUtil.MODELOID.fireAlarm
      } else if (type === mapUtil.CHANNELTYPE.alarmHostResource) { // 报警主机
        oid = mapUtil.MODELOID.alarmHost
      } else if (type === mapUtil.CHANNELTYPE.alarmBoxResource) { // 报警箱
        oid = mapUtil.MODELOID.alarmBox
      } else if (type === mapUtil.CHANNELTYPE.alarmColumnResource) { // 报警柱
        oid = mapUtil.MODELOID.alarmColumn
      } else if (type === mapUtil.CHANNELTYPE.patrol) { // 巡更
        oid = mapUtil.MODELOID.commonPatrol
      }
      return oid
    },
    // 滚动条刷新高度
    scrollRefresh() {
      if (this.$refs.scrollBar) {
        this.$refs.scrollBar.update()
      }
    },
    postionToModelbyResult(res) {
      let type = res.device || res.type
      let key = ''
      let loc = ''
      let isAlarm = false
      if (type === mapUtil.CHANNELTYPE.patrol) {
        loc = res[this.mapMode].geo
        key = this.keyTypes.patrol
      } else if (type === mapUtil.CHANNELTYPE.vedioResource) {
        loc = res[this.mapMode].loc
        if (res.eid && res.eid.type) {
          if (
            res.eid.type === mapUtil.CHANNELTYPE.alarmColumnResource ||
            res.eid.type === mapUtil.CHANNELTYPE.alarmBoxResource
          ) {
            type = res.eid.type
            key = this.keyTypes.alarmHelp
          } else {
            key = this.keyTypes.vedio
          }
        }
      } else if (
        type === mapUtil.CHANNELTYPE.commonAlarmResource ||
        type === mapUtil.CHANNELTYPE.fireAlarmResource ||
        type === mapUtil.CHANNELTYPE.alarmHostResource
      ) {
        loc = res[this.mapMode].loc
        key = this.keyTypes.alarm
        isAlarm = true
      }
      let _id = res._id
      // 如果节点已经添加点位----------定位该点位----，分为2d点位定位和3d点位定位--
      if (this.is3DMapOuter) {
        // 楼层外 ,3d点位定位的方式
        if (this.ready) {
          let { viewer } = this.$context
          let entity = viewer.entities.getById(_id)
          if (!entity) {
            let eneities = utils.addEntitysToMap(key, [res], this.mapMode, this.$context)
            if (eneities && eneities.length === 1) {
              entity = eneities[0]
            }
          }
          if (entity) { // 存在3D实体对象时
            viewer.selectedEntity = entity // 设置选中
            utils.locateEntityIn3DMap(this.$context, entity) // 3D地图中定位到实体的位置
          }
        }
      } else {
        this.set2DActiveEdit(true) // 激活2D编辑控件
        if (isAlarm && res.mapsign.signtype !== 0) {
          let centerCoordinates = spaceUtil.getMultiLineStringCenter(loc)
          centerCoordinates && this.highLightLocateInMapAlarmCenter(_id, centerCoordinates) // 高亮定位到地图中心
        } else {
          this.highLightLocateInMapCenter(_id, loc) // 高亮定位到地图中心
        }
      }
    },
    highLightLocateInMapAlarmCenter(id, loc) {
      this.$context2D.map && this.$context2D.map.getView().setCenter(loc)
      let feature = highLight.getLocateFeature(id, loc)
      this.setHighLightList([feature])
    },
    highLightLocateInMapCenter(id, loc) { // 高亮定位到地图中心
      let centerCoods = loc && loc.split(',').map(item => Number(item))
      this.$context2D.map && this.$context2D.map.getView().setCenter(centerCoods)
      let feature = highLight.getLocateFeature(id, centerCoods)
      this.setHighLightList([feature])
    },
    tabClick(val) {
      this.searchVal = ''
      let isRefresh = ['video', 'alarm'].includes(this.videoShow) // 判断是否是懒加载树，懒加载树需要刷新
      this.videoShow = val
      this.$nextTick(() => {
        if (isRefresh) { // tab 从非懒加载树切回去 会造成组件自己刷新 故不能再调刷新
          let treebox = this.$refs[this.videoShow + 'treebox']
          treebox && treebox.$refs.treeLazy && treebox.$refs.treeLazy.refresh && treebox.$refs.treeLazy.refresh()
        }
      })
    },
    videoPreview(val) {
      this.getResourceById(val._id).then(res => {
        if (res && res.point3D) {
          if (res.status) {
            let eid = res.eid
            if (eid && (!eid.hasOwnProperty('deviceStatus') || eid.deviceStatus)) { // 设备启用
              this.setVideoPreviewFlag(true)
            } else {
              this.warningMsg('该设备已禁用！')
            }
          } else {
            this.warningMsg('该设备不在线！')
          }
        }
      })
    },
    getNodeIcon(item) {
      return getNodeIcon(item)
    },
    cancel3DMapSelectedEffect() { // 取消3D视地图体选中效果
      this.setRightPanelShow(false) // 隐藏右侧面板
      this.setRightPanelType('') // 清空右侧面板的类型
      this.$context.viewer.selectedEntity = null // 取消三维视图的选中效果
    },
    cancelBuildingMapSelectedEffect() { // 取消楼内地图要素选中效果
      this.set2DActiveEdit(false) // 关闭2D位置绘制
      this.setHighLightList([]) // 取消高亮样式
      this.setRightPanelType('floorForm') // 右侧面板类型设置为楼层信息
    },
    deleteVideoPoint(node) {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除吗?</p>',
        onOk: () => {
          this.deleteVideoPointFun(node)
        }
      })
    },
    deleteVideoPointFun(node) {
      this.deleteResourceById(node._id).then(res => {
        const num = this.editVideoPointTag3D + 1
        this.EDIT_VIDEO_POINT_TAG_3D(num)
        if (this.is3DMapOuter) { // 楼外3D地图
          this.cancel3DMapSelectedEffect() // 取消实体选中效果
          if (this.ready) { // 地图加载完成时
            let type = node.type
            let keyType = this.keyTypes.vedio
            if (type) {
              keyType = this.keyTypes.alarm
            }
            utils.reomoveEntityById(node._id, keyType, this.$context)
          }
          this.getVedioResourceOrgTree({ mapType: '3D' }) // 更新视频资源树
        } else { // 楼内地图
          this.cancelBuildingMapSelectedEffect() // 取消楼内地图要素选中效果
          if (this.floorData._id) {
            this.getVedioResourceOrgTree({ mapType: '3D', floorId: this.floorData._id }) // 根据楼层id更新地图资源树
            this.refreshVideoPointDateByFloor() // 刷新楼层视频点位图层数据源
          }
        }
        this.$Notice.success({ title: '提示', desc: '删除成功！' })
      })
    },
    refreshVideoPointDateByFloor() { // 刷新楼层视频点位图层数据源
      let param = { tab: mapUtil.TABTYPE.video, sid: this.floorData._id, channelTypes: mapUtil.CHANNELTYPE.vedioResource }
      this.getResourcePointsByChannelType(param).then(res => {
        // console.log('楼层ID：', this.floorData._id, '视频点位数据：', res)
        let videos = videoTrans.transIconFeatures(res, layerConfig.video, this.mapMode)
        this.setVideoList(videos)
      })
    },
    deleteAlarmPoint(node) {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除吗?</p>',
        onOk: () => {
          this.deleteAlarmPointFun(node)
        }
      })
    },
    deleteAlarmPointFun(node) {
      this.deleteResourceById(node._id).then(res => {
        const num = this.editAlarmPointTag3D + 1
        this.EDIT_ALARM_POINT_TAG_3D(num)
        if (this.is3DMapOuter) { // 楼外3D地图
          this.cancel3DMapSelectedEffect() // 取消实体选中效果
          if (this.ready) { // 地图加载完成时
            utils.reomoveEntityById(node._id, this.keyTypes.alarm, this.$context)
          }
          this.getAlarmResourceOrgTree({ mapType: '3D' }) // 更新报警资源树
        } else { // 楼内地图
          this.cancelBuildingMapSelectedEffect() // 取消楼内地图要素选中效果
          if (this.floorData._id) {
            this.getAlarmResourceOrgTree({ mapType: '3D', floorId: this.floorData._id }) // 根据楼层id更新地图资源树
            this.refreshAlarmPointDateByFloor() // 刷新楼层报警点位图层数据源
          }
        }
        this.$Notice.success({ title: '提示', desc: '删除成功！' })
      })
    },
    refreshAlarmPointDateByFloor() { // 刷新楼层报警点位图层数据源
      // 资源类型为报警点位（普通报警、消防报警、报警主机报警）
      let channelTypes = mapUtil.CHANNELTYPE.commonAlarmResource + ',' + mapUtil.CHANNELTYPE.fireAlarmResource + ',' + mapUtil.CHANNELTYPE.alarmHostResource
      let param = { sid: this.floorData._id, channelTypes: channelTypes }
      this.getResourcePointsByChannelType(param).then(res => {
        // console.log('楼层ID：', this.floorData._id, '视频点位数据：', res)
        let alarms = alarmTrans.transFeatures(res, layerConfig.commonAlarm, this.mapMode)
        this.setAlarmList(alarms)
      })
    },
    deleteAlarmHelpPoint(node) {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除吗?</p>',
        onOk: () => {
          this.deleteAlarmHelpPointFun(node)
        }
      })
    },
    deleteAlarmHelpPointFun(node) {
      this.deleteResourceById(node._id).then(res => {
        if (this.is3DMapOuter) { // 楼外3D地图
          this.cancel3DMapSelectedEffect() // 取消实体选中效果
          if (this.ready) { // 地图加载完成时
            utils.reomoveEntityById(node._id, this.keyTypes.alarmHelp, this.$context)
          }
          this.getAlarmHelpOrgTree({ mapType: '3D' }) // 更新报警资源树
        } else { // 楼内地图
          this.cancelBuildingMapSelectedEffect() // 取消楼内地图要素选中效果
          if (this.floorData._id) {
            this.getAlarmHelpOrgTree({ mapType: '3D', floorId: this.floorData._id }) // 根据楼层id更新地图资源树
            this.refreshAlarmHelpPointDateByFloor() // 刷新楼层报警求助图层数据源
          }
        }
        this.$Notice.success({ title: '提示', desc: '删除成功！' })
      })
    },
    refreshAlarmHelpPointDateByFloor() { // 刷新楼层报警求助图层数据源
      let param = { tab: mapUtil.TABTYPE.alarmHelp, sid: this.floorData._id, channelTypes: mapUtil.CHANNELTYPE.vedioResource }
      this.getResourcePointsByChannelType(param).then(res => {
        // console.log('楼层ID：', this.floorData._id, '报警求助点位数据：', res)
        let alarms = transAlarmHelp.transFeatures(res, layerConfig.alarmBox, this.mapMode)
        this.setAlarmHelpList(alarms)
      })
    },
    deletePatrolPoint(node) {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除吗?</p>',
        onOk: () => {
          this.deletePatrolPointFun(node)
        }
      })
    },
    deletePatrolPointFun(node) {
      this.deletePatrolPointById(node._id).then(res => {
        if (this.is3DMapOuter) { // 楼外3D地图
          this.cancel3DMapSelectedEffect() // 取消实体选中效果
          if (this.ready) { // 地图加载完成时
            utils.reomoveEntityById(node._id, this.keyTypes.patrol, this.$context)
          }
          this.getPatrolOrgTree({ mapType: '3D' }) // 更新巡更资源树
        } else { // 楼内地图
          this.cancelBuildingMapSelectedEffect() // 取消楼内地图要素选中效果
          if (this.floorData._id) {
            this.getPatrolOrgTree({ mapType: '3D', floorId: this.floorData._id }) // 根据楼层id更新地图资源树
            this.refreshPatrolPointDataByFloor() // 刷新楼层巡更点位图层数据源
          }
        }
        this.$Notice.success({ title: '提示', desc: '删除成功！' })
      })
    },
    refreshPatrolPointDataByFloor() { // 刷新楼层巡更点位图层数据源
      this.getOneFloorPatrols(this.floorData._id).then(patrolDatas => {
        let patrols = transPatrol.transFeatures(patrolDatas, layerConfig.patrol, this.mapMode)
        this.setPatrolList(patrols)
      }).catch(err => {
        console.log('加载楼层：', this.floorData._id, '巡更点失败：', err)
      })
    }
  },
  mounted() {
    this.keyTypes = mapUtil.getKeyType()
    this.getVedioResourceOrgTree({ mapType: '3D' })
      .then(res => {
        console.log('地图视频点位资源树数据：', res)
      })
      .catch(err => {
        console.log(err)
      })
    this.getAlarmResourceOrgTree({ mapType: '3D' })
      .then(res => {})
      .catch(err => {
        console.log(err)
      })
    this.getPatrolOrgTree({ mapType: '3D' })
      .then(res => {})
      .catch(err => {
        console.log(err)
      })
    this.getAlarmHelpOrgTree({ mapType: '3D' })
      .then(res => {})
      .catch(err => {
        console.log(err)
      })
    this.treeTitleClick = this.$lodash.throttle(this.tabClick, 1000)
  },
  beforeDestroy() {
    this.treeTitleClick = null
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
  height: 100%;
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
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
  width: 56px;
  float: left;
  margin: 0 5px;
  cursor: pointer;
  height: 40px;
  list-style: none;
}

.mapEditTittle > ul li.active {
  border-bottom: 1px solid #4996f9;
}
.add {
  color: #4996f9 !important;
  opacity: 0.5;
}
.added {
  color: #4996f9 !important;
  opacity: 1;
}
</style>
