/* eslint-disable new-cap */
/* eslint-disable no-undef */
import { mapGetters, mapActions } from 'vuex'
import { RESICONOID, MPSIGNKEY } from 'assets/2DMap/meta/common'
import { addPoint, addLayer, markerTypes } from 'assets/fengMap/meta/pointData.js'
export default {
  data() {
    return {
      commonAlarmOid: RESICONOID.commonAlarm
    }
  },
  computed: {
    ...mapGetters('fengMap', ['commonAlarmfmResourceArr', 'commonAlarm'])
  },
  watch: {
    commonAlarm(flag) { // 普通报警点位显隐
      this.changeCommonAlarmLayerState(flag)
    },
    commonAlarmfmResourceArr: {
      handler(arr) {
        this.addfmCommonAlarmPoint(arr)
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('fengMap', [
      'savefmResourcePoint'
    ]),
    initfmCommonAlarmLayers() { // 初始化添加不同类型的图层
      const layerName = 'layer' + this.commonAlarmOid
      this[layerName] = new fengmap.FMImageMarkerLayer()
      this.fmgroup.addLayer(this[layerName])
      addLayer(this[layerName]._scene.id, {type: this.commonAlarmOid, markerType: markerTypes.marker})
      this[layerName].show = this.commonAlarm // 图层默认显隐
    },
    addCommonAlarmMarkers(obj) { // 添加点位
      const gpos = obj.gpos.split(',')
      const im = new fengmap.FMImageMarker({
        x: gpos[0], // 标注x坐标点
        y: gpos[1], // 标注y坐标点
        url: obj.icon, // 设置图片路径
        size: 32, // 设置图片显示尺寸
        height: gpos[2] || 5 // 标注高度，大于model的高度
      })
      const layer = 'layer' + obj.type
      if (!this[layer]) {
        this.initfmCommonAlarmLayers()
      }
      this[layer].addMarker(im)
      // 将marker ID 与 资源ID 绑定存储到 全局变量
      addPoint(markerTypes.marker, obj.type, {id: im.renderNode.id, channelId: obj.id})
    },
    drawPoint(item, iconFiles) {
      let icon
      let files
      if (item.point && item.point.mid && item.point.mid.files) {
        files = item.point.mid.files
      } else {
        files = iconFiles
      }
      files && files.map(item => { if (item.status === 'online') { icon = item.path } })
      this.addCommonAlarmMarkers({
        gpos: item.point.loc,
        icon: icon,
        type: this.commonAlarmOid,
        id: item._id
      })
    },
    addfmCommonAlarmPoint(arr) { // 获取默认图标，添加 type类 所有的点位
      this.queryDefaultfmIconByOid(this.commonAlarmOid).then(res => {
        for (let i = 0; i < arr.length; i++) {
          this.drawPoint(arr[i], res.files)
        }
      }).catch(err => {
        console.log('common alarm icon:', err)
      })
    },
    changeCommonAlarmLayerState(val) { // 控制显隐
      if (this['layer' + this.commonAlarmOid]) { this['layer' + this.commonAlarmOid].show = val }
    },
    addCommonAlarmResToMap(coods) { // 添加普通报警资源到地图中
      const loc = coods.split(',')
      let point = {
        principal: [{ name: '', mobile: '' }],
        loc: loc[0] + ',' + loc[1],
        isouter: this.isfmOuter,
        mid: this.defaultfmPointIcon,
        projection: this.mapProjection // 当前地图投影坐标系
      }
      point.mapId = this.activeFMap
      let resData = JSON.parse(JSON.stringify(this.selectedFMapPointRes))
      resData.mapsign = {signflag: true, signtype: MPSIGNKEY.point}
      resData.point = point
      this.savefmResourcePoint({ _id: resData._id, body: resData }).then(res => {
        this.successMsg('普通报警点位添加成功')
        this.addCommonAlarmMarkers({
          gpos: coods,
          icon: this.defaultfmPointIcon.files[0].path,
          type: this.commonAlarmOid,
          id: resData._id
        })
        this.setPointStatus()
        this.updatePointTreeCount('alarm')
      }).catch(err => {
        this.$Modal.confirm({
          title: '警告',
          content: '<p>' + err.response.data.message + '</p>'
        })
      })
    }
  }
}
