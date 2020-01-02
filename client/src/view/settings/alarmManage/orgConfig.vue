<template>
  <div class="orgConfig">
    <div class="bs-left">
      <div class="sidebar sildebar-bottom">
        <a @click="orgClick">选择机构</a>
        <div style="height: calc(100% - 40px);" v-show="['0', '1', '2', '3', '4', '5', '6'].includes(nowTabIndex)">
          <TreeBox ref="treebox" :resourceToggle="false" :searchToggle="false" :equipmentToggle="false" :scroll="true" :iconToggle="false" @clickData="handleNode" ></TreeBox>
        </div>
        <bs-scroll v-show="['7', '8', '9'].includes(nowTabIndex)" ref="orgScroll" style=" width: 100%;height: calc(100% - 40px);overflow: auto;">
          <v-tree @on-expand="expand" ref='tree' :treeData="treeData" :options="orgOptions" :activeId="activeOrgId" @node-click='handleNode' />
        </bs-scroll>
      </div>
      <div class="sidebar">
        <a @click="isNowPathActive" :class="{active: show}">报警参数配置</a>
        <ul class="config-list">
          <li style="list-style:none;" v-show="$BShasPower(config.vIf)" :key="index" v-for="(config,index) in configList" :class="{active: config.isActive}" @click="isNowPathActive(config)">
            {{config.name}}
          </li>
        </ul>
      </div>
    </div>
    <div class="bs-mains">
      <div style="text-align:center;width:100%;font-size:12px;height: 100%;">
        <div class="tabStyle" style="width: 100%; height: 100%;" v-if="!show">
          <Tabs :animated="false" value="0" @on-click="tabChange" style="width:100%; height: 100%;">
            <Tab-pane :label="`报警输入（${allTabNumber.alarmInputNo}）`" name="0" style="width:100%; height: 100%;">
              <AlarmInputTab v-if="nowTabIndex === '0'" :activeOrgId="activeOrgId" :orgId="rootOrgId"></AlarmInputTab>
            </Tab-pane>
            <Tab-pane :label="`报警主机（${allTabNumber.alarmHostNo}）`" name="1" style="width:100%; height: 100%;">
              <AlarmHostTab v-if="nowTabIndex === '1'" :activeOrgId="activeOrgId" :orgId="rootOrgId"></AlarmHostTab>
            </Tab-pane>
            <Tab-pane :label="`消防报警（${allTabNumber.fireAlarmNo}）`" name="2" style="width:100%; height: 100%;">
              <FireAlarmTab v-if="nowTabIndex === '2' && fireType === 'lida'" :activeOrgId="activeOrgId" :orgId="rootOrgId"></FireAlarmTab>
              <KedaFireAlarmTab v-if="nowTabIndex === '2' && fireType === 'keda'" :activeOrgId="activeOrgId" :orgId="rootOrgId"></KedaFireAlarmTab>
            </Tab-pane>
            <Tab-pane :label="`监控点报警（${allTabNumber.monitoryPointAlarmNo}）`" name="3" style="width:100%; height: 100%;">
              <MonitorAlarmTab v-if="nowTabIndex === '3'" :activeOrgId="activeOrgId" :orgId="rootOrgId"></MonitorAlarmTab>
            </Tab-pane>
            <Tab-pane :label="`智能报警（${allTabNumber.intelligentAlarmNo}）`" name="4" style="width:100%; height: 100%;">
              <IntelligentAlarmTab v-if="nowTabIndex === '4'" :activeOrgId="activeOrgId" :orgId="rootOrgId"></IntelligentAlarmTab>
            </Tab-pane>
            <Tab-pane :label="`设备报警（${allTabNumber.deviceAlarmNo}）`" name="5" style="width:100%; height: 100%;">
              <EquipmentAlarm v-if="nowTabIndex === '5'" :activeOrgId="activeOrgId" :orgId="rootOrgId"></EquipmentAlarm>
            </Tab-pane>
            <Tab-pane :label="`报警输出（${allTabNumber.alarmOutputNo}）`" name="6" style="width:100%; height: 100%;">
              <AlarmOutput v-if="nowTabIndex === '6'" :activeOrgId="activeOrgId" :orgId="rootOrgId"></AlarmOutput>
            </Tab-pane>
            <Tab-pane :label="`报警求助（${allTabNumber.alarmClientNo}）`" name="7" style="width:100%; height: 100%;">
              <AlarmHelp v-if="nowTabIndex === '7'" :linkOrgId="linkOrgId" :activeOrgId="activeOrgId" :orgId="rootOrgId"></AlarmHelp>
            </Tab-pane>
            <Tab-pane :label="`智能交通（${allTabNumber.trafficLaneNo}）`" name="8" style="width:100%; height: 100%;">
              <AlarmTraffic v-if="nowTabIndex === '8'" :linkOrgId="linkOrgId" :newRootId="newRootId" :activeOrgId="trafficStatus ? activeOrgId : ''" :orgId="trafficStatus ? rootOrgId : ''"></AlarmTraffic>
            </Tab-pane>
            <Tab-pane :label="`人像布控（${allTabNumber.faceAlarmNo}）`" name="9" style="width:100%; height: 100%;">
              <portraitControlAlarm v-if="nowTabIndex === '9'" :linkOrgId="linkOrgId" :activeOrgId="faceStuates ? activeOrgId : ''" :orgId="faceStuates ? rootOrgId: ''" ></portraitControlAlarm>
            </Tab-pane>
          </Tabs>
        </div>
        <div v-if="show">
          <!--<router-view></router-view>-->
          <timeTemplate v-if="configList[0].isActive"></timeTemplate>
          <paramsSetting v-if="configList[1].isActive"></paramsSetting>
          <!-- <sortShow v-if="configList[2].isActive"></sortShow> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import timeTemplate from './timeTemplate'
// import sortShow from './sortShow'
import paramsSetting from './paramsSetting'
import VTree from '../../../components/tree/VTree.vue'
import TreeBox from '../../../components/BStreeNew/BStreeNewBox'
// import mixinLink from './allJs/mixinLink'
// import mixinAddEdit from './allJs/mixinAddEdit'
// import mixinJKD from './allJs/mixinJKD'
import './alarmStyle.css'
import AlarmInputTab from './AlarmInputTab'
import EquipmentAlarm from './EquipmentAlarm'
import AlarmOutput from './AlarmOutput'
import AlarmHelp from './AlarmHelp'
import AlarmHostTab from './AlarmHostTab'
import FireAlarmTab from './FireAlarmTab'
import KedaFireAlarmTab from './KedaFireAlarmTab'
import MonitorAlarmTab from './MonitorAlarmTab'
import IntelligentAlarmTab from './IntelligentAlarmTab'
import AlarmTraffic from './AlarmTraffic'
import portraitControlAlarm from './portraitControlAlarm'
import { mapState, mapActions, mapGetters } from 'vuex'
// import { constants } from 'fs'
export default {
  name: 'orgConfig',
  components: {
    VTree,
    timeTemplate,
    // sortShow,
    paramsSetting,
    AlarmInputTab,
    EquipmentAlarm,
    AlarmOutput,
    AlarmHelp,
    AlarmHostTab,
    FireAlarmTab,
    KedaFireAlarmTab,
    MonitorAlarmTab,
    IntelligentAlarmTab,
    portraitControlAlarm,
    AlarmTraffic,
    TreeBox
  },
  data() {
    return {
      rootOrgId: '',
      activeOrgId: '',
      nowTabIndex: '0',
      show: false,
      configList: [
        {
          name: '时间模板',
          path: '/settings/alarm/time',
          isActive: false,
          roleTabs: 'timeModel',
          vIf: 'BS-ALARM-TIMEPLATE-PAGE'
        },
        {
          name: '参数设置',
          path: '/settings/alarm/params',
          isActive: false,
          roleTabs: 'parmModel',
          vIf: 'BS-ALARM-SETTING-PAGE'
        }
        // {
        //   name: '报警分类',
        //   path: '/settings/alarm/sort',
        //   isActive: false,
        //   roleTabs: 'alarmClassify',
        //   vIf: 'BS-ALARM-SORT-PAGE'
        // }
      ],
      orgOptions: {
        showCheckbox: true,
        showInput: false
      },
      options: {
        showCheckbox: true,
        showInput: true
      },
      treeData: [],
      trafficTree: [],
      faceTree: [],
      alarmTreeData: [],
      trafficStatus: false,
      faceStuates: false,
      newRootId: '',
      fireType: 'lida', // 消防设备厂商: lida(利达)、keda(科大国创)
      linkOrgId: ''
    }
  },
  computed: {
    ...mapState({
      orgTreeData: ({ alarmManage }) => alarmManage.orgTreeData,
      levelData: ({ paramsSetting }) => paramsSetting.levelData,
      sortData: ({ sortShow }) => sortShow.sortData,
      allTabNumber: ({ alarmManage }) => alarmManage.allTabNumber
    }),
    ...mapGetters(['enabledSort', 'enabledLevel', 'enabledTemp'])
  },
  watch: {
    nowTabIndex(newVal, oldVal) {
      let tabs = ['0', '1', '2', '3', '4', '5', '6']
      if (tabs.includes(newVal) && !tabs.includes(oldVal)) {
        this.activeOrgId = this.treeData[0]._id
      }
    }
  },
  methods: {
    ...mapActions([
      'getAlarmOrgTree',
      'setOrgIdList',
      'getAlarmTemp',
      'getAlarmLevel',
      'recordLog',
      'getTrafficTreeData',
      'getFaceAlarmTreeData',
      'getTrafficSerList',
      'getAllAlarmTabNumber',
      'getFireHostList'
    ]),
    expand() {
      this.$refs.orgScroll.update()
    },
    // 获取机构树数据
    getTreeData() {
      this.getAlarmOrgTree().then(() => {
        this.treeData = JSON.parse(JSON.stringify(this.orgTreeData))
        this.alarmTreeData = this.treeData
        this.rootOrgId = this.treeData[0]._id
        this.activeOrgId = this.treeData[0]._id
        this.newRootId = this.treeData[0]._id
        this.linkOrgId = this.treeData[0]._id
        this.getAllAlarmTabNumber(this.activeOrgId)
        this.searchChildId(this.treeData[0])
      }).catch(err => {
        console.log('logout error:' + err)
        this.errorMsg('机构数据获取失败')
      })
      this.getTrafficTreeData().then((res) => {
        this.trafficTree = JSON.parse(JSON.stringify(res.data))
      }).catch(err => {
        console.log('logout error:' + err)
        this.errorMsg('智能交通数据获取失败')
      })
      this.getFaceAlarmTreeData().then((res) => {
        this.faceTree.push(res.data)
      }).catch(err => {
        console.log('logout error:' + err)
        this.errorMsg('人脸数据获取失败')
      })
    },
    orgClick() {
      const orgRouter = '/settings/alarm/org'
      for (let item of this.configList) {
        item.isActive = false
      }
      this.$router.replace(orgRouter)
      this.show = false
    },
    isNowPathActive(config) {
      this.show = true
      this.nowTabIndex = '0'
      this.treeData = JSON.parse(JSON.stringify(this.orgTreeData))
      if (config.roleTabs === 'timeModel') {
        this.configList[0].isActive = true
        this.configList[1].isActive = false
        // this.configList[2].isActive = false
        this.$router.replace(config.path)
      } else if (config.roleTabs === 'parmModel') {
        this.configList[0].isActive = false
        this.configList[1].isActive = true
        // this.configList[2].isActive = false
        this.$router.replace(config.path)
      } else if (config.roleTabs === 'alarmClassify') {
        this.configList[0].isActive = false
        this.configList[1].isActive = false
        this.configList[2].isActive = true
        this.$router.replace(config.path)
      }
    },
    handleNode(node) {
      this.show = false
      if (node.sid) {
        this.activeOrgId = node._id
        this.rootOrgId = node.sid
      } else {
        this.activeOrgId = node._id
        this.orgClick()
        this.searchChildId(node)
      }
      if (this.trafficStatus) {
        this.newRootId = node.id ? node.id : node._id
        this.rootOrgId = node.sid ? node.sid : node.type
      }
      if (this.activeOrgId) {
        this.getAllAlarmTabNumber(this.activeOrgId)
      }
    },
    // 向下搜索子类ID
    searchChildId(data) {
      let childId = []
      childId.push(data._id)
      let searchChild = a => {
        if (a.children) {
          for (let i = 0; i < a.children.length; i++) {
            childId.push(a.children[i]._id)
            searchChild(a.children[i])
          }
        }
      }
      searchChild(data)
      this.setOrgIdList(childId)
      // this.getAllAlarm()
    },
    // 标签切换
    tabChange(data) {
      if (data === '2') {
        // 判断设备管理中是否添加了消防设备
        const param = {
          page: 1,
          limit: 2,
          bigtype: 7,
          never: -1,
          oid: this.alarmTreeData[0]._id
        }
        this.getFireHostList(param).then(res => {
          if (res.data.devList.length === 0) {
            this.warningMsg('请先在设备管理界面添加消防报警主机')
          } else {
            this.treeData = this.alarmTreeData
            if (res.data.devList[0].manufacturer === 'lida') {
              this.fireType = 'lida'
            } else {
              this.fireType = 'keda'
            }
            this.nowTabIndex = data
          }
        })
      } else {
        this.nowTabIndex = data
      }
      if (this.nowTabIndex === '8') {
        this.treeData = []
        this.treeData = this.trafficTree
        this.activeOrgId = this.treeData[0]._id ? this.treeData[0]._id : (this.treeData[0].sid ? this.treeData[0].sid : '')
        this.rootOrgId = this.treeData[0].sid ? this.treeData[0].sid : ''
        this.newRootId = this.treeData[0].id ? this.treeData[0].id : this.treeData[0]._id
        this.trafficStatus = true
      } else if (this.nowTabIndex === '9') {
        this.treeData = []
        this.treeData = this.faceTree
        this.activeOrgId = this.treeData[0]._id ? this.treeData[0]._id : ''
        this.rootOrgId = this.treeData[0]._id ? this.treeData[0]._id : ''
        this.faceStuates = true
      } else if (this.nowTabIndex === '7') {
        this.treeData = []
      } else {
        this.treeData = this.alarmTreeData
        this.rootOrgId = this.treeData[0]._id
        // this.activeOrgId = this.treeData[0]._id
      }
    }
  },
  created() {
    // hasSure=this.$BShasPower('BS-USER-MANAGE-ROLE-ADD')
    this.show = false
    for (let i = 0; i < this.configList.length; i++) {
      if (this.$route.path === this.configList[i].path) {
        this.configList[i].isActive = false
      }
    }
    this.getTreeData()
    // 获取时间模板
    this.getAlarmTemp()
      .then()
      .catch(() => {
        this.errorMsg('时间模板获取失败')
      })
    // 获取报警级别
    this.getAlarmLevel()
      .then()
      .catch(() => {
        this.errorMsg('报警级别获取失败')
      })
  }
}
</script>
<style scoped>
.orgConfig {
  width: 100%;
  position: relative;
  display: flex;
  padding: 16px 0;
}

.bs-mains {
  position: absolute;
  width: calc(100% - 288px);
  height: calc(100% - 32px);
  margin-left: 288px;
  background: #1c3053;
  min-height: 670px;
  overflow-x: hidden;
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
.sildebar-bottom {
  height: calc(100% - 120px);
}
.sidebar > a {
  display: block;
  text-align: center;
  font-size: 14px;
  color: #fff;
  background-color: #0f2243;
  height: 40px;
  line-height: 40px;
  width: 100%;
}

.org-tree {
  width: 330px;
  height: 400px;
  overflow: auto;
}

.tree-org {
  height: 600px;
  max-width: 300px;
  overflow: auto;
}

.config-list li {
  position: relative;
  cursor: pointer;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  border-right: 2px solid transparent;
  background: #1c3053;
  border-bottom: 1px solid rgba(58, 90, 139, 0.4);
  padding: 0 0 0 24px;
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

li > div {
  padding: 14px 40px;
}
</style>
