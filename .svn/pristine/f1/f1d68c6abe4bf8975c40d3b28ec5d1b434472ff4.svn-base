<template>
  <div class="bs-content">
    <div class="resourceList bs-left">
      <div class="title clearfix">
        <span class="info">资源列表</span>
        <div class="btnGroup">
          <Upload action="/api/structure/upload?type=0" style="display:inline-block;" :max-size="524288" :on-exceeded-size="exceededSize" :show-upload-list="false" :on-progress="uploadProgress" :on-error="uploadError" :on-success="uploadSuccess" :before-upload="beforeUpload">
            <Icon class="btn" type="plus-round"></Icon>
          </Upload>
          <!-- <Icon class="btn" type="refresh"></Icon> -->
        </div>
      </div>
      <ul class="resList">
        <li v-show="uploadProgressBar" class="clearfix">
          <Progress status="active" :percent="uploadProgressBar"></Progress>
        </li>
        <li class="clearfix" :class="{'active': item.path === videoSrc}" v-for="item of videoList" @dblclick="videoDbclick($event, item.path)">
          <span class="video-name">{{item.fileName}}</span>
          <Button v-if="item._id" @click.stop="delVideo($event, item._id)" class="del-btn" type="ghost">
            <Icon type="trash-a"></Icon>
          </Button>
        </li>
      </ul>
    </div>
    <div class="bs-main">
      <div class="content-main">
        <div class="condition">
          <Row>
            <Col span="4">
            <div style="display:flex;flex-direction:column;margin-left:20px;">
              <div style="width:100px;height:90px;margin-bottom:10px;border:1px dotted #fff;">
                <img :src="'/api/upload?id='+image" v-if="image" style="width:100%;height:100%" />
              </div>
              <Upload action="/api/upload" name="file" :format="['jpg','png','bmp','jpeg']" :on-success="uploadImgSuc" :on-format-error="formatError" :show-upload-list="false">
                <Button type="ghost" icon="ios-cloud-upload-outline">上传照片</Button>
              </Upload>
            </div>
            <!-- <div class="upload">
                                                <Upload action="/api/picture">
                                                  <Button type="ghost" icon="ios-cloud-upload-outline">上传照片</Button>
                                                </Upload>
                                              </div> -->
            </Col>
            <Col span="20">
            <div class="options">
              <div class="line">
                <span class="title">性别</span>
                <Radio-group v-model="condition.sex">
                  <Radio label="all">
                    <span>不限</span>
                  </Radio>
                  <Radio label="man">
                    <span>男</span>
                  </Radio>
                  <Radio label="woman">
                    <span>女</span>
                  </Radio>
                </Radio-group>
              </div>
              <div class="line">
                <span class="title">头部特征</span>
                <Checkbox-group v-model="condition.head">
                  <Checkbox label="hat">
                    <span>戴帽子</span>
                  </Checkbox>
                  <Checkbox label="longHair">
                    <span>长发</span>
                  </Checkbox>
                  <Checkbox label="Sunglasses">
                    <span>墨镜</span>
                  </Checkbox>
                </Checkbox-group>
              </div>
              <div class="line">
                <span class="title">上身特征</span>
                <Checkbox-group v-model="condition.upper">
                  <Checkbox label="longSleeve">
                    <span>长袖</span>
                  </Checkbox>
                  <Checkbox label="shortSleeve">
                    <span>短袖</span>
                  </Checkbox>
                  <Checkbox label="tShirt">
                    <span>T恤</span>
                  </Checkbox>
                  <Checkbox label="logo">
                    <span>衣服有logo</span>
                  </Checkbox>
                  <Checkbox label="stripe">
                    <span>条纹</span>
                  </Checkbox>
                  <Checkbox label="formalWear">
                    <span>正装</span>
                  </Checkbox>
                </Checkbox-group>
              </div>
              <div class="line">
                <span class="title">下身特征</span>
                <Checkbox-group v-model="condition.lower">
                  <Checkbox label="longSleeve">
                    <span>长裤</span>
                  </Checkbox>
                  <Checkbox label="shortSleeve">
                    <span>短裤</span>
                  </Checkbox>
                  <Checkbox label="tShirt">
                    <span>裙子</span>
                  </Checkbox>
                  <Checkbox label="logo">
                    <span>牛仔裤</span>
                  </Checkbox>
                </Checkbox-group>
              </div>
              <div class="line">
                <span class="title">其他</span>
                <Checkbox-group v-model="condition.other">
                  <Checkbox label="bag">
                    <span>带包</span>
                  </Checkbox>
                  <Checkbox label="cycle">
                    <span>骑车</span>
                  </Checkbox>
                </Checkbox-group>
                <Button style="width: 100px;" class="btn" type="ghost">检索</Button>
              </div>
            </div>
            </Col>
          </Row>
        </div>
        <div class="videoBox">
          <video ref="video" :src="videoSrc" controls="controls" @playing="videoPlaying" @pause="videoPause">此浏览器不支持播放视频</video>
        </div>
      </div>
      <div class="content-right">
        <div class="title">搜索结果</div>
        <div class="result">

          <transition-group name="resList" tag="ul" class="list">
            <li class="item" v-for="item of resList" :key="item">
              <div class="date">{{ item.date }}</div>
              <div class="info clearfix">
                <img :src="item.img" class="photo" />
                <ul class="infoList">
                  <li>性别：{{ item.sex }}</li>
                  <li>头部特征：{{ item.head }}</li>
                  <li>上身特征：{{ item.up }}</li>
                  <li>下身特征：{{ item.down }}</li>
                  <li>其他：{{ item.other }}</li>
                </ul>
              </div>
            </li>
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import moment from 'moment'
export default {
  data() {
    return {
      videoSrc: '/static/face/human-structuring.mp4',
      videoList: [
        { fileName: '', path: '', _id: '' }
      ],
      resList: [
      ],
      timeHandle: '',
      condition: {
        sex: 'all',
        head: [],
        upper: [],
        lower: [],
        other: []
      },
      pushIndex: 0,
      uploadProgressBar: 0,
      image: ''
    }
  },
  created() {
    this.getVideoList()
  },
  watch: {
    resList(val) {
      val.length > 5 && val.splice(5, 1)
    }
  },
  methods: {
    videoPause(e) {
      this.mockPush(false)
    },
    videoPlaying(e) {
      this.mockPush(true)
    },
    mockPush(flag) {
      const mockData = {
        sex: ['男', '女'],
        head: ['长发', '短发', '光头'],
        up: ['黑色 正装', '黑色 牛仔', '白色 T恤', '黑色 T恤', '白色 正装'],
        down: ['黑色 正装', '蓝色 牛仔', '白色 长裤', '黑色 短裤', '红色 西装'],
        other: ['背包', '戴表', '', '带帽']
      }
      if (flag) {
        clearInterval(this.timeHandle)
        this.timeHandle = setInterval(() => {
          this.pushIndex++
          this.resList.unshift({
            date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
            img: '/static/face/user' + (this.pushIndex % 10) + '.jpg',
            sex: mockData.sex[this.pushIndex % 2],
            head: mockData.head[this.pushIndex % 3],
            up: mockData.up[this.pushIndex % 5],
            down: mockData.down[this.pushIndex % 5],
            other: mockData.other[this.pushIndex % 4]
          })
        }, 2000)
      } else {
        clearInterval(this.timeHandle)
      }
    },
    videoDbclick(e, url) {
      this.videoSrc = url
      this.$refs.video.play()
    },
    delVideo(e, id) {
      this.$http.delete('/structure/' + id).then(res => {
        this.getVideoList()
      }).catch(err => {
        console.log('delete /structure/' + id + ' error:' + err)
      })
    },
    getVideoList() {
      this.$http.get('/structure/index?type=0').then(res => {
        const initVideoList = [{ fileName: 'human-structuring.mp4', path: '/static/face/human-structuring.mp4', _id: '' }]
        this.videoList = initVideoList.concat(this.$lodash.cloneDeep(res.data))
      }).catch((err) => {
        console.log('get /structure/index?type=0 error:' + err)
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
        this.$Notice.open({ title: '同名文件已存在' })
      }
      return flag
    },
    uploadSuccess(response, file, fileList) {
      this.getVideoList()
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
    uploadImgSuc(response) {
      this.image = response.id
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
    }
  },
  beforeDestroy() {
    clearInterval(this.timeHandle)
  }
}
</script>

<style lang="less" scoped>
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
        cursor: pointer;
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
      box-shadow: 0px -1px 2px #142441 inset;
      cursor: pointer;
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
        right: 10px;
        display: none;
      }
      &:hover {
        background: #363636;
        .del-btn {
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
  height: 200px;
  margin-bottom: 10px;
  background: #1C3053;
  padding: 10px;
  .options {
    .line {
      .title {
        display: inline-block;
        width: 120px;
      }
      .ivu-checkbox-group-item {
        width: 85px;
      }
      .btn {
        float: right;
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
    width: 100%;
    height: 100%;
    .item {
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
            height: 24px;
            line-height: 24px;
          }
        }
      }
    }
  }
}

.resList-enter-active,
.resList-leave-active,
.resList-move {
  transition: all 1s;
  -webkit-transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
  -webkit-transform-style: preserve-3d;
}

.resList-enter,
.resList-leave-active {
  opacity: 0;
  transform: translateX(-30px);
}

.resList-leave {
  opacity: 1;
  transform: translateX(30px);
}
</style>
