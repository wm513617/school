/* eslint-disable new-cap */
/* eslint-disable no-undef */
import { mapGetters, mapActions } from 'vuex'
import { RESICONOID } from 'assets/2DMap/meta/common'
import { addPoint, addLayer, markerTypes } from 'assets/fengMap/meta/pointData.js'
export default {
  data() {
    return {
      doorOid: RESICONOID.doorControl
    }
  },
  computed: {
    ...mapGetters('fengMap', ['doorfmResourceArr', 'isDoorControl'])
  },
  watch: {
    isDoorControl(flag) { // 门禁点位显隐
      this.changeDoorLayerState(flag)
    },
    doorfmResourceArr: {
      handler(arr) {
        this.addfmDoorPoint(arr)
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('fengMap', [
      'addDoorfmPointRes',
      'getDoorControlFMTree'
    ]),
    initfmDoorLayers() { // 初始化添加不同类型的图层
      const layerName = 'layer' + this.doorOid
      this[layerName] = new fengmap.FMImageMarkerLayer()
      this.fmgroup.addLayer(this[layerName])
      addLayer(this[layerName]._scene.id, {type: this.doorOid, markerType: markerTypes.marker})
      this[layerName].show = this.isDoorControl // 图层默认显隐
    },
    addDoorMarkers(obj) { // 添加点位
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
        this.initfmDoorLayers()
      }
      this[layer].addMarker(im)
      // 将marker ID 与 资源ID 绑定存储到 全局变量
      addPoint(markerTypes.marker, obj.type, {id: im.renderNode.id, channelId: obj.id})
    },
    addfmDoorPoint(arr) { // 获取默认图标，添加 type类 所有的点位
      this.queryDefaultfmIconByOid(this.doorOid).then(res => {
        let icon
        let files = res.files
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].point && arr[i].point.mid && arr[i].point.mid.files) {
            files = arr[i].point.mid.files
          }
          files && files.map(item => { if (item.status === 'open') { icon = item.path } })
          this.addDoorMarkers({
            gpos: arr[i].point.loc,
            icon: icon,
            type: this.doorOid,
            id: arr[i]._id
          })
        }
      }).catch(err => {
        console.log('door icon:', err)
      })
    },
    changeDoorLayerState(val) { // 控制显隐
      if (this['layer' + this.doorOid]) { this['layer' + this.doorOid].show = val }
    },
    addDoorControlResToMap(coods) { // 添加门禁资源到地图中
      const loc = coods.split(',')
      let point = {
        principal: [{ name: '', mobile: '' }],
        loc: loc[0] + ',' + loc[1],
        isouter: this.isfmOuter,
        mid: this.defaultfmPointIcon,
        projection: this.mapProjection
      }
      point.mapId = this.activeFMap
      let resData = JSON.parse(JSON.stringify(this.selectedFMapPointRes))
      resData.point = point
      this.addDoorfmPointRes(resData).then(res => {
        this.addDoorMarkers({
          gpos: coods,
          icon: this.defaultfmPointIcon.files[0].path,
          type: this.doorOid,
          id: resData._id
        })
        this.setPointStatus()
        let query = (!this.isfmOuter && this.currentFloor) ? this.currentFloor._id : null // 查询条件
        this.getDoorControlFMTree(query) // 加载门禁资源树
        this.successMsg('门禁点位添加成功')
      }).catch(err => {
        this.$Modal.confirm({
          title: '警告',
          content: '<p>' + err.response.data.message + '</p>'
        })
      })
    }
  }
}
