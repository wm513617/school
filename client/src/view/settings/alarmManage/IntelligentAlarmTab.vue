<template>
  <div class="tab-content-alarm">
    <div class="feature-btn">
      <Button type="ghost" icon="plus" @click="openAddMod">添加</Button>
      <Button type="ghost" icon="edit" :disabled="isCannotClick" @click="edit(0)">修改</Button>
      <Button type="ghost" icon="trash-a" :disabled="isCannotClick" @click="deleteAlarm">删除</Button>
      <Button type="ghost" icon="edit" :disabled="isCannotClick" @click="edit(1)">批量修改</Button>
      <Button type="ghost" icon="refresh" @click="getImportData">刷新</Button>
      <Input v-model="inSearchName" placeholder="按名称模糊查询" style="width: 250px;" class="rt">
      <Button slot="append" @click="search">搜索</Button>
      </Input>
      <Checkbox v-model="subDevice" class="lf" @on-change="getImportData">显示子机构设备</Checkbox>
      <Checkbox v-model="onlyLink" class="lf" @on-change="getImportData">只显示未配置联动</Checkbox>
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
    <!-- 添加 弹框 -->
    <div v-if="isOpenAddMod">
      <AddModal :isOpen="isOpenAddMod" addModTitle="智能报警添加" type="IntelligentAlarm" :deviceTree="deviceTree" @close="close" @addNewOne="addNewOne"></AddModal>
    </div>
    <!-- 修改 批量修改 弹框 -->
    <div v-if="isOpenEditMod">
      <Modal v-model="isOpenEditMod" :width="480" :title="isEditOne ? '智能报警修改' : '智能报警批量修改'" :mask-closable="false">
        <Form :model="editDataInfo" ref="editForm" :rules="oneRule" :label-width="95" label-position="left">
          <FormItem v-if="isEditOne" label="所属设备">
            <Input v-model="editDataInfo.rid.eid.name" disabled></Input>
          </FormItem>
          <FormItem v-if="isEditOne" label="通道号">
            <Input v-model="editDataInfo.chan" disabled></Input>
          </FormItem>
          <FormItem v-if="isEditOne" label="报警类型">
            <Input :value="alarmType[editDataInfo.subtype]" disabled></Input>
          </FormItem>
          <FormItem label="报警级别">
            <Select v-model="editDataInfo.level">
              <Option v-for="item in alarmLevel" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
          <Button type="ghost" @click="cancelEdit">取消</Button>
          <Button type="primary" @click="sureEdit">确定</Button>
        </div>
      </Modal>
    </div>
    <!-- 联动配置 弹框 -->
    <div v-if="isShowLink">
      <LinkConfigModal :model="isShowLink" :resData="linkData" type="intelligent" :rootOrgId="orgId" :activeOrgId="activeOrgId" @close="isShowLink = false" @refrash="getImportData"></LinkConfigModal>
    </div>
  </div>
</template>

<script>
import AddModal from './AddModal'
import LinkConfigModal from './LinkConfigModal'
import './alarmStyle.css'
import { numberValidate } from './allJs/formCheck.js'
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  components: {
    AddModal,
    LinkConfigModal
  },
  props: {
    orgId: {
      type: String,
      default: ''
    },
    activeOrgId: {
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
      inSearchName: '',
      isShowLink: false,
      linkData: {},
      importTitle: [
        {
          type: 'selection',
          width: 60
        },
        {
          title: '通道名称',
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
          title: '报警类型',
          key: 'subtype',
          // minWidth: 100
          render: (h, params) => {
            return h('span', this.alarmType[params.row.subtype])
          }
        },
        {
          title: '通道号',
          key: 'chan'
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
                    this.linkData = params.row
                    this.isShowLink = true
                  }
                }
              }, '配置')
            ])
          }
        }
      ],
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
      isCannotClick: true, // 按钮是否可点击
      dataList: [], // 表格数据
      selectData: [],
      selectDataIds: [],
      isOpenAddMod: false,
      deviceTree: [],
      isOpenEditMod: false, // 修改、批量修改 弹框
      isEditOne: true, // 单个 or 批量 修改
      editDataInfo: {
        orgName: '所属设备',
        chan: 1,
        subtype: '',
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
        minintervaltime: [
          {required: true, validator: numberValidate(0, 7200), trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['enabledTemp']),
    ...mapState({
      alarmType: ({alarmThreeD}) => alarmThreeD.alarmType
    })
  },
  watch: {
    activeOrgId: {
      handler(val) {
        if (val) {
          this.pageCur = 1
          this.getImportData()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['getIntelligentAlarmData', 'getMonitorTree', 'addIntelligentAlarmData', 'recordLog', 'deleteIntelligentAlarmData', 'editIntelligentAlarmData', 'editMoreIntelligentAlarmData', 'getOneAlarmTabNumber']),
    // 获取报警输入列表数据
    getImportData() {
      let data = {
        oid: this.activeOrgId,
        never: this.subDevice ? -1 : 0,
        seek: this.inSearchName,
        page: this.pageCur,
        limit: this.pageLimit,
        config: this.onlyLink ? '1' : '0'
      }
      this.getIntelligentAlarmData(data)
        .then((res) => {
          this.isCannotClick = true
          this.dataList = res.data
          this.pageTotal = Number(res.headers['x-bsc-count'])
          this.getOneAlarmTabNumber({type: 'intelligentAlarmNo', count: this.pageTotal})
        })
        .catch(() => {
          this.errorMsg('智能报警报警获取失败')
        })
    },
    search() {
      this.pageCur = 1
      this.getImportData()
    },
    pageSizeChange(n) {
      this.pageLimit = n
      this.getImportData()
    },
    pageChange(page) {
      this.pageCur = page
      this.getImportData()
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
    openAddMod() {
      let param = {
        oid: this.activeOrgId,
        channeltype: 0,
        orgtype: 0,
        bigtype: 0
      }
      this.getMonitorTree(param).then(res => {
        this.deviceTree = [res.data]
      }).catch(() => {
        this.warningMsg('机构树获取失败')
      })
      this.isOpenAddMod = true
    },
    // 确认添加
    addNewOne(data) {
      let param = {
        orgId: this.activeOrgId,
        objs: data.resNodes.map(item => {
          return {
            rid: item._id,
            name: item.name,
            chan: item.chan
          }
        }),
        ...data.body
      }
      this.addIntelligentAlarmData(param).then(res => {
        this.recordMsg(data.resNodes, '报警添加', '智能报警添加')
        this.getImportData()
        this.close()
      }).catch((err) => {
        this.warningMsg(err.response.data.message)
      })
    },
    deleteAlarm() {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除吗？</p>',
        onOk: () => {
          this.sureDeleteAlarm()
        },
        onCancel: () => {}
      })
    },
    // 删除
    sureDeleteAlarm() {
      let ids = this.selectDataIds.join(',')
      this.deleteIntelligentAlarmData(ids).then(res => {
        this.recordMsg(this.selectData, '报警删除', '智能报警删除')
        if (this.pageCur === Math.ceil(this.pageTotal / this.pageLimit) && (this.selectDataIds.length === this.pageLimit || this.selectDataIds.length === (this.pageTotal % this.pageLimit)) && this.pageCur !== 1) {
          this.pageCur -= 1
        }
        this.getImportData()
      }).catch(() => {
        this.errorMsg('删除失败')
      })
    },
    close() {
      this.isOpenAddMod = false
    },
    edit(val) {
      if (val) {
        this.isEditOne = false
        this.affirmMethod = '手动一级确认'
        this.editDataInfo = {
          level: 1,
          alarmtemplate: this.enabledTemp[0].value,
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
        }
      } else {
        if (this.selectData.length !== 1) {
          this.$Modal.confirm({
            title: '提示',
            content: '一次只能修改一个！'
          })
          return
        }
        this.isEditOne = true
        this.editDataInfo = JSON.parse(JSON.stringify(this.selectData[0]))
        if (this.editDataInfo.alarmaffirm.autoaffirm.status) {
          this.affirmMethod = '自动确认'
        } else if (this.editDataInfo.alarmaffirm.handaffirm.status) {
          this.affirmMethod = '手动一级确认'
        } else {
          this.affirmMethod = '手动二级确认'
        }
      }
      this.isOpenEditMod = true
    },
    // 确认 修改
    sureEdit() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          // 确认修改 逻辑
          let param = {}
          this.editDataInfo.minintervaltime = Number(this.editDataInfo.minintervaltime)
          if (this.isEditOne) {
            param = {
              id: this.selectDataIds[0],
              body: this.editDataInfo
            }
            this.editIntelligentAlarmData(param).then(res => {
              this.recordMsg(this.selectData, '报警修改', '智能报警修改')
              this.getImportData()
            }).catch(() => {
              this.warningMsg('修改失败')
            })
          } else {
            param = {
              ids: this.selectDataIds,
              ...this.editDataInfo
            }
            this.editMoreIntelligentAlarmData(param).then(() => {
              this.recordMsg(this.selectData, '报警修改', '智能报警批量修改')
              this.getImportData()
            }).catch(() => {
              this.warningMsg('批量修改失败')
            })
          }
          this.isOpenEditMod = false
        }
      })
    },
    cancelEdit() {
      this.initEditForm()
      this.isOpenEditMod = false
    },
    // 初始化修改表单
    initEditForm() {
      this.editDataInfo = {
        orgName: '所属设备',
        chan: 1,
        subtype: '',
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
      }
      this.affirmMethod = '手动一级确认'
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

<style scoped lang=''>
.ivu-input-number {
  width: 100%;
}
</style>
