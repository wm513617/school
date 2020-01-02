<template>
  <div>
    <Select v-model="methd" style="width:300px;margin-bottom:2px;">
      <Option v-for="item in mthds" :value="item" :key="item">{{item}}</Option>
    </Select>
    <Input v-model="url"></Input>
    <textarea v-model="param" style="width:300px;height:200px"></textarea><br>
    <Button type="primary" @click="dop">发送</Button><br>
    <textarea v-model="res" style="width:600px;height:400px"></textarea>
  </div>
</template>
<script>
export default {
  data() {
    return {
      url: '',
      methd: 'POST',
      mthds: ['GET', 'POST', 'DELETE', 'PUT'],
      param: '',
      res: ''
    }
  },
  methods: {
    dop() {
      let p = {}
      if (this.param) {
        p = JSON.parse(this.param)
      }
      console.log('request', p)
      this.res = ''
      const pp = {
        url: this.url,
        method: this.methd
      }
      if (this.methd === 'GET') {
        pp.params = p
      } else if (this.methd === 'POST') {
        pp.data = p
      }
      this.$http.request(pp).then(suc => {
        console.log('response', suc)
        this.res = JSON.stringify(suc)
      })
    }
  }
}
</script>
