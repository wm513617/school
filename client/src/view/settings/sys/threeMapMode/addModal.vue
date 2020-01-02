<template>
    <Modal
        class="modal-model"
        v-model="isModalStatus"
        :title="isModelAdd ? '模型添加' : '模型修改'"
        @on-cancel="cancelBtn"
        @on-ok="okButton"
        width="850">
        <Form class="modal-model-form" ref="formModelData" :rules="ruleValidate" :model="formModelData">
            <FormItem label="模型名称" prop="name">
                <Input class="modal-form-name" v-model="formModelData.name" placeholder="请输入模型名称" style="width:200px"></Input>
            </FormItem>
            <span class="fl">模型文件</span>
            <div class="fl">
              <FormItem label="在线" prop="uploadNameOne">
                 <Upload action="/api/setting/model/upload_gltf" style="height:34px" :show-upload-list="false" :format="['gltf']" :on-error="handleError" :on-format-error="modelFileFormatError" :on-success="handleSuccessOne">
                  <Input :readonly='true' v-model="formModelData.uploadNameOne" placeholder="选择Gltf格式模型文件" style="width: 250px;">
                    <Button slot="append" icon="ios-cloud-upload-outline">浏览</Button>
                  </Input>
                </Upload>
              </FormItem>
              <FormItem label="离线" prop="uploadNameTwo" v-if="nodeData.pid === '0' || nodeData.pid === '1'">
                  <Upload action="/api/setting/model/upload_gltf" style="height:34px" :show-upload-list="false"  :format="['gltf']" :on-error="handleError" :on-format-error="modelFileFormatError" :on-success="handleSuccessTwo">
                  <Input :readonly='true' v-model="formModelData.uploadNameTwo" placeholder="选择Gltf格式模型文件" style="width: 250px;">
                      <Button slot="append" icon="ios-cloud-upload-outline">浏览</Button>
                  </Input>
                  </Upload>
              </FormItem>
              <FormItem label="报警" prop="uploadNameThree" v-if="!(this.nodeData.pid === '16')">
                  <Upload action="/api/setting/model/upload_gltf" style="height:34px" :show-upload-list="false"  :format="['gltf']" :on-error="handleError" :on-format-error="modelFileFormatError" :on-success="handleSuccessThree">
                  <Input :readonly='true' v-model="formModelData.uploadNameThree" placeholder="选择Gltf格式模型文件" style="width: 250px;">
                      <Button slot="append" icon="ios-cloud-upload-outline">浏览</Button>
                  </Input>
                  </Upload>
              </FormItem>
              <FormItem label="停用" prop="uploadNameFour" v-if="!(this.nodeData.pid === '14' || this.nodeData.pid === '15' || this.nodeData.pid === '16')">
                  <Upload action="/api/setting/model/upload_gltf" style="height:34px" :show-upload-list="false"  :format="['gltf']" :on-error="handleError" :on-format-error="modelFileFormatError" :on-success="handleSuccessFour">
                  <Input :readonly='true' v-model="formModelData.uploadNameFour" placeholder="选择Gltf格式模型文件" style="width: 250px;">
                      <Button slot="append" icon="ios-cloud-upload-outline">浏览</Button>
                  </Input>
                  </Upload>
              </FormItem>
            </div>
        </Form>
        <div class="upload-img" v-if="!(nodeData._id === '141')">
          <div class="upload-img-top">
            <img :src="addImgSrc" alt="">
          </div>
          <span>请上传大小为280px*280px的图片</span>
          <div class="upload-btn">
            <Upload action="/api/setting/model/upload_pic" :show-upload-list="false" :format="['png', 'jpeg']" :on-error="handleError" :on-format-error="modelImageFormatError" :on-success="handleSuccessPicture">
              <Button icon="ios-cloud-upload-outline">上传图片</Button>
            </Upload>
          </div>
        </div>
        <div slot="footer">
            <Button type="error" size="large" @click="cancelBtn">取消</Button>
            <Button type="error" size="large" @click="okButton('formModelData')">确定</Button>
        </div>
    </Modal>
</template>
<script>
import { mapActions } from 'vuex'
import deviceValidate from '../../equipment/deviceValidate.js'
export default {
  data() {
    return {
      formModelData: {
        name: '',
        uploadNameOne: '', // 在线文件名
        pathOne: '',
        uploadNameTwo: '', // 离线文件名
        pathTwo: '',
        uploadNameThree: '', // 报警文件名
        pathThree: '',
        uploadNameFour: '', // 停用文件名
        pathFour: '',
        picture: {
          // 图片数据
          name: '',
          path: ''
        }
      },
      isModalStatus: false, // 模态框标题判断
      isUploadImg: true, // 是否上传图片
      isOffline: true, // 是否有离线
      ruleValidate: {
        // 表单验证
        name: [
          { required: true, max: 64, message: '请输入模型名称且不超过64字符', trigger: 'change' },
          { validator: deviceValidate.noSpace, trigger: 'change' }
        ],
        uploadNameOne: [{ required: true, message: '请上传模型文件', trigger: 'change' }],
        uploadNameTwo: [{ message: '请上传模型文件', trigger: 'change' }],
        uploadNameThree: [{ message: '请上传模型文件', trigger: 'change' }],
        uploadNameFour: [{ message: '请上传模型文件', trigger: 'change' }]
      },
      addImgSrc: ''
    }
  },
  props: {
    isModal: {
      // 模态框是否显示
      type: Boolean
    },
    nodeData: {
      // 机构树选中项
      type: Object
    },
    isModelAdd: {
      // 模态框标题状态
      type: Boolean
    },
    updateData: {
      // 修改项数据
      type: Object
    },
    brightness: {
      // 亮度
      type: Number
    },
    height: {
      // 高度
      type: Number
    },
    scale: {
      // 大小
      type: Number
    }
  },
  watch: {
    isModal(val) {
      this.isModalStatus = val
      this.addImgSrc = ''
      this.formModelData = {
        // 清空
        name: '',
        uploadNameOne: '',
        pathOne: '',
        uploadNameTwo: '',
        pathTwo: '',
        uploadNameThree: '',
        pathThree: '',
        uploadNameFour: '',
        pathFour: '',
        picture: {
          name: '',
          path: ''
        }
      }
      this.$refs['formModelData'].resetFields()
      // console.log(this.formModelData)
    },
    isModelAdd(val) {
      if (!val) {
        this.updateModel()
      }
    }
  },
  methods: {
    ...mapActions(['postModelAdd', 'putModelUpdate']),
    /**
     * 修改框挂载数据
     */
    updateModel() {
      // console.log(this.updateData, '修改行数据')
      this.formModelData.name = this.updateData.name
      if (this.updateData.files[0]) {
        // 正常状态文件数据挂载
        this.formModelData.uploadNameOne = this.updateData.files[0].name
        this.formModelData.pathOne = this.updateData.files[0].path
        if (this.updateData.files.length === 4) {
          // 存在离线状态文件数据挂载
          this.formModelData.uploadNameTwo = this.updateData.files[1].name
          this.formModelData.pathTwo = this.updateData.files[1].path
          this.formModelData.uploadNameThree = this.updateData.files[2].name
          this.formModelData.pathThree = this.updateData.files[2].path
          this.formModelData.uploadNameFour = this.updateData.files[3].name
          this.formModelData.pathFour = this.updateData.files[3].path
        }
        if (this.updateData.files.length === 3) {
          // 不存在离线存在报警、停用状态文件数据挂载
          this.formModelData.uploadNameThree = this.updateData.files[1].name
          this.formModelData.pathThree = this.updateData.files[1].path
          this.formModelData.uploadNameFour = this.updateData.files[2].name
          this.formModelData.pathFour = this.updateData.files[2].path
        }
        if (this.updateData.files.length === 2) {
          // 不存在离线、停用存在报警状态文件数据挂载
          this.formModelData.uploadNameThree = this.updateData.files[1].name
          this.formModelData.pathThree = this.updateData.files[1].path
        }
        if (!(this.nodeData._id === '141')) {
          // 图片数据挂载
          this.formModelData.picture.name = this.updateData.picture.name
          this.formModelData.picture.path = this.updateData.picture.path
          this.addImgSrc = this.updateData.picture.path
        }
      }
    },
    /**
     * 添加，修改请求数据
     */
    modelJudge() {
      let params = {
        name: this.formModelData.name,
        oid: this.nodeData._id,
        files: [
          {
            status: 'online',
            name: this.formModelData.uploadNameOne,
            path: this.formModelData.pathOne
          }
        ]
      }
      if (this.nodeData.pid === '0' || this.nodeData.pid === '1') {
        // 判断是否为视频和报警模型
        params.files.push({
          status: 'offline',
          name: this.formModelData.uploadNameTwo,
          path: this.formModelData.pathTwo
        })
      }
      if (!(this.nodeData.pid === '16')) {
        // 判断非辅助类
        params.files.push({
          status: 'alarm',
          name: this.formModelData.uploadNameThree,
          path: this.formModelData.pathThree
        })
      }
      if (!(this.nodeData.pid === '14' || this.nodeData.pid === '15' || this.nodeData.pid === '16')) {
        // 判断非巡更、移动单兵、辅助类
        params.files.push({
          status: 'stopped',
          name: this.formModelData.uploadNameFour,
          path: this.formModelData.pathFour
        })
      }
      if (!(this.nodeData._id === '141')) {
        // 判断非巡更集合
        params.picture = this.formModelData.picture
      }
      params = Object.assign(params, {brightness: this.brightness, height: this.height, scale: this.scale}) // 绑定模型高度和亮度信息
      if (this.isModelAdd) {
        // 添加模型请求
        this.postModelAdd(params)
          .then(res => {
            this.successMsg('添加成功')
            this.$emit('cancel')
          })
          .catch(err => {
            console.log(err)
            this.errorMsg('添加失败')
          })
      } else {
        // 修改模型请求
        this.putModelUpdate({ id: this.updateData._id, content: params })
          .then(res => {
            this.successMsg('修改成功')
            this.$emit('cancel')
          })
          .catch(err => {
            console.log(err)
            this.errorMsg('添加失败')
          })
      }
    },
    /**
     * 添加、修改确认按钮
     */
    okButton(name) {
      if (this.isModelAdd) {
        // 添加
        this.$refs[name].validate(valid => {
          if (valid) {
            if (this.formModelData.picture.name !== '' && this.formModelData.picture.path !== '') {
              this.modelJudge()
            } else if (this.nodeData._id === '141') {
              this.modelJudge()
            } else {
              this.$Notice.warning({ title: '警告', desc: '请上传图片！' })
            }
          } else {
            this.$Notice.warning({ title: '警告', desc: '请填写正确信息！' })
          }
        })
      } else {
        // 修改
        this.$refs[name].validate(valid => {
          if (valid) {
            this.modelJudge()
          } else {
            this.$Notice.warning({ title: '警告', desc: '请填写正确信息！' })
          }
        })
      }
    },
    /**
     * 取消按钮
     */
    cancelBtn() {
      this.$emit('cancel')
    },
    // 正常状态文件上传成功
    handleSuccessOne(response, file, fileList) {
      this.formModelData.uploadNameOne = response.name
      this.formModelData.pathOne = response.path
    },
    // 正常状态图片上传成功
    handleSuccessPicture(response, file, fileList) {
      this.formModelData.picture.name = response.name
      this.formModelData.picture.path = response.path
      this.addImgSrc = response.path
    },
    // 离线状态文件上传成功
    handleSuccessTwo(response, file, fileList) {
      this.formModelData.uploadNameTwo = response.name
      this.formModelData.pathTwo = response.path
    },
    // 报警状态文件上传成功
    handleSuccessThree(response, file, fileList) {
      this.formModelData.uploadNameThree = response.name
      this.formModelData.pathThree = response.path
    },
    // 停用状态文件上传成功
    handleSuccessFour(response, file, fileList) {
      this.formModelData.uploadNameFour = response.name
      this.formModelData.pathFour = response.path
    },
    // 上传模型图片验证未通过
    modelImageFormatError(file) {
      this.warningMsg('图片 ' + file.name + ' 格式不正确，请上传 png 或 jpeg 格式的图片。')
    },
    // 上传模型文件验证未通过
    modelFileFormatError(file) {
      this.warningMsg('模型 ' + file.name + ' 格式不正确，请上传 gltf 格式的文件。')
    },
    // 上传失败
    handleError() {
      this.$Notice.error({ title: '失败', desc: '上传失败！' })
    }
  }
}
</script>
<style>
.modal-model .modal-form-name input {
  width: 300px !important;
}
</style>
<style scoped>
.fl {
  float: left;
}
.modal-model {
  position: relative;
}
.modal-model .modal-model-form {
  overflow: hidden;
  height: 270px;
}
.modal-model .modal-model-form span {
  margin: 6px 0 0 15px;
}
.modal-model .modal-model-form div {
  width: 300px;
  margin-left: 15px;
}
.upload-img {
  width: 220px;
  /* height: 220px; */
  position: absolute;
  top: 50px;
  right: 50px;
}
.upload-img span {
  display: black;
  line-height: 25px;
  padding: 0 20px;
  color: red;
}
.upload-img-top {
  width: 220px;
  height: 220px;
  border: 1px dashed #fff;
}
.upload-img-top img {
  width: 100%;
  height: 100%;
}
.upload-btn {
  margin: 0 auto;
  width: 96px;
}
</style>
