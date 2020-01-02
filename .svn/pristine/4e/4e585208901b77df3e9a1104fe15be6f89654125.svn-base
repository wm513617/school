const state = {
  videosl: [{
    isActive: true,
    Pluginobj: {},
    startRecod: false,
    session: '',
    alarm: false,
    startCord: false,
    key: 3
  },
  {
    isActive: false,
    Pluginobj: {},
    startRecod: false,
    session: '',
    alarm: false,
    startCord: false,
    key: 4
  },
  {
    isActive: false,
    Pluginobj: {},
    startRecod: false,
    session: '',
    alarm: false,
    startCord: false,
    key: 5
  },
  {
    isActive: false,
    Pluginobj: {},
    startRecod: false,
    startCord: false,
    session: '',
    alarm: true,
    key: 6
  },
  {
    isActive: false,
    Pluginobj: {},
    startRecod: false,
    startCord: false,
    session: '',
    alarm: false,
    key: 7
  },
  {
    isActive: false,
    Pluginobj: {},
    startRecod: false,
    startCord: false,
    session: '',
    alarm: false,
    key: 8
  },
  {
    isActive: false,
    Pluginobj: {},
    startRecod: false,
    startCord: false,
    session: '',
    alarm: false,
    key: 9
  },
  {
    isActive: false,
    Pluginobj: {},
    startRecod: false,
    startCord: false,
    session: '',
    alarm: false,
    key: 10
  },
  {
    isActive: false,
    Pluginobj: {},
    startRecod: false,
    startCord: false,
    session: '',
    alarm: false,
    key: 11
  },
  {
    isActive: false,
    Pluginobj: {},
    startRecod: false,
    startCord: false,
    session: '',
    alarm: false,
    key: 12
  },
  {
    isActive: false,
    Pluginobj: {},
    startRecod: false,
    startCord: false,
    session: '',
    alarm: false,
    key: 13
  },
  {
    isActive: false,
    Pluginobj: {},
    startRecod: false,
    startCord: false,
    session: '',
    alarm: false,
    key: 14
  },
  {
    isActive: false,
    Pluginobj: {},
    startRecod: false,
    startCord: false,
    session: '',
    alarm: false,
    key: 15
  },
  {
    isActive: false,
    Pluginobj: {},
    startRecod: false,
    startCord: false,
    session: '',
    alarm: false,
    key: 16
  },
  {
    isActive: false,
    Pluginobj: {},
    startRecod: false,
    startCord: false,
    session: '',
    alarm: false,
    key: 1
  },
  {
    isActive: false,
    Pluginobj: {},
    startRecod: false,
    startCord: false,
    session: '',
    alarm: false,
    key: 2
  }
  ],
  streamPara: { // 预览参数
    'channel': 1,
    'ip': 0,
    'protocol': 1,
    'port': 0,
    'coder': 0
  },
  equipments: [],
  sesseionObj: {}
}
// const getters = {
//   getSessionInfo({ videoObj }) {
//     return state.videoObj
//   }
// }
const getters = {
  gettersession(state) {
    console.log(state.sesseionObj)
    return state.sesseionObj
  },
  getterequ(state) {
    return state.equipments
  }
}

const mutations = {
  SAVESESSION(state, config) {
    state.sesseionObj[config.ip] = config.session
    state.equipments.forEach(function(element) {
      if (element) {
        if (element.ip === config.ip) {
          element.session = config.session
        }
      }
    })
    console.log(state.equipments)
  },
  SETEQUIP(state, config) {
    state.equipments = config
  }
}

export default {
  state,
  mutations,
  getters
}
