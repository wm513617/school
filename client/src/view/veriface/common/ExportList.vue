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
      default: 'alarm' // 可选值 alarm passby image
    },
    downInfo: {
      type: String
    }
  },
  data() {
    return {
      statusArr: ['正在导出', '导出成功', '导出失败'],
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
            return h('div', {}, this.statusArr[params.row.status])
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
                    if (params.row.status === 3) {
                      this.creatExport()
                    } else {
                      this.downLoadItem(params.index)
                    }
                  }
                }
              }, params.row.status !== 3 ? '下载' : '开始'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
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
      exportList: [],
      downList: [],
      modalShow: false
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
        this.initList = [{
          status: 3,
          _id: '',
          createdAt: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        }]
        this.getExportData()
      } else {
        clearInterval(timer)
        timer = null
      }
    }
  },
  methods: {
    ...mapActions(['getAlarmExportList', 'deleteAlarmExport', 'addAlarmExport']),
    deleteItem(index) {
      this.deleteAlarmExport({type: this.downType, id: this.exportList[index]._id}).then(() => {
        this.exportList.splice(index, 1)
      }).catch((err) => {
        console.log('删除失败', err)
        this.errorMsg('删除失败！')
      })
    },
    downLoadItem(index) {
      window.open(window.location.origin + `/api/veriface/statistic/excel/download/${this.downType}/${this.exportList[index].filename}.xlsx`)
    },
    getExportData() {
      this.getAlarmExportList(this.downType).then((res) => {
        this.exportList = this.$lodash.concat(this.initList, res.data)
        this.downList = this.exportList.filter(item => { return item.status === 0 })
      }).catch((err) => {
        console.log('获取导出列表', err)
      })
    },
    cancel() {
      this.$emit('cancel')
    },
    creatExport() {
      this.addAlarmExport(this.downInfo).then(() => {
        this.$emit('startExport')
        this.initList = []
        this.getExportData()
        if (!timer) {
          timer = setInterval(() => {
            this.getExportData()
          }, 2000)
        } else {
          clearInterval(timer)
          timer = null
        }
      }).catch(() => {
        this.errorMsg('开始导出失败！')
      })
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
