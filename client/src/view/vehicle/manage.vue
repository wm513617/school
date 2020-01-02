<template src="./Manage.html"></template>

<script>
import BScarMenu from '../../components/BScarMenu'
import { mapState, mapGetters, mapActions } from 'vuex'
import VInput from 'components/common/VInput'
export default {
  components: {
    BScarMenu,
    VInput
  },
  data() {
    const validatePlateNumber = (rule, value, callback) => {
      let re = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/
      if (!re.test(value)) {
        return callback(new Error('车牌格式不正确'))
      } else {
        let query = {
          licence: value,
          id: this.carInfo._id
        }
        this.licenceNumberManage(query)
          .then(res => {
            if (res) {
              return callback(new Error('车牌号码已存在'))
            } else {
              return callback()
            }
          })
          .catch(err => {
            console.log('licenceNumberManage error' + err)
          })
      }
    }
    const validateName = (rule, value, callback) => {
      if (value) {
        // Unicode编码
        let strlen = 0
        for (let i = 0; i < value.length; i++) {
          if (value.charCodeAt(i) > 255) {
            // 如果是汉字，则字符串长度加2
            strlen += 2
          } else {
            strlen++
          }
        }
        if (strlen > 8) {
          return callback(new Error('名称不能多于8个字符'))
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    }
    const validateTelephone = (rule, value, callback) => {
      let reg = /^1[34578]\d{9}$/
      if (!value || reg.test(value)) {
        callback()
      } else {
        return callback(new Error('请输入正确的电话号码'))
      }
    }
    const validateIdNumber = (rule, value, callback) => {
      if (value) {
        if (this.$bsValidate.IdentityCodeValid(value)) {
          callback(new Error(this.$bsValidate.IdentityCodeValid(value)))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      headerObj: { Authorization: '' },
      imgUrl: '/static/car/carImg1.png',
      uploadImg: '',
      tableHeight: 606,
      NoticeData: null,
      iconType: '',
      searchText: '',
      searchBrand: [],
      searchColor: '',
      searchType: '',
      handleType: 'add',
      modal: false,
      carInfo: {},
      showItem: '1',
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '车牌号码',
          key: 'licence'
        },
        {
          title: '颜色',
          key: 'color',
          render: (h, param) => {
            let color = Number(param.row.color)
            let x
            for (let item of this.carColor) {
              if (color === item.value) {
                x = item.label
              }
            }
            return h('span', {}, x)
          }
        },
        {
          title: '品牌',
          key: 'brand'
        },
        {
          title: '型号',
          key: 'model'
        },
        {
          title: '类型',
          key: 'type',
          render: (h, param) => {
            let type = Number(param.row.type)
            let x
            for (let item of this.carType) {
              if (type === item.value) {
                x = item.label
              }
            }
            return h('span', {}, x)
          }
        },
        {
          title: '车主姓名',
          key: 'owner'
        },
        {
          title: '车主电话',
          key: 'tel'
        },
        {
          title: '证件号',
          key: 'cardID'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          render: (h, params) => {
            if (this.$BShasPower('BS-VEHICLE-MANAGE')) {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      size: 'small',
                      type: 'ghost'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.edit(params)
                      }
                    }
                  },
                  '修改'
                ),
                h(
                  'Button',
                  {
                    props: {
                      size: 'small',
                      type: 'ghost'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.deleteCar(params)
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
      ruleValidate: {
        licence: [{ required: true, validator: validatePlateNumber, trigger: 'blur' }],
        owner: [{ validator: validateName, trigger: 'change' }],
        tel: [{ validator: validateTelephone, trigger: 'change' }],
        cardID: [{ message: '请填写身份证号', trigger: 'blur' }, { validator: validateIdNumber, trigger: 'blur' }]
      },
      loadingOk: false,
      loadingCancel: false,
      carChecked: [],
      isEnable: false,
      // 权限
      exeControlVehicle: true,
      blacklistVehicle: true,
      whitelistVehicle: true,
      carList: [],
      pageInfo: {
        cur: 1,
        count: 0,
        limit: this.$PageInfo.limit
      }
    }
  },
  computed: {
    ...mapGetters(['carType', 'carColor', 'carBrand', 'vehicleRecognizerole', 'accessToken']),
    ...mapState({
      carBase({ vehicle }) {
        return vehicle.carBase
      }
    })
  },
  watch: {
    carChecked: {
      handler: function(data) {
        if (data.length > 0) {
          this.isEnable = true
        } else {
          this.isEnable = false
        }
      },
      deep: true
    }
  },
  created() {
    this.headerObj.Authorization = `Bearer ${this.accessToken}`
    this.getCarList()
    this.getBrand()
    this.getCarType()
    this.getCarColor()
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 40
  },
  methods: {
    ...mapActions([
      'getVehicle',
      'deleteVehicle',
      'editVehicle',
      'addVehicle',
      'batMoveVehicle',
      'batEditVehicle',
      'getBrand',
      'getCarType',
      'getCarColor',
      'getModel',
      'licenceNumberManage'
    ]),
    carSelect(value, row) {
      this.carChecked = value
    },
    imgRemove(file, fileList) {
      fileList.shift()
      this.imgUrl = ''
    },
    uploadProgress(event, file, fileList) {
      if (fileList.length > 1) {
        fileList.shift()
      }
    },
    uploadImgError(error, file, fileList) {
      this.$Notice.error({
        title: '上传失败',
        desc: file.message === 'ETIMEDOUT' ? '连接超时' : file.message
      })
    },
    exceededSize(file) {
      this.$Notice.warning({
        title: '图片大小超过限制',
        desc: '图片 ' + file.name + ' 大小超过限制，请上传小于500kb的图片。'
      })
    },
    formatError(file) {
      this.$Notice.warning({
        title: '图片格式不正确',
        desc: '图片 ' + file.name + ' 格式不正确，请上传 jpg, png, bmp 或 jpeg 格式的图片。'
      })
    },
    uploadSuccess(res, file) {
      this.uploadImg = res.imgObj.id
      Object.assign(this.carInfo, res.recObj)
    },
    ok(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.loadingOk = true
          switch (this.handleType) {
            case 'add':
              this.carInfo.list = this.showItem
              if (this.uploadImg) {
                this.carInfo.image = this.uploadImg
              }
              this.addVehicle(this.carInfo)
                .then(() => {
                  this.loadingOk = false
                  this.modal = false
                  this.$refs['carInfo'].resetFields()
                  this.getCarList()
                })
                .catch(err => {
                  this.loadingOk = false.catch(console.log('logout error: ' + err))
                })
              break
            case 'edit':
              if (this.uploadImg) {
                this.carInfo.image = this.uploadImg
              }
              this.editVehicle(this.carInfo)
                .then(() => {
                  this.getCarList()
                  this.loadingOk = false
                  this.modal = false
                  this.$refs['carInfo'].resetFields()
                })
                .catch(err => {
                  this.loadingOk = false
                  console.log('logout error: ' + err)
                })
              break
          }
        }
      })
    },
    cancel() {
      this.modal = false
      this.$refs['carInfo'].resetFields()
      this.carInfo = {}
    },
    deleteCar(parmas) {
      let self = this
      this.$Modal.confirm({
        title: '提示',
        content: '确认删除吗？',
        cancelText: '取消',
        onOk: function() {
          const data = {
            id: parmas.row._id
          }
          self
            .deleteVehicle(data)
            .then(() => {
              self.getCarList()
              self.isEnable = false
            })
            .catch(err => console.log('logout error: ' + err))
        }
      })
    },
    add() {
      this.carInfo = {}
      this.uploadImg = ''
      this.handleType = 'add'
      this.modal = true
    },
    edit(params) {
      this.carInfo = JSON.parse(JSON.stringify(params.row))
      this.uploadImg = this.carInfo.image
      this.handleType = 'edit'
      this.modal = true
    },
    itemShow(name) {
      this.showItem = name
      this.isEnable = false
      this.pageInfo.limit = this.$PageInfo.limit
      this.getCarList()
    },
    getCarList() {
      const param = {
        list: this.showItem,
        page: this.pageInfo.cur,
        limit: this.pageInfo.limit,
        licence: this.searchText,
        color: this.searchColor,
        type: this.searchType,
        brand: encodeURI(this.searchBrand.join(','))
      }
      this.getVehicle(param)
        .then(res => {
          this.carChecked = []
          this.carList = res.data
          this.pageInfo.pages = Number(res.headers['x-bsc-pages'])
          this.pageInfo.cur = Number(res.headers['x-bsc-cur'])
          this.pageInfo.count = Number(res.headers['x-bsc-count'])
          this.pageInfo.limit = Number(res.headers['x-bsc-limit'])
        })
        .catch(err => {
          this.errorMsg(err.response.data.message)
        })
    },
    changePage(n) {
      this.pageInfo.cur = n
      this.getCarList()
    },
    pageSizeChange(n) {
      this.pageInfo.limit = n
      this.pageInfo.cur = 1
      this.getCarList()
    },
    dblclickRow(data) {
      this.carInfo = data
      this.uploadImg = this.carInfo.image
      this.handleType = 'edit'
      this.modal = true
    },
    deleteCars() {
      if (this.carChecked.length) {
        let self = this
        this.$Modal.confirm({
          title: '提示',
          content: '确认删除吗？',
          onOk: function() {
            let idList = []
            self.carChecked.forEach(item => {
              idList.push(item._id)
            })
            const data = {
              ids: idList
            }
            self
              .batMoveVehicle(data)
              .then(res => {
                self.getCarList()
                self.isEnable = false
              })
              .catch(err => {
                console.log(err)
              })
          }
        })
      }
    },
    changeMamageType(list) {
      if (this.showItem === list) {
        return null
      } else {
        if (this.carChecked.length) {
          let data = {
            ids: [],
            list: list
          }
          this.carChecked.forEach(item => {
            data.ids.push(item._id)
          })
          this.batEditVehicle(data)
            .then(res => {
              this.getCarList()
              this.isEnable = false
            })
            .catch(err => console.log('logout error: ' + err))
        }
      }
    },
    getStartTime(val) {
      this.carInfo.startTime = val
    },
    cleanSearch() {
      this.searchText = ''
      this.searchColor = ''
      this.searchBrand = []
      this.searchType = ''
      this.getCarList()
    },
    searchCar() {
      let re = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/
      if (this.searchText.length && this.searchText.search(re) === -1) {
        this.$Notice.error({ title: '请输入正确的车牌号' })
      } else {
        this.getCarList()
      }
    },
    brandSelect(item) {
      this.getModel(item)
    }
  }
}
</script>
<style lang="less" scoped>
.vehicleCarCount {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.bs-main {
  flex-direction: column;
}

.car-handle {
  display: flex;
  flex: 0 0 32px;
  margin: 12px 24px;
  align-items: center;
  justify-content: space-between;
  .car-handle-left {
    display: flex;
    button {
      margin-right: 8px;
      height: 32px;
    }
  }
}

.search-box {
  display: flex;
  line-height: 32px;
  .search-input {
    width: 150px;
    margin: 0 10px;
  }
}

.search-box button {
  margin-right: 5px;
}

.search-box .ivu-dropdown {
  margin-right: 20px;
}

.ivu-menu-item-active {
  background: #ececec;
}

.modal-left {
  flex: 0 0 50%;
}

.modal-right {
  flex: 1;
  justify-content: center;
}

.time-rang {
  display: flex;
}

.time-rang span {
  text-align: center;
  width: 50px;
}

.search-box {
  display: inline-block;
}
</style>
