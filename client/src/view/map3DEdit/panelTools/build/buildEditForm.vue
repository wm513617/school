<!--编辑模式 楼宇的右边编辑框的页面-->
<template>
  <div class="areaHome" v-resize='update'>
    <div class="areaHeader">
      <div class="areaHeaderTittle">
        <p>楼宇区域</p>
      </div>
    </div>
    <div class="builddetail">
      <div class="areaContent">
        <Tabs value="baseInfo">
          <TabPane label="基本信息" name="baseInfo">
            <bs-scroll ref="scroller">
              <div class="buildEditMain">
                <Form ref="buildingInfo" :rules="ruleValidate" :model="buildingInfo" :label-width="70" label-position="left">
                  <Form-item label="楼宇名称" prop="name">
                    <Input :maxlength="16" v-model="buildingInfo.name" placeholder="请输入楼宇名称" />
                  </Form-item>
                  <Form-item label="楼宇id" prop="code">
                    <Input :maxlength="16" v-model="buildingInfo.code" disabled/>
                  </Form-item>
                  <!-- 联系方式 -->
                    <contentWay :principal.sync="buildingInfo.pid"></contentWay>
                  </Form>
              </div>
            </bs-scroll>
          </TabPane>
        </Tabs>
      </div>
      <div class="areaFooter">
        <Button type="ghost" @click="mapBuildCannel('buildOneData')" style="margin-right: -3px">取消</Button>
        <Button type="primary" @click="mapBuildSave('buildOneData')" style="margin-left: 16px">保存</Button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import contentWay from 'components/map/contentWay'
import { isInvalidPrincipal } from 'components/map/formCheck'
export default {
  components: {
    contentWay
  },

  data() {
    // 楼宇名称校验
    const buildName = (rule, value, callback) => {
      // let rname = /^[(\u4e00-\u9fa5)\w]{0,16}$/
      if (value === '') {
        return callback(new Error('楼宇名称不能为空'))
      }
      let strlength = value.replace(/[\u0391-\uFFE5]/g, 'aa').length
      if (strlength > 16) {
        return callback(new Error('楼宇名称长度超过16个字符'))
      }
      // if (rname.test(value)) {
      let query = { name: '', _id: '' }
      if (this.buildingInfo._id) {
        query = { name: value, _id: '' }
      } else {
        query = { name: value, _id: this.buildingInfo._id }
      }
      this.checkBuildNameIsRepeat(query)
        .then(res => {
          callback()
        })
        .catch(err => {
          console.log(err)
          callback(new Error('名称重复'))
        })
      // } else {
      //   return callback(new Error('楼宇名称格式有误'))
      // }
    }
    // 楼宇编号校验
    const buildCode = (rule, value, callback) => {
      let rcode = /^[A-Za-z0-9]+$/
      if (value === '') {
        return callback(new Error('楼宇编号不能为空'))
      }
      if (rcode.test(value)) {
        callback()
      } else {
        return callback(new Error('楼宇编号格式有误'))
      }
    }
    // 楼宇负责单位长度校验
    const buildCharge = (rule, value, callback) => {
      if (value.length > 0) {
        let strlength = value.replace(/[\u0391-\uFFE5]/g, 'aa').length
        console.log(strlength)
        if (strlength > 32) {
          return callback(new Error('负责单位长度超过32个字符'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    // 电话号码
    // const validateTelephone = (rule, value, callback) => {
    //   let reg = /^1[34578]\d{9}$/
    //   if (!value || reg.test(value)) {
    //     callback()
    //   } else {
    //     return callback(new Error('请输入正确的电话号码'))
    //   }
    // }
    return {
      ruleValidate: {
        name: [{ required: true, validator: buildName, trigger: 'change' }],
        code: [{ required: true, validator: buildCode, trigger: 'change' }],
        charge: [{ required: false, validator: buildCharge, trigger: 'change' }]
      },
      // floor: [], // 全部楼层
      buildPage: {
        cur: 1,
        limit: this.$PageInfo.limit,
        count: 0
      },
      buildingInfo: {
        name: '', // 楼宇名称
        // charge: '', // 负责单位
        code: '', // 楼宇编号
        height: 0,
        center: [], // 楼宇中心点位
        pid: [
          {
            // 联系人列表
            name: '',
            mobile: ''
          }
        ]
      },
      buildingListFlag: false
    }
  },
  computed: {
    ...mapState({
      buildOneData: ({ tdBuild }) => tdBuild.buildOneData,
      rightPanelShow: ({ tdIndex }) => tdIndex.rightPanelShow,
      goBackToBuildList: ({ tdBuild }) => tdBuild.goBackToBuildList,
      buildFeature: ({ tdBuild }) => tdBuild.buildFeature
    })
  },
  watch: {
    'buildFeature.SMID'(val) {
      if (this.buildOneData.name) {
        this.buildingInfo = this.$lodash.cloneDeep(this.buildOneData)
      } else {
        this.buildingInfo = {
          name: '',
          charge: '',
          code: this.buildFeature.SMID,
          height: Number(this.buildFeature.HEIGHT),
          center: this.buildFeature.LONGITUDE + ',' + this.buildFeature.LATITUDE,
          pid: [
            {
              name: '',
              mobile: ''
            }
          ]
        }
      }
    },
    buildOneData: {
      handler(newVal) {
        if (newVal) {
          if (newVal.name) {
            this.buildingInfo = this.$lodash.cloneDeep(newVal)
          }
        }
      },
      deep: true
    }
    // showBuildingList(val) {
    //   if (val) {
    //     this.getAllBuildingInfo().then(res => {
    //       this.buildPage.count = Number(res.length)
    //       // this.$store.commit('SET_3D_DETAIL', 'showBuildIngList')
    //     })
    //   }
    // }
  },
  methods: {
    ...mapMutations([]),
    ...mapActions([
      'saveOneBuild', // 保存楼宇
      'setRightPanelType',
      'setRightPanelShow', // 右侧面板显隐
      'getOneBuildById', // 获取楼宇信息
      'editOneBuildById',
      'checkBuildNameIsRepeat',
      'getAllBuild'
    ]),
    // 楼宇保存
    mapBuildSave(name) {
      console.log('保存的建筑模型:' + this.buildingInfo)
      console.log('建筑模型标识：' + this.buildingInfo._id)
      let result = isInvalidPrincipal(this.buildingInfo.pid)
      if (result.flag && result.msg) {
        this.errorMsg(result.msg)
        return
      }
      // 如果此标识不存在，则此次保存数据库中添加记录--
      if (!this.buildingInfo._id) {
        this.$refs['buildingInfo'].validate(valid => {
          if (valid) {
            this.saveOneBuild(this.buildingInfo)
              .then(res => {
                this.getAllBuild().then(res => {
                  this.setRightPanelShow(true)
                  this.setRightPanelType('buildingList')
                })
              })
              .catch(err => {
                this.$Notice.error({
                  title: err.response.data.message,
                  desc: ''
                })
              })
          } else {
            console.log('楼宇保存失败')
          }
        })
      } else {
        // 存在，则此次保存为数据库中修改记录
        this.$refs['buildingInfo'].validate(valid => {
          if (valid) {
            this.editOneBuildById({ data: this.buildingInfo, id: this.buildingInfo._id })
              .then(res => {
                this.getAllBuild().then(res => {
                  this.setRightPanelShow(true)
                  this.setRightPanelType('buildingList')
                })
              })
              .catch(err => {
                this.$Notice.error({
                  title: err.response.data.message,
                  desc: ''
                })
              })
          } else {
            console.log('楼宇保存失败')
          }
        })
      }
    },
    // 滚动条高度变化
    update() {
      this.$refs.scroller.update()
    },
    mapBuildCannel() {
      if (this.goBackToBuildList) {
        this.setRightPanelType('buildingList')
      } else {
        this.setRightPanelShow(false)
      }
    },
    // 按钮显示楼层列表
    addFloorBtn(code) {
      console.log(code)
      this.getAllFloors(code).then(res => {
        console.log('根据楼宇编码获取楼宇下的所有楼层列表：' + res)
        this.$store.commit('SET_3D_EDIT_RIGHT_CONTENT', 'floorInfo')
        this.$store.commit('SET_FLOOTDATA_BID', code)
        console.log('this.floorList', this.floorList)
      })
    }
  },
  created() {},
  mounted() {
    if (this.buildOneData.name) {
      this.buildingInfo = this.$lodash.cloneDeep(this.buildOneData)
    } else {
      this.buildingInfo.code = this.buildFeature.SMID
      this.buildingInfo.height = Number(this.buildFeature.HEIGHT)
      this.buildingInfo.center = this.buildFeature.LONGITUDE + ',' + this.buildFeature.LATITUDE
    }
    console.log(this.buildingInfo)
  }
}
</script>
<style scoped>
.areaHome,
.areaHome .builddetail,
.areaHome .builddetail .areaContent {
  width: 300px;
  display: flex;
  flex: 1;
  flex-direction: column;
  /* height: 100%; */
}
.areaHome .areaContent .buildEditMain {
  padding: 0px 20px;
}
.areaHome .areaHeader {
  height: 40px;
  width: 100%;
  line-height: 40px;
  text-align: center;
  clear: both;
  background-color: #0f2343;
  font-size: 14px;
  display: flex;
  flex-direction: row;
}
.areaHome .areaHeader .areaHeaderTittle {
  flex: 1;
}
.areaHome .areaContent .areaContentHeader {
  width: 100%;
  height: 50px;
}
.areaHome .areaContent .areaContentTittle {
  height: 40px;
  line-height: 40px;
  display: inline-block;
  margin: 0 10px;
  padding: 0 10px;
  margin-bottom: 10px;
  cursor: pointer;
}
.areaHome .areaContent .active {
  border-bottom: 1px solid #4996f9;
}
.areaHome .areaFooter {
  height: 40px;
  width: 100%;
  text-align: center;
  background: #1b3153;
  line-height: 40px;
  clear: both;
}
.areaContent .ivu-tabs,
.areaContent .ivu-tabs-content,
.areaContent .ivu-tabs-content-animated {
  display: flex !important;
  flex: 0 0 400px !important;
  flex-direction: column !important;
}
.ivu-tabs-content-animated {
  flex: 1 !important;
}
</style>
<style>
.areaContent .ivu-tabs .ivu-tabs-content-animated {
  flex: 1 !important;
}
</style>
