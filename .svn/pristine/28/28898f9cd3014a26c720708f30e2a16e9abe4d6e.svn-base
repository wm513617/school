<template>
  <div class="car-list">
    <div class="table-box">
      <Table size="small" :columns="videoTitle" :data="videoData" :height="tableHeight" @on-selection-change="changeChecked"></Table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoEquipment',
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
          width: 80,
          align: 'left'
        },
        {
          title: '序号',
          width: 80,
          type: 'index'
        },
        {
          title: '设备名称',
          minWidth: 160,
          ellipsis: true,
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
          title: '所属机构',
          minWidth: 160,
          ellipsis: true,
          render: (h, params) => {
            if (params.row.oid) {
              return h('div', {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.oid.name
                }
              },
              params.row.oid.name)
            }
          }
        },
        {
          title: 'IP地址',
          minWidth: 140,
          ellipsis: true,
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
          key: 'status',
          align: 'center',
          minWidth: 100,
          ellipsis: true,
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
          align: 'center',
          ellipsis: true,
          render: (h, params) => {
            return h('div', params.row.onlineRate)
          },
          minWidth: 80
        },
        {
          title: '厂商',
          minWidth: 120,
          ellipsis: true,
          render: (h, params) => {
            let text = ''
            switch (params.row.manufacturer) {
              case 'dahua':
                text = '大华'
                break
              case 'bstar':
                text = '蓝色星际'
                break
              case 'hikvision':
                text = '海康'
                break
              case 'onvif':
                text = 'onvif'
                break
              case 'custom':
                text = '自定义'
                break
              case 'juanxin':
                text = '巨安信'
                break
              default:
                text = params.row.manufacturer
            }
            return h('span', text)
          }
        },
        {
          title: '设备类型',
          minWidth: 120,
          ellipsis: true,
          render: (h, params) => {
            let text = ''
            let t = params.row.type
            if (t === 'ipc') {
              text = 'IPC'
              return h('span', text)
            } else if (t === 'nvr') {
              text = 'NVR'
              return h('span', text)
            } else {
              return h('span', t)
            }
          }
        },
        {
          title: '离线时长',
          minWidth: 140,
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
                  iconfont: true,
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
  computed: {},
  created() {},
  methods: {
    changeChecked(val) {
      this.$emit('changeChecked', val)
    }
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
}
</style>
