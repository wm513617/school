
require('../api/map/grid/grid.model')
require('../api/map/building/building.model')
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/bs-security')
const Grid = mongoose.model('Grid')
const Building = mongoose.model('Building')
async function dataMove () {
  try {
    const grids = await Grid.find({}).exec()
    const buildings = await Building.find({}).exec()
    for (var grid of grids) {
      const scope = grid.scope
      const scopeArr = scope.split(',')
      grid.scope = scopeArr[2] + ',' + scopeArr[3] + ',' + scopeArr[0] + ',' + scopeArr[1]
      await grid.save()
    }
    for (var building of buildings) {
      const scope = building.scope
      const scopeArr = scope.split(',')
      building.scope = scopeArr[2] + ',' + scopeArr[3] + ',' + scopeArr[0] + ',' + scopeArr[1]
      await building.save()
    }
  } catch (error) {
    console.log(error)
  }
}
dataMove().then(() => {
  process.exit(1)
}).catch()
