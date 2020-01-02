<template>
  <div v-if="show">
    <!-- 过车详情 -->
    <div class='vehicle-modal-mask'></div>
    <div class='vehicle-wrap'>
      <div class='ivu-modal'>
        <div class='ivu-modal-content'>
          <div class='ivu-modal-header'>
            <div class='ivu-modal-header-inner'>{{ title }}<i class="iconfont icon-close1" @click="$emit('close')"></i></div>
          </div>
          <div class='ivu-modal-body over'>
            <div class="modal-img lf">
              <img class="item-bg" :src="picInfo.faceImage ? picInfo.faceImage : '/static/noImg1.png'" @error="imgErr" alt="无图片">
              <!-- <span class="prev" @click="PrevPng"><i class="iconfont icon-jiantou-copy"></i></span>
              <span class="next" @click="NextPng"><i class="iconfont icon-jiantou"></i></span>
              <span class="tips">{{imgIndex + 1}}/{{imgArr.length}}个图片</span> -->
            </div>
            <div class="madal-info lf">
              <div><span class="span-lable">车牌号码：</span><span class="span-info">{{ picInfo.plateInfo }}</span></div>
              <div><span class="span-lable">卡口：</span><span class="span-info">{{ picInfo.resName }}</span></div>
              <div><span class="span-lable">过车时间：</span><span class="span-info">{{ $moment.unix(picInfo.time).format('YYYY-MM-DD HH:mm:ss') }}</span></div>
              <div><span class="span-lable">过车速度：</span><span class="span-info">{{ picInfo.vehicleSpeed }}Km/h</span></div>
              <div><span class="span-lable">限制速度：</span><span class="span-info">{{ picInfo.limitSpeed }}Km/h</span></div>
              <div><span class="span-lable">车型：</span><span class="span-info">{{ vehicleTypeObj[picInfo.vehicleType > 7?1:picInfo.vehicleType] }}</span></div>
              <div><span class="span-lable">车辆品牌：</span><span class="span-info">{{ plateTypeObj[picInfo.plateType] }}</span></div>
              <div><span class="span-lable">车身颜色：</span><span class="span-info">{{ vehicleColorObj[picInfo.vehicleColor] }}</span></div>
              <!-- <div><span class="span-lable">车主姓名：</span><span class="span-info">耿啸</span></div>
              <div><span class="span-lable">手机号码：</span><span class="span-info">18335298523</span></div>
              <div><span class="span-lable">车辆属性：</span><span class="span-info">未登记</span></div>
              <div><span class="span-lable">车辆状态：</span><span class="span-info">正常</span></div>
              <div><span class="span-lable">单位：</span><span class="span-info">品园六楼东南侧</span></div>
              <div><span class="span-lable">备注：</span><span class="span-info">品园六楼东南侧</span></div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      modal: true,
      title: '过车详情',
      vehicleTypeObj: {},
      plateTypeObj: {},
      vehicleColorObj: {}
    }
  },
  props: { // 父组件传入的数据
    picInfo: {
      type: Object
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.GetIntellTraRecordConstant()
  },
  methods: {
    ...mapActions(['getIntellTraRecordConstant']),
    formatTime(time) {
      var datetime = new Date(time)
      // 获取年月日时分秒值  slice(-2)过滤掉大于10日期前面的0
      var year = datetime.getFullYear()
      var month = ('0' + (datetime.getMonth() + 1)).slice(-2)
      var date = ('0' + datetime.getDate()).slice(-2)
      var hour = ('0' + datetime.getHours()).slice(-2)
      var minute = ('0' + datetime.getMinutes()).slice(-2)
      var second = ('0' + datetime.getSeconds()).slice(-2)
      // 拼接
      var result = `${year}-${month}-${date} ${hour}:${minute}:${second}`
      // 返回
      return result
    },
    // 获取常量信息
    GetIntellTraRecordConstant() {
      this.getIntellTraRecordConstant().then(res => {
        let response = res.data
        this.vehicleTypeObj = response.vehicleType
        this.plateTypeObj = response.plateType
        this.vehicleColorObj = response.vehicleColor
      }).catch(err => {
        console.log('获取常量信息出错', err)
      })
    },
    imgErr(e) {
      e.target.src = '/static/noImg1.png'
    },
    cancel() {
      let modalData = JSON.parse(JSON.stringify(this.picInfo))
      modalData.trackType = '0'
      this.$emit('changeShowModel', modalData)
    }
  }
}
</script>

<style scoped>
  .lf {
    float: left;
  }
  .vehicle-wrap {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
  .vehicle-modal-mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #000813;
    opacity: 0.7;
    height: 100%;
    z-index: 999;
  }
  .ivu-modal {
    position: absolute;
    left: calc(50% - 410px);
    top: calc(50% - 345px);
  }
  .ivu-modal-header-inner i {
    float: right;
    color: #fff;
    font-size: 16px;
    width: 20px;
    height: 20px;
    display: inline-block;
    cursor: pointer;
  }
  .ivu-modal-content {
    border-radius: 8px;
    background-color: #1b3153;
  }
  .ivu-modal-body {
    padding: 24px 22px;
    overflow: hidden;
  }
  .clearfix:after {
    content: '';
    display: block;
    vertical-align: middle;
    clear: both;
  }
</style>
<style lang="less" scoped>
  .modal-img {
    width: 550px;
    height: 550px;
    position: relative;
    img {
      width: 100%;
      // height: 100%;
    }
    .next {
      position: absolute;
      top: 50%;
      right: 0;
      width: 50px;
      height: 50px;
      margin-top: -25px;
      background-color: rgba(225, 235, 236, 0.5);
      border-radius: 10px 0 0 10px;
      text-align: center;
      line-height: 50px;
      cursor: pointer;
    }
    .prev {
      position: absolute;
      top: 50%;
      left: 0;
      width: 50px;
      height: 50px;
      margin-top: -25px;
      background-color: rgba(225, 235, 236, 0.5);
      border-radius: 0 10px 10px 0;
      text-align: center;
      line-height: 50px;
      cursor: pointer;
    }
    .tips {
      position: absolute;
      left: 5%;
      bottom: 5%;
      display: block;
      padding: 5px 8px;
      background-color: rgba(0, 0, 0, .5);
      font-size: 14px;
    }
  }
  .madal-info {
    font-size: 14px;
    div {
      margin-bottom: 20px;
      .span-lable {
        width: 100px;
        text-align: right;
        display: inline-block;
      }
      .span-info {
        display: inline-block;
        width: 200px;
      }
    }
  }
  .ivu-modal-footer {
    display: none;
  }
</style>
