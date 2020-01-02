const state = {
  offset: 0
}
const mutations = {
  // 分页 上一页
  PRE_PAGE(state, offset) {
    state.offset -= offset
  },
  // 分页 下一页
  NEXT_PAGE(state, offset) {
    state.offset += offset
  },
  // 分页 跳转到指定页码
  GO_PAGE(state, offset) {
    state.offset = offset
  }
}

export default {
  mutations, state
}
