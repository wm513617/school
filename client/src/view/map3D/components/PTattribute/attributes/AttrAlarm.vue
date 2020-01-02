<template>
  <div class="attr-video attr-panel">
    <header>
      <span class="title">报警点位</span>
      <span class="layout layout-btn" @click="alarmPointClick('protection')" v-if="isLayout"></span>
      <span class="layout disarm-btn" @click="alarmPointClick('removal')" v-else></span>
    </header>
    <section class="main">
      <ul class="info-list">
        <li v-if="attrInfo.name">
          <span class="label">名称</span>
          <span class="value" :title="attrInfo.name">{{attrInfo.name}}</span>
        </li>
        <li v-if="attrInfo.level">
          <span class="label">级别</span>
          <span class="value" :title="attrInfo.level">{{attrInfo.level}}</span>
        </li>
        <li v-if="tempName">
          <span class="label">布撤防时间</span>
          <span class="value" :title="tempName">{{tempName}}</span>
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
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      tempName: '',
      isLayout: true,
      tempId: ''
    }
  },
  created() {
  },
  computed: {
    ...mapGetters('map3DApplyIX', ['attrInfo'])
  },
  watch: {
    attrInfo(val) {
      if (val) {
        this.alarmLayoutStatus(val.resourceId)
        this.alarmTemp(val)
      }
    }
  },
  methods: {
    ...mapActions('map3DApplyIX', ['layoutAlarm', 'removalAlram', 'getTempName', 'getAlarmLayout']),
    alarmLayoutStatus(val) {
      this.getAlarmLayout({ id: val }).then(suc => {
      }).catch(err => {
        console.log(err)
        this.errorMsg('布防状态失败！')
      })
    },
    alarmTemp(val) {
      this.getTempName().then(suc => {
        suc.data.forEach(item => {
          if (item._id === val.alarmtemplate) {
            this.tempName = item.name
          }
        })
      }).catch(err => {
        console.log(err)
        this.errorMsg('布防失败！')
      })
    },
    alarmPointClick(type) {
      switch (type) {
        case 'protection':
          this.layoutAlarm({ id: this.attrInfo.resourceId, type: 'res' }).then(() => {
            this.isLayout = false
            this.successMsg('布防成功！')
          }).catch(() => {
            this.errorMsg('布防失败！')
          })
          break
        case 'removal':
          this.removalAlram({ id: this.attrInfo.resourceId, type: 'res' }).then(() => {
            this.isLayout = true
            this.successMsg('撤防成功！')
          }).catch(() => {
            this.errorMsg('撤防失败！')
          })
          break
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import url(./style.less);
.layout {
  float: right;
  height: 30px;
  width: 30px;
}
.layout-btn {
  background: url('../../../../../../static/image/map/layout.png') no-repeat center;
  background-size: 20px 20px;
}
.disarm-btn {
  background: url('../../../../../../static/image/map/disarm.png') no-repeat center;
  background-size: 20px 20px;
}
</style>
