import axios from 'axios'
import PY from 'tiny-pinyin'
// fengmap 添加marker
var FMdb
// 添加的表名
/** 普通点位信息
 * 00 枪机
 * 01 红外枪机
 * 02 半球
 * 03 快球
 * 04 全景
 * 05 人脸抓拍
 * 06 交通抓拍
 * 10 普通报警
 * 90 报警主机
 * 110 消防报警
 * 41 门禁
 * 130 报警箱
 * 129 报警柱
 * 140 巡更
 * 151 单兵
 * 161 辅助(暂不用)
 * ?? 可视域
 **/

 /** 报警点位信息
 * ?? 普通报警
 * ?? 报警主机
 * ?? 视频报警
 * ?? 智能报警(人像布控)
 * ?? 消防报警
 * ?? 报警求助(报警箱+报警柱)
 * ?? 单兵报警
 * ?? 巡更报警
 **/

/** 其他
 * 单兵头像
 * 轨迹路径
 */
var markerTable = { // key表类型 value 表名
  '00': 'marker00',
  '01': 'marker01',
  '02': 'marker02',
  '03': 'marker03',
  '04': 'marker04',
  '05': 'marker05',
  '06': 'marker06',
  pointLayer: 'pointLayer' // 地图上添加的图层
}
var FMdb
//创建数据库与表
function createFMdb() {
  var request = window.indexedDB.open("fengmapDB", 2);
  request.onsuccess = function(e) {
    FMdb = e.target.result;
  };
  request.onerror = function(e) {
    console.log("错误：", e.target.result, e.target.errorCode || e.target.error);
  };
  request.onupgradeneeded = function(e) {
   for (const item in markerTable){
      e.target.result.createObjectStore(markerTable[item], {"keyPath":"id"});
    }
  };
  clearAllData()
}
/** 新增数据
 * item 添加的数据
 * table 表名
 **/
function add(item, table) {
  var tx = FMdb.transaction(table,"readwrite");
  var tb = tx.objectStore(table);
  tb.add(item);
}
/** 获取对象
 * id 唯一标识
 * table 表名
 **/
function getSingle(id, table) {
  var tx = FMdb.transaction(table, "readwrite");
  var tb = tx.objectStore(table);
  var request=tb.get(id);
  request.onsuccess=function(e){
    singleObj = e.target.result
    console.log(JSON.stringify(e.target.result));
  };
}
/** 更新对象
 * item 修改后的数据
 * table 表名 
 **/
function edit(item, table) {
  var tx = FMdb.transaction(table, "readwrite");
  var goods = tx.objectStore(table);
  var request=goods.put(item);
  request.onsuccess=function(e){
    console.log(e.target.result);
  };
}
/** 清除数据库 */
function clearAllData() {
  for (const i in markerTable){
    clearData(markerTable[i])
  }
}
/** 清除表数据 */
function clearData(table){
  if(!FMdb) return
  var tx = FMdb.transaction(table, "readwrite");
  var store = tx.objectStore(table);
  var req = store.clear();
}
var allObj = []
/** 获得多个对象 */
function getTypeAll(table) {
  allObj = []
  var tx = FMdb.transaction(table, "readwrite");//创建事务对象
  var goods = tx.objectStore(table);//从数据库中获得存储对象，表
  return new Promise((resolve, reject) => {
    var request = goods.openCursor();//打开游标
    request.onsuccess = function(e) { //成功时的回调
      var cursor = e.target.result; //获得游标
      if (cursor) { //如果不为空
        var obj = cursor.value;
        allObj.push(obj);
        cursor.continue(); //下移
      } else {
        resolve(allObj)
      }
    }
  })
}

createFMdb()
export {
  markerTable,
  createFMdb,
  add,
  getSingle,
  edit,
  clearAllData,
  clearData,
  getTypeAll
}
