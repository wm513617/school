<template>
  <div class="manage" v-resize="resizeFun">
    <article class="left-org">
      <header class="org-title">
        <span>底库管理</span>
        <i class="iconfont icon-shuaxin1" @click.stop="getGroupData(true)" title="刷新"></i>
      </header>
      <main>
        <div class="org-header">
          <Input type="text" placeholder="搜索" v-model="searchData">
            <Button slot="append" icon="ios-search" @click="searchGroup"></Button>
          </Input>
        </div>
        <ul class="org-body">
          <li class="group-title" :class="{clickGroup: groupId === item._id}" v-for="(item, index) in groupDatas" :key="index" @click="groupId = item._id">
            <span class="group-name">{{item.name}}</span>
            <i class="iconfont icon-edit" @click="updateGroup(item)" title="修改"></i>
            <i class="iconfont icon-delete" @click="removeGroup(item)" title="删除"></i>
          </li>
          <li><i class="iconfont icon-large" @click="pushGroup"></i> &nbsp;新建底库</li>
        </ul>
      </main>
    </article>
    <main class="right-table">
      <header class="manage-header">
        <Button class="btn" type="ghost" icon="plus" @click="pushUser">添加人员</Button>
        <Button class="btn" type="ghost" :disabled="disableBtn" @click="updateUser" icon="edit">修改</Button>
        <Button class="btn" type="ghost" :disabled="disableBtn" @click="removeUser" icon="trash-a">删除</Button>
        <Button type="ghost" icon="ivu-icon iconfont icon-import" @click="batExport">导入</Button>
        <Button class="btn" type="ghost" :disabled="disableExport" @click="ouputUserList" icon="android-download">导出</Button>
      </header>
      <section class="manage-section" ref="peopleTable">
      <Table :columns="manageColumns" :data="manageData" @on-selection-change="selectpeople" :height="tableHeight" style="height: 100%;"></Table>
      </section>
      <footer class="manage-footer">
        <Page @on-page-size-change="pageSizeChange"
          show-sizer
          :page-size-opts="$PageInfo.size"
          :show-total="true"
          :page-size="pageInfo.limit"
          :show-elevator="true"
          :total="pageInfo.count"
          :current="pageInfo.cur"
          @on-change="changePage">
        </Page>
      </footer>
    </main>
    <aside>
      <Modal class="manage-model" :title="addModelTitle" v-model="showAddModel" :mask-closable="false" @on-visible-change="closeAddModel">
        <!-- 人员内容 -->
        <section class="section-flex" v-show="showPeopleModel">
          <div class="content-left">
            <Form ref="peopleValidate" class="manage-form" :model="peopleValidate" :rules="peopleRuleValidate" label-position="left" :label-width="85">
              <FormItem label="人员名称：" prop="name">
                <Input class="group-form-input" v-model="peopleValidate.name" placeholder="请输入姓名"></Input>
              </FormItem>
              <FormItem label="性别：" prop="gender">
                <RadioGroup v-model="peopleValidate.gender">
                  <Radio :label="2">男</Radio>
                  <Radio :label="1">女</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="年龄：" prop="age">
                <Input class="group-form-input" v-model="peopleValidate.age" placeholder="请输入年龄"></Input>
              </FormItem>
              <FormItem label="身份证号：" prop="code">
                <Input class="group-form-input" v-model="peopleValidate.code" placeholder="请输入身份证号"></Input>
              </FormItem>
              <FormItem label="备注：" prop="remark">
                <Input class="description" type="textarea" v-model="peopleValidate.remark" placeholder="请添加备注"></Input>
              </FormItem>
            </Form>
          </div>
          <div class="content-right">
            <div class="user-logo">
              <img ref="userLogo" :src="logoImgSrc" v-if="logoImgSrc !== ''">
            </div>
            <Upload action="/api/upload/file?type=image&category=face/user" :headers="headerObj" name="file"
              style="margin:16px;"
              :show-upload-list="false"
              :format="['jpg','png','bmp','jpeg']"
              :on-success="importSuccess"
              :on-format-error="formatError"
              :on-exceeded-size="exceededSize">
              <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
            </Upload>
            <div>
            支持JPG、JPEG、PNG、BMP格式的图片，建议有效人脸像素80-200，图片分辨率请勿过大。
            </div>
          </div>
        </section>
        <!-- 底库内容 -->
        <section v-show="!showPeopleModel">
          <Form ref="groupValidate" class="manage-form" :model="groupValidate" :rules="groupRuleValidate" label-position="left" :label-width="85">
            <FormItem label="底库名称：" prop="name">
              <Input class="group-form-input" v-model="groupValidate.name" placeholder="请输入底库名称"></Input>
            </FormItem>
            <FormItem label="底库类型：" prop="type">
              <Select v-model="groupValidate.type">
                <Option v-for="(item, index) in groupType" :key="index" :value="item.value">{{item.title}}</Option>
              </Select>
            </FormItem>
            <FormItem label="相似度值：" prop="similar">
              <!-- <Select v-model="groupValidate.similar">
                <Option v-for="(item, index) in groupDegrees" :key="index" :value="item">{{item + '%'}}</Option>
              </Select> -->
              <InputNumber :max="95" :min="50" v-model="groupValidate.similar" style="width: 90%"></InputNumber>
              <div style="float: right; width: 6%; font-size: 16px">%</div>
            </FormItem>
            <FormItem label="底库颜色：" prop="color">
              <ul class="group-color">
                <li v-for="(color, index) in groupColors" :key="index"
                :class="{'isClick': color === groupValidate.color}"
                :style="{background: color}" :title="color"
                @click="groupValidate.color = color"></li>
              </ul>
            </FormItem>
            <FormItem label="报警音频：" prop="alarmAudio">
              <div class="audio-wrap">
                <Select v-model="groupValidate.alarmAudio">
                  <Option v-for="(item, index) in groupAudios" :key="index" :value="item.value">{{item.name}}</Option>
                </Select>
                <i class="icon iconfont icon-volume" @click="audioPlay"></i>
              </div>
              <audio :src="groupValidate.alarmAudio" ref="groupAudio" style="display:none;"></audio>
            </FormItem>
            <!-- <FormItem label="一键布控：" prop="isAuto">
              <i-switch v-model="groupValidate.isAuto"></i-switch>
            </FormItem> -->
            <FormItem label="备注：" prop="desc">
              <Input class="description" type="textarea" v-model="groupValidate.desc" placeholder="请添加备注"></Input>
            </FormItem>
          </Form>
        </section>
        <div slot="footer" style="position:relative;z-index:99">
          <Button type="ghost" @click="showAddModel=false">取消</Button>
          <Button type="primary" @click="saveContent">确定</Button>
        </div>
      </Modal>
      <Modal title="批量导入" v-model="showUpload" :mask-closable="false" @on-visible-change="closeUploadModel">
        <Form ref="batUploadForm" :label-width="85" label-position="left" :model="importForm" :rules="batUpload">
          <FormItem label="底库类型" prop="group">
            <Select v-model="importForm.group">
              <Option v-for="(item,index) in group" :key="index" :value="item._id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="识别信息">
            <CheckboxGroup v-model="importForm.discernType">
              <Checkbox label="name" :disabled="true"> 姓名</Checkbox>
              <Checkbox label="gender">性别</Checkbox>
              <Checkbox label="code">证件号</Checkbox>
              <Checkbox label="remark">备注</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="识别图片">
            <Upload class="btn" ref="importUpload" name="file" :headers="headerObj"
              multiple
              :max-size="512"
              :data="importForm"
              :action="'/api/veriface/user/batimg'"
              :on-success="uploadSuc"
              :on-error="uploadError"
              :on-exceeded-size="importExceededSize"
              :before-upload="importBefore"
              :show-upload-list="false">
              <Button type="ghost" icon="ios-cloud-upload-outline">上传</Button>
            </Upload>
            <p v-show="importFileNewList.length || importTypeErrorList.length" style="color: darkgray;">
              已选择{{importFileNewList.length || 0}}张 &nbsp;&nbsp;
              <span v-if="importTypeErrorList.length">
                <i class="ivu-icon ivu-icon-android-alert" style="font-size: 16px; color: #855f23;"></i>
                错误格式文件{{importTypeErrorList.length || 0}}个
              </span>
            </p>
            <div class="upload-tips">
              为确保正确解析，文件名请以勾选信息格式顺序命名!
              <br />&nbsp;&nbsp;如：xx_男_12345678_xx.jpg
            </div>
            <div v-show="importStatus" class="import-result">
              <div class="result-count">
                <span>成功：{{importFileList.length}}</span>
                <span>失败: {{importFileErrorList.length + importMaxSizeFiles.length}}</span>
              </div>
                <fieldset class="import-error-list"
                  v-show="importMaxSizeFiles.length">
                  <legend>{{importMaxSizeFiles.length}}个文件大小超过限制:</legend>
                  <bs-scroll ref="scroll" style="height: 70px;">
                    <p v-for="(item,index) in importMaxSizeFiles" :key="index">{{item.name}}</p>
                  </bs-scroll>
                </fieldset>
                <fieldset class="import-error-list"
                  v-show="importFileErrorList.length">
                  <legend>{{importFileErrorList.length}}个文件上传失败:</legend>
                  <bs-scroll ref="scroll2" style="height: 70px;">
                    <p v-for="(item,index) in importFileErrorList" :key="index">{{item.name}}</p>
                  </bs-scroll>
                </fieldset>

            </div>
          </FormItem>
        </Form>
        <div slot="footer" style="position:relative;z-index:99">
          <Button type="ghost" @click="showUpload=false">取消</Button>
          <Button type="primary" :disabled='batchSureDisable' @click="batchSure">确定</Button>
        </div>
      </Modal>
    </aside>
  </div>
</template>
<script>
import { validateName, dispatchDesc, validateAge, validateIdentity } from './common/validate'
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      showAddModel: false,
      showUpload: false,
      importStatus: false,
      batchSureDisable: true,
      disableBtn: true,
      disableExport: true,
      elemIF: null,
      tableHeight: '',
      headerObj: { Authorization: '' },
      searchData: '',
      searchResult: [],
      group: [], // 底库
      groupId: '',
      manageColumns: [
        {
          type: 'selection',
          width: 100,
          align: 'center'
        },
        {
          type: 'index',
          title: '序号',
          align: 'center',
          width: 100
        },
        {
          title: '姓名',
          key: 'name',
          ellipsis: true
        },
        {
          title: '性别',
          key: 'gender',
          ellipsis: true
        },
        {
          title: '年龄',
          key: 'age',
          ellipsis: true
        },
        {
          title: '身份证号',
          key: 'code',
          ellipsis: true
        },
        {
          title: '备注',
          key: 'remark',
          ellipsis: true
        },
        {
          title: '图片',
          key: 'image',
          align: 'center',
          className: 'img-td',
          render: (h, params) => {
            return h('img', {
              class: params.row.class,
              attrs: {
                alt: '失败',
                src: params.row.image
              },
              on: {
                click: function() {
                  if (params.row.error) {
                    return false
                  }
                  if (params.row.class.indexOf('big-img') !== -1) {
                    params.row.class = ['people-img']
                  } else {
                    if (params.index === 0) {
                      params.row.class.push('big-top', 'big-img')
                    } else if (params.row.last) {
                      params.row.class.push('big-last', 'big-img')
                    } else {
                      params.row.class.push('big-center', 'big-img')
                    }
                  }
                },
                error: function() {
                  params.row.error = true
                }
              }
            })
          }
        }
      ],
      manageData: [],
      selectPeo: [],
      addModelTitle: '新建底库',
      groupValidate: {
        name: '',
        type: 'defense',
        similar: 75,
        color: 'red',
        alarmAudio: '/static/face/audio/1.mp3',
        isAuto: false,
        desc: ''
      },
      groupRuleValidate: {
        name: [{ required: true, validator: validateName, trigger: 'change' }],
        desc: [{ validator: dispatchDesc, trigger: 'change' }]
      },
      peopleValidate: {
        name: '',
        gender: 2,
        age: '',
        code: '',
        remark: '',
        image: ''
      },
      peopleRuleValidate: {
        name: [{ required: true, validator: validateName, trigger: 'change' }],
        age: [{ validator: validateAge, trigger: 'change' }],
        code: [{ validator: validateIdentity, trigger: 'change' }],
        remark: [{ validator: dispatchDesc, trigger: 'change' }]
      },
      pageInfo: {
        pages: 0,
        cur: 1,
        limit: this.$PageInfo.limit,
        count: 0
      },
      // 导入图片
      batUpload: {
        group: [{ required: true, message: '请选择布控地库', trigger: 'change' }]
      },
      importForm: {
        group: '',
        discernType: ['name', 'gender', 'code', 'remark']
      },
      uploadTypes: ['jpg', 'png', 'bmp', 'jpeg'],
      importFileList: [],
      importMaxSizeFiles: [],
      importFileNewList: [],
      importTypeErrorList: [],
      importFileErrorList: [],
      saveLoading: false
    }
  },
  computed: {
    ...mapGetters(['accessToken']),
    showPeopleModel() {
      return this.addModelTitle !== '新建底库' && this.addModelTitle !== '修改底库'
    },
    groupType() {
      return [{ title: '布控库', value: 'defense' }, { title: '静态库', value: 'static' }]
    },
    // groupDegrees() {
    //   return [50, 55, 60, 65, 70, 75, 80, 85, 90, 95]
    // },
    groupColors() {
      return ['red', 'orange', 'yellow', 'green', 'Crimson', 'Violet', 'blue', 'Cyan', 'brown', 'black']
    },
    groupAudios() {
      return [
        {
          value: '/static/face/audio/1.mp3',
          name: '音频1'
        },
        {
          value: '/static/face/audio/2.mp3',
          name: '音频2'
        },
        {
          value: '/static/face/audio/3.mp3',
          name: '音频3'
        },
        {
          value: '/static/face/audio/4.mp3',
          name: '音频4'
        },
        {
          value: '/static/face/audio/5.mp3',
          name: '音频5'
        },
        {
          value: '/static/face/audio/6.mp3',
          name: '音频6'
        }
      ]
    },
    groupDatas() {
      return this.searchResult.length > 0 ? this.searchResult : this.group
    },
    groupAudioDom() {
      return this.$refs.groupAudio
    },
    logoImgSrc() {
      return this.peopleValidate.image === '' ? '' : this.peopleValidate.image
    }
  },
  watch: {
    selectPeo(val) {
      if (val.length < 1) {
        this.disableBtn = true
        this.disableExport = true
      } else {
        this.disableExport = false
      }
    },
    groupId(val) {
      this.getPeopleData(val, 1, 100)
    },
    importFileNewList(arr) {
      if (arr.length < 1) {
        this.batchSureDisable = true
      } else {
        this.batchSureDisable = false
      }
    }
  },
  methods: {
    ...mapActions([
      'getGroup',
      'addGroup',
      'setGroup',
      'delGroup',
      'getManagUser',
      'addManageUser',
      'setManageUser',
      'delManageUser'
    ]),
    // 搜索底库
    searchGroup() {
      if (this.searchData.replace(/\s+/g, '') === '') {
        this.searchResult = this.group
      } else {
        this.searchResult = this.group.filter(obj => {
          if (obj.name.indexOf(this.searchData) !== -1) {
            return obj
          }
        })
      }
    },
    // 播放音频
    audioPlay() {
      this.$refs.groupAudio.play()
    },
    pushGroup() {
      if (this.addModelTitle !== '新建底库') {
        this.addModelTitle = '新建底库'
      }
      this.showAddModel = true
    },
    updateGroup(obj) {
      if (this.addModelTitle !== '修改底库') {
        this.addModelTitle = '修改底库'
      }
      this.showAddModel = true
      this.groupValidate = this.$lodash.cloneDeep(obj)
    },
    removeGroup(obj) {
      if (obj.name === '黑名单') {
        return this.errorMsg('黑名单库不可删除')
      }
      this.batOperation('确认删除此底库吗？', this.delGroup, '删除成功', this.getGroupData, obj._id)
    },
    pushUser() {
      if (this.addModelTitle !== '添加人员') {
        this.addModelTitle = '添加人员'
      }
      this.showAddModel = true
    },
    updateUser() {
      if (this.selectPeo.length > 1) {
        return this.errorMsg('一次只能修改一条数据')
      }
      if (this.addModelTitle !== '修改人员') {
        this.addModelTitle = '修改人员'
      }
      this.peopleValidate = this.$lodash.cloneDeep(this.selectPeo[0])
      if (this.peopleValidate.last) {
        delete this.peopleValidate.last
      }
      this.peopleValidate.gender = this.peopleValidate.gender === '男' ? 2 : 1
      if (this.peopleValidate.age === null) {
        this.peopleValidate.age = ''
      }
      this.showAddModel = true
    },
    removeUser() {
      this.batOperation('确认删除选中人员吗？', this.delManageUser, '删除成功', this.getPeopleData)
    },
    batOperation(title, fun, noticeTitle, callback, id) {
      this.$Modal.confirm({
        title: '提示',
        content: `<p>${title}</p>`,
        onOk: () => {
          if (this.saveLoading) {
            return
          }
          this.saveLoading = true
          let param = []
          if (id) {
            param = id
          }
          if (this.selectPeo.length && typeof param !== 'string') {
            this.selectPeo.forEach(item => {
              param.push(item._id)
            })
          }
          fun(param)
            .then(res => {
              this.saveLoading = false
              callback()
              this.successMsg(noticeTitle)
            })
            .catch(err => {
              this.saveLoading = false
              this.errorMsg(err.response.data.message)
            })
        },
        onCancel: () => {
          this.saveLoading = false
        }
      })
    },
    peopleOperation() {
      if (this.saveLoading) {
        return
      }
      this.saveLoading = true
      if (this.addModelTitle !== '修改人员') {
        this.addManageUser({
          name: this.peopleValidate.name,
          gender: this.peopleValidate.gender,
          age: this.peopleValidate.age,
          code: this.peopleValidate.code,
          remark: this.peopleValidate.remark,
          image: this.peopleValidate.image,
          group: this.groupId
        })
          .then(res => {
            this.saveLoading = false
            this.showAddModel = false
            this.successMsg('创建成功')
            this.getPeopleData(this.groupId)
          })
          .catch(err => {
            this.saveLoading = false
            this.errorMsg(err.response.data.message)
          })
      } else {
        this.setManageUser({ body: { ...this.peopleValidate, group: this.groupId }, id: this.peopleValidate._id })
          .then(res => {
            this.saveLoading = false
            this.showAddModel = false
            this.successMsg('修改成功')
            this.getPeopleData(this.groupId)
          })
          .catch(err => {
            this.saveLoading = false
            this.errorMsg(err.response.data.message)
          })
      }
    },
    groupOperation() {
      if (this.saveLoading) {
        return
      }
      this.saveLoading = true
      if (this.addModelTitle !== '修改底库') {
        this.addGroup(this.groupValidate)
          .then(res => {
            this.saveLoading = false
            this.showAddModel = false
            this.successMsg('创建成功')
            this.getGroupData()
          })
          .catch(err => this.errorMsg(err.response.data.message))
      } else {
        this.setGroup({ body: this.groupValidate, id: this.groupValidate._id })
          .then(res => {
            this.saveLoading = false
            this.showAddModel = false
            this.successMsg('修改成功')
            this.getGroupData()
          })
          .catch(err => this.errorMsg(err.response.data.message))
      }
    },
    // 模态框保存
    saveContent() {
      if (this.showPeopleModel) {
        if (this.peopleValidate.image === '') {
          return this.errorMsg('请上传人员图片')
        }
        let result = true
        const arr = ['name']
        if (this.peopleValidate.age !== '') {
          arr.push('age')
        }
        if (this.peopleValidate.code !== '') {
          arr.push('code')
        }
        if (this.peopleValidate.remark !== '') {
          arr.push('remark')
        }
        arr.forEach(obj => {
          this.$refs.peopleValidate.validateField(obj, valid => {
            if (valid) {
              result = false
            }
          })
        })
        if (result) {
          this.peopleOperation()
        }
      } else {
        this.$refs.groupValidate.validateField('name', valid => {
          if (!valid) {
            this.$refs.groupValidate.validateField('desc', valid => {
              if (!valid) {
                this.groupOperation()
              }
            })
          }
        })
      }
    },
    // 表格选中
    selectpeople(arr) {
      this.selectPeo = arr
      if (arr.length > 0) {
        this.disableBtn = false
      } else {
        this.disableBtn = true
      }
    },
    // 关闭底库弹出框
    closeAddModel(val) {
      if (!val) {
        this.saveLoading = false
        if (this.showPeopleModel) {
          this.peopleValidate.image = ''
          this.$refs.peopleValidate.resetFields()
        } else {
          this.$refs.groupValidate.resetFields()
          if (!this.groupAudioDom.paused) {
            this.groupAudioDom.pause()
            this.groupAudioDom.currentTime = 0
          }
        }
      }
    },
    // 关闭批量上传弹出框
    closeUploadModel(val) {
      if (!val) {
        this.$refs.batUploadForm.resetFields()
        this.importFileErrorList = []
        this.importTypeErrorList = []
        this.importMaxSizeFiles = []
        this.importFileNewList = []
        this.$refs.importUpload.clearFiles()
        this.getPeopleData()
      }
    },
    ouputUserList() {
      const param = {
        ids: []
      }
      this.selectPeo.map(item => {
        param.ids.push(item._id)
      })
      if (!this.elemIF) {
        this.elemIF = document.createElement('iframe')
      }
      this.elemIF.src = window.location.origin + `/api/veriface/user/export?ids=${param.ids.toString()}`
      this.elemIF.style.display = 'none'
      document.body.appendChild(this.elemIF)
    },
    // 导入相关钩子
    batExport() {
      this.showUpload = true
      this.importStatus = false
      this.batchModal = true
      this.group.filter(obj => {
        if (obj.name === '黑名单') {
          this.importForm.group = obj._id
        }
      })
    },
    uploadSuc(response, file, fileList) {
      this.importStatus = true
      this.importFileList = fileList
      this.importFileList.forEach(oldFile => {
        this.importFileNewList = this.importFileNewList.filter(newFile => {
          return oldFile.name !== newFile.name
        })
      })
    },
    uploadError(file, err, fileList) {
      this.importStatus = true
      this.importFileErrorList.push(fileList)
    },
    // 上传相关钩子
    importBefore(file) {
      const types = file.type.split('/')
      if (!types[1] || !this.uploadTypes.includes(types[1])) {
        this.importTypeErrorList.push(file)
        return false
      }
      if (this.importFileNewList.length > 199) {
        this.$Notice.warning({
          title: '最多上传200张图片！'
        })
        return false
      }
      this.importFileNewList.push(file)
      return false
    },
    importExceededSize(file, fileList) {
      this.importStatus = true
      this.importMaxSizeFiles.push(file)
    },
    batchSure(type) {
      this.$refs.batUploadForm.validateField('group', valid => {
        if (!valid) {
          this.importFileNewList.forEach(item => {
            this.$refs.importUpload.post(item)
          })
        }
      })
    },
    // 用户头像上传
    importSuccess(response) {
      this.peopleValidate.image = response.path
    },
    formatError(file) {
      this.$Notice.warning({
        title: '图片格式不正确',
        desc: '图片 ' + file.name + ' 格式不正确，请上传 jpg, png, bmp 或 jpeg 格式的图片。'
      })
    },
    exceededSize(file) {
      this.$Notice.warning({
        title: '图片大小超过限制',
        desc: '图片 ' + file.name + ' 大小超过限制，请上传小于2M的图片。'
      })
    },
    // 分页相关钩子
    pageSizeChange(n) {
      this.pageInfo.limit = n
      this.getPeopleData()
    },
    changePage(page) {
      this.pageInfo.cur = page
      this.getPeopleData()
    },
    // 获取人员列表
    getPeopleData(groupId = this.groupId, page, limit) {
      this.getManagUser({ page: page || this.pageInfo.cur, limit: limit || this.pageInfo.limit, id: groupId })
        .then(res => {
          this.pageInfo.count = Number(res.headers['x-bsc-count'])
          if (this.selectPeo.length > 0) {
            this.selectPeo = []
          }
          this.manageData = res.data
          res.data.forEach((obj, index) => {
            obj.gender = obj.gender === '2' ? '男' : '女'
            obj.class = ['people-img']
            if (index === this.pageInfo.limit - 1) {
              obj.last = true
            }
          })
        })
        .catch(err => this.errorMsg(err.response.data.message))
    },
    // 获取底库列表
    getGroupData(isRefsh) {
      this.getGroup()
        .then(res => {
          this.group = res.data.filter(obj => {
            if (obj.name === '黑名单' && this.importForm.group === '') {
              this.importForm.group = obj._id
            }
            if (obj.name !== '路人库') {
              return obj
            }
          })
          this.groupId = this.group[0]._id
          if (isRefsh) {
            this.successMsg('刷新成功')
          }
        })
        .catch(err => this.errorMsg(err.response.data.message))
    },
    resizeFun() {
      this.tableHeight = this.$refs['peopleTable'].offsetHeight
    }
  },
  created() {
    this.getGroupData()
    this.headerObj.Authorization = `Bearer ${this.accessToken}`
  },
  mounted() {
    this.resizeFun()
  },
  beforeDestroy() {
    this.elemIF = null
    this.resizeFun = null
  }
}
</script>
<style>
.manage-model .ivu-modal {
  width: fit-content !important;
}
.description textarea {
  resize: none;
  width: 330px;
}

.manage .img-td {
  position: relative;
  overflow: inherit;
}

.people-img {
  display: inline-block;
  outline: none;
  height: 32px;
  width: 32px;
  cursor: pointer;
}

.big-img {
  position: absolute;
  width: 120px;
  height: 120px;
  z-index: 99;
}

.big-top {
  top: 0;
  left: 70px;
}

.big-center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.big-last {
  bottom: 0;
  left: 70px;
}

.manage-form .ivu-select-selection,
.manage-form .ivu-select-dropdown {
  width: 330px !important;
}
.audio-wrap .ivu-select-selection,
.audio-wrap .ivu-select-dropdown {
  width: 280px !important;
}
</style>
<style scoped>
.manage {
  width: 100%;
  display: flex;
  padding: 16px 0;
}

.left-org {
  width: 272px;
  margin-right: 16px;
  background: #1b3153;
}

.org-title {
  height: 38px;
  line-height: 38px;
  padding: 0 20px;
  background: #0f2243;
  font-size: 14px;
}
.org-title .icon-shuaxin1 {
  float: right;
}

.org-header {
  height: 44px;
  line-height: 44px;
  padding: 10px;
}

.org-body {
  padding: 8px;
}

.iconfont {
  cursor: pointer;
  vertical-align: middle;
}
.right-table {
  flex: 1;
}

.manage-header {
  height: 50px;
  line-height: 50px;
  background: #1c3053;
  padding-left: 16px;
}

.manage-header .btn {
  margin: 0 8px;
}

.manage-section {
  height: calc(100% - 83px);
}

.manage-footer {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: #244575;
}

.group-title {
  height: 32px;
  line-height: 32px;
  padding-left: 24px;
  width: 254px;
  display: table;
  vertical-align: middle;
}

.clickGroup {
  background: #2f497a;
  border-right: 2px solid #4699f9;
}

.group-title i,
.group-name {
  display: table-cell;
}

.group-name {
  width: 170px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.group-form-input {
  width: 330px;
}

.group-color {
  width: 340px;
  height: 30px;
  line-height: 30px;
  text-align: center;
}

.group-color .isClick {
  border: 2px solid #fff;
}

.group-color li {
  width: 26px;
  height: 26px;
  margin-right: 8px;
  display: inline-block;
  cursor: pointer;
}

.section-flex {
  display: flex;
}

.audio-wrap {
  display: flex;
  width: 200px;
}

.user-logo {
  width: 130px;
  height: 130px;
  border: 1px dashed #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-logo img {
  display: inline-block;
  width: auto;
  height: auto;
  max-width: 128px;
  max-height: 128px;
}

.import-result .result-count {
  text-align: center;
  font-size: 16px;
}

.import-error-list {
  padding: 0 10px;
  height: 110px;
}

.content-right {
  margin-left: 80px;
  width: 180px;
}
.icon-volume {
  position: relative;
  top: 0px;
  left: 95px;
}
</style>
