<!--编辑模式 联系人的基础组件 页面-->
<template>
  <div>
    <div v-for="(item, index) in principal" :key="index">
      <Row class="linkManMain">
        <Col span="20">
        <Form-item label='负责人'>
          <Input :maxlength='16' v-model="item.name" placeholder="请输入负责人" />
        </Form-item>
        <Form-item label='电话'>
          <Input :maxlength='18' v-model="item.mobile" placeholder="请输入负责人电话" />
        </Form-item>
        </Col>
        <Col span="4" class="linkManCol">
        <div class="linkManPos">
          <div class="linkMan icon iconfont icon-add linkManAdd" v-if="principal.length <= 2" @click="addLinkman" title="增加联系人"></div>
          <div class="linkMan icon iconfont icon-reduce linkManReduce" v-if="principal.length > 1" @click="removeLinkman(index)" title="移除联系人"></div>
        </div>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    principal: {
      type: Array,
      default: function() {
        return [
          {
            name: '',
            mobile: ''
          }
        ]
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    // 添加联系人
    addLinkman() {
      this.principal.push({
        name: '',
        mobile: ''
      })
    },
    // 移除联系人
    removeLinkman(index) {
      this.principal.splice(index, 1)
    }
  },
  mounted() {
    if (this.principal.length === 0) {
      this.principal.push({
        name: '',
        mobile: ''
      })
    }
  }
}
</script>
<style scoped>
.linkManMain {
  display: flex;
}
.linkManMain .ivu-form-item {
  margin-bottom: 10px;
}
.linkManMain .linkManPos {
  clear: both;
  margin-top: 28px;
}
.linkManMain .linkMan {
  text-align: center;
  font-size: 12px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  border-radius: 50%;
  cursor: pointer;
}
.linkManMain .linkManAdd {
  background-color: #01ba01;
  float: left;
}
.linkManMain .linkManReduce {
  background-color: red;
  float: right;
}
</style>
