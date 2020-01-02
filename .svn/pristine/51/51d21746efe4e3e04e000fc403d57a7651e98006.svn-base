<!--编辑模式 网格的右边编辑框的页面-->
<template>
  <div class="girdHome">
    <div class="girdHeader">
      <p class="girdText">网格化</p>
      <i v-if="gridEdit === 'show'" class="icon iconfont icon-add girdTextAdd" title="添加网格" @click="gridAdd"></i>
    </div>
    <div v-if="gridEdit === 'show'" class="gridTable">
      <div class="gridTableSearch">
        <Input :maxlength='16' v-model="searchVal" @on-enter="gridSearch(searchVal)">
        <Button slot="append" icon="ios-search" @click="gridSearch(searchVal)">搜索</Button>
        </Input>
      </div>
      <div class="tableContent">
        <bs-scroll ref="scroller">
          <Table border :columns="gridEditColumns" :data="gridEditList" @on-select="gridSelectOne" @on-select-all="gridSelectAll"></Table>
          <div class="tableFooter">
            <div class="paging">
              <Page size="small" :total="gridPage.count" :page-size-opts="$PageInfo.size" :page-size="gridPage.limit" :current.sync="gridPage.cur" @on-page-size-change="pageSizeChange" @on-change="changePage" show-total></Page>
            </div>
          </div>
        </bs-scroll>
      </div>
    </div>
    <div v-if="gridEdit === 'edit'" class="gridDetail">
      <div class="girdContent">
        <div class="girdContentHeader">
          <p class="pointTittle" :class="{'active': menuTag}" @click="nenuCtrolClick">样式控制</p>
          <p class="pointTittle" :class="{'active': !menuTag}" @click="nenuInfoClick">基本信息</p>
        </div>
        <div v-if="!menuTag" class="girdContentMain">
          <bs-scroll ref="scroller1">
            <Form ref="gridOneData" :rules="ruleValidate" :model="gridOneData" :label-width="70" label-position="left">
              <Form-item label="网格名称" prop="name">
                <Input :maxlength="16" v-model="gridOneData.name" placeholder="请输入网格名称" />
              </Form-item>
              <Form-item label="网格编号" prop="code">
                <Input :maxlength='16' v-model="gridOneData.code" placeholder="请输入网格编号" />
              </Form-item>
              <Form-item label="负责单位" prop="charge">
                <Input :maxlength='32' v-model="gridOneData.charge" placeholder="请输入负责单位" />
              </Form-item>
              <!-- 联系方式 -->
              <contentWay :principal.sync="gridOneData.pids"></contentWay>
              <Form-item label="简介">
                <Input :maxlength='150' v-model="gridOneData.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" />
              </Form-item>
            </Form>
            <!-- 区块索引 -->
            <div v-if="!idGridAdd" class="floorClass">
              <p class="areaTittle">网格区块</p>
              <div class="floorItem" v-for="(item, index) in areaArr" :key="index">
                <p class="floorIcon" :title="index + 1" @click="areaEdit(item)">{{'网格' + ':' + gridOneData.name + '第' + (index + 1) + '块'}}</p>
                <p v-if="areaArr.length > 1" class="floorIcon iconfont icon-error" title="删除区域" @click="areaRemove(index)"></p>
              </div>
            </div>
          </bs-scroll>
        </div>
        <div v-if="menuTag">
          <gridStyle :StyleDefeat.sync="gridOneData.style"></gridStyle>
        </div>
      </div>
      <div v-if="!menuTag" class="girdFooter">
        <Button type="ghost" @click="mapGridCannel('gridOneData')" style="margin-right: -3px">取消</Button>
        <Button type="primary" @click="mapGridSave('gridOneData')" style="margin-left: 16px">保存</Button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import contentWay from '../contentWay'
import { telNumCheck, telNameCheck } from '../../formCheck'
import pageConfig from '../../pageConfig.js'
import gridStyle from './gridStyle'
import areaUtil from '../../../../assets/map/areaUtil.js'
export default {
  components: {
    contentWay,
    gridStyle
  },
  data() {
    // 网格名称校验
    const gridName = (rule, value, callback) => {
      // let rname = /^[(\u4e00-\u9fa5)\w\(\)\（\）\.\'\'\-]{0,64}$/
      let rname = /^[(\u4e00-\u9fa5)\w().''-]{0,64}$/
      if (value === '') {
        return callback(new Error('网格名称不能为空'))
      }
      if (rname.test(value)) {
        let query = { name: '', _id: '' }
        if (this.idGridAdd) {
          query = { name: value, _id: '' }
        } else {
          query = { name: value, _id: this.gridOneData._id }
        }
        this.isGridName(query)
          .then(res => callback())
          .catch(err => {
            callback(new Error(err.response.data.message))
          })
      } else {
        return callback(new Error('网格名称格式有误'))
      }
    }
    const gridCode = (rule, value, callback) => {
      let rcode = /^[A-Za-z0-9]+$/
      if (value === '') {
        return callback(new Error('网格编号不能为空'))
      }
      if (rcode.test(value)) {
        callback()
      } else {
        return callback(new Error('网格编号格式有误'))
      }
    }
    return {
      areaArr: [],
      color1: '#FF0000',
      menuTag: true,
      idGridAdd: false,
      searchVal: '',
      gridEdit: 'show',
      // 单个网格信息
      gridOneData: JSON.parse(JSON.stringify(pageConfig.gridOneData)),
      ruleValidate: {
        name: [{ required: true, validator: gridName, trigger: 'change' }],
        code: [{ required: true, validator: gridCode, trigger: 'change' }]
      },
      gridEditColumns: [
        {
          type: 'selection',
          width: 30,
          align: 'center'
        },
        {
          title: '网格名称',
          key: 'name',
          render: (h, params) => {
            return h('div', [h('strong', params.row.name)])
          },
          width: 120,
          align: 'center',
          ellipsis: true
        },
        {
          title: '操作',
          key: 'action',
          width: 120,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '16px'
                  },
                  on: {
                    click: () => {
                      this.show(params.row._id)
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.row._id)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      gridEditList: [],
      gridPage: {
        cur: 1,
        limit: 11,
        count: 0,
        pages: 0
      },
      screenHeight: document.body.clientHeight // 监听屏幕比例变化
    }
  },
  computed: {
    ...mapState({
      gridList: ({ mapGisData }) => mapGisData.gridList, // 网格列表
      gridData: ({ mapGisData }) => mapGisData.gridData, // 单个网格信息
      page: ({ mapPageState }) => mapPageState.mapEditRightPage.page, // 编辑模式地图右侧页面详细
      detail: ({ mapPageState }) => mapPageState.mapEditRightPage.detail,
      gridLoc: ({ mapAreaData }) => mapAreaData.gridLoc,
      oneMapInfo: ({ mapGisData }) => mapGisData.oneMapInfo, // 当前地图信息
      activeMap: ({ mapGisData }) => mapGisData.activeMap, // 当前地图id
      areaLoc: ({ mapAreaData }) => mapAreaData.areaLoc, // 区域位置信息
      gridPagingList: ({ mapAreaData }) => mapAreaData.gridPagingList, // 网格分页列表
      gridPaging: ({ mapAreaData }) => mapAreaData.gridPaging, // 网格分页参数
      areaStyleCss: ({ mapAreaData }) => mapAreaData.areaStyle // 区域样式
    })
  },
  watch: {
    screenHeight(val) {
      console.log(val)
      // this.$refs.scroller.update()
    },
    // 网格列表
    gridList(val) {
      // this.gridEditList = JSON.parse(JSON.stringify(val))
    },
    // 楼宇分页列表
    gridPagingList(val) {
      this.gridEditList = JSON.parse(JSON.stringify(val))
      // this.gridPage = JSON.parse(JSON.stringify(this.gridPaging))
    },
    // 单个网格信息
    gridData(val) {
      this.gridOneData = JSON.parse(JSON.stringify(val))
      if (!this.gridOneData.pids) {
        this.gridOneData.pids = [{ name: '', mobile: '' }]
      }
      if (!this.gridOneData.style) {
        this.gridOneData.style = JSON.parse(JSON.stringify(pageConfig.gridOneData)).style
      }
      this.areaArr = this.gridOneData.loc.split('|')
    },
    // 页面详情
    detail(val) {
      this.gridEdit = val
    },
    areaLoc(val) {
      this.areaArr = val.split('|')
    }
  },
  methods: {
    ...mapMutations(['SET_EDITRIGHTPAGE_STATE', 'SET_AREA_ADD', 'SET_ACTIVEEXTENT_DATA']),
    ...mapActions([
      'getGrid',
      'getOneGrid',
      'editOneGrid',
      'deleteOneGrid',
      'addOneGrid',
      'isGridName',
      'getGridPaging'
    ]),
    // 页面默认显示
    initPage(val) {
      this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: this.page, detail: val })
    },
    // 获取网格列表
    getGridAllList(obj) {
      // 获取网格列表
      let getGeridAll = this.getGrid(obj.id)
      let getGeridAllPage = this.getGridPaging({
        page: obj.page,
        id: obj.id,
        name: obj.name,
        limit: this.gridPage.limit
      })
      Promise.all([getGeridAll, getGeridAllPage])
        .then(res => {
          this.gridPage.count = res[0].length
        })
        .catch(err => {
          console.log(err)
        })
      this.$nextTick(() => {
        console.log(this.$refs)
        this.$refs.scroller.update()
      })
    },
    // 添加联系人
    addLinkman() {
      this.girdData.pids.push({
        name: '',
        mobile: ''
      })
    },
    // 移除联系人
    removeLinkman(index) {
      this.girdData.pids.splice(index, 1)
    },
    // 取消保存
    mapGridCannel(name) {
      this.initPage('show')
      this.idGridAdd = false
      this.$store.commit('SET_AREA_ADD', false)
      this.$store.commit('SET_AREA_LOC', '')
      this.$refs[name].resetFields()
    },
    // 保存
    mapGridSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let nameRepeat = telNameCheck(this.gridOneData.pids)
          if (nameRepeat) {
            this.errorMsg('负责人重复')
          } else {
            let flag = telNumCheck(this.gridOneData.pids)
            if (flag) {
              this.errorMsg('联系方式输入有误，仅支持数字和(-)')
            } else {
              this.oneGridSave()
            }
          }
        }
      })
    },
    oneGridSave() {
      if (this.idGridAdd) {
        if (this.areaLoc) {
          this.gridOneData.loc = this.areaLoc
          this.gridOneData.mapId = this.oneMapInfo.mapId
          this.addOneGrid(this.gridOneData)
            .then(res => {
              this.initPage('show')
              // let { count, limit, cur, pages } = this.gridPage
              // if (count % limit === 0) {
              //   if (pages.toString() === cur.toString()) {
              //     cur = cur + 1
              //   }
              // }
              let { cur } = this.gridPage
              this.getGridAllList({ page: cur, id: this.activeMap, name: '' })
              this.idGridAdd = false
              this.gridPage.limit = this.$PageInfo.limit
              // 关闭网格化绘制
              this.$store.commit('SET_AREA_ADD', false)
              this.$store.commit('SET_AREA_LOC', '')
            })
            .catch(err => {
              console.log(err)
              this.errorMsg('网格添加失败,请检查网格基本信息输入')
            })
        } else {
          this.$Notice.warning({
            title: '提示',
            desc: '请绘制网格区域',
            duration: 2
          })
        }
      } else {
        if (this.areaLoc) {
          this.gridOneData.loc = this.areaLoc
        }
        // 编辑网格
        this.editOneGrid(this.gridOneData)
          .then(res => {
            this.initPage('show')
            this.getGridAllList({ page: this.gridPage.cur, id: this.activeMap, name: '' })
            this.idGridAdd = false
            this.gridPage.limit = this.$PageInfo.limit
            this.$store.commit('SET_AREA_LOC', '')
          })
          .catch(err => {
            console.log(err)
            this.errorMsg('网格修改失败')
            this.$store.commit('SET_AREA_LOC', '')
          })
      }
    },
    // 编辑网格
    show(val) {
      this.getOneGrid(val)
        .then(res => {
          this.initPage('edit')
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 删除网格
    remove(val) {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除所选网格吗？</p>',
        onOk: () => {
          this.deleteOneGrid(val)
            .then(res => {
              let { count, limit, cur, pages } = this.gridPage
              if (count % limit === 1) {
                if (pages.toString() === cur.toString() && count.toString() !== '1') {
                  cur = cur - 1
                }
              }
              this.getGridAllList({ page: cur, id: this.activeMap, name: '' })
            })
            .catch(err => {
              console.log(err)
              this.errorMsg('网格删除失败')
            })
        },
        onCancel: () => { }
      })
    },
    // 搜索网格
    gridSearch(val) {
      this.getGridAllList({ page: 1, id: this.activeMap, name: val })
    },
    // 全部删除
    handleSelectAll(val) {
      console.log(val)
    },
    // 添加网格
    gridAdd() {
      this.initPage('edit')
      this.idGridAdd = true
      this.menuTag = true
      // 开启网格化绘制
      this.$store.commit('SET_AREA_ADD', true)
      // 单个网格信息
      this.gridOneData = JSON.parse(JSON.stringify(pageConfig.gridOneData))
    },
    changePage(val) {
      this.getGridAllList({ page: val, id: this.activeMap, name: this.searchVal })
    },
    pageSizeChange(val) {
      this.gridPage.limit = val
      this.gridPage.cur = 1
      this.getGridAllList({ page: 1, id: this.activeMap, name: this.searchVal })
    },
    gridSelectOne(selection, row) {
      // console.log('gridSelectOne', selection, row)
    },
    gridSelectAll(selection) {
      // console.log('gridSelectAll', selection)
    },
    checkColor(val) {
      this.gridOneData.rgbcolor = val
      this.$store.commit('SET_AREA_FILLCOLOR', val)
    },
    nenuInfoClick() {
      this.menuTag = false
    },
    nenuCtrolClick() {
      this.menuTag = true
    },
    areaRemove(val) {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除所选网格区块吗？</p>',
        onOk: () => {
          this.areaArr.splice(val, 1)
          let locString = this.areaArr.join('|').toString()
          this.$store.commit('SET_AREA_LOC', locString)
          this.mapGridSave('gridOneData')
        },
        onCancel: () => { }
      })
    },
    // 动态定位
    areaEdit(val) {
      let obj = areaUtil.getMultiPExtentAndCenter(val)
      this.$store.commit('SET_ACTIVEEXTENT_DATA', obj)
    }
  },
  mounted() {
    this.gridEditList = JSON.parse(JSON.stringify(this.gridPagingList))
    this.getGridAllList({ page: 1, id: this.activeMap, name: this.searchVal })
    this.resizeFn = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        this.screenHeight = window.screenHeight
      })()
    }
    window.addEventListener('resize', this.resizeFn)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFn)
    this.resizeFn = null
  }
}
</script>
<style scoped>
.girdHome {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.girdHome .girdHeader {
  height: 40px;
  width: 100%;
  line-height: 40px;
  clear: both;
  background-color: #0f2343;
  text-align: center;
  display: flex;
  cursor: default;
}
.girdHome .girdHeader .girdText {
  float: left;
  flex: 1;
  font-size: 14px;
}
.girdHome .girdHeader .girdTextAdd {
  float: right;
  width: 40px;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
}
.girdHome .girdHeader .girdTextAdd:hover {
  color: #20adff;
}
.girdHome .girdHeader .girdHeaderContent {
  float: right;
  margin-right: 20px;
}
.girdHome .girdHeader .girdHeaderContent p {
  display: inline;
  margin: 0 10px;
}
.girdHome .gridTable {
  display: flex;
  padding: 9px;
  flex: 1;
  flex-direction: column;
}
.tableContent {
  display: flex;
  flex: 1;
  width: 102%;
}
.tableContent .bs-scroll {
  width: 100%;
}
.girdHome .gridDetail {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.girdHome .gridTable .gridTableSearch {
  margin-bottom: 10px;
}
.girdHome .gridTable .tableFooter {
  padding: 10px;
  clear: both;
  width: 100%;
  height: 26px;
  line-height: 26px;
}
.girdHome .gridTable .pagingButton {
  float: left;
}
.paging .ivu-page-simple .ivu-page-simple-pager input {
  vertical-align: middle;
  line-height: 15px;
  padding: 3px 1px 1px 1px;
}
.girdHome .ivu-page-simple .ivu-page-simple-pager input,
.areaHome .ivu-page-simple .ivu-page-simple-pager input,
.emergenceHome .ivu-page-simple .ivu-page-simple-pager input {
  line-height: 15px;
  padding: 3px 1px 1px 1px;
}
.girdHome .girdContent {
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 300px;
}
.girdHome .girdContent .girdContentHeader {
  width: 100%;
  height: 50px;
}
.girdHome .girdContentMain {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.girdContent .pointTittle {
  height: 40px;
  line-height: 40px;
  display: inline-block;
  margin: 0 10px;
  padding: 0 10px;
  margin-bottom: 10px;
  cursor: pointer;
}
.girdContent .active {
  border-bottom: 1px solid #4996f9;
}

.girdContent .linkMan {
  text-align: center;
}
.girdHome .girdFooter {
  height: 40px;
  width: 100%;
  line-height: 40px;
  clear: both;
  text-align: center;
}
.girdContent .floorClass {
  margin-bottom: 15px;
}
.girdContent .floorClass .areaTittle {
  height: 40px;
  line-height: 40px;
}
.girdContent .floorClass .floorItem {
  display: inline-block;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  padding: 0px 5px;
  border-radius: 10px;
  border: 1px solid #5676a9;
  margin-right: 2px;
  clear: both;
  cursor: default;
}
.girdContent .floorClass .floorItem .floorIcon {
  float: left;
  height: 20px;
  line-height: 20px;
  font-size: 10px;
  padding: 0 2px;
}
</style>
