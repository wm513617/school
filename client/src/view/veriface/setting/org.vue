<template>
  <div class="veriface_setting_org bs-main">
    <!-- 机构组员 -->
    <Tabs>
      <Tab-pane label="视频资源" name="0"></Tab-pane>
    </Tabs>
    <div class="warp">
      <!-- 这是内容 -->
      <div class="operation">
        <Button type="ghost" icon="plus" title="添加" @click="addModalOpen">添加</Button>
        <Button type="ghost" :disabled="selectRes.length<1" icon="trash-a" title="删除" @click="delRes">删除</Button>
        <Button type="ghost" :disabled="selectRes.length<1" icon="arrow-move" @click="resMoveOpen" title="移动">移动</Button>
        <Button type="ghost" icon="refresh" title="刷新" @click="getResData">刷新</Button>

        <Checkbox v-model="topSelect.showChild" @on-change="getResData">显示子机构设备</Checkbox>
        <div class="search-wrap">
          <Input placeholder="请输入通道名称" style="width: 220px" v-model="topSelect.searchContent" @keyup.enter.native="searchList()">
          <Button slot="append" @click="searchList()">搜索</Button>
          </Input>
        </div>
      </div>
      <div ref="tableBox" class="flex-1 video-resource">
        <div class="bs-table-box">
          <Table @on-selection-change="selectRows" size="small" :height="tableHeight" highlight-row ref="currentRowTable" :columns="tableColumns" :data="verifaceData.list"></Table>
          <div class="table-footer">
            <div style="float: right;">
              <Page @on-page-size-change="pageSizeChange" show-sizer :page-size-opts="$PageInfo.size" :current="verifaceData.curPage" :page-size="tablePage.limit" :show-total="true" :show-elevator="true" :total="verifaceData.count" @on-change="changePage"></Page>
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
            <!-- <Checkbox style="float:right" v-model="addModal.isAllTree" @on-change="addModalOpen">其他类型资源</Checkbox> -->
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
    <!-- 资源移动 -->
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
    <VideoRes ref="VideoChanRes" :serverList="verifaceServers" :orgActiveName="orgActiveName" :resShow="videoResShow" :formData="videoResFormData" @save="saveAlarmInRes" @cancel="cancelAlarmInRes"></VideoRes>
  </div>
</template>

<script type="text/ecmascript-6">
import toTreeData from 'assets/js/toTreeData.js'
import { mapState, mapActions } from 'vuex'
import VideoRes from './videoModal'
export default {
  components: {
    VideoRes
  },
  data() {
    return {
      tableHeight: 434,
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
          align: 'left',
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
          title: '所属设备',
          key: 'device',
          minWidth: 100,
          ellipsis: true,
          align: 'left',
          render: (h, params) => {
            let text = ''
            if (params.row.eid) {
              text = params.row.eid.name
            } else {
              text = '...'
            }
            return h('span', text)
          }
        },
        {
          title: '设备IP',
          key: 'ip',
          align: 'left',
          width: 150,
          render: (h, params) => {
            let text = params.row.ip
            return h('span', text)
          }
        },
        {
          title: '通道号',
          key: 'chan',
          align: 'left',
          width: 80
        },
        {
          title: '监控点类型',
          key: 'monitortype',
          align: 'left',
          width: 102,
          render: (h, params) => {
            let text = ''
            switch (Number(params.row.monitortype)) {
              case 0:
                text = '枪机'
                break
              case 1:
                text = '红外枪机'
                break
              case 2:
                text = '半球'
                break
              case 3:
                text = '快球'
                break
              case 4:
                text = '全景'
                break
            }
            return h('span', text)
          }
        },
        {
          title: '出/入类型',
          key: 'passway',
          width: 100,
          align: 'left',
          render: (h, params) => {
            let text = ''
            let n = params.row.passway
            if (n === 0) {
              text = '普通'
            } else if (n === 1) {
              text = '入口'
            } else if (n === 2) {
              text = '出口'
            }
            return h('span', text)
          }
        },
        {
          title: '实时码流',
          key: 'stream',
          align: 'left',
          width: 100,
          render: (h, params) => {
            let text = ''
            let t = params.row.stream
            if (t === 'main') {
              text = '主码流'
            } else if (t === 'sub1') {
              text = '子码流'
            } else if (t === 'sub2') {
              text = '第三码流'
            }
            return h('span', text)
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
          title: '流状态',
          align: 'left',
          width: 100,
          render: (h, params) => {
            let text = ''
            text = params.row.state ? '正常' : '异常'
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
      // tableList: [],
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
      verifaceServers: []
    }
  },
  computed: {
    ...mapState({
      orgActiveId: ({ orgSetting }) => orgSetting.orgActiveId,
      orgActiveName: ({ orgSetting }) => orgSetting.orgActiveName,
      verifaceData: ({ veriface }) => veriface.verifaceData
    })
    // ...mapGetters(['accessToken', 'tipWarningConfig', 'tipErrorConfig'])
  },
  methods: {
    ...mapActions([
      'getVideoResTree',
      'addVerifaceResources',
      'getVerifaceParamFace',
      'getVerifaceParamEdit',
      'saveVerifaceResourceInfo',
      'getVerifaceServer',
      'getVerifaceSettingOrgTree',
      'changeVerifaceResourceOrg',
      'unbindVerifaceResource'
    ]),
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
      this.getVerifaceSettingOrgTree().then(res => {
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
      this.changeVerifaceResourceOrg(param)
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
    // 添加中树的数据请求 刚打开modal时data传true  其他传false 如果勾选其他机构树
    addModalOpen() {
      this.getVideoResTree({
        all: true,
        type: 0,
        orgtype: 6,
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
      this.addVerifaceResources({ rids, oid: this.orgActiveId })
        .then(res => {
          this.addModal.loading = false
          this.addModal.isShow = false
          this.successMsg('添加成功')
          this.getResData()
        })
        .catch(err => {
          console.log('addVerifaceResources error: ' + err)
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
    },
    // 删除资源（接触绑定）
    delRes() {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除所选资源吗？</p>',
        onOk: () => {
          const param = {
            type: 6,
            ids: []
          }
          this.selectRes.map(item => {
            param.ids.push(item._id)
          })
          this.unbindVerifaceResource(param)
            .then(res => {
              this.getResData()
            })
            .catch(err => console.error(err))
        },
        onCancel: () => {}
      })
    },
    // 获取table接口
    getResData(data) {
      if (data) {
        this.tablePage.page = 1
        // this.topSelect.showChild = true
        this.topSelect.searchState = false
      }
      this.selectRes = []
      this.getVerifaceParamFace({
        page: this.tablePage.page,
        limit: this.tablePage.limit,
        oid: this.orgActiveId,
        type: 0,
        never: this.topSelect.showChild ? -1 : 0,
        seek: this.topSelect.searchState ? this.topSelect.searchContent.toUpperCase() : ''
      })
        .then(res => {
          // console.log(res)
        })
        .catch(err => console.log(err))
    },
    // 资源的修改
    openEditDeviceResInfo(id) {
      this.getVerifaceServer().then(res => {
        this.verifaceServers = res.data.results
      })
      this.getVerifaceParamEdit({id: id, rootOrg: this.orgActiveId}).then(suc => {
        this.videoResShow = true
        this.videoResFormData = suc
      })
    },
    // 资源修改模态框的保存
    saveAlarmInRes(data, name) {
      this.saveVerifaceResourceInfo({ form: data, id: data._id })
        .then(() => {
          this.successMsg('资源信息修改成功')
          this.videoResShow = false
          this.getResData()
          this.$refs['VideoChanRes'].$refs[name].resetFields()
        })
        .catch(err => {
          console.log('saveVerifaceResourceInfo error: ' + err)
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
    changeTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = this.$refs['tableBox'].offsetHeight - 80
      })
    }
  },
  created() {
    // this.route = this.$route.path
    // console.log('activeOrgId===>', this.orgActiveId)
    // this.getVerifaceParamFace()
  },
  mounted() {
    this.changeTableHeight()
    window.addEventListener('resize', this.changeTableHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.changeTableHeight)
  }
}
</script>

<style  lang="less" scoped>
@bgcolor: #0f2243;
.veriface_setting_org {
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
</style>
