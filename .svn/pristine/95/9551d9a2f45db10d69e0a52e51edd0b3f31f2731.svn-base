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
        <p class="pointTittle" :class="{'active': !menuTag}" @click="nenuInfoClick">基本信息</p>
        <p class="pointTittle" v-if="mapsignType !== 0" :class="{'active': menuTag}" @click="nenuCtrolClick">样式控制</p>
      </div>
      <div v-if="!menuTag" class="alarmMain">
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
              <Form-item label="地图标识">
                <Select v-model="mapsignType" style="width:100%" @on-change="getMapsign">
                  <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </Form-item>
              <!-- 联系方式 -->
              <contentWay :principal.sync="alarmPointData.principal"></contentWay>
              <Carousel v-if="iconList.length > 0 && mapsignType === 0" v-model="selectedModelIndex" :height="210" :dots="null" arrow="always" loop @on-change="changeIconURI">
                <CarouselItem v-for="(item, index) in iconList" :key="index">
                    <div class="carouselItem"><img :src="item.files[0].path"></div>
                </CarouselItem>
              </Carousel>
            </Form>
          </div>
        </bs-scroll>
      </div>
      <div v-if="menuTag" class="alarmMain alarmMainHome">
        <styleCtrol :StyleDefeat.sync="alarmPointData.style" :isLineCantShow="isLineCantShow" :isAreaCantShow="isAreaCantShow"></styleCtrol>
      </div>
    </div>
    <div v-if="!menuTag" class="alarmPointFooter">
      <Button type="ghost" @click="mapPointCannel('alarmPointData')" style="margin-right: -3px">取消</Button>
      <Button type="primary" @click="mapPointSave('alarmPointData')" style="margin-left: 16px">保存</Button>
    </div>
  </div>
</template>
<script>
import styleCtrol from '../styleCtrol'
import contentWay from 'components/map/contentWay'
import { isInvalidPrincipal } from 'components/map/formCheck'
import { RESOURCETYPE, MPSIGNKEY, RESICONOID, POINTSTATE } from 'assets/2DMap/meta/common'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import styleConfig from 'assets/2DMap/meta/style'
export default {
  components: {
    contentWay,
    styleCtrol
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
      menuTag: true,
      modelList: [ {}, {} ],
      iconList: [],
      selectedModelIndex: 0,
      mapsignType: 0,
      ruleValidate: {
        name: [{ required: true, validator: nameValid, trigger: 'change' }],
        chan: [{ required: true, validator: chanValidator, trigger: 'change' }]
      },
      typeList: [
        { label: '点', value: MPSIGNKEY.point },
        { label: '线', value: MPSIGNKEY.lineString },
        { label: '面', value: MPSIGNKEY.polygon }
      ],
      // 地图标识是线或面，不现实字体相关设置
      isLineCantShow: true,
      isAreaCantShow: true
    }
  },
  watch: {
    oneMapAlarmData: {
      handler(val) {
        if (val && val._id) {
          this.toAlarmInit(val)
        }
      },
      deep: true
    },
    mapsignType(newVal, oldVal) {
      if (newVal === 1) {
        this.isAreaCantShow = false
      } else if (newVal === 2) {
        this.isAreaCantShow = true
      } else {
        this.isAreaCantShow = false
      }
      console.log(newVal, oldVal, this.alarmPointData.style, 'this.alarmPointData.style')
    }
  },
  created() {},
  mounted() {
    if (this.oneMapAlarmData && this.oneMapAlarmData._id) {
      this.toAlarmInit(this.oneMapAlarmData)
    }
  },
  computed: {
    ...mapState({
    }),
    ...mapGetters('map2DEditIX', ['editTreeChangeCounter']),
    ...mapGetters({
      oneMapAlarmData: 'selectedMapPointRes', // 普通报警点位数据
      drawFeatureLoc: 'drawFeatureLoc', // 绘制的点位位置
      drawFeatureStyle: 'drawFeatureStyle', // 绘制样式
      isOuter: 'isMapOuter', // 楼内外地图的标志
      mapProjection: 'mapProjection', // 当前地图的投影坐标参考系
      activeMapConfig: 'activeMapConfig', // 当前地图配置
      commonAlarms: 'commonAlarmFeatures', // 普通报警要素
      fireAlarms: 'fireAlarmFeatures', // 普通报警要素
      alarmHosts: 'alarmHostFeatures', // 报警主机要素
      levelData: 'currentFloor' // 当前楼层数据
    })
  },
  methods: {
    ...mapActions('map2DEditIX', ['changeEditTreeChangeCounter']),
    ...mapActions([
      'saveCommonPointRes',
      'delOnePointApi',
      'loadCommonAlarmsByMapId',
      'loadFireAlarmsByMapId',
      'loadAlarmHostsByMapId',
      'loadResourceByFloorId',
      'getIconList',
      'queryDefaultIconByOid',
      'setCommonAlarmFeatures',
      'setFireAlarmFeatures',
      'setAlarmHostFeatures'
    ]),
    ...mapMutations([
      'SET_FEATURE_EDIT_ACTIVE',
      'SET_EDIT_RIGHT_PAGE_STATE',
      'SET_DEFAULT_POINT_ICON',
      'SET_LOCATE_FEATURES',
      'SET_POINT_DRAW_ACTIVE', // 设置点位绘制是否是激活
      'SET_LINE_DRAW_ACTIVE', // 设置线绘制激活状态
      'SET_AREA_DRAW_ACTIVE' // 设置区域绘制是否是激活
    ]),
    changeIconURI(oldIndex, newIndex) { // 改变模型
      if (this.iconList && this.iconList.length > newIndex) {
        let icon = this.iconList[newIndex]
        this.SET_DEFAULT_POINT_ICON(icon) // 设置默认图标
        this.alarmPointData.mid = icon
        if (icon.files && icon.files.length > 0) {
          let iconUrl = icon.files[0].path // 模型文件的地址
          for (const file of icon.files) {
            if (file.status === POINTSTATE.ONLINE) {
              iconUrl = file.path
              break
            }
          }
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
            for (let feature of featureArr) {
              if (feature.attributes.id === this.oneMapAlarmData._id) {
                if (feature.symbol && feature.symbol.iconStyle) {
                  feature.symbol.iconStyle.url = iconUrl
                }
              }
            }
            setFeaturesFun(featureArr)
          }
        }
      }
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
    getMapsign(val) {
      this.clearCurrentFeature() // 清空当前要素
      let oid = RESICONOID.commonAlarm
      this.queryDefaultIconByOid(oid).then(res => {
        // console.log('根据oid查询点位默认图标数据：', res)
        let pointIcon = JSON.parse(JSON.stringify(res))
        if (!pointIcon && !pointIcon.oid) {
          pointIcon.oid = oid
        }
        this.SET_DEFAULT_POINT_ICON(pointIcon) // 设置默认点位图标文件
        if (val === MPSIGNKEY.point) {
          this.SET_POINT_DRAW_ACTIVE(true)
          this.SET_FEATURE_EDIT_ACTIVE(false)
        } else if (val === MPSIGNKEY.lineString) {
          this.SET_LINE_DRAW_ACTIVE(true)
          this.SET_FEATURE_EDIT_ACTIVE(false)
        } else if (val === MPSIGNKEY.polygon) {
          this.SET_AREA_DRAW_ACTIVE(true)
          this.SET_FEATURE_EDIT_ACTIVE(false)
        }
      })
    },
    toAlarmInit(val) {
      this.iconList = []
      let data = JSON.parse(JSON.stringify(val))
      this.mapsignType = JSON.parse(JSON.stringify(data.mapsign.signtype))
      this.toMapSign(this.mapsignType)
      let point = data.point
      // if (data.mapsign.signtype === 0) {
      this.menuTag = false
      // }
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
      this.getIconList({oid: this.alarmPointData.mid.oid}).then(res => {
        this.iconList = JSON.parse(JSON.stringify(res.data))
        for (let i = 0; i < this.iconList.length; i++) {
          if (this.iconList[i]._id === this.alarmPointData.mid._id) {
            this.selectedModelIndex = i
            return
          }
        }
      })
    },
    toMapSign(val) {
      let sign = val.toString()
      if (sign === '0') {
        this.isLineCantShow = true
        this.isAreaCantShow = true
        return { lable: '图标', value: 0 }
      } else if (sign === '1') {
        this.isLineCantShow = false
        this.isAreaCantShow = false
        return { lable: '线', value: 1 }
      } else if (sign === '2') {
        this.isLineCantShow = false
        this.isAreaCantShow = true
        return { lable: '区域', value: 2 }
      }
    },
    toWithdrawTime(val) {
      if (val) {
        return val.name
      } else {
        return '无'
      }
    },
    // 取消
    mapPointCannel(name) {
      this.$refs[name].resetFields()
      this.closeEditVePoCon()
    },
    // 保存
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
      parm.mapsign.signtype = this.mapsignType
      if (this.mapsignType === MPSIGNKEY.lineString) {
        parm.point.style = this.alarmPointData.style ? this.alarmPointData.style : JSON.parse(JSON.stringify(styleConfig.defaultLine))
        parm.point.style = this.drawFeatureStyle ? this.drawFeatureStyle : parm.point.style
      } else if (this.mapsignType === MPSIGNKEY.polygon) {
        parm.point.style = this.alarmPointData.style ? this.alarmPointData.style : JSON.parse(JSON.stringify(styleConfig.defaultArea))
        parm.point.style = this.drawFeatureStyle ? this.drawFeatureStyle : parm.point.style
      }
      let resType = parm.type
      this.saveCommonPointRes({ _id: parm._id, body: parm })
        .then(res => {
          this.closeEditVePoCon()
          this.getMapResource(resType) // 加载地图资源
          this.successMsg('信息保存成功')
        })
        .catch(err => {
          let data = (err.response && err.response.data) ? err.response.data : err
          console.log('报警点位修改失败：', data)
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
          this.delOnePointApi(this.oneMapAlarmData._id)
            .then(res => {
              this.closeEditVePoCon()
              this.successMsg('报警点位删除成功')
              this.getMapResource(resType) // 加载地图资源
            })
            .catch(err => {
              console.log(err)
              this.errorMsg('报警点位删除失败')
            })
        },
        onCancel: () => {}
      })
    },
    // 关闭视频点位编辑位置的控件
    closeEditVePoCon() {
      this.SET_DEFAULT_POINT_ICON(null) // 清空默认图标
      this.SET_FEATURE_EDIT_ACTIVE(false) // 关闭编辑视频点位的控件
      this.SET_LINE_DRAW_ACTIVE(false) // 结束线绘制
      this.SET_AREA_DRAW_ACTIVE(false) // 结束面绘制
      if (this.isOuter) {
        this.SET_EDIT_RIGHT_PAGE_STATE({ page: '', detail: 'show' }) // 隐藏点位编辑弹框，显示网格列表
      } else {
        this.SET_EDIT_RIGHT_PAGE_STATE({ page: '', detail: 'show' }) // 隐藏点位编辑弹框，显示楼宇编辑页面
      }
    },
    nenuInfoClick() {
      this.menuTag = false
    },
    nenuCtrolClick() {
      this.menuTag = true
    },
    // 获取地图点位资源
    getMapResource(resType) {
      let counter = {optTab: 'alarm', count: this.editTreeChangeCounter.count + 1}
      this.changeEditTreeChangeCounter(counter)
      if (resType === RESOURCETYPE.commonAlarm) { // 普通报警
        if (this.isOuter) {
          this.loadCommonAlarmsByMapId(this.activeMapConfig.mapId)
        } else {
          this.loadResourceByFloorId({ floorId: this.levelData._id, channelTypes: RESOURCETYPE.commonAlarm })
        }
      } else if (resType === RESOURCETYPE.alarmHost) { // 报警主机报警
        if (this.isOuter) {
          this.loadAlarmHostsByMapId(this.activeMapConfig.mapId)
        } else {
          this.loadResourceByFloorId({ floorId: this.levelData._id, channelTypes: RESOURCETYPE.alarmHost })
        }
      } else if (resType === RESOURCETYPE.fireAlarm) { // 消防报警
        if (this.isOuter) {
          this.loadFireAlarmsByMapId(this.activeMapConfig.mapId)
        } else {
          this.loadResourceByFloorId({ floorId: this.levelData._id, channelTypes: RESOURCETYPE.fireAlarm })
        }
      }
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
