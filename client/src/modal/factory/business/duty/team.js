// 班组列表
import _ from 'lodash'

class Team {
  constructor(team) {
    this._init(team)
  }
  _init(team) {
    this.expand = true // 是否展开树
    this.children = _.get(team, 'children', null)
    this.title = _.get(team, 'name', '-')
    this.id = _.get(team, '_id', null)
    this.pid = _.get(team, 'pid', null)
    this.number = _.get(team, 'code', null)
    this.isroot = _.get(team, 'isroot', false)
  }
}

export default Team
