// import * as types from './mutation-types'
const state = {
  offset: 0
}
const mutations = {
  PRE_PAGE(state, offset) {
    state.offset -= offset
  },
  // 分页 下一页
  NEXT_PAGE(state, offset) {
    state.offset += offset
  },
  // 分页 跳转到指定页码
  GO_PAGE(state, offset) {
    console.log(54354)
    state.offset = offset
  }
}
export default ({
  state,
  mutations
})
