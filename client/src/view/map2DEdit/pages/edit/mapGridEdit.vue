<!--编辑模式 网格的右边编辑框的页面-->
<template>
  <div class="girdHome">
    <div class="girdHeader">
      <p class="girdText">网格列表</p>
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
                <Input :maxlength="64" v-model="gridOneData.name" placeholder="请输入网格名称" />
              </Form-item>
              <Form-item label="网格编号" prop="code">
                <Input :maxlength='64' v-model="gridOneData.code" placeholder="请输入网格编号" />
              </Form-item>
              <!-- 联系方式 -->
              <contentWay :principal.sync="gridOneData.pids"></contentWay>
              <Form-item label="简介">
                <Input :maxlength='400' v-model="gridOneData.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" />
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
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import contentWay from 'components/map/contentWay'
import { isInvalidPrincipal } from 'components/map/formCheck'
import pageConfig from '../../pageConfig.js'
import gridStyle from './gridStyle'
import areaUtil from '../../../../assets/map/areaUtil.js'
export default {
  components: {
    contentWay,
    gridStyle
  },
  data() {
    const nameValidator = (rule, value, callback) => { // 名称校验
      value = value.replace(/(^\s*)|(\s*$)/g, '')
      if (value && value.length > 0) {
        let len = 0
        for (let i = 0; i < value.length; i++) {
          const code = Number(value[i].charCodeAt(0))
          if (code > 127) {
            len += 2
          } else {
            len++
          }
        }
        if (len > 64) {
          return callback(new Error('不能超过64位字符'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('名称不能为空'))
      }
    }
    const gridCode = (rule, value, callback) => {
      let reg = /^[A-Za-z0-9]+$/
      if (value) {
        if (reg.test(value)) {
          let len = 0
          for (let i = 0; i < value.length; i++) {
            const code = Number(value[i].charCodeAt(0))
            if (code > 127) {
              len += 2
            } else {
              len++
            }
          }
          if (len > 64) {
            return callback(new Error('不能超过64位字符'))
          } else {
            callback()
          }
        } else {
          callback(new Error('只支持数字和字母'))
        }
      } else {
        callback(new Error('编号不能为空'))
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
        name: [{ required: true, validator: nameValidator, trigger: 'change' }],
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
      page: ({ mapIndex }) => mapIndex.mapEditRightPage.page, // 编辑模式地图右侧页面详细
      detail: ({ mapIndex }) => mapIndex.mapEditRightPage.detail,
      gridPagingList: ({ mapArea }) => mapArea.gridPagingList, // 网格分页列表
      gridPaging: ({ mapArea }) => mapArea.gridPaging, // 网格分页参数
      isMapOuter: ({ mapIndex }) => mapIndex.isMapOuter, // 地图是否是楼内
      currentFloor: ({ mapArea }) => mapArea.currentFloor // 编辑模式地图右侧页面详细
    }),
    ...mapGetters({
      activeMapConfig: 'activeMapConfig', // 当前地图配置数据
      drawFeatureLoc: 'drawFeatureLoc', // 绘制区域的坐标
      gridData: 'currentGrid', // 当前网格
      mapProjection: 'mapProjection' // 当前地图投影方式
    })
  },
  watch: {
    screenHeight(val) {
      console.log(val)
      // this.$refs.scroller.update()
    },
    // 楼宇分页列表
    gridPagingList(val) {
      this.gridEditList = JSON.parse(JSON.stringify(val))
      // this.gridPage = JSON.parse(JSON.stringify(this.gridPaging))
    },
    // 单个网格信息
    gridData(val) {
      if (!val) { return }
      this.gridOneData = JSON.parse(JSON.stringify(val))
      if (!this.gridOneData.pids || !this.gridOneData.pids.length) {
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
    drawFeatureLoc(val) {
      this.areaArr = val.split('|')
    },
    activeMapConfig: {
      handler(config) {
        this.getGridAllList({ page: 1, name: this.searchVal })
      },
      deep: true
    },
    currentFloor: {
      handler(val) {
        this.getGridAllList({ page: 1, name: this.searchVal })
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations(['SET_EDIT_RIGHT_PAGE_STATE', 'SET_ACTIVEEXTENT_DATA', 'SET_AREA_DRAW_ACTIVE', 'SET_CURRENT_GRID', 'SET_LOCATE_FEATURES', 'SET_DRAW_FEATURE_LOC', 'SET_FEATURE_EDIT_ACTIVE']),
    ...mapActions([
      'loadGridsByMapId',
      'loadGridsByFloorId',
      'getGridData',
      'editOneGridApi',
      'deleteOneGridApi',
      'addOneGridApi',
      'isGridNameApi',
      'getGridPagingApi',
      'getGridPagingByFloorId'
    ]),
    // 页面默认显示
    initPage(val) {
      this.$store.commit('SET_EDIT_RIGHT_PAGE_STATE', { page: this.page, detail: val })
    },
    // 获取网格列表
    getGridAllList(obj) {
      // 获取网格列表
      let query = {
        page: obj.page,
        name: obj.name,
        limit: this.gridPage.limit
      }
      let getGeridAll = null
      let getGeridAllPage = null
      if (this.isMapOuter && this.activeMapConfig && this.activeMapConfig._id) { // 楼层外地图
        query.id = this.activeMapConfig._id
        getGeridAll = this.loadGridsByMapId(query.id)
        getGeridAllPage = this.getGridPagingApi(query)
      } else if (this.currentFloor && this.currentFloor._id) { // 楼层内地图时
        query.id = this.currentFloor._id
        getGeridAll = this.loadGridsByFloorId(query.id)
        getGeridAllPage = this.getGridPagingByFloorId(query)
      }
      if (getGeridAll && getGeridAllPage) {
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
      }
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
      // this.$store.commit('SET_AREA_ADD', false)
      // this.$store.commit('SET_DRAW_FEATURE_LOC', '')
      this.SET_AREA_DRAW_ACTIVE(false) // 关闭区域绘制
      this.SET_FEATURE_EDIT_ACTIVE(false) // 关闭要素编辑
      this.SET_LOCATE_FEATURES([]) // 清空高亮定位要素
      this.$refs[name].resetFields()
    },
    // 保存
    mapGridSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let result = isInvalidPrincipal(this.gridOneData.pids)
          if (result.flag && result.msg) {
            this.errorMsg(result.msg)
          } else {
            this.oneGridSave()
          }
        }
      })
    },
    oneGridSave() {
      if (this.idGridAdd) {
        if (this.drawFeatureLoc) {
          this.gridOneData.loc = this.drawFeatureLoc
          this.gridOneData.mapId = this.activeMapConfig.mapId
          this.gridOneData.projection = this.mapProjection
          if (!this.isMapOuter && this.currentFloor && this.currentFloor._id) {
            this.gridOneData.sid = this.currentFloor._id
          }
          this.addOneGridApi({
            body: this.gridOneData,
            mapId: this.gridOneData.mapId
          })
            .then(res => {
              this.initPage('show')
              let { cur } = this.gridPage
              this.getGridAllList({ page: cur, name: '' })
              this.idGridAdd = false
              this.gridPage.limit = this.$PageInfo.limit
              // 关闭网格化绘制
              this.SET_AREA_DRAW_ACTIVE(false) // 关闭区域绘制
              this.SET_FEATURE_EDIT_ACTIVE(false) // 关闭要素编辑
              this.SET_LOCATE_FEATURES([]) // 清空高亮定位要素
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
        if (this.drawFeatureLoc) {
          this.gridOneData.loc = this.drawFeatureLoc
          this.gridOneData.projection = this.mapProjection
        }
        // 编辑网格
        this.editOneGridApi(this.gridOneData)
          .then(res => {
            this.initPage('show')
            this.getGridAllList({ page: this.gridPage.cur, name: '' })
            this.idGridAdd = false
            this.gridPage.limit = this.$PageInfo.limit
            this.SET_DRAW_FEATURE_LOC('')
          })
          .catch(err => {
            console.log(err)
            this.errorMsg('网格修改失败')
            this.SET_DRAW_FEATURE_LOC('')
          })
        this.SET_AREA_DRAW_ACTIVE(false) // 关闭区域绘制
        this.SET_FEATURE_EDIT_ACTIVE(false) // 关闭要素编辑
        this.SET_LOCATE_FEATURES([]) // 清空高亮定位要素
      }
    },
    // 编辑网格
    show(val) {
      this.getGridData(val)
        .then(res => {
          this.SET_CURRENT_GRID(res)
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
          this.deleteOneGridApi(val)
            .then(res => {
              let { count, limit, cur, pages } = this.gridPage
              if (count % limit === 1) {
                if (pages.toString() === cur.toString() && count.toString() !== '1') {
                  cur = cur - 1
                }
              }
              this.getGridAllList({ page: cur, name: '' })
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
      this.getGridAllList({ page: 1, name: val })
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
      // this.$store.commit('SET_AREA_ADD', true)
      this.SET_AREA_DRAW_ACTIVE(true)
      // 单个网格信息
      this.gridOneData = JSON.parse(JSON.stringify(pageConfig.gridOneData))
    },
    changePage(val) {
      this.getGridAllList({ page: val, name: this.searchVal })
    },
    pageSizeChange(val) {
      this.gridPage.limit = val
      this.gridPage.cur = 1
      this.getGridAllList({ page: 1, name: this.searchVal })
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
          this.drawFeatureLoc = this.areaLoc
          this.SET_DRAW_FEATURE_LOC(locString)
          this.mapGridSave('gridOneData')
        },
        onCancel: () => {
        }
      })
    },
    // 动态定位
    areaEdit(val) {
      let center = areaUtil.getMultiPExtentAndCenter(val).center.toString()
      const arr = center.split(',').map(item => Number(item))
      this.$context2D.map.getView().setCenter(arr)
    }
  },
  mounted() {
    this.gridEditList = JSON.parse(JSON.stringify(this.gridPagingList))
    this.getGridAllList({ page: 1, name: this.searchVal })
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
  overflow-x: hidden;
  overflow-y: auto;
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
