<template>
  <div class="navigation"
    :class="{'active-shrink': !isNavShow}"
    v-resize="resizeFn">
    <div v-if="loggedIn">
      <div class="theme-container"
        :style="{fontStyle:fontItalic,fontFamily:fontfamily,backgroundColor:uploadColor,color: fontColor,fontSize: fontSize + 'px',fontWeight:fontRegular,textDecoration:fontUnderline}">
        <div class="header-logo"
          @mouseover="headerChild = false">
          <img class="logo-img"
            :src="imgIfoLogo" />
          <span class="header-title"
            :style="{fontfamily : fontfamily,color: fontColor,fontSize: fontSize + 'px'}">{{imgIfoName}}</span>
        </div>
        <div class="header-menu">
          <ul class="theme-box">
            <li v-if="!($route.path==='/navigation')" class="theme-item" @click="skipTo('/navigation')">导航</li>
            <li v-show="($route.path !== '/navigation')  && isMapNavShow(munuitem) && !($route.path==='/localConf')" v-for="munuitem in momentmunuList.children" class="theme-item theme-item-notfirst" :style="{width: ['/ops/global', '/mapEdit/param', '/ops/plans', '/ops/individuation', '/traffic/nonVehicleManage'].includes(munuitem.url) ? '135px':'100px' }" :class="{active: isTitleFocus(munuitem)}" @click="skipTo(munuitem.url, munuitem)" :key="munuitem.tag">
              {{munuitem.name}}
              <div class="nabla" @click.stop='isShowMapList=!isShowMapList' v-if="mapConfigArr && mapConfigArr.length > 0 && (munuitem.url === '/map/2D' || munuitem.url === '/mapEdit/2D')"></div>
              <div class="map-list" v-if='isShowMapList' @mouseleave.stop="isShowMapList=false" :style="{fontStyle:fontItalic,color:fontColor,fontWeight:fontRegular,textDecoration:fontUnderline,fontFamily:fontfamily,backgroundColor:uploadColor}">
                <div v-for='item in mapConfigArr' v-show="munuitem.url === '/map/2D' || munuitem.url === '/mapEdit/2D'" :key='item.mapId' @click.stop="changeMap(item)" :class="{active:activeMapConfig.mapId === item.mapId}" :title="item.mapName">{{item.mapName}}</div>
              </div>
            </li>
            <li v-show="($route.path == '/localConf')" class="theme-item theme-item-notfirst" @click="skipTo('/localConf')">本地配置</li>

          </ul>
        </div>
        <div class="header-info"
          @mouseover="headerChild = false"
          style="font-size:14px;color:#ccc;">
          <div class="iconfont icon-baojing1"
            @mouseover="showAlarm = allAlarmNewOneData.eventType"
            :class="{'alarmImg': !allAlarmNewOneData.eventType || (allAlarmNewOneData.eventType && !alarmUrlRight), 'alarmImgAction':allAlarmNewOneData.eventType && alarmUrlRight, 'animation-flicker-red':allAlarmNewOneData.eventType && alarmUrlRight}"></div>
          <span class="someControlList"
            @mouseover="openDrop"
            @click="closeDrop"
            @mouseleave="disabled = false">
            <span class="user-name">{{usernameIfo}}</span>
          </span>
          <span class="someControlList"
            style="width:130px">
            {{this.titleTime}}
          </span>
          <span class="someControlList"
            @click.prevent="fullScreen"
            style="margin:0 15px"
            :title="fullScreenflag?'退出全屏':'全屏'">
            <i class="iconfont"
              :class="[fullScreenflag? 'icon-exit-full-screen' : 'icon-full-screen']"></i>
          </span>
        </div>
        <div v-if="disabled"
          class="pull-down-edition">
          <iframe></iframe>
          <div class='trigon'>
          </div>
          <div class="modal-mask"
            @click='backPopTime'></div>
          <div class="list-box"
            @mouseleave="pullDownFlag = false">
            <p class='showInfor'>登录时间：{{loginTime}}</p>
            <!-- <p>角色类型：{{roleType}}</p> -->
            <p class='showInfor'>版本号：{{clientVersion}}</p>
          </div>
        </div>
        <div v-if="pullDownFlag"
          class="pull-down"
          :style="{fontStyle:fontItalic,color:fontColor,fontWeight:fontRegular,textDecoration:fontUnderline,fontFamily:fontfamily,backgroundColor:uploadColor, height:duty==='yes' ? '167px' : '125px'}">
          <iframe></iframe>
          <div class="modal-mask"
            @click='backPopTime'></div>
          <div class="list-box"
            @mouseleave="pullDownFlag = false">
            <div class="pull-down-list use-color"
              @click="changePasswordFun">
              <p>修改密码</p>
            </div>
            <div v-if="duty==='yes'"
              class="pull-down-list use-color"
              @click="changeDutyShow">
              <p>交接班登录</p>
            </div>
            <!-- <div class="pull-down-list use-color"
              @click="changeDutyShow">
              <p>交接班登录</p>
            </div> -->
            <div class="pull-down-list use-color"
              @click="exitShow">
              <p>退出登录</p>
            </div>
            <div class="pull-down-list use-color"
              @click="goLocalConf">
              <p>本地配置</p>
            </div>
          </div>
        </div>
        <div v-if="changeDutyModal"
          style="width:520px;height:403px;position:relative;top:100px;margin:0 auto;border-radius:8px;">
          <iframe style="border-radius:8px;"></iframe>
          <Modal v-model="changeDutyModal"
            title="交接班登录"
            :closable="false"
            :mask-closable="false">
            <Form ref="changeDutyUser"
              :model="changeDutyUser"
              :rules="ruleValidate"
              label-position="left"
              :label-width="100">
              <FormItem label="交班人员">
                <Input v-model="usernameIfo"
                  readonly
                  disabled></Input>
              </FormItem>
              <FormItem label='报警处理'>
                <router-link :to="{ path: '/warning/count', query: { startTime: loginTime , alarmSureFalse : true }}"
                  @click.native="dutyModalCancel">{{ dutyInfo.alarmProcess }}
                </router-link>
                <router-link :to="{ path: '/warning/count', query: { startTime: loginTime }}"
                  @click.native="dutyModalCancel">{{ dutyInfo.alarmProcessAll }}
                </router-link>
              </FormItem>
              <FormItem label='接警任务'>
                <router-link :to="{ path: '/business/receiveAlarm', query: { startTime: loginTime , alarmSureFalse : true }}"
                  @click.native="dutyModalCancel">{{ dutyInfo.receiveAlarmProcess }}
                </router-link>
                <router-link :to="{ path: '/business/receiveAlarm', query: { startTime: loginTime }}"
                  @click.native="dutyModalCancel">{{ dutyInfo.receiveAlarmProcessAll }}
                </router-link>
              </FormItem>
              <FormItem label='值班日志'>
                <router-link :to="{ path: '/business/dutyManage/log', query: { startTime: loginTime }}"
                  @click.native="dutyModalCancel">{{ dutyInfo.logbook }}
                </router-link>
              </FormItem>
              <FormItem label="接班人员"
                prop="name">
                <Select v-model="changeDutyUser.name">
                  <Option v-for="user in dutyUserList"
                    :key="user._id"
                    :value="user.name">{{user.name}}</Option>
                </Select>
              </FormItem>
              <FormItem label="密码"
                prop="password">
                <Input type="password"
                  v-model="changeDutyUser.password"
                  :maxlength="64"></Input>
              </FormItem>
              <FormItem label="备注">
                <Input v-model="changeDutyUser.notes"
                  type="textarea"
                  :autosize="{minRows: 2,maxRows: 2}"
                  :maxlength="100"></Input>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="ghost"
                @click="dutyModalCancel">取消</Button>
              <Button type="primary"
                @click="changeDuty">登录</Button>
            </div>
          </Modal>
        </div>
        <div v-if="showAlarm"
          class="alarm-pull-down">
          <iframe v-if="showAlarm"></iframe>
          <div class='trigons'>
          </div>
          <div class="list-box"
            @mouseleave="showAlarm = false"
            @click="jumpAlarmUrl">
            <p class='showInfor' :title="allAlarmNewOneData.name ? allAlarmNewOneData.name : ''">报警名称：{{allAlarmNewOneData.name ? allAlarmNewOneData.name : ''}}</p>
            <p class='showInfor'>报警时间：{{allAlarmNewOneData.time ? $moment(parseInt(allAlarmNewOneData.time) *
              1000).format("YYYY-MM-DD HH:mm:ss") :''}}</p>
            <p class='showInfor'>报警类型：{{alarmTypeList[allAlarmNewOneData.eventType]}}</p>
            <p class='showInfor'>机构：{{allAlarmNewOneData.organization}}</p>
          </div>
        </div>
      </div>
      <modPwd :showModal.sync="password.visible"
        @closeAlert="closeAlert"
        @doLogout="doLogout">
      </modPwd>
      <!-- <div v-if="password.visible" id="setPaddwrod" class="pull-down-password pull-down-change">
        <iframe></iframe>
        <div class="modal-mask-alert" @click='password.visible = false'></div>
        <div class="list-box">
          <div class="password-header">
            <span style="padding:10px;display:inline-block">修改密码</span>
            <span @click='password.visible = false' class="password-close" style="float:right;cursor:pointer;padding:10px;display:inline-block">
              <Icon type="close-round"></Icon>
            </span>
          </div>
          <div class="password-body">
            <Form :rules="password.rules" ref="password" label-position="top" :model="password.form">
              <Form-item label="旧密码" prop="oldPassword">
                <Input type="password" placeholder="请输入旧密码" v-model="password.form.oldPassword"></Input>
              </Form-item>
              <Form-item label="新密码" prop="password">
                <Input type="password" placeholder="请输入新密码" v-model="password.form.password"></Input>
              </Form-item>
              <div style="margin-bottom:15px;width:458px">
                <verify-password :password="password.form.password"></verify-password>
              </div>
              <Form-item label="密码确认" prop="confirmPassword">
                <Input type="password" placeholder="请输入新密码" v-model="password.form.confirmPassword"></Input>
              </Form-item>
            </Form>
          </div>
          <div class="password-footer">
            <Button style="float:right;margin:5px 50px 30px 0;width:100px" @click.native="changePassword" type="primary">保存</Button>
            <Button style="float:right;margin:5px 15px 30px 0;width:100px" @click.native="doLogout" type="ghost">返回登录</Button>
          </div>
        </div>
      </div> -->
      <div v-if="exitFlag"
        class="pull-down-password pull-down-exit">
        <iframe></iframe>
        <div class="modal-mask-alert"
          @click='exitFlag = false'></div>
        <div class="list-box">
          <div class="password-body">
            <div style="position:absolute;top:35px;left:20px">
              <i class="ivu-icon ivu-icon-help-circled"
                style="fontSize:36px;color:#ff9900;"></i>
            </div>
            <span style="margin:15px 15px 15px 45px;display:inline-block">提示：请确认是否退出本系统？确认退出前请保存正在编辑的内容</span>
          </div>
          <div class="password-footer">
            <Button @click="doLogout"
              type="primary"
              style="float: right;marginRight:40px">确认</Button>
            <Button @click="exitFlag = false"
              type="ghost"
              style="float: right;marginRight:20px">取消</Button>
          </div>
        </div>
      </div>
    </div>
    <div v-show="$route.fullPath === '/map/3D' || $route.fullPath === '/map/2D'"
      class="btn-shrink"
      @click="isPlatformTrack ? '' : isNavShow = !isNavShow">
      <div class="shape"></div>
      <Icon class="icon"
        :type="isNavShow ? 'ios-arrow-up' : 'ios-arrow-down'" />
    </div>
    <div v-if="isPlatformTrack" class="disabled-cover"></div>
  </div>
</template>
<script>
import './theme.css'
import moment from 'moment'
import modPwd from './modPwd.vue'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { STORE_KEY_USERNAME, CLIENT_VERSION } from '../../constants'
import { read, save, readMulti } from '../../storage/index.js'
import locales from 'locales/header'
import store from '../../store'
import { saveState } from '../../common/storage'
import {MAPMODE} from 'assets/2DMap/meta/common.js'
export default {
  locales,
  name: 'Menu',
  components: {
    modPwd
  },
  data() {
    const oldPasswordFun = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'))
      } else {
        callback()
      }
    }
    const passwordFun = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      }
      if (value.length < 6) {
        callback(new Error('请输入新密码'))
      }
    }
    const confirmPasswordFun = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次确认新密码'))
      } else {
        callback()
      }
    }
    const triggerFun = (rule, value, callback) => {
      if (value !== this.password.form.password) {
        callback(new Error('两次输入密码不一致，请重试！'))
      } else {
        callback()
      }
    }
    return {
      isNavShow: true,
      vehicleList: [],
      vehicleList1: [],
      sysList: [],
      sysList1: [],
      sysList2: [],
      sysList3: [],
      passwordType: '',
      themeListLength: [],
      exitFlag: false,
      themeList: {
        homePage: false,
        faceRecognition: false,
        peopleTraffic: false,
        vehicleRecognize: false,
        videoStructured: false,
        securityMonitor: false,
        sysConf: false
      },
      fullScreenflag: false,
      roleType: '',
      clientVersion: '',
      imgIfoLogo: '',
      imgIfoName: '',
      usernameIfo: '',
      loginTime: '',
      fontfamily: '微软雅黑',
      fontSize: '16',
      fontColor: '#fff',
      fontWeight: 'normal',
      fontItalic: 'normal',
      fontRegular: 'Regular',
      uploadColor: '#1b3153',
      fontUnderline: 'none',
      pullDownFlag: false,
      momentMenu: '',
      momentTitle: '',
      headerChild: false,
      tabName: '',
      status: false,
      tileleft: 0,
      disabled: false,
      titleHeight: 0,
      titleWidth: 0,
      titleTime: '',
      config: {
        visible: false,
        form: {
          lang: '',
          pageLimit: 10
        },
        rules: {
          lang: [{ required: true }],
          pageLimit: [{ type: 'number', required: true }]
        }
      },
      isShowMapList: false,
      password: {
        visible: false,
        form: {
          oldPassword: '',
          password: '',
          confirmPassword: ''
        },
        rules: {
          oldPassword: [
            {
              required: true,
              validator: oldPasswordFun,
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              validator: passwordFun,
              trigger: 'blur'
            }
          ],
          confirmPassword: [
            {
              required: true,
              validator: confirmPasswordFun,
              trigger: 'blur'
            },
            {
              trigger: 'blur',
              validator: triggerFun
            }
          ]
        }
      },
      showAlarm: false,
      alarmUrlRight: false,
      alarmTypeList: {
        soldier: '单兵一键报警',
        individualAlarm: '单兵一键报警',
        patrol: '巡更异常报警',
        patrolAlarm: '巡更异常报警',
        alarmInput: '报警输入',
        alarmOut: '报警输出',
        focusAttention: '重点关注',
        alarmZone: '报警防区',
        alarmGT: '电子围栏',
        faceControl: '人像布控',
        // 智能类
        perimeter: '周界保护',
        tripwire: '绊线',
        leftObject: '物品遗留',
        missingObject: '物品丢失',
        loitering: '非法停留',
        retrogradeDetection: '逆行检测',
        lingerDetection: '徘徊检测',
        doubleCordon: '双警戒线',
        blackList: '黑名单',
        whiteList: '白名单',
        dispatch: '布控',
        areaInvade: '区域入侵',
        fastMove: '快速移动',
        parkDetect: '停车检测',
        humanAssemble: '人员聚集',
        objectMove: '物品搬移',
        // 监控点类
        alarmMoveSense: '移动侦测',
        videoMask: '视频遮挡',
        sceneSwitch: '镜头移位',
        definitionAbnormal: '清晰度异常',
        brightnessAbnormal: '亮度异常',
        screenFreeze: '画面冻结',
        noise: '噪声检测',
        signalLoss: '信号缺失',
        colorCast: '偏色检测',
        // 消防类
        fireAlarm: '消防报警',
        fireFailure: '消防故障',
        // 违章报警
        vioRetrograde: '违章逆行',
        vioPark: '违章停车',
        vioTurnLeft: '违章左转',
        vioTurnRight: '违章右转',
        // 报警求助
        askHelp: '请求对讲',
        acceptHelp: '接受对讲',
        endHelp: '结束对讲',
        // 设备报警
        hardDiskFailure: 'sd卡故障',
        hardDiskFull: 'sd卡满',
        networkDown: '网络断开',
        ipConflict: 'IP冲突',
        timeAbnormal: '时间异常',
        illegalNetworkAccess: '非法网络访问',
        // 其他
        alarmVideoLost: '视频丢失',
        vehicleBlack: '车辆识别黑名单',
        vehicleWhite: '车辆白名单',
        vehicleDispatch: '车辆布控',
        faceBlack: '人脸识别',
        faceWhite: '人脸白名单',
        faceDispatch: '人脸布控',
        peopleCount: '人数统计',
        fight: '斗殴',
        approach: '人员贴近',
        armyGuard: '哨兵管控',
        atmCare: 'ATM看护',
        fanAbnormal: '风扇异常',
        mainBoardAbnormal: '主板异常',
        channelAbnormal: '通道异常',
        temperatureAbnormal: '温度异常',
        damagedDiskSectors: '硬盘坏道',
        ipcMacCheckException: 'MAC校验异常'
      },
      changeDutyModal: false,
      changeDutyUser: {
        name: '',
        password: '',
        notes: ''
      },
      ruleValidate: {
        name: [{ required: true, message: '接班人员账号不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '接班人员密码不能为空', trigger: 'blur' }]
      },
      dutyUserList: [],
      duty: 'yes',
      dutyInfo: {
        alarmProcess: '',
        alarmProcessAll: '',
        receiveAlarmProcess: '',
        receiveAlarmProcessAll: '',
        logbook: '',
        loginTime: null
      }
    }
  },
  computed: {
    ...mapGetters([
      'mapConfigArr',
      'momentmunuList',
      'username',
      'loggedIn',
      'activeMapConfig',
      'userId',
      'globalConfig',
      'getMenuStyle',
      'getloginTimeFlag',
      'getRouteState',
      'getLoginInforImg',
      'getLoginInname',
      'faceRecognitionrole',
      'homePagerole',
      'peopleTrafficrole',
      'securityMonitorrole',
      'vehicleRecognizerole',
      'videoStructuredrole',
      'sysConfrole',
      'themelistFlag',
      'tipWarningConfig',
      'tipErrorConfig',
      'styleState',
      'allAlarmNewOneData',
      'mapModeSetting'
    ]),
    ...mapGetters('map2DApplyIX', ['isPlatformTrack']),
    mapApplyUrls() {
      // 地图应用的url数组
      let enableList = this.mapModeSetting.enableList
      const urls = []
      for (const mode of enableList) {
        let url = '/map/' + mode
        urls.push(url)
      }
      return urls
    },
    mapEditUrls() {
      // 地图编辑的url数组
      let enableList = this.mapModeSetting.enableList
      const urls = []
      for (const mode of enableList) {
        let url = '/mapEdit/' + mode
        urls.push(url)
      }
      urls.push('/mapEdit/param')
      return urls
    }
  },
  watch: {
    getMenuStyle: {
      deep: true,
      handler(newInfo) {
        this.fontfamily = newInfo.fontfamily || this.fontfamily
        this.fontSize = newInfo.fontSize || this.fontSize
        this.fontColor = newInfo.fontColor || this.fontColor
        this.fontRegular = newInfo.fontRegular || this.fontRegular
        this.uploadColor = newInfo.uploadColor || this.uploadColor
        this.fontUnderline = newInfo.fontUnderline || this.fontUnderline
        this.fontItalic = newInfo.fontItalic || this.fontItalic
        this.imgIfoLogo = newInfo.uploadLogoPicture || '/static/image/home/logoMenu.png'
        this.imgIfoName = newInfo.name || '校园监控综合管理平台'
      }
    },
    getloginTimeFlag(newVal) {
      this.loginTime = newVal || this.loginTime
    },
    username(newVal) {
      this.usernameIfo = newVal
    },
    getRouteState(newVal) {
      this.pageJudge(newVal)
      let momentMenuArr = newVal.split('/')
      this.momentTitle = '/' + momentMenuArr[1] + '/' + momentMenuArr[2]
      if (momentMenuArr[1] === 'warning' || momentMenuArr[1] === 'map') {
        this.momentMenu = '/video'
      } else {
        this.momentMenu = '/' + momentMenuArr[1]
      }
    },
    allAlarmNewOneData(newVal) {
      if (!newVal.name) {
        this.showAlarm = false
      }
      if (
        (window.location.href === 'http://' + window.location.host + '/fire/control' &&
          (this.allAlarmNewOneData.eventType === 'fireAlarm' || this.allAlarmNewOneData.eventType === 'fireFailure')) ||
        (window.location.href === 'http://' + window.location.host + '/warning/receive' &&
          (this.allAlarmNewOneData.eventType !== 'fireAlarm' && this.allAlarmNewOneData.eventType !== 'fireFailure'))
      ) {
        this.alarmUrlRight = false
        return {}
      } else {
        this.alarmUrlRight = true
        return newVal
      }
    },
    isNavShow(newVal) {
      this.CHANGE_IS_NAV_SHOW(newVal)
    }
  },
  methods: {
    ...mapActions([
      'logoutFun',
      'getGrid',
      'getBuild',
      'updateGlobalConfig',
      'getPlatform',
      'getSafeSet',
      'clearNavWarningData',
      'navAlarmPage',
      'fireAlarmPage',
      'loginFun',
      'setMainMenu',
      'testUserInfo',
      'getDutyUserNameList',
      'recordLog',
      'setActiveMapConfig',
      'setIsMapOuter',
      'getTwoImensionalInfo'
    ]),
    ...mapMutations('map3DApplyIX', ['CHANGE_IS_NAV_SHOW']),
    ...mapMutations([
      'SET_EDIT_RIGHT_PAGE_STATE',
      'SET_WARN_RANG',
      'CHANGE_POINT_VIDEO_LIST',
      'CLEAR_ACTIVEMODEL_ID',
      'SET_VIDEO_LIST',
      'CLEAR_ACTIVEMODEL_ID_3D'
    ]),
    // 地图导航栏根据系统配置显示相应配置的地图选项
    isMapNavShow(munuitem) {
      let munuitemUrl = munuitem.url
      // console.log('isMapNavShow')
      return (
        this.mapApplyUrls.includes(munuitemUrl) ||
        this.mapEditUrls.includes(munuitemUrl) ||
        (this.momentmunuList.tag !== '/map/module' && this.momentmunuList.tag !== '/mapEdit')
      )
    },
    isTitleFocus(munuitem) {
      return this.momentTitle === munuitem.url || (munuitem.children && munuitem.children.some(item => this.momentTitle === item.url))
    },
    goLocalConf() {
      this.$router.push('/localConf')
    },
    changeMap(item) {
      const routerPath = this.$route.fullPath
      this.setActiveMapConfig(item)
      this.setIsMapOuter(true)
      this.clearPointvideoList()
      if (routerPath === '/map/2D') {
        this.setIsMapOuter(true)
      } else if (routerPath === '/mapEdit/2D') {
        this.initPage('gridEditPage')
        this.setIsMapOuter(true)
        let getAllGrid = this.getGrid(item.mapId)
        let getAllBuild = this.getBuild(this.activeMapConfig.mapId)
        Promise.all([getAllGrid, getAllBuild])
          .then(res => {})
          .catch(err => {
            console.log(err)
          })
      } else if (routerPath === '/map/3D') {
        this.$router.replace({ path: '/map/2D' }) // 路由替换
        // location.href = location.origin + '/mapEdit/2D' // 刷新指定地址
      } else if (routerPath === '/mapEdit/3D') {
        this.$router.replace({ path: '/mapEdit/2D' }) // 路由替换
        // location.href = location.origin + '/mapEdit/2D' // 刷新指定地址
      }
      this.SET_EDIT_RIGHT_PAGE_STATE({ page: '', detail: 'show' })
    },
    initPage(val) {
      if (val) {
        this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: val, detail: 'show' })
      }
      this.$store.commit('SET_AREA_ADD', false)
    },
    changePasswordFun() {
      this.getSafeSet()
        .then(res => {
          this.password.visible = true
          this.passwordType = res.data.passwordType
        })
        .catch(err => {
          if (this.tipErrorConfig.show) {
            this.$Notice.error({
              title: '提示',
              desc: '获取参数失败',
              duration: this.tipErrorConfig.dur
            })
          }
          console.log('getPlatform err:' + err)
        })
    },
    // 打开退出登录的确认按钮
    exitShow() {
      this.exitFlag = true
    },
    // 关闭修改密码的弹框
    closeAlert() {
      this.password.visible = false
    },
    changeDutyShow() {
      this.changeDutyUser.name = ''
      this.changeDutyUser.password = ''
      this.changeDutyUser.notes = ''
      this.getDutyUserNameList()
        .then(res => {
          // 交接班字段
          let data = res.data
          this.dutyUserList = data.users
          this.dutyInfo.alarmProcess = `未处理 ${data.undealAlarm} 条，`
          this.dutyInfo.alarmProcessAll = `总共 ${data.allAlarm} 条`
          this.dutyInfo.receiveAlarmProcess = `未处理 ${data.undealTask} 条，`
          this.dutyInfo.receiveAlarmProcessAll = `总共 ${data.allTask} 条`
          this.dutyInfo.logbook = `${data.logCount} 条`
          this.dutyInfo.raw = data
          this.changeDutyModal = true
        })
        .catch(() => {
          this.$Notice.error({
            title: '失败',
            desc: '获取交接班人员失败'
          })
        })
    },
    // 交接班登录
    changeDuty() {
      this.$refs.changeDutyUser.validate(valid => {
        if (valid) {
          // TODO 在这里添加交班人员信息
          const dutyInfoRaw = this.dutyInfo.raw

          const param = {
            name: this.changeDutyUser.name.replace(/(^\s*)|(\s*$)/g, ''),
            pwd: this.$CryptoJS.MD5(this.changeDutyUser.password.replace(/(^\s*)|(\s*$)/g, '')).toString(),
            user: sessionStorage.getItem('userId'),
            takeUser: this.$lodash.findLast(this.dutyUserList, user => {
              return user.name === this.changeDutyUser.name
            })._id,
            allTask: dutyInfoRaw.allTask,
            undealTask: dutyInfoRaw.undealTask,
            logCount: dutyInfoRaw.logCount,
            allAlarm: dutyInfoRaw.allAlarm,
            undealAlarm: dutyInfoRaw.undealAlarm,
            remark: this.changeDutyUser.notes,
            normalCount: dutyInfoRaw.normalCount,
            videoCount: dutyInfoRaw.videoCount,
            intelligentCount: dutyInfoRaw.intelligentCount,
            alarmHelpCount: dutyInfoRaw.alarmHelpCount,
            fireAlarmCount: dutyInfoRaw.fireAlarmCount,
            singleCount: dutyInfoRaw.singleCount,
            systemExceptionCount: dutyInfoRaw.systemExceptionCount,
            manualAlarmCount: dutyInfoRaw.manualAlarmCount
          }

          this.testUserInfo(param)
            .then(res => {
              if (res.data.code === 0) {
                this.$Notice.error({
                  title: '失败',
                  desc: '接班人密码错误'
                })
              } else {
                const paramsLog = {
                  logType: '操作日志',
                  module: '业务管理',
                  operateName: '交接班',
                  operateContent: `${this.usernameIfo} ${this.changeDutyUser.name}`
                }
                this.recordLog(paramsLog)

                this.logoutFun()
                  .then(() => {
                    return this.loginFun(param)
                  })
                  .then(data => {
                    if (data.code === 200) {
                      this.changeDutyModal = false
                      document.cookie = 'Authorization=Bearer ' + data.access_token
                      this.setMainMenu(data.actionTree)
                      this.getPlatform().catch(err => {
                        console.log('this.getPlatform:' + err)
                      })
                      this.$Notice.success({
                        title: '成功',
                        desc: '交接班成功'
                      })
                      // 不刷新 模块tab栏 没了
                      window.location.reload()
                    } else {
                      this.$Notice.error({
                        title: '失败',
                        desc: '交接班登录失败'
                      })
                    }
                  })
              }
            })
            .catch(() => {
              this.$Notice.error({
                title: '失败',
                desc: '登录服务出错'
              })
            })
        }
      })
    },
    // 交接班登录取消
    dutyModalCancel() {
      this.$refs.changeDutyUser.resetFields()
      this.changeDutyModal = false
    },
    bacImgErr(e) {
      e.target.src = '/static/image/home/logoMenu.png'
    },
    backPopTime() {
      this.headerChild = false
      this.pullDownFlag = false
    },
    closeDrop() {
      this.duty = read('duty')
      this.disabled = false
      this.pullDownFlag = true
    },
    openDrop() {
      this.disabled = true
      this.pullDownFlag = false
    },
    skipTo(path, focusMenu) {
      this.headerChild = false
      let isFocusModule = focusMenu ? this.momentTitle === focusMenu.url || (focusMenu.children && focusMenu.children.some(item => this.momentTitle === item.url)) : false // 是否是焦点模块
      let isNowModule = this.momentTitle.indexOf(MAPMODE.mapType3D.fengMap.toLowerCase()) > -1 ? isFocusModule : location.href === location.origin + path // 是否是当前模块
      if (!isNowModule) { // 不是当前路模块时
        this.momentTitle = path
        const momentMenuArr = path.split('/')
        this.momentMenu = '/' + momentMenuArr[1]
        if (path !== '/navigation' && !this.mapApplyUrls.includes(path) && !this.mapEditUrls.includes(path)) {
          this.$router.replace({ path: path })
          this.clearPointvideoList()
        } else {
          if (path === '/mapEdit/param') {
            this.$router.replace({ path: path })
            this.clearPointvideoList()
          } else {
            if (path.indexOf(MAPMODE.mode3D) >= 0) { // 跳转模块为3D地图时，需要判断3D地图类型
              let map3DType = this.mapModeSetting.map3DType ? this.mapModeSetting.map3DType : MAPMODE.mapType3D.superMap
              if (map3DType === MAPMODE.mapType3D.fengMap) {
                const pathArr = path.split('/')
                path = '/' + pathArr[1] + '/' + MAPMODE.mapType3D.fengMap.toLowerCase()
              }
            }
            // 从其他页面跳到导航后刷新页面，清除缓存
            this.$root.$destroy()
            this.$nextTick(() => {
              setTimeout(() => {
                const obj = {}
                saveState.forEach(item => {
                  obj[item] = store.state[item] || {}
                })
                save('state', JSON.stringify(obj))
                location.href = location.origin + path
              }, 0)
            })
          }
        }
      }
    },
    getName(e) {
      if (e.target.getAttribute('name')) {
        if (
          e.target.getAttribute('name') === 'faceRecognition' ||
          e.target.getAttribute('name') === 'peopleTraffic' ||
          e.target.getAttribute('name') === 'videoStructured' ||
          e.target.getAttribute('name') === 'vehicleRecognize' ||
          e.target.getAttribute('name') === 'securityMonitor' ||
          e.target.getAttribute('name') === 'sysConf'
        ) {
          this.headerChild = true
          this.tileleft = 315 + parseInt(this.themeListLength.indexOf(e.target.getAttribute('name'))) * 105
          if (e.target.getAttribute('name') === 'videoStructured') {
            this.titleHeight = 60
            this.titleWidth = 190
          } else if (e.target.getAttribute('name') === 'peopleTraffic') {
            this.titleHeight = 60
            this.titleWidth = 260
          } else if (e.target.getAttribute('name') === 'securityMonitor') {
            let heightFlag = 0
            if (this.securityMonitorrole.videoMonitor && this.securityMonitorrole.videoMonitor.flag) {
              heightFlag = heightFlag + 90
            }
            if (this.securityMonitorrole.playback && this.securityMonitorrole.playback.flag) {
              heightFlag = heightFlag + 90
            }
            if (this.securityMonitorrole.alarmManage && this.securityMonitorrole.alarmManage.flag) {
              heightFlag = heightFlag + 90
            }
            if (this.securityMonitorrole.map && this.securityMonitorrole.map.flag) {
              heightFlag = heightFlag + 44
            }
            this.titleHeight = heightFlag
            this.titleWidth = 240
          } else if (e.target.getAttribute('name') === 'vehicleRecognize') {
            if (this.vehicleList.length > 4) {
              this.titleHeight = 108
            } else {
              this.titleHeight = 54
            }
            this.titleWidth = 330
          } else if (e.target.getAttribute('name') === 'sysConf') {
            if (this.sysList.length > 8) {
              this.titleHeight = 162
            } else if (this.sysList.length > 4) {
              this.titleHeight = 108
            } else {
              this.titleHeight = 54
            }
            this.titleWidth = 330
          } else if (e.target.getAttribute('name') === 'faceRecognition') {
            this.titleHeight = 54
            this.titleWidth = 330
          }
        } else if (e.target.getAttribute('name') === 'homePage' || e.target.getAttribute('name') === '8') {
          this.headerChild = false
        }
        this.tabName = e.target.getAttribute('name')
      }
    },
    IsFullScreen() {
      return document.body.scrollHeight === window.screen.height && document.body.scrollWidth === window.screen.width
    },
    // 全屏
    fullScreen() {
      // wfx@ 2018-3-30 App.vue上有准确的是否全屏属性
      if (this.fullScreenflag) {
        this.fullScreenflag = false
        this.exitFullscreen()
      } else {
        this.requestFullscreen()
        this.fullScreenflag = true
      }
    },
    /**
     * 页面尺寸改变事件
     * 解决360浏览器全屏模式下keydown事件不触发问题
     */
    resizeFn() {
      if (
        !(
          document.fullscreenEnabled ||
          window.fullScreen ||
          document.webkitIsFullScreen ||
          document.msFullscreenEnabled
        ) &&
        this.fullScreenflag
      ) {
        this.fullScreen()
      }
    },
    // 锁定账户
    lockAccout() {
      this.pullDownFlag = false
    },
    doLogout() {
      this.logoutFun()
        .then(() => {
          location.replace(location.origin + '/login')
        })
        .catch(err => {
          console.log('loginout err' + err)
        })
    },
    changePassword() {
      this.$refs.password.validate(valid => {
        if (valid) {
          this.password.visible = false
          // userResource.changePassword({ id: this.userId }, this.password.form).then(res => {
          //   this.$notify.success(this.$t('header._password.afterChange'))
          //   this.password.visible = false
          //   setTimeout(() => {
          //     this.doLogout()
          //   }, 2000)
          // }).catch((err) => {
          //   console.log('changePassword err' + err)
          // })
        }
      })
    },
    jumpAlarmUrl() {
      if (this.allAlarmNewOneData.eventType === 'fireAlarm' || this.allAlarmNewOneData.eventType === 'fireFailure') {
        this.$router.replace('/fire/control')
      } else {
        this.$router.replace('/warning/receive')
        this.SET_WARN_RANG(this.allAlarmNewOneData.tabIndex)
      }
      this.alarmUrlRight = false
      this.clearNavWarningData({}).catch(err => {
        console.log('clearNavWarningData:', err)
      })
      this.showAlarm = false
    },
    pageJudge(navVal) {
      let pageVal = ''
      if (navVal === '/fire/control') {
        pageVal = 'fireAlarmPage'
        if (this.allAlarmNewOneData.eventType === 'fireAlarm' || this.allAlarmNewOneData.eventType === 'fireFailure') {
          this.alarmUrlRight = false
        } else {
          this.alarmUrlRight = true
        }
      } else if (navVal === '/warning/receive') {
        pageVal = 'alarmPage'
        if (this.allAlarmNewOneData.eventType !== 'fireAlarm' && this.allAlarmNewOneData.eventType !== 'fireFailure') {
          this.alarmUrlRight = false
        } else {
          this.alarmUrlRight = true
        }
      } else {
        this.alarmUrlRight = true
        pageVal = 'notAlarmPage'
      }
      this.navAlarmPage(pageVal).catch(err => {
        console.log('navAlarmPage', err)
      })
      this.fireAlarmPage(pageVal).catch(err => {
        console.log('fireAlarmPage', err)
      })
    },
    clearPointvideoList() {
      // 清空四窗口播放视频参数 2D && 3D
      this.CHANGE_POINT_VIDEO_LIST([])
      this.CLEAR_ACTIVEMODEL_ID()
      this.SET_VIDEO_LIST([])
      this.CLEAR_ACTIVEMODEL_ID_3D()
    }
  },
  created() {
    this.fullScreenflag = false
    this.clientVersion = CLIENT_VERSION
    this.usernameIfo = readMulti([STORE_KEY_USERNAME])[0]
    this.loginTime = read('loginTime')
    this.roleType = read('roleType')
    this.duty = read('duty')
    moment.locale('zh_CN')
    this.titleTime = moment().format('YYYY-MM-DD') + ' ' + moment().format('dddd')
    const routerPath = read('routerPath')
    this.pageJudge(routerPath)
    let momentMenuArr = routerPath.split('/')
    if (momentMenuArr[1] === 'home' || momentMenuArr[1] === 'maintenance') {
      this.momentTitle = '/' + momentMenuArr[1]
    } else {
      this.momentTitle = '/' + momentMenuArr[1] + '/' + momentMenuArr[2]
    }
    this.momentMenu = '/' + momentMenuArr[1]
    if (this.styleState) {
      this.fontfamily = this.getMenuStyle.fontfamily || this.fontfamily
      this.fontSize = this.getMenuStyle.fontSize || this.fontSize
      this.fontColor = this.getMenuStyle.fontColor || this.fontColor
      this.fontWeight = this.getMenuStyle.fontWeight || this.fontWeight
      this.fontItalic = this.getMenuStyle.fontItalic || this.fontItalic
      this.fontRegular = this.getMenuStyle.fontRegular || this.fontRegular
      this.uploadColor = this.getMenuStyle.uploadColor || this.uploadColor
      this.fontUnderline = this.getMenuStyle.fontUnderline || this.fontUnderline
      this.imgIfoLogo = this.getMenuStyle.uploadLogoPicture || '/static/image/home/logoMenu.png'
      // this.imgIfoLogo = '/static/image/home/logoMenu.png'
      this.imgIfoName = this.getMenuStyle.name || '校园监控综合管理平台'
    }
    this.getTwoImensionalInfo() // 获取地图模式设置信息
  }
}
</script>
<style lang='less' scoped>
.navigation {
  position: relative;
  top: 0;
  transition: all 0.3s ease;
  z-index: 9999;
  &.active-shrink {
    position: fixed;
    top: -72px;
    width: 100%;
    z-index: 1000;
  }
  .btn-shrink {
    position: absolute;
    bottom: -16px;
    left: 50%;
    margin-left: -43px;
    width: 86px;
    height: 16px;
    z-index: 1000;
    cursor: pointer;
    overflow: hidden;
    .shape {
      width: 86px;
      border: 16px solid transparent;
      border-top: 16px solid #0f2343;
    }
    .icon {
      position: absolute;
      top: 4px;
      left: 50%;
      margin-left: -3px;
    }
  }
  .disabled-cover {
    position: absolute;
    top: 0;
    left: 0;
    height: 72px;
    width: 100%;
    z-index: 9999;
  }
}

.forbidden-color {
  color: #aaa;
}

.password-header {
  width: 100%;
  height: 50px;
  font-size: 16px;
  color: #fff;
  background-color: #0f2343;
}

.password-body {
  margin: 20px;
}

.trigon {
  position: absolute;
  top: -10px;
  left: 90px;
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-bottom: 10px solid #3c5073;
}
.trigons {
  position: absolute;
  top: -10px;
  left: 135px;
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-bottom: 10px solid #3c5073;
}
.alert-header,
.alert-footer {
  height: 50px;
}

.alert-body {
  height: 100px;
  position: relative;
}

.special-item {
  margin-right: 20px;
}

.pull-down-list {
  height: 41px;
  padding: 11px 0 0 20px;
  cursor: pointer;
  z-index: 999999;
}

.use-color:hover {
  background-color: #657ca8;
}
iframe {
  padding: 0;
  margin: 0;
  border: 0;
  background-color: transparent;
  width: 100%;
  height: 100%;
}
.pull-down iframe,
.list-box {
  z-index: 2;
  background-color: transparent;
  position: absolute;
  z-index: 3;
  font-size: 14px;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 1px solid #446294;
  .showInfor {
    width: 100%;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.pull-down {
  position: absolute;
  z-index: 999999;
  top: 70px;
  right: 170px;
  height: 83px;
  width: 100px;
  .list-box {
    height: auto;
    background-color: #1b3153;
  }
}

.pull-down-exit {
  width: 400px;
  height: 170px;
}

.pull-down-change {
  width: 500px;
  height: 400px;
}

.pull-down-password {
  position: absolute;
  z-index: 999999;
  position: absolute;
  // left: calc(50% - 165px);
  left: calc(50%);
  margin-left: -165px;
  top: 160px;
}

.pull-down-password iframe,
.pull-down-password .list-box {
  border-radius: 5px;
  background-color: #1c3053;
  position: absolute;
  z-index: 3;
  font-size: 14px;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 1px solid #0f1e3d;
}

.pull-down-edition {
  position: absolute;
  z-index: 999999;
  top: 70px;
  right: 107px;
  height: 83px;
  width: 210px;
}
.pull-down-edition iframe,
.pull-down-edition .list-box {
  padding: 10px;
  z-index: 2;
  background-color: #3c5073;
  position: absolute;
  z-index: 3;
  font-size: 12px;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 1px solid #3c5073;
  border-radius: 5px;
}
.alarm-pull-down {
  position: absolute;
  z-index: 999999;
  top: 70px;
  right: 335px;
  height: 110px;
  width: 255px;
}
.alarm-pull-down .list-box {
  padding: 10px;
  z-index: 2;
  background-color: #3c5073;
  position: absolute;
  z-index: 3;
  font-size: 12px;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 1px solid #3c5073;
  border-radius: 5px;
}
.modal-mask {
  position: fixed;
  min-width: 1200px;
  z-index: 1;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
}

.modal-mask-alert {
  position: fixed;
  min-width: 1200px;
  z-index: 1;
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #0f1e3d;
  filter: alpha(Opacity=60);
  -moz-opacity: 0.6;
  opacity: 0.6;
}

.video-box-ul {
  height: 54px;
  border-bottom: 1px solid #0f1e3d;
}

.any-header-title {
  height: 42px;
  border-bottom: 1px solid #0f1e3d;
}

.any-header-title2 {
  height: 70px;
  border-bottom: 1px solid #0f1e3d;
}

.any-header-title1 {
  height: 54px;
  border-bottom: 1px solid #0f1e3d;
}

.header-logo {
  line-height: 31px;
  float: left;
  width: 560px;
  padding: 18px 5px 0 20px;
  overflow: hidden;
}

.header-menu {
  float: left;
}

.header-info {
  line-height: 70px;
  float: right;
}
.header-info .alarmImg {
  position: absolute;
  top: 0px;
  right: 436px;
  font-size: 24px;
  color: #aaa;
}
.header-info .alarmImgAction {
  position: absolute;
  top: 0px;
  right: 436px;
  font-size: 25px;
}

.theme-container {
  min-width: 1400px;
  height: 72px;
  position: relative;
  z-index: 9998;
  // margin-bottom: 16px;
}

.logo-img {
  float: left;
  height: 25px;
  width: 200px;
  margin: 3px;
  text-align: center;
}

.theme-box {
  height: 70px;
  line-height: 70px;
  display: block;
  margin: 0;
  outline: 0;
  list-style: none;
  position: relative;
}

.theme-item {
  float: left;
  position: relative;
  cursor: pointer;
  z-index: 3;
  transition: all 0.2s ease-in-out;
  width: 100px;
}

.theme-item-notfirst {
  padding: 0 0 0 20px;
  margin: 0 10px 0 0;
}

.more-item {
  position: absolute;
  z-index: 99999;
  top: 70px;
}

.more-item iframe,
.sharePanelBox {
  background-color: transparent;
  position: absolute;
  z-index: 3;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 1px solid #0f1e3d;
  /*box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.35);
  -moz-box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.35);
  -webkit-box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.35);*/
}

.active {
  color: #fda54b;
}

.video-box {
  font-size: 14px;
}

.video-item {
  float: left;
  margin: 18px;
  position: relative;
  cursor: pointer;
  z-index: 3;
  transition: all 0.2s ease-in-out;
}

.capacity-child li {
  padding: 14px 0px 0px 20px;
  cursor: pointer;
  float: left;
}

.capacity-child1 li {
  padding: 10px 0px 0px 20px;
  cursor: pointer;
  float: left;
}

.header-title {
  float: left;
  padding-left: 10px;
  overflow: hidden;
}

.line-box {
  float: left;
  width: 0;
  height: 180px;
  margin: 10px 10px 0 50px;
  border-right: 2px solid #e0e0e0;
}

.more-item li:hover,
.theme-container li:hover {
  color: #fda54b;
}

.span-title {
  clear: both;
  margin: 20px 0px 0px 20px;
}

.someControlList .user-name {
  height: 40px;
  display: inline-block;
  text-align: center;
  width: 85px;
}

.someControlList {
  height: 26px;
  line-height: 26px;
  display: inline-block;
  line-height: 26px;
  text-align: center;
}

.someControlList:hover {
  cursor: pointer;
}
.nabla {
  width: 16px;
  position: absolute;
  top: 45%;
  right: -5px;
  border: 8px solid transparent;
  border-top: 8px solid #fff;
}
.map-list {
  position: absolute;
  left: 3px;
  width: 100px;
  z-index: 99999;
  div {
    width: 100%;
    height: 38px;
    text-align: center;
    line-height: 38px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  div:hover {
    background-color: #657ca8;
  }
}
</style>
