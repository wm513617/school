<template>
  <div :style="imgStyle" class="imageBox">
    <div style="width: 100%;height: 100%;position: relative">
      <img :src="url" alt="" v-if="!isPreview_" style="height: 100%;">
      <span class="imageScan" @click="previewFuc">
         <i class="icon iconfont icon-enlarge" style="cursor: pointer"></i>
      </span>
    </div>
    <!--  预览图片的弹窗大小由调用组件者决定，外部盒子设置position: relative-->

    <!--    <bs-cover :value="isPreview">-->
    <!--    -->
    <!--    </bs-cover>-->
    <div class="previewBox" v-show="isPreview_" :class="{BodyShow:!isBodyShow}">
      <!--<div class="previewImg" ref="imgParentRef">-->
        <!--<img :src="url" alt="" :style="previewSize" ref="imgRef">-->
        <!--<span class="closeScreen" @click="closePreviewFuc">-->
          <!--<i class="icon iconfont icon-exit-full-screen" style="cursor: pointer;color:rgba(0,0,0,.5)"></i>-->
         <!--</span>-->
      <!--</div>-->
      <i class="iconfont icon-narrow" @click="backImg" style="top:25px;right:25px;position: absolute;z-index: 2"></i>
      <ImgZoom :imgSrc="url" :width="855" :height="350"></ImgZoom>
    </div>
    <!--    <iframe class="bs-cover-frame" v-if="isPreview"></iframe>-->
  </div>

</template>

<script>
import ImgZoom from '../../../../components/ImgZoom'
export default {
  name: 'picturePreview',
  components: {
    ImgZoom
  },
  props: {
    imgStyle: {
      type: Object,
      default: {
        width: '120px',
        height: '180px'
      }
    },
    url: {
      type: String,
      default: ''
    },
    isBodyShow: { // 是否在全屏显示，默认在body 中显示，如果想在特定容器内显示，设为false,并且容器position=reslative;
      type: Boolean,
      default: true
    }
    // isPreview: { // 是否在全屏显示，默认在body 中显示，如果想在特定容器内显示，设为false,并且容器position=reslative;
    //   type: Boolean,
    //   default: false
    // }
  },
  data() {
    return {
      isPreview: false,
      previewSize: {
        height: '',
        width: '',
        // transform:'translate(0,0)',
        transform: 'scale(1)'
      },
      scaleNum: 1,
      translateX: '',
      translateY: '',
      imgRefElement: Object,
      imgParentRefElement: Object
    }
  },
  computed: {
    isPreview_: function() {
      return this.isPreview
    }
  },
  methods: {
    backImg() {
      //        this.url= '';
      this.isPreview = false
      this.$emit('preview_x', true)
    },
    // 点击进入预览格式
    previewFuc() {
      this.$emit('preview_x', false)
      this.isPreview = true
    },
    // 点击退出预览格式
    closePreviewFuc() {
      this.isPreview = false
      this.$emit('preview', true)
      this.imgParentRefElement.removeEventListener('mousewheel', this.changeImgSizeFuc)
      this.imgParentRefElement.removeEventListener('DOMMouseScroll', this.changeImgSizeFuc)
    }

  },
  destroyed() {
    // if( this.imgParentRefElement){
    //   this.imgParentRefElement.removeEventListener('mousewheel', this.changeImgSizeFuc);
    //   this.imgParentRefElement.removeEventListener('DOMMouseScroll', this.changeImgSizeFuc);
    // }

  }
}
</script>

<style scoped>
  .imageBox {
    border: 1px solid #ddd;
  }

  .imageBox img {
    width: 100%;
    height: auto;
  }

  .imageScan {
    position: absolute;
    top: 10px;
    right: 10px;
    display: block;
  }

  .previewBox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0,1);
  }

  .BodyShow {
    position: absolute !important;
  }

  .previewImg {
    width: 100%;
    height: 100%;
    margin: auto;
    background: #fff;
    position: relative;
    overflow: hidden;
  }

  .closeScreen {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }

  .previewImg img {
    width: 100%;
    height: auto;
  }
</style>
