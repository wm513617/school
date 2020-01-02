<template>
  <div class="org-actions-box">
    <div class="table-relative">
      <div class="table-body">
        <Table style="margin-top: 20px;" size="small" :columns="systemTitle" :data="systemData" height="434"></Table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      systemTitle: [
        {
          title: '日期时间',
          key: 'dataTime'
        },
        {
          title: 'ID',
          key: 'ID'
        },
        {
          title: 'IP',
          key: 'IP'
        },
        {
          title: '消息',
          key: 'message',
          width: 80
        }],
      systemData: []
    }
  }
}
</script>

<style scoped>
.table-relative {
  position: relative;
  height: 454px;
}

.table-body {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
