<template src="./Task.html">

</template>

<script>
import 'components/Scroll'
import { mapState, mapActions } from 'vuex'
import { post } from 'http/base'
export default {
  components: {},
  data() {
    const validateIdNumber = (rule, value, callback) => {
      if (value) {
        if (this.$bsValidate.IdentityCodeValid(value)) {
          callback(new Error(this.$bsValidate.IdentityCodeValid(value)))
        } else {
          let query = {
            idNumber: value,
            _id: this.formItem._id
          }
          this.IDNumber(query)
            .then(res => callback())
            .catch(err => {
              callback(new Error(err))
            })
        }
      } else {
        callback()
      }
    }
    return {
      tableHeight: 435,
      showTaskInfo: false,
      allSelected: false,
      selects: [],
      addModal: false,
      columns: [
        { type: 'selection', width: 60, align: 'left' },
        { title: '序号', width: 70, key: 'index', align: 'left' },
        {
          title: '姓名/性别/年龄',
          key: 'information',
          align: 'left',
          width: 140,
          ellipsis: true
        },
        {
          title: '布控状态',
          key: 'status',
          render: (h, param) => {
            const color = param.row.status === '布控中' ? 'rgb(25, 190, 107)' : 'white'
            return h(
              'span',
              {
                style: {
                  color: color
                }
              },
              param.row.status
            )
          },
          align: 'left'
        },
        { title: '布控计划时间', key: 'dateInfo', align: 'left', width: 200 },
        {
          title: '身份证号',
          key: 'idcard',
          align: 'left',
          width: 160,
          ellipsis: true
        },
        { title: '布控原因', key: 'reason', align: 'left', ellipsis: true },
        { title: '相似程度', key: 'similarity', align: 'left' },
        {
          title: '操作',
          render: (h, params) => {
            if (this.$BShasPower('BS-FACE-DISPATCH-MANAGE')) {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'ghost',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.handleModify(params)
                      }
                    }
                  },
                  '修改'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'ghost',
                      size: 'small'
                    },
                    on: {
                      click: e => {
                        e.stopPropagation()
                        this.selectedId = []
                        this.selectedId.push(params.row.id)
                        this.createResDelModel()
                      }
                    }
                  },
                  '删除'
                )
              ])
            }
          },
          width: 150
        }
      ],
      defaultList: [
        {
          name: 'a42bdcc1178e62b4694c830f028db5c0',
          url: 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
        },
        {
          name: 'bc7521e033abdd1e92222d733590f104',
          url: 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
        }
      ],
      imgName: '',
      uploadList: [],
      formItem: {
        username: '',
        gender: '',
        age: '',
        idNumber: '',
        similarity: '',
        reason: '',
        photoUrl: '',
        remark: '',
        startTime: '',
        endTime: '',
        resources: '',
        _id: ''
      },
      copyPhotoUrl: '',
      addTask: {
        item: '',
        step: 1,
        total: 2,
        okBtnText: '下一步'
      },
      nowPicture: '',
      pageLimit: this.$PageInfo.limit,
      pageCur: 1,
      point: [],
      editPoint: [],
      selectedItem: [],
      selectedId: [], // 选中的id
      isModify: false,
      sureLoading: false,
      mask: false,
      imgFileBase: '',
      searchState: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '未布控',
          value: 0
        },
        {
          label: '布控中',
          value: 1
        },
        {
          label: '已停止',
          value: 2
        },
        {
          label: '布控异常',
          value: 3
        }
      ],
      searchData: {
        name: '',
        state: ''
      },
      pageType: 1,
      // 表单验证:
      ruleInline: {
        username: [
          { required: true, message: '请填写姓名', trigger: 'blur' },
          { max: 64, message: '姓名长度不能超过64字符', trigger: 'blur' }
        ],
        age: [{ validator: this.$bsValidate.validateAge, trigger: 'blur' }],
        idNumber: [{ validator: validateIdNumber, trigger: 'blur' }],
        reason: [
          { required: true, message: '请填写布控原因', trigger: 'blur' },
          { max: 64, message: '布控原因长度不能超过64位字符', trigger: 'blur' }
        ],
        similarity: [
          {
            required: true,
            type: 'number',
            message: '请选择相似度',
            trigger: 'change'
          }
        ],
        startTime: [
          {
            required: true,
            type: 'date',
            message: '请选择开始时间',
            trigger: 'change'
          }
        ],
        endTime: [
          {
            required: true,
            type: 'date',
            message: '请选择结束时间',
            trigger: 'change'
          }
        ],
        remark: [{ max: 512, message: '备注长度不得超过512位字符', trigger: 'blur' }]
      },
      // 重启
      restart: false,
      startTime: new Date(new Date().setHours(0, 0, 0, 0)),
      endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 15)).setHours(0, 0, 0, 0)),
      nowTime: new Date(new Date().setHours(0, 0, 0, 0))
    }
  },
  computed: {
    ...mapState({
      dispatchedList: state => state.face.dispatchedList,
      pageTotal: state => state.face.pageTotal,
      faceResTree: state => state.face.faceResTree
    })
  },
  created() {
    this.getResTree()
    this.getDispatchedList({ page: this.pageCur, limit: this.pageLimit })
      .then(() => {
        if (this.dispatchedList[0]) {
          this.showTaskInfo = true
          this.nowPicture = this.dispatchedList[0].picture
        }
      })
      .catch(() => {
        this.$Notice.warning({
          title: '警告',
          desc: '布控参数获取失败',
          duration: 1
        })
      })
  },
  watch: {
    'addTask.step'(val) {
      if (val === this.addTask.total) {
        this.addTask.okBtnText = '确定'
        this.addTask.item = '布控点位'
      } else {
        this.addTask.okBtnText = '下一步'
        this.addTask.item = '基础信息'
      }
    },
    faceResTree: {
      handler(val) {
        this.point = this.$lodash.cloneDeep(val)
      },
      deep: true
    }
  },
  mounted() {
    this.tableHeight = this.$refs['faceTableBox'].offsetHeight - 90
    window.addEventListener('resize', this.resizefun)
  },
  methods: {
    // 切换Tabs
    showItem(val) {
      if (val === '基础信息') {
        this.addTask.step = 1
      } else if (val === '布控点位') {
        this.addTask.step = 2
      }
    },
    // 树组件选中
    defChecked(data, idArr) {
      function _getNode(node, id) {
        for (const i in node) {
          if (node[i]._id === id) {
            node[i].checked = true
            return
          }
          if (node[i].children && node[i].children.length) {
            _getNode(node[i].children, id)
          }
        }
      }
      idArr.forEach(id => {
        _getNode(data, id)
      })
      return data
    },
    ...mapActions([
      'getDispatchedList',
      'addDispatched',
      'getResTree',
      'deleteDispatched',
      'startMonitor',
      'endMonitor',
      'modifyDispatched',
      'getPersonalDetails',
      'getSearchList',
      'IDNumber'
    ]),
    cutStr(str, L) {
      let result = ''
      let strlen = str.length
      /* eslint-disable no-control-regex */
      let chrlen = str.replace(/[^\x00-\xff]/g, '**').length
      if (chrlen <= L) {
        return str
      }
      for (let i = 0, j = 0; i < strlen; i++) {
        let chr = str.charAt(i)
        if (/[\x00-\xff]/.test(chr)) {
          j++
        } else {
          j += 2
        }
        if (j <= L) {
          result += chr
        } else {
          return result
        }
      }
    },
    // 停止布控
    handleEnd() {
      this.endMonitor(this.selectedId)
        .then(() => {
          this.selectedId = []
          this.selectedItem = []
          this.getDispatchedList({
            page: this.pageCur,
            limit: this.pageLimit
          }).catch(() => {
            this.$Notice.warning({
              title: '警告',
              desc: '布控参数获取失败',
              duration: 1
            })
          })
        })
        .catch(() => {
          this.$Notice.warning({
            title: '警告',
            desc: '停止布控失败',
            duration: 1
          })
        })
    },
    // 刷新
    handleRefresh() {
      this.getDispatchedList({ page: this.pageCur, limit: this.pageLimit })
        .then(() => {
          this.$Notice.success({
            title: '成功',
            desc: '刷新成功',
            duration: 1
          })
        })
        .catch(() => {
          this.$Notice.warning({
            title: '警告',
            desc: '布控参数获取失败',
            duration: 1
          })
        })
    },
    // 修改
    handleModify(params) {
      this.getPersonalDetails(params.row.id)
        .then(res => {
          this.formItem.username = res.data.username
          this.formItem.gender = String(res.data.gender)
          this.formItem.age = String(res.data.age)
          this.formItem.idNumber = res.data.idNumber
          this.formItem.similarity = res.data.similarity
          this.formItem.reason = res.data.reason
          this.formItem.photoUrl = res.data.picture
          this.copyPhotoUrl = res.data.picture
          this.formItem.remark = res.data.remark
          this.formItem.startTime = this.$moment(res.data.startTime * 1000)._d
          this.formItem.endTime = this.$moment(res.data.endTime * 1000)._d
          this.formItem._id = res.data._id
          this.editPoint = this.$lodash.cloneDeep(
            this.defChecked(this.$lodash.cloneDeep(this.point), res.data.resources)
          )
          this.isModify = true
          this.addTask.step = 1
          this.addTask.okBtnText = '下一步'
          this.addModal = true
        })
        .catch(() => {
          this.$Notice.warning({
            title: '警告',
            desc: '获取人员信息失败',
            duration: 1
          })
        })
    },
    // 选中
    selectionChange(selection) {
      this.selectedId = []
      this.selectedItem = []
      for (let i = 0; i < selection.length; i++) {
        this.selectedId.push(selection[i].id)
        this.selectedItem.push(selection[i].id)
      }
    },
    // 添加 上传图片
    getImage(e) {
      this.$refs.getImage.addEventListener('change', this.readFile, false)
    },
    divGetImage() {
      this.$refs.getImage.click()
    },
    readFile(e) {
      if (this.$refs.getImage.files[0]) {
        if (window.FileReader) {
          if (!/image\/\w+/.test(this.$refs.getImage.files[0].type)) {
            this.$Notice.warning({
              title: '警告',
              desc: '文件必须为图片',
              duration: 1
            })
            this.$refs.getImage.value = ''
            return false
          }
          let reader = new window.FileReader()
          reader.readAsDataURL(this.$refs.getImage.files[0])
          reader.onload = event => {
            this.imgFileBase = this.$refs.getImage.files[0]
            this.formItem.photoUrl = event.target.result
          }
        } else {
          this.$Notice.warning({
            title: '警告',
            desc: '您的浏览器不支持图片上传',
            duration: 1
          })
        }
      }
    },
    handleRowClick(row) {
      this.rowClassName = function() {}
      this.showTaskInfo = true
      this.nowPicture = row.picture
    },
    handleAddTask() {
      this.editPoint = this.$lodash.cloneDeep(this.point)
      function _getNode(node) {
        for (const i in node) {
          node[i].checked = true
          if (node[i].children && node[i].children.length) {
            _getNode(node[i].children)
          }
        }
      }
      _getNode(this.editPoint)
      this.isModify = false
      this.initFormItem()
      this.addModal = true
      this.addTask.step = 1
      this.addTask.okBtnText = '下一步'
    },
    handleDelTask() {
      this.deleteDispatched(this.selectedId)
        .then(() => {
          this.$Notice.success({
            title: '成功',
            desc: '删除成功',
            duration: 1
          })
          this.getDispatchedList({ page: this.pageCur, limit: this.pageLimit })
            .then(() => {
              this.selectedId = []
              this.selectedItem = []
              this.showTaskInfo = false
            })
            .catch(() => {
              this.$Notice.warning({
                title: '警告',
                desc: '布控参数获取失败',
                duration: 1
              })
            })
        })
        .catch(() => {
          this.$Notice.warning({
            title: '警告',
            desc: '删除数据失败',
            duration: 1
          })
        })
    },
    handlePageChange(page) {
      this.showTaskInfo = false
      this.pageCur = page
      if (this.pageType === 1) {
        this.getDispatchedList({ page, limit: this.pageLimit })
          .then(() => {
            if (this.dispatchedList[0]) {
              this.showTaskInfo = true
              this.nowPicture = this.dispatchedList[0].picture
            } else {
              this.showTaskInfo = false
              this.nowPicture = ''
            }
          })
          .catch(() => {
            this.$Notice.warning({
              title: '警告',
              desc: '布控参数获取失败',
              duration: 1
            })
          })
      } else {
        const payload = '&username=' + this.searchData.name + '&status=' + this.searchData.state
        this.getSearchList({
          page,
          limit: this.pageLimit,
          payload: payload
        }).catch(err => {
          console.log('检索失败 error' + err)
          this.$Notice.warning({
            title: '警告',
            desc: '数据检索失败',
            duration: 1
          })
        })
      }
    },
    pageSizeChange(n) {
      this.pageLimit = n
      this.showTaskInfo = false
      this.pageCur = 1
      if (this.pageType === 1) {
        this.getDispatchedList({ page: this.pageCur, limit: this.pageLimit })
          .then(() => {
            if (this.dispatchedList[0]) {
              this.showTaskInfo = true
              this.nowPicture = this.dispatchedList[0].picture
            } else {
              this.showTaskInfo = false
              this.nowPicture = ''
            }
          })
          .catch(() => {
            this.$Notice.warning({
              title: '警告',
              desc: '布控参数获取失败',
              duration: 1
            })
          })
      } else {
        const payload = '&username=' + this.searchData.name + '&status=' + this.searchData.state
        this.getSearchList({
          page: this.pageCur,
          limit: this.pageLimit,
          payload: payload
        }).catch(err => {
          console.log('检索失败 error' + err)
          this.$Notice.warning({
            title: '警告',
            desc: '数据检索失败',
            duration: 1
          })
        })
      }
    },
    ok(name) {
      if (this.formItem.photoUrl) {
        this.$refs[name].validate(valid => {
          if (valid) {
            if (!this.isModify) {
              if (this.addTask.step < this.addTask.total) {
                this.addTask.step++
              } else {
                let addFm = new window.FormData()
                addFm.append('file', this.imgFileBase)
                post({
                  url: '/upload?type=fs',
                  body: addFm
                })
                  .then(res => {
                    this.formItem.photoUrl = '/api/upload?type=fs&id=' + res.data.id
                    this.formItem.resources = this.$refs.vtree.getSelectedNodeIds()
                    this.addTask.okBtnText = '添加中'
                    this.sureLoading = true
                    this.mask = true
                    this.addDispatched(this.formItem)
                      .then(res => {
                        this.addTask.okBtnText = '确定'
                        this.sureLoading = false
                        this.mask = false
                        this.addModal = false
                        this.$Notice.success({
                          title: '成功',
                          desc: '添加成功',
                          duration: 1
                        })
                        this.getDispatchedList({
                          page: this.pageCur,
                          limit: this.pageLimit
                        }).catch(() => {
                          this.$Notice.warning({
                            title: '警告',
                            desc: '布控参数获取失败',
                            duration: 1
                          })
                        })
                        this.$refs[name].resetFields()
                      })
                      .catch(addErr => {
                        this.addTask.okBtnText = '确定'
                        this.sureLoading = false
                        this.mask = false
                        this.$Notice.warning({
                          title: '警告',
                          desc: addErr.response.data.message,
                          duration: 1
                        })
                      })
                  })
                  .catch(err => {
                    console.log('图片上传失败 error' + err)
                    this.$Notice.warning({
                      title: '警告',
                      desc: err.response.data.message,
                      duration: 1
                    })
                  })
              }
            } else {
              if (this.addTask.step < this.addTask.total) {
                this.addTask.step++
              } else {
                if (this.copyPhotoUrl === this.formItem.photoUrl) {
                  this.formItem.resources = this.$refs.vtree.getSelectedNodeIds()
                  this.addTask.okBtnText = '修改中'
                  this.sureLoading = true
                  this.modifyDispatched(this.formItem)
                    .then(() => {
                      this.addTask.okBtnText = '确定'
                      this.sureLoading = false
                      this.addModal = false
                      this.$Notice.success({
                        title: '成功',
                        desc: '修改成功',
                        duration: 1
                      })
                      this.nowPicture = this.formItem.photoUrl
                      this.getDispatchedList({
                        page: this.pageCur,
                        limit: this.pageLimit
                      }).catch(err => {
                        this.$Notice.warning({
                          title: '警告',
                          desc: err.response.data.message,
                          duration: 1
                        })
                      })
                      this.$refs[name].resetFields()
                    })
                    .catch(err => {
                      console.log(err)
                      this.addTask.okBtnText = '确定'
                      this.sureLoading = false
                      this.$Notice.warning({
                        title: '警告',
                        desc: err.response.data.message,
                        duration: 1
                      })
                    })
                } else {
                  let motifyFm = new window.FormData()
                  motifyFm.append('file', this.imgFileBase)
                  post({
                    url: '/upload?type=fs',
                    body: motifyFm
                  })
                    .then(res => {
                      this.formItem.photoUrl = '/api/upload?type=fs&id=' + res.data.id
                      this.formItem.resources = this.$refs.vtree.getSelectedNodeIds()
                      this.addTask.okBtnText = '修改中'
                      this.sureLoading = true
                      this.modifyDispatched(this.formItem)
                        .then(() => {
                          this.addTask.okBtnText = '确定'
                          this.sureLoading = false
                          this.addModal = false
                          this.$Notice.success({
                            title: '成功',
                            desc: '修改成功',
                            duration: 1
                          })
                          this.nowPicture = this.formItem.photoUrl
                          this.getDispatchedList({
                            page: this.pageCur,
                            limit: this.pageLimit
                          }).catch(err => {
                            this.$Notice.warning({
                              title: '警告',
                              desc: err.response.data.message,
                              duration: 1
                            })
                          })
                          this.$refs[name].resetFields()
                        })
                        .catch(err => {
                          console.log(err)
                          this.addTask.okBtnText = '确定'
                          this.sureLoading = false
                          this.$Notice.warning({
                            title: '警告',
                            desc: '修改数据失败' + err.response.data.message,
                            duration: 1
                          })
                        })
                    })
                    .catch(err => {
                      console.log('图片上传失败 error' + err)
                      this.$Notice.warning({
                        title: '警告',
                        desc: err.response.data.message,
                        duration: 1
                      })
                    })
                }
              }
            }
          } else {
            this.$Notice.warning({
              title: '提示',
              desc: '请填写正确的相关信息',
              duration: 1
            })
          }
        })
      } else {
        this.$Notice.warning({
          title: '提示',
          desc: '请上传照片',
          duration: 1
        })
      }
    },
    cancel(name) {
      this.sureLoading = false
      this.addModal = false
      this.$refs[name].resetFields()
    },
    initFormItem() {
      for (let key in this.formItem) {
        this.formItem[key] = ''
      }
      this.formItem.similarity = 80
      this.formItem.startTime = new Date(new Date().setHours(0, 0, 0, 0))
      this.formItem.endTime = new Date(new Date(new Date().setDate(new Date().getDate() + 15)).setHours(0, 0, 0, 0))
    },
    // 删除时提示
    createResDelModel() {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除所选资源吗？</p>',
        onOk: () => {
          this.handleDelTask()
        },
        onCancel: () => {
          if (this.selectedItem.length === 0) {
            this.selectedId = []
          }
        }
      })
    },
    // 选中第一行
    rowClassName(row, index) {
      if (index === 0) {
        return 'ivu-table-row-highlight'
      }
      return ''
    },
    // 检索
    search() {
      this.pageType = 2
      const payload = '&username=' + this.searchData.name + '&status=' + this.searchData.state
      this.getSearchList({
        page: this.pageCur,
        limit: this.pageLimit,
        payload: payload
      })
        .then(() => {
          if (this.dispatchedList[0]) {
            this.showTaskInfo = true
            this.nowPicture = this.dispatchedList[0].picture
          } else {
            this.showTaskInfo = false
            this.nowPicture = ''
          }
        })
        .catch(err => {
          console.log('检索失败 error' + err)
          this.$Notice.warning({
            title: '警告',
            desc: '数据检索失败',
            duration: 1
          })
        })
    },
    // 批量重启
    restartBatch() {
      this.restart = true
    },
    // 批量重启--弹窗取消
    restartCancel() {
      this.restart = false
    },
    // 批量重启--弹窗确定
    restartSubmit() {
      let data = {
        ids: this.selectedId,
        startTime: Date.parse(this.startTime) / 1000,
        endTime: Date.parse(this.endTime) / 1000
      }
      this.startMonitor(data)
        .then(() => {
          this.restart = false
          this.selectedId = []
          this.selectedItem = []
          this.getDispatchedList({
            page: this.pageCur,
            limit: this.pageLimit
          }).catch(() => {
            this.$Notice.warning({
              title: '警告',
              desc: '布控参数获取失败',
              duration: 1
            })
          })
        })
        .catch(err => {
          this.$Notice.warning({
            title: '警告',
            desc: '开启布控失败',
            duration: 1
          })
          console.log('restartSubmit error: ' + err)
        })
    },
    resizefun() {
      this.tableHeight = this.$refs['faceTableBox'].offsetHeight - 90
    }
  },
  beforeDestroy() {
    this.$refs.getImage.removeEventListener('change', this.readFile, false)
    delete this.readFile
    window.removeEventListener('resize', this.resizefun)
    this.resizefun = null
  }
}
</script>

<style lang="less" scoped>
.dispatch-task-content {
  flex: 1;
  padding: 0;
  background: #1c3054;
  height: 100%;
  display: flex;
  flex-direction: column;
  .clearfix:after {
    content: '.';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .operate-button {
    flex: 0 0 32px;
    padding: 12px 24px;
  }
  .operate-button button {
    margin-right: 8px;
    height: 32px;
    line-height: 18px;
  }
  .operate-button .ivu-btn {
    padding: 8px 16px !important;
  }
  .page-warp {
    height: 48px;
    padding-top: 8px;
    border: 1px solid #244575;
    border-top: none;
    .left-info {
      display: inline-block;
      height: 32px;
      line-height: 32px;
      margin-left: 10px;
      font-size: 0.75rem;
    }
    .ivu-page {
      float: right;
      margin-right: 10px;
    }
  }
  .snapshot-type {
    text-align: center;
    font-size: 12px;
    font-weight: bold;
    height: 32px;
    line-height: 32px;
    background-color: #244575;
  }
  .snapshot-photo {
    height: 185px;
    text-align: center;
    padding: 20px;
  }
  .photo-table {
    width: 100%;
    height: 100%;
  }
  /*上传*/
  .demo-upload-list {
    display: inline-block;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    margin-right: 4px;
  }
  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  /deep/ .ivu-table-wrapper tr th:first-child .ivu-table-cell {
    padding-left: 24px !important;
  }
  /deep/ .ivu-table-wrapper tr td:first-child .ivu-table-cell {
    padding-left: 24px !important;
  }
  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }
  .demo-upload-list-cover i {
    color: #fff;
    font-size: 25px;
    cursor: pointer;
    margin: 35px 2px;
  }
  .col-test {
    display: none !important;
  }
  .ivu-table .ivu-table-tip table td {
    line-height: 400px;
  }
}

.modal-top-picture {
  float: right;
  width: 40%;
  padding-left: 20px;
  .getImage {
    width: 220px;
    height: 220px;
    margin-left: 20px;
    border: 1px dashed #fff;
    img {
      width: 100%;
      height: 100%;
    }
  }
}

.modal-middle-content {
  float: left;
  width: 60%;
  .ivu-date-picker {
    width: 100%;
  }
}
.table-footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
