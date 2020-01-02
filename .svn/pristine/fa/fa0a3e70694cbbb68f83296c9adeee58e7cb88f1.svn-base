<template src="./DutyTemplate.html"></template>

<script>
import templateApi from 'src/modal/api/business/duty/template.js'
import TemplateClass from 'src/modal/factory/business/duty/template.js'

import { mapActions } from 'vuex'

const validateNumber = (rule, value, callback) => {
  const reg = /^[\d]+$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error())
  }
}

export default {
  data() {
    return {
      tableHeightDetail: null,
      tableWidth: null,
      newTemplateDetailChecked: false,
      detailTemplate: {
        number: null,
        name: ''
      },
      modalVisibleDetailTemplate: false,
      editeTemplateRules: {
        number: [
          { required: true, message: '请输入模板编号！' },
          { max: 16, message: '模板编号最大 16位！' },
          { validator: validateNumber, message: '模板编号必须是的数字！' }
        ],
        name: [{ required: true, message: '请输入模板名！' }, { max: 64, message: '模板名最多 64 个字符' }]
      },
      editeTemplate: {
        number: '',
        name: '',
        detail: []
      },
      modalVisibleEditeTemplate: false,
      newTemplateRules: {
        number: [
          { required: true, message: '请输入模板编号！' },
          { max: 4, message: '模板编号最大 4 位！' },
          { validator: validateNumber, message: '模板编号必须是大于 0 的数字！' }
        ],
        name: [{ required: true, message: '请输入模板名！' }, { max: 64, message: '模板名最多 64 个字符' }]
      },
      newTemplate: {
        number: '',
        name: '',
        detail: []
      },
      newTemplateDetail: [],
      modalVisibleAddTemplate: false,
      selectedTemplate: null,
      page: {
        total: 0,
        current: 1,
        pageSize: this.$PageInfo.limit
      },
      selectedPerson: null,
      searchData: '',
      selectedNewTemplateDetail: null,
      columnsDetail: [
        {
          type: 'index',
          title: '序号',
          width: 60,
          align: 'center'
        },
        {
          title: '班次名称',
          minWidth: 100,
          key: 'name'
        },
        {
          title: '开始时间',
          minWidth: 100,
          key: 'startTime'
        },
        {
          title: '结束时间',
          minWidth: 100,
          key: 'endTime'
        }
      ],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '编号',
          minWidth: 100,
          key: 'number'
        },
        {
          title: '模板名称',
          minWidth: 100,
          key: 'name'
        },
        {
          title: '创建时间',
          minWidth: 100,
          key: 'time'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
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
                      this.openDetailTemplate(params)
                    }
                  }
                },
                '详情'
              )
            ])
          }
        }
      ],
      data: []
    }
  },
  created() {
    this.initList()
  },
  mounted() {
    this.tableWidth = this.$refs['tableContainer'].offsetWidth
    this.tableHeight = this.$refs['tableContainer'].offsetHeight
  },
  methods: {
    ...mapActions(['recordLog']),
    disabledRuleTemplate(obj) {
      return !obj.number || !/^[\d]+$/.test(obj.number) || obj.number.length > 4 || !obj.name || obj.name.length > 64
    },
    initList(opt) {
      const isRefresh = opt && opt.isRefresh

      let params = {
        limit: this.page.pageSize,
        page: this.page.current,
        name: this.searchData
      }

      templateApi
        .list(params)
        .then(res => {
          const data = res.data
          const headers = res.headers

          this.page = {
            total: parseInt(headers['x-bsc-count']),
            current: parseInt(headers['x-bsc-cur']),
            pageSize: parseInt(headers['x-bsc-limit'])
          }

          this.data = data.map(template => {
            let obj = new TemplateClass(template)
            if (this.selectedTemplate) {
              this.selectedTemplate.forEach((item, index) => {
                if (item.id === obj.id) {
                  this.selectedTemplate[index] = obj
                  obj._checked = true
                }
              })
            }
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
    addNewTemplateDetail() {
      this.newTemplateDetail.push({
        name: '',
        startTime: '00:00',
        endTime: '00:00',
        checked: false
      })
    },
    newTemplateDetailCheckboxChange() {
      this.newTemplateDetailChecked = false

      this.newTemplateDetail.forEach((item, index) => {
        if (item.checked) {
          this.newTemplateDetailChecked = true
        }
      })
    },
    removeNewTemplateDetail() {
      this.newTemplateDetail = this.newTemplateDetail.filter(item => {
        return !item.checked
      })
      this.newTemplateDetailCheckboxChange()
    },
    closeDetailTemplate() {
      this.modalVisibleDetailTemplate = false
    },
    confirmEditeTemplate() {
      let params = {
        code: this.editeTemplate.number,
        name: this.editeTemplate.name,
        time: new Date().getTime(),
        id: this.editeTemplate.id,
        detail: this.newTemplateDetail.map(item => {
          return {
            shiftName: item.name,
            startTime: item.startTime,
            endTime: item.endTime
          }
        })
      }

      if (!params.detail[0]) {
        this.closeEditeTemplate()
        this.$Notice.error({
          title: '错误提示！',
          desc: '修改失败！至少保留一条规则'
        })
        return
      }

      const paramsLog = {
        logType: '操作日志',
        module: '业务管理',
        operateName: '修改排班模版',
        operateContent: '修改排班模版',
        target: params.name
      }

      this.recordLog(paramsLog)

      templateApi
        .modify(params)
        .then(data => {
          this.initList()
          this.closeEditeTemplate()
        })
        .catch(error => {
          this.closeEditeTemplate()
          this.$Notice.error({
            title: '错误提示！',
            desc: error.message
          })
        })
    },
    closeEditeTemplate() {
      this.modalVisibleEditeTemplate = false
      this.$refs['editeTemplate'].resetFields()
    },
    confirmAddTemplate() {
      let params = {
        code: this.newTemplate.number,
        name: this.newTemplate.name,
        time: new Date().getTime(),
        detail: this.newTemplateDetail.map(item => {
          return {
            shiftName: item.name,
            startTime: item.startTime,
            endTime: item.endTime
          }
        })
      }
      if (!params.detail[0]) {
        this.closeAddTemplate()
        this.$Notice.error({
          title: '错误提示！',
          desc: '添加失败！至少添加一条规则'
        })
        return
      }

      const paramsLog = {
        logType: '操作日志',
        module: '业务管理',
        operateName: '添加排班模版',
        operateContent: '添加排班模版',
        target: params.name
      }

      this.recordLog(paramsLog)

      templateApi
        .create(params)
        .then(data => {
          this.initList()
          this.closeAddTemplate()
        })
        .catch(error => {
          // this.closeAddTemplate()
          this.$Notice.error({
            title: '错误提示！',
            desc: error.message
          })
        })
    },
    closeAddTemplate() {
      this.modalVisibleAddTemplate = false
      this.$refs['newTemplate'].resetFields()
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
        this.selectedTemplate = selection
      } else {
        this.selectedTemplate = null
      }
    },
    openDetailTemplate(params) {
      let template = params.row

      // 当详情中模板详情超过 10 条数据后，限制其高度
      if (template.detail.length > 10) {
        this.tableHeightDetail = 515
      } else {
        this.tableHeightDetail = null
      }

      this.modalVisibleDetailTemplate = true
      this.newTemplateDetailChecked = false
      // TODO 这里改为当前选中的内容
      this.detailTemplate.number = template.number
      this.detailTemplate.name = template.name
      this.newTemplateDetail = template.detail
    },
    confirmSearch() {
      this.initList()
    },
    addTemplate() {
      this.modalVisibleAddTemplate = true
      this.newTemplate = {
        number: '',
        name: '',
        detail: []
      }
      this.newTemplateDetailChecked = false
      this.newTemplateDetail = []
    },
    modifyTemplate() {
      this.modalVisibleEditeTemplate = true

      let selectedTemplate = this.selectedTemplate[0]

      this.editeTemplate = {
        number: selectedTemplate.number,
        name: selectedTemplate.name,
        id: selectedTemplate.id,
        detail: []
      }
      this.newTemplateDetailChecked = false
      this.newTemplateDetail = selectedTemplate.detail.map(obj => {
        obj.checked = false
        return obj
      })
    },
    removeTemplate() {
      this.$Modal.confirm({
        title: '确认删除',
        content:
          this.selectedTemplate.length > 1
            ? `是否删除 ${this.selectedTemplate.length} 份模板？`
            : `是否删除模版 ${this.selectedTemplate[0].name} ？`,
        onOk: () => {
          let idsArr = this.selectedTemplate.map(item => {
            return item.id
          })
          templateApi
            .remove(idsArr)
            .then(() => {
              const paramsLog = {
                logType: '操作日志',
                module: '业务管理',
                operateName: '删除排班模版',
                operateContent: '删除排班模版',
                target: this.selectedTemplate.map(item => item.name).join(' ')
              }

              this.recordLog(paramsLog)

              this.selectedTemplate = null
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
#duty-template {
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
// 修复 iview 组件样式被覆盖
.detail-template {
  .content {
    max-height: 420px;
    overflow-y: auto;
    padding: 0;
    > div {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .ivu-date-picker {
      width: 100px;
    }
  }
}

.detail-template-toolbar {
  .ivu-btn-error {
    color: #fff;
    background-color: #c2334d;
    border-color: #c2334d;
    &[disabled] {
      background: #535777;
      color: #cacaca;
    }
  }
}

.modal-add-template {
  .ivu-btn-primary {
    background: #3c5073;
    &:hover {
      background: #4699f9;
      color: #ffffff;
    }
  }
}
</style>
