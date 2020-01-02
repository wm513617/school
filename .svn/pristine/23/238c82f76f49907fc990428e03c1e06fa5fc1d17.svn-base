import { read } from '../store/modules/init'
import $ from 'jquery'

const pluginIp = '192.168.0.222'
var cversion = '1.0.0.49'

export function getPluginIp() {
  const host = window.location.hostname
  if (host === 'localhost' || host === '127.0.0.1') {
    return pluginIp
  } else {
    return host
  }
}

function IsUpdate(objver, curver) {
  var objv = objver + ''
  var objstrarray = objv.split('.')
  var curv = curver + ''
  var curstrarray = curv.split('.')
  var maxlen = Math.max(objstrarray.length, curstrarray.length)

  var result, so, sc
  for (var i = 0; i < maxlen; i++) {
    so = objstrarray[i]
    sc = curstrarray[i]
    if (sc > so) {
      result = 1
    } else if (sc < so) {
      result = -1
    } else {
      result = 0
    }

    if (result !== 0) {
      return result
    }
  }

  return result
}
export function ReadFileInfo(plugin) {
  if (plugin.ReadFileInfo === undefined) {
    return {}
  }
  var config = {}
  var SettingFilePath = ''
  try {
    SettingFilePath = JSON.parse(plugin.GetSystemEnvDirectory()).result + '\\NewIpcWebUI.ini'
  } catch (err) {
    console.log('不支持插件')
  }
  var result = plugin.ReadFileInfo(SettingFilePath)
  if (result !== '') {
    try {
      config = JSON.parse(result)
    } catch (e) {
      // domeFailed(this.$t('liveView.getLocalConfig'))
    }
  }
  return config
}

export function pluginInit(htmlElement) {
  var myPlugin = htmlElement
  var toolTips = '未安装插件，点击链接安装插件！'
  var myValid = false
  if (myPlugin.valid) {
    myValid = true
    var version = myPlugin.version
    if (version) {
      var ret = IsUpdate(version, cversion)
      if (ret > 0) {
        toolTips = '插件需更新，请点击链接更新！'
        myValid = false
      } else {
        toolTips = '插件可用！'
        myValid = true
      }
    }
  }

  function downPlugin() {
    var src = '/cgi-bin/downloadplus.py?session=' + read().session
    var a = $('<a></a>').attr('href', src).attr('download', 'vmrvideo.exe').appendTo('body')
    a[0].click()
    a.remove()
  }

  return {
    'plugin': myPlugin,
    'valid': myValid,
    'toolTips': toolTips,
    'downPlugin': downPlugin
  }
}
