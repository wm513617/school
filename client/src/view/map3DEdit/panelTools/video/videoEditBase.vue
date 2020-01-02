<!-- 视频信息编辑面板--逻辑控制脚本文件 -->
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import mapUtil from 'assets/3DMap/mapUtil'
import utils from 'assets/3DMap/utils/index'
import { isInvalidPrincipal } from 'components/map/formCheck'
import layerConfig from 'assets/2DMap/meta/layer'
import videoTrans from 'assets/2DMap/feature/edit/video'

export default {
  data() {
    const nameValid = (rule, value, callback) => { // 名称校验
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
    return {
      keyTypes: {},
      validateRule: {
        name: [
          { required: true, validator: nameValid, trigger: 'change' }
        ]
      },
      videoLayer: layerConfig.video // 视频点位图层配置
    }
  },
  computed: {
    ...mapState({
      videos: ({ tdPoint }) => tdPoint.videoFeatureList // 普通视频点位
    }),
    ...mapGetters('map3DApplyIX', ['editVideoPointTag3D'])
  },
  methods: {
    ...mapMutations([
      'SET_DEFAULT_POINT_ICON_3D' // 设置默认点位图标文件
    ]),
    ...mapActions([
      'getVedioResourceOrgTree', // 获取视频点位资源树
      'setVideoList', // 设置视频点位要素列表
      'saveOrUpdateVedioPoint' // 保存或者更新视频点位
    ]),
    ...mapMutations('map3DApplyIX', ['EDIT_VIDEO_POINT_TAG_3D']),
    refreashFormInfo(val) { // 刷新表单信息
      if (val[this.mapMode] && val.type === mapUtil.CHANNELTYPE.vedioResource) {
        this.transVideoInfo(val) // 转换成表单呈现的视频点位信息
        this.loadResourceSymbolList(val) // 加载资源显示标志列表
      }
    },
    transVideoInfo(val) { // 转换成表单呈现的视频点位信息
      if (val[this.mapMode]) {
        this.point3D = val[this.mapMode]
        let firm = '-'
        if (val.eid) {
          if (val.eid.manufacturer) {
            firm = val.eid.manufacturer
          }
        }
        this.pointInfo = this.$lodash.cloneDeep(this.point3D) // 深拷贝报警点位信息
        this.pointInfo.name = val.name
        this.pointInfo.firm = firm // 厂商
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
    deleteVideoPoint() { // 删除视频点位
      let _pointData = JSON.parse(JSON.stringify(this.mapResource)) // 地图资源数据
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除所选视频点位吗？</p>',
        onOk: () => { // 确认回调方法
          this.deleteResourceById(_pointData._id) // 根据ID删除资源
            .then(res => {
              const num = this.editVideoPointTag3D + 1
              this.EDIT_VIDEO_POINT_TAG_3D(num)
              if (this.is3DMapOuter) { // 楼外3D地图
                this.cancel3DMapSelectedEffect() // 取消实体选中效果
                if (this.ready) { // 地图加载完成时
                  utils.reomoveEntityById(_pointData._id, this.keyTypes.vedio, this.$context)
                }
                this.getVedioResourceOrgTree({ mapType: '3D' }) // 更新视频资源树
              } else { // 楼内地图
                this.cancelBuildingMapSelectedEffect() // 取消楼内地图要素选中效果
                if (this.floorData._id) {
                  this.getVedioResourceOrgTree({ mapType: '3D', floorId: this.floorData._id }) // 根据楼层id更新地图资源树
                  this.refreshVideoPointDateByFloor() // 刷新楼层视频点位图层数据源
                }
              }
              this.successMsg('视频点位删除成功')
            })
            .catch(err => {
              console.log('视频点位删除失败：', err)
              this.errorMsg('视频点位删除失败')
            })
        },
        onCancel: () => {}
      })
    },
    refreashPointLayer() { // 刷新点位图层
      this.cancelBuildingMapSelectedEffect() // 取消楼内地图要素选中效果
      if (this.floorData._id) {
        this.refreshVideoPointDateByFloor() // 刷新楼层视频点位图层数据源
      }
    },
    refreshVideoPointDateByFloor() { // 刷新楼层视频点位图层数据源
      let param = { tab: mapUtil.TABTYPE.video, sid: this.floorData._id, channelTypes: mapUtil.CHANNELTYPE.vedioResource }
      this.getResourcePointsByChannelType(param).then(res => {
        // console.log('楼层ID：', this.floorData._id, '视频点位数据：', res)
        let videos = videoTrans.transIconFeatures(res, layerConfig.video, this.mapMode)
        this.setVideoList(videos)
      })
    },
    saveVideoPoint(name) { // 保存视频点位
      this.$refs[name].validate(valid => {
        if (valid) { // 表单校验成功
          let result = isInvalidPrincipal(this.pointInfo.principal) // 校验联系人是否不合法
          if (result.flag && result.msg) {
            this.errorMsg(result.msg)
          } else {
            console.log('视频点位信息表单校验成功！')
            this.saveVideoPointData() // 保存视频点位数据
          }
        } else { // 表单校验失败
          console.log('保存视频点位信息表单校验失败！')
          this.selectedTab = 'resource' // 跳转到资源表单信息
        }
      })
    },
    saveVideoPointData() { // 保存视频点位数据
      let pointDataEdit = JSON.parse(JSON.stringify(this.mapResource))
      pointDataEdit.name = this.pointInfo.name
      pointDataEdit[this.mapMode] = this.pointInfo
      this.saveOrUpdateVedioPoint({ _id: pointDataEdit._id, body: pointDataEdit }) // 更新视频点位信息
        .then(res => {
          this.successMsg('视频点位修改成功')
          if (this.is3DMapOuter) { // 楼外3D地图
            this.cancel3DMapSelectedEffect() // 取消3D视地图体选中效果
            this.getVedioResourceOrgTree({ mapType: '3D' }) // 更新视频资源树
          } else { // 楼内地图
            this.cancelBuildingMapSelectedEffect() // 取消楼内地图要素选中效果
            if (this.floorData._id) {
              this.getVedioResourceOrgTree({ mapType: '3D', floorId: this.floorData._id }) // 根据楼层id更新地图资源树
              this.refreshVideoPointDateByFloor() // 刷新楼层视频点位图层数据源
            }
          }
        }).catch(err => {
          let data = (err.response && err.response.data) ? err.response.data : err
          console.log('视频点位修改失败：', data)
          let msg = data.message ? data.message : '视频点位修改失败'
          this.errorMsg(msg)
        })
    },
    changeIconURI(oldIndex, newIndex) { // 改变图标地址
      if (this.setVideoList && this.iconList && this.iconList.length > newIndex) {
        let icon = this.iconList[newIndex]
        this.SET_DEFAULT_POINT_ICON_3D(icon)
        let video = JSON.parse(JSON.stringify(this.mapResource))
        video[this.mapMode].iid = icon
        this.setMapResource(video)
        this.pointInfo.iid = icon
        let videoArr = this.videos.filter(item => item.attributes.id !== video._id)
        let videoFeature = videoTrans.transOneIconFeature(video, layerConfig.video, this.mapMode)
        videoArr.push(videoFeature)
        this.setVideoList(videoArr)
      }
    },
    revertOldSelectedFeature(oldRes) {
      this.getResourceByIdWithoutUpdateState(oldRes._id).then(res => {
        let videoArr = this.videos.filter(item => item.attributes.id !== oldRes._id)
        let video = JSON.parse(JSON.stringify(res))
        let videoFeature = videoTrans.transOneIconFeature(video, layerConfig.video, this.mapMode)
        videoArr.push(videoFeature)
        this.setVideoList(videoArr)
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
