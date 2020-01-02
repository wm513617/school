const veriface = {
  selectTreeData: (arr, treeData) => {
    treeData.map(obj => {
      if (obj.children && obj.children.length) {
        veriface.selectTreeData(arr, obj.children)
      } else {
        arr.map(item => {
          if (item === obj._id) {
            obj.checked = true
          }
        })
      }
    })
    return treeData
  },
  checkedAllNode: node => {
    for (const i in node) {
      node[i].checked = true
      if (node[i].children && node[i].children.length) {
        veriface.checkedAllNode(node[i].children)
      }
    }
  }
}
export default veriface
