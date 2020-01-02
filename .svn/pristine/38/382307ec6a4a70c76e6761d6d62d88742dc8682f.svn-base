<template>
  <div class="orgConfig">
    <div class="bs-left">
      <TreeBox ref="treebox" :iconToggle="false" :searchToggle="true" :searchType="0" :equipmentToggle="false" :resourceToggle="false" :btnGroup="true" :orgType="9" :resType="[0]" @clickData="handleNode" @getOrgData="(data)=>{formData = { code: data.code, name: data.name }}" @delData="delNode">
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
              <el-input v-model="formData.name" :maxlength="64" size="small"></el-input>
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
        <Button type="ghost" icon="ivu-icon iconfont icon-import" :disabled="orgName.isroot" @click="openImport">导入</Button>
        <!-- <Upload class="import" action=''  name="file" :format="['xls','xlsx']" :on-success="uploadSuc" :on-error="uploadError" :on-format-error="formatError">
        </Upload> -->
        <Button type="ghost" icon="ivu-icon iconfont icon-export" @click="exportFile">导出</Button>
        <Button type="ghost" icon="ios-printer-outline" @click="printMore" :loading="printing">打印</Button>
        <div class="search-box">
          <Input v-model="searchVal" placeholder="请输入姓名模糊查询" style="width: 200px;"></Input>
          <Select v-model="identity" style="width: 200px;margin-left:8px;" placeholder="请选择身份">
            <Option v-for="item in identityList" :key="item.value" :value="item.value">{{item.label}}</Option>
          </Select>
          <Select v-model="searchState" style="width: 200px;margin-left:8px;" placeholder="请选择状态">
            <Option v-for="(item) in stateTypeList" :key="item.value" :value="item.value">{{item.label}}</Option>
          </Select>
          <Button type="ghost" icon="search" style="margin-left:8px;" @click="searchVehicle">搜索</Button>
        </div>
      </div>
      <div style="height: calc(100% - 44px);" ref="tableBox1" v-resize="changeTableHeight">
        <Table size="small" :height="tableHeight" :columns="column" :data="nonVehicleList" @on-selection-change="selectChange"></Table>
        <div class="table-footer">
          <div style="float:right;">
            <Page show-sizer :page-size-opts="$PageInfo.size" :show-total="true" :show-elevator="true" :page-size="pageLimit" :current="pageCur" @on-page-size-change="pageSizeChange" :total="pageTotal" @on-change="pageChange"></Page>
          </div>
        </div>
      </div>
      <!-- 添加、编辑弹框 -->
      <div v-if="isOpenAddMod">
        <AddModal :model="isOpenAddMod" :orgName="orgName" :type="isAdd" :vehicleInfo="vehicleInfo" :violationLists="breakRulesList" @close="isOpenAddMod = false"></AddModal>
      </div>
      <!-- 详情弹框 -->
      <Modal id="detailModal" v-model="isOpenDetail" :width="650" title="非机动车详情">
        <div slot="close" class="closeBtn">
          <Icon type="ios-printer-outline" class="printBtn" @click.stop="printDetail"></Icon>
          <Icon type="ios-close-empty" @click.stop="isOpenDetail = false"></Icon>
        </div>
        <div class="detailInfo">
          <Form v-model="detailInfo" label-position="left" :label-width="80" style="width:300px;margin-right:30px;">
            <FormItem label="所有人信息"></FormItem>
            <FormItem label="单位">
              <span>{{orgName.name}}</span>
            </FormItem>
            <FormItem label="身份">
              <span>{{identityObj[detailInfo.identityType]}}</span>
            </FormItem>
            <FormItem label="教工号" v-if="detailInfo.identityType === 0 || detailInfo.identityType === 2">
              <span>{{detailInfo.indentityInfo.indentityNo}}</span>
            </FormItem>
            <FormItem label="学工号" v-if="detailInfo.identityType === 1">
              <span>{{detailInfo.indentityInfo.indentityNo}}</span>
            </FormItem>
            <FormItem label="身份证号" v-if="detailInfo.identityType === 2">
              <span>{{detailInfo.indentityInfo.cardNo}}</span>
            </FormItem>
            <FormItem label="身份证号" v-if="detailInfo.identityType === 3 || detailInfo.identityType === 4">
              <span>{{detailInfo.indentityInfo.indentityNo}}</span>
            </FormItem>
            <FormItem label="学生类型" v-if="detailInfo.identityType === 1">
              <span>{{detailInfo.indentityInfo.studentType ? '留学生' : '非留学生'}}</span>
            </FormItem>
            <FormItem label="人员类型" v-if="detailInfo.identityType === 3">
              <span>{{detailInfo.indentityInfo.personType ? '委员会' : '家属'}}</span>
            </FormItem>
            <FormItem label="姓名">
              <span>{{detailInfo.name}}</span>
            </FormItem>
            <FormItem label="性别">
              <span>{{detailInfo.sex ? '女' : '男'}}</span>
            </FormItem>
            <FormItem label="联系电话">
              <span>{{detailInfo.tel}}</span>
            </FormItem>
            <FormItem label="住址">
              <span>{{detailInfo.address}}</span>
            </FormItem>
            <FormItem label="年龄">
              <span>{{detailInfo.age}}</span>
            </FormItem>
            <FormItem label="入学时间" v-if="detailInfo.identityType ===1">
              <span>{{detailInfo.indentityInfo.registerTime}}</span>
            </FormItem>
            <FormItem label="备注">
              <span>{{detailInfo.remark}}</span>
            </FormItem>
          </Form>
          <Form v-model="detailInfo" label-position="left" :label-width="85" style="width: 276px;">
            <FormItem label="车况信息"></FormItem>
            <div style="margin-bottom: 12px;">
              <img :src="detailInfo.nonVehiclesInfos.image || '/static/noImg1.png'" class="picture">
            </div>
            <FormItem :label="detailInfo.nonVehiclesInfos.buyTime">
              <span>{{detailInfo.nonVehiclesInfos.isOneSelf ? '' : '非'}}本人购买&nbsp;&nbsp;{{detailInfo.nonVehiclesInfos.isInvoice ? '有' : '无'}}发票</span>
            </FormItem>
            <FormItem :label="detailInfo.nonVehiclesInfos.numberPlateType ? '正式牌照' : '临时牌照'">
              <span>{{detailInfo.nonVehiclesInfos.numberPlate}}</span>
            </FormItem>
            <FormItem label="牌照号码">
              <span>{{detailInfo.nonVehiclesInfos.schoolCardNo}}</span>
            </FormItem>
            <FormItem label="品牌">
              <span>{{detailInfo.nonVehiclesInfos.brand}}</span>
            </FormItem>
            <FormItem label="颜色">
              <span>{{detailInfo.nonVehiclesInfos.color}}</span>
            </FormItem>
            <!-- <FormItem label="状态">
              <span>{{stateList[detailInfo.nonVehiclesInfos.state]}}</span>
            </FormItem> -->
          </Form>
        </div>
        <div>
          <h4>违规记录</h4>
          <div class="record-box">
            <ul v-for="(item, index) in violationLists" :key="index">
              <li>时间: {{item.time}}</li>
              <li>地点: {{item.location}}</li>
              <li>事件类型: {{stateList[item.type]}}</li>
              <li :title="item.description">事件描述: {{item.description}}</li>
              <li>处置人: {{item.name}}</li>
            </ul>
          </div>
        </div>
        <div style="text-align:center;">
          <img :src="detailInfo.nonVehiclesInfos.codeImage" style="width:100px;height:100px;">
        </div>
        <div slot="footer"></div>
      </Modal>
      <!-- 导入弹框 -->
      <Modal v-model="isOpenImport" class="import-box" :width="400" title="导入" :closable="false" :mask-closable="false">
        <Form label-position="left" :label-width="80">
          <FormItem label="文件">
            <Input v-model="importFileName">
              <Upload slot="append" action='/api/upload/file?type=image&category=nonVehicleTemp' :show-upload-list="false"  name="file" :format="['xls','xlsx']" :on-success="uploadExcelSuc" :on-error="uploadError" :on-format-error="formatError">
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
import AddModal from './AddModal'
import addOrg from './addOrg'
import { mapActions } from 'vuex'
export default {
  mixins: [addOrg],
  components: {
    TreeBox,
    AddModal
  },
  data() {
    return {
      breakRulesList: [], // 编辑时违规记录内容
      printing: false,
      tableHeight: 420,
      identityList: [ // 身份列表
        {value: 'all', label: '全部'},
        {value: 0, label: '职工'},
        {value: 1, label: '学生'},
        {value: 2, label: '外聘'},
        {value: 3, label: '家属'},
        {value: 4, label: '其他'}
      ],
      identityObj: {
        0: '职工',
        1: '学生',
        2: '外聘',
        3: '家属',
        4: '其他'
      },
      stateTypeList: [
        {value: 'all', label: '全部'},
        {value: 0, label: '正常'},
        {value: 1, label: '异常'}
      ],
      stateList: ['伪造车证', '涂改车证', '转借车证', '辱骂车辆管理人员', '与车辆管理人员发生纠纷', '其他'],
      selecteData: [],
      searchVal: '',
      identity: '',
      searchState: '',
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
          width: 60,
          align: 'center'
        },
        {
          title: '身份',
          key: 'identityType',
          // width: 100,
          align: 'center',
          render: (h, param) => {
            return h('span', this.identityObj[param.row.identityType])
          }
        },
        {
          title: '姓名',
          key: 'name',
          // width: 100,
          align: 'center',
          ellipsis: true
        },
        {
          title: '教工号/学工号/身份证号',
          key: 'indentityNo',
          // width: 165,
          ellipsis: true,
          align: 'center',
          render: (h, param) => {
            const indentityInfo = param.row.indentityInfo
            let idNumber = indentityInfo.indentityNo || indentityInfo.cardNo
            return h('span', idNumber)
          }
        },
        /* {
          title: '联系电话',
          key: 'tel',
          align: 'center',
          ellipsis: true,
          render: (h, param) => {
            return h('span', {
              attrs: {
                title: param.row.tel
              }
            }, param.row.tel)
          }
        },
        {
          title: '性别',
          key: 'sex',
          width: 60,
          align: 'center',
          render: (h, param) => {
            return h('span', param.row.sex ? '女' : '男')
          }
        },
        {
          title: '年龄',
          key: 'age',
          width: 60,
          align: 'center'
        },
        {
          title: '住址',
          key: 'address',
          ellipsis: true,
          align: 'center',
          render: (h, param) => {
            return h('span', {
              attrs: {
                title: param.row.address
              }
            }, param.row.address)
          }
        },
        {
          title: '购买时间',
          key: 'buyTime',
          align: 'center',
          render: (h, param) => {
            return h('span', param.row.nonVehiclesInfos.buyTime)
          }
        }, */
        {
          title: '牌照',
          key: 'numberPlate',
          align: 'center',
          ellipsis: true,
          render: (h, param) => {
            return h('span', {
              attrs: {
                title: param.row.nonVehiclesInfos.numberPlate
              }
            }, param.row.nonVehiclesInfos.numberPlate)
          }
        },
        /* {
          title: '校内编号',
          key: 'schoolCardNo',
          align: 'center',
          ellipsis: true,
          render: (h, param) => {
            return h('span', param.row.nonVehiclesInfos.schoolCardNo)
          }
        },
        {
          title: '品牌',
          key: 'brand',
          align: 'center',
          ellipsis: true,
          render: (h, param) => {
            return h('span', param.row.nonVehiclesInfos.brand)
          }
        },
        {
          title: '颜色',
          key: 'color',
          align: 'center',
          ellipsis: true,
          render: (h, param) => {
            return h('span', param.row.nonVehiclesInfos.color)
          }
        }, */
        {
          title: '状态',
          key: 'state',
          align: 'center',
          ellipsis: true,
          render: (h, param) => {
            return h('span', param.row.nonVehiclesInfos.state === 0 ? '正常' : '异常')
          }
        },
        {
          title: '备注',
          key: 'remark',
          ellipsis: true,
          align: 'center',
          render: (h, param) => {
            return h('span', {
              attrs: {
                title: param.row.remark
              }
            }, param.row.remark)
          }
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
                    this.violationLists = []
                    this.detailInfo = params.row
                    this.getBreakRulesRecord(`plate=${params.row.nonVehiclesInfos.numberPlate}`).then(res => {
                      this.violationLists = res.data[0] && res.data[0].doc
                      this.isOpenDetail = true
                    }).catch(err => {
                      console.log(err, '获取违规记录失败')
                    })
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
                    this.breakRulesList = []
                    this.isAdd = false
                    this.vehicleInfo = params.row
                    this.getBreakRulesRecord(`plate=${params.row.nonVehiclesInfos.numberPlate}`).then(res => {
                      this.breakRulesList = res.data[0] && res.data[0].doc
                      this.isOpenAddMod = true
                    }).catch(err => {
                      console.log(err, '获取违规记录失败')
                    })
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
                        this.deleteNonVehicle(params.row._id).then(() => {
                          this.successMsg('删除成功')
                          this.getNonVehicleList()
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
      nonVehicleList: [],
      isAdd: true, // true 添加  false 编辑
      vehicleInfo: null,
      detailInfo: {
        nonVehiclesInfos: {},
        indentityInfo: {}
      },
      isOpenDetail: false, // 详情框
      orgId: '',
      isOpenImport: false, // 点击导入 弹出导入弹框
      importFileName: '', // 输入框 显示的文件名
      resFileName: '', // upload成功 返回的文件名
      importResult: {
        errorCount: 0,
        successCount: 0
      },
      importLoad: false,
      isOpenImportTips: false, // 导入成功失败数量提示框
      violationLists: []
    }
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox1'].offsetHeight - 40
    window.addEventListener('afterprint', this.removePrint)
  },
  beforeDestroy() {
    window.removeEventListener('afterprint', this.removePrint)
  },
  methods: {
    ...mapActions(['getNonVehicle', 'deleteNonVehicle', 'exportNonVehicle', 'ImportNonVehicle', 'deleteNodeNonVehicle', 'getBreakRulesRecord']),
    removePrint() {
      this.printing = false
      const el = document.getElementById('eleCarPrint')
      if (el) {
        document.body.removeChild(el)
        document.querySelector('body').style.overflowY = 'visible'
      }
    },
    changeTableHeight() {
      this.tableHeight = this.$refs['tableBox1'].offsetHeight - 40
    },
    getNonVehicleList() {
      this.selecteData = []
      const data = {
        page: this.pageCur,
        limit: this.pageLimit,
        orgId: this.orgId,
        identityType: this.identity === 'all' ? '' : this.identity,
        state: this.searchState === 'all' ? '' : this.searchState,
        condition: this.searchVal
      }
      this.getNonVehicle(data).then(res => {
        this.nonVehicleList = res.data
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
      this.identity = ''
      this.searchState = ''
      this.searchVal = ''
      this.getNonVehicleList()
    },
    delNode(node) {
      this.deleteNodeNonVehicle(node._id).catch(err => {
        console.log(err)
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
      this.deleteNonVehicle(ids).then(() => {
        this.successMsg('删除成功')
        this.getNonVehicleList()
      }).catch(() => {
        this.errorMsg('删除失败')
      })
    },
    // 刷新
    refrashData() {
      this.pageCur = 1
      this.identity = ''
      this.searchState = ''
      this.searchVal = ''
      this.getNonVehicleList()
    },
    searchVehicle() {
      this.pageCur = 1
      this.orgId = ''
      this.getNonVehicleList()
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
      elemIF.src = window.location.origin + `/api/nonVehicle/download?ids=${ids}`
    },
    exportTemplate() {
      let elemIF = document.getElementById('dow')
      if (!elemIF) {
        elemIF = document.createElement('iframe')
        elemIF.id = 'dow'
        elemIF.style.display = 'none'
        document.body.appendChild(elemIF)
      }
      elemIF.src = window.location.origin + `/api/nonVehicle/download/template/file`
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
      this.getNonVehicleList()
    },
    pageChange(page) {
      this.pageCur = page
      this.getNonVehicleList()
    },
    printDetail() {
      this.printData([this.detailInfo])
    },
    // 打印选中 机动车的详细信息
    printMore() {
      this.printData(this.selecteData)
    },
    printData(list) {
      if (list.length === 0) {
        this.warningMsg('请勾选要打印的信息')
        return
      }
      this.printing = true
      let plates = list.map(item => {
        return `plate=${item.nonVehiclesInfos.numberPlate}`
      })
      const param = plates.join('&')
      this.getBreakRulesRecord(param).then(res => {
        let imgNum = 0
        let imgTotal = 0
        let template = ''
        list.forEach(item => {
          item.nonVehiclesInfos.image = item.nonVehiclesInfos.image || '/static/noImg1.png'
          const breakRules = res.data.find(suc => {
            return suc.plate === item.nonVehiclesInfos.numberPlate
          })
          if (breakRules) {
            item.breakRules = breakRules.doc
          } else {
            item.breakRules = []
          }
          template += `<div class="v-transfer-dom print-boxs"><div class="ivu-modal-wrap"><div class="ivu-modal" style="width: 650px;"><div class="ivu-modal-content"><a class="ivu-modal-close"><div class="closeBtn"><i class="printBtn ivu-icon ivu-icon-ios-printer-outline"></i> <i  class="ivu-icon ivu-icon-ios-close-empty"></i></div></a> <div class="ivu-modal-header"><div class="ivu-modal-header-inner">非机动车详情</div></div> <div class="ivu-modal-body"> <div  style="display: flex;"><form  autocomplete="off" class="ivu-form ivu-form-label-left" value="[object Object]" style="width: 300px; margin-right: 30px;"><div  class="ivu-form-item"><label class="ivu-form-item-label" style="width: 80px;">所有人信息</label> <div class="ivu-form-item-content" style="margin-left: 80px;"> </div></div> <div  class="ivu-form-item"><label class="ivu-form-item-label" style="width: 80px;">单位</label> <div class="ivu-form-item-content" style="margin-left: 80px;"><span >${this.orgName.name}</span> </div></div> <div  class="ivu-form-item"><label class="ivu-form-item-label" style="width: 80px;">身份</label> <div class="ivu-form-item-content" style="margin-left: 80px;"><span >${this.identityObj[item.identityType]}</span> </div></div>`
          if (item.identityType === 0 || item.identityType === 2) {
            template += `<div  class="ivu-form-item"><label class="ivu-form-item-label" style="width: 80px;">教工号</label> <div class="ivu-form-item-content" style="margin-left: 80px;"><span >${item.indentityInfo.indentityNo}</span> </div></div>`
            if (item.identityType === 2) {
              template += `<div  class="ivu-form-item"><label class="ivu-form-item-label" style="width: 80px;">身份证号</label> <div class="ivu-form-item-content" style="margin-left: 80px;"><span >${item.indentityInfo.cardNo}</span> </div></div>`
            }
          } else if (item.identityType === 1) {
            template += `<div  class="ivu-form-item"><label class="ivu-form-item-label" style="width: 80px;">学工号</label> <div class="ivu-form-item-content" style="margin-left: 80px;"><span >${item.indentityInfo.indentityNo}</span> </div></div> <div  class="ivu-form-item"><label class="ivu-form-item-label" style="width: 80px;">学生类型</label> <div class="ivu-form-item-content" style="margin-left: 80px;"><span >${item.indentityInfo.studentType ? '学生' : '留学生'}</span> </div></div>`
          } else {
            template += `<div  class="ivu-form-item"><label class="ivu-form-item-label" style="width: 80px;">身份证号</label> <div class="ivu-form-item-content" style="margin-left: 80px;"><span >${item.indentityInfo.indentityNo}</span> </div></div>`
            if (item.identityType === 3) {
              template += `<div  class="ivu-form-item"><label class="ivu-form-item-label" style="width: 80px;">人员类型</label> <div class="ivu-form-item-content" style="margin-left: 80px;"><span >${item.indentityInfo.personType ? '委员会' : '家属'}</span> </div></div>`
            }
          }
          template += ` <div  class="ivu-form-item"><label class="ivu-form-item-label" style="width: 80px;">姓名</label> <div class="ivu-form-item-content" style="margin-left: 80px;"><span >${item.name}</span></div></div> <div  class="ivu-form-item"><label class="ivu-form-item-label" style="width: 80px;">性别</label> <div class="ivu-form-item-content" style="margin-left: 80px;"><span >${item.sex ? '女' : '男'}</span> </div></div> <div  class="ivu-form-item"><label class="ivu-form-item-label" style="width: 80px;">联系电话</label> <div class="ivu-form-item-content" style="margin-left: 80px;"><span >${item.tel}</span> </div></div> <div  class="ivu-form-item"><label class="ivu-form-item-label" style="width: 80px;">住址</label> <div class="ivu-form-item-content" style="margin-left: 80px;"><span >${item.address}</span></div></div> <div  class="ivu-form-item"><label class="ivu-form-item-label" style="width: 80px;">年龄</label> <div class="ivu-form-item-content" style="margin-left: 80px;"><span >${item.age || ''}</span></div></div>  <div  class="ivu-form-item"><label class="ivu-form-item-label" style="width: 80px;">备注</label> <div class="ivu-form-item-content" style="margin-left: 80px;"><span >${item.remark}</span> </div></div></form> <form  autocomplete="off" class="ivu-form ivu-form-label-left" value="[object Object]" style="width:276px"><div  class="ivu-form-item"><label class="ivu-form-item-label" style="width: 85px;">车况信息</label> <div class="ivu-form-item-content" style="margin-left: 85px;"> </div></div> <div  style="margin-bottom: 12px;"><img  src="${item.nonVehiclesInfos.image}" width="100" height="100" class="picture"></div> <div  class="ivu-form-item"><label class="ivu-form-item-label" style="width: 85px;">${item.nonVehiclesInfos.buyTime}</label> <div class="ivu-form-item-content" style="margin-left: 85px;"><span >${item.nonVehiclesInfos.isOneSelf ? '' : '非'}本人购买&nbsp;&nbsp;${item.nonVehiclesInfos.isInvoice ? '有' : '无'}发票</span> </div></div> <div  class="ivu-form-item"><label class="ivu-form-item-label" style="width: 85px;">${item.nonVehiclesInfos.numberPlateType ? '正式牌照' : '临时牌照'}</label> <div class="ivu-form-item-content" style="margin-left: 85px;"><span >${item.nonVehiclesInfos.numberPlate}</span> </div></div> <div  class="ivu-form-item"><label class="ivu-form-item-label" style="width: 85px;">牌照号码</label> <div class="ivu-form-item-content" style="margin-left: 85px;"><span >${item.nonVehiclesInfos.schoolCardNo}</span> </div></div> <div  class="ivu-form-item"><label class="ivu-form-item-label" style="width: 85px;">品牌</label> <div class="ivu-form-item-content" style="margin-left: 85px;"><span >${item.nonVehiclesInfos.brand}</span> </div></div> <div  class="ivu-form-item"><label class="ivu-form-item-label" style="width: 85px;">颜色</label> <div class="ivu-form-item-content" style="margin-left: 85px;"><span >${item.nonVehiclesInfos.color}</span> </div></div></form></div> <div><h4>违规记录</h4> <div style="display:flex;flex-wrap:wrap;padding-left:80px;margin-bottom:24px;width:606px;">`
          item.breakRules.forEach(val => {
            template += `<ul style="width:250px;margin-bottom:12px;"><li>时间: ${val.time}</li> <li>地点: ${val.location}</li> <li>事件类型: ${this.stateList[val.type]}</li> <li>事件描述: ${val.description}</li> <li >处置人: ${val.name}</li></ul>`
          })
          template += `</div></div> <div  style="text-align: center;"><img  src="${item.nonVehiclesInfos.codeImage}" style="width: 100px; height: 100px;"></div> </div> <div class="ivu-modal-footer"><div ></div></div></div></div></div></div>`
        })
        const el = document.createElement('div')
        el.innerHTML = template
        el.id = 'eleCarPrint'
        // 确保所有的图片 都加载完毕 才调用浏览器打印方法
        const imgs = Array.from(el.getElementsByTagName('img'))
        imgs.forEach(item => {
          if (item.getAttribute('src')) {
            imgTotal++
          }
        })
        console.log(imgTotal, 'total')
        imgs.forEach(item => {
          if (item.src) {
            let img = new Image()
            img.src = item.src
            img.addEventListener('load', () => {
              imgNum++
              if (imgNum === imgTotal) {
                this.printing = false
                window.print()
              }
            })
          }
        })
        document.body.appendChild(el)
        document.querySelector('body').style.overflowY = 'hidden'
      }).catch(() => {
        this.warningMsg('获取电动车数据失败')
      })
    },
    // 打开导入弹框
    openImport() {
      this.importFileName = ''
      this.isOpenImport = true
      this.importLoad = false
    },
    // 确定 导入
    sureImport() {
      if (!this.importFileName) { return }
      this.importLoad = true
      const param = {
        orgId: this.orgId,
        excelName: this.resFileName
      }
      this.ImportNonVehicle(param).then(res => {
        console.log(res)
        this.importResult = res.data
        this.importLoad = false
        this.isOpenImport = false
        this.isOpenImportTips = true
        this.refrashData()
      }).catch(err => {
        this.importLoad = false
        console.log(err, 'import err')
      })
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
  left: 0;
  width: calc(~'100% - 288px');
  height: calc(~'100% - 32px');
  margin-left: 288px;
  background: #1c3053;
  min-height: 670px;
  overflow: hidden;
  padding: 16px 0 0;
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
    font-size: 20px;
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
  width: 100px;
  height: 100px;
  border: 1px solid #5676a9;
  vertical-align: middle;
}
.record-box {
  display: flex;
  flex-wrap: wrap;
  padding-left: 80px;
  margin-bottom: 24px;
  height: 100px;
  overflow-y: auto;
  ul {
    width: 250px;
    margin-bottom: 12px;
    li {
      width: 220px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
<style lang="less">
@media print {
  #app-main,
  #detailModal,
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
#detailModal .detailInfo .ivu-form-item {
  margin-bottom: 5px;
}
</style>
