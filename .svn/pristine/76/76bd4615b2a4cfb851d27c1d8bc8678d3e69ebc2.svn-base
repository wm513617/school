export const   JSONToExcelConvertor= (JSONData, FileName, ShowLabel)=> {

  var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

  var excel = '<table>';

//设置表头
  var row = "<tr>";
  for (var i = 0, l = ShowLabel.length; i < l; i++) {
    row += "<td>" + ShowLabel[i].value + '</td>';
  }

//换行
  excel += row + "</tr>";

//设置数据
  for (var i = 0; i < arrData.length; i++) {
    var row = "<tr>";
    for(var j=0;j<ShowLabel.length;j++){
      var a= arrData[i][ShowLabel[j].type];
      var value = !arrData[i][ShowLabel[j].type]  ? "" : arrData[i][ShowLabel[j].type];
      row += '<td>' + value + '</td>';
    }
    excel += row + "</tr>";
  }

  excel += "</table>";
  console.log(excel)
  var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel'  >";
  excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
  excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
  excelFile += '; charset=UTF-8">';
  excelFile += "<head>";
  excelFile += "<!--[if gte mso 9]>";
  excelFile += "<xml>";
  excelFile += "<x:ExcelWorkbook>";
  excelFile += "<x:ExcelWorksheets>";
  excelFile += "<x:ExcelWorksheet>";
  excelFile += "<x:Name>";
  excelFile += "{worksheet}";
  excelFile += "</x:Name>";
  excelFile += "<x:WorksheetOptions>";
  excelFile += "<x:DisplayGridlines/>";
  excelFile += "</x:WorksheetOptions>";
  excelFile += "</x:ExcelWorksheet>";
  excelFile += "</x:ExcelWorksheets>";
  excelFile += "</x:ExcelWorkbook>";
  excelFile += "</xml>";
  excelFile += "<![endif]-->";
  excelFile += "</head>";
  excelFile += "<body>";
  excelFile += excel;
  excelFile += "</body>";
  excelFile += "</html>";

 console.log(excelFile)
  var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);

  var link = document.createElement("a");
  link.href = uri;

  link.style = "visibility:hidden";
  link.download = FileName + ".xlsx";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// eg:
var JSON_DATA = [
  {"value":"司机", "type":"ROW_HEADER_HEADER", "datatype":"string"},
  {"value":"日期", "type":"ROW_HEADER_HEADER", "datatype":"string"},
  {"value":"物流单数量", "type":"ROW_HEADER_HEADER", "datatype":"string"},
  {"value":"退货单数量", "type":"ROW_HEADER_HEADER", "datatype":"string"},
  {"value":"发货总件数", "type":"ROW_HEADER_HEADER", "datatype":"string"},
  {"value":"退货总件数", "type":"ROW_HEADER_HEADER", "datatype":"string"},
  {"value":"拒收总件数", "type":"ROW_HEADER_HEADER", "datatype":"string"},
  {"value":"取消发货总件数", "type":"ROW_HEADER_HEADER", "datatype":"string"},
  {"value":"物流费总金额    ", "type":"ROW_HEADER_HEADER", "datatype":"string"},
  {"value":"代收手续费总金额", "type":"ROW_HEADER_HEADER", "datatype":"string"},
  {"value":"代收货款总金额", "type":"ROW_HEADER_HEADER", "datatype":"string"}
]

var ShowLabel=[
  {value: '名称', type: 'value'},
  {value: '类型', type: 'type'}
]
