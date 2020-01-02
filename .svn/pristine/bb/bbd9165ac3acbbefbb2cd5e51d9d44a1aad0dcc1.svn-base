<template>
  <div class="attr-video attr-panel">
    <header>
      <span class="title">视频点位</span>
      <i v-if="!isInfoPanelFixed" class="btn icon iconfont icon-close1" :style="{'font-size': '14px', 'margin-left': '8px'}" title="关闭" @click="hidePanel"></i>
      <Icon class="btn" type="ios-videocam" :class="attrInfo.isOnline ? 'online' : 'offline'" title="视频预览"
        @click.native="attrInfo.isOnline && openPointVideo()">
      </Icon>
      <i class="btn icon iconfont icon-shougongbaojing1" :style="{cursor: showVideo ? 'not-allowed' : 'pointer', marginRight: '10px', 'font-size': '22px'}" title="手工报警" @click="openManualVideo"></i>
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
import { mapState, mapActions, mapMutations } from 'vuex'
import AttrInfo from './AttrInfo'
import seatListFun from '../../../panelTools/seatModel/seatListFun'
export default {
  mixins: [AttrInfo, seatListFun],
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      showVideo: ({ mapAlarm }) => mapAlarm.showVideo,
      attrInfo: ({ mapPoint }) => mapPoint.mapResourceAttributes
    })
  },
  methods: {
    ...mapActions(['updatePointVideoList']),
    ...mapMutations('mapAlarm', ['CHANGE_SHOWVIDEO', 'SAVE_ITEM_ALARM_INPUT', 'GET_ALARM_MODAL_TYPE']),
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
        this.updatePointVideoList(theVideoInfo)
      } else {
        this.warningMsg('该设备已禁用!')
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
.icon-phone {
  width: 10%;
  font-size: 12px;
  cursor: pointer;
}
.phone-down {
  color: red;
}
</style>
