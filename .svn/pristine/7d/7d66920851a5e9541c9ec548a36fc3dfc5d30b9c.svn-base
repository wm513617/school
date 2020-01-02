
require('../api/map/grid/grid.model')
require('../api/map/building/building.model')
const mongoose = require('mongoose')
const ObjectID = require('mongodb').ObjectID
mongoose.connect('mongodb://127.0.0.1/bs-security')
const Grid = mongoose.model('Grid')
const Building = mongoose.model('Building')
async function dataMove () {
  try {
    const grids = await Grid.find({}).exec()
    const buildings = await Building.find({}).exec()
    for (var grid of grids) {
      for (var building of buildings) {
        if (grid._id + '' === building.gid + '') {
          grid.bids.push(building._id)
        }
      }
      grid.bids = [...new Set(grid.bids.map(item => item + ''))].map(item => ObjectID(item))
      await grid.save()
    }
  } catch (error) {
    console.log(error)
  }
}
dataMove().then(() => { process.exit(1) }).catch()
