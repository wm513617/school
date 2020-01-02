<template>
  <!--视频通道资源 模态框-->
  <Modal :mask-closable="false" v-model="doorManage.doorManageModal" :title="doorManage.title" width="500">
    <Form :model="formData" :label-width="130" :rules="formValidate" ref="formData" label-position="left">
       <Form-item label="门禁设备名称" prop="name">
          <Input v-model="formData.name"></Input>
       </Form-item>
       <Form-item label="门禁设备厂家" prop="home">
        <Select v-model="formData.home">
          <Option value="1">31232133</Option>
        </Select>
      </Form-item>
       <Form-item label="门禁设备型号" prop="model">
        <Select v-model="formData.model">
          <Option value="1">31232133</Option>
        </Select>
      </Form-item>
      <Form-item label="IP地址" prop="ip">
          <Input v-model="formData.ip"></Input>
      </Form-item>
      <Form-item label="控制端口" prop="port">
          <InputNumber v-model="formData.port" size="small"></InputNumber>
      </Form-item>
      <Form-item label="用户名" prop="username">
          <Input v-model="formData.username"></Input>
      </Form-item>
      <Form-item label="密码" prop="passwd">
          <Input v-model="formData.passwd"></Input>
      </Form-item>
      <Form-item label="是否控制远程开关门">
        <RadioGroup v-model="openDoor">
          <Radio label="1">是</Radio>
          <Radio label="2">否</Radio>
        </RadioGroup>
      </Form-item>
      <Form-item label="是否获取门禁机构">
        <RadioGroup v-model="institutions">
          <Radio label="1">是</Radio>
          <Radio label="2">否</Radio>
        </RadioGroup>
      </Form-item>
    </Form>
    <div slot="footer">
      <Button type="ghost" @click="cancelDoor('formData')">取消</Button>
      <Button type="primary" @click="saveDoor('formData')">确定</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  data() {
    return {
      openDoor: '1',
      institutions: '1',
      // 弹窗数据
      formData: {
        name: '3433424',
        home: '1',
        model: '1',
        ip: '192.168.18.29',
        port: 3721,
        username: 'admin',
        passwd: '123456'
      },
      // 验证规则
      formValidate: {}
    }
  },
  props: {
    // 弹窗数据
    // formData: {
    //   type: Object
    // }
    // 弹窗展示
    doorManage: {
      type: Object
    }
  },
  watch: {},
  methods: {
    cancelDoor(name) {
      this.$emit('cancelDoor')
    },
    saveDoor(name) {
      this.$emit('saveDoor')
    }
  }
}
</script>
<style scoped>
.confirm {
  margin-bottom: 10px;
  display: flex;
}

.confirm-time {
  width: 150px;
  margin-left: 20px;
}
.confirm-upload {
  height: 30px;
  display: flex;
  margin-left: 20px;
}
.check-input .ivu-col-span-8 {
  width: 100px;
  height: 32px;
  line-height: 32px;
}
.check-input .ivu-col-span-16 {
  width: 316px;
  height: 56px;
}
</style>
