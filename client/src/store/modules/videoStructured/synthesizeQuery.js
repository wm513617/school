import { get, post, put, remove } from '../../../http/base'
//import axios from 'axios'
/*const storage = window.localStorage
const carDict = storage.getItem('carLogoLists')
if (!carDict) {
  axios.get('api/structure/identify/carStyleDict').then(res => {
    storage.removeItem('carLogoLists')
    storage.setItem('carLogoLists', JSON.stringify(pySort(res.data)))
  }, err => {
    console.log(err)
  })
}*/
const state = {
  searchTypes: [], // 检索分类
  sexLists: [], // 性别列表
  ageLists: [], // 年龄list
  directionLists: [], // 行人方向表
  umbrellaLists: [], // 是否打伞
  hairLists: [], // 发型表
  hatLists: [], // 帽子表
  bigLists: [], // 双肩包
  takeGoodsLists: [], // 拎包表
  hugKidLists: [], // 抱小孩
  makeUpStyle1Lists: [], // 上身纹理
  makeUpStyle2Lists: [], // 上衣类型表
  makeUpStyle3Lists: [], // 上装颜色
  makeDownStyle1Lists: [], // 下衣类型表
  makeDownStyle2Lists: [], // 下装颜色表
  maskLists: [], // 口罩
  glassesLists: [], // 眼镜
  drawBoxLists: [], // 拉杆箱
  drawCarLists: [], // 手推车
  carColorLists: [], // 车辆颜色
  carTypeLists: [], // 车辆类型
  // carLogoLists: [], // 车辆品牌
  carNumberTypeLists: [], // 车牌类型
  carNumberColorLists: [], // 车牌颜色
  vicePassengerLists: [], // 副驾乘客
  callUpLists: [], // 打电话
  roofRackLists: [], // 行李架
  spareLists: [], // 备胎
  safetyBeltLists: [], // 主安全带
  windowUpLists: [], // 天窗
  viceSafetyBeltLists: [], // 副安全带
  ASFlagLists: [], // 年检标
  paperBoxLists: [], // 纸巾盒
  sunShieldLists: [], // 遮阳板
  pendantLists: [], // 吊坠
  damageLists: [], // 撞损
  slagCarLists: [], // 渣土车
  dangerousLists: [], // 危化品
  pedestrainLists: [], // 骑车人
  /** ********三轮车**************/
  threeMotoCeilLists: [], // 带棚
  threeMotoMannedLists: [], // 载人
  oldQueryParams: {} // 查询参数
}
const mutations = {
  setPersonType(state, {type, data}) {
    switch (type) {
      case 'type' : state.searchTypes = data.filter(item => item.Code !== '-1' && item.Code !== '0'); break // 检索分类
      case 'ageCode' : state.ageLists = [...data]; break // 年龄
      case 'bagCode' : state.takeGoodsLists = [{Code: 'all', Name: '全部'}, ...data]; break // 拎包表
      case 'bottomCode' : state.makeDownStyle1Lists = [...data]; break // 下衣类型表
      case 'hairCode' : state.hairLists = [...data]; break // 发型表
      case 'hatCode' : state.hatLists = [{Code: 'all', Name: '全部'}, ...data]; break // 帽子表
      case 'knapsackCode' : state.bigLists = [{Code: 'all', Name: '全部'}, ...data]; break // 双肩包
      case 'orientationCode' : state.directionLists = [...data]; break // 行人方向表
      case 'bottomColorCode' : state.makeDownStyle2Lists = [...data]; break // 下装颜色表
      case 'upperColorCode' : state.makeUpStyle3Lists = [...data]; break // 上装颜色表
      case 'sexCode' : state.sexLists = [{Code: 'all', Name: '全部'}, ...data]; break // 性别表
      case 'umbrellaCode' : state.umbrellaLists = [{Code: 'all', Name: '全部'}, ...data]; break // 是否打伞
      case 'upperCode' : state.makeUpStyle2Lists = [...data]; break // 上衣类型表
      case 'babyCode' : state.hugKidLists = [{Code: 'all', Name: '全部'}, ...data]; break // 抱小孩
      case 'upperTextureCode' :state.makeUpStyle1Lists = [...data]; break // 上身纹理
      case 'maskCode' :state.maskLists = [{Code: 'all', Name: '全部'}, ...data]; break // 口罩
      case 'glassesCode' :state.glassesLists = [{Code: 'all', Name: '全部'}, ...data]; break // 眼镜
      case 'trolleyCaseCode' :state.drawBoxLists = [{Code: 'all', Name: '全部'}, ...data]; break // 拉杆箱
      case 'barrowCode' :state.drawCarLists = [{Code: 'all', Name: '全部'}, ...data]; break // 手推车
      case 'pedestrainCode' :state.pedestrainLists = [{Code: 'all', Name: '全部'}, ...data]; break // 骑车人
      /** ******车辆相关******/
      case 'carColor' :state.carColorLists = [...data]; break // 车辆颜色
      case 'carKindCode' :state.carTypeLists = [...data]; break // 车辆类型
      case 'plateTypeCode' :state.carNumberTypeLists = [...data]; break // 车牌类型
      case 'plateColorCode' :state.carNumberColorLists = [...data]; break // 车牌颜色
      case 'coDriverPersonCode' :state.vicePassengerLists = [{Code: 'all', Name: '全部'}, ...data]; break // 副驾乘客
      case 'callCode' :state.callUpLists = [{Code: 'all', Name: '全部'}, ...data]; break // 打电话
      case 'rackCode' :state.roofRackLists = [{Code: 'all', Name: '全部'}, ...data]; break // 行李架
      case 'spareTireCode' :state.spareLists = [{Code: 'all', Name: '全部'}, ...data]; break // 备胎
      case 'mainDriverBeltCode' :state.safetyBeltLists = [{Code: 'all', Name: '全部'}, ...data]; break // 主安全带
      case 'sunroofCode' :state.windowUpLists = [{Code: 'all', Name: '全部'}, ...data]; break // 天窗
      case 'coDriverBeltCode' :state.viceSafetyBeltLists = [{Code: 'all', Name: '全部'}, ...data]; break // 副安全带
      case 'tagCode' :state.ASFlagLists = [{Code: 'all', Name: '全部'}, ...data]; break // 年检标
      case 'paperCode' :state.paperBoxLists = [{Code: 'all', Name: '全部'}, ...data]; break // 纸巾盒
      case 'sunCode' :state.sunShieldLists = [{Code: 'all', Name: '全部'},...data]; break // 遮阳板
      case 'dropCode' :state.pendantLists = [{Code: 'all', Name: '全部'}, ...data]; break // 吊坠
      case 'crashCode' :state.damageLists = [{Code: 'all', Name: '全部'}, ...data]; break // 撞损
      case 'slagCode' :state.slagCarLists = [{Code: 'all', Name: '全部'}, ...data]; break // 渣土车
      case 'dangerCode' :state.dangerousLists = [{Code: 'all', Name: '全部'}, ...data]; break // 危化品
        /** ************三轮车相关**************/
      case 'convertibleCode' :state.threeMotoCeilLists = [{Code: 'all', Name: '全部'}, ...data]; break // 带棚
      case 'mannedCode' :state.threeMotoMannedLists = [{Code: 'all', Name: '全部'}, ...data]; break // 载人
    }
  },
  setOldQueryParams(state, payload) {
    state.oldQueryParams = payload
  }
  /* getCarLogoDatas(state, payload) {
    state.carLogoLists = JSON.parse(JSON.stringify(payload))
  } */
}
const actions = {
  getDictionary({commit}, {type, data}) {
    if (type !== 'carFamilys') {
      commit('setPersonType', {type, data})
    }
  },
  getQueryDatas({commit}, payload) { // ?page=1&limit=100
    let url = '/structure/identify/search?page=' + payload.page + '&limit=' + payload.limit
    delete payload.page
    delete payload.limit
    return post({url: url, body: payload})
  }
  /* carStyleDict({commit, state}) { // 获取car相关字典
    if (state.carLogoLists.length === 0) {
      get({url: '/structure/identify/carStyleDict'}).then(res => {
        commit('getCarLogoDatas', res.data)
      }, err => {
        console.log(err)
      })
    }
  } */
}

export default {
  state,
  mutations,
  actions,
  namespaced: true
}
