<template>
  <div class="bs-content">
    <!-- 遮罩层 -->
    <div v-show="modal">
      <div class="black_over">
      </div>
      <div class="popup">
        <div class="modal-top">
          {{modalTitle}}
          <span style="display: block; float:right" @click="closeModal">
            <Icon type="close-round" size="16" color="#ccc"></Icon>
          </span>
        </div>
        <div style="padding: 12px 24px">
          <Form ref="taskInfo" :rules="taskFormRole" :model="taskInfo" :label-width="80" label-position="left">
            <FormItem label="任务名称" prop="taskTitle">
              <Input type="text" v-model="taskInfo.taskTitle">
              </Input>
            </FormItem>
            <FormItem label="机构" :required="true">
              <Input type="text" v-model="taskInfo.orgName" disabled>
              </Input>
            </FormItem>
            <FormItem label="巡更人" :required="true">
              <Select v-model="taskInfo.userId">
                <Option v-for="(item,index) in userList" :value="item.userId" :key="index">{{item.realName}}</Option>
              </Select>
            </FormItem>
            <FormItem label="任务模式">
              <RadioGroup v-model="taskInfo.taskType">
                <Radio :label="2">自由模式</Radio>
                <Radio :label="1">固定模式</Radio>
              </RadioGroup>
            </FormItem>
            <div class="condition" v-show="taskInfo.taskType === 2 ? true : false">
              <span style='vertical-align:top;'>开始时间</span>
              <BStimePicker :datetime="taskInfo.startTime"  @timeChange='startTimeChange' :width='160' :height='26'></BStimePicker>
            </div>
            <div class="condition" v-show="taskInfo.taskType === 2 ? true : false">
              <span style='vertical-align:top;'>结束时间</span>
              <BStimePicker :datetime="taskInfo.endTime" @timeChange='endTimeChange' :width='160' :height='26'></BStimePicker>
            </div>
            <FormItem label="浮动时间" :required="true">
              <InputNumber :min="1" :max="60" v-model="taskInfo.rangTime"></InputNumber>
              <span>Min</span>
            </FormItem>
            <FormItem label="巡更点位" :required="true">
              <Input readonly :value="pointListStr.toString()">
              <Button @click="modalRightShow" slot="append" :icon="modalRight?'arrow-left-a':'arrow-right-a'"></Button>
              </Input>
            </FormItem>
            <FormItem label="备注" prop="remark">
              <Input v-model="taskInfo.remark" type="textarea" :rows="4" placeholder="备注信息"></Input>
            </FormItem>
          </Form>
          <div v-if="modalRight" class="modal-right">
            <h3>巡更点位</h3>
            <div class="point-tree">
              <VTree :isSaveState="false" ref="pointTree" @handlecheckedChange="handlecheckedChange" :activeId="activePoint._id" @node-click="pointClick" :options="{showFolder:false,showInput:taskInfo.taskType==2}" :treeData="pointTree"></VTree>
            </div>
            <div v-show="taskInfo.taskType==1">
              <div style="margin: 10px 0;">
                <Input disabled :value="activePoint.name">
                <span slot="prepend">点位名称</span>
                </Input>
              </div>
                <div>
                  <!-- <BStimePicker :datetime="activePoint.time" @timeChange='changePointTime' :width='160' :height='26'></BStimePicker> -->
                  <TimePicker @on-change="changePointTime" :value="activePoint.time" :disabled="taskInfo.taskType==2" ref="pointTime" format="HH:mm" :editable="false" type="time" placeholder="巡更时间"></TimePicker>
                  <Button @click="addPoint" :disabled="taskInfo.taskType==2" type="ghost">添加</Button>
                </div>
                <div>
                  <Table height="200" size="small" :data="pointList" :columns="pointColumns"></Table>
                </div>
              </div>
            </div>
            <div slot="footer" style='float:right;'>
              <Button type="primary" size="large" :loading="modal_loading" @click="modalOk">确定</Button>
            </div>
          </div>
        </div>
      </div>
    <div class="bs-left">
      <VTree @node-click="nodeClick" :activeId="orgInfo.id" :treeData="orgTreeData"></VTree>
    </div>
    <div class="bs-main flex-column">
      <div class="main-handle flex-between topBar">
        <div class="handle-left">
          <Button v-if="$BShasPower('BS-PATROL-TASK-MANAGE')" type="ghost" :disabled="isAdd" @click="add" icon="plus">添加</Button>
          <Button v-if="$BShasPower('BS-PATROL-TASK-MANAGE')" type="ghost" :disabled="isRemove" @click="removeTasks" icon="trash-a">删除</Button>
          <Button type="ghost" @click="refresh" icon="android-refresh">刷新</Button>
        </div>
        <div class="handle-right">
          <Input v-model="searchData.taskTitle" placeholder="请输入" style="width: 150px"></Input>
          <!-- <Input v-model="searchData.realName" placeholder="巡更人" style="width: 150px"></Input> -->
          <div style='display:flex;'>
            <span style='vertical-align:top;margin: 6px 10px;'>开始时间</span>
            <BStimePicker  @timeChange='changeSearchStime' :width='160' :height='30'></BStimePicker>
          </div>
            <!-- <TimePicker ref='startTime' @on-change="changeSearchStime" format="HH:mm" placeholder="开始时间" style="width: 112px" :editable="false"></TimePicker> -->
            <!-- <span>至</span>
            <TimePicker ref='endTime' @on-change="changeSearchEtime" format="HH:mm" placeholder="结束时间" style="width: 112px" :editable="false"></TimePicker> -->
            <!-- <div> -->
            <div style='display:flex;'>
              <span style='vertical-align:top;margin: 6px 10px;'>结束时间</span>
              <BStimePicker  @timeChange='changeSearchEtime' :width='160' :height='30'></BStimePicker>
            </div>
          <Button @click="searchTask" icon="ios-search">搜索</Button>
          <!-- <Button @click="restorationRecord" icon="ios-loop-strong">复位</Button> -->
        </div>
      </div>
      <div ref="tableBox" class="flex-1">
        <div class="bs-table-box">
          <Table @on-selection-change="selectTask" size="small" :height="tableHeight" highlight-row ref="currentRowTable" :columns="tableColumns" :data="taskList"></Table>
          <div class="table-footer">
            <div style="float: right;">
              <Page :show-total="true" show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :page-size="pageLimit" :show-elevator="true" :total="pageInfo.count" :current="pageInfo.cur" @on-change="changePage"></Page>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import patrol from '../keepwatch/common/patrol'
import toTree from '../../assets/js/toTreeData'
import VTree from '../../components/tree/VTree'
import { mapState, mapActions, mapMutations } from 'vuex'
// import { STORE_KEY_USERNAME } from '../../constants'
export default {
  components: {
    VTree
  },
  data() {
    return {
      taskFormRole: {
        taskTitle: [
          { required: true, message: '任务名称不能为空', trigger: 'change' },
          { validator: this.$bsValidate.validateStr64, trigger: 'change' }
        ]
        // remark: [
        //   { validator: this.$bsValidate.validateStr512, trigger: 'blur' }
        // ]

      },
      pointTree: [
        {
          title: 'parent 1',
          expand: true,
          children: [
            {
              title: 'parent 1-1',
              expand: true,
              children: [
                {
                  title: 'leaf 1-1-1'
                },
                {
                  title: 'leaf 1-1-2'
                }
              ]
            },
            {
              title: 'parent 1-2',
              expand: true,
              children: [
                {
                  title: 'leaf 1-2-1'
                },
                {
                  title: 'leaf 1-2-1'
                }
              ]
            }
          ]
        }
      ],
      deleList: [],
      getType: 1,
      selectTaskList: [],
      modalTitle: '添加任务',
      modal_loading: false,
      modal: false,
      modalRight: false,
      userList: [],
      taskInfo: {
        name: '',
        orgName: '',
        userName: '',
        realname: '',
        taskType: 1,
        startTime: '00:00:00',
        endTime: '00:00:00',
        rangTime: 1,
        points: [
          {
            name: ''
          }
        ],
        remark: ''
      },
      isEnable: false,
      tableHeight: 435,
      pointColumns: [
        {
          title: '巡更点',
          key: 'pointName',
          width: 80
        },
        {
          title: '时间',
          key: 'patrolTime',
          width: 80
        },
        {
          title: '操作',
          key: 'action',
          width: 75,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.removePoint(params.index)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          type: 'index',
          title: '序号',
          width: 70,
          align: 'center'
        },
        {
          title: '任务名称',
          key: 'taskTitle',
          ellipsis: true,
          render: (h, param) => {
            return h(
              'span',
              {
                attrs: {
                  title: param.row.taskTitle
                }
              },
              param.row.taskTitle
            )
          }
        },
        {
          title: '巡更人',
          key: 'realName',
          width: 120,
          ellipsis: true
        },
        {
          title: '任务模式',
          key: 'taskType',
          width: 100,
          render: (h, param) => {
            return h('span', param.row.taskType === 2 ? '自由模式' : '固定模式')
          }
        },
        {
          title: '开始时间',
          key: 'startTime',
          width: 100
        },
        {
          title: '结束时间',
          key: 'endTime',
          width: 100
        },
        {
          title: '机构',
          key: 'orgName',
          width: 160,
          ellipsis: true
        },
        {
          title: '浮动时间(min)',
          key: 'rangTime',
          width: 120
        }, {
          title: '备注',
          key: 'remark',
          ellipsis: true
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            if (this.$BShasPower('BS-PATROL-TASK-MANAGE')) {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.add(params, 'edit')
                      }
                    }
                  },
                  '修改'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.removeTask(params)
                      }
                    }
                  },
                  '删除'
                )
              ])
            }
          }
        }
      ],
      searchData: {
        taskTitle: '',
        realName: '',
        startTime: '',
        endTime: ''
      },
      searchPoint: '',
      pointTime: '',
      orgInfo: {
        id: '',
        orgName: ''
      },
      pointList: [],
      activePoint: {
        name: '',
        id: '',
        geo: '',
        time: ''
      },
      pointListStr: [],
      isRemove: true,
      isAdd: true,
      taskPower: false,
      pageLimit: this.$PageInfo.limit
    }
  },
  computed: {
    ...mapState({
      taskList: state => {
        return state.patrol.taskList
      },
      pageInfo: state => {
        return state.patrol.pageInfo
      },
      orgTreeData: state => {
        return state.orgSetting.orgTreeData
      }
    })
  },
  watch: {
    taskInfo: {
      handler(val) {
        this.pointListStr = []
        val.points.map(item => {
          this.pointListStr.push(item.pointName)
        })
      },
      deep: true
    },
    'orgInfo.id': {
      handler: function(val) {
        if (val.length) {
          this.isAdd = false
        } else {
          this.isAdd = true
        }
      },
      deep: true
    },
    pointList(val) {
      this.pointListStr = []
      val.map(item => {
        this.pointListStr.push(item.pointName)
      })
    },
    'taskInfo.taskType': {
      handler(val) {
        this.pointListStr = []
        if (Number(val) === 1) {
          this.pointList.map(item => {
            this.pointListStr.push(item.pointName)
          })
        }
        if (Number(val) === 2) {
          this.taskInfo.points.map(item => {
            this.pointListStr.push(item.pointName)
          })
        }
      },
      deep: true
    }
  },
  created() {
    // 获取人员机构数
    this.UPDATE_PAGEINFO()
    this.getOrgTree(3)
    // 获取任务列表(默认为第一页，一页10条数据)
    this.getTaskList({ limit: this.pageLimit })
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 40
  },
  methods: {
    ...mapMutations(['UPDATE_PAGEINFO']),
    ...mapActions([
      'getTaskList',
      'getTaskById',
      'searchTaskList',
      'addTask',
      'updateTask',
      'deleteTasks',
      'deleteTask',
      'getOrgTree',
      'getUserList',
      'getSentryPointTree',
      'checkBSRoleTag',
      'recordLog'
    ]),
    // 关闭弹窗
    closeModal() {
      this.modal = false
      this.$refs['taskInfo'].resetFields()
      patrol.clearCheckedTreeNode(this.$refs.pointTree.treeNode)
    },
    // 点击巡更人员机构树获取任务数据
    nodeClick(item) {
      this.isAdd = false
      this.getType = 1
      this.orgInfo.id = item._id
      this.orgInfo.orgName = item.name
      this.getTaskList({ org: item._id, limit: this.pageLimit })
    },
    // 自由模式点击巡更点位树复选框
    handlecheckedChange(item) {
      this.taskInfo.points = []
      let arr = this.$refs.pointTree.getSelectedNodes()
      arr.map(item => {
        if (item.type === 'patrol') {
          this.taskInfo.points.push({
            pointName: item.name,
            pointId: item._id
          })
        }
      })
    },
    // 变更检索时间
    changeSearchStime(time) {
      // this.searchData.startTime = time
      const t = time.split(':')
      const date = t[0] + ':' + t[1]
      this.searchData.startTime = date
    },
    changeSearchEtime(time) {
      // this.searchData.endTime = time
      const t = time.split(':')
      const date = t[0] + ':' + t[1]
      this.searchData.endTime = date
    },
    // 根据条件检索任务
    searchTask() {
      if (this.searchData.startTime > this.searchData.endTime) {
        this.$Notice.warning({
          title: '开始时间不能大于结束时间'
        })
      } else {
        this.getType = 2
        let param = {
          key: this.searchData.taskTitle,
          startTime: this.searchData.startTime,
          endTime: this.searchData.endTime,
          // realName: this.searchData.taskTitle,
          limit: this.pageLimit
        }
        this.orgInfo.id = ''
        this.searchTaskList(param)
      }
    },
    // 固定模式点击巡更点位
    pointClick(point) {
      if (Number(this.taskInfo.taskType) === 1 && point.type === 'patrol') {
        this.activePoint = Object.assign(this.activePoint, point)
      }
    },
    // 固定模式 修改点位巡更时间
    changePointTime(time) {
      // const t = time.split(':')
      // const date = t[0] + ':' + t[1]
      // this.searchData.time = date
      this.activePoint.time = time
    },
    // 固定模式添加巡更点位
    addPoint() {
      if (!this.activePoint.name) {
        this.$Notice.warning({
          title: '请选择巡更点位'
        })
        return
      }
      if (!this.activePoint.time) {
        this.$Notice.warning({
          title: '请选择点位巡更时间'
        })
        return
      }
      let len = this.pointList.length
      for (let i = 0; i < len; i++) {
        if (this.pointList[i].patrolTime === this.activePoint.time) {
          if (this.pointList[i].pointId !== this.activePoint._id) {
            this.$Notice.error({
              title: '巡更时间不能重复'
            })
            return
          }
        }
      }
      for (let j = len - 1; j >= 0; j--) {
        if (this.pointList[j].pointId === this.activePoint._id) {
          this.pointList.splice(j, 1)
        }
      }
      let point = {
        pointName: this.activePoint.name,
        pointId: this.activePoint._id,
        patrolTime: this.activePoint.time
      }
      this.pointList.push(point)
      this.pointList = this.pointList.sort(function(a, b) {
        return a.patrolTime > b.patrolTime
      })
      this.taskInfo.points = this.pointList
    },
    // 固定模式删除巡更点位
    removePoint(index) {
      this.pointList.splice(index, 1)
    },
    // 打开创建任务表单，如果传了param则为修改，反之则为创建新的
    add(param) {
      if (param.row) {
        this.modalTitle = '修改任务'
        this.getTaskById({ id: param.row._id }).then(taskData => {
          this.modalRight = false
          this.orgInfo.orgName = taskData.orgName
          this.taskInfo = JSON.parse(JSON.stringify(taskData))
          this.taskInfo.endTime = this.taskInfo.endTime
          this.taskInfo.startTime = this.taskInfo.startTime
          this.taskInfo.taskType = taskData.taskType
          if (this.taskInfo.taskType === 1) {
            this.pointList = this.taskInfo.points
          }
          this.getUserList({ limit: 10000, orgId: taskData.org }).then(res => {
            this.userList = []
            res.data.results.map(item => {
              this.userList.push({
                userId: item._id,
                realName: item.realname
              })
            })
            if (!param.row) {
              this.initData()
            }
            this.modal = true
          })
        })
      } else {
        if (!this.orgInfo.id) {
          this.$Notice.warning({
            title: '请选择要添加的任务机构'
          })
        } else {
          this.getUserList({ limit: 10000, orgId: this.orgInfo.id }).then(
            res => {
              this.initData()
              this.userList = []
              res.data.results.map(item => {
                this.userList.push({
                  userId: item._id,
                  realName: item.realname
                })
              })
              this.modal = true
            }
          )
        }
      }
    },
    initData() {
      this.activePoint = {
        name: '',
        id: '',
        geo: '',
        time: ''
      }
      this.modalTitle = '添加任务'
      this.pointList = []
      this.taskInfo = {
        taskTitle: '',
        orgName: this.orgInfo.orgName,
        org: this.orgInfo.id,
        taskType: 2,
        startTime: '',
        endTime: '',
        rangTime: 10,
        points: [],
        remark: ''
      }
    },
    selectTask(rows) {
      if (rows.length > 0) {
        this.isRemove = false
      } else {
        this.isRemove = true
      }
      this.selectTaskList = rows
    },
    // 批量删除巡更任务
    removeTasks() {
      this.$Modal.confirm({
        title: '删除确认',
        content: '确认删除巡更任务吗?',
        loading: true,
        onOk: () => {
          let ids = this.selectTaskList.map(item => {
            return item._id
          })
          this.isRemove = true
          this.deleteTasks(ids)
            .then(() => {
              this.$Notice.success({
                title: '删除成功'
              })
              this.$Modal.remove()
              this.getTaskList({ org: this.orgInfo.id, limit: this.pageLimit })
            })
          this.selectTaskList.forEach(element => {
            this.deleList.push(element.taskTitle)
          })
          this.recordLog({logType: '操作日志', module: '电子巡查', operateName: '删除巡查任务', operateContent: '删除巡查任务', target: this.deleList.join()})
            .catch(() => {
              this.isRemove = false
            })
        }
      })
    },
    // 删除巡更任务
    removeTask(param) {
      this.$Modal.confirm({
        title: '删除确认',
        content: '确认删除巡更任务吗?',
        loading: true,
        onOk: () => {
          let data = {
            id: param.row._id
          }
          this.deleteTask(data)
            .then(res => {
              this.$Notice.success({
                title: '删除成功'
              })
              this.$Modal.remove()
              this.getTaskList({ org: this.orgInfo.id, limit: this.pageLimit })
              this.recordLog({logType: '操作日志', module: '电子巡查', operateName: '删除巡查任务', operateContent: '删除巡查任务', target: this.taskInfo.taskTitle})
            })
            .catch(err => {
              this.$Notice.error({
                title: err.message
              })
            })
        }
      })
    },
    // 刷新页面
    refresh() {
      this.searchData.taskTitle = ''
      this.isRemove = true
      this.orgInfo.id = ''
      // this.$refs.startTime.handleClear()
      // this.$refs.endTime.handleClear()
      this.getTaskList({ limit: this.pageLimit })
    },
    // 复位清空
    // restorationRecord() {
    //   this.searchData.taskTitle = ''
    //   this.searchData.realName = ''
    //   this.$refs['startTime'].handleClear()
    //   this.$refs['endTime'].handleClear()
    //   this.getTaskList({ limit: this.pageLimit })
    // },
    // 自由模式 修改开始时间
    startTimeChange(time) {
      const t = time.split(':')
      const date = t[0] + ':' + t[1]
      this.taskInfo.startTime = date
    },
    // 自由模式 修改结束时间
    endTimeChange(time) {
      const t = time.split(':')
      const date = t[0] + ':' + t[1]
      this.taskInfo.endTime = date
    },
    // 提交巡更任务表单
    modalOk() {
      this.$refs['taskInfo'].validate(vaild => {
        if (vaild) {
          for (let i = 0; i < this.userList.length; i++) {
            if (this.taskInfo.userId === this.userList[i].userId) {
              this.taskInfo.realName = this.userList[i].realName
              break
            }
          }
          if (Number(this.taskInfo.taskType) === 1) {
            this.taskInfo.points = this.pointList
          }
          if (Number(this.taskInfo.taskType) === 2) {
            if (!this.taskInfo.startTime || !this.taskInfo.endTime) {
              this.$Notice.warning({
                title: '开始时间和结束时间不能为空'
              })
              return
            }
            let sTime = this.taskInfo.startTime.split(':')
            let eTime = this.taskInfo.endTime.split(':')
            let scale = true
            if (sTime[0] > eTime[0]) {
              scale = false
            }
            if (sTime[0] === eTime[0] && sTime[1] >= eTime[1]) {
              scale = false
            }
            if (!scale) {
              this.$Notice.warning({
                title: '任务结束时间必须大于开始时间'
              })
              return
            }
          }
          if (!this.taskInfo.rangTime) {
            this.$Notice.warning({
              title: '请输入巡更浮动时间'
            })
            return
          }
          // 如果有taskInfo._id 时，为修改任务，反之则为添加
          if (this.taskInfo._id) {
            this.updateTask(this.taskInfo)
              .then(res => {
                this.$Notice.success({
                  title: '修改成功'
                })
                this.modal = false
                this.modalRight = false
                this.$refs['taskInfo'].resetFields()
                if (this.getType === 1) {
                  this.getTaskList({
                    org: this.orgInfo.id,
                    page: this.pageInfo.cur,
                    limit: this.pageLimit
                  })
                } else {
                  let param = Object.assign(
                    {
                      page: this.pageInfo.cur
                    },
                    this.searchData
                  )
                  this.searchTask(param)
                }
              })
              .catch(err => {
                this.$Notice.error({
                  title: err.response.data.message
                })
              })
            this.recordLog({logType: '操作日志', module: '电子巡查', operateName: '修改巡查任务', operateContent: '修改巡查任务', target: this.taskInfo.taskTitle})
          } else {
            if (this.taskInfo.userId) {
              this.addTask(this.taskInfo)
                .then(res => {
                  this.$Notice.success({
                    title: '添加成功'
                  })
                  patrol.clearCheckedTreeNode(this.$refs.pointTree.treeNode)
                  this.modal = false
                  this.modalRight = false
                  this.$refs['taskInfo'].resetFields()
                  this.getTaskList({ org: this.orgInfo.id, limit: this.pageLimit })
                })
                .catch(err => {
                  this.$Notice.error({
                    title: err.response.data.message
                  })
                })
              this.recordLog({logType: '操作日志', module: '电子巡查', operateName: '添加巡查任务', operateContent: '添加巡查任务', target: this.taskInfo.taskTitle})
            } else {
              this.$Notice.error({
                title: '请选择巡更人员'
              })
            }
          }
        }
      })
    },
    // 获取第N页巡更任务
    changePage(n) {
      this.isRemove = true
      let param = {}
      if (this.getType === 1) {
        param = {
          org: this.orgInfo.id,
          page: n,
          limit: this.pageLimit
        }
        this.getTaskList(param)
      } else {
        param = Object.assign(
          {
            page: n,
            limit: this.pageLimit
          },
          this.searchData
        )
        this.searchTaskList(param)
      }
    },
    pageSizeChange(n) {
      this.pageLimit = n
      this.isRemove = true
      let param = {}
      if (this.getType === 1) {
        param = {
          org: this.orgInfo.id,
          page: 1,
          limit: this.pageLimit
        }
        this.getTaskList(param)
      } else {
        param = Object.assign(
          {
            page: 1,
            limit: this.pageLimit
          },
          this.searchData
        )
        this.searchTaskList(param)
      }
    },
    // 任务创建弹出框右侧显示
    modalRightShow() {
      if (this.modalRight) {
        this.modalRight = false
      } else {
        this.getSentryPointTree()
          .then(res => {
            this.pointTree = toTree(res)
            this.modalRight = true
            patrol.selectPoint(this.taskInfo.points, this.pointTree)
          })
          .catch(err => console.log(err))
      }
    }
  }
}
</script>

<style lang="less"  scoped>
.flex-1 {
  position: relative;
  overflow: hidden;
}
.bs-table-box {
  position: absolute;
  left: 0;
  right: 0;
  height: 100%;
  background: #1c3053;
}
.ivu-table-tip{
  overflow-x: hidden !important;
}
.handle-left {
  flex: 0 0 300px;
  padding: 12px 24px;
}
.handle-left > Button {
  margin-right: 8px;
}
.handle-right {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  padding: 12px 24px;
}
.topBar{
  background: #1b3153;
}
.handle-right > div {
  display: inline-block;
  margin: 0 10px;
}
.handle-right > Button {
  margin-left: 8px;
}
.ivu-date-picker {
  width: 170px;
}
.task-point {
  width: calc(~'100% - 40px');
  display: inline-block;
}
// 弹出框右侧样式
.modal-right {
  padding: 10px;
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  border-left: 1px solid #171717;
  right: -260px;
  width: 260px;
  height: 100%;
  background: #1c3053;
}
.modal-right .ivu-date-picker {
  width: 180px;
}
.point-tree {
  flex: 1;
  border: 1px solid #ccc;
  margin: 10px 0;
  overflow: auto;
}
.condition {
  height: 26px;
  margin: 26px 0;
  width: 100%;
}
.condition > * {
  display: inline-block;
}
.condition > span {
  width: 80px;
  line-height: 24px;
  color: #fff;
}
.black_over{
    // display: none;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #081526;
    z-index: 9999;
    opacity: 0.8;
}
/*弹框*/
.popup{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -300px;
    margin-top: -328px;
    width: 600px;
    height: 656px;
    background-color: #1b3153;
    z-index: 99999;
    border-radius: 10px;
    border: 1px solid #1b3153;
}
.modal-top{
    font-size: 14px;
    height: 38px;
    padding: 10px 24px;
    border-radius: 8px 8px 0 0;
    background-color: #0f2343;;
}
</style>
<style>
.ivu-table-tip {
  overflow-x: hidden !important;
}
</style>
