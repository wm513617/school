
<template>
  <div class="container">
    <Row class="bs-content">
      <div class="bs-left">
        <div class="sidebar">
          <a >权限组</a>
          <div class="tree-org">
            <ul>
              <li v-for=" item in authorityArray">{{item.libraryName}}</li>
            </ul>
            <!--            @clickData="getDevicesDataClick"-->
            <!--            <BStreeNewBox :iconToggle="false" :searchToggle="true" :searchType="0" :equipmentToggle="false" :resourceToggle="false" :btnGroup="true" :orgType="10" :resType="[0]"  @clickData="getDevicesDataClick"></BStreeNewBox>-->
          </div>
        </div>

      </div>
      <div class="bs-main">
        <!-- 资源添加弹出框 -->
        <div v-if="resAddModal">
          <Modal :mask-closable="false" v-model="resAddModal" title="" width="1080">
            <div class="res-add-model">
              <div class="res-model-tree">
                <div class="res-edit-form">
                  <div class="table-header">
                    <TableTab @on-tab-click="resTabClick" :tabs="resTabs" :isCount="true"></TableTab>
                    <div class="table-header-actions clear" v-if="resActiveTab==0">
                      <div class="actions-search">
                        <Input placeholder="请输入姓名或人员编号" style="width: 220px" v-model="getListParams.keyWord">
                          <Button slot="append" @click="seekResData()">搜索</Button>
                        </Input>
                      </div>
                      <!--            </div>-->
                    </div>
                    <div class="table-relative" ref="tableBox">
                      <div class="table-body table-cover" v-if="resActiveTab==0">
                        <Table size="small" :columns="resColumns[resActiveTab]" :height="tableHeight" :data="resourceTableData" :highlight-row="true" @on-selection-change="selectResRow" width="100%" ref="personTable"></Table>
                      </div>

                      <div  class="table-body table-cover" v-if="resActiveTab==1">
                        <Tree :data="data4" show-checkbox multiple></Tree>
                      </div>
                    </div>
                    <div class="table-footer" v-if="resActiveTab==0">
                      <div style="float: right;">
                        <Page show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :total="page.total" :current="pageCur" :page-size="page.pageSize" show-total show-elevator @on-change="changeResPage"></Page>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div slot="footer">
              <Button type="ghost" @click="resAddCancel">取消</Button>
              <Button type="primary" @click="resAddSave" :loading="modalloading">确认</Button>
            </div>
          </Modal>
        </div>

        <div class="resource-right-table">
          <div class="table-header">
            <!--            <TableTab @on-tab-click="resTabClick" :tabs="resTabs" :isCount="true"></TableTab>-->
            <div class="table-header-actions clear">
              <div class="actions-btn">
                <Button  type="ghost" icon="plus" @click="resAddOpen"  v-if="resTabs[resActiveTab].btnShow.add">添加</Button>
                <Button  type="ghost" icon="trash-a" @click="resDelPerson" v-if="resTabs[resActiveTab].btnShow.delete" :disabled="ModifyPerson.length!==1">删除</Button>
                <Button  type="ghost" icon="edit" @click="resModifyOpen" v-if="resTabs[resActiveTab].btnShow.modify" :disabled="ModifyPerson.length!==1">修改</Button>
              </div>
              <div class="actions-search">
                <Input placeholder="请输入姓名或人员编号" style="width: 220px" v-model="getListParams.keyWord">
                  <Button slot="append" @click="seekResData()">搜索</Button>
                </Input>
              </div>
              <!--            </div>-->
            </div>
            <div class="table-relative" ref="tableBox">
              <div class="table-body table-cover">
                <Table size="small" :columns="resColumns[resActiveTab]" :height="tableHeight" :data="resourceTableData" :highlight-row="true" @on-selection-change="selectResRow" width="100%" ref="personTable"></Table>
              </div>
            </div>
            <div class="table-footer">
              <div style="float: right;">
                <Page show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :total="page.total" :current="pageCur" :page-size="page.pageSize" show-total show-elevator @on-change="changeResPage"></Page>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Row>
  </div>
</template>
<script>
import BStreeNewBox from '../../../components/BStreeNew/BStreeNewBox'
import TableTab from '../../settings/equipment/tableTab'
import { mapState, mapActions, mapGetters } from 'vuex'
// import { save } from '../../../../storage'
// import './facePage/tree.css'
export default {
  name: 'facePermission',
  components: {
    BStreeNewBox,
    TableTab
  },
  data() {
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('名称不能为空'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('电话不能为空'))
        // return
      } else {
        var phoneReg = /^1(3|4|5|7|8)\d{9}$/
        if (!phoneReg.test(value)) {
          callback(new Error('电话号输入有误'))
        } else {
          callback()
        }
      }
    }
    return {
      authorityArray: [],
      data4: [
        {
          title: 'parent 1',
          expand: true,
          selected: true,
          children: [
            {
              title: 'parent 1-1',
              expand: true,
              children: [
                {
                  title: 'leaf 1-1-1',
                  disabled: true
                },
                {
                  title: 'leaf 1-1-2'
                }
              ]
            },
            {
              title: 'parent 1-2',
              expand: true,
              children: [
                {
                  title: 'leaf 1-2-1',
                  checked: true
                },
                {
                  title: 'leaf 1-2-1'
                }
              ]
            }
          ]
        }
      ],
      headerObj: { Authorization: '' },
      page: {
        total: 0,
        current: 1,
        pageSize: this.$PageInfo.limit
      },
      modalloading: false,
      isEdit: false,
      resourceTableData: [],
      ModifyPerson: [],
      deleteArr: [], // 选中人员的ID
      orgId: '', // 选中的机构id
      // 新增表单验证
      resFormRole: {
        name: [
          { validator: validateName, trigger: 'blur' }
        ],
        // uid: [
        //   { validator: validateUid, trigger: 'blur' }
        // ],
        phone: [
          { validator: validatePhone, trigger: 'blur' }
        ]
      },
      // 新增表单数据
      resEditFormData: {
        orgId: '',
        name: '',
        sex: '',
        uid: '',
        phone: '',
        type: '',
        image: ''
      },
      // 获取表格数据参数
      getListParams: {
        pageNum: 1,
        pageSize: this.$PageInfo.limit,
        orgId: '',
        type: 3,
        guard: 1, // 同步状态 1 暂不能刷卡或刷脸 2 仅可刷卡 3 仅可刷脸 4 都可以
        showChildren: false, // 是否显示子机构下的数据 true 是 false 否
        keyWord: '' // 关键字搜索姓名或人员编号
      },
      // 用户类型字典
      userType: [
        {
          label: '白名单',
          value: 1
        },
        {
          label: '黑名单',
          value: 2
        },
        {
          label: '全部',
          value: 3
        }
      ],
      // 性别
      sexDict: [
        {
          label: '男',
          value: '男'
        },
        {
          label: '女',
          value: '女'
        }
      ],
      resAddModal: false,
      route: '',
      isSearch: false,
      tableHeight: 435,
      pageLimit: this.$PageInfo.limit,
      pageCur: 1,
      filterKey: '',
      resActiveTab: 0,
      isShowSubecMhanismEquipment: [true, true, true, true, true],
      batchStreamOpts: [ // 同步状态字典
        {
          label: '未同步',
          value: 1
        },
        {
          label: '仅可刷卡',
          value: 2
        },
        {
          label: '仅可刷脸',
          value: 3
        },
        {
          label: '全部',
          value: 4
        }
      ], // 同步状态字典
      resTabs: [
        {
          title: '按人',
          value: 0,
          disabled: false,
          active: true,
          number: 5,
          btnShow: {
            add: true,
            delete: true,
            modify: true,
            move: true,
            Obtain: true, // 获取
            copy: true,
            synchronization: false,
            resfesh: true,
            equipment: true,
            personType: true,
            synchronizationStatus: true,
            input: true,
            output: true

          }
        },
        {
          title: '按部门',
          value: 1,
          disabled: false,
          active: false,
          number: 5,
          btnShow: {
            add: false,
            delete: false,
            modify: false,
            move: true,
            Obtain: false, // 获取
            synchronization: false, // 同步
            copy: true,
            resfesh: true,
            equipment: true,
            personType: false,
            synchronizationStatus: false

          }
        }

      ],
      resColumns: [
        [
          {
            type: 'selection',
            width: 60,
            align: 'left'
          },
          {
            title: '序号',
            type: 'index',
            align: 'left',
            width: 60
          },
          {
            title: '用户名称',
            key: 'name',
            align: 'left',
            minWidth: 165
          },
          {
            title: '性别',
            key: 'sex',
            align: 'left',
            minWidth: 60
          },
          {
            title: '人员编号',
            key: 'uid',
            minWidth: 60,
            align: 'left'
          },
          {
            title: '组织',
            key: 'orgName',
            align: 'left',
            minWidth: 110
          },
          {
            title: '联系电话',
            key: 'phone',
            align: 'left',
            minWidth: 50
          },
          {
            title: '人员类型',
            key: 'type',
            align: 'left',
            minWidth: 75,
            render: (h, params) => {
              let text = ''
              switch (params.row.type) {
                case 1:
                  text = '白名单'
                  break
                case 2:
                  text = '黑名单'
                  break
              }
              return h('span', text)
            }
          },
          {
            title: '人员照片',
            key: 'image',
            minWidth: 65,
            align: 'left',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.image
                },
                style: {
                  width: '50px',
                  height: '50px',
                  border: 0
                }

              })
            }
          },
          {
            title: '同步状态',
            key: 'type',
            align: 'left',
            minWidth: 75,
            render: (h, params) => {
              let text = []
              switch (params.row.guard) {
                case 1:
                  break
                case 2:
                  text = [
                    h('span', {
                      props: {
                      },
                      style: {

                      },
                      class: 'iconfont icon-yikatong'
                    })]
                  break
                case 3:
                  text = [ h('span', {
                    props: {
                    },
                    class: 'iconfont icon-renlianshibie'
                  })
                  ]
                  break
                case 4:
                  text = [ h('span', {
                    props: {
                    },
                    class: 'iconfont icon-renlianshibie',
                    style: {
                      display: 'inline-block',
                      marginRight: ' 5px'
                    }
                  }),
                  h('span', {
                    props: {
                    },
                    style: {

                    },
                    class: 'iconfont icon-yikatong'
                  })]
                  break
              }
              return h('span', text)
            }
          }

        ],
        [
          {
            type: 'selection',
            width: 60,
            align: 'left'
          },
          {
            title: '序号',
            type: 'index',
            align: 'left',
            width: 60
          },
          {
            title: '通道名称',
            key: 'name',
            align: 'left',
            minWidth: 165
          },
          {
            title: 'IP地址',
            key: 'type',
            align: 'left',
            minWidth: 60,
            render: (h, params) => {
              let text = ''
              switch (params.row.type) {
                case 0:
                  text = '视频通道'
                  break
                case 1:
                  text = '报警输入'
                  break
                case 2:
                  text = '输出通道'
                  break
                case 3:
                  text = '对讲通道'
                  break
                case 4:
                  text = '门禁通道'
                  break
              }
              return h('span', text)
            }
          },
          {
            title: '所属设备',
            key: 'device',
            minWidth: 60,
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
            minWidth: 110,
            render: (h, params) => {
              let text = params.row.ip
              return h('span', text)
            }
          },
          {
            title: '通道号',
            key: 'chan',
            align: 'left',
            minWidth: 50
          },
          {
            title: '状态',
            key: 'monitortype',
            align: 'left',
            minWidth: 75,
            render: (h, params) => {
              let text = ''
              switch (params.row.monitortype) {
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
            title: '分析服务器',
            key: 'passway',
            minWidth: 65,
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
            title: '流地址',
            key: 'stream',
            align: 'left',
            minWidth: 60,
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
            title: '分析地址',
            key: 'rtsp',
            align: 'left',
            minWidth: 145,
            ellipsis: true,
            render: (h, params) => {
              let text = ''
              text = params.row.rtsp ? params.row.rtsp.main : '......'
              return h('span', {
                attrs: {
                  title: text
                }
              }, text)
            }
          },
          {
            title: '操作',
            key: 'action',
            minWidth: 160,
            align: 'center',
            render: (h, params) => {
              if (this.$BShasPower('BS-SETTING-FACE-CHANNEL-MANAGE')) {
                return h('div', [
                  h('Button', {
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
                        this.resActiceId = params.row._id
                        this.resEditOpen(this.resActiceId)
                      }
                    }
                  }, '编辑'),
                  h('Button', {
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
                        this.resSelectIds = [params.row._id]
                        this.createResDelModel()
                      }
                    }
                  }, '删除'),
                  h('Button', {
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
                        this.resSelectIds = [params.row._id]
                        this.resMoveOpen()
                      }
                    }
                  }, '移动')
                ])
              }
            }
          }
        ]
      ],
      devMoveModal: false, // 资源移动
      modifyOryId: '' // 修改移动组织机构的机构Id;
    }
  },
  computed: {
    ...mapGetters(['accessToken']),
    logoImgSrc: function() {
      return this.resEditFormData.url === '' ? '' : this.resEditFormData.url
    }
  },
  methods: {
    ...mapActions(['addPersonManagement', 'getPersonManagementList', 'deletePersonManagement', 'orgModify', 'getOneCard', 'getFaceBase']),
    // 导入
    resInput() {

    },
    // 导出
    resOutput() {
      console.log(this.$refs.personTable)
      this.$refs.personTable.exportCsv({
        filename: '人员信息'
      })
    },
    // 左侧菜单回调传值
    getDevicesDataClick(event) {
      this.orgId = event._id
      this.getListParams.orgId = event._id
      this.getPersonManagementListRender()
      console.log(event)
    },
    // 获取数据渲染表格
    getPersonManagementListRender() {
      this.getPersonManagementList(this.getListParams).then(res => {
        console.log(res)
        this.resourceTableData = res.data
        this.page.total = res.length
        this.resTabs[this.resActiveTab].number = res.length
      })
    },
    // 删除人员
    resDelPerson() {
      this.deletePersonManagement(this.deleteArr).then(res => {
        if (res) {
          this.getPersonManagementListRender()
        }
      })
    },
    // 修改人员信息
    resModifyOpen() {
      if (this.ModifyPerson.length === 0) {
        this.$Notice.error({
          title: '错误提示！',
          desc: '请选择需要修改人员'
        })
      } else if (this.ModifyPerson.length > 1) {
        this.$Notice.error({
          title: '错误提示！',
          desc: '一次只能修改一个人的信息'
        })
      } else {
        Object.assign(this.resEditFormData, this.ModifyPerson[0])
        delete this.resEditFormData.orgId
        delete this.resEditFormData.org
        delete this.resEditFormData.__v
        console.log(this.resEditFormData)
        this.isEdit = true
        this.resAddModal = true
      }
    },
    selectChannelName(event) {
      console.log(this.getListParams)
      this.getListParams.type = event
      this.getPersonManagementListRender()
    }, // 同步状态
    selectBatchStream(event) {
      this.getListParams.guard = event
      this.getPersonManagementListRender()
    }, // 搜索类型
    seekResData() {
      this.getPersonManagementListRender()
    }, // 搜索
    showChildRefresh() {
      this.getPersonManagementListRender()
    },
    selectResRow(event) {
      this.deleteArr = []
      this.ModifyPerson = []
      event.forEach(item => {
        this.deleteArr.push(item._id)
        this.ModifyPerson.push(item)
      })
    },
    pageSizeChange(event) {
      this.getListParams.pageSize = event
      this.getPersonManagementListRender()
    },
    changeResPage(event) {
      this.getListParams.pageNum = event
      this.getPersonManagementListRender()
    },
    resAddOpen() {
      this.resAddModal = true
      this.isEdit = false
      this.resEditFormData = {
        orgId: '',
        name: '',
        sex: '',
        uid: '',
        phone: '',
        type: '',
        url: ''
      }
    },
    resDelOpen() {},
    resMoveOpen() {
      this.devMoveModal = true
    },
    resTableFresh() {
      this.getPersonManagementListRender()
    },
    // 弹窗窗关闭
    resAddCancel() {
      this.resAddModal = false
      this.isEdit = false // 数据保存成功后将是否修改false;
    },

    resAddSave() {
      this.modalloading = true
      this.resEditFormData.orgId = this.orgId
      this.addPersonManagement({param: this.resEditFormData, isEdit: this.isEdit}).then(res => {
        this.isEdit = false // 数据保存成功后将是否修改false;
        this.modalloading = false
        this.getPersonManagementListRender()
        this.resAddModal = false
      }).catch(err => {

      })
    },
    resTabClick(event) {
      this.resActiveTab = event.index
      // console.log(this.resTabs[this.resActiveTab])
      // this.resTabs.map(item=>{
      //   item.active = false;
      // });
      // this.resTabs[event.index].active = true;
    },
    // 移动弹窗选择机构传值
    selectMoveOrg(event) {
      this.modifyOryId = event._id
      console.log(this.ModifyPerson)
    },
    // 移动弹窗选择回调
    resMoveSave() {
      this.orgModify({org: this.modifyOryId, _id: this.ModifyPerson[0]._id}).then(res => {
        if (res) {
          this.successMsg('移动成功')
          this.devMoveModal = false
          this.getPersonManagementListRender()
        }
      }).catch(err => {
        this.$Notice.error({
          title: '错误提示！',
          desc: err
        })
      })
    },
    // 用户同步
    resTablegetOneCard() {
      this.getOneCard().then(res => {
        if (res) {
          this.successMsg('同步成功')
        }
      }).catch(err => {
        this.$Notice.error({
          title: '错误提示！',
          desc: err
        })
      })
    }
  },
  created() {
    //      this.route = this.$route.path;
    //      this.headerObj.Authorization = `Bearer ${this.accessToken}`;
    this.getFaceBase().then(res => {
      console.log(res)
      this.authorityArray = res.list.whitelists
    })
  },
  mounted() {

  },
  beforeDestroy() {

  }
}
</script>
<style scoped>
  .container {
    width: 100%;
    height: auto;
    position: relative;
    display: flex;
  }

  .sidebar {
    width: 100%;
    height: 100%;
  }

  .sidebar > a {
    display: block;
    height: 38px;
    line-height: 38px;
    font-size: 14px;
    color: #fff;
    padding-left: 20px;
    background-color: #0f2243;
    text-align: center;
  }

  .tree-org {
    height: 100%;
  }
  .tree-org ul{
    width:100%;
    height: 100%;
    overflow-y: auto;
  }
  .tree-org ul li{
    width:100%;
    height: 34px;
    line-height: 34px;
    text-align: left;
    padding-left: 35px;
    cursor: pointer;
  }
  .tree-org ul li:hover{
    color: #2d8cf0;
  }
  .tree-org ul li:active{
    color:#2d8cf0
  }
  .config-list li {
    position: relative;
    cursor: pointer;
    border-bottom: 1px solid #5d5d5d;
    font-size: 14px;
    color: #80848f;
    border-right: 2px solid transparent;
  }

  .config-list li:hover {
    color: #fff;
  }

  .sidebar > .config-list > .active {
    color: #2d8cf0;
    border-right: 2px solid #2d8cf0;
    background-color: #444;
    z-index: 2;
  }

  li > div {
    padding: 14px 40px;
  }

  .bs-main {
    padding: 0;
    background-color: #1c3053;
    overflow: hidden;
  }

  .resource-right-table {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .resource-right-table .table-header{
    height: 100%;
    display:flex;
    flex-direction: column;
  }
  .resource-right {
    height: 100%;
  }

  /*按钮和inpu框*/

  .table-header-actions {
    /* height: 50px; */
    margin: 12px 10px 12px 12px;
    background-color: #1c3054;
  }

  /*按钮和inpu框*/

  .actions-btn {
    float: left;
    /* margin-top: 10px; */
  }
  .actions-btn span span{
    display: inline-block;
    margin: 0 10px;
  }
  .actions-search {
    float: right;
    display: flex;
    width: 550px;
    justify-content: flex-end;
    /* margin-top: 9px; */
  }
  .actions-search div{
    margin-right: 5px;
  }
  .actions-btn .ivu-btn {
    margin-right: 8px;
  }

  .actions-btn .ivu-select {
    margin-right: 8px;
  }

  /* table样式 */

  .table-relative {
    position: relative;
    flex: 1;
  }

  .table-body {
    position: absolute;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  /*修改弹出框内容样式*/

  .res-add-model {
    padding: 0px 10px;
  }

  .res-edit-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    height:100%;

  }
  .res-edit-form  .table-header{
    width: 100%;
    height: 100%;
    display:flex;
    flex-direction: column;
  }
  .res-edit-form .check-input .ivu-col-span-8 {
    width: 100px;
    height: 32px;
    line-height: 32px;
  }

  .res-edit-form .check-input .ivu-col-span-16 {
    width: calc(100% - 100px);
    height: 56px;
  }

  .formTip {
    display: inline-block;
    color: red;
    height: 24px;
    line-height: 24px;
  }

  .check-input .ivu-col-span-16 input {
    display: inline-block;
    width: 100%;
    height: 32px;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 12px;
    border: 1px solid #5676a9;
    border-radius: 4px;
    color: #ffffff;
    background-color: #1c3053;
    cursor: text;
    outline: none;
  }

  .check-input .ivu-col-span-16 input:hover {
    border: 1px solid #33b7e9;
  }

  .check-input .ivu-col-span-16 input:focus {
    border: 1px solid #33b7e9;
  }

  .check-input .ivu-col-span-16 .redBorder {
    border: 1px solid red;
  }

  .check-input .ivu-col-span-16 .redBorder:hover {
    border: 1px solid red;
  }

  .check-input .ivu-col-span-16 .redBorder:focus {
    border: 1px solid red;
  }
  .check-input .redBorderDis {
    cursor: not-allowed;
  }
  .check-input .redBorderDis:hover {
    cursor: not-allowed;
  }

  .res-model-tree {
    height: 600px;
    width: 1000px;
    margin-top: 20px;
    overflow: hidden;
    display: flex;
  }

  .clear:after {
    content: '';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .content-right {
    margin-left: 80px;
    width: 180px;
  }
  .user-logo {
    width: 130px;
    height: 130px;
    border: 1px dashed #fff;
  }

  .user-logo img {
    width: 100%;
    height: 100%;
  }
</style>
