<template>
  <div class="box-choose-panel">
    <div class="point-content">
      <div class="title">
        已选资源
      </div>
      <div class='tabs'>
        <div class='tab' :class="{active: activeTab === 'video'}" @click="activeTab = 'video'">视频</div>
        <div class='tab' :class="{active: activeTab === 'single'}" @click="activeTab = 'single'">单兵</div>
      </div>
      <div class="box-style" v-if="activeTab === 'video'">
        <div class="tools" v-if="pointList.length>0">
          <Button-group>
            <Button icon="arrow-up-c" @click="moveUp('up')" title="上移" :disabled="isChoosing"></Button>
            <Button icon="arrow-down-c" @click="moveDown('down')" title="下移" :disabled="isChoosing"></Button>
            <Button icon="trash-a" @click="deleteOne" title="删除" :disabled="isChoosing"></Button>
          </Button-group>
        </div>
        <ul class="point-list" v-if="pointList.length">
          <li v-for="(item, index) in pointList" :key="item._id" @click="chooseOne(index)" :class="{'active-li':choosingIndex===index}" :title="item.name">
            <i class="iconfont icon-qiangji1"></i>
            <span>{{item.name}}</span>
          </li>
        </ul>
        <p class="notice-msg" v-else>未框选到点位资源</p>
        <div class="bottom-btn">
          <Button size="small" type="text" @click="cancel">取消</Button>
          <Button size="small" type="primary" @click="preview">预览</Button>
        </div>
      </div>
      <div class="box-style" v-if="activeTab === 'single'">
        <div class="tools" v-if="singleList.length>0">
          <Button-group>
            <Button icon="arrow-up-c" @click="moveUp('up')" title="上移" :disabled="isChoosing"></Button>
            <Button icon="arrow-down-c" @click="moveDown('down')" title="下移" :disabled="isChoosing"></Button>
            <Button icon="trash-a" @click="deleteOne" title="删除" :disabled="isChoosing"></Button>
          </Button-group>
        </div>
        <ul class="point-list" v-if="singleList.length">
            <li v-for="(item, index) in singleList" :key="item._id" @click="chooseOne(index)" :class="{'active-li':choosingIndex===index}" :title="item.name">
              <span>{{item.username}}</span>
            </li>
        </ul>
        <p class="notice-msg" v-else>未框选到单兵资源</p>
        <div class="bottom-btn">
          <Button size="small" type="text" @click="cancel">取消</Button>
          <Button size="small" :disabled="singleList.length < 2" type="primary" @click="chat">广播</Button>
        </div>
      </div>
    </div>
    <div v-if="singleList.length > 1 && isToTalk">
      <Broadcast @close="isToTalk = false" :imgList="pawnPhotos" :soliderInfos="singListInfo"></Broadcast>
    </div>
  </div>
</template>

<script>
import Broadcast from 'components/broadcast/Broadcast'
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      choosingIndex: 0,
      isChoosing: false,
      pointList: [],
      singleList: [],
      showPop: false,
      isToTalk: false,
      activeTab: 'video'
    }
  },
  components: {
    Broadcast
  },
  methods: {
    ...mapActions(['set3DActiveDraw', 'setPreviewPointList', 'setSelectSingleList', 'setIsBoxChoosePreview', 'setSelectedEntity', 'setIsBoxChooseClosed']),
    ...mapActions('map3DApplyIX', ['changeToolsPanelToBoxChoose', 'changePointChooseStatus', 'switchToolsPanel']),
    chooseOne(index) {
      this.choosingIndex = index
    },
    deleteOne() {
      if (this.activeTab === 'video') {
        this.pointList.splice(this.choosingIndex, 1)
        this.setPreviewPointList(this.pointList)
      } else {
        this.singleList.splice(this.choosingIndex, 1)
        this.setSelectSingleList(this.singleList)
      }
    },
    moveUp() {
      if (this.activeTab === 'video') {
        if (this.choosingIndex > 0) {
          let chooseingOne = this.pointList.splice(this.choosingIndex, 1)
          this.pointList.splice(this.choosingIndex - 1, 0, chooseingOne[0])
          this.choosingIndex -= 1
          this.setPreviewPointList(this.pointList)
        }
      } else {
        if (this.choosingIndex > 0) {
          let chooseingOne = this.singleList.splice(this.choosingIndex, 1)
          this.singleList.splice(this.choosingIndex - 1, 0, chooseingOne[0])
          this.choosingIndex -= 1
          this.setSelectSingleList(this.singleList)
        }
      }
    },
    moveDown() {
      if (this.activeTab === 'video') {
        if (this.choosingIndex < this.pointList.length - 1) {
          let chooseingOne = this.pointList.splice(this.choosingIndex, 1)
          this.pointList.splice(this.choosingIndex + 1, 0, chooseingOne[0])
          this.choosingIndex += 1
          this.setPreviewPointList(this.pointList)
        }
      } else {
        if (this.choosingIndex < this.singleList.length - 1) {
          let chooseingOne = this.singleList.splice(this.choosingIndex, 1)
          this.singleList.splice(this.choosingIndex + 1, 0, chooseingOne[0])
          this.choosingIndex += 1
          this.setSelectSingleList(this.singleList)
        }
      }
    },

    /**
     * @msg: 预览
     * @param {type}
     * @return:
     */
    preview() {
      // 过滤掉未启用的
      // console.log(this.pointList)
      let openedPointList = this.pointList.filter(item => {
        return !item.eid.hasOwnProperty('deviceStatus') || (item.eid.deviceStatus === 1 && item.status === 1)
      })
      console.log(openedPointList)
      if (openedPointList.length) {
        this.setPreviewPointList(openedPointList)
        this.changePointChooseStatus(false)
        this.setIsBoxChoosePreview(true)
        this.switchToolsPanel(false)
      } else if (!this.pointList.length) {
        this.warningMsg('未框选设备！')
      } else {
        this.warningMsg('当前设备已全部禁用！')
      }
      // this.changeToolsPanelToBoxChoose('')
    },
    chat() {
      this.setSelectSingleList(this.singleList)
      this.changePointChooseStatus(false)
      // this.setIsBoxChoosePreview(true)
      this.switchToolsPanel(false)
      this.isToTalk = true
    },
    cancel() {
      this.setPreviewPointList([])
      this.setSelectSingleList([])
      this.setSelectedEntity({})
      this.set3DActiveDraw(false)
      this.changeToolsPanelToBoxChoose('')
      this.changePointChooseStatus(false)
      this.setIsBoxChooseClosed(true)
      this.switchToolsPanel(false)
    }
  },
  computed: {
    ...mapState({
      selectBoxVideoData: ({ tdPoint }) => tdPoint.selectBoxVideoData,
      selectBoxSingleData: ({ tdPoint }) => tdPoint.selectBoxSingleData,
      previewPointList: ({ tdPoint }) => tdPoint.previewPointList
    }),
    pawnPhotos() {
      const arr = []
      for (let i = 0; i < this.singleList.length; i++) {
        arr.push(this.singleList[i].photo)
      }
      return arr
    },
    singListInfo() {
      const list = []
      for (let i = 0; i < this.singleList.length; i++) {
        list.push({
          name: this.singleList[i].username,
          id: this.singleList[i]._id,
          sn: this.singleList[i].sn,
          org: this.singleList[i].affiliation
        })
      }
      return list
    }
  },
  watch: {
    selectBoxVideoData(val) {
      for (const key in val) {
        const element = val[key]
        for (const key in this.pointList) {
          const item = this.pointList[key]
          if (item._id === element._id) {
            this.pointList.splice(key, 1)
            continue
          }
        }
      }
      let newVal = JSON.parse(JSON.stringify(val))
      this.pointList = [...this.pointList, ...newVal]
    },
    previewPointList(val) {
      this.pointList = JSON.parse(JSON.stringify(this.previewPointList))
    },
    selectBoxSingleData(val) {
      this.singleList = JSON.parse(JSON.stringify(this.selectBoxSingleData))
    }
  },
  mounted() {
    this.setIsBoxChooseClosed(false)
    this.singleList = this.$lodash.clone(this.selectBoxSingleData)
    if (this.previewPointList.length) {
      this.pointList = JSON.parse(JSON.stringify(this.previewPointList))
    } else {
      this.pointList = JSON.parse(JSON.stringify(this.selectBoxVideoData))
    }
  }
}
</script>

<style scoped lang="less">
@textleft: 24px;
@topAndBottom: 12px;
.box-choose-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #1b3153;
  .point-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    .tabs {
      display: flex;
      justify-content: center;
      .tab {
        cursor: pointer;
        width: 20%;
        text-align: center;
        padding: 4px 0;
      }
      .active {
        border-bottom: 1px solid#4699f9;
      }
    }
    .box-style {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .title {
      width: 100%;
      height: 38px;
      line-height: 38px;
      padding: 0 @textleft;
      background: #0f2343;
    }
    ul.point-list {
      padding: 2px @textleft;
      // height: 100%;
      display: flex;
      flex: 1;
      flex-direction: column;
      overflow-y: auto;
      .active-li {
        background: rgb(10, 141, 184);
        color: #1b3153;
      }
      li {
        height: 38px;
        line-height: 38px;
        text-align: left;
        font-size: 14px;
        border-radius: 4px;
        padding: 0 @topAndBottom;
        cursor: pointer;
        .icon-qiangji1 {
          font-size: 14px;
        }
        span {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      li:hover {
        background: lightblue;
        color: #1b3153;
        .icon-qiangji1 {
          font-size: 14px;
        }
      }
    }
    .tools {
      width: 83.5%;
      margin: 8px auto;
      .ivu-poptip-popper {
        min-width: 69px !important;
      }
      .ivu-btn-group {
        width: 100% !important;
      }
      .ivu-btn-group .ivu-btn {
        padding: 0;
        width: 33.3333333%;
        height: 24px;
      }
    }
    .bottom-btn {
      display: flex;
      flex: 0 0 38px;
      background: #1b3153;
      // justify-content: space-evenly;
      padding: 4px 0;
      button {
        display: flex;
        margin: 0 -50px 0 80px;
      }
    }
    .notice-msg {
      margin: 10px auto;
    }
  }
}
</style>
