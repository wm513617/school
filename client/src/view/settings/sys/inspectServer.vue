<template>
  <div class="faceServer">
    <Row class="content">
      <Col span="24">
      <Form :model="serverItem" :label-width="100" label-position="left" ref="sysForm" :rules="serverRuleValidate">
        <Form-item label="巡课服务地址" prop="ip">
          <Bsipv4 v-model="serverItem.ip" style="width:300px"></Bsipv4>
        </Form-item>
      </Form>
      <div class="footer">
        <Button type="primary" @click="save" :loading="sureLoading">保存</Button>
      </div>
      </Col>
    </Row>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import Bsipv4 from '../../../components/BSIPV4.vue'
export default {
  components: {
    Bsipv4
  },
  data() {
    return {
      sureLoading: false,
      serverItem: {
        ip: '0.0.0.0'
      },
      serverRuleValidate: {
        ip: [
          { required: true, message: 'ip地址不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getFaceServer().then((resp) => {
      this.serverItem.ip = resp.host
    }).catch((err) => {
      console.log('getPlatform error: ' + err)
    })
  },
  methods: {
    ...mapActions(['getFaceServer', 'setFaceServer']),
    save() {
      this.sureLoading = true
      this.$refs.sysForm.validate((valid) => {
        if (!valid) {
          this.$Notice.error({
            title: '表单验证失败'
          })
          this.sureLoading = false
        } else {
          this.setFaceServer(this.serverItem.ip).then(res => {
            this.sureLoading = false
            this.$Notice.success({
              title: '成功',
              desc: '参数保存成功！',
              duration: 2,
              top: 200
            })
          }).catch((err) => {
            console.log('setFaceServer error: ' + err)
            this.sureLoading = false
            this.$Notice.warning({
              title: '失败',
              desc: '参数保存失败！',
              duration: 2,
              top: 200
            })
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.faceServer {
  padding: 20px;
  width: 100%;
  height: 100%;
}
.faceServer .content{
  width: 100%;
  height: 100%;
  background: #1B3153;
}
.footer {
  margin-top: 40px;
}

.footer button {
  width: 100px;
}
</style>
