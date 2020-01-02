<template>
  <div class="bs-main paramsSetting">
    <div class="set-flex">
      <div class="rank">
        <!--级别配置-->
        <div class="rank-config">
          <div class="panel">级别管理</div>
          <div class="table-relative" style="height: 391px;">
            <div class="table-body">
              <Table class="jibie-table" :columns="rankTitle" :data="levelDataList" size="small" height="391"></Table>
            </div>
          </div>
          <div class="page-style">
            <Page class="rt" :total="rankPageTotal" :page-size="pageLimitJB" :current="rankPageCur" @on-change="rankPageChange" show-elevator show-total></Page>
          </div>
          <!--修改级别配置-->
          <Modal class="level-modal" v-model="editRankMod" title="修改级别配置" :mask-closable="false">
            <Form :model="rankEditForm" ref="rankEditForm" label-position="left" :label-width="90" :rules="ruleValidate"  style="padding: 0 10px;height: 600px;">
              <Form-item label="级别名称">
                <Input v-model="rankEditForm.level" disabled/>
              </Form-item>
              <Form-item label="消息颜色" prop="msgColour">
                <!-- <Select v-model="rankEditForm.msgColour">
                  <Option v-for="item in colorList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select> -->
                <div class="color-slip" :style="{'background': rankEditForm.msgColour}"></div>
                <Select v-model="rankEditForm.msgColour">
                  <Sketch :value="colors" @input="backgroundCheck"></Sketch>
                </Select>
              </Form-item>
              <Form-item label="通知方式" prop="msgVoice">
                <Select v-model="rankEditForm.msgVoice" @on-change="msgVoiceChoose">
                  <Option value="0">语音(TTS语音)</Option>
                  <Option value="1">警笛</Option>
                  <Option value="2">语音+警笛</Option>
                  <Option value="3">无</Option>
                </Select>
              </Form-item>
              <Form-item label="警笛文件" prop="policeWhistleNameID">
                <Select v-model="rankEditForm.policeWhistleNameID" :disabled="canSelect">
                  <Option v-for="item in policeData" :value="item._id" :key="item.value">{{ item.name }}</Option>
                </Select>
              </Form-item>
              <Form-item label="播放次数(次)" prop="playTime">
                <Input v-model="rankEditForm.playTime" :disabled="playTimeStatus"/>
              </Form-item>
              <!-- <Form-item label="图标闪烁(s)" prop="mapIcoGlitterTime">
                <Input v-model="rankEditForm.mapIcoGlitterTime" />
              </Form-item>
              <Form-item label="显示时间(s)" prop="intelligentMsgGlitterTime">
                <Input v-model="rankEditForm.intelligentMsgGlitterTime" />
              </Form-item> -->
            </Form>
            <div slot="footer">
              <Button type="ghost" @click="cancel">取消</Button>
              <Button type="primary" @click="rankOk('rankEditForm')">确定</Button>
            </div>
          </Modal>
        </div>
        <!--警情处理-->
        <div class="alarm-deal">
          <div class="panel">
            <p class="panel-title">警情处理</p>
            <Button class="jdbutton" type="ghost" v-if="$BShasPower('BS-ALARM-SETTING-ACTION')" @click="addAlarmDeal" icon="plus">添加</Button>
          </div>
          <div class="table-relative" style="height: 391px;">
            <div class="table-body">
              <Table class="file-table" :columns="alarmDealTitle" :data="alarmDealData" size="small" height="391"></Table>
            </div>
          </div>
          <div class="page-style">
            <Page class="rt" transfer show-sizer :page-size-opts="$PageInfo.size" show-total show-elevator :total="alarmDealTotal" :page-size="alarmDealLimit" :current="alarmDealPageCur" @on-change="alarmDealPageChange" @on-page-size-change="alarmDealPageSizeChange"></Page>
          </div>
          <!--添加\修改-->
          <Modal v-model="alarmDealMod" :title="alarmDealModTitle" :mask-closable="false">
            <Form :model="alarmDealModForm" ref="alarmDealModForm" label-position="left" :label-width="80" :rules="ruleName"  style="padding: 0 10px;">
              <Form-item label="名称" prop="name">
                <Input type="text" v-model="alarmDealModForm.name" />
              </Form-item>
            </Form>
            <div slot="footer">
              <Button type="ghost" @click="alarmDealCancel('alarmDealModForm')">取消</Button>
              <Button type="primary" @click="alarmDealOk('alarmDealModForm')">确定</Button>
            </div>
          </Modal>
        </div>
      </div>
      <div class="rankAndPlan">
        <!--警笛文件管理-->
        <div class="file-manage">
          <div class="panel">警笛文件管理
            <Button class="jdbutton" type="ghost" v-if="$BShasPower('BS-ALARM-SETTING-ACTION')" @click="addFile" icon="plus">添加</Button>
          </div>
          <div class="table-relative" style="height: 400px;">
            <div class="table-body">
              <Table class="file-table" :columns="policeTitle" :data="policeData" size="small" height="400"></Table>
            </div>
          </div>
          <div class="page-style">
            <Page class="rt" transfer show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="audioPageSizeChange" :show-total="true" :show-elevator="true" :total="audioTotal" :page-size="audiopageLimit" :current="plicePageCur" @on-change="voicePageChange"></Page>
          </div>
          <!--添加-->
          <Modal v-model="addFileMod" title="增加警笛管理" :mask-closable="false">
            <Form :model="addFileData" ref="addFileData" label-position="left" :label-width="80" :rules="ruleValidate" class="audioForm" style="padding: 0 10px;">
              <Form-item label="名称" prop="name">
                <Input type="text" v-model="addFileData.name" />
              </Form-item>
              <Form-item label="选择文件" prop="audioId">
                <Select type="text" style="width:250px" v-model="addFileData.audioId" @on-change="chooseFile">
                  <Option v-for="item in voiceData" :value="item._id" :key="item._id">{{ item.filename }}</Option>
                </Select>
                <Upload class="upload-img" action="/api/upload?type=sys&tag=audio" :headers="headerObj" :format="['mp3']" :max-size="4096" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :show-upload-list="false" :on-success="upSuc" :on-error="upErr">
                  <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                </Upload>
              </Form-item>
            </Form>
            <div slot="footer">
              <Button type="ghost" @click="cancel">取消</Button>
              <Button type="primary" @click="addFileOK('addFileData')">确定</Button>
            </div>
          </Modal>
          <!--试听-->
          <div v-if="testMod">
            <Modal v-model="testMod" :closable="true" title="试听" :mask-closable="false" @on-cancel="cancelTest">
              <div style="padding: 0 10px;">
                <p class="audio-info">{{audioInfo.audioName}}, 时长: {{audioInfo.audioTime}}s</p>
                <audio id="sound" ref="sound" :src="videoUrl" controls="controls" @loadedmetadata="loadMusic">
                  Your browser does not support the audio element.
                </audio>
              </div>
              <div slot="footer">
                <Button type="ghost" @click="cancelTest">取消</Button>
              </div>
            </Modal>
          </div>
          <!--浏览-->
          <div v-if="skimMod">
            <Modal v-model="skimMod" title="浏览" :mask-closable="false">
              <Form label-position="left" :label-width="80" class="audioForm"  style="padding: 0 10px;">
                <Form-item label="选择文件">
                  <Select type="text" style="width:250px" v-model="changeVoice" @on-change="chooseFile">
                    <Option v-for="item in voiceData" :value="item._id" :key="item._id">{{ item.filename }}</Option>
                  </Select>
                  <Upload class="upload-img" action="/api/upload?type=sys&tag=audio" :format="['mp3']" :max-size="4096" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :show-upload-list="false" :on-success="upSuc" :on-error="upErr">
                    <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                  </Upload>
                </Form-item>
              </Form>
              <div slot="footer">
                <Button type="ghost" @click="cancel">取消</Button>
                <Button type="primary" @click="changeOk">确定</Button>
              </div>
            </Modal>
          </div>
        </div>
        <!--警情类型-->
        <div class="plan-manage">
          <div class="panel">警情类型
            <Button class="jdbutton" type="ghost" v-if="$BShasPower('BS-ALARM-SETTING-ACTION')" @click="addPlan" icon="plus">添加</Button>
          </div>
          <div class="table-relative" style="height: 400px;">
            <div class="table-body">
              <Table class="file-table" :columns="planTitle" :data="PlanData" size="small" height="400"></Table>
            </div>
          </div>
          <div class="page-style">
            <Page class="rt" transfer show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="planPageSizeChange" :show-total="true" :show-elevator="true" :total="planTotal" :page-size="planpageLimit" :current="planPageCur" @on-change="planPageChange"></Page>
          </div>
          <!--添加\修改-->
          <Modal v-model="addPlanMod" :title="planModTitle" :mask-closable="false">
            <Form :model="planForm" ref="planForm" label-position="left" :label-width="80" :rules="ruleValidates"  style="padding: 0 10px;">
              <Form-item label="名称" prop="name">
                <Input type="text" v-model="planForm.name" />
              </Form-item>
              <Form-item label="警情信息" prop="content">
                <Input v-model="planForm.content" type="textarea" :autosize="{minRows: 2,maxRows: 3}" placeholder="请输入警情信息内容..." />
              </Form-item>
            </Form>
            <div slot="footer">
              <Button type="ghost" @click="PlanCancel('planForm')">取消</Button>
              <Button type="primary" @click="addPlanOk('planForm')">确定</Button>
            </div>
          </Modal>
        </div>
      </div>
      <div class="system">
        <div class="panel">报警延时设置
          <Button class="jdbutton" type="ghost" icon="plus" @click="editAlarmDelay">保存</Button>
        </div>
        <div class="delay-main">
          <span>报警延时：</span>
          <Input type="text" v-model="alarmDelay" style="width: 200px;"></Input> 秒
          <span class="tips">系统参数，慎点！</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import '../equipment/devicesRes.css'
import './alarmStyle.css'
import paramsSetting from './allJs/paramsSetting'
import { Sketch } from 'vue-color'
export default {
  name: 'paramsSetting',
  components: {
    Sketch
  },
  data() {
    return {
      alarmDelay: null,
      colors: '#fff',
      msgColor: '#fff'
    }
  },
  computed: {
    ...mapGetters(['accessToken', 'tipWarningConfig', 'tipErrorConfig']),
    ...mapState({
      levelData: ({ paramsSetting }) => paramsSetting.levelData,
      policeOrigData: ({ paramsSetting }) => paramsSetting.policeData,
      PlanOrigData: ({ paramsSetting }) => paramsSetting.PrearrangedData,
      voiceData: ({ paramsSetting }) => paramsSetting.voiceData,
      planPageNum: ({ paramsSetting }) => paramsSetting.planPageNum,
      policePageNum: ({ paramsSetting }) => paramsSetting.policePageNum,
      isAlarmEnable: ({ paramsSetting }) => paramsSetting.isAlarmEnable,
      alarmDealList: ({ paramsSetting }) => paramsSetting.alarmDealList,
      alarmDealStatus: ({ paramsSetting }) => paramsSetting.alarmDealStatus
    })
    // levelData() {
    //   if (this.levelOrigData.length) {
    //     this.rankPageNum = this.levelOrigData.length
    //     if (this.rankPageNum === 9 && this.rankStartNum !== 0) {
    //       this.rankStartNum = this.rankStartNum - 9
    //       this.rankEndNum = this.rankEndNum - 9
    //     }
    //     var rankPageData = this.levelOrigData.slice(this.rankStartNum, this.rankEndNum)
    //     var dealRank = this.dealRank(JSON.parse(JSON.stringify(rankPageData)))
    //     return dealRank
    //   }
    // }
  },
  mixins: [paramsSetting],
  methods: {
    ...mapActions([
      'getAlarmLevel',
      'editAlarmLevel',
      'getPrearranged',
      'addPrearranged',
      'delPrearranged',
      'editPrearranged',
      'getPoliceFile',
      'addPoliceFile',
      'delPoliceFile',
      'editPoliceFile',
      'getVoiceData',
      'httpRenZheng',
      'getAlarmDealSetList',
      'addAlarmDealSet',
      'reviseAlarmDealSet',
      'deleteAlarmDealSet',
      'getAlarmDealStatusSet',
      'reviseAlarmDealStatusSet',
      'getAlarmDelayData',
      'setAlarmDelayData'
    ])
  },
  // beforeDestroy() {
  //   this.$refs['sound'].removeEventListener('loadedmetadata', this.loadMusic)
  //   this.loadMusic = null
  // },
  created() {
    this.headerObj.Authorization = `Bearer ${this.accessToken}`
    this.getAllData()
  }
}
</script>
<style scoped>
.bs-main {
  display: flex;
  flex: 1;
  font-size: 12px;
  width: 100%;
  /*min-height: 900px;*/
  height: 100%;
  overflow: hidden;
}

.lf {
  float: left;
}

.rt {
  float: right;
}

.set-flex {
  flex: 1;
  display: block;
  min-height: 670px;
  background: #0c1b32;
}

.panel {
  width: 100%;
  height: 44px;
  line-height: 44px;
  font-size: 14px;
  background-color: #1c3053;
  text-align: left;
  padding: 0 0 0 20px;
}
.panel-title {
  float: left;
}
.ivu-table-column-center .ivu-btn span {
  color: #57a3f3;
  font-size: 14px;
}
.rank {
  width: 100%;
  display: block;
  padding: 0;
}
.rank-config {
  float: left;
  background-color: #0c1b32;
  width: 50%;
  height: 100%;
}
.system {
  float: left;
  background-color: #1c3053;
  width: 100%;
  height: 100%;
}
.delay-main {
  width: 50%;
  text-align: left;
  padding-left: 20px;
  background: #1b3153;
}
.tips {
  color: red;
  margin-left: 50px;
  font-size: 14px;
}
.alarm-deal {
  float: right;
  width: 49.5%;
  height: 100%;
  margin: 0;
}
.rankAndPlan {
  width: 100%;
  display: block;
  padding: 0;
  margin-top: 16px;
}

.file-manage {
  float: left;
  width: 50%;
  height: 100%;
}
.plan-manage {
  float: right;
  width: 49.5%;
  height: 100%;
  margin: 0;
}
.edit-btn {
  color: #57a3f3;
  cursor: pointer;
}

.file-info {
  background: #1c3054;
}

.file-info > button {
  width: 90px;
  margin-top: 18px;
  margin-left: 14px;
}

.upload-img {
  display: inline-block;
  margin-left: 15px;
}

.audio-info {
  font-size: 12px;
  margin-bottom: 10px;
}

.jdbutton {
  margin-left: 80px;
}

#sound {
  width: 70%;
}

.page-style {
  width: 100%;
  border-top: none;
  overflow: hidden;
  padding: 5px 12px 5px 0;
  background: #244575;
}

.table-relative {
  position: relative;
  margin: 0px;
  width: 100%;
}

.table-body {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

table {
  border-collapse: collapse;
}

.ivu-table tbody tr:hover td {
  background-color: #0a111c;
}
.vue-color__sketch {
  width: inherit;
}
.color-slip {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 340px;
  height: 30px;
  background: #fff;
  border-radius: 4px;
  z-index: 1;
}
</style>
<style>
.level-modal .ivu-select-dropdown-list {
  height: 406px !important;
}
.level-modal .ivu-select-dropdown {
  max-height: 420px !important;
}
</style>
