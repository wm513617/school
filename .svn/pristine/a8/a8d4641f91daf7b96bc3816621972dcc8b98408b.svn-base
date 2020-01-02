/* eslint-disable new-cap */
/* eslint-disable no-undef */
// 地图基础控制逻辑
export default {
  data() {
    return {
      zoomControl: null
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    // 加载蜂鸟地图
    loadFengMap() {
      // 初始化地图参数
      var mapOptions = {
        container: document.getElementById('fengMap'), // 必要，地图容器
        mapServerURL: '/fengmap/tile/' + this.fmapID, // 地图数据位置
        mapThemeURL: '/fengmap/theme', // 主题数据位置
        defaultThemeName: 2001, // 默认主题
        // 设置地图数据分层加载时，需要本地离线数据支持，暂不支持在线加载。需要配置tile:true。
        tile: true,
        appName: '中国人民大学',
        key: 'c8477f4ffcd7bb71f0db3ffd4d6a45a4',
        defaultVisibleGroups: [1], // 设置初始显示楼层，数组格式，可单个，可多个
        defaultMapScaleLevel: 18,
        defaultFocusGroup: 1,
        modelHoverEffect: true, // 支持悬停模型高亮，默认为false悬停不高亮
        modelHoverTime: 500, // 悬停时间触发时间，默认1000,参数数值表示毫秒时长
        compassPosition: fengmap.controlPositon.RIGHT_TOP,
        compassOffset: [-14, 40], // 初始指北针的偏移量，[左，上]
        compassSize: 48 // 指北针大小默认配置
        // defaultViewMode:fengmap.FMViewMode.MODE_2D //初始二维还是三维状态，三维状态为MODE_3D
      }
      this.fengMap = new fengmap.FMMap(mapOptions)
      this.fengMap.openMapById(this.fmapID, (error) => { console.log(error) }) // 打开Fengmap服务器的地图数据和主题
      this.fengMap.showCompass = true
      // --------------------------------------监听地图事件------------------------------------------
      this.fengMap.on('loadComplete', this.handleMaploadComplete) // 地图加载完成
      this.fengMap.on('mapClickNode', this.handleMapClickNode) // 地图点击事件
      this.fengMap.on('mapScaleLevelChanged', this.handleMapScaleLevelChanged) // 比例尺级别改变事件，地图的比例尺级别,默认 1~29 级
      this.fengMap.on('mapHoverNode', this.handleMapHoverNode) // 模型悬停事件
      this.fengMap.pickFilterFunction = this.handlePickFilterFunction // 过滤不允许点击的地图元素，设置为true为允许点击，设置为false为不允许点击
      this.fengMap.hoverFilterFunction = this.handleHoverFilterFunction // 过滤不允许hover的地图元素，设置为true为允许点击，设置为false为不允许点击
    },
    // 添加放大/缩小控件
    addScaleLevelController() {
      let ctlOpt1 = new fengmap.controlOptions({
        position: fengmap.controlPositon.RIGHT_TOP,
        imgURL: '/static/fengMap/resource/style/wedgets/img/',
        offset: { // 位置x,y的偏移量
          x: -20,
          y: 100
        }
      })
      this.zoomControl = new fengmap.zoomControl(this.fengMap, ctlOpt1)
    },
    // 定位到地图中心
    locateInMapCenter(coordinates, callback) {
      console.log('定位到地图中心！！！')
      let pnt = {
        x: coordinates[0],
        y: coordinates[1],
        groupID: this.fengMap.focusGroupID, // 目标层GroupID
        callback
      }
      this.fengMap.moveTo(pnt) // 地图移动到此位置
    }
  }
}
