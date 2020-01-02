<template>
  <div class="tab-content-alarm">
    <div class="feature-btn">
      <Button type="ghost" icon="arrow-move" :disabled="isCannotClick" @click="moveToDevice">移动</Button>
      <Button type="ghost" icon="edit" :disabled="isCannotClick" @click="edit">批量修改</Button>
      <Button type="ghost" icon="edit" :disabled="isCannotClick" @click="someConfig">批量配置</Button>
      <Button type="ghost" icon="ivu-icon iconfont icon-export" @click="exportFile">导出</Button>
      <Button type="ghost" icon="refresh" @click="getRefrashData">刷新</Button>
      <Button type="ghost" icon="refresh" @click="syncdevice" :loading="issyncing">同步</Button>
      <Input v-model="inSearchName" placeholder="按名称模糊查询" style="width: 250px;" class="rt">
      <Button slot="append" @click="search">搜索</Button>
      </Input>
      <Checkbox v-model="subDevice" class="lf" @on-change="getfireAlarmData">显示子机构设备</Checkbox>
      <Checkbox v-model="onlyLink" class="lf" @on-change="getfireAlarmData">只显示未配置联动</Checkbox>
    </div>
    <div class="car-list flex-1" style="padding-top:10px;">
      <div class="table-box" style="height: 100%;" ref="tableBox1">
        <Table size="small" :columns="importTitle" :data="dataList" :height="tableHeight" @on-selection-change="selectItem"></Table>
        <div class="table-footer">
          <div class="rt">
            <Page show-sizer :page-size-opts="$PageInfo.size" :show-total="true" :show-elevator="true" :page-size="pageLimit" :current="pageCur" @on-page-size-change="pageSizeChange" :total="pageTotal" @on-change="pageChange"></Page>
          </div>
        </div>
      </div>
    </div>
    <!-- 修改/批量修改 弹框 -->
    <div v-if="isOpenEditMod">
      <Modal v-model="isOpenEditMod" :width="480" :title="isEditOne ? '消防报警修改' : '消防报警批量修改'" :mask-closable="false">
        <Form :model="editDataInfo" ref="editForm" :rules="isEditOne ? oneRule : moreEditRule" :label-width="95" label-position="left">
          <!-- <FormItem label="报警子类型">
            <Select v-model="editDataInfo.subtype">
              <Option v-for="item in alarmSubType" :key="item.value" :value="item.value">{{item.label}}</Option>
            </Select>
          </FormItem> -->
          <FormItem label="报警级别">
            <Select v-model="editDataInfo.level">
              <Option v-for="item in alarmLevel" :key="item.value" :value="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="报警接收时间">
            <Select v-model="editDataInfo.alarmtemplate">
              <Option v-for="item in enabledTemp" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="报警接收间隔" prop="minintervaltime">
            <Input v-model.trim="editDataInfo.minintervaltime"></Input>
          </FormItem>
          <FormItem label="报警确认">
            <RadioGroup v-model="affirmMethod" vertical @on-change="changeAffirm">
              <Radio label="自动确认">自动确认
                <Input-number :min="0" :max="300" :disabled="!editDataInfo.alarmaffirm.autoaffirm.status" v-model="editDataInfo.alarmaffirm.autoaffirm.intervaltime"></Input-number>秒
              </Radio>
              <Radio label="手动一级确认"></Radio>
              <Radio label="手动二级确认"></Radio>
            </RadioGroup>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="ghost" @click="isOpenEditMod = false">取消</Button>
          <Button type="primary" @click="sureEdit">确定</Button>
        </div>
      </Modal>
    </div>
    <!-- 移动 弹框 -->
    <div v-if="isMove">
      <MoveDeviceModal :isOpen="isMove" @close="isMove = false" @moveDevice="moveDevice"></MoveDeviceModal>
    </div>
    <!-- 联动配置/批量配置 弹框 -->
    <div v-if="isShowLink">
      <LinkConfigModal :model="isShowLink" :resData="linkData" :isOne="isLinkOne" :ids="isLinkOne ? '' : selectDataIds.join(',')" :rootOrgId="orgId" :activeOrgId="activeOrgId" @close="isShowLink = false" @refrash="getfireAlarmData"></LinkConfigModal>
    </div>
  </div>
</template>

<script>
import MoveDeviceModal from './MoveDeviceModal'
import LinkConfigModal from './LinkConfigModal'
import './alarmStyle.css'
import { numberValidate } from './allJs/formCheck.js'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    MoveDeviceModal,
    LinkConfigModal
  },
  props: {
    activeOrgId: {
      type: String,
      default: ''
    },
    orgId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableHeight: 420,
      pageLimit: this.$PageInfo.limit,
      pageTotal: 0,
      pageCur: 1,
      subDevice: true,
      onlyLink: false,
      importTitle: [
        {
          type: 'selection',
          width: 60
        },
        {
          title: '消防报警名称',
          key: 'name,',
          render: (h, params) => {
            return h('span', {
              style: {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              },
              domProps: {
                title: params.row.name
              }
            }, params.row.name)
          }
        },
        {
          title: '建筑物名称',
          key: 'fireBuildingStructureName',
          ellipsis: true
        },
        {
          title: '消防报警ID',
          key: 'fireControlId',
          ellipsis: true
        },
        {
          title: '建筑物ID',
          key: 'fireBuildingStructureId'
          // minWidth: 100
        },
        {
          title: '报警子类型',
          key: 'subtype',
          render: (h, params) => {
            return h('span', this.fireAlarmSubtype[params.row.subtype])
          }
          // minWidth: 100
        },
        {
          title: '报警级别',
          key: 'level'
          // minWidth: 100
        },
        {
          title: '报警接收时间',
          key: 'alarmtemplate',
          // minWidth: 180
          render: (h, params) => {
            let time = ''
            if (this.enabledTemp.length !== 0) {
              this.enabledTemp.forEach((item) => {
                if (params.row.alarmtemplate !== undefined && item.value === params.row.alarmtemplate) {
                  time = item.label
                }
              })
            }
            return h('div', time)
          }
        },
        {
          title: '报警接收间隔',
          key: 'minintervaltime'
        },
        {
          title: '联动配置',
          key: 'linkConfig',
          // minWidth: 150,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: params.row.actionConfig ? 'success' : 'ghost'
                },
                on: {
                  click: () => {
                    console.log(params.row)
                    this.isLinkOne = true
                    this.linkData = params.row
                    this.isShowLink = true
                  }
                }
              }, '配置')
            ])
          }
        }
      ],
      alarmSubType: [ // 报警子类型
        {label: '感烟', value: 'smoke'},
        {label: '感温', value: 'temperature'},
        {label: '消火栓', value: 'hydrant'},
        {label: '手报', value: 'handNewspaper'}
      ],
      fireAlarmSubtype: {
        smoke: '感烟',
        temperature: '感温',
        hydrant: '消火栓',
        handNewspaper: '手报'
      },
      alarmLevel: [ // 报警级别
        {label: 1, value: 1},
        {label: 2, value: 2},
        {label: 3, value: 3},
        {label: 4, value: 4},
        {label: 5, value: 5},
        {label: 6, value: 6},
        {label: 7, value: 7},
        {label: 8, value: 8},
        {label: 9, value: 9}
      ],
      affirmMethod: '手动一级确认',
      dataList: [], // 表格数据
      isCannotClick: true, // 按钮是否可点击
      selectData: [],
      selectDataIds: [],
      inSearchName: '',
      isShowLink: false,
      linkData: {},
      isEditOne: true, // 单个修改、批量修改
      isOpenEditMod: false, // 修改、批量修改弹框控制
      editDataInfo: { // 修改弹框绑定数据
        eid: '',
        name: '',
        devloop: 0,
        chan: 0,
        subtype: '感烟',
        level: 1,
        alarmtemplate: '',
        minintervaltime: 0,
        alarmaffirm: {
          autoaffirm: {
            status: false,
            intervaltime: 20
          },
          handaffirm: {
            status: true
          },
          handaffirm2: {
            status: false
          }
        }
      },
      oneRule: {
        name: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        devloop: [
          {required: true, validator: numberValidate(0, 512), trigger: 'blur'}
        ],
        chan: [
          {required: true, validator: numberValidate(0, 512), trigger: 'blur'}
        ],
        minintervaltime: [{
          required: true, validator: numberValidate(0, 7200), trigger: 'blur'
        }]
      },
      moreRule: {
        devloop: [
          {required: true, validator: numberValidate(0, 512), trigger: 'blur'}
        ],
        fireInputNum: [
          {required: true, validator: numberValidate(1, 512), trigger: 'blur'}
        ],
        chan: [
          {required: true, validator: numberValidate(0, 512), trigger: 'blur'}
        ],
        minintervaltime: [{
          required: true, validator: numberValidate(0, 7200), trigger: 'blur'
        }]
      },
      moreEditRule: {
        minintervaltime: [{required: true, validator: numberValidate(0, 7200), trigger: 'blur'}]
      },
      isMove: false,
      isLinkOne: true, // 单个配置
      issyncing: false
    }
  },
  computed: {
    ...mapGetters(['enabledTemp'])
  },
  watch: {
    activeOrgId: {
      handler(val) {
        if (val) {
          this.pageCur = 1
          this.getfireAlarmData()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['recordLog', 'getFireAlarmData', 'moveFireAlarmData', 'editFireAlarmData', 'editMoreFireAlarmData', 'getOneAlarmTabNumber', 'syncFireAlarm']),
    // 获取消防报警数据
    getfireAlarmData() {
      let data = {
        page: this.pageCur,
        limit: this.pageLimit,
        seek: this.inSearchName,
        oid: this.activeOrgId,
        never: this.subDevice ? -1 : 0,
        config: this.onlyLink ? '1' : '0'
      }
      this.getFireAlarmData(data)
        .then(res => {
          this.isCannotClick = true
          this.dataList = res.data
          this.pageTotal = Number(res.headers['x-bsc-count'])
          this.getOneAlarmTabNumber({type: 'fireAlarmNo', count: this.pageTotal})
        })
        .catch(() => {
          this.errorMsg('输入防区数据获取失败')
        })
    },
    // 刷新
    getRefrashData() {
      let data = {
        page: this.pageCur,
        limit: this.pageLimit,
        seek: this.inSearchName,
        oid: this.activeOrgId,
        never: this.subDevice ? -1 : 0,
        config: this.onlyLink ? '1' : '0',
        action: 'button'
      }
      this.getFireAlarmData(data)
        .then(res => {
          this.isCannotClick = true
          this.dataList = res.data
          this.pageTotal = Number(res.headers['x-bsc-count'])
          this.getOneAlarmTabNumber({type: 'fireAlarmNo', count: this.pageTotal})
        })
        .catch(() => {
          this.errorMsg('输入防区数据获取失败')
        })
    },
    // 同步
    syncdevice() {
      this.issyncing = true
      this.syncFireAlarm().then(() => {
        return this.getfireAlarmData()
      }).then(() => {
        this.successMsg('科大国创设备同步成功')
        this.issyncing = false
      }).catch(() => {
        this.issyncing = false
        this.errorMsg('科大国创设备同步失败')
      })
    },
    search() {
      this.pageCur = 1
      this.getfireAlarmData()
    },
    pageSizeChange(n) {
      this.pageLimit = n
      this.getfireAlarmData()
    },
    pageChange(page) {
      this.pageCur = page
      this.getfireAlarmData()
    },
    selectItem(selection) {
      this.selectDataIds = []
      this.selectData = selection
      selection.forEach(item => {
        this.selectDataIds.push(item._id)
      })
      if (selection.length === 0) {
        this.isCannotClick = true
      } else {
        this.isCannotClick = false
      }
    },
    // 修改、批量修改 弹框
    edit() {
      this.editDataInfo.subtype = this.alarmSubType[0].value
      this.editDataInfo.level = 1
      this.editDataInfo.alarmtemplate = this.enabledTemp[0].value
      this.editDataInfo.minintervaltime = 0
      this.editDataInfo.alarmaffirm = {
        autoaffirm: {
          status: false,
          intervaltime: 20
        },
        handaffirm: {
          status: true
        },
        handaffirm2: {
          status: false
        }
      }
      this.affirmMethod = '手动一级确认'
      this.isEditOne = false
      this.isOpenEditMod = true
    },
    // 确认 修改、批量修改
    sureEdit() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          // 修改逻辑
          this.editDataInfo.fireInputNum = Number(this.editDataInfo.fireInputNum)
          this.editDataInfo.chan = Number(this.editDataInfo.chan)
          this.editDataInfo.minintervaltime = Number(this.editDataInfo.minintervaltime)
          if (this.isEditOne) {
            let param = {
              id: this.selectDataIds.join(','),
              body: {...this.editDataInfo,
                fireAlarmUpdate: true
              }
            }
            this.editFireAlarmData(param).then(res => {
              this.getfireAlarmData()
              this.recordMsg(this.selectData, '报警修改', '消防报警修改')
              this.isOpenEditMod = false
            }).catch(() => {
              this.warningMsg('修改失败')
            })
          } else {
            let param = {
              id: this.selectDataIds.join(','),
              body: {
                level: this.editDataInfo.level,
                alarmtemplate: this.editDataInfo.alarmtemplate,
                minintervaltime: this.editDataInfo.minintervaltime,
                alarmaffirm: this.editDataInfo.alarmaffirm,
                fireAlarmUpdate: true
              }
            }
            this.editMoreFireAlarmData(param).then(res => {
              this.getfireAlarmData()
              this.recordMsg(this.selectData, '报警修改', '消防报警批量修改')
              this.isOpenEditMod = false
            }).catch(() => {
              this.warningMsg('修改失败')
            })
          }
        }
      })
    },
    changeAffirm(val) {
      switch (val) {
        case '自动确认':
          this.editDataInfo.alarmaffirm.autoaffirm.status = true
          this.editDataInfo.alarmaffirm.handaffirm.status = false
          this.editDataInfo.alarmaffirm.handaffirm2.status = false
          break
        case '手动一级确认':
          this.editDataInfo.alarmaffirm.autoaffirm.status = false
          this.editDataInfo.alarmaffirm.handaffirm.status = true
          this.editDataInfo.alarmaffirm.handaffirm2.status = false
          break
        case '手动二级确认':
          this.editDataInfo.alarmaffirm.autoaffirm.status = false
          this.editDataInfo.alarmaffirm.handaffirm.status = false
          this.editDataInfo.alarmaffirm.handaffirm2.status = true
          break
      }
    },
    // 点击 移动按钮
    moveToDevice() {
      this.isMove = true
    },
    // 确认移动
    moveDevice(oid) {
      let param = {
        id: this.selectDataIds.join(','),
        body: {
          oid: oid
        }
      }
      this.moveFireAlarmData(param).then(suc => {
        this.isMove = false
        this.selectDataIds = []
        this.getfireAlarmData()
        this.successMsg('资源移动成功')
      }).catch(err => {
        this.errorMsg('资源移动失败')
        console.log(err)
      })
    },
    // 批量配置
    someConfig() {
      this.isLinkOne = false
      this.isShowLink = true
    },
    exportFile() {
      let elemIF = document.createElement('iframe')
      elemIF.src =
        window.location.origin + `/api/setting/alarmcfg/fireExport?type=11`
      elemIF.style.display = 'none'
      document.body.appendChild(elemIF)
    },
    recordMsg(selectList, operateName, operateContent) {
      if (selectList instanceof Array) {
        let targets = []
        let deviceIps = []
        selectList.forEach(item => {
          targets.push(item.name)
          deviceIps.push(item.ip)
        })
        const param = {
          logType: '管理日志',
          module: '报警管理',
          operateName: operateName,
          operateContent: operateContent,
          target: targets.join(','),
          deviceIp: deviceIps.join(',')
        }
        this.recordLog(param)
      } else {
        const param = {
          logType: '管理日志',
          module: '报警管理',
          operateName: operateName,
          operateContent: operateContent,
          target: selectList.name,
          deviceIp: selectList.ip
        }
        this.recordLog(param)
      }
    }
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox1'].offsetHeight - 35
  }
}
</script>

<style scoped lang='less'>
.count {
  font-size: 12px;
  position: absolute;
  top: 0;
  right: -100px;
}
.ivu-input-number {
  width: 67%;
}
.ivu-form-item {
  width: 336px;
}
</style>
