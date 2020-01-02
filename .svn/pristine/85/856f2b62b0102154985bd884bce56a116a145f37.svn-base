<template>
  <div class="dispatch" v-resize="resizeFun">
    <header class="dispatch-header">
      <Button class="btn" type="ghost" @click="addTask" icon="plus">添加布控</Button>
      <Button class="btn" type="ghost" :disabled="disableBtn" @click="updateTask" icon="edit">修改</Button>
      <Button class="btn" type="ghost" :disabled="disableBtn" @click="removeTask" icon="trash-a">删除</Button>
      <Button class="btn" type="ghost" :disabled="disableBtn" @click="cancelTask">撤控</Button>
      <Button class="btn" type="ghost" :disabled="disableBtn" @click="againTask">重新布控</Button>
    </header>
    <main class="dispatch-main" ref="peopleTable">
      <Table :columns="dispatchColumns" :data="dispatchData" @on-selection-change="selectTask" style="height: 100%;"></Table>
      <Modal class="dispatch-model" :title="modelTitle" v-model="addDispatch" :mask-closable="false" @on-visible-change="closeAddModel">
        <Tabs type="card" :animated="false" v-model="clickTab" @on-click="clickTabs">
            <TabPane label="布控信息" name="布控信息" class="tab-pane">
              <div style="display:flex;flex-direction:row;">
                <div style="display:flex; flex-direction: column;">
                  <Form ref="infoValidate" class="dispatch-form" :model="infoValidate" :rules="infoRuleNameGroup" label-position="left" :label-width="85" style="width:275px; margin-right:20px">
                    <FormItem label="任务名称：" prop="name">
                      <Input v-model="infoValidate.name" placeholder="请输入任务名称"></Input>
                    </FormItem>
                    <FormItem label="布控底库：" prop="groups">
                      <Select v-model="infoValidate.groups" :multiple="true">
                        <Option v-for="(item, index) in group" :key="index" :value="item._id">{{item.name}}</Option>
                      </Select>
                    </FormItem>
                    </Form>
                    <div class="time-date">
                      <div class="clearfix">
                        <span class="search-label">开始时间: </span>
                        <BSdateRange :datetime="infoValidate.startTime" :disable="disabledTime" @timeChange="startChange" placeholder="选择日期" :width='190' :height='32'></BSdateRange>
                      </div>
                      <div class="clearfix">
                        <span class="search-label">结束时间: </span>
                        <BSdateRange :datetime="infoValidate.endTime" :disable="disabledTime" @timeChange="endChange" placeholder="选择日期" :width='190' :height='32'></BSdateRange>
                      </div>
                    </div>
                    <Form ref="infoResonRemark" class="dispatch-form" :model="infoValidate" :rules="infoRuleResonRemark" label-position="left" :label-width="85" style="width:275px; margin-right:20px">
                    <FormItem label="长期布控：" prop="always">
                      <i-switch v-model="infoValidate.always" @on-change="disabledTime = !disabledTime"></i-switch>
                    </FormItem>
                    <FormItem label="布控原因：" prop="reason">
                      <Input v-model="infoValidate.reason" placeholder="请输入布控原因"></Input>
                    </FormItem>
                    <FormItem label="备注：" prop="remark">
                      <Input class="description" type="textarea" v-model="infoValidate.remark" placeholder="请添加备注"></Input>
                    </FormItem>
                  </Form>
                </div>
                <bs-scroll ref="scroller" style="height: 448px; width: 100%; margin-left: 30px;float:right">
                  <Bsr-Tree :treeData="dispatchTree" :selectNode="selectNode" :showCheckbox="true" ref="bstree"
                    @on-expand="expand"
                    style="flex:1;">
                    <template slot-scope="{ node }">
                      <span class="item" :title="node.name"><i class=" iconfont" :class="[getNodeIcon(node).class]" :title="getNodeIcon(node).title"></i>{{node.name}}</span>
                    </template>
                  </Bsr-Tree>
                </bs-scroll>
              </div>
            </TabPane>
            <TabPane label="抓拍参数" name="抓拍参数" class="tab-pane" :disabled="disableTab">
              <Form ref="paramValidate" class="dispatch-form" :model="paramValidate" :rules="paramRuleValidate" label-position="left" :label-width="120">
                <FormItem label="最小人脸像素：" prop="pixel">
                  <Input class="param-form-input" number v-model="paramValidate.pixel" placeholder="请输入最小人脸像素"></Input> 像素（24-4096）
                </FormItem>
                <FormItem label="抓拍间隔：" prop="interval">
                  <Input class="param-form-input" number v-model="paramValidate.interval" placeholder="请输入抓拍间隔"></Input> 毫秒（100-2000）
                </FormItem>
                <FormItem label="抓拍模糊度上限：" prop="ambiguity">
                  <Input class="param-form-input" number v-model="paramValidate.ambiguity" placeholder="请输入模糊度上限"></Input> （0-1）
                </FormItem>
                <FormItem label="俯仰角（pitch）：" prop="pitch">
                  <Input class="param-form-input" number v-model="paramValidate.pitch" placeholder="请输入俯仰角"></Input> 度（-180 - 180）
                </FormItem>
                <FormItem label="偏航角（yaw）：" prop="yaw">
                  <Input class="param-form-input" number v-model="paramValidate.yaw" placeholder="请输入偏航角"></Input> 度（-180 - 180）
                </FormItem>
                <FormItem label="翻滚角（roll）：" prop="roll">
                  <Input class="param-form-input" number v-model="paramValidate.roll" placeholder="请输入翻滚角"></Input> 度（-180 - 180）
                </FormItem>
              </Form>
            </TabPane>
        </Tabs>
        <div slot="footer" style="position:relative;z-index:99">
          <Button v-if="clickTab === '布控信息'" type="ghost" @click="nextStep">下一步</Button>
          <div v-if="clickTab === '抓拍参数'">
            <Button type="ghost" @click="$refs.paramValidate.resetFields()" style="float: left">恢复默认</Button>
            <Button type="ghost" @click="addDispatch=false">取消</Button>
            <Button type="primary" @click="saveTask">确定</Button>
          </div>
        </div>
      </Modal>
    </main>
    <footer class="dispatch-footer">
      <Page @on-page-size-change="pageSizeChange"
        show-sizer
        :page-size-opts="$PageInfo.size"
        :show-total="true"
        :page-size="pageInfo.limit"
        :show-elevator="true"
        :total="pageInfo.count"
        :current="pageInfo.cur"
        @on-change="changePage">
      </Page>
    </footer>
  </div>
</template>
<script>
import {
  validateName,
  dispatchDesc,
  dispatchReson,
  validateFaceParam,
  validateInterval,
  validateAmbiguity,
  validatePitch
} from './common/validate'
import { mapActions } from 'vuex'
import { getNodeIcon } from '../../components/BStree/commonMethods'
export default {
  data() {
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    return {
      addDispatch: false,
      disableBtn: true,
      disabledTime: true,
      disableTab: true,
      clickTab: '布控信息',
      modelTitle: '添加布控',
      dispatchColumns: [
        {
          type: 'selection',
          width: 100,
          align: 'center'
        },
        {
          type: 'index',
          title: '序号',
          align: 'center',
          width: 100
        },
        {
          title: '任务名称',
          key: 'name',
          ellipsis: true
        },
        {
          title: '布控底库',
          key: 'groups',
          ellipsis: true
        },
        {
          title: '开始时间',
          key: 'startTime',
          ellipsis: true
        },
        {
          title: '结束时间',
          key: 'endTime',
          ellipsis: true
        },
        {
          title: '布控原因',
          key: 'reason',
          ellipsis: true
        },
        {
          title: '布控状态',
          key: 'state',
          ellipsis: true
        },
        {
          title: '备注',
          key: 'remark',
          ellipsis: true
        }
      ],
      dispatchData: [], // 布控任务列表
      group: [], // 布控底库
      dispatchTree: {}, // 布控树
      selectNode: [], // 默认选中的树节点
      allCheckedPoint: [], // 所有选中的点位
      taskCheck: [], // 选中任务
      infoValidate: {
        name: '',
        groups: [],
        always: true,
        startTime: new Date(),
        endTime: nextMonth,
        reason: '',
        remark: ''
      },
      infoRuleNameGroup: {
        name: [{ required: true, validator: validateName, trigger: 'change' }],
        groups: [{ required: true, type: 'array', message: '请选择布控地库', trigger: 'change' }]
      },
      infoRuleResonRemark: {
        reason: [{ validator: dispatchReson, trigger: 'change' }],
        remark: [{ validator: dispatchDesc, trigger: 'change' }]
      },
      paramValidate: {
        pixel: 48,
        interval: 1000,
        ambiguity: 0.7,
        pitch: 20,
        yaw: 30,
        roll: 30
      },
      paramRuleValidate: {
        pixel: [{ validator: validateFaceParam, trigger: 'change' }],
        interval: [{ validator: validateInterval, trigger: 'change' }],
        ambiguity: [{ validator: validateAmbiguity, trigger: 'change' }],
        pitch: [{ validator: validatePitch, trigger: 'change' }],
        yaw: [{ validator: validatePitch, trigger: 'change' }],
        roll: [{ validator: validatePitch, trigger: 'change' }]
      },
      pageInfo: {
        pages: 0,
        cur: 1,
        limit: this.$PageInfo.limit,
        count: 0
      },
      updateId: null,
      saveLoading: false
    }
  },
  computed: {
    isTrueDate() {
      return this.infoValidate.always
        ? true
        : new Date(this.infoValidate.startTime).getTime() < new Date(this.infoValidate.endTime).getTime()
    }
  },
  watch: {
    taskCheck(val) {
      if (val.length < 1) {
        this.disableBtn = true
      }
    }
  },
  methods: {
    ...mapActions([
      'getFaceTree',
      'getControlTaskList',
      'addControlTaskList',
      'setControlTaskList',
      'delControlTaskList',
      'getFaceGroupList',
      'cancelFaceGroupList'
    ]),
    clickTabs(e) {
      this.disableTab = true
      if (e === '抓拍参数') {
        this.nextStep()
      }
    },
    nextStep() {
      if (!this.isTrueDate) {
        this.disableTab = true
        return this.errorMsg('开始时间不能大于结束时间')
      }
      let result = true
      let arr = ['name', 'groups']
      let resonMarkArr = []
      if (this.infoValidate.reason !== '') {
        resonMarkArr.push('reason')
      }
      if (this.infoValidate.remark !== '') {
        resonMarkArr.push('remark')
      }
      arr.forEach(obj => {
        this.$refs.infoValidate.validateField(obj, valid => {
          if (valid) {
            result = false
          }
        })
      })
      resonMarkArr.forEach(obj => {
        this.$refs.infoResonRemark.validateField(obj, valid => {
          if (valid) {
            result = false
          }
        })
      })
      if (result) {
        this.disableTab = false
        this.clickTab = '抓拍参数'
      }
    },
    saveTask() {
      if (this.saveLoading) {
        return
      }
      this.$refs.paramValidate.validate(valid => {
        if (valid) {
          this.saveLoading = true
          const selectArr = this.$refs.bstree.getSelectedDeepIds() || []
          const param = {
            body: {
              vaild: true,
              points: selectArr,
              ...this.infoValidate,
              cameraCfg: {
                ...this.paramValidate
              }
            }
          }
          param.body.endTime = parseInt(new Date(param.body.endTime).getTime() / 1000)
          param.body.startTime = parseInt(new Date(param.body.startTime).getTime() / 1000)
          let wranTitle = ''
          if (this.updateId) {
            param.id = this.updateId
            wranTitle = '修改成功'
            this.setControlTaskList(param)
              .then(res => {
                this.saveLoading = false
                this.addDispatch = false
                this.updateId = null
                this.getNeedData()
                this.successMsg(wranTitle)
              })
              .catch(err => {
                this.saveLoading = false
                this.errorMsg(err.response.data.message)
              })
          } else {
            wranTitle = '添加成功'
            this.addControlTaskList(param)
              .then(res => {
                this.addDispatch = false
                this.saveLoading = false
                this.getNeedData()
                this.successMsg(wranTitle)
              })
              .catch(err => {
                this.saveLoading = false
                this.errorMsg(err.response.data.message)
              })
          }
        }
      })
    },
    addTask() {
      this.modelTitle = '添加布控'
      this.addDispatch = true
      this.infoValidate.groups = []
      this.group.forEach(obj => {
        this.infoValidate.groups.push(obj._id)
      })
      this.disabledTime = this.infoValidate.always
    },
    updateTask() {
      this.modelTitle = '修改布控'
      if (this.taskCheck.length > 1) {
        return this.errorMsg('一次只能修改一条任务')
      }
      if (this.taskCheck[0].name === '一键布控') {
        return this.errorMsg('一键布控任务不能修改')
      }
      const result = this.$lodash.cloneDeep(this.taskCheck[0])
      this.infoValidate = {
        name: result.name,
        groups: result.groupIds,
        always: result.always,
        startTime: result.startTime !== '长期布控' ? result.startTime : '',
        endTime: result.endTime !== '长期布控' ? result.endTime : '',
        reason: result.reason,
        remark: result.remark,
        vaild: result.vaild
      }
      this.paramValidate = result.cameraCfg
      this.selectNode = result.points
      this.updateId = result._id
      this.disabledTime = result.always
      this.addDispatch = true
    },
    batOperation(title, fun, noticeTitle, isVaild = false) {
      this.$Modal.confirm({
        title: '提示',
        content: `<p>${title}</p>`,
        onOk: () => {
          if (this.saveLoading) {
            return
          }
          this.saveLoading = true
          const param = {
            vaild: isVaild,
            ids: []
          }
          if (this.taskCheck.length) {
            this.taskCheck.forEach(item => {
              param.ids.push(item._id)
            })
          }
          fun(param)
            .then(res => {
              this.saveLoading = false
              this.getNeedData()
              this.successMsg(noticeTitle)
            })
            .catch(err => {
              this.saveLoading = false
              this.errorMsg(err.response.data.message)
            })
        },
        onCancel: () => {
          this.saveLoading = false
        }
      })
    },
    removeTask() {
      const result = this.taskCheck.filter(obj => {
        return obj.name === '一键布控'
      })
      if (result > 0) {
        return this.errorMsg('一键布控任务不能删除')
      }
      this.batOperation('确定删除所选任务？', this.delControlTaskList, '删除成功')
    },
    cancelTask() {
      this.batOperation('确定撤控所选任务？', this.cancelFaceGroupList, '撤控成功')
    },
    againTask() {
      this.batOperation('确定布控所选任务？', this.cancelFaceGroupList, '布控成功', true)
    },
    // 关闭添加布控弹窗
    closeAddModel(val) {
      if (!val) {
        this.$refs.infoValidate.resetFields()
        this.$refs.paramValidate.resetFields()
        this.selectNode = []
        this.saveLoading = false
        this.clickTab = '布控信息'
        if (this.updateId !== null) {
          this.updateId = null
        }
      }
    },
    startChange(val) {
      this.infoValidate.startTime = val.dateTimes
      console.log()
      if (this.infoValidate.startTime.getTime() > this.infoValidate.endTime.getTime()) {
        this.infoValidate.endTime = this.infoValidate.startTime
      }
    },
    endChange(val) {
      this.infoValidate.endTime = val.dateTimes
      if (this.infoValidate.startTime.getTime() > this.infoValidate.endTime.getTime()) {
        this.infoValidate.startTime = this.infoValidate.endTime
      }
    },
    // 表格选中
    selectTask(arr) {
      this.taskCheck = arr
      if (arr.length > 0) {
        this.disableBtn = false
      } else {
        this.disableBtn = true
      }
    },
    pageSizeChange(n) {
      this.pageInfo.limit = n
      this.getControlTaskList({ page: this.pageInfo.cur, limit: this.pageInfo.limit })
    },
    changePage(page) {
      this.getControlTaskList({ page: page || this.pageInfo.cur, limit: this.pageInfo.limit })
    },
    // 获取当前跟组件所需要的接口数据
    getNeedData() {
      this.getControlTaskList({ page: this.pageInfo.cur, limit: this.pageInfo.limit })
        .then(res => {
          this.pageInfo.count = Number(res.headers['x-bsc-count'])
          if (this.taskCheck.length > 0) {
            this.taskCheck = []
          }
          this.allCheckedPoint = []
          this.dispatchData = res.data.results
          this.dispatchData.forEach(item => {
            // 因为不存在相同点位，所以数组push不需要做存在比较
            this.allCheckedPoint = [...this.allCheckedPoint, ...item.points]
            if (!item.always) {
              item.startTime = this.$moment(item.startTime * 1000).format('YYYY年MM月DD日HH:mm:ss')
              item.endTime = this.$moment(item.endTime * 1000).format('YYYY年MM月DD日HH:mm:ss')
            } else {
              item.startTime = '长期布控'
              item.endTime = '长期布控'
            }
            item.groupIds = []
            item.state = item.vaild === true ? '布控' : '撤控'
            item.groups = item.groups
              .map(obj => {
                item.groupIds.push(obj._id)
                return obj.name
              })
              .toString()
          })
        })
        .catch(err => this.errorMsg(err.response.data.message))
      this.getFaceTree()
        .then(res => {
          this.dispatchTree = { ...res.data }
        })
        .catch(err => this.errorMsg(err.response.data.message))
      this.getFaceGroupList()
        .then(res => {
          this.group = res.data.filter(itme => {
            return itme.type !== 'static' && itme.name !== '路人库'
          })
          this.infoValidate.groups = []
          this.group.forEach(element => {
            this.infoValidate.groups.push(element._id)
          })
        })
        .catch(err => this.errorMsg(err.response.data.message))
    },
    // 展开结构子节点
    expand(node) {
      this.$refs.scroller.update()
      this.$emit('loadMore')
    },
    // 绑定引入的树icon方法
    getNodeIcon() {},
    resizeFun() {
      this.tableHeight = this.$refs['peopleTable'].offsetHeight
    }
  },
  created() {
    // 布控点位不能重复
    this.getNeedData()
    this.getNodeIcon = getNodeIcon
  },
  mounted() {
    this.resizeFun()
  },
  destroyed() {
    this.resizeFun = null
  }
}
</script>
<style>
.dispatch-form .ivu-select-selection {
  width: 190px;
}
.dispatch-form .ivu-select-selection > div {
  overflow: hidden;
  height: 32px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dispatch-form .ivu-tag-checked {
  padding: 0 3px;
  /* width: 36px;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis; */
}
.dispatch-form .ivu-icon-ios-close-empty {
  /* top: -5px; */
  display: none;
}
.dispatch-form .ivu-date-picker {
  width: 190px;
}
.dispatch-model .ivu-modal {
  width: fit-content !important;
}

.tab-pane {
  height: 500px;
  width: 600px !important;
}

.description textarea {
  resize: none;
  width: 240px;
  height: 118px;
}
</style>
<style scoped>
.dispatch {
  width: 100%;
  margin: 16px 0 16px 0;
}

.dispatch-header {
  padding-left: 16px;
  height: 50px;
  line-height: 50px;
  background: #1c3053;
}

.dispatch-header .btn {
  margin: 0 8px;
}

.dispatch-main {
  height: calc(100% - 83px);
}

.param-form-input {
  width: 190px;
}

.dispatch-footer {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: #244575;
}
.time-date {
  width:275px;
}
.time-date .search-label {
  line-height:32px;
  float:left;
  width: 85px;
}
.time-date .clearfix {
  display: flex;
  flex-direction: row;
  margin-bottom: 25px;
}
.clearfix:after {
  content: '.';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
</style>
