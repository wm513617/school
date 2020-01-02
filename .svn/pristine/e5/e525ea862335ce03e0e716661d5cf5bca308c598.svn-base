<template>
  <div class="photo">
    <div style="width：400px;height:300px"  id="my_camera" v-show="picStatus">
    </div>
    <div class="mPhoto" v-show="picIcon">
      <span class="iconfont icon-screenshot" @click="playVideoFn" ></span>
    </div>
    <div style="text-align: center;position: absolute;bottom: -133px;">
        <div class="enterPic">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" style="margin-top:8px" :label-width="120">
            <FormItem label="输入照片名称" prop="picName">
              <Input  placeholder="请输入照片名称" v-model="formValidate.picName" style="width:220px;"/>
            </FormItem>
            <FormItem>
              <Button :disabled='picIcon' type="primary" style="margin:0 10px 0 0" @click="photoFn('formValidate')">{{screenshots?'重拍':'拍照'}}</Button>
              <Button type="primary" @click="uploadPic('formValidate')" :loading="uploadLoad" :disabled='!screenshots'>上传</Button>
           </FormItem>
          </Form>
        </div>
    </div>
  </div>
</template>

<script>
import Webcam from 'webcamjs'
import axios from 'axios'

export default {
  props: {
    // flashStatus: Boolean
  },
  data() {
    return {
      width: 400,
      height: 300,
      picStatus: false, // 摄像
      picIcon: true, // 摄像图标
      screenshots: false, // 截图
      imgFile: '',
      uploadLoad: false,
      formValidate: {
        picName: '' // 照片命名
      },
      ruleValidate: {
        picName: [{ required: true, message: '请输入照片名称', trigger: 'change' }]
      }
    }
  },
  watch: {
    // flashStatus(val) {
    //   if (val) {
    //     Webcam.reset()
    //   }
    // }
  },
  computed: {},
  methods: {
    playVideoFn() {
      this.picStatus = true
      this.picIcon = false
      Webcam.attach('#my_camera')
      this.$emit('flashStart', Webcam)
      // this.warningMsg('请确保已经成功连接摄像头设备！')
    },
    photoFn(name) {
      if (!this.screenshots) {
        Webcam.snap(data_uri => {
          this.imgFile = this.dataURLtoFile(data_uri, 'default.png')
        })
        Webcam.freeze()
        this.screenshots = true
      } else {
        Webcam.unfreeze()
        this.screenshots = false
        this.picIcon = false
        this.uploadLoad = false
        this.$refs[name].resetFields()
      }
    },
    // 将图片Base64 转成文件
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    // 图片上传
    uploadPic(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.uploadLoad = true
          let fileFormData = new FormData()
          fileFormData.append('file', this.imgFile)
          axios
            .create({
              baseURL: '',
              headers: { 'Content-Type': 'multipart/form-data' }
            })
            .post('/api/upload/file', fileFormData)
            .then(res => {
              this.successMsg('上传成功')
              this.uploadLoad = false
              res.data.name = this.formValidate.picName + '.png'
              this.$emit('uploadSuccess', res.data)
            })
            .catch(() => {
              this.$Message.error('Fail!')
            })
        }
      })
    }
  },
  created() {},
  mounted() {
    Webcam.set({
      width: 400,
      height: 300,
      force_flash: true,
      image_format: 'png',
      jpeg_quality: 90,
      swfURL: '../../../static/plugin/webcam.swf'
    })
  },
  beforeDestroy() {
    Webcam.reset()
  }
}
</script>

<style lang="less" scoped>
.photo {
  .enterPic {
    text-align: left;
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    line-height: 32px;
  }
  .mPhoto {
    width: 400px;
    height: 300px;
    position: absolute;
    top: 0;
    span {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 50px;
      cursor: pointer;
    }
  }
}
</style>
