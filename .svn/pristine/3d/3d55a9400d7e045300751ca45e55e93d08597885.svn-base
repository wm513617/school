<template>
  <div class="bs-main" ref="tableBox">
    <Tabs :animated="false" value="one" style="flex:1">
      <Tab-pane label="资源管理" name="one" class="tenRow tenRowOne">
        <div class="manage">
          <div v-if="$BShasPower('BS-SETTING-VEHICLE-RESOURCE')" class="btnsPre">
            <Button class="allbutton add" icon="plus" type="ghost" @click="resourceAddShow" :disabled="isResAdd">添加</Button>
            <Button class="allbutton" icon="trash-a" type="ghost" @click="resRemoveBatch" :disabled="isResRemove">删除</Button>
          </div>
          <div class="table-content">
            <div class="table-body resource-management">
              <Table :height="resTableHheight" size="small" :highlight-row="true" :columns="columnsResource" :data="resourceList.list" @on-selection-change="resourceCheck"></Table>
            </div>
          </div>
          <div class="table-footer res-table-footer">
            <div style="float: right;">
              <Page :page-size="resourceList.limit" show-total show-elevator :total="resourceList.count" :current="resourceList.curPage" @on-change="changePageRes"></Page>
            </div>
          </div>
        </div>
      </Tab-pane>
      <Tab-pane label="路口管理" name="two" class="fiveRow">
        <div class="manage">
          <div class="btnsPre">
            <!-- <h3 style="padding-right: 10px; display: inline;">路口管理</h3> -->
            <Button v-if="$BShasPower('BS-SETTING-VEHICLE-LOAD')" class="allbutton add" icon="plus" type="ghost" @click="roadShow('add')" :disabled="isResAdd">添加</Button>
            <Button v-if="$BShasPower('BS-SETTING-VEHICLE-LOAD')" class="allbutton" icon="trash-a" type="ghost" @click="roadRemoveBatch" :disabled="isRoadRemove">删除</Button>
          </div>
          <div class="table-content">
            <div class="table-body resource-management">
              <Table ref="crossRow" :height="crossTableHeight" size="small" :highlight-row="true" :columns="columnsCross" :data="crossingList.list" @on-selection-change="roadCheck" @on-row-click="roadRowClick" :row-class-name="rowClassName"></Table>
            </div>
          </div>
          <div class="table-footer">
            <div style="float: right;">
              <Page show-total show-elevator :total="crossingList.count" :current="crossingList.curPage" :page-size='crossingList.limit' @on-change="changePageCros"></Page>
            </div>
          </div>
        </div>
        <!-- 车道管理 -->
        <div class="manage" style="margin-top:10px;">
          <h3 style="padding-left:10px;">车道管理</h3>
          <div class="table-content">
            <div class="table-body">
              <Table :height="crossTableHeight" size="small" :highlight-row="true" :columns="columnsLane" :data="laneList.list"></Table>
            </div>
          </div>
          <div class="table-footer">
            <div style="float: right;">
              <Page show-total show-elevator :total="laneList.count" :current="laneList.curPage" :page-size='laneList.limit' @on-change="changePageLane"></Page>
            </div>
          </div>
        </div>
      </Tab-pane>
    </Tabs>
    <div v-if="hasCrossModal">
      <Modal v-model="hasCrossModal" :mask-closable="false" :title="roadTitle" :width="460">
        <div class="addCrossing">
          <Form style="flex:1" ref="crossValidate" :model="roadItem" :rules="crossRuleValidate" :label-width="100" label-position="left">
            <Form-item label="路口名称" prop="name">
              <Input v-model="roadItem.name" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="路口编号" prop="code">
              <Input v-model="roadItem.code" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="车道数量" prop="laneNumber">
              <Select v-model="roadItem.laneNumber" placeholder="请选择">
                <Option v-for="item in numberList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Form-item>
            <div class="rowStyle">
              <Checkbox v-model="roadItem.isshow" class="checkLeft">路口示意图</Checkbox>
              <div style="flex:1">
                <Radio-group v-model="laneRadio" style="line-height:32px;">
                  <Radio label="电子地图" style="display:block"></Radio>
                  <Radio label="图片"></Radio>
                </Radio-group>
              </div>
            </div>
          </Form>
          <div class="uploadLane">
            <span style="padding-top:4px">图片宽高:278*249</span>
            <Upload v-if="!flag" ref="upload" action="/api/upload" :headers="headerObj" name="file" :format="['jpg','png','bmp','jpeg']" :on-success="uploadLaneSuc" :on-format-error="laneFormatError" :show-upload-list="false">
              <Button type="ghost" icon="ios-cloud-upload-outline" style="width:98px;height:30px">上传图片</Button>
            </Upload>
            <Button v-if="flag" :disabled="flag" type="ghost" icon="ios-cloud-upload-outline" style="width:98px;height:30px">上传图片</Button>
            <img :src="'/api/upload?id='+roadItem.image" width="100%" style="border:1px dotted #fff"></img>
          </div>
        </div>
        <div slot="footer">
          <Button type="ghost" @click="roadCancel">取消</Button>
          <Button type="primary" @click="roadOk(roadTitle)">确定</Button>
        </div>
      </Modal>
    </div>
    <div v-if="hasLaneModal">
      <Modal v-model="hasLaneModal" :mask-closable="false" :title="laneTitle" :width="450" @on-cancel="laneCancel">
        <!-- <Tabs value="name1" @on-click="showModal">
          <Tab-pane label="基础设置" name="name1"></Tab-pane>
          <Tab-pane label="违规设置" name="name2"></Tab-pane>
        </Tabs>
        <div v-if="modalShow==='name2'">本地不支持</div> -->
        <div v-if="modalShow==='name1'" class="addCrossing">
          <Form style="flex:1" ref="laneValidate" :model="laneItem" :rules="laneRuleValidate" :label-width="100" label-position="left">
            <Form-item label="车道名称" prop="name">
              <Input v-model="laneItem.name" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="车道编号" prop="code">
              <Input v-model="laneItem.code" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="主摄像机" prop="resource">
              <p style="position:absolute;z-index:2;padding-left:8px;">{{showStr}}</p>
              <Select v-model="showStr" placeholder="请选择" class="fixWidth">
                <VTree ref='cameraTree' :treeData="cameraTreeData" :activeId="activeId" :options="optionsCamera" @node-click="clickCameraTree" />
              </Select>
            </Form-item>
            <Form-item label="车道方向" prop="direction">
              <Input v-model="laneItem.direction" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="出/入口定义" prop="passway">
              <Select v-model="laneItem.passway" placeholder="请选择">
                <Option v-for="item in passList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Form-item>
          </Form>
        </div>
        <div slot="footer">
          <Button type="ghost" @click="laneCancel">取消</Button>
          <Button type="primary" @click="laneOk">确定</Button>
        </div>
      </Modal>
    </div>
    <div v-if="hasResAdd">
      <Modal v-model="hasResAdd" :mask-closable="false" title="添加资源" :width="450">
        <div class="hide">
          <bs-scroll ref="scroller">
            <VTree @on-expand="$refs.scroller.update()" ref='orgTree' :treeData="resourceTreeData" :options="options" :isSaveState='false'></VTree>
          </bs-scroll>
        </div>
        <div slot="footer">
          <Button type="ghost" @click="resAddCancel">取消</Button>
          <Button type="primary" @click="resAddOk">确定</Button>
        </div>
      </Modal>
    </div>
    <div v-if="hasResEdit">
      <Modal v-model="hasResEdit" :mask-closable="false" title="修改资源" :width="450">
        <Form ref="resourceValidate" :model="resourceItem" :rules="resValidate" :label-width="100" label-position="left" style="padding:0 10px">
          <Form-item label="名称" prop="name">
            <Input v-model="resourceItem.name" placeholder="请输入"></Input>
          </Form-item>
          <Checkbox v-model="resourceItem.hasserver" style="height: 32px;">后台分析</Checkbox>
          <Form-item label="服务器" prop="server">
            <Select v-model="resourceItem.server" :disabled="!resourceItem.hasserver" @on-change="serverSelect" placeholder="请选择" style="flex:1;">
              <Option v-for="item in resourceServerArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item>
          <Form-item label="频道号" prop="channelid">
            <Select v-model="resourceItem.channelid" placeholder="请选择" :disabled="!resourceItem.hasserver">
              <Option v-for="item in channelIds" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="ghost" @click="resEditCancel">取消</Button>
          <Button type="primary" @click="resEditOk">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import './row.css'
export default {
  data() {
    const validateResName = (rule, value, callback) => {
      if (value) {
        // Unicode编码
        let strlen = 0
        for (let i = 0; i < value.length; i++) {
          if (value.charCodeAt(i) > 255) {
            // 如果是汉字，则字符串长度加2
            strlen += 2
          } else {
            strlen++
          }
        }
        if (strlen > 256) {
          return callback(new Error('不能超过256位字符'))
        } else {
          return callback()
        }
      } else {
        return callback(new Error('不能为空'))
      }
    }
    const validateCrossName = (rule, value, callback) => {
      if (value) {
        let strlen = this.strLength(value)
        if (strlen > 16) {
          return callback(new Error('不能超过16位字符'))
        } else {
          this.checkCross({
            pid: this.activeOrgId,
            name: value,
            id: this.roadItem._id
          }).then(res => {
            if (res.name) {
              return callback(new Error('此路口名称已存在'))
            } else {
              return callback()
            }
          })
        }
      } else {
        return callback(new Error('不能为空'))
      }
    }
    const validateCrossCode = (rule, value, callback) => {
      if (value) {
        let strlen = this.strLength(value)
        if (strlen > 16) {
          return callback(new Error('不能超过16位字符'))
        } else {
          this.checkCross({
            pid: this.activeOrgId,
            code: value,
            id: this.roadItem._id
          }).then(res => {
            if (res.code) {
              return callback(new Error('此路口编号已存在'))
            } else {
              return callback()
            }
          })
        }
      } else {
        return callback(new Error('不能为空'))
      }
    }
    const validateLaneName = (rule, value, callback) => {
      if (value) {
        let strlen = this.strLength(value)
        if (strlen > 16) {
          return callback(new Error('不能超过16位字符'))
        } else {
          if (!this.clickWhoCross) {
            this.clickWhoCross = this.crossingList.list[0]._id
          }
          this.checkLane({
            pid: this.clickWhoCross,
            name: value,
            id: this.laneItem._id
          }).then(res => {
            if (res.name) {
              return callback(new Error('此车道名称已存在'))
            } else {
              return callback()
            }
          })
        }
      } else {
        return callback(new Error('不能为空'))
      }
    }
    const validateLaneCode = (rule, value, callback) => {
      if (value) {
        let strlen = this.strLength(value)
        if (strlen > 16) {
          return callback(new Error('不能超过16位字符'))
        } else {
          if (!this.clickWhoCross) {
            this.clickWhoCross = this.crossingList.list[0]._id
          }
          this.checkLane({
            pid: this.clickWhoCross,
            code: value,
            id: this.laneItem._id
          }).then(res => {
            if (res.code) {
              return callback(new Error('此车道编号已存在'))
            } else {
              return callback()
            }
          })
        }
      } else {
        return callback(new Error('不能为空'))
      }
    }
    return {
      // 表格高度
      resTableHheight: 432,
      crossTableHeight: 232,
      headerObj: { Authorization: '' },
      activeId: '',
      pageRes: 1,
      pageCros: 1,
      pageLane: 1,
      flag: true,
      // 按钮禁用
      isResRemove: true,
      isRoadRemove: true,
      showStr: '',
      roadTitle: '',
      laneTitle: '修改车道',
      modalShow: 'name1',
      hasLaneModal: false,
      hasCrossModal: false,
      hasResAdd: false,
      hasResEdit: false,
      laneRadio: '电子地图',
      numberList: [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
        { value: 6, label: '6' },
        { value: 7, label: '7' },
        { value: 8, label: '8' },
        { value: 9, label: '9' },
        { value: 10, label: '10' },
        { value: 11, label: '11' },
        { value: 12, label: '12' },
        { value: 13, label: '13' },
        { value: 14, label: '14' },
        { value: 15, label: '15' },
        { value: 16, label: '16' }
      ],
      passList: [{ value: 0, label: '普通' }, { value: 1, label: '入口' }, { value: 2, label: '出口' }],
      ChannelIdAll: {},
      // 资源管理 表头
      columnsResource: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '资源名称',
          key: 'name',
          ellipsis: true
        },
        {
          title: '频道号',
          key: 'channelid',
          ellipsis: true,
          render: (h, param) => {
            return h('span', {}, this.ChannelIdAll[param.row.channelid])
          }
        },
        {
          title: '分析服务器',
          key: 'server',
          ellipsis: true,
          render: (h, param) => {
            let text = ''
            this.resourceServerArr.forEach(item => {
              if (param.row.server === item.value) {
                text = item.label
              }
            })
            return h('span', {}, text)
          }
        },
        {
          title: '所属设备',
          key: 'eidName',
          ellipsis: true
        },
        {
          title: '地址',
          key: 'eidIp',
          ellipsis: true
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          render: (h, params) => {
            if (this.$BShasPower('BS-SETTING-VEHICLE-RESOURCE')) {
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
                      click: () => {
                        this.resourceEditShow(params)
                      }
                    }
                  },
                  '修改'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'ghost',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.resourceRemove(params)
                      }
                    }
                  },
                  '删除'
                )
              ])
            }
          }
        }
      ],
      // 路口管理 表头
      columnsCross: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '路口名称',
          key: 'name',
          ellipsis: true
        },
        {
          title: '路口编号',
          key: 'code',
          ellipsis: true
        },
        {
          title: '车道数量',
          key: 'laneNumber'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          render: (h, params) => {
            if (this.$BShasPower('BS-SETTING-VEHICLE-LOAD')) {
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
                        this.roadShow('edit', params)
                      }
                    }
                  },
                  '修改'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'ghost',
                      size: 'small'
                    },
                    on: {
                      click: e => {
                        e.stopPropagation()
                        this.roadRemove(params)
                      }
                    }
                  },
                  '删除'
                )
              ])
            }
          }
        }
      ],
      // 车道管理 表头
      columnsLane: [
        {
          title: '车道名称',
          key: 'name',
          ellipsis: true
        },
        {
          title: '车道编号',
          key: 'code',
          ellipsis: true
        },
        {
          title: '主摄像机',
          key: 'resourceName',
          ellipsis: true
        },
        {
          title: '智能分析服务器',
          key: 'serverName',
          ellipsis: true
        },
        {
          title: '车道方向',
          key: 'direction',
          ellipsis: true
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          render: (h, params) => {
            if (this.$BShasPower('BS-SETTING-VEHICLE-LOAD')) {
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
                      click: () => {
                        this.laneShow('edit', params)
                      }
                    }
                  },
                  '修改'
                )
              ])
            }
          }
        }
      ],
      laneRuleValidate: {
        name: [{ required: true, validator: validateLaneName, trigger: 'blur' }],
        code: [{ required: true, validator: validateLaneCode, trigger: 'blur' }],
        resource: [{ required: true, message: '主摄像机不能为空', trigger: 'change' }],
        direction: [{ max: 16, message: '不能超过16字符', trigger: 'change' }]
      },
      crossRuleValidate: {
        name: [{ required: true, validator: validateCrossName, trigger: 'blur' }],
        code: [{ required: true, validator: validateCrossCode, trigger: 'blur' }]
      },
      resValidate: {
        name: [{ required: true, validator: validateResName, trigger: 'change' }],
        server: [{}],
        channelid: [{}]
      },
      // 机构树传递的限制
      options: {
        showCheckbox: true,
        showInput: true
      },
      optionsCamera: {
        showCheckbox: true
      },
      // 修改某个路口
      roadItem: {},
      // 增加一个路口
      roadAdd: {
        pid: '',
        name: '',
        code: '',
        laneNumber: 1,
        isshow: true,
        showType: 1,
        image: ''
      },
      laneItem: {},
      resourceItem: {},
      roadCheckAll: [],
      resourceCheckAll: [],
      cameraTreeData: [], // 机构树
      clickWhoCross: ''
    }
  },
  computed: {
    ...mapState({
      crossingList: state => state.vehicle.crossingList,
      resourceList: state => state.vehicle.resourceList,
      laneList: state => state.vehicle.laneList,
      resourceTreeData: state => state.vehicle.resourceTreeData,
      activeOrgId: state => state.vehicle.activeOrgId,
      isResAdd: state => state.vehicle.isResAdd,
      resourceServerArr: state => state.vehicle.resourceServerArr,
      cameraData: state => state.vehicle.cameraTreeData,
      channelIds: state => state.vehicle.channelIds
    }),
    ...mapGetters(['accessToken', 'tipWarningConfig', 'tipErrorConfig'])
  },
  methods: {
    ...mapMutations(['RESOURCE_EDIT', 'LANE_CLEAR']),
    ...mapActions([
      'getCrossList',
      'getResourceList',
      'crossingAdd',
      'crossingEdit',
      'crossingDelete',
      'getLaneList',
      'laneEdit',
      'getResourceTreeData',
      'resourceAdd',
      'resourceEdit',
      'resourceDelete',
      'resourceBatchDelete',
      'getAllServerList',
      'getCameraTree',
      'crossBatchDelete',
      'getChannelIdList',
      'channelIdsAll',
      'checkCross',
      'checkLane'
    ]),
    showModal(name) {
      this.modalShow = name
    },
    roadShow(val, param) {
      this.roadAdd.pid = this.activeOrgId
      val === 'add' ? (this.roadTitle = '添加路口') : (this.roadTitle = '修改路口')
      val === 'add'
        ? (this.roadItem = JSON.parse(JSON.stringify(this.roadAdd)))
        : (this.roadItem = JSON.parse(JSON.stringify(param.row)))
      if (this.roadItem.showType === 1) {
        this.laneRadio = '电子地图'
      } else {
        this.laneRadio = '图片'
      }
      this.hasCrossModal = true
    },
    roadCancel() {
      this.hasCrossModal = false
      this.$refs['crossValidate'].resetFields()
    },
    roadOk(title) {
      if (this.laneRadio === '电子地图') {
        this.roadItem.showType = 1
      } else {
        this.roadItem.showType = 2
      }
      this.$refs['crossValidate'].validate(valid => {
        if (valid) {
          if (title === '添加路口') {
            this.crossingAdd(this.roadItem)
              .then(() => {
                this.hasCrossModal = false
                this.getCrossList(1).then(() => {
                  this.getLaneList({
                    page: 1,
                    list: this.crossingList.list[0]._id
                  })
                })
                this.$refs['crossValidate'].resetFields()
              })
              .catch(err => {
                if (this.tipErrorConfig.show) {
                  this.$Notice.error({
                    title: '添加路口失败!',
                    duration: this.tipErrorConfig.dur
                  })
                }
                console.log('crossingAdd error: ' + err)
              })
          } else if (title === '修改路口') {
            this.crossingEdit(this.roadItem)
              .then(() => {
                this.hasCrossModal = false
                this.getCrossList(this.pageCros)
                this.getLaneList({ page: 1, list: this.roadItem._id })
                this.$refs['crossValidate'].resetFields()
              })
              .catch(err => {
                if (this.tipErrorConfig.show) {
                  this.$Notice.error({
                    title: '修改路口失败!',
                    duration: this.tipErrorConfig.dur
                  })
                }
                console.log('crossingEdit error: ' + err)
              })
          }
        }
      })
    },
    roadRemove(param) {
      const _this = this
      this.$Modal.confirm({
        title: '警告',
        content: '确定删除吗?',
        cancelText: '取消',
        onOk: function() {
          _this
            .crossingDelete(param.row._id)
            .then(() => {
              if (_this.crossingList.list.length === 1) {
                _this.getCrossList(1)
                _this.pageCros = 1
              } else {
                _this.getCrossList(_this.pageCros)
              }
              if (param.row._id === _this.laneList.list[0].pid) {
                _this.LANE_CLEAR()
              }
              _this.isRoadRemove = true // 禁用多选删除按钮
              // _this.getLaneList({ page: 1, list: _this.crossActiveId })
            })
            .catch(err => {
              if (_this.tipErrorConfig.show) {
                _this.$Notice.error({
                  title: '删除路口失败!',
                  duration: _this.tipErrorConfig.dur
                })
              }
              console.log('roadRemove error: ' + err)
            })
        }
      })
    },
    roadCheck(val) {
      this.roadCheckAll = val
      if (this.roadCheckAll.length > 0) {
        this.isRoadRemove = false
      } else {
        this.isRoadRemove = true
      }
    },
    roadRemoveBatch() {
      if (this.roadCheckAll.length > 0) {
        const _this = this
        this.$Modal.confirm({
          title: '警告',
          content: '确定删除吗?',
          cancelText: '取消',
          onOk: function() {
            const idList = []
            let flag = false
            _this.roadCheckAll.forEach(item => {
              idList.push(item._id)
              // 删除的路口里面有没有在显示的车道的父亲路口
              if (_this.laneList.list[0] && item._id === _this.laneList.list[0].pid) {
                flag = true
              }
            })
            _this
              .crossBatchDelete(idList)
              .then(() => {
                // 获取路口列表
                if (_this.crossingList.list.length === idList.length) {
                  if (_this.pageCros === _this.crossingList.pages) {
                    _this.getCrossList(1)
                    _this.pageCros = 1
                  } else {
                    _this.getCrossList(_this.pageCros)
                  }
                } else {
                  _this.getCrossList(_this.pageCros)
                }
                _this.isRoadRemove = true // 禁用多选删除按钮
                // 获取车道列表
                if (flag) {
                  _this.LANE_CLEAR()
                }
              })
              .catch(err => {
                if (_this.tipErrorConfig.show) {
                  _this.$Notice.error({
                    title: '删除路口失败!',
                    duration: _this.tipErrorConfig.dur
                  })
                }
                console.log('roadRemoveBatch error: ' + err)
              })
          }
        })
      }
    },
    roadRowClick(val) {
      this.clickWhoCross = val._id
      this.rowClassName = function() {}
      this.getLaneList({ page: 1, list: val._id })
    },
    /**
     * 车道管理修改
     */
    laneShow(val, param) {
      this.laneItem = JSON.parse(JSON.stringify(param.row))
      if (!this.laneItem.resource) {
        this.laneItem.code = ''
        this.laneItem.resource = ''
        this.showStr = ''
      } else {
        this.showStr = this.laneItem.resourceName
      }
      this.getCameraTree(this.laneItem.resource)
        .then(() => {
          this.cameraTreeData = JSON.parse(JSON.stringify(this.cameraData))
          this.activeId = this.laneItem.resource
        })
        .catch(err => {
          console.log('getCameraTree error: ' + err)
        })
      this.hasLaneModal = true
    },
    laneCancel() {
      this.$refs['laneValidate'].resetFields()
      this.hasLaneModal = false
    },
    laneOk() {
      this.$refs['laneValidate'].validate(valid => {
        if (valid) {
          this.laneEdit(this.laneItem)
            .then(() => {
              this.hasLaneModal = false
              this.$refs['laneValidate'].resetFields()
              this.getLaneList({ page: this.pageLane, list: this.laneItem.pid })
            })
            .catch(err => {
              if (this.tipErrorConfig.show) {
                this.$Notice.error({
                  title: '修改车道失败!',
                  duration: this.tipErrorConfig.dur
                })
              }
              console.log('laneOk error: ' + err)
            })
        }
      })
    },
    resourceAddShow() {
      this.getResourceTreeData()
        .then(res => {
          this.hasResAdd = true
        })
        .catch(err => {
          this.$Notice.error({ title: '资源树获取失败!' })
          console.log('getResourceTreeData error: ' + err)
        })
    },
    resourceEditShow(param) {
      this.resourceItem = JSON.parse(JSON.stringify(param.row))
      this.serverSelect(this.resourceItem.server)
      this.hasResEdit = true
    },
    resAddCancel() {
      this.hasResAdd = false
    },
    resAddOk() {
      const node = this.$refs.orgTree.getSelectedNodes()
      const arr = []
      for (let item of node) {
        if (item.eid) {
          arr.push(item._id)
        }
      }
      this.resourceAdd(arr)
        .then(() => {
          this.hasResAdd = false
          this.getResourceList(1)
        })
        .catch(err => {
          if (this.tipErrorConfig.show) {
            this.$Notice.error({
              title: '添加资源失败!',
              duration: this.tipErrorConfig.dur
            })
          }
          console.log('resAddOk error: ' + err)
        })
    },
    resEditCancel() {
      this.hasResEdit = false
      this.$refs['resourceValidate'].resetFields()
    },
    resEditOk() {
      this.$refs['resourceValidate'].validate(valid => {
        if (valid) {
          this.RESOURCE_EDIT(this.resourceItem)
          this.resourceEdit()
            .then(() => {
              this.hasResEdit = false
              this.$refs['resourceValidate'].resetFields()
              this.getResourceList(this.pageRes)
            })
            .catch(err => {
              if (this.tipErrorConfig.show) {
                this.$Notice.error({
                  title: err,
                  duration: this.tipErrorConfig.dur
                })
              }
              console.log('resEditOk error: ' + err)
            })
        }
      })
    },
    resourceRemove(param) {
      const _this = this
      this.$Modal.confirm({
        title: '警告',
        content: '确定删除吗?',
        cancelText: '取消',
        onOk: function() {
          _this
            .resourceDelete(param.row._id)
            .then(() => {
              if (_this.resourceList.list.length === 1) {
                _this.getResourceList(1)
                _this.pageRes = 1
              } else {
                _this.getResourceList(_this.pageRes)
              }
              _this.isResRemove = true // 禁用多选删除按钮
            })
            .catch(err => {
              if (_this.tipErrorConfig.show) {
                _this.$Notice.error({
                  title: '删除资源失败!',
                  duration: _this.tipErrorConfig.dur
                })
              }
              console.log('resourceRemove error: ' + err)
            })
        }
      })
    },
    resourceCheck(val) {
      this.resourceCheckAll = val
      if (this.resourceCheckAll.length > 0) {
        this.isResRemove = false
      } else {
        this.isResRemove = true
      }
    },
    resRemoveBatch() {
      if (this.resourceCheckAll.length > 0) {
        const _this = this
        this.$Modal.confirm({
          title: '警告',
          content: '确定删除吗?',
          cancelText: '取消',
          onOk: function() {
            const idList = []
            _this.resourceCheckAll.forEach(item => {
              idList.push(item._id)
            })
            _this
              .resourceBatchDelete(idList)
              .then(() => {
                if (_this.resourceList.list.length === idList.length) {
                  if (_this.pageRes === _this.resourceList.pages) {
                    _this.getResourceList(1)
                    _this.pageRes = 1
                  } else {
                    _this.getResourceList(_this.pageRes)
                  }
                } else {
                  _this.getResourceList(_this.pageRes)
                }
                _this.isResRemove = true // 禁用多选删除按钮
              })
              .catch(err => {
                if (_this.tipErrorConfig.show) {
                  _this.$Notice.error({
                    title: '删除资源失败!',
                    duration: _this.tipErrorConfig.dur
                  })
                }
                console.log('resRemoveBatch error: ' + err)
              })
          }
        })
      }
    },
    laneFormatError(file) {
      if (this.tipWarningConfig.show) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg, png, bmp 或 jpeg 格式的图片。',
          duration: this.tipWarningConfig.dur
        })
      }
    },
    uploadLaneSuc(response) {
      this.roadItem.image = response.id
    },
    clickCameraTree(node, obj) {
      if (!node.isOrg) {
        this.showStr = node.name
        this.activeId = node._id
        this.laneItem.resource = node._id
      }
    },
    // 分页
    changePageRes(n) {
      this.pageRes = n
      this.getResourceList(n)
      this.resourceCheckAll = []
      this.isResRemove = true
    },
    changePageCros(n) {
      this.pageCros = n
      this.getCrossList(n)
      this.roadCheckAll = []
      this.isRoadRemove = true
    },
    changePageLane(n) {
      this.pageLane = n
      this.getLaneList({ page: n, list: this.laneList.list[0].pid })
    },
    // 选中第一行
    rowClassName(row, index) {
      if (index === 0) {
        return 'ivu-table-row-highlight'
      }
      return ''
    },
    // 服务器改变时调用频道号列表
    serverSelect(item) {
      if (!item) {
        return
      }
      if (!this.resourceItem.channelid) {
        this.getChannelIdList({ serid: item })
          .then(res => {
            if (res === []) {
              this.warningMsg('没有可使用的频道号')
            }
            // this.resourceItem.channelid = this.channelIds ? this.channelIds[0].value : ''
          })
          .catch(err => {
            console.log('getChannelIdList error' + err)
            this.errorMsg('频道号列表获取失败')
          })
      } else {
        const query = {
          id: this.resourceItem.channelid,
          serid: item
        }
        this.getChannelIdList(query)
          .then()
          .catch(err => {
            console.log('getChannelIdList error' + err)
            this.errorMsg('频道号列表获取失败')
          })
      }
    },
    strLength(value) {
      let strlen = 0
      for (let i = 0; i < value.length; i++) {
        if (value.charCodeAt(i) > 255) {
          // 如果是汉字，则字符串长度加2
          strlen += 2
        } else {
          strlen++
        }
      }
      return strlen
    }
  },
  created() {
    this.headerObj.Authorization = `Bearer ${this.accessToken}`
    this.getAllServerList()
    this.getResourceTreeData()
    this.channelIdsAll()
      .then(res => {
        this.ChannelIdAll = res
      })
      .catch(err => {
        console.log('channelIdsAll error' + err)
      })
  },
  mounted() {
    this.resTableHheight = this.$refs['tableBox'].offsetHeight - 140
    this.crossTableHeight = (this.$refs['tableBox'].offsetHeight - 219) / 2
  },
  watch: {
    laneRadio() {
      if (this.laneRadio === '电子地图') {
        this.flag = true
      } else {
        this.flag = false
      }
    },
    resourceItem: {
      handler: function(val, oldVal) {
        if (this.resourceItem.hasserver) {
          this.$set(this.resValidate.server[0], 'required', true)
          this.$set(this.resValidate.server[0], 'validator', (rule, value, callback) => {
            if (this.resourceServerArr && this.resourceServerArr.length > 0) {
              if (value) {
                callback()
              } else {
                callback(new Error('不能为空'))
              }
            } else {
              callback(new Error('列表为空'))
            }
          })
          this.$set(this.resValidate.server[0], 'trigger', 'change')
          this.$set(this.resValidate.channelid[0], 'required', true)
          this.$set(this.resValidate.channelid[0], 'validator', (rule, value, callback) => {
            if (value) {
              callback()
            } else {
              callback(new Error('不能为空'))
            }
          })
          this.$set(this.resValidate.channelid[0], 'trigger', 'change')
        } else {
          this.$set(this.resValidate.server, 0, {})
          this.$set(this.resValidate.channelid, 0, {})
          this.$set(this.resValidate.channelid[0], 'required', false)
          this.$refs['resourceValidate'].validate(valid => {})
        }
      },
      deep: true
    }
  }
}
</script>
<style scoped>
.fixWidth {
  width: 296px;
}
.tenRow .table-content {
  position: relative;
  flex: 1;
}
.fiveRow .table-content {
  position: relative;
  flex: 1;
}
.table-content .table-body {
  position: absolute;
  width: 100%;
  height: 100%;
}
.manage h3 {
  margin-bottom: 10px;
}
.manage .allbutton.add {
  margin-right: 8px;
}
.addCrossing {
  display: flex;
  padding: 0 10px;
}
.uploadLane {
  display: flex;
  flex: 0 0 100px;
  margin-left: 20px;
  padding-bottom: 114px;
  flex-direction: column-reverse;
}
.uploadLane img {
  width: 98px;
  height: 80px;
  margin: 0 0 10px 0;
}
.rowStyle {
  display: flex;
  margin-bottom: 24px;
}
.checkLeft {
  flex: 0 0 100px;
  line-height: 32px;
}
.checkLeft.ivu-checkbox-wrapper {
  margin-right: 0;
}
.hide {
  height: 500px;
  overflow: auto;
}
.btnsPre {
  padding: 0 20px 12px 24px;
}
.res-table-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: visible;
}
.table-content .table-body {
  position: static;
}
</style>
