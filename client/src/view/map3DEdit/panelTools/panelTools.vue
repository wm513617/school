<template>
  <div ref="panelTools" class="panel-tools">
    <component :is="panelType"></component>
  </div>
</template>

<script>
import buildForm from './build/buildEditForm'
import buildingList from './build/buildIngList'
import videoEditPanel from './video/videoEditPanel'
import floorForm from './floors/floorForm'
import floorList from './floors/floorList'
import Map3DGrid from './map3DGrid/Map3DGridEdit'
import alarmEditPanel from './alarm/alarmEditPanel'
import alarmHelpEditPanel from './alarmhelp/alarmHelpEditPanel'
import patrolEditPanel from './patrol/patrolEditPanel'
import assistEditPanel from './assist/assistEditPanel'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    buildForm,
    buildingList,
    floorForm,
    floorList,
    Map3DGrid,
    videoEditPanel,
    alarmEditPanel,
    alarmHelpEditPanel,
    patrolEditPanel,
    assistEditPanel
  },
  data() {
    return {
      isBuildList: false,
      panelType: ''
    }
  },
  computed: {
    ...mapState({
      rightPanelType: ({ tdIndex }) => tdIndex.rightPanelType,
      rightPanelShow: ({ tdIndex }) => tdIndex.rightPanelShow
    })
  },
  watch: {
    rightPanelType(val) {
      console.log(val)
      if (val) {
        if (this.$refs['panelTools'].offsetWidth !== 0) {
          this.$refs['panelTools'].style.width = '0'
          setTimeout(() => {
            this.$refs['panelTools'].style.width = '300px'
            if (this.panelType !== val) {
              this.panelType = val
            }
          }, 300)
        } else {
          this.panelType = val
        }
      }
    },
    rightPanelShow(val) {
      if (val) {
        this.$refs['panelTools'].style.width = '300px'
      } else {
        this.$refs['panelTools'].style.width = '0'
      }
    }
  },
  methods: {
    ...mapActions(['setRightPanelShow']),
    togglePanelShow() {
      this.setRightPanelShow(!this.rightPanelShow)
    }
  }
}
</script>

<style scoped>
.panel-tools {
  width: 300px;
  opacity: 0.78;
  /* transition: all 0.3s ease-in-out; */
}
</style>
