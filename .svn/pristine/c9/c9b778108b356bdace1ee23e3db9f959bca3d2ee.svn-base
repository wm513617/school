<!--编辑模式 地图配置页面-->
<template>
  <div>
    <Modal class="mapConfigHome" :mask-closable="false" :closable="false" v-model="mapSettingMol">
      <p slot="header" class="mapConfigHeader">
        <span>中心点重置</span>
      </p>
      <div class="mapConfigContent">
        <Form ref="mapConfigFrom" :model="mapConfigFrom" :label-width="60" label-position="left" :rules="ruleValidate">
          <FormItem label="经度" prop="lon">
            <Input v-model="mapConfigFrom.lon" placeholder="" />
          </FormItem>
          <FormItem label="纬度" prop="lat">
            <Input v-model="mapConfigFrom.lat" placeholder="" />
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="text" @click='cannel' style="margin-right: -3px">取消</Button>
        <Button type="primary" :disabled="confirmButton" style="margin-left: 16px" :loading="modalLoading" @click="confirm('mapConfigFrom')">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    const mapLonCheck = (rule, value, callback) => {
      let r = /^\d+(\.\d+)?$/
      if (value === '') {
        return callback(new Error('地图经度不能为空'))
      }
      if (r.test(value)) {
        const extent = this.activeMapConfig.extent
        const minLon = extent[0]
        const maxLon = extent[2]
        const longitude = parseFloat(value)
        if (longitude >= minLon && longitude <= maxLon) {
          callback()
        } else {
          return callback(new Error('输入的经度不在当前地图范围内，请重新输入'))
        }
      } else {
        return callback(new Error('请输入正确格式的经度'))
      }
    }
    const mapLatCheck = (rule, value, callback) => {
      let r = /^\d+(\.\d+)?$/
      if (value === '') {
        return callback(new Error('地图纬度不能为空'))
      }
      if (r.test(value)) {
        const extent = this.activeMapConfig.extent
        const minLat = extent[1]
        const maxLat = extent[3]
        const lattitude = parseFloat(value)
        if (lattitude >= minLat && lattitude <= maxLat) {
          callback()
        } else {
          return callback(new Error('输入的纬度不在当前地图范围内，请重新输入'))
        }
      } else {
        return callback(new Error('请输入正确格式的纬度'))
      }
    }
    return {
      modalLoading: false,
      confirmButton: false,
      mapConfigMol: true,
      mapConfigFrom: {
        lon: '',
        lat: ''
      },
      ruleValidate: {
        lon: [{ required: true, validator: mapLonCheck, trigger: 'change' }],
        lat: [{ required: true, validator: mapLatCheck, trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapState({
      activeMap: ({ mapIndex }) => mapIndex.activeMapConfig.mapId,
      activeMapConfig: ({ mapIndex }) => mapIndex.activeMapConfig,
      mapSettingMol: ({ mapIndex }) => mapIndex.mapSettingMol
    }),
    activeMapCenter() {
      let center = this.$context2D.map.getView().getCenter()
      return center
    }
  },
  watch: {},
  methods: {
    ...mapActions(['setMapCenterApi']),
    cannel() {
      if (this.activeMap) {
        this.$store.commit('SET_MAP_SET_TING_STATE', false)
      } else {
        this.$router.replace('/navigation')
      }
    },
    confirm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.modalLoading = true
          let arr = [parseFloat(this.mapConfigFrom.lon), parseFloat(this.mapConfigFrom.lat)]
          let params = {
            mapId: this.activeMap,
            center: arr
          }
          this.setMapCenterApi(params)
            .then(res => {
              this.modalLoading = false
              this.$store.commit('SET_MAP_SET_TING_STATE', false)
              this.$context2D.map.getView().setCenter(arr)
              // this.$store.commit('SET_ACTIVE_MAP_CENTER', { id: this.activeMap, center: params.center })
            })
            .catch(errr => {
              this.warningMsg('地图中心点设置失败')
            })
        }
      })
    }
  },
  mounted() {
    this.mapConfigFrom.lon = this.activeMapCenter[0]
    this.mapConfigFrom.lat = this.activeMapCenter[1]
  }
}
</script>
<style scoped>
.mapConfigHome {
  width: 400px;
}
.mapConfigContent {
  margin: 0 10px;
}
.mapConfigHome .mapConfigHeader {
  font-size: 14px;
  color: #fff;
}
</style>
