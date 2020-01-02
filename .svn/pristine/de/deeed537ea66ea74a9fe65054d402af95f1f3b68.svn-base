<template>
  <div :class="['base-image', picInfo.isdefense?'active':'']">
    <!-- 条件检索 | 以图搜图 单个检索结果图片显示 -->
    <div class="picture-info clearfix">
      <span :title="picInfo.resName"><i class="iconfont icon-Location"></i> {{picInfo.resName}}</span>
    </div>
    <div class="images clearfix">
      <div class="sing-img">
        <div class="bg-cover">
          <i class="ivu-icon ivu-icon-ios-personadd-outline" style="font-size: 23px;" @click="showAddpage = true" title="人员入库"></i>
          <i class="iconfont icon-icon-test" title="以图搜图" @click="imgSearch"></i>
          <i class="iconfont icon-guijichaxun1" title="轨迹追踪" @click="toTrackRoute" style="line-height: 24px；"></i>
        </div>
        <div class="image-box">
          <img :src="picInfo.faceImage?picInfo.faceImage:'/static/noImg1.png'" @click="showDetail = true" draggable="false" alt="无图片" @error="imgErr" :style="{width:isErr?'134px': 'auto',height:isErr?'167.5px':'auto'}"/>
        </div>
        <span v-if="type === 'image'" class="similar-num">{{picInfo.similar}}%</span>
        <div>{{$moment.unix(picInfo.time).format('YYYY-MM-DD HH:mm:ss')}}</div>
    </div>
    </div>
    <AlarmModal v-if="showDetail" :show="showDetail" @close="showDetail = false" type="passer" :picInfo="picInfo"></AlarmModal>
    <Passer v-if="showAddpage" :show="showAddpage" @close="showAddpage = false" :imageUrl="picInfo.faceImage"></Passer>
  </div>
</template>
<script>
import AlarmModal from '../alarmsearch/AlarmModal.vue'
import Passer from './AddPasser'
import { mapMutations } from 'vuex'
export default {
  components: { AlarmModal, Passer },
  data() {
    return {
      showDetail: false,
      showAddpage: false,
      isErr: false
    }
  },
  props: {
    type: {
      type: String, // search 条件检索 | image 以图搜图
      default: 'search'
    },
    picInfo: {
      type: Object
    }
  },
  methods: {
    ...mapMutations(['SET_IMAGE_URL', 'SET_TRACK_TMG_SER']),
    imgErr(e) {
      e.target.src = '/static/noImg1.png'
      this.isErr = true
    },
    imgSearch() {
      this.$router.replace('/veriface/PasserSearch/searchpic')
      this.SET_IMAGE_URL(this.picInfo.faceImage)
    },
    toTrackRoute() {
      this.$router.replace('/veriface/Track')
      this.SET_TRACK_TMG_SER(this.picInfo.faceImage + '-passer-tag')
    }
  }
}
</script>
<style scoped>
.base-image {
  background-color: rgba(15, 35, 67, 0.3);
  width: 158px;
  min-height: 186px;
  padding: 6px 12px;
  user-select: none;
  margin: 4px;
}
.base-image.active {
  border: 1px solid #fd6600;
}
.picture-info > span {
  float: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.images {
  position: relative;
  text-align: center;
  height: calc(100% - 30px);
}
.images .sing-img {
  width: 100%;
  float: left;
  height: 100%;
}
.images .sing-img .image-box {
  width: 134px;
  height: 167.5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.images .bg-cover {
  position: absolute;
  background-color: rgba(102, 102, 102, 0.4);
  width: 100%;
  height: 24px;
}
.bg-cover i {
  float: right;
  margin-right: 3px;
  cursor: pointer;
}
.images .sing-img img {
  display: inline-block;
  cursor: pointer;
  width: auto;
  height: auto;
  max-width: 134px;
  max-height: 167.5px;
  background-color: #1b3153;
}
.similar-num {
  position: absolute;
  bottom: 15px;
  right: 40px;
  background: url('../../../../static/similarity.png') no-repeat;
  font-size: 14px;
  font-weight: 400;
  font-style: normal;
  background-size: 100%;
  width: 50px;
  height: 16px;
}
.clearfix:after {
  content: '.';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
</style>
