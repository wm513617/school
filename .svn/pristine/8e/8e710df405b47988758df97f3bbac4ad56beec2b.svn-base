import { extend } from 'jquery'
import { AV_STREAM_START } from 'http/video'

const common = {
  setVolumn(vol) {
    return this._plugin.SetPlayerVolume(vol)
  },
  getVolumn() {
    let result = this._plugin.GetPlayerVolume()
    result = JSON.parse(result)
    if (result.success) {
      return result.Volume
    } else {
      return result.errno
    }
  },
  getPicture(param) {
    return this._plugin.GetPlayerPicture(param.path, param.type)
  },
  boost() {
    return this._plugin.SetPlayLocalBoost()
  },
  fullScreen() {
    return this._plugin.SetPlayFullScreen()
  },
  getCapture(param) {
    return this._plugin.GetRealPicturebyBase64(param.type, param.quality)
  }
}

const previewPlugin = {
  openStream(param) {
    return AV_STREAM_START({ id: param.id, streamType: param.streamType}).then(suc => {
      const state = this._plugin.OpenRealStreamEx(JSON.stringify(param))
      return {
        open: true,
        state: state
      }
    }).catch(error => {
      return {
        open: false,
        state: error
      }
    })
  },
  closeStream() {
    return this._plugin.CloseRealStream()
  },
  openRecording(param) {
    return this._plugin.RealStartSaveAs(param.path, param.type, param.mode)
  },
  isRecording() {
    let result = this._plugin.RealIsSaving()
    if (result) {
      result = JSON.parse(result)
    }
    return result
  },
  closeRecording() {
    return this._plugin.CloseRealSaveAs()
  },
  openSpeech(param) {
    return this._plugin.OpenSpeech(param.ip, param.port, param.id, param.session)
  },
  startSpeech() {
    return this._plugin.StartSpeech(false)
  },
  stopSpeech() {
    return this._plugin.StopSpeech()
  },
  closeSpeech() {
    return this._plugin.CloseSpeech()
  },
  openSound() {
    return this._plugin.OpenPlayerSound()
  },
  closeSound() {
    return this._plugin.StopPlayerSound()
  }
}
extend(previewPlugin, common)

const recordPlugin = {
  openRecord(param) {
    if (typeof param === 'object') {
      param = JSON.stringify(param)
    }
    return this._plugin.OpenRecordPlayerEx(param)
  }
}
extend(recordPlugin, common)

const filePlugin = {
  openFile(param) {
    let result = this._plugin.GetFileBrowser(param.type, param.fileType, param.filter)
    result = JSON.parse(result)
    if (result.success) {
      return result.fileName
    } else {
      return result.errno
    }
  },
  openPlay(param) {
    return this._plugin.OpenLocalPlayer(param.path, false)
  },
  startPlay() {
    return this._plugin.StartLocalPlay()
  },
  stopPlay() {
    return this._plugin.StopLocalPlay()
  },
  closePlay() {
    return this._plugin.CloseLocalPlay()
  }
}
extend(filePlugin, common)

const picturePlugin = {
  openPicture(param) {
    if (typeof param === 'object') {
      param = JSON.stringify(param)
    }
    return this._plugin.OpenImagePlayEx(param)
  }
}
extend(picturePlugin, common)

export { previewPlugin, recordPlugin, filePlugin, picturePlugin }
