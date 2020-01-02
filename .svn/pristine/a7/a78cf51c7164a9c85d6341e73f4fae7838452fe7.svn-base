<template>
  <div class="tab-content-alarm">
    <div class="feature-btn">
      <Button type="ghost" icon="edit" @click="editClick" :disabled="isCannotClick">修改</Button>
      <Button type="ghost" icon="refresh" @click="refresh">刷新</Button>
      <Input placeholder="按名称模糊查询" v-model="searchName" style="width: 250px;" class="rt">
      <Button slot="append" @click="search">搜索</Button>
      </Input>
      <Checkbox v-model="onlyLink" class="lf" @on-change="getHelpData">只显示未配置联动</Checkbox>
    </div>
    <div class="car-list flex-1" style="padding-top:10px;">
      <div class="table-box" style="height: 100%;" ref="tableBox1">
        <Table size="small" :columns="importTitle" :data="helpList" :height="tableHeight" @on-selection-change="selectItem"></Table>
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
            <Input v-model="alarmEditInfo.name" disabled/>
          </Form-item>
          <FormItem label="报警级别">
            <Select v-model="alarmEditInfo.level">
              <Option v-for="item in alarmLevel" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="报警确认">
            <RadioGroup v-model="affirmMethod" vertical @on-change="changeAffirm">
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
      <LinkConfigModal :model="isShowLink" :resData="linkData" :rootOrgId="linkOrgId" :activeOrgId="linkOrgId" type="client" @close="isShowLink = false" @refrash="getHelpData"></LinkConfigModal>
    </div>
    <!-- 移动 弹框 -->
    <div v-if="isMove">
      <MoveDeviceModal :isOpen="isMove" @close="isMove = false" @moveDevice="moveDevice"></MoveDeviceModal>
    </div>
  </div>
</template>

<script>
import './alarmStyle.css'
import { mapGetters, mapActions } from 'vuex'
import LinkConfigModal from './LinkConfigModal'
import MoveDeviceModal from './MoveDeviceModal'
export default {
  components: {
    LinkConfigModal,
    MoveDeviceModal
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
      isCannotClick: true, // 按钮是否可点击
      tableHeight: 420,
      pageLimit: this.$PageInfo.limit,
      pageTotal: 0,
      pageCur: 1,
      onlyLink: false,
      searchName: '',
      helpList: [],
      importTitle: [
        {
          type: 'selection',
          width: 60
        },
        {
          title: '设备名称',
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
          title: '设备ID号',
          key: 'talkId'
          // minWidth: 100
        },
        {
          title: '设备类型',
          key: 'deviceType',
          render: (h, params) => {
            let type = params.row.deviceType === 'alarmBox' ? '报警箱' : '报警柱'
            console.log('设备类型', params.row.deviceType)
            return h('div', type)
          }
        },
        {
          title: '报警级别',
          key: 'level'
          // minWidth: 100
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
      affirmMethod: '手动一级确认',
      alarmEditInfo: {
        name: '',
        level: 1,
        alarmaffirm: {
          handaffirm: {
            status: false
          },
          handaffirm2: {
            status: false
          }
        }
      },
      exportEditMod: false,
      exportModTitle: '',
      refreshStatus: '',
      selectData: [],
      selectDataIds: [],
      isMove: false
    }
  },
  computed: {
    ...mapGetters(['enabledTemp', 'alarmLevel'])
  },
  watch: {
    activeOrgId: {
      handler(val) {
        console.log('activeOrgId', this.activeOrgId)
        if (val) {
          this.pageCur = 1
          this.getHelpData()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['getAlarmHelpData', 'editAlarmHelpData', 'editMoreAlarmHelpData', 'getOneAlarmTabNumber']),
    // 获取报警输出数据
    getHelpData() {
      console.log('获取报警输出数据')
      let data = {
        name: this.searchName,
        page: this.pageCur,
        limit: this.pageLimit,
        config: this.onlyLink ? 1 : 0
      }
      this.getAlarmHelpData(data).then((res) => {
        this.helpList = JSON.parse(JSON.stringify(res.data))
        // this.outPageTotal = this.outPageNum
        this.isCannotClick = true
        this.pageTotal = Number(res.headers['x-bsc-count'])
        this.getOneAlarmTabNumber({type: 'alarmClientNo', count: this.pageTotal})
        if (this.refreshStatus) {
          this.successMsg('刷新成功')
          this.refreshStatus = ''
        }
      }).catch(err => {
        console.log('logout error:' + err)
        this.errorMsg('报警求助获取失败')
      })
    },
    search() {
      this.getHelpData()
    },
    // 刷新
    refresh() {
      this.getHelpData()
      this.refreshStatus = true
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
    pageSizeChange(n) {
      this.pageLimit = n
    },
    pageChange(page) {
      this.pageCur = page
    },
    // 修改
    editClick() {
      if (this.selectDataIds.length === 1) {
        this.exportModTitle = '报警求助修改'
        this.exportEditMod = true
        this.helpList.forEach((item, index) => {
          if (item._id === this.selectDataIds[0]) {
            this.exportForm = item
            this.alarmEditInfo.name = item.name
            this.alarmEditInfo.level = item.level
            this.alarmEditInfo.alarmaffirm.handaffirm.status = item.handaffirm.status
            this.alarmEditInfo.alarmaffirm.handaffirm2.status = item.handaffirm2.status
            if (this.alarmEditInfo.alarmaffirm.handaffirm.status) {
              this.affirmMethod = '手动一级确认'
            } else if (this.alarmEditInfo.alarmaffirm.handaffirm2.status) {
              this.affirmMethod = '手动二级确认'
            }
          }
        })
      } else {
        this.exportModTitle = '报警求助批量修改'
        this.exportEditMod = true
        this.alarmEditInfo.name = ''
        this.alarmEditInfo.level = 1
        this.alarmEditInfo.alarmaffirm.handaffirm.status = false
        this.alarmEditInfo.alarmaffirm.handaffirm2.status = false
      }
    },
    changeAffirm(val) {
      switch (val) {
        case '手动一级确认':
          this.alarmEditInfo.alarmaffirm.handaffirm.status = true
          this.alarmEditInfo.alarmaffirm.handaffirm2.status = false
          break
        case '手动二级确认':
          this.alarmEditInfo.alarmaffirm.handaffirm.status = false
          this.alarmEditInfo.alarmaffirm.handaffirm2.status = true
          break
      }
    },
    // 修改弹框
    cancel() {
      this.exportEditMod = false
    },
    exportConfirm() {
      let deleteId = this.selectDataIds.join(',')
      const payload = {
        data: {
          level: this.alarmEditInfo.level,
          handaffirm: {
            status: this.alarmEditInfo.alarmaffirm.handaffirm.status
          },
          handaffirm2: {
            status: this.alarmEditInfo.alarmaffirm.handaffirm2.status
          }
        },
        ids: deleteId
      }
      this.editAlarmHelpData(payload).then((res) => {
        this.exportEditMod = false
        this.getHelpData()
      }).catch(err => {
        console.log('logout error:' + err)
        this.errorMsg('报警输出获取失败')
      })
    }
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox1'].offsetHeight - 35
  }
}
</script>

<style scoped lang=''>

</style>
