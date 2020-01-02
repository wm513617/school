  <template>
  <Modal
    title="Title"
    v-model="viewSetting"
    :mask-closable="false">
    <div class="ivu-modal-close" @click="set3DViewSettingModal(false)">
      <i class="ivu-icon ivu-icon-ios-close-empty"></i>
    </div>
    <p slot="header" class="mapConfigHeader">
      <span>默认视角配置</span>
    </p>
    <div>
        是否将当前视角保存为默认视角
    </div>
    <div slot="footer" style="text-align: right">
      <Button type="text" style="margin-right: -3px" @click="set3DViewSettingModal(false)">取消</Button>
      <Button type="primary" style="margin-left: 16px" @click="saveViewSetting">保存</Button>
    </div>
  </Modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      viewForm: {
        latitude: '',
        longitude: '',
        height: '',
        heading: 0,
        pitch: 0,
        roll: 0
      },
      ruleValidate: {
        heading: [{ required: true, message: 'heading不能为空', trigger: 'blur' }],
        pitch: [{ required: true, message: 'pitch不能为空', trigger: 'blur' }],
        roll: [{ required: true, message: 'roll不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      viewSetting: ({ tdIndex }) => tdIndex.viewSetting,
      ready: ({ tdIndex }) => tdIndex.ready // 判断三维地图是否加载成功的标识-----
    })
  },
  methods: {
    ...mapActions(['setViewSetting', 'setMap3DParamConfig']),
    set3DViewSettingModal(flag) {
      this.setViewSetting(flag)
    },
    saveViewSetting() {
      console.log('视角保存！！！')
      let param = { perspective: this.viewForm } // 视角参数
      this.setMap3DParamConfig(param)
        .then(res => {
          this.successMsg('视角配置成功')
          this.set3DViewSettingModal(false)
        })
        .catch(err => {
          console.log(err)
          this.errorMsg('视角配置保存失败')
          this.set3DViewSettingModal(false)
        })
    }
  },
  watch: {
    viewSetting(val) {
      if (val && this.ready) {
        let { viewer, Cesium } = this.$context
        this.viewForm.heading = Cesium.Math.toDegrees(viewer.camera.heading)
        this.viewForm.pitch = Cesium.Math.toDegrees(viewer.camera.pitch)
        this.viewForm.roll = Cesium.Math.toDegrees(viewer.camera.roll)
        this.viewForm.latitude = Cesium.Math.toDegrees(viewer.camera.positionCartographic.latitude)
        this.viewForm.longitude = Cesium.Math.toDegrees(viewer.camera.positionCartographic.longitude)
        this.viewForm.height = viewer.camera.positionCartographic.height // 高度（单位：米）t
      }
    }
  },
  mounted() {
    console.log('this.ready')
  }
}
</script>

<style scoped>
.mapConfigHeader {
  font-size: 14px;
  color: #fff !important;
}
</style>
