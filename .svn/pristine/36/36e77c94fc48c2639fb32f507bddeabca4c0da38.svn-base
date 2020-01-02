import Vue from 'vue'
import {
  lang,
  pageLimit
} from '../../stored'
import {
  save
} from '../../storage'
import {
  STORE_KEY_CONFIG_LANG,
  STORE_KEY_CONFIG_PAGE_LIMIT
} from '../../constants'

const state = {
  lang: lang,
  // value see http://stackoverflow.com/questions/5580876/navigator-language-list-of-all-languages
  langs: [{
    label: '中文',
    value: 'zh-CN'
  }, {
    label: 'English',
    value: 'en'
  }],
  tipWarning: {
    show: true,
    dur: 3 // secs
  },
  tipError: {
    show: true,
    dur: 3 // secs
  },
  pageLimit: pageLimit
}

const mutations = {
  UPDATE(state, config) {
    state.lang = config.lang || state.lang
    state.pageLimit = config.pageLimit || state.pageLimit
  },
  UPDATE_LANG(state, lang) {
    state.lang = lang || state.lang
  },
  UPDATE_TIPWARNING(state, tipw) {
    Object.assign(state.tipWarning, tipw)
  },
  UPDATE_TIPERROR(state, tipw) {
    Object.assign(state.tipError, tipw)
  }
}

const actions = {
  changeLang({
    commit
  }, lang) {
    Vue.config.lang = lang
    commit('UPDATE_LANG', lang)
    save(STORE_KEY_CONFIG_LANG, lang)
  },
  updateGlobalConfig({
    commit,
    state,
    dispatch
  }, config) {
    if (config.lang !== state.lang) {
      Vue.config.lang = config.lang
      save(STORE_KEY_CONFIG_LANG, config.lang)
    }
    commit('UPDATE', config)
    save(STORE_KEY_CONFIG_LANG, state.lang)
    save(STORE_KEY_CONFIG_PAGE_LIMIT, state.pageLimit)
  }
}

const getters = {
  globalConfig(state) {
    return state
  },
  tipWarningConfig(state) {
    return state.tipWarning
  },
  tipErrorConfig(state) {
    return state.tipError
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
