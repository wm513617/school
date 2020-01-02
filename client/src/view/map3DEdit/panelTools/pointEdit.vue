<!-- 点位编辑-通用逻辑控制脚本文件 -->
<script>
import { mapState, mapActions } from 'vuex'
import utils from 'assets/3DMap/utils/index'
import gridStyle from 'assets/3DMap/gridStyle.js'

export default {
  data() {
    return {
      selectedModelIndex: 0, // 选中的3D模型索引
      modelList: [], // 模型列表
      selectedIconIndex: 0, // 选中的2D图标索引
      iconList: [], // 图标列表
      selectedTab: 'resource', // 选择选项值
      selectedMapTab: 'basic', // 楼内选项值
      tabOpts: [ // 选项数据数组
        {label: '模型', value: 'model'},
        {label: '资源', value: 'resource'}
      ],
      locFormat: '', // 点位位置格式化信息
      pointInfo: {}, // 点位信息，用于修改
      point3D: null, // 存储未修改的点位信息
      xDelta: 0,
      yDelta: 0
    }
  },
  computed: {
    ...mapState({
      rightPanelType: ({ tdIndex }) => tdIndex.rightPanelType,
      map3DConfig: ({ tdIndex }) => tdIndex.map3DConfig, // 地图配置
      is3DMapOuter: ({ tdIndex }) => tdIndex.is3DMapOuter, // 判断是在3d地图还是在平面地图的标志
      mapMode: ({ tdIndex }) => tdIndex.mapMode, // 地图模式
      ready: ({ tdIndex }) => tdIndex.ready, // 地图是否加载完成的标志
      mapResource: ({ tdPoint }) => tdPoint.mapResource, // 获取地图通道资源
      highLightFeatureList: ({ tdPoint }) => tdPoint.highLightFeatureList, // 高亮定位要素
      floorData: ({ tdFloor }) => tdFloor.floorData // 获取地图通道资源
    })
  },
  watch: {
    mapResource: { // 监听地图资源变化
      handler(newVal, oldVal) {
        // console.log('地图资源数据：', newVal)
        if (newVal && newVal._id) {
          this.xDelta = 0 // 还原x轴偏移量
          this.yDelta = 0 // 还原y轴偏移量
          if (this.rightPanelType === 'alarmEditPanel' && oldVal && newVal._id === oldVal._id) { return }
          this.refreashFormInfo(newVal) // 刷新表单信息
        }
        if (oldVal && oldVal._id) {
          if (!newVal || !newVal._id || (newVal && newVal._id && newVal._id !== oldVal._id)) {
            !this.is3DMapOuter && this.revertOldSelectedFeature && this.revertOldSelectedFeature(oldVal) // 还原之前选中的资源要素
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    ...mapActions([
      'setPolygonFeatureList',
      'setPolygonLoc',
      'setIsEditGrid',
      'set2DActiveStringDraw',
      'set2DActiveGridDraw',
      'set2DActiveDraw',
      'setDrawGridStyle',
      'setRightPanelShow', // 右侧面板显隐
      'setRightPanelType', // 设置右侧面板的类型
      'setHighLightList', // 设置高亮要素列表
      'deleteResourceById', // 根据id删除点位资源
      'getResourcePointsByChannelType', // 获取指定通道资源数据
      'set3DActiveChangePositionDraw', // 控制3D位置绘制
      'set2DActiveEdit', // 控制2D位置绘制
      'setVideoPreviewFlag', // 设置是否显示视频预览
      'getPointModelList', // 获取点位模型列表数据
      'getIconList', // 获取点位图标列表数据
      'getResourceById', // 根据标识获取通道资源
      'getResourceByIdWithoutUpdateState', // 根据标识获取通道资源（不存储state状态）
      'setMapResource' // 设置地图资源
    ]),
    changTab(tab) { // 改变选项
      this.selectedTab = tab
    },
    changMapTab(tab) { // 改变选项
      this.selectedMapTab = tab
    },
    loadResourceSymbolList(val) { // 加载资源显示标志列表
      if (val[this.mapMode]) {
        if (val[this.mapMode].isouter) { // 楼外
          this.loadModelList(val[this.mapMode]) // 加载模型列表
        } else { // 楼内
          this.loadIconList(val[this.mapMode]) // 加载图标列表
        }
      }
    },
    loadModelList(val) { // 加载模型列表
      if (val && val.mid) {
        let oid = val.mid.oid
        if (oid) {
          let param = {oid: oid, status: 'online'}
          this.getPointModelList(param).then(res => {
            console.log('获取到的模型列表信息：', res)
            this.modelList = res
            for (let index = 0; index < this.modelList.length; index++) {
              let model = this.modelList[index]
              if (model._id === val.mid._id) {
                this.selectedModelIndex = index
                break
              }
            }
            this.$forceUpdate() // 强制刷新，解决页面不会重新渲染的问题
          }).catch(err => {
            console.log('获取模型列表失败，错误信息：', err)
          })
        }
      }
    },
    loadIconList(val) { // 加载图标列表
      this.iconList = []
      if (val && val.iid) {
        let oid = val.iid.oid
        if (oid) {
          let param = {oid: oid, status: 'online'}
          this.getIconList(param).then(res => {
            console.log('获取到的图标列表信息：', res.data)
            if (res.data && res.data.length > 0) {
              this.iconList = this.$lodash.cloneDeep(res.data)
              for (let index = 0; index < this.iconList.length; index++) {
                let icon = this.iconList[index]
                if (icon._id === val.iid._id) {
                  this.selectedIconIndex = index
                }
                if (icon.files && icon.files.length > 0) {
                  for (const file of icon.files) { // 遍历图标文件查询到在线图标地址
                    if (file.status === 'online') {
                      icon.imgUrl = file.path
                    }
                  }
                }
              }
            }
            console.log('资源可选图标列表信息：', this.iconList)
            this.$forceUpdate() // 强制刷新，解决页面不会重新渲染的问题
          }).catch(err => {
            console.log('获取图标列表失败，错误信息：', err)
          })
        }
      }
    },
    getModelImgPath(item) { // 获取模型文件路径
      let imgSrc = ''
      if (item) {
        if (item.picture && item.picture.path) {
          console.log('获取模型文件的路径：', item.picture.path)
          return item.picture.path
        }
      }
      return imgSrc
    },
    cancel3DMapSelectedEffect() { // 取消3D视地图体选中效果
      this.setRightPanelShow(false) // 隐藏右侧面板
      this.setRightPanelType('') // 清空右侧面板的类型
      this.$context.viewer.trackededEntity = null // 取消三维视图的选中效果
      this.$context.viewer.selectedEntity = null // 取消三维视图的选中效果
    },
    cancelBuildingMapSelectedEffect() { // 取消楼内地图要素选中效果
      this.set2DActiveEdit(false) // 关闭2D位置绘制
      this.setHighLightList([]) // 取消高亮样式
      this.setRightPanelType('floorForm') // 右侧面板类型设置为楼层信息
    },
    cancelSave(name) { // 取消保存
      if (this.is3DMapOuter) { // 当前地图是楼外3D地图时
        this.resetPointEntity() // 重置点位实体
        this.cancel3DMapSelectedEffect() // 取消3D地图实体选中效果
      } else {
        if (this.selectedMapTab === 'style') {
          this.selectedMapTab = 'basic'
          setTimeout(() => {
            this.$refs[name].resetFields() // 重置表单
          }, 100)
        } else {
          this.$refs[name].resetFields() // 重置表单
        }
        this.refreashPointLayer() // 刷新点位图层
        name === 'alarmData' && this.clearCurrentEffect()
      }
    },
    clearCurrentEffect() {
      this.set2DActiveStringDraw(false)
      this.set2DActiveGridDraw(false)
      this.set2DActiveDraw(false)
      this.setDrawGridStyle(JSON.parse(JSON.stringify(gridStyle.gridDrawEndStyle)))
      this.setIsEditGrid(false)
      this.setPolygonFeatureList([])
      this.setPolygonLoc('')
    },
    changeModelURI(oldIndex, newIndex) { // 改变模型
      if (this.modelList && this.modelList.length > newIndex) {
        let model = this.modelList[newIndex]
        this.pointInfo.mid = model
        if (model.files && model.files.length > 0) {
          let modelURI = model.files[0].path // 模型文件的地址
          for (const file of model.files) {
            if (file.status === 'online') {
              modelURI = file.path
              break
            }
          }
          if (this.ready) {
            utils.changeModelURI(this.$context, this.mapResource._id, modelURI)
          }
        }
      }
    },
    changeModelHeight(val) { // 改变模型高度
      if (this.ready) {
        let coValues = utils.changeModelHeight(this.$context, this.mapResource._id, this.pointInfo)
        if (coValues && coValues.length === 3) {
          let loc = coValues[0] + ',' + coValues[1] + ',' + coValues[2]
          this.changePointLoc(loc) // 修改点位的位置信息
        }
      }
    },
    changeModelSacle(val) { // 改变模型大小
      if (this.ready) {
        utils.changeModelScale(this.$context, this.mapResource._id, this.pointInfo)
      }
    },
    changeModelHeadingPitchRoll(val) { // 改变模型朝向角
      if (this.ready) {
        utils.changeModelHeadingPitchRoll(this.$context, this.mapResource._id, this.pointInfo)
      }
    },
    changeModelMoveXDelta(val) { // 改变点位位移
      if (this.ready) {
        let refLoc = this.point3D.geo || this.point3D.loc // 位移参照坐标
        let delta = { refLoc: refLoc, x: val, y: this.yDelta }
        let coValues = utils.changeModelMoveDelta(this.$context, this.mapResource._id, this.pointInfo, delta)
        if (coValues && coValues.length === 3) {
          let loc = coValues[0] + ',' + coValues[1] + ',' + coValues[2]
          this.changePointLoc(loc) // 修改点位的位置信息
        }
      }
    },
    changeModelMoveYDelta(val) { // 改变点位位移
      if (this.ready) {
        let refLoc = this.point3D.geo || this.point3D.loc // 位移参照坐标
        let delta = { refLoc: refLoc, x: this.xDelta, y: val }
        let coValues = utils.changeModelMoveDelta(this.$context, this.mapResource._id, this.pointInfo, delta)
        if (coValues && coValues.length === 3) {
          let loc = coValues[0] + ',' + coValues[1] + ',' + coValues[2]
          this.changePointLoc(loc) // 修改点位的位置信息
        }
      }
    },
    resetEntity(point3D) { // 重置点位实体模型
      if (point3D.mid) { // 还原模型
        if (point3D.mid.files && point3D.mid.files.length > 0) {
          let modelURI = point3D.mid.files[0].path // 模型文件的地址
          for (const file of point3D.mid.files) { // 获取在线模型文件的地址
            if (file.status === 'online') {
              modelURI = file.path
            }
          }
          if (this.ready) {
            utils.changeEntityOps(this.$context, this.mapResource._id, point3D) // 还原模型属性
            utils.changeModelURI(this.$context, this.mapResource._id, modelURI)
          }
        }
      }
    },
    preViewVideo() { // 视频预览
      console.log(this.mapResource)
      if (this.mapResource.status) {
        let eid = this.mapResource.eid
        if (eid && (!eid.hasOwnProperty('deviceStatus') || eid.deviceStatus)) { // 设备启用
          this.setVideoPreviewFlag(true)
        } else {
          this.warningMsg('该设备已禁用！')
        }
      } else {
        this.warningMsg('该设备不在线！')
      }
    },
    active3DDraw() { // 激活3D绘制工具
      this.set3DActiveChangePositionDraw(true)
    }
  }
}
</script>
<style scoped>
  /* 面板容器样式 */
  .panel {
    width: 300px;
    background: #1b3153;
    height: 85%;
    position: relative;
  }
  /* 面板顶部ring器样式 */
  .panel_top {
    height: 38px;
    width: 100%;
    line-height: 38px;
    background-color: #0f2343;
    font-size: 14px;
  }
  /* 面板顶部标题样式 */
  .panel_top .top_title {
    margin-left: 24px;
  }
  /* 面板顶部按钮组容器样式 */
  .panel_top .btn_group {
    float: right;
    padding-right: 8px;
  }
  /* 面板顶部按钮组按钮样式 */
  .panel_top .btn_group .top_button {
    margin: 0 2px;
  }
  /* 面板顶部按钮组按钮悬浮样式 */
  .panel_top .btn_group .top_button:hover {
    color: #20adff;
  }
  /* 面板内容的样式 */
  .panel_content {
    font-size: 12px;
    width: 100%;
    height: calc(100% - 80px);
  }
  /* 选项组合样式 */
  .panel_content > ul {
    width: 100%;
    height: 38px;
    font-size: 14px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: start;
  }
  /* 选项样式 */
  .panel_content > ul li {
    width: 56px;
    float: left;
    margin: 0 5px;
    cursor: pointer;
    height: 30px;
    line-height: 30px;
    list-style: none;
  }
  /* 选项选中样式 */
  .panel_content > ul li.active {
    border-bottom: 1px solid #4996f9;
  }
  /* 子面板样式 */
  .subPanel {
    width: 100%;
    height: 90%;
    overflow-y: auto;
  }
  /* 覆盖iview走马灯项的样式 */
  .ivu-carousel-item {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /* 走马灯项的样式 */
  .carouselItem {
    width: 190px;
    height: 190px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #20adff;
  }
  /* 走马灯项下图片的样式 */
  .carouselItem img {
    max-width: 180px;
    max-height: 180px;
  }
  /* 模型编辑容器样式 */
  .modelEdit {
    margin: 16px 24px;
    text-align: left;
  }
  /* 模型编辑标签样式 */
  .modelEdit > p {
    margin-bottom: 15px;
    font-size: 14px;
    text-align: left;
  }
  /* 视频表单容器样式 */
  .resourceForm {
    padding: 16px 24px;
  }
  /* 视频表单标签样式 */
  .resourceForm > p {
    margin: 0 0 15px 0;
    font-size: 14px;
    text-align: left;
  }
  /* 面板尾部样式 */
  .panel_foot {
    bottom: 24px;
    position: absolute;
    width: 100%;
    height: 32px;
    line-height: 32px;
    text-align: center;
  }
  /* 面板尾部按钮的样式 */
  .panel_foot button {
    margin: 0 8px;
    height: 32px;
  }
</style>
