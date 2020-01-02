<template id="mapSet">
  <div class="mapSet">
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <Form-item label="服务名" prop="name" :label-width="80">
            <Input  v-model="formValidate.name" placeholder="请输入服务名"></Input>
        </Form-item>
        <Form-item label="中心点" prop="center" :label-width="80">
            <Input  v-model="formValidate.center" placeholder="请输入中心点"></Input>
        </Form-item>
        <Form-item label="级别" prop="zoomLevel" :label-width="80">
            <Input  v-model="formValidate.zoomLevel" placeholder="请输入级别"></Input>
        </Form-item>
        <Form-item label="地图范围" prop="extent" :label-width="80">
            <Input v-model="formValidate.extent" placeholder="请输入地图范围"></Input>
        </Form-item>
        <Form-item>
            <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
            <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </Form-item>
   </Form>
   </div>
</template>
<script>
export default {
  name: 'MapSetting',
  data() {
    return {
      formValidate: {
        name: '',
        center: '',
        zoomLevel: '0',
        extent: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '服务名不能为空', trigger: 'blur' }
        ],
        center: [
          { required: true, message: '中心点不能为空', trigger: 'blur' }
        ],
        zoomLevel: [
          { required: true, message: '级别不能为空', trigger: 'blur' }
        ],
        extent: [
          { required: true, message: '地图范围不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
  },
  computed: {
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.$http.get('/api/mapinfos/').then(function(res) {
        let data = res.bodyText
        this.formValidate.name = JSON.parse(data).addr
        this.formValidate.center = JSON.parse(data).center
        this.formValidate.zoomLevel = JSON.parse(data).zoomLevel + ''
        this.formValidate.extent = JSON.parse(data).extent
      }, (err) => {
        console.log(err)
      })
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.put('/api/mapinfos/', { addr: this.formValidate.name, center: this.formValidate.center, zoomLevel: Number(this.formValidate.zoomLevel), extent: this.formValidate.extent }).then(function(res) {
            this.$Message.success('提交成功!')
          }, function(erro) {
            this.$Message.success('提交失败!')
          })
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    },
    handleReset(name) {
      this.$refs[name].resetFields()
    }
  },
  mounted() {
  },
  beforeDestroy() {
  }
}
</script>
<style scoped>
  .mapSet {
    width: calc(111% - 280px);;
    float: left;
    padding: 50px 257px 35px 502px;
    zoom: 1.2;
  }

</style>
