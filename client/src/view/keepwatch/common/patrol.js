const patrol = {
  selectPoint: function(arr, treeData) {
    treeData.map(obj => {
      if (obj.children && obj.children.length) {
        patrol.selectPoint(arr, obj.children)
      } else {
        arr.map(point => {
          if (point.pointId === obj._id) {
            obj.checked = true
          }
        })
      }
    })
    return treeData
  },
  selectSender: function(arr, treeData) {
    treeData.map(obj => {
      if (obj.children && obj.children.length) {
        patrol.selectSender(arr, obj.children)
      } else {
        arr.map(item => {
          if (item.userId === obj._id) {
            obj.checked = true
          }
        })
      }
    })
    return treeData
  },
  clearCheckedTreeNode: function(arr) {
    arr.map(item => {
      item.checked = false
      item.nodeSelectNotAll = false
      if (item.children && item.children.length > 0) {
        patrol.clearCheckedTreeNode(item.children)
      }
    })
  }
}

export default patrol
