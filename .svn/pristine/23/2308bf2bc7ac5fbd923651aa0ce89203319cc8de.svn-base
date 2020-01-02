<template>
  <div class="tarfficHighSet bs-main">
    <div class='title'>
      <h5>核检分数设定</h5>
    </div>
    <div class='row'>
      <span class="row-left">核检分数</span>
      <span class="row-right">
        <Input-number :min="1" v-model="saveTime" style="width: 200px;"></Input-number>
        <span class="unit">%</span>
      </span>
    </div>
    <div class='row'>
      <span class="row-left">保存天数</span>
      <span class="row-right">
        <Input-number :min="0" v-model="saveDay" style="width: 200px;"></Input-number>
        <span class="unit">天</span>
      </span>
    </div>
    <div class='row'>
      <Button type="primary" @click="save" class="save">保存</Button>
      <Button type="ghost" @click="recover">恢复默认值</Button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      saveTime: 70,
      saveDay: 30,
      saveId: '',
      defaultStatus: false,
      getDataStatus: false
    }
  },
  methods: {
    ...mapActions(['trafficHighSetList', 'trafficHighSetEdit']),
    save() { // 保存修改
      this.trafficHighSetEdit({score: this.saveTime, id: this.saveId, days: this.saveDay}).then(res => {
        this.getParam()
        if (this.getDataStatus) {
          if (this.defaultStatus) {
            this.$Notice.success({
              title: '提示',
              desc: '恢复默认值成功',
              duration: 2
            })
            this.defaultStatus = false
          } else {
            this.$Notice.success({
              title: '提示',
              desc: '保存成功',
              duration: 2
            })
          }
          this.getDataStatus = false
        }
      }).catch(err => {
        console.log('inquire error: ' + err)
        this.$Notice.error({
          title: '警告',
          desc: '保存失败',
          duration: 2
        })
      })
    },
    recover() { // 重置
      this.saveTime = 70
      this.saveDay = 30
      this.defaultStatus = true
      this.save()
    },
    getParam(type) {
      this.trafficHighSetList().then(res => {
        let data = JSON.parse(JSON.stringify(res.data))
        this.saveTime = data.score
        this.saveId = data._id
        this.saveDay = data.days
        this.getDataStatus = true
      }).catch(err => {
        console.log('inquire error: ' + err)
      })
    }
  },
  computed: {
  },
  created() {
    this.getParam()
  }
}
</script>

<style scoped>
  .tarfficHighSet {
    flex-direction: column;
    background: #1c3054;
  }
  .title {
    font-size: 16px;
    height: 38px;
    line-height: 38px;
    padding-left: 24px;
    font-weight: normal;
    background-color: #0f2243
  }
  .row {
    line-height: 32px;
    font-size: 12px;
    margin: 20px 0 12px 48px;
  }
  .row-left {
    display: inline-block;
    width: 60px;
  }
  .help {
    margin: 0 0 12px 170px;
    color:aqua;
  }
  .unit {
    /* margin-left: 20px; */
    font-size: 14px;
  }
  .save {
    margin-right: 20px;
  }
  button {
    width: 100px;
  }
</style>
