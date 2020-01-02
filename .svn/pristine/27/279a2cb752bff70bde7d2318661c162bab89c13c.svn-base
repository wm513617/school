<!--编辑模式 报警点位右边编辑页面-->
<template>
  <div class="alarmHome">
    <div class="alarmPointHeader">
      <div class="alarmPointTittle">
        <p>报警点位</p>
      </div>
      <div class="iconfont alarmPoinCon">
        <div @click="delPoint" class="icon-delete" title="删除"></div>
      </div>
    </div>
    <div class="alarmPointContent">
      <div class="alarmContentHeader">
        <p class="pointTittle" v-if="oneMapAlarmData.mapsign.signtype !== 0" :class="{'active': menuTag}" @click="nenuCtrolClick">样式控制</p>
        <p class="pointTittle" :class="{'active': !menuTag}" @click="nenuInfoClick">基本信息</p>
      </div>
      <div v-if="!menuTag" class="alarmMain">
        <bs-scroll ref="scroller">
          <div class="alarmMainHome">
            <Form ref="alarmPointData" :model="alarmPointData" :rules="ruleValidate" :label-width="80" label-position="left">
              <Form-item label="点位名称" prop="name">
                <Input :maxlength="64" v-model="alarmPointData.name" placeholder="请输入点位名称" />
              </Form-item>
              <Form-item label="编号" prop="chan">
                <Input :maxlength="16" v-model="alarmPointData.chan" placeholder="请输入编号" />
              </Form-item>
              <Form-item label="级别">
                <Input :maxlength='16' v-model="alarmPointData.level" disabled />
              </Form-item>
              <Form-item label="布撤防时间">
                <Input :maxlength='16' v-model="alarmPointData.withdrawTime" disabled />
              </Form-item>
              <Form-item label="最大延时">
                <Input :maxlength='16' v-model="alarmPointData.maxdelaytime" disabled />
              </Form-item>
              <Form-item label="最小间隔">
                <Input :maxlength='16' v-model="alarmPointData.minintervaltime" disabled />
              </Form-item>
              <Form-item label="地图标识">
                <Input :maxlength='16' v-model="alarmPointData.mapsign" disabled />
              </Form-item>
              <Form-item label="负责单位" prop="charge">
                <Input :maxlength='32' v-model="alarmPointData.charge" placeholder="请输入负责单位" />
              </Form-item>
              <!-- 联系方式 -->
              <contentWay :principal.sync="alarmPointData.principal"></contentWay>
              <Form-item label="简介" prop="desc">
                <Input :maxlength='150' v-model="alarmPointData.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入简介" />
              </Form-item>
            </Form>
          </div>
        </bs-scroll>
      </div>
      <div v-if="menuTag" class="alarmMain alarmMainHome">
        <styleCtrol :StyleDefeat.sync="alarmPointData.style" :isLineCantShow="isLineCantShow" :isAreaCantShow="isAreaCantShow"></styleCtrol>
      </div>
    </div>
    <div v-if="!menuTag" class="alarmPointFooter">
      <Button type="ghost" @click="mapPointCannel('alarmPointData')" style="margin-right: -3px">取消</Button>
      <Button type="primary" @click="mapPointSave('alarmPointData')" style="margin-left: 16px">保存</Button>
    </div>
  </div>
</template>
<script>
import styleCtrol from '../styleCtrol'
import contentWay from '../contentWay'
import editAlarmIpc from '../../../../assets/map/edit/editAlarmIpc'
import { telNumCheck, telNameCheck } from '../../formCheck'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  components: {
    contentWay,
    styleCtrol
  },
  data() {
    // 报警负责单位长度校验
    const alarmCharge = (rule, value, callback) => {
      if (value) {
        if (value.length > 0) {
          let strlength = value.replace(/[\u0391-\uFFE5]/g, 'aa').length
          if (strlength > 32) {
            return callback(new Error('负责单位长度超过32个字符'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    // 报警简介
    const alarmDesc = (rule, value, callback) => {
      if (value) {
        if (value.length > 0) {
          let strlength = value.replace(/[\u0391-\uFFE5]/g, 'aa').length
          if (strlength > 150) {
            return callback(new Error('简介超过150个字符'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      alarmPointData: {},
      menuTag: true,
      ruleValidate: {
        name: [{ required: true, message: '报警点位名称不能为空', trigger: 'change' }],
        chan: [{ required: true, message: '报警点位编号不能为空', trigger: 'change' }],
        charge: [{ required: false, validator: alarmCharge, trigger: 'change' }],
        desc: [{ required: false, validator: alarmDesc, trigger: 'change' }]
      },
      // 地图标识是线或面，不现实字体相关设置
      isLineCantShow: true,
      isAreaCantShow: true
    }
  },
  watch: {
    oneMapAlarmData(val) {
      this.toAlarmInit(val)
    }
  },
  created() {},
  mounted() {
    this.toAlarmInit(this.oneMapAlarmData)
  },
  computed: {
    ...mapState({
      editAlarmList: ({ mapAlarmData }) => mapAlarmData.editAlarmList, // 报警列表
      areaStyleCss: ({ mapAreaData }) => mapAreaData.areaStyle,
      editCurrentAlarm: ({ mapAlarmData }) => mapAlarmData.editCurrentAlarm,
      oneMapAlarmData: ({ mapAlarmData }) => mapAlarmData.oneMapAlarmData, // 报警资源
      isOuter: ({ mapAreaData }) => mapAreaData.isOuter, // 楼层内还是楼层外
      levelData: ({ mapGisData }) => mapGisData.levelData
    })
  },
  methods: {
    ...mapActions(['setOnePoint', 'getAlarmOrg', 'delOnePoint', 'setOneAlarm', 'delOneAlarm']),
    ...mapMutations([
      'SET_EDITALARM_LIST',
      'SET_EDITCURRENT_ALARM',
      'SET_MODIFYACTIVE_STATE',
      'SET_EDITRIGHTPAGE_STATE',
      'SET_EDITALARMINMAP_LIST'
    ]),
    toAlarmInit(val) {
      let data = JSON.parse(JSON.stringify(val))
      let point = data.point
      // if (data.mapsign.signtype === 0) {
      this.menuTag = false
      // }
      this.alarmPointData = {
        name: data.name.toString(),
        chan: data.chan.toString(),
        mapsign: this.toMapSign(data.mapsign.signtype),
        withdrawTime: this.toWithdrawTime(data.alarmtemplate),
        principal: point.principal,
        charge: point.charge,
        desc: point.desc,
        loc: point.loc,
        mapId: point.mapId,
        style: point.style,
        sid: point.sid,
        level: data.level,
        maxdelaytime: data.maxdelaytime,
        minintervaltime: data.minintervaltime
      }
    },
    toMapSign(val) {
      let sign = val.toString()
      if (sign === '0') {
        this.isLineCantShow = true
        this.isAreaCantShow = true
        return '图标'
      } else if (sign === '1') {
        this.isLineCantShow = false
        this.isAreaCantShow = false
        return '线'
      } else if (sign === '2') {
        this.isLineCantShow = false
        this.isAreaCantShow = true
        return '区域'
      }
    },
    toWithdrawTime(val) {
      if (val) {
        return val.name
      } else {
        return '无'
      }
    },
    // 取消
    mapPointCannel(name) {
      this.$refs[name].resetFields()
      this.saveAlarmIpc()
      this.closeEditVePoCon()
    },
    saveAlarmIpc() {
      let id = this.editCurrentAlarm && this.editCurrentAlarm.attributes.id
      let alarms = editAlarmIpc.saveAlarm(this.editAlarmList, id, this.alarmPointData.style)
      this.$store.commit('SET_EDITALARM_LIST', alarms)
      this.$store.commit('SET_EDITALARMINMAP_LIST', alarms)
    },
    // 保存
    mapPointSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.alarmPointData.principal) {
            let nameRepeat = false
            nameRepeat = telNameCheck(this.alarmPointData.principal)
            if (nameRepeat) {
              this.errorMsg('负责人输入有误或重复')
            } else {
              let flag = false
              flag = telNumCheck(this.alarmPointData.principal)
              if (flag) {
                this.errorMsg('联系方式输入有误，仅支持数字和(-)')
              } else {
                this.saveAlarm()
              }
            }
          }
        }
      })
    },
    saveAlarm() {
      let parm = JSON.parse(JSON.stringify(this.oneMapAlarmData))
      parm.name = this.alarmPointData.name
      parm.chan = this.alarmPointData.chan
      parm.point.principal = this.alarmPointData.principal
      parm.point.charge = this.alarmPointData.charge
      parm.point.desc = this.alarmPointData.desc
      parm.point.style = this.areaStyleCss
      if (this.oneMapAlarmData.mapsign.signtype === 0) {
        delete parm.point.style
      }
      this.setOneAlarm({ _id: parm._id, body: parm })
        .then(res => {
          this.saveAlarmIpc()
          this.closeEditVePoCon()
          this.getMapAlarmTree()
          this.successMsg('信息保存成功')
        })
        .catch(err => {
          console.log(err)
          this.errorMsg('信息保存失败')
        })
    },
    // 删除
    delPoint() {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除所选报警点位吗？</p>',
        onOk: () => {
          this.delOneAlarm(this.oneMapAlarmData._id)
            .then(res => {
              let id = this.editCurrentAlarm && this.editCurrentAlarm.attributes.id
              let alarms = editAlarmIpc.deleteAlarm({
                alarmList: this.editAlarmList,
                id
              })
              this.$store.commit('SET_EDITALARM_LIST', alarms)
              this.$store.commit('SET_EDITALARMINMAP_LIST', alarms)
              this.closeEditVePoCon()
              this.successMsg('报警点位删除成功')
              this.getMapAlarmTree()
              // 获取地图点位资源
              this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'gridEditPage', detail: 'show' })
            })
            .catch(err => {
              console.log(err)
              this.errorMsg('报警点位删除失败')
            })
        },
        onCancel: () => {}
      })
    },
    getMapAlarmTree() {
      if (this.isOuter) {
        this.getAlarmOrg()
          .then(res => {})
          .catch(err => {
            console.log(err)
          })
      } else {
        this.getAlarmOrg(this.levelData._id)
          .then(res => {})
          .catch(err => {
            console.log(err)
          })
      }
    },
    // 关闭视频点位编辑位置的控件
    closeEditVePoCon() {
      this.$store.commit('SET_EDITCURRENT_ALARM', null)
      this.$store.commit('SET_MODIFYACTIVE_STATE', false) // 关闭编辑视频点位的控件
      if (this.isOuter) {
        this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'gridEditPage', detail: 'show' }) // 隐藏点位编辑弹框，显示网格列表
      } else {
        this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'floorEditPage', detail: 'show' }) // 隐藏点位编辑弹框，显示楼宇编辑页面
      }
    },
    nenuInfoClick() {
      this.menuTag = false
    },
    nenuCtrolClick() {
      this.menuTag = true
    }
  }
}
</script>
<style scoped>
.alarmHome,
.alarmHome .alarmPointContent,
.alarmHome .alarmPointContent .alarmMain,
.alarmHome .alarmPointContent .alarmMain .alarmMainHomeMain {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.alarmHome .alarmPointHeader {
  height: 40px;
  width: 100%;
  line-height: 40px;
  clear: both;
  background-color: #0f2343;
}
.alarmHome .alarmPointHeader .alarmPointTittle {
  float: left;
  margin-left: 20px;
}
.alarmHome .alarmPointHeader .alarmPoinCon {
  float: right;
  margin-right: 20px;
  cursor: pointer;
}
.alarmHome .alarmPointHeader .alarmPoinCon:hover {
  color: #20adff;
}
.alarmHome .alarmPointContent .alarmMainHome {
  padding: 0px 20px;
}
.alarmHome .alarmPointContent .alarmContentHeader {
  width: 100%;
  height: 50px;
}
.alarmHome .alarmPointContent .alarmContentHeader .pointTittle {
  height: 40px;
  line-height: 40px;
  display: inline-block;
  margin: 0 10px;
  padding: 0 10px;
  margin-bottom: 10px;
  cursor: pointer;
}
.alarmHome .alarmPointContent .alarmContentHeader .active {
  border-bottom: 1px solid #4996f9;
}
.alarmPointFooter {
  height: 40px;
  width: 100%;
  line-height: 40px;
  clear: both;
  text-align: center;
}
.linkMan {
  text-align: center;
}
</style>
