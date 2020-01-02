<template>
  <div class="attr-video attr-panel">
    <header>
      <span class="title">辅助模型</span>
    </header>
    <section class="main">
      <ul class="info-list">
        <li v-if="attrInfo.name">
          <span class="label">名称</span>
          <span class="value" :title="attrInfo.name">{{attrInfo.name}}</span>
        </li>
        <li v-if="attrInfo.number">
          <span class="label">编号</span>
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
