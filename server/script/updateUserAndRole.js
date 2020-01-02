/*
 * @Author: linhang
 * @Date: 2018-12-18 14:26:00
 * @Last Modified by: linhang
 * @Last Modified time: 2018-12-21 13:30:34
 */
require('../api/sys/role/role.model')
require('../api/sys/user/user.model')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Role = mongoose.model('Role')
mongoose.connect('mongodb://127.0.0.1/bs-security')
async function updateUserAndRole () {
  try {
    const users = await User.find({}).sort({ createdAt: -1 })
    for (let i in users) {
      users[i].order = Number(i) + 1
      await users[i].save()
    }
    console.log('finished update user data ************')
    const roles = await Role.find({}).sort({ createdAt: -1 })
    for (let i in roles) {
      roles[i].order = Number(i) + 1
      roles[i].loginType = 1
      await roles[i].save()
    }
    console.log('finished update role data ************')
  } catch (err) {
    console.log(err.message)
  }
}
updateUserAndRole()
  .then(() => {
    process.exit(1)
  })
  .catch()
