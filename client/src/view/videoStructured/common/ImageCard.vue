<template>
  <div class="image-card">
    <!-- 综合查询 | 报警检索 | 以图搜图 | 结构化追踪单个检索结果图片显示 -->
    <div class="picture-info clearfix">
      <Checkbox v-model="manageInfo.checked" v-if="isTrackPage && targetType === 'clue'" style="float:left" @on-change="select"></Checkbox>
      <span :title="manageInfo.channelName"><i class="iconfont icon-Location"></i> {{ manageInfo.channelName }}</span>
      <div class="option-btn">
        <i v-if="isTrackPage && targetType === 'objtive'" class="iconfont icon-shoucang1" :style="{color: collectStatus ? 'yellow' : '#fff'}" title="收藏" @click="collect"></i>
        <i v-if="isTrackPage && targetType === 'clue'" class="iconfont icon-close1" title="删除" @click="remove"></i>
      </div>
    </div>
    <div class="images clearfix">
      <div class="sing-img">
        <div class="image-box">
          <img :src="manageInfo.smallImageUrl?manageInfo.smallImageUrl:`/static/noImg1.png`" @click="showDetail = true" :draggable="false" alt="无图片" @error="imgErr" :style="{ width: isErr ? '134px' : 'auto', height: isErr ? '167.5px' : 'auto' }"/>
          <span v-if="$route.path === '/structure/imageSearch' || isTrackPage" class="similar-num">{{info.score}}%</span>
        </div>
        <div class="bg-cover" v-if="!isTrackPage">
          <i class="iconfont icon-guijichaxun1" @click="toRoute('/structure/structuredTrack')" title="结构化追踪" ></i>
          <i class="iconfont icon-icon-test" title="以图搜图" @click="toRoute('/structure/imageSearch')"
          ></i>
        </div>
        <div>{{ manageInfo.captureTime }}</div>
        <div v-if="showType === 'SA'" style="padding: 0 10px;">
          <span class="sex-span">{{ manageInfo.sexCode }}</span
          ><span class="age-span">{{ manageInfo.ageCode }}</span>
        </div>
        <div v-if="showType === 'PC'" style="padding: 0 10px;" class="clearfix">
          <span class="sex-span">{{ manageInfo.plateLicence }}</span
          ><span class="age-span">{{ manageInfo.colorCode }}</span>
        </div>
      </div>
    </div>
    <StructInfo v-if="showDetail" :show="showDetail" @close="showDetail = false" type="passer" :info="info"></StructInfo>
  </div>
</template>
<script>
import StructInfo from './StructInfo'
import { mapActions } from 'vuex'
import structureEnum from './structureEnum.js'
export default {
  components: { StructInfo },
  data() {
    return {
      showDetail: false,
      isErr: false,
      keyName: {
        captureTime: {
          name: '时间'
        },
        type: {
          name: '分类',
          transform: structureEnum.TypeNameEnum
        },
        channelName: {
          name: '通道名称'
        },
        plateLicence: {
          name: '车辆号牌'
        },
        colorCode: {
          name: '车辆颜色',
          transform: structureEnum.CarColorNameEnum
        },
        sexCode: {
          name: '性别',
          transform: structureEnum.SexNameEnum
        },
        ageCode: {
          name: '年龄',
          transform: structureEnum.AgeCodeNameEnum
        }
      },
      collectStatus: false
    }
  },
  props: {
    isTrackPage: {
      type: Boolean, // true  综合查询 | 报警检索 | 以图搜图, false 结构化追踪
      default: false
    },
    targetType: {
      // isTrackPage为false: 1-8 对应 行人-自行车-摩托车-轿车-三轮车-大客车-面包车-卡车;
      // isTrackPage为true: clue 结构化线索 | objtive 结构化目标
      type: String,
      default: '1'
    },
    info: {
      type: Object
    }
  },
  computed: {
    showType() {
      let type = ''
      if (!this.isTrackPage) {
        const num = Number(this.info.type)
        if (num === 1 || num === 2 || num === 3) { // 行人-自行车-摩托车
          type = 'SA' // sex + age
        }
        if (num === 4 || num === 6 || num === 7 || num === 8) {
          type = 'PC' // plateNum + color
        }
      }
      return type
    },
    manageInfo() {
      const data = JSON.parse(JSON.stringify(this.info))
      for (const i in this.keyName) {
        if (this.info.hasOwnProperty(i)) {
          let value
          if (this.keyName[i] && this.keyName[i].transform) {
            value = this.keyName[i].transform[parseInt(this.info[i])]
          } else {
            value = i !== 'captureTime' ? this.info[i] : this.$moment.unix(this.$moment(Number(this.info[i])).unix()).format('YYYY-MM-DD HH:mm:ss')
          }
          data[i] = value
        }
      }
      return data
    }
  },
  watch: {
    'info.collect': {
      handler(val) {
        if (this.isTrackPage && this.targetType === 'objtive') {
          this.collectStatus = this.info.collect
        }
      },
      deep: true
    }
  },
  mounted() {
    if (this.isTrackPage && this.targetType === 'objtive') {
      this.collectStatus = this.info.collect
    }
  },
  methods: {
    ...mapActions('videoStructuredImageSearch', ['setUploadImageUrl', 'setImageUrl']),
    imgErr(e) {
      e.target.src = '/static/noImg1.png'
      this.isErr = true
    },
    toRoute(route) {
      if (this.$route.path !== route) {
        this.$router.replace(route)
      }
      if (route === '/structure/imageSearch') {
        this.setImageUrl(this.manageInfo.smallImageUrl)
      } else {
        this.setUploadImageUrl(this.manageInfo.smallImageUrl)
      }
    },
    collect() {
      this.collectStatus = !this.collectStatus
      const data = JSON.parse(JSON.stringify(this.info))
      data.collect = this.collectStatus
      this.$emit('collect', data)
    },
    remove() {
      this.$emit('remove', this.info)
    },
    select() {
      const data = JSON.parse(JSON.stringify(this.info))
      data.checked = this.manageInfo.checked
      this.$emit('select', data)
    }
  }
}
</script>
<style scoped>
.image-card {
  background-color: rgba(15, 35, 67, 0.3);
  width: 158px;
  min-height: 186px;
  padding: 6px 12px;
  user-select: none;
  margin: 4px;
  position: relative;
}

.picture-info > span {
  float: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: calc(100% - 26px);
}
.option-btn {
  float: right;
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
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
  position: relative;
}
.images .bg-cover:hover,
.images .sing-img .image-box:hover + .bg-cover{
  display: block;
}
.images .bg-cover {
  position: absolute;
  top: 0;
  background-color: rgba(102, 102, 102, 0.4);
  width: 100%;
  height: 24px;
  z-index: 2;
  display: none;
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
.sex-span {
  float: left;
}
.age-span {
  float: right;
}
.similar-num {
  position: absolute;
  bottom: -1px;
  right: 24px;
  background: url('../../../../static/similarity.png') no-repeat;
  font-size: 14px;
  font-weight: 400;
  font-style: normal;
  background-size: 100%;
  width: 82px;
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
