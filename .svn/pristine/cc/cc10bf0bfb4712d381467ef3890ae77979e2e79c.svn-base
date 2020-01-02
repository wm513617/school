<template>
  <div id="pictureRecord" class="video-pb">
    <div class="left">
      <div class="leftTop" style="height:100%;">
        <div class="input" style="width:100%;padding:10px;">
          <Input v-model="searchVal" icon="ios-search-strong" placeholder="请输入..."></Input>
        </div>
        <div style="height:calc(100% - 52px)">
          <!-- <Organization :options="options" ref="org" :searchVal="searchVal"></Organization> -->
          <Organization :options="options" ref="org" :searchVal="searchVal" :scroll="true" :iconToggle="false"></Organization>
        </div>
      </div>

    </div>
    <div class="center">
      <imageBox ref="imageBox" :filterImgList="filterImgList"></imageBox>
    </div>

    <div class="right">
      <Retrieval tabVal="picture" ref="retrieval" @pictureFilter="pictureFilter"></Retrieval>
    </div>

  </div>
</template>

<script>
import imageBox from './imageBox.vue'
import Organization from 'components/videoMenu/Organization.vue'
import Retrieval from '../Retrieval.vue'
// import {AV_RECORD_LIST} from '../../../../http/video.api.js'

// import { mapState } from 'vuex'
export default {
  name: 'pictureRecord',
  components: {
    Organization,
    Retrieval,
    imageBox
  },
  data() {
    return {
      searchVal: '',
      options: {
        showSearch: false,
        showOpenPreview: false,
        // showFolder: false,
        showOpenAllPreview: false,
        showCollection: false
      },
      filterImgList: 0
    }
  },
  computed: {},
  methods: {
    pictureFilter(param, node) {
      // 接口请求
      // 数据拼接
      // AV_RECORD_LIST()
      this.filterImgList = 150
    }
  },
  beforeDestroy() {
    if (window.CollectGarbage) {
      window.CollectGarbage()
    }
  }
}
</script>

<style scoped>
#pictureRecord {
  font-size: 12px;
  height: 100%;
  width: 100%;
  color: #fffafa;
  /* padding-top: 20px;
  padding-bottom: 20px; */
  /*position: relative;*/
}
#pictureRecord::after {
  display: block;
  content: '';
  clear: both;
}
#pictureRecord > .left {
  /* height: calc(100% - 110px); */
  /* width: 300px; */
  /* margin: 0 12px; */
  position: absolute;
  background: #1b3153;
}
#pictureRecord > .right {
  height: 100%;
  /* width: 300px; */
  float: left;
  /* overflow: auto; */
  /* margin: 0 12px; */
  background: #1b3153;
}
#pictureRecord > .center {
  height: 100%;
  /* width: calc(100% - 648px); */
  float: left;
  /* margin-left: 324px; */
  position: relative;
}
</style>
<style lang="less">
.video-pb {
  padding: 16px 0;
  & > .left {
    width: 272px;
    margin: 0;
    height: calc(~'100% - 104px');
  }
  & > .center {
    width: calc(~'100% - 604px');
    margin-left: calc(~'272px + 16px');
  }
  & > .right {
    width: 300px;
    margin-left: 16px;
  }
}
</style>
