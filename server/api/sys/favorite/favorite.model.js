const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FavoriteSchema = new Schema({
  name: { // 收藏夹名称
    type: String,
    required: true
  },
  ispolling: { // 是否轮训组
    type: String,
    required: true
  },
  pollingtime: { // 轮询时间
    type: Number
  },
  creator: { // 创建者
    type: String,
    required: true
  },
  owners: [String],
  resources: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Resource'
    }
  ]
}, { timestamps: true })

mongoose.model('Favorite', FavoriteSchema)
