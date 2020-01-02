<template>
  <div class="container">
    <Row class="bs-content">
      <div class="bs-left">
        <div class="sidebar">
          <a >机构资源</a>
          <div class="tree-org">
            <BStreeNewBox :iconToggle="false" :searchToggle="true" :searchType="0" :equipmentToggle="false" :resourceToggle="false" :btnGroup="true" :orgType="0" :resType="[0]" @clickData="getDevicesDataClick"></BStreeNewBox>
          </div>
        </div>
        <div class="sidebarDark">
          <Menu ref="menu" theme="dark" width="100%" :active-name="route">
            <Menu-group title="服务器配置">
            </Menu-group>
            <Menu-group title="高级参数配置">
            </Menu-group>
          </Menu>
        </div>
      </div>
      <div class="bs-main">

<!--        &lt;!&ndash; 资源添加弹出框 &ndash;&gt;-->
<!--        <div v-if="resAddModal">-->
<!--          <Modal :mask-closable="false" v-model="resAddModal" title="资源分配" width="450">-->
<!--            <div class="res-add-model">-->
<!--              <p>选择机构资源，将资源添加到当前机构下</p>-->
<!--              <div class="res-model-tree" v-if="resAddModal === true">-->
<!--                <bs-scroll ref="scroller">-->
<!--                  <VTree @on-expand="$refs.scroller.update()" ref="resTree" :treeData="resAddTreeData" :options="resAddTreeOptions">-->
<!--                  </VTree>-->
<!--                </bs-scroll>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div slot="footer">-->
<!--              <Button type="ghost" @click="resAddCancel">取消</Button>-->
<!--              <Button type="primary" @click="resAddSave" :loading="modalloading">确认</Button>-->
<!--            </div>-->
<!--          </Modal>-->
<!--        </div>-->
<!--        &lt;!&ndash; 资源移动弹出框 &ndash;&gt;-->
<!--        <div v-if="resMoveModal">-->
<!--          <Modal :mask-closable="false" v-model="resMoveModal" title="资源移动" width="450">-->
<!--            <div class="res-add-model">-->
<!--              <p>选择机构,将资源移动到当前机构下</p>-->
<!--              <div class="res-model-tree">-->
<!--                <bs-scroll ref="scroller">-->
<!--                  <VTree @on-expand="$refs.scroller.update()" :treeData="resMoveTreeData" :options="resMoveTreeOptions" @node-click="selectMoveOrg" :activeId="resMoveOrgId">-->
<!--                  </VTree>-->
<!--                </bs-scroll>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div slot="footer">-->
<!--              <Button type="ghost" @click="resMoveCancel">取消</Button>-->
<!--              <Button type="primary" @click="resMoveSave" :loading="modalloading">确认</Button>-->
<!--            </div>-->
<!--          </Modal>-->
<!--        </div>-->
<!--        &lt;!&ndash; 资源修改弹出框 &ndash;&gt;-->
<!--        <div v-if="resEditModal">-->
<!--          <Modal v-model="resEditModal" :mask-closable="false" title="通道编辑" width="450">-->
<!--            <div class="res-edit-form">-->
<!--              <Form label-position="left" :label-width="100" :model="resEditFormData" ref="resEditForm" :rules="resFormRole">-->
<!--                <Form-item label="所属设备">-->
<!--                  {{ resEditFormInfo.deviceName }}-->
<!--                </Form-item>-->
<!--                <Form-item label="通道号">-->
<!--                  {{ resEditFormData.chan }}-->
<!--                </Form-item>-->
<!--                <Form-item label="所属机构">-->
<!--                  <Input v-model="resEditFormInfo.orgName" disabled></Input>-->
<!--                </Form-item>-->
<!--                <Form-item label="通道名称" prop="name">-->
<!--                  <Input v-model="resEditFormData.name"></Input>-->
<!--                </Form-item>-->
<!--                <Form-item label="监控点类型">-->
<!--                  <Select v-model="resEditFormData.monitortype">-->
<!--                    <Option v-for="opt in monitortypeOpts" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>-->
<!--                  </Select>-->
<!--                </Form-item>-->
<!--                <Form-item label="实时视频码流">-->
<!--                  <Select v-model="resEditFormData.stream">-->
<!--                    <Option v-for="opt in streamOpts" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>-->
<!--                  </Select>-->
<!--                </Form-item>-->
<!--                <Form-item label="键盘控制号" prop="keycode">-->
<!--                  <Input v-model="resEditFormData.keycode"></Input>-->
<!--                </Form-item>-->
<!--                <Form-item label="出/入口定义">-->
<!--                  <Select v-model="resEditFormData.passway">-->
<!--                    <Option v-for="opt in passwayList" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>-->
<!--                  </Select>-->
<!--                </Form-item>-->
<!--                <Form-item label="分析类型">-->
<!--                  <Select v-model="resEditFormData.analysisType">-->
<!--                    <Option v-for="opt in analysisTypeList" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>-->
<!--                  </Select>-->
<!--                </Form-item>-->
<!--                <Row class="check-input">-->
<!--                  <Col span="8">-->
<!--                    <Checkbox v-model="resEditFormData.isprerecord">预录时间</Checkbox>-->
<!--                  </Col>-->
<!--                  <Col span="16">-->
<!--                    <input v-model="resEditFormData.precord" :class="{redBorder: precordTip !== '', redBorderDis:!resEditFormData.isprerecord}" :disabled="!resEditFormData.isprerecord"></input>-->
<!--                    <span class="formTip">{{precordTip}}</span>-->
<!--                  </Col>-->
<!--                </Row>-->
<!--                <Row class="check-input">-->
<!--                  <Col span="8">-->
<!--                    <Checkbox v-model="resEditFormData.isdelayrecord">延录时间</Checkbox>-->
<!--                  </Col>-->
<!--                  <Col span="16">-->
<!--                    <input v-model="resEditFormData.delayrecord" :class="{redBorder: delayrecordTip !== '', redBorderDis:!resEditFormData.isdelayrecord}" :disabled="!resEditFormData.isdelayrecord"></input>-->
<!--                    <span class="formTip">{{delayrecordTip}}</span>-->
<!--                  </Col>-->
<!--                </Row>-->
<!--              </Form>-->
<!--            </div>-->
<!--            <div slot="footer">-->
<!--              <Button type="ghost" @click="resEditCancel">取消</Button>-->
<!--              <Button type="primary" @click="resEditSave" :loading="modalloading">确认</Button>-->
<!--            </div>-->
<!--          </Modal>-->
<!--        </div>-->
        <div class="resource-right-table">
          <div class="table-header">

            <TableTab @on-tab-click="resTabClick" :tabs="resTabs" :isCount="true"></TableTab>
            <div class="table-header-actions clear">
              <div class="actions-btn">
                <Button  type="ghost" icon="plus" @click="resAddOpen"  v-if="resTabs[resActiveTab].btnShow.add">添加</Button>
                <Button  type="ghost" icon="trash-a" @click="resDelOpen" v-if="resTabs[resActiveTab].btnShow.delete">删除</Button>
                <Button  type="ghost" icon="arrow-move" @click="resMoveOpen" v-if="resTabs[resActiveTab].btnShow.move">移动</Button>
                <Button type="ghost" icon="refresh" @click="resTableFresh" v-if="resTabs[resActiveTab].btnShow.resfesh">刷新</Button>
                <Button type="ghost" icon="refresh" @click="resTableFresh" v-if="resTabs[resActiveTab].btnShow.LongRangeOpen">远程开门</Button>
                <Button type="ghost" icon="refresh" @click="resTableFresh" v-if="resTabs[resActiveTab].btnShow.LongRangeClose">远程关门</Button>
                <Button type="ghost" icon="refresh" @click="resTableFresh" v-if="resTabs[resActiveTab].btnShow.LongRange">远程常开</Button>
                <Button type="ghost" icon="md-reverse-camera" @click="resTableFresh" v-if="resTabs[resActiveTab].btnShow.photo">绑定相机</Button>
<!--                <Select :disabled="resSelectIds.length<1" style="width:120px;margin-left:16px" placeholder="同步通道名称" v-model="channelNameSyncSelect">-->
<!--                  <Option @click.native="selectChannelName" v-for="opt in channelNameSyncOpts" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>-->
<!--                </Select>-->
<!--                <Select :disabled="resSelectIds.length<1" style="width:100px" placeholder="设置码流" v-model="batchStreamSelect">-->
<!--                  <Option @click.native="selectBatchStream(opt)" v-for="opt in batchStreamOpts" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>-->
<!--                </Select>-->
                <Checkbox v-model="isShowSubecMhanismEquipment[resActiveTab]" @on-change="showChildRefresh" style="margin-left:16px" v-if="resTabs[resActiveTab].btnShow.equipment">显示子机构设备</Checkbox>
                 <span v-if="resTabs[resActiveTab].btnShow.personNum">
                   <span>在线：</span>
                   <span>45</span>
                   <span>|</span>
                   <span>12</span>
                 </span>
              </div>
              <div class="actions-search">
                <Input placeholder="请输入通道名称" style="width: 220px" v-model="filterKey">
                  <Button slot="append" @click="seekResData(1)">搜索</Button>
                </Input>
              </div>
<!--            </div>-->
          </div>
          <div class="table-relative" ref="tableBox">
            <div class="table-body table-cover">
              <Table size="small" :columns="resColumns[resActiveTab]" :height="tableHeight" :data="resourceTableData" :highlight-row="true" @on-selection-change="selectResRow" width="100%"></Table>
            </div>
          </div>
          <div class="table-footer">
            <div style="float: right;">
              <Page show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :total="resTabs[resActiveTab].number" :current="pageCur" :page-size="pageLimit" show-total show-elevator @on-change="changeResPage"></Page>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Row>
  </div>
</template>
<script>
import BStreeNewBox from '../../../../components/BStreeNew/BStreeNewBox'
import TableTab from '../../equipment/tableTab'
import { mapState, mapActions } from 'vuex'
// import { save } from '../../../../storage'
// import './facePage/tree.css'
export default {
  name: 'deviceManagement',
  components: {
    BStreeNewBox,
    TableTab
  },
  data() {
    return {
      route: '',
      isSearch: false,
      tableHeight: 435,
      pageLimit: this.$PageInfo.limit,
      pageCur: 1,
      filterKey: '',
      resActiveTab: 1,
      isShowSubecMhanismEquipment: [true, true, true, true, true],
      resTabs: [
        {
          title: '视频通道',
          value: 0,
          disabled: false,
          active: true,
          number: 5,
          btnShow: {
            add: true,
            delete: true,
            move: true,
            resfesh: true,
            equipment: true,
            personNum: true,
            LongRangeOpen: false,
            LongRangeClose: false,
            LongRange: false, // 远程常开
            photo: false // 绑定相机

          }
        },
        {
          title: '门禁设备',
          value: 1,
          disabled: false,
          active: false,
          number: 5,
          btnShow: {
            add: false,
            delete: false,
            move: true,
            resfesh: true,
            equipment: true,
            personNum: false,
            LongRangeOpen: false,
            LongRangeClose: false,
            LongRange: false, // 远程常开
            photo: false // 绑定相机

          }
        },
        {
          title: '门',
          value: 2,
          disabled: false,
          active: false,
          number: 5,
          btnShow: {
            add: false,
            delete: false,
            move: true,
            resfesh: true,
            equipment: false,
            personNum: false,
            LongRangeOpen: true,
            LongRangeClose: true,
            LongRange: true, // 远程常开
            photo: false // 绑定相机

          }
        },
        {
          title: '读头',
          value: 3,
          disabled: false,
          active: false,
          number: 5,
          btnShow: {
            add: false,
            delete: false,
            move: true,
            resfesh: true,
            equipment: true,
            personNum: false,
            LongRangeOpen: false,
            LongRangeClose: false,
            LongRange: false, // 远程常开
            photo: true // 绑定相机

          }
        }, {
          title: '人脸识别机',
          value: 4,
          disabled: false,
          active: false,
          number: 5,
          btnShow: {
            add: true,
            delete: true,
            move: true,
            resfesh: true,
            equipment: true,
            personNum: true,
            LongRangeOpen: false,
            LongRangeClose: false,
            LongRange: false, // 远程常开
            photo: true // 绑定相机

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
      ]
    }
  },
  computed: {
    ...mapState({
      resourceTableData: ({ resource }) => resource.resourceTableData
      // resourceCounts: ({ resource }) => resource.resourceCounts,
      // orgTreeData: ({ orgSetting }) => orgSetting.orgTreeData,
      // isRootOrg: ({ orgSetting }) => orgSetting.isRootOrg,
      // orgActiveName: ({ orgSetting }) => orgSetting.orgActiveName
    })
  },
  methods: {
    getDevicesDataClick() {},
    showChildRefresh() {},
    selectResRow() {},
    pageSizeChange() {},
    changeResPage() {},
    resAddOpen() {},
    resDelOpen() {},
    resMoveOpen() {},
    resTableFresh() {},
    resTabClick(event) {
      this.resActiveTab = event.index
      // console.log(this.resTabs[this.resActiveTab])
      // this.resTabs.map(item=>{
      //   item.active = false;
      // });
      // this.resTabs[event.index].active = true;
    }
  },
  created() {
    this.route = this.$route.path
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
    height: auto;
  }

  .sidebar > a {
    display: block;
    height: 38px;
    line-height: 38px;
    font-size: 14px;
    color: #fff;
    padding-left: 20px;
    background-color: #0f2243;
  }

  .tree-org {
    height: 565px;
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
    margin: 12px 10px 12px 24px;
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
    /* margin-top: 9px; */
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
    padding: 0px 10px;
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
    height: 450px;
    width: 400px;
    margin-top: 20px;
    overflow: hidden;
  }

  .clear:after {
    content: '';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
</style>
