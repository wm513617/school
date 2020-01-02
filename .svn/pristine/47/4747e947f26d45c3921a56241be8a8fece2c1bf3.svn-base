<template>
  <div class="control-manage videostruct-control">
    <header class="control-manage-header">
      <Button class="btn" type="ghost" icon="plus" @click="showAddTaskModal">添加布控</Button>
      <Button class="btn" type="ghost" :disabled="disableBtn" icon="edit" @click="showEditTaskModal">修改</Button>
      <Button class="btn" type="ghost" :disabled="disableBtn" icon="trash-a" @click="deleteTask">删除</Button>
    </header>
    <main class="control-manage-main">
      <Table :columns="columns" :data="manageData" @on-selection-change="selectTask" style="height: 100%;"></Table>
    </main>
    <footer class="control-manage-footer">
      <Page :page-size="pageInfo.limit" @on-page-size-change="pageSizeChange" @on-change="handlePageChange" :current="pageInfo.current" :total="pageInfo.total" :page-size-opts="$PageInfo.size" style="float:right;" show-sizer show-elevator show-total></Page>
    </footer>
    <Modal class="control-manage-model" :title="modalType === 'add'? '新建任务': '修改任务'" v-model="showTaskModal" :mask-closable="false" @on-cancel="closeAddModel" width="600">
      <div class="clearfix">
        <div class="manage-container-box">
          <div class="control-manage-model-form">
            <Form :model="taskInfo" :label-width="85" :rules="taskRules" ref="validatorName" label-position="left" style="width:355px; margin-right:20px;">
              <FormItem label="布控名称：" prop="taskName">
                <Input v-model="taskInfo.taskName" placeholder="请输入任务名称"></Input>
              </FormItem>
            </Form>
            <div class="time-date">
              <div class="start-time clearfix">
                <span class="search-label">开始时间： </span>
                <BSdateRange :datetime="taskInfo.startTime" :disable="disabledTime" @timeChange="startChange" placeholder="选择日期" :width='262' :height='32' class="time-range"></BSdateRange>
              </div>
              <div class="end-time clearfix">
                <span class="search-label">结束时间： </span>
                <BSdateRange :datetime="taskInfo.endTime" :disable="disabledTime" @timeChange="endChange" placeholder="选择日期" :width='262' :height='32' class="time-range"></BSdateRange>
              </div>
            </div>
            <Form :model="taskInfo" :label-width="85" :rules="taskRules" label-position="left" style="width:355px; margin-right:20px;">
              <FormItem label="长期布控：" prop="always">
                <i-switch v-model="taskInfo.always" @on-change="disabledTime = !disabledTime"></i-switch>
              </FormItem>
              <FormItem label="布控分类：" prop="taskType">
                <Select v-model="taskInfo.taskType" @on-change="changeTaskType">
                  <Option v-for="(item, index) in taskTypeGroup" :key="index" :value="item.value">{{item.label}}</Option>
                </Select>
              </FormItem>
            </Form>
          </div>
          <div class="img-upload">
            <Form :model="formSubmit" :label-width="0">
              <FormItem>
              <Upload :on-success="uploadSuccess" :on-error="uploadImgError" :on-format-error="formatError" :on-exceeded-size="exceededSize" action="/api/structure/identify/picsearchDiscern" :max-size="2048" :format="['jpg','png','bmp','jpeg']" :show-upload-list="false">
                <div v-if="imageData" class="image-box-show">
                  <img class="image" :src="imageData"/>
                </div>
                <div v-else class="img-up-icon">
                  <i class="ivu-icon ivu-icon-ios-cloud-upload-outline"></i>
                  <p>点击上传图片</p>
                </div>
                <p>支持JPG、JPEG、PNG、BMP格式的图片,大小不超过2M</p>
              </Upload>
              </FormItem>
            </Form>
          </div>
        </div>
        <div class="control-attr">
          <Form :model="taskAttr" :label-width="60" :rules="taskRules" ref="validatorImage" label-position="left" class="attr-form">
            <div v-if="taskInfo.taskType === 12" class="attr-form">
              <FormItem label="骑车人" prop="riderCode" class="attr-item">
                <Select v-model="taskAttr.riderCode">
                  <Option v-for="(item, index) in riderCodeGroup" :key="index" :value="item.Code">{{item.Name}}</Option>
                </Select>
              </FormItem>
            </div>
            <div v-if="taskInfo.taskType === 11 || (taskInfo.taskType === 12 && (taskAttr.riderCode === '1' || !taskAttr.riderCode))" class="attr-form">
              <FormItem label="性别" prop="sexCode" class="attr-item">
                <Select v-model="taskAttr.sexCode" clearable>
                  <Option v-for="(item, index) in sexCodeGroup" :key="index" :value="item.Code">{{item.Name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="年龄" prop="ageCode" class="attr-item">
                <Select v-model="taskAttr.ageCode" clearable>
                  <Option v-for="(item, index) in ageCodeGroup" :key="index" :value="item.Code">{{item.Name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="朝向" prop="orientationCode" class="attr-item">
                <Select v-model="taskAttr.orientationCode" clearable>
                  <Option v-for="(item, index) in orientationCodeGroup" :key="index" :value="item.Code">{{item.Name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="打伞" prop="umbrellaCode" class="attr-item">
                <Select v-model="taskAttr.umbrellaCode" clearable>
                  <Option v-for="(item, index) in umbrellaCodeGroup" :key="index" :value="item.Code">{{item.Name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="发型" prop="hairCode" class="attr-item">
                <Select v-model="taskAttr.hairCode" clearable>
                  <Option v-for="(item, index) in hairCodeGroup" :key="index" :value="item.Code">{{item.Name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="帽子" prop="hatCode" class="attr-item">
                <Select v-model="taskAttr.hatCode" clearable>
                  <Option v-for="(item, index) in capCodeGroup" :key="index" :value="item.Code">{{item.Name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="背包" prop="knapsackCode" class="attr-item">
                <Select v-model="taskAttr.knapsackCode" clearable>
                  <Option v-for="(item, index) in backPackCodeGroup" :key="index" :value="item.Code">{{item.Name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="拎物" prop="bagCode" class="attr-item">
                <Select v-model="taskAttr.bagCode" clearable>
                  <Option v-for="(item, index) in bagCodeGroup" :key="index" :value="item.Code">{{item.Name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="上装款式" prop="upperTypeCode" class="attr-item">
                <Select v-model="taskAttr.upperTypeCode" clearable>
                  <Option v-for="(item, index) in upperTypeCodeGroup" :key="index" :value="item.Code">{{item.Name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="上装颜色" prop="upperColorCode" class="attr-item">
                <Select v-model="taskAttr.upperColorCode" clearable>
                  <Option v-for="(item, index) in colorCodeGroup" :key="index" :value="item.Code">{{item.Name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="下装款式" prop="bottomTypeCode" class="attr-item">
                <Select v-model="taskAttr.bottomTypeCode" clearable>
                  <Option v-for="(item, index) in bottomTypeCodeGroup" :key="index" :value="item.Code">{{item.Name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="下装颜色" prop="bottomColorCode" class="attr-item">
                <Select v-model="taskAttr.bottomColorCode" clearable>
                  <Option v-for="(item, index) in colorCodeGroup" :key="index" :value="item.Code">{{item.Name}}</Option>
                </Select>
              </FormItem>
            </div>
            <div v-if="taskInfo.taskType === 10" class="attr-form">
              <FormItem label="车辆号牌" prop="carPlateNumber" class="car-attr-item">
                <Input v-model="taskAttr.carPlateNumber" type="text" placeholder="请输入车辆号牌"></Input>
              </FormItem>
              <FormItem label="号牌类型" prop="carPlateType" class="car-attr-item">
                <Select v-model="taskAttr.carPlateType" multiple>
                  <Option v-for="(item, index) in carPlateTypeGroup" :key="index" :value="item.Code">{{item.Name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="车辆类型" prop="carKindCode" class="car-attr-item">
                <Select v-model="taskAttr.carKindCode" multiple>
                  <Option v-for="(item, index) in carKindCodeGroup" :key="index" :value="item.CarKindCode">{{item.CarKindName}}</Option>
                </Select>
              </FormItem>
              <FormItem label="车辆颜色" prop="carColorCode" class="car-attr-item">
                <Select v-model="taskAttr.carColorCode" multiple>
                  <Option v-for="(item, index) in carColorCodeGroup" :key="index" :value="item.Code">{{item.Name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="品牌" prop="style" class="car-attr-item" style="width: 464px;">
                <Select v-model="taskAttr.plate" @on-open-change="updatePlateGroup" multiple>
                  <Input v-model="plateSearch" style="width: calc(100% - 15px);margin: 0 0 8px 8px;" type="text" placeholder="输入关键字搜索"/>
                  <Option v-for="(item, index) in stylePlateGroup" :key="index + new Date().getTime()" :value="item.Code">{{item.Name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="型号" prop="brand" class="car-attr-item" style="width: 464px;">
                <Select v-model="taskAttr.brand" :disabled="taskAttr.plate === undefined || taskAttr.plate === ''" @on-open-change="updateBrandGroup" multiple>
                  <Input v-model="brandSearch" style="width: calc(100% - 15px);margin: 0 0 8px 8px;" type="text" placeholder="输入关键字搜索"/>
                  <OptionGroup  v-for="(item, index) in styleBrandGroup" :key="index + new Date().getTime()" :label="item.Name">
                    <Option v-for="v in item.Arr" :value="v.Code" :key="v.Code + new Date().getTime()">{{ v.Name }}</Option>
                  </OptionGroup>
                </Select>
              </FormItem>
              <FormItem label="年款" prop="pattern" class="car-attr-item" style="width: 464px;">
                <Select v-model="taskAttr.pattern" :disabled="taskAttr.brand === undefined || taskAttr.brand === ''" @on-open-change="updatePatternGroup" multiple>
                  <Input v-model="patternSearch" style="width: calc(100% - 15px);margin: 0 0 8px 8px;" type="text" placeholder="输入关键字搜索"/>
                  <OptionGroup  v-for="(item, index) in stylePatternGroup" :key="index + new Date().getTime()" :label="item.Name">
                    <Option v-for="v in item.Arr" :value="v.Code" :key="v.Code + new Date().getTime()">{{ v.Name }}</Option>
                  </OptionGroup>
                </Select>
              </FormItem>
            </div>
          </Form>
        </div>
        <Form :model="taskInfo" :label-width="85" :rules="taskRules" ref="validatorReason" label-position="left" style="width:560px; margin-right:20px;">
          <FormItem label="布控原因：" prop="reason" class="attr-item">
            <Input v-model="taskInfo.reason" placeholder="请输入布控原因"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="default" @click="closeAddModel">取消</Button>
        <Button type="primary" @click="addControlTask">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { validateName, validateReson } from './common/validate'
import { findIndex } from 'lodash'
import Dictionary from '../../../static/videoStructureEnum/queryDictionary'
import structureEnum from './common/structureEnum'
const nextMonth = new Date()
nextMonth.setMonth(nextMonth.getMonth() + 1)
export default {
  data() {
    return {
      formSubmit: {
        type: 'recognize',
        imageType: 0,
        imageData: ''
      },
      columns: [
        {
          type: 'selection',
          width: 120,
          align: 'center'
        },
        {
          type: 'index',
          title: '序号',
          align: 'center',
          width: 120
        },
        {
          title: '任务名称',
          key: 'taskName',
          align: 'center',
          ellipsis: true
        },
        {
          title: '布控分类',
          key: 'taskTypeName',
          align: 'center',
          width: 120
        },
        {
          title: '布控属性',
          key: 'taskConditionStr',
          align: 'center',
          ellipsis: true
        },
        {
          title: '开始时间',
          key: 'startTime',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '结束时间',
          key: 'endTime',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '布控原因',
          key: 'reason',
          ellipsis: true
        }
      ],
      selectTaskArr: [],
      modalType: 'add',
      showTaskModal: false,
      disableBtn: true,
      taskInfo: {
        startTime: new Date(),
        endTime: nextMonth,
        always: true
      },
      disabledTime: true,
      taskAttr: {},
      taskTypeGroup: [
        {
          value: 11,
          label: '行人'
        },
        {
          value: 10,
          label: '车辆'
        },
        {
          value: 12,
          label: '两轮车'
        }
      ],
      riderCodeGroup: [
        {
          Code: '1',
          Name: '有'
        },
        {
          Code: '2',
          Name: '无'
        }
      ],
      taskRules: {
        taskName: [{ required: true, validator: validateName }],
        reason: [{ validator: validateReson, trigger: 'change' }],
        riderCode: [{ required: true }]
      },
      imageData: '',
      stylePlateGroup: [],
      styleBrandGroup: [],
      stylePatternGroup: [],
      // 搜索用
      // carStyleGroup
      carBrandGroup: [],
      carPatternGroup: [],
      taskId: '',
      carTypeName: {
        carKindCode: {
          name: '车辆类型',
          transform: structureEnum.CarKindNameEnum
        },
        carColorCode: {
          name: '车辆颜色',
          transform: structureEnum.CarColorNameEnum
        },
        carPlateNumber: {
          name: '车辆号牌'
        },
        carPlateType: {
          name: '号牌类型',
          transform: structureEnum.PlateTypeNameEnum
        },
        style: {
          name: '品牌-型号-年款' // family-brand-style
        }
      },
      personName: {
        sexCode: {
          name: '性别',
          transform: structureEnum.SexNameEnum
        },
        ageCode: {
          name: '年龄',
          transform: structureEnum.AgeCodeNameEnum
        },
        hairCode: {
          name: '发型',
          transform: structureEnum.HairNameEnum
        },
        orientationCode: {
          name: '朝向',
          str: '朝向',
          transform: structureEnum.OrientationNameEnum
        },
        umbrellaCode: {
          name: '打伞',
          transform: structureEnum.UmbrellaNameEnum
        },
        hatCode: {
          name: '帽子',
          transform: structureEnum.HatNameEnum
        },
        knapsackCode: {
          name: '背包',
          transform: structureEnum.KnapsackNameEnum
        },
        bagCode: {
          name: '拎物',
          transform: structureEnum.BagNameEnum
        },
        upperTypeCode: {
          name: '上装款式',
          transform: structureEnum.UpperTypeNameEnum
        },
        bottomTypeCode: {
          name: '下装款式',
          transform: structureEnum.BottomTypeNameEnum
        },
        upperColorCode: {
          name: '上装颜色',
          str: '上装',
          transform: structureEnum.UpperColorNameEnum
        },
        bottomColorCode: {
          name: '下装颜色',
          str: '下装',
          transform: structureEnum.BottomColorNameEnum
        }
      },
      pageInfo: {
        limit: 100,
        current: 1,
        total: 0
      },
      plateSearch: '',
      brandSearch: '',
      patternSearch: '',
      addSucess: true
    }
  },
  computed: {
    ...mapState({
      carStyleGroup: ({ videoStructured }) => videoStructured.carStyleGroup,
      cotlMageTaskList: ({ videoStructured }) => videoStructured.cotlMageTaskList
    }),
    manageData() {
      let taskList = JSON.parse(JSON.stringify(this.cotlMageTaskList))
      for (let i = 0; i < this.cotlMageTaskList.length; i++) {
        const item = this.cotlMageTaskList[i].taskCondition
        let str = []
        for (const j in item) {
          if (j === 'riderCode' && item[j] === 2) {
            str.push('无')
            break
          }
          if (this.cotlMageTaskList[i].taskType === 10) {
            const keyName = this.carTypeName
            if (j === 'carPlateNumber') {
              str.push(item[j])
            } else if (j === 'carKindCode' || j === 'carColorCode' || j === 'carPlateType') { // 多选属性 车辆类型 | 车辆颜色 | 号牌类型
              const kindArr = item[j].split(',')
              for (const k in kindArr) {
                if (keyName[j].transform) {
                  str.push(keyName[j].transform[kindArr[k]])
                }
              }
            } else if (j === 'style' && item[j]) {
              const styleArr = item[j].split(';')
              for (const n in styleArr) {
                const arr = styleArr[n].split(',').map(item => Number(item))
                let index
                let bIndex
                let pIndex
                index = findIndex(this.carStyleGroup, {'Code': arr[0]})
                if (index !== -1) {
                  bIndex = findIndex(this.carStyleGroup[index].brandArr, {'Code': arr[0] + ',' + arr[1]})
                  if (bIndex !== -1) {
                    pIndex = findIndex(this.carStyleGroup[index].brandArr[bIndex].patternArr, {'Code': styleArr[n]})
                    if (pIndex !== -1) {
                      str.push(this.carStyleGroup[index].brandArr[bIndex].patternArr[pIndex].Name)
                    } else {
                      str.push(this.carStyleGroup[index].brandArr[bIndex].Name)
                    }
                  } else {
                    str.push(this.carStyleGroup[index].Name)
                  }
                }
              }
            }
          } else {
            const keyName = this.personName
            if (keyName[j]) {
              if (keyName[j].transform) {
                const key = keyName[j].transform[item[j]]
                if (keyName[j].str) {
                  str.push(keyName[j].str + ' ' + key)
                } else {
                  str.push(key)
                }
              } else {
                str.push(item[j])
              }
            }
          }
          str = this.$lodash.pull(str, '未识别', '无法确定', '未确定', null, undefined, '')
        }
        taskList[i].taskConditionStr = this.$lodash.uniq(str).join(' | ')
        this.taskTypeGroup.map(item => {
          if (item.value === taskList[i].taskType) {
            taskList[i].taskTypeName = item.label
          }
        })
        if (!this.cotlMageTaskList[i].always) {
          taskList[i].startTime = this.$moment(this.cotlMageTaskList[i].taskCondition.startTime).format('YYYY-MM-DD HH:mm:ss')
          taskList[i].endTime = this.$moment(this.cotlMageTaskList[i].taskCondition.endTime).format('YYYY-MM-DD HH:mm:ss')
        } else {
          taskList[i].startTime = '长期布控'
          taskList[i].endTime = '长期布控'
        }
      }
      return taskList
    },
    sexCodeGroup() {
      return Dictionary.sexCode
    },
    ageCodeGroup() {
      return Dictionary.ageCode
    },
    orientationCodeGroup() {
      return Dictionary.orientationCode
    },
    umbrellaCodeGroup() {
      return Dictionary.umbrellaCode
    },
    hairCodeGroup() {
      return Dictionary.hairCode
    },
    capCodeGroup() {
      return Dictionary.hatCode
    },
    backPackCodeGroup() {
      return Dictionary.knapsackCode
    },
    bagCodeGroup() {
      return Dictionary.bagCode
    },
    upperTypeCodeGroup() {
      return Dictionary.upperCode
    },
    colorCodeGroup() {
      return Dictionary.upperColorCode
    },
    bottomTypeCodeGroup() {
      return Dictionary.bottomCode
    },
    carKindCodeGroup() {
      return Dictionary.carKindCode
    },
    carColorCodeGroup() {
      return Dictionary.carColor
    },
    carPlateTypeGroup() {
      return Dictionary.plateTypeCode
    }
  },
  watch: {
    plateSearch(val) {
      this.regexpGroup(val, 'carStyleGroup', 'stylePlateGroup')
    },
    brandSearch(val) {
      this.regexpGroup(val, 'carBrandGroup', 'styleBrandGroup')
    },
    patternSearch(val) {
      this.regexpGroup(val, 'carPatternGroup', 'stylePatternGroup')
    }
  },
  created() {},
  methods: {
    ...mapMutations(['CAR_STYLE_CODE_GROUP']),
    ...mapActions(['getCotlMageTask', 'addCotlMageTask', 'editCotlMageTask', 'deleteCotlMageTask']),
    showAddTaskModal() {
      this.showTaskModal = true
      this.modalType = 'add'
      this.taskInfo = {
        startTime: new Date(),
        endTime: nextMonth,
        always: true,
        taskType: ''
      }
      this.taskAttr = {}
      this.disabledTime = true
    },
    showEditTaskModal() { // 修改布控任务,填充窗口数据
      if (this.selectTaskArr.length > 1) {
        this.warningMsg('一次只能修改一条任务')
        return
      }
      console.log(this.selectTaskArr[0], '修改布控任务')
      const item = { ...this.selectTaskArr[0] }
      this.imageData = item.picture
      const date = new Date()
      this.taskInfo = {
        taskName: item.taskName,
        startTime: item.always ? new Date() : new Date(item.taskCondition.startTime),
        endTime: item.always ? new Date(date.setMonth(date.getMonth() + 1)) : new Date(item.taskCondition.endTime),
        always: item.always,
        taskType: item.taskType,
        reason: item.reason
      }
      this.taskId = item._id
      for (const i in item.taskCondition) {
        this.taskAttr[i] = this.judageNumber(item.taskCondition[i], String)
      }
      if (item.taskType === 10) {
        this.taskAttr.carPlateType = item.taskCondition.carPlateType && item.taskCondition.carPlateType.split(',').map(item => String(item))
        this.taskAttr.carKindCode = item.taskCondition.carKindCode && item.taskCondition.carKindCode.split(',').map(item => String(item))
        this.taskAttr.carColorCode = item.taskCondition.carColorCode && item.taskCondition.carColorCode.split(',').map(item => String(item))
        const groupArr = item.taskCondition.style && item.taskCondition.style.split(';')
        let platearr = []
        let brandarr = []
        let patternarr = []
        for (const i in groupArr) {
          const arr = groupArr[i] && groupArr[i].split(',').map(item => Number(item))
          platearr.push(arr[0])
          brandarr.push(arr[0] + ',' + arr[1])
          patternarr.push(arr[0] + ',' + arr[1] + ',' + arr[2])
        }
        this.taskAttr.plate = this.$lodash.uniq(platearr)
        this.updateBrandGroup()
        this.taskAttr.brand = this.$lodash.uniq(brandarr)
        this.updatePatternGroup()
        this.taskAttr.pattern = this.$lodash.uniq(patternarr)
      }
      this.showTaskModal = true
      this.modalType = 'edit'
      item.always ? this.disabledTime = true : this.disabledTime = false
    },
    addControlTask() {
      if (!this.addSucess) { return }
      this.$refs.validatorName.validate(res => { // 验证名称
        if (res) {
          this.$refs.validatorReason.validate(reason => { // 验证布控原因
            if (reason) {
              if (!this.taskInfo.taskType) {
                this.warningMsg('请选择布控类型！')
                return
              }
              const info = {
                taskName: this.taskInfo.taskName,
                taskType: this.taskInfo.taskType,
                always: this.taskInfo.always,
                reason: this.taskInfo.reason ? this.taskInfo.reason : '',
                picture: this.imageData
              }
              let attr = {
                startTime: this.$moment(this.taskInfo.startTime).valueOf(),
                endTime: this.taskInfo.always ? this.$moment(this.$moment(this.taskInfo.endTime).add(20, 'y')).valueOf() : this.$moment(this.taskInfo.endTime).valueOf()
              }
              if (this.taskInfo.taskType === 10) { // 车辆
                if (!this.taskAttr.carPlateNumber && this.taskAttr.plate === undefined) {
                  this.warningMsg('车辆布控必填车牌或品牌！')
                  return
                }
                attr = {
                  ...attr,
                  carPlateNumber: this.taskAttr.carPlateNumber,
                  carPlateType: this.taskAttr.carPlateType && this.taskAttr.carPlateType.join(','),
                  carKindCode: this.taskAttr.carKindCode && this.taskAttr.carKindCode.join(','),
                  carColorCode: this.taskAttr.carColorCode && this.taskAttr.carColorCode.join(','),
                  style: this.taskAttr.pattern && this.taskAttr.pattern.join(';')
                }
              } else {
                if (this.taskInfo.taskType === 12 && !this.taskAttr.riderCode) {
                  this.warningMsg('骑车人必填！')
                  return
                }
                let hasAttr = 0
                for (const i in this.taskAttr) {
                  if (i !== 'riderCode' && this.taskAttr[i] !== undefined && this.taskAttr[i] !== null) {
                    ++hasAttr
                  }
                  attr[i] = this.judageNumber(this.taskAttr[i], Number)
                }
                if (!hasAttr && this.taskAttr.riderCode !== '2') {
                  this.warningMsg('请至少选择一个属性布控！')
                  return
                }
                if (this.taskInfo.taskType === 12) {
                  attr.targetType = this.taskAttr.targetType
                } else {
                  delete attr.targetType
                }
              }
              for (const i in attr) {
                if (attr[i] === -1 || attr[i] === undefined) {
                  delete attr[i]
                }
              }
              let param = {
                ...info,
                taskCondition: {
                  ...attr
                }
              }
              this.addSucess = false
              if (this.modalType === 'add') { //  添加布控
                this.addCotlMageTask(param).then((res) => {
                  this.addSucess = true
                  this.closeAddModel()
                  this.getTask('init')
                }).catch(err => {
                  this.addSucess = true
                  this.errorMsg('添加失败！')
                  console.log(err, 'add fail')
                })
              } else { // 修改布控
                this.editCotlMageTask({ ...param, _id: this.taskId }).then((res) => {
                  this.addSucess = true
                  this.closeAddModel()
                  this.getTask()
                  this.selectTaskArr = []
                }).catch(err => {
                  this.addSucess = true
                  this.errorMsg('修改失败！')
                  console.log(err, 'edit fail')
                })
              }
            }
          })
        }
      })
    },
    batOperation(title, fun, noticeTitle, isVaild = false) {
      this.$Modal.confirm({
        title: '提示',
        content: `<p>${title}</p>`,
        onOk: () => {
          if (this.saveLoading) {
            return
          }
          this.saveLoading = true
          const pros = []
          if (this.selectTaskArr.length) {
            this.selectTaskArr.forEach(item => {
              pros.push(fun(item._id))
            })
          }
          Promise.all(pros).then(res => {
            this.saveLoading = false
            this.getTask()
            this.successMsg(noticeTitle)
          }).catch(err => {
            this.saveLoading = false
            this.errorMsg(err.response.data.message)
          })
        },
        onCancel: () => {
          this.saveLoading = false
        }
      })
    },
    deleteTask() {
      this.batOperation('确定删除所选任务？', this.deleteCotlMageTask, '删除成功')
    },
    selectTask(arr, index) {
      this.selectTaskArr = arr
      if (arr.length > 0) {
        this.disableBtn = false
      } else {
        this.disableBtn = true
      }
    },
    judageNumber(val, type) {
      if (isNaN(Number(val))) {
        return val
      } else {
        return type(val)
      }
    },
    closeAddModel(val) {
      this.$refs.validatorName.resetFields()
      this.$refs.validatorImage.resetFields()
      this.$refs.validatorReason.resetFields()
      this.showTaskModal = false
      this.modalType = ''
      this.imageData = ''
    },
    exceededSize(file) {
      this.warningMsg('图片 ' + file.name + ' 大小超过限制，请上传小于2M的图片。')
    },
    startChange(val) {
      this.taskInfo.startTime = val.dateTimes
      if (this.taskInfo.startTime.getTime() > this.taskInfo.endTime.getTime()) {
        this.taskInfo.endTime = this.taskInfo.startTime
      }
    },
    endChange(val) {
      this.taskInfo.endTime = val.dateTimes
      if (this.taskInfo.startTime.getTime() > this.taskInfo.endTime.getTime()) {
        this.taskInfo.startTime = this.taskInfo.endTime
      }
    },
    uploadSuccess(response, file, fileList) {
      console.log(response, '识别数据')
      if (response.errorCode !== '0') {
        this.imageData = ''
        this.errorMsg('图片识别失败！')
        return
      }
      this.imageData = response.binImageUrl
      // targetType 1-8 对应 行人-自行车-摩托车-轿车-三轮车-大客车-面包车-卡车
      if (response.data.bikesData.length) { // 两轮车
        this.taskInfo.taskType = 12
        const item = response.data.bikesData[0]
        const persion = response.data.bikesData[0].persion
        if (persion.length) {
          const info = persion[0]
          this.taskAttr = {
            riderCode: '1',
            targetType: item.type,
            ageCode: info.ageCode,
            sexCode: info.sexCode,
            umbrellaCode: info.umbrellaCode,
            hairCode: info.hairCode,
            bagCode: info.bagCode,
            orientationCode: info.orientationCode,
            upperTypeCode: info.upperCode,
            upperColorCode: info.upperColorCode,
            bottomTypeCode: info.bottomCode,
            bottomColorCode: info.bottomColorCode,
            hatCode: info.hatCode,
            knapsackCode: info.knapsackCode
          }
        } else {
          this.taskAttr.riderCode = '2'
        }
        return
      }
      if (response.data.pedestrainsData.length) { // 行人
        this.taskInfo.taskType = 11
        const item = response.data.pedestrainsData[0]
        this.taskAttr = {
          targetType: item.type,
          ageCode: item.ageCode,
          sexCode: item.sexCode,
          umbrellaCode: item.umbrellaCode,
          hairCode: item.hairCode,
          bagCode: item.bagCode,
          orientationCode: item.orientationCode,
          upperTypeCode: item.upperCode,
          upperColorCode: item.upperColorCode,
          bottomTypeCode: item.bottomCode,
          bottomColorCode: item.bottomColorCode,
          hatCode: item.hatCode,
          knapsackCode: item.knapsackCode
        }
        return
      }
      if (response.data.vehiclesData.length) { // 车辆
        this.taskInfo.taskType = 10
        const item = response.data.vehiclesData[0]
        this.taskAttr = {
          targetType: item.type,
          carPlateNumber: item.plateLicence,
          carPlateType: [item.plateTypeCode],
          carKindCode: [item.type],
          carColorCode: [item.colorCode]
        }
        const f = item.hasOwnProperty('carFamily') && (item.carFamily !== undefined && item.carFamily !== null)
        const b = item.hasOwnProperty('carBrand') && (item.carBrand !== undefined && item.carBrand !== null)
        const p = item.hasOwnProperty('carPattern') && (item.carPattern !== undefined && item.carPattern !== null)
        if (f) {
          this.taskAttr.plate = [Number(item.carFamily)]
          this.updateBrandGroup()
        }
        if (f && b) {
          this.taskAttr.brand = [item.carFamily + ',' + item.carBrand]
          this.updatePatternGroup()
        }
        if (f && b && p) {
          this.taskAttr.pattern = [item.carFamily + ',' + item.carBrand + ',' + item.carPattern]
        }
      }
    },
    uploadImgError(err, file, fileList) {
      this.errorMsg('图片识别失败！')
      console.log(err)
    },
    formatError(file) {
      this.warningMsg('图片 ' + file.name + ' 格式不正确，请上传 jpg, png, bmp 或 jpeg 格式的图片。')
    },
    updatePlateGroup() {
      this.plateSearch = ''
      this.stylePlateGroup = []
      this.stylePlateGroup = this.carStyleGroup
    },
    updateBrandGroup() {
      this.styleBrandGroup = []
      this.brandSearch = ''
      this.carBrandGroup = []
      let arr = []
      for (const i in this.taskAttr.plate) {
        const index = findIndex(this.carStyleGroup, {'Code': this.taskAttr.plate[i]})
        if (index > -1) {
          arr.push({
            Name: this.carStyleGroup[index].Name,
            Arr: this.carStyleGroup[index].brandArr
          })
        }
      }
      this.styleBrandGroup = this.$lodash.cloneDeep(arr)
      this.carBrandGroup = this.$lodash.cloneDeep(arr)
    },
    updatePatternGroup() {
      this.stylePatternGroup = []
      this.patternSearch = ''
      this.carPatternGroup = []
      let arr = []
      for (const i in this.taskAttr.brand) {
        for (const j in this.styleBrandGroup) {
          const index = findIndex(this.styleBrandGroup[j].Arr, {'Code': this.taskAttr.brand[i]})
          if (index > -1) {
            arr.push({
              Name: this.styleBrandGroup[j].Name + '-' + this.styleBrandGroup[j].Arr[index].Name,
              Arr: this.styleBrandGroup[j].Arr[index].patternArr
            })
          }
        }
      }
      this.stylePatternGroup = this.$lodash.cloneDeep(arr)
      this.carPatternGroup = this.$lodash.cloneDeep(arr)
    },
    pageSizeChange(v) {
      this.pageInfo.current = 1
      this.pageInfo.limit = v
      this.getTask()
    },
    handlePageChange(v) {
      this.pageInfo.current = v
      this.getTask()
    },
    changeTaskType(v) {
      this.taskAttr = {}
      this.$refs.validatorImage.resetFields()
    },
    getTask(init) {
      if (init) {
        this.pageInfo.current = 1
        this.pageInfo.limit = 100
      }
      this.getCotlMageTask({page: this.pageInfo.current, limit: this.pageInfo.limit}).then((res) => {
        this.pageInfo.total = res.data && res.data.total
      })
    },
    regexpGroup(str, group, result) {
      const arr = []
      const reg = new RegExp(str, 'i')
      if (result === 'stylePlateGroup') {
        this[group].map(item => {
          if (reg.test(item.Name)) {
            arr.push({ ...item })
          }
        })
      } else {
        for (const i in this[group]) {
          arr.push({
            Name: this[group][i].Name,
            Arr: []
          })
          console.log(this[group][i].Arr, 'Arr')
          this[group][i].Arr && this[group][i].Arr.map(item => {
            if (reg.test(item.Name)) {
              arr[i].Arr.push({ ...item })
            }
          })
        }
      }
      this[result] = this.$lodash.cloneDeep(arr)
    }
  },
  mounted() {
    this.getTask()
    this.CAR_STYLE_CODE_GROUP(Dictionary.carFamilys)
    this.updatePlateGroup()
  },
  beforeDestroyed() {}
}
</script>

<style>
.control-manage-model .car-attr-item .ivu-select-multiple .ivu-select-selection > div {
  overflow: hidden;
  height: 32px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.videostruct-control .control-manage-main .ivu-table {
  position: absolute;
  overflow-y: auto;
}
.videostruct-control .control-manage-main .ivu-table .ivu-table-overflowX {
  overflow-x: hidden;
}
</style>
<style scoped>
.control-manage {
  width: 100%;
  margin: 16px 0 16px 0;
  position: relative;
}

.control-manage-header {
  padding-left: 16px;
  height: 50px;
  line-height: 50px;
  background: #1c3053;
}

.control-manage-header .btn {
  margin: 0 8px;
}

.control-manage-main {
  height: calc(100% - 83px);
}
.control-manage-model .manage-container-box {
  display: flex;
  flex-direction: row;
}

.control-manage-model .time-date {
  padding-right: 20px;
}

.control-manage-model .time-date .search-label{
  float:left;
}

.control-manage-model .time-date .time-range {
  float:right;
}

.control-manage-model .time-date .start-time,
.control-manage-model .time-date .end-time {
  margin-bottom: 24px;
  line-height: 32px;
}

.control-manage-model .control-attr {
  margin-left: 75px;
  line-height: 32px;
}

.control-manage-model .control-attr .attr-form {
  display: flex;
  flex-wrap: wrap;
}

.control-manage-model .control-attr .attr-item {
  margin-left: 16px;
  width: 142px;
}

.control-manage-model .control-attr .car-attr-item {
  margin-left: 16px;
  width: 224px;
}

.control-manage-footer {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: #244575;
}

.img-upload {
  text-align: center;
  width: 180px;
}

.img-upload .image-box-show {
  width: 180px;
  height: 165px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.img-upload .image-box-show .image {
  width: auto;
  height: auto;
  max-width: 180px;
  max-height: 165px;
  cursor: pointer;
}

.img-upload .img-up-icon {
  background: rgb(60, 80, 115);
  padding: 35px 0;
  height: 165px;
  margin-bottom: 8px;
  border-radius: 4px;
  position: relative;
}

.img-upload .img-up-icon.upload-icon {
  top: -173px;
}

.img-upload .img-up-icon.form-input {
  z-index: 1;
  opacity: 0;
  width: 180px;
}

.img-upload .upload-tip {
  position: absolute;
  top: 240px;
  width: 167px;
}
.form-submit {
  height: 165px;
}
.img-upload i {
  font-size: 64px;
  cursor: pointer;
  color: #4699f9;
}

.img-upload img {
  width: 65px;
  height: 65px;
  cursor: pointer;
}

.clearfix:after {
  content: '.';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
</style>
