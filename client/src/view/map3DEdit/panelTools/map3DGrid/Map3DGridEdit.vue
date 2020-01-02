<!--编辑模式 网格的右边编辑框的页面-->
<template>
  <div class="girdHome">
    <div class="girdHeader">
      <p class="girdText">网格化</p>
      <i v-if="gridEdit === 'show'" class="icon iconfont icon-add girdTextAdd" title="添加网格" @click="gridAdd"></i>
    </div>
    <div v-if="gridEdit === 'show'" class="gridTable">
      <div class="gridTableSearch">
        <Input :maxlength='64' v-model="searchVal" @on-enter="gridSearch(searchVal)">
        <Button v-if="isSearch" slot="append" icon="ios-search" @click="gridSearch(searchVal)">搜索</Button>
        <Button v-else slot="append" icon="ios-close-outline" @click="gridSearch">搜索</Button>
        </Input>
      </div>
      <div class="tableContent">
        <bs-scroll ref="scroller">
          <Table border :columns="gridEditColumns" :data="gridEditList"></Table>
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
          <p class="pointTittle" :class="{'active': !menuTag}" @click="menuInfoClick">基本信息</p>
          <p class="pointTittle" :class="{'active': menuTag}" @click="menuCtrolClick">样式控制</p>
        </div>
        <div v-if="!menuTag" class="girdContentMain">
          <bs-scroll ref="scroller">
            <Form ref="gridOneData" :rules="ruleValidate" :model="gridOneData" :label-width="70" label-position="left">
              <Form-item label="网格名称" prop="name">
                <Input :maxlength="64" v-model="gridOneData.name" placeholder="请输入网格名称" />
              </Form-item>
              <Form-item label="网格编号" prop="code">
                <Input :maxlength='16' v-model="gridOneData.code" placeholder="请输入网格编号" />
              </Form-item>
              <!-- 联系方式 -->
              <ContentWay :principal.sync="gridOneData.pids"></ContentWay>
              <Form-item label="简介">
                <Input :maxlength='400' v-model="gridOneData.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" />
              </Form-item>
            </Form>
          </bs-scroll>
        </div>
        <div v-if="menuTag" style="height:92%;">
          <Map3DStyleControl :styleDefault.sync="gridOneData.style"></Map3DStyleControl>
        </div>
      </div>
      <div class="girdFooter">
        <Button type="ghost" @click="mapGridCannel('gridOneData')" style="margin-right: -3px">取消</Button>
        <Button type="primary" @click="mapGridSave('gridOneData')" style="margin-left: 16px">保存</Button>
      </div>
    </div>
  </div>
</template>
<script>
import gridUtil from 'assets/3DMap/gridUtil.js'
import ContentWay from 'components/map/contentWay'
import { telNumCheck, telNameCheck } from 'components/map/formCheck'
import pageConfig from './pageConfig.js'
import Map3DStyleControl from './Map3DStyleControl'
import gridStyle from 'assets/3DMap/gridStyle.js'
import { mapActions, mapState } from 'vuex'
export default {
  components: {
    ContentWay,
    Map3DStyleControl
  },
  data() {
    // 网格名称校验
    const gridName = (rule, value, callback) => {
      const rname = /^[(\u4e00-\u9fa5)\w()（）.''-]{0,64}$/
      if (value === '') {
        return callback(new Error('网格名称不能为空'))
      }
      if (rname.test(value)) {
        callback()
      } else {
        return callback(new Error('网格名称格式有误'))
      }
    }
    const gridCode = (rule, value, callback) => {
      const rcode = /^[A-Za-z0-9]+$/
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
      isSearch: true,
      areaArr: [],
      menuTag: true, // 信息页
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
          title: '网格名称',
          key: 'name',
          render: (h, params) => {
            return h('div', [h('strong', params.row.name)])
          },
          width: 130,
          align: 'center',
          ellipsis: true
        },
        {
          title: '操作',
          key: 'action',
          width: 135,
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
                      this.editGrid(params.row)
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
                      this.removeGrid(params.row._id)
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
      gridLoc: ({ tdFloor }) => tdFloor.gridLoc, // 楼宇内网格位置----胡红勋
      floorData: ({ tdFloor }) => tdFloor.floorData,
      is3DMapOuter: ({ tdIndex }) => tdIndex.is3DMapOuter // 楼层平面图和三维地图切换的标识-----
    })
  },
  watch: {
    screenHeight(val) {
      this.$refs.scroller.update()
    },
    gridOneData: {
      handler(newVal, oldVal) {
      },
      deep: true
    },
    gridEditList: {
      handler(newVal, oldVal) {
        let features = gridUtil.convertGridDatasToFeatures(newVal)
        this.setGridList(features)
      },
      deep: true
    }
  },
  methods: {
    ...mapActions([
      'set2DActiveGridDraw',
      'getGridList',
      'getPageGridList',
      'addMap3DOneGrid',
      'editMap3DOneGrid',
      'deleteMap3DOneGrid',
      'setGridList',
      'setGridLoc',
      'setEditGridData',
      'setEditFeaturesList',
      'setIsEditGrid',
      'set2DActiveEdit',
      'setDrawGridStyle'
    ]),
    /* 获取所有网格 */
    getGridAllList(obj) {
      const getGridAll = this.getGridList({id: obj.id})
      const getGridPageList = this.getPageGridList({
        page: obj.page,
        id: obj.id,
        name: obj.name,
        limit: this.gridPage.limit
      })
      Promise.all([getGridAll, getGridPageList])
        .then(res => {
          this.gridEditList = res[1]
          this.gridPage.count = res[0].length
          this.$refs.scroller.update()
        })
        .catch(err => {
          console.log(err)
        })
    },
    /* 取消保存 */
    mapGridCannel(name) {
      this.gridEdit = 'show'
      this.idGridAdd = false
      this.searchVal = ''
      this.isSearch = true
      this.setDrawGridStyle(JSON.parse(JSON.stringify(gridStyle.gridDrawEndStyle)))
      this.getGridAllList({ page: this.gridPage.cur, id: this.floorData._id, name: '' })
      this.set2DActiveGridDraw(false)
      this.setGridLoc('')
      this.setIsEditGrid(false)
      this.set2DActiveEdit(false)
      this.setEditFeaturesList([])
    },
    /* 保存 */
    mapGridSave(name) {
      this.menuTag = false
      this.$nextTick(() => {
        this.$refs[name].validate(valid => {
          if (valid) {
            const nameRepeat = telNameCheck(this.gridOneData.pids)
            if (nameRepeat) {
              this.errorMsg('负责人重复')
            } else {
              const flag = telNumCheck(this.gridOneData.pids)
              if (flag) {
                this.errorMsg('联系方式输入有误，仅支持数字和(-)')
              } else {
                this.oneGridSave()
              }
            }
          }
        })
      })
    },
    oneGridSave() {
      // 添加网格保存
      if (this.idGridAdd) {
        if (this.gridLoc) {
          this.gridOneData.loc = this.gridLoc
          this.gridOneData.sid = this.floorData._id
          this.addMap3DOneGrid(this.gridOneData).then(res => {
            this.gridEdit = 'show'
            this.idGridAdd = false
            this.searchVal = ''
            this.isSearch = true
            this.getGridAllList({ page: this.gridPage.cur, id: this.floorData._id, name: '' })
            this.set2DActiveGridDraw(false)
            this.setGridLoc('')
            this.setDrawGridStyle(JSON.parse(JSON.stringify(gridStyle.gridDrawEndStyle)))
            this.successMsg('网格添加成功')
          }).catch(() => {
            this.errorMsg('网格添加失败,请检查网格基本信息输入')
          })
        } else {
          this.$Notice.warning({
            title: '提示',
            desc: '请绘制网格区域',
            duration: 2
          })
        }
      } else { // 编辑网格保存
        if (this.gridLoc) {
          this.gridOneData.loc = this.gridLoc
        }
        const param = {
          id: this.gridOneData._id,
          body: this.gridOneData
        }
        this.setIsEditGrid(false)
        this.set2DActiveEdit(false)
        this.setEditFeaturesList([])
        this.editMap3DOneGrid(param).then(res => {
          this.gridEdit = 'show'
          this.idGridAdd = false
          this.searchVal = ''
          this.isSearch = true
          this.setDrawGridStyle(JSON.parse(JSON.stringify(gridStyle.gridDrawEndStyle)))
          this.getGridAllList({ page: this.gridPage.cur, id: this.floorData._id, name: '' })
          this.setGridLoc('')
          this.successMsg('网格修改成功')
        }).catch(() => {
          this.errorMsg('网格修改失败')
          this.setGridLoc('')
        })
      }
    },
    /* 编辑网格 */
    editGrid(val) {
      this.gridOneData = JSON.parse(JSON.stringify(val))
      this.setIsEditGrid(true)
      this.gridEdit = 'edit'
      this.menuTag = false
      if (this.gridOneData.pids.length === 0) {
        this.gridOneData.pids.push({name: '', mobile: ''})
      }
      this.setDrawGridStyle(JSON.parse(JSON.stringify(this.gridOneData.style))) // 保存网格
      this.setEditGridData(val) // 保存网格信息
    },
    /* 删除网格 */
    removeGrid(val) {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除所选网格吗？</p>',
        onOk: () => {
          this.deleteMap3DOneGrid(val).then(() => {
            if (this.gridPage.count !== 1 && this.gridEditList.length === 1) {
              this.gridPage.cur -= 1
            }
            this.searchVal = ''
            this.isSearch = true
            this.getGridAllList({ page: this.gridPage.cur, id: this.floorData._id, name: '' })
            this.successMsg('网格删除成功')
          }).catch(() => {
            this.errorMsg('网格删除失败')
          })
        },
        onCancel: () => {}
      })
    },
    /* 搜索网格 */
    gridSearch(val) {
      if (this.isSearch) {
        const param = {
          page: 1,
          id: this.floorData._id,
          name: val,
          limit: this.gridPage.limit
        }
        this.getPageGridList(param).then((res) => {
          this.gridEditList = res
          this.gridPage.count = res.length
        })
        this.isSearch = false
      } else {
        this.searchVal = ''
        this.isSearch = true
        this.getGridAllList({ page: 1, id: this.floorData._id, name: '' })
      }
    },
    /* 添加网格 */
    gridAdd() {
      this.gridEdit = 'edit'
      this.idGridAdd = true
      this.menuTag = false
      // 开启网格化绘制
      this.set2DActiveGridDraw(true)
      // 单个网格信息
      this.gridOneData = JSON.parse(JSON.stringify(pageConfig.gridOneData))
    },
    changePage(val) {
      this.getGridAllList({ page: val, id: this.floorData._id, name: this.searchVal })
    },
    pageSizeChange(val) {
      this.gridPage.limit = val
      this.gridPage.cur = 1
      this.getGridAllList({ page: 1, id: this.floorData._id, name: this.searchVal })
    },
    /* 标签切换 */
    menuInfoClick() {
      this.menuTag = false
    },
    menuCtrolClick() {
      this.menuTag = true
    }
  },
  mounted() {
    this.getGridAllList({ page: 1, id: this.floorData._id, name: this.searchVal })
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
  width: 300px;
  height: 100%;
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
.girdHome .gridTable {
  height: 70%;
  background: #1b3153;
  display: flex;
  padding: 9px;
  flex-direction: column;
}
.tableContent {
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
}
.tableContent .bs-scroll {
  width: 100%;
}
.girdHome .gridDetail {
  height: 63%;
  min-height: 660px;
  background: #1b3153;
  display: flex;
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
  min-height: 660px;
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
.girdHome .girdFooter {
  /* height: 40px; */
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
