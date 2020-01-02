<template src="./Pass.html">
</template>

<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import CarDetail from '../common/carDetail.vue'

export default {
  components: {
    CarDetail
  },
  data() {
    const validatePlateNumber = (rule, value, callback) => {
      let re = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/
      if (value.search(re) === -1) {
        return callback(new Error('车牌格式不正确'))
      } else {
        callback()
      }
    }
    return {
      dateLimit: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      tableHeight: 435,
      imgUrl: '/static/car/carImg1.png',
      uploadImg: '',
      carDetail: null,
      searchText: '',
      modal: false,
      detailModal: false,
      endTime: moment().format('YYYY-MM-DD'),
      startTime: moment().format('YYYY-MM-DD'),
      searchStartTime: moment().format('YYYY-MM-DD'),
      searchEndTime: moment().format('YYYY-MM-DD'),
      showItem: '过车查询',
      devList: [
        {
          expand: true,
          title: '机构1',
          checked: true,
          _id: 1,
          children: [
            {
              title: '子机构 1-0',
              expand: true,
              _id: 2,
              children: [
                {
                  title: 'leaf',
                  _id: 3
                },
                {
                  title: 'leaf',
                  _id: 4
                }
              ]
            },
            {
              title: 'parent 1-1',
              expand: true,
              _id: 5,
              children: [
                {
                  title: '<span style="color: red">leaf</span>',
                  _id: 6,
                  children: [
                    {
                      title: '孙子吉',
                      _id: 8
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
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
          key: 'colorName'
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
          key: 'typeName'
        },
        {
          title: '过车时间',
          key: 'createTime',
          render: (h, param) => {
            let date = param.row.createTime
            let text = date ? moment.unix(Number(date)).format('YYYY-MM-DD HH:mm:ss') : ''
            return h('span', {}, text)
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    size: 'small',
                    type: 'ghost'
                  },
                  on: {
                    click: () => {
                      this.showCarDetail(params)
                    }
                  }
                },
                '详情'
              )
            ])
          }
        }
      ],
      carInfo: {
        licence: '',
        color: 1,
        type: 4,
        brand: '',
        model: '',
        owner: '',
        tel: '',
        startTime: '',
        endTime: ''
      },
      ruleValidate: {
        licence: [{ required: true, validator: validatePlateNumber, trigger: 'blur' }],
        model: [{ required: true, type: 'number', trigger: 'blur' }]
      },
      loadingOk: false,
      loadingCancel: false,
      selectScope: [],
      selectScopeString: '',
      carChecked: [],
      isEnable: false,
      // 检索范围参数
      options: {
        showCheckbox: true,
        showInput: true
      },
      treeData: [],
      carList: [],
      pageInfo: {
        cur: 1,
        count: 0,
        limit: this.$PageInfo.limit
      }
    }
  },
  computed: {
    ...mapState({
      carBase({ vehicle }) {
        return vehicle.carBase
      },
      videoOrg({ vehicle }) {
        return vehicle.videoOrg
      },
      curPassCar({ vehicle }) {
        return vehicle.curPassCarInfo
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
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 40
  },
  created() {
    this.getCarList()
    // 布控范围机构树
    this.getVideoOrg()
      .then(() => {
        this.treeData = this.$lodash.cloneDeep(this.videoOrg)
      })
      .catch(err => {
        console.log('getVideoOrg error' + err)
      })
  },
  methods: {
    rowClassName(row, index) {
      if (this.curPassCar && row._id === this.curPassCar._id) {
        return 'ivu-table-row-highlight'
      }
    },
    ...mapActions([
      'getVehicle',
      'deleteVehicle',
      'editVehicle',
      'queryPassCar',
      'movePassCar',
      'searchAnalyzeInfo',
      'getVideoOrg'
    ]),
    modalShow() {
      this.modal = true
    },
    carSelect(value, row) {
      this.carChecked = value
    },
    uploadProgress(event, file, fileList) {
      if (fileList.length > 1) {
        fileList.shift()
      }
    },
    imgRemove(file, fileList) {
      fileList.shift()
      this.imgUrl = ''
    },
    uploadSuccess(res, file) {
      this.uploadImg = res.id
    },
    changeMamageType(name) {
      console.log(name)
      if (this.carChecked.length) {
        let param = {
          ids: [],
          type: name
        }
        let errVehicle = []
        this.carChecked.map(item => {
          if (this.$bsValidate.isVehicleNumber(item.licence)) {
            param.ids.push(item._id)
          } else {
            errVehicle.push(item.licence)
          }
        })
        this.movePassCar(param)
          .then(() => {
            if (errVehicle.length > 0) {
              this.$Notice.warning({
                desc: '有' + errVehicle.length + '条数据的车牌号验证失败,并且移动失败',
                title: '提示'
              })
            } else {
              this.$Notice.success({ desc: '移动成功！', title: '提示' })
            }
            this.getCarList()
          })
          .catch(err => {
            console.log('logout error:' + err)
            this.$Notice.warning({ desc: '移动失败', title: '提示' })
          })
      }
    },
    cancel() {
      this.modal = false
    },
    rowClick(data) {},
    getCarList() {
      let videoChannels = this.$refs.analyzeVTree ? this.$refs.analyzeVTree.getSelectedDeepChannelid() : []
      let data = {
        licence: this.searchText,
        startTime: moment(this.startTime).format('X'),
        endTime: moment(this.endTime).format('X'),
        page: this.pageInfo.curPage,
        limit: this.pageInfo.limit
      }
      this.queryPassCar({ data: data, videoChannels: videoChannels })
        .then(res => {
          this.carList = res.data
          this.pageInfo.count = Number(res.headers['x-bsc-count'])
          this.pageInfo.cur = Number(res.headers['x-bsc-cur'])
        })
        .catch(err => this.errorMsg(err.response.data.message))
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
    changeStartTime(date) {
      this.startTime = date
    },
    changeEndTime(date) {
      this.endTime = date
    },
    getStartTime(val) {
      this.carInfo.startTime = val
    },
    getEndTime(val) {
      this.carInfo.endTime = val
    },
    showCarDetail(data) {
      let carData = data.row
      let infoData = {
        licence: carData.licence,
        id: carData._id,
        startTime: moment(this.startTime).format('X'),
        endTime: moment(this.endTime).format('X')
      }
      this.$Loading.start()
      this.searchAnalyzeInfo(infoData)
        .then(res => {
          this.carDetail = res.data
          this.detailModal = true
        })
        .catch(err => {
          this.$Loading.error()
          this.$Notice.warning({
            title: err
          })
        })
    },
    scopeSelect(data) {
      console.log(data)
      this.selectScope = []
      data.forEach(item => {
        if (!item.children) {
          this.selectScope.push(item.title)
        }
      })
      this.selectScopeString = this.selectScope.join(',')
      console.log(this.selectScope)
    },
    searchCar() {
      let re = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/
      if (this.searchText.length && this.searchText.search(re) === -1) {
        this.$Notice.error({ title: '请输入正确的车牌号' })
      } else {
        if (new Date(this.endTime) - new Date(this.startTime) < 0) {
          this.$Notice.warning({ title: '开始日期不能大于结束日期' })
        } else {
          this.getCarList()
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
#carCount {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.bs-main {
  flex-direction: column;
}

.car-handle {
  display: flex;
  flex: 0 0 50px;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.search-box {
  display: flex;
  align-items: center;
  .ivu-input-group {
    top: 0px;
  }
}

.search-box > button {
  margin-left: 10px;
}

.date-box {
  display: flex;
  padding: 0 10px;
  align-items: center;
  span {
    padding: 0 5px;
  }
}

.ivu-menu-item-active {
  background: #ececec;
}

.modal-footer {
  display: flex;
  justify-content: center;
}

.modal-footer button {
  width: 100px;
}

.modal-left {
  flex: 0 0 350px;
}

.modal-right {
  flex: 1;
  justify-content: center;
}

.ivu-icon-search {
  font-size: 30px;
  color: deepskyblue;
  cursor: pointer;
}

.time-rang {
  display: flex;
}

.time-rang span {
  width: 50px;
  text-align: center;
}
</style>
