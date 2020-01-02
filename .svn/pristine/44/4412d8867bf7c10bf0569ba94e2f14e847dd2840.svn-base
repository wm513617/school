<template>
  <div class="item">
    <!--<span>Item # {{ index }}</span>-->
    <tr :class="(parseInt(photoId) === item.id)?'active':''" @click='selected($event)' @dblclick="doubleSelect">
      <td style='width:39.4px' class='ids'>{{item.id}}</td>
      <td style='width:63.5px'>{{item.profile}}</td>
      <td style='width:71.5px'>{{item.time}}</td>
      <td style='width:41px'>{{item.size}}</td>
      <td style='width:38px'>{{item.type}}</td>
    </tr>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    photoId: String
  },
  methods: {
    selected(e) {
      this.$emit('selected', e)
    },
    doubleSelect(e) {
      this.$emit('doubleSelect', e)
    }
  }
}
</script>

<style scoped>
.item {
  height: 36px;
  line-height: 36px;
}

tr.active {
  background-color: #ddd;
}

tr {
  cursor: pointer;
}

tr {
  width: 100%;
  height: 36px;
  background-color: #fff;
}

td {
  color: #414141;
  font-weight: normal;
  box-sizing: border-box;
  border: 1px solid #d1d1d1;
  text-align: center;
  height: 36px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

tr td {
  max-width: 109px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.query-file table tbody tr file-name:after {
  content: "...";
}
</style>
