<!--应用模式 右边的概况介绍页面 -->
<template>
  <div class="mapAppInfo">
    <bs-scroll ref="scroller">
      <div class="mapAppInfoTittle">
        <div class="mapAppVideoTittle">
          <div class="reback">{{oneMapInfo.mapName}}</div>
        </div>
      </div>
      <div class="_infoTop">
        <!-- 地图概要 -->
        <div class="infoTopMain">
          <div class="infoTopMainTitle">
            <div class="infoTopMainTitleLeft">地图概要</div>
            <div class="infoTopMainTitleRight"></div>
          </div>
          <div class="infoTopMainBottom">
            <mapInfoChart></mapInfoChart>
          </div>
        </div>
        <!-- 警情统计 -->
        <div class="infoTopMain">
          <div class="infoTopMainTitle">
            <div class="infoTopMainTitleLeft">警情统计</div>
            <div class="infoTopMainTitleRight" @click="openAlarm">详情</div>
          </div>
          <div class="infoTopMainBottom">
            <!-- <WarningChart></WarningChart> -->
            <alarmingInfoChart></alarmingInfoChart>
          </div>
        </div>

        <!-- 快速定位 -->
        <div class="infoTopMain">
          <div class="infoTopMainTitle">
            <div class="fast-found">快速定位</div>
            <div class="flex-x float-right" @click="turnChange">
              <div class="infoTopMainTitleLeft mar-r-5">换一批</div>
              <div class="infoTopMainTitleLeft iconfont icon-f5"></div>
            </div>
          </div>

          <div class="infoTopMainBottom">
            <bs-scroll ref="scroller0">
              <!-- 视频 -->
              <div v-if="fastPosition.ipcs.length > 0" class="infoBottomLine">
                <div class="areaClass" v-for="(item, index) in fastPosition.ipcs" :key="index" :title="item.name" @click="fastIntoIpc(item)">{{item.name}}</div>
              </div>
              <!-- 楼宇 -->
              <div v-if="fastPosition.buildings.length > 0" class="infoBottomLine">
                <div class="areaClass" v-for="(item, index) in fastPosition.buildings" :key="index" :title="item.name" @click="fastIntoBuilding(item)">{{item.name}}</div>
              </div>
              <!-- 网格 -->
              <div v-if="fastPosition.grids.length > 0" class="infoBottomLine">
                <div class="areaClass" v-for="(item, index) in fastPosition.grids" :key="index" :title="item.name" @click="fastIntoGrid(item)">{{item.name}}</div>
              </div>
              <!-- 防区 -->
              <div v-if="fastPosition.fires.length > 0" class="infoBottomLine">
                <div class="areaClass" v-for="(item, index) in fastPosition.fires" :key="index" :title="item.name" @click="fastIntoFire(item)">{{item.name}}</div>
              </div>
              <!-- 巡更 -->
              <div v-if="fastPosition.patrols.length > 0" class="infoBottomLine">
                <div class="areaClass" v-for="(item, index) in fastPosition.patrols" :key="index" :title="item.devName" @click="fastIntoPatrol(item)">{{item.devName}}</div>
              </div>
            </bs-scroll>
          </div>
        </div>
      </div>
    </bs-scroll>
  </div>
</template>
<script>
// import WarningChart from '../../../homePage/WarningChart'
import alarmingInfoChart from './alarmingInfoChart'
import mapInfoChart from './mapInfoChart'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  components: {
    // WarningChart,
    mapInfoChart,
    alarmingInfoChart
  },
  data() {
    return {
      // 快速定位
      fastPosition: {
        grids: [],
        buildings: [],
        ipcs: [],
        fires: [],
        patrols: []
      },
      lineShowNum: 4, // 快速定位一行显示的个数
      screenHeight: document.body.clientHeight // 监听屏幕比例变化
    }
  },
  computed: {
    ...mapState({
      activeMap: ({ mapGisData }) => mapGisData.activeMap,
      oneMapInfo: ({ mapGisData }) => mapGisData.oneMapInfo,
      allZoneList: ({ mapAreaData }) => mapAreaData.allZoneList, // 快速定位
      // appAlarmCheck: ({ mapAlarmData }) => mapAlarmData.appAlarmCheck, // 消防点位勾选状态
      isAppOuter: ({ mapAreaData }) => mapAreaData.isAppOuter
    })
  },
  watch: {
    screenHeight(val) {
      // console.log(val)
      this.update()
    },
    activeMap(val) {
      this.turnChange()
    },
    // 快速定位中的数据
    allZoneList(val) {
      if (val) {
        let object = JSON.parse(JSON.stringify(val))
        this.fastPosition.grids = this.changeShowContent(object.grids)
        this.fastPosition.buildings = this.changeShowContent(object.buildings)
        this.fastPosition.ipcs = this.changeShowContent(object.ipcs)
        this.fastPosition.fires = this.changeShowContent(object.fires)
        this.fastPosition.patrols = this.changeShowContent(object.patrols)
      }
    }
  },
  methods: {
    ...mapActions([
      'getOnePatrol',
      'getAllZone',
      'getAllMaPZone',
      'getOneGrid',
      'getOneBuild',
      'getBuildStatData',
      'getLevel',
      'getOnePoint',
      'getOneAlarm',
      'getOneLevel'
    ]),
    ...mapMutations([
      'SET_MAPAPPRIGHT_PAGE',
      'SET_APPDETAIL_STATE',
      'SET_ISAPPOUTER_STATE',
      'SET_EDITDETAIL_STATE',
      'SET_APPRAPID_POSITION'
    ]),
    openAlarm() {
      this.$store.commit('SET_MAPAPPRIGHT_PAGE', 'alarmList')
    },
    // 换一批
    turnChange() {
      this.getAllMaPZone(this.activeMap)
        .then(res => {})
        .catch(err => {
          console.log(err)
        })
      // 地图概要的统计数据
      this.getAllZone(this.activeMap)
        .then(res => {
          // this.statChartOptions = appStatis.allZoneStaticPop()
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 滚动条高度变化
    update() {
      this.$refs.scroller.update()
    },
    // 当数组中的元素超过4个的时候，随机的
    changeShowContent(obj) {
      if (obj.length > 4) {
        let num = Math.floor(obj.length / this.lineShowNum)
        let k = num - 1
        let remainder = (obj.length % this.lineShowNum) + ''
        if (remainder !== '0') {
          k = k + 1
        }
        let random = Math.floor(Math.random() * (k + 1))
        if (random !== k) {
          return obj.slice(4 * random, 4 * (random + 1))
        } else {
          return obj.slice(4 * random, 4 * random + parseInt(remainder))
        }
      } else {
        return obj
      }
    },
    // 快速定位网格
    fastIntoGrid(val) {
      // 获取网格信息
      this.getOneGrid(val._id)
        .then(res => {})
        .catch(err => {
          this.errorMsg('参数获取失败')
          console.log(err)
        })
    },
    // 快速定位楼宇
    fastIntoBuilding(val) {
      // 获取楼宇信息
      this.getOneBuild(val._id)
        .then(res => {
          let loc = res.center.split(',')
          let position = {
            lon: loc[0],
            lat: loc[1]
          }
          this.$store.commit('SET_APPRAPID_POSITION', position)
        })
        .catch(err => {
          this.errorMsg('参数获取失败')
          console.log(err)
        })
    },
    // 快速定位ipc
    fastIntoIpc(val) {
      // 获取点位信息
      this.getOnePoint(val._id)
        .then(res => {
          let loc = res.point.loc.split(',')
          let position = {
            lon: loc[0],
            lat: loc[1]
          }
          if (!res.point.isouter) {
            let sid = res.point.sid
            // 获取楼层信息
            this.$store.commit('SET_FLOOR_ID', sid)
            this.$store.commit('SET_ISAPPOUTER_STATE', false)
            this.getOneLevel(sid)
              .then(res => {
                this.$store.commit('SET_APPRAPID_POSITION', position)
                this.$nextTick(() => {
                  this.$store.commit('SET_APPDETAIL_STATE', 'pointApp')
                })
              })
              .catch(err => {
                this.errorMsg('参数获取失败')
                console.log('getOneLevel', err)
              })
          } else {
            this.$store.commit('SET_APPRAPID_POSITION', position)
            this.$store.commit('SET_APPDETAIL_STATE', 'pointApp')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 快速定位消防
    fastIntoFire(val) {
      // if (!this.appAlarmCheck) {
      //   return
      // }
      this.getOneAlarm(val._id)
        .then(res => {
          let loc = res.point.loc
          let coods = loc.split(',')
          let position = {
            lon: coods[0],
            lat: coods[1]
          }
          if (res.point.isouter) {
            this.$store.commit('SET_APPRAPID_POSITION', position)
            this.$store.commit('SET_APPDETAIL_STATE', 'alarmApp')
          } else {
            let sid = res.point.sid
            // 获取楼层信息
            this.$store.commit('SET_FLOOR_ID', sid)
            this.$store.commit('SET_ISAPPOUTER_STATE', false)
            this.getOneLevel(sid)
              .then(res => {
                this.$store.commit('SET_APPRAPID_POSITION', position)
                this.$nextTick(() => {
                  this.$store.commit('SET_APPDETAIL_STATE', 'alarmApp')
                })
              })
              .catch(err => {
                this.errorMsg('参数获取失败')
                console.log('getOneLevel', err)
              })
          }
        })
        .catch(err => {
          console.log(err)
          this.errorMsg('防区信息获取失败')
        })
    },
    fastIntoPatrol(val) {
      this.getOnePatrol(val._id)
        .then(res => {
          let loc = res.point.geo
          let coods = loc.split(',')
          let position = {
            lon: coods[0],
            lat: coods[1]
          }
          if (!res.point.sid) {
            this.$store.commit('SET_APPRAPID_POSITION', position)
            this.$store.commit('SET_APPDETAIL_STATE', 'patrolApp')
          } else {
            let sid = res.point.sid
            // 获取楼层信息
            this.$store.commit('SET_FLOOR_ID', sid)
            this.$store.commit('SET_ISAPPOUTER_STATE', false)
            this.getOneLevel(sid)
              .then(res => {
                this.$store.commit('SET_APPRAPID_POSITION', position)
                this.$nextTick(() => {
                  this.$store.commit('SET_APPDETAIL_STATE', 'patrolApp')
                })
              })
              .catch(err => {
                this.errorMsg('参数获取失败')
                console.log('getOneLevel', err)
              })
          }
        })
        .catch(err => {
          console.log(err)
          this.errorMsg('防区信息获取失败')
        })
    }
  },
  created() {
    // 加载快速定中的数据
    this.turnChange()
  },
  mounted() {
    // const that = this
    this.resizeFn = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        this.screenHeight = window.screenHeight
      })()
    }
    window.addEventListener('resize', this.resizeFn)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFn)
    this.resizeFn = null
  }
}
</script>
<style scoped>
.mapAppInfo {
  color: #ddd;
  font-size: 12px;
  background-color: #1c3053;
  width: 300px;
  border-radius: 5px;
  display: flex;
  flex: 1;
  flex-direction: column;
  cursor: default;
  /* overflow-y: scroll; */
}
.mapAppInfo .mapAppInfoTittle {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  /* border-radius: 5px; */
  background-color: #1c3053;
}
.mapAppVideoTittle {
  height: 38px;
  line-height: 38px;
  width: 100%;
  text-align: center;
  cursor: default;
  clear: both;
  border-radius: 5px;
}
.mapAppVideoTittle .reback {
  float: left;
  margin: 0 24px;
}
.mapAppVideoTittle .detail {
  float: right;
  margin: 0 10px;
}
._infoTop {
  /* display: block !important; */
  flex: 1;
  flex-direction: column;
  padding: 5px 10px;
}
.infoTop .infoTopMain {
  width: 100%;
  height: 260px;
  display: block;
}
.infoTop .infoTopMain .infoTopMainTitle {
  width: 100%;
  height: 40px;
  line-height: 40px;
  clear: both;
}
.infoTop .infoTopMain .infoTopMainTitle .infoTopMainTitleRight {
  float: right;
  /* margin-right: 20px; */
  cursor: pointer;
}
.infoTop .infoTopMain .infoTopMainTitle .infoTopMainTitleRight:hover {
  color: #20adff;
}
.infoTopMainBottom {
  border: 1px solid #5676a9;
  height: 220px;
  width: 100%;
  padding-left: 1px;
  clear: both;
  border-radius: 4px;
}
.infoTopMainBottom .infoBottomLine {
  height: 40px;
  line-height: 40px;
  width: 100%;
  margin-top: 5px;
  margin-bottom: 5px;
  display: inline-block;
}
.infoTopMainBottom .infoBottomLine .areaClass {
  display: inline-block;
  margin: 0px 3px;
  border: 1px solid #5676a9;
  border-radius: 5px;
  height: 40px;
  /* width: 62px; */
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
}
.infoTopMainBottom .infoBottomLine .areaClass:hover {
  color: #20adff;
}
.flex-x {
  display: flex;
  flex: 1;
  flex-direction: row;
  height: 40px;
  line-height: 40px;
  float: right;
}
.fast-found {
  height: 40px;
  line-height: 40px;
  margin-right: 10px;
  float: left;
}
.mar-r-5 {
  margin-right: 5px;
}
</style>
