<template>
  <div class="tab-content-alarm">
    <div class="feature-btn">
      <Button type="ghost" icon="plus"  @click="openAddMod">添加</Button>
      <Button type="ghost" icon="edit" :disabled="isCannotClick"  @click="edit(0)">修改</Button>
      <Button type="ghost" icon="trash-a" :disabled="isCannotClick" @click="deleteAlarm">删除</Button>
      <Button type="ghost" icon="arrow-move" :disabled="isCannotClick" @click="moveToDevice">移动</Button>
      <Button type="ghost" icon="edit" :disabled="isCannotClick"  @click="edit(1)">批量修改</Button>
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
      <AddModal :isOpen="isOpenAddMod" addModTitle="报警防区添加" type="alarmHost" :deviceTree="deviceTree" @close="close" @addNewOne="addNewOne"></AddModal>
    </div>
    <!-- 修改/批量修改 弹框 -->
    <div v-if="isEdit">
      <Modal v-model="isEdit" width="480" :title="isEditOne ? '报警防区修改' : '报警防区批量修改'" :mask-closable="false">
        <Form :model="editData" ref="editForm" :rules="isEditOne ? oneRule : moreRule" :label-width="95" label-position="left" style="padding: 0 10px;">
          <Form-item label="所属设备" v-if="isEditOne">
            <Input v-model="editData.orgName" disabled/>
          </Form-item>
          <Form-item label="报警输入编号" v-if="isEditOne">
            <Input v-model="editData.chan" disabled/>
          </Form-item>
          <Form-item label="报警名称" v-if="isEditOne" prop="name">
            <Input v-model="editData.name" />
          </Form-item>
          <FormItem label="报警子类型">
            <Select v-model="editData.subtype">
              <Option v-for="item in alarmSubType" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <Form-item label="级别">
            <Select v-model="editData.level">
              <Option v-for="item in alarmLevel" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item>
          <FormItem label="报警接收时间">
            <Select v-model="editData.alarmtemplate">
              <Option v-for="item in enabledTemp" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="报警接收间隔" prop="minintervaltime">
            <Input v-model.trim="editData.minintervaltime"></Input>
          </FormItem>
          <FormItem label="报警确认">
            <RadioGroup v-model="affirmMethod" vertical @on-change="changeAffirm">
              <Radio label="自动确认">自动确认
                <Input-number :min="0" :max="300" :disabled="!editData.alarmaffirm.autoaffirm.status" v-model="editData.alarmaffirm.autoaffirm.intervaltime"></Input-number>秒
              </Radio>
              <Radio label="手动一级确认"></Radio>
              <Radio label="手动二级确认"></Radio>
            </RadioGroup>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="ghost" @click="isEdit = false">取消</Button>
          <Button type="primary" @click="sureEdit">确定</Button>
        </div>
      </Modal>
    </div>
    <!-- 移动 弹框 -->
    <div v-if="isMove">
      <MoveDeviceModal :isOpen="isMove" @close="isMove = false" @moveDevice="moveDevice"></MoveDeviceModal>
    </div>
    <!-- 联动配置 弹框 -->
    <div v-if="isShowLink">
      <LinkConfigModal :model="isShowLink" :resData="linkData" :rootOrgId="orgId" :activeOrgId="activeOrgId" @close="isShowLink = false" @refrash="getImportData"></LinkConfigModal>
    </div>
  </div>
</template>

<script>
import AddModal from './AddModal'
import MoveDeviceModal from './MoveDeviceModal'
import LinkConfigModal from './LinkConfigModal'
import './alarmStyle.css'
import { numberValidate } from './allJs/formCheck.js'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    AddModal,
    MoveDeviceModal,
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
      importTitle: [
        {
          type: 'selection',
          width: 60
        },
        {
          title: '报警防区名称',
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
          title: '所属设备',
          key: 'mainname',
          ellipsis: true,
          // minWidth: 220,
          render: (h, params) => {
            let name = ''
            name = params.row.eid.name
            return h('div', name)
          }
        },
        {
          title: '防区编号',
          key: 'chan'
          // minWidth: 100
        },
        {
          title: '报警子类型',
          key: 'subtype',
          render: (h, params) => {
            return h('span', this.alarmZoneType[params.row.subtype])
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
          title: '视频联动',
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
      dataList: [], // 表格数据
      linkData: {}, // 当前联动配置数据
      isCannotClick: true, // 按钮是否可点击
      selectData: [],
      selectDataIds: [],
      isOpenAddMod: false,
      deviceTree: [],
      isEdit: false, // 修改 弹框控制
      isEditOne: true, // 单个 批量
      editData: {
        orgName: '所属设备',
        chan: 1,
        name: '',
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
      alarmSubType: [
        {label: '周界报警', value: 'perimeterAlarm'},
        {label: '入侵报警', value: 'intrusionAlarm'},
        {label: '电子围栏', value: 'electricFence'}
      ], // 报警输入子类型
      alarmZoneType: {
        perimeterAlarm: '周界报警',
        intrusionAlarm: '入侵报警',
        electricFence: '电子围栏'
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
      oneRule: {
        name: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        minintervaltime: [
          {required: true, validator: numberValidate(0, 7200), trigger: 'blur'}
        ]
      },
      moreRule: {
        minintervaltime: [
          {required: true, validator: numberValidate(0, 7200), trigger: 'blur'}
        ]
      },
      isMove: false
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
          this.getImportData()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['getNormalAlarmAddTree', 'getAlarmHostData', 'changeResourceOrg', 'addAlarmInputData', 'recordLog', 'deleteAlarmInputData', 'editAlarmInputData', 'editMoreAlarmInputData', 'getOneAlarmTabNumber']),
    // 获取报警防区列表数据
    getImportData() {
      let data = {
        oid: this.activeOrgId,
        never: this.subDevice ? -1 : 0,
        seek: this.inSearchName,
        page: this.pageCur,
        limit: this.pageLimit,
        type: '9',
        config: this.onlyLink ? '1' : '0'
      }
      this.getAlarmHostData(data)
        .then((res) => {
          this.isCannotClick = true
          this.dataList = res.data
          this.pageTotal = Number(res.headers['x-bsc-count'])
          this.getOneAlarmTabNumber({type: 'alarmHostNo', count: this.pageTotal})
        })
        .catch(err => {
          console.log('logout error:' + err)
          this.errorMsg('报警防区获取失败')
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
        oid: this.orgId,
        orgtype: 0,
        channelTypes: '9',
        bigTypes: '1'
      }
      this.getNormalAlarmAddTree(param).then(res => {
        this.deviceTree = [res.data]
      }).catch(() => {
        this.errorMsg('资源树获取失败')
      })
      this.isOpenAddMod = true
    },
    addNewOne(data) {
      let params = {
        oid: this.activeOrgId,
        rids: data.resNodes.map(item => item._id),
        body: data.body
      }
      this.addAlarmInputData(params).then(() => {
        this.recordMsg(data.resNodes, '报警添加', '报警防区添加')
        this.getImportData()
        this.close()
      }).catch(() => {
        this.errorMsg('添加失败')
      })
    },
    close() {
      this.isOpenAddMod = false
    },
    // 点击修改、批量修改
    edit(val) {
      if (!val) {
        if (this.selectData.length !== 1) {
          this.$Modal.confirm({
            title: '提示',
            content: '一次只能修改一个！'
          })
          return
        }
        this.isEditOne = true
        this.editData = JSON.parse(JSON.stringify(this.selectData[0]))
        this.editData.orgName = this.selectData[0].eid.name
        if (this.editData.alarmaffirm.autoaffirm.status) {
          this.affirmMethod = '自动确认'
        } else if (this.editData.alarmaffirm.handaffirm.status) {
          this.affirmMethod = '手动一级确认'
        } else {
          this.affirmMethod = '手动二级确认'
        }
      } else {
        this.isEditOne = false
        this.affirmMethod = '手动一级确认'
        this.editData = {
          subtype: this.alarmSubType[0].value,
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
      }
      this.isEdit = true
    },
    // 确认 修改
    sureEdit() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          let param = {}
          this.editData.minintervaltime = Number(this.editData.minintervaltime)
          if (this.isEditOne) {
            param = {
              _id: this.selectDataIds[0],
              body: this.editData
            }
            this.editAlarmInputData(param).then(res => {
              this.recordMsg(this.selectData, '报警修改', '报警主机修改')
              this.getImportData()
            }).catch(() => {
              this.errorMsg('修改失败')
            })
          } else {
            param = {
              ids: this.selectDataIds.join(','),
              body: this.editData
            }
            this.editMoreAlarmInputData(param).then(res => {
              this.recordMsg(this.selectData, '报警修改', '报警主机批量修改')
              this.getImportData()
            }).catch(() => {
              this.errorMsg('修改失败')
            })
          }
          this.isEdit = false
        }
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
      this.deleteAlarmInputData(ids).then(res => {
        this.recordMsg(this.selectData, '报警删除', '报警主机批量删除')
        if (this.pageCur === Math.ceil(this.pageTotal / this.pageLimit) && (this.selectDataIds.length === this.pageLimit || this.selectDataIds.length === (this.pageTotal % this.pageLimit)) && this.pageCur !== 1) {
          this.pageCur -= 1
        }
        this.getImportData()
      }).catch(() => {
        this.errorMsg('删除失败')
      })
    },
    changeAffirm(val) {
      switch (val) {
        case '自动确认':
          this.editData.alarmaffirm.autoaffirm.status = true
          this.editData.alarmaffirm.handaffirm.status = false
          this.editData.alarmaffirm.handaffirm2.status = false
          break
        case '手动一级确认':
          this.editData.alarmaffirm.autoaffirm.status = false
          this.editData.alarmaffirm.handaffirm.status = true
          this.editData.alarmaffirm.handaffirm2.status = false
          break
        case '手动二级确认':
          this.editData.alarmaffirm.autoaffirm.status = false
          this.editData.alarmaffirm.handaffirm.status = false
          this.editData.alarmaffirm.handaffirm2.status = true
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
        oid: oid,
        arrId: this.selectDataIds || []
      }
      this.changeResourceOrg(param).then(suc => {
        this.isMove = false
        this.selectDataIds = []
        this.getImportData()
        this.successMsg('资源移动成功')
      }).catch(err => {
        this.errorMsg('资源移动失败')
        console.log(err)
      })
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
