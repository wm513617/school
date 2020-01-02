<template>
  <Modal v-model="modal" :mask-closable="false" title="精准布控" :width="800" @on-cancel="cancel">
    <Tabs type="card" :value="item" @on-click="showItem">
      <Tab-pane label="基础信息" name="基础信息"></Tab-pane>
      <Tab-pane label="布控点位" name="布控点位"></Tab-pane>
    </Tabs>
    <div v-show="item==='基础信息'" style="display:flex;padding:0 10px;height:510px">
      <div class="modal-left">
        <Form ref="cardeploy" :model="carInfo" :rules="ruleValidate" :label-width="100" label-position="left">
          <Form-item label="任务名称" prop="name">
            <Input v-model="carInfo.name" placeholder="请输入"></Input>
          </Form-item>
          <Form-item label="布控级别" prop="level">
            <Select v-model="carInfo.level" placeholder="请选择">
              <Option v-for="item in carLevel" :key="item.value" :value="item.value">{{item.label}}</Option>
            </Select>
          </Form-item>
          <Form-item label="车牌号" prop="licence">
            <Input v-model="carInfo.licence" placeholder="请输入" @on-blur="blurLicence"></Input>
          </Form-item>
          <Form-item label="车辆品牌">
            <Select v-model="carInfo.brand" placeholder="请选择" @on-change="brandSelect">
              <Option v-for="item in carBase.brand" :key="item.value" :value="item.value">{{item.label}}</Option>
            </Select>
          </Form-item>
          <Form-item label="车辆型号">
            <Select v-model="carInfo.model" placeholder="请选择">
              <Option v-for="item in carBase.model" :key="item.value" :value="item.value">{{item.label}}</Option>
            </Select>
          </Form-item>
          <Form-item label="车辆类型">
            <Select v-model="carInfo.vehicleType" placeholder="请选择">
              <Option v-for="item in carType" :key="item.value" :value="item.value">{{item.label}}</Option>
            </Select>
          </Form-item>
          <Form-item label="车辆颜色">
            <Select v-model="carInfo.color" placeholder="请选择">
              <Option v-for="item in carColor" :key="item.value" :value="item.value">{{item.label}}</Option>
            </Select>
          </Form-item>
          <Form-item label="车行方向">
            <Select v-model="carInfo.direction" placeholder="请选择">
              <Option v-for="item in carBase.direction" :key="item.value" :value="item.value">{{item.label}}</Option>
            </Select>
          </Form-item>
          <Form-item label="布控时间" prop="startTime">
            <div class="time-rang">
              <Date-picker type="date" v-model="carInfo.startTime" :clearable="false" placeholder="选择日期" :options="{ disabledDate(date) { return (date && carInfo.endTime) && date.valueOf() >= carInfo.endTime } }"></Date-picker>
              <span>至</span>
              <Date-picker type="date" v-model="carInfo.endTime" :clearable="false" placeholder="选择日期" :options="{ disabledDate(date) { return date && date.valueOf() <= carInfo.startTime || date.valueOf() <= nowTime } }"></Date-picker>
            </div>
          </Form-item>
          <!-- <Form-item label="布控范围" class="dev-scope">
                <Checkbox v-model="carInfo.isDefenseAll">全部范围</Checkbox>
                <Select placeholder="点击选择布控范围" ref="scopeSelect" :disabled="carInfo.isDefenseAll">
                  <VTree ref='treeDeploy' :treeData="Data" :options="options" style="margin-left: 20px;"></VTree>
                </Select>
              </Form-item> -->
        </Form>
      </div>
      <div class="modal-right">
        <div style="width:280px;height:210px;margin: 0 auto;margin-bottom:10px;border:1px dotted #fff">
          <img v-if="carInfo.image" :src="'/api/upload?id='+carInfo.image" style="width:100%;height:100%" />
          <!-- 勿删 获取图片接口 '/api/upload/vehicle/'+carInfo.image    上传 '/api/upload?id='+carInfo.image -->
        </div>
        <div style="margin: 0 auto">
          <!--勿删 识别接口     /api/vehicle/recognize        上传  /api/upload?imgtype=exactDeploy-->
          <Upload :on-error="uploadImgError" action="/api/vehicle/recognize" :headers="headerObj" name="file" :max-size="500" :on-exceeded-size="exceededSize" :format="['jpg','png','bmp','jpeg']" :on-success="uploadSuccess" :on-format-error="formatError" :show-upload-list="false" ref="upload" style="text-align:center">
            <Button type="ghost" icon="ios-cloud-upload-outline">识别图片</Button>
          </Upload>
        </div>
      </div>
    </div>
    <div v-show="item==='布控点位'" style="padding:0 10px;height:510px;overflow-y:auto;">
      <bs-scroll ref="scroller">
        <VTree @on-expand="$refs.scroller.update()" :isSaveState='false' ref='treeDeploy' :treeData="Data" :options="options"></VTree>
      </bs-scroll>
    </div>
    <div slot="footer">
      <Button type="ghost" @click="cancel">取消</Button>
      <Button type="primary" @click="submit('cardeploy')">确定</Button>
    </div>

  </Modal>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'BScarDeploy',
  data() {
    const validatePlateNumber = (rule, value, callback) => {
      const re = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/
      if (!re.test(value)) {
        return callback(new Error('车牌格式不正确'))
      } else {
        const query = {
          licence: value,
          id: this.carInfo._id
        }
        this.licenceNumber(query).then(res => {
          if (res) {
            return callback(new Error('车牌号码已存在'))
          } else {
            return callback()
          }
        }).catch(err => {
          console.log('licenceNumber error' + err)
        })
      }
    }
    const validateStr = (rule, value, callback) => {
      if (value) {
        // Unicode编码
        let strlen = 0
        for (let i = 0; i < value.length; i++) {
          if (value.charCodeAt(i) > 255) { // 如果是汉字，则字符串长度加2
            strlen += 2
          } else {
            strlen++
          }
        }
        if (strlen > 64) {
          return callback(new Error('名称不能超过64位字符'))
        } else {
          return callback()
        }
      } else {
        return callback(new Error('名称不能为空'))
      }
    }
    return {
      headerObj: { Authorization: '' },
      item: '基础信息',
      nowTime: new Date(new Date().setHours(0, 0, 0, 0)),
      modal: false,
      carInfo: {},
      options: {
        showCheckbox: true,
        showInput: true
      },
      ruleValidate: {
        licence: [
          { required: true, validator: validatePlateNumber, trigger: 'blur' }
        ],
        name: [
          { required: true, validator: validateStr, trigger: 'change' }
        ]
      }
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    loadingOK: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object
    },
    Data: {
      type: Array
    }
  },
  computed: {
    ...mapGetters(['carType', 'carColor', 'accessToken', 'tipWarningConfig']),
    ...mapState({
      carBase({ vehicle }) {
        return vehicle.carBase
      },
      carLevel({ vehicle }) {
        return vehicle.level
      }
    })
  },
  created() {
    this.headerObj.Authorization = `Bearer ${this.accessToken}`
  },
  methods: {
    ...mapActions(['getCarInformation', 'getModel', 'licenceNumber']),
    showItem(val) {
      this.item = val
    },
    brandSelect(item) {
      this.getModel(item)
    },
    submit(name) {
      this.$refs[name].validate((valid) => {
        if (!valid) {
          // this.$Notice.error({ title: '表单验证失败!' })
          if (this.item !== '基础信息') { this.item = '基础信息' }
        } else {
          this.carInfo.videoChannels = this.$refs.treeDeploy.getSelectedDeepChannelid()
          this.$emit('input', this.carInfo, name)
        }
      })
    },
    cancel() {
      this.modal = false
      this.$refs['cardeploy'].resetFields()
      this.$emit('cancel', this.carInfo)
    },
    uploadSuccess(response, file, fileList) {
      // 勿删
      this.carInfo.image = response.imgObj.id
      response.recObj.vehicleType = response.recObj.type
      delete response.recObj.type
      Object.assign(this.carInfo, response.recObj)
      // this.carInfo.image = response.id
    },
    uploadImgError(erro, file, fileList) {
      this.$Notice.error({
        title: '上传失败',
        desc: file.message === 'ETIMEDOUT' ? '连接超时' : file.message
      })
    },
    exceededSize(file) {
      if (this.tipWarningConfig.show) {
        this.$Notice.warning({
          title: '图片大小超过限制',
          desc: '图片 ' + file.name + ' 大小超过限制，请上传小于500kb的图片。',
          duration: this.tipWarningConfig.dur
        })
      }
    },
    formatError(file) {
      if (this.tipWarningConfig.show) {
        this.$Notice.warning({
          title: '图片格式不正确',
          desc: '图片 ' + file.name + ' 格式不正确，请上传 jpg, png, bmp 或 jpeg 格式的图片。',
          duration: this.tipWarningConfig.dur
        })
      }
    },
    blurLicence() {
      const re = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/
      if (this.carInfo.licence !== '' && re.test(this.carInfo.licence)) {
        this.getCarInformation(this.carInfo.licence).then((res) => {
          if (res.data) {
            this.carInfo.vehicleType = res.data.type
            this.carInfo.color = res.data.color
            this.carInfo.brand = res.data.brand
            this.carInfo.model = res.data.model
          }
        }).catch((err) => {
          console.log('blurLicence error:' + err)
        })
      }
    }
  },
  watch: {
    value: {
      handler: function(val) {
        if (val) {
          this.carInfo = this.value
        }
      },
      deep: true
    },
    show(val) {
      if (val !== this.modal) {
        this.modal = val
      }
    },
    modal(newValue) {
      this.$emit('update:show', newValue)
    }
  }
}
</script>
<style scoped>
.bs-modal-footer {
  display: flex;
}

.bs-modal-footer button {
  float: right;
}

.modal-left {
  flex: 0 0 420px;
}

.modal-left form {
  width: 420px;
}

.modal-right {
  flex: 1;
  justify-content: center;
}

.time-rang {
  display: flex;
}

.time-rang span {
  width: 50px;
  text-align: center;
}

.dev-list {
  position: absolute;
  bottom: 35px;
  width: 100%;
  border: 1px solid #ccc;
  background: #fff;
  padding: 10px;
}
</style>
