<!-- 飞行路线坐标编辑面板 -->
<template>
  <div>
    <Collapse value="coordinateList">
      <Panel name="batchOps">
        批量修改高度
        <div slot="content">
          <Row type="flex" justify="center" align="middle" class="row-item">
            <Col span="6">附加值</Col>
            <Col span="18"><InputNumber :max="500" :min="-500" :value="0" :precision="2" class="row-item-number" @on-change="batchAddDelta"></InputNumber></Col>
          </Row>
          <Row type="flex" justify="center" align="middle" class="row-item">
            <Col span="6">全置为</Col>
            <Col span="18"><InputNumber :max="500" :min="0" :value="0" :precision="2" class="row-item-number" @on-change="batchReset"></InputNumber></Col>
          </Row>
        </div>
      </Panel>
      <Panel name="coordinateList">
        坐标列表
        <div slot="content">
          <Collapse value="index_0">
            <Panel v-for="(item, index) in coordinates" :key="index" :name="'index_'+index">
              第{{ index + 1 }}点 <span class="icon-btn iconfont icon-delete" title="删除点" @click.stop="deletePoint(item, index)"></span>
                <div slot="content">
                  <Row type="flex" justify="center" align="middle" class="row-item">
                    <Col span="6">经度</Col>
                    <Col span="18"><InputNumber :max="180" :min="1" v-model="item[0]" :precision="6" class="row-item-number"></InputNumber></Col>
                  </Row>
                  <Row type="flex" justify="center" align="middle" class="row-item">
                    <Col span="6">纬度</Col>
                    <Col span="18"><InputNumber :max="90" :min="1" v-model="item[1]" :precision="6" class="row-item-number"></InputNumber></Col>
                  </Row>
                  <Row type="flex" justify="center" align="middle" class="row-item">
                    <Col span="6">高度</Col>
                    <Col span="18"><InputNumber :max="1000000" :min="0" v-model="item[2]" :precision="2" class="row-item-number"></InputNumber></Col>
                  </Row>
                </div>
            </Panel>
          </Collapse>
        </div>
      </Panel>
    </Collapse>
  </div>
</template>
<script>

export default {
  data() {
    return {
    }
  },
  props: {
    coordinates: {
      type: Array
    }
  },
  computed: {
  },
  methods: {
    deletePoint(item, index) {
      this.coordinates.splice(index, 1) // 删除点
    },
    batchAddDelta(num) { // 批量附加高度
      for (let coordinate of this.coordinates) {
        coordinate[2] += num
      }
      this.$forceUpdate()
      this.$emit('coordinatesChange', {coordinates: this.coordinates})
    },
    batchReset(num) { // 批量重置高度
      for (let coordinate of this.coordinates) {
        coordinate[2] = num
      }
      this.$forceUpdate()
      this.$emit('coordinatesChange', {coordinates: this.coordinates})
    }
  },
  mounted() {

  }
}
</script>
<style scoped>
.row-item {
  margin: 5px 0;
}
.row-item-number {
  width:100px;
}
.icon-btn{
  font-size: 12px;
  margin-right: 16px;
  float: right;
}
.icon-btn:hover {
  color: #20adff;
}
</style>
