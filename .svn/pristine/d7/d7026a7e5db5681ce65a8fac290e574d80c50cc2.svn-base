import _ from 'lodash'

class Personnel {
  constructor(personnel) {
    this._init(personnel)
  }
  _init(personnel) {
    this.number = _.get(personnel, 'code', null)
    this.name = _.get(personnel, 'name', null)
    this.sex = this._sex(personnel)
    this.contact = _.get(personnel, 'phone', null)
    this.teamName = _.get(personnel, 'group.name', null)
    this.teamId = _.get(personnel, 'group._id', null)
    this.department = _.get(personnel, 'department', null)
    this.position = _.get(personnel, 'title', null)
    this.address = _.get(personnel, 'address', null)
    this.id = _.get(personnel, '_id', null)
    this.staffType = _.get(personnel, 'staffType', null)
    this.realname = _.get(personnel, 'realname', null)
    this.photo = _.get(personnel, 'photo', null)
    this.exptime = _.get(personnel, 'exptime', null)
    this.staff = _.get(personnel, 'staff', null)
  }
  _sex(personnel) {
    let raw = _.get(personnel, 'gender', '-')
    if (raw === '-') { return '-' }
    if (raw === 0) { return '女' }
    if (raw === 1) { return '男' }
  }
}

export default Personnel
