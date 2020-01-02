<!--编辑模式 网格标识为线、面时的样式控制-->
<template>
  <div class="areaStyleHome">
    <Form ref="styleDefault" :model="styleDefault" :rules="ruleValidate" :label-width="80" label-position="left">
      <Form-item label="边框类型">
        <Select v-model="styleDefault.borderStyle">
          <Option v-for="item in borderStyleSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>
      <Form-item label="边框宽度">
        <Select v-model="styleDefault.borderWidth">
          <Option v-for="item in borderWidthSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>
      <Form-item label="边框颜色" prop="borderColor">
        <EditSelect v-model="styleDefault.borderColor" @input="changeVal('borderColor', $event)"></EditSelect>
      </Form-item>
      <Form-item label="边框透明度">
        <div class="sliderClass">
          <Slider v-model="styleDefault.borderTransparency"></Slider>
        </div>
      </Form-item>
      <Form-item label="填充颜色" prop="fillColor" v-if="isAreaCantShow">
        <EditSelect v-model="styleDefault.fillColor"></EditSelect>
      </Form-item>
      <Form-item label="填充透明度" v-if="isAreaCantShow">
        <div class="sliderClass">
          <Slider v-model="styleDefault.fillColorTransparency"></Slider>
        </div>
      </Form-item>
      <Form-item label="字体颜色" prop="fontColor" v-if="isLineCantShow">
        <EditSelect v-model="styleDefault.fontColor"></EditSelect>
      </Form-item>
      <Form-item label="字体大小" v-if="isLineCantShow">
        <Select v-model="styleDefault.fontSize">
          <Option v-for="item in fontSizeSelset" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>
    </Form>
  </div>
</template>
<script>
import EditSelect from './EditSelect'
import pageConfig from './pageConfig.js'
import gridUtil from 'assets/3DMap/gridUtil.js'
import { GeometryType } from 'assets/3DMap/GeometryType.js'
import { mapActions, mapState } from 'vuex'
export default {
  components: {
    EditSelect
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
    styleDefault: {
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
  computed: {
    ...mapState({
      gridLoc: ({ tdFloor }) => tdFloor.gridLoc, // 楼宇内网格位置----胡红勋
      gridFeatureList: ({ tdPoint }) => tdPoint.gridFeatureList, // 网格列表要素
      isEditGrid: ({ tdFloor }) => tdFloor.isEditGrid
    })
  },
  watch: {
    // 网格样式
    styleDefault: {
      handler(newVal, oldVal) {
        let style = JSON.parse(JSON.stringify(newVal))
        if (style.borderColor === '') {
          style.borderColor = '#FF0000'
        }
        if (style.fontColor === '') {
          style.fontColor = '#FF0000'
        }
        if (style.fillColor === '') {
          style.fillColor = '#FF0000'
        }
        this.setDrawGridStyle(JSON.parse(JSON.stringify(style)))
        let symbol = gridUtil.convertStyleToSymbol(style)
        if (!this.isEditGrid) {
          let gridFeature = {
            geom: {
              type: GeometryType.MULTIPOLYGON,
              points: this.gridLoc
            },
            attributes: {
              id: 'temp'
            },
            symbol
          }
          let features = [...this.gridFeatureList]
          let vectors = gridUtil.addFeatureToLayer(features, gridFeature)
          this.setGridList(vectors)
        }
      },
      deep: true
    }
  },
  data() {
    // 颜色值校验
    const deColor = (rule, value, callback) => {
      const rname = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/
      if (value && rname.test(value)) {
        callback()
      } else {
        return callback(new Error('颜色值格式有误'))
      }
    }
    return {
      // 边框类型选项
      borderStyleSelect: pageConfig.borderStyleSelect,
      // 边框宽度选项
      borderWidthSelect: pageConfig.borderWidthSelect,
      // 字体大小
      fontSizeSelset: pageConfig.fontSizeSelset,
      ruleValidate: {
        borderColor: [{ required: false, validator: deColor, trigger: 'blur' }],
        fillColor: [{ required: false, validator: deColor, trigger: 'blur' }],
        fontColor: [{ required: false, validator: deColor, trigger: 'blur' }]
      }
    }
  },
  methods: {
    ...mapActions(['setGridList', 'setDrawGridStyle']),
    fontColorChange(val) {
      this.styleDefault.fontColor = val.hex
    },
    fillColorChange(val) {
      this.styleDefault.fillColor = val.hex
    },
    borderColorChange(val) {
      this.styleDefault.borderColor = val.hex
    },
    changeVal(key, val) {
      this.styleDefault[key] = val
    }
  }
}
</script>
<style scoped>
.areaStyleHome {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
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
