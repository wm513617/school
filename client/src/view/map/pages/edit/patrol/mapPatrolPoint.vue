<!--编辑模式 巡更点位业务逻辑-->
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import STATE from '../../../../../assets/map/edit/state.js'
import editPatrolIpc from '../../../../../assets/map/edit/editPatrolIpc'
import hightLight from '../../../../../assets/map/edit/addhightLight.js'
export default {
  computed: {
    ...mapState({
      editPatrolList: ({ patrolData }) => patrolData.editPatrolList,
      onePartrol: ({ patrolData }) => patrolData.onePartrol, // 单个巡更点位
      activeMap: ({ mapGisData }) => mapGisData.activeMap, // 当前地图id
      editCurrentPatrol: ({ patrolData }) => patrolData.editCurrentPatrol,
      oneAllMapPartrolList: ({ patrolData }) => patrolData.oneAllMapPartrolList, // 获取当前地图上所有的巡更点位
      oneFloorPartrolList: ({ patrolData }) => patrolData.oneFloorPartrolList, // 获取当前楼层所有的巡更点位
      editPatrolInMapList: ({ patrolData }) => patrolData.editPatrolInMapList,
      editPatrolCheck: ({ patrolData }) => patrolData.editPatrolCheck,
      levelData: ({ mapGisData }) => mapGisData.levelData
    })
  },
  watch: {
    onePartrol(val) {
      if (val && val.point) {
        let id = val._id
        let loc = val.point.geo
        if (this.mapEditRightPage === 'patrolEditPage') {
          this.hightLightFeatures = []
        } else {
          this.hightLightFeatures = hightLight.addHightLightIcon(id, loc)
        }
      }
    },
    // 加载当前地图上所有已入库的巡更点位
    oneAllMapPartrolList(patrollist) {
      let features = JSON.parse(JSON.stringify(patrollist))
      this.addAllStoragePatrol(features, true)
      this.isPatrolIpcShow(this.editPatrolCheck)
    },
    // 加载当前楼层所有已入库的巡更点位
    oneFloorPartrolList(patrollist) {
      let features = JSON.parse(JSON.stringify(patrollist))
      this.addAllStoragePatrol(features, false)
    }
  },
  methods: {
    ...mapActions(['editOnePatrol', 'getPatrolPoint', 'getOnePatrol', 'getOnePatrolStic']),
    ...mapMutations([
      'SET_PATROLDRAW_STATE', // 编辑模式绘制巡更控件状态
      'SET_PATROL_LIST',
      'SET_PATROLINMAP_LIST',
      'SET_EDITRIGHTPAGE_STATE',
      'SET_MODIFYACTIVE_STATE'
    ]),
    // 加载当前地图或楼层中的所有巡更点位
    addAllStoragePatrol(features, isOuter) {
      let patrols = editPatrolIpc.addAllStrogePatrol(this.editPatrolList, features, isOuter)
      this.$store.commit('SET_PATROL_LIST', patrols)
      this.$store.commit('SET_PATROLINMAP_LIST', patrols)
    },
    // 点击节点加载已入库的点位
    addStorePatrol(param) {
      let patrols = editPatrolIpc.addPatrolToStorage({
        patrolList: this.editPatrolList,
        param
      })
      this.$store.commit('SET_PATROL_LIST', patrols)
      this.$store.commit('SET_PATROLINMAP_LIST', patrols)
    },
    addPatrolIpc(obj) {
      let coods = obj.coods
      let param = JSON.parse(JSON.stringify(this.onePartrol))
      let sid = ''
      let bid = ''
      if (!this.isOuter) {
        sid = this.levelData._id
        bid = this.levelData.bid._id
      }
      let point = {
        geo: coods.toString(),
        mapid: this.activeMap,
        sid,
        bid
      }
      if (!point.sid) {
        delete point.sid
      }
      if (!point.bid) {
        delete point.bid
      }
      param.point = point
      this.editOnePatrol(param)
        .then(res => {
          this.addPatrol(coods)
          this.successMsg('巡更点位信息修改成功')
          if (this.isOuter) {
            this.getPatrolPoint()
              .then(res => {})
              .catch(err => {
                console.log(err)
              })
          } else {
            this.getPatrolPoint(this.levelData._id)
              .then(res => {})
              .catch(err => {
                console.log(err)
              })
          }
        })
        .catch(err => {
          this.$store.commit('SET_PATROLDRAW_STATE', false) // 关闭绘制视频点位的控件
          console.log(err)
          this.errorMsg('巡更点位信息修改失败')
        })
    },
    addPatrol(coods) {
      let patrols = editPatrolIpc.addPatrolToStorage({
        patrolList: this.editPatrolList,
        param: { coods, id: this.currentNode._id, mapid: this.activeMap }
      })
      this.$store.commit('SET_PATROL_LIST', patrols)
      this.$store.commit('SET_PATROLINMAP_LIST', patrols)
      this.$store.commit('SET_PATROLDRAW_STATE', false) // 关闭绘制视频点位的控件
    },
    patrolModifyEndEvt(coods) {
      let param = JSON.parse(JSON.stringify(this.onePartrol))
      param.point.geo = coods.toString()
      this.editOnePatrol(param)
        .then(res => {
          this.saveEditPatrol(coods) // 巡更点位入库
          this.successMsg('点位位置保存成功')
          if (this.isOuter) {
            this.getPatrolPoint()
              .then(res => {})
              .catch(err => {
                console.log(err)
              })
          } else {
            this.getPatrolPoint(this.levelData._id)
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
    saveEditPatrol(coods) {
      let patrols = editPatrolIpc.modifyPositionEnd({
        currentPatrol: this.editCurrentPatrol,
        patrolList: this.editPatrolList,
        coods
      })
      this.$store.commit('SET_PATROL_LIST', patrols.patrollist)
      this.$store.commit('SET_PATROLINMAP_LIST', patrols.patrollist)
      this.$store.commit('SET_CURRENT_PATROL', patrols.currentPatrol)
    },
    selectPatrol(obj) {
      editPatrolIpc.patrolClickEvt(obj, {
        changeState: id => {
          this.patrolToEditState(id)
        },
        editFeature: feature => {
          this.$store.commit('SET_MODIFYACTIVE_STATE', true) // 开启编辑视频点位的控件
          this.editControlFeature = feature
        }
      })
    },
    patrolToEditState(id) {
      this.changeAlarmState()
      this.changeVedioState()
      if (this.editCurrentPatrol) {
        let cid = this.editCurrentPatrol && this.editCurrentPatrol.attributes.id
        this.deletePatrolAddEditPatrol({
          currentPatrol: this.editCurrentPatrol,
          patrolList: this.editPatrolList,
          id: cid,
          state: STATE.SAVE
        })
        if (this.editControlFeature) {
          this.$store.commit('SET_MODIFYACTIVE_STATE', false) // 关闭编辑控件
        }
      }
      if (id) {
        let currentPatrol = editPatrolIpc.getFeatureById(this.editPatrolList, id)
        if (currentPatrol) {
          this.deletePatrolAddEditPatrol({ currentPatrol, patrolList: this.editPatrolList, id, state: STATE.EDIT })
          this.getOnePatrol(id)
            .then(res => {
              this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'patrolEditPage', detail: 'show' }) // 点位编辑弹框显示
            })
            .catch(err => {
              console.log(err)
            })
          // 获取巡更点位统计信息
          this.getOnePatrolStic(id)
            .then(res => {})
            .catch(err => {
              console.log(err)
            })
        }
      }
    },
    // 根据id删除巡更，添加edit状态的巡更点位
    deletePatrolAddEditPatrol(obj) {
      const { currentPatrol, patrolList, id, state } = obj
      let patrols = editPatrolIpc.changeStateById({ currentPatrol, patrolList, id, state })
      this.$store.commit('SET_PATROL_LIST', patrols.patrollist)
      this.$store.commit('SET_CURRENT_PATROL', patrols.currentPatrol)
    },
    changePatrolState() {
      this.editCurrentVedioFeature && this.changeVedioState()
      this.editCurrentAlarm && this.changeAlarmState()
      if (this.editCurrentPatrol) {
        let id = this.editCurrentPatrol.attributes.id
        let patrols = editPatrolIpc.savePatrol({
          patrolList: this.editPatrolList,
          id
        })
        this.$store.commit('SET_PATROL_LIST', patrols)
        this.$store.commit('SET_PATROLINMAP_LIST', patrols)
        this.$store.commit('SET_CURRENT_PATROL', null)
        this.$store.commit('SET_MODIFYACTIVE_STATE', false) // 关闭编辑视频点位的控件
        this.editControlFeature = null
      }
    },
    // 清空巡更点位
    clearPatrolFromMap() {
      this.$store.commit('SET_PATROL_LIST', [])
      this.$store.commit('SET_PATROLINMAP_LIST', [])
      this.$store.commit('SET_CURRENT_PATROL', null)
    },
    // 控制巡更点位的显示隐藏
    isPatrolIpcShow(checkList) {
      let patrols = JSON.parse(JSON.stringify(this.editPatrolInMapList))
      if (checkList) {
        this.$store.commit('SET_PATROL_LIST', patrols)
      } else {
        this.$store.commit('SET_PATROL_LIST', [])
      }
    }
  },
  beforeDestroy() {
    this.clearPatrolFromMap()
    this.$store.commit('SET_PATROLDRAW_STATE', false) // 关闭绘制巡更点位的控件
  }
}
</script>
