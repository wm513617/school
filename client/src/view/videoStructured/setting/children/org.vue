<template>
  <div class="structure_setting_org bs-main" ref="tableBox">
    <TableTab ref="resTab" :tabs="resTabs" ></TableTab>
    <div  v-if="activeFlag===0">
      <div class="warp">
        <!-- 资源内容头部 -->
        <div class="operation">
          <Button type="ghost" icon="plus" title="添加" @click="addModalOpen">添加</Button>
          <Button type="ghost" :disabled="selectRes.length<1" icon="trash-a" title="删除" @click="delRes">删除</Button>
          <Button type="ghost" :disabled="selectRes.length<1" icon="arrow-move" @click="resMoveOpen" title="移动">移动</Button>
          <Button type="ghost" icon="refresh" title="刷新" @click="getResData">刷新</Button>
          <Button type="ghost" :disabled="selectRes.length<1 || isDisabledAnalyze"  title="启动分析" @click="analyze"><i class="iconfont icon-qidongfenxi" style="font-size: 12px;"></i>&nbsp;&nbsp;启动分析</Button>
          <Button type="ghost" :disabled="selectRes.length<1 || isDisabledStopAnalyze"   title="停止分析" @click="unAnalyze"><i class="iconfont icon-tingzhifenxi" style="font-size: 12px"></i>&nbsp;&nbsp;停止分析</Button>
          <Checkbox v-model="topSelect.showChild" @on-change="getResData">显示子机构设备</Checkbox>
          <div class="online">
            <b>在线：</b>
            <span style="color: #19be6b">{{videoStructuredData.online}}</span>
            &nbsp; &nbsp;
            <span>|</span>
            &nbsp; &nbsp;
            <span style="color: #ed4014">{{videoStructuredData.offline}}</span>
          </div>
          <div class="online" >
            <b>分析：</b>
            <span style="color: #19be6b">{{videoStructuredData.analyzeOnline}}</span>
            &nbsp; &nbsp;
            <span>|</span>
            &nbsp; &nbsp;
            <span style="color: #ed4014">{{videoStructuredData.analyzeOffline}}</span>
          </div>
          <div class="search-wrap">
            <Input placeholder="请输入通道名称" style="width: 220px" v-model="topSelect.searchContent" @keyup.enter.native="searchList()">
              <Button slot="append" @click="searchList()">搜索</Button>
            </Input>
          </div>
        </div>
        <!--资源内容列表-->
        <div  class="flex-1 video-resource">
          <div class="bs-table-box">
            <Table @on-selection-change="selectRows"  size="small" :height="tableHeight" highlight-row ref="currentRowTable" :columns="tableColumns" :data="videoStructuredData.list"></Table>
            <div class="table-footer">
              <div style="float: right;">
                <!--:current="videoStructuredData.pages"-->
                <Page @on-page-size-change="pageSizeChange" show-sizer :page-size-opts="$PageInfo.size" :current="tablePage.page" :page-size="tablePage.limit" :show-total="true" :show-elevator="true" :total="videoStructuredData.count" @on-change="changePage"></Page>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 资源添加弹出框 -->
      <div v-if="addModal.isShow">
        <Modal :mask-closable="false" v-model="addModal.isShow" title="资源分配" width="450">
          <div class="res-add-model">
            <p>选择机构资源，将资源添加到当前机构下
            </p>
            <div class="res-model-tree" v-if="addModal.isShow">
              <bs-scroll ref="scrollerOne">
                <VTree @on-expand="expandOne" @loadMore="expandOne" @creatTreeEnd="expandOne" ref="resTree" :treeData="addModal.treeData" :options="addModal.addOptions">
                </VTree>
              </bs-scroll>
            </div>
          </div>
          <div slot="footer">
            <Button type="ghost" @click="addModalCancel">取消</Button>
            <Button type="primary" @click="addModalSave" :loading="addModal.loading">确认</Button>
          </div>
        </Modal>
      </div>
      <!-- 资源移动弹出框 -->
      <div v-if="resMoveModal">
        <Modal :mask-closable="false" v-model="resMoveModal" title="资源移动" width="450">
          <div class="res-add-model">
            <p>选择机构,将资源移动到当前机构下</p>
            <div class="res-model-tree">
              <bs-scroll ref="scrollerTwo">
                <VTree @creatTreeEnd='expandTwo' @on-expand="expandTwo" @loadMore="expandTwo" :treeData="resMoveTreeData" :activeId="resMoveOrgId" :options="resMoveTreeOptions" @node-click="selectMoveOrg">
                </VTree>
              </bs-scroll>
            </div>
          </div>
          <div slot="footer">
            <Button type="ghost" @click="resMoveCancel">取消</Button>
            <Button type="primary" @click="resMoveSave">确认</Button>
          </div>
        </Modal>
      </div>
      <!-- 视频通道修改弹窗 -->
      <VideoRes ref="VideoChanRes"  :orgActiveName="orgActiveName" :resShow="videoResShow" :formData="videoResFormData" @save="saveAlarmInRes" @cancel="cancelAlarmInRes"></VideoRes>
    </div>
   <!-- <div v-else>
      录像资源
    </div>-->
  </div>
</template>

<script type="text/ecmascript-6">
import toTreeData from '@src/assets/js/toTreeData.js'
import { mapState, mapActions } from 'vuex'
import VideoRes from './videoModal'
import TableTab from '@src/components/videoStructured/videoStructuredSettingTab'
export default {
  components: {
    VideoRes,
    TableTab
  },
  data() {
    return {
      tableHeight: 438,
      // 头部状态选择
      topSelect: {
        // 是否显示子机构
        showChild: true,
        // 筛选框内容
        searchContent: '',
        // 当前时候点击了搜索
        searchState: false
      },
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'left'
        },
        {
          title: '序号',
          type: 'index',
          align: 'center',
          width: 66
        },
        {
          title: '通道名称',
          minWidth: 100,
          key: 'name',
          align: 'left',
          ellipsis: true
        },
        {
          title: 'IP地址',
          key: 'ip',
          align: 'left',
          width: 200,
          render: (h, params) => {
            let text = params.row.ip
            return h('span', text)
          }
        },
        {
          title: '通道号',
          key: 'chan',
          align: 'center',
          width: 80
        },
        {
          title: '状态',
          align: 'left',
          width: 100,
          render: (h, params) => {
            let text = params.row.status ? '在线' : '离线'
            return h(
              'span',
              {
                attrs: {
                  title: text
                },
                style: {
                  color: params.row.status ? '#19be6b' : '#ed4014'
                }
              },
              text
            )
          }
        },
        {
          title: '分析服务器',
          align: 'center',
          width: 200,
          ellipsis: true,
          render: (h, params) => {
            let text = params.row.videoStructure.structureServer ? params.row.videoStructure.structureServer.ip : '——'
            return h(
              'span',
              {
                attrs: {
                  title: text
                }
              },
              text
            )
          }
        },
        {
          title: '流地址',
          align: 'left',
          minWidth: 100,
          ellipsis: true,
          render: (h, params) => {
            let text = ''
            text = params.row.rtsp ? params.row.rtsp.main : '......'
            return h(
              'span',
              {
                attrs: {
                  title: text
                }
              },
              text
            )
          }
        },
        {
          title: '分析状态',
          align: 'center',
          width: 100,
          render: (h, params) => {
            let text = '——'
            let color = null
            switch (params.row.videoStructure.analysisStatus) {
              case 0 : text = '未开始'; color = '#ed4014'; break
              case 1: text = '分析中'; color = '#19be6b'; break
              case 2: text = '已停止'; color = '#ed4014'; break
              case 3: text = '解码失败'; color = '#ed4014'; break
            }

            return h(
              'span',
              {
                attrs: {
                  title: text
                },
                style: {
                  color: color
                }
              },
              text
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'left',
          width: 150,
          render: (h, params) => {
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
                    click: e => {
                      e.stopPropagation()
                      // this.resActiceId = params.row._id
                      // this.resEditOpen(this.resActiceId)
                      this.openEditDeviceResInfo(params.row._id)
                    }
                  }
                },
                '编辑'
              )
            ])
          }
        }
      ],
      tablePage: {
        page: 1,
        limit: this.$PageInfo.limit
        // count: 0,
      },
      // 添加资源模态框
      addModal: {
        isShow: false,
        addOptions: {
          showInput: true
        },
        // 机构树
        treeData: [],
        // 是否显示其他机构
        isAllTree: false,
        loading: false
      },
      // 修改资源弹窗
      videoResShow: false,
      resMoveModal: false,
      resMoveTreeData: [],
      selectRes: [],
      resMoveOrgId: '',
      resMoveTreeOptions: {
        showInput: false
      },
      // 资源详情数据
      videoResFormData: {},
      // 切换按钮组件配置
      resTabs: [
        {
          value: '视频资源',
          label: 0,
          isActive: true
        }/*,
        {
          value: '录像资源',
          label: 1,
          isActive: false
        } */
      ],
      activeFlag: 0,
      isDisabledAnalyze: true, // 是否禁用启动分析按钮
      isDisabledStopAnalyze: true // 是否禁用停止启动分析按钮
    }
  },
  computed: {
    ...mapState({
      orgActiveId: ({ orgSetting }) => orgSetting.orgActiveId, // 弹框资源ID
      orgActiveName: ({ orgSetting }) => orgSetting.orgActiveName, // 弹框资源名称
      videoStructuredData: ({ videoStructuredSetting }) => videoStructuredSetting.videoStructuredData
    })
  },
  methods: {
    ...mapActions([
      'getVideoResTree'
    ]),
    ...mapActions('videoStructuredSetting', [
      'addVideoStructuredResources',
      'getVideoStructuredParamFace',
      'getVideoStructuredParamEdit',
      'saveVideoStructuredResourceInfo',
      'getVideoStructuredServer',
      'getVideoStructuredSettingOrgTree',
      'changeVideoStructuredResourceOrg',
      'unbindVideoStructuredResource',
      'startAnalyz',
      'stopAnalyz'
    ]),
    // 启动分析
    analyze() {
      let arr = []
      for (let item of this.selectRes) {
        let obj = {
          resId: item._id,
          channelId: item.videoStructure.channelId,
          ip: item.videoStructure.structureServer.ip,
          port: item.videoStructure.structureServer.port
        }
        arr.push(obj)
      }
      this.startAnalyz(arr).then(res => {
        if (res.status === 200) {
          this.successMsg('启动分析成功')
          this.getResData()
        }
      }, err => {
        this.errorMsg(err.message)
      })
    },
    // 停止分析
    unAnalyze() {
      let arr = []
      for (let item of this.selectRes) {
        let obj = {
          resId: item._id,
          channelId: item.videoStructure.channelId,
          ip: item.videoStructure.structureServer.ip,
          port: item.videoStructure.structureServer.port
        }
        arr.push(obj)
      }
      this.stopAnalyz(arr).then(res => {
        if (res.status === 200) {
          this.successMsg('停止分析成功')
          this.getResData()
        }
      }, err => {
        this.errorMsg(err.message)
      })
    },
    changePage(n) {
      this.selectRes = []
      this.tablePage.page = n
      this.getResData()
    },
    pageSizeChange(n) {
      this.tablePage.limit = n
      this.tablePage.page = 1
      this.getResData()
    },
    searchList() {
      this.tablePage.page = 1
      this.topSelect.searchState = true
      this.getResData()
    },
    resMoveOpen(item) {
      this.resMoveOrgId = ''
      this.getVideoStructuredSettingOrgTree().then(res => {
        this.resMoveTreeData = toTreeData([res.data])
        this.resMoveModal = true
      })
    },
    selectMoveOrg(item) {
      this.resMoveOrgId = item._id
    },
    // 资源移动保存
    resMoveSave() {
      const param = {
        ids: [],
        oid: this.resMoveOrgId
      }
      this.selectRes.map(item => {
        param.ids.push(item._id)
      })
      this.changeVideoStructuredResourceOrg(param)
        .then(res => {
          this.resMoveModal = false
          this.getResData()
        })
        .catch(err => {
          console.log(err)
        })
    },
    resMoveCancel() {
      this.resMoveModal = false
    },
    // 添加所有资源中树的数据请求 刚打开modal时data传true  其他传false 如果勾选其他机构树
    addModalOpen() {
      this.getVideoResTree({
        all: true,
        type: 0,
        orgtype: 8,
        bigtype: 0
      })
        .then(suc => {
          this.addModal.treeData = []
          this.addModal.treeData = toTreeData([suc])
          this.addModal.isShow = true
        })
        .catch(err => {
          console.log('getVideoResTree error: ' + err)
        })
    },
    // 确定添加弹框
    addModalSave() {
      this.addModal.loading = true
      let rids = this.$refs.resTree.getSelectedNodeIds()
      this.addVideoStructuredResources({ rids, oid: this.orgActiveId })
        .then(res => {
          this.addModal.loading = false
          this.addModal.isShow = false
          this.successMsg('添加成功')
          this.getResData()
        })
        .catch(err => {
          this.errorMsg(err.response.message)
          this.addModal.loading = false
        })
    },
    // 关闭添加弹框
    addModalCancel() {
      this.addModal.isShow = false
      this.addModal.treeData = []
    },
    // 选择资源列
    selectRows(rows) {
      this.selectRes = rows
      if (this.selectRes.length) { // 如果有已选中的选项  // 0 未开始 | 1 分析中 | 2 已停止 | 3 解码失败
        for (let item of this.selectRes) {
          if (item.videoStructure.analysisStatus !== 0) {
            if (item.videoStructure.analysisStatus === 1) {
              this.isDisabledAnalyze = true // 禁用启动分析按钮
              break
            } else { // 状态码为2或者3  启动分析解禁
              this.isDisabledAnalyze = false
            }
          } else {
            if (item.videoStructure.hasOwnProperty('structureServer')) { // 如果绑定服务器 开起启动分析
              this.isDisabledAnalyze = false
            } else { // 否则禁用启动分析
              this.isDisabledAnalyze = true
              break
            }
          }
        }
        for (let item1 of this.selectRes) {
          if (item1.videoStructure.analysisStatus !== 1) { // 禁用停止分析按钮
            this.isDisabledStopAnalyze = true
            break
          } else {
            this.isDisabledStopAnalyze = false
          }
        }
      }
    },
    // 删除资源（解除绑定）
    delRes() {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除所选资源吗？</p>',
        onOk: () => {
          const param = {
            type: 8,
            ids: []
          }
          this.selectRes.map(item => {
            param.ids.push(item._id)
          })
          this.unbindVideoStructuredResource(param).then(res => {
            //  this.selectRes.length  当前选中个数
            // this.videoStructuredData.list.length 当前页面总个数
            //  this.tablePage.page // 当前页码
            // this.videoStructuredData.pages // 总页码
            if (this.selectRes.length === this.videoStructuredData.list.length) { // 批量删除
              if (this.tablePage.page === this.videoStructuredData.pages) { // 从最后开始按照顺序删除
                if (this.videoStructuredData.pages > 1) { // 若只有一页的话页码取当前页码
                  this.tablePage.page--
                }
              }
            }
            this.getResData()
          })
            .catch(err => console.error(err))
        },
        onCancel: () => {}
      })
    },
    // 获取视频结构化table接口
    getResData(data) {
      if (data) {
        this.tablePage.page = 1
        this.topSelect.searchState = false
      }
      this.selectRes = []
      this.getVideoStructuredParamFace({
        page: this.tablePage.page,
        limit: this.tablePage.limit,
        oid: this.orgActiveId,
        type: 8,
        never: this.topSelect.showChild ? -1 : 0,
        seek: this.topSelect.searchState ? this.topSelect.searchContent.toUpperCase() : ''
      })/*
        .then(res => {
          // console.log(res)
        })
        .catch(err => console.log(err)) */
    },
    // 资源的编辑
    openEditDeviceResInfo(id) {
      this.getVideoStructuredParamEdit({id: id, rootOrg: this.orgActiveId}).then(suc => {
        this.videoResShow = true // 显示弹窗
        this.videoResFormData = suc // 向模态框传入回填的数据
      })
    },
    // 资源修改模态框的保存saveVerifaceResourceInfo
    saveAlarmInRes(data, name) {
      this.saveVideoStructuredResourceInfo({ form: data, id: data._id })
        .then(() => {
          this.successMsg('资源信息修改成功')
          this.videoResShow = false
          this.getResData()
          this.$refs['VideoChanRes'].$refs[name].resetFields()
        })
        .catch(err => {
          this.errorMsg(err.response.message)
          // this.deviceResSelectIds = []
        })
    },
    expandOne() {
      this.$refs.scrollerOne.update()
    },
    expandTwo() {
      this.$refs.scrollerTwo.update()
    },
    // 资源修改模态框的取消
    cancelAlarmInRes(name) {
      this.videoResShow = false
      this.$refs['VideoChanRes'].$refs[name].resetFields()
    },
    // 监听子组件emit事件监听
    tabToggles({index, tabs}) {
      // eslint-disable-next-line no-unused-vars
      var _t = this
      tabs.forEach(function(item, i) {
        if (i === index) {
          item.isActive = true
          _t.activeFlag = item.label
        } else {
          item.isActive = false
        }
      })
    },
    changeTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = this.$refs['tableBox'].offsetHeight - 130
        this.$refs['resTab'].$on('toggles', this.tabToggles)
      })
    }
  },
  created() {
    this.getResData()
  },
  mounted() {
    this.changeTableHeight()
    window.addEventListener('resize', this.changeTableHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.changeTableHeight)
    this.$refs['resTab'].$off('toggles')
  }
}
</script>

<style  lang="less" scoped>
  @bgcolor: #0f2243;
  .structure_setting_org {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #0f2243;
    .warp-title {
      display: inline-block;
      height: 40px;
      line-height: 40px;
      width: 100px;
      background: @bgcolor;
      color: #fff;
      text-align: center;
      line-height: 40px;
    }
    .warp {
      flex: 1;
      background: @bgcolor;
      display: flex;
      flex-direction: column;
      .operation {
        width: 100%;
        height: 50px;
        line-height: 50px;
        background: #1c3053;
        .ivu-btn {
          margin-left: 20px;
          background-color: #3c5073;
        }
        .ivu-select {
          margin-left: 16px;
        }
        .ivu-checkbox-wrapper {
          .ivu-select;
        }
        .search-wrap {
          float: right;
          margin-right: 50px;
          margin-top: 8px;
          .ivu-btn {
            margin-left: -10px;
          }
        }
      }
      .content {
        padding: 0px;
        .page-warp {
          width: 100%;
          height: 100%;
          background: #244575;
          // line-height: 40px;
          padding: 3px 10px;
          padding: 0;
          .page {
            float: right;
          }
        }
      }
    }
  }

  .res-model-tree {
    height: 450px;
    width: 400px;
    margin-top: 20px;
    overflow: hidden;
  }
  .res-add-model {
    padding: 0px 10px;
  }
  .video-resource .ivu-table-cell {
    padding-left: 24px;
  }
  .online{
    display: inline-block;
    margin-left: 20px
  }
</style>
