
<template>
  <div class="container">
    <Row class="bs-content">
      <div class="bs-left">
        <div class="sidebar">
          <a >权限组 <span class="iconfont icon-get-change" style="float: right" @click="synchronizationSet"></span></a>

          <div class="tree-org">
            <ul>
              <li v-for="item,index in authorityArray" @click="choseAccessControlAuthority(item,index)" :class="{active:activeAccessTab==index}">{{item.name}}</li>
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
              <div class="res-model-tree" >
                <div class="res-edit-form">
                  <div class="table-header">
                     <TableTab @on-tab-click="resTabClick" :tabs="resTabs" :isCount="false"></TableTab>
                    <div class="table-header-actions clear" v-if="resActiveTab==0">
                      <div class="actions-search">
                        <Input placeholder="请输入姓名或人员编号" style="width: 220px" v-model="filterKey" @keyup.enter.native="seekResData()">
                          <Button slot="append" @click="seekResData()">搜索</Button>
                        </Input>
                      </div>
                      <!--            </div>-->
                    </div>
                    <div class="table-relative" ref="tableBox1">
                      <div class="table-body table-cover" v-if="resActiveTab==0">
                        <Table size="small" :columns="resColumns[1]"   :data="resourceTableDataAdd" :highlight-row="true" @on-selection-change="selectResRowAdd" width="100%"></Table>
                      </div>

                      <div  class="table-body table-cover" v-if="resActiveTab==1">
                        <Tree :data="data4" show-checkbox multiple  @on-check-change="orgAddPerson"></Tree>
                      </div>
                    </div>
                    <div class="table-footer" v-if="resActiveTab==0">
                      <div style="float: right;">
<!--                        <Page show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :total="page.total" :current="page.current" :page-size="page.pageSize" show-total show-elevator @on-change="changeResPage"></Page>-->
                        <Page show-sizer :page-size-opts="$PageInfo.size" :placement="'top'" @on-page-size-change="pageSizeChange" :total="pageAdd.total" :current="pageAdd.current" :page-size="pageAdd.pageSize" show-total show-elevator @on-change="changeResPage"></Page>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div slot="footer">
              <Button type="ghost" @click="resAddCancel">取消</Button>
              <Button type="primary" @click="resAddSave" >确认</Button>
            </div>
          </Modal>
        </div>

        <div class="resource-right-table">
          <div class="table-header">
            <!--            <TableTab @on-tab-click="resTabClick" :tabs="resTabs" :isCount="true"></TableTab>-->
            <div class="table-header-actions clear">
              <div class="actions-btn">
                <Button  type="ghost" icon="plus" @click="resAddOpen"   >添加</Button>
                <Button  type="ghost" icon="trash-a" @click="resDelPerson"   :disabled="selectResRowData.length<1">删除</Button>
                <Button  type="ghost" icon="trash-a" @click="resMoveOpen"   :disabled="selectResRowData.length<1">移动</Button>
                <Button  type="ghost" icon="trash-a" @click="synchronizationSet"  >同步</Button>
                <Button  type="ghost" icon="edit" @click="resModifyOpen" >刷新</Button>
              </div>
              <div class="actions-search">
                <Input placeholder="请输入姓名、人员编号或人员卡号" style="width: 250px" v-model="filterKey" @keyup.enter.native="seekResData()">
                  <Button slot="append" @click="seekResData()">搜索</Button>
                </Input>
              </div>
              <!--            </div>-->
            </div>
            <div class="table-relative" ref="tableBox">
              <div class="table-body table-cover">
                <Table size="small" :columns="resColumns[0]" :height="tableHeight"  :data="resourceTableData" :highlight-row="true" @on-selection-change="selectResRow" width="100%"></Table>
              </div>
            </div>
            <div class="table-footer">
              <div style="float:left;">
                <Button  @click="deleteAllPermissionFuc">全部删除</Button>
              </div>
              <div style="float: right;">
                <Page show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :total="page.total" :current="page.current" :page-size="page.pageSize" show-total show-elevator @on-change="changeResPage"></Page>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 资源移动弹出框 -->
      <div >
        <Modal :mask-closable="false" v-model="devMoveModal" title="人员移动" width="300">
          <div class="res-add-model"  >
            <div class="res-model-tree" style="height: 400px;overflow-y: auto;width:100%">
              <ul>
                <li v-for="item,index in authorityArray" @click="choseAccessControlAuthorityMove(item,index)" :class="{active:activeAccessTabMove==index}">{{item.name}}</li>
              </ul>
            </div>
          </div>
          <div slot="footer">
            <Button type="ghost" @click="devMoveModal=false">取消</Button>
            <Button type="primary" @click="resMoveSave">确认</Button>
          </div>
        </Modal>
      </div>

      <!-- 文件上传进度条 -->
      <div >
        <Modal :mask-closable="false" v-model="progressModal" :title="importTitle"  width="450">
          <div class="res-add-model"  >
            <div  style="height: 100px;width: 100%;line-height: 100px;">
              <Progress :percent="percentPer" v-show="importTitle==='导入进度'"/>
              <div style="width: 100%;height:40px;display: flex;justify-content:flex-start " v-show="importTitle==='导入结果'">
                <div style="padding-right:20px;line-height: 40px">
                  <b>全部数据：</b>
                  <b>{{importSaveData.successLength+importSaveData.failLength}}</b>
                </div>
                <div style="padding-right:20px;;line-height: 40px">
                  <b>导入成功：</b>
                  <b>{{importSaveData.successLength}}</b>
                </div>
                <div style="padding-right:20px;;line-height: 40px">
                  <b>导入失败：</b>
                  <b>{{importSaveData.failLength}}</b>
                </div>
              </div>
<!--              <div style="width: 100%;height:40px;display: flex;justify-content:flex-start " v-show="importTitle==='导入结果'">-->
<!--                <Button type="ghost"  @click="downLoadImportFile">下载导入结果</Button>-->
<!--              </div>-->
            </div>
          </div>
          <div slot="footer">
            <Button type="ghost" @click="importTitle='导入结果'" v-show="importTitle==='导入进度'">取消</Button>
            <Button type="primary" @click="progressModal=false" v-show="importTitle==='导入结果'">确认</Button>
          </div>
        </Modal>
      </div>
    </Row>
  </div>
</template>
<script>
import BStreeNewBox from '../../../components/BStreeNew/BStreeNewBox'
import TableTab from '../../settings/equipment/tableTab'
import { mapState, mapActions, mapGetters } from 'vuex'
import accessControlAuthorityStatus
  from '../../../store/modules/passageModule/adhibition/accessControlAuthorityStatus'
// import { save } from '../../../../storage'
// import './facePage/tree.css'
export default {
  name: 'accessControlAuthority',
  components: {
    BStreeNewBox,
    TableTab
  },
  data() {
    return {
      importSaveData: {
        successLength: 0,
        failLength: 0,
        success: [],
        fail: []
      },
      percentPer: 10,
      tableHeight: 435,
      progressModal: false, // 文件上传进度条弹窗
      importTitle: '导入进度', // 文件上传进度弹窗title
      orgAddPersonArr: [], // 已选中的树形机构
      devMoveModal: false, // 移动弹窗
      permissionId: '', // 选中的权限组id
      MovepermissionId: '', // 移动选中的权限组id
      orginPermissionOrgSecendCoun: 0, // 递归函数加载次数
      activeAccessTabMove: 0, // 移动弹框选中
      activeAccessTab: 0,
      data4: [

      ],
      headerObj: { Authorization: '' },
      page: {
        total: 0,
        current: 1,
        pageSize: this.$PageInfo.limit
      },
      pageAdd: {
        total: 0,
        current: 1,
        pageSize: this.$PageInfo.limit
      },
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
            title: '人员编号',
            key: 'uid',
            align: 'left',
            minWidth: 165
          },
          {
            title: '姓名',
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
            title: '卡号',
            key: 'card',
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
          }
        ],
        [
          {
            type: 'selection',
            width: 60,
            align: 'left'
          },

          {
            title: '人员编号',
            key: 'uid',
            align: 'left',
            minWidth: 165
          },
          {
            title: '姓名',
            key: 'name',
            align: 'left',
            minWidth: 165
          },
          {
            title: '性别',
            key: 'sex',
            align: 'left',
            minWidth: 60,
            render: (h, params) => {
              let text = ''
              if (params.row.sex === 1) {
                text = '男'
              } else {
                text = '女'
              }
              return h('span', text)
            }
          },
          {
            title: '卡号',
            key: 'card',
            minWidth: 60,
            align: 'left'
          },
          {
            title: '组织',
            key: 'orgName',
            align: 'left',
            minWidth: 110
          }
        ]
      ],
      resActiveTab: 0,
      resAddModal: false,
      ModifyPerson: false,
      getListParams: {
        pageNum: 1,
        pageSize: this.$PageInfo.limit,
        permissionId: '',
        keyWord: '', // 关键字搜索姓名或人员编号
        type: 'have'
      },
      selectResRowData: [], // 选中的表格数据
      selectResRowDataAdd: [], // 新增弹框选中的表格数据
      filterKey: '' // 搜索关键字

    }
  },
  computed: {
    ...mapState(
      {
        authorityArray: ({accessControlAuthorityStatus}) => accessControlAuthorityStatus.authorityArray,
        resourceTableData: ({accessControlAuthorityStatus}) => accessControlAuthorityStatus.resourceTableData,
        resourceTableDataAdd: ({accessControlAuthorityStatus}) => accessControlAuthorityStatus.resourceTableDataAdd
      }
    ),
    ...mapGetters(['accessToken'])

  },
  methods: {
    ...mapActions([
      'accessControlAuthority', // 权限组集合列表
      'getAuthorityPensonList', // 人员列表
      'AuthorityasyncPermission', // 同步
      'PermissionOrg',
      'deletePermissionUser', // 删除权限组与人
      'movePermissionUser', // 移动权限组与人
      'addPermissionUser', // 增加权限组与人
      'addPermissionGroup', // 增加权限组与人
      'deleteAllPermission'
    ]),

    // 点击左侧权限列表选中
    choseAccessControlAuthority(event, index) {
      this.activeAccessTab = index
      this.getListParams.permissionId = event._id
      this.getListParams.type = 'have'
      this.permissionId = event._id
      this.getAuthorityPeopleListRender()
    },
    // 获取权限组列表
    getaccessControlAuthorityListRender() {
      this.accessControlAuthority('').then(res => {
        if (res) {
          this.getListParams.permissionId = res.data[0]._id
          this.permissionId = res.data[0]._id
          this.getAuthorityPeopleListRender()
        }
      })
    },
    // 同步门禁权限结合
    synchronizationSet() {
      // this.AuthorityasyncPermission('').then(res => {
      //   if (res) {
      //     this.successMsg('获取成功')
      //     this.getaccessControlAuthorityListRender()
      //   }
      // })
      this.asyncPermissionConfirm()
    },
    // 同步门禁权限结合弹框
    asyncPermissionConfirm() {
      this.$Modal.confirm({
        title: '',
        content: '<p>确认重新获取权限组？</p>',
        onOk: () => {
          this.AuthorityasyncPermission('').then(res => {
            if (res.code === 200) {
              this.successMsg('获取成功！')
              this.getaccessControlAuthorityListRender()
            } else {
              this.errorMsg('获取失败！')
              this.getaccessControlAuthorityListRender()
            }
          })
        },
        onCancel: () => {
          // this.$Message.info('Clicked cancel');
        }
      })
    },
    // 获取权限组列表
    getAuthorityPeopleListRender() {
      this.getAuthorityPensonList(this.getListParams).then(res => {
        if (res) {
          // this.getaccessControlAuthorityListRender()
          if (this.getListParams.type == 'have') {
            this.page.total = res.length
          } else {
            this.pageAdd.total = res.length
          }
        }
      })
    },
    // 删除人员
    resDelPerson() {
      var delData = []
      this.selectResRowData.forEach(item => {
        delData.push(item._id)
      })
      this.deletePermissionUser({userId: delData, permissionId: this.permissionId}).then(res => {
        if (res) {
          this.successMsg('删除成功')
          this.getAuthorityPeopleListRender()
        }
      })
    },
    // 移动人员
    choseAccessControlAuthorityMove(event, index) {
      this.MovepermissionId = event._id
      this.activeAccessTabMove = index
    },
    // 移动弹窗选择回调
    resMoveSave() {
      var data = {
        permissionOldId: this.permissionId,
        permissionNewId: this.MovepermissionId,
        userId: this.selectResRowData.map((item) => {
          return item._id
        })
      }
      this.movePermissionUser(data).then(res => {
        if (res) {
          this.devMoveModal = false
          this.successMsg('移动成功')
          this.getAuthorityPeopleListRender()
        }
      })
    },
    // 修改人员信息
    resModifyOpen() {
    },
    selectChannelName(event) {

    }, // 同步状态
    selectBatchStream(event) {

    }, // 搜索类型
    seekResData() {
      this.getListParams.keyWord = this.filterKey
      this.getAuthorityPeopleListRender()
    }, // 搜索
    showChildRefresh() {

    },
    selectResRow(event) {
      this.selectResRowData = event
    },
    selectResRowAdd(event) {
      this.selectResRowDataAdd = event
    },
    pageSizeChange(event) {
      this.getListParams.pageSize = event
      this.getAuthorityPeopleListRender()
    },
    changeResPage(event) {
      this.getListParams.pageNum = event
      this.getAuthorityPeopleListRender()
    },
    resAddOpen() {
      this.resAddModal = true
      this.getListParams.type = 'not'
      this.getListParams.permissionId = this.permissionId

      this.getAuthorityPeopleListRender()
    },
    resDelOpen() {},
    resMoveOpen() {
      this.devMoveModal = true
    },
    resTableFresh() {

    },
    // 弹窗窗关闭
    resAddCancel() {
      this.getListParams.type = 'have'
      this.resAddModal = false
    },
    // 删除全部门禁权限
    deleteAllPermissionFuc() {
      this.deleteAllPermission('').then(res => {
        if (res) {
          this.successMsg('删除成功')
          this.getaccessControlAuthorityListRender()
        }
      })
    },

    resAddSave() {
      let timer = setInterval(() => {
        if (this.percentPer < 80) {
          this.percentPer++
        }
      }, 1000)
      if (this.resActiveTab == 0) {
        var saveData = {
          permissionId: this.permissionId,
          userId: this.selectResRowDataAdd.map(item => { return item._id })
        }
        if (saveData.userId.length == 0) {
          this.errorMsg('请选择需要增加权限的人员')
          return
        }
        this.progressModal = true // 显示进度条弹窗

        this.addPermissionUser(saveData).then(res => {
          if (res) {
            clearInterval(timer)
            this.percentPer = 100
            this.importSaveData.successLength = res.success
            this.importSaveData.failLength = res.failure
            this.successMsg('增加成功')
            this.getListParams.type = 'have'
            this.getAuthorityPeopleListRender()
            this.resAddModal = false
          }
        })
      } else {
        this.progressModal = true // 显示进度条弹窗
        let org = this.orgAddPersonArr.map(item => { return item.obj._id })
        console.log(this.orgAddPersonArr)
        let permissionId = this.permissionId
        this.addPermissionGroup({org: org, permissionId: permissionId}).then(res => {
          if (res) {
            this.successMsg('增加成功')
            clearInterval(timer)
            this.percentPer = 100
            this.importSaveData.successLength = res.success ? res.success : 0
            this.importSaveData.failLength = res.failure ? res.failure : 0
            this.getListParams.type = 'have'
            this.getAuthorityPeopleListRender()
            this.resAddModal = false
          }
        })
      }
    },
    resTabClick(event) {
      // expand: true,
      //   selected: true,
      //   children:
      this.resActiveTab = event.index
    },

    // 移动弹窗选择机构传值
    selectMoveOrg(event) {

    },

    // 选中树结构中机构
    orgAddPerson(event) {
      console.log(event)
      this.orgAddPersonArr = event
    },
    // 递归得出人员机构
    async orginPermissionOrgs() {
      let oneData = await this.PermissionOrg({orgtype: 10})
      oneData.forEach(async(item) => {
        var obj = {
          loading: false,
          expand: true,
          children: []
        }
        obj['title'] = item.name
        obj['obj'] = item
        obj['children'] = await this.orginPermissionOrgSecend(item)
        this.data4 = []
        this.data4.push(obj)
      })
    },
    async orginPermissionOrgSecend(obj) {
      if (!obj._id || this.orginPermissionOrgSecendCoun > 2) { return } // 如果没有下级了，返回；
      var secendData = await this.PermissionOrg({oid: obj._id})
      var daSecend = []
      secendData.forEach(async(item) => {
        var obj = {
          loading: false,
          expand: true,
          children: []
        }
        obj['title'] = item.name
        obj['obj'] = item
        obj['children'] = await this.orginPermissionOrgSecend(item)
        daSecend.push(obj)
      })
      return daSecend
    },
    resizefun() {
      this.tableHeight = this.$refs['tableBox'].offsetHeight
    }
  },
  created() {
    this.route = this.$route.path
    this.headerObj.Authorization = `Bearer ${this.accessToken}`
    this.getaccessControlAuthorityListRender()
    this.orginPermissionOrgs()
  },
  mounted() {
    console.log(this.authorityArray)
    this.tableHeight = this.$refs['tableBox'].offsetHeight
    console.log(this.tableHeight)
    window.addEventListener('resize', this.resizefun)
    this.permissionId = this.authorityArray[0]._id
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizefun)
    this.resizefun = null
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
  .tree-org ul .active{
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
  .res-model-tree ul{
    width: 100%;
  }
 .res-model-tree ul li{
   width: 100%;
   height:40px;
   line-height: 40px;
   padding-left:25px;
   cursor: pointer;
 }
  .res-model-tree ul .active{
    background: #1D8CE0;
  }
  .res-model-tree ul li:hover{
    background: #1D8CE0;

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
