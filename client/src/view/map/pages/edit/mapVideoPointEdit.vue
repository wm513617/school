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
      <bs-scroll ref="scroller">
        <div class="pointMainHome">
          <Form ref="pointData" :model="pointData" :rules="ruleValidate" :label-width="70" label-position="left">
            <Form-item label="资源名称" prop="name">
              <Input :maxlength="16" v-model="pointData.name" placeholder="请输入" />
            </Form-item>
            <Form-item label="可见范围" prop="class">
              <InputNumber :max="7" :min="0" :maxlength='2' type="" v-model="pointData.class" placeholder="最大7级"></InputNumber>
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
            <div class="arrows">
              <span class="iconfont icon-jiantou-copy"></span>
            </div>
            <div>
              <img src="../../../../assets/images/4.jpg" class="img-style" alt="">
            </div>
            <div class="arrows">
              <span class="iconfont icon-jiantou"></span>
            </div>
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
    <div class="videoPointFooter">
      <Button type="ghost" @click="mapPointCannel('pointData')" style="margin-right: -3px">取消</Button>
      <Button type="primary" @click="mapPointSave('pointData')" style="margin-left: 16px">保存</Button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import editIpc from '../../../../assets/map/edit/editIpc.js'
import contentWay from '../contentWay'
import { telNumCheck, telNameCheck } from '../../formCheck'
export default {
  components: {
    editIpc,
    contentWay
  },
  data() {
    // 不可以输入空格
    const noSpace = (rule, value, callback) => {
      let r = /\s+/g
      if (value && value.length > 0) {
        if (r.test(value)) {
          return callback(new Error('不可以输入空格'))
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
        name: [{ required: true, validator: noSpace, trigger: 'change' }]
      },
      posInfoFlag: false,
      pointAngle: 0,
      pastPointAngle: 0,
      oldPointAngle: 0,
      activedTab: 'img',
      oldPointViewshed: 0
    }
  },
  computed: {
    ...mapState({
      addVedioNodeInfo: ({ mapGisData }) => mapGisData.addVedioNodeInfo, // 编辑模式添加视频点位时的节点信息
      editCurrentVedioFeature: ({ mapGisData }) => mapGisData.editCurrentVedioFeature, // 编辑模式当前操作的视频点位对象
      editCurrentVedioSector: ({ mapGisData }) => mapGisData.editCurrentVedioSector, // 编辑模式当前操作视频点位的可视域
      oneMapInfo: ({ mapGisData }) => mapGisData.oneMapInfo, // 当前地图信息
      detail: ({ mapPageState }) => mapPageState.mapEditRightPage.detail,
      pointDataMol: ({ mapGisData }) => mapGisData.pointData,
      editVedioIpcList: ({ mapGisData }) => mapGisData.editVedioIpcList, // 编辑模式视频点位数组
      editVedioSectorList: ({ mapGisData }) => mapGisData.editVedioSectorList, // 编辑模式视频点位可视域数组
      isOuter: ({ mapAreaData }) => mapAreaData.isOuter, // 楼层内还是楼层外
      editVedioSectorInMapList: ({ mapGisData }) => mapGisData.editVedioSectorInMapList,
      editCheckList: ({ mapVedioData }) => mapVedioData.editCheckList,
      levelData: ({ mapGisData }) => mapGisData.levelData
    })
  },
  watch: {
    // 地图编辑模式当前操作的视频点位对象属性
    editCurrentVedioFeature(feature) {
      let fea = JSON.parse(JSON.stringify(feature))
      if (fea) {
        this.pointData.loc = fea.attributes.lon + ',' + fea.attributes.lat
        this.pointData.class = Math.ceil(fea.attributes.level)
      }
    },
    // 点位信息
    pointDataMol(val) {
      this.initPageData(val)
      this.rangeInput(this.pointData.angle)
    }
  },
  methods: {
    ...mapActions(['setOnePoint', 'getResourceOrg', 'delOnePoint', 'isGridName', 'setEditDetail']),
    ...mapMutations([
      'SET_EDITVEDIOIPC_LIST', // 编辑模式视频点位数组
      'SET_EDITVEDIOIPCINMAP_LIST', // 编辑模式加载到地图上的视频点位数组
      'SET_EDITVEDIOSECTOR_LIST', // 编辑模式视频点位可视域数组
      'SET_EDITVEDIOSECTORINMAP_LIST', // 编辑模式加载到地图上的视频点位可视域数组
      'SET_EDITCURRENTVEDIO_SECTOR', // 当前操作视频点位的可视域
      'SET_EDITCURRENTVEDIO_FEATURE', // 当前操作的视频点位对象
      'SET_MODIFYACTIVE_STATE', // 地图编辑点位位置的控件
      'SET_EDITRIGHTPAGE_STATE',
      'SET_EDITDETAIL_STATE'
    ]),
    initPageData(val) {
      this.posInfoFlag = false
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
      this.radiusInput(this.pointData.radius)
      // this.rangeInput(this.pointData.angle)
      this.anglesInput(this.pointData.viewshed)
    },
    // 视频点位 调整位置勾选
    vedioPosition(flag) {
      if (flag) {
        if (this.editCurrentVedioFeature) {
          let param = {
            id: this.editCurrentVedioFeature.attributes.id,
            type: this.editCurrentVedioFeature.attributes.type,
            coods: this.editCurrentVedioFeature.attributes.lon + ',' + this.editCurrentVedioFeature.attributes.lat,
            level: this.editCurrentVedioFeature.attributes.level,
            radius: this.pointData.radius,
            endAngle: this.pointData.viewshed / 2 + this.pointData.angle,
            startAngle: this.pointData.angle - this.pointData.viewshed / 2,
            rotation: this.pointData.angle
          }
          let sector = editIpc.addSector(param)
          let sectorlist = JSON.parse(JSON.stringify(this.editVedioSectorList))
          sectorlist.push(sector)
          this.$store.commit('SET_EDITVEDIOSECTOR_LIST', sectorlist)
          this.$store.commit('SET_EDITCURRENTVEDIO_SECTOR', sector)
        }
      } else {
        this.isHideCurrentVedioSector()
        this.$store.commit('SET_EDITCURRENTVEDIO_SECTOR', null)
      }
    },
    // 照射半径
    radiusInput(val) {
      this.editSector()
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
      this.editSector()
    },
    // 点位角度
    rangeInput(val) {
      /* global ringIdMax */
      let newVal = -val + this.pointAngle
      this.pastPointAngle = parseFloat(newVal) + parseFloat(this.pointData.viewshed) / 2
      ringIdMax.setAttribute('transform', 'rotate(' + this.pastPointAngle + ', 100,100)')
      this.editSector()
      this.editVedioRotation()
    },
    // 当照射半径、点位角度发生变化时，可视域发生变化
    editSector(args1, args2) {
      let angle = args1 || this.pointData.angle
      let viewshed = args2 || this.pointData.viewshed
      let param = {
        level: this.pointData.class,
        radius: this.pointData.radius,
        endAngle: viewshed / 2 + angle,
        startAngle: angle - viewshed / 2,
        rotation: angle
      }
      let vedioSectors = editIpc.editSectorRadiusOrAngle({
        currentSector: this.editCurrentVedioSector,
        sectorList: this.editVedioSectorList,
        param
      })
      this.$store.commit('SET_EDITVEDIOSECTOR_LIST', vedioSectors.sectorlist)
      this.$store.commit('SET_EDITCURRENTVEDIO_SECTOR', vedioSectors.currentSector)
    },
    // 当点位角度发生变化时，点位发生变化
    editVedioRotation(args1, args2) {
      let angle = args1 || this.pointData.angle
      let viewshed = args2 || this.pointData.viewshed
      let param = {
        level: this.pointData.class,
        rotation: angle,
        viewshed: viewshed
      }
      let vedioSectors = editIpc.editVedioAngle({
        currentVedio: this.editCurrentVedioFeature,
        vedioList: this.editVedioIpcList,
        param
      })
      this.$store.commit('SET_EDITVEDIOIPC_LIST', vedioSectors.vediolist)
      this.$store.commit('SET_EDITVEDIOIPCINMAP_LIST', vedioSectors.vediolist)
      this.$store.commit('SET_EDITCURRENTVEDIO_FEATURE', vedioSectors.currentVedio)
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
      this.editSector(this.oldPointAngle, this.oldPointViewshed)
      this.editVedioRotation(this.oldPointAngle, this.oldPointViewshed)
      this.$refs[name].resetFields()
      this.cancelVedioAndSector()
    },
    // 取消保存视频点位
    cancelVedioAndSector() {
      let id = this.editCurrentVedioFeature && this.editCurrentVedioFeature.attributes.id
      let vedioSectors = editIpc.saveVedioAndSector({
        vedioList: this.editVedioIpcList,
        sectorList: this.editVedioSectorList,
        id
      })
      this.commitVediosAndSectors(vedioSectors.vediolist, vedioSectors.sectorlist)
      this.isHideCurrentVedioSector()
      this.addSectorToInMap(vedioSectors.sectorlist, vedioSectors.sector)
      this.clearCurrentVedioAndSector()
      this.closeEditVePoCon()
    },
    // 保存
    mapPointSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.pointData.principal) {
            let nameRepeat = false
            nameRepeat = telNameCheck(this.pointData.principal)
            if (nameRepeat) {
              this.errorMsg('负责人输入有误或重复')
            } else {
              let flag = false
              flag = telNumCheck(this.pointData.principal)
              if (flag) {
                this.errorMsg('联系方式输入有误，仅支持数字和(-)')
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
        }
      })
    },
    // 保存点位
    saveVedioAndSector(id) {
      let vedioSectors = editIpc.saveVedioAndSector({
        vedioList: this.editVedioIpcList,
        sectorList: this.editVedioSectorList,
        id
      })
      this.commitVediosAndSectors(vedioSectors.vediolist, vedioSectors.sectorlist)
      this.isHideCurrentVedioSector()
      this.addSectorToInMap(vedioSectors.sectorlist, vedioSectors.sector)
      this.clearCurrentVedioAndSector()
      this.closeEditVePoCon()
    },
    // 点位入库
    onePointSave() {
      let id = this.editCurrentVedioFeature && this.editCurrentVedioFeature.attributes.id
      let pointDataEdit = JSON.parse(JSON.stringify(this.pointDataMol))
      pointDataEdit.point = this.pointData
      pointDataEdit.name = this.pointData.name
      this.setOnePoint({ _id: id, body: pointDataEdit })
        .then(res => {
          this.saveVedioAndSector(id)
          this.getMapResource()
        })
        .catch(err => {
          console.log(err)
          this.errorMsg('点位修改失败')
        })
    },
    // 关闭视频点位编辑位置的控件
    closeEditVePoCon() {
      this.$store.commit('SET_MODIFYACTIVE_STATE', false) // 关闭编辑视频点位的控件
      if (this.isOuter) {
        this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'gridEditPage', detail: 'show' }) // 隐藏点位编辑弹框，显示网格列表
      } else {
        this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'floorEditPage', detail: 'show' }) // 隐藏点位编辑弹框，显示楼宇编辑页面
      }
    },
    // 删除点位
    deleteVedioAndSector(id) {
      let vedioSectors = editIpc.deleteVedioAndSector({
        vedioList: this.editVedioIpcList,
        sectorList: this.editVedioSectorList,
        id
      })
      this.commitVediosAndSectors(vedioSectors.vediolist, vedioSectors.sectorlist)
      let sectorlist = JSON.parse(JSON.stringify(this.editVedioSectorInMapList))
      sectorlist = editIpc.deleteVedioOrSectorById(sectorlist, id)
      this.$store.commit('SET_EDITVEDIOSECTORINMAP_LIST', sectorlist)
      this.clearCurrentVedioAndSector()
      this.closeEditVePoCon()
    },
    // 删除点位
    delPoint() {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除所选视频点位吗？</p>',
        onOk: () => {
          let id = this.editCurrentVedioFeature && this.editCurrentVedioFeature.attributes.id
          this.delOnePoint(id)
            .then(res => {
              this.successMsg('视频点位删除成功')
              this.setEditDetail('')
              this.deleteVedioAndSector(id)
              // 获取地图点位资源
              this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'gridEditPage', detail: 'show' })
              this.getMapResource()
            })
            .catch(err => {
              console.log(err)
              this.errorMsg('视频点位删除失败')
            })
        },
        onCancel: () => {}
      })
    },
    // 预览
    preView() {
      this.$store.commit('SET_EDITDETAIL_STATE', 'pointVideoEdit')
    },
    // 获取地图点位资源
    getMapResource() {
      if (this.isOuter) {
        this.getResourceOrg()
          .then(res => {})
          .catch(err => {
            console.log(err)
          })
      } else {
        this.getResourceOrg(this.levelData._id)
          .then(res => {})
          .catch(err => {
            console.log(err)
          })
      }
    },
    // 保存视频点位和可视域
    commitVediosAndSectors(vediolist, sectorlist) {
      this.$store.commit('SET_EDITVEDIOIPC_LIST', vediolist)
      this.$store.commit('SET_EDITVEDIOIPCINMAP_LIST', vediolist)
      this.$store.commit('SET_EDITVEDIOSECTOR_LIST', sectorlist)
    },
    // 清空当前操作的视频点位和可视域
    clearCurrentVedioAndSector() {
      this.$store.commit('SET_EDITCURRENTVEDIO_SECTOR', null) // 当前操作视频点位的可视域
      this.$store.commit('SET_EDITCURRENTVEDIO_FEATURE', null) // 当前操作的视频点位对象
    },
    isHideCurrentVedioSector() {
      let sectorlist = JSON.parse(JSON.stringify(this.editVedioSectorList))
      let id = this.editCurrentVedioFeature && this.editCurrentVedioFeature.attributes.id
      let sectors = editIpc.deleteVedioOrSectorById(sectorlist, id)
      this.$store.commit('SET_EDITVEDIOSECTOR_LIST', sectors)
      this.$store.commit('SET_EDITCURRENTVEDIO_SECTOR', null)
    },
    // 保存时添加可视域（备份）
    addSectorToInMap(sectorCol, sector) {
      let sectorlist = JSON.parse(JSON.stringify(this.editVedioSectorInMapList))
      if (sector) {
        let id = sector.attributes.id
        sectorlist = editIpc.deleteVedioOrSectorById(sectorlist, id)
        sectorlist.push(sector)
        this.$store.commit('SET_EDITVEDIOSECTORINMAP_LIST', sectorlist)
      }
      if (this.editCheckList.indexOf('sector') > -1) {
        this.$store.commit('SET_EDITVEDIOSECTOR_LIST', sectorCol)
      }
    }
  },
  mounted() {
    this.initPageData(this.pointDataMol)
    this.rangeInput(this.pointData.angle)
    this.oldPointAngle = this.pointData.angle
    this.oldPointViewshed = this.pointData.viewshed
  }
}
</script>
<style scoped>
.videoPoint,
.videoPoint .videoPointContent,
.videoPoint .videoPointContent .pointMain {
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
.img-icon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 150px;
  margin-top: 24px;
}
.arrows {
  cursor: pointer;
}
.img-style {
  width: 150px;
  height: 150px;
}
</style>
