<!--编辑模式 报警点位业务逻辑-->
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import ipcUtil from '../../../../../assets/map/edit/ipcUtil.js'
import STATE from '../../../../../assets/map/edit/state.js'
import editAlarmIpc from '../../../../../assets/map/edit/editAlarmIpc'
import hightLight from '../../../../../assets/map/edit/addhightLight.js'
export default {
  computed: {
    ...mapState({
      mapEditRightPage: ({ mapPageState }) => mapPageState.mapEditRightPage.page,
      editAlarmDraw: ({ mapAlarmData }) => mapAlarmData.editAlarmDraw,
      oneMapAlarmData: ({ mapAlarmData }) => mapAlarmData.oneMapAlarmData, // 报警资源
      editAlarmList: ({ mapAlarmData }) => mapAlarmData.editAlarmList,
      editCurrentAlarm: ({ mapAlarmData }) => mapAlarmData.editCurrentAlarm,
      areaStyleCss: ({ mapAreaData }) => mapAreaData.areaStyle,
      activeMap: ({ mapGisData }) => mapGisData.activeMap,
      oneMapAlarmList: ({ mapAlarmData }) => mapAlarmData.oneMapAlarmList, // 当前地图的报警列表
      oneFloorAlarmList: ({ mapAlarmData }) => mapAlarmData.oneFloorAlarmList, // 当前楼层的报警列表
      editAlarmInMapList: ({ mapAlarmData }) => mapAlarmData.editAlarmInMapList,
      editAlarmCheck: ({ mapAlarmData }) => mapAlarmData.editAlarmCheck,
      levelData: ({ mapGisData }) => mapGisData.levelData
    })
  },
  watch: {
    oneMapAlarmData(val) {
      if (val && val.point && val.point.loc) {
        let id = val.point._id
        let loc = val.point.loc
        let coods = val.point.loc.split(',')
        if (coods.length > 2) {
          loc = coods[2] + ',' + coods[3]
        }
        if (this.mapEditRightPage === 'alarmPage') {
          this.hightLightFeatures = []
        } else {
          this.hightLightFeatures = hightLight.addHightLightIcon(id, loc)
        }
      }
    },
    editAlarmDraw(val) {
      if (val) {
        console.log(this.currentNode, 'this.currentNode.mapsign')
        let isFire = false
        if (this.currentNode.type === 9 || this.currentNode.type === 11) {
          isFire = true
        }
        this.alarmIpc.type = ipcUtil.getAlarmTypeByKey(this.currentNode.mapsign.signtype)
        this.alarmIpc.drawIpcStyle = ipcUtil.getDrawAlarmSymbolByType(this.currentNode.mapsign.signtype, isFire)
      }
    },
    editAlarmList(val) {
      this.editAlarmFeatures = JSON.parse(JSON.stringify(val))
    },
    areaStyleCss(val) {
      let style = JSON.parse(JSON.stringify(val))
      if (this.mapEditRightPage === 'alarmPage') {
        if (this.editCurrentAlarm) {
          let id = this.editCurrentAlarm.attributes.id
          let alarms = editAlarmIpc.editAlarmStyle(this.editAlarmList, id, style)
          this.$store.commit('SET_EDITALARM_LIST', alarms.alarmList)
          this.$store.commit('SET_EDITCURRENT_ALARM', alarms.currentAlarm)
        }
      }
    },
    // 获取当前地图上所有的报警点位
    oneMapAlarmList(alarmlist) {
      let features = JSON.parse(JSON.stringify(alarmlist))
      this.addAllStorageAlarm(features, true)
      this.isAlarmIpcShow(this.editAlarmCheck)
    },
    // 获取当前楼层上的所有报警点位
    oneFloorAlarmList(alarmlist) {
      let features = JSON.parse(JSON.stringify(alarmlist))
      this.addAllStorageAlarm(features, false)
    }
  },
  methods: {
    ...mapActions([
      'getAlarmOrg',
      'setOneAlarm',
      'getOneAlarm',
      'delOneAlarm',
      'setEditAlarmList',
      'setEditAlarmInMap',
      'setEditHighLightList'
    ]),
    ...mapMutations([
      'SET_MODIFYACTIVE_STATE',
      'SET_EDITRIGHTPAGE_STATE',
      'SET_EDITALARDRAW_STATE', // 编辑模式绘制报警控件状态
      'SET_EDITALARM_LIST',
      'SET_EDITCURRENT_ALARM',
      'SET_EDITALARMINMAP_LIST'
    ]),
    // 加载当前地图或楼层中的所有报警点位
    addAllStorageAlarm(features, isOuter) {
      let alarmObj = editAlarmIpc.addAllStorageAlarm(this.editAlarmList, features, isOuter)
      this.$store.commit('SET_EDITALARM_LIST', alarmObj.alarmList)
      this.$store.commit('SET_EDITALARMINMAP_LIST', alarmObj.alarmList)
    },
    // 点击节点加载已入库的报警点位
    addStoreAlarmIpc(param) {
      let alarms = editAlarmIpc.addStorageAlarm({
        alarmList: this.editAlarmList,
        param
      })
      this.$store.commit('SET_EDITALARM_LIST', alarms)
      this.$store.commit('SET_EDITALARMINMAP_LIST', alarms)
    },
    //  改变报警元素的状态edit->save
    changeAlarmState() {
      if (this.editCurrentAlarm) {
        let id = this.editCurrentAlarm.attributes.id
        let alarmlist = editAlarmIpc.saveAlarm(this.editAlarmList, id)
        this.$store.commit('SET_EDITALARM_LIST', alarmlist)
        this.$store.commit('SET_EDITCURRENT_ALARM', null)
        this.$store.commit('SET_MODIFYACTIVE_STATE', false) // 关闭编辑视频点位的控件
        this.editControlFeature = null
      }
    },
    selectAlarm(obj) {
      editAlarmIpc.alarmClickEvt(obj, {
        changeState: id => {
          this.alarmToEditState(id)
        },
        editFeature: feature => {
          this.$store.commit('SET_MODIFYACTIVE_STATE', true) // 开启编辑视频点位的控件
          // this.$nextTick(() => {
          //   if(this.currentEditAlarm && this.currentEditAlarm.geom.type != 'Point'){
          //     let newFeature = editAlarmIpc.changeSymbolByState(this.currentEditAlarm)
          //     this.editFeatures.push(newFeature)
          //   }
          // })
          this.editControlFeature = feature
        }
      })
    },
    // 报警改变状态save -> edit
    alarmToEditState(id) {
      this.editCurrentVedioFeature && this.changeVedioState()
      this.editCurrentPatrol && this.changePatrolState()
      if (this.editCurrentAlarm) {
        let cid = this.editCurrentAlarm && this.editCurrentAlarm.attributes.id
        this.deleteAlarmAddEditAlarm({
          currentAlarm: this.editCurrentAlarm,
          alarmList: this.editAlarmList,
          id: cid,
          state: STATE.SAVE
        })
        if (this.editControlFeature) {
          this.$store.commit('SET_MODIFYACTIVE_STATE', false) // 关闭编辑控件
        }
      }
      if (id) {
        let currentAlarm = editAlarmIpc.getFeatureById(this.editAlarmList, id)
        if (currentAlarm) {
          this.deleteAlarmAddEditAlarm({ currentAlarm, alarmList: this.editAlarmList, id, state: STATE.EDIT })
          // 需要用获取报警点位的接口替换
          this.getOneAlarm(id)
            .then(res => {
              let locArr = res.point.loc.split(',')
              if (
                (res.mapsign.signtype === 0 && locArr.length === 2) ||
                (res.mapsign.signtype === 1 && locArr.length > 2 && locArr[0] !== locArr[locArr.length - 2]) ||
                (res.mapsign.signtype === 2 && locArr.length > 2 && locArr[0] === locArr[locArr.length - 2])
              ) {
                this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'alarmPage', detail: 'show' })
              } else {
                this.$Modal.info({
                  title: '提示',
                  content: '<p>该点位类型已改变，请重新绘制点位！</p>',
                  onOk: () => {
                    this.delOneAlarm(id)
                      .then(res => {
                        // let id = id
                        let alarms = editAlarmIpc.deleteAlarm({
                          alarmList: this.editAlarmList,
                          id
                        })
                        // this.$store.commit('SET_EDITALARM_LIST', alarms)
                        this.setEditAlarmList(alarms)
                        // this.$store.commit('SET_EDITALARMINMAP_LIST', alarms)
                        this.setEditAlarmInMap(alarms)
                        // this.$store.commit('SET_EDITHIGHTLIGHT_LIST', [])
                        this.setEditHighLightList([])
                        this.successMsg('报警点位删除成功')
                        this.getMapAlarmTree()
                      })
                      .catch(err => {
                        console.log(err)
                        this.errorMsg('报警点位删除失败')
                      })
                  }
                })
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      }
    },
    getMapAlarmTree() {
      if (this.isOuter) {
        this.getAlarmOrg()
          .then(res => { })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.getAlarmOrg(this.levelData._id)
          .then(res => { })
          .catch(err => {
            console.log(err)
          })
      }
    },
    // 根据id删除报警，添加edit状态的报警点位
    deleteAlarmAddEditAlarm(obj) {
      const { currentAlarm, alarmList, id, state } = obj
      let alarmFeatures = editAlarmIpc.changeStateById({ currentAlarm, alarmList, id, state })
      this.$store.commit('SET_EDITALARM_LIST', alarmFeatures.alarmlist)
      this.$store.commit('SET_EDITCURRENT_ALARM', alarmFeatures.currentAlarm)
    },
    // 编辑报警元素位置入库
    saveEditAlarm(coods) {
      let alarmFeatures = editAlarmIpc.modifyPositionEnd({
        currentAlarm: this.editCurrentAlarm,
        alarmList: this.editAlarmList,
        coods
      })
      this.$store.commit('SET_EDITALARM_LIST', alarmFeatures.alarmlist)
      this.$store.commit('SET_EDITCURRENT_ALARM', alarmFeatures.currentAlarm)
    },
    // 编辑报警元素位置结束后
    alarmModifyEndEvt(coods) {
      let param = JSON.parse(JSON.stringify(this.oneMapAlarmData))
      param.point.loc = coods.toString()
      param.style = this.areaStyleCss
      if (this.editCurrentAlarm) {
        let id = this.editCurrentAlarm.attributes.id
        this.setOneAlarm({ _id: id, body: param })
          .then(res => {
            this.saveEditAlarm(coods) // 点位入库
            this.successMsg('点位位置保存成功')
            if (this.isOuter) {
              this.getAlarmOrg()
                .then(res => { })
                .catch(err => {
                  console.log(err)
                })
            } else {
              this.getAlarmOrg(this.levelData._id)
                .then(res => { })
                .catch(err => {
                  console.log(err)
                })
            }
          })
          .catch(err => {
            console.log(err)
            this.errorMsg('点位位置保存失败')
          })
      }
    },
    // 加载报警点位
    addAlarmIpc(obj) {
      let coods = obj.coods.toString()
      let sid = ''
      let bid = ''
      if (!this.isOuter) {
        sid = this.levelData._id
        bid = this.levelData.bid._id
      }
      let pointData = {
        principal: [{ name: '', mobile: '' }], // 联系方式
        loc: coods, // 经纬度
        mapId: this.activeMap,
        isouter: this.isOuter,
        sid,
        bid,
        style: {
          borderstyle: 'solid', // 边框样式  实线 solid/虚线 dashed/点线 dotted
          borderwidth: '3', // 边框宽度
          bordercolor: '#FF0000', // 边框颜色
          bodertransparency: 100, // 边框透明度
          fillcolor: '#FF0000', // 填充颜色
          fillcolortransparency: 50, // 填充透明度
          font: '微软雅黑', // 字体
          fontcolor: '#FF0000', // 字体颜色
          fontregular: 'normal', // 字体粗细
          fontsize: '12' // 字体大小
        }
      }
      if (this.isOuter) {
        delete pointData.sid
        delete pointData.bid
      }
      if (this.oneMapAlarmData.mapsign.signtype === 0) {
        delete pointData.style
      }
      this.oneMapAlarmData.point = pointData
      this.setOneAlarm({ _id: this.currentNode._id, body: this.oneMapAlarmData })
        .then(res => {
          let alarmList = editAlarmIpc.addFeatureToStorage({
            alarmList: this.editAlarmList,
            param: { coods, node: this.currentNode, style: pointData && pointData.style }
          })
          this.$store.commit('SET_EDITALARM_LIST', alarmList)
          this.$store.commit('SET_EDITALARMINMAP_LIST', alarmList)
          this.$store.commit('SET_EDITALARDRAW_STATE', false)
          this.successMsg('点位添加成功')
          if (this.isOuter) {
            this.getAlarmOrg()
              .then(res => { })
              .catch(err => {
                console.log(err)
              })
          } else {
            this.getAlarmOrg(this.levelData._id)
              .then(res => { })
              .catch(err => {
                console.log(err)
              })
          }
        })
        .catch(err => {
          this.$store.commit('SET_EDITALARDRAW_STATE', false)
          console.log(err)
          this.errorMsg('点位添加失败')
        })
    },
    // 清空地图中的报警点位
    clearAlarmFromMap() {
      this.$store.commit('SET_EDITALARDRAW_STATE', false)
      this.$store.commit('SET_EDITALARM_LIST', [])
      this.$store.commit('SET_EDITALARMINMAP_LIST', [])
      this.$store.commit('SET_EDITCURRENT_ALARM', null)
    },
    // 控制消防报警点位的显示隐藏
    isAlarmIpcShow(checkList) {
      let alarms = JSON.parse(JSON.stringify(this.editAlarmInMapList))
      if (checkList) {
        this.$store.commit('SET_EDITALARM_LIST', alarms)
      } else {
        this.$store.commit('SET_EDITALARM_LIST', [])
      }
    }
  },
  beforeDestroy() {
    this.clearAlarmFromMap()
  }
}
</script>
