<template src="./DutyPlan.html"></template>

<script>
import _ from 'lodash'
import moment from 'moment'
import teamApi from 'src/modal/api/business/duty/team.js'
import templateApi from 'src/modal/api/business/duty/template.js'
import personnelApi from 'src/modal/api/business/duty/personnel.js'
import planApi from 'src/modal/api/business/duty/plan.js'
import PlanClass from 'src/modal/factory/business/duty/plan.js'
import TeamClass from 'src/modal/factory/business/duty/team.js'
import PersonnelClass from 'src/modal/factory/business/duty/personnel.js'
import TemplateClass from 'src/modal/factory/business/duty/template.js'
import dutyTree from './dutyTree.vue'
import { mapActions } from 'vuex'

export default {
  components: { dutyTree },
  data() {
    return {
      detailPlanEdite: null,
      personnelListObj: null,
      personnelList: null,
      detailColumns: null,
      detailDateTime: null,
      detailData: '',
      // filterText: '',
      detailPlan: {
        name: '',
        time: '',
        template: ''
      },
      tableWidth: null,
      modalVisibleDetailPlan: false,
      modalVisibleEditePlan: false,
      recordAdd: false,
      isDutyList: false,
      teamList: [],
      newPlanColumns: [
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '班组',
          key: 'name'
        },
        {
          title: '移动',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Icon',
                {
                  class: {
                    first: params.index === 0
                  },
                  props: {
                    type: 'chevron-up'
                  },
                  nativeOn: {
                    click: () => {
                      if (params.index - 1 < 0) {
                        return
                      }
                      this.arrayMove(this.newPlanOrder, params.index, params.index - 1)
                    }
                  }
                },
                ''
              ),
              h(
                'Icon',
                {
                  class: {
                    last: params.index === this.newPlanOrder.length - 1
                  },
                  props: {
                    type: 'chevron-down'
                  },
                  nativeOn: {
                    click: () => {
                      if (params.index + 1 > this.newPlanOrder.length - 1) {
                        return
                      }
                      this.arrayMove(this.newPlanOrder, params.index, params.index + 1)
                    }
                  }
                },
                ''
              )
            ])
          }
        }
      ],
      newPlanOrder: [],
      templateList: [],
      newPlanRules: {
        name: [{ required: true, message: '请输入计划名称！' }, { max: 64, message: '计划名称最多 64 字符！' }],
        startTime: [{ required: true, message: '请输入值班时间！' }],
        template: [{ required: true, message: '请选择值班模板！' }],
        team: [{ required: true, message: '请选择值班班组！' }],
        order: [{ required: true, message: '请选择值班顺序！' }]
      },
      newPlan: {
        name: '',
        animal: '1',
        startTime: new Date(),
        endTime: new Date(),
        template: null,
        team: null,
        order: []
      },
      recordPlan: {
        name: '',
        animal: '1',
        startTime: new Date(),
        endTime: new Date(),
        template: null,
        team: null,
        order: []
      },
      modalVisibleAddPlan: false,
      searchData: '',
      page: {
        total: 0,
        current: 1,
        pageSize: this.$PageInfo.limit
      },
      selectedPlan: null,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          type: 'index',
          title: '编号',
          width: 100
        },
        {
          title: '值班表名称',
          minWidth: 100,
          key: 'name'
        },
        {
          title: '值班时间',
          minWidth: 100,
          render: (h, params) => {
            let text = '-'
            if (params.row.planTimeType === 'month') {
              text = '按月排班'
            } else if (params.row.planTimeType === 'week') {
              text = '按周排班'
            } else if (params.row.planTimeType === 'time') {
              text = params.row.time
            }
            return h('div', text)
          }
        },
        {
          title: '排班方式',
          minWidth: 100,
          render: (h, params) => {
            let text = params.row.planType === 'auth' ? '自动创建' : params.row.planType === 'manual' ? '手动创建' : '-'
            return h('div', text)
          }
        },
        {
          title: '排班模板',
          minWidth: 100,
          key: 'template'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            console.log(params.row, 'row')
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.handleDetailClick(params)
                    }
                  }
                },
                '排班详情'
              )
            ])
          }
        }
      ],
      data: [],
      columns1: [],
      data1: [],
      columns2: [],
      columns3: [],
      data2: [],
      data3: [],
      modalUpdatePlan: false,
      updatePlan: {
        name: ''
      }
    }
  },
  created() {
    this.initList()
    this.getTeam()
    this.getTemplate()
    this.getPersonel()
  },
  mounted() {
    this.tableWidth = this.$refs['tableContainer'].offsetWidth
    this.tableHeight = this.$refs['tableContainer'].offsetHeight
  },
  methods: {
    ...mapActions(['recordLog']),
    disableRulePlan(obj) {
      return (
        !obj.name || obj.name.length > 64 || !obj.startTime || !obj.endTime || !obj.template || !this.newPlanOrder[0]
      )
    },
    disableRecordPlan(obj) {
      return !obj.name || obj.name.length > 64 || obj.template === '' || !this.isDutyList
    },
    // confirmDetailPlan() {
    //   let params = {
    //     planId: this.detailPlan.id,
    //     name: this.detailPlanEdite.name
    //   }
    //   params.detail = this.detailData.map((item, rowIndex) => {
    //     let obj = {
    //       staffs: []
    //     }
    //     item.forEach((ele, index) => {
    //       // 0 为日期 大于 0 为员工
    //       if (index === 0) {
    //         obj.date = this.detailDateTime[rowIndex]
    //       } else {
    //         obj.staffs.push(ele)
    //       }
    //     })
    //     return obj
    //   })
    //   planApi
    //     .modifyPersonnel(params)
    //     .then(() => {
    //       this.initList()
    //       this.closeDetailPlan()
    //     })
    //     .catch(error => {
    //       this.closeDetailPlan()
    //       this.$Notice.error({
    //         title: '错误提示！',
    //         desc: error.message
    //       })
    //     })
    // },
    // 修改计划
    modifyPlan() {
      this.data2 = []
      this.columns2 = []
      if (this.selectedPlan.length > 1) {
        this.$Modal.confirm({
          title: '提示',
          content: '一次只能修改一个！'
        })
        return
      }
      this.modalUpdatePlan = true
      this.updatePlan.name = this.selectedPlan[0].name
      this.selectedPlan[0].detail.forEach((item, index) => {
        this.data2.push({})
        if (this.selectedPlan[0].planTimeType === 'month' || this.selectedPlan[0].planTimeType === 'week') {
          this.data2[index].date = index + 1
        } else {
          this.data2[index].date = this.$moment(item.date).format('YYYY-MM-DD')
        }
        // this.data2[index].date = this.$moment(item.date).format('YYYY-MM-DD')
        item.staffs.forEach((v, n) => {
          this.data2[index]['name' + n] = []
          v.forEach((a, b) => {
            this.data2[index]['name' + n].push(a._id)
          })
        })
      })
      let head = this.selectedPlan[0].templateDetail
      head.forEach((item, n) => {
        this.columns2.push({
          title: item.shiftName + '（' + item.startTime + '-' + item.endTime + '）',
          minWidth: 220,
          render: (h, params) => {
            return h('div', [
              h(
                'Select',
                {
                  style: {
                    width: 220
                  },
                  props: {
                    value: this.data2[params.index]['name' + n],
                    multiple: true,
                    filterable: true
                  },
                  on: {
                    'on-change': w => {
                      this.data2[params.index]['name' + n] = w
                    }
                  }
                },
                this.personnelList.map((val, n) => {
                  return h(
                    'Option',
                    {
                      props: {
                        value: val.id
                      }
                    },
                    val.realname
                  )
                })
              )
            ])
          }
        })
      })
      this.columns2.unshift({
        title: this.selectedPlan[0].planTimeType === 'week' ? '星期' : '日期',
        key: 'date',
        width: 110
      })
    },
    // 确认修改
    confirmUpdatePlan() {
      let body = {
        planType: this.selectedPlan[0].planType,
        _id: this.selectedPlan[0].id,
        name: this.updatePlan.name,
        startTime: new Date(this.selectedPlan[0].startTime).getTime(),
        endTime: new Date(this.selectedPlan[0].endTime).getTime(),
        template: this.selectedPlan[0].templateId,
        planTimeType: this.selectedPlan[0].planTimeType,
        group: [],
        detail: []
      }
      this.data2.forEach((item, index) => {
        body.detail.push({ staffs: [], data: '' })
        this.selectedPlan[0].templateDetail.forEach((v, n) => {
          body.detail[index].staffs.push(this.data2[index]['name' + n])
        })
      })
      // body.group = this.newPlanOrder.map((item, index) => {
      //   if (item.org) {
      //     return {
      //       org: {
      //         _id: item.org.id
      //       },
      //       sort: index + 1
      //     }
      //   } else {
      //     return {
      //       org: {
      //         _id: item.id
      //       },
      //       sort: index + 1
      //     }
      //   }
      // })

      planApi
        .modify(body)
        .then(() => {
          this.successMsg('修改成功！')
          this.initList()
          this.closeUpdatePlan()
        })
        .catch(error => {
          this.closeUpdatePlan()
          this.$Notice.error({
            title: '修改失败！',
            desc: error.message
          })
        })
    },
    // 取消修改
    closeUpdatePlan() {
      this.getTeam()
      this.modalUpdatePlan = false
    },
    // 值班计划详情
    handleDetailClick(params) {
      this.modalVisibleDetailPlan = true
      this.data3 = []
      this.columns3 = []
      console.log(params, 'params')
      this.detailPlan.name = params.row.name
      let text = ''
      if (params.row.planTimeType === 'month') {
        text = '按月排班'
      } else if (params.row.planTimeType === 'week') {
        text = '按周排班'
      } else {
        text = params.row.time
      }
      this.detailPlan.time = text
      this.detailPlan.template = params.row.template
      params.row.detail.forEach((item, index) => {
        this.data3.push({})
        if (params.row.planTimeType === 'month' || params.row.planTimeType === 'week') {
          this.data3[index].date = index + 1
        } else {
          this.data3[index].date = this.$moment(item.date).format('YYYY-MM-DD')
        }
        item.staffs.forEach((v, n) => {
          this.data3[index]['name' + n] = ''
          v.forEach((a, b) => {
            this.data3[index]['name' + n] += a.realname + '、'
          })
          this.data3[index]['name' + n] = this.data3[index]['name' + n].slice(0, -1)
        })
      })
      console.log(this.data3, this.personnelList, 'data3')
      let head = params.row.templateDetail
      head.forEach((item, n) => {
        this.columns3.push({
          title: item.shiftName + '（' + item.startTime + '-' + item.endTime + '）',
          key: 'name' + n,
          minWidth: 260,
          render: (h, params) => {
            return h(
              'span',
              {
                // style: {
                //   overflow: 'hidden',
                //   textOverflow: 'ellipsis',
                //   whiteSpace: 'nowrap'
                // },
                domProps: {
                  title: params.row['name' + n]
                }
              },
              params.row['name' + n]
            )
          }
        })
      })
      this.columns3.unshift({
        title: params.row.planTimeType === 'week' ? '星期' : '日期',
        key: 'date',
        width: 110
      })
      console.log(this.selectedPlan, '454545455')
    },
    // 创建计划机构
    renderTeamList(h, { root, node, data }) {
      const self = this
      return h(
        'div',
        {
          style: {
            display: 'inline-flex',
            'justify-content': 'space-between',
            'padding-right': '16px',
            width: '100%',
            'user-select': 'none'
          }
        },
        [
          h(
            'span',
            {
              attrs: {
                class: 'tree-title'
              },
              on: {
                click(event) {
                  self.$refs.teamTree.$el.querySelectorAll('.tree-title').forEach(ele => {
                    ele.classList.remove('tree-title-selected')
                  })
                  event.target.classList.toggle('tree-title-selected')
                }
              }
            },
            data.title
          ),
          h('div', [
            h('Button', {
              attrs: {
                size: 'small'
              },
              props: {
                icon: 'plus'
              },
              style: {
                marginRight: '8px'
              },
              on: {
                click: () => {
                  this.addOrder(data)
                }
              }
            }),
            h('Button', {
              attrs: {
                size: 'small'
              },
              props: {
                icon: 'minus'
              },
              on: {
                click: () => {
                  this.removeOrder(data)
                }
              }
            })
          ])
        ]
      )
    },
    addOrder(team) {
      let obj = {
        name: team.title,
        id: team.id
      }

      for (let item of this.newPlanOrder) {
        if (item.org) {
          if (item.org.id === team.id) {
            return
          }
        } else {
          if (item.id === obj.id) {
            return
          }
        }
      }

      this.newPlanOrder.push(obj)
    },
    removeOrder(team) {
      this.newPlanOrder = this.newPlanOrder.filter(item => {
        // 编辑时的操作 else 是添加时的操作
        if (item.org) {
          return item.org.id !== team.id
        } else {
          return item.id !== team.id
        }
      })
    },
    // 获取所有人员
    getPersonel() {
      let params = {
        limit: 99999,
        page: 1
      }

      personnelApi
        .listAll(params)
        .then(res => {
          const list = res.data

          let personnelListObj = {}
          this.personnelList = list.map(item => {
            let obj = new PersonnelClass(item)
            personnelListObj[obj.id] = obj.realname
            return obj
          })
          this.personnelListObj = personnelListObj
        })
        .catch(error => {
          this.$Notice.error({
            title: '错误提示！',
            desc: error.message
          })
        })
    },
    getTeam() {
      teamApi
        .list()
        .then(data => {
          // iView tree 组建根级为数组
          this.teamList = [iteration(data)]
          console.log(this.teamList)
        })
        .catch(error => {
          this.$Notice.error({
            title: '错误提示！',
            desc: error.message
          })
        })
      // 递归班组结构
      function iteration(data) {
        let obj = new TeamClass(data)
        obj.expand = false
        if (_.isArray(data.children)) {
          obj.children = data.children.map(team => iteration(team))
        }
        return obj
      }
    },
    getTemplate() {
      let params = {
        limit: 99999,
        page: 1
      }

      templateApi
        .list(params)
        .then(res => {
          const data = res.data
          this.templateList = data.map(template => new TemplateClass(template))
          // this.recordPlan.template = 0
        })
        .catch(error => {
          this.$Notice.error({
            title: '错误提示！',
            desc: error.message
          })
        })
    },
    // 获取排班计划列表
    initList(opt) {
      const isRefresh = opt && opt.isRefresh

      let params = {
        limit: this.page.pageSize,
        page: this.page.current,
        name: this.searchData
      }

      planApi
        .list(params)
        .then(res => {
          const data = res.data
          const headers = res.headers

          this.page = {
            total: parseInt(headers['x-bsc-count']),
            current: parseInt(headers['x-bsc-cur']),
            pageSize: parseInt(headers['x-bsc-limit'])
          }

          this.data = data.map(item => {
            let obj = new PlanClass(item)
            // if (this.selectedPlan) {
            //   this.selectedPlan = this.selectedPlan.map((selected, index) => {
            //     console.log(selected, obj)
            //     if (selected.id === obj.id) {
            //       this.selectedPlan[index] = obj
            //       obj._checked = true
            //       return obj
            //     }
            //   })
            // }
            return obj
          })

          if (isRefresh) {
            this.successMsg('刷新成功！')
          }
        })
        .catch(error => {
          this.$Notice.error({
            title: '错误提示！',
            desc: error.message
          })
        })
    },
    // 详情确定
    closeDetailPlan() {
      this.modalVisibleDetailPlan = false
    },
    handleTeamListCheckChange(list) {
      this.newPlanOrder = list.map(team => {
        return { name: team.title, id: team.id }
      })
    },
    // 移动数组中的值
    arrayMove(arr, oldIndex, newIndex) {
      if (newIndex >= arr.length) {
        let k = newIndex - arr.length + 1
        while (k--) {
          arr.push(undefined)
        }
      }
      arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0])
      return arr
    },
    // 自动创建
    confirmAddPlan() {
      let body = {
        planType: 'auth',
        name: this.newPlan.name,
        startTime: this.newPlan.startTime.getTime(),
        endTime: this.newPlan.endTime.getTime(),
        planTimeType: this.newPlan.animal === '1' ? 'month' : this.newPlan.animal === '2' ? 'week' : 'time',
        template: this.newPlan.template,
        group: []
      }
      body.group = this.newPlanOrder.map((item, index) => {
        return {
          org: item.id,
          sort: index + 1
        }
      })

      const paramsLog = {
        logType: '操作日志',
        module: '业务管理',
        operateName: '添加排版计划',
        operateContent: '添加排版计划',
        target: body.name
      }

      this.recordLog(paramsLog)

      planApi
        .create(body)
        .then(() => {
          this.successMsg('创建成功！')
          this.initList()
          this.closeAddPlan()
        })
        .catch(error => {
          this.closeAddPlan()
          this.$Notice.error({
            title: '创建失败！',
            desc: error.message
          })
        })
    },
    // 关闭自动创建框
    closeAddPlan() {
      this.getTeam()
      this.modalVisibleAddPlan = false
      this.$refs['newPlan'].resetFields()
    },
    handlePageSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.initList()
    },
    handlePageChange(pageNum) {
      this.page.current = pageNum
      this.initList()
    },
    handleTableSelectionChange(selection) {
      if (selection && selection.length) {
        this.selectedPlan = selection
      } else {
        this.selectedPlan = null
      }
    },
    confirmSearch() {
      this.initList()
    },
    addPlan() {
      this.modalVisibleAddPlan = true
      this.newPlan = {
        name: '',
        animal: '1',
        startTime: new Date(),
        endTime: new Date(),
        template: this.templateList[0].id,
        personal: null,
        order: null
      }
      this.newPlanOrder = []
      // this.teamList = []
    },
    recordAddPlan() {
      this.recordAdd = true
      this.recordPlan = {
        name: '',
        animal: '1',
        startTime: this.$moment(new Date()).format('l'),
        endTime: this.$moment(new Date()).format('l'),
        template: 0,
        personal: null,
        order: null
      }
    },
    // 关闭手动创建
    closeRecordAdd() {
      this.recordAdd = false
      this.isDutyList = false
      this.getTeam()
      this.$refs['recordPlan'].resetFields()
    },
    // 手动创建确认
    confirmRecordAdd() {
      const body = {
        planType: 'manual',
        name: this.recordPlan.name,
        startTime: this.$moment(this.recordPlan.startTime).valueOf(),
        endTime: this.$moment(this.recordPlan.endTime).valueOf(),
        planTimeType: this.recordPlan.animal === '1' ? 'month' : this.recordPlan.animal === '2' ? 'week' : 'time',
        template: this.templateList[this.recordPlan.template].id,
        group: [],
        detail: []
      }
      this.data1.forEach((item, index) => {
        body.detail.push({ staffs: [] })
        this.templateList[this.recordPlan.template].detail.forEach((v, n) => {
          if (this.recordPlan.animal === '3') {
            body.detail[index].date = this.$moment(this.data1[index].date).valueOf()
          } else {
            body.detail[index].date = ''
          }
          body.detail[index].staffs.push(this.data1[index]['name' + n])
        })
      })
      const paramsLog = {
        logType: '操作日志',
        module: '业务管理',
        operateName: '添加排版计划',
        operateContent: '添加排版计划',
        target: body.name
      }

      this.recordLog(paramsLog)
      planApi
        .create(body)
        .then(() => {
          this.successMsg('创建成功！')
          this.initList()
          this.closeRecordAdd()
        })
        .catch(error => {
          this.closeRecordAdd()
          this.$Notice.error({
            title: '错误提示！',
            desc: error.message
          })
        })
    },
    // 生成值班表
    createList() {
      this.data1 = []
      this.columns1 = []
      this.isDutyList = true
      let line = this.templateList[this.recordPlan.template].detail
      if (this.recordPlan.animal === '1') {
        this.columns1.unshift({
          type: 'index',
          title: '序号'
        })
        for (let n = 0; n < 31; n++) {
          this.data1.push({})
          for (let a = 0; a < line.length; a++) {
            this.data1[n]['name' + a] = []
          }
        }
      } else if (this.recordPlan.animal === '2') {
        this.columns1.unshift({
          title: '星期',
          type: 'index'
        })
        for (let n = 0; n < 7; n++) {
          this.data1.push({})
          for (let a = 0; a < line.length; a++) {
            this.data1[n]['name' + a] = []
          }
        }
      } else if (this.recordPlan.animal === '3') {
        console.log('626262626')
        this.columns1.unshift({
          title: '日期',
          key: 'date',
          width: 110
        })
        let start = this.$moment(this.recordPlan.startTime).valueOf()
        let end = this.$moment(this.recordPlan.endTime).valueOf()
        let num = (end - start) / 86400000 + 1
        for (let n = 0; n < num; n++) {
          this.data1.push({})
          for (let a = 0; a < line.length; a++) {
            this.data1[n]['name' + a] = []
          }
          this.data1[n].date = this.$moment(start + n * 86400000).format('YYYY-MM-DD')
        }
      }
      line.forEach((item, n) => {
        this.columns1.push({
          title: item.name + '（' + item.startTime + '-' + item.endTime + '）',
          minWidth: 220,
          render: (h, params) => {
            return h('div', [
              h(
                'Select',
                {
                  style: {
                    width: 220
                  },
                  props: {
                    value: this.data1[params.index]['name' + n],
                    multiple: true,
                    filterable: true
                  },
                  on: {
                    'on-change': w => {
                      this.data1[params.index]['name' + n] = w
                    }
                  }
                },
                this.personnelList.map((val, n) => {
                  return h(
                    'Option',
                    {
                      props: {
                        value: val.id
                      }
                    },
                    val.realname
                  )
                })
              )
            ])
          }
        })
      })
    },
    // modifyPlan() {
    //   let plan = this.selectedPlan[0]
    //   this.modalVisibleEditePlan = true
    //   this.newPlan = {
    //     detail: plan.detail,
    //     id: plan.id,
    //     name: plan.name,
    //     startTime: plan.startTime,
    //     endTime: plan.endTime,
    //     template: plan.templateId
    //   }
    //   this.newPlanOrder = plan.order
    // },
    removePlan() {
      this.$Modal.confirm({
        title: '确认删除',
        content:
          this.selectedPlan.length > 1
            ? `是否删除 ${this.selectedPlan.length} 份计划？`
            : `是否删除计划 ${this.selectedPlan[0].name} ？`,
        onOk: () => {
          let params = this.selectedPlan.map(plan => {
            return plan.id
          })
          planApi
            .remove(params)
            .then(() => {
              const paramsLog = {
                logType: '操作日志',
                module: '业务管理',
                operateName: '删除排版计划',
                operateContent: '删除排版计划',
                target: this.selectedPlan.map(item => item.name).join(' ')
              }

              this.recordLog(paramsLog)
              this.selectedPlan = null
              this.initList()
            })
            .catch(error => {
              this.$Notice.error({
                title: '错误提示！',
                desc: error.message
              })
            })
        },
        onCancel: () => {}
      })
    },
    refreshList() {
      this.initList({ isRefresh: true })
    }
  }
}
</script>

<style lang="less">
#duty-plan {
  height: 100%;
  display: flex;
  .main-content {
    background-color: #1b3153;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    .toolbar {
      display: flex;
      padding: 12px 24px;
      min-height: 54px;
      justify-content: space-between;
      button {
        margin-right: 8px;
      }
      .right-bar {
        display: flex;
        input {
          width: 240px;
        }
      }
    }
    .ivu-form-item-label {
      margin-top: -33px !important;
    }
    .table-container {
      flex-grow: 1;
      overflow-y: auto;
    }
    .paging-container {
      display: flex;
      min-height: 38px;
      padding: 0 16px;
      align-items: center;
      justify-content: flex-end;
      background-color: #244575;
      user-select: none;
    }
  }
}
.ivu-table-tbody i {
  color: #fff !important;
}
// iview 组建样式修改
.modal-add-plan {
  .ivu-date-picker {
    width: 49.5%;
  }
  .template-select {
    width: 100%;
  }
  .ivu-icon-chevron-up {
    cursor: pointer;
    &.first {
      color: #888;
    }
  }
  .ivu-icon-chevron-down {
    cursor: pointer;
    margin-left: 5px;
    &.last {
      color: #888;
    }
  }
  // 去掉根班组添加按钮
  .ivu-tree {
    & > ul {
      & > li {
        margin: 0;
        & > div {
          button {
            display: none;
          }
        }
      }
    }
  }
  .tree-title {
    max-width: 83%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    &.tree-title-selected {
      white-space: normal;
      word-break: break-all;
    }
  }
}

.modal-detail-plan {
  .ivu-modal-body {
    padding-bottom: 0;
  }
  .planInfo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    position: relative;
    .name {
      position: relative;
      .ivu-input-wrapper {
        width: 150px;
      }
      .iterm-error-tip {
        right: -63%;
        top: 50%;
        transform: translateY(-50%);
        position: absolute;
        color: #ed3f14;
      }
    }
    .time {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    > div {
      font-size: 12px;
    }
  }
  .planTable {
    .label {
      font-size: 12px;
      margin-bottom: 12px;
    }
  }
  .table-like {
    height: 390px;
    position: relative;
    overflow-y: hidden;
    .table-header {
      min-width: 100%;
      position: absolute;
      .tr {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #244575;
        height: 40px;
        .th {
          width: 210px;
          text-align: center;
          // flex-shrink: 0;
          &.date {
            width: 80px;
          }
        }
      }
    }
    .table-body {
      top: 40px;
      min-width: 100%;
      position: absolute;
      max-height: 350px;
      overflow-y: auto;
      overflow-x: hidden;
      .tr {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        min-height: 48px;
        padding: 15px 0;
        border-bottom: 1px solid #203863;
        &:last-of-type {
          border-bottom: none;
        }
        &:hover {
          background-color: #20365c;
        }
        .td {
          width: 210px;
          padding: 0 5px;
          &.date {
            width: 80px;
            text-align: center;
          }
        }
      }
      .ivu-tag {
        i {
          color: #fff;
        }
      }
    }
  }
}
</style>
