<!--编辑模式 中心点的编辑框页面-->
<template>
  <div class="centerHome">
    <div class="centerHomeTittle">
      <div class="centerHomeContent">
        <p>中心点</p>
      </div>
      <div class="centerHomeCon iconfont">
        <p>
          <i class="icon-refresh"></i>重置</p>
        <p>
          <i class="icon-delete"></i>删除</p>
      </div>
    </div>
    <div class="centerPointContent">
      <div>
        <Form ref="pointData" :model="centerPointData" :label-width="70" label-position="left">
          <Form-item label="坐标点">
            <Input v-model="centerPointData.point" placeholder="坐标点" disabled />
          </Form-item>
          <Form-item label="地图范围">
            <Input v-model="centerPointData.range" placeholder="地图范围" disabled/>
          </Form-item>
        </Form>
      </div>
    </div>
    <div class="centerPointFooter">
      <Button type="ghost" @click="poinrCenterCannel" style="margin-left: 8px">取消</Button>
      <Button type="primary" @click="poinrCenterSave" style="margin-left: 8px">保存</Button>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      centerPointData: {
        point: '',
        range: ''
      }
    }
  },
  methods: {
    poinrCenterCannel() {
      // console.log('取消')
    },
    poinrCenterSave() {
      // console.log('保存')
    }
  }
}
</script>
<style scoped>
.centerHome .ivu-form-item {
  margin-bottom: 10px;
}
.centerHome .centerHomeTittle {
  height: 40px;
  width: 100%;
  line-height: 40px;
  clear: both;
  background-color: #0f2343;
  font-size: 14px;
}
.centerHome .centerHomeTittle .centerHomeContent {
  float: left;
  margin-left: 20px;
}
.centerHome .centerHomeTittle .centerHomeCon {
  float: right;
  margin-right: 20px;
}
.centerHome .centerHomeTittle .centerHomeCon p {
  display: inline;
  margin: 0px 10px;
}
.centerHome .centerHomeTittle .centerHomeCon p i {
  display: inline;
  margin-right: 5px;
  font-style: normal;
}
.centerHome .centerPointContent {
  padding: 10px 20px;
}
.centerHome .centerPointContent .pointTittle {
  height: 40px;
  line-height: 40px;
}
.centerPointFooter {
  height: 40px;
  width: 100%;
  line-height: 40px;
  clear: both;
  background-color: #0f2343;
  text-align: center;
}
.linkMan {
  text-align: center;
}
</style>
