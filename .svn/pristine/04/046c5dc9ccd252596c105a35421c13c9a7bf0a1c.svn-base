<template>
<div v-show="showControl" class="search-result">
  <table>
    <tr>
      <th><div class="A">{{$t('playback.table.no')}}</div></th>
      <th><div class="B">{{$t('playback.table.videoType')}}</div></th>
      <th><div class="C">{{$t('playback.table.starttime')}}</div></th>
      <th><div class="D">{{$t('playback.table.size')}}</div></th>
      <th v-if="hasCheckbox"><div class="E">{{$t('playback.table.time')}}</div></th>
      <th><div class="F">{{$t('playback.table.fileType')}}</div></th>
      <th v-if="hasCheckbox"><div class="G">
        <input type="checkbox"
                style="vertical-align:sub" v-model="checkallvalue" @click="checkall">{{$t('playback.table.all')}}</div></th>
    </tr>
  </table>
  <table>
    <tr v-for="(item, index) in result" @click="onClick(index)" @dblclick="onDblClick(index)" :key="index">
      <td><div class="A">{{index+1}}</div></td>
      <td><div class="B">720P</div></td>
      <td><div class="C">{{msToString(item.evtTblInfo.startTime)}}</div></td>
      <td><div class="D">{{calculateFileSize(item.evtTblInfo.size)}}</div></td>
      <td v-if="hasCheckbox"><div class="E">{{calculateRecordTime(item.evtTblInfo.startTime, item.evtTblInfo.endTime)}}</div></td>
      <td><div class="F">手动</div></td>
      <td v-if="hasCheckbox"><div class="G">
        <input type="checkbox" v-model="checkboxs[index].checked"></div>
      </td>
    </tr>
  </table>
</div>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    showControl: {
      default: false
    },
    result: {
      default: []
    },
    hasCheckbox: {
      default: false
    }
  },
  data() {
    return {
      checkboxs: [],
      checkallvalue: false
    }
  },
  watch: {
    result(result) {
      this.checkboxs = result.map(() => { return { checked: false } })
    },
    checkboxs: {
      deep: true,
      handler: function(list) {
        if (list.some(item => !item.checked)) {
          this.checkallvalue = false
        } else {
          this.checkallvalue = true
        }
        this.$emit('checkOption', list.map((item, index) => item.checked ? index : null).filter(item => item !== null))
      }
    }
  },
  methods: {
    checkall() {
      this.checkboxs.forEach((item, index, arr) => { arr[index].checked = this.checkallvalue })
    },
    msToString(ms) {
      return moment(+ms * 1000).format('HH:mm:ss')
    },
    calculateFileSize(size) {
      return (size / 1024 / 1024).toFixed(2) + 'M'
    },
    calculateRecordTime(start, end) {
      const second = parseInt(end - start)
      return parseInt(second / 3600) + ':' + (parseInt(second / 60) % 60) + ':' + second % 60
    },
    onClick(index) {
      this.$emit('click', index)
    },
    onDblClick(index) {
      this.$emit('dblclick', index)
    }
  }
}
</script>
<style scoped>
.search-result th, .search-result td{
  text-align: center;
}
table {
  table-layout: fixed
}
th,
td {
  border: 1px solid #333;
  height: 25px;
  vertical-align: middle;
  cursor: default;
}
th{
  background-color: #e2eaf4;
}
td{
  background-color: #fff;
}
tr:hover td{
  background-color: #f2f4f7;
}
table div{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  height: 25px;
  line-height: 25px;
}
.A{
  width: 40px;
}
.B{
  width: 60px;
}
.C{
  width: 80px;
}
.D{
  width: 60px;
}
.E{
  width: 60px;
}
.F{
  width: 60px;
}
.G{
  width: 60px;
}
</style>
