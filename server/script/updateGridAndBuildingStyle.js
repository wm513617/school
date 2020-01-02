
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
      grid.style.borderstyle = 'solid'
      grid.style.borderwidth = '1'
      grid.style.bordercolor = '#FF0000'
      grid.style.bodertransparency = 100
      grid.style.fillcolor = '#FF0000'
      grid.style.fillcolortransparency = 50
      grid.style.font = '微软雅黑'
      grid.style.fontcolor = '#FF0000'
      grid.style.fontregular = 'normal'
      grid.style.fontsize = '12'
      await grid.save()
    }
    for (var building of buildings) {
      building.style.borderstyle = 'solid'
      building.style.borderwidth = '1'
      building.style.bordercolor = '#FF0000'
      building.style.bodertransparency = 100
      building.style.fillcolor = '#FF0000'
      building.style.fillcolortransparency = 50
      building.style.font = '微软雅黑'
      building.style.fontcolor = '#FF0000'
      building.style.fontregular = 'normal'
      building.style.fontsize = '12'
      await building.save()
    }
  } catch (error) {
    console.log(error)
  }
}
dataMove().then(() => {
  process.exit(1)
}).catch()
