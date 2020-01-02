<!--编辑模式 报警求助右边编辑页面-->
<template>
  <div class="alarmHome">
    <div class="alarmPointHeader">
      <div class="alarmPointTittle">
        <p>报警求助</p>
      </div>
      <div class="iconfont alarmPoinCon">
        <div @click="preView" class="icon-videotape" title="预览"></div>
        <div @click="delPoint" class="icon-delete" title="删除"></div>
      </div>
    </div>
    <div class="alarmPointContent">
      <div class="alarmContentHeader">
        <p class="pointTittle active">基本信息</p>
      </div>
      <div class="alarmMain">
        <bs-scroll ref="scroller">
          <div class="alarmMainHome">
            <Form ref="alarmHelpData" :model="alarmHelpData" :rules="ruleValidate" :label-width="80" label-position="left">
              <Form-item label="终端名称" prop="name">
                <Input :maxlength="64" v-model="alarmHelpData.name" placeholder="请输入终端名称" />
              </Form-item>
              <Form-item label="编号" prop="chan">
                <Input :maxlength="64" v-model="alarmHelpData.chan" placeholder="请输入编号" />
              </Form-item>
              <!-- 联系方式 -->
              <contentWay :principal.sync="pointData.principal"></contentWay>
            </Form>
            <Carousel v-if="iconList.length > 0" v-model="selectedModelIndex" :height="210" :dots="null" arrow="always" loop @on-change="changeIconURI">
              <CarouselItem v-for="(item, index) in iconList" :key="index">
                  <div class="carouselItem"><img :src="item.files[0].path"></div>
              </CarouselItem>
            </Carousel>
          </div>
        </bs-scroll>
      </div>
    </div>
    <div class="alarmPointFooter">
      <Button type="ghost" @click="mapPointCannel('alarmHelpData')" style="margin-right: -3px">取消</Button>
      <Button type="primary" @click="mapPointSave('alarmHelpData')" style="margin-left: 16px">保存</Button>
    </div>
  </div>
</template>
<script>
import contentWay from 'components/map/contentWay'
import { isInvalidPrincipal } from 'components/map/formCheck'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import { RESOURCETYPE, POINTSTATE } from 'assets/2DMap/meta/common'
export default {
  components: {
    contentWay
  },
  data() {
    const nameValidator = (rule, value, callback) => { // 名称校验
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
      alarmHelpData: {},
      pointData: {},
      selectedModelIndex: 0,
      iconList: [],
      ruleValidate: {
        name: [{ required: true, validator: nameValidator, trigger: 'change' }],
        chan: [{ required: true, validator: chanValidator, trigger: 'change' }]
      }
    }
  },
  created() {},
  mounted() {
    if (this.oneMapAlarmData && this.oneMapAlarmData._id) {
      this.initData(this.oneMapAlarmData)
    }
  },
  computed: {
    ...mapState({
    }),
    ...mapGetters({
      oneMapAlarmData: 'selectedMapPointRes', // 普通报警点位数据
      drawFeatureLoc: 'drawFeatureLoc', // 绘制的点位位置
      isOuter: 'isMapOuter', // 楼内外地图的标志
      mapProjection: 'mapProjection', // 当前地图的投影坐标参考系
      activeMapConfig: 'activeMapConfig', // 当前地图配置
      levelData: 'currentFloor', // 当前楼层数据
      alarmColumns: 'alarmColumnFeatures', // 报警柱要素
      alarmBoxs: 'alarmBoxFeatures' // 报警箱要素
    })
  },
  watch: {
    oneMapAlarmData: {
      handler(val) {
        if (val && val._id) {
          this.initData(val)
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(['saveCommonPointRes', 'delOnePointApi', 'getIconList', 'get2DAlarmHelpOrgTree', 'queryAlarmHelpRes', 'setAlarmColumnFeatures', 'setAlarmBoxFeatures']),
    ...mapMutations(['SET_EDIT_RIGHT_PAGE_STATE', 'SET_FEATURE_EDIT_ACTIVE', 'SET_DEFAULT_POINT_ICON']),
    initData(val) {
      let data = JSON.parse(JSON.stringify(val))
      this.iconList = []
      this.alarmHelpData = {
        _id: data._id,
        name: data.name.toString(),
        chan: data.chan.toString(),
        type: data.eid.type
      }
      this.pointData = JSON.parse(JSON.stringify(val.point))
      if (!this.pointData.principal || !this.pointData.principal.length) {
        this.pointData.principal = [{name: '', mobile: ''}]
      }
      this.getIconList({oid: this.pointData.mid.oid}).then(res => {
        this.iconList = JSON.parse(JSON.stringify(res.data))
        for (let i = 0; i < this.iconList.length; i++) {
          if (this.iconList[i]._id === this.pointData.mid._id) {
            this.selectedModelIndex = i
            return
          }
        }
      })
    },
    // 删除点位
    delPoint() {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除所选报警点位吗？</p>',
        onOk: () => {
          let id = this.alarmHelpData && this.alarmHelpData._id
          this.delOnePointApi(id)
            .then(res => {
              this.closeEditVePoCon()
              // 获取地图点位资源
              this.getMapAlarmHelpTree()
              this.getMapAlarmHelp()
              this.successMsg('报警点位删除成功')
            })
            .catch(err => {
              console.log(err)
              this.errorMsg('报警点位删除失败')
            })
        },
        onCancel: () => {}
      })
    },
    // 取消
    mapPointCannel(name) {
      this.$refs[name].resetFields()
      this.closeEditVePoCon()
    },
    changeIconURI(oldIndex, newIndex) {
      if (this.iconList && this.iconList.length > newIndex) {
        let icon = this.iconList[newIndex]
        this.SET_DEFAULT_POINT_ICON(icon) // 设置默认点位图标文件
        this.pointData.mid = icon
        if (icon.files && icon.files.length > 0) {
          let iconUrl = icon.files[0].path // 模型文件的地址
          for (const file of icon.files) {
            if (file.status === POINTSTATE.ONLINE) {
              iconUrl = file.path
              break
            }
          }
          let featureArr = null
          let setfeaturesFun = null
          if (this.alarmHelpData.type === RESOURCETYPE.alarmColumn) {
            featureArr = JSON.parse(JSON.stringify(this.alarmColumns))
            setfeaturesFun = this.setAlarmColumnFeatures
          } else if (this.alarmHelpData.type === RESOURCETYPE.alarmBox) {
            featureArr = JSON.parse(JSON.stringify(this.alarmBoxs))
            setfeaturesFun = this.setAlarmBoxFeatures
          }
          if (featureArr && setfeaturesFun) {
            for (let feature of featureArr) {
              if (feature.attributes.id === this.oneMapAlarmData._id) {
                if (feature.symbol && feature.symbol.iconStyle) {
                  feature.symbol.iconStyle.url = iconUrl
                }
              }
            }
            setfeaturesFun(featureArr)
          }
        }
      }
    },
    // 保存
    mapPointSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.pointData.principal) {
            let result = isInvalidPrincipal(this.pointData.principal) // 校验联系人是否是不合法
            if (result.flag && result.msg) {
              this.errorMsg(result.msg)
            } else {
              this.saveAlarmHelp()
            }
          }
        }
      })
    },
    saveAlarmHelp() {
      let param = JSON.parse(JSON.stringify(this.oneMapAlarmData))
      param.name = this.alarmHelpData.name
      param.chan = this.alarmHelpData.chan
      param.point = this.pointData
      if (this.drawFeatureLoc) {
        param.point.loc = this.drawFeatureLoc
        param.point.projection = this.mapProjection
      }
      this.saveCommonPointRes({ _id: param._id, body: param })
        .then(res => {
          this.closeEditVePoCon()
          this.getMapAlarmHelpTree()
          this.getMapAlarmHelp()
          this.successMsg('信息保存成功')
        })
        .catch(err => {
          let data = (err.response && err.response.data) ? err.response.data : err
          console.log('报警求助点位修改失败', data)
          let msg = data.message ? data.message : '报警求助点位修改失败'
          this.errorMsg(msg)
        })
    },
    // 预览
    preView() {
      this.$store.commit('UPDATE_POINT_VIDEO_LIST', this.oneMapAlarmData)
    },
    // 关闭视频点位编辑位置的控件
    closeEditVePoCon() {
      this.SET_DEFAULT_POINT_ICON(null) // 设置默认点位图标文件
      this.SET_FEATURE_EDIT_ACTIVE(false) // 关闭编辑视频点位的控件
      if (this.isOuter) {
        this.SET_EDIT_RIGHT_PAGE_STATE({ page: '', detail: 'show' }) // 隐藏点位编辑弹框，显示网格列表
      } else {
        this.SET_EDIT_RIGHT_PAGE_STATE({ page: '', detail: 'show' }) // 隐藏点位编辑弹框，显示楼宇编辑页面
      }
    },
    getMapAlarmHelp() { // 加载报警柱点位资源
      let query = {alarm: this.alarmHelpData.type}
      if (this.isOuter && this.activeMapConfig.mapId) {
        query.mapId = this.activeMapConfig.mapId
      } else { // 楼层地图，根据楼层标识加载
        query.sId = this.levelData._id
      }
      this.queryAlarmHelpRes(query)
    },
    getMapAlarmHelpTree() {
      if (this.isOuter) {
        this.get2DAlarmHelpOrgTree({ mapType: '2D' })
      } else {
        this.get2DAlarmHelpOrgTree({ mapType: '2D', floorId: this.levelData._id })
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
  display: flex;
}
.alarmHome .alarmPointHeader .alarmPoinCon div:hover {
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
.icon-delete {
  margin-left: 12px;
}
/* 走马灯项下图片的样式 */
.carouselItem img {
  max-width: 180px;
  max-height: 180px;
}
 /* 覆盖iview走马灯项的样式 */
.ivu-carousel-item {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
