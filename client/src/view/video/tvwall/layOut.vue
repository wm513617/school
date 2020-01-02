<template>
  <div class='layout' v-resize="scorll">
    <div class="s-tab-heade">
      <div class="s-tab-item" v-for="(v, lay) in layoutColumns" :key="lay">{{v.title}}</div>
    </div>
    <div class="s-table">
      <bs-scroll ref="scorlls">
        <div class="s-body">
          <div class="s-tab-body" v-for="(item,index) in layoutData" :key="index">
            <div class="s-up-tab">{{item.num}}</div>
            <div class="s-up-tab" @dblclick="rename(item)">{{item.layout}}</div>
            <div class="s-up-tab" @click="setLayout(item)"><i class="icon iconfont icon-swap" title="切换"></i></div>
          </div>
          <div style="text-align:center;padding:15px;" v-if="!layoutData.length">暂无数据</div>
        </div>
      </bs-scroll>
    </div>
    <Modal v-model="renameModel" title="重命名布局" :mask-closable="false">
      <bs-cover v-if="renameModel" v-model="renameModel">
        <Input v-model="changeLayout.name" autofocus/>
      </bs-cover>
      <div slot="footer" style="position:relative;z-index:99">
        <Button type="ghost" @click="renameModel=false">取消</Button>
        <Button type="ghost" @click="renameModel=false||saveRename()">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      layoutColumns: [
        {
          title: '序号',
          key: 'num'
        },
        {
          title: '布局',
          key: 'layout'
        },
        {
          title: '操作',
          key: 'operation'
        }
      ],
      renameModel: false,
      changeLayout: {
        name: '',
        id: -1
      }
    }
  },
  computed: {
    ...mapState({
      layoutList: ({ tvwall }) => tvwall.allLayoutList,
      tabIndex: ({ tvwall }) => tvwall.tabIndex
    }),
    layoutData() {
      return this.layoutList.map((item, index) => {
        return {
          num: index + 1,
          layout: item.name,
          sceneid: item.sceneid,
          id: item._id
        }
      })
    }
  },
  watch: {
    tabIndex(val) {
      if (val === 4) {
        this.scorll()
      }
    }
  },
  methods: {
    ...mapActions(['setJointLayout', 'chanLayout', 'getAllLayoutList', 'getTVList', 'recordLog']),
    setLayout(info) {
      this.recordLog({
        logType: '操作日志',
        module: '电视墙',
        operateName: '切换布局',
        operateContent: `切换布局: ${info.layout}`
      })
      this.setJointLayout(info.sceneid)
        .then(() => {
          this.getAllLayoutList()
          this.getTVList() // 重新获取当前布局
          this.$Notice.success({
            title: '成功',
            desc: '切换拼控布局成功',
            duration: 3
          })
        })
        .catch(err => {
          this.$Notice.error({
            title: '错误',
            desc: err.response.data.message,
            duration: 3
          })
        })
    },
    rename(item) {
      this.changeLayout.name = item.layout
      this.changeLayout.id = item.id
      this.renameModel = true
    },
    saveRename() {
      if (!this.changeLayout.name || this.changeLayout.name.replace(/\s+/g, '') === '') {
        this.$nextTick(() => {
          this.showModal = true
        })
        this.$Notice.error({
          title: '错误',
          desc: '布局名称不能为空',
          duration: 3
        })
      } else {
        this.chanLayout({
          id: this.changeLayout.id,
          name: this.changeLayout.name
        })
          .then(() => {
            this.getAllLayoutList()
            this.getTVList() // 重新获取当前布局
            this.$Notice.success({
              title: '成功',
              desc: '修改布局名称成功',
              duration: 3
            })
          })
          .catch(err => {
            console.log('chanLayout', err)
            this.$Notice.error({
              title: '错误',
              desc: '修改布局名称失败',
              duration: 3
            })
          })
      }
    },
    scorll() {
      if (this.$refs.scorlls) {
        this.$refs.scorlls.update()
      }
    }
  }
}
</script>

<style scoped>
.layout {
  padding: 10px;
  height: 100%;
}
.s-table {
  padding: 10px 0;
  width: 280px;
  height: calc(100% - 26px);
}
.s-tab-heade {
  height: 34px;
  line-height: 34px;
  background-color: #244575;
  font-weight: 600;
}
.s-tab-item {
  width: 33.3%;
  text-align: center;
  float: left;
  line-height: 34px;
  border-bottom: 1px solid #203863;
  padding: 0 5px;
}
.s-tab-body {
  padding: 0 1px;
  line-height: 34px;
  line-height: 34px;
  display: flex;
  text-align: center;
}
.s-up-tab {
  cursor: pointer;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}
</style>
