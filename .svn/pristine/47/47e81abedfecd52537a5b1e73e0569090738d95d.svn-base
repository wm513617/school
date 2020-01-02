import axios from 'axios'
import PY from 'tiny-pinyin'
let db = null
let IDBRequest = window.indexedDB.open('carDB', 2)
/* IDBRequest.onerror = function(event) {
  console.log('数据库打开报错')
}
IDBRequest.onsuccess = function(event) {
  db = IDBRequest.result
  console.log('数据库打开成功')
} */
IDBRequest.onupgradeneeded = function(event) {
  db = event.target.result
  let objectStore
  if (!db.objectStoreNames.contains('carData')) {
    console.log('创建表')
    objectStore = db.createObjectStore('carData', { keyPath: 'id' })
    objectStore.createIndex('carLogoLists', 'carLogoLists', { unique: false })
    axios.get('/structure/identify/carStyleDict').then(res => {
      let data = pySort(res.data)
      let request = db.transaction(['carData'], 'readwrite').objectStore('carData').add({ id: 1, carLogoLists: data })
      request.onsuccess = function(event) {
        console.log('数据写入成功')
      }
      request.onerror = function(event) {
        console.log('数据写入失败')
      }
    }, err => {
      console.log(err)
    })
  }
  if (!db.objectStoreNames.contains('CaptureRealtimeData')) {
    console.log('创建CaptureRealtimeData表')
    let objectStore = db.createObjectStore('CaptureRealtimeData', { keyPath: 'id' })
    objectStore.createIndex('pedestrain', 'pedestrain', { unique: false })
  }
}
function pySort(arr, empty) {
  if (!String.prototype.localeCompare) { return null }
  let letters = 'ABCDEFGHJKLMNOPQRSTWXYZ'.split('')
  // let zh = '阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀'.split('')
  let arrList = []
  for (let m = 0; m < arr.length; m++) {
    arrList.push(arr[m])
  }
  let result = []
  let curr
  for (let i = 0; i < letters.length; i++) {
    curr = {letter: letters[i], data: []}
    if (i !== 26) {
      for (let j = 0; j < arrList.length; j++) {
        let initial = arrList[j].CarFamilyName.charAt(0)// 截取第一个字符
        // eslint-disable-next-line no-irregular-whitespace
        if (arrList[j].CarFamilyName.charAt(0) === letters[i] || arrList[j].CarFamilyName.charAt(0) === letters[i].toLowerCase()) {  // 首字符是英文的
          curr.data.push(arrList[j])
        } else if (isChinese(initial)) { // 判断是否是无汉字,是否是中文
          /* if (initial.localeCompare(zh[i]) >= 0 && (!zh[i + 1] || initial.localeCompare(zh[i + 1]) < 0)) {// 判断中文字符在哪一个类别
            curr.data.push(arrList[j])
          } */
          let firstLetter = PY.convertToPinyin(initial).charAt(0)
          if (firstLetter === letters[i]) {
            curr.data.push(arrList[j])
          }
        }
      }
    } else {
      for (let k = 0; k < arrList.length; k++) {
        let ini = arrList[k].CarFamilyName.charAt(0) // 截取第一个字符
        if (!isChar(ini) && !isChinese(ini)) {
          curr.data.push(arrList[k])
        }
      }
    }
    if (empty || curr.data.length) {
      result.push(curr)
    }
  }
  return result
}
function isChinese(temp) {
  var re = /[^\u4E00-\u9FA5]/g
  if (re.test(temp)) { return false }
  return true
}
function isChar(char) {
  let reg = /^[a-zA-Z]+$/ig
  if (!reg.test(char)) { return false }
  return true
}
