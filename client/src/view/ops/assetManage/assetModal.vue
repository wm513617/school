<template>
  <div class="BSassetModal">
    <div class="asset-modal" v-show="assetStatus">
      <Modal v-model="assetStatus" :mask-closable="false" :closable="false" width="850">
        <div slot="header">
          <span class="lf title-style">{{ assetTitle }}</span>
          <a class="modal-close" @click="assetClose">
            <Icon type="ios-close-empty" size="31"></Icon>
          </a>
        </div>
        <div style="width: 100%; height: 100%;">
          <Tabs :animated="false" type="card" @on-click="tabChange" :value="paneName">
            <TabPane v-for="tab in tabsList" :key="tab.name" :label="tab.label" :name="tab.name"></TabPane>
          </Tabs>
          <div v-show="paneName === 'basic'">
            <Form ref="formCustom" :rules="ruleCustom" :model="assetForm" label-position="right" :label-width="100">
              <FormItem label="设备名称：" class="form-style">
                <Input v-show="edit" v-model="listDetails.name" disabled></Input>
                <span v-show="!edit">{{listDetails.name}}</span>
              </FormItem>
              <FormItem label="设备类型：" class="form-style">
                <Input v-show="edit" v-model="Allnumtype" disabled></Input>
                <span v-show="!edit">{{Allnumtype}}</span>
              </FormItem>
              <FormItem label="所属机构：" class="form-style">
                <Input v-show="edit" v-model="organization" disabled></Input>
                <span v-show="!edit">{{organization}}</span>
              </FormItem>
              <FormItem label="厂商：" class="form-style">
                <Input v-show="edit" v-model="manufacturer" disabled></Input>
                <span v-show="!edit">{{manufacturer}}</span>
              </FormItem>
              <FormItem label="IP地址：" class="form-style">
                <Input v-show="edit" v-model="listDetails.ip" disabled></Input>
                <span v-show="!edit">{{listDetails.ip}}</span>
              </FormItem>
              <FormItem label="设备型号：" class="form-style">
                <Input v-show="edit" v-model="assetForm.deviceVersion" disabled></Input>
                <span v-show="!edit">{{assetForm.deviceVersion}}</span>
              </FormItem>
              <FormItem label="建设时间：" class="form-style">
                <DatePicker v-if="edit" format="yyyy-MM-dd" type="date" v-model="assetForm.constructTime" style="width:100%;"></DatePicker>
                <span v-if="!edit">{{assetForm.constructTime}}</span>
              </FormItem>
              <br>
              <FormItem label="经度：" class="form-style" prop="longitude">
                <Input v-show="edit" v-model="assetForm.longitude"></Input>
                <span v-show="!edit">{{assetForm.longitude + '°'}}</span>
              </FormItem>
              <FormItem label="纬度：" class="form-style" prop="latitude">
                <Input v-show="edit" v-model="assetForm.latitude" ></Input>
                <span v-show="!edit">{{assetForm.latitude + '°'}}</span>
              </FormItem>
              <FormItem label="安装位置：" class="form-style" prop="InstallPosition">
                <Input v-show="edit" v-model="assetForm.InstallPosition"></Input>
                <span v-show="!edit">{{assetForm.InstallPosition}}</span>
              </FormItem>
            </Form>
          </div>
          <div v-show="paneName === 'expand'">
            <Form :model="assetForm" label-position="right" :label-width="100">
              <FormItem label="摄像机类型：" class="form-style">
                <Input v-show="edit" v-model="assetForm.cameraType" disabled></Input>
                <span v-show="!edit">{{assetForm.cameraType}}</span>
              </FormItem>
              <FormItem label="警区：" class="form-style" prop="district">
                <Input v-show="edit" v-model="assetForm.district"></Input>
                <span v-show="!edit">{{assetForm.district}}</span>
              </FormItem>
              <FormItem label="位置类型扩展：" class="form-style">
                <Select v-show="edit" v-model="assetForm.locationExtension">
                  <Option v-for="item in siteList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <span v-show="!edit">{{assetForm.locationExtension}}</span>
              </FormItem>
              <FormItem label="安装位置：" class="form-style">
                <Select v-show="edit" v-model="assetForm.site">
                  <Option v-for="item in installList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <span v-show="!edit">{{assetForm.site}}</span>
              </FormItem>
              <FormItem label="摄像机用途：" class="form-style">
                <Select v-show="edit" v-model="assetForm.usage">
                  <Option v-for="item in useList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <span v-show="!edit">{{assetForm.usage}}</span>
              </FormItem>
              <FormItem label="摄像机补光：" class="form-style">
                <Select v-show="edit" v-model="assetForm.fill">
                  <Option v-for="item in lightList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <span v-show="!edit">{{assetForm.fill}}</span>
              </FormItem>
              <FormItem label="监视方位：" class="form-style">
                <Select v-show="edit" v-model="assetForm.monitoPosition">
                  <Option v-for="item in directionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <span v-show="!edit">{{assetForm.monitoPosition}}</span>
              </FormItem>
              <FormItem label="支持国标：" class="form-style">
                <Select v-show="edit" v-model="assetForm.supportGB">
                  <Option v-for="item in supportGBList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <span v-show="!edit">{{assetForm.supportGB}}</span>
              </FormItem>
              <FormItem label="是否可控：" class="form-style">
                <Select v-show="edit" v-model="assetForm.controllable">
                  <Option v-for="item in controllableList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <span v-show="!edit">{{assetForm.controllable}}</span>
              </FormItem>
            </Form>
          </div>
          <div v-show="paneName === 'preserve'">
            <Form :model="assetForm" label-position="right" :label-width="100">
              <FormItem label="维保厂商：" class="form-style">
                <Select @on-change="selectMaintenanceVendor" v-show="edit" v-model="assetForm.maintenanceVendor">
                  <Option v-for="item in cityList" :value="item.maintenanceVendor" :key="item.maintenanceVendor">{{ item.maintenanceVendor }}</Option>
                </Select>
                <span v-show="!edit">{{assetForm.maintenanceVendor}}</span>
              </FormItem>
              <FormItem label="联系人：" class="form-style">
                <Select @on-change="selectLinkman" v-show="edit" v-model="assetForm.contact">
                  <Option v-for="item in linkman" :value="item.contact" :key="item.contact">{{ item.contact }}</Option>
                </Select>
                <span v-show="!edit">{{assetForm.contacts}}</span>
              </FormItem>
              <FormItem label="联系电话：" class="form-style">
                <Input v-show="edit" disabled v-model="assetForm.phone"></Input>
                <span v-show="!edit">{{assetForm.phone}}</span>
              </FormItem>
              <FormItem label="邮件地址：" class="form-style">
                <Input v-show="edit" disabled v-model="assetForm.email"></Input>
                <span v-show="!edit">{{assetForm.email}}</span>
              </FormItem>
              <FormItem label="维保开始：" class="form-style">
                <DatePicker format="yyyy-MM-dd" v-if="edit" type="date" v-model="assetForm.startTime" style="width:100%;"></DatePicker>
                <span v-if="!edit">{{assetForm.startTime}}</span>
              </FormItem>
              <FormItem label="维保结束：" class="form-style">
                <DatePicker format="yyyy-MM-dd" v-if="edit" type="date" v-model="assetForm.endTime" style="width:100%;"></DatePicker>
                <span v-if="!edit">{{assetForm.endTime}}</span>
              </FormItem>
            </Form>
          </div>
        </div>
        <div slot="footer">
          <Button type="ghost" @click="assetClose" v-if="(assetTitle !== '资产详情')">取消</Button>
          <Button type="ghost" @click="modificationSave('formCustom')">确认</Button>
        </div>
      </Modal>
    </div>
    <div class="repair-modal" v-show="repairStatus">
      <Modal v-model="repairStatus" :mask-closable="false" :closable="false" width="850">
        <div slot="header">
          <span class="lf title-style">设置维保</span>
          <a class="modal-close" @click="assetClose">
            <Icon type="ios-close-empty" size="31"></Icon>
          </a>
        </div>
        <div style="width: 100%; height: 100%;">
          <p class="content-title-style">维保信息：</p>
          <Form :model="repairForm" label-position="right" :label-width="100">
            <FormItem label="维保厂商：" class="form-style">
              <Select  @on-change="selectMaintenanceVendor" v-model="repairForm.maintenanceVendor">
                <Option v-for="(item) in cityList" :value="item.maintenanceVendor" :key="item.maintenanceVendor">{{ item.maintenanceVendor }}</Option>
              </Select>
            </FormItem>
            <FormItem label="联系人：" class="form-style">
              <Select @on-change="selectLinkman"  v-model="repairForm.contact">
                <Option v-for="(item) in linkman" :value="item.contact" :key="item.contact">{{ item.contact }}</Option>
              </Select>
            </FormItem>
            <FormItem label="联系电话：" class="form-style">
              <Input v-model="repairForm.phone" disabled></Input>
            </FormItem>
            <FormItem label="邮件地址：" class="form-style">
              <Input v-model="repairForm.email" disabled></Input>
            </FormItem>
            <FormItem label="维保开始：" class="form-style">
              <DatePicker format="yyyy-MM-dd" type="date" v-model="repairForm.startTime" style="width:100%;"></DatePicker>
            </FormItem>
            <FormItem label="维保结束：" class="form-style">
              <DatePicker format="yyyy-MM-dd" type="date" v-model="repairForm.endTime" style="width:100%;"></DatePicker>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button type="ghost" @click="assetClose">取消</Button>
          <Button type="ghost" @click="installMaintenance">确认</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'BSassetModal',
  props: {
    assetShow: {
      type: Boolean,
      default: false
    },
    repairShow: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Array
    },
    edit: {
      type: Boolean,
      defaule: true
    },
    assetTitle: {
      type: String,
      defaule: ''
    },
    listDetails: {
      type: Object,
      defaule: {}
    },
    Allnumtype: {
      type: String
    },
    detailList: {
      type: Object
    }
  },
  components: {
  },
  data() {
    const longitudeVerify = (rule, value, callback) => {
      if (value === '') {
        callback()
        return
      }
      if (!Number(value)) {
        callback(new Error('请输入0 - 180范围内数值'))
      }
      if (value < 0 || value > 180) {
        callback(new Error('请输入0 - 180范围内数值'))
      } else {
        callback()
      }
    }
    const latitudeVerify = (rule, value, callback) => {
      if (value === '') {
        callback()
        return
      }
      if (!Number(value)) {
        callback(new Error('请输入0 - 90范围内数值'))
      }
      if (value < 0 || value > 90) {
        callback(new Error('请输入0 - 90范围内数值'))
      } else {
        callback()
      }
    }
    return {
      isDataStatus: true,
      // 联系人是否可选择
      isLinkman: false,
      // 厂商
      manufacturer: '',
      organization: '',
      // 设备型号
      equipmentType: '',
      isAssetTitle: false,
      assetStatus: this.assetShow,
      repairStatus: this.repairShow,
      paneName: 'basic',
      cityList: [
        {
          value: '',
          maintenanceVendor: ''
        }
      ],
      linkman: [
        {
          contact: '',
          phone: ''
        }
      ],
      linkmanObj: {
        contact: '',
        email: '',
        phone: ''
      },
      siteList: [
        {
          value: 0,
          label: '空'
        },
        {
          value: 1,
          label: '省际检查站'
        },
        {
          value: 2,
          label: '党政机关'
        },
        {
          value: 3,
          label: '车站码头'
        },
        {
          value: 4,
          label: '中心广场'
        },
        {
          value: 5,
          label: '体育场馆'
        },
        {
          value: 6,
          label: '商业中心'
        },
        {
          value: 7,
          label: '宗教场所'
        },
        {
          value: 8,
          label: '校园周边'
        },
        {
          value: 9,
          label: '治安复杂区域'
        },
        {
          value: 10,
          label: '交通干线'
        }
      ],
      installList: [
        {
          value: 0,
          label: '空'
        },
        {
          value: 1,
          label: '室内'
        },
        {
          value: 2,
          label: '室外'
        }
      ],
      useList: [
        {
          value: 0,
          label: '空'
        },
        {
          value: 1,
          label: '治安'
        },
        {
          value: 2,
          label: '交通'
        },
        {
          value: 3,
          label: '重点'
        }
      ],
      lightList: [
        {
          value: 0,
          label: '空'
        },
        {
          value: 1,
          label: '无补光'
        },
        {
          value: 2,
          label: '红外补光'
        },
        {
          value: 3,
          label: '白光补光'
        }
      ],
      directionList: [
        {
          value: 0,
          label: '空'
        },
        {
          value: 1,
          label: '东'
        },
        {
          value: 2,
          label: '南'
        },
        {
          value: 3,
          label: '西'
        },
        {
          value: 4,
          label: '北'
        },
        {
          value: 5,
          label: '东南'
        },
        {
          value: 6,
          label: '东北'
        },
        {
          value: 7,
          label: '西南'
        },
        {
          value: 8,
          label: '西北'
        }
      ],
      supportGBList: [
        {
          value: 0,
          label: '空'
        },
        {
          value: 1,
          label: '是'
        },
        {
          value: 2,
          label: '否'
        }
      ],
      controllableList: [
        {
          value: 0,
          label: '空'
        },
        {
          value: 1,
          label: '可控'
        },
        {
          value: 2,
          label: '不可控'
        }
      ],
      tabsList: [
        { label: '基本信息', name: 'basic' },
        { label: '扩展信息', name: 'expand' },
        { label: '维保信息', name: 'preserve' }
      ],
      assetForm: {
        name: '',
        type: '',
        oid: '',
        manufacturer: '',
        ip: '',
        deviceVersion: '',
        constructTime: '',
        longitude: '',
        latitude: '',
        installPosition: '',
        cameraType: '',
        district: '',
        locationExtension: '',
        site: '',
        usage: '',
        fill: '',
        monitoPosition: '',
        supportGB: '',
        controllable: '',
        company: '',
        linkman: '',
        tell: '',
        email: '',
        start: '',
        end: ''
      },
      repairForm: {
        maintenanceVendor: '',
        contact: '',
        phone: '',
        email: '',
        startTime: '',
        endTime: ''
      },
      // 验证
      ruleCustom: {
        longitude: [
          { validator: longitudeVerify, trigger: 'blur' }
        ],
        latitude: [
          { validator: latitudeVerify, trigger: 'blur' }
        ],
        InstallPosition: [
          { max: 64, message: '最多输入64位字符', trigger: 'change' }
        ],
        district: [
          { max: 128, message: '最多输入128位字符', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      operateList: ({ opsManage }) => opsManage.operateList
    })
  },
  watch: {
    detailList(val) {
      if (!this.detailList.data) {
        let arr = this.$moment(this.listDetails.createdAt).format('YYYY-MM-DD').split('-')
        let endTime = `${Number(arr[0]) + 5}-${arr[1]}-${arr[2]}`
        this.assetForm = {
          longitude: '',
          latitude: '',
          InstallPosition: '',
          district: '',
          locationExtension: '',
          usage: '',
          fill: '',
          monitoPosition: '',
          supportGB: '',
          controllable: '',
          updatedAt: '',
          endTime: '',
          startTime: '',
          email: '',
          phone: '',
          contacts: '',
          contact: '',
          maintenanceVendor: '',
          site: '',
          constructTime: '',
          createdAt: ''
        }
        if (this.assetTitle !== '资产详情') {
          this.assetForm.startTime = this.$moment(this.listDetails.createdAt).format('YYYY-MM-DD')
          this.assetForm.constructTime = this.$moment(this.listDetails.createdAt).format('YYYY-MM-DD')
          this.assetForm.endTime = endTime
        }
      } else {
        this.isDataStatus = false
        this.assetForm = JSON.parse(JSON.stringify(this.detailList.data))
        this.assetForm.constructTime = this.$moment(this.detailList.data.createdAt).format('YYYY-MM-DD')
        this.assetForm.startTime = this.$moment(this.detailList.data.startTime * 1000).format('YYYY-MM-DD')
        this.assetForm.endTime = this.$moment(this.detailList.data.endTime * 1000).format('YYYY-MM-DD')
        this.assetForm.contact = this.detailList.data.contacts
        if (this.assetTitle === '资产详情') {
          this.assetForm.locationExtension = this.screenType(this.siteList, this.detailList.data.locationExtension)
          this.assetForm.site = this.screenType(this.installList, this.detailList.data.site)
          this.assetForm.usage = this.screenType(this.useList, this.detailList.data.usage)
          this.assetForm.fill = this.screenType(this.lightList, this.detailList.data.fill)
          this.assetForm.controllable = this.screenType(this.controllableList, this.detailList.data.controllable)
          this.assetForm.supportGB = this.screenType(this.supportGBList, this.detailList.data.supportGB)
          this.assetForm.monitoPosition = this.screenType(this.directionList, this.detailList.data.monitoPosition)
        }
      }
    },
    listDetails(val) {
      if (!this.listDetails) {
        this.equipmentType = ''
      } else {
        this.equipmentType = this.listDetails.eid ? this.listDetails.eid.type : this.listDetails.type
        this.organization = this.listDetails.eid ? this.listDetails.eid.oid.name : this.listDetails.oid.name
        let manufacturer = this.listDetails.eid ? this.listDetails.eid.manufacturer : this.listDetails.manufacturer
        switch (manufacturer) {
          case 'dahua':
            manufacturer = '大华'
            break
          case 'bstar':
            manufacturer = '蓝色星际'
            break
          case 'hikvision':
            manufacturer = '海康'
            break
          case 'onvif':
            manufacturer = 'onvif'
            break
          case 'custom':
            manufacturer = '自定义'
            break
          case 'lida':
            manufacturer = '利达'
            break
          case 'juanxin':
            manufacturer = '巨安信'
            break
          default:
            manufacturer = this.listDetails.manufacturer
        }
        this.manufacturer = manufacturer
      }
    },
    assetTitle(val) {
      if (this.assetTitle === '资产详情') {
        this.isAssetTitle = false
      } else {
        this.isAssetTitle = true
      }
    },
    assetShow(val) {
      this.assetStatus = val
      this.operateAction()
    },
    repairShow(val) {
      this.repairStatus = val
      this.operateAction()
    }
  },
  methods: {
    ...mapActions([
      'getOperateList'
    ]),
    // 设置维保
    installMaintenance() {
      if (this.$moment(this.repairForm.startTime).valueOf() > this.$moment(this.repairForm.endTime).valueOf()) {
        this.$Notice.warning({ title: '警告', desc: '维保结束时间不能小于维保开始时间！' })
        return
      }
      this.$emit('installMaintenance', this.repairForm)
    },
    selectLinkman(val) { // 选择联系人
      if (!this.isDataStatus) {
        this.isDataStatus = true
        return
      }
      for (let index = 0; index < this.linkman.length; index++) {
        if (this.linkman[index].contact === val) {
          this.assetForm.phone = this.linkman[index].phone
          this.assetForm.email = this.linkman[index].email
          this.repairForm.email = this.linkman[index].email
          this.repairForm.phone = this.linkman[index].phone
          break
        }
      }
    },
    selectMaintenanceVendor(val) { // 选择厂商
      if (!this.isDataStatus) {
        this.isDataStatus = true
        return
      }
      this.assetForm.phone = ''
      this.assetForm.email = ''
      this.repairForm.email = ''
      this.repairForm.phone = ''
      for (let index = 0; index < this.operateList.length; index++) {
        if (this.operateList[index].maintenanceVendor === val) {
          this.assetForm.contact = ''
          this.linkman = this.operateList[index].contacts
          this.isLinkman = true
          break
        }
      }
    },
    screenType(arr, val) { // 通过value 拿到对象所对应 lable
      let result
      for (let index = 0; index < arr.length; index++) {
        if (arr[index].value === val) {
          result = arr[index].label
          break
        }
      }
      return result
    },
    assetClose() { // 关闭模态框
      this.assetStatus = false
      this.repairStatus = false
      this.isLinkman = false
      this.paneName = 'basic'
      this.$emit('cancel')
    },
    tabChange(val) {
      this.paneName = val
    },
    operateAction() { // 获取资产管理维保厂商列表
      if (this.assetStatus === true || this.repairStatus === true) {
        this.getOperateList().then(suc => {
          this.cityList = this.operateList
        }).catch(err => {
          console.log(err)
        })
      }
    },
    modificationSave(name) { // 确定修改提交
      if (this.assetTitle !== '资产详情') {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.$moment(this.assetForm.startTime).valueOf() > this.$moment(this.assetForm.endTime).valueOf()) {
              this.$Notice.warning({ title: '警告', desc: '维保结束时间不能小于维保开始时间！' })
            } else {
              this.$emit('modificationSave', this.assetForm)
              this.assetClose()
            }
          } else {
            this.$Notice.warning({ title: '警告', desc: '请修改参数' })
          }
        })
      }
      this.assetClose()
    }
  }
}
</script>

<style scoped>
.lf {
  float: left;
}
.rt {
  float: right;
}
.modal-close {
  position: absolute;
  right: 16px;
  top: 4px;
  overflow: hidden;
  cursor: pointer;
  color: #ccc;
}
.modal-close:hover {
  color: #fff;
}
.title-style {
  font-size: 14px;
  font-weight: bold;
}
.content-title-style {
  height: 32px;
  line-height: 32px;
}
.content-style {
  width: 100%;
}
.form-style {
  width: 48%;
  display: inline-block;
}
</style>
