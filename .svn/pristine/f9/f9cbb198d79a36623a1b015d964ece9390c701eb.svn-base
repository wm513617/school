<template>
  <div class="org-actions-box">
    <div class="table-relative">
      <div class="table-body">
        <Table style="margin-top: 20px;" size="small" :columns="oprationTitle" :data="oprationData" height="434"></Table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      oprationTitle: [
        {
          title: '日期时间',
          key: 'dataTime'
        },
        {
          title: '来源',
          key: 'origin'
        },
        {
          title: '任务ID',
          key: 'taskID'
        },
        {
          title: '任务类别',
          key: 'taskType'
        },
        {
          title: '用户',
          key: 'user'
        },
        {
          title: '角色',
          key: 'role'
        },
        {
          title: '信息',
          key: 'message',
          width: 80
        }],
      oprationData: []
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
