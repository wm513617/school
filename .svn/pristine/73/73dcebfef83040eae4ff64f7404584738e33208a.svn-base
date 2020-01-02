<template>
  <div class="orgConfig">
    <div class="bs-left">
      <TreeBox ref="treebox" :iconToggle="false" :searchToggle="true" :searchType="0" :equipmentToggle="false" :resourceToggle="false" :btnGroup="true" :orgType="11" :resType="[0]" @clickData="handleNode" @getOrgData="(data)=>{formData = { code: data.code, name: data.name }}" @delData="delDataClick" >
        <template slot="dialog" slot-scope="orgName">
        <el-dialog class="dialog" width="400px" :visible="orgName.visible" @close="orgCancel" :title="orgName.title">
          <el-form :model="formData" label-position="left" label-width="100px" ref="orgFormData" :rules="orgFormRole">
            <el-fotmitem label="上级机构">
              <div class="ivu-form-item-content-span">{{orgName.orgName}}</div>
            </el-fotmitem>
            <el-fotmitem label="机构编号" prop="code">
              <el-input v-model="formData.code" placeholder="范围：0-65535" :maxlength="5" size="small"></el-input>
            </el-fotmitem>
            <el-fotmitem label="机构名称" prop="name">
              <el-input v-model="formData.name" :maxlength="16" size="small"></el-input>
            </el-fotmitem>
          </el-form>
          <div slot="footer">
            <el-button type="ghost" @click="orgCancel" size="small">取消</el-button>
            <el-button type="primary" @click="orgSave" size="small">确认</el-button>
          </div>
        </el-dialog>
        </template>
      </TreeBox>
    </div>
    <div class="bs-mains">
      <div class="feature-btn">
        <Button type="ghost" icon="plus" :disabled="orgName.isroot" @click="openAddMod">添加</Button>
        <Button type="ghost" icon="trash-a" @click="deleteVehicle">删除</Button>
        <Button type="ghost" icon="refresh" @click="refrashData">刷新</Button>
        <Button type="ghost" icon="ivu-icon iconfont icon-import"  :disabled="orgName.isroot" @click="openImport">导入</Button>
        <!-- <Upload class="import" action=''  name="file" :format="['xls','xlsx']" :on-success="uploadSuc" :on-error="uploadError" :on-format-error="formatError">
        </Upload> -->
        <Button type="ghost" icon="ivu-icon iconfont icon-export" @click="exportFile">导出</Button>
        <div class="search-box">
          <Input v-model="searchVal" placeholder="请输入姓名或车牌号" style="width: 200px;"></Input>
          <Select v-model="searchState" style="width: 200px;margin-left:8px;">
            <Option v-for="(item, index) in stateList" :key="item" :value="index">{{item}}</Option>
          </Select>
          <Button type="ghost" icon="search" style="margin-left:8px;" @click="searchVehicle">搜索</Button>
        </div>
      </div>
      <div style="height: calc(100% - 44px);" ref="tableBox1" v-resize="changeTable">
        <Table size="small" style="height: calc(100% - 40px);" :columns="column" :data="vehicleList" @on-selection-change="selectChange" :height="tableHeight"></Table>
        <div class="table-footer">
          <div style="float:right;">
            <Page show-sizer :page-size-opts="$PageInfo.size" :show-total="true" :show-elevator="true" :page-size="pageLimit" :current="pageCur" @on-page-size-change="pageSizeChange" :total="pageTotal" @on-change="pageChange"></Page>
          </div>
        </div>
      </div>
      <!-- 添加、编辑弹框 -->
      <div v-if="isOpenAddMod">
        <vehicleAddModal :model="isOpenAddMod" :orgName="orgName" :type="isAdd" :vehicleInfo="vehicleInfo" @close="isOpenAddMod = false"></vehicleAddModal>
      </div>
      <!-- 详情弹框 -->
      <Modal id="detailModal" v-model="isOpenDetail" :width="650" title="机动车详情">
        <!-- <div slot="close" class="closeBtn">
          <Icon type="ios-printer-outline" class="printBtn" @click.stop="printDetail"></Icon>
          <Icon type="ios-close-empty" @click.stop="isOpenDetail = false"></Icon>
        </div> -->
        <div class="detailInfo">
          <Form v-model="detailInfo" label-position="left" :label-width="80" style="width:300px;margin-right:60px;">
            <FormItem label="所有人信息"></FormItem>
            <FormItem label="单位">
              <span>{{orgName.name}}</span>
            </FormItem>
            <FormItem label="姓名">
              <span>{{detailInfo.name}}</span>
            </FormItem>
            <FormItem label="性别">
              <span>{{detailInfo.gender ? '女' : '男'}}</span>
            </FormItem>
            <FormItem label="人员编号">
              <span>{{detailInfo.code}}</span>
            </FormItem>
            <FormItem label="车牌号码">
              <span>{{detailInfo.plateNo}}</span>
            </FormItem>
            <FormItem label="联系电话">
              <span>{{detailInfo.tel}}</span>
            </FormItem>
            <FormItem label="有效期">
              <span>{{detailInfo.time}}</span>
            </FormItem>
            <FormItem label="备注">
              <span>{{detailInfo.remark ? detailInfo.remark : '无'}}</span>
            </FormItem>
          </Form>
          <Form v-model="detailInfo" label-position="left" :label-width="85" style="flex: 1;">
            <FormItem label="驾驶员照片"></FormItem>
            <div style="margin-bottom: 12px;">
              <img :src="detailInfo.driverPic1" class="picture" v-if="detailInfo.driverPic1">
              <img :src="detailInfo.driverPic2" class="picture" v-if="detailInfo.driverPic2">
              <img :src="detailInfo.driverPic3" class="picture" v-if="detailInfo.driverPic3">
            </div>
          </Form>
        </div>
        <div slot="footer"></div>
      </Modal>
      <!-- 导入弹框 -->
      <Modal v-model="isOpenImport" class="import-box" :width="400" title="导入" :closable="false" :mask-closable="false">
        <Form label-position="left" :label-width="80">
          <FormItem label="文件">
            <Input v-model="importFileName">
              <Upload slot="append" action='/api/upload/file?type=image&category=motorDriverTemp' :show-upload-list="false"  name="file" :format="['xls','xlsx']" :on-success="uploadExcelSuc" :on-error="uploadError" :on-format-error="formatError">
                <span style="cursor: pointer;">选择</span>
              </Upload>
            </Input>
          </FormItem>
          <FormItem label="">
            <Button type="ghost" icon="ivu-icon iconfont icon-xiazai" @click="exportTemplate">模板下载</Button>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="ghost" @click="isOpenImport = false">取消</Button>
          <Button type="primary" @click="sureImport" :loading="importLoad">保存</Button>
        </div>
      </Modal>
      <Modal v-model="isOpenImportTips" :width="400" title="导入">
        <div style="text-align:center;font-size:14px;">
          <p>成功 {{importResult.successCount}} 条</p>
          <p>失败 {{importResult.errorCount}} 条</p>
        </div>
        <div slot="footer">
          <Button type="primary" @click="isOpenImportTips = false">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import TreeBox from '../../../../components/BStreeNew/BStreeNewBox'
import vehicleAddModal from './vehicleAddModal'
import addOrg from './addOrg'
import { mapActions } from 'vuex'
export default {
  mixins: [addOrg],
  components: {
    TreeBox,
    vehicleAddModal
  },
  data() {
    return {
      tableHeight: 0,
      stateList: ['全部', '正常', '过期'],
      selecteData: [],
      searchVal: '',
      searchState: 0,
      pageLimit: this.$PageInfo.limit,
      pageTotal: 0,
      pageCur: 1,
      isOpenAddMod: false, // 控制添加弹框显示
      orgName: {},
      column: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          type: 'index',
          width: 100,
          align: 'center'
        },
        {
          title: '人员编号',
          key: 'code',
          width: 120,
          align: 'center',
          render: (h, param) => {
            return h('span', param.row.code)
          }
        },
        {
          title: '姓名',
          key: 'name',
          width: 120,
          align: 'center',
          ellipsis: true
        },
        {
          title: '性别',
          key: 'gender',
          width: 120,
          align: 'center',
          render: (h, param) => {
            return h('span', param.row.gender ? '女' : '男')
          }
        },
        {
          title: '联系电话',
          key: 'tel',
          align: 'center',
          ellipsis: true
        },
        {
          title: '车牌号',
          key: 'plateNo',
          align: 'center',
          ellipsis: true,
          render: (h, param) => {
            return h('span', param.row.plateNo)
          }
        },
        {
          title: '状态',
          key: 'state',
          align: 'center',
          ellipsis: true,
          render: (h, param) => {
            return h('span', param.row.state ? '过期' : '正常')
          }
        },
        {
          title: '备注',
          key: 'remark',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small'
                },
                style: {
                  marginRight: '8px'
                },
                on: {
                  click: () => {
                    let detailInfo = JSON.parse(JSON.stringify(params.row))
                    let startTime = params.row.startTime ? this.$moment(params.row.startTime * 1000).format('YYYY-MM-DD') : ''
                    let endTime = params.row.endTime ? this.$moment(params.row.endTime * 1000).format('YYYY-MM-DD') : ''
                    if (startTime && endTime) {
                      detailInfo.time = startTime + '至' + endTime
                    } else {
                      detailInfo.time = ''
                    }
                    this.detailInfo = detailInfo
                    this.isOpenDetail = true
                  }
                }
              }, '详情'),
              h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small'
                },
                style: {
                  marginRight: '8px'
                },
                on: {
                  click: () => {
                    this.isAdd = false
                    this.vehicleInfo = JSON.parse(JSON.stringify(params.row))
                    this.isOpenAddMod = true
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '提示',
                      content: '<p>确认删除吗？</p>',
                      onOk: () => {
                        this.deleteMotorVehicle(params.row._id).then(() => {
                          this.successMsg('删除成功')
                          this.getvehicleList()
                        }).catch(() => {
                          this.errorMsg('删除失败')
                        })
                      },
                      onCancel: () => {}
                    })
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      vehicleList: [],
      isAdd: true, // true 添加  false 编辑
      vehicleInfo: null,
      detailInfo: {
        MotorVehiclesInfos: {},
        indentityInfo: {}
      },
      isOpenDetail: false, // 详情框
      orgId: '',
      isOpenImport: false, // 点击导入 弹出导入弹框
      importFileName: '',
      importImgName: '',
      resFileName: '', // upload成功 返回的文件名
      importResult: {
        errorCount: 0,
        successCount: 0
      },
      importLoad: false,
      isOpenImportTips: false // 导入成功失败数量提示框
    }
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox1'].offsetHeight - 40
  },
  methods: {
    ...mapActions(['getMotorVehicle', 'deleteMotorVehicle', 'exportMotorVehicle', 'ImportMotorVehicle', 'deleteMotorVehicleOrg']),
    getvehicleList() {
      console.log('搜索', this.searchState)
      let state
      switch (this.searchState) {
        case 1:
          state = 0
          break
        case 2:
          state = 1
          break
        default:
          state = ''
          break
      }
      const data = {
        page: this.pageCur,
        limit: this.pageLimit,
        orgId: this.orgId,
        state: state,
        condition: this.searchVal
      }
      this.getMotorVehicle(data).then(res => {
        this.vehicleList = res.data
        this.pageTotal = Number(res.headers['x-bsc-count'])
      }).catch(err => {
        console.log(err)
        this.errorMsg('获取电动车数据失败')
      })
    },
    selectChange(selection) {
      this.selecteData = selection
    },
    handleNode(node) {
      this.orgName = {name: node.name, id: node._id, isroot: node.isroot}
      this.orgId = node.isroot ? '' : node._id
      this.searchState = 0
      this.searchVal = ''
      this.getvehicleList()
    },
    delDataClick(node) {
      this.deleteMotorVehicleOrg(node._id).catch(() => {
        this.errorMsg('该机构下设备失败')
      })
    },
    // 添加
    openAddMod() {
      this.isAdd = true
      this.isOpenAddMod = true
    },
    deleteVehicle() {
      if (this.selecteData.length === 0) {
        this.warningMsg('请勾选要删除的信息')
        return
      }
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除吗？</p>',
        onOk: () => {
          this.sureDeleteVehicle()
        },
        onCancel: () => {}
      })
    },
    // 删除
    sureDeleteVehicle() {
      const ids = this.selecteData.map(item => {
        return item._id
      }).join(',')
      this.deleteMotorVehicle(ids).then(() => {
        this.successMsg('删除成功')
        this.getvehicleList()
      }).catch(() => {
        this.errorMsg('删除失败')
      })
    },
    // 刷新
    refrashData() {
      this.pageCur = 1
      this.searchState = 0
      this.searchVal = ''
      this.getvehicleList()
    },
    searchVehicle() {
      this.pageCur = 1
      this.orgId = ''
      this.getvehicleList()
    },
    exportFile() {
      if (this.selecteData.length === 0) {
        this.warningMsg('请勾选需要导出的信息')
        return
      }
      const ids = this.selecteData.map(item => {
        return item._id
      }).join(',')
      let elemIF = document.getElementById('dow')
      if (!elemIF) {
        elemIF = document.createElement('iframe')
        elemIF.id = 'dow'
        elemIF.style.display = 'none'
        document.body.appendChild(elemIF)
      }
      elemIF.src = window.location.origin + `/api/MotorVehicle/download?ids=${ids}`
    },
    // 模板下载
    exportTemplate() {
      let elemIF = document.getElementById('dow')
      if (!elemIF) {
        elemIF = document.createElement('iframe')
        elemIF.id = 'dow'
        elemIF.style.display = 'none'
        document.body.appendChild(elemIF)
      }
      elemIF.src = window.location.origin + `/api/MotorVehicle/template/file`
    },
    uploadExcelSuc(res, file) {
      this.importFileName = file.name
      this.resFileName = res.name
    },
    // 导入失败
    uploadError(file, err, fileList) {
      this.errorMsg(err.message)
    },
    // 上传的文件类型限制
    formatError(file) {
      this.warningMsg('文件 ' + file.name + ' 格式不正确，请上传正确格式的文件。')
    },
    pageSizeChange(n) {
      this.pageLimit = n
      this.getvehicleList()
    },
    pageChange(page) {
      this.pageCur = page
      this.getvehicleList()
    },
    printDetail() {
      window.print()
    },
    // 打开导入弹框
    openImport() {
      this.importFileName = ''
      this.isOpenImport = true
    },
    // 确定 导入
    sureImport() {
      if (!this.importFileName) { return }
      this.importLoad = true
      const param = {
        orgId: this.orgId,
        excelName: this.resFileName
      }
      this.ImportMotorVehicle(param).then(res => {
        this.importResult = res.data
        this.importLoad = false
        this.isOpenImport = false
        this.isOpenImportTips = true
        this.refrashData()
      }).catch(err => {
        this.importLoad = false
        console.log(err, 'import err')
      })
    },
    changeTable() {
      this.tableHeight = this.$refs['tableBox1'].offsetHeight - 40
    }
  }
}
</script>

<style scoped lang='less'>
.orgConfig {
  width: 100%;
  position: relative;
  display: flex;
  padding: 16px 0;
}
.bs-mains {
  position: absolute;
  width: calc(~'100% - 288px');
  height: calc(~'100% - 32px');
  margin-left: 288px;
  background: #1c3053;
  min-height: 670px;
  overflow-x: hidden;
  padding: 16px 0 0;
  left: 0;
}
.feature-btn {
  width: 100%;
  flex: 0 0 32px;
  padding: 0 24px;
  margin-bottom: 12px;
  height: 32px;
  line-height: 32px;
}

.feature-btn > button,
.feature-btn .import,
.feature-btn .import button {
  margin-right: 8px;
  float: left;
  width: 100px;
  height: 32px;
}
.search-box {
  position: absolute;
  right: 24px;
  .right-box {
    margin-left: 8px;
  }
}
.closeBtn {
  .printBtn {
    color: #ccc;
    font-size: 22px;
    margin-right: 8px;
  }
  i {
    &:hover {
      color: #fff;
    }
  }
}
.detailInfo {
  display: flex;
  span {
    display: inline-block;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.picture {
  width: 140px;
  height: 140px;
  border: 1px solid #5676a9;
  vertical-align: middle;
  margin-bottom: 10px;
}
</style>
<style lang="less">
@media print {
  #app-main,
  .ivu-modal-close {
    display: none;
  }
}
/* .print-boxs {
  float: left;
} */
#content .print-boxs .ivu-modal-wrap {
  position: static;
  page-break-after: always;
  .ivu-modal {
    top: 0;
  }
}
#content .print-boxs:nth-of-type(1) .ivu-modal-wrap {
  position: static;
}
.import-box .ivu-upload-list {
  margin-top: 0;
}
</style>
