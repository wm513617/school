<!--编辑模式 网格的样式控制-->
<template>
  <div class="areaStyleHome">
    <Form ref="StyleDefeat" :model="StyleDefeat" :label-width="80" label-position="left">
      <Form-item label="边框类型">
        <Select v-model="StyleDefeat.borderStyle">
          <Option v-for="item in borderStyleSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>
      <Form-item label="边框宽度">
        <Select v-model="StyleDefeat.borderWidth">
          <Option v-for="item in borderWidthSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>
      <Form-item label="边框颜色" prop="borderColor">
        <!-- <Row>
          <Col span="12">
            <ColorPicker size="small" v-model="StyleDefeat.borderColor" recommend  @on-change="borderColorChange"/>
          </Col>
          <Col span="10">
            <Input :maxlength="7" v-model="StyleDefeat.borderColor"/>
          </Col>
        </Row> -->
        <!-- <p class="colorTextClass">
          <b ref="changeuploadcolor">{{StyleDefeat.borderColor}}</b>
        </p>
        <Select v-model="StyleDefeat.borderColor" placeholder="" style="width:180px;">
          <Sketch :value="StyleDefeat.borderColor" @input="borderColorChange"></Sketch>
        </Select> -->
        <EditSelect v-model="StyleDefeat.borderColor" @input="borderColorChange"></EditSelect>
      </Form-item>
      <Form-item label="边框透明度">
        <div class="sliderClass">
          <Slider v-model="StyleDefeat.borderTransparency"></Slider>
        </div>
      </Form-item>
      <Form-item label="填充颜色" prop="fillColor" v-if="isAreaCantShow">
        <!-- <Row>
                <Col span="12">
                  <ColorPicker size="small" v-model="StyleDefeat.fillColor" recommend @on-change="fillColorChange"/>
                </Col>
                <Col span="10">
                  <Input :maxlength="7" v-model="StyleDefeat.fillColor"/>
                </Col>
              </Row> -->
        <!-- <p class="colorTextClass">
          <b ref="changeuploadcolor">{{StyleDefeat.fillColor}}</b>
        </p>
        <Select v-model="StyleDefeat.fillColor" placeholder="" style="width:180px;">
          <Sketch :value="StyleDefeat.fillColor" @input="fillColorChange"></Sketch>
        </Select> -->
        <EditSelect v-model="StyleDefeat.fillColor" @input="fillColorChange"></EditSelect>
      </Form-item>
      <Form-item label="填充透明度" v-if="isAreaCantShow">
        <div class="sliderClass">
          <Slider v-model="StyleDefeat.fillColorTransparency"></Slider>
        </div>
      </Form-item>
      <!-- <Form-item label="字体">
        <Select v-model="StyleDefeat.font">
          <Option v-for="item in fontSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item> -->
      <Form-item label="字体颜色" prop="fontColor" v-if="isLineCantShow">
        <!-- <Row>
                <Col span="12">
                  <ColorPicker size="small" v-model="StyleDefeat.fontColor" recommend @on-change="fontColorChange"/>
                </Col>
                <Col span="10">
                  <Input :maxlength="7" v-model="StyleDefeat.fontColor"/>
                </Col>
              </Row> -->
        <!-- <p class="colorTextClass">
          <b ref="changeuploadcolor">{{StyleDefeat.fontColor}}</b>
        </p>
        <Select placeholder="" v-model="StyleDefeat.fontColor" style="width:180px;">
          <Sketch :value="StyleDefeat.fontColor" @input="fontColorChange"></Sketch>
        </Select> -->
        <EditSelect v-model="StyleDefeat.fontColor" @input="fontColorChange"></EditSelect>
      </Form-item>
      <Form-item label="字体大小" v-if="isLineCantShow">
        <Select v-model="StyleDefeat.fontSize">
          <Option v-for="item in fontSizeSelset" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>
    </Form>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import pageConfig from '../../pageConfig'
// import { Sketch } from 'vue-color'
import EditSelect from '../EditSelect'
export default {
  components: { EditSelect },
  props: {
    // 当前地图标识是线，不显示字体相关设置
    isLineCantShow: {
      type: Boolean,
      default: true
    },
    // 当前地图标识是面，不显示字体相关设置
    isAreaCantShow: {
      type: Boolean,
      default: true
    },
    StyleDefeat: {
      type: Object,
      default: function() {
        return {
          // 边框样式   实线 solid/虚线 dashed/点线 dotted
          borderStyle: 'solid',
          // 边框宽度
          borderWidth: '1',
          // 边框颜色
          borderColor: '#FF0000',
          // 边框透明度
          borderTransparency: 100,
          // 填充颜色
          fillColor: '#FF0000',
          // 填充透明度
          fillColorTransparency: 50,
          // 字体
          font: '微软雅黑',
          // 字体颜色
          fontColor: '#FF0000',
          // 字体粗细
          fontRegular: 'normal',
          // 字体大小
          fontSize: '12'
        }
      }
    }
  },
  watch: {
    // 网格样式
    StyleDefeat: {
      handler(newVal, oldVal) {
        let style = JSON.parse(JSON.stringify(newVal))
        if (style.borderColor === '') {
          style.borderColor = '#FF0000'
        }
        if (style.fontColor === '') {
          style.fontColor = '#FF0000'
        }
        if (style.borderColor === '') {
          style.borderColor = '#FF0000'
        }
        this.$store.commit('SET_AREASTYLE_DATA', style)
      },
      deep: true
    }
  },
  data() {
    // 颜色值校验
    const deColor = (rule, value, callback) => {
      let rname = /^#[\da-f]{3}([\da-f]{3})?$/i
      if (value === '') {
        return callback(new Error('颜色值不能为空'))
      }
      if (rname.test(value)) {
        callback()
      } else {
        return callback(new Error('颜色值格式有误'))
      }
    }
    return {
      colors: '#1c3054',
      // 边框类型选项
      borderStyleSelect: JSON.parse(JSON.stringify(pageConfig.borderStyleSelect)),
      // 边框宽度选项
      borderWidthSelect: JSON.parse(JSON.stringify(pageConfig.borderWidthSelect)),
      // 字体选择
      fontSelect: JSON.parse(JSON.stringify(pageConfig.fontSelect)),
      // 字体粗细
      regularSelect: JSON.parse(JSON.stringify(pageConfig.regularSelect)),
      // 字体大小
      fontSizeSelset: JSON.parse(JSON.stringify(pageConfig.fontSizeSelset)),
      ruleValidate: {
        borderColor: [{ required: true, validator: deColor, trigger: 'change' }],
        fillColor: [{ required: true, validator: deColor, trigger: 'change' }],
        fontColor: [{ required: true, validator: deColor, trigger: 'change' }]
      }
    }
  },
  mounted() {
    // console.log(this.StyleDefeat, ":.............样式")
    // this.StyleDefeat.borderTransparency = parseInt(this.StyleDefeat.borderTransparency)
    // this.StyleDefeat.fillColorTransparency = parseInt(this.StyleDefeat.fillColorTransparency)
  },
  methods: {
    ...mapMutations(['SET_AREASTYLE_DATA']),
    fontColorChange(val) {
      this.StyleDefeat.fontColor = val
    },
    fillColorChange(val) {
      this.StyleDefeat.fillColor = val
    },
    borderColorChange(val) {
      this.StyleDefeat.borderColor = val
    }
  }
}
</script>
<style scoped>
.areaStyleHome {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.areaStyleHome .ivu-form-item {
  margin-bottom: 20px;
}

.areaStyleHome .sliderClass {
  width: 175px;
}

.areaStyleHome .vue-color__sketch,
.areaStyleHome .vc-sketch {
  width: 178px;
  height: 300px;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
}

.areaStyleHome .colorTextClass {
  position: absolute;
  top: 0px;
  left: 10px;
  z-index: 1;
}
</style>
