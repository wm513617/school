import _ from 'lodash'
import moment from 'moment'

class Plan {
  constructor(plan) {
    this._init(plan)
  }
  _init(plan) {
    this.name = _.get(plan, 'name', '-')
    this.startTime = this._time(_.get(plan, 'startTime', '-'))
    this.endTime = this._time(_.get(plan, 'endTime', '-'))
    this.time = this.startTime + ' 至 ' + this.endTime
    this.template = _.get(plan, 'template.name', '-')
    this.templateId = _.get(plan, 'template._id', null)
    this.templateDetail = _.get(plan, 'template.detail', null)
    this.id = _.get(plan, '_id', null)
    this.order = this._getOrder(_.get(plan, 'group', null))
    this.detail = _.get(plan, 'detail', null)
    this.planType = _.get(plan, 'planType', '-')
    this.planTimeType = _.get(plan, 'planTimeType', '-')
  }
  _time(date) {
    if (date === '-') {
      return date
    } else {
      return moment(date).format('YYYY-MM-DD')
    }
  }
  _getOrder(orderArr) {
    let arr = orderArr.map(order => {
      return {
        name: _.get(order, 'org.name', '-'),
        id: _.get(order, '_id', null),
        org: {
          id: _.get(order, 'org._id', null)
        }
      }
    })
    return arr
  }
}

export default Plan
