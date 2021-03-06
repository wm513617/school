/**
 * 设备管理门/通道相关逻辑
 * @time:2019-7-15
 * @author:MeiChen
 */
const doorModule = require('./door.model')
const guardModel = require('./guard.model')
const common = require('./common')
const Org = mongoose.model('Org')
module.exports = {
  async asyncDoor (ctx, next) { // 从中控系统中同步门/通道数据
    let serverConfig = await common.getServerConfig(1)
    let getDoor = async () => {
      let options = {
        method: 'GET',
        url: `http://${serverConfig.ip}:${serverConfig.port}/api/door/list?pageNo=1&pageSize=1000&access_token=${serverConfig.token}`
      }
      let data = JSON.parse(await common.request(options))
      return data.data
    }
    try {
      let guardData = await guardModel.find()
      let zktecoData = await getDoor()
      zktecoData.forEach((door) => { // 通过设备ID判断门禁和门的子从关系
        guardData.forEach((guard) => {
          if (door.deviceId === guard.id) {
            door.org = guard.orgId
            door.guardData = guard._id
          }
        })
      })
      let zktecoIdList = zktecoData.map((item) => {
        return item.id
      })
      let dbDataMore = await doorModule.find({ // 查询出数据库中比中控多出的数据
        'id': {
          $nin: zktecoIdList
        }
      }).lean(true)
      let removeList = dbDataMore.map((item) => {
        return item._id
      })
      await doorModule.remove({ '_id': { $in: removeList } })
      let dbData = await doorModule.find().lean(true)
      if (dbData.length) {
        dbData.forEach((db, i) => { // 求出中控与本地数据库的差集
          zktecoData.forEach((zkteco, j) => {
            if (db.id === zkteco.id) {
              zktecoData.splice(j, 1)
            }
          })
        })
      }
      await doorModule.create(zktecoData)
      let options = {
        method: 'GET',
        url: 'http://127.0.0.1:20000/api/through/zkteco/asyncRead'
      }
      let data = JSON.parse(await common.request(options))
      if (data.code === 200) {
        ctx.body = {
          code: 200,
          message: '同步读头成功'
        }
      } else {
        ctx.body = {
          code: 500,
          message: '同步读头失败'
        }
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '读写门/通道数据错误' })
    }
  },
  async doorList (ctx, next) { // 获取门/通道列表
    async function getDoorStatus () { // 获取全部门当前的状态
      let time = Date.parse(new Date())
      let serverConfig = await common.getServerConfig(1)
      let options = {
        method: 'GET',
        url: `http://${serverConfig.ip}:${serverConfig.port}/api/door/allDoorState?timestamp=${time}&access_token=${serverConfig.token}`
      }
      let data = JSON.parse(await common.request(options))
      return data.data
    }
    let pageSize = parseInt(ctx.query.pageSize)
    let pageNum = parseInt(ctx.query.pageNum)
    let orgIdArr = [ctx.query.orgId] // 机构ID数组
    let findDbData = {}
    let query = ctx.request.query
    if (query.showChildren === 'true') { // 如果显示子机构下的数据
      orgIdArr = await common.getOrgList(ctx, query.orgId, orgIdArr)
    }
    if (query.keyWord) { // 如果有搜索
      let keyStr = new RegExp(query.keyWord.trim(), 'i') // 不区分大小写
      findDbData.$or = [
        { 'name': { $regex: keyStr } }
      ]
    }
    findDbData.org = {
      $in: orgIdArr
    }
    try {
      let count = await doorModule.countDocuments(findDbData)
      let data = await doorModule.find(findDbData, null, {
        skip: (pageNum - 1) * pageSize,
        limit: pageSize
      }).populate('org').populate('guardData').sort({ '_id': -1 }).lean(true)
      let doorStatus = await getDoorStatus()
      doorStatus.forEach((door) => {
        data.forEach((item) => {
          if (item.id === door.id) {
            item.alarm = door.alarm
            item.connect = door.connect
          }
        })
      })
      // let formatting = formaFn(data)
      ctx.body = {
        code: 200,
        data: data,
        count: Math.ceil(count / pageSize),
        length: count,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '获取数据失败' })
    }
  },
  async openDoor (ctx, next) { // 通过ID远程开门
    // http://serverIP:serverPort/api/door/remoteCloseById?doorId={doorId}&access_t oken={apitoken}
    let options = {
      method: 'POST',
      url: 'http://192.168.22.53:20000/api/through/zkteco/closeDoor',
      body: {
        id: '123123123123'
      },
      json: true
    }
    // let data = await common.request(options)
    ctx.body = {
      code: 200,
      message: '',
      data: ctx.request.body
    }
  },
  async closeDoor (ctx, next) { // 通过ID远程关门
    // http://serverIP:serverPort/api/door/remoteCloseById?doorId={doorId}&access_t oken={apitoken}
    ctx.body = {
      code: 200,
      message: ''
    }
  },
  async openTimeLang (ctx, next) { // 通过ID远程常开
    // http://serverIP:serverPort/api/door/remoteOpenById?doorId={doorId}&interval ={interval}&access_token={apitoken}
    ctx.body = {
      code: 200,
      message: ''
    }
  },
  async getDoorTree (ctx, next) { // 获取树状门
    let orgArray = await Org.find({ type: 11 }).lean(true) // 拿到所以机构
    for (let i = 0; i < orgArray.length; i++) {
      let item = orgArray[i]
      let doorArr = await doorModule.find({ org: item._id }) // 查出此机构下的所有门
      item['children'] = []
      if (doorArr.length > 0) {
        doorArr.map(doorItem => { // 将门信息转为tree所需数据，放入此机构下
          let doorObj = {
            label: doorItem.name,
            type: 'door',
            id: doorItem._id,
            icon: 'el-icon-success'
          }
          item['children'].push(doorObj)
        })
      }
    }
    let rootOrg = orgArray.filter(item => {
      return item.isroot === true
    })[0]
    let DoortreeData = childTree(orgArray, rootOrg)
    // let obj={};
    //  uc([DoortreeData],obj,1)
    //   function uc(arr,obj,i) {
    //     arr.map(item=>{
    //       if(!obj[i+'a']){
    //         obj[i+'a']=[];
    //       }
    //       obj[i+'a'].push(item)
    //       if(item.children&&item.children.length>0){
    //         uc(item.children,obj,i+1)
    //
    //       }
    //     })
    //   }
    ctx.body = {
      code: 200,
      data: DoortreeData,
      message: ''
      // obj:obj
    }
    /**
     * @method        childTree      传入总机构和上级机构，根据此pid得到上级机构下的子机构和此机构下的门信息
     * @param         arr---机构数组
     * @return         {
     *     name:''      机构或者门的名称
     *     children:[]   子机构或门
     *     type:'org'    类型（org-组织，door-门）
     * }
     * @example*/
    function childTree(orgArray, prevOrg) {
      let oneObj = {
        label: prevOrg.name,
        children: [],
        type: 'org',
        icon: 'iconfont icon-organise',
        id: prevOrg._id
      }
      if (prevOrg.children) {
        oneObj.children = prevOrg.children
      }
      let childOrg = orgArray.filter(Item => { // 如果该机构不是最下面的叶子机构，则继续向下匹配
        return mongoose.Types.ObjectId(Item.pid).toString() === mongoose.Types.ObjectId(prevOrg._id).toString()
        // return Item.pid===prevOrg._id;
      })
      if (childOrg.length > 0) {
        childOrg.map(childItem => {
          let orgT = childTree(orgArray, childItem)
          oneObj.children.push(orgT)
        })
      }
      return oneObj
    }
  }
}
