/*
 * @Author: 于泳君
 * @Date: 2018-06-04 15:36:03
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2018-07-21 15:08:23
 */
<template>
  <!-- 门禁 -->
  <div>
    <div style="height:100%;display:flex;margin-top:20px">
        <div class="bs-left" style="height:100%">
            <div class="doorTitle">
              门禁机构
            </div>
            <div>
              <el-buttongroup class="btnGroup" style="margin-bottom:20px">
                  <el-button class="btnStyle" title="添加"><i class="iconfont icon-add"></i></el-button>
                  <el-button class="btnStyle" title="编辑"><i class="iconfont icon-edit1"></i></el-button>
                  <el-button class="btnStyle" title="删除"><i class="iconfont icon-delete"></i></el-button>
                  <el-button class="btnStyle" title="上移"><i class="iconfont icon-move-up"></i></el-button>
                  <el-button class="btnStyle" title="下移"><i class="iconfont icon-move-down"></i></el-button>
                  <el-button class="btnStyle" title="刷新"><i class="iconfont icon-shuaxin"></i></el-button>
              </el-buttongroup>
              <div class="BStreeSearInput">
                  <Input placeholder="请输入..." v-model="filterText">
                    <Button slot="append">搜索</Button>
                  </Input>
              </div>
              <!--门禁机构树-->
              <DoorTree :doorData='data4'></DoorTree>
            </div>
        </div>
        <div style="display:flex;background:#1b3153">
          <div :style="styleData" id="videoBox">
              <div>
                <div :style="videoGroupStyle" class="videoGroup">1</div>
                <div :style="videoGroupStyle" class="videoGroup" style="margin:10px 10px 0 0;">2</div>
              </div>
              <div>
                <div :style="videoGroupStyle" class="videoGroup" style="margin-bottom:10px;">3</div>
                <div :style="videoGroupStyle" class="videoGroup">4</div>
              </div>
          </div>
          <div style="width:50%">
            <div style="margin:10px 0;display:flex">
              <Input placeholder="请输入门禁编号、门禁名称" v-model="searchInfor" style="width: 220px;margin-right: 10px;" class="rt">
                  <Button slot="append" @click="getSearchDoor">搜索</Button>
              </Input>
              <Button class = 'btn' type="ghost" icon="refresh" @click="refresh">刷新</Button>
            </div>
            <Table :columns= 'importTitle' :data= 'dataSource' style="height:100%" height= '100%' width = '100%'></Table>
          </div>
          <div class="bottomDiv">
                <div style="float:left;">
                  录像按钮
                  <!-- <div class="realbtn iconfont icon-preview-stopall" title="关闭全部预览"></div>
                  <div class="realbtn iconfont icon-screenshot" title="截图"></div> -->
                </div>
                <div style="float:right;margin-right:290px;">
                    <Page class="rt" show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :current='Number(current)' :total="Number(total)" :page-size="Number(limit)" @on-change="pageChange" show-elevator show-total></Page>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { Input, ButtonGroup, Button } from 'element-ui'

import './common.css'
import { mapState, mapMutations, mapActions } from 'vuex'

import DoorTree from '../../components/BStreeNew/doorTree'

Vue.component('el-input', Input)
Vue.component('el-buttongroup', ButtonGroup)
Vue.component('el-button', Button)
export default {
  name: 'door',
  components: {
    DoorTree
  },
  data() {
    return {
      videoGroupStyle: {
        height: '',
        width: ''
      },
      styleData: {
        display: 'flex',
        marginTop: '52px',
        background: '#fff',
        height: '',
        width: ''
      },
      // 表格
      filterText: '',
      importTitle: [
        {
          title: '门禁编号',
          key: 'chan',
          align: 'center'
        },
        {
          title: '门禁名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '门禁类型',
          key: 'type',
          align: 'center',
          render: (h, params) => {
            let sysType = ''
            switch (Number(params.row.type)) {
              case 0:
                sysType = '门禁'
                break
              case 1:
                sysType = '闸机'
                break
              default:
                return
            }
            return h('div', [h('p', {}, sysType)])
          }
        },
        {
          title: '门禁状态',
          key: 'ip',
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const color = Number(row.ip) === 1 ? 'green' : '#f00'
            const text = Number(row.ip) === 1 ? '打开' : '关闭'
            return h(
              'span',
              {
                style: { color: color }
              },
              text
            )
          }
        },
        {
          title: '门禁控制',
          key: 'inAndout',
          width: 200,
          // align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'ios-play'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {}
                }
              }),
              h('Icon', {
                // props: {
                //   type: 'ios-arrow-dropright'
                // },
                props: {
                  type: 'ios-play'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {}
                }
              }),
              h('Icon', {
                // props: {
                //   type: 'ios-arrow-dropleft'
                // },
                props: {
                  type: 'ios-play'
                },
                style: {},
                on: {
                  click: () => {}
                }
              })
            ])
          }
          // render: (h, params) => {
          //   return h('div', [
          //     h('Icon', {
          //       props: {
          //         type: 'icon-setting'
          //       },
          //       style: {
          //         marginRight: '10px',
          //         color: '#ffb340',
          //         cursor: 'pointer',
          //         fontSize: '18px'
          //       }
          //     })
          //   ])
          // }
        }
      ],
      data4: [
        {
          id: 1,
          label: '斯麦尔大门禁系统-1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1'
                },
                {
                  id: 10,
                  label: '三级 1-1-2'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '斯麦尔大门禁系统-2',
          children: [
            {
              id: 4,
              label: '二级 2-1',
              children: [
                {
                  id: 9,
                  label: '三级 2-1-1'
                },
                {
                  id: 10,
                  label: '三级 2-1-2'
                }
              ]
            }
          ]
        }
      ],
      // 控制文字(进/出)在调接口后是否显示
      // inDoor: false,
      // outDoor: false,
      DoorRowState: {},
      // 搜索框内容
      searchInfor: '',
      // 分页
      total: '',
      limit: this.$PageInfo.limit,
      current: 1,
      mode: 0, // 0|设备列表接口1|关键字查询接口
      // 表格数组
      dataSource: [
        {
          chan: '43242',
          name: '东门',
          type: '0',
          ip: '1'
        },
        {
          chan: '76676',
          name: '西门',
          type: '1',
          ip: '0'
        },
        {
          chan: '98797',
          name: '南门',
          type: '1',
          ip: '0'
        },
        {
          chan: '98796',
          name: '北门',
          type: '1',
          ip: '1'
        }
      ],
      // 列表高度
      tableHeight: '',
      tableWidth: '',
      tableWrrpHeight: '100%',
      serverId: ''
    }
  },
  created() {},
  mounted() {
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
  },
  computed: {
    ...mapState({
      tableList: ({ sysDoor }) => sysDoor.tableLists,
      getDoorHeader: ({ sysDoor }) => sysDoor.getDoorHead
    })
  },
  methods: {
    ...mapMutations(['ALLOW_ENTRANCE_GUARD']),
    ...mapActions(['queryDoors', 'getDoorList', 'openOrCloseDoor']),
    // 响应服务器列表组件点击触发的事件
    queryDoor(params) {
      this.serverId = params.id
      this.getDoor()
    },
    getHeight() {
      let divHeight = document.getElementById('videoBox').clientHeight
      // let divWidth = document.getElementById('videoBox').clientWidth
      this.styleData.height = divHeight
      this.styleData.width = divHeight
      this.videoGroupStyle.height = (divHeight - 80) / 2 + 'px'
      this.videoGroupStyle.width = (divHeight - 10) / 2 + 'px'
      console.log(divHeight)
      // console.log(divWidth)
    },
    // 刷新
    refresh() {
      this.$store.commit('ALLOW_ENTRANCE_GUARD', true)
      this.current = 1
      if (this.serverId === '') {
        this.errorMsg('请先选择门禁机构再刷新')
      } else {
        this.getDoor()
      }
    },
    // 获取门禁系统设备列表
    getDoor(page) {
      this.current = page || 1
      const postData = {
        id: this.serverId,
        data: {
          page: this.current,
          limit: this.limit
        }
      }
      this.getDoorList(postData)
        .then(res => {
          // this.dataSource = res
          this.mode = 0
          this.current = this.getDoorHeader.current
          this.total = this.getDoorHeader.counts
          this.limit = this.getDoorHeader.limits
        })
        .catch(err => {
          this.errorMsg('获取该门禁系统列表失败！')
          console.log('this.getDoorList :' + err)
        })
    },
    // 按关键字搜索门禁设备
    getSearchDoor() {
      this.getQueryDoor()
    },
    getQueryDoor(page) {
      this.current = page || 1
      const param = {
        _id: this.serverId,
        data: {
          key: encodeURIComponent(this.searchInfor),
          page: this.current,
          limit: this.limit
        }
      }
      this.queryDoors(param)
        .then(res => {
          // this.dataSource = res
          this.mode = 1
          this.current = this.getDoorHeader.current
          this.total = this.getDoorHeader.counts
          this.limit = this.getDoorHeader.limits
        })
        .catch(err => {
          this.errorMsg('搜索门禁编号、门禁名称失败！')
          console.log('this.queryDoors :' + err)
        })
    },
    // 分页功能
    pageChange(page) {
      this.current = page
      this.mode ? this.getQueryDoor(page) : this.getDoor(page)
    },
    pageSizeChange(n) {
      this.limit = n
      this.current = 1
      this.getDoor()
    }
  }
}
</script>

<style lang="less" scoped>
.bs-left .btnGroup {
  width: 100%;
  padding: 10px;
  padding-bottom: 0;
}
.bs-left .btnGroup .btnStyle {
  /* 按钮样式*/
  background-color: rgb(60, 80, 115);
  border-color: rgb(86, 118, 169);
  border-width: 1px;
  border-style: solid;
  color: #fff;
  padding: 0;
  margin: 0;
  width: 16.6666666%;
  height: 24px;
}
.bs-left .btnGroup .btnStyle .iconfont {
  font-size: 14px;
}
.bs-left .btnGroup .btnStyle:hover {
  /* 按钮样式*/
  background: #4699f9;
}
.bs-left .btnGroup .btnStyle[disabled],
.bs-left .btnGroup .btnStyle[disabled]:hover {
  /* 禁用按钮样式*/
  background: #535777;
  color: #cacaca;
}
.bs-left .btnGroup .btnStyle .iconfont {
  font-size: 14px;
}
.bs-left .btnGroup .btnStyle:hover {
  /* 按钮样式*/
  background: #4699f9;
}
.bs-left .btnGroup .btnStyle[disabled],
.bs-left .btnGroup .btnStyle[disabled]:hover {
  /* 禁用按钮样式*/
  background: #535777;
  color: #cacaca;
}
.bs-left .BStreeSearInput {
  width: 100%;
  padding: 10px;
  position: relative;
}
.bs-left .BStreeSearInput .el-input:hover {
  border-color: #6badfa;
}
.bs-left .BStreeSearInput .el-input .el-input__inner {
  padding-right: 32px;
}
.bs-left .BStreeSearInput .ivu-icon {
  /* 搜索栏的图标 */
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
}
.doorTitle {
  width: 100%;
  height: 38px;
  line-height: 38px;
  text-align: center;
  font-size: 16px;
  background-color: #0f2243;
}
.bs-left {
  height: 100%;
  width: 272px;
  background: #1b3153;
}
.bottomDiv {
  position: absolute;
  width: 100%;
  bottom: 0;
  // right: 10px;
  left: 272px;
  background: #244575;
  line-height: 33px;
  padding: 8px 10px;
  margin-left: 16px;
}
.videoGroup {
  border: 1px solid #fd7272;
  // width: 400px;
  background: #1b3153;
}
</style>
