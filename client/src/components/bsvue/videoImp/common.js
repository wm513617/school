export const fullScreen = p => {
  return p.SetPlayFullScreen()
}
export const normalScreen = p => {
  return p.SetPlayNormalScreen()
}
export const boost = p => {
  return p.SetPlayLocalBoost()
}
export const openSound = p => {
  return p.OpenPlayerSound()
}
export const closeSound = p => {
  return p.StopPlayerSound()
}
export const setVolume = (p, volume) => {
  return p.SetPlayerVolume(volume)
}
export const getVolume = p => {
  const r = p.GetPlayerVolume()
  return JSON.parse(r).Volume || -1
}
export const getFile = (p, fileExt = '', fileFilter = '') => {
  const r = JSON.parse(p.GetFileBrowser(1, fileExt, fileFilter))
  return r.success ? r.fileName : r.errno
}
export const saveFile = (p, fileExt = '', fileFilter = '') => {
  const r = JSON.parse(p.GetFileBrowser(0, fileExt, fileFilter))
  return r.success ? r.fileName : r.errno
}
export const getPath = p => {
  const r = JSON.parse(p.GetFileDirectory())
  return r.success ? r.DirName : r.errno
}
export const getCapture = (p, quality = 100) => {
  return p.GetRealPicturebyBase64(1, quality)
}
export const saveCapture = (p, path) => {
  return p.GetPlayerPicture(path, 1)
}
export const setScale = (p, w, h, auto) => {
  return p.SetPlayStretchBlt(w, h, auto)
}
export const setScaleMode = (plg, mode) => {
  const p = [[1, 1, true], [0, 0, false], [4, 3, true], [16, 9, true]]
  const args = p[mode - 1] || p[0]
  return setScale.apply(null, [plg].concat(args))
}
export const setClickEvent = (p, event) => {
  return p.SetMouseStatusCallback(event)
}
export const setKeyEvent = (p, event) => {
  return p.SetKeyboardCallback(event)
}
export default {
  fullScreen,
  boost,
  openSound,
  closeSound,
  setVolume,
  getVolume,
  getFile,
  saveFile,
  getPath,
  getCapture,
  saveCapture,
  setScale,
  setScaleMode,
  setClickEvent,
  setKeyEvent,
  normalScreen
}
