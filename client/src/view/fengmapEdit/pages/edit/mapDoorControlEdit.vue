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
import { RESICONOID } from 'assets/2DMap/meta/common'
import pointResource from '../../baseMap/layers/pointResource'
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
      },
      hasInitOldIndex: false
    }
  },
  mixins: [pointResource],
  computed: {
    ...mapState({
      doorControlData: ({ fengMap }) => fengMap.selectedFMapPointRes, // 单个门禁点位
      isfmOuter: ({ fengMap }) => fengMap.isfmOuter, // 楼层内还是楼层外
      mapProjection: ({ mapIndex }) => mapIndex.mapProjection, // 当前地图的投影坐标参考系
      drawFeatureLoc: ({ mapArea }) => mapArea.drawFeatureLoc
    })
  },
  watch: {
    doorControlData: {
      handler(val) {
        this.initPointInfo()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('fengMap', ['changeFMeditRightPage', 'updatefmDoorPointRes', 'getDoorControlFMTree', 'deletefmDoorPointRes']),
    ...mapActions(['getIconList']),
    ...mapMutations('fengMap', ['UPDATE_FMEDIT_ICON', 'SET_DEL_MARKER_POINT']),
    ...mapMutations([
      'SET_EDIT_RIGHT_PAGE_STATE', // 电子地图页面控制
      'SET_FEATURE_EDIT_ACTIVE',
      'SET_DEFAULT_POINT_ICON' // 设置默认点位图标文件
    ]),
    initPointInfo() { // 初始化点位信息
      const data = this.doorControlData
      if (data && data._id) {
        this.iconList = []
        let {name, eid, point} = data
        this.doorControlPoint = {
          name: name,
          manufacturer: (eid && eid.manufacturer) ? eid.manufacturer : '无',
          principal: (point.principal && point.principal.length > 0) ? point.principal[0].name : '',
          mobile: (point.principal && point.principal.length > 0) ? point.principal[0].mobile : ''
        }
        this.getIconIndex()
      }
    },
    // 设置当前选择的图标 index
    getIconIndex() { // 设置当前选择的图标 index
      const data = this.doorControlData.point
      let oid = (data && data.mid) ? data.mid.oid : null
      if (oid && !this.iconList.length) {
        this.getIconList({oid: oid}).then(res => {
          this.iconList = JSON.parse(JSON.stringify(res.data))
          for (let i = 0; i < this.iconList.length; i++) {
            if (this.iconList[i]._id === data.mid._id) {
              this.selectedModelIndex = i
              return
            }
          }
        })
      }
    },
    updateIcon(index) {
      if (this.doorControlData && this.iconList && this.iconList.length > index) {
        let icon = this.iconList[index]
        this.UPDATE_FMEDIT_ICON([RESICONOID.doorControl, icon, this.doorControlData._id])
      }
    },
    changeIconURI(oldIndex, newIndex) { // 改变模型
      if (!this.hasInitOldIndex) {
        this.oldIndex = oldIndex
        this.hasInitOldIndex = true
      }
      this.updateIcon(newIndex)
    },
    // 取消保存
    mapPointCannel(name) {
      this.updateIcon(this.oldIndex)
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
          this.updatefmDoorPointRes(pointData).then(res => {
            this.successMsg('门禁点位信息修改成功')
            this.closeEditVePoCon()
          }).catch(err => {
            let data = (err.response && err.response.data) ? err.response.data : err
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
          this.deletefmDoorPointRes(this.doorControlData._id).then(res => {
            this.successMsg('门禁点位信息删除成功')
            this.SET_DEL_MARKER_POINT({type: RESICONOID.doorControl, channelId: this.doorControlData._id})
            this.closeEditVePoCon()
            this.getMapDoorControlTree()
          }).catch(err => {
            console.log(err)
            this.errorMsg('门禁点位信息删除失败')
          })
        }
      })
    },
    getMapDoorControlTree() {
      let query = (!this.isfmOuter && this.levelData) ? this.levelData._id : null
      this.getDoorControlFMTree(query)
    },
    // 关闭门禁点位编辑位置的控件
    closeEditVePoCon() {
      this.setPointStatus()
      this.changeFMeditRightPage({ page: '', detail: 'show' })
    }
  },
  mounted() {
    this.initPointInfo()
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
