<template>
  <div class="bs-main" id="alarmServer">
    <div class="panel">服务器配置</div>
    <div style="padding-left: 24px; margin-top: 12px;">
      <Form label-position="left" :label-width="120" :model="serverData" :rules="alarmRule" ref="serverData">
        <Form-item label="服务器名称" prop="name">
          <Input style="width:500px" v-model="serverData.name" :maxlength="64" />
        </Form-item>
        <Form-item label="ip地址" prop="ip">
          <Input style="width:500px" v-model="serverData.ip" />
        </Form-item>
        <Form-item label="端口" prop="cport" :rules="{required:true,trigger:'blur',validator: portRule}">
          <Input style="width:500px" v-model="serverData.cport"/>
        </Form-item>
        <Form-item label="用户名" prop="username">
          <Input style="width:500px" v-model="serverData.username" :maxlength="64" />
        </Form-item>
        <Form-item label="密码" prop="password">
          <Input style="width:500px" type="password" v-model="serverData.password" :maxlength="64" />
        </Form-item>
        <Form-item label="存储服务器" prop="dsServer">
          <Select v-model="serverData.dsServer" style="width:500px">
            <Option v-for="item in serverStoreList" :key="item.value" :value="item.value">{{item.label}}</Option>
          </Select>
        </Form-item>
        <Form-item label="存储路径" prop="dsPath">
          <Select v-model="serverData.dsPath" style="width:500px">
            <Option v-for="item in getServerPath" :key="item.value" :value="item.value">{{item.label}}</Option>
          </Select>
        </Form-item>
      </Form>
    </div>
    <div slot="footer" style="padding-left: 24px;">
      <Button type="primary" :loading="serverLoad" @click="Ok('serverData')">保存</Button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import allPage from './allPage.js'

export default {
  name: 'talkServer',
  mixins: [allPage],
  data() {
    return {
      serverData: {
        name: '',
        ip: '0.0.0.0',
        cport: 2048,
        username: 'admin',
        password: 'admin',
        dsServer: '',
        dsPath: ''
      },
      serverLoad: false,
      getServerPath: [],
      serverStoreList: []
    }
  },
  computed: {
    ...mapState({
      talkServer: ({ talkConfig }) => talkConfig.talkServer
    }),
    ...mapGetters(['getStorePath'])
  },
  methods: {
    ...mapActions(['getTalkServer', 'editTalkServer', 'getStorageServer']),
    getData() {
      this.getTalkServer()
        .then(() => {
          this.serverData = JSON.parse(JSON.stringify(this.talkServer))
          this.serverData.dsServer = this.serverData.dsServer || (this.serverStoreList[0] && this.serverStoreList[0].value)
          this.serverData.dsPath = this.serverData.dsPath || this.getServerPath[0].value
          // this._detectionServerStore()
        })
        .catch(() => {
          this.errorMsg('获取服务器配置数据失败')
        })
    },
    Ok(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.serverLoad = true
          this.editTalkServer(this.serverData)
            .then(() => {
              this.serverLoad = false
              this.getData()
              this.successMsg('保存成功')
            })
            .catch(() => {
              this.serverLoad = false
              this.errorMsg('保存服务器配置数据失败')
            })
        }
      })
    },
    _serverStoreDataFn(arr) {
      let list = []
      for (let i = 0; i < arr.length; i++) {
        list.push({ value: arr[i], label: arr[i] })
      }
      return list
    },
    _detectionServerStore() {
      let list
      for (let i = 0; i < this.serverStoreList.length; i++) {
        let item = this.serverStoreList[i]
        if (this.serverData.dsServer === item.value) {
          console.log('ds---detection')
        } else {
          list = { value: this.serverData.dsServer, label: this.serverData.dsServer }
        }
      }
      if (list) {
        this.serverStoreList.push(list)
      }
      return false
    },
    portRule(rule, value, callback) {
      let data = value
      this.portValidate(data, callback)
    },
    portValidate(data, callback) {
      if (data !== '' && data !== undefined) {
        if (!Number.isInteger(Number(data))) {
          return callback(new Error('请输入数字'))
        } else {
          if (Number(data) > 65535) {
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
    this.getStorageServer({ servername: 'ds' })
      .then(suc => {
        let data = suc.data
        this.serverStoreList = this._serverStoreDataFn(data)
      })
      .catch(err => {
        console.log('get server err' + err)
      })
    this.getServerPath = JSON.parse(JSON.stringify(this.getStorePath))
    this.getServerPath.forEach((item, i) => {
      item.value = item._id
      item.label = item.path
    })
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
