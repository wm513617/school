<template>
  <div class="alarmTerminal" id="alarmTerminal">
    <div class="tab-content-alarm" style="text-align:center;width:100%;font-size:12px;height:100%;" ref="tableBox">
      <div class="feature-btn">
        <Button type="ghost" icon="plus" @click="openAddMod('添加报警终端')" v-if="$BShasPower('BS-ALARMHELP-TERMINAL-CONF')">添加</Button>
        <Button type="ghost" icon="edit" @click="openEditMod('修改报警终端')" v-if="$BShasPower('BS-ALARMHELP-TERMINAL-CONF')" :disabled="canUse">修改</Button>
        <Button type="ghost" icon="trash-a" @click="delAlarm" v-if="$BShasPower('BS-ALARMHELP-TERMINAL-CONF')" :disabled="canUse">删除</Button>
        <Button type="ghost" icon="trash-a" @click="offTerRing" :loading="offLoading" :disabled="offring" v-if="$BShasPower('BS-ALARMHELP-TERMINAL-CONF')">关闭响铃</Button>
        <Input v-model="inSearchName" placeholder="按设备名称模糊查询" style="width: 250px;" class="rt">
        <Button slot="append" @click="search">搜索</Button>
        </Input>
      </div>
      <div class="table-relative flex-1" style="margin-top:12px;">
        <div class="table-body">
          <Table size="small" :height="tableHeight" :columns="boxTableTitle" :data="boxTableData" @on-selection-change="alarmInSel"></Table>
        </div>
      </div>
      <div class="table-footer">
        <Page class="rt" show-sizer show-elevator show-total :page-size-opts="$PageInfo.size" :total="pageObj.count" :page-size="pageObj.limit" :current="pageObj.cur" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
      </div>
    </div>
    <!--添加、修改弹框-->
    <div v-if="boxModelShow">
      <Modal v-model="boxModelShow" :title="centerTitle" width="500" :mask-closable="false">
        <Form label-position="left" :label-width="107" :model="boxData" ref="boxData" :rules="alarmRule" style="padding: 0 10px;">
          <Form-item label="报警终端名称" prop="name">
            <Input v-model="boxData.name" />
          </Form-item>
           <Form-item label="设备类型" prop='deviceType' :rules="{required:true,trigger:'change',validator: typeRule}">
            <Select style="width:200px" v-model="boxData.deviceType">
              <Option v-for="item in this.typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item>
          <Form-item label="镜头ip地址" prop="ip">
            <Input v-model="boxData.ip" />
          </Form-item>
          <Form-item label="镜头控制端口" prop="cport" :rules="{type: 'number',required:true,trigger:'blur',validator: cportRule}">
            <Input v-model="boxData.cport" number/>
          </Form-item>
          <Form-item label="镜头数据端口" prop="dport" :rules="{type: 'number',required:true,trigger:'blur',validator: dportRule}">
            <Input v-model="boxData.dport" number/>
          </Form-item>
          <Form-item label="镜头用户名" prop="username">
            <Input v-model="boxData.username" />
          </Form-item>
          <Form-item label="镜头密码" prop="password">
            <Input type="password" v-model="boxData.password" />
          </Form-item>
          <Form-item label="对讲ID号" prop='tertalkId' :rules="{required:true,trigger:'blur',validator: tertalkIdRule}">
            <Input v-model="boxData.talkId" />
          </Form-item>
          <Form-item label="对讲IP地址" prop='tertalkIp' :rules="{required:true,trigger:'blur',validator: tertalkIpRule}">
            <Input v-model="boxData.talkIp" />
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="ghost" @click="editCancel('boxData')">取消</Button>
          <Button type="primary" :loading="tableModelLoad" @click="editOk('boxData')">确定</Button>
        </div>
      </Modal>
    </div>
    <!--配置报警终端-->
    <div v-if="configModelShow">
      <Modal v-model="configModelShow" title="联动配置" width="600" :mask-closable="false">
        <Form label-position="left" :label-width="85" :model="configBoxData" ref="configBoxData" style="padding: 0 10px;">
          <Form-item label="设备名称">
            <Input v-model="configBoxData.name" disabled/>
          </Form-item>
          <Form-item label="设备配置：">
            <Select @on-change="configTypeSel" v-model="configBoxData.configType" disabled>
              <Option value="0">基本配置</Option>
              <Option value="1">联动配置</Option>
            </Select>
          </Form-item>
        </Form>
        <div v-if="!showLinkConfig" style="padding: 0 10px;">
          <!-- 基本配置 -->
          <div class="model-table">
            <!-- <Table border height="130" :columns="primaryLinkTitle" :data="configBoxData.actionOutCtl" size="small"></Table> -->
            <div class="ivu-table-wrapper" style="height: 130px;">
              <div class="ivu-table ivu-table-small ivu-table-border ivu-table-with-fixed-top">
                <div class="ivu-table-header">
                  <table cellspacing="0" cellpadding="0" border="0" style="width: 533px;">
                    <thead>
                      <tr>
                        <th style="width:100px;"><div class="ivu-table-cell"><span>联动序号</span></div></th>
                        <th class="ivu-table-column-center" style="width:120px;"><div class="ivu-table-cell"><span>联动设备</span></div></th>
                        <th class="ivu-table-column-center" style="width:200px;"><div class="ivu-table-cell"><span>布防时间</span></div></th>
                        <th class="ivu-table-column-center" style="width:100px;"><div class="ivu-table-cell"><span>启用</span></div></th>
                      </tr>
                    </thead>
                  </table>
                </div>
                <div class="ivu-table-body" style="height: 98px;">
                  <table cellspacing="0" cellpadding="0" border="0" style="width: 533px;">
                    <tbody class="ivu-table-tbody">
                      <tr class="ivu-table-row" v-for="(item, index) in 2" :key="index">
                        <td style="width:100px;"><div class="ivu-table-cell"><span>{{index + 1}}</span></div></td>
                        <td class="ivu-table-column-center" style="width:120px;">
                          <div class="ivu-table-cell">
                            <Select v-model="configBoxData.actionOutCtl[index].name">
                              <Option v-for="item in wayOptions" :value="item.value" :key="item.value">{{item.label}}</Option>
                            </Select>
                          </div>
                        </td>
                        <td class="ivu-table-column-center" style="width:200px;">
                          <div class="ivu-table-cell">
                            <TimePicker type="timerange" placement="bottom-end" :value="toHour(configBoxData.actionOutCtl[index].beginTime, configBoxData.actionOutCtl[index].endTime)" @on-change="changeTimerange" @click.native="timeIndex = index"></TimePicker>
                          </div>
                        </td>
                        <td class="ivu-table-column-center" style="width:100px;">
                          <div class="ivu-table-cell">
                            <Checkbox v-model="configBoxData.actionOutCtl[index].status"></Checkbox>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="model-tree" v-if="showLinkConfig" style="padding: 0 10px;">
          <!-- 联动配置 -->
          <Checkbox v-model="configBoxData.actionloc.client">联动本机镜头</Checkbox>
          <Checkbox v-model="configBoxData.actionloc.record">开启录像</Checkbox>
          <bs-scroll ref="videoScroll" style=" margin-top:10px;width: 100%;height: 385px;overflow: auto;  border: 1px solid rgba(58, 90, 139, 0.8);">
            <v-tree ref='videoTree' @on-expand="videoTreeExpand" :treeData="linkVideoTree" :options="options" :isSaveState='false' />
          </bs-scroll>
        </div>
        <div slot="footer">
          <Button type="ghost" @click="editCancel('configBoxData')">取消</Button>
          <Button type="primary" :loading="linkLoading" @click="sureLink">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import VTree from '../../../components/tree/VTree.vue'
import { mapState, mapActions } from 'vuex'
import allPage from './allPage.js'
import alarmTerm from './alarmTerm.js'
export default {
  name: 'alarmBox',
  components: {
    VTree
  },
  data() {
    return {
      tableHeight: 500
    }
  },
  computed: {
    ...mapState({
      alarmTermData: ({ alarmHelps }) => alarmHelps.alarmTermData,
      alarmHelpServer: ({ alarmHelps }) => alarmHelps.alarmHelpServer
    })
  },
  mixins: [alarmTerm, allPage],
  methods: {
    ...mapActions([
      'getAlarmTermData',
      'addAlarmTermianl',
      'editAlarmTermianl',
      'delAlarmTerminal',
      'getResourceTree',
      'saveLinkConfig',
      'offTerminalRingAudio',
      'getAlarmHelpServer'
    ]),
    tertalkIpRule(rule, value, callback) {
      if (this.boxData.talkIp === '') {
        return callback(new Error('不能为空'))
      } else {
        return callback()
      }
    },
    typeRule(rule, value, callback) {
      if (this.boxData.deviceType === '') {
        return callback(new Error('不能为空'))
      } else {
        return callback()
      }
    },
    tertalkIdRule(rule, value, callback) {
      if (this.boxData.talkId !== '') {
        let r = /(^[1-9]([0-9]*)$|^[0-9]$)/
        if (r.test(this.boxData.talkId)) {
          if (Number(this.boxData.talkId) > 10000) {
            return callback(new Error('超过最大值10000'))
          } else {
            return callback()
          }
        } else {
          return callback(new Error('请输入有效数字'))
        }
      } else {
        return callback(new Error('不能为空'))
      }
    }
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 90
  },
  created() {}
}
</script>

<style scoped>
.alarmTerminal {
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
}

.lf {
  float: left;
}

.rt {
  float: right;
}

.sidebar {
  width: 100%;
  height: auto;
}

.sidebar > a {
  display: block;
  text-align: center;
  font-size: 14px;
  color: #fff;
  background-color: #0f2243;
  height: 40px;
  line-height: 40px;
  margin-bottom: 10px;
  width: 300px;
}

.config-list li {
  position: relative;
  cursor: pointer;
  /*transition: all .2 ease-in-out;*/
  height: 48px;
  line-height: 48px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  border-right: 2px solid transparent;
  background: #1c3053;
  border-top: 1px solid #263e69;
  border-bottom: 1px solid #263e69;
  box-shadow: 0px -1px 2px #142441 inset;
  padding: 0 0 0 40px;
}

.config-list li:hover {
  background: #2b426b;
  color: #ffffff;
}

.sidebar > .config-list > .active {
  color: #4699f9;
  border-right: 2px solid #4699f9;
  background-color: #2f497a;
  z-index: 2;
}

.tab-content-alarm {
  /* width: 100%;
  padding: 0px;
  background: #1c3053; */
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1c3053;
  height: 100%;
}

.feature-btn {
  margin: 0 10px;
  height: 32px;
  line-height: 32px;
}

.feature-btn > button {
  margin-right: 8px;
  float: left;
  width: 100px;
  height: 32px;
}

.ivu-table-column-center .ivu-btn span {
  color: #57a3f3;
  font-size: 14px;
}

.page-style {
  width: 100%;
  border-top: none;
  overflow: hidden;
  padding: 5px 12px;
  background: #244575;
  font-size: 12px;
}

.table-relative {
  position: relative;
  /* height: 650px; */
  margin: 0px;
  width: 100%;
}

.table-body {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.model-table {
  width: 100%;
  overflow: inherit;
  border: 1px solid #5d5d5d;
}
.model-tree {
  width: 100%;
  height: 400px;
}
.confirm {
  position: relative;
  height: 50px;
}

.confirm-time {
  width: 200px;
  margin-left: 20px;
}
</style>
