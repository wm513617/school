<!--编辑模式 视频点位的右边编辑框的页面-->
<template>
  <div class="videoPoint">
    <div class="videoPointHeader">
      <div class="pointHeaderTittle">
        <p>视频点位</p>
      </div>
      <div class="pointHeaderContent iconfont">
        <div @click="preView" class="icon-videotape" title="预览"></div>
        <div @click="delPoint" class="icon-delete" title="删除"></div>
      </div>
    </div>
    <div class="videoPointContent">
      <div class="pointContentHeader">
        <p class="pointTittle">基本信息</p>
      </div>
      <div class="videoMain">
         <bs-scroll ref="scroller">
          <div class="pointMainHome">
            <Form ref="pointData" :model="pointData" :rules="ruleValidate" :label-width="70" label-position="left">
              <Form-item label="资源名称" prop="name">
                <Input :maxlength="64" v-model="pointData.name" placeholder="请输入" />
              </Form-item>
              <Form-item label="可见范围" prop="class">
                <InputNumber :max="28" :min="0" :maxlength='2' v-model="pointData.class" placeholder="最大28级"></InputNumber>
              </Form-item>
              <Form-item label="厂商" prop="firm">
                <Input v-model="pointData.firm" placeholder="请输入厂商" disabled/>
              </Form-item>
              <!-- 联系方式 -->
              <contentWay :principal.sync="pointData.principal"></contentWay>
              <Form-item label='经纬度'>
                <Input v-model="pointData.loc" disabled/>
              </Form-item>
            </Form>
            <div class='tabs'>
              <div class="tab" :class="{actived: activedTab === 'img'}" @click="activedTab = 'img';$refs.scroller.update()">图标</div>
              <div class="tab" :class="{actived: activedTab === 'see'}" @click="activedTab = 'see';$refs.scroller.update()">可视域</div>
            </div>
            <div v-show="activedTab === 'img'" class="img-icon">
              <Carousel v-if="iconList.length > 0" v-model="selectedModelIndex" :height="210" :dots="null" arrow="always" loop @on-change="changeIconURI">
                <CarouselItem v-for="(item, index) in iconList" :key="index">
                    <div class="carouselItem"><img :src="item.files[0].path"></div>
                </CarouselItem>
              </Carousel>
            </div>
            <div class="pointTittle" v-show="activedTab === 'see'">
              <Checkbox v-model="posInfoFlag" @on-change="vedioPosition">可视域</Checkbox>
            </div>
            <Form ref="pointDataAn" v-show="activedTab === 'see'" :model="pointData" :label-width="70" :rules="ruleValidate" label-position="left">
              <Form-item label="照射半径" prop="radius">
                <InputNumber :max="150" :disabled="!posInfoFlag" :min="0" v-model="pointData.radius" @input="radiusInput"></InputNumber>米
              </Form-item>
              <Form-item label="可视角度" prop="viewshed">
                <InputNumber :max="150" :disabled="!posInfoFlag" :min="0" v-model="pointData.viewshed" @input="anglesInput"></InputNumber>°
              </Form-item>
              <Form-item label="点位角度" prop="angle">
                <InputNumber :max="360" :min="-360" v-model="pointData.angle" @input="rangeInput"></InputNumber>°
              </Form-item>
            </Form>
            <div v-show="activedTab === 'see'">
              <svg width="200px" height="200px" class="svgclass" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <text x="185" y="105" fill="#FFF">0°</text>
                <text x="90" y="15" fill="#FFF">90°</text>
                <text x="0" y="105" fill="#FFF">180°</text>
                <text x="90" y="200" fill="#FFF">270°</text>
                <line x1="30" y1="100" x2="180" y2="100" style="stroke:rgb(255,255,255);stroke-width:1" />
                <line x1="100" y1="20" x2="100" y2="180" style="stroke:rgb(255,255,255);stroke-width:1" />
                <g id="ringIdMax">
                  <g ref="ringId">
                    <path ref="ring" fill="#20a1ff" />
                    <circle cx="100" cy="100" r="10" stroke="black" stroke-width="1" fill="#FFF" />
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </bs-scroll>
      </div>
    </div>
    <div class="videoPointFooter">
      <Button type="ghost" @click="mapPointCannel('pointData')" style="margin-right: -3px">取消</Button>
      <Button type="primary" @click="mapPointSave('pointData')" style="margin-left: 16px">保存</Button>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import contentWay from 'components/map/contentWay'
import { isInvalidPrincipal } from 'components/map/formCheck'
import videoTrans from 'assets/2DMap/feature/edit/video'
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
    return {
      // 点位信息
      pointData: {},
      // 点位信息表单验证规则
      ruleValidate: {
        name: [{ required: true, validator: nameValid, trigger: 'change' }],
        class: [{ required: true, message: '请输入可见范围' }]
      },
      posInfoFlag: false,
      pointAngle: 0,
      pastPointAngle: 0,
      selectedModelIndex: 0,
      activedTab: 'img',
      iconList: [], // 可用图标列表
      hasInitOldIndex: false // 是否切换过图标
    }
  },
  mixins: [pointResource],
  computed: {
    ...mapState({
      detail: ({ mapIndex }) => mapIndex.mapEditRightPage.detail,
      activeMapConfig: ({ mapIndex }) => mapIndex.activeMapConfig,
      editCheckList: ({ mapVedioData }) => mapVedioData.editCheckList,
      levelData: ({ mapArea }) => mapArea.currentFloor
    }),
    ...mapGetters('fengMap', {
      pointDataMol: 'selectedFMapPointRes', // 视频资点位数据
      isSector: 'sector' // 可视域
    }),
    ...mapGetters({
      mapProjection: 'mapProjection', // 当前地图投影方式
      drawFeatureLoc: 'drawFeatureLoc' // 绘制的点位位置
    }),
    ...mapGetters('map2DEditIX', {
    })
  },
  watch: {
    pointDataMol: { // 点位信息
      handler(val) {
        if (val && val._id) {
          this.updateDataAttr()
        }
      },
      deep: true
    },
    pointData: { // 点位信息
      handler(val) {
        if (val) {
          this.SET_VIDEO_EDIT_POINT_DATA(JSON.parse(JSON.stringify(val)))
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('fengMap', ['changeFMeditRightPage', 'savefmResourcePoint', 'delOneFMPoint']),
    ...mapActions([
      'getIconList' // 图标切换列表
    ]),
    ...mapMutations('fengMap', ['UPDATE_FMEDIT_ICON', 'SET_DEL_MARKER_POINT']),
    ...mapMutations([
      'SET_FEATURE_EDIT_ACTIVE', // 地图编辑点位位置的控件
      'SET_VIDEO_EDIT_SECTOR_CHECKED', // 设置视频编辑时覆盖区域是否勾选
      'SET_VIDEO_EDIT_POINT_DATA' // 设置视频编辑时点位状态
    ]),
    initPageData(val) {
      this.posInfoFlag = false
      this.iconList = []
      let pointDataVal = JSON.parse(JSON.stringify(val))
      this.pointData = pointDataVal.point
      this.pointData.name = pointDataVal.name
      if (pointDataVal.eid) {
        if (pointDataVal.eid.manufacturer) {
          this.pointData.firm = pointDataVal.eid.manufacturer
        } else {
          this.pointData.firm = '-'
        }
      } else {
        this.pointData.firm = '-'
      }
      if (!this.pointData.principal || !this.pointData.principal.length) {
        this.pointData.principal = [{name: '', mobile: ''}]
      }
      this.radiusInput(this.pointData.radius)
      this.anglesInput(this.pointData.viewshed)
    },
    // 视频点位 调整位置勾选
    vedioPosition(flag) {
      this.SET_VIDEO_EDIT_SECTOR_CHECKED(flag)
      if (flag) {
        this.updateCurrnetSector()
      } else {
        !this.isSector && this.setVideoSectorFeatures && this.setVideoSectorFeatures([])
      }
    },
    // 照射半径
    radiusInput(val) {
      this.sectorChecked && this.updateCurrnetSector()
    },
    // 可视角度
    anglesInput(val) {
      let svgMax = parseInt(val)
      let path = this.$refs.ring
      let ringId = this.$refs.ringId
      this.setSvg(ringId, path, svgMax, 50, 100)
      if (ringId.setAttribute) {
        ringId.setAttribute('transform', 'rotate(' + (135 - svgMax) + ', 100,100)')
      }
      this.pointAngle = -(parseInt(val) - 90) / 2
      ringId.setAttribute('transform', 'rotate(' + parseFloat(this.pointAngle) + ', 100,100)')
      this.sectorChecked && this.updateCurrnetSector()
    },
    // 点位角度
    rangeInput(val) {
      /* global ringIdMax */
      let newVal = -val + this.pointAngle
      this.pastPointAngle = parseFloat(newVal) + parseFloat(this.pointData.viewshed) / 2
      ringIdMax.setAttribute('transform', 'rotate(' + this.pastPointAngle + ', 100,100)')
      this.updateCurrentVideo() // 更新当前视频要素
      this.sectorChecked && this.updateCurrnetSector() // 更新当前视频覆盖区域要素
    },
    updateCurrnetSector() { // 更新当前视频覆盖区域要素
      if (this.setVideoSectorFeatures) {
        let video = JSON.parse(JSON.stringify(this.pointDataMol))
        video.point = JSON.parse(JSON.stringify(this.pointData))
        video.point.loc = this.drawFeatureLoc ? this.drawFeatureLoc : video.point.loc
        let sectorArr = this.videoSectors.filter(item => item.attributes.id !== video._id)
        let sectorFeature = videoTrans.transOneSectorFeature(video, this.videoSectorLayer)
        sectorArr.push(sectorFeature)
        this.setVideoSectorFeatures(sectorArr)
      }
    },
    updateCurrentVideo() { // 更新当前视频要素
      if (this.setVideoFeatures) {
        let video = JSON.parse(JSON.stringify(this.pointDataMol))
        video.point = JSON.parse(JSON.stringify(this.pointData))
        let videoArr = this.videos.filter(item => item.attributes.id !== video._id)
        let videoFeature = videoTrans.transOneIconFeature(video, this.videoLayer)
        videoArr.push(videoFeature)
        this.setVideoFeatures(videoArr)
      }
    },
    /**
     * @param {*} ringId 绘制扇形的外层画布
     * @param {*} path 绘制扇形的div
     * @param {*} progress
     * @param {*} r 半径
     * @param {*} z 中心点坐标
     */
    setSvg(ringId, path, progress, r, z) {
      path.setAttribute('transform', 'translate(' + z + ',' + z + ')')
      let degrees = progress
      let rad = degrees * (Math.PI / 180)
      let x = (Math.sin(rad) * r).toFixed(2)
      let y = -(Math.cos(rad) * r).toFixed(2)
      let lenghty = window.Number(degrees > 180)
      let descriptions = ['M', 0, 0, 'v', -r, 'A', r, r, 0, lenghty, 1, x, y, 'z']
      path.setAttribute('d', descriptions.join(' '))
    },
    // 取消保存
    mapPointCannel(name) {
      this.$refs[name].resetFields()
      this.updateIcon(this.oldIndex)
      this.closeEditVePoCon()
    },
    // 保存前，表单验证
    mapPointSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.pointData.principal) {
            let result = isInvalidPrincipal(this.pointData.principal)
            if (result.flag && result.msg) {
              this.errorMsg(result.msg)
            } else {
              if (typeof this.pointData.radius === 'number' && this.pointData.radius >= 0) {
                if (typeof this.pointData.viewshed === 'number' && this.pointData.viewshed >= 0) {
                  if (typeof this.pointData.angle === 'number') {
                    this.onePointSave() // 表单校验通过执行保存操作
                  } else {
                    this.errorMsg('请输入点位角度')
                  }
                } else {
                  this.errorMsg('请输入可视角度')
                }
              } else {
                this.errorMsg('请输入照射半径')
              }
            }
          }
        }
      })
    },
    // 保存修改
    onePointSave() {
      let id = this.pointDataMol && this.pointDataMol._id
      let pointDataEdit = JSON.parse(JSON.stringify(this.pointDataMol))
      pointDataEdit.point = this.pointData
      if (this.drawFeatureLoc) {
        pointDataEdit.point.loc = this.drawFeatureLoc
        pointDataEdit.point.projection = this.mapProjection
      }
      pointDataEdit.name = this.pointData.name
      this.savefmResourcePoint({ _id: id, body: pointDataEdit }).then(res => {
        this.closeEditVePoCon()
        this.updatePointTreeCount('video') // 更新资源树
      }).catch(err => {
        let data = (err.response && err.response.data) ? err.response.data : err
        let msg = data.message ? data.message : '视频点位修改失败'
        this.errorMsg(msg)
      })
    },
    updateIcon(index) { // 更换地图上显示的图标
      if (this.pointDataMol && this.iconList && this.iconList.length > index) {
        const oid = this.getVideoSubtype(this.pointDataMol)
        let icon = this.iconList[index]
        this.UPDATE_FMEDIT_ICON([oid, icon, this.pointDataMol._id])
      }
    },
    changeIconURI(oldIndex, newIndex) { // 更换图标
      if (!this.hasInitOldIndex) {
        this.oldIndex = oldIndex
        this.hasInitOldIndex = true
      }
      this.updateIcon(newIndex)
    },
    // 删除点位
    delPoint() {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除所选视频点位吗？</p>',
        onOk: () => {
          this.delOneFMPoint(this.pointDataMol._id).then(res => {
            this.successMsg('视频点位删除成功')
            this.updatePointTreeCount('video') // 更新资源树
            const markertype = this.getVideoSubtype(this.pointDataMol)
            // 设置 删除信息 以 监听 删除图标
            this.SET_DEL_MARKER_POINT({type: markertype, channelId: this.pointDataMol._id})
            this.closeEditVePoCon()
          }).catch(err => {
            console.log(err)
            this.errorMsg('视频点位删除失败')
          })
        }
      })
    },
    // 关闭面板
    closeEditVePoCon() {
      this.setPointStatus()
      this.changeFMeditRightPage({ page: '', detail: 'show' })
    },
    // 预览
    preView() {
      if (this.pointDataMol.status) {
        let eid = this.pointDataMol.eid
        if (eid && (!eid.hasOwnProperty('deviceStatus') || eid.deviceStatus)) { // 设备启用
          this.$store.commit('UPDATE_POINT_VIDEO_LIST', this.pointDataMol)
        } else {
          this.warningMsg('该设备已禁用！')
        }
      } else {
        this.warningMsg('该设备不在线！')
      }
    },
    // 设置当前选择的图标 index
    getIconIndex() { // 设置当前选择的图标 index
      if (!this.iconList.length) {
        this.getIconList({oid: this.pointData.mid.oid}).then(res => {
          this.iconList = JSON.parse(JSON.stringify(res.data))
          for (let i = 0; i < this.iconList.length; i++) {
            if (this.iconList[i]._id === this.pointData.mid._id) {
              this.selectedModelIndex = i
              return
            }
          }
        })
      }
    },
    updateDataAttr() {
      this.initPageData(this.pointDataMol)
      this.rangeInput(this.pointData.angle)
      this.getIconIndex()
    }
  },
  mounted() {
    if (this.pointDataMol && this.pointDataMol._id) {
      this.updateDataAttr()
    }
  }
}
</script>
<style scoped>
.videoPoint,
.videoPoint .videoPointContent,
.videoPoint .videoPointContent .videoMain {
  display: flex;
  flex: 1;
  flex-direction: column;
  /* padding: 0px 20px; */
}
.pointMainHome {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0px 20px;
}
.videoPoint .videoPointHeader {
  height: 38px;
  width: 100%;
  line-height: 38px;
  clear: both;
  background-color: #0f2343;
  font-size: 14px;
  cursor: default;
}

.videoPoint .videoPointHeader .pointHeaderTittle {
  float: left;
  margin-left: 20px;
}

.videoPoint .videoPointHeader .pointHeaderContent {
  float: right;
  margin-right: 20px;
  cursor: pointer;
}
.videoPoint .videoPointHeader .pointHeaderContent div {
  display: inline;
  margin: 0px 10px;
  font-size: 14px;
  cursor: pointer;
  font-style: normal;
}
.videoPoint .videoPointHeader .pointHeaderContent div:hover {
  color: #20adff;
}

.videoPointContent .pointContentHeader {
  width: 100%;
  height: 50px;
}

.videoPointContent .pointContentHeader .pointTittle {
  height: 40px;
  line-height: 40px;
  display: inline-block;
  margin: 0 10px;
  padding: 0 10px;
  margin-bottom: 10px;
  cursor: pointer;
  border-bottom: 1px solid #4996f9;
}

.videoPoint .videoPointFooter {
  height: 40px;
  width: 100%;
  line-height: 40px;
  clear: both;
  text-align: center;
}
.tabs {
  display: flex;
  justify-content: center
}
.tab {
  width: 25%;
  text-align: center;
  padding-bottom: 4px;
  cursor: pointer;
}
.actived {
  border-bottom: 1px solid #4996f9;
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
  max-width: 180px;
  max-height: 180px;
}
 /* 覆盖iview走马灯项的样式 */
.ivu-carousel-item {
  display: flex;
  justify-content: center;
  align-items: center;
}
.img-icon {
  height: 210px;
}
</style>
