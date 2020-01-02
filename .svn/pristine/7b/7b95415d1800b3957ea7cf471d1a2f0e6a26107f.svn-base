function toTree(oldTree, arr, id, isOrg) {
  if (!oldTree || oldTree[0] === 'undefined' || oldTree.children === 'undefined') {
    return
  }
  oldTree.forEach((item) => {
    if (item) {
      let obj = {}
      // for (const i in item) {
      //   obj[i] = item[i]
      // }
      obj = JSON.parse(JSON.stringify(item))
      // if (!item.pid) { obj.pid = id }
      obj.pid = id
      if (!obj.isOrg && obj.isOrg !== false) {
        obj.isOrg = isOrg
      }
      arr.push(obj)
      if (item.children && item.children.length > 0) {
        obj.children = []
        toTree(item.children, obj.children, item._id, !item.creator)
      }
      if (item.devices && item.devices.length > 0) {
        if (!obj.children) {
          obj.children = []
        }
        delete obj.devices
        toTree(item.devices, obj.children, item._id, true)
      }
      if (item.channels && item.channels.length > 0) {
        if (!obj.children) {
          obj.children = []
        }
        delete obj.channels
        toTree(item.channels, obj.children, item._id, true)
      }
      if (item.resources && item.resources.length > 0) {
        if (!obj.children) {
          obj.children = []
        }
        delete obj.resources
        toTree(item.resources, obj.children, item._id, false)
      }
      if (item.point && item.point.length > 0) {
        if (!obj.children) {
          obj.children = []
        }
        obj.point = []
        toTree(item.point, obj.children, item._id, false)
      }
      if (item.user && item.user.length > 0) {
        if (!obj.children) {
          obj.children = []
        }
        obj.user = []
        toTree(item.user, obj.children, item._id, false)
      }
      if (item.res && item.res.length > 0) {
        if (!obj.children) {
          obj.children = []
        }
        obj.res = []
        toTree(item.res, obj.children, item._id, false)
      }
    }
  })
}
export default function(data) {
  // let newTree = []
  // toTree(data, newTree, null, true)
  // return newTree
  return data
}
