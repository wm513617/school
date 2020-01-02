<template>
  <div>
    <Modal v-model="modalShow" title="导出" width="500" :mask-closable="false" @on-cancel="cancel">
      <Table :columns="columns" :data="exportList" :height="exportList.length > 10 ? '520': ''"></Table>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import _ from 'lodash'
let timer
export default {
  name: 'exportList',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    downType: {
      type: String,
      default: 'strucImage' // 可选值 strucAlarm(报警检索) strucIntegrate(综合查询) strucImage(以图搜图)
    },
    downInfo: {
      type: Object // 创建导出任务时的下发参数
    }
  },
  data() {
    return {
      statusArr: ['正在导出', '导出成功', '导出失败'], // 分别对应 status为 0 1 2
      columns: [
        {
          title: '时间',
          align: 'center',
          key: 'createdAt'
        },
        {
          title: '状态',
          align: 'center',
          key: 'status',
          render: (h, params) => {
            return h('div', {}, this.statusArr[params.row.status] || '')
          }
        },
        {
          title: '操作',
          align: 'center',
          ellipsis: true,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  disabled: params.row.status !== 1 && params.row.status !== 3
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    if (params.row.status === 3) { // params.row.status 为3时，为当前未创建任务的虚拟任务，需要点击开始按钮创建导出任务
                      this.creatExport()
                    } else {
                      this.downLoadItem(params.index) // 下载已导出的文件
                    }
                  }
                }
              }, params.row.status !== 3 ? '下载' : '开始'), // params.row.status===3时为开始，其余均为下载
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  disabled: params.row.status === 3 // 虚拟任务时，删除按钮不可点击
                },
                on: {
                  click: () => {
                    this.deleteItem(params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      exportList: [], // 导出列表
      downList: [], // 正在导出的任务列表
      modalShow: false, // 是否显示modal
      initList: [], // 初始化的虚拟任务
      initData: { // 虚拟化的虚拟任务数据
        createdAt: '',
        status: 3,
        _id: ''
      }
    }
  },
  computed: {},
  watch: {
    downList(val) {
      if (!val.length) {
        clearInterval(timer)
        timer = null
      }
    },
    isShow(val) {
      this.modalShow = val
      if (val) {
        this.initList = []
        this.initData.createdAt = this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss') // 初始化时，设置创建时间为进页面的时间
        this.initList.push(this.initData) // 添加初始化虚拟任务
        this.queryExportList()
      } else {
        if (timer) {
          clearInterval(timer)
          timer = null
        }
      }
    }
  },
  methods: {
    ...mapActions('videoStructuredImageSearch', ['getExportTaskList', 'removeExportTask', 'creatExportTask']),
    queryExportList() { // 初始化查询导出列表
      this.getExportData()
      if (!timer) {
        timer = setInterval(() => {
          this.getExportData()
        }, 2000)
      } else {
        clearInterval(timer)
        timer = null
      }
    },
    deleteItem(index) { // 删除任务
      this.removeExportTask({type: this.downType, id: this.exportList[index]._id}).then(() => {
        this.exportList.splice(index, 1)
      }).catch((err) => {
        console.log('删除失败', err)
        this.errorMsg('删除失败！')
      })
    },
    downLoadItem(index) { // 下载任务
      window.open(window.location.origin + `/api/structure/identify/downloadExcel?type=${this.downType}&filename=${this.exportList[index].filename}`)
    },
    getExportData() { // 获取导出列表
      this.getExportTaskList(this.downType).then((res) => {
        // 过滤'正在导出'的所有项
        this.downList = res.data.filter(item => { return item.status === 0 })
        // 手动拼接虚拟任务及所有任务列表
        this.exportList = _.concat(this.initList, res.data)
        console.log(this.downList, 'downList')
      }).catch((err) => {
        console.log('获取导出列表', err)
      })
    },
    creatExport() { // 创建导出任务
      const searchData = {
        param: this.downInfo,
        type: this.downType
      }
      this.creatExportTask(searchData)
        .then(() => {
          // 导出任务创建成功之后判断是否存在定时器，若存在，则清除    在查询导出列表时会重新添加
          if (timer) {
            clearInterval(timer)
            timer = null
          }
          this.initList = []
          this.queryExportList()
        })
        .catch(() => {
          this.errorMsg('导出失败！')
        })
    },
    cancel() {
      this.$emit('cancel')
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {
    timer && clearInterval(timer)
  }
}
</script>
<style scoped>

</style>
