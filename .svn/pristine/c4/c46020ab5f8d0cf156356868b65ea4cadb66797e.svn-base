const router = require('koa-router')()
const controller = require('./favorite.controller')

router.get('/user/:id/favorite', controller.getByUser)
router.get('/favorite/:id', controller.get)
router.post('/favorite', controller.add)
router.put('/user/:userId/favorite/:favId', controller.modify)
router.delete('/user/:userId/favorite/:favId', controller.delete)

module.exports = router
