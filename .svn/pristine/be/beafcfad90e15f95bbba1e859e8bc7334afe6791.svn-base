<!--编辑模式 门禁点位的右边编辑页面-->
<template>
  <div class="videoPoint">
    <div class="videoPointHeader">
      <div class="pointHeaderTittle">
        <p>门禁点位</p>
      </div>
      <div class="pointHeaderContent iconfont">
        <p @click="delPoint">
          <i class="icon-delete" title="删除"></i>
        </p>
      </div>
    </div>
    <div class="videoPointContent">
      <div class="pointContentHeader pointMain">
        <p class="pointTittle">基本信息</p>
      </div>
      <div class="doorControlMain">
        <bs-scroll ref="scroller">
          <Form ref="doorControlPoint" :rules="ruleValidate" :model="doorControlPoint" :label-width="80" label-position="left">
            <Form-item label="名称" prop="name">
              <Input v-model="doorControlPoint.name" />
            </Form-item>
            <Form-item label="厂家" prop="manufacturer">
              <Input v-model="doorControlPoint.manufacturer" disabled/>
            </Form-item>
            <!-- 联系方式 -->
            <Form-item label='负责人' prop="principal">
              <Input v-model="doorControlPoint.principal" placeholder="请输入负责人" />
            </Form-item>
            <Form-item label='电话' prop="mobile">
              <Input v-model="doorControlPoint.mobile" placeholder="请输入负责人电话" />
            </Form-item>
            <Carousel v-if="iconList.length > 0" v-model="selectedModelIndex" :height="210" :dots="null" arrow="always" loop @on-change="changeIconURI">
                <CarouselItem v-for="(item, index) in iconList" :key="index">
                    <div class="carouselItem"><img :src="item.files[0].path"></div>
                </CarouselItem>
              </Carousel>
          </Form>
        </bs-scroll>
      </div>
    </div>
    <div class="videoPointFooter">
      <Button type="ghost" @click="mapPointCannel('doorControlPoint')" style="margin-right: -3px">取消</Button>
      <Button type="primary" @click="mapPointSave('doorControlPoint')" style="margin-left: 16px">保存</Button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { POINTSTATE } from 'assets/2DMap/meta/common'
export default {
  data() {
    // 名称
    const validName = (rule, value, callback) => {
      if (value) {
        let strlength = value.replace(/[\u0391-\uFFE5]/g, 'aa').length
        if (strlength > 64) {
          return callback(new Error('名称超过64个字符'))
        } else if (value.indexOf(' ') > -1) {
          return callback(new Error('名称不可包含空格'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('名称不能为空'))
      }
    }
    // 负责人
    const verifyPrincipal = (rule, value, callback) => {
      let strlength = value.replace(/[\u0391-\uFFE5]/g, 'aa').length
      if (strlength > 16) {
        return callback(new Error('负责人不能超过16个字符'))
      } else {
        callback()
      }
    }
    // 电话号码
    const validateTelephone = (rule, value, callback) => {
      let reg = /^([0-9]|[-])+$/g
      if (!value || reg.test(value)) {
        let strlength = value.length
        if (strlength > 18) {
          return callback(new Error('电话不能超过18个字符'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('请输入正确的电话号码'))
      }
    }
    return {
      // 点位信息
      doorControlPoint: {name: '', manufacturer: '', principal: '', mobile: ''},
      selectedModelIndex: 0,
      iconList: [],
      ruleValidate: {
        name: [{ required: true, validator: validName, trigger: 'change' }],
        manufacturer: [{ required: true, message: '厂家不能为空', trigger: 'change' }],
        principal: [{ validator: verifyPrincipal, trigger: 'change' }],
        mobile: [{ validator: validateTelephone, trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapState({
      doorControlData: ({ mapPoint }) => mapPoint.selectedMapPointRes, // 单个门禁点位
      activeMapConfig: ({ mapIndex }) => mapIndex.activeMapConfig, // 当前地图配置
      isOuter: ({ mapIndex }) => mapIndex.isMapOuter, // 楼层内还是楼层外
      mapProjection: ({ mapIndex }) => mapIndex.mapProjection, // 当前地图的投影坐标参考系
      levelData: ({ mapArea }) => mapArea.currentFloor,
      drawFeatureLoc: ({ mapArea }) => mapArea.drawFeatureLoc,
      doorControls: ({ mapPoint }) => mapPoint.doorControlFeatures
    })
  },
  watch: {
    doorControlData: {
      handler(val) {
        this.initPointInfo(val)
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(['getDoorControlTree', 'updateDoorControlPointRes', 'deleteDoorControlPointRes', 'getIconList', 'setDoorControlFeatures', 'loadDoorControlByMapId', 'loadDoorControlByFloorId']),
    ...mapMutations([
      'SET_EDIT_RIGHT_PAGE_STATE', // 电子地图页面控制
      'SET_FEATURE_EDIT_ACTIVE',
      'SET_DEFAULT_POINT_ICON' // 设置默认点位图标文件
    ]),
    initPointInfo(val) { // 初始化点位信息
      if (val && val._id) {
        this.iconList = []
        let {name, eid, point} = val
        this.doorControlPoint = {
          name: name,
          manufacturer: (eid && eid.manufacturer) ? eid.manufacturer : '无',
          principal: (point.principal && point.principal.length > 0) ? point.principal[0].name : '',
          mobile: (point.principal && point.principal.length > 0) ? point.principal[0].mobile : ''
        }
        let oid = (val.point && val.point.mid) ? val.point.mid.oid : null
        if (oid) {
          this.getIconList({oid: oid}).then(res => {
            this.iconList = JSON.parse(JSON.stringify(res.data))
            for (let i = 0; i < this.iconList.length; i++) {
              if (this.iconList[i]._id === val.point.mid._id) {
                this.selectedModelIndex = i
                return
              }
            }
          })
        }
      }
    },
    changeIconURI(oldIndex, newIndex) { // 改变模型
      if (this.iconList && this.iconList.length > newIndex) {
        let icon = this.iconList[newIndex]
        this.SET_DEFAULT_POINT_ICON(icon) // 设置默认点位图标文件
        if (icon.files && icon.files.length > 0) {
          let iconUrl = icon.files[0].path // 模型文件的地址
          for (const file of icon.files) {
            if (file.status === POINTSTATE.OPEN) {
              iconUrl = file.path
              break
            }
          }
          let doorControlArr = JSON.parse(JSON.stringify(this.doorControls))
          for (let doorControl of doorControlArr) {
            if (doorControl.attributes.id === this.doorControlData._id) {
              if (doorControl.symbol && doorControl.symbol.iconStyle) {
                doorControl.symbol.iconStyle.url = iconUrl
              }
            }
          }
          this.setDoorControlFeatures(doorControlArr)
        }
      }
    },
    // 取消保存
    mapPointCannel(name) {
      this.closeEditVePoCon()
      this.$refs[name].resetFields()
    },
    // 保存
    mapPointSave(name) {
      let pointData = JSON.parse(JSON.stringify(this.doorControlData))
      pointData.name = this.doorControlPoint.name
      if (this.drawFeatureLoc) {
        pointData.point.loc = this.drawFeatureLoc
        pointData.point.projection = this.mapProjection
      }
      pointData.point.principal = [{name: this.doorControlPoint.principal, mobile: this.doorControlPoint.mobile}]
      if (this.iconList && this.iconList.length >= this.selectedModelIndex + 1) {
        pointData.point.mid = this.iconList[this.selectedModelIndex]
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.updateDoorControlPointRes(pointData)
            .then(res => {
              this.successMsg('门禁点位信息修改成功')
              this.getMapDoorControlTree()
              this.getMapDoorControlResource() // 获取门禁资源数据
              this.closeEditVePoCon()
            })
            .catch(err => {
              let data = (err.response && err.response.data) ? err.response.data : err
              console.log('门禁点位修改失败：', data)
              let msg = data.message ? data.message : '门禁点位修改失败'
              this.errorMsg(msg)
            })
        }
      })
    },
    // 删除点位
    delPoint() {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除所选门禁点位吗？</p>',
        onOk: () => {
          this.deleteDoorControlPointRes(this.doorControlData._id)
            .then(res => {
              this.successMsg('门禁点位信息删除成功')
              this.getMapDoorControlTree()
              this.getMapDoorControlResource() // 获取门禁资源数据
              this.closeEditVePoCon()
            })
            .catch(err => {
              console.log(err)
              this.errorMsg('门禁点位信息删除失败')
            })
        },
        onCancel: () => {
          this.closeEditVePoCon()
        }
      })
    },
    getMapDoorControlTree() {
      let query = (!this.isOuter && this.levelData) ? this.levelData._id : null
      this.getDoorControlTree(query)
    },
    getMapDoorControlResource() { // 获取门禁资源数据
      if (this.isOuter && this.activeMapConfig.mapId) {
        this.loadDoorControlByMapId(this.activeMapConfig.mapId)
      } else if (this.levelData) { // 楼层地图，根据楼层标识加载
        this.loadDoorControlByFloorId(this.levelData._id)
      }
    },
    // 关闭门禁点位编辑位置的控件
    closeEditVePoCon() {
      this.SET_DEFAULT_POINT_ICON(null) // 设置默认点位图标文件
      this.SET_FEATURE_EDIT_ACTIVE(false) // 关闭编辑门禁点位的控件
      if (this.isOuter) {
        this.SET_EDIT_RIGHT_PAGE_STATE({ page: '', detail: 'show' }) // 隐藏点位编辑弹框，显示网格列表
      } else {
        this.SET_EDIT_RIGHT_PAGE_STATE({ page: '', detail: 'show' }) // 隐藏点位编辑弹框，显示楼宇编辑页面
      }
    }
  },
  mounted() {
    this.initPointInfo(this.doorControlData)
  }
}
</script>
<style scoped>
.videoPoint,
.videoPoint .videoPointContent,
.videoPoint .videoPointContent .doorControlMain {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.videoPoint .videoPointHeader {
  height: 38px;
  width: 100%;
  line-height: 38px;
  clear: both;
  background-color: #0f2343;
  font-size: 14px;
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
.videoPoint .videoPointHeader .pointHeaderContent:hover {
  color: #20adff;
}

.videoPoint .videoPointHeader .pointHeaderContent p {
  display: inline;
}

.videoPoint .videoPointHeader .pointHeaderContent p i {
  display: inline;
  margin-right: 5px;
  font-style: normal;
}

.videoPointContent {
  padding-left: 20px;
  padding-right: 20px;
}
.videoPointContent .pointContentHeader {
  width: 100%;
  /* height: 50px; */
}
.videoPointContent .pointTittle {
  height: 40px;
  line-height: 40px;
  display: inline-block;
  padding: 0 10px;
  margin-bottom: 10px;
  cursor: pointer;
  border-bottom: 1px solid #4996f9
}

.videoPoint .videoPointFooter {
  height: 40px;
  width: 100%;
  line-height: 40px;
  clear: both;
  text-align: center;
}
.videoPoint .buildEditImg {
  clear: both;
  width: 100%;
}
.videoPoint .buildEditImg .buildImg {
  width: 244px;
  height: 168px;
  border: 1px solid #5676a9;
  border-radius: 5px;
  margin-bottom: 15px;
}
.videoPoint .buildEditImg .buildEditImgText {
  float: right;
  font-size: 13px;
  padding: 5px 0px;
  color: orangered;
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
</style>
