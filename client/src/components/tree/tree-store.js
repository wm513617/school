// const pinyin = require('chinese-to-pinyin')
import Vue from 'vue'

const re = /(b|p|m|f|d|t|n|l|g|k|h|j|q|x|zh|ch|sh|r|z|c|s|y|w|a|e)|((b|p|m|f|d|t|n|l|g|k|h|j|q|x|zh|ch|sh|r|z|c|s|y|w|a|e)(a|o|e|i|u|ao|iu|ei|ui|ou|iu|ie|an|en|in|un|ang|eng|ing|ong))/g

export default class TreeStore {
  constructor(options, mapDate) {
    for (const option in options) {
      if (options.hasOwnProperty(option)) {
        this[option] = options[option]
      }
    }
    this.datas = new Map()
    const _traverseNodes = (root) => {
      for (const node of root) {
        this.datas.set(node._id, node)
        if (node.children && node.children.length > 0) { _traverseNodes(node.children) }
      }
    }
    if (this.root && !mapDate) {
      _traverseNodes(this.root)
    }
  }

  changeCheckStatus(node) {
    const _traverseUp = (node) => {
      if (node.checked && node.pid) {
        const parent = this.getNode(node.pid)
        parent.checked = this.sameSilibingChecked(node.pid, node._id)
        _traverseUp(parent)
      } else {
        if (!node.checked && node.pid) {
          const upparent = this.getNode(node.pid)
          upparent.checked = false
          if (upparent.pid) {
            _traverseUp(upparent)
          }
        }
      }
    }

    const _traverseDown = (node) => {
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          child.checked = node.checked
          _traverseDown(child)
        }
      }
    }
    _traverseUp(node)
    _traverseDown(node)
  }
  changeCheckHalfStatus(node) {
    // let flag = false
    // 如果勾选的是子节点，父节点默认打上勾
    const _traverseUp = (node, flag = false) => {
      let parent = null
      if (node.checked) { // 打钩
        if (node.pid) {
          parent = this.getNode(node.pid)
          if (!parent) { return }
          if (flag) {
            parent.checked = true
            parent.nodeSelectNotAll = true
            _traverseUp(parent, true)
          } else {
            parent.checked = true
            parent.nodeSelectNotAll = this.sameSilibingHalfChecked(true, parent, node.pid, node._id) === 'half' // 返回true则全钩，false为半钩
            _traverseUp(parent)
          }
        }
      } else { // 去钩
        if (node.pid) {
          parent = this.getNode(node.pid)
          if (!parent) { return }
          if (this.sameSilibingHalfChecked(false, parent, node.pid, node._id) === 'none') { // 返回true则全没钩，false为半钩
            parent.checked = false
            parent.nodeSelectNotAll = false
          } else {
            parent.checked = true
            parent.nodeSelectNotAll = true
          }
          _traverseUp(parent, true)
        }
      }
    }
    const _traverseDown = (node) => {
      if (node.children && node.children.length > 0) {
        if (node.nodeSelectNotAll) { // 节点没勾选
          node.nodeSelectNotAll = false
        }
        for (const child of node.children) {
          child.checked = node.checked
          _traverseDown(child)
        }
      }
    }
    _traverseUp(node)
    _traverseDown(node)
  }
  sameSilibingChecked(pid, currentId) {
    const parent = this.datas.get(pid)
    const sbIds = []
    if (parent && parent.children) {
      parent.children.forEach(x => {
        if (x._id !== currentId) { sbIds.push(x._id) }
      })
    }
    for (const _id of sbIds) {
      const node = this.getNode(_id)
      if (!node.checked) { return false }
    }
    return true
  }
  sameSilibingHalfChecked(status, parent, pid, currentId) {
    const sbIds = []
    const currentNode = this.getNode(currentId)
    if (parent && parent.children) {
      parent.children.forEach(x => {
        if (!currentNode.nodeSelectNotAll && x._id !== currentId) { sbIds.push(x._id) } // 除去当前节点的剩下节点
      })
    }
    if (status) { // 打钩
      if (sbIds.length !== 0) {
        for (const _id of sbIds) { // 子节点只要有一个被选中则父框打黑，全选打钩，全没有被选无状态
          const node = this.getNode(_id)
          if (!node.checked || node.nodeSelectNotAll) { // 节点没勾选
            return 'half' // 表示父框半钩的状态
          }
        }
      } else {
        if (currentNode.nodeSelectNotAll) {
          return 'half' // 表示全钩的状态
        }
      }
      return 'all' // 表示全钩的状态
    } else { // 去钩
      if (sbIds.length !== 0) {
        for (const _id of sbIds) { // 子节点只要有一个被选中则父框打黑，全选打钩，全没有被选无状态
          const node = this.getNode(_id)
          if (node.checked || node.nodeSelectNotAll) { // 有节点被勾选，父框半钩的状态
            return 'half'
          }
        }
      } else {
        if (currentNode.nodeSelectNotAll) {
          const sbChecks = parent.children.filter(x => x.checked) // 兄弟节点是否有选中的
          if (!sbChecks.length) { return 'none' }
          return 'half' // 表示全钩的状态
        }
      }
      return 'none'
    }
  }
  isExitParent(parent) {
    if (parent._id) {
      // return this.getNode(node.pid)
      return this.getNode(parent._id)
    }
    return null
  }
  isNullOrEmpty(world) {
    if (world) {
      return world.trim().length === 0
    }
    return true
  }
  filterNodes(keyworld, searchOptions) {
    let count = 0
    let num = 0
    const _filterNode = (val, node) => {
      if (!val) { return true }
      if (!node.name) { return false }
      if (searchOptions.onlyLeaf && !node.eid) {
        return false
      }
      const match = node.wordFilter.filter((f, i) => {
        const has = f ? f.indexOf(keyworld) : -1
        if (has === -1) {
          return false
        } else {
          num++
          if (i === 1 || i === 2) {
            if (!(re.test(keyworld))) { return false }
          } else if (i === 3) {
            if (keyworld !== f || keyworld === 0) { return false }
          }
          return true
        }
        // return has !== -1
      }).length
      if (match) {
        count++
        return true
      } else {
        return false
      }
      // if (searchOptions.useEnglish) {
      //   return node.name.indexOf(val) !== -1
      // } else {
      //   return this.toPinYin(node.name, searchOptions.useInitial).indexOf(this.toPinYin(keyworld.toLowerCase(), searchOptions.useInitial)) !== -1
      // }
    }

    const _syncNodeStatus = (node) => {
      if (node.pid) {
        const parentNode = this.getNode(node.pid)
        if (!parentNode) { return }
        if (node.visible) {
          parentNode.visible = node.visible
          if (parentNode.visible) {
            parentNode.open = true
          }
          _syncNodeStatus(parentNode)
        }
      }
    }
    const filterFunc = (searchOptions.customFilter && typeof searchOptions.customFilter === 'function') ? searchOptions.customFilter : _filterNode
    this.datas.forEach(node => {
      node.visible = filterFunc(keyworld, node)
      node.searched = false
      if (node.visible) {
        node.open = true
        if (!this.isNullOrEmpty(keyworld)) {
          if (!searchOptions.onlyLeaf || node.eid) {
            node.searched = true
          }
        }
        _syncNodeStatus(node)
      }
    })
    return (keyworld ? (count || (num ? -1 : count)) : 1)
  }
  syncOffline(node) {
    if (node.children) {
      node.children.forEach(res => {
        const n = this.getNode(res._id)
        if (n) { n.status = res.status }
      })
    }
    if (node.children) {
      node.children.forEach(c => this.syncOffline(c))
    }
  }
  getNode(key) {
    return this.datas.get(key)
  }
  toPinYin(keyworld, useInitial) {
    if (/^[a-zA-Z]/.test(keyworld)) {
      return keyworld
    }
    const fullpinyin = Vue.pinyin(keyworld, {
      filterChinese: true,
      noTone: true
    })
    if (useInitial) {
      let res = ''
      fullpinyin.split(' ').forEach(w => {
        if (!(/[a-zA-Z]/.test(w))) {
          res += w
        } else {
          res += w.slice(0, 1)
        }
      })
      return res
    }
    return fullpinyin
  }
}
