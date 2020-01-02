
// const jwt = require('jsonwebtoken')
// const whiteList = require('./whiteList')
// const secrets = require('../../config').backend.secrets
// const store = require('./store')

module.exports = async (ctx, next) => {
  // const req = ctx.request
  await next()
  ctx.state = ctx.state || {}
  // try {
  //   if (checkWhiteList(req, whiteList.whiteList)) {
  //     await next()
  //   } else {
  //     // // token 校验
  //     const checkResult = await checkToken(ctx)

  //     if (!checkResult.code) {
  //       ctx.status = checkResult.status
  //       ctx.body = {
  //         code: checkResult.code,
  //         message: checkResult.message
  //       }
  //       return
  //     } else {
  //       await next()
  //     }
  //   }
  // } catch (error) {
  //   ctx.status = 500
  //   ctx.body = {
  //     colde: 0,
  //     message: error.message
  //   }
  // }
}

// const checkWhiteList = (req, _whilteList) => {
//   const reqUrl = req.url.split('?')[0]

//   let flag = false
//   for (let i = 0; i < _whilteList.length; i++) {
//     const n = _whilteList[i]
//     if (n.url.test(reqUrl) && n.method === req.method) {
//       flag = true
//       break
//     }
//   }
//   return flag
// }

// const appCheckToken = async(ctx) => {
//   const appUrl = '/api/setting/sentry' // 手机app请求地址
//   return !!(appUrl.indexOf(ctx.request.url) > -1)
// }

// const _checkToken = async(ctx) => {
//   try {
//     const tokenStr = ctx.get('Authorization')
//     if (!tokenStr) {
//       return {
//         status: 403,
//         code: 0,
//         message: 'token is wrong !'
//       }
//     }
//     const user = await jwt.verify(tokenStr.replace('Bearer ', ''), secrets.session)
//     return { user: user, isApp: await appCheckToken(ctx) }
//   } catch (error) {
//     return {
//       status: 412,
//       code: 0,
//       message: 'please login !'
//     }
//   }
// }

// const checkToken = async(ctx) => {
//   const checkResult = await _checkToken(ctx)
//   if (checkResult.user) {
//     ctx.state.user = checkResult.user
//     const _store = store.get(checkResult.user._id)
//     if (!_store) return { code: 0, status: 412, message: '请重新登录!' } // 已退出token未清除
//     if (checkResult.isApp) {
//       return { code: 1 } // 手机app直接通过
//     } else {
//       return { code: 1 }
//       // if (user.name === 'admin') return { code: 1 }
//       // const actions = store.get(user._id).actions
//       // const url = ctx.request.url.split('?')[0]
//       // const method = ctx.request.method
//       // if (actions && actions.find(n => new RegExp(n.url).test(url) && n.method.toUpperCase() === method)) {
//       //   return { code: 1 }
//       // } else {
//       //   return {
//       //     status: 403,
//       //     code: 0,
//       //     message: 'permission denied !'
//       //   }
//       // }
//     }
//   } else {
//     return checkResult
//   }
// }
