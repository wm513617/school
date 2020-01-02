<template>
  <div class="box">
    <div class='top'>
      <div>
        <span class="iconfont icon-Location"></span>
        {{data.channelName}}
      </div>
      <!-- <div>{{data.dispose? '已处理': '未处理'}}</div> -->
    </div>
    <div class='details-box'>
      <div class="img-box">
        <div class="img-item">
          <img :src="data.smallImageUrl" alt="暂无图片" @error="imgErr($event, 'faceImage')" @click="showDetail()">
        </div>
      </div>
      <div class='details-data'>
        <p>
          <span class="iconfont icon-fenlei"></span>{{type}}
        </p>
        <p>
          <span class="iconfont icon-xingming"></span>{{attr}}
        </p>
        <p>
          <span class="iconfont icon-dispatched"></span>{{data.taskName}}
        </p>
        <p>
          <span class="iconfont icon-shijian"></span>{{$moment.unix($moment(Number(data.captureTime)).unix()).format('YYYY-MM-DD HH:mm:ss')}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import structureEnum from './structureEnum.js'
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  computed: {
    attr() {
      let str = ''
      const type = parseInt(this.data.type)
      if (type === 1 || type === 2 || type === 3) {
        str = structureEnum.SexNameEnum[parseInt(this.data.sexCode)] + ' ' + structureEnum.AgeCodeNameEnum[parseInt(this.data.ageCode)]
      } else {
        str = this.data.plateLicence
      }
      return str
    },
    type() {
      const type = parseInt(this.data.type)
      let str = ''
      if (type === 1) {
        str = '行人'
      } else if (type === 2 || type === 3) {
        str = '两轮车'
      } else if (type === 4 || type === 6 || type === 7 || type === 8) {
        str = '车辆'
      }
      return str
    }
  },
  methods: {
    imgErr(e, str) {
      e.target.src = '/static/noImg1.png'
    },
    showDetail() {
      this.$emit('showDetail')
    }
  }
}
</script>

<style lang="less" scoped>
.img-box {
  border: 1px solid #ddd;
  overflow: hidden;
  height: 114px;
  width: 114px;
  margin-right: 12px;
  position: relative;
  display: flex;
  .img-item {
    height: 112px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &:first-child {
      margin-right: 2px;
    }
    img {
      width: auto;
      height: auto;
      max-width: 89px;
      max-height: 114px;
      cursor: pointer;
    }
  }
}
.top {
  display: flex;
  justify-content: space-between;
  height: 24px;
  line-height: 24px;
}
.details-box {
  display: flex;
  height: 122px;
  padding-top: 8px;
  .details-data {
    display: flex;
    flex: 1;
    flex-direction: column;
    p {
      margin-bottom: 7px;
      span {
        margin-right: 12px;
      }
    }
  }
}
</style>
