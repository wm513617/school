<template>
  <Modal :mask-closable="false" v-model="userModal" width="600" :title="isEdit?'修改用户':'新建用户'" @on-cancel="cancel('baseInformation')">
    <!--基础信息部分-->
    <div style="display:flex;">
      <div class="modal-left">
        <Form ref="baseInformation" :model="getUserList" :rules="ruleValidate" :label-width="80" label-position="left">
          <Form-item label="用户名" prop="username">
            <Input v-model.trim="getUserList.username" type="text" :disabled="isEdit" :maxlength="64"></Input>
          </Form-item>
          <Form-item label="密码" prop="password" v-show="!isEdit">
            <Input type="password" v-model.trim="getUserList.password" :maxlength="12"></Input>
          </Form-item>
          <Form-item label="确认密码" prop="pwdCheck" v-show="!isEdit">
            <Input type="password" v-model.trim="getUserList.pwdCheck" :maxlength="12"></Input>
          </Form-item>
          <Form-item label="真实姓名" prop="realname">
            <Input type="text" v-model.trim="getUserList.realname" :disabled="isEdit" :maxlength="64"></Input>
          </Form-item>
          <Form-item label="手机号码" prop="phone">
            <Input type="text" v-model.trim="getUserList.phone" :maxlength="11"></Input>
          </Form-item>
          <Form-item label="NFC卡号" prop="nfc" v-show="getUserList.carLogin">
            <Input type="text" v-model.trim="getUserList.nfc" :maxlength="64"></Input>
          </Form-item>
          <Form-item label="工号" prop="id">
            <Input type="text" v-model.trim="getUserList.id" :maxlength="64"></Input>
          </Form-item>
          <Form-item label="职务" prop="position">
            <Input type="text" v-model.trim="getUserList.position" :maxlength="64"></Input>
          </Form-item>
          <Form-item label="所属机构">
            <Input v-model="orgActiveName" disabled></Input>
          </Form-item>
          <Form-item label="状态">
            <Select v-model="getUserList.status">
              <Option v-for="item in userStatus" :value="item.value" :key="item.value">{{ item.label }}
              </Option>
            </Select>
          </Form-item>
          <Form-item label="有效期">
            <Row>
              <Col span="17">
              <Date-picker type="date" placeholder="选择日期" v-model="getUserList.period.expried" :disabled="getUserList.period.unlimited" :placement="direction" :clearable="false" style="200px" :options="{ disabledDate(date) { return date && date.valueOf() <= nowTime } }"></Date-picker>
              </Col>
              <Checkbox v-model="getUserList.period.unlimited">无期限</Checkbox>
            </Row>
          </Form-item>
          <Form-item label="登录方式">
            <Checkbox v-model="getUserList.passWordLogin" disabled>账号密码登录</Checkbox>
            <Checkbox v-model="getUserList.carLogin">刷卡登陆</Checkbox>
          </Form-item>
          <Form-item label="拍照报班">
            <RadioGroup v-model="getUserList.pictureLogin">
                <Radio :label="true">是</Radio>
                <Radio :label="false">否</Radio>
            </RadioGroup>
          </Form-item>
          <Form-item label="轨迹颜色">
            <ColorSelect v-model="getUserList.selectedColor"></ColorSelect>
          </Form-item>
        </Form>
      </div>
      <div class="modal-right">
        <div style="width:140px;height:140px;margin: 0 auto;margin-bottom:10px;border:1px dotted #fff">
          <img v-show="getUserList.photo" :src="getUserList.photo" style="width:100%;height:100%" />
        </div>
        <div style="margin: 0 auto">
          <Upload ref="upload" action="/api/upload/file?type=image" name="file" :max-size="20480" :format="['jpg','png','bmp','jpeg']" :on-exceeded-size="exceededSize" :on-success="uploadLaneSuc" :on-format-error="laneFormatError" :show-upload-list="false" style="text-align:center">
            <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
          </Upload>
        </div>
      </div>
    </div>
    <div slot="footer">
      <Button type="ghost" @click="cancel('baseInformation')">取消</Button>
      <Button type="primary" @click="save('baseInformation')">确定</Button>
    </div>
  </Modal>
</template>

<script>
import ColorSelect from '../../map3DEdit/panelTools/map3DGrid/EditSelect'
export default {
  components: {
    ColorSelect
  },
  props: {
    modalShow: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    getUserList: {
      type: Object
    },
    orgActiveName: {
      type: String
    }
  },
  data() {
    // 64位字符
    const verifyName = (rule, value, callback) => {
      let nativecode = value.split('')
      let len = 0
      for (let i = 0; i < nativecode.length; i++) {
        let code = Number(nativecode[i].charCodeAt(0))
        if (code > 127) {
          len += 2
        } else {
          len++
        }
      }
      if (len > 64) {
        return callback(new Error('不能超过64位字符'))
      } else {
        callback()
      }
    }
    // 密码
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else {
        let reg = /^([A-Za-z0-9]){6,12}$/
        if (!reg.test(value)) {
          callback(new Error('6-12位数字或者字母'))
        } else {
          callback()
        }
      }
    }
    // 确认密码
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.getUserList.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      userModal: false,
      // getUserList: {
      //   username: '',
      //   password: '',
      //   pwdCheck: '',
      //   realname: '',
      //   id: '',
      //   position: '',
      //   affiliation: this.orgActiveId,
      //   status: '1',
      //   photo: '',
      //   period: {
      //     unlimited: true,
      //     expried: this.$moment(new Date().setMonth(new Date().getMonth() + 1)).format('YYYY-MM-DD')
      //     // new Date().setMonth(new Date().getMonth() + 1)
      //   }
      // },
      // 状态
      userStatus: [
        { value: '1', label: '启用' },
        { value: '2', label: '禁用' }
      ],
      direction: 'top',
      ruleValidate: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'change' },
          { validator: verifyName, trigger: 'change' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'change' }
        ],
        pwdCheck: [
          { required: true, validator: validatePassCheck, trigger: 'change' }
          // { validator: validatePassCheck, trigger: 'change' }
        ],
        realname: [
          { required: true, message: '真实姓名不能为空', trigger: 'change' },
          { validator: verifyName, trigger: 'change' }
        ],
        // id: [
        //   { required: true, message: '工号不能为空', trigger: 'change' },
        //   { validator: verifyName, trigger: 'change' }
        // ],
        position: [
          { validator: verifyName, trigger: 'change' }
        ]
      },
      nowTime: new Date(new Date().setHours(0, 0, 0, 0))
    }
  },
  computed: {
  },
  watch: {
    'modalShow'(val) {
      if (val !== this.userModal) {
        this.userModal = val
      }
    },
    getUserList: {
      handler: function(val) {
        if (val) {
          this.getUserList = val
        }
      },
      deep: true
    }
  },
  methods: {
    cancel(name) {
      this.$refs[name].resetFields()
      this.$emit('cancel')
    },
    save(name) {
      console.log(this.getUserList, 'this.getUserList')
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$emit('save', this.getUserList, name)
        }
      })
    },
    uploadLaneSuc(response) {
      this.getUserList.photo = response.path
    },
    laneFormatError(file) {
      this.warningMsg('文件 ' + file.name + ' 格式不正确，请上传 jpg, png, bmp 或 jpeg 格式的图片。')
    },
    exceededSize(file) {
      this.warningMsg('图片 ' + file.name + ' 大小超过限制，请上传小于20M的图片。')
    }
  }
}
</script>

<style scoped>
.modal-left {
  flex: 0 0 400px;
}

.modal-left form {
  width: 400px;
}

.modal-right {
  flex: 1;
  justify-content: center;
}
</style>
