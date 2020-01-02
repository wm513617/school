<template>
  <div v-if="show">
    <!-- 结构化详情 -->
    <div class='alarm-modal-mask'></div>
    <div class='alarm-wrap'>
      <div class='ivu-modal'>
        <div class='ivu-modal-content'>
          <div class='ivu-modal-header'>
            <div class='ivu-modal-header-inner'>结构化详情<i class="iconfont icon-close1" @click="$emit('close')"></i></div>
          </div>
          <div class='ivu-modal-body over'>
            <div v-if="zoomImg" class="cartogram">
              <i class="iconfont icon-narrow" @click="zoomImg=''"></i>
              <ImgZoom :imgSrc="zoomImg?zoomImg:'/static/noImg1.png'" :width="723" :height="530"></ImgZoom>
            </div>
            <div v-else class="cartogram">
              <ul class="tab-header clearfix">
                <li :class="{active: isInfo}" @click="showItem(1)">详情信息</li>
                <li :class="{active: !isInfo}" @click="showItem(2)">过程录像</li>
              </ul>
              <div v-show="isInfo" class="alarm-info">
                <div>
                  <div class="tabs-title">
                    <i class="iconfont icon-Location"></i>
                    <div class="tabs-channel-name" :title="info.channelName"> {{info.channelName}}</div>
                    <div class="icons-info">
                      <i class="iconfont icon-enlarge" @click="changeImage($event, info.smallImageUrl)"></i>
                      <i class="iconfont icon-icon-test" title="以图搜图" @click="toRoute"></i>
                    </div>
                  </div>
                  <div class="images clearfix" style="width:203px">
                    <div class="image-box">
                      <img class="sing-img" :src="info.smallImageUrl?info.smallImageUrl:'/static/noImg1.png'" @error="imgErr" draggable="false" alt="无图片" style="width:auto;height:auto"/>
                    </div>
                  </div>
                </div>
                <div class="large-img">
                  <div class="tabs-title">全景图</div>
                  <span v-if="!info.hasOwnProperty('bigImageUrl')" style="display: block;width: 409px;">未配置全景图</span>
                  <div v-else class="bg-cover">
                    <i class="iconfont icon-enlarge" :style="{width:!IsErrorImg?'100%':'201px'}" @click="changeImage($event, info.bigImageUrl)"></i>
                    <div class="full-image-box">
                      <div v-if="videoStructuredParam.isStartDrawBox && isDraw" class="canvas-box" :style="tipBox"></div>
                      <img id="full-image-img" :src="info.bigImageUrl?info.bigImageUrl:'/static/noImg1.png'" draggable="false" alt="无图片" @error="fullImgErr" style="width:auto;height:auto;"/>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="isInfo && info.taskName" class="control-name">
                <span>布控名称：</span>
                <span>{{info.taskName}}</span>
              </div>
              <div v-show="isInfo" class="table-list" :style="tableBorder">
                <div  class="table-item" v-for="(item, index) in tableColumns" :key="index" :style="{width:item.width ? item.width : '85px'}">
                  <span class="item-th">{{item.label}}</span>
                  <span class="item-td">{{item.value}}</span>
                </div>
              </div>
              <div v-show="!isInfo" class="person-video" style="width: 740px;height: 493px">
                <div class="person-title"><i class="iconfont icon-Location"></i> {{info.channelName}}</div>
                <div class="video-back">
                  <FaceBack ref="back-plugin" :defaultPane="1" :configuration="{progressBar: true, timeline: false, buttos: ['stopAll', 'onTheWall']}"></FaceBack>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ImgZoom from 'components/ImgZoom'
import { mapState, mapActions } from 'vuex'
import structureEnum from './structureEnum.js'
import FaceBack from 'components/videoComponentsNew/playbackPlugin'
export default {
  components: { FaceBack, ImgZoom },
  data() {
    return {
      isInfo: true,
      zoomImg: '',
      backParam: {},
      IsErrorImg: false,
      carType: {
        carKindCode: {
          name: '车辆类型',
          transform: structureEnum.CarKindNameEnum,
          width: '170px'
        },
        carStyleName: {
          name: '品牌-型号-年款', // family-brand-style
          width: '255px'
        },
        plateLicence: {
          name: '车辆号牌'
        },
        plateTypeCode: {
          name: '号牌类型',
          transform: structureEnum.PlateTypeNameEnum,
          width: '170px'
        },
        plateFlagCode: {
          name: '车牌标识',
          transform: structureEnum.PlateFlagNameEnum
        },
        plateColorCode: {
          name: '号牌颜色',
          transform: structureEnum.PlateColorNameEnum
        },
        colorCode: {
          name: '车辆颜色',
          transform: structureEnum.CarColorNameEnum
        },
        coDriverPersonCode: {
          name: '副驾乘客',
          transform: structureEnum.NormalNameEnum
        },
        callCode: {
          name: '打电话',
          transform: structureEnum.YesOrNoNameEnum
        },
        rackCode: {
          name: '行李架',
          transform: structureEnum.NormalNameEnum
        },
        spareTireCode: {
          name: '备胎',
          transform: structureEnum.NormalNameEnum
        },
        sunroofCode: {
          name: '天窗',
          transform: structureEnum.NormalNameEnum
        },
        dangerCode: {
          name: '危化品',
          transform: structureEnum.YesOrNoNameEnum
        },
        mainDriverBeltCode: {
          name: '主安全带',
          transform: structureEnum.YesOrNoNameEnum
        },
        coDriverBeltCode: {
          name: '副安全带',
          transform: structureEnum.YesOrNoNameEnum
        },
        crashCode: {
          name: '撞损',
          transform: structureEnum.YesOrNoNameEnum
        },
        slagCode: {
          name: '渣土车',
          transform: structureEnum.YesOrNoNameEnum
        },
        tagNum: {
          name: '年检标'
        },
        paperCode: {
          name: '纸巾盒',
          transform: structureEnum.NormalNameEnum
        },
        sunCode: {
          name: '遮阳板',
          transform: structureEnum.NormalNameEnum
        },
        dropCode: {
          name: '吊坠',
          transform: structureEnum.NormalNameEnum
        }
      },
      isPedestrain: {
        name: '骑车人',
        transform: structureEnum.PedestrainNameEnum
      },
      personType: {
        sexCode: {
          name: '性别',
          transform: structureEnum.SexNameEnum
        },
        ageCode: {
          name: '年龄',
          transform: structureEnum.AgeCodeNameEnum
        },
        orientationCode: {
          name: '朝向',
          transform: structureEnum.OrientationNameEnum
        },
        umbrellaCode: {
          name: '打伞',
          transform: structureEnum.UmbrellaNameEnum
        },
        hairCode: {
          name: '发型',
          transform: structureEnum.HairNameEnum
        },
        hatCode: {
          name: '帽子',
          transform: structureEnum.HatNameEnum
        },
        knapsackCode: {
          name: '背包',
          transform: structureEnum.KnapsackNameEnum
        },
        bagCode: {
          name: '拎物',
          transform: structureEnum.BagNameEnum
        },
        maskCode: {
          name: '口罩',
          transform: structureEnum.NormalNameEnum
        },
        glassesCode: {
          name: '眼镜',
          transform: structureEnum.NormalNameEnum
        },
        trolleyCaseCode: {
          name: '拉杆箱',
          transform: structureEnum.NormalNameEnum
        },
        barrowCode: {
          name: '手推车',
          transform: structureEnum.NormalNameEnum
        },
        babyCode: {
          name: '抱小孩',
          transform: structureEnum.BabyCodeNameEnum
        },
        upperTextureCode: {
          name: '上装纹理',
          transform: structureEnum.UpperTextureNameEnum
        },
        upperTypeCode: {
          name: '上装款式',
          transform: structureEnum.UpperTypeNameEnum
        },
        bottomTypeCode: {
          name: '下装款式',
          transform: structureEnum.BottomTypeNameEnum
        },
        upperColorCode: {
          name: '上装颜色',
          transform: structureEnum.UpperColorNameEnum
        },
        bottomColorCode: {
          name: '下装颜色',
          transform: structureEnum.BottomColorNameEnum
        }
      },
      commonType: {
        captureTime: {
          name: '时间',
          width: '170px'
        },
        type: {
          name: '分类',
          transform: structureEnum.TypeNameEnum
        }
      },
      threeType: {
        convertibleCode: {
          name: '带篷',
          transform: structureEnum.NormalNameEnum
        },
        mannedCode: {
          name: '载人',
          transform: structureEnum.NormalNameEnum
        }
      },
      tipBox: {
        width: 0,
        height: 0,
        left: 0,
        top: 0
      },
      isDraw: false
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object
    }
  },
  mounted() {
    this.escFn = e => {
      if (e.which === 27 || e.keyCode === 27) {
        this.zoomImg = ''
      }
    }
    document.addEventListener('keydown', this.escFn, false)
    this.$nextTick(() => {
      if (this.videoStructuredParam.isStartDrawBox) {
        const ele = this.$el.querySelector('#full-image-img')
        if (ele) {
          ele.onload = () => {
            this.drawRect(ele)
          }
        }
      }
    })
    this.getVideoStructuredParam()
    console.log(this.info)
  },
  computed: {
    ...mapState({
      videoStructuredParam: ({videoStructuredSetting}) => videoStructuredSetting.videoStructuredParam
    }),
    sex() {
      let sex = '男'
      if (Number(this.info.gender) === 1) {
        sex = '女'
      }
      return sex
    },
    tableColumns() {
      const clm = []
      let keyType
      const type = parseInt(this.info.type)
      if (type === 1) {
        keyType = {
          ...this.commonType,
          ...this.personType
        }
      } else if (type === 2 || type === 3) {
        keyType = {
          ...this.commonType,
          isPedestrain: this.isPedestrain,
          ...this.personType
        }
      } else if (type === 5) {
        keyType = {
          ...this.commonType,
          ...this.threeType
        }
      } else {
        keyType = {
          ...this.commonType,
          ...this.carType
        }
      }
      for (const i in keyType) {
        if (this.info.hasOwnProperty(i)) {
          let value
          if (keyType[i].transform) {
            value = keyType[i].transform[parseInt(this.info[i])]
          } else {
            if (i === 'tagNum') {
              value = Number(this.info[i]) === 9 ? '未识别' : Number(this.info[i])
            } else {
              value = i !== 'captureTime' ? this.info[i] : this.$moment.unix(this.$moment(Number(this.info[i])).unix()).format('YYYY-MM-DD HH:mm:ss')
            }
          }
          value && clm.push({
            label: keyType[i].name,
            value: value,
            width: keyType[i].width
          })
        }
      }
      return clm
    },
    tableBorder() {
      if (parseInt(this.info.type) === 5) {
        return {
          borderLeft: '1px solid rgb(36,69,117)'
        }
      } else {
        return {
          border: '1px solid rgb(36,69,117)'
        }
      }
    }
  },
  methods: {
    ...mapActions('videoStructuredSetting', ['getVideoStructuredParam']),
    ...mapActions('videoStructuredImageSearch', ['setImageUrl']),
    ...mapActions(['getStructResourceInfo']),
    showItem(val) {
      if (val === 1) {
        this.isInfo = true
      } else {
        // 录像回放
        this.isInfo = false
        if (this.info.resourceId) {
          this.getStructResourceInfo(this.info.resourceId).then((res) => {
            this.backParam = {
              devIp: res.eid && res.eid.ip,
              devPort: res.eid && Number(res.eid.cport),
              name: res.name,
              channel: Number(res.chan),
              eventType: ['all'],
              startTime: parseInt(parseInt(this.info.captureTime) / 1000) - 10,
              endTime: parseInt(parseInt(this.info.captureTime) / 1000) + 10,
              streamType: res.stream || 'all',
              occurrenceTime: parseInt(this.info.captureTime) / 1000,
              resId: res._id
            }
            this.$nextTick(() => {
              this.$refs['back-plugin'].openPlayback([{ ...this.backParam }])
            })
          }).catch(err => {
            console.log('get resource err', err)
          })
        } else {
          console.log('no resourceId')
        }
      }
    },
    changeImage(e, img) {
      if (!img) {
        this.warningMsg('图片不存在！')
      }
      this.zoomImg = img
    },
    toRoute() {
      this.$router.replace('/structure/imageSearch')
      this.setImageUrl(this.info.smallImageUrl)
      this.$emit('close')
    },
    imgErr(e) {
      e.target.src = '/static/noImg1.png'
    },
    fullImgErr(e) {
      this.IsErrorImg = true
      e.target.src = '/static/noImg1.png'
    },
    getImgNaturalDimensions(img) {
      let nWidth, nHeight
      var pat = /noImg1.png$/
      if (!img.src.match(pat)) {
        if (img.naturalWidth) {
          nWidth = img.naturalWidth
          nHeight = img.naturalHeight
        } else {
          let image = new Image()
          image.src = img.src
          image.onload = () => {
            nWidth = img.width
            nHeight = img.height
          }
        }
      }
      return {
        w: nWidth,
        h: nHeight
      }
    },
    drawRect(ele) {
      if (this.info && this.info.bodyRect) {
        let imgInfo
        const rect = this.info.bodyRect.split(',')
        if (this.info.bigImageWidth && this.info.bigImageHeight) {
          imgInfo = {
            w: this.info.bigImageWidth,
            h: this.info.bigImageHeight
          }
        } else {
          imgInfo = this.getImgNaturalDimensions(ele)
        }
        if (imgInfo.w && imgInfo.h) {
          this.tipBox = {
            width: ele.width * rect[2] / imgInfo.w + 'px',
            height: ele.height * rect[3] / imgInfo.h + 'px',
            left: ele.width * rect[0] / imgInfo.w + 'px',
            top: ele.height * rect[1] / imgInfo.h + 'px'
          }
          this.isDraw = true
        } else {
          console.log('no size')
          this.isDraw = false
        }
      } else {
        console.log('no size')
        this.isDraw = false
      }
    }
  },
  beforeDestroy() {
    this.zoomImg = ''
    document.onkeydown = null
  }
}
</script>
<style scoped>
.alarm-wrap {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
.alarm-modal-mask {
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
  cursor: pointer;
}
.ivu-modal-body {
  padding: 0;
}
.tabs-title {
  padding: 4px;
  width: 160px;
  display: flex;
}
.large-img .tabs-title {
  width: 100%;
}
.tabs-title > img {
  width: auto;
  height: auto;
  background: #0f2343;
}
.large-img {
  margin-left: 16px;
}
.large-img .bg-cover {
  position: relative;
}
.images .bg-cover .iconfont,
.large-img .bg-cover .iconfont {
  cursor: pointer;
}
.large-img .icon-enlarge {
  position: absolute;
  color: #fff;
  width: 100%;
  text-align: right;
  background-color: rgba(102, 102, 102, 0.3);
  z-index: 3;
}
.large-img img {
  background: #0f2243;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 450px;
}
.alarm-info {
  display: flex;
  padding: 16px 24px;
  align-items: flex-start;
}

.person-video {
  height: 530px;
  width: 732px;
}
.alarm-info .images {
  display: flex;
}
.alarm-info .images .bg-cover {
  position: absolute;
  background-color: rgba(102, 102, 102, 0.3);
  width: 114px;
  height: 24px;
}
.alarm-info .images i {
  position: absolute;
  left: 94px;
  top: 0;
  color: #fff;
}
.alarm-info .images .icon-enlarge + .icon-icon-test {
  left: 70px;
}
.alarm-info .images .to-back-color.icon-enlarge {
  left: 5px;
  width: calc(100% - 5px);
  height: 24px;
  background-color: rgba(102, 102, 102, 0.3);
  text-align: right;
}
.image-box {
  width:150px;
  height:200px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
.two-image-box {
  width:114px;
  height:152px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.full-image-box {
  width: 431px;
  height: 245px;
  position: relative;
}
.full-image-box .canvas-box {
  border:1px solid red;
  position: absolute;
}
.full-image-box img {
  width: auto;
  height: auto;
  max-width: 431px;
  max-height: 245px;
  background-color: #1b3153;
}
.alarm-info .images .sing-img {
  display: inline-block;
  cursor: pointer;
  width: auto;
  height: auto;
  max-width: 150px;
  max-height: 200px;
  background-color: #1b3153;
}
.alarm-info .images .two-image-box .sing-img {
  display: inline-block;
  cursor: pointer;
  width: auto;
  height: auto;
  max-width: 114px;
  max-height: 152px;
  background-color: #1b3153;
}
.alarm-info .infos {
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  padding-left: 10px;
}
.alarm-info .infos i {
  font-style: normal;
  display: inline-block;
  width: 75px;
}
.alarm-info .infos .infos-item {
  margin-bottom: 16px;
}
.cartogram {
  width: 100%;
  height: calc(100% - 152px);
}
.tab-header {
  width: 100%;
  list-style: none;
  outline: none;
  background: #0f2243;
}
.tab-header li {
  height: 38px;
  float: left;
  padding: 0 24px;
  line-height: 38px;
  font-size: 14px;
  border-top: 2px solid #0f2343;
  outline: none;
  cursor: pointer;
  color: #8c8e98;
}
.tab-header .active {
  color: #fff;
  border-top: 2px solid #0f2243;
  background: #1c3054;
}
.clearfix:after {
  content: '.';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.person-title {
  padding: 15px;
}
.video-back {
  height: calc(100% - 73px);
  padding: 0 15px;
}
.icon-narrow {
  position: absolute;
  right: 5px;
  z-index: 10;
  cursor: pointer;
}
.control-name {
  padding: 5px 24px;
}
.table-list {
  display: flex;
  margin: 5px 24px 24px 24px;
  flex-wrap: wrap;
  width: 682px;
}
.table-list .table-item {
  white-space: nowrap;
  overflow: hidden;
  background-color: #244575;
  display: flex;
  flex-direction: column;
}
.table-list .table-item .item-th,
.table-list .table-item .item-td {
  padding: 0 18px;
  height: 32px;
  line-height: 32px;
  text-align: center;
}

.table-list .table-item .item-th {
  background: #244575;
  font-weight: 700;
}
.table-list .table-item .item-td {
  background: #1b3153;
  border: 1px solid #244575;
  border-left: 0;
}
</style>
<style lang="less" scoped>
.tabs-title .icons-info {
  display: inline;
  cursor: pointer;
}
.tabs-title .tabs-channel-name {
  line-height: 24px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: ~'calc(100% - 57px)';
}
</style>
