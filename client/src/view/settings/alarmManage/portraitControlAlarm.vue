<template>
  <div class="tab-content-alarm">
    <div class="feature-btn">
      <!-- <Button type="ghost" icon="plus" @click="openAddMod">添加</Button> -->
      <Button type="ghost" icon="edit" :disabled="isCannotClick" @click="editClick">修改</Button>
      <Button type="ghost" icon="refresh" @click="refresh">刷新</Button>
      <Input placeholder="按名称模糊查询" style="width: 250px;" class="rt" v-model="searchName">
      <Button slot="append" @click="search">搜索</Button>
      </Input>
      <Checkbox v-model="subDevice" class="lf" @on-change="getFaceData">显示子机构设备</Checkbox>
      <Checkbox v-model="onlyLink" class="lf" @on-change="getFaceData">只显示未配置联动</Checkbox>
    </div>
    <div class="car-list flex-1" style="padding-top:10px;">
      <div class="table-box" style="height: 100%;" ref="tableBox1">
        <Table size="small" :columns="importTitle" :data="faceData" :height="tableHeight" @on-selection-change="selectItem"></Table>
        <div class="table-footer">
          <div class="rt">
            <Page show-sizer :page-size-opts="$PageInfo.size" :show-total="true" :show-elevator="true" :page-size="pageLimit" :current="pageCur" @on-page-size-change="pageSizeChange" :total="pageTotal" @on-change="pageChange"></Page>
          </div>
        </div>
      </div>
    </div>
    <!--布控修改模态框-->
    <div v-if="exportEditMod">
      <Modal v-model="exportEditMod" :title="exportModTitle" width="480" :mask-closable="false">
        <Form :model="alarmEditInfo" :label-width="84" ref="alarmEditInfo" label-position="left"  style="padding: 0 10px;">
          <Form-item label="设备名称" v-if="devStatus">
            <Input v-model="alarmEditInfo.devName" disabled/>
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
              <Radio label="自动确认">
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
      <LinkConfigModal :model="isShowLink" :resData="linkData" :rootOrgId="linkOrgId" :activeOrgId="linkOrgId" @close="isShowLink = false" @refrash="getFaceData"></LinkConfigModal>
    </div>
  </div>
</template>

<script>
import AddModal from './AddModal'
import './alarmStyle.css'
import { mapGetters, mapActions, mapState } from 'vuex'
import LinkConfigModal from './LinkConfigModal'
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
    },
    linkOrgId: {
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
      faceData: [],
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
          title: '所属设备',
          key: 'device',
          render: (h, params) => {
            let deviceName = params.row.eid.name
            return h('div', deviceName)
          }
        },
        {
          title: '通道号',
          key: 'chan'
          // minWidth: 100
        },
        {
          title: '出/入类型',
          key: 'type',
          render: (h, params) => {
            let text = ''
            let n = params.row.passway
            if (n === 0) {
              text = '普通'
            } else if (n === 1) {
              text = '入口'
            } else if (n === 2) {
              text = '出口'
            }
            return h('span', text)
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
      isShowLink: false,
      linkData: {}, // 当前联动配置数据
      isCannotClick: true, // 按钮是否可点击
      selectData: [],
      selectDataIds: [],
      affirmMethod: '手动一级确认',
      alarmEditInfo: {
        name: '',
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
      exportModTitle: '',
      searchName: '',
      rootTreeId: '',
      activeTreeId: '',
      devStatus: true
    }
  },
  computed: {
    ...mapState({
      orgTreeData: ({ alarmManage }) => alarmManage.orgTreeData
    }),
    ...mapGetters(['enabledTemp', 'alarmLevel'])
  },
  watch: {
    activeOrgId: {
      handler(val) {
        if (val) {
          this.pageCur = 1
          this.getFaceData()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['getFaceAlarmData', 'editAlarmInputData', 'editMoreAlarmInputData', 'getOneAlarmTabNumber']),
    // 获取报警输出数据
    getFaceData() {
      let data = {
        oid: this.activeOrgId,
        never: this.subDevice ? -1 : 0,
        seek: this.searchName,
        page: this.pageCur,
        limit: this.pageLimit,
        config: this.onlyLink ? 1 : 0
      }
      this.getFaceAlarmData(data).then((res) => {
        this.faceData = JSON.parse(JSON.stringify(res.data))
        this.faceData.forEach(item => {
          if (!item.level && !item.alarmtemplate) {
            item.level = 1
            item.alarmtemplate = this.enabledTemp[0].value
          }
        })
        this.isCannotClick = true
        this.pageTotal = Number(res.headers['x-bsc-count'])
        this.getOneAlarmTabNumber({type: 'faceAlarmNo', count: this.pageTotal})
        if (this.refreshStatus && this.faceData.length > 0) {
          this.successMsg('刷新成功')
          this.refreshStatus = ''
        }
      }).catch(err => {
        console.log('logout error:' + err)
        this.errorMsg('人脸布控获取失败')
      })
    },
    search() {
      this.getFaceData()
    },
    // 刷新
    refresh() {
      this.getFaceData()
      this.refreshStatus = true
    },
    pageSizeChange(n) {
      this.pageLimit = n
      this.getFaceData()
    },
    pageChange(page) {
      this.pageCur = page
      this.getFaceData()
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
    // 单条修改
    editClick() {
      // console.log('修改人像布控')
      if (this.selectDataIds.length === 1) {
        this.devStatus = true
        this.exportModTitle = '人像布控修改'
        this.exportEditMod = true
        this.faceData.forEach((item, index) => {
          if (item._id === this.selectDataIds[0]) {
            this.alarmEditInfo = {
              devName: item.name,
              level: item.level,
              alarmtemplate: item.alarmtemplate,
              alarmaffirm: {
                autoaffirm: {
                  status: item.alarmaffirm.autoaffirm.status,
                  intervaltime: item.alarmaffirm.autoaffirm.intervaltime
                },
                handaffirm: {
                  status: item.alarmaffirm.handaffirm.status
                },
                handaffirm2: {
                  status: item.alarmaffirm.handaffirm2.status
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
          }
        })
      } else {
        this.exportModTitle = '人像布控批量修改'
        this.exportEditMod = true
        this.alarmEditInfo.devName = ''
        this.alarmEditInfo.level = 1
        this.alarmEditInfo.alarmtemplate = this.enabledTemp[0].value
        if (this.alarmEditInfo.alarmaffirm.autoaffirm.status) {
          this.affirmMethod = '自动确认'
        } else if (this.alarmEditInfo.alarmaffirm.handaffirm.status) {
          this.affirmMethod = '手动一级确认'
        } else {
          this.affirmMethod = '手动二级确认'
        }
      }
    },
    // 修改
    exportConfirm() {
      if (this.selectDataIds.length > 1) {
        let deleteId = this.selectDataIds.join(',')
        const payload = {
          body: {
            level: this.alarmEditInfo.level,
            alarmaffirm: this.alarmEditInfo.alarmaffirm,
            alarmtemplate: this.alarmEditInfo.alarmtemplate
          },
          ids: deleteId
        }
        this.editMoreAlarmInputData(payload).then((res) => {
          this.exportEditMod = false
          this.getFaceData()
          this.successMsg('报警批量修改成功')
        }).catch(err => {
          console.log('logout error:' + err)
          this.errorMsg('报警批量修改失败')
        })
      } else {
        let deleteId = this.selectDataIds.join(',')
        const payload = {
          body: {
            level: this.alarmEditInfo.level,
            alarmaffirm: this.alarmEditInfo.alarmaffirm,
            alarmtemplate: this.alarmEditInfo.alarmtemplate
          },
          _id: deleteId
        }
        this.editAlarmInputData(payload).then((res) => {
          this.exportEditMod = false
          this.getFaceData()
          this.successMsg('报警修改成功')
        }).catch(err => {
          console.log('logout error:' + err)
          this.errorMsg('报警修改失败')
        })
      }
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
    },
    cancel() {
      this.exportEditMod = false
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
