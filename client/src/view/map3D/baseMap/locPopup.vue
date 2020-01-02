<!-- 测试位置信息弹出框 -->
<template>
  <div>
      <popup>
          <span slot="title">位置信息</span>
          <div>
            <table>
              <tbody>
                <tr><td>名称：</td><td>{{ selectedEntity.name }}</td></tr>
                <tr><td>经度：</td><td>{{ selectedEntity.position?selectedEntity.position.x:'' }}</td></tr>
                <tr><td>纬度：</td><td>{{ selectedEntity.position?selectedEntity.position.y:'' }}</td></tr>
                <tr><td>高度：</td><td>{{ selectedEntity.position?selectedEntity.position.z:'' }}</td></tr>
              </tbody>
            </table>
          </div>
      </popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import popup from './popup'

export default {
  name: 'locPopup',
  components: { popup },
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      selectedEntity: ({ tdIndex }) => tdIndex.selectedEntity // 选择实体的Cartesian3世界坐标---韩杰---2018-10-26 09:25:13
    })
  },
  methods: {
  }
}
</script>

<style scoped>
table tr {
  height: 25px;
}
</style>
