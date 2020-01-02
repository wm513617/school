<template>
  <div class="attr-video attr-panel">
    <header>
      <span class="title">楼宇</span>
      <i v-if="!isInfoPanelFixed" class="btn icon iconfont icon-close1" :style="{'font-size': '14px', 'margin-left': '8px'}" title="关闭" @click="hidePanel"></i>
    </header>
    <section class="main">
      <div v-if="buildData.image" class="buildImg">
        <img :src="buildData.image" alt="楼宇图片">
      </div>
      <ul class="info-list">
        <li v-if="buildData.name">
          <span class="label">楼宇名称</span>
          <span class="value" :title="buildData.name">{{buildData.name}}</span>
        </li>
        <li v-if="buildData.grid">
          <span class="label">所属网格</span>
          <span class="value" :title="buildData.grid">{{buildData.grid}}</span>
        </li>
        <div v-for="(val, i) in buildData.contactsInfo" :key="i">
          <li v-if="val.contacts">
            <span class="label">联系人</span>
            <span class="value" :title="val.contacts">{{val.contacts}}</span>
          </li>
          <li v-if="val.telContacts">
            <span class="label">电话</span>
            <span class="value" style="width: 60%" :title="val.telContacts">{{val.telContacts}}</span>
            <Icon class="icon iconfont icon-phone" v-if="val.telContacts" :title="isCall && selectedMobile === val.telContacts ? '挂断电话' : '拨打电话'" @click="querySeatList" :style="{cursor: isCall && selectedMobile !== val.telContacts ? 'not-allowed' : 'pointer'}" :id="val.telContacts" :class="isCall && selectedMobile === val.telContacts ? 'icon-guaduan phone-down':'icon-dianhua'"/>
          </li>
        </div>
        <li v-if="buildData.synopsis">
            <span class="label">简介</span>
            <span class="value" :title="buildData.synopsis">{{buildData.synopsis}}</span>
          </li>
      </ul>
      <div class="storey-list" v-if="buildData.storey.length !== 0">
        <div class="storey-head">
          <span class="head-title">楼层索引</span>
          <span class="head-style"></span>
        </div>
        <div class="storey-body">
          <span class="storey-style" v-for="item in buildData.storey" :key="item._id" :title="item.name" @click="storeySel(item)">{{ item.name }}</span>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import AttrInfo from './AttrInfo'
import seatListFun from '../../../panelTools/seatModel/seatListFun'
export default {
  mixins: [AttrInfo, seatListFun],
  data() {
    return {
      buildData: {
        name: '',
        contacts: '',
        telContacts: '',
        storey: [],
        grid: ''
      }
    }
  },
  computed: {
    ...mapState({
      attrInfo: ({ mapPoint }) => mapPoint.mapResourceAttributes
    })
  },
  watch: {
    attrInfo(val) {
      this.buildDeal(val)
    }
  },
  methods: {
    ...mapActions([
      'getBuildingData',
      'getFoorById',
      'clearAreaFeatures',
      'clearPointFeatures',
      'setCurrentFloor',
      'setIsMapOuter'
    ]),
    buildDeal(data) {
      this.buildData = JSON.parse(JSON.stringify(data))
      // if (data.id === '') { return }
      // if (this.buildData.image) {
      //   this.buildData.image = this.buildData.image
      // }
    },
    storeySel(data) {
      this.getFoorById(data._id).then(suc => {
        if (suc) {
          this.clearAreaFeatures() // 清空区域要素
          this.clearPointFeatures() // 清空点位要素
          this.setCurrentFloor(suc)
          this.setIsMapOuter(false)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created() {
    this.buildDeal(this.attrInfo)
  }
}
</script>
<style lang="less" scoped>
@import url(./style.less);
.storey-list {
  .storey-head {
    height: 30px;
    line-height: 30px;
    position: relative;
    .head-title {
      display: block;
      float: left;
      width: 30%;
    }
    .head-style {
      display: block;
      float: left;
      width: 70%;
      position: absolute;
      right: 0;
      top: 50%;
      border-top: 1px solid #595656;
    }
  }
  .storey-body {
    .storey-style {
      display: inline-block;
      height: 30px;
      line-height: 30px;
      padding: 0 5px;
      width: 30%;
      color: rgb(204, 204, 204);
      cursor: pointer;
    }
  }
}
.title {
  height: 38px;
  line-height: 38px;
  font-size: 14px;
}
.icon-phone {
  width: 10%;
  font-size: 12px;
  cursor: pointer;
}
.phone-down {
  color: red;
}
</style>
