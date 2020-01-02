<template>
  <div class="alarmTerminal" id="alarmTerminal">
    <div class="tab-content-alarm" style="text-align:center;width:100%;font-size:12px;height:100%;" ref="tableBox">
      <div class="feature-btn">
        <Button type="ghost" icon="plus" @click="openAddMod('添加终端')">添加</Button>
        <Button type="ghost" icon="edit" @click="openEditMod('修改终端')" :disabled="canUse">修改</Button>
        <Button type="ghost" icon="trash-a" @click="delAlarm" :disabled="canUse">删除</Button>
        <Input v-model="inSearchName" placeholder="按终端名称模糊查询" style="width: 250px;" class="rt" :maxlength="64">
        <Button slot="append" @click="search">搜索</Button>
        </Input>
      </div>
      <div class="table-relative flex-1" style="margin-top:12px;">
        <div class="table-body">
          <Table size="small" :height="tableHeight" :columns="boxTableTitle" :data="boxTableData" @on-selection-change="alarmInSel"></Table>
        </div>
      </div>
      <div class="table-footer">
        <Page class="rt" show-sizer show-elevator show-total :page-size-opts="$PageInfo.size" :total="pageObj.count" :page-size="pageObj.limit" :current="pageObj.cur" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
      </div>
    </div>
    <!--添加、修改弹框-->
    <div v-if="boxModelShow">
      <Modal v-model="boxModelShow" :title="centerTitle" width="500" :mask-closable="false">
        <Form label-position="left" :label-width="107" :model="boxData" ref="boxData" :rules="alarmRule" style="padding: 0 10px;">
          <Form-item label="终端名称" prop="name">
            <Input v-model="boxData.name" />
          </Form-item>
          <Form-item label="对讲IP地址" prop='ip' :rules="{required:true,trigger:'blur',validator: tertalkIpRule}">
            <Bsipv4 v-model="boxData.ip"></Bsipv4>
          </Form-item>
          <Form-item label="对讲ID号" prop='serise' :rules="{required:true,trigger:'blur',validator: tertalkIdRule}">
            <Input v-model="boxData.serise" :maxlength="8" />
          </Form-item>
          <Form-item label="联动主镜头">
            <p class="text-box">{{linkMain.label}}</p>
            <Select v-model="linkMain.label" style="width: 260px;" placeholder="">
              <TreeBox :searchToggle="false" :resourceToggle="true" :equipmentToggle="false" :equType="[0]" :orgType="0" :resType="[0]" :iconToggle="false" @clickData="handleLinkMain"></TreeBox>
            </Select>
            <Checkbox v-model="boxData.record">录像</Checkbox>
          </Form-item>
          <Form-item label="联动副镜头">
            <p class="text-box">{{linkVice1.label}}</p>
            <Select style="width: 260px;" placeholder="">
              <TreeBox :searchToggle="false" :resourceToggle="true" :equipmentToggle="false" :equType="[0]" :orgType="0" :resType="[0]" :iconToggle="false" @clickData="handleLinkVice1"></TreeBox>
            </Select>
          </Form-item>
          <Form-item label="联动副镜头">
            <p class="text-box">{{linkVice2.label}}</p>
            <Select style="width: 260px;" placeholder="">
              <TreeBox :searchToggle="false" :resourceToggle="true" :equipmentToggle="false" :equType="[0]" :orgType="0" :resType="[0]" :iconToggle="false" @clickData="handleLinkVice2"></TreeBox>
            </Select>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="ghost" @click="editCancel('boxData')">取消</Button>
          <Button type="primary" :loading="tableModelLoad" @click="editOk('boxData')">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import allPage from './allPage.js'
import talkTerm from './talkTerm.js'
import Bsipv4 from 'components/BSIPV4.vue'
import TreeBox from 'components/BStreeNew/BStreeNewBox'
export default {
  name: 'alarmBox',
  components: {
    TreeBox,
    Bsipv4
  },
  data() {
    return {
      tableHeight: 500,
      linkMain: {label: '', id: ''}, // 联动主镜头
      linkVice1: {label: '', id: ''}, // 联动副镜头1
      linkVice2: {label: '', id: ''} // 联动副镜头2
    }
  },
  mixins: [talkTerm, allPage],
  methods: {
    ...mapActions([
      'getTalkTerminal',
      'addTalkTerminal',
      'editTalkTerminal',
      'deleteTalkTerminal'
    ]),
    tertalkIpRule(rule, value, callback) {
      if (this.boxData.ip === '') {
        return callback(new Error('不能为空'))
      } else {
        return callback()
      }
    },
    tertalkIdRule(rule, value, callback) {
      if (this.boxData.serise !== '') {
        let r = /^[0-9]+$/
        if (r.test(this.boxData.serise)) {
          callback()
        } else {
          return callback(new Error('请输入有效数字'))
        }
      } else {
        return callback(new Error('不能为空'))
      }
    }
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 90
  },
  created() {}
}
</script>

<style scoped>
.alarmTerminal {
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
}

.lf {
  float: left;
}

.rt {
  float: right;
}

.sidebar {
  width: 100%;
  height: auto;
}

.sidebar > a {
  display: block;
  text-align: center;
  font-size: 14px;
  color: #fff;
  background-color: #0f2243;
  height: 40px;
  line-height: 40px;
  margin-bottom: 10px;
  width: 300px;
}

.config-list li {
  position: relative;
  cursor: pointer;
  /*transition: all .2 ease-in-out;*/
  height: 48px;
  line-height: 48px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  border-right: 2px solid transparent;
  background: #1c3053;
  border-top: 1px solid #263e69;
  border-bottom: 1px solid #263e69;
  box-shadow: 0px -1px 2px #142441 inset;
  padding: 0 0 0 40px;
}

.config-list li:hover {
  background: #2b426b;
  color: #ffffff;
}

.sidebar > .config-list > .active {
  color: #4699f9;
  border-right: 2px solid #4699f9;
  background-color: #2f497a;
  z-index: 2;
}

.tab-content-alarm {
  /* width: 100%;
  padding: 0px;
  background: #1c3053; */
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1c3053;
  height: 100%;
}

.feature-btn {
  margin: 0 24px;
  height: 32px;
  line-height: 32px;
}

.feature-btn > button {
  margin-right: 8px;
  float: left;
  width: 100px;
  height: 32px;
}

.ivu-table-column-center .ivu-btn span {
  color: #57a3f3;
  font-size: 14px;
}

.page-style {
  width: 100%;
  border-top: none;
  overflow: hidden;
  padding: 5px 12px;
  background: #244575;
  font-size: 12px;
}

.table-relative {
  position: relative;
  /* height: 650px; */
  margin: 0px;
  width: 100%;
}

.table-body {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.model-table {
  width: 100%;
  overflow: inherit;
  border: 1px solid #5d5d5d;
}
.model-tree {
  width: 100%;
  height: 400px;
}
.confirm {
  position: relative;
  height: 50px;
}

.confirm-time {
  width: 200px;
  margin-left: 20px;
}
.text-box {
  position: absolute;
  left: 1px;
  font-size: 12px;
  top: 1px;
  height: 32px;
  max-width: 200px;
  padding-left: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 32px;
  z-index: 9;
}
</style>
