<template>
  <div class="mapPosMask">
    <div class="drag-container" ref='dragContainer'>
      <slot></slot>
    </div>
  </div>

</template>

<script src='./DragContainer.js'>
</script>

<style lang="less" scoped>
// 给父容器设置一个非 static 的 position 属性，使得该组件相对其定位
.mapPosMask {
  width: 100%;
  height: 100%;
  z-index: 1000;
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  background-color: rgba(100, 100, 100, 0.24);
}
.drag-container {
  display: inline-block;
  position: absolute;
  user-select: none;
}
</style>
