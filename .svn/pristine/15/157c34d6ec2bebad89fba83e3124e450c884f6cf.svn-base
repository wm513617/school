<template>
  <div class="attr-video attr-panel">
    <header>
      <span class="title">楼层</span>
    </header>
    <section class="main">
      <ul class="info-list">
        <li v-if="floorData.name">
          <span class="label">当前楼层</span>
          <span class="value" :title="floorData.name">{{floorData.name}}</span>
        </li>
        <li v-if="floorData.bName">
          <span class="label">所属楼宇</span>
          <span class="value" :title="floorData.bName">{{floorData.bName}}</span>
        </li>
        <div v-for="(val, i) in attrInfo.contactsInfo" :key="i">
          <li v-if="val.contacts">
            <span class="label">联系人</span>
            <span class="value" :title="val.contacts">{{val.contacts}}</span>
          </li>
          <li v-if="val.telContacts">
            <span class="label">电话</span>
            <span class="value" :title="val.telContacts">{{val.telContacts}}</span>
          </li>
        </div>
      </ul>
      <div class="storey-list" v-if="floorData.storey.length !== 0">
        <div class="storey-head">
          <span class="head-title">楼层切换</span>
          <span class="head-style"></span>
        </div>
        <div class="storey-body">
          <span class="storey-style" v-for="item in floorData.storey" :key="item._id" :title="item.name" @click="storeySel(item)">{{ item.name }}</span>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      floorData: {
        name: '',
        bName: '',
        contacts: '',
        telContacts: '',
        storey: []
      }
    }
  },
  computed: {
    ...mapGetters('map3DApplyIX', ['attrInfo'])
  },
  watch: {
    attrInfo(val) {
      this.floorDeal(val)
    }
  },
  methods: {
    ...mapActions([
      'getAllFloorsById',
      'getOneFloor',
      'setIsOuter'
    ]),
    floorDeal(data) {
      this.floorData = JSON.parse(JSON.stringify(data))
      if (data.bid) {
        this.getAllFloorsById(data.bid).then(suc => {
          this.floorData.storey = suc.storey
        }).catch(err => {
          console.log(err)
        })
      }
    },
    storeySel(data) {
      this.getOneFloor(data._id).then(suc => {
        if (suc) {
          this.setIsOuter(false)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created() {
    this.floorDeal(this.attrInfo)
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
</style>
