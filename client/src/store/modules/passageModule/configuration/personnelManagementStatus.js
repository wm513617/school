import {get, post, remove} from "../../../../http/base";


const state = {
  controlAuthorityGroup:[
    {name:'门禁权限',value:'1'},
    {name:'人脸权限',value:'2'},
  ]
}
const getters = {

}
const mutations = {

}

const actions = {
  addPersonManagement({commit}, payload) {
    var param;
    if (!payload.isEdit) {
      param = {
        body: payload.param,
        url: '/through/users/create'
      };
    } else {
      param = {
        body: payload.param,
        url: '/through/users/edit'
      };

    }
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },
  addBottomBankFuc({commit}, payload) {
    var param = {
      body: payload,
      url: '/veriface/user'
    };
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res.data._id)
      }).catch(err => reject(err))
    })
  },

  setUserVeriFace({commit}, payload) {
    var param = {
      body: payload.param,
      url: '/through/users/setUserVeriFace'
    };
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res.data)
      }).catch(err => resolve(payload.name))
    })
  },

  // async addBottomBankFunc(){
  //
  // },
  getPersonManagementList({commit}, payload) {
    var param = {
      query: payload,
      url: '/through/users/getList'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },



  deletePersonManagement({commit}, payload) {
    var param = {
      body: {arr: payload},
      url: '/through/users/delete'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },

  //用户机构修改

  orgModify({commit}, payload) {
    var param = {
      body: payload,
      url: '/through/users/orgModify'
    };
    console.log(JSON.stringify(payload))
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },

  // 用户同步
getOneCard({commit}, payload) {
  var param = {
    body: "",
    url: '/through/users/getOneCard'
  };
  return new Promise((resolve, reject) => {
    post(param).then(res => resolve(res.data)).catch(err => reject(err))
  })
},

  // 解析图片后批量添加用户

  batchImportUser({commit}, payload) {
    var param = {
      body: payload,
      url: '/through/users/batchImportUser'
    };
    console.log(JSON.stringify(payload))
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },

  deleteFileImage({commit}, payload) {
    var param = {
      query: payload,
      url: '/through/users/deleteFileImage'
    };
    return new Promise((resolve, reject) => {
      remove(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },


  deleteAllUser({commit}, payload) {
    var param = {
      body: payload,
      url: '/through/users/deleteAllUser'
    };
    console.log(JSON.stringify(payload))
    return new Promise((resolve, reject) => {
      remove (param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },

  // 导出获取下载包历史资源
  zipList({commit}, payload){
    var param = {
      body: "",
      url: '/through/users/zipList'
    };
    return new Promise((resolve, reject) => {
      get(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },

  // 将对应的用户图片打成ZIP包
  zipUser({commit}, payload) {
    var param = {
      body: payload,
      url: '/through/users/zipUser'
    };
    console.log(JSON.stringify(payload))
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },
  // 根据文件名，下载ZIP包
  downZip({commit}, payload) {
    var param = {
      body: '',
      url: '/through/users/downZip/ '+ payload
    };
    console.log(JSON.stringify(payload))
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },
  // 根据文件名，删除ZIP包
  deleteZip({commit}, payload) {
    var param = {
      body: payload,
      url: '/through/users/deleteZip'
    };
    console.log(JSON.stringify(payload))
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },
  // 用户导出excel
  exportExcelUser({commit}, payload) {
    var param = {
      body: payload,
      url: '/through/users/exportExcelUser'
    };
    console.log(JSON.stringify(payload))
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },
  // 删除机构下对应的人员  deleteOrgUser
  deleteOrgUser({commit}, payload) {
    var param = {
      body: payload,
      url: '/through/users/deleteOrgUser'
    };
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },
}
export default {
  state,
  mutations,
  actions,
  getters
}
