<template>
  <div class="panel-search" v-if="!isPlatformTrack">
    <div class="search">
      <input v-model="searchTree" @focus="isExpand = true" type="text" class="input" placeholder="请输入..."  :disabled="!['structure', 'video'].includes(activeTab)"/>
      <button class="btn" @click="isExpand = !isExpand" :title="isExpand ? '收起' : '打开'">
        <Icon :type="isExpand ? 'arrow-up-b' : 'arrow-down-b'"></Icon>
      </button>
    </div>
    <div class="tab" :class="{'hidden': !isExpand}">
      <ul class="tab-list">
        <li :class="{'active': activeTab === 'structure'}" @click="changeActiveTab('structure')"><i class="iconfont icon-ditujiegou" title="地图结构"></i></li>
        <li :class="{'active': activeTab === 'video'}" @click="changeActiveTab('video')"><i class="iconfont icon-shipin" title="视频资源"></i></li>
        <li :class="{'active': activeTab === 'point'}" @click="changeActiveTab('point')"><i class="iconfont icon-tuceng" title="点位元素"></i></li>
        <li :class="{'active': activeTab === 'filter'}" @click="changeActiveTab('filter')"><i class="iconfont icon-guolvqi" title="报警过滤"></i></li>
      </ul>
      <section class="content">
        <div v-if="activeTab === 'structure'">
          <bs-scroll ref="mapTreeScroll" class="mapTree">
            <Tree-Search :treeData="mapOrgTree[0]||{}" ref="tree" :searchVal="searchTree" @node-click='handleNode' isSearch @on-expand="$refs.mapTreeScroll.update()">
              <template slot-scope="{ node }">
                <span class="item tree-line" :title="node.name">
                  <i class=" iconfont" :class="node.type ? iconList[node.type].icon:iconList.default.icon" :title="node.type ? iconList[node.type].title:iconList.default.title"></i>
                  <i style="font-style:normal">{{node.name}}</i>
                  <i class="icon iconfont icon-video-gun videoNum" :title="node.videoCount" v-if="node.videoCount || node.videoCount === 0"> {{node.videoCount}} </i>
                  </span>
              </template>
            </Tree-Search>
          </bs-scroll>
        </div>
        <div v-if="activeTab === 'video'">
          <!-- <bs-scroll ref="mapVideoTreeScroll" class="mapTree">
            <Tree-Search :treeData="mapVideoSourceList[0] || {}" ref="videoTree" :searchVal="searchTree" isSearch  @node-click='handleClickVideo' @node-dblclick='handleDBClickVideo' @on-expand="$refs.mapVideoTreeScroll.update()">
              <template slot-scope="{ node }">
                <span class="item" :title="node.name" :class="{isInMap: (node.point || node.point3D), isOffline: (node.point && !node.status)}">
                  <i class=" iconfont" :class="node.hasOwnProperty('monitoryPointGenera') && inorIPCTypes.includes(node.monitoryPointGenera) ? inorIPCIconList[node.monitoryPointGenera].icon : (node.hasOwnProperty('monitortype') ? iconList[node.monitortype].icon : iconList.default.icon)"
                  :title="node.hasOwnProperty('monitoryPointGenera') && inorIPCTypes.includes(node.monitoryPointGenera) ? inorIPCIconList[node.monitoryPointGenera].title : (node.hasOwnProperty('monitortype') ? iconList[node.monitortype].title : iconList.default.title)">
                  </i>
                  {{node.name}}</span>
              </template>
            </Tree-Search>
          </bs-scroll> -->
          <BStreeNewBox ref="treebox" :iconToggle="false" :searchToggle="false" :searchType="0" :searchVal="searchTree" :equipmentToggle="false" :resourceToggle="true" :orgType="0" :resType="[0]" mapSpecial="2D" @clickData="handleClickVideo" @dbclickData="handleDBClickVideo" :newField="queryParam"></BStreeNewBox>
        </div>
        <ul v-if="activeTab === 'point'" class="point-control">
          <li class="line">
            <div class="item title-icon" title="视频">
              <i class="iconfont icon-video-gun1"></i>
            </div>
            <div class="item">
              <Checkbox :value="gun" @on-change="updatePointState(['isCamera', 'gun'])">枪机</Checkbox>
            </div>
            <div class="item">
              <Checkbox :value="hemisphere" @on-change="updatePointState(['isCamera', 'hemisphere'])">半球</Checkbox>
            </div>
            <div class="item">
              <Checkbox :value="fastBall" @on-change="updatePointState(['isCamera', 'fastBall'])">快球</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item" style>
              <Checkbox :value="panorama" @on-change="updatePointState(['isCamera', 'panorama'])">全景</Checkbox>
            </div>
            <div class="item">
              <Checkbox :value="infraRed" @on-change="updatePointState(['isCamera', 'infraRed'])">红外枪机</Checkbox>
            </div>
            <div class="item">
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :value="verface" @on-change="updatePointState(['isCamera', 'verface'])">人脸抓拍</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :value="traffic" @on-change="updatePointState(['isCamera', 'traffic'])">交通抓拍</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :value="visualField" @on-change="updatePointState(['isCamera', 'visualField'])">可视域</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon" title="报警">
              <i class="iconfont icon-baojing2"></i>
            </div>
            <div class="item">
              <Checkbox :value="alarm" @on-change="updatePointState(['isAlarm', 'alarm'])">普通报警</Checkbox>
            </div>
            <div class="item">
              <Checkbox :value="fireControl" @on-change="updatePointState(['isAlarm', 'fireControl'])">消防报警</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :value="alarmColumn" @on-change="updatePointState(['isAlarm', 'alarmColumn'])">报警柱</Checkbox>
            </div>
            <div class="item">
              <Checkbox :value="alarmBox" @on-change="updatePointState(['isAlarm', 'alarmBox'])">报警箱</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon" title="巡更">
              <i class="iconfont icon-danbinbaojing"></i>
            </div>
            <div class="item">
              <Checkbox :value="isPoint" @on-change="updatePointState(['isPoint'])">巡更点位</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon" title="门禁">
              <i class="iconfont icon-menjin1"></i>
            </div>
            <div class="item">
              <Checkbox :value="isDoorControl" @on-change="updatePointState(['isDoorControl'])">门禁点位</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon" title="单兵">
              <i class="iconfont icon-yidongdanbing"></i>
            </div>
            <div class="item">
              <Checkbox :value="removeSingle" @on-change="handleIsSingleChange">移动单兵</Checkbox>
            </div>
            <div class="item">
              <Checkbox :value="singlePic" :disabled="!removeSingle" @on-change="updatePointState(['isSingle', 'singlePic'])">单兵头像</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon" title="单兵分组">
            </div>
            <div class="item">
              <label>分组显示</label>
              <Select style="margin: 0 24px; width: 124px;" :value="singleGroupId" placeholder="全部" :disabled="!removeSingle" @on-change="handleSingleOrgChange">
                <Option v-for="item in singleOrgList" :value="item._id" :key="item._id">{{ item.name }}</Option>
              </Select>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon" title="名称标签">
              <i class="iconfont icon-biaoqian"></i>
            </div>
            <div class="item">
              <Checkbox :value="isNameTitle" @on-change="updatePointState(['isNameTitle'])">名称标签</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon" title="信息面板位置">
              <i class="iconfont icon-127"></i>
            </div>
            <div class="item">
              <Radio :value="!isInfoPanelFixed" @on-change="updatePointState(['isInfoPanelFixed'])">悬浮</Radio>
            </div>
            <div class="item">
              <Radio :value="isInfoPanelFixed" @on-change="updatePointState(['isInfoPanelFixed'])">固定</Radio>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon" title="楼宇">
              <i class="iconfont icon-loufangdianwei"></i>
            </div>
            <div class="item">
              <Checkbox :value="isBuilding" @on-change="updatePointState(['isBuilding'])">楼宇</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon" title="网格">
              <i class="iconfont icon-grid"></i>
            </div>
            <div class="item">
              <Checkbox :value="isGrid" @on-change="updatePointState(['isGrid'])">网格</Checkbox>
            </div>
          </li>
        </ul>
        <ul v-if="activeTab === 'filter'" class="point-control">
          <li class="line">
           <div class="item">
              <Checkbox :value="filterState.isCommonAlarm.checked" @on-change="updateFilterState(['isCommonAlarm'])">普通报警</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledCom" :value="filterState.isCommonAlarm.alarmInput" @on-change="updateFilterState(['isCommonAlarm', 'alarmInput'])">报警输入</Checkbox>
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber class="numberInput" size="small" :disabled="disabledCom" :max="9" :min="1" :value="filterLevel.alarmInputLevel" v-model="alarmInputLevel" @on-change="updateFilterLevel(['alarmInputLevel', alarmInputLevel])"></InputNumber>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledCom" :value="filterState.isCommonAlarm.alarmSector" @on-change="updateFilterState(['isCommonAlarm', 'alarmSector'])">报警防区</Checkbox>
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber class="numberInput" size="small" :disabled="disabledCom" :max="9" :min="1" :value="filterLevel.alarmSectorLevel" v-model="alarmSectorLevel" @on-change="updateFilterLevel(['alarmSectorLevel', alarmSectorLevel])"></InputNumber>
            </div>
          </li>
          <li class="line">
           <div class="item">
              <Checkbox :value="filterState.isAlarmVideo.checked" @on-change="updateFilterState(['isAlarmVideo'])">视频报警</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledVid" :value="filterState.isAlarmVideo.alarmPoint" @on-change="updateFilterState(['isAlarmVideo', 'alarmPoint'])">监控点报警</Checkbox>
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber :disabled="disabledVid"  class="numberInput" size="small" :max="9" :min="1" :value="filterLevel.cameraSpearLevel" v-model="cameraSpearLevel" @on-change="updateFilterLevel(['cameraSpearLevel', cameraSpearLevel])"></InputNumber>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledVid" :value="filterState.isAlarmVideo.focusOn" @on-change="updateFilterState(['isAlarmVideo', 'focusOn'])">重点关注</Checkbox>
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber :disabled="disabledVid"  class="numberInput" size="small" :max="9" :min="1" :value="filterLevel.focusOnLevel" v-model="focusOnLevel" @on-change="updateFilterLevel(['focusOnLevel', focusOnLevel])"></InputNumber>
            </div>
          </li>
          <li class="line">
           <div class="item">
              <Checkbox :value="filterState.isIntelligence.checked" @on-change="updateFilterState(['isIntelligence'])">智能报警</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledInt" :value="filterState.isIntelligence.alarmIntelligence" @on-change="updateFilterState(['isIntelligence', 'alarmIntelligence'])">智能报警</Checkbox>
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber :disabled="disabledInt" class="numberInput" size="small" :max="9" :min="1" :value="filterLevel.intelligenceLevel" v-model="intelligenceLevel" @on-change="updateFilterLevel(['intelligenceLevel', intelligenceLevel])"></InputNumber>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledInt" :value="filterState.isIntelligence.alarmPeccancy" @on-change="updateFilterState(['isIntelligence', 'alarmPeccancy'])">违章报警</Checkbox>
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber :disabled="disabledInt" class="numberInput" size="small" :max="9" :min="1" :value="filterLevel.peccancyLevel" v-model="peccancyLevel" @on-change="updateFilterLevel(['peccancyLevel', peccancyLevel])"></InputNumber>
            </div>
          </li>
           <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledInt" :value="filterState.isIntelligence.faceOn" @on-change="updateFilterState(['isIntelligence', 'faceOn'])">人像布控</Checkbox>
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber :disabled="disabledInt" class="numberInput" size="small" :max="9" :min="1" :value="filterLevel.faceLevel" v-model="faceLevel" @on-change="updateFilterLevel(['faceLevel', faceLevel])"></InputNumber>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <!-- <div class="item">
              折叠显示
                <i-switch :disabled="disabledInt" :value="isFold" @on-change="updateSwitchFilterState('isFold')"></i-switch>
            </div> -->
            <div class="item">
               抓拍图片
                <i-switch :disabled="disabledInt || isFaceAlarmTrack || showDrawTrack2D" :value="isFaceSnap" @on-change="updateSwitchFilterState('isFaceSnap')"></i-switch>
            </div>
          </li>
          <li class="line">
            <div class="item">
              <Checkbox :value="filterState.isAlarmHelp.checked" @on-change="updateFilterState(['isAlarmHelp'])">报警求助</Checkbox>
            </div>
            <div class="item title-icon">
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber :disabled="disabledAlarmHelp" class="numberInput" size="small" :max="9" :min="1" :value="filterLevel.alarmHelpLevel" v-model="alarmHelpLevel" @on-change="updateFilterLevel(['alarmHelpLevel', alarmHelpLevel])"></InputNumber>
            </div>
          </li>
          <li class="line">
            <div class="item">
              <Checkbox :value="filterState.isFireControl.checked" @on-change="updateFilterState(['isFireControl'])">消防报警</Checkbox>
            </div>
            <div class="item title-icon">
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber :disabled="disabledFir" class="numberInput" size="small" :max="9" :min="1" :value="filterLevel.fireControlLevel" v-model="fireControlLevel" @on-change="updateFilterLevel(['fireControlLevel', fireControlLevel])"></InputNumber>
            </div>
          </li>
          <li class="line">
            <div class="item">
              <Checkbox :value="filterState.isAlarmSingle.checked" @on-change="updateFilterState(['isAlarmSingle'])">单兵报警</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledSing" :value="filterState.isAlarmSingle.singleOneKey" @on-change="updateFilterState(['isAlarmSingle', 'singleOneKey'])">单兵一键报警</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledSing" :value="filterState.isAlarmSingle.alarmPatrol" @on-change="updateFilterState(['isAlarmSingle', 'alarmPatrol'])">巡更异常上报</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item">
              <div style="margin: 0 auto;">
                  自动定位
                <i-switch :value="isAutoPosition" @on-change="updateSwitchState('isAutoPosition')"></i-switch>
              </div>
              <div style="margin: 0 auto;">
                应急预案
                <!-- <i-switch :value="filterState.isPlan.checked" @on-change="changeFilter(['isPlan'])"></i-switch> -->
                <i-switch :value="isEmergency" @on-change="updateSwitchState('isEmergency')"></i-switch>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
import { RESOURCETYPE, CAMERATYPE } from 'assets/2DMap/meta/common'
import BStreeNewBox from 'components/BStreeNew/BStreeNewBox'
export default {
  components: {
    BStreeNewBox
  },
  data() {
    return {
      isExpand: false,
      activeTab: 'structure',
      searchTree: '',
      activeNodeId: '',
      options: {
        showSearch: false,
        showOpenPreview: false,
        showOpenAllPreview: false,
        showCollection: false,
        showPoint: '2d'
      },
      mapOrgTree: [],
      inorIPCTypes: [CAMERATYPE.verfaceipc, CAMERATYPE.trafficipc], // 非普通IPC类型
      inorIPCIconList: { // 非普通IPC图标列表
        1: {icon: 'icon-renxiangshibie', title: '人脸抓拍'},
        2: {icon: 'icon-jiaotongshibie', title: '交通抓拍'}
      },
      iconList: {
        0: {icon: 'icon-qiangji', title: '枪机'},
        1: {icon: 'icon-hongwaiqiangji', title: '红外枪机'},
        2: {icon: 'icon-banqiu', title: '半球'},
        3: {icon: 'icon-kuaiqiu', title: '快球'},
        4: {icon: 'icon-quanjing', title: '全景'},
        grid: {icon: 'icon-grid', title: '网格'},
        building: {icon: 'icon-loufangdianwei', title: '楼宇'},
        storey: {icon: 'icon-tuceng', title: '楼层'},
        patrol: {icon: 'icon-dianzixungeng', title: '巡更点位'},
        default: {icon: 'icon-organise', title: '机构'}
      },
      alarmInputLevel: 1, // 报警输入
      alarmSectorLevel: 1, // 报警防区
      cameraSpearLevel: 1, // 监控点报警
      focusOnLevel: 1, // 重点关注
      intelligenceLevel: 1, // 智能报警
      peccancyLevel: 1, // 违章报警
      faceLevel: 1, // 人像布控
      alarmHelpLevel: 1, // 报警求助
      fireControlLevel: 1, // 消防报警
      singleOrgList: [],
      queryParam: '&mapType=2D'
    }
  },
  computed: {
    ...mapState({
      mapVideoSourceList: ({ mapPoint }) => mapPoint.mapSourceList, // 资源树
      filterState: ({map2DApplyIX}) => map2DApplyIX.filterState,
      filterLevel: ({map2DApplyIX}) => map2DApplyIX.filterLevel,
      pointState: ({map2DApplyIX}) => map2DApplyIX.pointState,
      activeMapConfig: ({ mapIndex }) => mapIndex.activeMapConfig,
      currentFloor: ({ mapArea }) => mapArea.currentFloor,
      selectedFaceAlarmArr: ({ mapAlarm }) => mapAlarm.selectedFaceAlarmArr, // 选中的人脸报警数据数组
      showDrawTrack2D: ({ mapIndex }) => mapIndex.showDrawTrack2D // 2D绘制轨迹的显示状态
    }),
    ...mapGetters('map2DApplyIX', [
      'isEmergency', // 是否开启应急预案开关
      'gun', // 摄像头
      'hemisphere',
      'fastBall',
      'panorama',
      'infraRed',
      'verface',
      'traffic',
      'visualField',
      'alarm',
      'fireControl',
      'alarmColumn',
      'alarmBox',
      'isPoint',
      'isDoorControl',
      'removeSingle',
      'singlePic',
      'singleGroupId',
      'isNameTitle',
      'isInfoPanelFixed',
      'isBuilding',
      'isGrid',
      'isFold', // 折叠显示开关
      'isFaceSnap', // 抓拍图片开关
      'isAutoPosition',
      'isPlatformTrack'
    ]),
    ...mapGetters(['activeMapConfig', 'isMapOuter']),
    disabledCom() { // 普通报警
      return !this.filterState.isCommonAlarm.checked
    },
    disabledVid() { // 视频报警
      return !this.filterState.isAlarmVideo.checked
    },
    disabledInt() { // 智能报警
      return !this.filterState.isIntelligence.checked
    },
    disabledAlarmHelp() { // 报警求助
      return !this.filterState.isAlarmHelp.checked
    },
    disabledFir() { // 消防报警
      return !this.filterState.isFireControl.checked
    },
    disabledSing() { // 移动单兵
      return !this.filterState.isAlarmSingle.checked
    },
    isFaceAlarmTrack() { // 是否启用人脸报警轨迹
      let flag = Boolean(this.selectedFaceAlarmArr && this.selectedFaceAlarmArr.length)
      return flag
    }
  },
  watch: {
    isExpand(val) {
      this.CHANGE_IS_EXPAND_LEFT_TREE(val)
    },
    activeMapConfig: {
      handler(val) {
        if (val && val.mapId) {
          this.queryParam = val.mapId ? '&mapId=' + val.mapId : ''
          this.setMapPreviewPointList([])
          this.setAreaDrawActive(false)
          if (this.isPlatformTrack) {
            this.switchToolsPanel(true)
            this.changeToolsPanelToBoxChoose('boxChoose')
          } else {
            this.changeToolsPanelToBoxChoose('')
            this.switchToolsPanel(false)
          }
          this.changeShowDrawTrack2D(false)
          this.getMapOrg(val.mapId).then(res => {
            this.mapOrgTree = [res]
          })
        } else {
          this.queryParam = ''
        }
        this.queryParam += '&mapType=2D'
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getMobilePatrolOrgList().then(res => {
      let orgList = res.filter(org => !org.isroot)
      orgList.splice(0, 0, {_id: '', name: '全部'})
      // console.log('获取到的单兵机构列表数据：', JSON.parse(JSON.stringify(orgList)))
      this.singleOrgList = orgList
    })
    const pointState = window.localStorage.getItem('2DPointState')
    if (pointState && pointState !== 'undefined') {
      this.savePoint(pointState)
    } else {
      window.localStorage.setItem('2DPointState', JSON.stringify(this.pointState))
    }
  },
  methods: {
    ...mapMutations('map2DApplyIX', ['CHANGE_IS_EXPAND_LEFT_TREE']),
    ...mapMutations(['SET_SELECTED_ATTR']),
    ...mapActions('map2DApplyIX', ['savePoint', 'changeFilter', 'changePoint', 'switchToolsPanel', 'changeToolsPanelToBoxChoose',
      'changeAlarmFilterLeavel', 'switchEmergency', 'switchIsFold', 'switchFaceSnap', 'changeSingleGroupId', 'changeIsSinglePic', 'switchAutoPosition']),
    ...mapActions(['getMapOrg', 'setIsMapOuter', 'getFoorById', 'setCurrentFloor', 'getGridDataById', 'getBuildingDataById', 'setSelectedTreeNode', 'setCurrentGrid',
      'setCurrentBuilding', 'setMapPreviewPointList', 'setAreaDrawActive',
      'clearPointFeatures',
      'clearAreaFeatures',
      'setShowSingleHeads2D',
      'getCommonPointResById',
      'updatePointVideoList',
      'getCommonResourceById',
      'setSelectedMapPointRes',
      'getMobilePatrolOrgList',
      'changeShowDrawTrack2D' // 改变2D轨迹绘制显示
    ]),
    changeActiveTab(tab) { // 改变激活的tab项
      let isRefresh = ['video'].includes(this.activeTab) // 判断是否是懒加载树，懒加载树需要刷新
      this.activeTab = tab
      this.$nextTick(() => {
        if (isRefresh) { // tab 从非懒加载树切回去 会造成组件自己刷新 故不能再调刷新
          let treebox = this.$refs.treebox
          treebox && treebox.$refs.treeLazy && treebox.$refs.treeLazy.refresh && treebox.$refs.treeLazy.refresh()
        }
      })
      this.searchTree = ''
      if (tab === 'filter') {
        this.alarmInputLevel = this.filterLevel.alarmInputLevel
        this.alarmSectorLevel = this.filterLevel.alarmSectorLevel
        this.cameraSpearLevel = this.filterLevel.cameraSpearLevel
        this.focusOnLevel = this.filterLevel.focusOnLevel
        this.intelligenceLevel = this.filterLevel.intelligenceLevel
        this.peccancyLevel = this.filterLevel.peccancyLevel
        this.faceLevel = this.filterLevel.faceLevel
        this.alarmHelpLevel = this.filterLevel.alarmHelpLevel
        this.fireControlLevel = this.filterLevel.fireControlLevel
      }
    },
    handleIsSingleChange(flag) { // 改变单兵显隐状态变化
      this.changeIsSinglePic(flag)
      this.changePoint(['isSingle', 'removeSingle'])
      window.localStorage.setItem('2DPointState', JSON.stringify(this.pointState))
    },
    async handleSingleOrgChange(value) { // 处理选中单兵机构变化
      await this.changeSingleGroupId(value) // 改变单兵所在机构的标识
      window.localStorage.setItem('2DPointState', JSON.stringify(this.pointState))
    },
    handleNode(node) { // 处理点击树节点
      this.setSelectedTreeNode(node)
      if (node.type === RESOURCETYPE.grid) { // 网格
        this.getGridDataById(node._id).then(gridRes => { // 根据标识获取网格数据
          this.setCurrentGrid(gridRes)
          if (gridRes.sid) { // 楼内网格
            if (!(this.currentFloor && this.currentFloor._id === gridRes.sid)) {
              this.clearAreaFeatures() // 清空区域要素
              this.clearPointFeatures() // 清空点位要素
              this.getFoorById(gridRes.sid).then(floorRes => { // 根据标识获取楼层数据
                this.setCurrentFloor(floorRes)
                if (this.isMapOuter) {
                  this.setShowSingleHeads2D([])
                  this.setIsMapOuter(false)
                }
              })
            }
          } else if (!this.isMapOuter) {
            this.clearAreaFeatures() // 清空区域要素
            this.clearPointFeatures() // 清空点位要素
            this.setIsMapOuter(true)
          }
        })
      } else if (node.type === RESOURCETYPE.building) { // 楼宇
        this.getBuildingDataById(node._id).then(res => { // 根据标识获取楼宇数据
          this.setCurrentBuilding(res)
          if (!this.isMapOuter) {
            this.clearAreaFeatures() // 清空区域要素
            this.clearPointFeatures() // 清空点位要素
            this.setIsMapOuter(true)
          }
        })
      } else if (node.type === RESOURCETYPE.floor) { // 楼层
        if (!(this.currentFloor && this.currentFloor._id === node._id)) {
          this.getFoorById(node._id).then(res => { // 根据标识获取楼层数据
            this.clearAreaFeatures() // 清空区域要素
            this.clearPointFeatures() // 清空点位要素
            this.setCurrentFloor(res)
            if (this.isMapOuter) {
              this.setShowSingleHeads2D([])
              this.setIsMapOuter(false)
            }
          })
        }
      }
    },
    handleClickVideo(node) { // 单击视频资源节点
      // console.log('单击视频资源节点：', node)
      if (node.isOrg) { // 点击机构时不进行处理
        return
      }
      this.setSelectedTreeNode(node)
      this.SET_SELECTED_ATTR(null)
      if (node.type === RESOURCETYPE.video) {
        this.getCommonResourceById(node._id).then(videoRes => {
          // console.log('单击的视频资源数据：', videoRes)
          this.setSelectedMapPointRes(videoRes)
          if (videoRes.point) { // 资源已添加到地图中
            if (!videoRes.point.isouter && videoRes.point.sid) { // 楼层内点位
              if (!(this.currentFloor && this.currentFloor._id === videoRes.sid)) { // 视频资源所在楼层不是当前楼层时
                this.clearAreaFeatures() // 清空区域要素
                this.clearPointFeatures() // 清空点位要素
                this.getFoorById(videoRes.point.sid).then(floorRes => { // 根据标识获取楼层数据
                  this.setCurrentFloor(floorRes) // 更新当前楼层
                  if (this.isMapOuter) { // 当前地图是楼外时
                    this.setShowSingleHeads2D([])
                    this.setIsMapOuter(false) // 切换地图到楼层
                  }
                })
              }
            } else if (!this.isMapOuter) { // 楼外地图点位，当地图不是楼外时
              this.clearAreaFeatures() // 清空区域要素
              this.clearPointFeatures() // 清空点位要素
              this.setIsMapOuter(true) // 切换地图到楼外
            }
          }
        })
      }
    },
    handleDBClickVideo(node) { // 双击视频资源节点
      // console.log('双击视频资源节点：', node)
      if (node.isOrg) { // 点击机构时不进行处理
        return
      }
      if (node.type === RESOURCETYPE.video) {
        this.getCommonPointResById(node._id).then(res => {
          if (res && res.point) { // 已添加设备
            if (res.status) { // 设备在线
              let eid = res.eid
              if (eid && (!eid.hasOwnProperty('deviceStatus') || eid.deviceStatus)) { // 设备启用
                this.updatePointVideoList(res) // 预览视频
              } else {
                this.warningMsg('该设备已禁用!')
              }
            } else {
              this.warningMsg('该设备不在线!')
            }
          }
        })
      }
    },
    updatePointState(arr) {
      this.changePoint(arr)
      window.localStorage.setItem('2DPointState', JSON.stringify(this.pointState))
    },
    updateFilterState(arr) {
      this.changeFilter(arr)
      window.localStorage.setItem('alarm2DFilterState', JSON.stringify(this.filterState))
    },
    updateFilterLevel(arr) {
      this.changeAlarmFilterLeavel(arr)
      window.localStorage.setItem('alarm2DFilterLevel', JSON.stringify(this.filterLevel))
    },
    updateSwitchFilterState(type) {
      if (type === 'isFold') {
        this.switchIsFold(!this.isFold)
      } else if (type === 'isFaceSnap') {
        this.switchFaceSnap(!this.isFaceSnap)
      }
      window.localStorage.setItem('alarm2DFilterState', JSON.stringify(this.filterState))
    },
    updateSwitchState(type) {
      if (type === 'isAutoPosition') {
        this.switchAutoPosition(!this.isAutoPosition)
      } else if (type === 'isEmergency') {
        this.switchEmergency(!this.isEmergency)
      }
      const switchStatus = {
        isAutoPosition: this.isAutoPosition,
        isEmergency: this.isEmergency
      }
      window.localStorage.setItem('alarm2Dswitch', JSON.stringify(switchStatus))
    }
  }
}
</script>
<style lang="less" scoped>
  .isOffline {
    color: #4f6281;
  }
  .isInMap i {
    color: #25790f;
    margin-right: 4px;
  }
  .panel-search {
    width: 275px;
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
          i {
            font-size: 20px;
          }
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
        height: 650px;
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
              line-height: 36px;
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
  .tree-line {
    width: 100%;
    padding: 0 50px 0 3px !important;
    display: inline-block;
    position: relative;
    vertical-align: bottom;
  }
  .videoNum {
    font-style:normal;
    display: inline-block;
    position: absolute;
    right: 0;
    width: 50px;
    line-height: 35px;
    text-align: left;
    vertical-align: bottom;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 12px;
  }
  .videoNum:before {
    color: #25790f;
    font-size: 16px;
  }
</style>
