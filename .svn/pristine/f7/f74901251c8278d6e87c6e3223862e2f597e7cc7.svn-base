<!--编辑模式 视频点位业务逻辑-->
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import editIpc from '../../../../../assets/map/edit/editIpc.js'
import ipcUtil from '../../../../../assets/map/edit/ipcUtil.js'
import STATE from '../../../../../assets/map/edit/state.js'
export default {
  computed: {
    ...mapState({
      editVedioDraw: ({ mapVedioData }) => mapVedioData.editVedioDraw, // 添加点位绘制控件
      activeMap: ({ mapGisData }) => mapGisData.activeMap, // 当前地图id
      oneMapInfo: ({ mapGisData }) => mapGisData.oneMapInfo,
      editVedioIpcList: ({ mapGisData }) => mapGisData.editVedioIpcList, // 编辑模式视频点位数组
      editVedioSectorList: ({ mapGisData }) => mapGisData.editVedioSectorList, // 编辑模式视频点位可视域数组
      editCurrentVedioFeature: ({ mapGisData }) => mapGisData.editCurrentVedioFeature, // 当前编辑的视频对象数组
      editCurrentVedioSector: ({ mapGisData }) => mapGisData.editCurrentVedioSector, // 当前编辑的视频可视域对象数组
      pointData: ({ mapGisData }) => mapGisData.pointData,
      editCheckList: ({ mapVedioData }) => mapVedioData.editCheckList,
      editVedioSectorInMapList: ({ mapGisData }) => mapGisData.editVedioSectorInMapList, // 加载到地图上的视频点位可视域数组
      oneMapPointList: ({ mapGisData }) => mapGisData.oneMapPointList, // 单个地图点位列表
      floorVedioResourceList: ({ mapVedioData }) => mapVedioData.floorVedioResourceList,
      editVedioIpcInMapList: ({ mapGisData }) => mapGisData.editVedioIpcInMapList, // 加载到地图上的视频点位数组
      commonAlarmList: ({ mapAlarmData }) => mapAlarmData.commonAlarmList,
      isOuter: ({ mapAreaData }) => mapAreaData.isOuter, // 楼层内还是楼层外
      activeMapType: ({ mapGisData }) => mapGisData.activeMapType,
      floorCommonAlarmList: ({ mapAlarmData }) => mapAlarmData.floorCommonAlarmList
    })
  },
  watch: {
    // 监听编辑模式添加点位时的绘制控件
    editVedioDraw(val) {
      if (val) {
        this.videoIpc.drawIpcStyle = ipcUtil.getDrawSymbolByIpcKey(this.currentNode.monitortype) // 绘制控件样式
      }
    },
    // 编辑模式视频点位数组
    editVedioIpcList(vediolist) {
      this.videoIpcFeatures = JSON.parse(JSON.stringify(vediolist))
    },
    // 编辑模式视频点位可视域数组
    editVedioSectorList(sectorlist) {
      this.sectorFeatures = JSON.parse(JSON.stringify(sectorlist))
    },
    // 刚进入编辑模式加载所有已入库的视频点位
    oneMapPointList(array) {
      this.addAllStorageVedio(array)
      this.isVedioIpcShow(this.editCheckList)
    },
    // 加载所有已入库的普通报警点位
    commonAlarmList(array) {
      this.addAllStorageVedio(array)
      this.isVedioIpcShow(this.editCheckList)
    },
    // 楼层中的普通报警点位添加
    floorCommonAlarmList(array) {
      this.addAllStorageVedio(array)
      this.isVedioIpcShow(this.editCheckList)
    },
    // 加载当前楼层所有已入库点位
    floorVedioResourceList(array) {
      this.addAllStorageVedio(array)
    }
  },
  methods: {
    ...mapActions(['getOnePoint', 'setOnePoint', 'getResourceOrg']),
    ...mapMutations([
      'SET_EDITCURRENTVEDIO_FEATURE', // 当前操作的视频点位对象
      'SET_EDITVEDIODRAW_STATE', // 编辑模式绘制视频点位控件状态
      'SET_EDITCURRENTVEDIO_SECTOR', // 当前操作视频点位的可视域
      'SET_EDITVEDIOIPC_LIST',
      'SET_EDITVEDIOIPCINMAP_LIST',
      'SET_EDITVEDIOSECTORINMAP_LIST',
      'SET_EDITVEDIOSECTOR_LIST',
      'SET_MODIFYACTIVE_STATE',
      'SET_EDITRIGHTPAGE_STATE',
      'SET_EDITDETAIL_STATE'
    ]),
    // 加载当前地图/楼层所有已入库的视频点位
    addAllStorageVedio(array) {
      let vediolist = editIpc.addAllStorageVedio(this.editVedioIpcList, array)
      let sectorlist = editIpc.addAllStorageSector(this.editVedioSectorList, array)
      this.$store.commit('SET_EDITVEDIOIPC_LIST', vediolist)
      this.$store.commit('SET_EDITVEDIOIPCINMAP_LIST', vediolist)
      this.$store.commit('SET_EDITVEDIOSECTORINMAP_LIST', sectorlist)
      if (this.editCheckList.indexOf('sector') > -1) {
        this.$store.commit('SET_EDITVEDIOSECTOR_LIST', sectorlist)
      }
    },
    // 保存时添加可视域（备份）
    addSectorToInMap(sectorCol, sector) {
      let sectorlist = JSON.parse(JSON.stringify(this.editVedioSectorInMapList))
      let id = sector && sector.attributes.id
      sectorlist = editIpc.deleteVedioOrSectorById(sectorlist, id)
      sectorlist.push(sector)
      this.$store.commit('SET_EDITVEDIOSECTORINMAP_LIST', sectorlist)
      if (this.editCheckList.indexOf('sector') > -1) {
        this.$store.commit('SET_EDITVEDIOSECTOR_LIST', sectorCol)
      }
    },
    isHideCurrentVedioSector() {
      let sectorlist = JSON.parse(JSON.stringify(this.editVedioSectorList))
      let id = this.editCurrentVedioFeature && this.editCurrentVedioFeature.attributes.id
      let sectors = editIpc.deleteVedioOrSectorById(sectorlist, id)
      this.$store.commit('SET_EDITVEDIOSECTOR_LIST', sectors)
      this.$store.commit('SET_EDITCURRENTVEDIO_SECTOR', null)
    },
    // 改变视频点位edit->save
    changeVedioState() {
      this.editCurrentAlarm && this.changeAlarmState()
      this.editCurrentPatrol && this.changePatrolState()
      if (this.editCurrentVedioFeature) {
        let id = this.editCurrentVedioFeature.attributes.id
        let vedioSectors = editIpc.saveVedioAndSector({
          vedioList: this.editVedioIpcList,
          sectorList: this.editVedioSectorList,
          id
        })
        this.commitVediosAndSectors(vedioSectors.vediolist, vedioSectors.sectorlist)
        if (this.editCheckList.indexOf('sector') === -1) {
          this.isHideCurrentVedioSector()
        }
        this.commitCurrentVedioAndSector(null, null)
        this.$store.commit('SET_MODIFYACTIVE_STATE', false) // 关闭编辑视频点位的控件
        this.editControlFeature = null
      }
    },
    vedioIpcModifyStart(coods) {
      if (this.editCurrentVedioSector) {
        let id = this.editCurrentVedioSector && this.editCurrentVedioSector.attributes.id
        let sectorlist = JSON.parse(JSON.stringify(this.editVedioSectorList))
        sectorlist = editIpc.deleteVedioOrSectorById(sectorlist, id)
        this.$store.commit('SET_EDITVEDIOSECTOR_LIST', sectorlist)
      }
    },
    // 加载已入库点位
    addStorageVedioAndSector(node) {
      let vedios = editIpc.addStorageFeature({
        vedioList: this.editVedioIpcList,
        sectorList: this.editVedioSectorList,
        node
      })
      this.$store.commit('SET_EDITVEDIOIPC_LIST', vedios.vediolist)
      this.$store.commit('SET_EDITVEDIOIPCINMAP_LIST', vedios.vediolist)
      this.addSectorToInMap(vedios.sectorlist, vedios.sector)
    },
    // 点击视频点位元素
    selectVedio(obj) {
      editIpc.vedioClickEvt(obj, {
        changeState: id => {
          this.vedioAndSectorToEditState(id)
        },
        editFeature: feature => {
          this.$store.commit('SET_MODIFYACTIVE_STATE', true) // 开启编辑视频点位的控件
          this.editControlFeature = feature
        }
      })
    },
    // 点击点位改变定位的状态save -> edit
    vedioAndSectorToEditState(id) {
      this.editCurrentAlarm && this.changeAlarmState()
      this.editCurrentPatrol && this.changePatrolState()
      // 判断当前有没有处于编辑状态的点位，如果有则变为save
      if (this.editCurrentVedioFeature) {
        let cid = this.editCurrentVedioFeature && this.editCurrentVedioFeature.attributes.id
        this.deleteVedioAddEditVedio({
          currentVedio: this.editCurrentVedioFeature,
          vedioList: this.editVedioIpcList,
          id: cid,
          state: STATE.SAVE
        })
        if (this.editControlFeature) {
          this.$store.commit('SET_MODIFYACTIVE_STATE', false) // 关闭编辑控件
        }
      }
      if (id) {
        let currentVedio = editIpc.getFeatureById(this.editVedioIpcList, id)
        this.deleteVedioAddEditVedio({ currentVedio, vedioList: this.editVedioIpcList, id, state: STATE.EDIT })
        this.getOnePoint(id)
          .then(res => {
            this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'videoPage', detail: 'show' }) // 点位编辑弹框显示
          })
          .catch(err => {
            console.log(err)
          })
        // let center = this.oneMapInfo.center
        // this.posi = { lon: center[0], lat: center[1] }
      }
    },
    // 根据id删除点位，添加edit状态的点位
    deleteVedioAddEditVedio(obj) {
      const { currentVedio, vedioList, id, state } = obj
      let vedioSectors = editIpc.changeStateById({ currentVedio, vedioList, id, state })
      this.$store.commit('SET_EDITVEDIOIPC_LIST', vedioSectors.vediolist)
      this.$store.commit('SET_EDITCURRENTVEDIO_FEATURE', vedioSectors.currentVedio)
      this.isHideCurrentVedioSector()
    },
    // 编辑位置入库点位
    saveEditIpc(coods) {
      let vedioSectors = editIpc.modifyPositionEnd({
        currentVedio: this.editCurrentVedioFeature,
        currentSector: this.editCurrentVedioSector,
        vedioList: this.editVedioIpcList,
        sectorList: this.editVedioSectorList,
        coods
      })
      this.posi = { lon: coods[0], lat: coods[1] }
      this.commitVediosAndSectors(vedioSectors.vediolist, vedioSectors.sectorlist)
      this.commitCurrentVedioAndSector(vedioSectors.currentVedio, vedioSectors.currentSector)
    },
    // 编辑视频点位位置结束后
    vedioModifyEndEvt(coods) {
      let pointDataEdit = JSON.parse(JSON.stringify(this.pointData))
      let id = this.editCurrentVedioFeature && this.editCurrentVedioFeature.attributes.id
      pointDataEdit.point.loc = coods.toString()
      this.setOnePoint({ _id: id, body: pointDataEdit })
        .then(res => {
          this.saveEditIpc(coods) // 点位入库
          this.successMsg('点位位置保存成功')
          if (this.isOuter) {
            this.getResourceOrg()
              .then(res => {})
              .catch(err => {
                console.log(err)
              })
          } else {
            this.getResourceOrg(this.levelData._id)
              .then(res => {})
              .catch(err => {
                console.log(err)
              })
          }
        })
        .catch(err => {
          console.log(err)
          this.errorMsg('点位位置保存失败')
        })
    },
    // 保存视频点位和可视域
    commitVediosAndSectors(vediolist, sectorlist) {
      this.$store.commit('SET_EDITVEDIOIPC_LIST', vediolist)
      this.$store.commit('SET_EDITVEDIOIPCINMAP_LIST', vediolist)
      this.$store.commit('SET_EDITVEDIOSECTOR_LIST', sectorlist)
    },
    // 保存当前的视频点位和可视域
    commitCurrentVedioAndSector(currentVedio, currentSector) {
      this.$store.commit('SET_EDITCURRENTVEDIO_FEATURE', currentVedio) // 编辑模式视频点位数组
      this.$store.commit('SET_EDITCURRENTVEDIO_SECTOR', currentSector) // 编辑模式加载到地图上的视频点位可视域数组
    },
    // 添加点位
    addVedio(obj) {
      const { coods, level } = obj
      let radius = 50
      if (this.isOuter) {
        if (this.activeMapType === 'static') {
          radius = 15
        }
      } else {
        radius = 15
      }
      let param = {
        coods: coods,
        level: level,
        node: this.currentNode,
        // radius: 50,
        // endAngle: 90,
        // startAngle: 0,
        // rotation: 0
        radius,
        endAngle: 45,
        startAngle: -45,
        rotation: 0
      }
      let vedios = editIpc.addFeatureToStorage({
        vedioList: this.editVedioIpcList,
        param
      })
      this.$store.commit('SET_EDITVEDIOIPC_LIST', vedios)
      this.$store.commit('SET_EDITVEDIOIPCINMAP_LIST', vedios)
      this.$store.commit('SET_EDITVEDIODRAW_STATE', false) // 关闭绘制视频点位的控件
    },
    // 点位入库
    addVedioIpc(obj) {
      let coods = obj.coods
      let level = null
      let sid = ''
      let bid = ''
      let radius = 50
      if (this.isOuter) {
        level = 7 // Math.ceil(this.$refs.mapEditContainer[0].getLevel())
        if (this.activeMapType === 'static') {
          radius = 15
        }
      } else {
        radius = 15
        bid = this.levelData.bid._id
        sid = this.levelData._id
        level = 7 // Math.ceil(this.$refs.mapFloorContainer.getLevel())
      }
      let firm = '-'
      if (this.currentNode.eid) {
        if (this.currentNode.eid.manufacturer) {
          firm = this.currentNode.eid.manufacturer
        }
      }
      let pointDataAdd = JSON.parse(JSON.stringify(this.pointData))
      let point = {
        class: level, // 点位层级
        firm, // 厂商
        principal: [{ name: '', mobile: '' }], // 联系方式
        loc: coods.toString(), // 经纬度
        radius, // 照射半径
        angle: 0, // 点位角度
        viewshed: 90, // 可视域
        mapId: this.oneMapInfo.mapId,
        isouter: this.isOuter,
        sid,
        bid
      }
      if (this.isOuter) {
        delete point.sid
        delete point.bid
      }
      pointDataAdd.point = point
      this.setOnePoint({ _id: this.currentNode._id, body: pointDataAdd })
        .then(res => {
          this.addVedio({ coods, level }) // 点位入库
          this.successMsg('点位添加成功')
          if (this.isOuter) {
            this.getResourceOrg()
              .then(res => {})
              .catch(err => {
                console.log(err)
              })
          } else {
            this.getResourceOrg(this.levelData._id)
              .then(res => {})
              .catch(err => {
                console.log(err)
              })
          }
        })
        .catch(err => {
          this.$store.commit('SET_EDITVEDIODRAW_STATE', false) // 关闭绘制视频点位的控件
          console.log(err)
          this.errorMsg('点位添加失败')
        })
    },
    // 清空地图中视频点位数据
    clearVedioIpcFromMap() {
      this.$store.commit('SET_EDITVEDIOIPC_LIST', [])
      this.$store.commit('SET_EDITVEDIOIPCINMAP_LIST', [])
      this.$store.commit('SET_EDITVEDIOSECTOR_LIST', [])
      this.$store.commit('SET_EDITVEDIOSECTORINMAP_LIST', [])
      this.$store.commit('SET_EDITCURRENTVEDIO_FEATURE', null)
      this.$store.commit('SET_EDITCURRENTVEDIO_SECTOR', null)
    },
    // 控制视频点位的显示隐藏
    isVedioIpcShow(checkList) {
      let vedioSectors = editIpc.checkVedioByType({
        vedioList: this.editVedioIpcInMapList,
        sectorList: this.editVedioSectorInMapList,
        checkList
      })
      this.$store.commit('SET_EDITVEDIOIPC_LIST', vedioSectors.vediolist)
      this.$store.commit('SET_EDITVEDIOSECTOR_LIST', vedioSectors.sectorlist)
    }
  },
  beforeDestroy() {
    this.$store.commit('SET_EDITVEDIODRAW_STATE', false)
    this.clearVedioIpcFromMap()
  }
}
</script>
