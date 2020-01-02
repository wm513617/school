<template src="./List.html"></template>

<script>
import { mapState, mapActions } from 'vuex'
import { post } from 'http/base'
export default {
  components: {},
  data() {
    const validateIdNumber = (rule, value, callback) => {
      if (value.length) {
        if (this.$bsValidate.IdentityCodeValid(value)) {
          callback(new Error(this.$bsValidate.IdentityCodeValid(value)))
        } else {
          let query = {
            idNumber: value,
            _id: this.formItem._id || ''
          }
          this.verifyNumber(query)
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
        { title: '序号', width: 60, key: 'index', align: 'left' },
        { title: '姓名', width: 80, key: 'username', align: 'left', ellipsis: true },
        { title: '性别', key: 'sex', align: 'left' },
        { title: '年龄', key: 'age', align: 'left' },
        {
          title: '身份证号',
          key: 'idcard',
          align: 'left',
          width: 200,
          ellipsis: true
        },
        { title: '人员类型', width: 100, key: 'type', align: 'left' },
        { title: '原因', key: 'reason', align: 'left', ellipsis: true },
        {
          title: '备注',
          key: 'remark',
          align: 'left',
          width: 220,
          ellipsis: true
        },
        {
          title: '操作',
          render: (h, params) => {
            if (this.$BShasPower('BS-FACE-PERSON-MANAGE')) {
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
        type: '',
        reason: '',
        photoUrl: '',
        remark: '',
        _id: ''
      },
      copyPhotoUrl: '',
      nowPicture: '',
      pageLimit: this.$PageInfo.limit,
      pageCur: 1,
      point: [],
      selectedItem: [],
      selectedId: [], // 选中的id
      isModify: false,
      sure: '确定',
      sureLoading: false,
      imgFileBase: '',
      searchState: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '黑名单',
          value: 3
        },
        {
          label: '白名单',
          value: 4
        }
      ],
      searchData: {
        name: '',
        type: ''
      },
      pageType: 1,
      // 表单验证:
      ruleInline: {
        username: [
          { required: true, message: '请填写姓名', trigger: 'blur' },
          { max: 64, message: '姓名长度不能超过64位字符', trigger: 'blur' }
        ],
        age: [{ validator: this.$bsValidate.validateAge, trigger: 'blur' }],
        idNumber: [{ validator: validateIdNumber, trigger: 'blur' }],
        reason: [{ max: 64, message: '布控原因长度不得超过64位字符', trigger: 'blur' }],
        type: [{ required: true, message: '请选择人员类型', trigger: 'change' }],
        remark: [{ max: 512, message: '备注长度不得超过512位字符', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      personList: state => state.face.personList,
      pageTotal: state => state.face.pageTotal,
      faceResTree: state => state.face.faceResTree
    })
  },
  created() {
    this.getResTree()
    this.getPersonList({ page: this.pageCur, limit: this.pageLimit })
      .then(() => {
        if (this.personList[0]) {
          this.nowPicture = this.personList[0].picture
          this.showTaskInfo = true
        }
      })
      .catch(() => {
        this.$Notice.warning({
          title: '警告',
          desc: '人员参数获取失败',
          duration: 1
        })
      })
  },
  watch: {
    faceResTree: {
      handler(val) {
        this.point = this.$lodash.cloneDeep(val)
      },
      deep: true
    }
  },
  mounted() {
    this.tableHeight = this.$refs['manage-list-content'].offsetHeight - 96
    window.addEventListener('resize', this.resizefun)
  },
  methods: {
    ...mapActions([
      'getPersonList',
      'addPersonList',
      'getResTree',
      'deletePersonList',
      'modifyPersonList',
      'getPersonalListDetails',
      'getSearchPersonList',
      'verifyNumber'
    ]),
    // 验证字符长度
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
    // 刷新
    handleRefresh() {
      this.getPersonList({ page: this.pageCur, limit: this.pageLimit })
        .then(() => {
          this.selectedId = []
          this.$Notice.success({
            title: '成功',
            desc: '刷新成功',
            duration: 1
          })
        })
        .catch(() => {
          this.$Notice.warning({
            title: '警告',
            desc: '人员参数获取失败',
            duration: 1
          })
        })
    },
    // 修改
    handleModify(params) {
      this.getPersonalListDetails(params.row.id)
        .then(res => {
          this.formItem.username = res.data.username
          this.formItem.gender = String(res.data.gender)
          this.formItem.type = String(res.data.type)
          this.formItem.age = String(res.data.age)
          this.formItem.idNumber = res.data.idNumber
          this.formItem.similarity = res.data.similarity
          this.formItem.reason = res.data.reason
          this.formItem.photoUrl = res.data.picture
          this.copyPhotoUrl = res.data.picture
          this.formItem.remark = res.data.remark
          this.formItem._id = res.data._id
        })
        .catch(() => {
          this.$Notice.warning({
            title: '警告',
            desc: '获取人员信息失败',
            duration: 1
          })
        })
      this.isModify = true
      this.addModal = true
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
    getImage() {
      this.$refs.getImage.addEventListener('change', this.readFile, false)
    },
    divGetImage() {
      this.$refs.getImage.click()
    },
    readFile(e) {
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
    },
    handleRowClick(row) {
      this.rowClassName = function() {}
      this.showTaskInfo = true
      this.nowPicture = row.picture
    },
    handleAddTask() {
      this.isModify = false
      this.initFormItem()
      this.addModal = true
    },
    handleDelTask() {
      this.deletePersonList(this.selectedId)
        .then(() => {
          this.$Notice.success({
            title: '成功',
            desc: '删除成功',
            duration: 1
          })
          this.getPersonList({ page: this.pageCur, limit: this.pageLimit })
            .then(() => {
              this.selectedId = []
              this.selectedItem = []
              if (this.personList[0]) {
                this.nowPicture = this.personList[0].picture
                this.showTaskInfo = true
              } else {
                this.nowPicture = ''
                this.showTaskInfo = false
              }
            })
            .catch(() => {
              this.$Notice.warning({
                title: '警告',
                desc: '人员参数获取失败',
                duration: 1
              })
            })
        })
        .catch(err => {
          this.$Notice.warning({
            title: '警告',
            desc: '删除数据失败' + err.response.data.message,
            duration: 1
          })
        })
    },
    handlePageChange(page) {
      this.showTaskInfo = false
      this.pageCur = page
      if (this.pageType === 1) {
        this.getPersonList({ page, limit: this.pageLimit })
          .then(() => {
            if (this.personList[0]) {
              this.nowPicture = this.personList[0].picture
              this.showTaskInfo = true
            } else {
              this.nowPicture = ''
              this.showTaskInfo = false
            }
          })
          .catch(() => {
            this.$Notice.warning({
              title: '警告',
              desc: '人员参数获取失败',
              duration: 1
            })
          })
      } else {
        const payload = '&username=' + this.searchData.name + '&type=' + this.searchData.type
        this.getSearchPersonList({
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
        this.getPersonList({ page: this.pageCur, limit: this.pageLimit })
          .then(() => {
            if (this.personList[0]) {
              this.nowPicture = this.personList[0].picture
              this.showTaskInfo = true
            } else {
              this.nowPicture = ''
              this.showTaskInfo = false
            }
          })
          .catch(() => {
            this.$Notice.warning({
              title: '警告',
              desc: '人员参数获取失败',
              duration: 1
            })
          })
      } else {
        const payload = '&username=' + this.searchData.name + '&type=' + this.searchData.type
        this.getSearchPersonList({
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
        if (this.copyPhotoUrl === this.formItem.photoUrl) {
          this.$refs[name].validate(valid => {
            if (valid) {
              if (!this.isModify) {
                this.sure = '添加中'
                this.sureLoading = true
                this.addPersonList(this.formItem)
                  .then(() => {
                    this.sure = '确定'
                    this.sureLoading = false
                    this.addModal = false
                    this.$Notice.success({
                      title: '成功',
                      desc: '添加成功',
                      duration: 1
                    })
                    this.getPersonList({
                      page: this.pageCur,
                      limit: this.pageLimit
                    }).catch(() => {
                      this.$Notice.warning({
                        title: '警告',
                        desc: '人员参数获取失败',
                        duration: 1
                      })
                    })
                    this.$refs[name].resetFields()
                  })
                  .catch(err => {
                    this.sure = '确定'
                    this.sureLoading = false
                    this.$Notice.warning({
                      title: '添加失败',
                      desc: err.response.data.message,
                      duration: 1
                    })
                  })
              } else {
                this.sure = '修改中'
                this.sureLoading = true
                this.modifyPersonList(this.formItem)
                  .then(() => {
                    this.sure = '确定'
                    this.sureLoading = false
                    this.addModal = false
                    this.nowPicture = this.formItem.photoUrl
                    this.$Notice.success({
                      title: '成功',
                      desc: '修改成功',
                      duration: 1
                    })
                    this.getPersonList({
                      page: this.pageCur,
                      limit: this.pageLimit
                    }).catch(() => {
                      this.$Notice.warning({
                        title: '警告',
                        desc: '人员参数获取失败',
                        duration: 1
                      })
                    })
                    this.$refs[name].resetFields()
                  })
                  .catch(err => {
                    this.sure = '确定'
                    this.sureLoading = false
                    this.$Notice.warning({
                      title: '警告',
                      desc: '修改数据失败' + err.response.data.message,
                      duration: 1
                    })
                  })
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
          let fm = new window.FormData()
          fm.append('file', this.imgFileBase)
          post({
            url: '/upload?type=fs',
            body: fm
          })
            .then(res => {
              this.$refs[name].validate(valid => {
                if (valid) {
                  this.formItem.photoUrl = '/api/upload?type=fs&id=' + res.data.id
                  if (!this.isModify) {
                    this.sure = '添加中'
                    this.sureLoading = true

                    this.addPersonList(this.formItem)
                      .then(() => {
                        this.sure = '确定'
                        this.sureLoading = false
                        this.addModal = false
                        this.$Notice.success({
                          title: '成功',
                          desc: '添加成功',
                          duration: 1
                        })
                        this.getPersonList({
                          page: this.pageCur,
                          limit: this.pageLimit
                        }).catch(() => {
                          this.$Notice.warning({
                            title: '警告',
                            desc: '人员参数获取失败',
                            duration: 1
                          })
                        })
                        this.$refs[name].resetFields()
                      })
                      .catch(err => {
                        this.sure = '确定'
                        this.sureLoading = false
                        this.$Notice.warning({
                          title: '添加失败',
                          desc: err.response.data.message,
                          duration: 1
                        })
                      })
                  } else {
                    this.sure = '修改中'
                    this.sureLoading = true
                    this.modifyPersonList(this.formItem)
                      .then(() => {
                        this.sure = '确定'
                        this.sureLoading = false
                        this.addModal = false
                        this.$Notice.success({
                          title: '成功',
                          desc: '修改成功',
                          duration: 1
                        })
                        this.nowPicture = this.formItem.photoUrl
                        this.getPersonList({
                          page: this.pageCur,
                          limit: this.pageLimit
                        }).catch(() => {
                          this.$Notice.warning({
                            title: '警告',
                            desc: '人员参数获取失败',
                            duration: 1
                          })
                        })
                        this.$refs[name].resetFields()
                      })
                      .catch(err => {
                        this.sure = '确定'
                        this.sureLoading = false
                        this.$Notice.warning({
                          title: '警告',
                          desc: '修改数据失败' + err.response.data.message,
                          duration: 1
                        })
                      })
                  }
                } else {
                  this.$Notice.warning({
                    title: '提示',
                    desc: '请填写正确的相关信息',
                    duration: 1
                  })
                }
              })
            })
            .catch(err => {
              console.log('图片上传失败 error' + err)
              this.$Notice.warning({
                title: '警告',
                desc: '图片上传失败',
                duration: 1
              })
            })
        }
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
    // 初始化表单
    initFormItem() {
      for (let key in this.formItem) {
        this.formItem[key] = ''
      }
      this.formItem.type = '3'
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
      const payload = '&username=' + this.searchData.name + '&type=' + this.searchData.type
      this.getSearchPersonList({
        page: this.pageCur,
        limit: this.pageLimit,
        payload: payload
      })
        .then(() => {
          if (this.personList[0]) {
            this.nowPicture = this.personList[0].picture
            this.showTaskInfo = true
          } else {
            this.nowPicture = ''
            this.showTaskInfo = false
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
    resizefun() {
      this.tableHeight = this.$refs['manage-list-content'].offsetHeight - 96
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
.manage-list-content {
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
}
/deep/ .ivu-table-wrapper tr th:first-child .ivu-table-cell {
  padding-left: 24px !important;
}
/deep/ .ivu-table-wrapper tr td:first-child .ivu-table-cell {
  padding-left: 24px !important;
}
.manage-list-content .operate-button {
  flex: 0 0 32px;
  padding: 12px 24px;
}
.manage-list-content .operate-button button {
  margin-right: 8px;
  height: 32px;
  line-height: 18px;
}
.manage-list-content .operate-button .ivu-btn {
  padding: 8px 16px !important;
}
.modal-top-person-picture {
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
  .select-picture:hover {
    border: 1px dashed #00a5e3;
  }
}

.modal-middle-person-content {
  float: left;
  width: 60%;
}
</style>
