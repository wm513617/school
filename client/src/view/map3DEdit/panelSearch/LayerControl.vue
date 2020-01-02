<!-- 地图结构-图层控制 组件-->
<template>
  <div class="controller">
    <div class="layer-tree">
      <bsr-tree :treeData="treeData[0]||{}" @node-click="handleTreeNodeClick">
        <template slot-scope="{ node }">
          <span :class="{'tree-item': true}" :title="node.name">
            <i class='iconfont icon-electronic-map' v-if="node.type == nodeType.VIEWER" title="地图"></i>
            <i class='iconfont icon-tuceng' v-else-if="node.type == nodeType.LAYER" title="图层"></i>
            <span class="layer-name">{{node.name}}</span>
            <Radio class="radio" v-model="node.isGround" v-show="node.type == nodeType.LAYER" size="small" :disabled="!(selectedNode && selectedNode.name == node.name)">地面</Radio>
            <Checkbox class="checkbox" v-model="node.selected" v-show="node.type == nodeType.LAYER" size="small" :disabled="!(selectedNode && selectedNode.name == node.name)">可选</Checkbox>
          </span>
        </template>
      </bsr-tree>
    </div>
    <div v-if="selectedNode" class="adjust-panel">
      <div class="title"><span>场景调节</span></div>
      <Form :label-width="70.5" label-position="left" v-show="selectedNode.selected" class="adjust-item">
        <Form-item label="选中颜色">
          <color-select v-model="selectedNode.selectedColor"></color-select>
        </Form-item>
      </Form>
      <Row type="flex" justify="center" align="middle" class="adjust-item">
        <Col span="6">色调</Col>
        <Col span="18"><Slider v-model="selectedNode.hue" :step="0.01" :min="0" :max="1" show-input @on-change="changeSceneHue" @on-input="changeSceneHue"></Slider></Col>
      </Row>
      <Row type="flex" justify="center" align="middle" class="adjust-item">
        <Col span="6">饱和度</Col>
        <Col span="18"><Slider v-model="selectedNode.saturation" :step="0.01" :min="0" :max="1" show-input @on-change="changeSceneSaturation" @on-input="changeSceneSaturation"></Slider></Col>
      </Row>
      <Row type="flex" justify="center" align="middle" class="adjust-item">
        <Col span="6">亮度</Col>
        <Col span="18"><Slider v-model="selectedNode.brightness" :step="0.01" :min="0" :max="5" show-input @on-change="changeSceneBrightness" @on-input="changeSceneBrightness"></Slider></Col>
      </Row>
      <div class="panel-foot">
        <Button @click="initSceneSettings()" title="点击恢复图层初始设置">恢复</Button>
        <Button @click="cancelSave()" itle="点击取消保存调整">取消</Button>
        <Button type="primary" @click="saveSceneSettings()" style="margin-left: 16px" title="点击保存调整">保存</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ColorSelect from '../panelTools/map3DGrid/EditSelect'

export default {
  name: 'LayerControl',
  components: { ColorSelect },
  data() {
    return {
      treeData: null, // 图层树数据源
      selectedNode: null, // 选择节点
      nodeType: {
        VIEWER: 'viewer',
        LAYER: 'layer'
      },
      layerMap: null // 图层map（key:图层名称，value: 图层信息对象）
    }
  },
  computed: {
    ...mapState({
      map3DConfig: ({ tdIndex }) => tdIndex.map3DConfig, // 地图配置-----
      ready: ({ tdIndex }) => tdIndex.ready, // 判断地图是否加载完毕----
      layerSettingsMap: ({ tdIndex }) => tdIndex.layerSettingsMap // 图层设置map(key: 图层名称， value: 图层设置信息)
    })
  },
  watch: {
    ready(flag) { // 监听地图是否加载完成
      if (flag) {
        this.getLayerTreeData() // 获取图层树数据源
      }
    }
  },
  created() {
    this.treeData = [{
      _id: 'layer_tree_viewer',
      name: this.nodeType.VIEWER,
      type: this.nodeType.VIEWER,
      isRoot: true,
      children: []
    }]
    if (this.ready) {
      this.getLayerTreeData() // 获取图层树数据源
    }
  },
  methods: {
    ...mapActions([
      'saveLayerSettings', // 添加图层设置信息
      'deleteLayerSettingsById', // 根据标识删除图层设置信息
      'updateLayerSettingsById', // 根据标识更新图层设置信息
      'getLayerSettingsList' // 获取图层设置信息列表
    ]),
    getLayerTreeData() { // 获取图层树数据源
      let layerArr = [] // 图层节点数组
      let scene = this.$context.viewer.scene
      let layers = scene._layers.layerQueue // 获取地图图层数组
      this.layerMap = new Map()
      for (const layer of layers) {
        let { name, hue, saturation, brightness } = layer
        let layerItem = { _id: 'layer_tree_' + name, name: name, type: this.nodeType.LAYER, hue: hue, saturation: saturation, brightness: brightness, selected: layer.hasOwnProperty('queryParameter'), selectedColor: '#ff00ff', isGround: false }
        let selectedColor = this.rgbColorToHex(layer.selectedColor.toCssColorString())
        if (this.layerSettingsMap.has(name)) {
          let settings = this.layerSettingsMap.get(name)
          layerItem.selected = settings.selected
          layerItem.selectedColor = selectedColor
          layerItem.isGround = settings.hasOwnProperty('isGround') ? settings.isGround : layerItem.isGround
        }
        layerArr.push(layerItem)
        let { ...cloneItem } = layerItem
        this.layerMap.set(name, cloneItem)
      }
      if (scene.skyAtmosphere) {
        let { hueShift, saturationShift, brightnessShift } = scene.skyAtmosphere
        this.treeData[0].hue = hueShift // 色调
        this.treeData[0].saturation = saturationShift // 饱和度
        this.treeData[0].brightness = brightnessShift // 亮度
        let { ...cloneView } = this.treeData[0]
        this.layerMap.set(cloneView.name, cloneView)
      }
      this.treeData[0].children = layerArr
    },
    rgbColorToHex(rgbColor) { // 将rgb颜色转换为16进制颜色
      let hexColor = '#ff00ff'
      if (/^(rgb|RGB)/.test(rgbColor)) {
        let rgbArr = rgbColor.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',').map(item => Number(item))
        hexColor = '#' + ((rgbArr[0] << 16) | (rgbArr[1] << 8) | rgbArr[2]).toString(16)
      }
      return hexColor
    },
    handleTreeNodeClick(item, obj) { // 树节点点击处理
      if (this.selectedNode && this.selectedNode.name !== item.name) {
        this.resetLayerSettings() // 重置图层设置
      }
      this.selectedNode = item // 更新选择树节点
      if (this.selectedNode.isGround) {
        for (let layer of obj.parent) {
          if (this.selectedNode.name !== layer.name) {
            layer.isGround = false
          }
        }
      }
    },
    changeSceneHue() { // 修改场景色调
      let { name, type, hue } = this.selectedNode
      if (type === this.nodeType.VIEWER) { // 视图
        let skyAtmosphere = this.$context.viewer.scene.skyAtmosphere
        if (skyAtmosphere) {
          skyAtmosphere.hueShift = hue
        }
      } else if (type === this.nodeType.LAYER) { // 图层
        let selectedLayer = this.$context.viewer.scene.layers.find(name)
        if (selectedLayer) {
          selectedLayer.hue = hue
        }
      }
    },
    changeSceneSaturation() { // 修改场景饱和度
      let { name, type, saturation } = this.selectedNode
      if (type === this.nodeType.VIEWER) { // 视图
        let skyAtmosphere = this.$context.viewer.scene.skyAtmosphere
        if (skyAtmosphere) {
          skyAtmosphere.saturationShift = saturation
        }
      } else if (type === this.nodeType.LAYER) { // 图层
        let selectedLayer = this.$context.viewer.scene.layers.find(name)
        if (selectedLayer) {
          selectedLayer.saturation = saturation
        }
      }
    },
    changeSceneBrightness() { // 修改场景亮度
      let { name, type, brightness } = this.selectedNode
      if (type === this.nodeType.VIEWER) { // 视图
        let skyAtmosphere = this.$context.viewer.scene.skyAtmosphere
        if (skyAtmosphere) {
          skyAtmosphere.brightnessShift = brightness
        }
      } else if (type === this.nodeType.LAYER) { // 图层
        let selectedLayer = this.$context.viewer.scene.layers.find(name)
        if (selectedLayer) {
          selectedLayer.brightness = brightness
        }
      }
    },
    initSceneSettings() { // 重置场景设置
      if (this.layerSettingsMap.has(this.selectedNode.name)) { // 图层设置已存在，执行恢复操作
        let settings = this.layerSettingsMap.get(this.selectedNode.name)
        let layerId = settings._id
        this.deleteLayerSettingsById(layerId).then(res => {
          this.successMsg('恢复图层设置信息成功！')
          document.location.reload() // 刷新当前页面
        }).catch(err => {
          console.log('恢复图层设置信息失败：', err)
          this.errorMsg('恢复图层设置信息失败！')
        })
      } else {
        this.warningMsg('图层设置信息已经是初始状态！')
      }
    },
    cancelSave() { // 取消场景调整
      this.resetLayerSettings() // 重置图层设置
      this.selectedNode = null // 清空选项
    },
    resetLayerSettings() { // 重置图层设置
      let preNode = this.layerSettingsMap.get(this.selectedNode.name) || this.layerMap.get(this.selectedNode.name) // 获取修改前的节点数据
      if (preNode) { // 恢复节点数据
        this.selectedNode.isGround = preNode.hasOwnProperty('isGround') ? preNode.isGround : false
        if (preNode.hasOwnProperty('selected')) {
          this.selectedNode.selected = preNode.selected
        } else {
          let layer = this.$context.viewer.scene.layers.find(this.selectedNode.name)
          if (layer) {
            this.selectedNode.selected = layer.hasOwnProperty('queryParameter')
            this.selectedNode.selectedColor = this.rgbColorToHex(layer.selectedColor.toCssColorString())
          }
        }
        if (preNode.hasOwnProperty('selected')) {
        }
        this.selectedNode.hue = preNode.hue
        this.selectedNode.saturation = preNode.saturation
        this.selectedNode.brightness = preNode.brightness
        this.changeSceneHue()
        this.changeSceneSaturation()
        this.changeSceneBrightness()
      }
    },
    saveSceneSettings() { // 保存场景设置
      // 构造参数信息
      let { name, hue, saturation, brightness, selectedColor, isGround } = this.selectedNode
      let param = { name: name, hue: hue, saturation: saturation, brightness: brightness, selectedColor: selectedColor, isGround: isGround }
      if (this.selectedNode.hasOwnProperty('selected')) {
        param.selected = this.selectedNode.selected
      }
      if (this.layerSettingsMap.has(this.selectedNode.name)) { // 图层设置已存在，修改图层设置信息
        let settings = this.layerSettingsMap.get(this.selectedNode.name)
        param._id = settings._id
        this.updateLayerSettingsById(param).then(res => {
          this.successMsg('修改图层设置信息成功')
          if (this.selectedNode.hasOwnProperty('selected')) {
            this.changeLayerSelectable(this.selectedNode, param.selected) // 改变图层是否可选
          }
          this.updateLayerSettingsList() // 更新图层设置信息列表
          this.selectedNode = null // 清空选项
        }).catch(err => {
          console.log('修改图层设置信息失败：', err)
          this.errorMsg('修改图层设置信息失败')
        })
      } else { // 图层设置不存在，添加图层设置信息
        this.saveLayerSettings(param).then(res => {
          this.successMsg('添加图层设置信息成功')
          if (this.selectedNode.hasOwnProperty('selected')) {
            this.changeLayerSelectable(this.selectedNode, param.selected) // 改变图层是否可选
          }
          this.updateLayerSettingsList()
          this.selectedNode = null // 清空选项
        }).catch(err => {
          console.log('添加图层设置信息失败：', err)
          this.errorMsg('添加图层设置信息失败')
        })
      }
    },
    updateLayerSettingsList() { // 更新图层设置信息列表
      // 获取图层设置信息
      this.getLayerSettingsList().then(res => {
        console.log('获取到的图层设置信息：', res)
      }).catch(err => {
        console.log('获取到的图层设置信息失败：', err)
      })
    },
    changeLayerSelectable(settings, flag) { // 改变图层是否可选
      let scene = this.$context.viewer.scene
      let layer = scene.layers.find(settings.name) // 根据图层名称获取图层
      if (layer) { // 找到图层，修改图层的选中颜色
        layer.selectedColor = flag ? (settings.selectedColor ? this.$context.Cesium.Color.fromCssColorString(settings.selectedColor) : this.$context.Cesium.Color.FUCHSIA) : this.$context.Cesium.Color.WHITE
        if (!flag) { // 图层不可选时，取消之前的选中效果
          layer.setSelection('')
        }
      }
    }
  }
}
</script>

<style scoped>
.controller {
  width: 100%;
  height: 100%;
  position: relative;
}
.layer-tree {
  width: 100%;
  height: 35%;
  overflow-y: auto;
  overflow-x: hidden;
}
.controller > div .checkbox{
  position: absolute;
  right: 24px;
}
.controller > div .radio{
  position: absolute;
  right: 75px;
}
.controller > div .layer-name{
  width: 125px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  line-height: 12px;
}
.adjust-panel {
  padding: 16px 24px 0 24px;
  position: relative;
  height: 65%;
}
.adjust-panel .title {
  width: 100%;
  height: 38px;
  background: #0f2343;
  text-align: center;
}
.adjust-panel .title span {
  line-height: 38px;
  font-size: 14px;
}
.adjust-panel .adjust-item {
  margin-bottom: 5px;
}
.adjust-panel .panel-foot {
  bottom: 24px;
  position: absolute;
  width: calc(100% - 48px);
  height: 32px;
  line-height: 32px;
  text-align: center;
}
.adjust-panel .panel-foot button {
  margin: 0 8px;
  height: 32px;
}
</style>
