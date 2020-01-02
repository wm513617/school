<template>
  <div class="tv-box" style="flex:1">
    <div class="one-wall-tab">
      <TVWallLeft :enableController="enableController"></TVWallLeft>
      <div class="right-con">
        <div id="btns">
          <Button-group size="small" style="border:1px solid #287fe0;border-radius: 4px;color: rgba(255, 255, 255, 0.5)">
            <Button v-if="!enableController" @click="openControlConfig">拼控配置</Button>
          </Button-group>
        </div>
        <div>
          <Modal v-model="collageControlConfig" title="拼控配置" :mask-closable="false" @on-visible-change="closeConfigModel" :width="400">
            <bs-cover v-model="collageControlConfig">
              <Form ref="controlConfig" :model="controlConfigCustom" :rules="ruleCustoms" :label-width="80">
                <FormItem label="拼控品牌" prop="brand">
                  <Select v-model="controlConfigCustom.brand" style="width:250px">
                    <Option v-for="item in brandList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="拼控地址" prop="address">
                  <Input type="url" v-model="controlConfigCustom.address" style="width:250px" />
                </FormItem>
                <FormItem label="拼控端口" prop="port">
                  <Input v-model="controlConfigCustom.port" style="width:250px" />
                </FormItem>
              </Form>
            </bs-cover>
            <div slot="footer" style="position:relative;z-index:99">
              <Button type="ghost" @click="collageControlConfig=false">取消</Button>
              <Button type="ghost" @click="saveControlConfig()">确定</Button>
            </div>
          </Modal>
          <TVLayout></TVLayout>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TVWallLeft from './TVWallLeft'
import TVLayout from './TVLayout'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  components: {
    TVWallLeft,
    TVLayout
  },
  data() {
    const validateBrand = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('拼控品牌不能为空'))
      } else {
        callback()
      }
    }
    const validateAddress = (rule, value, callback) => {
      if (value === '' || value.replace(/\s+/g, '') === '') {
        callback(new Error('拼控地址不能为空'))
      } else {
        callback()
      }
    }
    const validatePort = (rule, value, callback) => {
      if (value > 65535 || value < 0 || !/^[0-9]*$/.test(value)) {
        callback(new Error('请输入0 - 65535之间的数字'))
      } else if (value === '' || value.replace(/\s+/g, '') === '') {
        callback(new Error('拼控端口不能为空'))
      } else {
        callback()
      }
    }
    return {
      collageControlConfig: false,
      brandList: [
        {
          value: 0,
          label: '海康'
        }
      ],
      controlConfigCustom: {
        brand: 0,
        address: '',
        port: ''
      },
      ruleCustoms: {
        brand: [{ required: true, validator: validateBrand, trigger: 'blur' }],
        address: [{ required: true, validator: validateAddress, trigger: 'blur' }],
        port: [{ required: true, validator: validatePort, trigger: 'blur' }]
      },
      url: ''
    }
  },
  props: {
    tvWallData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  computed: {
    ...mapState({
      rtscene: ({ tvwall }) => tvwall.rtscene
    }),
    enableController() {
      const item = this.tvWallData.jointcontroller
      if (item) {
        this.SET_ENABLE_CONTROLLER(item.checked)
        return item.checked
      } else {
        this.SET_ENABLE_CONTROLLER(false)
        this.getControls()
        return false
      }
    }
  },
  methods: {
    ...mapActions(['getControl', 'addControl', 'getAllLayoutList', 'getMonitorList']),
    ...mapMutations(['SET_ENABLE_CONTROLLER']),
    saveControlConfig() {
      this.$refs.controlConfig.validate(valid => {
        if (valid) {
          const param = {
            manufacturer: this.brandList[this.controlConfigCustom.brand].label,
            url: this.controlConfigCustom.address,
            port: +this.controlConfigCustom.port
          }
          this.addControl(param)
            .then(() => {
              this.url = param.port !== 0 ? `${param.url}:${param.port}` : param.url
              this.collageControlConfig = false
              this.$Notice.success({
                title: '成功',
                desc: '拼控配置成功',
                duration: 3
              })
            })
            .catch(err => {
              console.error(err)
              this.$Notice.error({
                title: '错误',
                desc: '拼控配置失败',
                duration: 3
              })
            })
        }
      })
    },
    closeConfigModel(val) {
      if (!val) {
        this.$refs.controlConfig.resetFields()
      }
    },
    openControlConfig() {
      this.getControl()
        .then(resp => {
          this.controlConfigCustom.address = resp.data.url
          this.controlConfigCustom.port = resp.data.port ? resp.data.port + '' : ''
          this.url = resp.data.port !== 0 ? `${resp.data.url}:${resp.data.port}` : resp.data.url
          this.collageControlConfig = true
        })
        .catch(err => {
          console.error('getControl', err)
        })
    },
    collageControl() {
      if (this.url === '') {
        return this.$Notice.error({
          title: '错误',
          desc: '请先配置拼控',
          duration: 3
        })
      }
    },
    getControls() {
      this.getControl()
        .then(resp => {
          this.url = resp.data.port !== 0 ? `${resp.data.url}:${resp.data.port}` : resp.data.url
        })
        .catch(err => {
          console.error('getControl', err)
        })
    }
  },
  created() {
    this.getAllLayoutList()
    this.getMonitorList()
  }
}
</script>
<style lang="less" scoped>
.right-con {
  flex: 1;
  padding: 0 16px;
}
.right-con > div {
  height: 100%;
}
.tv-box {
  overflow: hidden;
  height: 100%;
}
.one-wall-tab {
  display: flex;
  width: 100%;
  padding-top: 16px;
  height: ~'calc(100% - 41px)';
}
#btns {
  margin-right: 16px;
  padding-top: 7px;
  position: absolute;
  z-index: 1000;
  height: 45px;
  top: 55px;
  right: 0;
}
#btns .active-btn {
  color: #fff;
  background: #287fe0;
}
.control-box {
  position: absolute;
  top: 129px;
  bottom: 16px;
  left: 316px;
  right: 16px;
  background: #fff;
  z-index: 999;
}
.control-box iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
