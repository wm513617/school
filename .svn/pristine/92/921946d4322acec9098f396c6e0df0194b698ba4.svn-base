<template>
  <div class="floor-area-content" v-resize='scrollUpdate'>
    <Tabs value="floorInfo">
      <TabPane label="楼层信息" name="floorInfo">
        <bs-scroll ref="scroller">
          <div class="buildingInfo">
            <Form ref="floorData" :model="floorData" :rules="floorRuleValidate" :label-width="70" label-position="left">
              <Form-item label="楼层名称" prop="name">
                <Input :maxlength="16" :disabled="!is3DMapOuter" v-model="floorData.name" placeholder="请输入" />
              </Form-item>
              <FormItem v-if="is3DMapOuter" label="楼层文件" prop="picture.name">
                <Row>
                  <Col span="15">
                    <Input v-model="floorData.picture.name" disabled placeholder="请选择地图文件" style="float:left" />
                  </Col>
                  <Col span="4">
                    <Upload :show-upload-list="false" action="/api/upload/file?category=storey&type=image" :on-success="uploadEditSuccess" :multiple="false" ref="upload" :format="['jpg','jpeg','png']" :on-format-error="mapFormatError">
                      <Button type="ghost" icon="ios-cloud-upload-outline">浏览</Button>
                    </Upload>
                  </Col>
                </Row>
              </FormItem>
              <!-- <Form-item label='层级'>
                <Input :maxlength='8' :disabled="!is3DMapOuter" v-model="floorData.class" placeholder="层级" />
              </Form-item> -->
              <Form-item label='联系人' prop="pid.name">
                <Input :maxlength='16' :disabled="!is3DMapOuter" v-model="floorData.pid.name" placeholder="请输入联系人" />
              </Form-item>
              <Form-item label='联系电话' prop="pid.mobile">
                <Input :maxlength='18' :disabled="!is3DMapOuter" v-model="floorData.pid.mobile" placeholder="请输入联系人电话" />
              </Form-item>
              <Form-item class="floors">
                <Button type="primary" v-if="is3DMapOuter" style="margin-right: -3px" @click="addFloor" class="addBtn">保存</Button>
                <Button type="ghost" v-if="is3DMapOuter" style="margin-left: 16px" @click="cancel">取消</Button>
              </Form-item>
            </Form>
          </div>
        </bs-scroll>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    // 楼层信息校验
    const floorName = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('楼层名称不能为空'))
      }
      let strlength = value.replace(/[\u0391-\uFFE5]/g, 'aa').length
      if (strlength > 64) {
        return callback(new Error('楼层名称长度超过64个字符'))
      } else {
        callback()
      }
    }
    // 电话号码
    const validateTelephone = (rule, value, callback) => {
      let reg = /^([0-9]|[-])+$/g
      if (!value || reg.test(value)) {
        callback()
      } else {
        return callback(new Error('联系方式输入有误，仅支持数字和(-)'))
      }
    }
    const validatePrincipal = (rule, value, callback) => {
      let strlength = value.replace(/[\u0391-\uFFE5]/g, 'aa').length
      if (strlength > 16) {
        return callback(new Error('联系人长度超过16个字符'))
      } else {
        callback()
      }
    }
    return {
      floorData: {
        // 楼层表单
        bid: '',
        name: '', // 楼层名称
        class: '',
        // 地图文件
        picture: {
          id: '',
          name: ''
        },
        // desc: '', // 楼层简介
        // 联系人
        pid: {
          name: '',
          mobile: ''
        }
      },
      floorRuleValidate: {
        name: [{ required: true, validator: floorName, trigger: 'change' }],
        'picture.name': [{ required: true, message: '楼层文件不能为空', trigger: 'blur' }],
        'pid.name': [{ required: false, validator: validatePrincipal, trigger: 'change' }],
        'pid.mobile': [{ required: false, validator: validateTelephone, trigger: 'change' }]
      }
    }
  },
  methods: {
    ...mapActions([
      'saveFloorToBuild',
      'getAllFloorsById',
      'setRightPanelType',
      'setFloorData',
      'editFloorInfo',
      'setFloorFlag'
    ]),
    // 添加楼层
    addFloor() {
      if (!this.floorData._id) {
        this.$refs['floorData'].validate(valid => {
          if (valid) {
            // 添加楼层方法
            this.saveFloorToBuild(this.floorData)
              .then(res => {
                this.$Notice.success({
                  title: '添加楼层成功！',
                  desc: ''
                })
                // 添加楼层成功后返回所有楼层，切换视图---
                this.getAllFloorsById(this.buildOneData._id)
                  .then(res => {
                    this.cancel()
                  })
                  .catch(err => {
                    console.log(err)
                    this.cancel()
                  })
              })
              .catch(err => {
                console.log(err.response)
                this.$Notice.error({
                  title: '添加楼层失败！',
                  desc: err.response.data.message
                })
              })
          } else {
            this.errorMsg('表单验证失败!')
          }
        })
      } else {
        let playod = null
        if (this.floorData.name === this.floorInfo.name) {
          playod = {
            picture: this.floorData.picture,
            desc: this.floorData.desc,
            class: this.floorData.class,
            pid: this.floorData.pid,
            _id: this.floorData._id
          }
        } else {
          playod = this.floorData
        }
        this.$refs['floorData'].validate(valid => {
          if (valid) {
            // 修改楼层
            this.editFloorInfo({ id: this.floorData._id, data: playod })
              .then(res => {
                this.$Notice.success({
                  title: '修改楼层成功！',
                  desc: ''
                })
                // 修改成功后，获取所有楼层，更新视图
                this.getAllFloorsById(this.buildOneData._id)
                  .then(res => {
                    this.cancel()
                  })
                  .catch(err => {
                    console.log(err)
                    this.cancel()
                  })
              })
              .catch(err => {
                this.$Notice.error({
                  title: '修改楼层失败！',
                  desc: err.response.data.message
                })
              })
          } else {
            this.errorMsg('表单验证失败!')
          }
        })
      }
    },
    cancel() {
      this.setRightPanelType('floorList')
    },
    // 楼层图片上传成功后的回调------
    uploadEditSuccess(val) {
      this.floorData.picture.name = val.name
      this.floorData.picture.path = val.path
    },
    // 上传图片的各式验证-------
    mapFormatError(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg、jpeg 或 png 格式的图片。'
      })
    },
    scrollUpdate() {
      this.$refs.scroller.update()
    }
  },
  computed: {
    ...mapState({
      floorInfo: ({ tdFloor }) => tdFloor.floorData,
      buildOneData: ({ tdBuild }) => tdBuild.buildOneData,
      is3DMapOuter: ({ tdIndex }) => tdIndex.is3DMapOuter,
      buildFeature: ({ tdBuild }) => tdBuild.buildFeature,
      addFloorFlag: ({ tdFloor }) => tdFloor.addFloorFlag
    })
  },
  mounted() {
    if (!this.addFloorFlag) {
      this.floorData = this.$lodash.cloneDeep(this.floorInfo)
    } else {
      this.floorData.bid = this.buildOneData._id
    }
  },
  beforeDestroy() {
    this.setFloorFlag(false)
  }
}
</script>

<style scoped>
.floor-area-content {
  width: 300px;
  display: flex;
  flex: 1;
  flex-direction: column;
  /* height: 100%; */
}
.floor-area-content .ivu-tabs {
  display: flex !important;
  flex: 0 0 400px !important;
  flex-direction: column !important;
}
.buildingInfo {
  padding: 0 10px;
}
.addBtn {
  margin-right: 16px;
}
</style>
<style>
.floor-area-content .ivu-tabs .ivu-tabs-content-animated {
  flex: 1 !important;
}
</style>
