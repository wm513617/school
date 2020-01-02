<template>
  <div style="display:flex;width:100%" class="bs-content">
    <div class="bs-left resourceList">
      <div class="title clearfix">
        <span class="info">资源列表</span>
        <div class="btnGroup">
          <!-- <Upload action="/api/structure/upload?type=1" style="display:inline-block;" :max-size="524288" :on-exceeded-size="exceededSize" :show-upload-list="false" :on-progress="uploadProgress" :on-error="uploadError" :on-success="uploadSuccess" :before-upload="beforeUpload">
            <Icon class="btn" type="plus-round"></Icon>
          </Upload> -->
          <Button @click="addVideo" icon="plus" title="添加" style="margin-bottom:1px"></Button>
          <!-- <Icon class="btn" type="refresh"></Icon> -->
        </div>
      </div>
      <ul class="resList">
        <!-- <li v-show="uploadProgressBar" class="clearfix">
          <Progress status="active" :percent="uploadProgressBar"></Progress>
        </li> -->
        <li class="clearfix" :class="{'active': item.rtmp === videoSrc}" v-for="item of structureList" @dblclick="videoDbclick(item)">
          <span class="video-name">{{item.channelName}}</span>
          <Button v-if="item.channelid" @click.stop="editVideo(item)" class="edit-btn" type="ghost">
            <Icon type="edit"></Icon>
          </Button>
          <Button v-if="item.channelid" @click.stop="delVideo(item)" class="del-btn" type="ghost">
            <Icon type="trash-a"></Icon>
          </Button>
        </li>
      </ul>
    </div>
    <div class="bs-main">
      <div class="content-main">
        <div class="condition">
          <div class="search-header">
            <div class="type-btn" :class="showType==='人脸检索'?'active':''">
              <Checkbox v-model="faceChecked"></Checkbox>
              <span @click="changeActive">人脸检索</span>
            </div>
            <div class="type-btn" :class="showType==='车辆检索'?'active':''">
              <Checkbox v-model="carChecked"></Checkbox>
              <span @click="changeActive">车辆检索</span>
            </div>
          </div>
          <div class="search-box">
            <div v-if="showType==='人脸检索'" class="filter-info">
              <div class="filter-item filter-item-img">
                <div class="img-box">
                  <img :src="'/api/upload?id='+faceImage" v-if="faceImage" style="width:100%;height:100%" />
                </div>
                <Upload action="/api/upload" name="file" :format="['jpg','png','bmp','jpeg']" :on-success="faceUploadImgSuc" :on-format-error="formatError" :show-upload-list="false">
                  <Button type="primary" icon="ios-cloud-upload-outline">上传照片</Button>
                </Upload>
              </div>
              <div class=" filter-item split">
                <div class="type-title">性别</div>
                <div class="type-item">
                  <Button :type="sexPerson === '不限' ? 'primary': 'ghost'" @click="actPersonSex('不限')">不限</Button>
                  <Button :type="sexPerson === '男' ? 'primary': 'ghost'" @click="actPersonSex('男')">男</Button>
                  <Button :type="sexPerson === '女' ? 'primary': 'ghost'" @click="actPersonSex('女')">女</Button>
                </div>
              </div>
              <div class=" filter-item split">
                <div class="type-title">头部特征</div>
                <div class="type-item">
                  <Button :type="headPerson.indexOf('带帽子') > -1 ? 'primary': 'ghost'" @click="activeButtons('带帽子', headPerson)">带帽子</Button>
                  <Button :type="headPerson.indexOf('长发') > -1 ? 'primary': 'ghost'" @click="activeButtons('长发', headPerson)">长发</Button>
                  <Button :type="headPerson.indexOf('墨镜') > -1 ? 'primary': 'ghost'" @click="activeButtons('墨镜', headPerson)">墨镜</Button>
                </div>
              </div>
              <div class="filter-item-large filter-item split">
                <div class="type-title">上身特征</div>
                <div class="type-item">
                  <div class="type-left">
                    <Button :type="upperBody.indexOf('长袖') > -1 ? 'primary': 'ghost'" @click="activeButtons('长袖', upperBody)">长袖</Button>
                    <Button :type="upperBody.indexOf('短袖') > -1 ? 'primary': 'ghost'" @click="activeButtons('短袖', upperBody)">短袖</Button>
                    <Button :type="upperBody.indexOf('T恤') > -1 ? 'primary': 'ghost'" @click="activeButtons('T恤', upperBody)">T恤</Button>
                  </div>
                  <div class="type-right">
                    <Button :type="upperBody.indexOf('衣服有LOGO') > -1 ? 'primary': 'ghost'" @click="activeButtons('衣服有LOGO', upperBody)">衣服有LOGO</Button>
                    <Button :type="upperBody.indexOf('条纹') > -1 ? 'primary': 'ghost'" @click="activeButtons('条纹', upperBody)">条纹</Button>
                    <Button :type="upperBody.indexOf('正装') > -1 ? 'primary': 'ghost'" @click="activeButtons('正装', upperBody)">正装</Button>
                  </div>
                </div>
              </div>
              <div class="filter-item-large filter-item split">
                <div class="type-title">下身特征</div>
                <div class="type-item">
                  <div class="type-left">
                    <Button :type="lowerBody.indexOf('长裤') > -1 ? 'primary': 'ghost'" @click="activeButtons('长裤', lowerBody)">长裤</Button>
                    <Button :type="lowerBody.indexOf('短裤') > -1 ? 'primary': 'ghost'" @click="activeButtons('短裤', lowerBody)">短裤</Button>
                    <Button :type="lowerBody.indexOf('牛仔裤') > -1 ? 'primary': 'ghost'" @click="activeButtons('牛仔裤', lowerBody)">牛仔裤</Button>
                  </div>
                  <div class="type-right">
                    <Button :type="lowerBody.indexOf('裙子') > -1 ? 'primary': 'ghost'" @click="activeButtons('裙子', lowerBody)">裙子</Button>
                  </div>
                </div>
              </div>
              <div class="filter-item split">
                <div class="type-title">其他特征</div>
                <div class="type-item">
                  <Button :type="elsePerson.indexOf('带包') > -1 ? 'primary': 'ghost'" @click="activeButtons('带包', elsePerson)">带包</Button>
                  <Button :type="elsePerson.indexOf('骑车') > -1 ? 'primary': 'ghost'" @click="activeButtons('骑车', elsePerson)">骑车</Button>
                </div>
              </div>
            </div>
            <div v-if="showType==='车辆检索'" class="filter-info ">
              <div class="filter-item filter-item-img">
                <div class="img-box">
                  <img :src="'/api/upload?id='+carImage" v-if="carImage" style="width:100%;height:100%" />
                </div>
                <Upload action="/api/upload" name="file" :format="['jpg','png','bmp','jpeg']" :on-success="CarUploadImgSuc" :on-format-error="formatError" :show-upload-list="false">
                  <Button type="primary" icon="ios-cloud-upload-outline">上传照片</Button>
                </Upload>
              </div>
              <div class="filter-item split" style="width:170px">
                <div class="type-title">车牌号码</div>
                <div class="type-item">
                  <Input v-model="licenceCar" placeholder="请输入" @on-blur="changeLicence"></Input>
                </div>
              </div>
              <div class="filter-item-large filter-item split">
                <div class="type-title">车辆类型</div>
                <div class="type-item">
                  <div class="type-left">
                    <Button :type="typeCar.indexOf('小汽车') > -1 ? 'primary': 'ghost'" @click="activeButtons('小汽车', typeCar)">小汽车</Button>
                    <Button :type="typeCar.indexOf('三轮车') > -1 ? 'primary': 'ghost'" @click="activeButtons('三轮车', typeCar)">三轮车</Button>
                    <Button :type="typeCar.indexOf('巴士') > -1 ? 'primary': 'ghost'" @click="activeButtons('巴士', typeCar)">巴士</Button>
                  </div>
                  <div class="type-right">
                    <Button :type="typeCar.indexOf('面包车') > -1 ? 'primary': 'ghost'" @click="activeButtons('面包车', typeCar)">面包车</Button>
                    <Button :type="typeCar.indexOf('卡车') > -1 ? 'primary': 'ghost'" @click="activeButtons('卡车', typeCar)">卡车</Button>
                  </div>
                </div>
              </div>
              <div class="filter-item split" style="width:500px">
                <div class="type-title">车身颜色</div>
                <div class="type-item">
                  <div class="type-left marginRight">
                    <Button :type="colorCar.indexOf(item) > -1 ? 'primary': 'ghost'" v-for="item of colorLayout(colorStr, 0, 3)" :key="item" @click="activeButtons(item, colorCar)">{{item}}</Button>
                  </div>
                  <div class="type-left marginRight">
                    <Button :type="colorCar.indexOf(item) > -1 ? 'primary': 'ghost'" v-for="item of colorLayout(colorStr, 3, 6)" :key="item" @click="activeButtons(item, colorCar)">{{item}}</Button>
                  </div>
                  <div class="type-left marginRight">
                    <Button :type="colorCar.indexOf(item) > -1 ? 'primary': 'ghost'" v-for="item of colorLayout(colorStr, 6, 9)" :key="item" @click="activeButtons(item, colorCar)">{{item}}</Button>
                  </div>
                  <div class="type-left marginRight">
                    <Button :type="colorCar.indexOf(item) > -1 ? 'primary': 'ghost'" v-for="item of colorLayout(colorStr, 9, 12)" :key="item" @click="activeButtons(item, colorCar)">{{item}}</Button>
                  </div>
                </div>
              </div>
            </div>
            <div class="search-btn split">
              <Button type="primary">检索</Button>
            </div>

          </div>
        </div>
        <div class="videoBox">
          <video ref="video" :src="videoSrc" controls="controls" @playing="videoPlaying" @pause="videoPause">此浏览器不支持播放视频</video>
        </div>
      </div>
      <div class="content-right">
        <div class="title">搜索结果</div>
        <div class="result">
          <transition-group name="contrastList" tag="ul" class="list">
            <li class="item" v-for="item in list" :key="item">
              <div class="date">{{item.date}}</div>
              <div class="info clearfix">
                <img :src="item.src" class="photo" />
                <ul class="infoList">
                  <li>车辆类型: {{item.vehicleType}}</li>
                  <li>车辆颜色: {{item.color}}</li>
                  <li>车辆品牌: {{item.brand}}</li>
                  <li>车牌号码: {{item.licence}}</li>
                </ul>
              </div>
            </li>
          </transition-group>
        </div>
      </div>
    </div>
    <div v-if="addResModel">
      <Modal v-model="addResModel" :mask-closable="false" title="增加资源" :width="450">
        <div>
          <Form ref="addValidate" :model="resItem" :rules="RuleValidate" :label-width="100" label-position="left" style="padding:0 10px">
            <Form-item label="名称" prop="channelName">
              <Input v-model="resItem.channelName" placeholder="请输入"></Input>
            </Form-item>
            <!-- <Form-item label="服务器" prop="serid">
            <Select v-model="resItem.serid" placeholder="请选择">
              <Option v-for="item in resourceServerArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item> -->
            <Form-item label="时间" prop="time">
              <DatePicker @on-open-change="dateClose(false)" v-model="dateTime" type="datetimerange" placeholder="选择日期和时间" style="width: 300px"></DatePicker>
            </Form-item>
            <Upload action="/api/structure/upload?type=1" :max-size="524288" :on-exceeded-size="exceededSize" :on-progress="uploadProgress" :on-error="uploadError" :on-success="uploadSuccess" :before-upload="beforeUpload">
              <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
            </Upload>
          </Form>
        </div>
        <div slot="footer">
          <Button type="ghost" @click="cancel('addValidate')">取消</Button>
          <Button type="primary" @click="confirm('addValidate')">确定</Button>
        </div>
      </Modal>
    </div>
    <div v-if="editResModel">
      <Modal v-model="editResModel" :mask-closable="false" title="修改资源" :width="450">
        <div>
          <Form ref="editValidate" :model="resEditItem" :rules="editRuleValidate" :label-width="100" label-position="left" style="padding:0 10px">
            <Form-item label="名称" prop="channelName">
              <Input v-model="resEditItem.channelName" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="时间" prop="time">
              <DatePicker @on-open-change="dateEditClose(false)" v-model="dateEditTime" type="datetimerange" placeholder="选择日期和时间" style="width: 300px"></DatePicker>
            </Form-item>
          </Form>
        </div>
        <div slot="footer">
          <Button type="ghost" @click="editCancel('editValidate')">取消</Button>
          <Button type="primary" @click="editConfirm('editValidate')">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  data() {
    const validateDate = (rule, value, callback) => {
      if (this.dateTime[0]) {
        callback()
      } else {
        callback(new Error('请选择时间'))
      }
    }
    const validateEditDate = (rule, value, callback) => {
      if (this.dateEditTime[0]) {
        callback()
      } else {
        callback(new Error('请选择时间'))
      }
    }
    return {
      faceChecked: false,
      carChecked: false,
      showType: '人脸检索',
      videoSrc: '',
      videoList: [
        { fileName: '', path: '', _id: '' }
      ],
      condition: {
        vehicleType: [],
        color: [],
        brand: 1,
        licence: ''
      },
      brand: [
        {
          value: 1,
          label: '大众'
        },
        {
          value: 2,
          label: '奔驰'
        },
        {
          value: 3,
          label: '宝马'
        },
        {
          value: 4,
          label: '路虎'
        },
        {
          value: 5,
          label: '奥迪'
        },
        {
          value: 6,
          label: '福特'
        },
        {
          value: 7,
          label: '丰田'
        },
        {
          value: 8,
          label: '红旗'
        },
        {
          value: 9,
          label: '五菱宏光'
        },
        {
          value: 10,
          label: '比亚迪'
        }
      ],
      list: [],
      uploadProgressBar: 0,
      faceImage: '',
      carImage: '',
      // 增加资源的弹窗
      resItem: {},
      resEditItem: {},
      dateTime: [],
      dateEditTime: [],
      addResModel: false,
      editResModel: false,
      RuleValidate: {
        channelName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        // serid: [{ required: true, message: '请选择服务器', trigger: 'change' }],
        time: [{ required: true, validator: validateDate, trigger: 'change' }]
      },
      editRuleValidate: {
        channelName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        time: [{ required: true, validator: validateEditDate, trigger: 'change' }]
      },
      // 所有的车身颜色字符串
      colorStr: [],
      // 车
      colorCar: [],
      typeCar: [],
      licenceCar: '',
      // 人
      sexPerson: '',
      headPerson: [],
      upperBody: [],
      lowerBody: [],
      elsePerson: []
    }
  },
  created() {
    this.getResList()
    this.getCarColor().then(() => {
      this.colorRecombine()
    })
    // this.getAllServerList()
    // this.getVideoList()
  },
  computed: {
    ...mapState({
      structureList: state => state.structure.structureList,
      resourceServerArr: state => state.vehicle.resourceServerArr
    }),
    ...mapGetters(['carColor'])
  },
  methods: {
    ...mapActions(['getResList', 'getAllServerList', 'addResList', 'editResList', 'deleteResList', 'getCarColor']),
    // 车身颜色的排列
    colorRecombine() {
      this.carColor.forEach((item) => {
        this.colorStr.push(item.label)
      })
    },
    colorLayout(arr, min, max) {
      var array = []
      for (var i = min; i < max; i++) {
        array.push(arr[i])
      }
      return array
    },
    // 检索条件 多选
    activeButtons(item, activeArray) {
      if (activeArray.indexOf(item) > -1) {
        activeArray.splice(activeArray.indexOf(item), 1)
      } else {
        activeArray.push(item)
      }
    },
    changeLicence() {
      var reg = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/
      if (this.licenceCar.length && this.licenceCar.search(reg) === -1) {
        this.$Notice.error({ title: '请输入正确的车牌号' })
      }
    },
    // 人形 or 车辆 显示
    changeActive(e) {
      this.showType = $.trim(e.target.innerText)
      console.log(e, 134)
    },
    // 人 性别
    actPersonSex(item) {
      this.sexPerson = item
    },
    // 人 结束
    videoPause() {
      this.time(false)
    },
    videoPlaying() {
      this.time(true)
    },
    time(flag) {
      if (flag) {
        clearInterval(this.timeInter)
        this.timeInter = setInterval(() => {
          this.list.unshift({
            date: '2012-9-13',
            src: '/static/carSearch/car' + (Math.floor(Math.random() * 9) + 1) + '.jpg',
            vehicleType: '小汽车',
            color: '蓝色',
            brand: '别克',
            licence: '京A5934C'
          })
          if (this.list.length > 4) {
            this.list.pop()
          }
        }, 2000)
      } else {
        clearInterval(this.timeInter)
      }
    },
    videoDbclick(item) {
      console.log(item)
      this.videoSrc = item.rtmp
      this.$refs.video.play()
    },
    getVideoList() {
      this.$http.get('/structure/index?type=1').then(res => {
        const initVideoList = [{ fileName: 'human-structuring.mp4', path: '/static/face/human-structuring.mp4', _id: '' }]
        this.videoList = initVideoList.concat(this.$lodash.cloneDeep(res.data))
      }).catch((err) => {
        console.log('get /structure/index?type=1 error:' + err)
        this.$Notice.open({
          title: '获取视频列表失败'
        })
        this.videoList = [{ fileName: 'human-structuring.mp4', path: '/static/face/human-structuring.mp4', _id: '' }]
      })
    },
    beforeUpload(file) {
      var flag = true
      this.videoList.forEach(item => {
        if (file.name === item.fileName) {
          flag = false
        }
      })
      if (!flag) {
        this.$Notice.open({
          title: '同名文件已存在'
        })
      }
      return flag
    },
    uploadSuccess(response, file, fileList) {
      // console.log(response, file, fileList)
      this.resItem.filePath = response.path
      // this.getVideoList()
    },
    uploadProgress(event, file, fileList) {
      this.uploadProgressBar = parseInt(event.percent)
      if (this.uploadProgressBar >= 100) {
        setTimeout(() => {
          this.uploadProgressBar = 0
        }, 500)
      }
    },
    uploadError(event, file, fileList) {
      this.uploadProgressBar = 0
      this.$Notice.open({
        title: '上传文件失败'
      })
    },
    // 人脸图片回显
    faceUploadImgSuc(response) {
      this.faceImage = response.id
    },
    // 车辆图片回显
    CarUploadImgSuc(response) {
      this.carImage = response.id
    },
    formatError(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg, png, bmp 或 jpeg 格式的图片。'
      })
    },
    exceededSize(file) {
      this.$Notice.warning({
        title: '视频大小超过限制',
        desc: '视频 ' + file.name + ' 大小超过限制，请上传小于512M的视频。'
      })
    },
    // 增加资源列
    addVideo() {
      this.resItem = {
        channelName: '',
        serid: '',
        filePath: '',
        startTime: '',
        endTime: ''
      }
      this.dateTime = []
      this.addResModel = true
    },
    // 日期组件
    dateClose() {
      const moment = this.$moment
      this.resItem.startTime = moment(this.dateTime[0]).format('YYYY-MM-DDTHH:mm:ss')
      this.resItem.endTime = moment(this.dateTime[1]).format('YYYY-MM-DDTHH:mm:ss')
    },
    cancel(name) {
      this.addResModel = false
      this.$refs[name].resetFields()
    },
    // 增加资源的提交
    confirm(name) {
      if (!this.resItem.filePath) {
        this.$Notice.warning({ title: '请上传视频!' })
      } else {
        this.$refs[name].validate((valid) => {
          if (!valid) {
            this.$Notice.error({ title: '表单验证失败!' })
          } else {
            this.addResList(this.resItem).then(res => {
              this.$Notice.success({ title: '添加成功!' })
              this.getResList()
            }).catch(err => {
              this.$Notice.error({ title: err.response.data.message })
              console.log('addResList error:' + err)
            })
            this.addResModel = false
          }
        })
      }
    },
    // 修改资源列
    editVideo(item) {
      this.resEditItem = JSON.parse(JSON.stringify(item))
      const moment = this.$moment
      this.dateEditTime = [
        moment(item.startTime)._d,
        moment(item.endTime)._d
      ]
      this.editResModel = true
    },
    // 日期组件
    dateEditClose() {
      // console.log(this.dateEditTime, '修改')
    },
    editCancel(name) {
      this.editResModel = false
      this.$refs[name].resetFields()
    },
    // 修改资源的提交
    editConfirm(name) {
      this.$refs[name].validate((valid) => {
        if (!valid) {
          this.$Notice.error({ title: '表单验证失败!' })
        } else {
          const moment = this.$moment
          this.resEditItem.startTime = moment(this.dateEditTime[0]).format('YYYY-MM-DDTHH:mm:ss')
          this.resEditItem.endTime = moment(this.dateEditTime[1]).format('YYYY-MM-DDTHH:mm:ss')
          this.editResList(this.resEditItem).then(res => {
            this.$Notice.success({ title: '修改成功!' })
            this.getResList()
          }).catch(err => {
            this.$Notice.error({ title: err.response.data.message })
            console.log('addResList error:' + err)
          })
          this.editResModel = false
        }
      })
    },
    // 删除资源
    delVideo(item) {
      var _this = this
      this.$Modal.confirm({
        title: '警告',
        content: '确定删除吗?',
        cancelText: '取消',
        onOk: function() {
          _this.deleteResList({ channelid: item.channelid, serid: item.serid, filePath: item.filePath }).then(() => {
            _this.$Notice.success({ title: '删除成功!' })
            _this.getResList()
          }).catch(err => {
            _this.$Notice.error({ title: err.response.data.message })
            console.log('delVideo error: ' + err)
          })
        }
      })
      // this.$http.delete('/structure/' + id).then(res => {
      //   // this.getVideoList()
      // })
    }
  },
  beforeDestroy() {
    clearInterval(this.timeInter)
  }
}
</script>

<style lang="less" scoped>
.search-header {
  height: 40px;
  background: #0F2343;
  .type-btn {
    float: left;
    line-height: 40px;
    padding: 0 10px;
    border-right: 1px solid #0a111c;
    &.active {
      background: #1C3053;
    }
    span {
      cursor: pointer;
    }
  }
}

.search-box {
  display: flex;
  flex: 1;
  padding: 20px 10px;
  justify-content: space-between;
  .split {
    border-left: 1px solid #263e69;
    box-shadow: 1px 0px 0px #142441 inset;
  }
  .search-btn {
    width: 140px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    button {
      width: 100px;
    }
  }
  .filter-info {
    flex: 1;
    display: flex;
    .filter-item {
      width: 140px;
      padding: 0 20px;
      .type-left {
        width: 100px;
        float: left;
      }
      .marginRight {
        margin-right: 10px;
      }
      .type-right {
        width: 100px;
        float: right;
      }
      &.filter-item-large {
        width: 250px;
      }
      &.filter-item-img {
        width: 200px;
      }
      .type-title {
        line-height: 40px;
        font-size: 14px;
      }
      .img-box {
        width: 160px;
        height: 120px;
        border-radius: 4px;
        border: 1px solid #142441;
        box-shadow: 0px 0px 2px #fff;
        margin-bottom: 10px;
      }
      button {
        width: 100%;
        height: 32px;
        margin-bottom: 10px;
      }
    }
  }
}

.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden
}

.ivu-checkbox-group {
  display: inline-block;
}

.layout-content {
  min-height: 100%;
  width: 100%;
  padding: 20px;
}

.resourceList {
  height: 100%;
  .title {
    padding: 0 10px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    font-weight: bold;
    overflow: hidden;
    background: #5d5d5d;
    color: #fff;
    .info {
      float: left;
    }
    .btnGroup {
      float: right;
      .btn {
        margin-left: 10px;
      }
    }
  }
  .resList {
    width: 100%;
    list-style: none;
    li {
      width: 100%;
      height: 40px;
      padding-left: 14px;
      padding-right: 44px;
      display: flex;
      position: relative;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #263e69;
      box-shadow: 2px 0px 0px #142441 inset;
      .video-name {
        float: left;
        display: inline-block;
        width: 240px;
        overflow: hidden;
        height: 38px;
        line-height: 38px;
      }
      .del-btn {
        position: absolute;
        right: 5px;
        display: none;
      }
      &:hover {
        .del-btn {
          display: block;
        }
      }
      .edit-btn {
        position: absolute;
        right: 45px;
        display: none;
      }
      &:hover {
        .edit-btn {
          display: block;
        }
      }
    }
    .active {
      background: #363636;
      color: #00a5e3;
    }
  }
}

.main {
  padding-left: 10px
}

.content-main {
  flex: 1 0 1100px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.content-right {
  background: #1C3053;
  color: #ffffff;
  width: 400px;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  .title {
    text-align: center;
    padding: 0 10px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: #fff;
    border-bottom: 1px solid #263e69;
    box-shadow: 0px -1px 2px #142441 inset;
  }
}

.condition {
  height: 250px;
  margin-bottom: 10px;
  background: #1C3053;
  display: flex;
  flex-direction: column;
  .options {
    .line {
      line-height: 28px;
      height: 28px;
      display: flex;
      margin-bottom: 10px;
      .title {
        width: 20%;
        font-weight: bold;
      }
      .ivu-select,
      .ivu-input-wrapper {
        width: 30%;
      }
      .ivu-checkbox-group {
        width: 80%;
        .ivu-checkbox-group-item {
          width: 11%;
        }
      }
    }
  }
}

.videoBox {
  display: flex;
  background: #1C3053;
  flex: 1;
  video {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
}

.result {
  overflow: hidden;
  flex: 1;
  .list {
    list-style: none;
    height: 100%;
    .item {
      padding: 10px 0;
      width: 100%;
      height: 25%;
      border-bottom: 1px solid #263e69;
      box-shadow: 0px -1px 2px #142441 inset;
      .date {
        margin-bottom: 10px;
      }
      .info {
        img {
          width: 50%;
          height: 100%;
          float: left;
        }
        .infoList {
          width: 50%;
          float: left;
          padding-left: 10px;
          li {
            height: 28px;
            line-height: 28px;
          }
        }
      }
    }
  }
}

.contrastList-enter-active,
.contrastList-leave-active,
.contrastList-move {
  transition: all 1s;
  -webkit-transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
  -webkit-transform-style: preserve-3d;
}

.contrastList-enter,
.contrastList-leave-active {
  opacity: 0;
  transform: translateX(-30px);
}

.contrastList-leave {
  opacity: 1;
  transform: translateX(30px);
}
</style>
