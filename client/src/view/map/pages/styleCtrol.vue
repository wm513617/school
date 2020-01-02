<!--编辑模式 网格、楼宇、报警标识为线、面时的样式控制-->
<template>
  <div class="areaStyleHome">
    <Form ref="StyleDefeat" :model="StyleDefeat" :label-width="80" label-position="left">
      <Form-item label="边框类型">
        <Select v-model="StyleDefeat.borderstyle">
          <Option v-for="item in borderStyleSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>
      <Form-item label="边框宽度">
        <Select v-model="StyleDefeat.borderwidth">
          <Option v-for="item in borderWidthSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>
      <Form-item label="边框颜色" prop="bordercolor">
        <!-- <Row>
          <Col span="12">
            <ColorPicker size="small" v-model="StyleDefeat.bordercolor" recommend  @on-change="bordercolorChange"/>
          </Col>
          <Col span="10">
            <Input :maxlength="7" v-model="StyleDefeat.bordercolor"/>
          </Col>
        </Row> -->
        <p class="colorTextClass">
          <b ref="changeuploadcolor">{{StyleDefeat.bordercolor}}</b>
        </p>
        <Select v-model="StyleDefeat.bordercolor" placeholder="" style="width:180px;">
          <Sketch :value="StyleDefeat.bordercolor" @input="bordercolorChange"></Sketch>
        </Select>
      </Form-item>
      <Form-item label="边框透明度">
        <div class="sliderClass">
          <Slider v-model="StyleDefeat.bodertransparency"></Slider>
        </div>
      </Form-item>
      <Form-item label="填充颜色" prop="fillcolor" v-if="isAreaCantShow">
        <!-- <Row>
                <Col span="12">
                  <ColorPicker size="small" v-model="StyleDefeat.fillcolor" recommend @on-change="fillcolorChange"/>
                </Col>
                <Col span="10">
                  <Input :maxlength="7" v-model="StyleDefeat.fillcolor"/>
                </Col>
              </Row> -->
        <p class="colorTextClass">
          <b ref="changeuploadcolor">{{StyleDefeat.fillcolor}}</b>
        </p>
        <Select v-model="StyleDefeat.fillcolor" placeholder="" style="width:180px;">
          <Sketch :value="StyleDefeat.fillcolor" @input="fillcolorChange"></Sketch>
        </Select>
      </Form-item>
      <Form-item label="填充透明度" v-if="isAreaCantShow">
        <div class="sliderClass">
          <Slider v-model="StyleDefeat.fillcolortransparency"></Slider>
        </div>
      </Form-item>
      <!-- <Form-item label="字体">
        <Select v-model="StyleDefeat.font">
          <Option v-for="item in fontSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item> -->
      <Form-item label="字体颜色" prop="fontcolor" v-if="isLineCantShow">
        <!-- <Row>
                <Col span="12">
                  <ColorPicker size="small" v-model="StyleDefeat.fontcolor" recommend @on-change="fontcolorChange"/>
                </Col>
                <Col span="10">
                  <Input :maxlength="7" v-model="StyleDefeat.fontcolor"/>
                </Col>
              </Row> -->
        <p class="colorTextClass">
          <b ref="changeuploadcolor">{{StyleDefeat.fontcolor}}</b>
        </p>
        <Select placeholder="" v-model="StyleDefeat.fontcolor" style="width:180px;">
          <Sketch :value="StyleDefeat.fontcolor" @input="fontcolorChange"></Sketch>
        </Select>
      </Form-item>
      <Form-item label="字体大小" v-if="isLineCantShow">
        <Select v-model="StyleDefeat.fontsize">
          <Option v-for="item in fontSizeSelset" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>
    </Form>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import pageConfig from '../pageConfig'
import { Sketch } from 'vue-color'
export default {
  components: {
    Sketch: Sketch
  },
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
          borderstyle: 'solid',
          // 边框宽度
          borderwidth: '1',
          // 边框颜色
          bordercolor: '#FF0000',
          // 边框透明度
          bodertransparency: 100,
          // 填充颜色
          fillcolor: '#FF0000',
          // 填充透明度
          fillcolortransparency: 50,
          // 字体
          font: '微软雅黑',
          // 字体颜色
          fontcolor: '#FF0000',
          // 字体粗细
          fontregular: 'normal',
          // 字体大小
          fontsize: '12'
        }
      }
    }
  },
  watch: {
    // 网格样式
    StyleDefeat: {
      handler(newVal, oldVal) {
        let style = JSON.parse(JSON.stringify(newVal))
        if (style.bordercolor === '') {
          style.bordercolor = '#FF0000'
        }
        if (style.fontcolor === '') {
          style.fontcolor = '#FF0000'
        }
        if (style.bordercolor === '') {
          style.bordercolor = '#FF0000'
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
        bordercolor: [{ required: true, validator: deColor, trigger: 'change' }],
        fillcolor: [{ required: true, validator: deColor, trigger: 'change' }],
        fontcolor: [{ required: true, validator: deColor, trigger: 'change' }]
      }
    }
  },
  mounted() {
    // console.log(this.StyleDefeat, ":.............样式")
    // this.StyleDefeat.bodertransparency = parseInt(this.StyleDefeat.bodertransparency)
    // this.StyleDefeat.fillcolorTransparency = parseInt(this.StyleDefeat.fillcolorTransparency)
  },
  methods: {
    ...mapMutations(['SET_AREASTYLE_DATA']),
    fontcolorChange(val) {
      this.StyleDefeat.fontcolor = val.hex
    },
    fillcolorChange(val) {
      this.StyleDefeat.fillcolor = val.hex
    },
    bordercolorChange(val) {
      this.StyleDefeat.bordercolor = val.hex
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
