<template>
  <div class="car-list">
    <div class="table-box">
      <Table size="small" :columns="videoTitle" :data="videoData" :height="tableHeight"></Table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Servers',
  props: {
    videoData: {
      type: Array
    },
    onlineColor: {
      type: String,
      default: '#4699f9'
    },
    offlineColor: {
      type: String,
      default: '#ddd'
    },
    basicColor: {
      type: String,
      default: '#0f2343'
    },
    tableHeight: {
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      videoTitle: [
        {
          type: 'selection',
          align: 'left',
          width: 80
        },
        {
          title: '序号',
          type: 'index',
          width: 80
        },
        {
          title: '服务器名称',
          ellipsis: true,
          minWidth: 160,
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.name
                }
              },
              params.row.name
            )
          }
        },
        {
          title: '设备IP',
          ellipsis: true,
          width: 120,
          render: (h, params) => {
            let text = ''
            if (params.row.ip === '') {
              text = '...'
            } else {
              text = params.row.ip
            }
            return h('span', text)
          }
        },
        {
          title: '在线状态',
          ellipsis: true,
          key: 'state',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', {
              style: {
                borderRadius: '50%',
                width: '15px',
                height: '15px',
                backgroundColor: params.row.status ? this.onlineColor : this.offlineColor,
                margin: '0 auto'
              }
            })
          }
        },
        {
          title: '在线率',
          ellipsis: true,
          align: 'center',
          render: (h, params) => {
            let str = ''
            if (params.row.onlineRate === '-') {
              str = params.row.onlineRate
            } else {
              str = params.row.onlineRate * 100 + '%'
            }
            return h('div', str)
          },
          width: 80
        },
        {
          title: 'CPU使用率',
          width: 120,
          render: (h, params) => {
            return h('Progress', {
              props: {
                percent: 25
              }
            })
          }
        },
        {
          title: '内存使用率',
          width: 120,
          render: (h, params) => {
            return h('Progress', {
              props: {
                percent: 25
              }
            })
          }
        },
        {
          title: '网络接收',
          width: 120,
          render: (h, params) => {
            return h('Progress', {
              props: {
                percent: 25
              }
            })
          }
        },
        {
          title: '网络发送',
          width: 120,
          render: (h, params) => {
            return h('Progress', {
              props: {
                percent: 25
              }
            })
          }
        },
        {
          title: '离线时长',
          width: 140,
          ellipsis: true,
          render: (h, params) => {
            let str = ''
            if (params.row.OffLine === '-') {
              str = params.row.OffLine
            } else {
              const time = parseInt(params.row.OffLine)
              const hour = parseInt(time / 3600) % 24
              // const day = parseInt(time / 3600 / 24)
              const minute = parseInt((time - hour * 3600) / 60)
              // const second = time - hour * 3600 - minute * 60
              str = hour + '小时' + minute + '分'
              // str = day + '天' + hour + '小时'
            }
            return h('span', str)
          }
        },
        {
          title: '详情',
          width: 80,
          render: (h, params) => {
            return h('div', [
              h('span', {
                class: {
                  'iconfont': true,
                  'icon-details': true
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.$emit('openModal', params.row)
                  }
                }
              })
            ])
          }
        }
      ],
      modalShow: false
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
  }
}
</script>

<style scoped>
.lf {
  float: left;
}

.rt {
  float: right;
}
.tab-content-alarm {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1c3053;
  height: 100%;
}
.feature-btn {
  margin-left: 24px;
  height: 32px;
  line-height: 32px;
}
.btn-style {
  margin-right: 8px;
}
.interval {
  margin-right: 8px;
  position: absolute;
}
</style>
