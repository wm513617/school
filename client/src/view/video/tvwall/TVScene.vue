<template>
  <div v-resize="scorll" style="height:100%;overflow:hidden; padding:0 10px;">
    <div class="input">
      <Input v-model="searchVal" icon="ios-search-strong" size="small" placeholder="请输入..." />
    </div>
    <div>
      <div class="title-new" @click="addScene">
        <i class="icon iconfont icon-large"></i>
        <label>新建场景</label>
      </div>
    </div>
    <div v-show="!noResult" class="left-con-list">
      <bs-scroll ref="scroller">
        <div class="list-item" v-for="item in list" v-show="item.show" :key="item._id">
          <label @dblclick="rename(item._id, item.name)">{{item.name}}</label>
          <div class="list-icons">
            <i class="icon iconfont icon-default" :class="{def: tvwall.defaultscene==item._id}" @click="setDefault(item._id)" title="默认"></i>
            <i class="icon iconfont icon-delete" @click="del(item._id, item.name)" title="删除"></i>
            <i class="icon iconfont icon-swap" @click="changeScene(item)" title="切换"></i>
          </div>
        </div>
      </bs-scroll>
    </div>
    <div class="list-item" v-show="noResult">无结果</div>
    <Modal v-model="showModal" title="重命名场景" :mask-closable="false">
      <bs-cover v-if="showModal" v-model="showModal">
        <Input v-model="renameVal" autofocus/>
      </bs-cover>
      <div slot="footer" style="position:relative;z-index:99">
        <Button type="ghost" @click="showModal=false">取消</Button>
        <Button type="primary" @click="showModal=false||saveRename()">确定</Button>
      </div>
    </Modal>
    <Modal v-model="delectModal" width='416' title='提示'>
      <bs-cover v-if="delectModal" v-model="delectModal">
        <div style='line-height: 36px;position: relative; padding-left: 40px'>
          <i class="ivu-icon ivu-icon-help-circled" style='color: #ff9900; font-size:30px;position: absolute;left: 0'></i>
          确认删除"{{this.scene}}"吗
        </div>
      </bs-cover>
      <div slot="footer" style="position:relative;z-index:99">
        <Button type="ghost" @click="delectModal=false">取消</Button>
        <Button type="primary" @click="delectModal=false||delect()">确定</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { getPinyin, isMatchPinyin } from './pinyin'
import common from './tvcommon'
import 'components/Scroll'
export default {
  data() {
    return {
      searchVal: '',
      renameVal: '',
      showModal: false,
      noResult: false,
      scene: '',
      delectModal: false,
      delectId: ''
    }
  },
  mixins: [common],
  computed: {
    ...mapState({
      rtscene: ({ tvwall }) => tvwall.rtscene,
      sceneList: ({ tvwall }) => tvwall.sceneList,
      tvwall: ({ tvwall }) => tvwall.tvwall,
      planList: ({ tvwall }) => tvwall.planList,
      tabIndex: ({ tvwall }) => tvwall.tabIndex
    }),
    list() {
      if (!this.sceneList) {
        return
      }
      // console.log(this.sceneList, '111111111111111111')
      let list = JSON.parse(JSON.stringify(this.sceneList))
      list = list.filter(item => item._id !== this.rtscene._id)
      list.forEach(item => {
        item.show = true
        item.pinyin = getPinyin(item)
      })
      return list
    }
  },
  watch: {
    searchVal(v) {
      let noOne = true
      this.list.forEach(item => {
        item.show = isMatchPinyin(v, item.pinyin)
        if (item.show) {
          noOne = false
        }
      })
      this.noResult = noOne
    },
    tabIndex(val) {
      if (val === 2) {
        this.scorll()
      }
    }
  },
  methods: {
    ...mapActions([
      'getScenes',
      'deleteScene',
      'setDefaultScene',
      'addSaveScene',
      'setScene',
      'changeCurScene',
      'renameScene',
      'recordLog',
      'closeAllWall'
    ]),
    getUsedScenePlanName(id) {
      let name = null
      if (this.planList && this.planList.length) {
        const res = this.$lodash.find(this.planList, item => {
          return item.info.some(item => item.scene === id)
        })
        if (res) {
          name = res.name
        }
      }
      return name
    },
    async del(id, sceneName) {
      this.delectId = id
      if (id === this.tvwall.selectedscene) {
        this.errorMsg('无法删除正在使用的场景 ')
        return
      }
      const name = this.getUsedScenePlanName(id)
      if (name !== null) {
        this.$Notice.error({
          title: '提示',
          desc: `场景已被预案“${name}”使用，无法删除`,
          duration: 2
        })
      } else {
        this.scene = sceneName
        this.delectModal = true
        // const res = await this.confirmModal(`确认删除"${sceneName}"吗?`)
        // if (!res) {
        //   return
        // }
      }
    },
    delect() {
      this.delectModal = false
      this.commonAPIHandle(this.deleteScene(this.delectId), '删除', 'deleteScene')
    },
    setDefault(id) {
      if (id !== null && id !== undefined) {
        this.setDefaultScene(id)
      }
    },
    addtoScene() { // 新建场景
      // 避免重复名称
      // debugger
      let name = ''
      for (let n = 0; n < (this.list.length + 1); n++) {
        name = '场景' + (n + 1)
        let a = this.list.some((item, index) => {
          console.log(name, item.name, '23232323')
          return name === item.name
        })
        if (!a) {
          break
        }
      }
      // console.log(name, '666666')
      // let name = '场景' + (this.list.length + 1)
      // debugger
      this.commonAPIHandle(
        this.addSaveScene({
          name,
          first: !this.list.length
        }),
        '添加',
        'addScene'
      )
    },
    changeScene(value) {
      // console.log(value, 'cahngjing')
      // this.closeAllWall()
      // debugger
      this.recordLog({
        logType: '操作日志',
        module: '电视墙',
        operateName: '切换场景',
        operateContent: `切换场景: ${value.name}`
      })
      console.log(value, '545454545')
      this.commonAPIHandle(this.changeCurScene(value), '切换', 'changeScene').then(() => {
        this.$emit('changeToggle')
      })
    },
    rename(id, name) {
      this.saveId = id
      this.renameVal = name
      this.showModal = true
    },
    saveRename() {
      if (!this.renameVal) {
        this.$nextTick(() => {
          this.showModal = true
        })
        this.showError('场景名称不能为空')
      } else {
        this.commonAPIHandle(
          this.renameScene({
            id: this.saveId,
            name: this.renameVal
          }),
          '修改',
          'renameScene'
        )
      }
    },
    showError(msg) {
      this.$Notice.error({
        title: '错误',
        desc: msg,
        duration: 2
      })
    },
    showMsg(msg) {
      this.$Notice.success({
        title: '提示',
        desc: msg,
        duration: 2
      })
    },
    scorll() {
      if (this.$refs.scroller) {
        this.$refs.scroller.update()
      }
    }
  },
  mounted() {
    this.scorll()
  },
  created() {
    this.getScenes()
    this.addScene = this.$lodash.throttle(this.addtoScene, 1000)
  }
}
</script>
<style lang="less" scoped>
.input {
  padding: 10px 0;
}

.def {
  color: #00a5e3;

}
</style>
