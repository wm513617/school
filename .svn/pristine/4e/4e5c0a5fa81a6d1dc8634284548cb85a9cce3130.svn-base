<!-- 报警点位信息编辑面板--逻辑控制脚本文件 -->
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import mapUtil from 'assets/3DMap/mapUtil'
import { isInvalidPrincipal } from 'components/map/formCheck'
import utils from 'assets/3DMap/utils/index'
import layerConfig from 'assets/2DMap/meta/layer'
import alarmTrans from 'assets/2DMap/feature/edit/alarm'
import { MPSIGNKEY } from 'assets/2DMap/meta/common'
import gridStyle from 'assets/3DMap/gridStyle.js'
import { setTimeout } from 'timers'
export default {
  data() {
    const nameValidator = (rule, value, callback) => { // 名称校验
      value = value ? value.replace(/(^\s*)|(\s*$)/g, '') : ''
      if (value && value.length > 0) {
        let len = 0
        for (let i = 0; i < value.length; i++) {
          const code = Number(value[i].charCodeAt(0))
          if (code > 127) {
            len += 2
          } else {
            len++
          }
        }
        if (len > 64) {
          return callback(new Error('不能超过64位字符'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('名称不能为空'))
      }
    }
    const chanValidator = (rule, value, callback) => { // 编号校验
      let reg = /^[0-9a-zA-Z_]{1,}$/g
      if (value) {
        if (reg.test(value)) {
          let len = 0
          for (let i = 0; i < value.length; i++) {
            const code = Number(value[i].charCodeAt(0))
            if (code > 127) {
              len += 2
            } else {
              len++
            }
          }
          if (len > 64) {
            return callback(new Error('不能超过64位字符'))
          } else {
            callback()
          }
        } else {
          callback(new Error('只支持数字、字母和下划线'))
        }
      } else {
        callback(new Error('编号不能为空'))
      }
    }
    return {
      menuTag: false,
      alarmData: {}, // 报警资源信息
      isLineCantShow: true,
      keyTypes: {},
      validateRule: {
        name: [
          { required: true, validator: nameValidator, trigger: 'change' }
        ],
        chan: [
          { required: true, validator: chanValidator, trigger: 'change' }
        ]
      },
      mapsignList: [
        { label: '点', value: MPSIGNKEY.point },
        { label: '线', value: MPSIGNKEY.lineString },
        { label: '面', value: MPSIGNKEY.polygon }
      ],
      mapsignType: 0
    }
  },
  computed: {
    ...mapState({
      isEditGrid: ({ tdFloor }) => tdFloor.isEditGrid, // 是否在编辑中
      alarms: ({ tdPoint }) => tdPoint.alarmFeatureList, // 普通报警点位列表
      drawGridStyle: ({ tdFloor }) => tdFloor.drawGridStyle, // 线或网格绘制样式----anli
      mapResource: ({ tdPoint }) => tdPoint.mapResource, // 地图资源，包括通道资源，巡更资源
      polygonLoc: ({ tdFloor }) => tdFloor.polygonLoc // 设置楼宇中线/面的位置坐标
    }),
    ...mapGetters('map3DApplyIX', ['editAlarmPointTag3D'])
  },
  methods: {
    ...mapMutations([
      'SET_DEFAULT_POINT_ICON_3D' // 设置默认点位图标文件
    ]),
    ...mapActions([
      'setMapsignType',
      'setIsEditGrid', // 更新是否编辑元素
      'setPolygonFeatureList', // 更新绘制中的元素列表
      'setDrawGridStyle', // 更新绘制中的元素样式
      'setTreeNodeType', // 设置当前选中的所属左数类型
      'set2DActiveEdit', // 设置2D绘图区域激活
      'setHighLightList', // 设置高亮定位元素列表
      'set2DActiveDraw', // 设置点元素绘制激活
      'set2DActiveGridDraw', // 设置网格元素绘制激活
      'set2DActiveStringDraw', // 设置线元素绘制激活
      'queryDefaultIconByOid3D', // 查询当前点位是否存在
      'getAlarmResourceOrgTree', // 获取报警点位树
      'setAlarmList', // 设置报警点位要素列表
      'saveOrUPdateAlarmPoint' // 保存或者更新报警点位
    ]),
    ...mapMutations('map3DApplyIX', ['EDIT_ALARM_POINT_TAG_3D']),
    refreashFormInfo(val) { // 刷新表单信息
      if (val[this.mapMode] && [mapUtil.CHANNELTYPE.commonAlarmResource, mapUtil.CHANNELTYPE.fireAlarmResource, mapUtil.CHANNELTYPE.alarmHostResource].includes(val.type)) {
        this.transAlarmInfo(val) // 转换成表单呈现的报警点位信息
        this.loadResourceSymbolList(val) // 加载资源显示标志列表
      }
    },
    transAlarmInfo(val) { // 转换成表单呈现的报警点位信息
      this.setTreeNodeType(val.type)
      if (val[this.mapMode]) {
        this.point3D = val[this.mapMode]
        this.pointInfo = this.$lodash.cloneDeep(this.point3D) // 深拷贝报警点位信息
        this.pointInfo.name = val.name
        if (this.pointInfo.loc) {
          let coValues = this.pointInfo.loc.split(',').map(item => Number(item))
          if (coValues && coValues.length === 3) { // 坐标是三维坐标时，设置高度信息
            this.pointInfo.height = coValues[2]
          }
          this.locFormat = utils.formatLoc(this.pointInfo.loc) // 格式化经纬度高度信息
        }
        if (!this.pointInfo.principal || this.pointInfo.principal.length === 0) {
          this.pointInfo.principal = [{name: '', mobile: ''}] // 初始化联系信息
        }
      }
      const {name, chan, level, mapsign} = val
      this.alarmData = {name: name, chan: chan, level: level, alarmTemplate: '', style: this.pointInfo.style} // 更新选中的报警元素数据
      this.mapsignType = (mapsign && mapsign.signtype) || 0 // 更新当前元素的地图标识
      this.menuTag = mapsign && (mapsign.signtype === 1 || mapsign.signtype === 2) // 是否为线/面
      this.isAreaCantShow = this.mapsignType === MPSIGNKEY.polygon // 是否为面标识
      // this.setIsEditGrid(true) // 线和面时，设置为编辑模式
      // this.menuTag && this.setIsEditGrid(true) // 线和面时，设置为编辑模式
      this.pointInfo && this.pointInfo.style && this.setDrawGridStyle(JSON.parse(JSON.stringify(this.pointInfo.style))) // 更新该元素获取回来的样式
      if (val.alarmtemplate) { // 布撤防时间
        this.alarmData.alarmTemplate = val.alarmtemplate.name
      }
      this.setMapsignType(this.mapsignType)
    },
    changePointLoc(loc) { // 改变点位的位置信息
      this.pointInfo.loc = loc
      if (this.pointInfo.loc) {
        let coValues = this.pointInfo.loc.split(',').map(item => Number(item))
        if (coValues && coValues.length === 3) { // 坐标是三维坐标时，设置高度信息
          this.pointInfo.height = coValues[2]
        }
        this.locFormat = utils.formatLoc(this.pointInfo.loc) // 格式化经纬度高度信息
      }
    },
    deleteAlarmPoint() { // 删除报警点位
      let _pointData = JSON.parse(JSON.stringify(this.mapResource)) // 地图资源数据
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除所选报警点位吗？</p>',
        onOk: () => { // 确认回调方法
          this.deleteResourceById(_pointData._id) // 根据id删除报警点位数据
            .then(res => {
              const num = this.editAlarmPointTag3D + 1
              this.EDIT_ALARM_POINT_TAG_3D(num)
              if (this.is3DMapOuter) { // 楼外3D地图
                this.cancel3DMapSelectedEffect() // 取消实体选中效果
                if (this.ready) { // 地图加载完成时
                  utils.reomoveEntityById(_pointData._id, this.keyTypes.alarm, this.$context)
                }
                this.getAlarmResourceOrgTree({ mapType: '3D' }) // 更新报警资源树
              } else { // 楼内地图
                this.cancelBuildingMapSelectedEffect() // 取消楼内地图要素选中效果
                this.setPolygonLoc('')
                this.setPolygonFeatureList([])
                if (this.floorData._id) {
                  this.getAlarmResourceOrgTree({ mapType: '3D', floorId: this.floorData._id }) // 根据楼层id更新地图资源树
                  this.refreshAlarmPointDateByFloor() // 刷新楼层报警点位图层数据源
                }
              }
              this.setIsEditGrid(false)
              this.successMsg('报警点位删除成功')
            })
            .catch(err => {
              console.log('报警点位删除失败：', err)
              this.errorMsg('报警点位删除失败')
            })
        },
        onCancel: () => {}
      })
    },
    refreashPointLayer() { // 刷新点位图层
      this.cancelBuildingMapSelectedEffect() // 取消楼内地图要素选中效果
      if (this.floorData._id) {
        this.refreshAlarmPointDateByFloor() // 刷新楼层报警点位图层数据源
      }
    },
    refreshAlarmPointDateByFloor() { // 刷新楼层报警点位图层数据源
      // 资源类型为报警点位（普通报警、消防报警、报警主机报警）
      let channelTypes = mapUtil.CHANNELTYPE.commonAlarmResource + ',' + mapUtil.CHANNELTYPE.fireAlarmResource + ',' + mapUtil.CHANNELTYPE.alarmHostResource
      let param = { sid: this.floorData._id, channelTypes: channelTypes }
      this.getResourcePointsByChannelType(param).then(res => {
        // console.log('楼层ID：', this.floorData._id, '报警求助点位数据：', res)
        let alarms = alarmTrans.transFeatures(res, layerConfig.commonAlarm, this.mapMode)
        this.setAlarmList(alarms)
      })
    },
    saveAlarmPoint(name) { // 保存报警点位
      if (!this.is3DMapOuter && this.selectedMapTab === 'style') {
        this.selectedMapTab = 'basic'
        setTimeout(() => {
          this.saveAlarmPointValidate(name)
        }, 100)
      } else {
        this.saveAlarmPointValidate(name)
      }
    },
    saveAlarmPointValidate(name) {
      this.$refs[name].validate(valid => {
        if (valid) { // 表单校验成功
          let result = isInvalidPrincipal(this.pointInfo.principal)
          if (result.flag && result.msg) {
            this.errorMsg(result.msg)
          } else {
            console.log('报警点位信息表单校验成功！')
            this.saveAlarmPointData() // 保存报警点位数据
          }
        } else { // 表单校验失败
          console.log('保存报警点位信息表单校验失败！')
          this.selectedTab = 'resource' // 跳转到资源表单信息
        }
      })
    },
    saveAlarmPointData() { // 保存报警点位数据
      let alarmDataEdit = JSON.parse(JSON.stringify(this.mapResource))
      alarmDataEdit.name = this.alarmData.name // 名称
      alarmDataEdit.chan = this.alarmData.chan // 编号
      alarmDataEdit.mapsign = {
        signflag: true,
        signtype: this.mapsignType // 编号
      }
      this.pointInfo.style = this.mapsignType !== 0 ? (this.drawGridStyle || gridStyle.areaDefault) : null
      this.pointInfo.loc = this.polygonLoc || this.pointInfo.loc
      console.log('this.polygonLoc---', this.polygonLoc)
      alarmDataEdit[this.mapMode] = this.pointInfo
      this.saveOrUPdateAlarmPoint({ _id: alarmDataEdit._id, body: alarmDataEdit }) // 更新报警点位信息
        .then(res => {
          this.successMsg('报警点位修改成功')
          if (this.is3DMapOuter) { // 楼外3D地图
            this.cancel3DMapSelectedEffect() // 取消3D视地图体选中效果
            this.getAlarmResourceOrgTree({ mapType: '3D' }) // 更新报警资源树
          } else { // 楼内地图
            this.cancelBuildingMapSelectedEffect() // 取消楼内地图要素选中效果
            if (this.floorData._id) {
              this.getAlarmResourceOrgTree({ mapType: '3D', floorId: this.floorData._id }) // 根据楼层id更新地图资源树
              this.refreshAlarmPointDateByFloor() // 刷新楼层报警点位图层数据源
            }
            this.setCurrentStatus(false) // 更新当前操作状态
            this.set2DActiveEdit(false) // 关闭2D位置绘制
            this.setDrawGridStyle(JSON.parse(JSON.stringify(gridStyle.gridDrawEndStyle))) // 更新编辑样式
            this.setIsEditGrid(false) // 关闭编辑状态
            this.setPolygonFeatureList([])
            this.setPolygonLoc('')
          }
        }).catch(err => {
          let data = (err.response && err.response.data) ? err.response.data : err
          console.log('报警点位修改失败：', data)
          let msg = data.message ? data.message : '报警点位修改失败'
          this.errorMsg(msg)
        })
    },
    changeIconURI(oldIndex, newIndex) { // 改变图标地址
      if (this.setAlarmList && this.iconList && this.iconList.length > newIndex) {
        let icon = this.iconList[newIndex]
        this.SET_DEFAULT_POINT_ICON_3D(icon)
        let alarm = JSON.parse(JSON.stringify(this.mapResource))
        alarm[this.mapMode].iid = icon
        this.isEditGrid && (alarm[this.mapMode].loc = this.polygonLoc || '')
        this.setMapResource(alarm)
        this.pointInfo.iid = icon
        if (!this.isEditGrid) {
          let alarmArr = this.alarms.filter(item => item.attributes.id !== alarm._id)
          let alarmFeature = alarmTrans.transOneFeature(alarm, layerConfig.commonAlarm, this.mapMode)
          alarmArr.push(alarmFeature)
          this.setAlarmList(alarmArr)
        }
      }
    },
    revertOldSelectedFeature(oldRes) {
      console.log('还原之前选中的要素！！！')
      this.getResourceByIdWithoutUpdateState(oldRes._id).then(res => {
        let alarmArr = this.alarms.filter(item => item.attributes.id !== oldRes._id)
        let alarm = JSON.parse(JSON.stringify(res))
        let alarmFeature = alarmTrans.transOneFeature(alarm, layerConfig.commonAlarm, this.mapMode)
        console.log('要还原的报警要素数据：', alarmFeature)
        alarmArr.push(alarmFeature)
        console.log('最新的报警要素数据：', alarmArr)
        this.setAlarmList(alarmArr)
      })
    },
    resetPointEntity() { // 重置点为实体
      this.getResourceById(this.mapResource._id).then(res => {
        let point3D = res[this.mapMode]
        this.resetEntity(point3D) // 还原之前的实体效果
      })
    },
    clearCurrentFeature() {
      const alarmArr = this.alarms.filter(item => item.attributes.id !== this.mapResource._id)
      this.setAlarmList(alarmArr)
    },
    cancelBuildingMapSelected() { // 取消楼内地图要素选中效果
      this.set2DActiveEdit(false) // 关闭2D位置绘制
      this.setHighLightList([]) // 取消高亮样式
    },
    setCurrentStatus(flag) {
      this.set2DActiveStringDraw(flag) // 关闭线元素绘制
      this.set2DActiveGridDraw(false) // 关闭网格元素绘制
      this.set2DActiveDraw(false) // 关闭点元素绘制
    },
    getMapsign(val) { // 地图标识切换
      this.setCurrentStatus(false) // 更新当前的状态
      this.setDrawGridStyle(JSON.parse(JSON.stringify(gridStyle.areaDefault))) // 还原当前的绘制样式
      this.clearCurrentFeature() // 清除当前已绘制的元素
      this.cancelBuildingMapSelected() // 取消楼内地图要素选中效果
      this.setPolygonFeatureList([])
      this.setPolygonLoc('')
      this.isAreaCantShow = false
      this.alarmData.style = JSON.parse(JSON.stringify(gridStyle.areaDefault))
      let alarm = JSON.parse(JSON.stringify(this.mapResource))
      alarm.mapsign.signtype = val
      this.setMapResource(alarm)
      let oid = this.mapResource ? this.getDeviceoOid(this.mapResource.type) : null // 获取设备资源的机构id
      if (oid) {
        this.queryDefaultIconByOid3D(oid).then(res => {
          this.setIsEditGrid(true)
          this.set2DActiveEdit(true)
          this.setMapsignType(val)
          if (val === MPSIGNKEY.point) {
            this.menuTag = false
            this.set2DActiveDraw(true)
          } else if (val === MPSIGNKEY.lineString) {
            this.menuTag = true
            this.set2DActiveStringDraw(true)
          } else if (val === MPSIGNKEY.polygon) {
            this.menuTag = true
            this.set2DActiveGridDraw(true)
            this.isAreaCantShow = true
          }
        })
      }
    },
    getDeviceoOid(type) { // 获取设备资源的机构id
      let oid = null
      if (type === mapUtil.CHANNELTYPE.commonAlarmResource) { // 普通报警
        oid = mapUtil.MODELOID.commonAlarm
      } else if (type === mapUtil.CHANNELTYPE.fireAlarmResource) { // 消防报警
        oid = mapUtil.MODELOID.fireAlarm
      } else if (type === mapUtil.CHANNELTYPE.alarmHostResource) { // 报警主机
        oid = mapUtil.MODELOID.alarmHost
      }
      return oid
    }
  },
  mounted() {
    this.keyTypes = mapUtil.getKeyType()
  },
  beforeDestroy() {
    this.set2DActiveEdit(false) // 关闭2D位置绘制
    // this.setHighLightList([]) // 取消高亮样式
    this.clearCurrentEffect()
    if (this.floorData._id) {
      this.refreshAlarmPointDateByFloor() // 刷新楼层报警点位图层数据源
    }
  }
}
</script>
