<!-- 轨迹查询弹出框 -->
<template>
  <Modal v-model="fmapShowTrackModal" :mask-closable="false" :closable="false" :footer-hide="true" :width="560">
    <div class="trackSearchModal">
      <div class="trackTitle"><div>轨迹查询</div></div>
      <div class="trackContent">
        <Form :label-width="100" label-position="left">
          <FormItem label="轨迹类型">
            <RadioGroup v-model="trackType">
              <Radio v-for="(item, index) in trackTypes" :key="index" :label="item.label" :value="item.value" :disabled="item.disable">
                <span>{{item.text}}</span>
              </Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </div>
      <vehicle-form  v-if="trackType === 'vehicle'"></vehicle-form>
      <personnel-form  v-if="trackType === 'personnel'"></personnel-form>
      <patrol-form  v-if="trackType === 'patrol'"></patrol-form>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from 'vuex'
import VehicleForm from './VehicleForm'
import PersonnelForm from './PersonnelForm'
import PatrolForm from './PatrolForm'

export default {
  name: 'TrackModal',
  components: { PatrolForm, VehicleForm, PersonnelForm },
  data() {
    return {
      trackType: 'personnel',
      // 轨迹类型数据源
      trackTypes: [
        { text: '人像轨迹', label: 'personnel', value: 'personnel', disable: false },
        { text: '车辆轨迹', label: 'vehicle', value: 'vehicle', disable: false },
        { text: '巡更轨迹', label: 'patrol', value: 'patrol', disable: false }
      ]
    }
  },
  computed: {
    ...mapGetters('fengMap', ['fmapShowTrackModal'])
  },
  mounted() {},
  methods: {
  }
}
</script>

<style scoped>
/* 框体样式 */
.trackSearchModal {
  margin: 0 -16px;
  border-radius: 8px;
  background: #1b3153;
  font-size: 14px;
  color: #fff;
}
.trackTitle div {
  height: 38px;
  line-height: 38px;
  /* border-bottom: 2px solid #393; */
  float: left;
}
/* 标题样式 */
.trackTitle {
  background: #0f2343;
  padding: 0 24px;
  height: 38px;
  margin: -24px -6px 16px -6px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
/* 内容样式 */
.trackContent {
  padding: 0 32px;
  height: auto;
}
</style>
