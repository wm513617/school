<template>
  <div class="base-image">
    <!-- 报警检索 —— 显示对比图片 -->
    <div class="picture-info clearfix">
			<span :title="picInfo.resName"><i class="iconfont icon-Location"></i> {{picInfo.resName}}</span>
			<i class="iconfont icon-guijichaxun1" title="轨迹追踪" @click="toRoute('/veriface/Track', 'track')"></i>
			<i class="iconfont icon-icon-test" title="以图搜图" @click="toRoute('/veriface/PasserSearch/searchpic', 'picture')" style="margin-right:4px;"></i>
		</div>
		<div class="images clearfix">
			<i>{{picInfo.similar}}%</i>
			<div class="sing-img">
        <div class="image-box">
				  <img :src="picInfo.faceImage?picInfo.faceImage:'/static/noImg1.png'" @click="showDetail = true" style="cursor:pointer;" :style="{width:isErrL?'134px': 'auto',height:isErrL?'167.5px':'auto'}" draggable="false" @error="imgErr($event, 'L')"/>
        </div>
				<span class="pic-time">{{$moment.unix(picInfo.time).format('YYYY-MM-DD HH:mm:ss')}}</span>
			</div>
			<div class="sing-img clearfix" style="margin-left: 2px;">
        <div class="image-box">
				  <img :src="picInfo.userImage?picInfo.userImage:'/static/noImg1.png'" draggable="false" @error="imgErr($event, 'R')" :style="{width:isErrR?'134px': 'auto',height:isErrR?'167.5px':'auto'}"/>
        </div>
				<span class="base-name">{{picInfo.userName}}</span>
				<span class="baserary">{{picInfo.groupName}}</span>
			</div>
		</div>
		<AlarmModal v-if="showDetail" :show="showDetail" @close="showDetail = false" :picInfo="picInfo"></AlarmModal>
  </div>
</template>
<script>
import AlarmModal from './AlarmModal.vue'
import { mapMutations } from 'vuex'
export default {
  components: { AlarmModal },
  data() {
    return {
      showDetail: false,
      isErrL: false,
      isErrR: false
    }
  },
  props: {
    picInfo: {
      type: Object
    }
  },
  methods: {
    ...mapMutations(['SET_IMAGE_URL', 'SET_TRACK_TMG_SER']),
    imgErr(e, l) {
      e.target.src = '/static/noImg1.png'
      if (l === 'L') {
        this.isErrL = true
      } else {
        this.isErrR = true
      }
    },
    toRoute(route, type) {
      this.$router.replace(route)
      if (type === 'track') {
        this.SET_TRACK_TMG_SER(this.picInfo.userImage)
      }
      if (type === 'picture') {
        this.SET_IMAGE_URL(this.picInfo.faceImage)
      }
    }
  }
}
</script>
<style scoped>
.base-image {
  background-color: rgba(15, 35, 67, 0.3);
  padding: 6px 12px;
  user-select: none;
  margin: 4px;
}
.picture-info > span {
  float: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 220px;
}
.picture-info > i {
  float: right;
}
.images {
  position: relative;
  text-align: center;
}
.images i {
  position: absolute;
  bottom: 17px;
  left: 50%;
  margin-left: -22px;
  width: 43px;
  height: 17px;
  text-align: center;
  background: url('../../../../static/similarity.png') no-repeat;
  z-index: 1;
  font-size: 14px;
  font-weight: 400;
  font-style: normal;
  background-size: 43px 17px;
}
.images .sing-img {
  width: 134px;
  float: left;
  height: 100%;
  text-align: left;
}
.images .sing-img .image-box {
  width: 134px;
  height: 167.5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.images .sing-img img {
  display: inline-block;
  width: auto;
  height: auto;
  max-width: 134px;
  max-height: 167.5px;
  background-color: #1b3153;
}
.images .sing-img .pic-time {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  float: left;
}
.images .sing-img .base-name {
  float: left;
}
.images .sing-img .baserary {
  float: right;
}
.clearfix:after {
  content: '.';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
</style>
