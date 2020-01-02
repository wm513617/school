<template>
  <Modal v-model="isShow" :title="type ? '非机动车添加' : '非机动车修改'" @on-visible-change="$emit('close')" :width="800" :mask-closable="false">
    <div class="add-content">
      <Form ref="userForm" :key="userForm.identityType" :model="userForm" :rules="userRuleDefault" label-position="left" :label-width="80" style="width: 330px;margin-right: 100px;">
        <FormItem label="所有人信息"></FormItem>
        <FormItem label="单位">
          <span>{{orgName.name}}</span>
        </FormItem>
        <FormItem label="身份">
          <RadioGroup v-model="userForm.identityType" @on-change="changeId">
            <Radio v-for="item in identity" :key="item.value" :label="item.value">{{item.label}}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem :label="idName" prop="indentityNo">
          <Input v-model="userForm.indentityNo" :maxlength="idName === '身份证号' ? 18 : 32"></Input>
        </FormItem>
        <FormItem v-if="userForm.identityType === 1" label="学生类型">
          <RadioGroup v-model="userForm.studentType">
            <Radio :label="0">非留学生</Radio>
            <Radio :label="1">留学生</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem v-else-if="userForm.identityType === 2" label="身份证号" prop="cardNo">
          <Input v-model="userForm.cardNo" :maxlength="18"></Input>
        </FormItem>
        <FormItem v-else-if="userForm.identityType === 3" label="人员类型">
          <RadioGroup v-model="userForm.personType">
            <Radio :label="0">家属</Radio>
            <Radio :label="1">居委会</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem v-else label="">
          <div style="height:32.89px;"></div>
        </FormItem>
        <FormItem label="姓名" prop="name">
          <Input v-model="userForm.name" :maxlength="64"></Input>
        </FormItem>
        <FormItem label="性别">
          <RadioGroup v-model="userForm.sex">
            <Radio :label="0">男</Radio>
            <Radio :label="1">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="联系电话" prop="tel">
          <Input v-model="userForm.tel" :maxlength="64"></Input>
        </FormItem>
        <FormItem label="住址" prop="address">
          <Input v-model="userForm.address" :maxlength="64"></Input>
        </FormItem>
        <FormItem label="年龄" prop="age">
          <Input v-model="userForm.age" :maxlength="2"></Input>
        </FormItem>
        <FormItem v-if="userForm.identityType === 1" label="入学时间" prop="registerTime">
          <DatePicker type="month" style="width: 250px;" format="yyyy-MM" :value="userForm.registerTime" @on-change="userForm.registerTime=$event"></DatePicker>
        </FormItem>
        <FormItem v-else label="">
          <div style="height: 32.89px;"></div>
        </FormItem>
        <FormItem label="备注">
          <Input v-model="userForm.remark" :maxlength="64"></Input>
        </FormItem>
      </Form>
      <Form ref="carForm" :model="carForm" :rules="carRules" label-position="left" :label-width="94" style="flex: 1;">
        <FormItem label="车况信息"></FormItem>
        <div style="margin-bottom: 12px;">
          <Upload action="/api/upload/file?type=image&category=nonVehicle" name="file" :format="['jpg','png','bmp','jpeg']" :show-upload-list="false" :on-success="uploadLaneSuc">
            <div v-if="!carForm.image" class="photo">
              <Icon type="ios-cloud-upload" size="52"></Icon>
              <p>点击上传车辆照片</p>
            </div>
            <img v-if="carForm.image" :src="carForm.image" class="picture">
          </Upload>
        </div>
        <FormItem label="本人购买">
          <RadioGroup v-model="carForm.isOneSelf">
            <Radio :label="1">是</Radio>
            <Radio :label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="发票">
          <RadioGroup v-model="carForm.isInvoice">
            <Radio :label="1">有</Radio>
            <Radio :label="0">无</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="购买时间" prop="buyTime">
          <DatePicker type="month" style="width: 241px;" :value="carForm.buyTime" :options="DateOptions" @on-change="carForm.buyTime=$event"></DatePicker>
        </FormItem>
        <FormItem label="牌照类型">
          <RadioGroup v-model="carForm.numberPlateType">
            <Radio :label="0">临时</Radio>
            <Radio :label="1">正式</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="校内车辆编号" prop="numberPlate">
          <Input v-model="carForm.numberPlate" :maxlength="32" :disabled="!type"></Input>
        </FormItem>
        <FormItem label="有效期">
          <DatePicker :value="startTime" type="month" style="width: 105px;" @on-change="startTime=$event"></DatePicker> 至 <DatePicker :value="endTime" type="month" style="width:105px;" @on-change="endTime=$event"></DatePicker>
        </FormItem>
        <FormItem label="牌照号码">
          <Input v-model="carForm.schoolCardNo" :maxlength="32"></Input>
        </FormItem>
        <FormItem label="品牌" prop="brand">
          <Input v-model="carForm.brand" :maxlength="32"></Input>
        </FormItem>
        <FormItem label="颜色" prop="color">
          <Input v-model="carForm.color" :maxlength="32"></Input>
        </FormItem>
        <!-- <FormItem label="状态">
          <Select v-model="carForm.state">
            <Option v-for="item in stateList" :key="item.value" :value="item.value">{{item.label}}</Option>
          </Select>
        </FormItem> -->
      </Form>
    </div>
    <div v-if="!type">
      <h4>违规记录</h4>
      <div class="record-box">
        <ul v-for="(item, index) in violationLists" :key="index">
          <li>时间: {{item.time}}</li>
          <li>地点: {{item.location}}</li>
          <li>事件类型: {{stateList[item.type]}}</li>
          <li :title="item.description">事件描述: {{item.description}}</li>
          <li>处置人: {{item.name}}</li>
        </ul>
      </div>
    </div>
    <div slot="footer">
      <Button type="ghost" @click="$emit('close')">取消</Button>
      <Button type="primary" @click="sureAdd">{{type ? '生成二维码并保存' : '保存'}}</Button>
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
    },
    violationLists: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    /* const idNameValidate = (rule, value, callback) => {
      if (this.userForm.identityType === 2) {
        this.$refs.userForm.validateField('cardNo')
        callback()
      } else {
        if (value.trim() === '') {
          callback(new Error('身份信息不能为空'))
        } else {
          callback()
        }
      }
    }
    const cardNoValidate = (rule, value, callback) => {
      if (this.userForm.identityType === 2) {
        if (value.trim() === '' && this.userForm.indentityNo.trim() === '') {
          callback(new Error('教工号和身份证号请填写一个'))
        } else {
          callback()
        }
      } else {
        if (value.trim() === '') {
          callback(new Error('身份证号不能为空'))
        } else {
          callback()
        }
      }
    } */
    const nameValidate = (rule, value, callback) => {
      const reg = /^[a-zA-Z\u4e00-\u9fa5]+$/
      if (reg.test(value)) {
        callback()
      } else if (value.trim() === '') {
        callback(new Error('请输入姓名'))
      } else {
        callback(new Error('仅支持汉字和字母'))
      }
    }
    const telValidate = (rule, value, callback) => {
      if (/^[0-9]+$/.test(value) || value === '' || value === undefined) {
        callback()
      } else {
        callback(new Error('仅支持数字'))
      }
    }
    const ageValidate = (rule, value, callback) => {
      if (/^[0-9]+$/.test(value) && Number(value) >= 10) {
        callback()
      } else if (value.trim() === '') {
        callback()
      } else {
        callback(new Error('请输入10-99数字'))
      }
    }
    const numberPlateValidate = (rule, value, callback) => {
      if (/^(\u7535\u52a8\u4e09\u8f6e|RUC)\s\S+$/.test(value)) {
        callback()
      } else {
        callback(new Error('电动三轮/RUC和车牌号中间请键入一个空格'))
      }
    }
    return {
      isShow: this.model,
      identity: [
        {value: 0, label: '职工'},
        {value: 1, label: '学生'},
        {value: 2, label: '外聘'},
        {value: 3, label: '家属'},
        {value: 4, label: '其他'}
      ],
      userForm: {
        identityType: 0,
        indentityNo: '',
        studentType: 0,
        cardNo: '',
        personType: 0,
        name: '',
        sex: 0,
        tel: '',
        address: '',
        age: '',
        registerTime: '',
        remark: ''
      },
      carForm: {
        image: '',
        isOneSelf: 1,
        isInvoice: 1,
        buyTime: '',
        numberPlateType: 0,
        numberPlate: '',
        schoolCardNo: '',
        brand: '',
        color: '',
        state: 0
      },
      startTime: '', // 有效开始日期
      endTime: '', // 有效结束日期
      stateList: {
        0: '伪造车证',
        1: '涂改车证',
        2: '转借车证',
        3: '辱骂车辆管理人员',
        4: '与车辆管理人员发生纠纷',
        5: '其他'
      },
      userRuleDefault: {
        // indentityNo: [
        //   {validator: idNameValidate, trigger: 'blur'}
        // ],
        // cardNo: [
        //   {validator: cardNoValidate, trigger: 'blur'}
        // ],
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
          {validator: nameValidate, trigger: 'change'}
        ],
        tel: [
          // {required: true, message: '请填写联系电话', trigger: 'blur'},
          {validator: telValidate, trigger: 'change'}
        ],
        // address: [
        //   {required: true, message: '请填写住址信息', trigger: 'blur'}
        // ],
        age: [
          // {required: true, message: '请填写年龄信息', trigger: 'blur'},
          {validator: ageValidate, trigger: 'blur'}
        ]
        // registerTime: [
        //   {required: true, message: '请填写入学时间', trigger: 'change'}
        // ]
      },
      carRules: {
        // buyTime: [
        //   {required: true, type: 'string', message: '请填写购买时间', trigger: 'change'}
        // ],
        numberPlate: [
          {required: true, message: '请填写车辆编号', trigger: 'blur'},
          {validator: numberPlateValidate, trigger: 'blur'}
        ]
        // brand: [
        //   {required: true, message: '请填写品牌', trigger: 'blur'}
        // ],
        // color: [
        //   {required: true, message: '请填写颜色', trigger: 'blur'}
        // ]
      },
      DateOptions: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      }
      /* violationLists: [
        {
          time: '2019年1月20日 15:20:23',
          location: '教学楼3楼',
          type: 1,
          description: '挪车不听劝阻，辱骂安保人员',
          name: '张队'
        },
        {
          time: '2019年1月20日 15:20:23',
          location: '教学楼3楼',
          type: 1,
          description: '挪车不听劝阻，辱骂安保人员',
          name: '张队'
        },
        {
          time: '2019年1月20日 15:20:23',
          location: '教学楼3楼',
          type: 1,
          description: '挪车不听劝阻，辱骂安保人员',
          name: '张队'
        },
        {
          time: '2019年1月20日 15:20:23',
          location: '教学楼3楼',
          type: 1,
          description: '挪车不听劝阻，辱骂安保人员',
          name: '张队'
        }
      ] */
    }
  },
  computed: {
    idName() {
      let name = ''
      switch (this.userForm.identityType) {
        case 0:
        case 2:
          name = '教工号'
          break
        case 1:
          name = '学工号'
          break
        case 3:
        case 4:
          name = '身份证号'
          break
      }
      return name
    }
  },
  created() {
    if (!this.type) {
      this.carForm = JSON.parse(JSON.stringify(this.vehicleInfo.nonVehiclesInfos))
      if (this.carForm.periodOfValidity) {
        this.startTime = this.carForm.periodOfValidity.split('&')[0]
        this.endTime = this.carForm.periodOfValidity.split('&')[1]
      }
      this.userForm = {
        ...this.vehicleInfo,
        ...this.vehicleInfo.indentityInfo
      }
      delete this.userForm.indentityInfo
      this.userForm.cardNo = this.userForm.cardNo || ''
      this.userForm.age = this.userForm.age ? (this.userForm.age + '') : ''
      this.userForm.studentType = this.vehicleInfo.indentityInfo.studentType || 0
      this.userForm.personType = this.vehicleInfo.indentityInfo.personType || 0
    }
  },
  methods: {
    ...mapActions(['addNonVehicle', 'editNonVehicle']),
    changeId() {
      this.userForm.indentityNo = ''
    },
    sureAdd() {
      const user = this.userForm
      let indentityInfo = {}
      switch (user.identityType) {
        case 0:
          indentityInfo = {indentityNo: user.indentityNo}
          break
        case 1:
          indentityInfo = {indentityNo: user.indentityNo, studentType: user.studentType, registerTime: user.registerTime}
          break
        case 2:
          indentityInfo = {indentityNo: user.indentityNo, cardNo: user.cardNo}
          break
        case 3:
          indentityInfo = {indentityNo: user.indentityNo, personType: user.personType}
          break
        case 4:
          indentityInfo = {indentityNo: user.indentityNo}
          break
      }
      if (this.startTime && this.endTime) {
        this.carForm.periodOfValidity = this.startTime + '&' + this.endTime
      }
      const param = {
        orgId: this.orgName.id,
        identityType: user.identityType,
        name: user.name,
        sex: user.sex,
        tel: user.tel,
        address: user.address,
        age: user.age ? Number(user.age) : '',
        remark: user.remark,
        nonVehiclesInfos: this.carForm,
        indentityInfo
      }
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.$refs.carForm.validate(val => {
            if (val) {
              // if (!this.carForm.image) {
              //   this.warningMsg('请上传车辆图片')
              //   return
              // }
              if (this.startTime && this.endTime) {
                if (this.startTime.valueOf() > this.endTime.valueOf()) {
                  this.warningMsg('有效期开始时间不能大于结束时间')
                  return
                }
              }
              if (this.type) {
                // 添加
                this.addNonVehicle(param).then(() => {
                  this.successMsg('添加成功')
                  this.$parent.getNonVehicleList()
                  this.$emit('close')
                }).catch((err) => {
                  console.log(err.response)
                  this.warningMsg(err.response.data.messgae)
                })
              } else {
                // 修改
                const payload = {
                  id: this.vehicleInfo._id,
                  body: param
                }
                this.editNonVehicle(payload).then(() => {
                  this.successMsg('修改成功')
                  this.$parent.getNonVehicleList()
                  this.$emit('close')
                }).catch((err) => {
                  this.warningMsg(err.response.data.messgae)
                })
              }
            }
          })
        }
      })
    },
    uploadLaneSuc(response) {
      this.$set(this.carForm, 'image', response.path)
    }
  }
}
</script>

<style scoped lang='less'>
.add-content {
  display: flex;
}
.photo {
  width: 100px;
  height: 100px;
  text-align: center;
  border: 1px solid #5676a9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
}
.picture {
  width: 100px;
  height: 100px;
  border: 1px solid #5676a9;
  vertical-align: middle;
  cursor: pointer;
}
.record-box {
  display: flex;
  flex-wrap: wrap;
  height: 100px;
  overflow-y: auto;
  ul {
    width: 350px;
    padding-left: 80px;
    margin-bottom: 12px;
    li {
      width: 250px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
