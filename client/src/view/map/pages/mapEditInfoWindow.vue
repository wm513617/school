<!--编辑模式 点击视频点位的右边编辑框的 视频预览按钮弹出的页面-->
<template>
  <div class="mapEditInfo">
    <div class="textEdit">
      <!-- 视频 -->
      <div v-if="editPageDetail === 'pointVideoEdit'">
        <mapPointEditVideo></mapPointEditVideo>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import mapPointEditVideo from './edit/mapPointEditVideo'
export default {
  components: {
    mapPointEditVideo
  },
  computed: {
    ...mapState({
      editPageDetail: ({ mapAreaData }) => mapAreaData.editPageDetail
    })
  }
}
</script>
<style scoped>
.mapEditInfo {
  color: black;
}
</style>
