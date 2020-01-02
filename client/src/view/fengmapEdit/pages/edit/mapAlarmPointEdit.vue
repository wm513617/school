<!--编辑模式 报警点位右边编辑页面-->
<template>
  <div class="alarmHome">
    <div class="alarmPointHeader">
      <div class="alarmPointTittle">
        <p>报警点位</p>
      </div>
      <div class="iconfont alarmPoinCon">
        <div @click="delPoint" class="icon-delete" title="删除"></div>
      </div>
    </div>
    <div class="alarmPointContent">
      <div class="alarmContentHeader">
        <p class="pointTittle">基本信息</p>
      </div>
      <div class="alarmMain">
        <bs-scroll ref="scroller">
          <div class="alarmMainHome">
            <Form ref="alarmPointData" :model="alarmPointData" :rules="ruleValidate" :label-width="80" label-position="left">
              <Form-item label="点位名称" prop="name">
                <Input :maxlength="64" v-model="alarmPointData.name" placeholder="请输入点位名称" />
              </Form-item>
              <Form-item label="编号" prop="chan">
                <Input :maxlength="64" v-model="alarmPointData.chan" placeholder="请输入编号" />
              </Form-item>
              <Form-item label="级别">
                <Input :maxlength='16' v-model="alarmPointData.level" disabled />
              </Form-item>
              <Form-item label="布撤防时间">
                <Input :maxlength='16' v-model="alarmPointData.withdrawTime" disabled />
              </Form-item>
              <!-- 联系方式 -->
              <contentWay :principal.sync="alarmPointData.principal"></contentWay>
              <Carousel v-if="iconList.length > 0" v-model="selectedModelIndex" :height="210" :dots="null" arrow="always" loop @on-change="changeIconURI">
                <CarouselItem v-for="(item, index) in iconList" :key="index">
                    <div class="carouselItem"><img :src="item.files[0].path"></div>
                </CarouselItem>
              </Carousel>
            </Form>
          </div>
        </bs-scroll>
      </div>
    </div>
    <div class="alarmPointFooter">
      <Button type="ghost" @click="mapPointCannel('alarmPointData')" style="margin-right: -3px">取消</Button>
      <Button type="primary" @click="mapPointSave('alarmPointData')" style="margin-left: 16px">保存</Button>
    </div>
  </div>
</template>
<script>
import contentWay from 'components/map/contentWay'
import { isInvalidPrincipal } from 'components/map/formCheck'
import { RESOURCETYPE, RESICONOID } from 'assets/2DMap/meta/common'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import pointResource from '../../baseMap/layers/pointResource'
export default {
  components: {
    contentWay
  },
  data() {
    const nameValid = (rule, value, callback) => { // 名称校验
      value = value.replace(/(^\s*)|(\s*$)/g, '')
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
      alarmPointData: {},
      modelList: [ {}, {} ],
      iconList: [],
      selectedModelIndex: 0,
      ruleValidate: {
        name: [{ required: true, validator: nameValid, trigger: 'change' }],
        chan: [{ required: true, validator: chanValidator, trigger: 'change' }]
      },
      hasInitOldIndex: false
    }
  },
  mixins: [pointResource],
  watch: {
    oneMapAlarmData: {
      handler(val) {
        if (val && val._id) {
          this.initAlarmPoint()
        }
      },
      deep: true
    }
  },
  mounted() {
    if (this.oneMapAlarmData && this.oneMapAlarmData._id) {
      this.initAlarmPoint()
    }
  },
  computed: {
    ...mapState({
      oneMapAlarmData: ({ fengMap }) => fengMap.selectedFMapPointRes // 单个门禁点位
    }),
    ...mapGetters({
      drawFeatureLoc: 'drawFeatureLoc', // 绘制的点位位置
      mapProjection: 'mapProjection' // 当前地图的投影坐标参考系
    })
  },
  methods: {
    ...mapActions('fengMap', ['savefmResourcePoint', 'changeFMeditRightPage', 'delOneFMPoint']),
    ...mapActions([
      'getIconList'
    ]),
    ...mapMutations([
      'SET_FEATURE_EDIT_ACTIVE',
      'SET_DEFAULT_POINT_ICON',
      'SET_POINT_DRAW_ACTIVE' // 设置点位绘制是否是激活
    ]),
    ...mapMutations('fengMap', ['UPDATE_FMEDIT_ICON', 'SET_DEL_MARKER_POINT']),
    initAlarmPoint() {
      this.iconList = []
      let data = JSON.parse(JSON.stringify(this.oneMapAlarmData))
      let point = data.point
      this.alarmPointData = {
        name: data.name.toString(),
        chan: data.chan.toString(),
        withdrawTime: this.toWithdrawTime(data.alarmtemplate),
        principal: (point.principal && point.principal.length) ? point.principal : [{name: '', mobile: ''}],
        loc: point.loc,
        mapId: point.mapId,
        style: point.style,
        sid: point.sid,
        level: data.level,
        mid: point.mid
      }
      this.getIconIndex()
    },
    // 设置当前选择的图标 index
    getIconIndex() { // 设置当前选择的图标 index
      if (!this.iconList.length) {
        this.getIconList({oid: this.alarmPointData.mid.oid}).then(res => {
          this.iconList = JSON.parse(JSON.stringify(res.data))
          for (let i = 0; i < this.iconList.length; i++) {
            if (this.iconList[i]._id === this.alarmPointData.mid._id) {
              this.selectedModelIndex = i
              return
            }
          }
        })
      }
    },
    updateIcon(index) {
      if (this.oneMapAlarmData && this.iconList && this.iconList.length > index) {
        let icon = this.iconList[index]
        const type = this.getResourceType(this.oneMapAlarmData.type)
        this.UPDATE_FMEDIT_ICON([type, icon, this.oneMapAlarmData._id])
      }
    },
    changeIconURI(oldIndex, newIndex) { // 改变图标
      if (!this.hasInitOldIndex) {
        this.oldIndex = oldIndex
        this.hasInitOldIndex = true
      }
      this.updateIcon(newIndex)
    },
    clearCurrentFeature() { // 清空当前要素
      let featureArr = null
      let setFeaturesFun = null
      if (this.oneMapAlarmData.type === RESOURCETYPE.commonAlarm) { // 普通报警
        featureArr = JSON.parse(JSON.stringify(this.commonAlarms))
        setFeaturesFun = this.setCommonAlarmFeatures
      } else if (this.oneMapAlarmData.type === RESOURCETYPE.alarmHost) { // 报警主机
        featureArr = JSON.parse(JSON.stringify(this.alarmHosts))
        setFeaturesFun = this.setAlarmHostFeatures
      } else if (this.oneMapAlarmData.type === RESOURCETYPE.fireAlarm) { // 消防报警
        featureArr = JSON.parse(JSON.stringify(this.fireAlarms))
        setFeaturesFun = this.setFireAlarmFeatures
      }
      if (featureArr && setFeaturesFun) {
        let alarmArr = featureArr.filter(item => item.attributes.id !== this.oneMapAlarmData._id)
        setFeaturesFun(alarmArr)
        this.SET_LOCATE_FEATURES([]) // 清空定位要素
      }
    },
    toWithdrawTime(val) {
      return (val && val.name) || '无'
    },
    // 取消
    mapPointCannel(name) {
      this.$refs[name].resetFields()
      // 下边两个方法顺序不能变:
      // closeEditVePoCon 中会清除数据，updateIcon中会拿不到数据
      this.updateIcon(this.oldIndex)
      this.closeEditVePoCon()
    },
    // 保存前，表单验证
    mapPointSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.alarmPointData.principal) {
            let result = isInvalidPrincipal(this.alarmPointData.principal) // 校验联系人是否不合法
            if (result.flag && result.msg) {
              this.errorMsg(result.msg)
            } else {
              this.saveAlarm()
            }
          }
        }
      })
    },
    // 保存
    saveAlarm() {
      let parm = JSON.parse(JSON.stringify(this.oneMapAlarmData))
      parm.name = this.alarmPointData.name
      parm.chan = this.alarmPointData.chan
      parm.point.principal = this.alarmPointData.principal
      if (this.drawFeatureLoc) {
        parm.point.loc = this.drawFeatureLoc
        parm.point.projection = this.mapProjection
      }
      parm.point.mid = this.alarmPointData.mid
      this.savefmResourcePoint({ _id: parm._id, body: parm }).then(res => {
        this.successMsg('报警点位修改成功')
        this.closeEditVePoCon()
        // this.updatePointTreeCount('alarm') // 更新资源树
      }).catch(err => {
        let data = (err.response && err.response.data) ? err.response.data : err
        let msg = data.message ? data.message : '报警点位修改失败'
        this.errorMsg(msg)
      })
    },
    // 删除
    delPoint() {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除所选报警点位吗？</p>',
        onOk: () => {
          let resType = this.oneMapAlarmData.type
          this.delOneFMPoint(this.oneMapAlarmData._id).then(res => {
            this.successMsg('报警点位删除成功')
            const markertype = this.getResourceType(resType)
            // 设置 删除信息 以 监听 删除图标
            this.SET_DEL_MARKER_POINT({type: markertype, channelId: this.oneMapAlarmData._id})
            this.closeEditVePoCon()
            this.updatePointTreeCount('alarm') // 更新资源树
          }).catch(err => {
            console.log(err)
            this.errorMsg('报警点位删除失败')
          })
        }
      })
    },
    // 关闭视频点位编辑位置的控件
    closeEditVePoCon() {
      this.setPointStatus()
      this.changeFMeditRightPage({ page: '', detail: 'show' })
    },
    // 获取地图点位资源类型
    getResourceType(resType) {
      let markertype
      if (resType === RESOURCETYPE.commonAlarm) { // 普通报警
        markertype = RESICONOID.commonAlarm
      } else if (resType === RESOURCETYPE.alarmHost) { // 报警主机报警
        markertype = RESICONOID.alarmHost
      } else if (resType === RESOURCETYPE.fireAlarm) { // 消防报警
        markertype = RESICONOID.fireAlarm
      }
      return markertype
    }
  }
}
</script>
<style scoped>
.alarmHome,
.alarmHome .alarmPointContent,
.alarmHome .alarmPointContent .alarmMain,
.alarmHome .alarmPointContent .alarmMain .alarmMainHomeMain {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.alarmHome .alarmPointHeader {
  height: 40px;
  width: 100%;
  line-height: 40px;
  clear: both;
  background-color: #0f2343;
}
.alarmHome .alarmPointHeader .alarmPointTittle {
  float: left;
  margin-left: 20px;
  font-size: 14px;
}
.alarmHome .alarmPointHeader .alarmPoinCon {
  float: right;
  margin-right: 20px;
  cursor: pointer;
}
.alarmHome .alarmPointHeader .alarmPoinCon:hover {
  color: #20adff;
}
.alarmHome .alarmPointContent .alarmMainHome {
  padding: 0px 20px;
}
.alarmHome .alarmPointContent .alarmContentHeader {
  width: 100%;
  height: 50px;
}
.alarmHome .alarmPointContent .alarmContentHeader .pointTittle {
  height: 40px;
  line-height: 40px;
  display: inline-block;
  margin: 0 10px;
  padding: 0 10px;
  margin-bottom: 10px;
  cursor: pointer;
}
.alarmHome .alarmPointContent .alarmContentHeader .active {
  border-bottom: 1px solid #4996f9;
}
.alarmPointFooter {
  height: 40px;
  width: 100%;
  line-height: 40px;
  clear: both;
  text-align: center;
}
.linkMan {
  text-align: center;
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
  width: 180px;
  height: 180px;
}
 /* 覆盖iview走马灯项的样式 */
.ivu-carousel-item {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
