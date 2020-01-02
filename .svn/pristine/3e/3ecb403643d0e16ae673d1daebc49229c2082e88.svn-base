import {
  AV_RECORD_LIST,
  AV_NVRRECORD_LIST
} from '../../../../http/video.api.js'
import {
  mapMutations
} from 'vuex'

let id = 0
let pageId = 0
const QUERY_ROWS = 100 // 分页条数总控
export default {
  data() {
    return {
      // 分页查询的队列
      pageRquestList: [],
      isStartPageRequest: false
    }
  },
  methods: {
    ...mapMutations(['CONCAT_RESOURCE']),
    // 此方法用于时间轴超区间的额外查询
    extraQuery(param, index) {
      const p = this.$lodash.cloneDeep(param)
      if (p.eventType[0] === 'recordFlag') {
        p.eventType[0] = 'all'
        p.typeName = ''
      }
      return new Promise(async(resolve, reject) => {
        try {
          const rs1 = await this.pageRequest(p, index)
          resolve(rs1)
        } catch (e) {
          reject(e)
        }
      })
    },
    // 刚点击时查询的时间轴段
    requestQuery(param, index) {
      // 作为删除队列的id
      param.queryId = id++
      const p = this.$lodash.cloneDeep(param)
      const p2 = this.$lodash.cloneDeep(p)
      if (this.isNVR) {
        p.sTime = p.time
        p2.eTime = p2.time
      } else {
        if (p.eventType[0] === 'recordFlag') {
          p.eventType[0] = 'all'
          p.typeName = ''
        }
        p.startTime = p.time
        p2.endTime = p2.time
      }
      return new Promise(async(resolve, reject) => {
        try {
          const rs2 = await this.pageRequest(p2, index)
          const rs1 = await this.pageRequest(p, index)
          const data = rs1.data.result || rs1.data
          const data2 = rs2.data.result || rs2.data
          data.total += data2.total
          if (this.isNVR) {
            data.recordInfo = data.recordInfo.concat(data2.recordInfo)
          } else {
            data.eventList = data.eventList.concat(data2.eventList)
          }
          data.queryTimeArr = [{
            start: param.startTime,
            end: param.endTime
          }]
          resolve(rs1)
        } catch (e) {
          reject(e)
        }
      })
    },
    pageRequest(p, index) {
      this.stopPageRequest()
      pageId++
      p.rows = QUERY_ROWS
      return new Promise((resolve, reject) => {
        this.getRequestAPI(p).then(suc => {
          const data = suc.data.result || suc.data
          if (data) {
            let total = data.total
            const rows = data.rows || data.rowCount
            if (total > 1500) {
              console.log('data total大于1500')
              total = 1500
            }
            const totalPage = Math.ceil(total / rows)
            if (totalPage > 1) {
              // 存好要查询剩下分页的队列
              this.pushPageRequest(p, totalPage, 2, index, pageId)
              this.startPageRequest()
            }
            resolve(suc)
          } else {
            reject(suc)
          }
        }).catch(e => {
          reject(e)
        })
      })
    },
    pushPageRequest(param, allPage, startPage, index, pageId) {
      let i = allPage
      while (i >= startPage) {
        this.pageRquestList.push({
          id: param.queryId,
          param,
          page: i,
          failCount: 0,
          index,
          pageId
        })
        i--
      }
    },
    startPageRequest() {
      if (this.isStartPageRequest) {
        return
      }
      this.isStartPageRequest = true
      this.singlePageRequest()
    },
    stopPageRequest() {
      this.isStartPageRequest = false
    },
    deletePageRequest(id) {
      this.pageRquestList = this.pageRquestList.filter(item => {
        return item.id !== id
      })
    },
    _deletePageRequestByPageId(pageId) {
      this.pageRquestList = this.pageRquestList.filter(item => {
        return item.pageId !== pageId
      })
    },
    clearPageRequest() {
      this.pageRquestList = []
      this.stopPageRequest()
    },
    singlePageRequest() {
      const info = this.pageRquestList.pop()
      if (!info) {
        this.stopPageRequest()
        return
      }
      const requestParam = this.$lodash.cloneDeep(info.param)
      if (this.isNVR) {
        requestParam.rowId = info.page
      } else {
        requestParam.page = info.page
      }
      this.getRequestAPI(requestParam).then(suc => {
        const data = suc.data.result
        if ((data.eventList || data.recordInfo).length) {
          // 合并结果
          this.CONCAT_RESOURCE({
            index: info.index,
            item: data
          })
        } else {
          // 后端错误优化，查询不到后面的了
          console.log('录像分页查询后端返回数据为空数组')
          this._deletePageRequestByPageId(info.pageId)
        }
        this.singlePageRequest()
      }).catch(e => {
        // 失败了 重新放进去
        info.failCount++
        if (info.failCount < 3) {
          this.pageRquestList.push(info)
        }
        this.singlePageRequest()
      })
    },
    getRequestAPI(param) {
      if (this.isNVR) {
        return AV_NVRRECORD_LIST(param)
      } else {
        return AV_RECORD_LIST(param)
      }
    }
  },
  beforeDestroy() {
    this.clearPageRequest()
  }
}
