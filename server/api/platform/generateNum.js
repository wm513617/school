/**
 * 生成编码方法,不包括sip域
 */
const mongoose = require('mongoose')
const Org = mongoose.model('Org')
const Resource = mongoose.model('Resource')
const PlatformServer = mongoose.model('PlatformServer')
const OrgRes = mongoose.model('OrgRes')

/**
 *  生成设备编码
 * @param {*} type 设备类型 (ipc/nvr)
 * @param {*} num 生成数量
 */
const generateDevieId = async (type, num) => {
  const dict = {
    ipc: '132',
    alarmIn: '134',
    org: '216'
  }
  const nums = await generateNum(num)
  return nums.map(n => dict[type] + n)
}

exports.generateDevieId = generateDevieId

/**
 * 生成服务器编码
 * @param {Number} num 生成数量
 */
exports.generateServerId = async num => {
  const nums = await generateNum(num)
  return nums.map(n => '200' + n)
}

/**
 * 全局变量中释放已添加过的id
 * @param {*} newIds 已添加过的Id集合
 */
const releaseNum = newIds => {
  global.shareIds = global.shareIds.filter(n => !newIds.includes(n))
}
exports.releaseNum = releaseNum

/**
 * 生成子自定义编号
 * @param {*} num 生成数量
 */
const generateNum = async num => {
  global.shareIds = global.shareIds || [] // 定义全局变量
  const res = await Resource.find({ gbDevId: { $exists: true } }, 'gbDevId').exec()
  const org = await Org.find({ gbDevId: { $exists: true } }, 'gbDevId').exec()
  const shareIds = []
  res.concat(org).forEach(n => {
    shareIds.push(n.gbDevId)
  })
  const testIds = shareIds.concat(global.shareIds) // 原有数据合并上全局的Id值 做为待检测数据集合
  let newIds = []
  for (let i = 0; i < num; i++) {
    newIds = newIds.concat(getNum(testIds))
  }
  global.shareIds = global.shareIds.concat(newIds) // 全局锁住新产生的id,防止id被重复添加
  return newIds
}

const getNum = shareIds => {
  const id = (Math.random() + '').substr(-7)
  let t = []
  if (shareIds.includes(id)) {
    t = getNum(shareIds)
  } else {
    t.push(id)
  }
  return t
}

/**
 * 兼容老数据,给旧数据添加上DeviceId和parentId
 */
exports.orgAndresInitGbDeviceId = async () => {
  const res = await Resource.find({ gbDevId: { $exists: true } }, 'gbDevId').exec()
  const org = await Org.find({ gbDevId: { $exists: true } }, 'gbDevId').exec()
  if (!res.length && !org.length) {
    // 旧数据都不存在 gbDevId
    console.log('gbDevice init finished !')
    const locServer = await PlatformServer.findOne({ type: 'loc' }).exec()
    // 只做视频资源 和报警输入资源
    const ress = await Resource.find({ type: { $in: [0, 9] } }, '_id type').exec()
    const ipcRes = []
    const alarmIn = []
    ress.forEach(n => {
      n.type ? alarmIn.push(n._id) : ipcRes.push(n._id)
    })

    // 资源编码字典,ipc和报警同属资源可以用同一个字典
    const resDict = []
    const resIds = [] // 资源id集合

    // 生成ipc 编码集合
    const ipcNums = await generateDevieId('ipc', ipcRes.length)
    ipcRes.forEach((n, i) => {
      resDict[n._id + ''] = ipcNums[i]
      resIds.push(n._id + '')
    })

    // 生成alarmIn 编码集合
    const alarmNums = await generateDevieId('alarmIn', alarmIn.length)
    alarmIn.forEach((n, i) => {
      resDict[n._id + ''] = alarmNums[i]
      resIds.push(n._id + '')
    })

    // 生成机构编码
    // 这里只取现场视频机构
    const orgDict = {} // 机构编码字典
    const orgs = await Org.find({ type: 0 }, '_id pid isroot').exec()
    const orgNums = await generateDevieId('org', orgs.length)
    orgs.forEach((n, i) => {
      orgDict[n._id + ''] = orgNums[i]
    })

    // 更新集合
    const promiselist = []

    // 添加机构更新集
    orgs.forEach(n => {
      promiselist.push(
        Org.findByIdAndUpdate(n._id, {
          // gbParentDevId: n.isroot ? locServer.serverId : orgDict[n.pid + ''], // 根节点去国标设备平台服务器Id
          gbParentDevId: orgDict[n.pid + ''] || locServer.serverId.substr(10),
          gbDevId: orgDict[n._id + '']
        })
      )
    })
    // const orgUpdateList = orgs.map(n => {
    //   return {
    //     updateOne: {
    //       filter: { _id: n._id },
    //       update: {
    //         gbParentDevId: orgDict[n.pid + ''] || locServer.serverId.substr(10),
    //         gbDevId: orgDict[n._id + '']
    //       }
    //     }
    //   }
    // })
    // Org.bulkWrite(orgUpdateList).exec()

    // 添加资源更新集
    const orgres = await OrgRes.find({ resource: { $in: resIds } }, 'org resource')
      .lean()
      .exec()
    orgres.forEach(n => {
      if (orgDict[n.org + ''] && resDict[n.resource + '']) {
        promiselist.push(
          Resource.findByIdAndUpdate(n.resource, {
            gbParentDevId: orgDict[n.org + ''], // 根节点去国标设备平台服务器Id
            gbDevId: resDict[n.resource + '']
          })
        )
      }
    })
    await Promise.all(promiselist)
    releaseNum(ipcNums.concat(alarmNums, orgNums))
  }
}

/**
 * 资源数据新增时自动添加devicesId
 * @param {*} datas 添加资源集合
 * @param {*} gbParentDevId 父集节点deviceID(机构)
 * @param {*} type 资源类型只支持ipc/nvr/alarm(报警输入)
 */
exports.res = async (datas = [], gbParentDevId, type = 'ipc') => {
  if (!gbParentDevId) {
    throw new Error('gbParentDevId is requried !')
  }
  const resNums = await generateDevieId(type, datas.length)
  datas.forEach((n, i) => {
    n.gbDevId = resNums[i]
    n.gbParentDevId = gbParentDevId
  })
  releaseNum(resNums)
  return datas
}

/**
 * 机构新增时自动添加DeviceID(多条数据)
 * @param {*} datas 添加机构资源集合
 * @param {*} gbParentDevId 父集节点deviceID(若是顶级是添加国标服务器ID),若该值不传的话标识根节点
 */
exports.orgs = async (datas = [], gbParentDevId) => {
  const nums = await generateDevieId('org', datas.length)
  const dict = {}
  datas.forEach((n, i) => {
    dict[n._id] = nums[i]
  })
  datas.forEach(n => {
    n.gbDevId = dict[n._id]
    n.gbParentDevId = dict[n.pid] || gbParentDevId
  })
  // if(gbParentDevId){ // 子节点 指定了gbParentDevId
  //   datas.forEach((n, i) => {
  //     n.gbDevId = nums[i]
  //     n.gbParentDevId = gbParentDevId
  //   })
  // }else{ // 顶级节点  没有指定gbParentDevId 取本级服务器的serverID
  //   const locServer = await PlatformServer.findOne({ type: 'loc' }).exec()
  //   datas.forEach((n, i) => {
  //     n.gbDevId = nums[i]
  //     n.gbParentDevId = locServer.serverId
  //   })
  // }
  releaseNum(nums)
  return datas
}

/**
 *机构新增时自动添加DeviceID(单条数据)
 * @param {*} data 添加机构对象数据(单个对象)
 * @param {*} gbParentDevId 父集节点deviceID
 */
exports.org = async (data, gbParentDevId) => {
  const nums = await generateDevieId('org', 1)
  data.gbDevId = nums[0]
  data.gbParentDevId = gbParentDevId
  return data
}
