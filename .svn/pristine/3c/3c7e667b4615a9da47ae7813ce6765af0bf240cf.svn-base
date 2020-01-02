<!--编辑模式 网格、楼宇业务逻辑-->
<script>
import { mapState, mapMutations } from 'vuex'
import areaUtil from '../../../../../assets/map/areaUtil'
import layerConfig from '../../../../../assets/map/MapConfig.js'
import areaStyle from '../../../style/areaStyle'
export default {
  data() {
    return {
      styleDefault: JSON.parse(JSON.stringify(areaStyle.styleDefault)),
      styleActive: {},
      gridHightStyle: areaStyle.gridHighLight,
      buildHightStyle: areaStyle.buildHighLight
    }
  },
  computed: {
    ...mapState({
      mapEditRightPage: ({ mapPageState }) => mapPageState.mapEditRightPage.page, // 编辑模式地图右侧页面详细
      areaLoc: ({ mapAreaData }) => mapAreaData.areaLoc,
      isDrawArea: ({ mapAreaData }) => mapAreaData.isDrawArea, // 区域绘制
      gridList: ({ mapGisData }) => mapGisData.gridList, // 网格列表
      buildList: ({ mapGisData }) => mapGisData.buildList, // 楼宇列表
      gridData: ({ mapGisData }) => mapGisData.gridData, // 单个网格信息
      buildData: ({ mapGisData }) => mapGisData.buildData, // 单个楼宇信息
      areaStyleCss: ({ mapAreaData }) => mapAreaData.areaStyle
    })
  },
  watch: {
    // 绘制区域
    isDrawArea(val) {
      this.mapArea.actived = val
      if (val) {
        this.$store.commit('SET_EDITVEDIODRAW_STATE', false) // 关闭添加视频点位的控件
        let param = areaUtil.initAreaValByPage({ page: this.mapEditRightPage, val })
        const { id, gridStyle, layerStyle, actived } = param
        this.mapArea.id = id
        this.mapArea.actived = actived
        this.mapArea.gridStyle = areaUtil.convertStyleToSymbol(gridStyle, JSON.parse(JSON.stringify(this.styleDefault)))
        this.mapArea.layerStyle = areaUtil.convertStyleToSymbol(
          layerStyle,
          JSON.parse(JSON.stringify(this.styleDefault))
        )
      }
      if (!val) {
        this.$refs.mapEditContainer[0].clearLayerFeatures(this.mapArea.id)
      }
    },
    gridList(val) {
      this.gridFeatures = []
      if (val) {
        this.gridFeatures = areaUtil.areaManage(val, areaStyle.gridStyle, layerConfig.gridType)
      }
    },
    gridData(val) {
      if (this.mapEditRightPage === 'gridEditPage') {
        if (val.style) {
          areaStyle.gridHighLight = areaUtil.convertStyleToSymbol(areaStyle.gridHighLight, val.style)
        }
        this.editArea(val, areaStyle.gridHighLight, layerConfig.gridType)
      }
      this.centerTurn(val)
      this.$store.commit('SET_EDITVEDIODRAW_STATE', false) // 关闭添加视频点位的控件
    },
    buildList(val) {
      this.buildFeatures = []
      if (val) {
        this.buildFeatures = areaUtil.areaManage(val, areaStyle.buildStyle, layerConfig.buildType)
      }
    },
    buildData(val) {
      this.editArea(val, areaStyle.buildHighLight, layerConfig.buildType)
      this.centerTurn(val)
      this.$store.commit('SET_EDITVEDIODRAW_STATE', false) // 关闭添加视频点位的控件
      this.$store.commit('SET_AREA_ADD', false) // 关闭绘制区域的控件
      let obj = areaUtil.getMultiPExtentAndCenter(val.loc)
      this.$store.commit('SET_ACTIVEEXTENT_DATA', obj)
    },
    // 区域样式变化
    areaStyleCss(val) {
      let style = JSON.parse(JSON.stringify(val))
      this.styleActive = JSON.parse(JSON.stringify(style))
      this.mapArea.gridStyle = areaUtil.convertStyleToSymbol(this.mapArea.gridStyle, style)
      this.mapArea.layerStyle = areaUtil.convertStyleToSymbol(this.mapArea.layerStyle, style)
      if (this.editControlFeature) {
        if (this.mapEditRightPage === 'gridEditPage') {
          let gridArea = JSON.parse(JSON.stringify(this.gridData))
          gridArea.style = style
          if (this.areaLoc) {
            gridArea.loc = this.areaLoc
          }
          this.editArea(gridArea, this.gridHightStyle, layerConfig.gridType)
        }
        if (this.mapEditRightPage === 'buildEditPage') {
          let buildArea = JSON.parse(JSON.stringify(this.buildData))
          if (this.areaLoc) {
            buildArea.loc = this.areaLoc
          }
          buildArea.style = style
          this.editArea(buildArea, this.buildHightStyle, layerConfig.buildType)
        }
      }
    }
  },
  methods: {
    ...mapMutations([
      'SET_EDITRIGHTPAGE_STATE',
      'SET_AREA_LOC', // 设置区域位置信息
      'SET_AREA_ADD'
    ]),
    centerTurn(val) {
      const coods = val.center.split(',')
      this.activeMapCenter = [parseFloat(coods[0]), parseFloat(coods[1])]
      this.posi = { lon: parseFloat(coods[0]), lat: parseFloat(coods[1]) }
    },
    editArea(val, style, type) {
      this.editFeatures = []
      style = JSON.parse(JSON.stringify(style))
      if (val.style) {
        style = areaUtil.convertStyleToSymbol(style, val.style)
      }
      style.textStyle.label = type.label + ':' + val.name
      this.editFeatures.push({
        geom: {
          type: 'MultiPolygon',
          points: val.loc
        },
        symbol: style,
        attributes: {
          id: val._id,
          type: type.value
        }
      })
      this.$nextTick(() => {
        if (this.$refs.edit.length > 0) {
          const vector = this.$refs.edit[0].getFeatureById(val._id)
          this.editActive = true
          this.editControlFeature = vector.feature
          this.activeArea = vector
        }
      })
    },
    areaModifyEndEvt(coods) {
      let loc = areaUtil.consistMuPolyCoods(coods)
      let obj = areaUtil.consistParam({
        id: this.activeArea.attributes.id,
        loc,
        gridFeatures: this.gridFeatures,
        buildFeatures: this.buildFeatures,
        page: this.mapEditRightPage,
        pageState: 'edit'
      })
      this.checkInterArea(obj)
    },
    checkInterArea(obj) {
      const { loc, id, featureArr, page, pageModel } = obj
      let isObj = areaUtil.checkInterArea({ loc, id, featureArr })
      let content = ''
      if (isObj.isSelfIn || isObj.isIn || isObj.isInter) {
        if (pageModel === 'show') {
          content = '<p>绘制区域自相交或相交，请重新绘制</p>'
        } else {
          content = '<p>绘制区域自相交或相交，请重新编辑</p>'
        }
        let param = { content, page, pageModel }
        this.areaInterConfirm(param)
      } else {
        this.$store.commit('SET_AREA_LOC', loc)
      }
    },
    // 添加区域
    addArea(val) {
      let loc = areaUtil.locSwitch(val, this.areaLoc)
      let obj = areaUtil.consistParam({
        id: 'add',
        loc,
        gridFeatures: this.gridFeatures,
        buildFeatures: this.buildFeatures,
        page: this.mapEditRightPage,
        pageState: 'show'
      })
      obj && this.checkInterArea(obj)
    },
    // 网格或楼宇弹框按钮事件
    areaInterConfirm(obj) {
      const { content, page, pageModel } = obj
      this.$Modal.confirm({
        title: '警告',
        content,
        onOk: () => {
          this.$store.commit('SET_AREA_ADD', false)
          this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: page, detail: pageModel })
        },
        onCancel: () => {
          this.$store.commit('SET_AREA_ADD', false)
          this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: page, detail: pageModel })
        }
      })
    }
  },
  beforeDestroy() {
    this.mapArea.actived = false
  }
}
</script>
