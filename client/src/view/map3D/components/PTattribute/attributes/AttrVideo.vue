<template>
  <div class="attr-video attr-panel">
    <header>
      <span class="title">视频点位</span>
      <Icon class="btn" type="ios-videocam" :class="attrInfo.isOnline ? 'online' : 'offline'"
        @click.native="attrInfo.isOnline && openPointVideo()">
      </Icon>
      <i class="btn icon iconfont icon-shougongbaojing1" :style="{cursor: showVideo ? 'not-allowed' : 'pointer', marginRight: '10px', 'font-size': '22px'}" @click="openManualVideo"></i>
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
            <span class="value" :title="val.telContacts">{{val.telContacts}}</span>
          </li>
        </div>
      </ul>
    </section>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapGetters('map3DApplyIX', ['attrInfo']),
    ...mapState({
      showVideo: ({ alarmThreeD }) => alarmThreeD.showVideo
    })
  },
  methods: {
    ...mapActions(['updateVideoDragList']),
    ...mapMutations(['CHANGE_SHOWVIDEO', 'SAVE_ITEM_ALARM_INPUT', 'GET_ALARM_MODAL_TYPE']),
    openManualVideo() {
      if (this.showVideo) { return }
      const info = {
        time: Date.now() / 1000,
        organization: this.attrInfo.videoInfo.eid.name || '',
        name: this.attrInfo.name,
        level: 1,
        eventTypeName: '手工报警',
        actionList: this.attrInfo.videoInfo,
        isNameDisabled: true,
        alarmaffirm: {
          handaffirm: {
            status: false
          },
          handaffirm2: {
            status: true
          }
        }
      }
      this.CHANGE_SHOWVIDEO(true)
      this.GET_ALARM_MODAL_TYPE('ManualAlarm')
      this.SAVE_ITEM_ALARM_INPUT(info)
    },
    openPointVideo() {
      let theVideoInfo = this.attrInfo.videoInfo
      let eid = theVideoInfo.eid
      if (eid && (!eid.hasOwnProperty('deviceStatus') || eid.deviceStatus)) { // 设备启用
        this.updateVideoDragList(theVideoInfo)
      } else {
        this.warningMsg('该设备已禁用！')
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import url(./style.less);
.online {
  color: green;
}
.offline {
  color: gray;
  cursor: no-drop !important;
}
</style>
