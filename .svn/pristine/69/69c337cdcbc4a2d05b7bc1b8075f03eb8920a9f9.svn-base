<template>
  <div class="platform">
    <Row>
      <Col span="24">
      <h3>版本信息</h3>
      <div class="top">
        <ul>
          <li>
            <p>
              <i>服务器版本：</i>
              <b>{{serverVersion}}</b>
            </p>
            <p>
              <i>Web版本：</i>
              <b>{{clientVersion}}</b>
            </p>
          </li>
          <li>
            <p>
              <i>Player版本：</i>
              <b>{{playInfo}}</b>
            </p>
            <!-- <p>
              <i>本地Player版本：</i>
              <b>{{localPlayInfo}}</b>
            </p> -->
          </li>
        </ul>
      </div>
      <h3>授权信息</h3>
      <div class="top">
        <ul>
          <li>
            <p>
              <i>序列号：</i>
              <b>BSR-xy-1097684567889900000000</b>
            </p>
            <p>
              <i>有效期：</i>
              <b>无限期</b>
            </p>
          </li>
          <li>
            <p>
              <i>平台类型：</i>
              <b>管理平台</b>
            </p>
            <!-- <p>
              <i>设备接入数量：</i>
              <b>99路</b>
            </p> -->
          </li>
        </ul>
        <div class="btn">
          <Button type="ghost" :disabled="saveBtn">导出机器码</Button>
          <Button type="ghost" :disabled="saveBtn">导入key授权</Button>
        </div>
      </div>
      <h4>个性化设置</h4>
      <div class="personality">
        <Form :model="formItem" :label-width="120" label-position="left" ref="sysForm" :rules="platformWord">
          <Form-item label="平台描述文字：" prop="logoName">
            <Input v-model="formItem.logoName" placeholder="请输入..." style="width: 300px" :disabled="saveBtn"></Input>
          </Form-item>
        </Form>
        <div class="logo">
          <b>平台logo：</b>
          <div class="uploadLogo">
            <p>图片最大为0.5M，格式为*.png，比例为7:1</p>
            <div class="demo-upload-list" v-for="item in uploadList" :key ='item'>
              <template v-if="item.status === 'finished'">
                <img :src="item.url">
              </template>
              <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
              </template>
            </div>
            <Upload ref="upload" :headers="headerObj" action="/api/upload" :default-file-list="defaultList" :show-upload-list="false" :on-progress="uploadLogoProgress" :on-success="uploadLogoSuccess" :on-format-error="uploadLogoFormatError" :on-exceeded-size="uploadLogoMaxSize" :format="['png']" :max-size="512" style="float: left;width:100px;">
              <Button type="ghost" icon="ios-cloud-upload-outline" :disabled="saveBtn">上传文件</Button>
            </Upload>
          </div>
        </div>
        <div class="upload">
          <b>标题栏背景：</b>
          <div class="uploadcolor">
            <p>
              <b ref="changeuploadcolor">A</b>
            </p>
            <Select v-model="backgroundColor" style="width:300px" :disabled="saveBtn">
              <Sketch :value="colors" @input="backgroundCheck"></Sketch>
            </Select>
          </div>
        </div>
        <div class="font">
          <b>标题栏字体：</b>
          <div class="setfont">
            <div class="size">
              <p>
                <Select v-model="font" style="width:300px" :disabled="saveBtn">
                  <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </p>
            </div>
            <div class="size">
              <p>
                <Select v-model="size" style="width:120px" :disabled="saveBtn">
                  <Option v-for="item in sizeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </p>
              <p>
                <Select v-model="regular" style="width:120px" :disabled="saveBtn">
                  <Option v-for="item in regularList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </p>
              <p class="italicBtn">
                <i @click="italicClick" title="斜体" ref="fontstyle">I</i>
              </p>
            </div>
            <div class="size">
              <div class="uploadcolor">
                <div class="backColor">
                  <p class="fontline">
                    <a>A</a>
                    <b ref="changefontcolor"></b>
                  </p>
                </div>
                <Select v-model="fontColor" style="width:300px;" :disabled="saveBtn">
                  <Sketch :value="fontcolors" @input="colorCheck"></Sketch>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div class="picture">
          <b>登录页面图片：</b>
          <div class="pictureRight">
            <p>图片最大为1M，格式为*.png，比例为25:3</p>
            <div class="demo-upload-list" v-for="item in loginuploadList" :key = 'item'>
              <template v-if="item.status === 'finished'">
                <img :src="item.url">
              </template>
              <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
              </template>
            </div>
            <Upload ref="login" :headers="headerObj" action="/api/upload" :default-file-list="loginList" :show-upload-list="false" :on-progress="loginProgress" :on-success="loginSuccess" :on-format-error="loginFormatError" :on-exceeded-size="loginMaxSize" :format="['png']" :max-size="1024" style="float: left;width:100px;">
              <Button type="ghost" icon="ios-cloud-upload-outline" :disabled="saveBtn">上传文件</Button>
            </Upload>
          </div>
        </div>
      </div>
      <div class="hr"></div>
      <div class="footer">
        <Button type="primary" @click="savePlatform" :loading="sureLoading" :disabled="saveBtn">保存</Button>
        <Button type="ghost" @click="resetPlatform" :disabled="saveBtn">恢复默认</Button>
      </div>
      </Col>
    </Row>
    <!--查看详情弹出框-->
    <Modal v-model="platformModal" width="360" :mask-closable="false">
      <div class="modalMessage">
        <div style="position:absolute;top:32px;left:20px">
          <i class="ivu-icon ivu-icon-help-circled" style="fontSize:36px;color:#ff9900;"></i>
        </div>
        <span style="margin:25px 15px 15px 45px;display:inline-block;font-size:14px">提示：请确认是否恢复默认？</span>
      </div>
      <div slot="footer">
        <Button type="ghost" @click="platformModal = false">取消</Button>
        <Button type="primary" @click="platformYes" :disabled="saveBtn">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import dataInfo from '../../../components/video/pluginVersionCheck.js'
import { CLIENT_VERSION } from '../../../constants.js'
import './platform.css'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { Sketch } from 'vue-color'
const defaultProps = {
  hex: '#1c3054'
}
const defaultFontProps = {
  hex: '#fff'
}
export default {
  components: {
    Sketch: Sketch
  },
  data() {
    // const verifyName = (rule, value, callback) => {
    //   let nativecode = value.split('')
    //   let len = 0
    //   let r = /\s+/g
    //   if (r.test(value)) {
    //     return callback(new Error('不可以输入空格！'))
    //   }
    //   for (let i = 0; i < nativecode.length; i++) {
    //     let code = Number(nativecode[i].charCodeAt(0))
    //     if (code > 127) {
    //       len += 2
    //     } else {
    //       len++
    //     }
    //   }
    //   if (len > 20) {
    //     return callback(new Error('不能超过20位字符'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      // localPlayInfo: this.$store.getters.plugin.version,
      playInfo: dataInfo.version,
      clientVersion: '',
      platformWord: {
        logoName: [
          // { required: true, message: '设备名称不能为空', trigger: 'change' },
          // { validator: verifyName, trigger: 'change' }
        ]
      },
      imgUrl: '/static/image/home/logoMenu.png',
      backImg: '/static/image/home/login_bg.png',
      sureLoading: false,
      visible: false,
      formItem: {
        logoName: '园区综合性管理平台' // 平台文字
      },
      defaultList: [
        {
          name: '',
          url: ''
        }
      ],
      loginList: [
        {
          name: '',
          url: ''
        }
      ],
      loginuploadList: [],
      imgName: '',
      uploadList: [],
      cityList: [
        {
          value: '微软雅黑',
          label: '微软雅黑'
        },
        {
          value: '宋体',
          label: '宋体'
        },
        {
          value: '楷体',
          label: '楷体'
        },
        {
          value: '仿宋',
          label: '仿宋'
        },
        {
          value: 'Times New Roman',
          label: 'Times New Roman'
        }
      ],
      font: '',
      regularList: [
        {
          value: 'normal',
          label: 'Regular'
        },
        {
          value: '100',
          label: 'Light'
        },
        {
          value: 'bold',
          label: 'Bold'
        }
      ],
      regular: '',
      sizeList: [
        {
          value: '12',
          label: '12'
        },
        {
          value: '14',
          label: '14'
        },
        {
          value: '16',
          label: '16'
        }
      ],
      size: '',
      // 字体颜色
      fontColor: '',
      backgroundColor: '',
      italicstatus: false,
      underlinestatus: false,
      // 字体加粗
      fontWeight: '',
      // 字体斜体
      fontItalic: '',
      // 字体粗细
      fontRegular: '',
      // 图片地址
      uploadPictureAdress: '',
      // 背景图片
      backgroundPicture: '',
      uploadImg: '',
      colors: defaultProps,
      fontcolors: defaultFontProps,
      saveBtn: false,
      headerObj: { Authorization: '' },
      titlefont: '',
      platformModal: false,
      defaultBtn: false
    }
  },
  created() {
    this.clientVersion = CLIENT_VERSION
    console.log(this.defaultList)
    this.headerObj.Authorization = `Bearer ${this.accessToken}`
    // if (this.sysConfrole) {
    //   if (this.sysConfrole.SysPar) {
    //     this.saveBtn = false
    //   } else {
    //     this.saveBtn = true
    //   }
    // }
    this.getData()
    this.getServerVersion().catch(err => {
      console.log(err, '获取服务器版本错误')
    })
  },
  methods: {
    ...mapMutations(['SET_PLATFORM', 'GET_PLATFORM']),
    ...mapActions(['setPlatform', 'getPlatform', 'getServerVersion']),
    getData() {
      console.log(this.uploadList)
      this.getPlatform()
        .then(resp => {
          this.formItem.logoName = this.getMenuStyle.name === '' ? '园区综合性管理平台' : this.getMenuStyle.name
          this.font = !this.getMenuStyle.fontfamily ? '微软雅黑' : this.getMenuStyle.fontfamily
          this.size = !this.getMenuStyle.fontSize ? '16' : this.getMenuStyle.fontSize
          this.regular = this.getMenuStyle.fontRegular === '' ? 'normal' : this.getMenuStyle.fontRegular
          this.fontColor = this.getMenuStyle.fontColor
          this.fontItalic = this.getMenuStyle.fontItalic
          if (this.getMenuStyle.fontItalic === 'oblique') {
            this.$refs.fontstyle.style.fontStyle = this.fontItalic
          } else {
            this.$refs.fontstyle.style.fontStyle = this.fontItalic
          }
          this.backgroundColor = this.getMenuStyle.uploadColor
          if (!this.getMenuStyle.uploadLogoPicture) {
            this.defaultList[0].url = this.imgUrl
            this.uploadPictureAdress = this.imgUrl
          } else {
            this.defaultList[0].url = this.getMenuStyle.uploadLogoPicture
            this.uploadPictureAdress = this.getMenuStyle.uploadLogoPicture
          }
          if (!this.getMenuStyle.uploadBackgroundPicture) {
            this.loginList[0].url = this.backImg
            this.backgroundPicture = this.backImg
          } else {
            this.loginList[0].url = this.getMenuStyle.uploadBackgroundPicture
            this.backgroundPicture = this.getMenuStyle.uploadBackgroundPicture
          }
          if (!this.getMenuStyle.fontColor) {
            this.$refs.changefontcolor.style.backgroundColor = '#fff'
          } else {
            this.$refs.changefontcolor.style.backgroundColor = this.fontColor
          }
          if (!this.getMenuStyle.uploadColor) {
            this.$refs.changeuploadcolor.style.backgroundColor = '#1c3054'
          } else {
            this.$refs.changeuploadcolor.style.backgroundColor = this.backgroundColor
          }
        })
        .catch(err => {
          console.log('getPlatform error: ' + err)
          this.$Notice.warning({
            title: '失败',
            desc: '参数获取失败！',
            duration: 2,
            top: 200
          })
          this.defaultList[0].url = this.imgUrl
          this.uploadPictureAdress = this.imgUrl
          this.loginList[0].url = this.backImg
          this.backgroundPicture = this.backImg
        })
    },
    // 平台logo：
    uploadLogoProgress(event, file, fileList) {
      if (fileList.length > 1) {
        fileList.shift()
      }
    },
    uploadLogoSuccess(res, file) {
      this.uploadPictureAdress = '/api/upload?id=' + res.id
      file.url = this.uploadPictureAdress
      file.name = file.response.name
    },
    uploadLogoFormatError(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传 *.png 格式的图片。'
      })
    },
    uploadLogoMaxSize(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 太大，不能超过 0.5M。'
      })
    },
    // 背景图片
    loginProgress(event, file, fileList) {
      if (fileList.length > 1) {
        fileList.shift()
      }
    },
    loginSuccess(res, file) {
      // 因为上传过程为实例，这里模拟添加 url
      this.backgroundPicture = '/api/upload?id=' + file.response.id
      file.url = this.backgroundPicture
      file.name = file.response.name
    },
    loginFormatError(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传*.png 格式的图片。'
      })
    },
    loginMaxSize(file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: '文件 ' + file.name + ' 太大，不能超过 1M。'
      })
    },
    // 标题栏背景
    backgroundCheck(value) {
      this.colors = value
      this.backgroundColor = this.colors.hex
      this.$refs.changeuploadcolor.style.backgroundColor = this.colors.hex
    },
    // 字体斜体
    italicClick() {
      if (this.italicstatus === false) {
        this.italicstatus = true
        this.fontItalic = 'oblique'
        this.$refs.fontstyle.style.fontStyle = this.fontItalic
      } else {
        this.italicstatus = false
        this.fontItalic = 'normal'
        this.$refs.fontstyle.style.fontStyle = this.fontItalic
      }
    },
    // 字体颜色
    colorCheck(value) {
      this.fontcolors = value
      this.fontColor = this.fontcolors.hex
      this.$refs.changefontcolor.style.backgroundColor = this.fontcolors.hex
    },
    // 保存
    savePlatform() {
      if (this.formItem.logoName === '') {
        this.formItem.logoName = '园区综合性管理平台'
      }
      this.sureLoading = true
      this.$refs.sysForm.validate(valid => {
        if (!valid) {
          this.$Notice.error({
            title: '警告',
            desc: '保存失败',
            duration: 1
          })
          this.sureLoading = false
        } else {
          if (this.platformModal) {
            this.formItem.logoName = '园区综合性管理平台'
            this.font = '微软雅黑'
            this.size = '16'
            this.regular = this.regularList[0].value
            this.uploadPictureAdress = ''
            this.backgroundPicture = ''
            this.$refs.changefontcolor.style.backgroundColor = '#fff'
            this.$refs.changeuploadcolor.style.backgroundColor = '#1c3054'
            this.fontColor = '#fff'
            this.fontItalic = 'normal'
            this.backgroundColor = '#1c3054'
            const fonts = {
              font: this.font,
              size: this.size,
              fontWeight: this.fontWeight,
              fontColor: this.fontColor,
              fontItalic: this.fontItalic,
              fontRegular: this.regular
            }
            this.titlefont = JSON.stringify(fonts)
            const platformData = {
              name: this.formItem.logoName,
              titlefont: this.titlefont,
              titlecolor: this.backgroundColor,
              logo: this.uploadPictureAdress,
              loginimg: this.backgroundPicture
            }
            this.$store.commit('SET_PLATFORM', platformData)
          } else {
            const fonts = {
              font: this.font,
              size: this.size,
              fontWeight: this.fontWeight,
              fontColor: this.fontColor,
              fontItalic: this.fontItalic,
              fontRegular: this.regular
            }
            this.titlefont = JSON.stringify(fonts)
            const platformData = {
              name: this.formItem.logoName,
              titlefont: this.titlefont,
              titlecolor: this.backgroundColor,
              logo: this.uploadPictureAdress,
              loginimg: this.backgroundPicture
            }
            this.$store.commit('SET_PLATFORM', platformData)
          }
          this.setPlatform({
            name: this.formItem.logoName,
            titlefont: this.titlefont,
            titlecolor: this.backgroundColor,
            logo: this.uploadPictureAdress,
            loginimg: this.backgroundPicture,
            flag: true
          })
            .then(res => {
              this.sureLoading = false
              if (this.platformModal) {
                this.getPlatform()
                  .then(resp => {
                    this.defaultBtn = false
                    this.uploadList[0].url = this.imgUrl
                    this.loginuploadList[0].url = this.backImg
                    this.platformModal = false
                  })
                  .catch(err => {
                    console.log('savePlatform error: ' + err)
                    this.defaultBtn = false
                    this.platformModal = false
                    this.$Notice.warning({
                      title: '失败',
                      desc: '参数保存失败！',
                      duration: 2,
                      top: 200
                    })
                  })
              } else {
                this.$Notice.success({
                  title: '成功',
                  desc: '参数保存成功！',
                  duration: 2,
                  top: 200
                })
                this.getPlatform()
              }
            })
            .catch(err => {
              console.log('savePlatform error: ' + err)
              this.sureLoading = false
              this.defaultBtn = false
              this.platformModal = false
              this.$Notice.warning({
                title: '失败',
                desc: '参数保存失败！',
                duration: 2,
                top: 200
              })
            })
        }
      })
    },
    resetPlatform() {
      this.platformModal = true
    },
    platformYes() {
      this.savePlatform()
      this.defaultBtn = true
    }
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList
    this.loginuploadList = this.$refs.login.fileList
  },
  computed: {
    ...mapState({ serverVersion: ({ platform }) => platform.serverVersion }),
    ...mapGetters(['getMenuStyle', 'sysConfrole', 'accessToken'])
  }
}
</script>
<style scoped>
.ivu-form-item {
  margin-bottom: 20px !important;
}

.platform {
  width: 100%;
  position: relative;
  background: #1b3153;
}

i {
  font-style: normal;
}

b {
  font-weight: normal;
}

.top {
  margin: 24px 0 0 48px;
}

h3,
h4 {
  font-size: 14px;
  height: 38px;
  line-height: 38px;
  background: #0f2243;
  padding-left: 24px;
  font-weight: normal;
}

h4 {
  margin-bottom: 20px;
}

.top ul li {
  display: block;
  overflow: hidden;
  list-style-type: none;
  margin: 10px 0;
}

.top ul li i {
  float: left;
  width: 120px;
}

.top ul li p {
  float: left;
  margin-right: 200px;
}

.top ul li p i {
  float: left;
  width: 120px;
}

.top ul li p b {
  float: left;
  width: 280px;
}

.btn {
  margin: 20px 0;
}

.btn .ivu-btn-ghost {
  margin-right: 10px;
}

.ivu-btn-primary {
  margin-right: 20px;
}

.demo-upload-list {
  height: 25px;
  width: 120px;
  margin-left: 10px;
  display: inline-block;
  text-align: center;
  /*border: 1px solid #5d5d5d;*/
  border-radius: 4px;
  overflow: hidden;
  /*background: #fff;*/
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}

.demo-upload-list img {
  width: 100%;
  height: 100%;
}

.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}

.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}

.demo-upload-list-cover i {
  float: right;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}

.personality {
  margin-left: 48px;
  position: relative;
}

.personality > div {
  margin: 20px 0;
  overflow: hidden;
}

.personality b {
  float: left;
  width: 120px;
}

.logo {
  position: relative;
}

.logo i {
  float: right;
}

.uploadLogo {
  margin-left: 120px;
}

.uploadLogo .ivu-upload {
  position: absolute;
  top: 0px;
  left: 120px;
}

.uploadLogo p {
  margin-left: 110px;
  display: inline-block;
  line-height: 32px;
}

.uploadLogo .demo-upload-list {
  display: block !important;
  margin-left: 0px;
  width: 294px;
  height: 45px;
  margin-top: 15px;
}

.setfont {
  margin-left: 120px;
  overflow: hidden;
}

.size {
  overflow: hidden;
}

.size > p {
  float: left;
  margin: 0 10px 10px 0;
}

.italic {
  overflow: hidden;
}

.italicBtn {
  float: left;
  height: 30px;
  width: 38px;
  /*border: 1p3 solid #ccc;*/
  background: #1c3053;
  border-radius: 4px;
}

.italicBtn i {
  float: left;
  line-height: 31px;
  width: 37px;
  text-align: center;
  border: 1px solid #5676a9;
  border-radius: 4px;
  font-style: italic;
  cursor: pointer;
  font-style: normal;
}

.italic u {
  float: left;
  line-height: 31px;
  width: 37px;
  text-align: center;
  cursor: pointer;
}

.picture {
  position: absolute;
  left: 600px;
  top: -10px;
}

.pictureRight .ivu-upload {
  position: absolute;
  top: 0px;
  left: 120px;
}

.pictureRight p {
  margin-left: 110px;
  display: inline-block;
  line-height: 32px;
}

.picture .demo-upload-list {
  display: block !important;
  margin-left: 0px;
  width: 300px;
  height: 200px;
  margin-top: 15px;
}

.picture b {
  height: 35px;
}

.pictureRight {
  margin-left: 120px;
}

.uploadcolor {
  float: left;
  width: 70px;
}

.backColor {
  float: left;
  width: 100px;
  height: 20px;
  margin: 1px 0 0 2px;
  font-size: 12px;
  position: absolute;
  z-index: 9;
  border-radius: 4px;
  background: #1c3053;
}

.uploadcolor p {
  float: left;
  width: 100px;
  height: 20px;
  margin: 6px 0 0 2px;
  padding-left: 10px;
  font-size: 12px;
  position: absolute;
  z-index: 9;
  border-radius: 4px;
  background: #1c3053;
}

.uploadcolor p b {
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  /*color: red;*/
  /*background-color: #464c5b;*/
  /*margin-top: 6px;*/
}

.uploadcolor.color {
  overflow: hidden;
}

.ivu-select-dropdown {
  max-height: 385px !important;
}

.uploadcolor .fontline {
  width: 32px;
  overflow: hidden;
}

.uploadcolor .fontline a {
  float: left;
  width: 12px;
  text-align: center;
  color: #fff;
}

.uploadcolor .fontline b {
  height: 2px;
  width: 12px;
  background-color: #000;
}

.shadow {
  float: left;
  width: 70px;
  background-color: #fff;
  margin-left: 15px;
}

.footer {
  margin-top: 20px;
  padding-left: 450px;
}

.footer button {
  width: 100px;
}

.footer span {
  padding: 0 40px;
}

.vue-color__sketch,
.vc-sketch {
  width: 298px;
  height: 362px;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
}
button {
  /* height: 32px; */
  border-radius: 4px;
  padding-left: 8px;
  padding-right: 8px;
}
.hr {
  border-top: 1px solid #fff;
  opacity: 0.1;
}
</style>
