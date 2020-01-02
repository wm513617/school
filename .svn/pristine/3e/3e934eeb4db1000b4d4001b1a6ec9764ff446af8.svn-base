<!-- 飞行路线编辑面板 -->
<template>
  <div>
    <ul>
      <li @click="changEditTab('info')" :class="{'active':selectedEditTab === 'info'}">信息</li>
      <li @click="changEditTab( 'coordinate')" :class="{'active':selectedEditTab === 'coordinate'}">坐标</li>
    </ul>
    <div class="edit-tab" v-show="selectedEditTab === 'info'">
      <Form :label-width="75" label-position="left" ref="route" :rules="validateRule" :model="route">
        <FormItem label="名称" prop="name">
            <Input v-model="route.name" :maxlength="64" placeholder="请输入名称"/>
          </FormItem>
        <FormItem label="视角" prop="viewMode">
          <Select v-model="route.viewMode" >
            <Option v-for="(item, index) in viewModes" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="速率" prop="speed">
          <Slider :step="1" :min="0" :max="10"  v-model="route.speed" style="margin-right: 12px;"></Slider>
        </FormItem>
        <FormItem v-if="showViewHeight" label="视角高度" prop="speed">
          <Slider :step="10" :min="500" :max="7500"  v-model="route.viewHeight" style="margin-right: 12px;"></Slider>
        </FormItem>
        <FormItem label="显示标记" prop="isShowMarker">
          <RadioGroup v-model="route.isShowMarker">
            <Radio :label="1">
                <span>是</span>
            </Radio>
            <Radio :label="0">
                <span>否</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="显示路线" prop="isShowRoute">
          <RadioGroup v-model="route.isShowRoute">
            <Radio :label="1">
                <span>是</span>
            </Radio>
            <Radio :label="0">
                <span>否</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="循环漫游" prop="isCircle">
          <RadioGroup v-model="route.isCircle">
            <Radio :label="1">
                <span>是</span>
            </Radio>
            <Radio :label="0">
                <span>否</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="描述" prop="description">
          <Input type="textarea" v-model="route.description" :maxlength="100" :rules="validateRule" :rows="4" placeholder="请输入描述信息" />
        </FormItem>
      </Form>
    </div>
    <coordinates class="edit-tab" v-show="selectedEditTab === 'coordinate'" :coordinates="route.coordinates" @coordinatesChange="handleCoordinatesChange"></coordinates>
    <div class="edit-tab-foot">
      <Button title="点击取消保存路线信息" @click="cancelSaveRoute('route')">取消</Button>
      <Button type="primary" title="点击保存路线信息"  @click="saveRoute('route')">保存</Button>
    </div>
  </div>
</template>
<script>
import Coordinates from './Coordinates'
import { viewModes, transCoorinates } from './init'
import mapUtil from 'assets/3DMap/mapUtil.js'
import DrawTools from 'assets/3DMap/utils/DrawTools.js'
import { validateTitle, validateDes } from './validate'
import { mapActions } from 'vuex'

export default {
  name: 'RouteEdit',
  components: { Coordinates },
  data() {
    return {
      selectedEditTab: 'coordinate',
      route: {
        name: '', // 名称
        viewMode: this.isAdd === true ? 0 : null, // 视角模式
        viewHeight: 1500, // 视角高度
        speed: 5, // 速率
        isShowMarker: 0, // 显示标记
        isShowRoute: 1, // 显示路线
        isCircle: 0, // 是否循环
        description: '', // 描述信息
        coordinates: [] // 路线
      }, // 路线
      viewModes: viewModes, // 视角模式
      validateRule: {
        name: [{ required: true, validator: validateTitle, trigger: 'change' }],
        description: [{ validator: validateDes, trigger: 'change' }]
      },
      drawTools: null // 绘制工具
    }
  },
  props: {
    isAdd: {
      type: Boolean,
      default: true
    },
    selectedRoute: {
      type: Object,
      default: null
    }
  },
  computed: {
    showViewHeight() { // 是否显示视角高度
      let flag = true
      if (this.route.viewMode === mapUtil.VIEWMODE.tracklook) {
        flag = false
      }
      return flag
    }
  },
  watch: {
    route: { // 监听地图资源变化
      handler(newVal) {
        if (this.drawTools && this.drawTools.lineDrawer && (this.drawTools.lineDrawer.active || this.drawTools.lineDrawer.isDrawing)) {
          console.log('正在绘制位置！！！')
          return
        }
        this.$emit('dataChange', { route: this.route })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    if (this.selectedRoute) {
      this.route = this.selectedRoute
    }
    if (this.isAdd) {
      this.initDrawToos()
    }
  },
  beforeDestroy() {
    if (this.drawTools) {
      this.drawTools.deactiveAll() // 结束绘制
      this.drawTools.clearAll() // 清空临时绘制
      this.drawTools.relieveMeasureListeners() // 解除绘制工具的监听
    }
  },
  methods: {
    ...mapActions(['addOneFlight', 'updateOneFlight']),
    initDrawToos() { // 初始化绘制工具
      if (!this.$context.viewer.scene.pickPositionSupported) {
        this.errorMsg('不支持深度拾取,无法绘制飞行路线！')
        return
      }
      this.drawTools = new DrawTools(this.$context)
      if (this.drawTools) {
        this.drawTools.activeLineDraw() // 绘制线
        this.drawTools.lineDrawer.drawEvt.addEventListener(result => {
          this.drawTools.clearAll() // 清空临时绘制
          let positions = result.object.positions
          let coorinates = transCoorinates.worldPositionsToWSG84Arr(this.$context, positions)
          this.route.coordinates = coorinates // 更新路线的坐标数组
        })
      }
    },
    changEditTab(tab) {
      this.selectedEditTab = tab
    },
    handleCoordinatesChange(param) {
      this.$emit('dataChange', { route: this.route })
    },
    cancelSaveRoute(name) {
      this.$refs[name].resetFields() // 重置表单
      this.$emit('backToList')
    },
    saveRoute(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // console.log(this.route)
          // console.log(this.isAdd)
          if (this.isAdd) {
            this.addOneFlight(this.route)
              .then(res => {
                console.log(this.route)
                this.$Notice.success({
                  title: '添加路线成功！',
                  desc: ''
                })
              })
              .catch(err => {
                console.log(err.response)
                this.$Notice.error({
                  title: '添加路线失败！',
                  desc: err.response.data.message
                })
              })
          } else {
            console.log(this.route)
            this.updateOneFlight(this.route)
              .then(res => {
                this.$Notice.success({
                  title: '修改路线成功！',
                  desc: ''
                })
              })
              .catch(err => {
                console.log(err.response)
                this.$Notice.error({
                  title: '修改路线失败！',
                  desc: err.response.data.message
                })
              })
          }
          this.$emit('backToList', { route: this.route })
          // this.$refs[name].resetFields() // 重置表单
        } else {
          console.log('保存飞行漫游路线信息表单校验失败！')
          this.selectedEditTab = 'info' // 进入信息界面
        }
      })
    }
  }
}
</script>
<style scoped>
ul {
  width: 100%;
  height: 38px;
  font-size: 14px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: start;
}
ul li {
  width: 95%;
  float: left;
  margin: 0 5px;
  cursor: pointer;
  height: 30px;
  line-height: 20px;
  list-style: none;
}
ul li.active {
  border-bottom: 1px solid #4996f9;
}
.edit-tab {
  margin-top: 12px;
  height: calc(100% - 130px);
  overflow-y: auto;
  overflow-x: hidden;
}
.edit-tab-foot {
  bottom: 24px;
  position: absolute;
  width: 100%;
  height: 32px;
  line-height: 32px;
  text-align: center;
}
.edit-tab-foot button {
  margin: 0 8px;
  height: 32px;
}
</style>
