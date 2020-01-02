<template>
  <div v-if="show">
		<!-- 添加人员弹窗 -->
    <div class='alarm-modal-mask'></div>
    <div class='alarm-wrap'>
      <div class='ivu-modal'>
        <div class='ivu-modal-content'>
          <div class='ivu-modal-header'>
            <div class='ivu-modal-header-inner'>人员入库</div>
          </div>
          <div class='ivu-modal-body over clearfix'>
            <Form class="from-size" :model="passer" :rules="inforules" ref="passerValidate" inline :label-width="75">
							<FormItem  label="姓名" prop="name">
								<Input type="text" v-model="passer.name" placeholder="请输入姓名">
								</Input>
							</FormItem>
							<FormItem  label="底库选择" prop="group">
								<Select v-model="passer.group">
                  <Option v-for="(item,j) in baseraryChange" :key="j" :value="item.label">{{item.value}}</Option>
								</Select>
							</FormItem>
							<FormItem  label="性别" prop="gender">
								 <RadioGroup v-model="passer.gender">
										<Radio label="男"></Radio>
										<Radio label="女"></Radio>
								</RadioGroup>
							</FormItem>
							<FormItem  label="年龄" prop="age">
								<Input v-model="passer.age" style="width:254px;" placeholder="请输入年龄"></Input>
								</Input>
							</FormItem>
							<FormItem  label="身份证号" prop="code">
								<Input type="text" v-model="passer.code"  placeholder="请输入身份证号">
								</Input>
							</FormItem>
							<FormItem  label="备注" prop="remark">
								<Input type="textarea" v-model="passer.remark" placeholder="请添加备注">
								</Input>
							</FormItem>
						</Form>
						<div class="upload-icon">
                <img :src="imageUrl?imageUrl:'/static/noImg1.png'"/>
							<div>
								<span class="iconfont icon-info">支持JPG、JPEG、PNG、BMP格式的图片，建议有效人脸像素80-200，图片分辨率请勿过大</span>
							</div>
						</div>
          </div>
          <div class='ivu-modal-footer'>
						<Button type="primary" @click="$emit('close')">取消</Button>
            <Button type="primary" @click="addUser()">确认</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { validateName, validateAge, validateIdentity, validateDesc, validateGroup } from '../common/validate'
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      inforules: {
        name: [{ required: true, validator: validateName, trigger: 'change' }],
        age: [{ validator: validateAge, trigger: 'change' }],
        code: [{ validator: validateIdentity, trigger: 'change' }],
        remark: [{ validator: validateDesc, trigger: 'change' }],
        group: [{ required: true, validator: validateGroup, trigger: 'change' }]
      },
      passer: {
        gender: '男',
        name: '',
        group: '',
        age: '',
        code: '',
        remark: '',
        image: ''
      }
    }
  },
  computed: {
    ...mapState({
      baserary: state => state.veriface.baserary
    }),
    baseraryChange() {
      let list = JSON.parse(JSON.stringify(this.baserary))
      for (let i = 0; i < list.length; i++) {
        if (list[i].value === '路人库') {
          list.splice(i, 1)
        }
      }
      return list
    }
  },
  created() {
    this.getbaserary()
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    imageUrl: {
      type: String,
      default: ''
    }
  },
  mounted() {},
  methods: {
    ...mapActions(['getbaserary', 'addManageUser']),
    addUser() {
      const passer = {
        name: this.passer.name,
        group: this.passer.group,
        gender: this.passer.gender === '男' ? '2' : '1',
        age: this.passer.age,
        code: this.passer.code,
        remark: this.passer.remark,
        image: this.imageUrl
      }
      this.$refs.passerValidate.validate(valid => {
        if (valid) {
          this.addManageUser(passer)
            .then(() => {
              this.$emit('close')
              this.successMsg('人员入库成功')
            })
            .catch(() => { this.errorMsg('添加失败！') })
        }
      })
    }
  }
}
</script>
<style scoped>
.alarm-wrap {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
.alarm-modal-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #000813;
  opacity: 0.7;
  height: 100%;
  z-index: 9;
}
.ivu-modal {
  position: absolute;
  left: calc(50% - 410px);
  top: calc(50% - 345px);
}
.ivu-modal-body {
  padding: 24px;
  min-width: 652px;
}
.ivu-modal-body .from-size {
  float: left;
  display: flex;
  flex-direction: column;
  width: 340px;
}
.upload-icon {
  float: right;
  width: 240px;
  text-align: center;
  margin-left: 24px;
}
.upload-icon span {
  color: #aaa;
  font-size: 14px;
}
.upload-icon img {
  width: 158px;
  height: 200px;
}
.clearfix:after {
  content: '.';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
</style>
