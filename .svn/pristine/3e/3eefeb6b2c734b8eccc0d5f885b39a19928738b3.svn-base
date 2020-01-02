<template>
  <div class="panel-search">
    <div class="search">
      <input v-model="searchTree" @focus="isExpand = true" @input="activeTab = 'structure'" type="text" class="input" placeholder="请输入..." />
      <button class="btn" @click="isExpand = !isExpand">
        <Icon :type="isExpand ? 'arrow-up-b' : 'arrow-down-b'"></Icon>
      </button>
    </div>
    <div class="tab" :class="{'hidden': !isExpand}">
      <ul class="tab-list">
        <li :class="{'active': activeTab === 'structure'}" @click="activeTab = 'structure'">地图结构</li>
        <li :class="{'active': activeTab === 'point'}" @click="activeTab = 'point'">点位元素</li>
        <li :class="{'active': activeTab === 'filter'}" @click="activeTab = 'filter'">报警过滤</li>
      </ul>
      <section class="content">
        <div v-show="activeTab === 'structure'" class="map-structure">
          <bs-scroll ref="mapTreeScroll" class="mapTree">
            <Tree-Search :treeData="mapOrgTree[0]||{}" ref="tree" :searchVal="searchTree"  @node-click='handleNode' isSearch @on-expand="$refs.mapTreeScroll.update()">
              <template slot-scope="{ node }">
                <span class="item" :title="node.name" :class="{iconIsOuter: (node.point3D || node.point3d)}">
                  <i class=" iconfont" :class="node.type ? iconList[node.type].icon:iconList.default.icon" :title="node.type ? iconList[node.type].title:iconList.default.title"></i>
                  {{node.name}}</span>
              </template>
            </Tree-Search>
          </bs-scroll>
        </div>
        <ul v-show="activeTab === 'point'" class="point-control">
          <li class="line">
            <div class="item title-icon">
              <i class="iconfont icon-baojing2"></i>
            </div>
            <div class="item">
              <i-switch :value="isRecAlarm" @on-change="switchAlarm"></i-switch>
            </div>
            <!-- <div class="item title-icon">
              <i class="iconfont icon-yingjizhihui"></i>
            </div> -->
            <!-- <div class="item">
              <i-switch :value="isEmergency" @on-change="switchEmergency"></i-switch>
            </div> -->
          </li>
          <li class="line">
            <div class="item title-icon">
              <i class="iconfont icon-video-gun1"></i>
            </div>
            <div class="item">
              <Checkbox :value="isCameraSpear" @on-change="cameraSpearSelect">枪机</Checkbox>
            </div>
            <div class="item">
              <Checkbox :value="isHalfBall" @on-change="halfBallSelect">半球</Checkbox>
            </div>
            <div class="item">
              <Checkbox :value="isFastBall" @on-change="fastBallSelect">快球</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :value="isFullShot" @on-change="fullShotSelect">全景</Checkbox>
            </div>
            <div class="item">
              <Checkbox :value="isInfrared" @on-change="infraredSelect">红外枪机</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
              <i class="iconfont icon-baojing2"></i>
            </div>
            <div class="item">
              <Checkbox :value="isOnlyAlarm" @on-change="changeAlarmPointShowMode">仅报警时显示</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :value="isAlarm" :disabled="isOnlyAlarm" @on-change="commonAlarmSelect">普通报警</Checkbox>
            </div>
            <div class="item">
              <Checkbox :value="isFire" :disabled="isOnlyAlarm" @on-change="fireAlarmSelect">消防报警</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :value="isAlarmBox" :disabled="isOnlyAlarm" @on-change="alarmBoxSelect">报警箱</Checkbox>
            </div>
            <div class="item">
              <Checkbox :value="isAlarmPillar" :disabled="isOnlyAlarm" @on-change="alarmColumnSelect">报警柱</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
              <i class="iconfont icon-danbinbaojing"></i>
            </div>
            <div class="item">
              <Checkbox :value="isKeepWatch" @on-change="patrolSelect">巡更点位</Checkbox>
            </div>
          </li>
          <li class="line" v-if="is3DMapOuter">
            <div class="item title-icon">
              <i class="iconfont icon-yidongdanbing"></i>
            </div>
            <div class="item">
              <Checkbox :value="isSinglePawn" @on-change="singleSelect">移动单兵</Checkbox>
            </div>
            <div class="item">
              <Checkbox :value="isSingleHead" @on-change="singleHeadSelect">单兵头像</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
              <i class="iconfont icon-biaoqian"></i>
            </div>
            <div class="item">
              <Checkbox :value="isShowName" @on-change="labelSelect">名称标签</Checkbox>
            </div>
          </li>
          <li class="line" v-if="!is3DMapOuter">
            <div class="item title-icon">
              <i class="iconfont icon-grid"></i>
            </div>
            <div class="item">
              <Checkbox :value="isShowGrid" @on-change="gridSelect">网格</Checkbox>
            </div>
          </li>
        </ul>
        <ul v-show="activeTab === 'filter'" class="point-control">
          <li class="line">
           <div class="item">
              <Checkbox :value="filterState.isCommonAlarm.checked" @on-change="changeAlarmFilterState(['isCommonAlarm'])">普通报警</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledCom" :value="filterState.isCommonAlarm.alarmInput" @on-change="changeAlarmFilterState(['isCommonAlarm', 'alarmInput'])">报警输入</Checkbox>
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber class="numberInput" size="small" :disabled="disabledCom" :max="9" :min="1" :value="filterLevel.alarmInputLevel" v-model="alarmInputLevel"  @on-change="changeAlarmFilterLeavel(['alarmInputLevel', alarmInputLevel])"></InputNumber>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledCom" :value="filterState.isCommonAlarm.alarmSector" @on-change="changeAlarmFilterState(['isCommonAlarm', 'alarmSector'])">报警防区</Checkbox>
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber class="numberInput" size="small" :disabled="disabledCom" :max="9" :min="1" :value="filterLevel.alarmSectorLevel" v-model="alarmSectorLevel" @on-change="changeAlarmFilterLeavel(['alarmSectorLevel', alarmSectorLevel])"></InputNumber>
            </div>
          </li>
          <li class="line">
           <div class="item">
              <Checkbox :value="filterState.isAlarmVideo.checked" @on-change="changeAlarmFilterState(['isAlarmVideo'])">视频报警</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledVid" :value="filterState.isAlarmVideo.alarmPoint" @on-change="changeAlarmFilterState(['isAlarmVideo', 'alarmPoint'])">监控点报警</Checkbox>
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber :disabled="disabledVid"  class="numberInput" size="small" :max="9" :min="1" :value="filterLevel.cameraSpearLevel" v-model="cameraSpearLevel" @on-change="changeAlarmFilterLeavel(['cameraSpearLevel', cameraSpearLevel])"></InputNumber>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledVid" :value="filterState.isAlarmVideo.focusOn" @on-change="changeAlarmFilterState(['isAlarmVideo', 'focusOn'])">重点关注</Checkbox>
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber :disabled="disabledVid"  class="numberInput" size="small" :max="9" :min="1" :value="filterLevel.focusOnLevel" v-model="focusOnLevel" @on-change="changeAlarmFilterLeavel(['focusOnLevel', focusOnLevel])"></InputNumber>
            </div>
          </li>
          <li class="line">
           <div class="item">
              <Checkbox :value="filterState.isIntelligence.checked" @on-change="changeAlarmFilterState(['isIntelligence'])">智能报警</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledInt" :value="filterState.isIntelligence.alarmIntelligence" @on-change="changeAlarmFilterState(['isIntelligence', 'alarmIntelligence'])">智能报警</Checkbox>
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber :disabled="disabledInt" class="numberInput" size="small" :max="9" :min="1" :value="filterLevel.intelligenceLevel" v-model="intelligenceLevel" @on-change="changeAlarmFilterLeavel(['intelligenceLevel', intelligenceLevel])"></InputNumber>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledInt" :value="filterState.isIntelligence.alarmPeccancy" @on-change="changeAlarmFilterState(['isIntelligence', 'alarmPeccancy'])">违章报警</Checkbox>
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber :disabled="disabledInt" class="numberInput" size="small" :max="9" :min="1" :value="filterLevel.peccancyLevel" v-model="peccancyLevel"  @on-change="changeAlarmFilterLeavel(['peccancyLevel', peccancyLevel])"></InputNumber>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledInt" :value="filterState.isIntelligence.faceOn" @on-change="changeAlarmFilterState(['isIntelligence', 'faceOn'])">人像布控</Checkbox>
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber :disabled="disabledInt"  class="numberInput" size="small" :max="9" :min="1" :value="filterLevel.faceOnLevel" v-model="faceOnLevel" @on-change="changeAlarmFilterLeavel(['faceOnLevel', faceOnLevel])"></InputNumber>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
            </div>
            <div class="item">
              抓拍图片<i-switch :value="filterState.isIntelligence.snapPictures" :disabled="isShowTrajectory" @on-change="changeAlarmFilterState(['isIntelligence', 'snapPictures'])"></i-switch>
            </div>
          </li>
          <li class="line">
            <div class="item">
              <Checkbox :value="filterState.isAlarmHelp.checked" @on-change="changeAlarmFilterState(['isAlarmHelp'])">报警求助</Checkbox>
            </div>
            <div class="item title-icon">
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber :disabled="disabledAlarmHelp" class="numberInput" size="small" :max="9" :min="1" :value="filterLevel.alarmHelpLevel" v-model="alarmHelpLevel"  @on-change="changeAlarmFilterLeavel(['alarmHelpLevel', alarmHelpLevel])"></InputNumber>
            </div>
          </li>
          <li class="line">
            <div class="item">
              <Checkbox :value="filterState.isFireControl.checked" @on-change="changeAlarmFilterState(['isFireControl'])">消防报警</Checkbox>
            </div>
            <div class="item title-icon">
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber :disabled="disabledFir" class="numberInput" size="small" :max="9" :min="1" :value="filterLevel.fireControlLevel" v-model="fireControlLevel" @on-change="changeAlarmFilterLeavel(['fireControlLevel', fireControlLevel])"></InputNumber>
            </div>
          </li>
          <li class="line">
            <div class="item">
              <Checkbox :value="filterState.isAlarmSingle.checked" @on-change="changeAlarmFilterState(['isAlarmSingle'])">单兵报警</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledSing" :value="filterState.isAlarmSingle.singleOneKey" @on-change="changeAlarmFilterState(['isAlarmSingle', 'singleOneKey'])">单兵一键报警</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledSing" :value="filterState.isAlarmSingle.alarmPatrol" @on-change="changeAlarmFilterState(['isAlarmSingle', 'alarmPatrol'])">巡更异常上报</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item">
              <div style="margin: 0 auto;">
                应急预案
                <!-- <i-switch :value="filterState.isPlan.checked" @on-change="changeAlarmFilterState(['isPlan'])"></i-switch> -->
                <i-switch :value="isEmergency" @on-change="switchEmergency"></i-switch>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
<script>
import appResource from 'assets/3DMap/appResource.js'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import utils from 'assets/3DMap/utils/index.js'
import gridUtil from 'assets/3DMap/gridUtil.js'
import mapUtil from 'assets/3DMap/mapUtil.js'
import layerConfig from 'assets/2DMap/meta/layer'
import videoTrans from 'assets/2DMap/feature/apply/video'
import alarmTrans from 'assets/2DMap/feature/apply/alarm'
import transAlarmHelp from 'assets/2DMap/feature/apply/alarmHelp'
import transPatrol from 'assets/2DMap/feature/apply/patrol'
import featureBase from 'assets/2DMap/feature/base'
import { VIDEOTYPEKEY, FEATURETYPE, VIDEOICONLAYERMAP, CAMERATYPE } from 'assets/2DMap/meta/common'
import gridTrans from 'assets/3DMap/gridUtil'
export default {
  data() {
    return {
      isExpand: false,
      activeTab: 'structure',
      // tree data
      searchTree: '',
      treeOptions: {
        showSearch: false,
        showOpenPreview: false,
        showOpenAllPreview: false,
        showCollection: false,
        showPoint: true
      },
      mapOrgTree: [],
      keyTypes: {},
      iconList: {
        grid: {icon: 'icon-grid', title: '网格'},
        building: {icon: 'icon-loufangdianwei', title: '楼宇'},
        storey: {icon: 'icon-tuceng', title: '楼层'},
        patrol: {icon: 'icon-dianzixungeng', title: '巡更点位'},
        default: {icon: 'icon-organise', title: '机构'}
      },
      alarmInputLevel: 1,
      alarmSectorLevel: 1,
      cameraSpearLevel: 1,
      focusOnLevel: 1,
      faceOnLevel: 1,
      intelligenceLevel: 1,
      peccancyLevel: 1,
      fireControlLevel: 1,
      alarmHelpLevel: 1,
      filterLabels: null,
      boltipcLabelLayer: layerConfig.boltipcLabel, // 枪机label
      halfBallipcLabelLayer: layerConfig.halfBallipcLabel, // 半球label
      fastBallipcLabelLayer: layerConfig.fastBallipcLabel, // 快球label
      allViewipcLabelLayer: layerConfig.allViewipcLabel, // 全景label
      redBoltipcLabelLayer: layerConfig.redBoltipcLabel, // 红外枪机label
      commonAlarmLabelLayer: layerConfig.commonAlarmLabel, // 普通报警label
      fireAlarmLabelLayer: layerConfig.fireAlarmLabel, // 消防报警label
      alarmBoxLabelLayer: layerConfig.alarmBoxLabel, // 报警箱label
      alarmColumnLabelLayer: layerConfig.alarmColumnLabel, // 报警柱label
      patrolLabelLayer: layerConfig.patrolLabel, // 巡更label
      gridLabelLayer: layerConfig.gridLabel, // 网格名称图层
      isShowTrajectory: false
    }
  },
  watch: {
    isExpand(val) {
      this.CHANGE_IS_EXPAND_LEFT_TREE(val)
    },
    faceTrackDrawMap: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.isShowTrajectory = !![...this.faceTrackDrawMap.values()].length
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters('map3DApplyIX', [
      'isEmergency', // 是否开启应急预案开关
      'isRecAlarm', // 是否接收报警
      'isCameraSpear', // 点位-枪机
      'isHalfBall', // 点位-半球
      'isFastBall', // 点位-快球
      'isFullShot', // 点位-全景
      'isInfrared', // 点位-红外枪机
      'isOnlyAlarm', // 报警点位-仅报警时显示
      'isAlarm', // 点位-普通报警
      'isFire', // 点位-消防报警
      'isAlarmBox', // 点位-报警箱
      'isAlarmPillar', // 点位-报警柱
      'isKeepWatch', // 点位-巡更
      'isSinglePawn', // 点位-单兵
      'isSingleHead', // 点位-单兵头像
      'isShowName', // 是否显示名称标签
      'isShowGrid', // 是否显示网格
      'videoCheckedList',
      'getpointSHLists' // 获取所有点位元素是否勾选状态
    ]),
    ...mapState({
      ready: ({ tdIndex }) => tdIndex.ready, // 三维地图是否加载完成的标识----
      map3DConfig: ({ tdIndex }) => tdIndex.map3DConfig, // 地图配置-----
      mapMode: ({ tdIndex }) => tdIndex.mapMode, // 地图模式----
      is3DMapOuter: ({ tdIndex }) => tdIndex.is3DMapOuter,
      floorData: ({ tdFloor }) => tdFloor.floorData,
      highLightLabelList: ({tdPoint}) => tdPoint.highLightLabelList, // 网格高亮数据
      alarmingFeatureList: ({ tdPoint }) => tdPoint.alarmingFeatureList, // 报警闪烁点位
      allAlarmEntities: ({ tdPoint }) => tdPoint.allAlarmEntities,
      realSingleMap3D: ({ tdIndex }) => tdIndex.realSingleMap3D, // 实时单兵缓存(key: 单兵用户标识，value：单兵用户信息)
      filterState: ({map3DApplyIX}) => map3DApplyIX.filterState,
      filterLevel: ({map3DApplyIX}) => map3DApplyIX.filterLevel,
      singleModelParam: ({ tdPoint }) => tdPoint.singleModelParam,
      videoFeatureList: ({ tdPoint }) => tdPoint.videoFeatureList, // 普通视频点位
      alarmFeatureList: ({ tdPoint }) => tdPoint.alarmFeatureList, // 普通报警点位
      fireAlarmFeatureList: ({ tdPoint }) => tdPoint.fireAlarmFeatureList, // 消防报警点位
      alarmColumnFeatureList: ({ tdPoint }) => tdPoint.alarmColumnFeatureList, // 报警柱位
      alarmBoxFeatureList: ({ tdPoint }) => tdPoint.alarmBoxFeatureList, // 报警箱位
      patrolFeatureList: ({ tdPoint }) => tdPoint.patrolFeatureList, // 巡更点位
      gridFeatureList: ({ tdPoint }) => tdPoint.gridFeatureList, // 网格列表要素
      gridLabelFeatureList: ({ tdPoint }) => tdPoint.gridLabelFeatureList, // 网格名称要素
      faceTrackDrawMap: ({ alarmThreeD }) => alarmThreeD.faceTrackDrawMap // 人脸轨迹绘制轨迹map（key：用户标识，value: 对应的绘制工具）
    }),
    disabledCom() { // 普通报警
      return !this.filterState.isCommonAlarm.checked
    },
    disabledVid() { // 视频报警
      return !this.filterState.isAlarmVideo.checked
    },
    disabledInt() { // 智能报警
      return !this.filterState.isIntelligence.checked
    },
    disabledFir() { // 消防报警
      return !this.filterState.isFireControl.checked
    },
    disabledAlarmHelp() { // 报警求助报警
      return !this.filterState.isAlarmHelp.checked
    },
    disabledSing() { // 单兵报警
      return !this.filterState.isAlarmSingle.checked
    }
  },
  methods: {
    ...mapMutations('map3DApplyIX', ['CHANGE_IS_EXPAND_LEFT_TREE', 'CHANGE_IS_SHOW_PT_ATTR', 'CHANGE_ATTR_INFO']),
    ...mapMutations(['DETEL_CURRENT_GRID_3D', 'DETEL_HIGHLIGHT_LABEL_TEXT']),
    ...mapActions(['getAppMapOrgTree', 'getOneBuildById', 'getOneFloorPatrols', 'getAssistHoleList', 'getAllPatrolPoint', 'setPatrolList',
      'setVideoList', 'setFirAlarmList', 'getSingleModelList',
      'setAlarmColumnList', 'setAppResourceTypeControl', 'setAlarmBoxList',
      'setAlarmList', 'getGridList', 'setGridList', 'setGridLabelList', 'getAllBuild',
      'getOneFloor', 'setIsOuter', 'getResourcePointsByChannelType', 'getAlarmResourceOrgTree',
      'setShowSingleHeads3D', 'getRealSingleList3D', 'setAllAlarmEntities', 'getMap3DOneGridById', 'setHighLightList', 'setHighLightLabelList', 'setCurrentHighLightGrid', 'setBoltipcLabelFeatures', 'setHalfBallipcLabelFeatures', 'setFastBallipcLabelFeatures', 'setAllViewipcLabelFeatures', 'setRedBoltipcLabelFeatures', 'setCommonAlarmLabelFeatures', 'setFireAlarmLabelFeatures', 'setAlarmBoxLabelFeatures', 'setAlarmColumnLabelFeatures', 'setPatrolLabelFeatures', 'setCurrentGrid3D']),
    ...mapActions('map3DApplyIX', ['switchAlarm', 'switchEmergency', 'changeShow', 'changeAlarmFilterState', 'changeAlarmFilterLeavel']),
    // 单兵
    singleSelect(flag) {
      this.changeShow({type: 'isSinglePawn', val: flag})
      if (this.realSingleMap3D && this.realSingleMap3D.size > 0) {
        this.controlSingleShow(flag) // 控制单兵的显隐
        this.controlSingleHeadShow(this.isSingleHead) // 控制单兵头像的显隐
      } else {
        this.getRealSingleList3D({ devStaus: 'online' }).then(res => {
          console.log('查询到所有在线单兵数据：', res)
          this.controlSingleShow(flag) // 控制单兵的显隐
          this.controlSingleHeadShow(this.isSingleHead) // 控制单兵头像的显隐
        })
      }
    },
    // 单兵头像
    singleHeadSelect(flag) {
      this.changeShow({type: 'isSingleHead', val: flag})
      this.controlSingleHeadShow(flag) // 控制单兵头像的显隐
    },
    // 名称标签
    async labelSelect(flag) {
      var _t = this
      _t.changeShow({type: 'isShowName', val: flag})
      if (_t.ready) {
        if (flag) { // 显示
          if (this.is3DMapOuter) { // 楼外
            mapUtil.entitys.labels = []
            // 添加视频点位name浮层
            if (_t.getpointSHLists.isCameraSpear || _t.getpointSHLists.isHalfBall || _t.getpointSHLists.isFastBall || _t.getpointSHLists.isFullShot || _t.getpointSHLists.isInfrared) { // 视频资源勾选
              let param = { tab: mapUtil.TABTYPE.video, channelTypes: mapUtil.pointTypes.vedio }

              _t.getResourcePointsByChannelType(param).then(function(res) {
                for (let item of res) {
                  for (let item2 of mapUtil.entitys.vedio) {
                    if (item._id === item2._id) {
                      let locValues = item.point3D.loc.split(',').map(item => Number(item))
                      let position = { lon: locValues[0], lat: locValues[1], height: locValues[2] }
                      let labelEntity = utils.addLabel(_t.$context, position, item.name, item._id, mapUtil.CHANNELTYPE.vedioResource)// 'video'
                      mapUtil.entitys.labels.push(labelEntity)
                    }
                  }
                }
              }, function(err) {
                console.log(err)
              })
            }
            // 添加楼宇name浮层
            this.getAllBuild().then(res => {
              res.forEach(item => {
                if (item.center && item.height) {
                  let coValues = item.center.split(',').map(item => Number(item)) // 二维经纬度坐标数组
                  let position = { lon: coValues[0], lat: coValues[1], height: item.height }
                  let labelEntity = _t.$context.viewer.entities.getById(item.name)

                  if (!labelEntity) {
                    labelEntity = utils.addLabel(_t.$context, position, item.name, item._id, mapUtil.CHANNELTYPE.building)
                    mapUtil.entitys.labels.push(labelEntity)
                  }
                }
              })
            })
            // 添加报警点位name浮层
            if (_t.getpointSHLists.isAlarm) { // 普通报警&&报警主机报警||_t.getpointSHLists.isFire
              let param = {channelTypes: mapUtil.pointTypes.commonAlarm}
              _t.getResourcePointsByChannelType(param).then(function(res) {
                let labelEntity
                for (let item of res) {
                  let locValues = item.point3D.loc.split(',').map(item => Number(item))
                  let position = { lon: locValues[0], lat: locValues[1], height: locValues[2] }
                  if (item.type === 1) { // 普通报警
                    labelEntity = utils.addLabel(_t.$context, position, item.name, item._id)
                  } else { // 报警主机报警
                    labelEntity = utils.addLabel(_t.$context, position, item.name, item._id)
                  }

                  mapUtil.entitys.labels.push(labelEntity)
                }
              }, function(err) {
                console.log(err)
              })
            }
            if (_t.getpointSHLists.isAlarmBox || _t.getpointSHLists.isAlarmPillar) {
              let param = {tab: mapUtil.TABTYPE.alarmHelp, channelTypes: mapUtil.pointTypes.vedio}
              let result = await _t.getResourcePointsByChannelType(param)
              if (_t.getpointSHLists.isAlarmBox) { // 报警箱数据
                let res = mapUtil.getAlarmBoxOrColumnByType(result, mapUtil.CHANNELTYPE.alarmBoxResource)
                for (let item of res) {
                  let locValues = item.point3D.loc.split(',').map(item => Number(item))
                  let position = { lon: locValues[0], lat: locValues[1], height: locValues[2] }
                  let labelEntity = utils.addLabel(_t.$context, position, item.name, item._id)
                  mapUtil.entitys.labels.push(labelEntity)
                }
              }
              if (_t.getpointSHLists.isAlarmPillar) { // 报警柱数据
                let res = mapUtil.getAlarmBoxOrColumnByType(result, mapUtil.CHANNELTYPE.alarmColumnResource)
                for (let item of res) {
                  let locValues = item.point3D.loc.split(',').map(item => Number(item))
                  let position = { lon: locValues[0], lat: locValues[1], height: locValues[2] }
                  let labelEntity = utils.addLabel(_t.$context, position, item.name, item._id)
                  mapUtil.entitys.labels.push(labelEntity)
                }
              }
            }
            if (_t.getpointSHLists.isFire) { // 添加火警浮层
              let param = {channelTypes: mapUtil.pointTypes.fireAlarm}
              _t.getResourcePointsByChannelType(param).then(function(res) {
                for (let item of res) {
                  let locValues = item.point3D.loc.split(',').map(item => Number(item))
                  let position = { lon: locValues[0], lat: locValues[1], height: locValues[2] }
                  let labelEntity = utils.addLabel(_t.$context, position, item.name, item._id)
                  mapUtil.entitys.labels.push(labelEntity)
                }
              }, function(err) {
                console.log(err)
              })
            }
            // 添加巡更name浮层
            if (_t.getpointSHLists.isKeepWatch) {
              _t.getAllPatrolPoint().then(function(res) {
                for (let item of res) {
                  let locValues = item.point3D.geo.split(',').map(item => Number(item))
                  let position = { lon: locValues[0], lat: locValues[1], height: locValues[2] }
                  let labelEntity = utils.addLabel(_t.$context, position, item.devName, item._id)
                  mapUtil.entitys.labels.push(labelEntity)
                }
              }, function(err) {
                console.log(err)
              })
            }
            // 添加辅助杆name浮层
            _t.getAssistHoleList().then(function(res) {
              let vaildHole = res.filter(item => item.hasOwnProperty('name'))
              for (let item of vaildHole) {
                let locValues = item.loc.split(',').map(item => Number(item))
                let position = { lon: locValues[0], lat: locValues[1], height: locValues[2] }
                let labelEntity = utils.addLabel(_t.$context, position, item.name, item._id, 'assistClick')
                mapUtil.entitys.labels.push(labelEntity)
              }
            }, function(err) {
              console.log(err)
            })
            // 获取单兵模型列表数据
            /* _t.getSingleModelList().then(function(res) {
              console.log(res)
            },function(err) {

            }) */
          } else { // 楼内
            if (this.isCameraSpear) { // 点位-枪机
              let arr = []
              let filterFeature = this.videoFeatureList.filter(item => item.attributes.sRType === VIDEOTYPEKEY.boltipc)
              for (let item of filterFeature) {
                this.setClickLabelFeatures(item.attributes, arr, this.boltipcLabelLayer)
              }
              arr && this.setBoltipcLabelFeatures(arr)
            }
            if (this.isHalfBall) { // 点位-半球
              let arr = []
              let filterFeature = this.videoFeatureList.filter(item => item.attributes.sRType === VIDEOTYPEKEY.halfBallipc)
              for (let item of filterFeature) {
                this.setClickLabelFeatures(item.attributes, arr, this.halfBallipcLabelLayer)
              }
              arr && this.setHalfBallipcLabelFeatures(arr)
            }
            if (this.isFastBall) { // 点位-快球
              let arr = []
              let filterFeature = this.videoFeatureList.filter(item => item.attributes.sRType === VIDEOTYPEKEY.fastBallipc)
              for (let item of filterFeature) {
                this.setClickLabelFeatures(item.attributes, arr, this.fastBallipcLabelLayer)
              }
              arr && this.setFastBallipcLabelFeatures(arr)
            }
            if (this.isFullShot) { // 点位-全景
              let arr = []
              let filterFeature = this.videoFeatureList.filter(item => item.attributes.sRType === VIDEOTYPEKEY.allViewipc)
              for (let item of filterFeature) {
                this.setClickLabelFeatures(item.attributes, arr, this.allViewipcLabelLayer)
              }
              arr && this.setAllViewipcLabelFeatures(arr)
            }
            if (this.isInfrared) { // 点位-红外枪机
              let arr = []
              let filterFeature = this.videoFeatureList.filter(item => item.attributes.sRType === VIDEOTYPEKEY.redBoltipc)
              for (let item of filterFeature) {
                this.setClickLabelFeatures(item.attributes, arr, this.redBoltipcLabelLayer)
              }
              arr && this.setRedBoltipcLabelFeatures(arr)
            }
            if (this.isAlarm) {
              let arr = []
              for (let item of this.alarmFeatureList) {
                this.setClickLabelFeatures(item.attributes, arr, this.commonAlarmLabelLayer)
              }
              arr && this.setCommonAlarmLabelFeatures(arr)
            }
            if (this.isFire) {
              let arr = []
              for (let item of this.fireAlarmFeatureList) {
                this.setClickLabelFeatures(item.attributes, arr, this.fireAlarmLabelLayer)
              }
              arr && this.setFireAlarmLabelFeatures(arr)
            }
            if (this.isAlarmBox) {
              let arr = []
              for (let item of this.alarmBoxFeatureList) {
                this.setClickLabelFeatures(item.attributes, arr, this.alarmBoxLabelLayer)
              }
              arr && this.setAlarmBoxLabelFeatures(arr)
            }
            if (this.isAlarmPillar) {
              let arr = []
              for (let item of this.alarmColumnFeatureList) {
                this.setClickLabelFeatures(item.attributes, arr, this.alarmColumnLabelLayer)
              }
              arr && this.setAlarmColumnLabelFeatures(arr)
            }
            if (this.isKeepWatch) {
              let arr = []
              for (let item of this.patrolFeatureList) {
                this.setClickLabelFeatures(item.attributes, arr, this.patrolLabelLayer)
              }
              arr && this.setPatrolLabelFeatures(arr)
            }
            if (this.isShowGrid) {
              for (let item of this.gridLabelFeatureList) {
                this.setCurrentGrid3D(item)
              }
              this.setCurrentHighLightGrid(this.highLightLabelList)
            }
            if (this.highLightLabelList) {
              this.setCurrentHighLightGrid(this.highLightLabelList)
            }
          }
        } else { // 隐藏
          if (this.is3DMapOuter) {
            let labels = mapUtil.entitys.labels
            for (const label of labels) { // 遍历楼宇名称标签
              _t.$context.viewer.entities.remove(label) // 实体集合中移除名称标签
            }
            mapUtil.entitys.labels = []
          } else { // 楼内
            this.setBoltipcLabelFeatures([]) // 枪机
            this.setHalfBallipcLabelFeatures([]) // 半球
            this.setFastBallipcLabelFeatures([]) // 快球
            this.setAllViewipcLabelFeatures([]) // 全景
            this.setRedBoltipcLabelFeatures([]) // 红外枪机
            this.setCommonAlarmLabelFeatures([]) // 普通报警
            this.setFireAlarmLabelFeatures([]) // 消防报警
            this.setAlarmBoxLabelFeatures([]) // 报警箱
            this.setAlarmColumnLabelFeatures([]) // 报警柱
            this.setPatrolLabelFeatures([]) // 巡更
            this.DETEL_CURRENT_GRID_3D() // 网格
            this.DETEL_HIGHLIGHT_LABEL_TEXT() // 高亮网格取消
          }
        }
      }
    },
    // 设置点击事件视频悬浮显示名称要素
    setClickLabelFeatures(attr, arr, labelLayer) {
      let labelFeature = featureBase.getHoverLabelFeature(attr, labelLayer)
      arr.push(labelFeature)
    },
    /* setClickGridLabelFeatures(attr, arr, labelLayer) {
      let labelFeature = areaTrans.getHoverLabelFeature(attr, areaStyle.gridLabelStyle, labelLayer)
      arr.push(labelFeature)
    }, */
    // 网格----
    gridSelect(flag) {
      this.changeShow({type: 'isShowGrid', val: flag})
      if (flag) {
        this.getGridList({id: this.floorData._id}).then(res => {
          let filterRes = JSON.parse(JSON.stringify(res))
          /* console.log(this.highLightLabelList)
          if(this.highLightLabelList){
            let arr = filterRes.filter(item => item._id !== this.highLightLabelList._id)
            if(arr.length){
              filterRes = arr
            }
          } */
          let features = gridUtil.convertGridDatasToFeatures(filterRes)
          this.setGridList(features)
          this.setGridLabelList(filterRes)
          if (this.isShowName) {
            for (let item of filterRes) {
              this.setCurrentGrid3D(item)
            }
          }
        })
      } else {
        this.setGridList([])
        this.DETEL_CURRENT_GRID_3D()
      }
    },

    // 改变报警点位的显示模式
    changeAlarmPointShowMode(flag) {
      this.changeShow({type: 'isOnlyAlarm', val: flag})
      if (flag) {
        this.commonAlarmSelect(false) // 不显示普通报警
        this.fireAlarmSelect(false) // 不显示消防报警
        this.alarmBoxSelect(false) // 不显示报警箱报警
        this.alarmColumnSelect(false) // 不显示报警柱报警
      }
    },
    // 枪机选择
    cameraSpearSelect(flag) {
      this.changeShow({type: 'isCameraSpear', val: flag})
      this.devSelect()
    },
    // 半球选择--
    halfBallSelect(flag) {
      this.changeShow({type: 'isHalfBall', val: flag})

      this.devSelect()
    },
    // 快球选择
    fastBallSelect(flag) {
      this.changeShow({type: 'isFastBall', val: flag})

      this.devSelect()
    },
    // 全景选择
    fullShotSelect(flag) {
      this.changeShow({type: 'isFullShot', val: flag})

      this.devSelect()
    },
    // 红外--
    infraredSelect(flag) {
      this.changeShow({type: 'isInfrared', val: flag})

      this.devSelect()
    },
    // 单击楼宇楼层树时地图的切换以及楼宇的定位---
    handleNode(node) {
      if (node.type === mapUtil.CHANNELTYPE.building) { // 楼宇
        if (!this.is3DMapOuter) {
          this.setIsOuter(true)
          // 切换地图
        }
        // 获取楼宇信息
        this.getOneBuildById(node.code)
          .then(res => {
            // 判断三维地图是否加载完毕
            if (this.ready) {
              let { dataSet, dataSource, layer } = this.map3DConfig
              let layerName = layer || (dataSet + '@' + dataSource)
              let scenelayer = this.$context.viewer.scene.layers.find(layerName)
              if (scenelayer) {
                scenelayer.setSelection(res.code)
              }
              let coValues = res.center.split(',').map(item => Number(item))
              let position = { lon: coValues[0], lat: coValues[1], height: res.height }
              let labelEntity = this.$context.viewer.entities.getById(res.name)
              if (!labelEntity) {
                labelEntity = utils.addLabel(this.$context, position, res.name, res._id, mapUtil.CHANNELTYPE.building)
                mapUtil.entitys.labels.push(labelEntity)
              }
              this.$context.viewer.zoomTo(labelEntity)
            }
            // eslint-disable-next-line handle-callback-err
          }).catch(err => {
            this.errorMsg('参数获取失败')
          })
      } else if (node.type === mapUtil.CHANNELTYPE.floor) { // 楼层
        if (this.is3DMapOuter) {
          this.setIsOuter(false)
        }
        this.getOneFloor(node._id).then(res => {
        })
      } else if (node.type === mapUtil.CHANNELTYPE.grid) { // 网格
        let getFloorById = this.getOneFloor(node.sid)
        let getGridById = this.getMap3DOneGridById(node._id)
        Promise.all([getFloorById, getGridById]).then(resArr => {
          let attrInfo = {type: mapUtil.CHANNELTYPE.grid, data: JSON.parse(JSON.stringify(resArr[1]))}
          this.CHANGE_IS_SHOW_PT_ATTR(true)
          this.CHANGE_ATTR_INFO(attrInfo)
          if (!this.is3DMapOuter && node.sid === this.floorData._id) { // 地图为当前楼层地图时，高亮定位显示
            let gridData = JSON.parse(JSON.stringify(resArr[1]))
            let features = gridUtil.convertGridDatasToFeatures([gridData])
            this.setHighLightList(features)
            this.setHighLightLabelList(gridData)
            if (this.isShowName) {
              this.setCurrentHighLightGrid(gridData)
            } else {
              this.DETEL_HIGHLIGHT_LABEL_TEXT()
            }
            let center = gridData.center.split(',').map(item => Number(item))
            this.$context2D && this.$context2D.map.getView().setCenter(center)
          }
          this.is3DMapOuter && this.setIsOuter(false)
        })
      }
    },
    async displayFloorPointByType(param, flag, key) {
      let { channelTypes } = param
      if (flag) {
        let result = await this.getResourcePointsByChannelType(param)
        if (key === this.keyTypes.alarmBox) {
          result = mapUtil.getAlarmBoxOrColumnByType(result, mapUtil.CHANNELTYPE.alarmBoxResource)
        }
        if (key === this.keyTypes.alarmColumn) {
          result = mapUtil.getAlarmBoxOrColumnByType(result, mapUtil.CHANNELTYPE.alarmColumnResource)
        }
        let pointArr = [...result] // 深拷贝数组
        for (const alarmingFeature of this.alarmingFeatureList) { // 遍历报警要素数组
          for (let index = 0; index < pointArr.length; index++) {
            const point = pointArr[index]
            if (alarmingFeature.attributes.id === point._id) {
              pointArr.splice(index, 1) // 移除巡更点位数据
            }
          }
        }
        let features = appResource.convertPointDataToFeatures(pointArr, this.mapMode)
        if (channelTypes === mapUtil.pointTypes.commonAlarm) {
          features = alarmTrans.transFeatures(pointArr, layerConfig.commonAlarm, this.mapMode)
          this.setAlarmList(features)
          if (this.isShowName) {
            let arr = []
            for (let item of this.alarmFeatureList) {
              this.setClickLabelFeatures(item.attributes, arr, this.commonAlarmLabelLayer)
            }
            arr && this.setCommonAlarmLabelFeatures(arr)
          }
        } else if (channelTypes === mapUtil.pointTypes.fireAlarm) {
          features = alarmTrans.transFeatures(pointArr, layerConfig.fireAlarm, this.mapMode)
          this.setFirAlarmList(features)
          if (this.isShowName) {
            let arr = []
            for (let item of this.fireAlarmFeatureList) {
              this.setClickLabelFeatures(item.attributes, arr, this.fireAlarmLabelLayer)
            }
            arr && this.setFireAlarmLabelFeatures(arr)
          }
        }
        if (channelTypes === mapUtil.pointTypes.vedio) {
          if (key === this.keyTypes.alarmBox) {
            features = transAlarmHelp.transFeatures(pointArr, layerConfig.alarmBox, this.mapMode)
            this.setAlarmBoxList(features)
            if (this.isShowName) {
              let arr = []
              for (let item of this.alarmBoxFeatureList) {
                this.setClickLabelFeatures(item.attributes, arr, this.alarmBoxLabelLayer)
              }
              arr && this.setAlarmBoxLabelFeatures(arr)
            }
          }
          if (key === this.keyTypes.alarmColumn) {
            features = transAlarmHelp.transFeatures(pointArr, layerConfig.alarmColumn, this.mapMode)
            this.setAlarmColumnList(features)
            if (this.isShowName) {
              let arr = []
              for (let item of this.alarmColumnFeatureList) {
                this.setClickLabelFeatures(item.attributes, arr, this.alarmColumnLabelLayer)
              }
              arr && this.setAlarmColumnLabelFeatures(arr)
            }
          }
        }
      } else {
        if (channelTypes === mapUtil.pointTypes.commonAlarm) {
          this.setAlarmList([])
          this.setCommonAlarmLabelFeatures([])
        }
        if (channelTypes === mapUtil.pointTypes.fireAlarm) {
          this.setFirAlarmList([])
          this.setFireAlarmLabelFeatures([])
        }
        if (channelTypes === mapUtil.pointTypes.vedio) {
          if (key === this.keyTypes.alarmBox) {
            this.setAlarmBoxList([])
            this.setAlarmBoxLabelFeatures([])
          }
          if (key === this.keyTypes.alarmColumn) {
            this.setAlarmColumnList([])
            this.setAlarmColumnLabelFeatures([])
          }
        }
      }
    },
    displayPointByType(param, flag, key) {
      /* 控制三维视频点位的显示隐藏 胡红勋添加 */
      if (flag) {
        this.getResourcePointsByChannelType(param).then(
          res => {
            if (key === this.keyTypes.alarmBox) {
              res = mapUtil.getAlarmBoxOrColumnByType(res, mapUtil.CHANNELTYPE.alarmBoxResource)
            }
            if (key === this.keyTypes.alarmColumn) {
              res = mapUtil.getAlarmBoxOrColumnByType(res, mapUtil.CHANNELTYPE.alarmColumnResource)
            }
            for (const entity of this.allAlarmEntities) { // 视频报警要素跟普通报警要素过滤
              for (let index = 0; index < res.length; index++) {
                const item = res[index]
                if (item && (entity.id === item._id || (entity && entity.attributes && entity.attributes.id === item._id))) {
                  res.splice(index, 1)
                }
              }
            }
            utils.addEntitysToMap(key, res, this.mapMode, this.$context, false)
            if (this.getpointSHLists.isShowName) {
              let labelEntity
              for (let item of res) {
                let locValues = item.point3D.loc.split(',').map(item => Number(item))
                let position = { lon: locValues[0], lat: locValues[1], height: locValues[2] }
                if (item.type === 0) { // 报警箱或报警柱
                  labelEntity = utils.addLabel(this.$context, position, item.name, item._id)
                } else { // 报普通报警 报警主机报警 消防报警
                  labelEntity = utils.addLabel(this.$context, position, item.name, item._id)
                }
                mapUtil.entitys.labels.push(labelEntity)
              }
            }
          }).catch(function(err) {
          console.log(err)
        })
      } else {
        // 点击取消勾选的点位信息
        mapUtil.entitys[key].forEach(entity => {
          this.$context.viewer.entities.remove(entity)
        })
        for (let item of mapUtil.entitys.labels) {
          mapUtil.entitys[key].forEach(entity => {
            if (entity._id === item._flag) { // 匹配取消点位label信息
              this.$context.viewer.entities.remove(item)
            }
          })
        }
        mapUtil.entitys[key] = []
      }
    },
    // 设备选择
    devSelect() {
      let param = { tab: mapUtil.TABTYPE.video, channelTypes: mapUtil.pointTypes.vedio }
      if (this.is3DMapOuter) {
        /* 控制三维视频点位的显示隐藏 */
        if (!this.ready) {
          return
        }
        this.getResourcePointsByChannelType(param).then(
          res => {
            mapUtil.entitys[this.keyTypes.vedio].forEach(entity => {
              this.$context.viewer.entities.remove(entity)
            })
            mapUtil.entitys[this.keyTypes.vedio] = []
            for (const entity of this.allAlarmEntities) { // 视频报警要素跟普通报警要素过滤
              for (let index = 0; index < res.length; index++) {
                const item = res[index]
                if (item && (entity.id === item._id || (entity && entity.attributes && entity.attributes.id === item._id))) {
                  res.splice(index, 1)
                }
              }
            }
            let result = appResource.fitlerArrByTypes(res, this.videoCheckedList) // 过滤选中信息
            utils.addEntitysToMap(this.keyTypes.vedio, result, this.mapMode, this.$context, false) // 重新渲染标注
            var _t = this
            if (_t.getpointSHLists.isShowName) { // 如果显示标签勾选
              mapUtil.entitys.labels.forEach((label, index) => {
                if (label.pointType === mapUtil.CHANNELTYPE.vedioResource) {
                  _t.$context.viewer.entities.remove(label)
                }
              })
              var arr = []
              _t.filterLabels = mapUtil.entitys.labels.filter(item => item.pointType !== mapUtil.CHANNELTYPE.vedioResource)
              if (result.length) {
                setTimeout(function() {
                  for (let label of result) {
                    let locValues = label.point3D.loc.split(',').map(item => Number(item))
                    let position = { lon: locValues[0], lat: locValues[1], height: locValues[2] }
                    let labelEntity = utils.addLabel(_t.$context, position, label.name, label._id, mapUtil.CHANNELTYPE.vedioResource)
                    arr.push(labelEntity)
                  }
                  mapUtil.entitys.labels = [..._t.filterLabels, ...arr]
                }, 1000)
              }
            }
          }).catch(function(err) {
          console.log(err)
        })
        // 结束-------
      } else {
        param.sid = this.floorData._id
        this.getResourcePointsByChannelType(param).then(res => {
          let videoArr = res.filter(item => this.videoCheckedList.includes(item.monitortype))
          let features = videoTrans.transIconFeatures(videoArr, layerConfig.video, 0, this.mapMode)
          for (const alarmingFeature of this.alarmingFeatureList) { // 视频报警要素跟普通报警要素过滤
            for (let index = 0; index < res.length; index++) {
              const item = features[index]
              if (item && (alarmingFeature.id === item.attributes.id || (alarmingFeature && alarmingFeature.attributes && alarmingFeature.attributes.id === item.attributes.id))) {
                features.splice(index, 1)
              }
            }
          }
          this.setVideoList(features)
          if (this.isShowName) {
            if (this.isCameraSpear) {
              let arr = []
              let filterFeature = this.videoFeatureList.filter(item => item.attributes.sRType === VIDEOTYPEKEY.boltipc)
              for (let item of filterFeature) {
                this.setClickLabelFeatures(item.attributes, arr, this.boltipcLabelLayer)
              }
              arr && this.setBoltipcLabelFeatures(arr)
            } else {
              this.setBoltipcLabelFeatures([])
            }
            if (this.isHalfBall) {
              let arr = []
              let filterFeature = this.videoFeatureList.filter(item => item.attributes.sRType === VIDEOTYPEKEY.halfBallipc)
              for (let item of filterFeature) {
                this.setClickLabelFeatures(item.attributes, arr, this.halfBallipcLabelLayer)
              }
              arr && this.setHalfBallipcLabelFeatures(arr)
            } else {
              this.setHalfBallipcLabelFeatures([])
            }
            // *****
            if (this.isFastBall) {
              let arr = []
              let filterFeature = this.videoFeatureList.filter(item => item.attributes.sRType === VIDEOTYPEKEY.fastBallipc)
              for (let item of filterFeature) {
                this.setClickLabelFeatures(item.attributes, arr, this.fastBallipcLabelLayer)
              }
              arr && this.setFastBallipcLabelFeatures(arr)
            } else {
              this.setFastBallipcLabelFeatures([])
            }
            if (this.isFullShot) {
              let arr = []
              let filterFeature = this.videoFeatureList.filter(item => item.attributes.sRType === VIDEOTYPEKEY.allViewipc)
              for (let item of filterFeature) {
                this.setClickLabelFeatures(item.attributes, arr, this.allViewipcLabelLayer)
              }
              arr && this.setAllViewipcLabelFeatures(arr)
            } else {
              this.setAllViewipcLabelFeatures([])
            }
            if (this.isInfrared) {
              let arr = []
              let filterFeature = this.videoFeatureList.filter(item => item.attributes.sRType === VIDEOTYPEKEY.redBoltipc)
              for (let item of filterFeature) {
                this.setClickLabelFeatures(item.attributes, arr, this.redBoltipcLabelLayer)
              }
              arr && this.setRedBoltipcLabelFeatures(arr)
            } else {
              this.setRedBoltipcLabelFeatures([])
            }
            /* if (this.isAlarm) {
              let arr = []
              for (let item of this.alarmFeatureList) {
                this.setClickLabelFeatures(item.attributes, arr, this.commonAlarmLabelLayer)
              }
              arr && this.setCommonAlarmLabelFeatures(arr)
            } else {
              this.setCommonAlarmLabelFeatures([])
            }
            if (this.isFire) {
              let arr = []
              for (let item of this.fireAlarmFeatureList) {
                this.setClickLabelFeatures(item.attributes, arr, this.fireAlarmLabelLayer)
              }
              arr && this.setFireAlarmLabelFeatures(arr)
            } else {
              this.setFireAlarmLabelFeatures([])
            }
            if (this.isAlarmBox) {
              let arr = []
              for (let item of this.alarmBoxFeatureList) {
                this.setClickLabelFeatures(item.attributes, arr, this.alarmBoxLabelLayer)
              }
              arr && this.setAlarmBoxLabelFeatures(arr)
            } else {
              this.setAlarmBoxLabelFeatures([])
            }
            if (this.isAlarmPillar) {
              let arr = []
              for (let item of this.alarmColumnFeatureList) {
                this.setClickLabelFeatures(item.attributes, arr, this.alarmColumnLabelLayer)
              }
              arr && this.setAlarmColumnLabelFeatures(arr)
            } else {
              this.setAlarmColumnLabelFeatures([])
            }
            if (this.isKeepWatch) {
              let arr = []
              for (let item of this.patrolFeatureList) {
                this.setClickLabelFeatures(item.attributes, arr, this.patrolLabelLayer)
              }
              arr && this.setPatrolLabelFeatures(arr)
            } else {
              this.setPatrolLabelFeatures([])
            }
            if (this.isShowGrid) {
              let arr = []
              for (let item of this.gridFeatureList) {
                let { id } = item.attributes
                arr.push(this.getMap3DOneGridById(id))
                Promise.all(arr).then(res => {
                  let arr1 = []
                  for (let item1 of res) {
                    this.setClickGridLabelFeatures(item1, arr1, this.gridLabelLayer)
                  }
                  arr1 && this.setGridLabelFestures(arr1)
                }, err => {
                  console.log(err)
                })
              }
            } else {
              this.setGridLabelFestures([])
            } */
          }
        })
      }
    },
    // 巡更点位
    patrolSelect(flag) {
      this.changeShow({type: 'isKeepWatch', val: flag})
      if (this.is3DMapOuter) {
        /* 控制三维巡更点位的显示隐藏 */
        if (flag) {
          this.getAllPatrolPoint()
            .then(res => {
              utils.addEntitysToMap(this.keyTypes.patrol, res, this.mapMode, this.$context, false)
              if (this.getpointSHLists.isShowName) {
                for (let item of res) {
                  let locValues = item.point3D.geo.split(',').map(item => Number(item))
                  let position = { lon: locValues[0], lat: locValues[1], height: locValues[2] }
                  let labelEntity = utils.addLabel(this.$context, position, item.devName, item._id)
                  mapUtil.entitys.labels.push(labelEntity)
                }
              }
            })
            // eslint-disable-next-line handle-callback-err
            .catch(err => {
            })
        } else {
          mapUtil.entitys.patrol.forEach(entity => {
            this.$context.viewer.entities.remove(entity)
          })
          console.log(mapUtil.entitys.labels, mapUtil.entitys.patrol)
          mapUtil.entitys.labels.forEach(label => {
            mapUtil.entitys.patrol.forEach(entity => {
              if (label.flag === entity._id) {
                this.$context.viewer.entities.remove(label)
              }
            })
          })
          console.log(mapUtil.entitys.patrol, mapUtil.entitys.labels)
          mapUtil.entitys.patrol = []
        }
      } else {
        /* 控制二维巡更点位的显示隐藏 */
        if (flag) {
          this.getOneFloorPatrols(this.floorData._id).then(patrolDatas => {
            let patrolArr = [...patrolDatas] // 深拷贝数组
            for (const alarmingFeature of this.alarmingFeatureList) { // 遍历报警要素数组
              for (let index = 0; index < patrolArr.length; index++) {
                const patrol = patrolArr[index]
                if (alarmingFeature.attributes.id === patrol._id) {
                  patrolArr.splice(index, 1) // 移除巡更点位数据
                }
              }
            }
            let patrols = transPatrol.transFeatures(patrolArr, layerConfig.patrol, this.mapMode)
            this.setPatrolList(patrols)
            if (this.isShowName) {
              let arr = []
              for (let item of this.patrolFeatureList) {
                this.setClickLabelFeatures(item.attributes, arr, this.patrolLabelLayer)
              }
              arr && this.setPatrolLabelFeatures(arr)
            }
          })
        } else {
          this.setPatrolList([])
          this.setPatrolLabelFeatures([])
        }
      }
    },
    // 消防报警
    fireAlarmSelect(flag) {
      this.changeShow({type: 'isFire', val: flag})
      let param = { channelTypes: mapUtil.pointTypes.fireAlarm }
      if (this.is3DMapOuter) {
        this.displayPointByType(param, flag, this.keyTypes.fireAlarm)
      } else {
        param.sid = this.floorData._id
        /* 控制二维视频点位的显示隐藏 */
        this.displayFloorPointByType(param, flag)
      }
    },
    // 普通报警
    commonAlarmSelect(flag) {
      this.changeShow({type: 'isAlarm', val: flag})
      let param = {channelTypes: mapUtil.pointTypes.commonAlarm}
      if (this.is3DMapOuter) {
        this.displayPointByType(param, flag, this.keyTypes.commonAlarm)
      } else {
        param.sid = this.floorData._id
        /* 控制二维视频点位的显示隐藏 */
        this.displayFloorPointByType(param, flag)
      }
    },
    // 报警箱-----
    alarmBoxSelect(flag) {
      this.changeShow({type: 'isAlarmBox', val: flag})
      let param = {tab: mapUtil.TABTYPE.alarmHelp, channelTypes: mapUtil.pointTypes.vedio}
      if (this.is3DMapOuter) {
        this.displayPointByType(param, flag, this.keyTypes.alarmBox)
      } else {
        param.sid = this.floorData._id
        /* 控制二维视频点位的显示隐藏 */
        this.displayFloorPointByType(param, flag, this.keyTypes.alarmBox)
      }
    },
    alarmColumnSelect(flag) {
      this.changeShow({type: 'isAlarmPillar', val: flag})
      let param = {tab: mapUtil.TABTYPE.alarmHelp, channelTypes: mapUtil.pointTypes.vedio}
      if (this.is3DMapOuter) {
        this.displayPointByType(param, flag, this.keyTypes.alarmColumn)
      } else {
        param.sid = this.floorData._id
        /* 控制二维视频点位的显示隐藏 */
        this.displayFloorPointByType(param, flag, this.keyTypes.alarmColumn)
      }
    },
    controlSingleShow(flag) { // 控制单兵的显隐
      if (this.is3DMapOuter && this.ready) {
        let context = this.$context
        let realSingles = [...this.realSingleMap3D.values()] // 实时单兵数组
        if (flag) {
          for (let realSingle of realSingles) {
            let modelParam = this.getSingleModelParam() // 获取单兵模型参数
            let height = realSingle.geo.hasOwnProperty('height') && Number(realSingle.geo.height) > modelParam.height ? realSingle.geo.height : modelParam.height
            // let height = 13
            let loc = [Number(realSingle.geo.lon), Number(realSingle.geo.lat), Number(height)]
            let modelObj = {
              id: realSingle.id,
              type: mapUtil.CHANNELTYPE.single,
              url: modelParam.url,
              longitude: loc[0],
              latitude: loc[1],
              height: loc[2],
              heading: 0,
              pitch: 0,
              roll: 0,
              scale: modelParam.hasOwnProperty('scale') ? modelParam.scale : 0.075,
              color: modelParam.hasOwnProperty('color') ? modelParam.color : context.Cesium.Color.WHITE,
              colorAmount: modelParam.hasOwnProperty('amount') ? modelParam.amount : 0,
              colorMode: modelParam.hasOwnProperty('mode') ? modelParam.mode : context.Cesium.ColorBlendMode.MIX
            }
            utils.addSingleModel(context, modelObj)
          }
        } else {
          for (let realSingle of realSingles) {
            context.viewer.entities.removeById(realSingle.id) // 移除实体
          }
        }
      }
    },
    getSingleModelParam() { // 获取单兵模型参数
      let modelParam = { url: this.singleModelParam.onlineModeUrl, existModel: true }
      let extraColor = utils.getModelExtraColorParam(this.$context.Cesium, this.singleModelParam.brightness)
      modelParam.color = extraColor.color || this.$context.Cesium.Color.WHITE
      modelParam.mode = extraColor.mode || this.$context.Cesium.ColorBlendMode.MIX
      modelParam.amount = extraColor.amount || 0
      modelParam.scale = this.singleModelParam.scale || mapUtil.TDDEFAULTOPS.singleDefaultScale
      modelParam.height = this.singleModelParam.height ? Number(this.singleModelParam.height) : mapUtil.TDDEFAULTOPS.singleDefaultHeight
      return modelParam
    },
    controlSingleHeadShow(flag) { // 控制单兵头像的显隐
      let realSingles = [...this.realSingleMap3D.values()] // 实时单兵数组
      if (this.isSinglePawn && flag) {
        for (let singleItem of realSingles) {
          const headEntity = utils.getEntity('head' + singleItem.id, this.$context)
          if (headEntity) { headEntity.show = true } else {
            utils.addSingleHead(singleItem, this.$context)
          }
        }
      } else {
        for (let singleItem of realSingles) {
          const headEntity = utils.getEntity('head' + singleItem.id, this.$context)
          if (headEntity) { headEntity.show = false }
        }
      }
    }
  },
  created() {
    this.keyTypes = mapUtil.getKeyType()
    this.getAppMapOrgTree().then(res => {
      this.mapOrgTree = [res]
    })
  }
}
</script>
<style lang="less" scoped>
  .panel-search {
    width: 272px;
    position: absolute;
    top: 24px;
    left: 24px;
    z-index: 9;
    .search {
      width: 100%;
      height: 40px;
      line-height: 40px;
      display: flex;
      .input {
        flex: auto;
        border: none;
        background: rgba(15, 35, 67, .8);
        color: #fff;
        outline:none;
        font-size: 14px;
        text-indent: 14px;
      }
      .btn {
        flex: 0 0 40px;
        border: none;
        font-size: 20px;
        background: rgba(15, 35, 67, .8);
        color: #4699f9;
        outline:none;
        cursor: pointer;
      }
    }
    .tab {
      width: 100%;
      // transition: all .3s ease;
      display: flex;
      flex-direction: column;
      &.hidden {
        display: none;
      }
      .tab-list {
        display: flex;
        height: 32px;
        line-height: 32px;
        margin: 8px 0;
        flex-direction: row;
        background: rgba(15, 35, 67, .8);
        align-items: center;
        li {
          flex: auto;
          height: 26px;
          line-height: 26px;
          text-align: center;
          color: rbga(200, 200, 200, .8);
          cursor: pointer;
          &.active {
            color: #4699f9;
          }
          &:first-child {
            border-right: 1px solid rgba(58, 90, 139, 0.4);
          }
        }
      }
      .content {
        width: 100%;
        height: 500px;
        padding: 0 0 0 14px;
        color: #fff;
        background: rgba(15, 35, 67, .8);
        & > * {
          height: 100%;
        }
        .point-control {
          height: 100%;
          display: flex;
          flex-direction: column;
          .line {
            flex: 1 0 auto;
            display: flex;
            flex-direction: row;
            justify-content: center;
            .item {
              flex: 1;
              display: flex;
              align-items: center;
              .numberInput {
                width: 50px;
              }
            }
            .title-icon {
              flex: 0 0 40px;
              .iconfont {
                font-size: 24px;
              }
            }
          }
        }
      }
    }
  }
.iconIsOuter i {
  color: #25790f;
}
</style>
