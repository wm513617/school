<template>
  <div class="bs-main sortShow">
    <div style="flex:1;display: block;height: 100%;background: #1C3053;">
      <div class="panel">报警分类</div>
      <div class="table-relative" style="height:391px;">
        <div class="table-body">
          <Table :height="DefaultHeight" :columns="tableTitle" :data="tableData" size="small"></Table>
        </div>
      </div>
      <div v-if="editClassify">
        <!--报警联动配置模态框-->
        <Modal v-model="editClassify" title="报警联动配置" width="600" @on-cancel="classifyCancel('classData')" :mask-closable="false">
          <Tabs type="card" :value="itemIndex" @on-click="tabIndex">
            <Tab-pane label="联动动作" name="0"></Tab-pane>
            <Tab-pane label="联动规则1" name="1"></Tab-pane>
            <Tab-pane label="联动规则2" name="2"></Tab-pane>
            <Tab-pane label="联动规则3" name="3"></Tab-pane>
            <Tab-pane label="联动规则4" name="4"></Tab-pane>
          </Tabs>
          <div class="detail-info" v-show="itemIndex==='0'">
            <Form label-position="left" :label-width="85" :model="classData" :rules="ruleValidate" ref="classData" style="padding: 0 10px; position: relative;">
              <Form-item label="分类名称" prop="name">
                <Input style="width:335px" v-model="classData.name" />
              </Form-item>
              <Form-item label="启用状态">
                <Select style="width:335px" v-model="useStatus">
                  <Option value="true">启用</Option>
                  <Option value="false">禁用</Option>
                </Select>
              </Form-item>
              <Form-item label="报警级别" prop="alarmLevel">
                <Select style="width:335px" v-model="classData.alarmLevel">
                  <Option v-for="item in this.levelData" :value="item.level" :key="item.level">{{ item.level}}</Option>
                </Select>
              </Form-item>
              <Form-item label="布撤防时间" prop="timeTemplate">
                <Select style="width:335px" v-model="classData.timeTemplate">
                  <Option v-for="item in this.tempData" :value="item._id" :key="item._id">{{ item.name }}</Option>
                </Select>
              </Form-item>
              <Form-item label="最大延时" prop="maxDelay">
                <Input style="width:335px" v-model="classData.maxDelay" />
              </Form-item>
              <Form-item label="最小间隔" prop="minInterval">
                <Input style="width:335px" v-model="classData.minInterval" />
              </Form-item>
              <div class="confirm">
                <div class="alarm-confirm">
                  报警确认
                  <!-- <Checkbox v-model="classData.alarmAffirm.status" @on-change="showChange">报警确认</Checkbox> -->
                </div>
                <div class="confirm-way">
                  <Radio-group v-model="wayGroup" @on-change="showRadio">
                    <Radio label="自动确认"></Radio>
                    <Input-number class="confirm-time" v-model="classData.alarmAffirm.autoAffirm.maxDelay" :min="0" :max="7200" :disabled="inputIsShow"></Input-number>
                    <br>
                    <Radio label="手工确认"></Radio>
                  </Radio-group>
                  <br>
                  <!--<Checkbox class="confirm-tip" v-model="classData.alarmAffirm.manualAffirm.continueRecord">未确认报警持续录像,直至确认</Checkbox>-->
                </div>
              </div>
            </Form>
          </div>
          <div v-for="(actionForList,index) in classData.actionRule" :key="index">
            <div class="detail-info" v-show="itemIndex===(index+1).toString()">
              <div class="pane-style">
                <Checkbox v-model="actionForList.status">启用</Checkbox>
                <Form label-position="left" :label-width="80" :model="classData" class="form-rule">
                  <Form-item label="时间段">
                    <Time-picker type="timerange" :value="actionForList.timeRange" placement="bottom-end" :clearable="false" :editable="false" @on-change="editTime" placeholder="选择时间" style="width: 350px"></Time-picker>
                  </Form-item>
                  <Form-item label="执行动作">
                    <div class="do-action">
                      <Checkbox v-model="actionForList.actionVideo">联动视频</Checkbox>
                      <Checkbox v-model="actionForList.actionOutPut">联动报警输出</Checkbox>
                    </div>
                  </Form-item>
                </Form>
              </div>
            </div>
          </div>
          <div slot="footer">
            <Button type="ghost" @click="classifyCancel('classData')">取消</Button>
            <Button type="primary" @click="classifyOk('classData')" :disabled="okStatus">确定</Button>
          </div>
        </Modal>
      </div>
    </div>
  </div>
</template>
<script>
import './alarmStyle.css'
import sortShow from './allJs/sortShow.js'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'sortShow',
  components: {
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      sortData: ({ sortShow }) => sortShow.sortData,
      tempData: ({ timeTemplate }) => timeTemplate.tempData,
      levelData: ({ paramsSetting }) => paramsSetting.levelData
    }),
    ...mapGetters(['tipWarningConfig', 'tipErrorConfig'])
  },
  mixins: [sortShow],
  methods: {
    ...mapActions(['getSortData', 'updataSort', 'getAlarmTemp', 'getAlarmLevel'])
  },
  created() {
    this.getData()
    // 获取时间模板
    this.getAlarmTemp().then().catch((err) => {
      console.log('logout error:' + err)
      if (this.tipErrorConfig.show) {
        this.$Notice.error({
          title: '警告',
          desc: '布撤防时间获取失败',
          duration: this.tipErrorConfig.dur,
          top: 200
        })
      }
    })
    // 获取级别数据
    this.getAlarmLevel().then().catch((err) => {
      console.log('logout error:' + err)
      if (this.tipErrorConfig.show) {
        this.$Notice.error({
          title: '警告',
          desc: '级别数据获取失败',
          duration: this.tipErrorConfig.dur,
          top: 200
        })
      }
    })
  }
}
</script>
<style scoped>
  .box {
    margin-left: 20px;
  }

  .panel {
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    background-color: #1c3053;
    text-align: left;
    padding: 0 0 0 20px;
  }

  .ivu-table-column-center .ivu-btn span {
    color: #57a3f3;
    font-size: 14px;
  }

  .alarm-confirm {
    width: 80px;
    display: inline-block;
    vertical-align: top;
  }

  .confirm-way {
    display: inline-block;
  }

  .confirm {
    position: relative;
    height: 50px;
    margin-bottom: 24px;
  }
  .rt {
    float: right;
  }

  .confirm-time {
    width: 238px;
    margin-left: 20px;
  }
  .page-style {
    width: 100%;
    border-top: none;
    margin-bottom: 20px;
    overflow: hidden;
    padding: 5px 12px 5px 0;
    background: #244575;
  }
  .do-action {
    min-height: 300px;
    padding-left: 20px;
  }

  .table-relative {
    position: relative;
    margin: 0px;
    width: 100%;
  }

  .table-body {
    position: absolute;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  .form-rule {
    margin-top: 15px;
  }

  .upload-img {
    display: inline-block;
    margin-left: 5px;
  }

  .confirm-tip {
    margin: 5px 0 20px 20px;
  }

  .ivu-select-dropdown {
    position: absolute !important;
  }

  .pane-style {
    padding: 0 10px;
  }

  .bs-main {
    /*min-height: 900px;*/
    display: flex;
    flex: 1;
    font-size: 12px;
    /*background-color: #1C3053;*/
    width: 100%;
    height: 100%;
  }
</style>
