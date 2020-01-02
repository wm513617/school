<template>
  <div>
    <div class="s-table">
      <div class="s-tab-heade">
        <div class="s-tab-item" v-for="(item, t) in columnsTitle" :key="t">{{item.title}}</div>
      </div>
      <div class="s-body">
        <div class="s-tab-body" v-for="(o,index) in itemList" :key="index">
          <div class="s-tab-item s-up-tab" :title="o.origin">{{o.origin}}</div>
          <Select class="s-tab-item s-selection" size="small" v-model="o.code" @on-change="changeSource(o, index)">
            <Option v-for="item in orginChannelList" :value="item.code" :key="item.code">{{ item.label }}</Option>
          </Select>
        </div>
        <div style="text-align:center;padding:15px;" v-if="!itemList.length">暂无数据</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
// import Vselect from '../../../components/common/VSelect'
export default {
  name: 'tvsource',
  components: {
    // Vselect
  },
  data() {
    return {
      columnsTitle: [
        // 每列的设置
        {
          title: '拼接控制器源',
          key: 'code'
        },
        {
          title: '解码通道',
          key: 'code'
        }
      ],
      itemList: [
        // 每行的数据
      ]
    }
  },
  computed: {
    ...mapState({
      originList: ({ tvwall }) => tvwall.originList,
      orginChannelList: ({ tvwall }) => tvwall.orginChannelList
    })
  },
  watch: {},
  methods: {
    ...mapActions(['getOrigin', 'updateOrigin', 'getChannel', 'getTVList', 'getMonitorList']),
    changeSource(o, index) {
      const p = {
        _id: this.itemList[index]._id,
        jointorigin: this.itemList[index].originId
      }
      if (o.code !== '空') {
        for (const i in this.orginChannelList) {
          if (this.orginChannelList[i].code === o.code) {
            p.decodechan = this.orginChannelList[i].codeId
          }
        }
      }
      this.updateOrigin(p)
        .then(() => {
          this.getTVList()
          this.getMonitorList()
          this.$Notice.success({
            title: '成功',
            desc: '绑定解码通道成功',
            duration: 3
          })
          // if (this.itemList[sIndex] && this.originList[index]) {
          //   this.itemList[sIndex].code = this.originList[index].code
          // }
        })
        .catch(err => {
          this.$Notice.error({
            title: '错误',
            desc: err.response.data.message,
            duration: 3
          })
        })
    }
  },
  created() {
    this.getOrigin().then(() => {
      this.itemList = this.$lodash.cloneDeep(this.originList)
    })
    this.getChannel()
  },
  mounted() {},
  beforeDestroy() {
    this.itemList = null
  }
}
</script>
<style scoped>
.s-table {
  padding: 10px 0;
}
.s-tab-heade {
  height: 34px;
  line-height: 34px;
  background-color: #244575;
  font-weight: 600;
}
.s-tab-item {
  width: 40%;
  text-align: center;
  float: left;
  line-height: 34px;
  border-bottom: 1px solid #203863;
  padding: 0 5px;
}
.s-tab-item.s-selection {
  width: 60%;
  padding: 5px 5px;
}
.s-up-tab {
  cursor: pointer;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
