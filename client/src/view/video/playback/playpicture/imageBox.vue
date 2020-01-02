<template>
  <div class="imageBox">
    <p>共检索到：{{filterImgList}}张图片</p>
    <div class="images image-box" id="" ref="imageBox">
      <ul>
        <li v-for="(i, n) in picList" :style="{height:height + 'px'}" :key="n">
          <div class="top">
            <Checkbox v-model="i.checked">{{i.time}}</Checkbox>
            <span style="float:right">类型：{{i.type}}</span>
          </div>
          <div class="img">
            <img :src="i.src" alt="" v-if="i.src">
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'

export default {
  components: {
  },
  props: {
    filterImgList: {
      default: 0
    }
  },
  data() {
    return {
      width: 0,
      height: 0,
      single: false,
      num: 30,
      picList: [],
      addflag: false,
      n: 1,
      max: 0
    }
  },
  computed: {
  },
  watch: {
    filterImgList() {
      // console.log(132)
      // this.max = this.filterImgList < this.n * 20 ? this.filterImgList : this.n * 20
      // for (let i = this.picList.length; i < this.max; i++) {
      //   this.picList.push({
      //     type: '移动侦测',
      //     checked: false,
      //     time: '2017.08.08 09.48',
      //     src: `/static/picFilter/pic (${Math.floor(Math.random() * 20) + 1}).jpg`
      //     // src: img[i % 16]
      //   })
      // }
      // this.n ++
      // this.addflag = true
    }
  },
  methods: {
  },
  created() {
  },
  mounted() {
    for (let i = 0; i <= 15; i++) {
      this.picList.push({
        type: '',
        checked: false,
        time: '',
        src: ''
      })
    }
    const box = document.querySelector('.image-box')
    // const box = this.trfs.imageBox
    this.width = box.offsetWidth / 4 - 15
    this.height = box.offsetHeight / 4 - 12
    this.resizefun = () => {
      this.width = box.offsetWidth / 4 - 15
      this.height = box.offsetHeight / 4 - 12
    }
    window.addEventListener('resize', this.resizefun)

    var _this = this
    $('.image-box').scroll(function() {
      const viewH = $(this).height() // 可见高度
      const contentH = $(this).get(0).scrollHeight // 内容高度
      const scrollTop = $(this).scrollTop() // 滚动高度
      if (scrollTop / (contentH - viewH) >= 0.98) { // 到达底部时,加载新内容
        // _this.num += 20
        if (_this.addflag && _this.max < _this.filterImgList) {
          _this.max = _this.filterImgList < _this.n * 20 ? _this.filterImgList : _this.n * 20
          console.log(_this.max)
          for (let i = _this.picList.length; i < _this.max; i++) {
            _this.picList.push({
              type: '移动侦测',
              checked: false,
              time: '2017.08.08 09.48',
              src: `##`
            })
          }
          _this.n++
        }
      }
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizefun)
    this.resizefun = null
  }
}
</script>
<style scoped>
.imageBox {
  width: 100%;
  height: 100%;
}
.imageBox > p {
  line-height: 30px;
  background: #0f2343;
  padding-left: 20px;
}
.imageBox > .images {
  width: 100%;
  height: calc(100% - 30px);
  /*border: 1px solid #e4e4e4;*/
  overflow: auto;
  background: #1b3153;
}
.imageBox > .images ul:after {
  display: black;
  content: "";
  clear: both;
}
.imageBox > .images ul li {
  float: left;
  margin: 0.5%;
  width: 24%;
  border: 1px solid #5676a9;
}
.imageBox > .images ul li .top {
  height: 29px;
  border-bottom: 1px solid #5676a9;
  line-height: 28px;
  padding: 0 5px;
}
.imageBox > .images ul li .img {
  height: calc(100% - 30px);
  overflow: hidden;
}
.imageBox > .images ul li .img img {
  width: 100%;
}
</style>
