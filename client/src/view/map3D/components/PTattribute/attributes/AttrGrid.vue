<template>
  <div class="attr-video attr-panel">
    <header>
      <span class="title">网格信息</span>
    </header>
    <section class="main">
      <ul class="info-list">
        <li v-if="attrInfo.name">
          <span class="label">网格名称</span>
          <span class="value" :title="attrInfo.name">{{attrInfo.name}}</span>
        </li>
        <li v-if="attrInfo.number">
          <span class="label">网格编号</span>
          <span class="value" :title="attrInfo.number">{{attrInfo.number}}</span>
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
        <li v-if="attrInfo.synopsis">
          <span class="label">简介</span>
          <span class="value" :title="attrInfo.synopsis">{{attrInfo.synopsis}}</span>
        </li>
      </ul>
    </section>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('map3DApplyIX', ['attrInfo'])
  }
}
</script>
<style lang="less" scoped>
@import url(./style.less);
</style>
