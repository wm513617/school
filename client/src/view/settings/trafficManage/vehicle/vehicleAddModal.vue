<template>
  <Modal v-model="isShow" :title="type ? '机动车添加' : '机动车修改'" @on-visible-change="$emit('close')" :width="800">
    <div class="add-content">
      <Form ref="userForm" :model="userForm" :rules="userRuleDefault" label-position="left" :label-width="80" style="width: 330px;margin-right: 100px;">
        <FormItem label="所有人信息"></FormItem>
        <FormItem label="单位">
          <span>{{orgName.name}}</span>
        </FormItem>
        <FormItem label="姓名" prop="name">
          <Input v-model="userForm.name"></Input>
        </FormItem>
        <FormItem label="性别">
          <RadioGroup v-model="userForm.gender">
            <Radio :label="0">男</Radio>
            <Radio :label="1">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="车牌号码" prop="plateNo">
          <!-- @on-blur="changeLicence" -->
          <Input v-model="userForm.plateNo"></Input>
        </FormItem>
        <FormItem label="人员编号">
          <Input v-model="userForm.code" :maxlength="64"></Input>
        </FormItem>
        <FormItem label="联系电话">
          <!-- @on-blur="changeTel" -->
          <Input v-model="userForm.tel" :maxlength="11"></Input>
        </FormItem>
        <FormItem label="有效期" prop="startTime">
          <DatePicker :value="startTime" type="date" style="width: 115px;" @on-change="startTime=$event"></DatePicker> 至 <DatePicker :value="endTime" type="date" style="width:115px;" @on-change="endTime=$event"></DatePicker>
        </FormItem>
        <FormItem label="备注">
          <Input v-model="userForm.remark" :maxlength="512" type="textarea" :autosize="{minRows: 2,maxRows: 2}"></Input>
        </FormItem>
      </Form>
      <!-- :rules="carRules" -->
      <Form :model="userForm" label-position="left" :label-width="85" style="flex: 1;">
        <FormItem label="驾驶员照片"></FormItem>
        <div style="margin-bottom: 12px;">
          <Upload action="/api/upload/file?type=image&category=motorVehicle/driver" name="file" :format="['jpg','png','bmp','jpeg']" :show-upload-list="false" :on-success="uploadLaneSucOne">
            <div v-if="!userForm.driverPic1" class="photo">
              <Icon type="ios-plus-empty" size="48"></Icon>
              <p>上传图片</p>
            </div>
            <img v-if="userForm.driverPic1" :src="userForm.driverPic1" class="picture">
          </Upload>
          <Upload action="/api/upload/file?type=image&category=motorVehicle/driver" name="file" :format="['jpg','png','bmp','jpeg']" :show-upload-list="false" :on-success="uploadLaneSucTwo">
            <div v-if="!userForm.driverPic2" class="photo">
              <Icon type="ios-plus-empty" size="48"></Icon>
              <p>上传图片</p>
            </div>
            <img v-if="userForm.driverPic2" :src="userForm.driverPic2" class="picture">
          </Upload>
          <Upload action="/api/upload/file?type=image&category=motorVehicle/driver" name="file" :format="['jpg','png','bmp','jpeg']" :show-upload-list="false" :on-success="uploadLaneSucThree">
            <div v-if="!userForm.driverPic3" class="photo">
              <Icon type="ios-plus-empty" size="48"></Icon>
              <p>上传图片</p>
            </div>
            <img v-if="userForm.driverPic3" :src="userForm.driverPic3" class="picture">
          </Upload>
        </div>
      </Form>
    </div>
    <div slot="footer">
      <Button type="ghost" @click="$emit('close')">取消</Button>
      <Button type="primary" @click="sureAdd">保存</Button>
    </div>
  </Modal>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    model: {
      type: Boolean,
      default: false
    },
    orgName: {
      type: Object,
      default: () => {
        return {}
      }
    },
    type: {
      type: Boolean,
      default: true
    },
    vehicleInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    const nameValidate = (rule, value, callback) => {
      if (value) {
        // Unicode编码
        let strlen = 0
        for (let i = 0; i < value.length; i++) {
          if (value.charCodeAt(i) > 255) {
            // 如果是汉字，则字符串长度加2
            strlen += 2
          } else {
            strlen++
          }
        }
        if (strlen > 16) {
          return callback(new Error('名称不能超过16位字符'))
        } else {
          return callback()
        }
      } else {
        return callback(new Error('名称不能为空'))
      }
    }
    const plateNoRule = (rule, value, callback) => {
      const reg = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/
      if (value) {
        if (value.length && value.search(reg) === -1) {
          // this.plateNoStatus = true
          // this.$Notice.error({
          //   title: '提示',
          //   desc: '请输入正确的车牌号',
          //   duration: 2
          // })
          return callback(new Error('请输入正确的车牌号'))
        } else {
          return callback()
        }
      } else {
        return callback(new Error('车牌号不能为空'))
      }
    }
    return {
      isShow: this.model,
      userForm: {
        cardNo: '',
        personType: 0,
        name: '',
        gender: 0,
        tel: '',
        remark: '',
        driverPic1: '',
        driverPic2: '',
        driverPic3: '',
        plateNo: '',
        code: ''
      },
      userRuleDefault: {
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
          {validator: nameValidate, trigger: 'change'}
        ],
        plateNo: [
          {required: true, message: '请填写牌照号码', trigger: 'blur'},
          {validator: plateNoRule, trigger: 'change'}
        ]
        // startTime: [
        //   {required: true, type: 'string', message: '请填写有效时间', trigger: 'change'}
        // ]
      },
      startTime: '', // 有效开始日期
      endTime: '', // 有效结束日期
      plateNoStatus: false

    }
  },
  computed: {
  },
  created() {
    if (!this.type) {
      this.userForm = JSON.parse(JSON.stringify(this.vehicleInfo))
      this.startTime = this.userForm.startTime ? this.$moment(this.userForm.startTime * 1000).format('YYYY-MM-DD') : ''
      this.endTime = this.userForm.endTime ? this.$moment(this.userForm.endTime * 1000).format('YYYY-MM-DD') : ''
      this.userForm = {
        ...this.vehicleInfo
      }
    }
  },
  methods: {
    ...mapActions(['addMotorVehicle', 'editMotorVehicle']),
    // 日志信息开始时间
    logStartTime(day) {
      const date = new Date(day)
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      return date
    },
    sureAdd() {
      const user = this.userForm
      if (this.startTime !== '' && this.endTime !== '') {
        if (this.startTime === this.endTime) {
          this.$Notice.warning({
            title: '提示',
            desc: '开始时间不能等于结束时间',
            duration: 2
          })
          return
        } else if (this.startTime > this.endTime) {
          this.$Notice.warning({
            title: '提示',
            desc: '开始时间不能小于结束时间',
            duration: 2
          })
          return
        }
      }
      if (this.userForm.tel) {
        const reg = /^([0-9])+$/g
        if (this.userForm.tel.length && this.userForm.tel.search(reg) === -1) {
          this.$Notice.error({
            title: '提示',
            desc: '请正确的电话号码，仅支持数字',
            duration: 2
          })
          return
        }
      }
      let sTime = this.logStartTime(this.startTime)
      let eTime = this.logStartTime(this.endTime)
      let startTime = this.startTime ? Date.parse(new Date(sTime)) / 1000 : ''
      let endTime = this.endTime ? Date.parse(new Date(eTime)) / 1000 : ''
      const param = {
        orgId: this.orgName.id,
        name: user.name,
        gender: user.gender,
        tel: user.tel,
        code: this.userForm.code,
        plateNo: this.userForm.plateNo,
        startTime: startTime,
        endTime: endTime,
        remark: user.remark,
        driverPic1: this.userForm.driverPic1,
        driverPic2: this.userForm.driverPic2,
        driverPic3: this.userForm.driverPic3
      }
      this.$refs.userForm.validate(valid => {
        if (valid) {
          if (startTime === '' || endTime === '') {
            this.$Notice.warning({
              title: '提示',
              desc: '请填写有效期限',
              duration: 2
            })
            return
          }
          if (!param.driverPic1 && !param.driverPic2 && !param.driverPic3) {
            this.$Notice.warning({
              title: '提示',
              desc: '请上传至少一张照片',
              duration: 2
            })
            return
          }
          if (this.type) {
            // 添加
            this.addMotorVehicle(param).then(() => {
              this.successMsg('添加成功')
              this.$parent.getvehicleList()
              this.$emit('close')
            }).catch(() => {
              this.errorMsg('添加失败')
            })
          } else {
            // 修改
            const payload = {
              id: this.vehicleInfo._id,
              body: param
            }
            this.editMotorVehicle(payload).then(() => {
              this.successMsg('修改成功')
              this.$parent.getvehicleList()
              this.$emit('close')
            }).catch(() => {
              this.errorMsg('修改失败')
            })
          }
        }
      })
    },
    uploadLaneSucOne(response) {
      this.userForm.driverPic1 = response.path
    },
    uploadLaneSucTwo(response) {
      this.userForm.driverPic2 = response.path
    },
    uploadLaneSucThree(response) {
      this.userForm.driverPic3 = response.path
    }
  }
}
</script>

<style scoped lang='less'>
.add-content {
  display: flex;
}
.photo {
  width: 140px;
  height: 140px;
  text-align: center;
  border: 1px solid #5676a9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 10px;
}
.picture {
  width: 140px;
  height: 140px;
  border: 1px solid #5676a9;
  vertical-align: middle;
  cursor: pointer;
  margin-bottom: 10px;
}
</style>
