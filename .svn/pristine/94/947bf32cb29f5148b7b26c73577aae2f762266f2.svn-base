<template>
  <div v-resize="scorll" class="tv-plan" style="height:100%;overflow:hidden; padding:0 10px;">
    <div class="input">
      <Input v-model="searchVal" icon="ios-search-strong" size="small" placeholder="请输入..." />
    </div>
    <div v-show="!showDetail">
      <div class="title-new" @click="addtoPlan">
        <i class="icon iconfont icon-large"></i>
        <label>新建预案</label>
      </div>
    </div>
    <div v-show="!showDetail && !noResult" class="left-con-list">
      <bs-scroll ref="scroller">
        <div class="list-item" v-for="(item, index) in list" v-show="item.show" :key="index">
          <label for="">{{item.name}}</label>
          <div class="list-icons">
            <i class="icon iconfont icon-edit" @click="altPlan(index)" title="修改"></i>
            <i class="icon iconfont icon-delete" @click="del(index)" title="删除"></i>
            <i class="icon iconfont icon-execute" @click="execPlan(index)" title="执行"></i>
          </div>
        </div>
      </bs-scroll>
    </div>
    <div class="list-item" v-show="noResult">无结果</div>

    <div class="details">
      <div v-show="showDetail">
        <div style="padding-left: 10px">
          <label style="height: 30px;line-height:30px;">预案名称</label>
          <Input class="label-input" :class="{invalid: !nameValid}" v-model="details.name" @on-blur="blurcheck('name')" />
          <label class="tips" :style="{visibility: nameValid? 'hidden': 'visible'}">预案名称不能为空且不能超过256个字符</label>
        </div>
        <div style="padding-right:14px;position:relative">
          <div class="list-icons">
            <i class="icon iconfont icon-add" @click="addData" title="增加"></i>
            <i class="icon iconfont icon-edit" :class="{disabled: disabledIcon }" @click="altData" title="修改"></i>
            <i class="icon iconfont icon-delete" :class="{disabled: disabledIcon }" @click="delData" title="删除"></i>
          </div>
        </div>
        <Table size="small" :columns="columns" :data="details.data" :highlight-row="true" @on-current-change="row => selectData = row" height="232"></Table>
        <div v-show="showDataDetails" style="margin-top: 10px; padding-left:10px">
          <div style="height: 40px">
            <label style="height: 30px;line-height:30px;">开始时间</label>
            <el-time-picker :class="{invalid: !startValid}" popper-class="tp" class="label-input" v-model="dataDetails.start" size="mini" type="time" value-format="HH:mm:ss" :editable="false" @change="v => dataDetails.startStr = v" @blur="blurcheck('start')"></el-time-picker>
          </div>
          <div style="height: 40px">
            <label style="height: 30px;line-height:30px;">结束时间</label>
            <el-time-picker :class="{invalid: !endValid}" popper-class="tp" class="label-input" v-model="dataDetails.end" size="mini" type="time" value-format="HH:mm:ss" :editable="false" @change="v => dataDetails.endStr = v" @blur="blurcheck('end')"></el-time-picker>
          </div>
          <div style="height: 70px">
            <label style="height: 30px;line-height:30px;">场景</label>
            <i-select v-if="showDataDetails" v-model="dataDetails.sceneVal" :class="{invalid: !sceneValid}" style="display:inline-block;width:170px">
              <i-option v-for="item in sceneOption" :key="item.value" :value="item.value">{{item.label}}</i-option>
            </i-select>
          </div>
          <div style="height: 40px;padding-right:16px">
            <button class="theme-btn" style="border:1px solid #00a5e3;float: right; padding: 4px 12px;border-radius:3px;cursor:pointer" @click="saveData">确定</button>
            <button class="theme-btn-cancel" style="float: right; padding: 4px 12px;border-radius:3px;cursor:pointer;margin-right: 10px" @click="showDataDetails=false">取消</button>
          </div>
        </div>
        <div style="margin-top: 15px;padding-right:16px" v-show="!showDataDetails">
          <button class="theme-btn" style="border:1px solid #00a5e3;float: right; padding: 4px 12px;border-radius:3px;cursor:pointer" @click="save">保存预案</button>
          <button class="theme-btn-cancel" style="float: right; padding: 4px 12px;border-radius:3px;cursor:pointer;margin-right: 10px" @click="showDetail=false">取消</button>
        </div>
      </div>
    </div>
    <Modal v-model="delectModal" width='416' title='提示'>
      <bs-cover v-if="delectModal" v-model="delectModal">
        <div style='line-height: 36px;position: relative; padding-left: 40px'>
          <i class="ivu-icon ivu-icon-help-circled" style='color: #ff9900; font-size:30px;position: absolute;left: 0'></i>
          确认删除"{{delectName}}"吗
        </div>
      </bs-cover>
      <div slot="footer" style="position:relative;z-index:99">
        <Button type="ghost" @click="delectModal=false">取消</Button>
        <Button type="primary" @click="delectModal=false||delect()">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import VSelect from 'components/common/VSelect'
import { getPinyin, isMatchPinyin } from './pinyin'
import 'components/Scroll'
import moment from 'moment'
import common from './tvcommon'
const DateFormat = 'YYYY-MM-DD HH:mm:ss'
const TimeFormat = 'HH:mm:ss'
export default {
  components: {
    VSelect: VSelect
  },
  mixins: [common],
  data() {
    return {
      searchVal: '',
      showDetail: false,
      showDataDetails: false,
      saveIndex: -1,
      selectData: null,
      delectModal: false,
      delectId: '',
      delectName: '',
      columns: [
        {
          title: '序号',
          key: 'no',
          width: 50
        },
        {
          title: '开始时间',
          key: 'startStr',
          width: 82
        },
        {
          title: '结束时间',
          key: 'endStr',
          width: 82
        },
        {
          title: '场景',
          key: 'name',
          width: 80
        }
      ],
      details: {
        name: '',
        data: []
      },
      dataDetails: {
        start: '',
        end: '',
        sceneVal: 0
      },
      nameValid: true,
      startValid: true,
      endValid: true,
      sceneValid: true,
      noResult: false
    }
  },
  computed: {
    ...mapState({
      planList: ({ tvwall }) => tvwall.planList,
      scenesList: ({ tvwall }) => tvwall.sceneList,
      tvwall: ({ tvwall }) => tvwall.tvwall,
      tabIndex: ({ tvwall }) => tvwall.tabIndex
    }),
    list() {
      if (!this.planList) {
        return
      }
      const list = JSON.parse(JSON.stringify(this.planList))
      list.forEach(item => {
        item.show = true
        item.pinyin = getPinyin(item)
      })
      return list
    },
    scenes() {
      const id = this.tvwall.rtscene
      if (!this.scenesList) {
        return
      }
      return this.$lodash.cloneDeep(this.scenesList).filter(item => item._id !== id)
    },
    sceneData() {
      const data = {}
      this.scenes.forEach(item => {
        data[item._id] = item
      })
      return data
    },
    sceneOption() {
      if (!this.scenes) {
        return
      }
      return this.scenes.map(item => {
        return {
          label: item.name,
          value: item._id
        }
      })
    },
    disabledIcon() {
      return !this.selectData || this.selectData.empty
    }
  },
  watch: {
    searchVal(v) {
      let noOne = true
      this.list.forEach(item => {
        item.show = isMatchPinyin(v, item.pinyin)
        if (item.show) {
          noOne = false
        }
      })
      this.noResult = noOne
    },
    sceneOption() {
      this.showDataDetails = false
    },
    tabIndex(val) {
      if (val === 3) {
        this.scorll()
      }
    }
  },
  methods: {
    ...mapActions(['getPlans', 'deletePlan', 'setPlan', 'addPlan', 'executePlan', 'recordLog']),
    addEmptyRow(list) {
      const leng = list.length
      for (let i = 5; i - leng > 0; i--) {
        list.push({ empty: true })
      }
      return list
    },
    blurcheck(type) {
      if (type === 'name') {
        this.nameValid =
          !!this.details.name && this.details.name.length <= 256 && this.details.name.replace(/\s+/g, '') !== ''
      } else if (type === 'start') {
        this.startValid = !!this.dataDetails.startStr
      } else if (type === 'end') {
        this.endValid = !!this.dataDetails.endStr
      } else if (type === 'scene') {
        this.sceneValid = !!this.dataDetails.sceneVal
      }
    },
    addtoPlan() {
      // 避免重复名称
      let name = ''
      let sameName = false
      let add = 0
      do {
        add++
        name = '预案' + (this.planList.length + add)
        sameName = this.$lodash.find(this.planList, item => item.name === name)
      } while (sameName)

      this.showDetail = true
      this.saveIndex = -1
      this.selectData = null
      this.details = {
        name,
        data: this.addEmptyRow([])
      }
    },
    altPlan(index) {
      this.showDetail = true
      this.saveIndex = index
      this.selectData = null
      this.details = {
        ...this.list[index],
        data: this.addEmptyRow(this.getDataList(this.list[index].info))
      }
    },
    convertFormat(value) {
      const today = new Date()
      today.setHours(0)
      today.setMinutes(0)
      today.setSeconds(0)
      if (typeof value === 'number') {
        return new Date(today.getTime() + value * 1000)
      } else {
        return Math.ceil((value.getTime() - today.getTime()) / 1000)
      }
    },
    getDataList(list) {
      const data = []
      list.forEach((item, index) => {
        const start = this.convertFormat(item.start)
        const end = this.convertFormat(item.end)
        data.push({
          start: moment(start).format(DateFormat),
          end: moment(end).format(DateFormat),
          ...this.sceneData[item.scene],
          scene: item.scene,
          startStr: moment(start).format(TimeFormat),
          endStr: moment(end).format(TimeFormat),
          no: index + 1
        })
      })
      return data
    },
    addData() {
      this.selectData = null
      let lastItem, start, end
      const list = this.details.data.filter(item => item.empty !== true)
      if (list.length) {
        lastItem = list[list.length - 1]
        start = moment(lastItem.end, DateFormat).toDate()
      } else {
        start = moment('0:0:0', TimeFormat).toDate()
      }
      end = moment(start)
        .add(1, 'h')
        .toDate()
      if (moment(end) > moment('23:59:59', TimeFormat)) {
        end = moment('23:59:59', TimeFormat).toDate()
      }
      this.dataDetails = {
        start,
        end,
        startStr: moment(start).format(TimeFormat),
        endStr: moment(end).format(TimeFormat),
        sceneVal: this.sceneOption[0] ? this.sceneOption[0].value : ''
      }
      this.showDataDetails = true
    },
    getSameday(date) {
      if (typeof date === 'string') {
        if (date.length > 'YYYY-MM-dd '.length) {
          date = moment(date, DateFormat).toDate()
        } else {
          date = moment(date, TimeFormat).toDate()
        }
      }
      const d = new Date()
      d.setHours(date.getHours())
      d.setMinutes(date.getMinutes())
      d.setSeconds(date.getSeconds())
      return d
    },
    validateData() {
      this.blurcheck('start')
      this.blurcheck('end')
      this.blurcheck('scene')
      if (!this.startValid) {
        this.showError('开始时间不能为空')
      } else if (!this.endValid) {
        this.showError('结束时间不能为空')
      } else if (
        parseInt(this.getSameday(this.dataDetails.start).getTime() / 1000) >=
        parseInt(this.getSameday(this.dataDetails.end).getTime() / 1000)
      ) {
        this.showError('结束时间必须大于开始时间')
      } else if (!this.sceneValid) {
        this.showError('场景不能为空')
      } else {
        const data = this.details.data.filter((item, index) => {
          const no = this.selectData ? this.selectData.no - 1 : -1
          return index !== no && !item.empty
        })
        const start = parseInt(this.getSameday(this.dataDetails.start).getTime() / 1000)
        const end = parseInt(this.getSameday(this.dataDetails.end).getTime() / 1000)
        let valid = true
        data.forEach(item => {
          const istart = parseInt(this.getSameday(item.start).getTime() / 1000)
          const iend = parseInt(this.getSameday(item.end).getTime() / 1000)
          if (istart < start && iend > start) {
            valid = false
          } else if (istart < end && iend > end) {
            valid = false
          }
          if (start < istart && end > istart) {
            valid = false
          } else if (start < iend && end > iend) {
            valid = false
          } else if (start === istart && end === iend) {
            valid = false
          }
        })
        if (!valid) {
          this.showError('设置的时间段中有重复')
        }
        return valid
      }
      return false
    },
    saveData() {
      if (!this.validateData()) {
        return
      }
      const data = {
        ...this.dataDetails,
        ...this.sceneData[this.dataDetails.sceneVal]
      }
      data.scene = this.dataDetails.sceneVal
      data.start = moment(this.getSameday(data.start)).format(DateFormat)
      data.end = moment(this.getSameday(data.end)).format(DateFormat)
      if (!this.disabledIcon) {
        const index = this.selectData.no - 1
        this.$set(this.details.data, index, data)
      } else {
        const list = this.details.data.filter(item => !item.empty)
        if (!list.length) {
          data.no = 1
        } else {
          data.no = list[list.length - 1].no + 1
        }
        list.push(data)
        this.details.data = this.addEmptyRow(list)
      }
      this.showDataDetails = false
      this.selectData = null
      this.dataDetails.endStr = ''
    },
    altData() {
      if (this.disabledIcon) {
        return
      }
      this.dataDetails = {
        startStr: this.selectData.startStr,
        endStr: this.selectData.endStr,
        no: this.selectData.no,
        start: moment(this.selectData.start, DateFormat).toDate(),
        end: moment(this.selectData.end, DateFormat).toDate(),
        sceneVal: this.selectData.scene
      }
      this.showDataDetails = true
    },
    delData() {
      if (this.disabledIcon) {
        return
      }
      const index = this.$lodash.findIndex(this.details.data, item => item.no === this.selectData.no)
      this.details.data.splice(index, 1)
      this.details.data = this.addEmptyRow(this.details.data)
      this.selectData = null
      this.showDataDetails = false
    },
    showError(msg) {
      this.$Notice.error({
        title: '错误',
        desc: msg,
        duration: 2
      })
    },
    showMsg(msg) {
      this.$Notice.success({
        title: '提示',
        desc: msg,
        duration: 2
      })
    },
    validateInput() {
      if (!this.nameValid) {
        // this.showError('预案名称不能为空')
      } else if (this.details.data.filter(item => !item.empty).length === 0) {
        this.showError('至少添加一个定时')
      } else {
        return true
      }
      return false
    },
    save() {
      if (!this.validateInput()) {
        return
      }
      this.showDetail = false
      const param = {
        name: this.details.name,
        info: this.details.data.filter(item => !item.empty).map(item => {
          if (typeof item.start === 'string') {
            item.start = moment(item.start, DateFormat).toDate()
          }
          if (typeof item.end === 'string') {
            item.end = moment(item.end, DateFormat).toDate()
          }
          return {
            start: this.convertFormat(item.start),
            end: this.convertFormat(item.end),
            scene: item.scene
          }
        })
      }
      if (this.saveIndex === -1) {
        this.commonAPIHandle(this.addPlan(param), '添加', 'addPlan')
      } else {
        param._id = this.details._id
        this.commonAPIHandle(this.setPlan(param), '修改', 'setPlan')
      }
    },
    async del(index) {
      // const res = await this.confirmModal(`确定要删除"${this.list[index].name}"吗?`)
      // if (!res) {
      //   return
      // }
      const id = this.list[index]._id
      this.delectId = this.list[index]._id
      if (id === this.tvwall.selectedplan) {
        this.showError('预案正在执行，无法删除')
      } else {
        this.delectModal = true
        this.delectName = this.list[index].name
      }
    },
    delect() {
      this.commonAPIHandle(this.deletePlan(this.delectId), '删除', 'deletePlan')
    },
    execPlan(index) {
      this.recordLog({
        logType: '操作日志',
        module: '电视墙',
        operateName: '执行预案',
        operateContent: `执行预案: ${this.list[index].name}`
      })
      this.commonAPIHandle(
        this.executePlan({
          id: this.list[index]._id
        }),
        '执行',
        'executePlan'
      )
    },
    scorll() {
      this.$refs.scroller && this.$refs.scroller.update()
    }
  },
  created() {
    this.getPlans()
  },
  mounted() {
    this.$nextTick(() => {
      this.showDetail = false
    })
  }
}
</script>
<style lang="less" scoped>
.left-con .label-input {
  width: 170px !important;
}
.input {
  padding: 10px 0;
}

.ul-list {
  display: inline-block;
  width: 180px;
  height: 120px;
  border: 1px solid #203863;
}

.details {
  label {
    display: inline-block;
    width: 70px;
    height: 120px;
    vertical-align: top;
  }

  input {
    width: 160px;
  }
}

.details > div > div {
  min-height: 30px;
}

.disabled {
  color: #bfbfbf;

  &:hover {
    color: #bfbfbf !important;
  }
}

.details .tips {
  margin-left: 75px;
  color: #ed3f14;
  height: auto;
  width: auto;
}
</style>
<style lang="less">
.tv-plan .details .ivu-date-picker .ivu-select-dropdown {
  width: auto !important;
}
.tv-plan .details input {
  width: 170px !important;
}
.input {
  padding: 10px;
}

.ul-list {
  display: inline-block;
  width: 180px;
  height: 120px;
  border: 1px solid #203863;
}

.details {
  label {
    display: inline-block;
    width: 70px;
    vertical-align: top;
  }

  input {
    width: 160px;
  }
}

.details > div > div {
  min-height: 30px;
}

.disabled {
  color: #bfbfbf;

  &:hover {
    color: #bfbfbf !important;
  }
}

.details .tips {
  margin-left: 75px;
  color: #ed3f14;
  height: auto;
  width: auto;
}
</style>
