<!-- 巡更轨迹查询表单 -->
<template>
  <div>
    <div class="trackContent">
      <Form :rules="validateRules" ref="patrolForm" :model="patrolForm" :label-width="100" label-position="left">
        <FormItem label="姓名" prop="name">
          <Input v-model="patrolForm.name" readonly placeholder="请选择巡逻人员" style="width:350px;">
            <Button slot="append" @click="controlShowRightSelect" :icon="showRightSelect?'arrow-left-a':'arrow-right-a'"></Button>
          </Input>
        </FormItem>
        <FormItem prop="type">
          <RadioGroup v-model="patrolForm.type" @on-change="handlePatrolTypeChange">
            <Radio v-for="(item, index) in patrolTypes" :key="index" :label="item.label" :value="item.value" :disabled="item.disable">
              <span>{{item.text}}</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <div v-if="patrolForm.type === 'patrol'">
          <FormItem label="日期" prop="patrolDate">
            <DatePicker type="date" placeholder="日期" :options="dateLimit" v-model="patrolForm.patrolDate" style="width: 170px; margin-right: 10px;" @on-change="patrolDateChange"></DatePicker>
          </FormItem>
          <FormItem label="任务列表" prop="taskID">
            <Select v-model="patrolForm.taskID" style="width:350px" placeholder="请选择巡更任务" :disabled="tasks.length===0">
              <Option v-for="item in tasks" :value="item._id" :key="item._id">{{ item.taskTitle }}</Option>
            </Select>
          </FormItem>
        </div>
        <div v-if="patrolForm.type === 'history'">
          <FormItem  label="日期" prop="historyDate">
            <DatePicker type="date" placeholder="日期" :options="dateLimit" v-model="patrolForm.historyDate" style="width: 170px; margin-right: 10px;"></DatePicker>
          </FormItem>
          <FormItem label="开始时间" prop="startTime">
            <BStimePicker :datetime='patrolForm.startTime' @timeChange="startTimeChange" class="picker-style" :width='170'></BStimePicker>
          </FormItem>
          <FormItem label="结束时间" prop="endTime">
            <BStimePicker :datetime='patrolForm.endTime' @timeChange="endTimeChange" class="picker-style" :width='170'></BStimePicker>
          </FormItem>
        </div>
      </Form>
    </div>
    <div class="trackFoot">
      <Button type="primary" @click="confirmSearch('patrolForm')">确认</Button>
      <Button type="text" @click="cannelSearch('patrolForm')">取消</Button>
    </div>
    <div v-if="showRightSelect" class="rightSelect">
      <bsr-tree :treeData="treeData[0]||{}" ref="guardTree" @node-click="handleTreeNodeClick">
        <template slot-scope="{ node }">
          <span :class="{'item': true}" :title="node.name">
            <i class='iconfont icon-organise' v-if="node.isOrg" title="机构"></i>
            <i class='iconfont icon-yidongdanbing' v-else title="人员"></i>
            {{node.name}}
          </span>
        </template>
      </bsr-tree>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import toTree from '../../../../assets/js/toTreeData'
import TransformCoord from 'assets/2DMap/utils/transformcoord'
import { toMercator } from '@turf/projection'
import { point } from '@turf/helpers'
import { PROJ } from 'assets/2DMap/meta/common.js'

export default {
  name: 'PatrolForm',
  data() {
    return {
      showRightSelect: false, // 是否显示右侧选择列表
      treeData: [], // 右侧选择树列表的数据源
      selectedGuard: null, // 选择的巡逻人员
      patrolForm: {
        name: '', // 巡逻相关人员姓名
        type: 'patrol', // 巡更轨迹查询类型，默认为巡更轨迹
        taskID: '', // 任务标识
        patrolDate: '', // 巡更查询日期
        historyDate: '', // 历史查询日期
        startTime: '00:00:00',
        endTime: '00:00:00'
        // timeRange: ['00:00:00', '00:00:00'] // 历史轨迹查询时间范围
      },
      dateLimit: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      validateRules: { // 表单校验规则
        name: [{required: true, message: '请选择巡更人员', trigger: 'change'}],
        taskID: [{ required: true, message: '请选择巡更任务', trigger: 'change' }]
      },
      patrolTypes: [ // 巡更类型数据源
        { text: '巡更轨迹', label: 'patrol', value: 'patrol', disable: false },
        { text: '历史轨迹', label: 'history', value: 'history', disable: false }
      ],
      tasks: [] // 测试巡更类型数据源
    }
  },
  computed: {
    ...mapGetters({
      mapProjection: 'mapProjection' // 地图投影坐标系
    })
  },
  created() {
    this.getSentryUserTree().then(res => {
      this.treeData = toTree(res)
    }).catch(err => console.log(err))
  },
  mounted() {
    this.initSearchTime() // 初始化查询时间
  },
  methods: {
    ...mapMutations('fengMap', [
      'SET_FMAP_SHOW_DRAW_TRACK', // 是否显示绘制轨迹
      'SET_FMAP_SHOW_TRACK_MODAL' // 是否显示轨迹弹出框
    ]),
    ...mapActions('fengMapLine', ['setLineTrackLoc']),
    ...mapActions([
      'getSentryUserTree', // 获取巡更人员树数据源
      'getPatrolUserTasks', // 获取巡更人员任务
      'getRecordInfo', // 获取巡更任务信息
      'getHistoryPatrolPosition' // 获取历史巡更位置信息
    ]),
    startTimeChange(val) {
      this.patrolForm.startTime = val
      if (this.patrolForm.startTime > this.patrolForm.endTime) {
        this.patrolForm.endTime = this.patrolForm.startTime
      }
    },
    endTimeChange(val) {
      this.patrolForm.endTime = val
      if (this.patrolForm.endTime < this.patrolForm.startTime) {
        this.patrolForm.startTime = this.patrolForm.endTime
      }
    },
    controlShowRightSelect() { // 控制右侧选择列表的显示
      this.showRightSelect = !this.showRightSelect
    },
    handleTreeNodeClick(item, obj) { // 树节点点击处理
      // console.log('点击的巡更人员树节点：', item, '树节点路由数据', obj)
      if (item && !item.children) { // 无子节点时
        this.selectedGuard = item // 设置选择的巡逻人员
        this.patrolForm.name = this.selectedGuard.name // 将巡逻人员的姓名绑定到查询表单中
        this.showRightSelect = false // 关闭右侧巡逻人员选择树
        if (this.patrolForm.type === 'patrol' && item._id) { // 查询巡更任务轨迹时
          this.getUserPatrolTasks(item._id)
        }
      }
    },
    getUserPatrolTasks(userId) { // 获取用户巡更任务
      let param = {
        userId: userId,
        date: this.$moment(this.$moment(this.patrolForm.patrolDate).format('YYYY-MM-DD')).unix('X')
      }
      console.log('获取到用户巡更任务请求参数：', param)
      this.getPatrolUserTasks(param).then(res => {
        console.log('获取到用户巡更任务：', res)
        this.tasks = res.data
      }).catch(err => {
        console.log('获取用户巡更任务失败：', err)
      })
    },
    handlePatrolTypeChange(patrolType) { // 处理巡更轨迹查询类型改变
      if (patrolType === 'patrol') { // 巡更轨迹
        delete this.validateRules.startTime // 删除校验历史轨迹查询开始时间
        delete this.validateRules.endTime // 删除校验历史轨迹查询结束时间
        this.validateRules.taskID = [{ required: true, message: '请选择巡更任务', trigger: 'change' }] // 添加选取时间或选择巡更任务的校验
      } else if (patrolType === 'history') { // 历史轨迹
        delete this.validateRules.taskID // 去掉任务校验
        this.validateRules.startTime = [{ required: true, validator: this.validateStartRange, trigger: 'change' }] // 查询时间范围校验
        this.validateRules.endTime = [{ required: true, validator: this.validateEndRange, trigger: 'change' }] // 查询时间范围校验
      }
    },
    cannelSearch(name) { // 取消查询
      this.resetForm(name) // 重置表单
      this.SET_FMAP_SHOW_TRACK_MODAL(false)
    },
    resetForm(name) { // 重置表单
      this.$refs[name].resetFields() // 清空查询表单
      this.validateRules.taskID = [{ required: true, message: '请选择巡更任务', trigger: 'change' }] // 添加选取时间或选择巡更任务的校验
      this.initSearchTime() // 初始化查询时间
    },
    confirmSearch(name) { // 确认查询
      this.$refs[name].validate(valid => {
        if (valid) { // 巡更轨迹查询条件表单校验通过
          console.log('巡更轨迹查询，校验通过！')
          if (this.patrolForm.type === 'patrol') { // 巡更轨迹
            this.searchPatrolRecordTrack(name)
          } else if (this.patrolForm.type === 'history') { // 历史轨迹
            this.searchPatrolHistoryTrack(name)
          }
        } else {
          console.log('巡更轨迹查询，校验未通过！')
        }
      })
    },
    searchPatrolRecordTrack(name) { // 查询巡更记录轨迹
      this.getRecordInfo({ id: this.patrolForm.taskID }).then(res => {
        res = {
          data: {
            points: [
              {
                pointId: {
                  point: {
                    geo: '12946928.47576262,4861568.116194555'
                  }
                }
              },
              {
                pointId: {
                  point: {
                    geo: '12947652.805617323,4861795.728323896'
                  }
                }
              }
            ]
          }
        }
        if (res.data.points && res.data.points.length > 0) {
          let coordinates = this.getTaskTrackCoodinates(res.data.points) // 获取巡更任务轨迹坐标数组
          if (coordinates && coordinates.length > 0) {
            this.setLineTrackLoc({ points: coordinates.toString(), type: 'patrolTrack' }) // 设置轨迹坐标数组
            // 显示绘制轨迹
            this.SET_FMAP_SHOW_DRAW_TRACK(true)
          } else {
            this.errorMsg('巡更任务轨迹信息异常')
          }
        } else {
          this.errorMsg('没有查询到巡更任务轨迹信息')
        }
        this.resetForm(name) // 重置表单
        this.SET_FMAP_SHOW_TRACK_MODAL(false) // 关闭轨迹查询弹窗
      }).catch(err => {
        console.log('获取巡更任务信息失败：', err)
        this.errorMsg('获取巡更任务信息失败')
        this.resetForm(name) // 重置表单
        this.SET_FMAP_SHOW_TRACK_MODAL(false) // 关闭轨迹查询弹窗
      })
    },
    searchPatrolHistoryTrack(name) { // 查询巡更历史记录
      let date = this.$moment(this.patrolForm.patrolDate).format('YYYY-MM-DD')
      let start = this.patrolForm.startTime
      let end = this.patrolForm.endTime
      let param = {id: this.selectedGuard._id, date: date, start: start, end: end}
      this.getHistoryPatrolPosition(param).then(res => {
        console.log('获取到的人员历史巡更轨迹信息：', res)
        res = {
          trajectory: [
            {
              lon: 12946928.47576262,
              lat: 4861568.116194555
            },
            {
              lon: 12947332.63437194,
              lat: 4861339.473360284
            }
          ]
        }
        if (res.trajectory && res.trajectory.length > 0) {
          let coordinates = this.getHistoryTrackCoodinates(res.trajectory) // 获取巡更任务轨迹map(key: 点位信息, value: 点位坐标)
          if (coordinates && coordinates.length > 0) {
            this.setLineTrackLoc({ points: coordinates.toString(), type: 'patrolHistoryTrack' }) // 设置轨迹坐标数组
            // 显示绘制轨迹
            this.SET_FMAP_SHOW_DRAW_TRACK(true)
          } else {
            this.errorMsg('历史巡更轨迹信息异常')
          }
        } else {
          this.errorMsg('没有查询到历史巡更轨迹信息')
        }
        this.resetForm(name) // 重置表单
        this.SET_FMAP_SHOW_TRACK_MODAL(false) // 关闭轨迹查询弹窗
      }).catch(err => {
        console.log('获取人员历史巡更位置信息失败：', err)
        this.errorMsg('获取人员历史巡更位置信息失败')
        this.resetForm(name) // 重置表单
        this.SET_FMAP_SHOW_TRACK_MODAL(false) // 关闭轨迹查询弹窗
      })
    },
    getTaskTrackCoodinates(points) { // 获取巡更任务轨迹坐标数组
      let coordinates = [] // 坐标map(key: 点位信息, value: 点位坐标)
      for (let index = 0; index < points.length; index++) {
        let point = points[index]
        if (point.pointId.point && point.pointId.point.geo) {
          let coValues = point.pointId.point.geo.split(',').map(item => Number(item))
          coordinates = coordinates.concat(coValues)
        }
      }
      return coordinates
    },
    getHistoryTrackCoodinates(points) { // 获取巡更任务轨迹map
      let coordinates = []
      for (let index = 0; index < points.length; index++) {
        let pointItem = points[index]
        if (!isNaN(Number(pointItem.lon)) && !isNaN(Number(pointItem.lat))) {
          // let coords = TransformCoord.wgs84togcj02(Number(pointItem.lon), Number(pointItem.lat))
          // if (this.mapProjection !== PROJ.EPSG4326) {
          //   coords = toMercator(point(coords)).geometry.coordinates
          // }
          coordinates.push(pointItem.lon)
          coordinates.push(pointItem.lat)
        }
      }
      return coordinates
    },
    initSearchTime() { // 初始化查询时间
      this.patrolForm.patrolDate = new Date()
      this.patrolForm.historyDate = new Date()
      this.patrolForm.startTime = '00:00:00'
      this.patrolForm.endTime = this.$moment().format('HH:mm:ss')
    },
    patrolDateChange() { // 巡更轨迹时，更改日期，实时查询对应任务
      if (this.patrolForm.type === 'patrol' && this.selectedGuard && this.selectedGuard._id) {
        this.getUserPatrolTasks(this.selectedGuard._id)
      }
    }
  }
}
</script>

<style scoped>
/* 内容样式 */
.trackContent {
  padding: 0 32px;
  min-height: 100px;
  height: auto;
  margin-bottom: 36px;
}
/* 尾部部样式 */
.trackFoot {
  background: #0f2343;
  height: 40px;
  padding: 0 24px;
  margin: 0 -6px -24px -6px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px
}
.trackFoot button {
  height: 30px;
  float: right;
  margin: 5px 8px 5px 8px;
}
.trackFoot button:first-child {
  float: right;
  margin-right: 0;
}
/* 右边选择树样式 */
.rightSelect {
  padding: 10px;
  position: absolute;
  top: 0;
  border-left: 1px solid #171717;
  right: -240px;
  width: 240px;
  height: 100%;
  overflow: auto;
  background: #1c3053;
}
/* 时间选择样式 */
.picker-style {
  display: inline-block;
  margin-top: 6px;
}
</style>
