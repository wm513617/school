<template>
  <div class="tab-content-alarm">
    <div class="feature-btn">
      <Button type="ghost" icon="edit" @click="editClick" :disabled="isCannotClick">修改</Button>
      <Button type="ghost" icon="refresh" @click="refresh">刷新</Button>
      <Input placeholder="按名称模糊查询" style="width: 250px;" class="rt" v-model="searchName">
      <Button slot="append" @click="search">搜索</Button>
      </Input>
      <Checkbox v-model="subDevice" class="lf" @on-change="getTrafficData">显示子机构设备</Checkbox>
      <Checkbox v-model="onlyLink" class="lf" @on-change="getTrafficData">只显示未配置联动</Checkbox>
    </div>
    <div class="car-list flex-1" style="padding-top:10px;">
      <div class="table-box" style="height: 100%;" ref="tableBox1">
        <Table size="small" :columns="importTitle" :data="trafficList" :height="tableHeight" @on-selection-change="selectItem"></Table>
        <div class="table-footer">
          <div class="rt">
            <Page show-sizer :page-size-opts="$PageInfo.size" :show-total="true" :show-elevator="true" :page-size="pageLimit" :current="pageCur" @on-page-size-change="pageSizeChange" :total="pageTotal" @on-change="pageChange"></Page>
          </div>
        </div>
      </div>
    </div>
    <!--报警求助修改模态框-->
    <div v-if="exportEditMod">
      <Modal v-model="exportEditMod" :title="exportModTitle" width="480" :mask-closable="false">
        <Form :model="alarmEditInfo" :label-width="84" ref="alarmEditInfo" label-position="left"  style="padding: 0 10px;">
          <Form-item label="设备名称">
            <Input v-model="alarmEditInfo.devChnName" disabled/>
          </Form-item>
          <FormItem label="报警级别">
            <Select v-model="alarmEditInfo.level">
              <Option v-for="item in alarmLevel" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="报警接收时间">
            <Select v-model="alarmEditInfo.alarmtemplate">
              <Option v-for="item in enabledTemp" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="报警确认">
            <RadioGroup v-model="affirmMethod" vertical @on-change="changeAffirm">
              <Radio label="自动确认">自动确认
                <Input-number :min="0" :max="300" :disabled="!alarmEditInfo.alarmaffirm.autoaffirm.status" v-model="alarmEditInfo.alarmaffirm.autoaffirm.intervaltime"></Input-number>秒
              </Radio>
              <Radio label="手动一级确认"></Radio>
              <Radio label="手动二级确认"></Radio>
            </RadioGroup>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="ghost" @click="cancel">取消</Button>
          <Button type="primary" @click="exportConfirm">确定</Button>
        </div>
      </Modal>
    </div>
    <!-- 联动配置 弹框 -->
    <div v-if="isShowLink">
      <LinkConfigModal :model="isShowLink" :resData="linkData" :rootOrgId="linkOrgId" :activeOrgId="linkOrgId" type="lane" @close="isShowLink = false" @refrash="getTrafficData"></LinkConfigModal>
    </div>
  </div>
</template>

<script>
import './alarmStyle.css'
import { mapGetters, mapActions, mapState } from 'vuex'
import LinkConfigModal from './LinkConfigModal'
export default {
  components: {
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
    },
    newRootId: {
      type: String,
      default: ''
    },
    linkOrgId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isCannotClick: true, // 按钮是否可点击
      tableHeight: 420,
      pageLimit: this.$PageInfo.limit,
      pageTotal: 0,
      pageCur: 1,
      subDevice: true,
      onlyLink: false,
      trafficList: [],
      importTitle: [
        {
          type: 'selection',
          width: 60
        },
        {
          title: '设备名称',
          key: 'devChnName,',
          render: (h, params) => {
            return h('span', {
              style: {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              },
              domProps: {
                title: params.row.devChnName
              }
            }, params.row.devChnName)
          }
        },
        {
          title: '设备类型',
          key: 'devChnType',
          ellipsis: true,
          // minWidth: 220,
          render: (h, params) => {
            let type = ''
            type = this.carTypes[params.row.devChnType]
            return h('div', type)
          }
        },
        {
          title: '行车方向',
          key: 'devChnDirect',
          // minWidth: 100
          render: (h, params) => {
            let type = ''
            type = this.carDirect[params.row.devChnDirect]
            return h('div', type)
          }
        },
        {
          title: '报警级别',
          key: 'level'
          // minWidth: 100
        },
        {
          title: '报警接收时间',
          key: 'alarmtemplate',
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
                    params.row.name = params.row.devChnName
                    this.linkData = params.row
                    console.log('连动配置', this.linkData)
                    this.isShowLink = true
                  }
                }
              }, '配置')
            ])
          }
        }
      ],
      isShowLink: false,
      linkData: {}, // 当前联动配置数据
      affirmMethod: '手动一级确认',
      alarmEditInfo: {
        devChnName: '',
        level: 1,
        alarmtemplate: '',
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
      exportEditMod: false,
      exportModTitle: '智能交通修改',
      refreshStatus: '',
      searchName: '',
      selectDataIds: [],
      selectData: [],
      treeData: [],
      rootTreeId: '',
      activeTreeId: ''
    }
  },
  computed: {
    ...mapState({
      orgTreeData: ({ alarmManage }) => alarmManage.orgTreeData
    }),
    ...mapGetters(['carTypes', 'carDirect', 'enabledTemp', 'alarmLevel'])
  },
  watch: {
    activeOrgId: {
      handler(val) {
        if (val) {
          this.getTrafficData()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['getTrafficAlarmData', 'editTrafficAlarmData', 'getOneAlarmTabNumber']),
    getTrafficData() {
      let data = {
        deptId: this.newRootId,
        sid: this.orgId,
        // recursive: 0,
        key: this.searchName,
        recursive: this.subDevice ? 1 : 0,
        config: this.onlyLink ? 1 : 0,
        page: this.pageCur,
        limit: this.pageLimit
      }
      this.getTrafficAlarmData(data).then((res) => {
        this.trafficList = JSON.parse(JSON.stringify(res.data))
        this.isCannotClick = true
        this.pageTotal = Number(res.headers['x-bsc-count'])
        this.getOneAlarmTabNumber({type: 'trafficLaneNo', count: this.pageTotal})
        if (this.refreshStatus) {
          this.successMsg('刷新成功')
          this.refreshStatus = ''
        }
      }).catch(err => {
        console.log('logout error:' + err)
        this.errorMsg('智能交通获取失败')
      })
    },
    search() {
      this.getTrafficData()
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
    // 刷新
    refresh() {
      this.getTrafficData()
      this.refreshStatus = true
    },
    pageSizeChange(n) {
      this.pageLimit = n
      this.getTrafficData()
    },
    pageChange(page) {
      this.pageCur = page
      this.getTrafficData()
    },
    // 单条修改
    editClick() {
      this.exportEditMod = true
      this.treeData = JSON.parse(JSON.stringify(this.orgTreeData))
      this.rootTreeId = this.treeData[0]._id
      this.activeTreeId = this.treeData[0]._id
      this.trafficList.forEach((item, index) => {
        if (item.alarmaffirm) {
          if (this.selectDataIds.length === 1 && item._id === this.selectDataIds[0]) {
            this.alarmEditInfo = {
              devChnName: item.devChnName,
              level: item.level,
              alarmtemplate: item.alarmtemplate,
              alarmaffirm: {
                autoaffirm: {
                  status: item.alarmaffirm.autoaffirm.status,
                  intervaltime: item.alarmaffirm.autoaffirm.intervaltime
                },
                handaffirm: {
                  status: item.alarmaffirm.handaffirm ? (item.alarmaffirm.handaffirm.status ? item.alarmaffirm.handaffirm.status : true) : true
                },
                handaffirm2: {
                  status: item.alarmaffirm.handaffirm2 ? (item.alarmaffirm.handaffirm2.status ? item.alarmaffirm.handaffirm2.status : false) : false
                }
              }
            }
          }
          if (this.alarmEditInfo.alarmaffirm.autoaffirm.status) {
            this.affirmMethod = '自动确认'
          } else if (this.alarmEditInfo.alarmaffirm.handaffirm.status) {
            this.affirmMethod = '手动一级确认'
          } else {
            this.affirmMethod = '手动二级确认'
          }
        } else {
          this.alarmEditInfo.devChnName = item.devChnName
          this.alarmEditInfo.level = item.level ? item.level : 1
          this.alarmEditInfo.alarmtemplate = item.alarmtemplate ? item.alarmtemplate : this.enabledTemp[0].value
          if (this.alarmEditInfo.alarmaffirm.autoaffirm.status) {
            this.affirmMethod = '自动确认'
          } else if (this.alarmEditInfo.alarmaffirm.handaffirm.status) {
            this.affirmMethod = '手动一级确认'
          } else {
            this.affirmMethod = '手动二级确认'
          }
        }
      })
    },
    cancel() {
      this.exportEditMod = false
    },
    exportConfirm() {
      let deleteId = this.selectDataIds.join(',')
      // console.log('11111', deleteId)
      const payload = {
        data: {
          level: this.alarmEditInfo.level,
          alarmaffirm: this.alarmEditInfo.alarmaffirm,
          alarmtemplate: this.alarmEditInfo.alarmtemplate
        },
        ids: deleteId
      }
      this.editTrafficAlarmData(payload).then((res) => {
        this.exportEditMod = false
        this.getTrafficData()
      }).catch(err => {
        console.log('logout error:' + err)
        this.errorMsg('报警批量修改失败')
      })
    },
    changeAffirm(val) {
      switch (val) {
        case '自动确认':
          this.alarmEditInfo.alarmaffirm.autoaffirm.status = true
          this.alarmEditInfo.alarmaffirm.handaffirm.status = false
          this.alarmEditInfo.alarmaffirm.handaffirm2.status = false
          break
        case '手动一级确认':
          this.alarmEditInfo.alarmaffirm.autoaffirm.status = false
          this.alarmEditInfo.alarmaffirm.handaffirm.status = true
          this.alarmEditInfo.alarmaffirm.handaffirm2.status = false
          break
        case '手动二级确认':
          this.alarmEditInfo.alarmaffirm.autoaffirm.status = false
          this.alarmEditInfo.alarmaffirm.handaffirm.status = false
          this.alarmEditInfo.alarmaffirm.handaffirm2.status = true
          break
      }
    }
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox1'].offsetHeight - 35
  }
}
</script>

<style scoped lang='less'>
  .ivu-input-number {
    width: 100%;
  }
</style>
