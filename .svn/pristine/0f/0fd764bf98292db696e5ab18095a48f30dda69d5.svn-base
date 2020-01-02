<template>
  <!-- 新建或者修改案件管理弹框 -->
  <div v-if="openModal">
    <Modal v-model="openModal" :mask="false" :mask-closable="false" :closable="false" width='1000px' :styles="{top: '25px'}" class="caseMangementModel">
      <div class="modal-header" slot="header">
        <span>{{modalTitle}}</span>
        <span class="icon iconfont icon-close1" style="cursor: pointer;" @click="cancel"></span>
      </div>
      <div>
        <div class="tab">
          <span  :class="{activeTab:tabToggle === 0}" @click="() => {tabToggle = 0}" style="border-radius: 4px 0px 0px 4px;" :style="!showSelectCamera ? 'border-radius: 4px;' : ''">案件信息</span>
          <span @click="() => {tabToggle = 1}" :class="{activeTab:tabToggle === 1}" v-if="showSelectCamera">选择摄像机</span>
          <span @click="() => {tabToggle = 2}" :class="{activeTab:tabToggle === 2}" v-if="showSelectCamera" style="border-right: 1px solid #5676a9; border-radius: 0px 4px 4px 0px;">插入图片</span>
        </div>
        <!--事件信息-->
        <div v-show="tabToggle === 0" style="margin-top: 20px;">
          <Form label-position="left" :label-width="110" :model="modalData" ref="refModalData" :rules="receiveRule" style="margin: 0 20px;">
            <Row>
              <Col span="17">
                <Form-item label="案件名称" prop="eventName">
                  <Input v-model="modalData.eventName"/>
                </Form-item>
              </Col>
            </Row>
            <Row type="flex" justify="space-between">
              <Col span="11">
                <Form-item label="报警人" prop="person">
                  <Input v-model="modalData.person"/>
                </Form-item>
              </Col>
              <Col span="11">
                <Form-item label="性别" prop="gender">
                  <RadioGroup v-model="modalData.gender">
                    <Radio :label="1">男</Radio>
                    <Radio :label="2">女</Radio>
                  </RadioGroup>
                </Form-item>
              </Col>
            </Row>
            <Row type="flex" justify="space-between">
              <Col span="11">
                <Form-item label="年龄" prop="age">
                  <Input v-model="modalData.age"/>
                </Form-item>
              </Col>
              <Col span="11">
                <Form-item class="labelRight" label="民族国籍" prop="nationality">
                  <Input v-model="modalData.nationality"/>
                </Form-item>
              </Col>
            </Row>
            <Row type="flex" justify="space-between">
              <Col span="11">
                <Form-item label="院系/单位" prop="department">
                  <Input v-model="modalData.department"/>
                </Form-item>
              </Col>
              <Col span="11">
                <Form-item class="labelRight" label="住址" prop="address">
                  <Input v-model="modalData.address"/>
                </Form-item>
              </Col>
            </Row>
            <Row type="flex" justify="space-between">
              <Col span="11">
                <Form-item label="联系电话" prop="phone">
                  <Input v-model="modalData.phone"/>
                </Form-item>
              </Col>
              <Col span="11">
                <Form-item class="labelRight" label="事发地点" prop="incidentAddress">
                  <Input v-model="modalData.incidentAddress"/>
                </Form-item>
              </Col>
            </Row>
            <Row type="flex" justify="space-between">
              <Col span="11">
                <Form-item label="学号" prop="studentNum">
                  <Input v-model="modalData.studentNum"/>
                </Form-item>
              </Col>
              <Col span="11">
                <Form-item class="labelRight" label="身份证号" prop="identityNum">
                  <Input v-model="modalData.identityNum"/>
                </Form-item>
              </Col>
            </Row>
            <Row type="flex" justify="space-between">
              <Col span="11">
                <Form-item class="labelRight" prop="isRecode" label="是否调取录像">
                  <RadioGroup v-model="modalData.isRecode">
                    <Radio :label="1">是</Radio>
                    <Radio :label="0">否</Radio>
                  </RadioGroup>
                </Form-item>
              </Col>
              <Col span="11">
                <Form-item class="labelRight" prop="startTime" label="案件开始时间">
                  <DatePicker style="width: 100%" :options="options2" type="datetime" v-model="modalData.startTime" format="yyyy-MM-dd HH:mm:ss" :editable="false" :clearable="false" @on-change="(val) => { caseDateChange(val, 'startTime') }"></DatePicker>
                </Form-item>
              </Col>
            </Row>
            <Row type="flex" justify="space-between">
              <Col span="11">
                <Form-item label="登记时间" prop="alarmTime">
                  <DatePicker style="width: 100%" :options="options1" type="datetime" v-model="modalData.alarmTime" format="yyyy-MM-dd HH:mm:ss" :editable="false" :clearable="false"></DatePicker>
                </Form-item>
              </Col>
              <Col span="11">
                <Form-item class="labelRight" prop="endTime" label="案件结束时间">
                  <DatePicker style="width: 100%" :options="options2" type="datetime" v-model="modalData.endTime" format="yyyy-MM-dd HH:mm:ss" :editable="false" :clearable="false" @on-change="(val) => { caseDateChange(val, 'endTime') }"></DatePicker>
                </Form-item>
              </Col>
            </Row>
            <Form-item label="事件特征" prop="mark">
              <Input type="textarea" v-model="modalData.description" placeholder="请输入事件特征"/>
            </Form-item>
            <Form-item label="备注" prop="mark">
              <Input type="textarea" v-model="modalData.mark" placeholder="请输入备注"/>
            </Form-item>
          </Form>
        </div>
        <!--选择摄像机-->
        <div class="chooseCameraBox" v-show="tabToggle === 1">
          <div class="title"><span>请选择与事件相关的摄像机：</span></div>
          <div class="body">
            <div class="tree">
              <BStreeNewBox @dbclickData="clickVideo" @checksData="hadeClick" :resourceToggle="true" :orgType="0" :checkBox="true" :searchToggle="false" :iconToggle="false" ref="treeCildren"></BStreeNewBox>
            </div>
            <div class="videoView">
              <div class="videoBox">
                <previewPlugin :defaultPane="1" ref="preview" :iconShow="PluginIcon"></previewPlugin>
              </div>
              <div class="video-list">
                <span style="font-size: 14px; line-height: 36px">摄像机追踪列表：</span>
                <div class="tables">
                  <ul class="table-box">
                    <li>
                      <span>摄像机名称</span><span>案件开始时间</span><span>案件结束时间</span><span>操作</span>
                    </li>
                    <li v-for="(item, index) of receiveData" :key="index">
                      <span>{{item.name}}</span>
                      <span>
                        <DatePicker style="width: 180px;" :options="options3" type="datetime" v-model="item.startTime" format="yyyy-MM-dd HH:mm:ss" :editable="false" :clearable="false" @on-change="(val) => { videoChangeDate(val, item.endTime, 'startTime') }"></DatePicker>
                      </span>
                      <span>
                        <DatePicker style="width: 180px;" :options="options3" type="datetime" v-model="item.endTime" format="yyyy-MM-dd HH:mm:ss" :editable="false" :clearable="false" @on-change="(val) => { videoChangeDate(val, item.startTime, 'endTime') }"></DatePicker>
                      </span>
                      <span @click="receivedispose(item._id)">
                        <Button icon="ios-trash-outline" title="删除录像" style="font-size: 14px"></Button>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--插入图片-->
        <div class="putImg" v-show="tabToggle === 2">
          <div class="photograph">
            <div class="title">报警人拍照</div>
            <div class="photographBox">
              <photograph  @uploadSuccess='picUploadFn' @flashStart='webcam'></photograph>
            </div>
          </div>
          <div class="eventsImg">
            <div class="title">
              <span>事件相关图片</span>
              <div class="title-upload">
                <Upload action="/api/upload/file" :show-upload-list="false" :format="['jpg','jpeg','png','bmp']" :on-success="uploadSucc" :on-error="uploadErr" :on-format-error="handleFormatError">
                  <Button icon="ios-cloud-upload-outline" title="上传图片"></Button>
                </Upload>
              </div>
            </div>
          </div>
          <div class="eventsImgBox">
            <Card v-for="(item, index) of modalData.images" :key="index" :bordered="false" :dis-hover="true">
              <div class="clearbox" style="height: 35px;">
                <div style="float:left;">
                  <div v-show="!imgToggle" style="text-align: center; line-height: 35px">{{item.name}}</div>
                  <div v-show="imgToggle"><Input v-model="imgName"/></div>
                </div>
                <div style="float: right;">
                  <div style="float: right; margin-left: 8px;">
                    <Button icon="ios-trash-outline" title="删除图片" @click="delImg(index)"></Button>
                  </div>
                  <div style="float: right;">
                    <Button v-show="!imgToggle" icon="edit" title="修改图片" @click="updImg(item)"></Button>
                    <Button v-show="imgToggle" icon="refresh" title="保存图片" @click="savImg(item)"></Button>
                  </div>
                </div>
              </div>
              <img :src="item.path" class="img-show">
            </Card>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div>
          <Button @click="cancel" >取消</Button>
          <Button type="primary" style="margin-left: 16px;" @click="saveBtn">确定</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { postAddCaseManage, setCaseAlarmDetails } from '@src/http/business/caseProcessing.api.js'
import BStreeNewBox from '@src/components/BStreeNew/BStreeNewBox'
import previewPlugin from '@src/components/videoComponentsNew/previewPlugin'
import photograph from './photograph'
import { mapActions } from 'vuex'
export default {
  components: { BStreeNewBox, previewPlugin, photograph },
  props: {
    // 是否打开弹窗
    openModal: {
      type: Boolean,
      default: false
    },
    // 是否显示'选择摄像机'和'插入图片'页面
    showSelectCamera: {
      type: Boolean,
      default: true
    },
    // 弹窗标题 新建/修改
    modalTitle: {
      type: String,
      default: ''
    },
    // 修改时 传参
    formData: {
      type: Object,
      default: () => {
        return {
          // eventName: '', // 事件名称
          // person: '', // 报警人
          // gender: 1, // 性别 1 男 2 女
          // age: null, // 年龄
          // nationality: '', // 民族
          // department: '', // 单位/院系
          // address: '', // 住址
          // phone: '', // 报警人联系方式
          // incidentAddress: '', // 事发地址
          // studentNum: null, // 学号
          // identityNum: '', // 身份证号
          // isRecode: Number(true), // 是否调取录像
          // startTime: this.$moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          // alarmTime: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
          // endTime: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
          // description: '', // 事件描述
          // mark: '', // 备注
          // resourceList: [], // 相关摄像头列表
          // images: [] // 图片
        }
      }
    },
    // 镜头列表 例：[{resource: id}]
    // 地图 一键报案
    cameraList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    formData(val) {
      if (this.modalTitle === '修改案件') {
        let _data = this.$lodash.cloneDeep(val)
        // 事件信息data
        _data.isRecode = Number(_data.isRecode)
        _data.startTime = this.$moment(_data.startTime * 1000).toDate()
        _data.endTime = this.$moment(_data.endTime * 1000).toDate()
        _data.alarmTime = this.$moment(_data.alarmTime * 1000).toDate()
        this.modalData = { ..._data }
        // 摄像机列表data
        let _videoData = []
        let _videoId = []
        _data.resourceList.map(e => {
          _videoData.push({
            _id: e.resource._id,
            name: e.resource.name,
            startTime:
              e.tagTime.length && e.tagTime[0].startTime ? this.$moment(e.tagTime[0].startTime * 1000).toDate() : '',
            endTime: e.tagTime.length && e.tagTime[0].endTime ? this.$moment(e.tagTime[0].endTime * 1000).toDate() : ''
          })
          _videoId.push(e.resource._id)
        })
        this.receiveData = [..._videoData]
        this.$refs.treeCildren.setCheckedKeys(_videoId)
      }
    }
  },
  data() {
    // 年龄判断
    const ageNum = (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        if (isNaN(value)) {
          callback(new Error('年龄输入有误'))
        } else if (value < 0 || value > 110) {
          callback(new Error('年龄应在0~110之间'))
        } else {
          callback()
        }
      }
    }
    // 电话判断
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('电话不能为空'))
      } else {
        var mobileReg = /^1(3|4|5|7|8)\d{9}$/
        var phoneReg = /^0\d{2,3}-?\d{7,8}$/
        if (!mobileReg.test(value) && !phoneReg.test(value)) {
          callback(new Error('电话号输入有误'))
        } else {
          callback()
        }
      }
    }
    // 不能为空
    const notNull = (rule, value, callback) => {
      if (!value) {
        callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
    // 身份证校验
    const validatorId = (rule, value, callback) => {
      if (!value.length || value.length === 15 || value.length === 18) {
        callback()
      } else {
        callback(new Error('请输入正确的身份证'))
      }
    }
    // 事件开始时间
    const validatorStartTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择事件开始时间'))
      } else if (this.$moment(value).isBefore(this.$moment(this.modalData.endTime))) {
        callback()
      } else if (this.$moment(value).isAfter(this.$moment(this.modalData.endTime))) {
        callback(new Error('事件开始时间不得小于结束时间'))
      } else {
        callback(new Error('事件开始时间不得于结束时间相等'))
      }
    }
    // 事件结束时间
    const validatorendTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择事件结束时间'))
      } else if (this.$moment(value).isBefore(this.$moment(this.modalData.startTime))) {
        callback(new Error('事件开始时间不得大于结束时间'))
      } else if (this.$moment(value).isAfter(this.$moment(this.modalData.startTime))) {
        callback()
      } else {
        callback(new Error('事件开始时间不得于结束时间相等'))
      }
    }
    return {
      // 视频组件 图标设置
      PluginIcon: {
        stopAll: true, // 关闭全部预览
        tvWall: false
      },
      flashObj: null,
      imgName: '', // 图片修改的名称
      imgToggle: false, // 是否修改图片命名
      // 主要参数data
      modalData: {
        eventName: '',
        person: '',
        gender: 1,
        age: null,
        nationality: '',
        department: '',
        address: '',
        phone: '',
        incidentAddress: '',
        studentNum: null,
        identityNum: '',
        isRecode: 1,
        startTime: this.$moment().startOf('day').toDate(),
        alarmTime: this.$moment().toDate(),
        endTime: this.$moment().toDate(),
        description: '',
        mark: '',
        images: []
      },
      tabToggle: 0, // tabPan index
      // 时间选择器 限制禁用条件
      // 登记时间 小于当前时间
      options1: {
        disabledDate: date => {
          return date && date.valueOf() > Date.now()
        }
      },
      options2: {
        disabledDate: date => {
          return date && this.$moment(date).isAfter(this.$moment())
        }
      },
      // 摄像机 与 事件的时间
      options3: {
        disabledDate: date => {
          return (
            !(date && this.$moment(date).valueOf() - this.$moment(this.modalData.startTime).valueOf() >= 0 && this.$moment(this.modalData.endTime).valueOf() - this.$moment(date).valueOf() >= 0)
          )
        }
      },
      receiveData: [], // 【选择摄像机】摄像机追踪列表data
      receiveRule: {
        eventName: [{ required: true, validator: notNull, trigger: 'blur' }, { max: 64, message: '字符不能超过64位' }],
        person: [{ required: true, validator: notNull, trigger: 'blur' }, { max: 20, message: '字符不能超过20位' }],
        description: [{ max: 200, message: '字符不能超过200位' }],
        age: [{ validator: ageNum }],
        incidentAddress: [{ max: 64, message: '字符不能超过64位' }],
        nationality: [{ max: 64, message: '字符不能超过64位' }],
        mark: [{ max: 200, message: '字符不能超过200位' }],
        identityNum: [{ validator: validatorId }],
        department: [{ max: 64, message: '字符不能超过64位' }],
        address: [{ max: 64, message: '字符不能超过64位' }],
        phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        studentNum: [{ required: true, validator: notNull, trigger: 'blur' }],
        alarmTime: [{ required: true, type: 'date', message: '请选择案件登记时间', trigger: 'change' }],
        startTime: [{ required: true, type: 'date', validator: validatorStartTime, trigger: 'change' }],
        endTime: [{ required: true, type: 'date', validator: validatorendTime, trigger: 'change' }]
      }
    }
  },
  methods: {
    ...mapActions(['treeLoading']),
    webcam(Webcam) {
      this.flashObj = Webcam
    },
    // 修改视频时间
    videoChangeDate(val, other, state) {
      if (state === 'startTime') {
        if (this.$moment(val).isBefore(this.modalData.startTime)) {
          this.errorMsg('录像开始时间不能小于案件开始时间')
        } else if (!this.$moment(val).isBefore(this.modalData.endTime)) {
          this.errorMsg('录像开始时间不能大于案件结束时间')
        } else if (!this.$moment(val).isBefore(other)) {
          this.errorMsg('录像开始时间不能大于录像结束时间')
        }
      } else if (state === 'endTime') {
        if (this.$moment(val).isAfter(this.modalData.endTime)) {
          this.errorMsg('录像结束时间不能大于案件结束时间')
        } else if (!this.$moment(val).isAfter(this.modalData.startTime)) {
          this.errorMsg('录像结束时间不能小于案件开始时间')
        } else if (!this.$moment(val).isAfter(other)) {
          this.errorMsg('录像结束时间不能小于录像开始时间')
        }
      }
    },
    // 修改案件的开始结束时间
    caseDateChange(val, state) {
      // 监测修改【案件开始、结束时间】时导致标记时间在案件时间之外
      for (let item of this.receiveData) {
        if (
          (this.$moment(item.startTimitem).isBefore(this.$moment(val)) && state === 'startTime') ||
          (this.$moment(item.endTime).isAfter(this.$moment(val)) && state === 'endTime')
        ) {
          this.errorMsg('所选择录像的标记时间不得超过案件的开始 / 结束时间')
          break
        }
      }
      if (state === 'startTime') {
        this.$refs.refModalData.validateField('endTime')
      } else if (state === 'endTime') {
        this.$refs.refModalData.validateField('startTime')
      }
    },
    // 点击列表删除摄像头
    receivedispose(val) {
      this.receiveData.forEach((e, i) => {
        if (val === e._id) {
          this.receiveData.splice(i, 1)
        }
      })
      let _d = []
      this.receiveData.map(e => {
        _d.push(e._id)
      })
      this.$refs.treeCildren.setCheckedKeys(_d)
    },
    // 获取树列表
    hadeClick(val, data, status, getOneChildNod, check) {
      getOneChildNod
        .then(res => {
          let _checked = this.$refs.treeCildren.getCheckedNodes().filter(e => e.tierType === 'res')
          if (_checked.length > 5) {
            this.warningMsg('摄像机最多能选择五个')
            return
          }
          _checked.forEach(e => {
            e.startTime = this.$moment(this.modalData.startTime).toDate()
            e.endTime = this.$moment(this.modalData.endTime).toDate()
            for (let f of this.receiveData) {
              if (f._id === e._id) {
                e.startTime = f.startTime
                e.endTime = f.endTime
                break
              }
            }
          })
          this.receiveData = this.$lodash.cloneDeep(_checked)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 视频双击项
    async clickVideo(item) {
      let _data = {
        devIp: item.eid.ip,
        devPort: item.eid.cport,
        channel: item.chan,
        streamType: item.stream,
        resId: item._id
      }
      await this.$refs.preview.stopPreviewALL(true)
      this.$refs.preview.openPreview(_data)
    },
    // 图片上传成功
    uploadSucc(response, file, fileList) {
      this.modalData.images.push({
        name: file.name,
        path: response.path
      })
    },
    picUploadFn(file) {
      this.modalData.images.push({
        name: file.name,
        path: file.path
      })
    },
    // 图片上传失败
    uploadErr() {
      this.errorMsg('上传失败')
    },
    // 图片格式验证失败
    handleFormatError() {
      this.warningMsg('只支持jpg,jpeg,png,bmp图片格式')
    },
    // 修改图片图标事件
    updImg(val) {
      this.imgToggle = true
      this.imgName = val.name.split('.')[0]
    },
    // 保存图片图标事件
    savImg(val) {
      val.name = `${this.imgName}.${val.name.split('.')[1]}`
      this.imgToggle = false
      this.imgName = ''
    },
    // 删除图片图标事件
    delImg(index) {
      this.modalData.images.splice(index, 1)
    },
    // 取消按钮
    cancel() {
      if (this.flashObj) {
        this.flashObj.reset()
      }
      this.$emit('cancelModal', false)
    },
    // 确定按钮
    saveBtn() {
      // form表单判断
      this.$refs.refModalData.validate(suc => {
        if (!suc) {
          this.errorMsg('请完善案件信息')
          return
        }
        if (this.cameraList.length) {
          this.receiveData = [{ _id: this.cameraList[0].resource }]
        }
        if (!this.receiveData.length) {
          this.errorMsg('请选择摄像机')
          return
        }
        let _arr = []
        let _err = false
        this.receiveData.map(e => {
          if (e.startTime < this.modalData.startTime || this.modalData.endTime < e.endTime) {
            _err = true
          }
          _arr.push({
            resource: e._id,
            tagTime: [
              {
                tagName: '',
                startTime: e.startTime ? this.$moment(e.startTime).unix() : this.$moment(this.modalData.startTime).unix(),
                endTime: e.endTime ? this.$moment(e.endTime).unix() : this.$moment(this.modalData.endTime).unix()
              }
            ]
          })
        })
        if (_err) {
          this.errorMsg('录像标记时间不能在案件开始/结束时间之外')
          return
        }
        const params = { ...this.modalData }
        params.isRecode = Boolean(params.isRecode)
        params.age = isNaN(params.age) ? null : Number(params.age)
        params.startTime = this.$moment(params.startTime).unix()
        params.endTime = this.$moment(params.endTime).unix()
        params.alarmTime = this.$moment(params.alarmTime).unix()
        params.resourceList = _arr
        if (this.modalTitle === '新建案件') {
          postAddCaseManage(params)
            .then(res => {
              this.successMsg('新建案件成功')
              if (!this.cameraList.length) {
                this.$parent.getTable()
              }
              if (this.flashObj) {
                this.flashObj.reset()
              }
              this.$emit('cancelModal', false)
            })
            .catch(err => {
              console.log(err)
              this.warningMsg('新建案件失败，请稍后重试')
            })
        } else if (this.modalTitle === '修改案件') {
          // 修改获取单条详情
          setCaseAlarmDetails(params._id, params)
            .then(res => {
              this.successMsg('修改案件成功')
              if (this.flashObj) {
                this.flashObj.reset()
              }
              this.$emit('cancelModal', false)
              this.$parent.getTable()
            })
            .catch(err => {
              console.log(err)
              this.warningMsg('修改案件失败，请稍后重试')
            })
        }
      })
    }
  }
}
</script>

<style scoped>
.modal-header {
  display: flex;
  justify-content: space-between;
}
.tab {
  margin: 10px 0;
}
.tab > span {
  background: #3c5073;
  width: 200px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  border: 1px solid #5676a9;
  border-right: none;
}
.tab > span.activeTab {
  background: #4699f9;
}
.chooseCameraBox .title span {
  color: #ffffff;
  font-size: 14px;
}
.chooseCameraBox .title {
  padding-left: 25px;
  display: inline-block;
}
.tree,
.videoView,
.photograph,
.eventsImg,
.tab > span {
  float: left;
}
.body::after,
.putImg::after,
.tab::after,
.clearbox::after {
  clear: both;
  content: '';
  display: block;
}
.tree {
  border: 1px solid #5676a9;
  padding: 10px 0px;
  width: 25%;
  height: 629px;
  overflow: auto;
}
.chooseCameraBox div.body {
  padding: 0 45px;
  margin-top: 5px;
}
.videoView {
  margin-left: 20px;
  width: 70%;
}
.videoBox {
  height: 300px;
  width: 533px;
  margin: 0 auto;
}
.video-list {
  height: 306px;
  width: 100%;
  margin-top: 15px;
}
.putImg {
  padding: 15px 45px;
}
.photograph {
  width: 47%;
  margin-right: 20px;
}
.photograph .title,
.eventsImg .title {
  /*color: #000000;*/
  color: #ffffff;
  font-size: 14px;
}
.photographBox {
  margin: 15px 0;
  position: relative;
  width: 400px;
  height: 300px;
  background: #081426;
}
.eventsImg {
  width: 47%;
}
.title-upload {
  float: right;
}
.eventsImgBox {
  background: #081426;
  margin-top: 5px;
  width: 47%;
  display: inline-block;
  height: 300px;
  overflow-y: auto;
}
.img-show {
  width: 100%;
  max-height: 200px;
  margin: 0 auto;
}
.img-del {
  position: absolute;
  background: transparent;
  top: 0px;
  right: 0px;
  z-index: 50;
}
.eventsImgBox >>> .ivu-card-body {
  background: #081426;
}
.table-box li {
  display: flex;
}
.table-box li > span {
  display: inline-block;
  height: 40px;
  text-align: center;
  line-height: 40px;
  overflow: hidden;
  width: 200px;
}
.table-box li > span:first-child {
  padding-left: 3px;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: calc(100% - 445px);
}
.table-box li > span:last-child {
  width: 45px;
}
.table-box li:first-child span {
  background-color: #244575;
}
/deep/ .ivu-modal-body {
  padding-top: 0;
}
</style>
