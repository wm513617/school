require('../api/map/maplist/map.model')
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/bs-security')
const MapList = mongoose.model('MapList')
async function dataMove () {
  try {
    const maplists = await MapList.find({})
    const docs = maplists.map(item => {
      item._doc.mapType = 'iserver'
      return item._doc
    })
    for (var item of docs) {
      await MapList.findByIdAndUpdate(item._id, item)
    }
  } catch (error) {
    console.log(error)
  }
}
dataMove().then(() => { process.exit(1) }).catch()
