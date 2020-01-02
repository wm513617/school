<template>
<!-- 查看详情 弹框 -->
  <Modal v-model="isShow" title="报警详情" width="1000" :mask-closable="false" :closable="false">
    <div class="detail-box">
      <div class="detail-left">
        <Form :class="{'long-form': alarmDetail[warningDetail.eventType].length > 14}" label-position="left" :label-width="85" :model="warningDetail">
          <FormItem v-for="(item, index) in alarmDetail[warningDetail.eventType]" :key="index" :label="item.label">
            <span>{{warningDetail[item.value]}}</span>
          </FormItem>
        </Form>
      </div>
      <div class="detail-right">
        <Tabs v-model="tabItem" :animated="false" @on-click="changeTab">
            <TabPane label="报警视频" name="0"></TabPane>
            <TabPane label="报警图片" name="1"></TabPane>
            <TabPane label="应急处理记录" name="2"></TabPane>
            <TabPane label="报警备注" name="3"></TabPane>
        </Tabs>
        <div v-if="tabItem === '0'" class="right-main">
          <Form :label-width="80" style="width: 300px;">
            <FormItem label="选择通道">
              <Select v-model="channel" placement="top" @on-change="channelChange(channel)">
                <Option v-for="item in channelList" :key="item.value" :value="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Form>
          <div class="video">
            <video v-if="warningDetail.eventType === '巡更异常上报'" :src="warningDetail.message.video" height="395" width="568" controls autoplay loop></video>
            <SinglePawn v-else-if="warningDetail.eventType === '单兵一键报警'" :videoParam="singleInfo" style="height: 350px;"></SinglePawn>
            <CountVideo v-else :open="tabItem === '0'" :videoHeight="350"></CountVideo>
          </div>
        </div>
        <div v-if="tabItem === '1'" class="right-picture">
          <div class="imgArea">
            <div style="width: 100%; height: 100%;" v-if="warningDetail.eventType === '违章报警' || warningDetail.eventType === '巡更异常上报'">
              <img style="width: 100%; height:100%;" :src="violationPic || '/static/noImg1.png'">
            </div>
            <div class="img-box" v-else-if="warningDetail.eventType === '人像布控'">
              <img :src="warningDetail.faceImage ? warningDetail.faceImage : '/static/noImg1.png'" alt="暂无图片">
              <img :src="warningDetail.userImage ? warningDetail.userImage : '/static/noImg1.png'" alt="暂无图片">
            </div>
            <div style="width: 100%; height: 100%;" v-else>
              <img style="width: 100%; height:100%;" src="/static/noImg1.png" alt="无报警图片">
            </div>
            <div style="margin-top:12px;">
              <i class="icon iconfont icon-xiazai" title="下载" style="margin-right: 10px;" @click="download"></i>
              <i class="icon iconfont icon-full-screen" title="全屏" @click="fullscreen"></i>
            </div>
          </div>
        </div>
        <div v-if="tabItem === '3'">
          <Form :label-width="80">
            <FormItem label="输入备注：">
              <Input v-model="notes" type="textarea" style="width: 440px" :autosize="{minRows: 6, maxRows: 6}" :maxlength="200"></Input>
              <Button type="primary" style="position:absolute;bottom:0;margin-left:12px;" @click="addRemark">确认</Button>
            </FormItem>
            <FormItem label="备注记录：">
              <div style="width: 440px;height: 400px;overflow-y:auto;padding-left:100px;">
                <Timeline>
                  <TimelineItem v-for="(item, index) in remarks" :key="index">
                    <p class="time">{{$moment(item.time).format('YYYY-MM-DD HH:mm:ss')}}</p>
                    <p class="content">{{item.remark}}</p>
                  </TimelineItem>
                </Timeline>
              </div>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
    <div slot="footer">
      <Button type="primary" @click="$emit('close')">确认</Button>
    </div>
    <!-- 全屏显示图片 -->
    <div v-if="isShowBigImg" class="big-img-box">
      <div class="big-img-mask"></div>
      <div v-if="warningDetail.eventType === '违章报警'" style="width: 100%; height: 100%;">
        <img :src="violationPic" class="bigImg"  @click="isShowBigImg=false" width="100%">
      </div>
      <div v-if="warningDetail.eventType === '巡更异常上报'" style="width: 100%; height: 100%;">
        <img :src="violationPic" class="bigImg"  @click="isShowBigImg=false" height="100%">
      </div>
      <div class="img-box" v-else-if="warningDetail.eventType === '人像布控'" @click="isShowBigImg=false">
        <img :src="warningDetail.faceImage ? warningDetail.faceImage : '/static/noImg1.png'" alt="暂无图片" style="z-index: 1001;">
        <img :src="warningDetail.userImage ? warningDetail.userImage : '/static/noImg1.png'" alt="暂无图片" style="z-index: 1001;">
      </div>
    </div>
  </Modal>
</template>

<script>
import Blob from 'blob'
import { saveAs } from 'assets/js/FileSaver.js'
import CountVideo from './CountVideo'
import SinglePawn from 'components/video/PawnBack'
import alarmDetail from './alarmDetail.json'
import { mapActions, mapMutations } from 'vuex'
export default {
  components: {
    CountVideo,
    SinglePawn
  },
  props: {
    alarmmodal: {
      type: Boolean,
      default: false
    },
    warningDetail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      alarmDetail: alarmDetail,
      isShow: this.alarmmodal,
      warnDealSetList: [],
      warnTypeSetList: [],
      formItem: {
        // 机构
        agency: '',
        // 源名称
        dispositionvalue: '',
        // 级别
        level: '',
        // 报警类型
        alarmType: '',
        // 报警分类
        alarmCategory: '',
        // 报警确认
        alarmSure: 'all',
        // 开始时间
        startTime: '', // new Date(new Date().toLocaleDateString()),
        // 结束时间
        endTime: '',
        // 通道默认值
        defaultChannel: '',
        // 警情处理
        alarmDealName: '',
        // 警情类型
        warnType: ''
      },
      showtimeList: [],
      channel: '',
      channelList: [],
      channelInfoList: [],
      tabItem: '0',
      isShowBigImg: false,
      notes: '',
      remarks: [],
      violationPic: '', // 违章报警的图片
      singleInfo: {} // 单兵一键报警 录像参数
    }
  },
  created() {
    this.GET_WARNIN_CHANNEL(null)
    if (this.warningDetail.action && this.warningDetail.action.length) {
      this.channelInfoList = this.warningDetail.action
      this.warningDetail.action.forEach(item => {
        this.channelList.push({
          label: item.channelName,
          value: item.channelName
        })
        if (item.main) {
          this.channel = item.channelName
        }
      })
      if (!this.channel) {
        this.channel = this.channelList[0].value
      }
      this.channelChange(this.channel)
    }
    if (this.warningDetail.eventType === '违章报警') {
      this.violationPic = this.warningDetail.carImgUrl || this.warningDetail.carImg1Url || this.warningDetail.carImg2Url || this.warningDetail.carNumPic || this.warningDetail.combinedPicUrl
      // this.violationPic = 'https://ss1.baidu.com/9vo3dSag_xI4khGko9WTAnF6hhy/image/h%3D300/sign=a573495ce5f81a4c3932eac9e72a6029/2e2eb9389b504fc27c224b2debdde71190ef6d9d.jpg'
    }
    if (this.warningDetail.eventType === '巡更异常上报') {
      this.violationPic = this.warningDetail.message.photo
    }
    if (this.warningDetail.eventType === '单兵一键报警') {
      this.getSingleInfo({id: this.warningDetail.message.uniqueId}).then(res => {
        this.singleInfo = {
          name: res.data.userName,
          sn: res.data.sn,
          startTime: res.data.time,
          dsId: res.data.storage
        }
      })
    }
  },
  methods: {
    ...mapActions(['getAlarmRemarks', 'putAlarmRemarks', 'getSingleInfo']),
    ...mapMutations(['GET_WARNIN_CHANNEL']),
    fullscreen() {
      if (this.warningDetail.eventType === '违章报警' || this.warningDetail.eventType === '人像布控' || this.warningDetail.eventType === '巡更异常上报') {
        this.isShowBigImg = true
      }
    },
    download() {
      if (this.warningDetail.eventType === '违章报警' || this.warningDetail.eventType === '巡更异常上报') {
        this.downloadImage(this.violationPic)
      } else if (this.warningDetail.eventType === '人像布控') {
        this.downloadImage(this.warningDetail.faceImage, '抓拍图片')
        this.downloadImage(this.warningDetail.userImage, '底库图片')
      }
    },
    downloadImage(imgsrc, name) {
      var image = new Image()
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function() {
        var canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        var context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        // 图片地址转换为 base64
        var url = canvas.toDataURL('image/png')
        // 转换成blob对象
        let bstr = atob(url.split(',')[1]) // eslint-disable-line
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        let blob = new Blob([u8arr], { type: 'image/jpeg;charset = utf-8' })
        saveAs(blob, 'image.jpg')

        /* console.log(url)
        var a = document.createElement('a')
        var event = new MouseEvent('click')
        a.download = name || 'photo'
        a.href = url
        a.dispatchEvent(event) */
      }
      image.src = imgsrc
      /* const filePathGet = imgsrc.substring(1, imgsrc.length)
      this.$http.get(filePathGet).then((response) => {
        console.log(response, 'response')
        var blob = new Blob([response.data], { type: 'image/jpeg;charset = utf-8' })
        saveAs(blob, 'image.jpg')
      }).catch((err) => {
        console.log('pictureDownload error:' + err)
      }) */
    },
    changeTab(val) {
      console.log(this.warningDetail)
      if (val === '3') {
        this.getAlarmRemarks(this.warningDetail._id).then(res => {
          this.remarks = res.data.remarks || []
        })
      }
    },
    // 通道切换
    channelChange(data) {
      if (data) {
        this.channelInfoList.forEach((item, index) => {
          if (data === item.channelName) {
            console.log(item)
            this.GET_WARNIN_CHANNEL(item)
          }
        })
      }
    },
    /* 添加备注 */
    addRemark() {
      if (!this.notes.trim()) {
        this.warningMsg('请输入备注内容')
        return
      }
      let arr = [...this.remarks]
      arr.unshift({time: Date.now(), remark: this.notes})
      const params = {
        id: this.warningDetail._id,
        body: arr
      }
      this.putAlarmRemarks(params).then(res => {
        this.remarks = [...arr]
        this.notes = ''
      }).catch(err => {
        console.log(err)
        this.warningMsg('添加备注信息失败')
      })
    }
  }
}
</script>

<style scoped lang='less'>
.modalMessage {
  min-width: 100%;
  line-height: 100%;
  padding: 0 10px;
  height: 636px;
}
.overFlowStyle {
  overflow: auto;
}
.modalMessage .left>ul li {
  margin-bottom: 10px;
}

.modalMessage i {
  float: left;
  width: 60px;
  margin-right: 20px;
}
.yesmessage {
  width: 340px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.yesmessage b {
  float: left;
  width: 60px;
  margin-right: 20px;
}
.novideo {
  width: 400px;
  height: 300px;
  margin-bottom: 10px;
  border: 1px solid #5d5d5d;
  line-height: 300px;
  text-align: center;
  position: absolute;
  left: 24px;
}

.imgArea {
  width: 100%;
  height: 400px;
  border: 1px solid #5d5d5d;
  display: inline-block;
  a {
    color: #fff;
  }
}

.detail-box {
  display: flex;
}
.detail-left {
  width: 370px;
  min-height: 600px;
  border-right: 1px solid #0f2343;
}
.detail-right {
  flex: 1;
  margin-top: -24px;
  // overflow: hidden;
}
.ivu-form-item {
  margin-bottom: 10px;
}
.long-form .ivu-form-item {
  margin-bottom: 0;
}
.video {
  margin-left: 18px;
  margin-top: 50px;
  overflow: hidden;
}
.right-picture {
  width: 100%;
  height: 100%;
  padding: 24px 0 24px 22px;
}
.iconfont {
  font-size: 20px;
  cursor: pointer;
}
.time{
    font-size: 12px;
    position: absolute;
    left: -85px;
    width: 80px;
    line-height: 1.5;
    white-space: wrap;
}
.content{
    padding-left: 5px;
    word-break: break-all;
}
.big-img-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.big-img-mask {
  background: #000813;
  opacity: 0.7;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}
.bigImg {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1, 1);
  opacity: 1;
  z-index: 1001;
}
.img-box {
  overflow: hidden;
  height: 100%;
  width: 100%;
  display: flex;
  img {
    height: 100%;
    width: 50%;
    display: flex;
    flex: 1;
  }
}
</style>
