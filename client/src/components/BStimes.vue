<template>
  <div class='dbcount'>
    <b>{{title}}</b>
    <i class='reduce iconfont icon-reduce'
       @mouseup="$emit('stopMinus')"
       @mousedown="$emit('startMinus')"></i>
    <i class='add iconfont icon-add'
       @mouseup="$emit('stopAdd')"
       @mousedown="$emit('startAdd')"></i>
  </div>
</template>
<script>
export default {
  name: 'BStimes',
  props: ['title']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dbcount {
  overflow: hidden;
  margin: 2px 0
}

.dbcount i {
  cursor: pointer;
  float: left;
  width: 40px;
  height: 30px;
  font-size: 14px;
  text-align: center;
  line-height:30px;
  font-style: normal;
  user-select: none;
  margin: 3px 0px;
  background: #5676a9;
  color: #263755;
}
.dbcount .reduce{
  border-radius: 6px 0 0 6px;
  border-right: 1px solid #446294;
}
.dbcount .add{
  border-radius: 0 6px 6px 0;
  border-left: 1px solid #6785b7;
}
.dbcount i:hover {
  color: #fff;
  background:#4699f9;
}
.dbcount i:active {
  color: #fff;
  background:#297fe2;
}

.dbcount b {
  float: left;
  height: 36px;
  line-height: 36px;
  width: 40px;
  text-align: center;
  font-weight: normal;
  user-select: none;
}
</style>
