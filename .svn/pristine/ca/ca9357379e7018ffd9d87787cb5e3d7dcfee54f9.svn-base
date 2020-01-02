<!--应急预案及单兵列表-->
<template>
  <div class="planAndSingleList" :class="{'show': isShow && isShowEmergencyPanel}" ref="bottomTable">
    <span class='title'>应急预案</span>
    <div class="top-img">
      <div class="img-left">
        <i class="iconfont icon-shrink iconfont-btn" :class="{'disable':leftdisable}" @click="lastImg"></i>
      </div>
      <div class="img-main">
        <img :src="planPhoto" @onerror="errorUrl" v-if="planPhoto"/>
      </div>
      <div class="img-right">
        <i class="iconfont icon-extend iconfont-btn" :class="{'disable': rightdisable}" @click="nextImg"></i>
      </div>
    </div>
    <div class="bottom-table">
      <span>预案执行人</span>
      <Table size="small" :columns="planColums" :data="emergencyList"></Table>
    </div>
    <div class="emtBottomText">
      <Input readonly v-model="remark" type="textarea" :rows="3" :autosize="{minRows: 3, maxRows: 5}" placeholder="请输入文本信息。。。" />
    </div>
    <div v-if="videoModal">
      <Modal width="900px" v-model="videoModal" title="单兵视频" :mask-closable="false" @on-cancel="closeVideo">
        <div class="alarm-video">
          <SinglePawn :id="singleId" ref="closeVideo"></SinglePawn>
        </div>
        <div slot="footer"></div>
      </Modal>
    </div>
    <div v-show="isShowEmergencyPanel" class="btn-panel-shrink" @click="isShow = !isShow">
      <div class="shape">
        <Icon class="icon" :type="isShow ? 'chevron-left' : 'chevron-right'" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import SinglePawn from 'components/video/SinglePawn'
export default {
  components: {
    SinglePawn
  },
  data() {
    return {
      remark: '', // 应急预案文本框
      isShow: true,
      planPhoto: '',
      imgIndex: 0,
      leftdisable: true,
      rightdisable: false,
      sangleHeight: 0,
      videoModal: false,
      singleId: '',
      planColums: [
        {
          title: '序号',
          minWidth: 20,
          align: 'center',
          ellipsis: true,
          type: 'index'
        },
        {
          title: '姓名',
          key: 'name',
          minWidth: 60,
          align: 'center',
          ellipsis: true,
          render: (h, params) => {
            return h('div', [h('strong', params.row.name)])
          }
        },
        {
          title: '职务',
          key: 'position',
          align: 'center',
          minWidth: 60,
          ellipsis: true,
          render: (h, params) => {
            return h('div', [h('strong', params.row.position)])
          }
        },
        {
          title: '电话',
          key: 'phone',
          minWidth: 60,
          align: 'center',
          ellipsis: true,
          render: (h, params) => {
            return h('div', [h('strong', params.row.phone)])
          }
        }
      ],
      sangleColums: [
        {
          title: '序号',
          minWidth: 20,
          align: 'center',
          ellipsis: true,
          type: 'index'
        },
        {
          title: '姓名',
          key: 'name',
          minWidth: 60,
          align: 'center',
          ellipsis: true,
          render: (h, params) => {
            return h('div', [h('strong', params.row.name)])
          }
        },
        {
          title: '电话',
          key: 'phone',
          minWidth: 60,
          align: 'center',
          ellipsis: true,
          render: (h, params) => {
            return h('div', [h('strong', params.row.phone)])
          }
        },
        {
          title: '视频',
          key: 'video',
          align: 'center',
          minWidth: 60,
          ellipsis: true,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'ghost',
                    size: 'small'
                  },
                  on: {
                    click: e => {
                      this.videoModal = true
                      this.singleId = params.row._id
                    }
                  }
                },
                '单兵视频'
              )
            ])
          }
        }
      ],
      emergencyList: []
    }
  },
  watch: {
    /**
     * 根据图片id控制翻页按钮禁用
     * newVal 当前图片在emergencyData里的index
     */
    emergencyData(newVal) {
      if (newVal[0]) {
        this.planPhoto = this.emergencyData[0].planPhoto
        this.emergencyList = this.emergencyData[0].group
        this.remark = this.emergencyData[0].remark
        this.imgIndex = 0
      }
    },
    imgIndex(newVal) {
      if (newVal === 0) {
        this.leftdisable = true
        this.rightdisable = false
      } else if (newVal === this.emergencyData.length - 1) {
        this.leftdisable = false
        this.rightdisable = true
      } else {
        this.leftdisable = false
        this.rightdisable = false
      }
    },
    isShowEmergencyPanel() {
      this.isShow = true
    },
    isShow(val) {
      this.CHANGE_IS_OPEN_LEFT_PANEL(val)
    }
  },
  computed: {
    ...mapGetters(['emergencyData', 'nearestSingleList']),
    ...mapGetters('map3DApplyIX', ['isShowEmergencyPanel'])
  },
  methods: {
    ...mapActions(['emergencyAction']),
    ...mapMutations('map3DApplyIX', ['CHANGE_IS_OPEN_LEFT_PANEL']),
    closeVideo() {
      this.videoModal = false
    },
    /** 应急预案，显示上一张图片 */
    lastImg() {
      if (this.imgIndex !== 0) {
        this.imgIndex = this.imgIndex - 1
        console.log(this.emergencyData, 'this.emergencyData')
        this.planPhoto = this.emergencyData[this.imgIndex].planPhoto
        this.emergencyList = this.emergencyData[this.imgIndex].group
        this.remark = this.emergencyData[this.imgIndex].remark
      }
    },
    /** 应急预案，显示下一张图片 */
    nextImg() {
      if (this.imgIndex !== this.emergencyData.length - 1) {
        this.imgIndex = this.imgIndex + 1
        this.planPhoto = this.emergencyData[this.imgIndex].planPhoto
        this.emergencyList = this.emergencyData[this.imgIndex].group
        this.remark = this.emergencyData[this.imgIndex].remark
      }
    },
    errorUrl(event) {
      let img = event.srcElement
      img.src = '/api/upload?id=' + this.planPhoto
      img.onerror = null
    }
  },
  mounted() {
    /** 表格自适应高度 */
    if (this.$refs.bottomTable) {
      this.sangleHeight = this.$refs.bottomTable.offsetHeight - 710
    }
  }
}
</script>
<style lang="less" scoped>
.planAndSingleList {
  width: 650px;
  height: 100%;
  border: 1px solid #555;
  position: absolute;
  top: 0;
  left: -650px;
  background: rgba(15, 35, 67, 0.8);
  z-index: 99999999999;
  &.show {
    left: 0;
  }
  .title {
    margin-left: 20px;
    font-size: 14px;
  }
  .top-img {
    width: 100%;
    height: 560px;
    text-align: center;
    .img-left {
      display: inline-block;
      height: 560px;
      position: absolute;
      left: 15px;
    }
    .img-main {
      display: inline-block;
      width: 560px;
      height: 100%;
      img {
        vertical-align: bottom;
        width: 560px;
        height: 560px;
        border-radius: 5px;
      }
    }
    .img-right {
      display: inline-block;
      height: 560px;
      position: absolute;
      right: 15px;
    }
    .iconfont {
      color: #fff;
      font-size: 20px;
      position: relative;
      top: 50%;
      cursor: pointer;
      &.active {
        color: rgb(79, 185, 255);
      }
      &.disable {
        color: #666;
      }
    }
  }
  .bottom-table {
    width: 100%;
    margin: 0;
    height: calc(~'100% - 654px');
    padding: 20px 0 0 0;
    overflow-y: auto;
    span {
      margin-left: 20px;
      font-size: 14px;
    }
  }
  .btn-panel-shrink {
    width: 16px;
    height: 86px;
    position: absolute;
    top: 50%;
    right: -16px;
    cursor: pointer;
    overflow: hidden;
    .shape {
      position: absolute;
      right: -16px;
      height: 86px;
      border: 16px solid transparent;
      border-left: 16px solid rgba(15, 35, 67, .8);
    }
    .icon {
      position: absolute;
      right: 5px;
      top: 50%;
      margin-top: -6px;
    }
  }
}
.alarm-video {
  height: 450px;
}
</style>
