const Device = mongoose.model('Device')

exports.upgrade = async () => {
  await updateDevice()
}

/**
 * 同步添加设备启用停用字段
 */
async function updateDevice () {
  try {
    const devList = await Device.find({ deviceStatus: { $exists: false } }).exec()
    const devIds = []
    devList.map(item => devIds.push(item._id + ''))
    await Device.updateMany({ _id: { $in: devIds } }, { deviceStatus: 1 }).exec()
    console.log('update End!!!')
  } catch (err) {
    console.log(err)
    throw err
  }
}
