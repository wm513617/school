<template>
  <div class="alarmMainframe">
    <div class="alarm-left">
      <div class="alarm-sidebar">
        <span class="sidebar-title">选择机构</span>
        <div style="height: calc(100% - 28px)">
          <TreeBox ref="treebox" :resourceToggle="false" :searchToggle="true" :equipmentToggle="false" :scroll="true" :iconToggle="false" @clickData="handleNode" ></TreeBox>
        </div>
        <!-- <div class="sidebar-search">
          <Input v-model="orgTreeSearch" icon="ios-search-strong" placeholder="请输入..." />
        </div>
        <div class="sidebar-scroll">
          <bs-scroll ref="orgScroll">
            <v-tree @on-expand="expand" ref='tree' :searchVal="orgTreeSearch" :treeData="treeData" :options="orgOptions" :activeId="activeOrgId" @node-click='handleNode' />
          </bs-scroll>
        </div> -->
      </div>
    </div>
    <div class="alarm-main">
      <div class="main-top">
        <div class="feature-btn mainTop-btn">
          <Select style="width:120px" v-model="onlineStatus" @on-change="searchStatus">
            <Option v-for="item in onlineStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Select style="width:120px" v-model="armStatus"  @on-change="searchStatus">
            <Option v-for="item in armStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Button type="ghost" @click="devHendle('protection')">布防</Button>
          <Button type="ghost" @click="devHendle('removal')">撤防</Button>
          <Button type="ghost" @click="devHendle('remove')">清除</Button>
          <Button type="ghost" @click="refash" :loading="isWait">刷新</Button>
          <Checkbox v-model="showChild" @on-change="showChildMeth">显示子机构资源</Checkbox>
          <Input v-model="inSearchName" placeholder="请输入名称..." class="mainTopBtn-input">
          <Button slot="append" @click="searchHandle">搜索</Button>
          </Input>
        </div>
        <div class="car-list">
          <div class="table-box">
            <Table size="small" height="300" :columns="alarmTitle" :data="alarmHostList" :highlight-row="true" @on-row-click="clickDeviceRow" @on-selection-change="selectAlarmHost" :row-class-name="rowClass"></Table>
          </div>
        </div>
        <div class="table-footer">
          <div class="pageRt">
            <Page show-sizer show-elevator show-total placement="top" :page-size-opts="$PageInfo.size" :total="pageInfo.count" :page-size="pageInfo.limit" :current="pageInfo.cur" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
          </div>
        </div>
      </div>
      <div class="main-bottom" :style="{height: tableBoxHeight}" ref="tableBox">
        <div class="mainBtm-left">
          <div class="feature-btn">
            <span>报警防区（{{alarmInData.length}}）</span>
            <Button type="ghost" @click="resHandle('protection')">布防</Button>
            <Button type="ghost" @click="resHandle('removal')">撤防</Button>
            <Button type="ghost" @click="resHandle('remove')" :disabled="isFence">清除</Button>
            <Button type="ghost" @click="resHandle('branch')">旁路</Button>
            <Button type="ghost" @click="resHandle('withdraw')">撤旁</Button>
          </div>
          <div class="car-list">
            <div class="table-box">
              <Table size="small" :height="tableHeight" :columns="alarmInTitle" :data="alarmInData" :highlight-row="true" @on-row-click="clickAlarmInRow" @on-selection-change="selectAlarmSector"></Table>
            </div>
          </div>
        </div>
        <div class="mainBtm-right">
          <span class="mainBtm-title">视频关联镜头</span>
          <Select style="width:220px" v-model="actionListSelVal" @on-change="changeActionVal" placement="top">
            <Option v-for="item in resActionsSelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <div class="mainBtm-video">
            <AlarmMainPreview :videoParam='actionVideoData' @needClearParam="clear"></AlarmMainPreview>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TreeBox from 'components/BStreeNew/BStreeNewBox'
import { mapActions, mapGetters, mapState } from 'vuex'
import AlarmMainPreview from './AlarmMainPreview'
export default {
  name: 'AlarmPlaybackPlugin',
  props: ['index'],
  components: {
    AlarmMainPreview,
    TreeBox
  },
  data() {
    return {
      tableHeight: 0,
      treeData: [],
      activeOrgId: '',
      orgTreeSearch: '',
      orgOptions: {
        showCheckbox: true,
        showInput: false
      },
      onlineStatus: 'all',
      onlineStatusList: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: '1',
          label: '在线'
        },
        {
          value: '0',
          label: '离线'
        }
      ],
      armStatus: 'all',
      armStatusList: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 'arm',
          label: '布防'
        },
        {
          value: 'disarm',
          label: '撤防'
        }
      ],
      showChild: true,
      inSearchName: '',
      alarmTitle: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '报警主机名称',
          key: 'name',
          minWidth: 200,
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.name
                }
              },
              params.row.name
            )
          }
        },
        {
          title: '所属机构',
          key: 'mainname',
          minWidth: 200,
          ellipsis: true,
          render: (h, params) => {
            let time = ''
            if (params.row.oid && params.row.oid.name) {
              time = params.row.oid.name
            }
            return h(
              'div',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: time
                }
              },
              time
            )
          }
        },
        {
          title: 'ip地址',
          key: 'ip',
          minWidth: 120
        },
        {
          title: '在线状态',
          key: 'status',
          minWidth: 120,
          render: (h, params) => {
            let color
            let text
            if (params.row.status === false) {
              color = '#ed3f14'
              text = '离线'
            } else {
              color = '#19be6b'
              text = '在线'
            }
            return h(
              'span',
              {
                style: {
                  color: color
                }
              },
              text
            )
          }
        },
        {
          title: '布防状态',
          key: 'alarmStatus',
          minWidth: 120,
          render: (h, params) => {
            let text
            if (params.row.alarmStatus === 'disarm') {
              text = '撤防'
            } else if (params.row.alarmStatus === 'arm') {
              text = '布防'
            } else {
              text = ''
            }
            return h('span', text)
          }
        }
      ],
      alarmData: [],
      deviceRowId: '',
      pageInfo: {
        cur: 1,
        count: 0,
        limit: this.$PageInfo.limit
      },
      alarmInTitle: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '报警防区名称',
          key: 'name',
          minWidth: 200,
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.name
                }
              },
              params.row.name
            )
          }
        },
        {
          title: '级别',
          key: 'level',
          minWidth: 120
        },
        {
          title: '报警分类',
          key: 'alarmType',
          minWidth: 120,
          render: (h, params) => {
            let text = ''
            if (this.enabledSort.length !== 0) {
              this.enabledSort.forEach(item => {
                if (params.row.alarmtype && item.value === params.row.alarmtype) {
                  text = item.label
                }
              })
            }
            return h('div', text)
          }
        },
        {
          title: '布防状态',
          key: 'alarmStatus',
          minWidth: 120,
          render: (h, params) => {
            let text
            if (params.row.alarmStatus === 'disarm') {
              text = '撤防'
            } else if (params.row.alarmStatus === 'arm') {
              text = '布防'
            } else {
              text = ''
            }
            return h('span', text)
          }
        },
        {
          title: '旁路状态',
          key: 'passStatus',
          minWidth: 120,
          render: (h, params) => {
            let text
            if (params.row.passStatus === 'pass') {
              text = '撤旁'
            } else if (params.row.passStatus === 'bypass') {
              text = '旁路'
            } else {
              text = ''
            }
            return h('span', text)
          }
        },
        {
          title: '联动视频',
          key: 'actionListVideo',
          minWidth: 120,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'ghost'
                  },
                  on: {
                    click: () => {
                      this.openActionVideo(params.row)
                    }
                  }
                },
                '播放'
              )
            ])
          }
        }
      ],
      alarmInData: [],
      actionListSelVal: '',
      alarmInRowId: '',
      actionVideoData: {},
      alarmMainInfo: {}, // 当前选中的报警主机信息
      alarmInRowInfo: {}, // 当前选中的报警防区信息
      getDevStatusTimer: null,
      shikeStatusList: [], // 时刻报警主机及防区的状态列表
      guangtuoStatusList: [], // 电子围栏报警主机及防区布撤防状态列表
      timerId: null,
      isWait: false,
      selectHostList: [], // 批量选中的报警主机
      selectSectorList: [], // 批量选中的报警防区
      selectHostIdList: [], // 批量选中的报警主机id数组
      selectSectorIdList: [], // 批量选择的报警防区id数组
      isFence: false, // 当前点击是否为电子围栏
      guangtuoDevIp: '' // 当前点击的电子围栏的设备IP
    }
  },
  computed: {
    ...mapState({
      orgTreeData: ({ alarmManage }) => alarmManage.orgTreeData
    }),
    ...mapGetters([
      'enabledTemp',
      'enabledSort',
      'alarmMainDevicesData',
      'alarmInDataById',
      'resActionsSelList',
      'resActionsData'
    ]),
    tableBoxHeight() {
      return `calc(100% - 335px)`
    },
    // eslint-disable-next-line vue/return-in-computed-property
    alarmHostList() {
      let online = []
      let armStatus = []
      if (this.onlineStatus === 'all') {
        online = [true, false]
      } else if (this.onlineStatus === '1') {
        online = [true]
      } else {
        online = [false]
      }
      if (this.armStatus === 'all') {
        armStatus = ['arm', 'disarm', undefined]
      } else if (this.armStatus === 'arm') {
        armStatus = ['arm']
      } else {
        armStatus = ['disarm']
      }
      const alarmLists = this.alarmData.filter(item => {
        return online.includes(item.status) && armStatus.includes(item.alarmStatus)
      })
      return alarmLists
    },
    shikeAlarmHosts() {
      return this.alarmData.filter(item => {
        return item.manufacturer === 'shike'
      })
    },
    guangtuoAlarmHosts() {
      return this.alarmData.filter(item => {
        return item.manufacturer === 'guangtuo'
      })
    }
  },
  methods: {
    ...mapActions([
      'getAlarmOrgTree',
      'getAlarmMainDevices',
      'getResOfDeviceByMainId',
      'getAlarmTemp',
      'getSortData',
      'getResAction',
      'protectionAction',
      'removalAction',
      'removeAction',
      'branchAction',
      'withdrawAction',
      'recordLog',
      'getAlarmDevStatus',
      'getAllAlarmDevStatus',
      'getAllAlarmDevStatusAuto',
      'getAlarmHostPowers'
    ]),
    /** VTree数据更新 */
    expand() {
      this.$refs.orgScroll.update()
    },
    /** 树节点，点击事件 */
    handleNode(node) {
      this.activeOrgId = node._id
      this.getDevices()
    },
    getTreeData() {
      this.getAlarmOrgTree()
        .then(() => {
          this.treeData = JSON.parse(JSON.stringify(this.orgTreeData))
          /**
           * 树节点默认选中根节点
           */
          this.activeOrgId = this.treeData[0]._id
          // this.getDevices()
        })
        .catch(err => {
          console.log('logout error:' + err)
          this.errorMsg('获取机构树失败')
        })
    },
    getDevices() {
      this.getAlarmMainDevices({
        status: this.onlineStatus,
        alarmStatus: this.armStatus,
        page: this.pageInfo.cur,
        limit: this.pageInfo.limit,
        bigtype: 1,
        oid: this.activeOrgId,
        never: this.showChild ? -1 : 1,
        seek: this.inSearchName,
        module: 'alarmHost'
      })
        .then(res => {
          this.alarmData = JSON.parse(JSON.stringify(this.alarmMainDevicesData.devList))
          this.isWait = false
          this.getAllAlarmStatus()
          this.clickDeviceRow(this.alarmMainDevicesData.devList[0])
          this.getAlarmHostPower(this.alarmData)
          this.rowClass = this.rowClassStyle
          this.pageInfo.count = Number(res.headers['x-bsc-count'])
        })
        .catch(err => {
          this.isWait = false
          this.errorMsg('获取报警主机列表失败')
          console.log(err)
        })
    },
    /* 获取所有报警主机及防区状态 */
    getAllAlarmStatus() {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.shikeAlarmHosts.length && this.getAllAlarmDevStatus({ devIp: 'shike', devPort: 2302 }).then(res => {
        this.shikeStatusList = res.data.length ? res.data : []
        this.shikeAlarmHosts.forEach(item => {
          for (let i = 0; i < this.shikeStatusList.length; i++) {
            if (item.ip === this.shikeStatusList[i].devIp) {
              this.$set(item, 'alarmStatus', this.shikeStatusList[i].armStatus)
              break
            }
          }
        })
      }).catch(err => {
        console.log(err)
      })
      this.guangtuoAlarmHosts.length && this.getAllAlarmDevStatus({ devIp: 'guangtuo', devPort: 2303 }).then(res => {
        this.guangtuoStatusList = res.data.length ? res.data : []
        this.guangtuoAlarmHosts.forEach(item => {
          for (let i = 0; i < this.guangtuoStatusList.length; i++) {
            if (item.ip === this.guangtuoStatusList[i].devIp) {
              this.$set(item, 'alarmStatus', this.guangtuoStatusList[i].armStatus)
              break
            }
          }
        })
      }).catch(err => {
        console.log(err)
      })
      this.timerId = setInterval(() => {
        this.getAllAlarmStatusAuto()
      }, 3000)
    },
    /* 自动获取所有报警主机及防区状态 */
    getAllAlarmStatusAuto() {
      let channelStatus = []
      this.shikeAlarmHosts.length && this.getAllAlarmDevStatusAuto({ devIp: 'shike', devPort: 2302 }).then(res => {
        this.shikeStatusList = res.data.length ? res.data : []
        this.shikeAlarmHosts.forEach(item => {
          for (let i = 0; i < this.shikeStatusList.length; i++) {
            if (item.ip === this.shikeStatusList[i].devIp) {
              this.$set(item, 'alarmStatus', this.shikeStatusList[i].armStatus)
              break
            }
          }
        })
        if (!this.isFence) {
          for (let i = 0; i < this.shikeStatusList.length; i++) {
            if (this.alarmInData[0].ip === this.shikeStatusList[i].devIp) {
              channelStatus = this.shikeStatusList[i].channelStatus
              break
            }
          }
          this.alarmInData.forEach(item => {
            for (let i = 0; i < channelStatus.length; i++) {
              if (item.chan === channelStatus[i].channel) {
                this.$set(item, 'alarmStatus', channelStatus[i].armStatus)
                this.$set(item, 'passStatus', channelStatus[i].passStatus)
                break
              }
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
      this.guangtuoAlarmHosts.length && this.getAllAlarmDevStatusAuto({ devIp: 'guangtuo', devPort: 2303 }).then(res => {
        this.guangtuoStatusList = res.data.length ? res.data : []
        this.guangtuoAlarmHosts.forEach(item => {
          for (let i = 0; i < this.guangtuoStatusList.length; i++) {
            if (item.ip === this.guangtuoStatusList[i].devIp) {
              this.$set(item, 'alarmStatus', this.guangtuoStatusList[i].armStatus)
              break
            }
          }
        })
        if (this.isFence) {
          for (let i = 0; i < this.guangtuoStatusList.length; i++) {
            if (this.guangtuoDevIp === this.guangtuoStatusList[i].devIp) {
              channelStatus = this.guangtuoStatusList[i].channelStatus
              break
            }
          }
          this.alarmInData.forEach(item => {
            for (let i = 0; i < channelStatus.length; i++) {
              if (item.chan === channelStatus[i].channel) {
                this.$set(item, 'alarmStatus', channelStatus[i].armStatus)
                this.$set(item, 'passStatus', channelStatus[i].passStatus)
                break
              }
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /* 获取各报警主机权限 */
    getAlarmHostPower(list) {
      list.forEach(item => {
        this.getAlarmHostPowers(item._id).then(res => {
          const powerList = res.data.properties ? res.data.properties : []
          if (powerList.length === 0) {
            item.alarmPower = {}
          } else {
            item.alarmPower = {}
            powerList.forEach(n => {
              item.alarmPower[n] = 1
            })
          }
        }).catch(err => {
          console.log('getAlarmHostPowers' + item.name + err)
        })
      })
    },
    /* 点击报警主机列表布撤防按钮时权限判断 */
    judegAlarmHostPower(list, type, msg) {
      let hasPower = true
      for (let i = 0; i < list.length; i++) {
        if (!list[i].alarmPower[type]) {
          hasPower = false
          break
        }
      }
      if (!hasPower) {
        this.warningMsg(msg)
      }
      return hasPower
    },
    /** 设备列表点击列表行事件
     * 入参：该行数据
     */
    clickDeviceRow(val) {
      if (val) {
        this.alarmMainInfo = val
        this.deviceRowId = val._id
        this.getResData()
        if (val.manufacturer === 'guangtuo') {
          this.isFence = true
          this.guangtuoDevIp = val.ip
        } else {
          this.isFence = false
          this.guangtuoDevIp = ''
        }
        /**
         * table组件高亮方法
         */
        this.rowClass = function() {}
      } else {
        this.alarmInData = []
      }
    },
    getResData() {
      this.getResOfDeviceByMainId({ eid: this.deviceRowId })
        .then(res => {
          this.alarmInData = JSON.parse(JSON.stringify(this.alarmInDataById))
          this.alarmInRowId = ''
          if (!this.alarmInData.length) { return }
          this.getAlarmHostPower(this.alarmInData)
          this.changeResourceStatus()
        })
        .catch(err => {
          this.errorMsg('获取报警输入列表失败')
          console.log(err)
        })
    },
    changeResourceStatus() {
      let channelStatus = []
      if (this.isFence) {
        for (let i = 0; i < this.guangtuoStatusList.length; i++) {
          if (this.guangtuoDevIp === this.guangtuoStatusList[i].devIp) {
            channelStatus = this.guangtuoStatusList[i].channelStatus
            break
          }
        }
      } else {
        for (let i = 0; i < this.shikeStatusList.length; i++) {
          if (this.alarmInData[0].ip === this.shikeStatusList[i].devIp) {
            channelStatus = this.shikeStatusList[i].channelStatus
            break
          }
        }
      }
      this.alarmInData.forEach(item => {
        for (let i = 0; i < channelStatus.length; i++) {
          if (item.chan === channelStatus[i].channel) {
            this.$set(item, 'alarmStatus', channelStatus[i].armStatus)
            this.$set(item, 'passStatus', channelStatus[i].passStatus)
            break
          }
        }
      })
    },
    /** 设备布撤防等事件
     * 入参：布撤防类型
     */
    devHendle(methType) {
      if (this.selectHostList.length === 0) {
        this.warningMsg('请先选择要操作的报警主机设备')
        return
      }
      let shikeIds = []
      let guangtuoIds = []
      let methods = []
      this.selectHostList.forEach(item => {
        if (item.manufacturer === 'shike') {
          shikeIds.push(item._id)
        } else if (item.manufacturer === 'guangtuo') {
          guangtuoIds.push(item._id)
        }
      })
      let hasPower = true
      const msg = '存在所选报警主机设备无相应权限'
      switch (methType) {
        case 'protection':
          hasPower = this.judegAlarmHostPower(this.selectHostList, 'deployment', msg)
          if (!hasPower) { return }
          if (shikeIds.length && guangtuoIds.length) {
            methods = [this.protectionAction({ ids: shikeIds, type: 'dev', deviceType: 'shike' }), this.protectionAction({ ids: guangtuoIds, type: 'dev', deviceType: 'guangtuo' })]
          } else if (shikeIds.length && !guangtuoIds.length) {
            methods = [this.protectionAction({ ids: shikeIds, type: 'dev', deviceType: 'shike' })]
          } else if (!shikeIds.length && guangtuoIds.length) {
            methods = [this.protectionAction({ ids: guangtuoIds, type: 'dev', deviceType: 'guangtuo' })]
          }
          Promise.all(methods)
          // this.protectionAction({ ids: this.selectHostIdList, type: 'dev', deviceType: deviceType })
            .then(() => {
              const param = {
                logType: '操作日志',
                module: '报警处理',
                operateName: '报警主机布防',
                operateContent: '报警主机布防',
                target: this.selectHostList.map(item => {
                  return item.name
                }).join(','),
                deviceIp: this.selectHostList.map(item => {
                  return item.ip
                }).join(',')
              }
              this.recordLog(param)
              this.successMsg('布防成功！')
              this.getDevices()
            })
            .catch(() => {
              this.errorMsg('布防失败！')
            })
          break
        case 'removal':
          hasPower = this.judegAlarmHostPower(this.selectHostList, 'disarming', msg)
          if (!hasPower) { return }
          if (shikeIds.length && guangtuoIds.length) {
            methods = [this.removalAction({ ids: shikeIds, type: 'dev', deviceType: 'shike' }), this.removalAction({ ids: guangtuoIds, type: 'dev', deviceType: 'guangtuo' })]
          } else if (shikeIds.length && !guangtuoIds.length) {
            methods = [this.removalAction({ ids: shikeIds, type: 'dev', deviceType: 'shike' })]
          } else if (!shikeIds.length && guangtuoIds.length) {
            methods = [this.removalAction({ ids: guangtuoIds, type: 'dev', deviceType: 'guangtuo' })]
          }
          Promise.all(methods)
          // this.removalAction({ ids: this.selectHostIdList, type: 'dev', deviceType: deviceType })
            .then(() => {
              const param = {
                logType: '操作日志',
                module: '报警处理',
                operateName: '报警主机撤防',
                operateContent: '报警主机撤防',
                target: this.selectHostList.map(item => {
                  return item.name
                }).join(','),
                deviceIp: this.selectHostList.map(item => {
                  return item.ip
                }).join(',')
              }
              this.recordLog(param)
              this.successMsg('撤防成功！')
              this.getDevices()
            })
            .catch(() => {
              this.errorMsg('撤防失败！')
            })
          break
        case 'remove':
          hasPower = this.judegAlarmHostPower(this.selectHostList, 'clean', msg)
          if (!hasPower) { return }
          if (shikeIds.length && guangtuoIds.length) {
            methods = [this.removeAction({ ids: shikeIds, type: 'dev', deviceType: 'shike' }), this.removeAction({ ids: guangtuoIds, type: 'dev', deviceType: 'guangtuo' })]
          } else if (shikeIds.length && !guangtuoIds.length) {
            methods = [this.removeAction({ ids: shikeIds, type: 'dev', deviceType: 'shike' })]
          } else if (!shikeIds.length && guangtuoIds.length) {
            methods = [this.removeAction({ ids: guangtuoIds, type: 'dev', deviceType: 'guangtuo' })]
          }
          Promise.all(methods)
          // this.removeAction({ ids: this.selectHostIdList, type: 'dev', deviceType: 'shike' })
            .then(() => {
              const param = {
                logType: '操作日志',
                module: '报警处理',
                operateName: '报警主机清除',
                operateContent: '报警主机清除',
                target: this.selectHostList.map(item => {
                  return item.name
                }).join(','),
                deviceIp: this.selectHostList.map(item => {
                  return item.ip
                }).join(',')
              }
              this.recordLog(param)
              this.successMsg('清除成功！')
              this.getDevices()
            })
            .catch(() => {
              this.errorMsg('清除失败！')
            })
          break
      }
    },
    /** 设备列表刷新 */
    refash() {
      this.inSearchName = ''
      this.onlineStatus = 'all'
      this.armStatus = 'all'
      this.isWait = true
      this.getDevices()
    },
    /** 设备列表是否显示子节点数据 */
    showChildMeth() {
      this.getDevices()
    },
    /** 设备列表搜索 */
    searchHandle() {
      this.onlineStatus = 'all'
      this.armStatus = 'all'
      this.getDevices()
    },
    /** 报警输入列表点击行事件 */
    clickAlarmInRow(val) {
      this.alarmInRowInfo = val
      this.alarmInRowId = val._id
    },
    searchStatus() {
      setTimeout(() => {
        this.clickDeviceRow(this.alarmHostList[0])
      }, 0)
    },
    /** 报警输入列表布撤防操作
     *  入参：布撤防类型
     */
    resHandle(methType) {
      if (this.selectSectorList.length === 0) {
        this.warningMsg('请先选择要操作的报警防区')
        return
      }
      let deviceType = ''
      if (this.isFence) {
        deviceType = 'guangtuo'
      } else {
        deviceType = 'shike'
      }
      let sectorPower = true
      const sectorMsg = '存在所选报警防区无相应权限'
      switch (methType) {
        case 'protection':
          sectorPower = this.judegAlarmHostPower(this.selectSectorList, 'deployment', sectorMsg)
          if (!sectorPower) { return }
          this.protectionAction({ ids: this.selectSectorIdList, type: 'res', deviceType: deviceType })
            .then(() => {
              const param = {
                logType: '操作日志',
                module: '报警处理',
                operateName: '报警防区布防',
                operateContent: '报警防区布防',
                target: this.selectSectorList.map(item => {
                  return item.name
                }).join(','),
                deviceIp: this.selectSectorList.map(item => {
                  return item.ip
                }).join(',')
              }
              this.recordLog(param)
              this.successMsg('布防成功！')
              this.getResData()
            })
            .catch(() => {
              this.errorMsg('布防失败！')
            })
          break
        case 'removal':
          sectorPower = this.judegAlarmHostPower(this.selectSectorList, 'disarming', sectorMsg)
          if (!sectorPower) { return }
          this.removalAction({ ids: this.selectSectorIdList, type: 'res', deviceType: deviceType })
            .then(() => {
              const param = {
                logType: '操作日志',
                module: '报警处理',
                operateName: '报警防区撤防',
                operateContent: '报警防区撤防',
                target: this.selectSectorList.map(item => {
                  return item.name
                }).join(','),
                deviceIp: this.selectSectorList.map(item => {
                  return item.ip
                }).join(',')
              }
              this.recordLog(param)
              this.successMsg('撤防成功！')
              this.getResData()
            })
            .catch(() => {
              this.errorMsg('撤防失败！')
            })
          break
        case 'remove':
          if (this.isFence) { return }
          sectorPower = this.judegAlarmHostPower(this.selectSectorList, 'clean', sectorMsg)
          if (!sectorPower) { return }
          this.removeAction({ ids: this.selectSectorIdList, type: 'res', deviceType: deviceType })
            .then(() => {
              const param = {
                logType: '操作日志',
                module: '报警处理',
                operateName: '报警防区清除',
                operateContent: '报警防区清除',
                target: this.selectSectorList.map(item => {
                  return item.name
                }).join(','),
                deviceIp: this.selectSectorList.map(item => {
                  return item.ip
                }).join(',')
              }
              this.recordLog(param)
              this.successMsg('清除成功！')
              this.getResData()
            })
            .catch(() => {
              this.errorMsg('清除失败！')
            })
          break
        case 'branch':
          sectorPower = this.judegAlarmHostPower(this.selectSectorList, 'bypass', sectorMsg)
          if (!sectorPower) { return }
          this.branchAction({ids: this.selectSectorIdList, deviceType})
            .then(() => {
              const param = {
                logType: '操作日志',
                module: '报警处理',
                operateName: '报警防区旁路',
                operateContent: '报警防区旁路',
                target: this.selectSectorList.map(item => {
                  return item.name
                }).join(','),
                deviceIp: this.selectSectorList.map(item => {
                  return item.ip
                }).join(',')
              }
              this.recordLog(param)
              this.successMsg('旁路成功！')
              this.getResData()
            })
            .catch(() => {
              this.errorMsg('旁路失败！')
            })
          break
        case 'withdraw':
          sectorPower = this.judegAlarmHostPower(this.selectSectorList, 'removeBypass', sectorMsg)
          if (!sectorPower) { return }
          this.withdrawAction({ids: this.selectSectorIdList, deviceType})
            .then(() => {
              const param = {
                logType: '操作日志',
                module: '报警处理',
                operateName: '报警防区撤旁',
                operateContent: '报警防区撤旁',
                target: this.selectSectorList.map(item => {
                  return item.name
                }).join(','),
                deviceIp: this.selectSectorList.map(item => {
                  return item.ip
                }).join(',')
              }
              this.recordLog(param)
              this.successMsg('撤旁成功！')
              this.getResData()
            })
            .catch(() => {
              this.errorMsg('撤旁失败！')
            })
          break
      }
    },
    /** 设备列表table组件高亮事件回调 */
    rowClass() {},
    /** 切换报警输入视频通道 */
    changeActionVal(data) {
      if (data !== '') {
        this.resActionsData.forEach((item, index) => {
          if (item && data === item._id) {
            /** 切换联动视频，视频播放组件数据封装处 */
            this.actionVideoData = {
              id: item._id,
              ip: item.ip,
              port: item.port,
              channel: item.chan,
              streamType: item.stream,
              type: 'video',
              vendor: 'bstar'
            }
          }
        })
      }
    },
    /** 获取联动视频 */
    openActionVideo(val) {
      this.getResAction({ rid: val._id })
        .then(() => {
          if (this.resActionsSelList[0]) {
            /**
             * resActionsSelList联动视频下拉框默认值设置
             */
            // 默认播放主摄像头
            if (!this.resActionsSelList[0].value) {
              this.actionListSelVal = this.resActionsSelList[0].value
            } else {
              const hasMainCamera = this.resActionsSelList.some(item => {
                if (item.mainCamera) {
                  this.actionListSelVal = item.value
                  return true
                }
              })
              // 主摄像头资源不存在时播放第一条
              if (!hasMainCamera) {
                this.actionListSelVal = this.resActionsSelList[0].value
              }
            }
            this.resActionsData.forEach((item, index) => {
              /** 切换联动视频，视频播放组件数据封装处 */
              if (item && this.actionListSelVal === item._id) {
                this.actionVideoData = {
                  id: item._id,
                  ip: item.ip,
                  port: item.port,
                  channel: item.chan,
                  streamType: item.stream,
                  type: 'video',
                  vendor: 'bstar'
                }
              }
            })
          }
        })
        .catch(err => {
          this.errorMsg('获取联动视频失败')
          console.log(err)
        })
    },
    /** Table组件默认高亮样式控制
     * 入参：该行信息，下标
     */
    rowClassStyle(row, index) {
      if (index === 0) {
        return 'ivu-table-row-highlight'
      }
      return ''
    },
    /** 分页事件 */
    pageChange(n) {
      this.pageInfo.cur = n
      this.getDevices()
    },
    pageSizeChange(n) {
      this.pageInfo.limit = n
      this.getDevices()
    },
    /** 视频组件关闭事件 */
    clear() {
      this.actionVideoData = {}
    },
    /* 批量选择报警主机 */
    selectAlarmHost(selection) {
      this.selectHostList = selection
      this.selectHostIdList = []
      this.selectHostList.forEach(item => {
        this.selectHostIdList.push(item._id)
      })
    },
    /* 批量选择报警防区 */
    selectAlarmSector(selection) {
      this.selectSectorList = selection
      this.selectSectorIdList = []
      this.selectSectorList.forEach(item => {
        this.selectSectorIdList.push(item._id)
      })
    }
  },
  mounted() {
    /** 自适应高度 */
    this.tableHeight = this.$refs.tableBox.offsetHeight - 50
  },
  created() {
    this.getTreeData()
    /** 获取报警管理配置，用于判断 */
    this.getAlarmTemp().catch(err => {
      console.log('this.getAlarmTemp :' + err)
    })
    this.getSortData().catch(err => {
      console.log('this.getSortData :' + err)
    })
  },
  beforeDestroy() {
    clearInterval(this.timerId)
  }
}
</script>
<style lang="less" scoped>
.alarmMainframe {
  background: #171717;
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  padding: 16px 0;
  .alarm-left {
    flex: 0 0 272px;
    min-height: 670px;
    background: #1c3053;
    margin-right: 16px;
    display: flex;
    flex-direction: row;
    .alarm-sidebar {
      width: 100%;
      background: #1c3053;
      display: flex;
      flex-direction: column;
      width: 272px;
      padding-top: 10px;
      .sidebar-title {
        text-align: center;
        font-weight: 600;
      }
      .sidebar-search {
        padding: 10px;
      }
      .sidebar-scroll {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
      a {
        display: block;
        text-align: center;
        font-size: 14px;
        color: #fff;
        background-color: #0f2243;
        height: 40px;
        line-height: 40px;
        width: 100%;
      }
    }
  }
  .alarm-main {
    overflow: hidden;
    width: calc(~'100% - 288px');
    height: calc(~'100% - 32px');
    min-height: 670px;
    background: #1c3053;
    position: absolute;
    left: 288px;
    .main-top {
      width: 100%;
      height: 50%;
      .car-list {
        height: calc(~'100% - 120px');
        min-height: 300px;
        .table-box {
          margin-top: 10px;
          height: 100%;
        }
      }
      .mainTop-btn {
        text-align: left;
        width: 100%;
        margin-top: 10px;
        margin-left: 20px;
        .mainTopBtn-input {
          width: 250px;
          position: relative;
          right: 25px;
          float: right;
        }
      }
      .table-footer {
        .pageRt {
          position: relative;
          left: 70%;
        }
      }
    }
    .main-bottom {
      width: 100%;
      height: 40%;
      .mainBtm-left {
        float: left;
        width: 65%;
        height: 100%;
        .feature-btn {
          text-align: left;
          margin-left: 20px;
        }
        .car-list {
          padding-top: 10px;
        }
      }
      .mainBtm-right {
        float: left;
        width: 30%;
        height: 100%;
        margin: 0;
        .mainBtm-title {
          margin-left: 10px;
        }
        .mainBtm-video {
          margin: 10px;
          width: 100%;
          height: 80%;
        }
      }
    }
  }
}

.rt {
  float: right;
}
.feature-btn > button {
  margin-left: 10px;
}
</style>
