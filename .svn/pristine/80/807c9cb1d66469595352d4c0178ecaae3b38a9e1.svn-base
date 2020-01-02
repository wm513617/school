<template>
  <div :class="{ 'transversely': !compare, 'compare': compare }">
    <div class="similarity">{{data.similarity}}</div>
    <div class="type" :class="{ 'blackType': black, 'whiteType': white, 'staffType': staff, 'visitorType': visitor, 'VIPType': VIP, 'deployType': deploy }">{{data.type}}</div>
    <div class="cont contrast">
      <div class="head clearfix">
        <span class="left">{{ data.device }}</span>
      </div>
      <div class="imageWarp">
        <img :src="data.capture" @error="imgErr" />
        <div class="foot">
          <span>{{ data.captureTime }}</span>
        </div>
      </div>
    </div>
    <div class="cont contrast">
      <div class="head clearfix">
        <span class="left">入库样本</span>
      </div>
      <div class="imageWarp">
        <img :src="data.picture" @error="imgErr" />
        <div class="foot">
          <span>{{ data.name + ' ' + data.gender + ' ' + data.age}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*
props:{
  data: {
    similarity: '', // 相似度
    type: '', // 类型黑白名单等
    device: '', // 那个镜头拍下的
    capture: '', // 实时抓拍的照片
    captureTime: '', // 识别的时间
    picture: '', // 底库照片
    name: '', // 姓名
    gender: '', // 性别
    age: '' // 年龄
  }
} */

export default {
  props: {
    data: {
      type: Object
    },
    compare: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    imgErr(e) {
      e.target.src = '/static/noImg1.png'
    }
  },
  data() {
    return {
      black: false,
      white: false,
      staff: false,
      visitor: false,
      VIP: false,
      deploy: false
    }
  },
  watch: {
    'data.type'(newValue) {
      this.black = false
      this.white = false
      this.staff = false
      this.visitor = false
      this.VIP = false
      this.deploy = false
      switch (newValue) {
        case '黑名单':
          this.black = true
          break
        case '白名单':
          this.white = true
          break
        case 'VIP':
          this.VIP = true
          break
        case '员工':
          this.staff = true
          break
        case '访客':
          this.visitor = true
          break
        case '布控':
          this.deploy = true
          break
      }
    }
  },
  created() {
    // 校验data参数
    this.data.similarity = this.data.similarity || ''
    this.data.type = this.data.type || ''
    this.data.device = this.data.device || ''
    this.data.capture = this.data.capture || ''
    this.data.captureTime = this.data.captureTime || ''
    this.data.picture = this.data.picture || ''
    this.data.name = this.data.name || ''
    this.data.gender = this.data.gender || ''
    this.data.age = this.data.age || ''
    switch (this.data.type) {
      case '黑名单':
        this.black = true
        break
      case '白名单':
        this.white = true
        break
      case 'VIP':
        this.VIP = true
        break
      case '员工':
        this.staff = true
        break
      case '访客':
        this.visitor = true
        break
      case '布控':
        this.deploy = true
        break
    }
  }
}
</script>

<style lang="less" scoped>
.clearfix:after {
  content: '.';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.transversely {
  width: 100%;
  position: relative;
  display: flex;
  padding: 5px 0;
  min-height: 186px;
  border-bottom: 1px solid #263e69;
  box-shadow: 0px -1px 2px #142441 inset;
  .type {
    color: #fff;
    position: absolute;
    top: 10px;
    right: 0;
    width: 24px;
    text-align: center;
    font-size: 14px;
    z-index: 99;
  }
  .blackType {
    background: #192032;
    border: 2px solid #192032;
  }
  .whiteType {
    background: #83cb71;
    border: 2px solid #2ee500;
  }
  .staffType {
    background: #3fb1e3;
    border: 2px solid #00b1ff;
  }
  .visitorType {
    background: #e5c65a;
    border: 2px solid #ffc600;
  }
  .VIPType {
    background: #6c00fe;
    border: 2px solid #6c00fe;
  }
  .deployType {
    background: #dd702e;
    border: 2px solid #dd702e;
  }
  .similarity {
    position: absolute;
    top: 55%;
    left: 50%;
    margin-left: -40px;
    margin-top: -25px;
    width: 80px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border: 2px solid #fd6600;
    background: rgba(255, 255, 255, 0.2);
    z-index: 99;
    border-radius: ~'40px/25px';
    font-size: 18px;
    font-weight: normal;
    color: #fd6600;
  }
  .cont {
    float: left;
    width: 50%;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .contrast {
    color: #fff;
    padding: 0 5px;
    .head {
      width: 100%;
      height: 24px;
      line-height: 24px;
      padding: 0 10px;
      overflow: hidden;

      .left {
        float: left;
      }
      .right {
        float: right;
      }
    }
    .imageWarp {
      width: 100%;
      height: 0;
      flex: 1;
      position: relative;
      img {
        position: absolute;
        width: 100%;
        height: 100%;
      }
      .foot {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        span {
          display: block;
          height: 26px;
          line-height: 26px;
          padding-left: 10px;
        }
      }
    }
  }
}

.compare {
  position: relative;
  width: 100%;
  height: auto;
  padding-left: 10px;
  .similarity {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -40px;
    margin-top: -25px;
    width: 80px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border: 2px solid #fd6600;
    background: rgba(255, 255, 255, 0.2);
    z-index: 99;
    border-radius: ~'40px/25px';
    font-size: 18px;
    font-weight: normal;
    color: #fd6600;
  }
  .type {
    color: #fff;
    position: absolute;
    top: 10px;
    right: 0;
    width: 24px;
    text-align: center;
    font-size: 14px;
    z-index: 99;
  }
  .blackType {
    background: #192032;
    border: 2px solid #192032;
  }
  .whiteType {
    background: #83cb71;
    border: 2px solid #2ee500;
  }
  .staffType {
    background: #3fb1e3;
    border: 2px solid #00b1ff;
  }
  .visitorType {
    background: #e5c65a;
    border: 2px solid #ffc600;
  }
  .VIPType {
    background: #6c00fe;
    border: 2px solid #6c00fe;
  }
  .deployType {
    background: #dd702e;
    border: 2px solid #dd702e;
  }
  .contrast {
    width: 100%;
    color: #fff;
    .head {
      height: 40px;
      line-height: 40px;
      width: 100%;
      background: #244575;
      padding: 0 10px;
      overflow: hidden;
      .left {
        float: left;
      }
      .right {
        float: right;
      }
    }
    .imageWarp {
      width: 100%;
      height: 0;
      padding-bottom: 80%;
      position: relative;
      img {
        position: absolute;
        width: 100%;
        height: 100%;
      }
      .foot {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        span {
          display: block;
          height: 26px;
          line-height: 26px;
          padding-left: 10px;
        }
      }
    }
  }
  .contrast:last-child {
    padding-top: 30px;
  }
}
</style>
