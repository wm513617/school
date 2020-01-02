import { read } from './storage'
import { STORE_KEY_USERNAME, STORE_KEY_ORGID, STORE_KEY_ACCESS_TOKEN, STORE_KEY_REFRESH_TOKEN, STORE_KEY_CONFIG_LANG, STORE_KEY_CONFIG_PAGE_LIMIT } from './constants'
export const username = read(STORE_KEY_USERNAME) || ''
export const orgId = read(STORE_KEY_ORGID) || ''
// eslint-disable-next-line camelcase
export const access_token = read(STORE_KEY_ACCESS_TOKEN) || '' // eslint-disable-line
// eslint-disable-next-line camelcase
export const refresh_token = read(STORE_KEY_REFRESH_TOKEN) || '' // eslint-disable-line
// lang order: localStorage -> browser language -> default
export const lang = read(STORE_KEY_CONFIG_LANG) || navigator.language || 'zh-CN'
export const pageLimit = +read(STORE_KEY_CONFIG_PAGE_LIMIT) || 20
export const faceRecognitionrole = JSON.parse(read('faceRecognitionrole')) || {}
export const homePagerole = JSON.parse(read('homePagerole')) || {}
export const peopleTrafficrole = JSON.parse(read('peopleTrafficrole')) || {}
export const securityMonitorrole = JSON.parse(read('securityMonitorrole')) || {}
export const vehicleRecognizerole = JSON.parse(read('vehicleRecognizerole')) || {}
export const videoStructuredrole = JSON.parse(read('videoStructuredrole')) || {}
export const sysConfrole = JSON.parse(read('sysConfrole')) || {}
export const webPri = JSON.parse(read('webPri')) || {}
export const themelistFlag = read('themelistFlag') || ''
export const momentmunuList = JSON.parse(read('memueList')) || []
