module.exports = {
  whiteList: [ // 权限白名单
    { url: /^\/api$/, method: 'GET' }, // 首页
    { url: /^\/api\/setting\/user\/login$/, method: 'POST' }, // 登录
    { url: /^\/api\/upload/, method: 'GET' }, // 获取图片
    { url: /^\/api\/upload/, method: 'POST' }, // 上传图片
    { url: /^\/api\/setting\/loginimgs/, method: 'GET' }, // 获取登录信息
    { url: /^\/api\/setting\/user\/logout/, method: 'POST' }, // 退出
    { url: /^\/api\/vehicle\/identify/, method: 'POST' }, // 车辆识别推送
    { url: /^\/api\/ctrl\/devinfo/, method: 'GET' }, // 人脸相关
    { url: /^\/api\/setting\/sysparamters/, method: 'GET' } // 获取登录页参数
  ]
}
