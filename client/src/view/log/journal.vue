<template>
  <div class="log bs-content">
    <div class="log-content">
      <Tabs :animated="false" @on-click="tabClick">
        <!--按钮组-->
        <div class="log-btn">
          <Button type="ghost" icon="ios-search" @click="findClick">查询</Button>
          <Button type="ghost" icon="refresh" @click="refreshClick">刷新</Button>
          <Button type="ghost" icon="arrow-down-c" @click="outClick">导出</Button>
        </div>
        <Tab-pane label="登录日志" name="loginLog">
          <loginLog></loginLog>
        </Tab-pane>
        <Tab-pane label="操作日志" name="operationLog">
          <operationLog></operationLog>
        </Tab-pane>
        <Tab-pane label="系统日志" name="systemLog">
          <systemLog></systemLog>
        </Tab-pane>
        <Tab-pane label="视频日志" name="videoLog">
          <videoLog></videoLog>
        </Tab-pane>
      </Tabs>
    </div>
    <!--查询筛选弹出框-->
    <Modal v-model="alarmmodal" title="详细信息" width="500">
      <div class="modalMessage1" v-if="loginModal">
        <Form :model="formItem" :label-width="100" label-position="left">
          <FormItem label="任务类型">
            <Select v-model="formItem.taskType" placeholder="请选择">
              <Option v-for="item in taskTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="用户">
            <Select v-model="formItem.user" placeholder="请选择">
              <Option v-for="item in userList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="日志时间">
            <Select v-model="formItem.logTime" placeholder="请选择">
              <Option v-for="item in logTimeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <div class="start-time">
              <i>从</i>
              <Date-picker type='datetime' placeholder="选择开始日期和时间" style="width: 220px" :editable="false" :clearable="false" v-model="formItem.startTime"></Date-picker>
            </div>
            <div class="start-time">
              <i>到</i>
              <Date-picker type='datetime' placeholder="选择开始日期和时间" style="width: 220px" :editable="false" :clearable="false" v-model="formItem.endTime"></Date-picker>
            </div>
          </FormItem>
        </Form>
      </div>
      <div class="modalMessage2" v-if="operationModal">
        <Form :model="formItem" :label-width="100" label-position="left">
          <FormItem label="任务类型">
            <Select v-model="formItem.taskType" placeholder="请选择">
              <Option v-for="item in taskTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="用户">
            <Select v-model="formItem.user" placeholder="请选择">
              <Option v-for="item in userList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="日志时间">
            <Select v-model="formItem.logTime" placeholder="请选择">
              <Option v-for="item in logTimeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <div class="start-time">
              <i>从</i>
              <Date-picker type='datetime' placeholder="选择开始日期和时间" style="width: 220px" :editable="false" :clearable="false" v-model="formItem.startTime"></Date-picker>
            </div>
            <div class="start-time">
              <i>到</i>
              <Date-picker type='datetime' placeholder="选择开始日期和时间" style="width: 220px" :editable="false" :clearable="false" v-model="formItem.endTime"></Date-picker>
            </div>
          </FormItem>
          <FormItem label="关键字">
            <Input v-model="formItem.keyword" placeholder="请输入..."></Input>
          </FormItem>
        </Form>
      </div>
      <div class="modalMessage3" v-if="doubleModal">
        <Form :model="formItem" :label-width="100" label-position="left">
          <FormItem label="用户">
            <Select v-model="formItem.user" placeholder="请选择">
              <Option v-for="item in userList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="日志时间">
            <Select v-model="formItem.logTime" placeholder="请选择">
              <Option v-for="item in logTimeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <div class="start-time">
              <i>从</i>
              <Date-picker type='datetime' placeholder="选择开始日期和时间" style="width: 220px" :editable="false" :clearable="false" v-model="formItem.startTime"></Date-picker>
            </div>
            <div class="start-time">
              <i>到</i>
              <Date-picker type='datetime' placeholder="选择开始日期和时间" style="width: 220px" :editable="false" :clearable="false" v-model="formItem.endTime"></Date-picker>
            </div>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="ghost" class="modalFindBtn" size="large" @click="modalFindClick">查询</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import loginLog from './logtabs/loginLog'
import operationLog from './logtabs/operationLog'
import systemLog from './logtabs/systemLog'
import videoLog from './logtabs/videoLog'
export default {
  data() {
    return {
      tabName: 'loginLog',
      alarmmodal: false,
      loginModal: true,
      operationModal: false,
      doubleModal: false,
      // 弹出框数据
      formItem: {
        taskType: '',
        user: '',
        logTime: '',
        startTime: this.defaultTime(),
        endTime: new Date(),
        keyword: ''
      },
      taskTypeList: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 'login',
          label: '登陆'
        },
        {
          value: 'exit',
          label: '注销'
        }
      ],
      userList: [
        {
          value: 'all',
          label: '未知'
        }
      ],
      logTimeList: [
        {
          value: '1',
          label: '近1小时'
        }, {
          value: '6',
          label: '近6小时'
        }, {
          value: '12',
          label: '近12小时'
        }, {
          value: '24',
          label: '近24小时'
        }, {
          value: '7',
          label: '近7天'
        }, {
          value: 'defined',
          label: '自定义时间范围'
        }
      ]
    }
  },
  created() {
  },
  methods: {
    defaultTime() {
      var start = new Date()
      start.setHours(0)
      start.setMinutes(0)
      start.setSeconds(0)
      start.setMilliseconds(0)
      return start
    },
    // 获得当前tabs name
    tabClick(name) {
      this.tabName = name
    },
    // 查询
    findClick() {
      this.alarmmodal = true
      if (this.tabName === 'loginLog') {
        console.log('loginLog 弹出框')
        this.loginModal = true
        this.operationModal = false
        this.doubleModal = false
      } else if (this.tabName === 'operationLog') {
        console.log('operationLog 弹出框')
        this.loginModal = false
        this.operationModal = true
        this.doubleModal = false
      } else {
        this.loginModal = false
        this.operationModal = false
        this.doubleModal = true
        if (this.tabName === 'systemLog') {
          console.log('systemLog 弹出框')
        } else {
          console.log('videoLog 弹出框')
        }
      }
    },
    // 刷新
    refreshClick() {
      if (this.tabName === 'loginLog') {
        console.log('systemLog 刷新')
      } else if (this.tabName === 'operationLog') {
        console.log('systemLog 刷新')
      } else if (this.tabName === 'systemLog') {
        console.log('systemLog 刷新')
      } else {
        console.log('videoLog 刷新')
      }
    },
    // 导出
    outClick() {
      if (this.tabName === 'loginLog') {
        console.log('systemLog 导出')
      } else if (this.tabName === 'operationLog') {
        console.log('systemLog 导出')
      } else if (this.tabName === 'systemLog') {
        console.log('systemLog 导出')
      } else {
        console.log('videoLog 导出')
      }
    },
    // 弹出框查询
    modalFindClick() {
      console.log('弹出框查询')
    }
  },
  components: {
    loginLog,
    operationLog,
    systemLog,
    videoLog
  }
}
</script>
<style scoped>
.log {
  padding: 20px 20px;
  width: 100%;
  height: 100%;
}

h3 {
  display: block;
  height: 48px;
  line-height: 48px;
  font-size: 14px;
  padding-left: 10px;
  color: #fff;
  background-color: #5d5d5d;
}

i {
  font-style: normal;
}

.log-filter {
  padding: 10px;
}

.log-content {
  width: 100%;
}

.start-time {
  margin-top: 24px;
}

.start-time i {
  float: left;
  margin-right: 10px;
}

.filter-btn {
  width: 140px;
}

.log-btn {
  margin: 10px;
}

.log-btn button {
  margin-right: 20px;
}

.modalFindBtn {}
</style>
