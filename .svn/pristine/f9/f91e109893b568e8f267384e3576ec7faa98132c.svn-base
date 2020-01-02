<template>
 <div class="imensional-wrap">
    <h3>2D/3D配置</h3>
    <CheckboxGroup class="checkbox-list" v-model="enableList" @on-change="handleEnableListChange">
      <div>
        <label class="item-label">2D</label>
        <Checkbox label="2D">启用</Checkbox>
      </div>
      <div>
        <label class="item-label">3D</label>
        <Checkbox label="3D">启用</Checkbox>
      </div>
    </CheckboxGroup>
    <RadioGroup class="radio-list" v-model="defaultMode">
      <div>
        <Radio :disabled="!enableList.includes('2D')" label="2D">默认</Radio>
      </div>
      <div>
        <Radio :disabled="!enableList.includes('3D')"  label="3D">默认</Radio>
      </div>
    </RadioGroup>
    <Select v-if="enableList.includes('3D')" v-model="map3DType" size="small" style="width:100px; margin: 42px 36px;">
        <Option v-for="item in type3DArr" :value="item" :key="item">{{ item }}</Option>
    </Select>
    <Button class="save-button" type="primary" @click="saveSettings">保存</Button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { MAPMODE } from 'assets/2DMap/meta/common'

export default {
  data() {
    return {
      imenId: '',
      enableList: [MAPMODE.mode2D, MAPMODE.mode3D],
      defaultMode: MAPMODE.mode2D,
      map3DType: MAPMODE.mapType3D.superMap,
      type3DArr: [MAPMODE.mapType3D.superMap, MAPMODE.mapType3D.fengMap]
    }
  },
  created() {
    this.getTwoImensionalInfo()
      .then(res => {
        this.imenId = res._id
        this.enableList = res.mapType.enable
        this.defaultMode = res.mapType.default
        this.map3DType = res.mapType.map3DType
      })
      .catch(err => {
        return this.errosMsg(err.message)
      })
  },
  methods: {
    ...mapActions(['getTwoImensionalInfo', 'setTwoImensionalInfo', 'setMapModeSetting']),
    handleEnableListChange(checklist) {
      console.log('checklist: ', checklist)
      if (checklist && checklist.length > 0) {
        if (checklist.length === 1) {
          this.defaultMode = checklist[0]
        }
      } else {
        this.warningMsg('必须设置一种模式为默认')
        this.enableList = [this.defaultMode]
      }
    },
    saveSettings() {
      if (!(this.enableList && this.enableList.length > 0)) {
        this.warningMsg('请选择启用的地图模式')
        return
      }
      let id = this.imenId
      let params = {
        _id: id,
        mapType: {
          enable: this.enableList,
          default: this.defaultMode
        }
      }
      if (this.enableList.includes(MAPMODE.mode3D)) {
        params.mapType.map3DType = this.map3DType
      }
      this.setTwoImensionalInfo(params)
        .then(res => {
          console.log('地图模式设置成功！！！')
          this.successMsg('地图模式设置成功')
          let setting = {enableList: this.enableList, defaultMode: this.defaultMode}
          if (this.enableList.includes(MAPMODE.mode3D)) {
            setting.map3DType = this.map3DType
          }
          this.setMapModeSetting(setting)
        })
        .catch(err => {
          console.log('setTwoImensionalInfo:' + err)
        })
    }
  }
}
</script>

<style scoped>
.imensional-wrap {
  background: #1b3153;
  width: 100%;
  line-height: 35px;
}

h3 {
  font-size: 14px;
  height: 38px;
  line-height: 38px;
  background: #0f2243;
  padding-left: 24px;
  font-weight: normal;
  margin-bottom: 15px;
}

.checkbox-list {
  margin-left: 48px;
  float: left;
}

.checkbox-list > div{
  line-height: 36px;
  height: 36px;
}

.radio-list {
  margin: 1px 0 0 30px;
  float: left;
}

.radio-list > div{
  line-height: 36px;
  height: 36px;
}

.save-button {
  position: absolute;
  top: 225px;
  left: 335px;
}

.item-label {
  width: 48px;
  display: inline-block;
}
</style>
