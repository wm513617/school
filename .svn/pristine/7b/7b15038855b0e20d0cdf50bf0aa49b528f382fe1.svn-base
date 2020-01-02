<template>
  <div class="store-box" ref="tableBox">
    <div class="manage-head">
      <label>存储服务器</label>
      <Select :disabled="!isDisable" class="select-style" @click.native="waringChange" filterable v-model="resetData.storeServer" style="width:390px" placeholder="请选择">
        <Option v-for="item in serverStoreList" :value="item.server" :style="{'color': item.flagIndex ? 'cyan' : 'red'}" :disabled="!item.flagIndex" @click.native="serverChange(item.server)" :key="item.server">{{ item._id }}</Option>
      </Select>
      <label>存储路径</label>
      <Select :disabled="!isDisable" class="select-style" @click.native="waringChange" filterable v-model="resetData.storePath" style="width:200px" placeholder="请选择">
        <Option v-for="item in getStorePath" :value="item.path" @click.native="pathChangeAll(item.path)" :key="item._id">{{ item.path }}</Option>
      </Select>
      <Button type="ghost" @click="OneKeyConfig" :disabled="!(resetData.storeServer&&resetData.storePath)">配置全部</Button>
      <Checkbox style="margin:6px 10px" v-model="resetData.sonFlag">显示子区域</Checkbox>
      <div class="query-style">
        <Input @on-enter="storeSearch" v-model="resetData.fillvalue" placeholder="按名称或IP地址查询" style="width: 250px;marginRight: 10px">
        <Button slot="append" type="ghost" @click="storeSearch">搜索</Button>
        </Input>
      </div>
    </div>
    <div class="table-box">
      <Table ref='table' size="small" :height="tableHeight" :highlight-row="true" @on-selection-change="select" :columns="columns4" :data="storeList"></Table>
      <div class="table-footer">
        <Page show-total show-elevator show-sizer class="page-style top-margin" @on-change="pageChange" :total='totalPage' :current='currentPage' :page-size='pageSize' :page-size-opts="$PageInfo.size" @on-page-size-change="sizeChange"></Page>
      </div>
      <div>
        <Button type="primary" :disabled="!isDisable" :loading="loading" class="top-margin-botton" @click="saveStore" style="width: 100px">保存</Button>
        <Button type="primary" :disabled="!isDisable" :loading="loading" class="top-margin-botton" @click="exportCsv" style="width: 100px">导出</Button>
      </div>
    </div>
  </div>
</template>
<script>
import { addChecked, Compare } from './video.js'
import { mapGetters, mapActions, mapState } from 'vuex'
import '../style/manage.css'
export default {
  props: {
    resetData: {
      type: Object
    }
  },
  data() {
    return {
      isDisable: true,
      serverStoreList: [],
      loading: false,
      pageSize: this.$PageInfo.limit,
      currentPage: 1,
      totalPage: 0,
      changeLIst: [],
      storeList: [],
      middleObject: {}, // 获取树的数据
      stateTree: [],
      tableHeight: 433,
      oldList: [],
      // 处理后table的数据
      key: 0,
      columns4: [
        {
          type: 'selection',
          width: 70
        },
        {
          title: '监控点名称',
          key: 'name',
          align: 'left',
          width: 300
        },
        {
          title: 'IP地址',
          key: 'ip',
          width: 250,
          align: 'left'
        },
        {
          title: '状态',
          align: 'left',
          key: 'status',
          width: 200,
          render: (h, params) => {
            var color = params.row.status === 1 ? '#19be6b' : '#ed3f14'
            // if (Object.getOwnPropertyNames(params.row).length !== 4) {
            var status = params.row.status === 1 ? ' 在线' : ' 离线'
            return h('div', { style: { color: color, marginLeft: '5px' } }, status)
            // }
          }
        },
        {
          title: '存储服务器',
          align: 'left',
          render: (h, params) => {
            // if (Object.getOwnPropertyNames(params.row).length !== 4) {
            const indexParams = params.index
            var that = this
            let server = ''
            if (params.row.conf.server) {
              server = params.row.conf.server.split(':')[1]
            }
            var serverSelect = params.row.conf ? server : ''
            let flagIndex = false
            if (params.row.conf.server && params.row.conf) {
              for (let i = 0; i < this.serverStoreList.length; i++) {
                if (params.row.conf.server === this.serverStoreList[i].server) {
                  flagIndex = true
                }
              }
            }
            if (!flagIndex && serverSelect) {
              this.serverStoreList.push({
                server: params.row.conf.server,
                _id: serverSelect,
                flagIndex: false
              })
            }
            return h('div', {
              style: {
                width: '100%'
              }
            }, [
              h('Select', {
                props: {
                  filterable: true,
                  value: params.row.conf.server,
                  disabled: !that.isDisable
                },
                style: {
                  width: '100%'
                },
                on: {
                  'on-change': (value) => {
                    this.onChange(value, indexParams)
                  }
                }
              },
              this.serverStoreList.map(v => {
                let color = ''
                if (v.flagIndex) {
                  color = 'cyan'
                } else {
                  color = 'red'
                }
                return h('Option', {
                  props: {
                    value: v.server,
                    key: v.server,
                    disabled: !v.flagIndex
                  },
                  style: {
                    color: color
                  }
                }, v._id)
              })
              )
            ])
          }
        },
        // {
        //   title: '存储服务器',
        //   // width: 200,
        //   align: 'left',
        //   render: (h, params) => {
        //     // if (Object.getOwnPropertyNames(params.row).length !== 4) {
        //     const indexParams = params.index
        //     var that = this
        //     let server = ''
        //     if (params.row.conf.server) {
        //       server = params.row.conf.server.split(':')[1]
        //     }
        //     var serverSelect = params.row.conf ? server : ''
        //     let flagIndex = false
        //     if (params.row.conf.server && params.row.conf) {
        //       for (let i = 0; i < this.serverStoreList.length; i++) {
        //         if (params.row.conf.server === this.serverStoreList[i].server) {
        //           flagIndex = true
        //         }
        //       }
        //     }
        //     if (!flagIndex && serverSelect) {
        //       this.serverStoreList.push({
        //         server: params.row.conf.server,
        //         _id: serverSelect
        //         // disable: true
        //       })
        //     }
        //     return h('div', { style: { marginLeft: '5px', position: 'relative' } }, [
        //       h(
        //         'div',
        //         {
        //           style: {
        //             borderRadius: '3px',
        //             padding: '4px 6px',
        //             marginBottom: '3px',
        //             color: '#BBBEC4',
        //             outline: 'none',
        //             cursor: 'pointer',
        //             display: serverSelect ? 'none' : 'block',
        //             position: 'absolute',
        //             zIndex: 1
        //           },
        //           domProps: {
        //             disabled: !that.isDisable
        //           },
        //           on: {
        //             click(e) {
        //               // let sel = e.target.parentNode.children[1]
        //               // e.target.style.display = 'none'
        //               // sel.style.display = 'block'
        //             }
        //           }
        //         },
        //         serverSelect || '请选择'
        //       ),
        //       h(
        //         'select',
        //         {
        //           style: {
        //             width: '100%',
        //             borderRadius: '3px',
        //             padding: '5px 14px 5px 6px',
        //             border: '1px solid #5676a9',
        //             backgroundColor: '#1b3153',
        //             // backgroundImage: 'url(../../../../../../../static/alarm_arming.png)',
        //             // backgroundRepeat: 'no-repeat',
        //             // backgroundPosition: 'right center',
        //             // backgroundSize: '15px',
        //             appearance: 'none',
        //             '-moz-appearance': 'none',
        //             '-webkit-appearance': 'none',
        //             color: '#fff',
        //             outline: 'none',
        //             cursor: 'pointer'
        //           },
        //           props: {
        //             filterable: true
        //           },
        //           domProps: {
        //             value: params.row.conf.server,
        //             disabled: !that.isDisable
        //           },
        //           on: {
        //             click(e) {
        //               // console.log(e)
        //             },
        //             change(e) {
        //               let v = e.target.value
        //               e.target.parentNode.children[0].style.display = 'none'
        //               that.storeList[indexParams].conf.server = v
        //               that.$set(that.storeList[indexParams].conf, 'path', '1')
        //               for (let i = 0; i < that.changeLIst.length; i++) {
        //                 that.storeList[that.changeLIst[i]]._checked = true
        //               }
        //             }
        //           }
        //         },
        //         [
        //           // h('option', '请选择'),
        //           this.serverStoreList.map(v => {
        //             return h('option', {
        //               domProps: {
        //                 value: v.server,
        //                 key: v.server
        //                 // disabled: v.disable
        //               }
        //             }, v._id)
        //           })
        //         ]
        //       )
        //     ])
        //     // }
        //   }
        // },
        {
          title: '存储路径',
          // width: 300,
          align: 'left',
          render: (h, params) => {
            // if (Object.getOwnPropertyNames(params.row).length !== 4) {
            const indexParams = params.index
            var _this = this
            var pathSelect = params.row.conf ? params.row.conf.path : ''
            var isPathDisable = true
            if (params.row.conf && params.row.conf.server) {
              isPathDisable = false
            }
            return h('div', { style: { marginLeft: '10px', position: 'relative' } }, [
              h(
                'div',
                {
                  style: {
                    borderRadius: '3px',
                    padding: '4px 6px',
                    marginBottom: '3px',
                    color: '#BBBEC4',
                    outline: 'none',
                    cursor: 'pointer',
                    display: pathSelect ? 'none' : 'block',
                    position: 'absolute'
                    // zIndex: 1
                  },
                  domProps: {
                    disabled: !this.isDisable || isPathDisable
                  },
                  on: {
                    click(e) {
                      // let sel = e.target.parentNode.children[1]
                      // e.target.style.display = 'none'
                      // sel.style.display = 'block'
                    }
                  }
                },
                pathSelect || '请选择'
              ),
              h(
                'select',
                {
                  style: {
                    width: '100%',
                    borderRadius: '3px',
                    padding: '5px 14px 5px 6px',
                    border: '1px solid #5676a9',
                    backgroundColor: !this.isDisable ? '#535f77' : '#1b3153',
                    '-moz-appearance': 'none',
                    '-webkit-appearance': 'none',
                    color: '#fff',
                    outline: 'none',
                    cursor: !this.isDisable || isPathDisable ? 'no-drop' : 'pointer'
                  },
                  domProps: {
                    value: pathSelect,
                    disabled: !this.isDisable || isPathDisable
                  },
                  on: {
                    change: (e) => {
                      let v = e.target.value
                      this.pathChange(v, indexParams)
                    }
                  }
                },
                this.getStorePath.map(v => {
                  return h('option', {
                    domProps: {
                      value: v.path,
                      key: v.path
                    }
                  }, v.path)
                })
              )
            ])
          }
        }
      ],
      columns5: [
        {
          title: '监控点名称',
          key: 'name',
          align: 'left',
          width: 500
        },
        {
          title: 'IP地址',
          key: 'ip',
          width: 400,
          align: 'left'
        },
        {
          title: '状态',
          align: 'left',
          key: 'status',
          width: 300
        },
        {
          title: '存储服务器',
          key: 'server',
          width: 400,
          align: 'left'
        },
        {
          title: '存储路径',
          key: 'path',
          width: 250,
          align: 'left'
        }
      ],
      serverData: [],
      // isSearch: false,
      search: ''
    }
  },
  computed: {
    ...mapState({
      isUpdate: ({ equipment }) => equipment.isUpdate,
      storeServerList: ({ videoManage }) => videoManage.storeServerList
    }),
    ...mapGetters([
      'getSelectTree',
      'getStorePath',
      'getStorage',
      'sysConfrole',
      'monmentVideoTabs',
      'tipWarningConfig',
      'tipErrorConfig'
    ])
  },
  watch: {
    getSelectTree() {
      if (this.monmentVideoTabs === 'store') {
        this.getStoreFun(1)
      }
    },
    'resetData.sonFlag'(newval) {
      this.getStoreFun(1)
    },
    isUpdate(newval) {
      if (this.monmentVideoTabs === 'store') {
        this.getStoreFun(this.currentPage, true)
      }
    },
    monmentVideoTabs(news) {
      if (this.monmentVideoTabs === 'store') {
        this.getStoreFun(1)
      }
    }
  },
  methods: {
    ...mapActions(['getStorageByTree', 'changeStorageByUser', 'getStorageServer', 'changeAllConfig', 'recordLog', 'getStorageExport']),
    waringChange() {
      if (this.changeLIst.length === 0) { return }
      if (this.changeLIst.length === 0 && this.isDisable && this.tipWarningConfig.show) {
        this.$Notice.warning({
          title: '提示',
          desc: '请选择摄像机',
          duration: this.tipWarningConfig.dur
        })
      }
    },
    onChange(value, n) {
      this.storeList[n].conf.server = value
      this.$set(this.storeList[n].conf, 'path', '1')
      for (let i = 0; i < this.changeLIst.length; i++) {
        this.storeList[this.changeLIst[i]]._checked = true
      }
    },
    pathChange(v, n) {
      this.storeList[n].conf.path = v
      for (let i = 0; i < this.changeLIst.length; i++) {
        this.storeList[this.changeLIst[i]]._checked = true
      }
    },
    getStoreFun(page, state) {
      var recursion = this.resetData.sonFlag === true ? 1 : 0
      this.getStorageByTree({
        collection: 'storage',
        org: this.getSelectTree,
        page: page,
        limit: this.pageSize,
        recursion: recursion,
        key: this.resetData.fillvalue
      })
        .then(suc => {
          this.storeList = addChecked(JSON.parse(JSON.stringify(suc.data.result)))
          this.oldList = addChecked(JSON.parse(JSON.stringify(suc.data.result)))
          this.totalPage = parseInt(suc.headers['x-bsc-count'])
          this.currentPage = parseInt(suc.headers['x-bsc-cur'])
          // if (this.storeList.length === 0 && !state && this.tipWarningConfig.show) {
          //   this.$Notice.warning({
          //     title: '提示',
          //     desc: '获取参数列表为空',
          //     duration: this.tipWarningConfig.dur
          //   })
          // }
          this.search = this.resetData.fillvalue
          // if (this.resetData.fillvalue) {
          //   this.isSearch = true
          // } else {
          //   this.isSearch = false
          // }
        })
        .catch(err => {
          if (!state && this.tipErrorConfig.show) {
            this.$Notice.error({
              title: '提示',
              desc: '获取参数列表失败',
              duration: this.tipErrorConfig.dur
            })
          }
          console.log('get storage err:' + err)
        })
    },
    // 页码改变
    pageChange(page) {
      this.getStoreFun(page)
    },
    // 切换每页条数时的回调，返回切换后的每页条数
    sizeChange(size) {
      this.pageSize = size
      this.getStoreFun(1)
    },
    // 导出
    exportCsv() {
      // let fillvalue = ''
      // if (this.isSearch) {
      //   fillvalue = this.search
      // } else {
      //   fillvalue = ''
      // }
      var recursion = this.resetData.sonFlag === true ? 1 : 0
      this.getStorageExport({
        collection: 'storage',
        org: this.getSelectTree,
        recursion: recursion,
        key: this.search
      }).then(res => {
        this.serverData = []
        res.data.result.forEach((item, index) => {
          let server = item.conf.server ? item.conf.server.split(':')[1] : ''
          this.serverData.push({
            name: JSON.stringify(item.name),
            ip: item.ip,
            status: item.status === 1 ? '在线' : '离线',
            server: server,
            path: item.conf.path
          })
        })
        this.$refs.table.exportCsv({
          filename: '存储路径' + this.$moment().format('YYYY-MM-DD HH:mm:ss'),
          original: false,
          columns: this.columns5,
          data: this.serverData
        })
      })
    },
    storeSearch() {
      this.getStoreFun(1)
    },
    // table选中方法
    select(selection) {
      this.changeLIst = []
      for (let i = 0; i < selection.length; i++) {
        for (let j = 0; j < this.storeList.length; j++) {
          if (this.storeList[j].resouceId === selection[i].resouceId) {
            this.changeLIst.push(j)
          }
        }
      }
    },
    // 批量修改服务器
    serverChange(val) {
      this.storeList = addChecked(this.storeList)
      for (let i = 0; i < this.changeLIst.length; i++) {
        this.storeList[this.changeLIst[i]].conf.server = val
        this.storeList[this.changeLIst[i]]._checked = true
      }
    },
    // 批量修改保存路径
    pathChangeAll(val) {
      this.storeList = addChecked(this.storeList)
      for (let i = 0; i < this.changeLIst.length; i++) {
        this.storeList[this.changeLIst[i]].conf.path = val
        this.storeList[this.changeLIst[i]]._checked = true
      }
    },
    // 点击保存的方法
    saveStore() {
      this.loading = true
      var saveChangeList = []
      this.storeList.map((val, index) => {
        if (this.storeList[index].conf.server && this.storeList[index].conf.path) {
          saveChangeList.push({
            resource: this.storeList[index].resouceId,
            server: this.storeList[index].conf.server,
            path: this.storeList[index].conf.path,
            _id: this.storeList[index].conf._id
          })
        }
      })
      if (saveChangeList.length === 0 && this.tipWarningConfig.show) {
        this.$Notice.warning({
          title: '提示',
          desc: '您没有修改配置!',
          duration: this.tipWarningConfig.dur
        })
        this.loading = false
        return
      }
      this.changeStorageByUser(saveChangeList)
        .then(suc => {
          this.$Notice.success({
            title: '提示',
            desc: '参数保存成功',
            duration: 2
          })
          this.loading = false
          this.getStoreFun(this.currentPage)
          let compare = new Compare(this.oldList, this.storeList)
          compare.obj.forEach((val, index) => {
            this.recordLog({
              logType: '操作日志',
              module: '录像管理',
              operateName: '存储路径',
              operateContent: '保存',
              target: val.name,
              deviceIp: val.ip
            })
          })
        })
        .catch(err => {
          this.loading = false
          if (this.tipErrorConfig.show) {
            this.$Notice.error({
              title: '提示',
              desc: '参数保存失败',
              duration: this.tipErrorConfig.dur
            })
          }
        })
    },
    // 一键配置
    OneKeyConfig() {
      var recursion = this.resetData.sonFlag === true ? 1 : 0
      this.changeAllConfig({
        collection: 'storage',
        org: this.getSelectTree,
        recursion: recursion,
        server: this.resetData.storeServer,
        path: this.resetData.storePath
      })
        .then(suc => {
          this.successMsg('配置成功')
          this.getStoreFun(1)
          const body = {
            logType: '操作日志',
            module: '录像管理',
            operateName: '存储路径',
            operateContent: '配置全部'
          }
          this.recordLog(body)
        })
        .catch(err => {
          this.errorMsg(err)
        })
    }
  },
  created() {
    this.isDisable = this.$BShasPower('BS-SETTING-VIDEO-PATH-MANAGE')
    this.getStorageServer({ servername: 'ds' })
      .then(suc => {
        // console.log(this.storeServerList, '2342342342343')
        // for (let i = 0; i < suc.data.length; i++) {
        //   this.serverStoreList.push({ _id: i, server: suc.data[i] })
        // }
        this.serverStoreList = this.storeServerList
      })
      .catch(err => {
        console.log('get server err' + err)
      })
    if (this.getSelectTree && this.monmentVideoTabs === 'store') {
      this.getStoreFun(1)
    }
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 97
  }
}
</script>
<style scoped>
select::-ms-expand { display: none; }
.store-box {
  width: 100%;
  height: calc(100% - 100px);
}
.manage-head label{
  margin-left: 15px;
}
.store-box .select-style {
  margin: auto 5px;
}

.top-margin-botton {
  margin: 16px 0 10px 16px;
}

.table-box {
  margin: 0;
  /* // position: absolute; */
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.page-style {
  float: right;
}
</style>
