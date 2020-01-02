<!--编辑模式 视频、报警、巡更点位的左边树结构页面-->
<template>
  <div class="mapEditTree">
    <div class="input" style="width:100%;padding:0 10px;">
      <Input v-model="searchVal" icon="ios-search-strong" placeholder="请输入..." />
    </div>
    <div class="mapEditTittle">
      <ul>
        <li v-if="$BShasPower('BS-SETTING-RESOURCE-VIDEO-MANAGE')" @click="videoClick( 'video');searchVal=''" :class="{ 'active': videoShow==='video' } ">视频</li>
        <li v-if="$BShasPower('BS-FIRE-ALARMIN')" @click="alamClick('alarm');searchVal=''" :class="{ 'active': videoShow==='alarm' } ">报警</li>
        <li v-if="$BShasPower('BS-SETTING-POINT-MANAGE')" @click="patrolClick('patrol');searchVal=''" :class="{ 'active': videoShow==='patrol' } ">巡更</li>
      </ul>
    </div>
    <div v-if="$BShasPower('BS-SETTING-RESOURCE-VIDEO-MANAGE') && videoShow==='video'" class="mapEditTreeHome" v-scroll>
      <VTree ref='tree' :activeId='activeNodeId' :searchVal="searchVal" :treeData="mapSourceList" :options="treeOptions" @node-click='mapViseoSource' v-show="searchVal===''"></VTree>
      <SearchResList :oid="orgId" ref="SearchResList" v-show="searchVal!==''" type="0,1" @resClick="mapViseoSource" maptype="2d" :storeyId="levelData ? levelData._id : ''"></SearchResList>
    </div>
    <div v-if="$BShasPower('BS-FIRE-ALARMIN') &&videoShow==='alarm'" v-scroll class="mapEditTreeHome ">
      <VTree ref='tree' :activeId='activeNodeId' :searchVal="searchVal" :treeData="mapAlarmList" :options="options" @node-click='mapAlarmSource'></VTree>
    </div>
    <div v-if="$BShasPower('BS-SETTING-POINT-MANAGE') &&videoShow==='patrol'" v-scroll class="mapEditTreeHome ">
      <VTree ref='tree' :activeId='activeNodeId' :searchVal="searchVal" :treeData="partrolData" :options="options" @node-click='mapPatrolSource'></VTree>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import VTree from '../../../../components/tree/VTree.vue'
import editIpc from '../../../../assets/map/edit/editIpc.js'
import editAlarmIpc from '../../../../assets/map/edit/editAlarmIpc.js'
import editPatrolIpc from '../../../../assets/map/edit/editPatrolIpc'
import hightLight from '../../../../assets/map/edit/addhightLight.js'
import SearchResList from '../../../../components/videoMenu/SearchResList'
export default {
  components: {
    VTree,
    SearchResList
  },
  data() {
    return {
      videoShow: 'video',
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
      }
    }
  },
  computed: {
    ...mapState({
      mapSourceList: ({ mapGisData }) => mapGisData.mapSourceList, // 资源树
      mapAlarmList: ({ mapAlarmData }) => mapAlarmData.mapAlarmList, // 报警资源树
      editVedioIpcList: ({ mapGisData }) => mapGisData.editVedioIpcList, // 编辑模式视频点位数组
      editVedioSectorList: ({ mapGisData }) => mapGisData.editVedioSectorList, // 编辑模式视频点位可视域数组
      isOuter: ({ mapAreaData }) => mapAreaData.isOuter, // 楼层内还是楼层外
      activeMap: ({ mapGisData }) => mapGisData.activeMap, // 当前地图id
      editCurrentVedioFeature: ({ mapGisData }) => mapGisData.editCurrentVedioFeature, // 当前编辑的视频对象数组
      partrolData: ({ patrolData }) => patrolData.partrolData, // 巡更点位
      editVedioSectorInMapList: ({ mapGisData }) => mapGisData.editVedioSectorInMapList,
      editCheckList: ({ mapVedioData }) => mapVedioData.editCheckList,
      editPatrolList: ({ patrolData }) => patrolData.editPatrolList,
      editAlarmList: ({ mapAlarmData }) => mapAlarmData.editAlarmList,
      levelData: ({ mapGisData }) => mapGisData.levelData
    }),
    orgId() {
      return this.mapSourceList[0] ? this.mapSourceList[0]._id : ''
    }
  },
  watch: {
    activeMap(val) {
      this.searchVal = ''
    },
    searchVal(value) {
      if (this.$BShasPower('BS-SETTING-RESOURCE-VIDEO-MANAGE') && this.videoShow === 'video') {
        this.$refs.SearchResList.isSearching = true
        this.$refs.SearchResList.searchRes(value)
      }
    }
  },
  methods: {
    ...mapActions([
      'getOnePoint',
      'getOneLevel',
      'getOnePatrol',
      'getOneAlarm',
      'getOneBuild',
      'delOneAlarm',
      'getAlarmOrg'
    ]),
    ...mapMutations([
      'SET_EDITRIGHTPAGE_STATE',
      'SET_EDITVEDIODRAW_STATE',
      'SET_ADDVEDIONODE_INFO', // 保存添加视频点位时的节点信息
      'SET_ISTRIGGERCLICKEVT_STATE',
      'SET_EDITVEDIOIPC_LIST',
      'SET_EDITVEDIOIPCINMAP_LIST',
      'SET_EDITVEDIOSECTORINMAP_LIST',
      'SET_EDITVEDIOSECTOR_LIST',
      'SET_EDITCURRENTVEDIO_FEATURE',
      'SET_EDITCURRENTVEDIO_SECTOR',
      'SET_ISOUTER_STATE', // 设置是否进入楼层
      'SET_MAPACTIVE_STATE', // 当前激活状态地图
      'SET_EDITALARDRAW_STATE', // 报警绘制控件
      'SET_MODIFYACTIVE_STATE',
      'SET_EDITALARM_LIST',
      'SET_EDITCURRENT_ALARM',
      'SET_PATROLDRAW_STATE',
      'SET_PATROL_LIST',
      'SET_PATROLINMAP_LIST',
      'SET_EDITALARMINMAP_LIST',
      'SET_CURRENT_PATROL',
      'SET_ADDVEDIO_INFO',
      'SET_ADDALARM_INFO',
      'SET_ADDPATROL_INFO',
      'SET_EDITISONE_LEVEL',
      'SET_EDITHIGHTLIGHT_LIST',
      'SET_FLOOR_ID'
    ]),
    mapViseoSource(node) {
      if (node.point && !node.point.mapId) {
        this.$Modal.confirm({
          title: '该点位非本地图范围内！',
          content: '',
          onOk: () => {},
          onCancel: () => {}
        })
        return
      }
      this.$store.commit('SET_EDITVEDIODRAW_STATE', false) // 关闭添加视频点位的控件
      this.$store.commit('SET_ISTRIGGERCLICKEVT_STATE', true) // 编辑模式节点的点击事件是否触发,此时触发
      if (node.children || node.isOrg) {
        return
      }
      this.$store.commit('SET_ADDVEDIONODE_INFO', node) // 保存添加视频点位时的节点信息
      this.getOnePoint(node._id)
        .then(res => {
          if (node.point) {
            let param = JSON.parse(JSON.stringify(res.point))
            param.monitortype = node.monitortype
            param._id = node._id
            this.$store.commit('SET_ADDVEDIO_INFO', param)
            if (res.point.isouter) {
              // 楼层外
              if (!this.isOuter) {
                // 判断当前是都在楼层外，如果不在，则切到地图上
                this.$store.commit('SET_ISOUTER_STATE', true)
                this.clearVedioAndEditFeature()
              }
              if (res.point.mapId !== this.activeMap) {
                this.$store.commit('SET_MAPACTIVE_STATE', res.point.mapId)
                this.addStorageVedioAndSector(param)
              } else {
                this.addStorageVedioAndSector(param)
              }
              this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'gridEditPage', detail: 'show' })
            } else {
              this.addStorageVedioAndSector(param)
              // let isOneLevel = false
              // if (this.levelData) {
              //   isOneLevel = this.levelData._id === node.point.sid
              //   this.$store.commit('SET_EDITISONE_LEVEL', isOneLevel)
              // }
              // if (this.isOuter || !isOneLevel) {
              //   this.clearVedioAndEditFeature()
              //   this.inFloor(res.point.sid, param, 'ipc')
              // }
            }
            this.successMsg('点位信息获取成功')
          } else {
            this.$store.commit('SET_EDITVEDIODRAW_STATE', true) // 开启添加视频点位的控件
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 进入楼层
    // inFloor(val, param, type) {
    //   this.getOneLevel(val).then(res => {
    //     this.$store.commit('SET_FLOOR_ID', val) // 胡红勋添加
    //     this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'floorEditPage', detail: 'show' })
    //     this.$store.commit('SET_ISOUTER_STATE', false)
    //     let loc = null
    //     let id = null
    //     if (type === 'ipc') {
    //       this.addStorageVedioAndSector(param)
    //       loc = param.loc
    //       id = param._id
    //     }
    //     if (type === 'alarm') {
    //       this.addAlarmIpc(param)
    //       loc = param.node.point.loc
    //       id = param.node.point._id
    //     }
    //     if (type === 'patrol') {
    //       this.addPatrol(param)
    //       loc = param.coods
    //       id = param.id
    //     }
    //     let coods = loc && loc.split(',')
    //     if (coods && coods.length > 2) {
    //       loc = coods[2] + ',' + coods[3]
    //     }
    //     let hightLights = hightLight.addHightLightIcon(id, loc)
    //     this.$store.commit('SET_EDITHIGHTLIGHT_LIST', hightLights)
    //     this.getOneBuild(res.bid._id).then(res => {
    //     }).catch(err => {
    //       console.log(err)
    //     })
    //   }).catch(err => {
    //     console.log(err)
    //   })
    // },
    addHightIcon(id, loc) {
      let coods = loc && loc.split(',')
      if (coods && coods.length > 2) {
        loc = coods[2] + ',' + coods[3]
      }
      let hightLights = hightLight.addHightLightIcon(id, loc)
      this.$store.commit('SET_EDITHIGHTLIGHT_LIST', hightLights)
    },
    // 加载已入库点位
    addStorageVedioAndSector(node) {
      let loc = node.loc
      let id = node._id
      this.addHightIcon(id, loc)
      let vedios = editIpc.addStorageFeature({
        vedioList: this.editVedioIpcList,
        sectorList: this.editVedioSectorList,
        node
      })
      this.$store.commit('SET_EDITVEDIOIPC_LIST', vedios.vediolist)
      this.$store.commit('SET_EDITVEDIOIPCINMAP_LIST', vedios.vediolist)
      this.addSectorToInMap(vedios.sectorlist, vedios.sector)
    },
    // 保存当前的视频点位和可视域
    commitCurrentVedioAndSector(currentVedio, currentSector) {
      currentVedio && this.$store.commit('SET_EDITCURRENTVEDIO_FEATURE', currentVedio) // 编辑模式视频点位数组
      currentSector && this.$store.commit('SET_EDITCURRENTVEDIO_SECTOR', currentSector) // 编辑模式加载到地图上的视频点位可视域数组
    },
    // 保存视频点位和可视域
    commitVediosAndSectors(vediolist, sectorlist) {
      this.$store.commit('SET_EDITVEDIOIPC_LIST', vediolist)
      this.$store.commit('SET_EDITVEDIOIPCINMAP_LIST', vediolist)
      this.$store.commit('SET_EDITVEDIOSECTOR_LIST', sectorlist)
      this.$store.commit('SET_EDITVEDIOSECTORINMAP_LIST', sectorlist)
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
    // 清空视频点位以及编辑对象
    clearVedioAndEditFeature() {
      this.commitVediosAndSectors([], [])
      this.commitCurrentVedioAndSector(null, null)
      this.$store.commit('SET_EDITALARM_LIST', []) // 清理报警点位
      this.$store.commit('SET_EDITALARMINMAP_LIST', [])
      this.$store.commit('SET_EDITCURRENT_ALARM', null)
      this.$store.commit('SET_PATROL_LIST', []) // 清理巡更点位
      this.$store.commit('SET_PATROLINMAP_LIST', [])
      this.$store.commit('SET_CURRENT_PATROL', null)
      this.editFeature = null
    },
    // 报警资源点击事件
    mapAlarmSource(node) {
      this.$store.commit('SET_EDITALARDRAW_STATE', false) // 开启添加视频点位的控件
      this.$store.commit('SET_ISTRIGGERCLICKEVT_STATE', true) // 编辑模式节点的点击事件是否触发,此时触发
      if (node.children || node.isOrg) {
        return
      }
      this.$store.commit('SET_ADDVEDIONODE_INFO', node)
      this.getOneAlarm(node._id)
        .then(res => {
          console.log(res)
          if (res.point) {
            let locArr = res.point.loc.split(',')
            if (
              (res.mapsign.signtype === 0 && locArr.length === 2) ||
              (res.mapsign.signtype === 1 && locArr.length > 2 && locArr[0] !== locArr[locArr.length - 2]) ||
              (res.mapsign.signtype === 2 && locArr.length > 2 && locArr[0] === locArr[locArr.length - 2])
            ) {
              let param = {
                coods: res.point.loc,
                node
              }
              if (res.point.style) {
                param.style = res.point.style
              }
              this.$store.commit('SET_ADDALARM_INFO', param)
              if (res.point.isouter) {
                // 楼层外
                if (!this.isOuter) {
                  this.$store.commit('SET_ISOUTER_STATE', true)
                  this.clearVedioAndEditFeature()
                }
                if (res.point.mapId !== this.activeMap) {
                  this.$store.commit('SET_MAPACTIVE_STATE', res.point.mapId)
                  this.clearVedioAndEditFeature()
                  this.addAlarmIpc(param)
                } else {
                  this.addAlarmIpc(param)
                  this.$store.commit('SET_MAPACTIVE_STATE', this.activeMap)
                }
              } else {
                // let isOneLevel = false
                // if (this.levelData) {
                //   isOneLevel = this.levelData._id === node.point.sid
                //   this.$store.commit('SET_EDITISONE_LEVEL', isOneLevel)
                // }
                // if (this.isOuter || !isOneLevel) {
                //   this.clearVedioAndEditFeature()
                //   this.inFloor(res.point.sid, param, 'alarm')
                // }
                this.addAlarmIpc(param)
              }
            } else {
              this.$Modal.info({
                title: '提示',
                content: '<p>该点位类型已改变，请重新绘制点位！</p>',
                onOk: () => {
                  this.delOneAlarm(node._id)
                    .then(res => {
                      let id = node._id
                      let alarms = editAlarmIpc.deleteAlarm({
                        alarmList: this.editAlarmList,
                        id
                      })
                      this.$store.commit('SET_EDITALARM_LIST', alarms)
                      this.$store.commit('SET_EDITALARMINMAP_LIST', alarms)
                      this.$store.commit('SET_EDITHIGHTLIGHT_LIST', [])
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
          } else {
            this.$store.commit('SET_EDITALARDRAW_STATE', true) // 开启添加报警点位的控件
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getMapAlarmTree() {
      if (this.isOuter) {
        this.getAlarmOrg()
          .then(res => {})
          .catch(err => {
            console.log(err)
          })
      } else {
        this.getAlarmOrg(this.levelData._id)
          .then(res => {})
          .catch(err => {
            console.log(err)
          })
      }
    },
    addAlarmIpc(param) {
      let loc = param.node.point.loc
      let id = param.node.point._id
      this.addHightIcon(id, loc)
      let alarms = editAlarmIpc.addStorageAlarm({
        alarmList: this.editAlarmList,
        param
      })
      this.$store.commit('SET_EDITALARM_LIST', alarms)
      this.$store.commit('SET_EDITALARMINMAP_LIST', alarms)
    },
    // 巡更资源点击事件
    mapPatrolSource(node) {
      this.$store.commit('SET_PATROLDRAW_STATE', false) // 关闭绘制巡更控件
      this.$store.commit('SET_ISTRIGGERCLICKEVT_STATE', true) // 编辑模式节点的点击事件是否触发,此时触发
      if (node.children) {
        return
      }
      this.$store.commit('SET_ADDVEDIONODE_INFO', node) // 保存添加视频点位时的节点信息
      // 巡更点位编辑页面
      this.getOnePatrol(node._id)
        .then(res => {
          if (res.point) {
            let param = {
              coods: res.point.geo,
              id: res._id,
              mapid: res.point.mapid
            }
            this.$store.commit('SET_ADDPATROL_INFO', param)
            if (!res.point.sid) {
              if (!this.isOuter) {
                // 判断当前是都在楼层外，如果不在，则切到地图上
                this.$store.commit('SET_ISOUTER_STATE', true)
                this.clearVedioAndEditFeature()
              }
              if (res.point.mapid !== this.activeMap) {
                this.$store.commit('SET_MAPACTIVE_STATE', res.point.mapid)
                this.clearVedioAndEditFeature()
                this.addPatrol(param)
              } else {
                this.addPatrol(param)
              }
              this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'gridEditPage', detail: 'show' })
            } else {
              // let isOneLevel = false
              // if (this.levelData) {
              //   isOneLevel = this.levelData._id === node.point.sid
              //   this.$store.commit('SET_EDITISONE_LEVEL', isOneLevel)
              // }
              // if (this.isOuter || !isOneLevel) {
              //   this.clearVedioAndEditFeature()
              //   this.inFloor(res.point.sid, param, 'patrol')
              // }
              this.addPatrol(param)
            }
            this.successMsg('巡更点位信息获取成功')
          } else {
            this.$store.commit('SET_PATROLDRAW_STATE', true) // 开启绘制巡更控件
          }
        })
        .catch(err => {
          console.log(err)
          this.errorMsg('巡更点位信息获取失败')
        })
    },
    addPatrol(param) {
      let loc = param.coods
      let id = param.id
      this.addHightIcon(id, loc)
      let patrols = editPatrolIpc.addPatrolToStorage({
        patrolList: this.editPatrolList,
        param
      })
      this.$store.commit('SET_PATROL_LIST', patrols)
      this.$store.commit('SET_PATROLINMAP_LIST', patrols)
    },
    videoClick(val) {
      this.videoShow = val
      this.$store.commit('SET_EDITALARDRAW_STATE', false) // 关闭添加视频点位的控件
      this.$store.commit('SET_MODIFYACTIVE_STATE', false) // 关闭编辑视频点位的控件
      this.changeVedioOrAlarmState()
    },
    alamClick(val) {
      this.videoShow = val
      this.$store.commit('SET_EDITVEDIODRAW_STATE', false) // 关闭添加视频点位的控件
      this.$store.commit('SET_MODIFYACTIVE_STATE', false) // 关闭编辑视频点位的控件
      this.changeVedioOrAlarmState()
    },
    patrolClick(val) {
      this.videoShow = val
      this.$store.commit('SET_PATROLDRAW_STATE', false) // 关闭绘制巡更控件
      this.$store.commit('SET_MODIFYACTIVE_STATE', false) // 关闭编辑视频点位的控件
    },
    // 改变视频点位/报警元素的状态
    changeVedioOrAlarmState() {
      if (this.editCurrentVedioFeature) {
        let id = this.editCurrentVedioFeature.attributes.id
        let vedioSectors = editIpc.saveVedioAndSector({
          vedioList: this.editVedioIpcList,
          sectorList: this.editVedioSectorList,
          id
        })
        this.commitVediosAndSectors(vedioSectors.vediolist, vedioSectors.sectorlist)
        this.commitCurrentVedioAndSector(null, null)
      }
      if (this.editCurrentAlarm) {
        let aid = this.editCurrentAlarm.attributes.id
        let alarmlist = editAlarmIpc.saveAlarm(this.editAlarmList, aid)
        this.$store.commit('SET_EDITALARM_LIST', alarmlist)
        this.$store.commit('SET_EDITCURRENT_ALARM', null)
      }
    }
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
  width: 272px;
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
  width: 70px;
  float: left;
  margin: 0 10px;
  cursor: pointer;
  height: 40px;
  list-style: none;
}

.mapEditTittle > ul li.active {
  border-bottom: 1px solid #4996f9;
}
.treeliBox .icon-qiangji1:before {
  font-size: 16px !important;
}
</style>
