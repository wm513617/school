<template>
  <div class="mapPointHome">
    <div class="check-line">
      <p class="iconfont icon-video-gun"></p>
      <Checkbox v-model="pointControlCheckObj.videoCheck" @on-change="videoSelect">视频点位</Checkbox>
    </div>
    <div class="check-line">
      <p class="iconfont icon-alarm-admin"></p>
      <Checkbox v-model="pointControlCheckObj.alarmCheck" @on-change="alarmSelect">报警点位</Checkbox>
    </div>
    <div class="check-line">
      <p class="iconfont icon-baojingxiang2"></p>
      <Checkbox v-model="pointControlCheckObj.alarmHelpCheck" @on-change="alarmHelpSelect">报警求助</Checkbox>
    </div>
    <div class="check-line">
      <p class="iconfont icon-dianzixuncha"></p>
      <Checkbox v-model="pointControlCheckObj.patrolCheck" @on-change="patrolSelect">巡更点位</Checkbox>
    </div>
    <div class="check-line" >
      <p class="iconfont icon-loufangdianwei"></p>
      <Checkbox v-model="pointControlCheckObj.tipCheck" @on-change="tipSelect">名称标签</Checkbox>
    </div>
    <div class="check-line" v-if="!is3DMapOuter">
      <p class="iconfont icon-grid"></p>
      <Checkbox v-model="pointControlCheckObj.girdCheck" @on-change="girdSelect">网格</Checkbox>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { RESOURCETYPE } from 'assets/2DMap/meta/common'
import mapUtil from 'assets/3DMap/mapUtil.js'
import utils from 'assets/3DMap/utils'
import gridUtil from 'assets/3DMap/gridUtil.js'
import layerConfig from 'assets/2DMap/meta/layer'
import videoTrans from 'assets/2DMap/feature/edit/video'
import alarmTrans from 'assets/2DMap/feature/edit/alarm'
import transAlarmHelp from 'assets/2DMap/feature/edit/alarmHelp'
import transPatrol from 'assets/2DMap/feature/edit/patrol'
import featureBase from 'assets/2DMap/feature/base'
import areaTrans from 'assets/2DMap/feature/apply/area'
import areaStyle from 'assets/2DMap/areaStyle'
export default {
  data() {
    return {
      pointControlCheckObj: {
        videoCheck: true,
        alarmCheck: true,
        alarmHelpCheck: true,
        patrolCheck: true,
        tipCheck: true,
        girdCheck: true
      },
      deviceType: {
        alarmType: '1,9,11',
        vedioType: '0'
      },
      keyTypes: {},
      gridLayer: layerConfig.grid, // 网格点位图层
      gridLabelNames: layerConfig.gridLabel,
      videoLayer: layerConfig.video, // 视频点位图层配置
      videoLabelNames: layerConfig.videoLabel,
      alarmLayer: layerConfig.commonAlarm, // 报警(普通报警、报警主机、消防报警)图层配置
      alarmLayerNames: layerConfig.commonAlarmLabel,
      alarmHelpLayer: layerConfig.alarmBox, // 报警求助图层配置
      alarmHelpLayerNames: layerConfig.alarmBoxLabel,
      alarmColumnHelpLayer: layerConfig.alarmColumn, // 报警求助图层配置
      alarmColumnHelpLayerNames: layerConfig.alarmColumnLabel,
      patrolLayer: layerConfig.patrol, // 巡更图层配置
      patrolLayerNames: layerConfig.patrolLabel
    }
  },
  computed: {
    ...mapState({
      editResourcesTypeControl: ({ tdIndex }) => tdIndex.editResourcesTypeControl,
      is3DMapOuter: ({ tdIndex }) => tdIndex.is3DMapOuter, // 楼层平面图和三维地图切换的标识-----
      mapMode: ({ tdIndex }) => tdIndex.mapMode, // 地图模式区分2D和3D
      ready: ({ tdIndex }) => tdIndex.ready,
      floorData: ({ tdFloor }) => tdFloor.floorData,
      videoFeatureList: ({ tdPoint }) => tdPoint.videoFeatureList, // 普通视频点位
      gridFeatureList: ({ tdPoint }) => tdPoint.gridFeatureList, // 网格列表要素
      gridLabelFeatureList: ({ tdPoint }) => tdPoint.gridLabelFeatureList, // 网格名称要素
      alarmFeatureList: ({ tdPoint }) => tdPoint.alarmFeatureList, // 普通报警点位
      alarmHelpFeatureList: ({ tdPoint }) => tdPoint.alarmHelpFeatureList, // 报警求助点位
      patrolFeatureList: ({ tdPoint }) => tdPoint.patrolFeatureList // 巡更点位
    }),
    ...mapGetters('tdIndex', {isShowNameEdit: 'dbcdef'})
  },
  watch: {
    pointControlCheckObj: {
      handler(newVal) {
        let {...newObj} = newVal // 深拷贝资源类型显示控制对象
        this.setEditResourceTypeControl(newObj)
      },
      deep: true
    },
    is3DMapOuter() {
      this.keyTypes = mapUtil.getKeyType()
      this.pointControlCheckObj = this.$lodash.cloneDeep(
        { videoCheck: true,
          alarmCheck: true,
          alarmHelpCheck: true,
          patrolCheck: true,
          tipCheck: false,
          girdCheck: false
        }
      )
    }
  },
  methods: {
    ...mapActions(['setEditResourceTypeControl',
      'getResourcePointsByChannelType',
      'getAllPatrolPoint',
      'setPatrolList',
      'setVideoList',
      'setAlarmHelpList',
      'setAlarmList',
      'getOneFloorPatrols',
      'getGridList',
      'setGridList',
      'setGridLabelList',
      'getAllBuild',
      'getAssistHoleList',
      'setCurrentGrid3D'
    ]),
    ...mapActions(['getMap3DOneGridById']),
    ...mapActions('tdIndex', [
      'setVideoLabelFeatures',
      'setAlarmLabelFeatures',
      'setAlarmHelpBoxLabelFeatures',
      'setAlarmHelpColmunLabelFeatures',
      'setPatrolLabelFeatures'
      // 'setGridLabelFeatures'

    ]),
    ...mapMutations(['DETEL_CURRENT_GRID_3D']),
    switch3DMapResourceShow(param, flag) {
      let { tab, channelTypes } = param
      let key = ''
      if (channelTypes === this.deviceType.vedioType) {
        if (tab === mapUtil.TABTYPE.video) {
          key = this.keyTypes.vedio
        }
        if (tab === mapUtil.TABTYPE.alarmHelp) {
          key = this.keyTypes.alarmHelp
        }
      }
      if (channelTypes === this.deviceType.alarmType) {
        key = this.keyTypes.alarm
      }
      if (flag) {
        // console.log(flag)
        this.getResourcePointsByChannelType(param).then(res => {
          utils.addEntitysToMap(key, res, this.mapMode, this.$context)
          if (this.isShowNameEdit.tipCheck) {
            // mapUtil.entitys.labels =[]
            for (let label of res) {
              let locValues = label.point3D.loc.split(',').map(item => Number(item))
              let position = { lon: locValues[0], lat: locValues[1], height: locValues[2] }
              if (key === 'video') { // 视频
                let labelEntity = utils.addLabel(this.$context, position, label.name, label._id, mapUtil.CHANNELTYPE.vedioResource)
                mapUtil.entitys.labels.push(labelEntity)
              } else { // 普通报警或报警求助
                let labelEntity = utils.addLabel(this.$context, position, label.name, label._id)
                mapUtil.entitys.labels.push(labelEntity)
              }
            }
          }
        })
      } else {
        mapUtil.entitys[key].forEach(entity => {
          // 清除点位实体
          this.$context.viewer.entities.remove(entity)
          // entity._id
          for (let i = 0; i < mapUtil.entitys.labels.length; i++) {
            if (entity._id === mapUtil.entitys.labels[i]._flag) {
              // 清除对应点位名称
              this.$context.viewer.entities.remove(mapUtil.entitys.labels[i])
              mapUtil.entitys.labels.splice(i, 1)
              i--
            }
          }
        })
        mapUtil.entitys[key] = []
      }
    },
    switch2DMapResourceShow(param, flag) {
      let { tab, channelTypes } = param
      if (flag) { // 显示
        this.getResourcePointsByChannelType(param).then(res => {
          if (channelTypes === this.deviceType.vedioType) {
            if (tab === mapUtil.TABTYPE.video) { // 视频
              let videos = videoTrans.transIconFeatures(res, layerConfig.video, this.mapMode)
              this.setVideoList(videos)
              if (this.isShowNameEdit.tipCheck) { // 如果勾选标签名称
                let arr = []
                for (let item of videos) {
                  this.setClickVideoLabelFeatures(item.attributes, arr)
                }
                arr && this.setVideoLabelFeatures(arr)
              }
            }
            if (tab === mapUtil.TABTYPE.alarmHelp) { // 报警求助
              let alarmHelps = transAlarmHelp.transFeatures(res, layerConfig.alarmBox, this.mapMode)
              this.setAlarmHelpList(alarmHelps)
              if (this.isShowNameEdit.tipCheck) { // 如果勾选标签名称
                let arrBox = []
                let arrColumn = []
                for (let item of alarmHelps) {
                  if (item.attributes.rType === RESOURCETYPE.alarmBox) { // 报警箱
                    this.setClickAlarmHelpBoxLabelFeatures(item.attributes, arrBox)
                  } else if (item.attributes.rType === RESOURCETYPE.alarmColumn) { // 报警柱
                    this.setClickAlarmHelpColumnLabelFeatures(item.attributes, arrColumn)
                  }
                }
                arrBox && this.setAlarmHelpBoxLabelFeatures(arrBox)
                arrColumn && this.setAlarmHelpColmunLabelFeatures(arrColumn)
              }
            }
          }
          if (channelTypes === this.deviceType.alarmType) {
            let alarms = alarmTrans.transFeatures(res, layerConfig.commonAlarm, this.mapMode)
            this.setAlarmList(alarms)
            if (this.isShowNameEdit.tipCheck) { // 如果勾选标签名称
              let arr = []
              for (let item of alarms) {
                this.setClickAlarmLabelFeatures(item.attributes, arr)
              }
              arr && this.setAlarmLabelFeatures(arr)
            }
          }
        })
      } else { // 隐藏
        if (channelTypes === this.deviceType.vedioType) {
          if (tab === mapUtil.TABTYPE.video) {
            this.setVideoList([])
            this.setVideoLabelFeatures([])
          }
          if (tab === mapUtil.TABTYPE.alarmHelp) {
            this.setAlarmHelpList([])
            this.setAlarmHelpBoxLabelFeatures([])
            this.setAlarmHelpColmunLabelFeatures([])
          }
        }
        if (channelTypes === this.deviceType.alarmType) { // 报警
          this.setAlarmList([])
          this.setAlarmLabelFeatures([])
        }
      }
    },
    videoSelect(flag) {
      let param = { tab: mapUtil.TABTYPE.video, channelTypes: this.deviceType.vedioType }
      if (this.is3DMapOuter) {
        this.switch3DMapResourceShow(param, flag)
      } else {
        param.sid = this.floorData._id
        /* 控制二维报警点位的显示隐藏 */
        this.switch2DMapResourceShow(param, flag)
      }
    },
    alarmSelect(flag) {
      console.log('报警点位显示的标识位：' + flag)
      let param = { channelTypes: this.deviceType.alarmType }
      if (this.is3DMapOuter) {
        this.switch3DMapResourceShow(param, flag)
      } else {
        param.sid = this.floorData._id
        /* 控制二维报警点位的显示隐藏 */
        this.switch2DMapResourceShow(param, flag)
      }
    },
    alarmHelpSelect(flag) {
      let param = { tab: mapUtil.TABTYPE.alarmHelp, channelTypes: this.deviceType.vedioType }
      if (this.is3DMapOuter) {
        this.switch3DMapResourceShow(param, flag)
      } else {
        param.sid = this.floorData._id
        /* 控制二维报警点位的显示隐藏 */
        this.switch2DMapResourceShow(param, flag)
      }
    },
    patrolSelect(flag) {
      if (this.is3DMapOuter) {
        /* 控制三维巡更点位的显示隐藏 */
        if (flag) {
          this.getAllPatrolPoint().then(res => {
            utils.addEntitysToMap(this.keyTypes.patrol, res, this.mapMode, this.$context)
            if (this.isShowNameEdit.tipCheck) {
              for (let item of res) {
                let locValues = item.point3D.geo.split(',').map(item => Number(item))
                let position = { lon: locValues[0], lat: locValues[1], height: locValues[2] }
                let labelEntity = utils.addLabel(this.$context, position, item.devName, item._id)
                mapUtil.entitys.labels.push(labelEntity)
              }
            }
          })
        } else {
          mapUtil.entitys.patrol.forEach(entity => {
            this.$context.viewer.entities.remove(entity)
            for (let i = 0; i < mapUtil.entitys.labels.length; i++) {
              if (entity._id === mapUtil.entitys.labels[i]._flag) {
                // 清除对应点位名称
                this.$context.viewer.entities.remove(mapUtil.entitys.labels[i])
                mapUtil.entitys.labels.splice(i, 1)
                i--
              }
            }
          })
          mapUtil.entitys.patrol = []
        }
      } else {
        /* 控制二维巡更点位的显示隐藏 */
        if (flag) {
          this.getOneFloorPatrols(this.floorData._id).then(patrolDatas => {
            let patrols = transPatrol.transFeatures(patrolDatas, layerConfig.patrol, this.mapMode)
            this.setPatrolList(patrols)
            if (this.isShowNameEdit.tipCheck) { // 如果勾选标签名称
              let arr = []
              for (let item of patrols) {
                this.setClickPatrolLabelFeatures(item.attributes, arr)
              }
              arr && this.setPatrolLabelFeatures(arr)
            }
          }).catch(err => {
            console.log('加载楼层：', this.floorData._id, '巡更点失败：', err)
          })
        } else {
          this.setPatrolList([])
          this.setPatrolLabelFeatures([])
        }
      }
    },
    async tipSelect(flag) {
      var _t = this
      if (_t.is3DMapOuter) { // 楼外
        if (_t.ready) {
          if (flag) { // 显示
            mapUtil.entitys.labels = []
            // 添加视频点位name浮层
            if (_t.isShowNameEdit.videoCheck) {
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
              console.log('获取到所有楼宇列表', res)
              res.forEach(item => {
                if (item.center && item.height) {
                  let coValues = item.center.split(',').map(item => Number(item)) // 二维经纬度坐标数组
                  let position = { lon: coValues[0], lat: coValues[1], height: item.height }
                  let labelEntity = utils.addLabel(this.$context, position, item.name, item._id, mapUtil.CHANNELTYPE.building)
                  if (labelEntity) {
                    mapUtil.entitys.labels.push(labelEntity)
                  }
                }
              })
            })
            // 添加普通报警点位name浮层
            if (_t.isShowNameEdit.alarmCheck) {
              // 普通报警&&报警主机报警
              _t.getResourcePointsByChannelType({channelTypes: mapUtil.pointTypes.commonAlarm}).then(function(res) {
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
              // 添加火警浮层
              _t.getResourcePointsByChannelType({channelTypes: mapUtil.pointTypes.fireAlarm}).then(function(res) {
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
            // 添加报警求助点位name浮层
            if (_t.isShowNameEdit.alarmHelpCheck) {
              let param = {tab: mapUtil.TABTYPE.alarmHelp, channelTypes: mapUtil.pointTypes.vedio}
              let res = await _t.getResourcePointsByChannelType(param)
              for (let item of res) {
                let locValues = item.point3D.loc.split(',').map(item => Number(item))
                let position = { lon: locValues[0], lat: locValues[1], height: locValues[2] }
                let labelEntity = utils.addLabel(_t.$context, position, item.name, item._id)
                mapUtil.entitys.labels.push(labelEntity)
              }
            }
            // 添加巡更求助点位name浮层 报警箱数据/报警柱数据
            if (_t.isShowNameEdit.patrolCheck) {
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
          } else { // 隐藏
            let labels = mapUtil.entitys.labels
            for (const label of labels) { // 遍历楼宇名称标签
              this.$context.viewer.entities.remove(label) // 实体集合中移除名称标签
            }
          }
        }
      } else { // 楼内
        if (flag) {
          // 添加网格name浮层
          if (_t.isShowNameEdit.girdCheck) {
            /* let arr = []
            for (let item of _t.gridFeatureList) {
              _t.setClickGridLabelFeatures(item.attributes, arr)
            } */
            for (let item of this.gridLabelFeatureList) {
              this.setCurrentGrid3D(item)
            }
          }
          // 添加视频点位name浮层
          if (_t.isShowNameEdit.videoCheck) {
            let arr = []
            for (let item of _t.videoFeatureList) {
              _t.setClickVideoLabelFeatures(item.attributes, arr)
            }
            arr && _t.setVideoLabelFeatures(arr)
          }
          // 普通报警点位name浮层
          if (_t.isShowNameEdit.alarmCheck) {
            let arr = []
            for (let item of _t.alarmFeatureList) {
              _t.setClickAlarmLabelFeatures(item.attributes, arr)
            }
            arr && _t.setAlarmLabelFeatures(arr)
          }
          // 报警求助点位name浮层
          if (_t.isShowNameEdit.alarmHelpCheck) {
            let arrBox = []
            let arrColumn = []
            for (let item of _t.alarmHelpFeatureList) {
              if (item.attributes.rType === RESOURCETYPE.alarmBox) { // 报警箱
                _t.setClickAlarmHelpBoxLabelFeatures(item.attributes, arrBox)
              } else if (item.attributes.rType === RESOURCETYPE.alarmColumn) { // 报警柱
                _t.setClickAlarmHelpColumnLabelFeatures(item.attributes, arrColumn)
              }
            }

            arrBox && _t.setAlarmHelpBoxLabelFeatures(arrBox)
            arrColumn && _t.setAlarmHelpColmunLabelFeatures(arrColumn)
          }
          // 巡更点位name浮层
          if (_t.isShowNameEdit.patrolCheck) {
            let arr = []
            for (let item of _t.patrolFeatureList) {
              _t.setClickPatrolLabelFeatures(item.attributes, arr)
            }
            arr && _t.setPatrolLabelFeatures(arr)
          }
        } else { // 隐藏
          // _t.setGridLabelFeatures([])
          _t.DETEL_CURRENT_GRID_3D() // 网格
          _t.setVideoLabelFeatures([])
          _t.setAlarmLabelFeatures([])
          _t.setAlarmHelpBoxLabelFeatures([])
          _t.setAlarmHelpColmunLabelFeatures([])
          _t.setPatrolLabelFeatures([])
        }
      }
    },
    // 设置点击事件网格悬浮显示名称要素
    /* setClickGridLabelFeatures(attr, arr) {
      if (attr.type === this.gridLayer.name) {
        let { id } = attr
        this.getMap3DOneGridById(id).then(res => {
          let labelFeature = areaTrans.getHoverLabelFeature(res, areaStyle.gridLabelStyle, this.gridLabelNames)
          arr.push(labelFeature)
          arr && this.setGridLabelFeatures(arr)
        }, err => {
          console.log(err)
        })
      }
    }, */
    // 设置点击事件视频悬浮显示名称要素
    setClickVideoLabelFeatures(attr, arr) {
      if (attr.type === this.videoLayer.name) {
        let labelFeature = featureBase.getHoverLabelFeature(attr, this.videoLabelNames)
        arr.push(labelFeature)
      }
    },
    // 设置点击事件报警悬浮显示名称要素
    setClickAlarmLabelFeatures(attr, arr) {
      if (attr.type === this.alarmLayer.name) {
        let labelFeature = featureBase.getHoverLabelFeature(attr, this.alarmLayerNames)
        arr.push(labelFeature)
      }
    },
    // 设置点击事件报警求助悬浮显示名称要素
    setClickAlarmHelpBoxLabelFeatures(attr, arr) {
      if (attr.type === this.alarmHelpLayer.name) {
        let labelFeature = featureBase.getHoverLabelFeature(attr, this.alarmHelpLayerNames)
        arr.push(labelFeature)
      }
    },
    // 设置点击事件报警柱悬浮显示名称要素
    setClickAlarmHelpColumnLabelFeatures(attr, arr) {
      if (attr.type === this.alarmColumnHelpLayer.name) {
        let labelFeature = featureBase.getHoverLabelFeature(attr, this.alarmColumnHelpLayerNames)
        arr.push(labelFeature)
      }
    },
    // 设置点击事件巡更悬浮显示名称要素
    setClickPatrolLabelFeatures(attr, arr) {
      if (attr.type === this.patrolLayer.name) {
        let labelFeature = featureBase.getHoverLabelFeature(attr, this.patrolLayerNames)
        arr.push(labelFeature)
      }
    },
    girdSelect(flag) {
      if (flag) {
        this.getGridList({id: this.floorData._id}).then(res => {
          let features = gridUtil.convertGridDatasToFeatures(res)
          this.setGridList(features)
          this.setGridLabelList(res)
          if (this.isShowNameEdit.tipCheck) { // 显示网格名称
            for (let item of res) {
              this.setCurrentGrid3D(item)
            }
            /* let arr = []
            for (let item of features) {
              this.setClickGridLabelFeatures(item.attributes, arr)
            } */
          }
        })
      } else {
        this.setGridList([])
        this.DETEL_CURRENT_GRID_3D()
        // this.setGridLabelFeatures([])
      }
    }
  },
  created() {
    this.keyTypes = mapUtil.getKeyType()
    this.pointControlCheckObj = this.$lodash.cloneDeep(this.editResourcesTypeControl)
    console.log(this.pointControlCheckObj, '：默认点位类型')
  }
}
</script>

<style scoped>
.mapPointHome {
  width: 100%;
  height: 100%;
  padding: 0 10px 10px 15px;
  display: flex;
  /*float: ;*/
  flex-direction: column;
}
.check-line {
  display: flex;
  flex: 0 0 30px;
  line-height: 30px;
}
.iconCheckBox {
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  display: inline-block;
  margin-right: 5px;
  font-size: 18px;
}
p {
  margin: 0 16px;
  width: 26px;
  text-align: center;
}
</style>
