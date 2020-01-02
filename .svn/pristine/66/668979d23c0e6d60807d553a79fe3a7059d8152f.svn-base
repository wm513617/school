<!-- 报警求助点位信息编辑面板--逻辑控制脚本文件 -->
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import mapUtil from 'assets/3DMap/mapUtil'
import { isInvalidPrincipal } from 'components/map/formCheck'
import utils from 'assets/3DMap/utils/index'
import transAlarmHelp from 'assets/2DMap/feature/edit/alarmHelp'
import layerConfig from 'assets/2DMap/meta/layer'

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
      alarmHelpData: {}, // 报警求助资源信息
      keyTypes: {},
      validateRule: {
        name: [
          { required: true, validator: nameValidator, trigger: 'change' }
        ],
        chan: [
          { required: true, validator: chanValidator, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      alarmHelps: ({ tdPoint }) => tdPoint.alarmHelpFeatureList // 报警求助点位
    })
  },
  methods: {
    ...mapMutations([
      'SET_DEFAULT_POINT_ICON_3D' // 设置默认点位图标文件
    ]),
    ...mapActions([
      'getAlarmHelpOrgTree', // 获取报警求助点位树
      'setAlarmHelpList', // 设置报警点求助位要素列表
      'saveOrUpdateAlarmHelpPoint' // 保存或者更新报警求助点位
    ]),
    refreashFormInfo(val) { // 刷新表单信息
      if (val[this.mapMode] && val.type === mapUtil.CHANNELTYPE.vedioResource && val.eid && [mapUtil.CHANNELTYPE.alarmBoxResource, mapUtil.CHANNELTYPE.alarmColumnResource].includes(val.eid.type)) {
        this.transAlarmInfo(val) // 转换成表单呈现的报警求助点位信息
        this.loadResourceSymbolList(val) // 加载资源显示标志列表
      }
    },
    transAlarmInfo(val) { // 转换成表单呈现的报警求助信息
      if (val[this.mapMode]) {
        this.point3D = val[this.mapMode]
        this.pointInfo = this.$lodash.cloneDeep(this.point3D) // 深拷贝报警求助信息
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
      const {name, chan} = val
      this.alarmHelpData = {name: name, chan: chan}
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
    deleteAlarmHelpPoint() { // 删除报警求助
      let _pointData = JSON.parse(JSON.stringify(this.mapResource)) // 地图资源数据
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除所选报警求助吗？</p>',
        onOk: () => { // 确认回调方法
          this.deleteResourceById(_pointData._id) // 根据id删除报警求助数据
            .then(res => {
              if (this.is3DMapOuter) { // 楼外3D地图
                this.cancel3DMapSelectedEffect() // 取消实体选中效果
                if (this.ready) { // 地图加载完成时
                  utils.reomoveEntityById(_pointData._id, this.keyTypes.alarmHelp, this.$context)
                }
                this.getAlarmHelpOrgTree({ mapType: '3D' }) // 更新报警资源树
              } else { // 楼内地图
                this.cancelBuildingMapSelectedEffect() // 取消楼内地图要素选中效果
                if (this.floorData._id) {
                  this.getAlarmHelpOrgTree({ mapType: '3D', floorId: this.floorData._id }) // 根据楼层id更新地图资源树
                  this.refreshAlarmHelpPointDateByFloor() // 刷新楼层报警求助图层数据源
                }
              }
              this.successMsg('报警求助删除成功')
            })
            .catch(err => {
              console.log('报警求助删除失败：', err)
              this.errorMsg('报警求助删除失败')
            })
        },
        onCancel: () => {}
      })
    },
    refreashPointLayer() { // 刷新点位图层
      this.cancelBuildingMapSelectedEffect() // 取消楼内地图要素选中效果
      if (this.floorData._id) {
        this.refreshAlarmHelpPointDateByFloor() // 刷新楼层报警求助图层数据源
      }
    },
    refreshAlarmHelpPointDateByFloor() { // 刷新楼层报警求助图层数据源
      let param = { tab: mapUtil.TABTYPE.alarmHelp, sid: this.floorData._id, channelTypes: mapUtil.CHANNELTYPE.vedioResource }
      this.getResourcePointsByChannelType(param).then(res => {
        // console.log('楼层ID：', this.floorData._id, '报警求助点位数据：', res)
        let alarmHelps = transAlarmHelp.transFeatures(res, layerConfig.alarmBox, this.mapMode)
        this.setAlarmHelpList(alarmHelps)
      })
    },
    saveAlarmHelpPoint(name) { // 保存报警求助点位
      this.$refs[name].validate(valid => {
        if (valid) { // 表单校验成功
          let result = isInvalidPrincipal(this.pointInfo.principal)
          if (result.flag && result.msg) {
            this.errorMsg(result.msg)
          } else {
            console.log('报警求助点位信息表单校验成功！')
            this.saveAlarmHelpPointData() // 保存报警求助点位数据
          }
        } else { // 表单校验失败
          console.log('保存报警求助点位信息表单校验失败！')
          this.selectedTab = 'resource' // 跳转到资源表单信息
        }
      })
    },
    saveAlarmHelpPointData() { // 保存报警求助点位数据
      let _dataEdit = JSON.parse(JSON.stringify(this.mapResource))
      _dataEdit.name = this.alarmHelpData.name // 名称
      _dataEdit.chan = this.alarmHelpData.chan // 编号
      _dataEdit[this.mapMode] = this.pointInfo
      this.saveOrUpdateAlarmHelpPoint({ _id: _dataEdit._id, body: _dataEdit }) // 更新报警求助点位信息
        .then(res => {
          this.successMsg('报警求助点位修改成功')
          if (this.is3DMapOuter) { // 楼外3D地图
            this.cancel3DMapSelectedEffect() // 取消3D视地图体选中效果
            this.getAlarmHelpOrgTree({ mapType: '3D' }) // 更新报警资源树
          } else { // 楼内地图
            this.cancelBuildingMapSelectedEffect() // 取消楼内地图要素选中效果
            if (this.floorData._id) {
              this.getAlarmHelpOrgTree({ mapType: '3D', floorId: this.floorData._id }) // 根据楼层id更新地图资源树
              this.refreshAlarmHelpPointDateByFloor() // 刷新楼层报警求助点位图层数据源
            }
          }
        }).catch(err => {
          let data = (err.response && err.response.data) ? err.response.data : err
          console.log('报警求助点位修改失败', data)
          let msg = data.message ? data.message : '报警求助点位修改失败'
          this.errorMsg(msg)
        })
    },
    changeIconURI(oldIndex, newIndex) { // 改变图标地址
      if (this.setAlarmHelpList && this.iconList && this.iconList.length > newIndex) {
        let icon = this.iconList[newIndex]
        this.SET_DEFAULT_POINT_ICON_3D(icon)
        let alarmHelp = JSON.parse(JSON.stringify(this.mapResource))
        alarmHelp[this.mapMode].iid = icon
        this.setMapResource(alarmHelp)
        this.pointInfo.iid = icon
        let alarmHelpArr = this.alarmHelps.filter(item => item.attributes.id !== alarmHelp._id)
        let alarmHelpFeature = transAlarmHelp.transOneFeature(alarmHelp, layerConfig.alarmBox, this.mapMode)
        alarmHelpArr.push(alarmHelpFeature)
        this.setAlarmHelpList(alarmHelpArr)
      }
    },
    revertOldSelectedFeature(oldRes) {
      this.getResourceByIdWithoutUpdateState(oldRes._id).then(res => {
        let alarmHelpArr = this.alarmHelps.filter(item => item.attributes.id !== oldRes._id)
        let alarmHelp = JSON.parse(JSON.stringify(res))
        let alarmHelpFeature = transAlarmHelp.transOneFeature(alarmHelp, layerConfig.alarmBox, this.mapMode)
        alarmHelpArr.push(alarmHelpFeature)
        this.setAlarmHelpList(alarmHelpArr)
      })
    },
    resetPointEntity() { // 重置点为实体
      this.getResourceById(this.mapResource._id).then(res => {
        let point3D = res[this.mapMode]
        this.resetEntity(point3D) // 还原之前的实体效果
      })
    }
  },
  mounted() {
    this.keyTypes = mapUtil.getKeyType()
  }
}
</script>
