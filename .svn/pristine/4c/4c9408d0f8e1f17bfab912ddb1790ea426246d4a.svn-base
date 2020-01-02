<template>
  <Modal :value="mapConfigModal" class="mapConfigHome" width="600" :mask-closable="false" :closable="false">
    <div class="ivu-modal-close" @click="set3DEditConfigModal(false)">
      <i class="ivu-icon ivu-icon-ios-close-empty"></i>
    </div>
    <p slot="header" class="mapConfigHeader">
      <span>参数配置</span>
    </p>
    <div class="mapConfigContent">
      <Form ref="mapConfigFrom" :model="mapConfigForm" :rules="ruleValidate" :label-width="100" label-position="left">
        <FormItem label="数据源名称" prop="source">
          <Input v-model="mapConfigForm.source" placeholder="" />
        </FormItem>
        <FormItem label="数据集名称" prop="collect">
          <Input v-model="mapConfigForm.collect" placeholder="" />
        </FormItem>
        <FormItem label="图层名称" prop="layer">
          <Input v-model="mapConfigForm.layer" placeholder="" />
        </FormItem>
        <FormItem label="地图服务URL" prop="mapService">
          <Input v-model="mapConfigForm.mapService" placeholder="" />
        </FormItem>
        <FormItem label="数据服务URL" prop="dataService">
          <Input v-model="mapConfigForm.dataService" placeholder="" />
        </FormItem>
      </Form>
    </div>
    <div slot="footer" style="text-align: right; overflow: hidden;">
      <Button type="text" @click="set3DEditConfigModal(false)">取消</Button>
      <Button type="primary" @click="saveParamConfig">保存</Button>
    </div>
  </Modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      mapConfigForm: {
        id: '',
        source: '',
        collect: '',
        layer: '',
        mapService: '',
        dataService: ''
      },
      ruleValidate: {
        source: [{ required: true, message: '数据源名称不能为空', trigger: 'blur' }],
        collect: [{ required: true, message: '数据集名称不能为空', trigger: 'blur' }],
        layer: [{ required: true, message: '图层名称不能为空', trigger: 'blur' }],
        mapService: [{ required: true, message: '地图服务URL不能为空', trigger: 'blur' }],
        dataService: [{ required: true, message: '数据服务URL不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      mapConfigModal: ({ tdIndex }) => tdIndex.mapConfigModal,
      map3DDefaultConfig: ({ tdIndex }) => tdIndex.map3DConfig // 配置文件中的默认配置参数
    })
  },
  watch: {
    mapConfigModal(val) {
      if (val) {
        this.mapConfigForm.source = this.map3DDefaultConfig.dataSource
        this.mapConfigForm.collect = this.map3DDefaultConfig.dataSet
        this.mapConfigForm.layer = this.map3DDefaultConfig.layer ? this.map3DDefaultConfig.layer : `${this.map3DDefaultConfig.dataSet}@${this.map3DDefaultConfig.dataSource}`
        this.mapConfigForm.mapService = this.map3DDefaultConfig.mapUrl
        this.mapConfigForm.dataService = this.map3DDefaultConfig.dataUrl
      }
    }
  },
  methods: {
    ...mapActions(['set3DEditConfigModal', 'getMap3DParamConfig', 'setMap3DParamConfig']),
    saveParamConfig() {
      this.$refs.mapConfigFrom.validate(valid => {
        if (valid) {
          const param = {
            mapUrl: this.mapConfigForm.mapService,
            dataUrl: this.mapConfigForm.dataService,
            layer: this.mapConfigForm.layer,
            dataSource: this.mapConfigForm.source,
            dataSet: this.mapConfigForm.collect
          }
          this.setMap3DParamConfig(param).then(res => {
            this.getMap3DParamConfig()
            this.set3DEditConfigModal(false)
            this.successMsg('参数配置成功')
          }).catch(() => {
            this.errorMsg('参数配置保存失败')
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.mapConfigHome {
  width: 600px;
}

.mapConfigHome .mapConfigHeader {
  font-size: 14px;
  color: #fff;
}
.mapConfigContent {
  margin: 0 10px;
}
.mapConfigHome button {
  float: right;
  margin-left: 16px;
}
</style>
