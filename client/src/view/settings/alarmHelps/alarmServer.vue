<template>
  <div class="bs-main" id="alarmServer">
    <div class="panel">服务器配置</div>
    <div style="padding-left: 24px; margin-top: 12px;">
      <Form label-position="left" :label-width="120" :model="serverData" :rules="alarmRule" ref="serverData">
        <Form-item label="服务器名称" prop="name">
          <Input style="width:500px" v-model="serverData.name" />
        </Form-item>
        <Form-item label="ip地址" prop="ip">
          <Input style="width:500px" v-model="serverData.ip" />
        </Form-item>
        <Form-item label="端口" prop="cport" :rules="{type: 'number',required:true,trigger:'blur',validator: cportRule}">
          <Input style="width:500px" v-model="serverData.cport" number/>
        </Form-item>
        <Form-item label="用户名" prop="username">
          <Input style="width:500px" v-model="serverData.username" />
        </Form-item>
        <Form-item label="密码" prop="password">
          <Input style="width:500px" type="password" v-model="serverData.password" />
        </Form-item>
        <!-- <Form-item label="Adapter地址" prop="ip">
          <Input style="width:500px" v-model="serverData.adapterIp" />
        </Form-item>
        <Form-item label="Adapter端口" prop="adapterport" :rules="{type: 'number',required:true,trigger:'blur',validator: adapterportRule}">
          <Input style="width:500px" v-model="serverData.adapterPort" number/>
        </Form-item> -->
      </Form>
    </div>
    <div slot="footer" style="padding-left: 24px;">
      <Button type="primary" :loading="serverLoad" @click="Ok('serverData')" v-if="$BShasPower('BS-ALARMHELP-SERVER-CONF')">保存</Button>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import allPage from './allPage.js'

export default {
  name: 'alarmServer',
  mixins: [allPage],
  data() {
    return {
      serverData: {
        name: '',
        ip: '0.0.0.0',
        cport: 2048,
        username: 'admin',
        password: 'admin'
        // adapterIp: "",
        // adapterPort: 8765
      },
      serverLoad: false
    }
  },
  computed: {
    ...mapState({
      alarmHelpServer: ({ alarmHelps }) => alarmHelps.alarmHelpServer
    })
  },
  methods: {
    ...mapActions(['getAlarmHelpServer', 'setAlarmHelpServer']),
    getData() {
      this.getAlarmHelpServer()
        .then(() => {
          this.alarmHelpServer && (this.serverData = JSON.parse(JSON.stringify(this.alarmHelpServer)))
        })
        .catch(() => {
          this.errorMsg('获取服务器配置数据失败')
        })
    },
    Ok(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.serverLoad = true
          this.setAlarmHelpServer(this.serverData)
            .then(() => {
              this.serverLoad = false
              this.successMsg('保存成功')
            })
            .catch(() => {
              this.serverLoad = false
              this.errorMsg('保存服务器配置数据失败')
            })
        }
      })
    },
    adapterportRule(rule, value, callback) {
      let data = this.serverData.adapterPort
      this.portrule(data, callback)
    },
    cportRule(rule, value, callback) {
      let data = this.serverData.cport
      this.portrule(data, callback)
    },
    portrule(data, callback) {
      if (data !== '' || data !== undefined) {
        if (!Number.isInteger(data)) {
          return callback(new Error('请输入数字'))
        } else {
          if (data > 65535) {
            return callback(new Error('超出范围0-65535'))
          } else {
            return callback()
          }
        }
      } else {
        return callback(new Error('端口不能为空'))
      }
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style scoped>
.bs-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  font-size: 12px;
  width: 100%;
  height: 100%;
  margin-top: -20px;
}
.panel {
  width: 100%;
  height: 40px;
  padding: 0 0 0 16px;
  font-size: 14px;
  color: #fff;
  background-color: #0f2243;
  line-height: 40px;
}
</style>
