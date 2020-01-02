<template>
  <div v-show="false"
       id="md-box"
       :style="{width: windowWidth + 'px',height: windowHeight + 'px'}">
    <div class="inner-box">
      <p class="box-title">新建下载任务<span class="box-close">X</span></p>
      <div class="box-form">
        <div class="save-name">
          <input type="text"
                 placeholder="这里是文件名称">
          <span>名称</span>
        </div>
        <div class="save-path">
          <span class="path-scan">浏览</span>
          <input type="text"
                 placeholder="这里是文件保存路径">
          <span class="path-text">保存路径</span>
        </div>
      </div>
      <div class="ok">确认</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'md-box',
  created() {
    this.resizefun = () => {
      this.windowWidth = window.innerWidth
      this.windowHeight = window.innerHeight
    }
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    }
  },
  mounted() {
    window.addEventListener('resize', this.resizefun)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizefun)
    this.resizefun = null
  }
}
</script>

<style scoped>
#md-box {
  position: relative;
  margin: 0;
  padding: 0;
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .5);
}

#md-box .inner-box {
  width: 374px;
  height: 220px;
  position: absolute;
  top: 50%;
  margin-top: -110px;
  left: 50%;
  margin-left: -187px;
  background-color: #fff;
}

#md-box .inner-box .box-title {
  height: 45px;
  width: 354px;
  font-size: 14px;
  color: #333;
  padding-left: 20px;
  line-height: 45px;
  border-bottom: 1px solid #d1d1d1;
  position: relative;
}

#md-box .inner-box .box-title .box-close {
  cursor: pointer;
  position: absolute;
  top: 50%;
  margin-top: -6px;
  right: 10px;
  width: 12px;
  height: 12px;
  line-height: 12px;
  text-align: center;
  color: #a8a8a8;
}

#md-box .inner-box .box-form {
  width: 100%;
}

#md-box .inner-box .box-form div {
  width: 100%;
  height: 26px !important;
}

#md-box .inner-box .box-form div span,
input {
  float: right;
  box-sizing: border-box;
  height: 26px;
}

#md-box .inner-box .box-form div.save-name {
  margin-top: 20px;
}

#md-box .inner-box .box-form div.save-path {
  margin-top: 16px;
}

#md-box .inner-box .box-form div.save-name input {
  margin-right: 50px;
  margin-left: 10px;
  padding: 0 10px;
  width: 244px;
  font-size: 12px;
  line-height: 24px;
  border: 1px solid #d1d1d1;
  outline: none;
}

#md-box .inner-box .box-form div.save-name span {
  line-height: 26px;
}

#md-box .inner-box .box-form div.save-path .path-scan {
  margin-right: 50px;
  width: 40px;
  border: 1px solid #d1d1d1;
  line-height: 24px;
  text-align: center;
  cursor: pointer;
}

#md-box .inner-box .box-form div.save-path input {
  margin: 0 10px;
  width: 194px;
  padding: 0 10px;
  font-size: 12px;
  line-height: 24px;
  border: 1px solid #d1d1d1;
  outline: none;
}

#md-box .inner-box .box-form div.save-path .path-text {
  line-height: 24px;
}

#md-box .inner-box .ok {
  position: absolute;
  bottom: 30px;
  right: 163px;
  width: 132px;
  height: 34px;
  border-radius: 2px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  line-height: 34px;
  background-color: #20a1ff;
  cursor: pointer;
}
</style>
