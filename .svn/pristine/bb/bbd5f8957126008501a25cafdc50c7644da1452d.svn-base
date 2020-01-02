/*
 * @Author: linhang
 * @Date: 2018-10-15 19:27:39
 * @Last Modified by: linhang
 * @Last Modified time: 2019-12-18 20:27:06
 */
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PropertySchema = new Schema(
  {
    // 视频资源：'preview'视频预览, 'cloudControl'云台控制, 'playback'回放，'download'下载, playbackDownload
    // 报警设备：'alarmReceive'报警接收，'alarmConfirm'报警确认，'alarmClean'报警清除，'deployment'布防，'disarming'撤防，'clean'清除,'bypass'旁路，'removeBypass'撤旁，
    // 电视墙属性：'show'显示
    // 人员底库：'show'显示，'createOrg'机构添加，'delOrg'机构删除，'updateOrg'机构修改，'createUser'人员添加，'delUser'人员删除，'updateUser'人员修改，
    // 'moveUser'人员移动，'expireDate'有效期，'copy'复制到，'importExport'导入导出，'updatePermission'修改权限
    properties: [
      {
        type: String
      }
    ],
    // 资源id，不限于resource表
    resource: {
      type: Schema.Types.ObjectId
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role'
    },
    type: {
      // 资源类型-0视频通道，1报警设备，2消防设备，3报警求助设备，5人脸设备，4电视墙，6通行底库
      type: Number
    },
    // 做人员通行权限时新增，由于是从第三方直接获取，没有存数据库，无法存_id
    id: String
  },
  {
    timestamps: true
  }
)

mongoose.model('ResProperty', PropertySchema)
