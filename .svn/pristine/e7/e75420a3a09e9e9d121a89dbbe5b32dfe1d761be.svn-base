<template>
  <div class="attr-video attr-panel">
    <header>
      <span class="title">门禁信息</span>
    </header>
    <section class="main">
      <ul class="info-list">
        <li v-if="attrInfo.name">
          <span class="label">名称</span>
          <span class="value" :title="attrInfo.name">{{attrInfo.name}}</span>
        </li>
        <li v-if="attrInfo.vendor">
          <span class="label">厂商</span>
          <span class="value" :title="attrInfo.vendor">{{attrInfo.vendor}}</span>
        </li>
        <div v-for="(val, i) in attrInfo.contactsInfo" :key="i">
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
      </ul>
    </section>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AttrInfo from './AttrInfo'
import seatListFun from '../../../panelTools/seatModel/seatListFun'
export default {
  mixins: [AttrInfo, seatListFun],
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters('fengMapPoint', {
      attrInfo: 'getFengMapResourceAttributes'
    })
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
  @import url(./style.less);
  .icon-phone {
    width: 10%;
    font-size: 12px;
    cursor: pointer;
  }
  .phone-down {
    color: red;
  }
</style>
