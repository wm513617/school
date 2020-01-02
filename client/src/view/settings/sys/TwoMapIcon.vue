<template>
  <div class="two-map-icon">
    <main class="main">
      <div class="main-left">
        <h4>图标  </h4>
        <bsr-tree
          v-model="defaultSelect"
          :treeData="iconTreeData"
          ref="bstree"
          @node-click="treeClick">
          <template slot-scope="{ node }">
            <span :title="node.name">
              {{node.name}}
            </span>
          </template>
        </bsr-tree>
      </div>
      <div class="main-center">
        <header class="header">
          <Button type='ghost' icon="ivu-icon ivu-icon-plus" @click="showAddModel = true" :disabled="isMapIconAdd" style="margin-right: 8px;">添加</Button>
          <Button type='ghost' icon="ios-trash-outline" @click="mapIconDel" :disabled="isMapIconDel">删除</Button>
          <div class="search-model">
            <Input
              :maxlength='64'
              v-model="inSearchName"
              @on-change='searchChange'
              placeholder="请输入图标名称"
              style="width: 250px;"
            >
            <Button
              slot="append"
              @click="searchIcon"
              :icon="isIcon ? 'search' : 'close'"
            ></Button>
            </Input>
          </div>
          <Modal class="manage-model" :title="isIconEdit ? '图标编辑' : '图标添加'" v-model="showAddModel" :mask-closable="false" @on-visible-change="closeAddModel" @on-cancel="clearInfoValidate" width="680">
            <Form ref="infoValidate" class="add-Icon-form" :model="infoValidate" :rules="infoRuleValidate" label-position="left" :label-width="85" style="width:275px; margin-right:20px">
              <FormItem label="图标名称" prop="name">
                <Input v-model="infoValidate.name" placeholder="请输入图标名称"></Input>
              </FormItem>
            </Form>
            <ul class="img-list ivu-form-item-required">
              <li v-if="this.iconShowParam.isNormal">
                <p class="ivu-form-item-label">正常</p>
                <div class="form-image">
                  <img :src="normalImgSrc" v-if="normalImgSrc !== ''">
                </div>
                <Upload action="/api/setting/icon/upload_pic" name="file"
                  :headers="headerObj"
                  :max-size="2048"
                  :show-upload-list="false"
                  :on-success="importNormalSuccess"
                  :on-exceeded-size="exceededSize"
                  :before-upload="detailBeforeUpload"
                  >
                  <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
                </Upload>
              </li>
              <li v-if="this.iconShowParam.isOffline">
                <p>离线</p>
                <div class="form-image">
                  <img :src="offLineImgSrc" v-if="offLineImgSrc !== ''">
                </div>
                <Upload action="/api/setting/icon/upload_pic" :headers="headerObj" name="file"
                  :max-size="2048"
                  :show-upload-list="false"
                  :on-success="importOffLineSuccess"
                  :on-exceeded-size="exceededSize"
                  :before-upload="detailBeforeUpload">
                  <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
                </Upload>
              </li>
              <li v-if="this.iconShowParam.isAlarm">
                <p>报警</p>
                <div class="form-image">
                  <img :src="alarmImgSrc" v-if="alarmImgSrc !== ''">
                </div>
                <Upload action="/api/setting/icon/upload_pic" :headers="headerObj" name="file"
                  :max-size="2048"
                  :show-upload-list="false"
                  :on-success="importAlarmSuccess"
                  :on-exceeded-size="exceededSize"
                  :before-upload="detailBeforeUpload">
                  <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
                </Upload>
              </li>
              <li v-if="this.iconShowParam.isStopped">
                <p>停用</p>
                <div class="form-image">
                  <img :src="stoppedImgSrc" v-if="stoppedImgSrc !== ''">
                </div>
                <Upload action="/api/setting/icon/upload_pic" :headers="headerObj" name="file"
                  :max-size="2048"
                  :show-upload-list="false"
                  :on-success="importStoppedSuccess"
                  :on-exceeded-size="exceededSize"
                  :before-upload="detailBeforeUpload">
                  <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
                </Upload>
              </li>
              <li v-if="this.iconShowParam.isOpen">
                <p class="ivu-form-item-label">开启</p>
                <div class="form-image">
                  <img :src="openImgSrc" v-if="openImgSrc !== ''">
                </div>
                <Upload action="/api/setting/icon/upload_pic" :headers="headerObj" name="file"
                  :max-size="2048"
                  :show-upload-list="false"
                  :on-success="importOpenSuccess"
                  :on-exceeded-size="exceededSize"
                  :before-upload="detailBeforeUpload">
                  <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
                </Upload>
              </li>
              <li v-if="this.iconShowParam.isClose">
                <p class="ivu-form-item-label">关闭</p>
                <div class="form-image">
                  <img :src="closeImgSrc" v-if="closeImgSrc !== ''">
                </div>
                <Upload action="/api/setting/icon/upload_pic" :headers="headerObj" name="file"
                  :max-size="2048"
                  :show-upload-list="false"
                  :on-success="importCloseSuccess"
                  :on-exceeded-size="exceededSize"
                  :before-upload="detailBeforeUpload">
                  <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
                </Upload>
              </li>
              <li v-if="this.iconShowParam.isAbnormal">
                <p class="ivu-form-item-label">异常</p>
                <div class="form-image">
                  <img :src="abnormalImgSrc" v-if="abnormalImgSrc !== ''">
                </div>
                <Upload action="/api/setting/icon/upload_pic" :headers="headerObj" name="file"
                  :max-size="2048"
                  :show-upload-list="false"
                  :on-success="importAbnormalSuccess"
                  :on-exceeded-size="exceededSize"
                  :before-upload="detailBeforeUpload">
                  <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
                </Upload>
              </li>
            </ul>
            <p style="color:red; padding:20px 30px 0;">请上传宽高不大于100px的图标</p>
            <div slot="footer" style="position:relative;z-index:99">
              <Button type="ghost" @click="clearInfoValidate">取消</Button>
              <Button type="primary" @click="mapIconAdd">确定</Button>
            </div>
          </Modal>
        </header>
        <div ref="tableHeight" style="height:calc(100% - 78px);">
          <Table highlight-row
            :height="tableHeight"
            :columns="iconColumns"
            :data="iconListData"
            @on-current-change="selelctRow"
            @on-row-click="highLightDeleteBtn"></Table>
        </div>
        <footer class="footer">
          <Page class="rt" show-sizer show-elevator show-total
            :page-size-opts="$PageInfo.size"
            @on-page-size-change="pageSizeChange"
            :current='Number(startNum)'
            :total="Number(inPageNum)"
            :page-size="Number(pageLimit)"
            @on-change="pageChange"></Page>
        </footer>
      </div>
      <div class="main-right">
        <h4>预览</h4>
        <ul v-if="iconListData.length > 0">
          <li v-for="(icon, i) in selectIconList" :key="i">
            <span class="alarm-name">{{icon.title}}</span>
            <div class="alarm-img-box">
              <img class="alarm-img" :src="icon.value" alt="加载失败">
            </div>
          </li>
        </ul>
        <div v-if="isVideo" class="icon-right-bottom">
          <span class="alarm-name">图标方向跟随可视域</span>
          <i-switch :value="selectedIconData && selectedIconData.isRotate" @on-change="updateIsRotate"></i-switch>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { RESICONOID, DEFAULTOPS } from 'assets/2DMap/meta/common.js'
const validateName = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('名称不能为空'))
  }
  let reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
  if (!reg.test(value)) {
    return callback(new Error('请输入小于64位字符的字母和汉字'))
  } else {
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
    if (strlen > 64) {
      return callback(new Error('请输入小于64位字符的字母和汉字'))
    } else {
      return callback()
    }
  }
}
export default {
  data() {
    return {
      isIcon: true,
      isMapIconDel: true,
      showAddModel: false,
      inSearchName: '',
      defaultSelect: {},
      iconTreeData: {},
      selectedTree: '',
      tableHeight: '',
      imageFormat: ['image/jpg', 'image/png', 'image/bmp', 'image/jpeg'],
      iconColumns: [
        {
          type: 'index',
          title: '序号',
          align: 'center',
          width: 100
        },
        {
          title: '图标名称',
          align: 'center',
          key: 'name',
          ellipsis: true
        },
        {
          title: '操作',
          align: 'center',
          key: 'operation',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '20px'
                },
                on: {
                  click: () => {
                    this.editRow(params.row)
                  }
                }
              }, '修改'),
              h(
                'span',
                {
                  style: {
                    marginRight: '20px'
                  }
                },
                '默认'
              ),
              h('i-switch', {
                props: {
                  value: params.row.default
                },
                on: {
                  'on-change': (val) => {
                    this.changeDefaultRow(val, params.row._id)
                  }
                }
              })
            ])
          }
        }
      ],
      iconListData: [],
      selectRows: [],
      selectedIconData: {}, // 选中的图标数据
      isVideo: false, // 是否是视频资源
      selectIconList: [
        {
          title: '正常',
          value: ''
        },
        {
          title: '离线',
          value: ''
        },
        {
          title: '报警',
          value: ''
        },
        {
          title: '停用',
          value: ''
        },
        {
          title: '开启',
          value: ''
        },
        {
          title: '关闭',
          value: ''
        },
        {
          title: '异常',
          value: ''
        }
      ],
      infoValidate: {
        name: '',
        normalUrl: '',
        offLineUrl: '',
        alarmUrl: '',
        stoppedUrl: '',
        openUrl: '',
        closeUrl: '',
        abnormalUrl: '',
        editId: '',
        oid: ''
      },
      infoRuleValidate: {
        name: [{ required: true, validator: validateName, trigger: 'change' }]
      },
      startNum: 1, // 页码
      pageLimit: 100, // 每页条数
      inPageNum: 0, // 总共条数
      iconShowParam: { // 添加、编辑图标数据，图标显示参数
        isNormal: false, // 正常（视频、报警、报警求助、巡更、单兵）
        isOffline: false, // 离线（视频、）
        isAlarm: false, // 报警（视频、报警、报警求助、、巡更、单兵）
        isStopped: false, // 停用（视频、报警、报警求助）
        isOpen: false, // 开启（门禁）
        isClose: false, // 关闭（门禁）
        isAbnormal: false // 异常（门禁）
      },
      isIconEdit: false // 图标是否处于编辑状态
    }
  },
  computed: {
    ...mapGetters(['accessToken']),
    normalImgSrc() {
      return this.infoValidate.normalUrl === '' ? '' : this.infoValidate.normalUrl
    },
    offLineImgSrc() {
      return this.infoValidate.offLineUrl === '' ? '' : this.infoValidate.offLineUrl
    },
    alarmImgSrc() {
      return this.infoValidate.alarmUrl === '' ? '' : this.infoValidate.alarmUrl
    },
    stoppedImgSrc() {
      return this.infoValidate.stoppedUrl === '' ? '' : this.infoValidate.stoppedUrl
    },
    openImgSrc() {
      return this.infoValidate.openUrl === '' ? '' : this.infoValidate.openUrl
    },
    closeImgSrc() {
      return this.infoValidate.closeUrl === '' ? '' : this.infoValidate.closeUrl
    },
    abnormalImgSrc() {
      return this.infoValidate.abnormalUrl === '' ? '' : this.infoValidate.abnormalUrl
    },
    isMapIconAdd() {
      let result = false
      if (this.selectedTree.pid) {
        if (this.selectedTree.pid === 'root') {
          result = true
        }
      } else {
        result = true
      }
      return result
    },
    // },
    headerObj() {
      return {Authorization: `Bearer ${this.accessToken}`}
    }
  },
  watch: {
    showAddModel(flag) { // 监听图标添加/编辑弹窗显示状态变化
      if (!flag) { // 不显示时，图标编辑状态改为false
        this.isIconEdit = false
      }
    }
  },
  methods: {
    ...mapActions([
      'getIconOrganiza',
      'getIconList',
      'addIcon',
      'updateIcon',
      'removeIcon',
      'setDefaultIcon',
      'setIconRotate'
    ]),
    updateIconShowParam(oid) { // 更新图标显示参数
      if (RESICONOID.videoArr.includes(oid)) { // 视频
        this.iconShowParam.isNormal = true// 正常（视频、报警、报警求助、巡更、单兵）
        this.iconShowParam.isOffline = true // 离线（视频）
        this.iconShowParam.isAlarm = true // 报警（视频、报警、报警求助、、巡更、单兵）
        this.iconShowParam.isStopped = true // 停用（视频、报警、报警求助）
        this.iconShowParam.isOpen = false // 开启（门禁）
        this.iconShowParam.isClose = false // 关闭（门禁）
        this.iconShowParam.isAbnormal = false // 异常（门禁）
      } else if (RESICONOID.alarmArr.includes(oid) || RESICONOID.alarmHelpArr.includes(oid)) { // 报警、报警求助
        this.iconShowParam.isNormal = true// 正常（视频、报警、报警求助、巡更、单兵）
        this.iconShowParam.isOffline = false // 离线（视频）
        this.iconShowParam.isAlarm = true // 报警（视频、报警、报警求助、、巡更、单兵）
        this.iconShowParam.isStopped = true // 停用（视频、报警、报警求助）
        this.iconShowParam.isOpen = false // 开启（门禁）
        this.iconShowParam.isClose = false // 关闭（门禁）
        this.iconShowParam.isAbnormal = false // 异常（门禁）
      } else if (RESICONOID.doorControlArr.includes(oid)) { // 门禁
        this.iconShowParam.isNormal = false// 正常（视频、报警、报警求助、巡更、单兵）
        this.iconShowParam.isOffline = false // 离线（视频）
        this.iconShowParam.isAlarm = false // 报警（视频、报警、报警求助、、巡更、单兵）
        this.iconShowParam.isStopped = false // 停用（视频、报警、报警求助）
        this.iconShowParam.isOpen = true // 开启（门禁）
        this.iconShowParam.isClose = true // 关闭（门禁）
        this.iconShowParam.isAbnormal = true // 异常（门禁）
      } else if (RESICONOID.patrolArr.includes(oid) || RESICONOID.singleArr.includes(oid)) { // 巡更、单兵
        this.iconShowParam.isNormal = true// 正常（视频、报警、报警求助、巡更、单兵）
        this.iconShowParam.isOffline = false // 离线（视频）
        this.iconShowParam.isAlarm = true // 报警（视频、报警、报警求助、、巡更、单兵）
        this.iconShowParam.isStopped = false // 停用（视频、报警、报警求助）
        this.iconShowParam.isOpen = false // 开启（门禁）
        this.iconShowParam.isClose = false // 关闭（门禁）
        this.iconShowParam.isAbnormal = false // 异常（门禁）
      }
    },
    // 树相关
    treeClick(node) {
      console.log('选中的树节点：', JSON.stringify(node))
      this.selectedTree = node
      if (node && node._id) {
        this.updateIconShowParam(node._id) // 更新添加、编辑面板图标显示的参数
      }
      this.getIcon()
    },
    // 按钮相关
    mapIconAdd() {
      this.$refs.infoValidate.validate(val => {
        if (val) {
          if (RESICONOID.doorControlArr.includes(this.selectedTree._id)) { // 门禁
            if (this.infoValidate.openUrl === '') {
              return this.errorMsg('请上传开启图标')
            }
            if (this.infoValidate.closeUrl === '') {
              return this.errorMsg('请上传关闭图标')
            }
            if (this.infoValidate.abnormalUrl === '') {
              return this.errorMsg('请上传异常图标')
            }
          } else { // 其他（视频、报警、报警求助、巡更、单兵）
            if (this.infoValidate.normalUrl === '') {
              return this.errorMsg('请上传正常图标')
            }
          }
          let params = {
            name: this.infoValidate.name,
            files: [],
            oid: this.selectedTree._id
          }
          if (this.infoValidate.normalUrl !== '') {
            params.files.push({path: this.infoValidate.normalUrl,
              status: 'online'
            })
          }
          if (this.infoValidate.offLineUrl !== '') {
            params.files.push({path: this.infoValidate.offLineUrl,
              status: 'offline'
            })
          }
          if (this.infoValidate.alarmUrl !== '') {
            params.files.push({path: this.infoValidate.alarmUrl,
              status: 'alarm'
            })
          }
          if (this.infoValidate.stoppedUrl !== '') {
            params.files.push({path: this.infoValidate.stoppedUrl,
              status: 'stopped'
            })
          }
          if (this.infoValidate.openUrl !== '') {
            params.files.push({path: this.infoValidate.openUrl,
              status: 'open'
            })
          }
          if (this.infoValidate.closeUrl !== '') {
            params.files.push({path: this.infoValidate.closeUrl,
              status: 'close'
            })
          }
          if (this.infoValidate.abnormalUrl !== '') {
            params.files.push({path: this.infoValidate.abnormalUrl,
              status: 'abnormal'
            })
          }
          this.modelSave(params)
          this.clearInfoValidate()
        }
      })
    },
    modelSave(params) {
      if (this.infoValidate.editId !== '') {
        this.updateIcon({id: this.infoValidate.editId, content: params}).then(() => {
          this.successMsg('图标修改成功')
          this.getIcon()
          this.showAddModel = false
        }).catch(err => {
          this.errorMsg(err.response.data.message)
        })
      } else {
        this.addIcon(params).then(() => {
          this.successMsg('图标添加成功')
          this.getIcon()
          this.showAddModel = false
        }).catch(err => {
          this.errorMsg(err.response.data.message)
        })
      }
    },
    // 删除
    mapIconDel() {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除所选图标吗？</p>',
        onOk: () => {
          let result = this.selectRows.map(obj => { return obj._id })
          if (this.selectRows[0].isDelete && !this.selectRows[0].default) {
            this.removeIcon(result).then(() => {
              this.successMsg('图标删除成功')
              this.isMapIconDel = true
              this.getIcon()
              // 重置表单
              this.clearInfoValidate()
            }).catch(err => {
              this.errorMsg(err.response.data.message)
            })
          } else if (this.selectRows[0].default) {
            return this.errorMsg('默认图标。不可删除。')
          } else {
            return this.errorMsg('内置图标。不可删除。')
          }
        }
      })
      this.isMapIconDel = true
    },
    closeAddModel(val) {
      if (!val) {
        this.$refs.infoValidate.resetFields()
      }
    },
    // 搜索
    searchChange() {
      this.isIcon = true
    },
    searchIcon() {
      if (!this.isIcon) {
        this.inSearchName = ''
      }
      this.startNum = 1
      this.isIcon = !this.isIcon
      this.getIcon()
    },
    getIcon() {
      let query = {
        page: this.startNum,
        limit: this.pageLimit,
        seek: this.inSearchName,
        oid: this.selectedTree._id
      }
      this.getIconList(query).then(res => {
        this.inPageNum = res.headers['x-bsc-count']
        this.iconListData = res.data
        if (this.iconListData[0]) {
          this.selelctRow(this.iconListData[0])
        }
      }).catch(err => {
        this.errorMsg(err.response.data.message)
      })
    },
    // 上传相关
    importNormalSuccess(response) {
      this.infoValidate.normalUrl = response.path
    },
    importOffLineSuccess(response) {
      this.infoValidate.offLineUrl = response.path
    },
    importAlarmSuccess(response) {
      this.infoValidate.alarmUrl = response.path
    },
    importStoppedSuccess(response) {
      this.infoValidate.stoppedUrl = response.path
    },
    importOpenSuccess(response) {
      this.infoValidate.openUrl = response.path
    },
    importCloseSuccess(response) {
      this.infoValidate.closeUrl = response.path
    },
    importAbnormalSuccess(response) {
      this.infoValidate.abnormalUrl = response.path
    },
    exceededSize(file) {
      this.$Notice.warning({
        title: '图片大小超过限制',
        desc: '图片 ' + file.name + ' 大小超过限制，请上传小于2M，尺寸为100*100的图片。'
      })
    },
    // 重置表单
    clearInfoValidate() {
      this.showAddModel = false
      this.infoValidate = {
        name: '',
        normalUrl: '',
        offLineUrl: '',
        alarmUrl: '',
        stoppedUrl: '',
        openUrl: '',
        closeUrl: '',
        abnormalUrl: '',
        editId: '',
        oid: ''
      }
    },
    // 限制上传图标宽高
    detailBeforeUpload(file) {
      if (this.imageFormat.includes(file.type)) { // 文件为允许的图片格式时
        return this.checkImageWH(file, 100, 100)
      } else {
        this.warningMsg('图片 ' + file.name + ' 格式不正确，请上传 png，jpg，jpeg 或 bmp 格式的图片。')
        return false
      }
    },
    checkImageWH(file, width, height) {
      let self = this
      return new Promise(function(resolve, reject) {
        let filereader = new FileReader()
        filereader.onload = e => {
          let src = e.target.result
          const image = new Image()
          image.onload = function() {
            if (width && this.width > width) {
              self.$Notice.error({
                title: '请上传宽高不大于' + width + '的图片'
              })
            } else if (height && this.height > height) {
              self.$Notice.error({
                title: '请上传宽高不大于' + height + '的图片'
              })
            } else {
              resolve()
            }
          }
          image.onerror = reject
          image.src = src
        }
        filereader.readAsDataURL(file)
      })
    },
    highLightDeleteBtn(data, index) {
      this.isMapIconDel = false
    },
    // 表格相关
    selelctRow(obj) {
      // 改变表格选中项
      this.selectIconList = []
      this.selectRows = []
      this.selectRows.push(obj)
      this.selectedIconData = JSON.parse(JSON.stringify(obj))
      if (!this.selectedIconData.hasOwnProperty('isRotate')) {
        this.selectedIconData.isRotate = DEFAULTOPS.rotateIpcTypes.includes(this.selectedIconData.oid)
      }
      this.isVideo = RESICONOID.videoArr.includes(this.selectedIconData.oid)
      console.log('右侧预览的图标数据：', JSON.parse(JSON.stringify(this.selectedIconData)))
      obj.files.forEach(item => {
        let result = {
          title: '离线',
          value: ''
        }
        result.value = item.path
        if (item.status === 'online') {
          result.title = '正常'
        }
        if (item.status === 'offline') {
          result.title = '离线'
        }
        if (item.status === 'alarm') {
          result.title = '报警'
        }
        if (item.status === 'stopped') {
          result.title = '停用'
        }
        if (item.status === 'open') {
          result.title = '开启'
        }
        if (item.status === 'close') {
          result.title = '关闭'
        }
        if (item.status === 'abnormal') {
          result.title = '异常'
        }
        this.selectIconList.push(result)
      })
      this.isMapIconDel = true
    },
    // 原来的多选
    // selectIconRow(arr) {
    //   arr.length > 0
    //     ? this.isMapIconDel = false
    //     : this.isMapIconDel = true
    //   this.selectRows = arr
    // },
    editRow(obj) {
      if (!obj.isDelete) {
        return this.errorMsg('内置图标。不可修改。')
      }
      this.isIconEdit = true // 图标编辑状态置为true
      this.updateIconShowParam(obj.oid) // 更新编辑弹框，图标显示参数
      this.infoValidate.name = obj.name
      this.infoValidate.editId = obj._id
      this.infoValidate.oid = obj.oid
      obj.files.forEach(ele => {
        if (ele.status === 'online') {
          this.infoValidate.normalUrl = ele.path
        }
        if (ele.status === 'offline') {
          this.infoValidate.offLineUrl = ele.path
        }
        if (ele.status === 'alarm') {
          this.infoValidate.alarmUrl = ele.path
        }
        if (ele.status === 'stopped') {
          this.infoValidate.stoppedUrl = ele.path
        }
        if (ele.status === 'open') {
          this.infoValidate.openUrl = ele.path
        }
        if (ele.status === 'close') {
          this.infoValidate.closeUrl = ele.path
        }
        if (ele.status === 'abnormal') {
          this.infoValidate.abnormalUrl = ele.path
        }
      })
      this.showAddModel = true
    },
    changeDefaultRow(value, id) {
      this.setDefaultIcon({ id: id, content: { default: value } }).then(() => {
        this.renovateList()
        if (this.iconListData.length > 1) {
          value
            ? this.successMsg('设置默认成功')
            : this.successMsg('关闭默认成功')
        } else {
          this.errorMsg('至少存在一条默认')
        }
      }).catch((err) => {
        this.errorMsg(err.response.data.message)
      })
    },
    renovateList() {
      let query = {
        page: this.startNum,
        limit: this.pageLimit,
        seek: this.inSearchName,
        oid: this.selectedTree._id
      }
      this.getIconList(query).then(res => {
        this.inPageNum = res.headers['x-bsc-count']
        this.iconListData = res.data
        this.selelctRow(this.iconListData[0])
      }).catch(err => {
        this.errorMsg(err.response.data.message)
      })
    },
    // 分页相关
    pageChange(n) {
      this.startNum = n
      this.getIcon()
    },
    pageSizeChange(s) {
      this.pageLimit = s
      this.getIcon()
    },
    updateIsRotate(flag) { // 更新视频图标是否跟着可视域旋转
      this.setIconRotate({oid: this.selectedIconData.oid, isRotate: flag}).then(() => {
        this.renovateList()
      }).catch((err) => {
        this.errorMsg(err.response.data.message)
      })
    }
  },
  created() {
    this.getIconOrganiza().then(res => {
      this.selectedTree = this.defaultSelect = this.iconTreeData = res.data
      console.log(res.data)
      this.getIcon()
    }).catch(err => {
      this.errorMsg(err.response.data.message)
    })
  },
  mounted() {
    this.tableHeight = this.$refs['tableHeight'].offsetHeight
  }
}
</script>

<style scoped lang="less">
.main {
  display: flex;
  height: 100%;
}
h4 {
  text-align: center;
  line-height: 38px;
  height: 38px;
  background: #0f2243;
}

.main-left {
  width: 272px;
  margin-right: 15px;
  background: #1b3153;
}
.main-center {
  flex: 1;
  .header {
    height: 38px;
    line-height: 32px;
    padding: 3px 24px;
    background: #1b3153;
    .search-model{
      float: right;
    }
  }
  .footer {
    width: 100%;
    height: 39px;
    padding: 3px 24px;
    background: #244575;
    .rt {
      float: right;
    }
  }
}
.main-right {
  width: 272px;
  margin: 0 16px;
  background: #1b3153;
  text-align: center;
  ul {
    padding: 16px;
    li {
      margin: 36px 0;
    }
  }
  .alarm-name {
    float: left;
  }
  .alarm-img-box {
    width: 100px;
    height: 100px;
    margin: auto;
    .alarm-img{
      max-width: 100%;
      max-height: 100%;
    }
  }
  .icon-right-bottom {
    padding: 16px;
  }
}
.img-list {
  text-align: center;
  li {
    display: inline-block;
  .form-image {
      width: 100px;
      height: 100px;
      margin: 16px 28px;
      background: #57657B;
      img{
        max-width: 100%;
        max-height: 100%;
        margin-top: 50%;
        transform: translateY(-50%);
      }
    }
  }
}
</style>
