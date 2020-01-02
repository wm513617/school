<!--编辑模式 楼宇的右边编辑框的页面-->
<template>
  <div class="areaHome">
    <div class="areaHeader">
      <div class="areaHeaderTittle">
        <p>楼宇列表</p>
      </div>
      <div v-if="isMapOuter && detail === 'show'" class="areaHeaderContent">
        <p class="icon iconfont icon-add" tittle="添加楼宇" @click="buildAdd"></p>
      </div>
    </div>
    <div v-if="detail === 'show'" class="buildTable">
      <div class="buildTableSearch">
        <Input v-model="searchVal" @on-enter="buildSearch(searchVal)">
        <Button slot="append" icon="ios-search" @click="buildSearch(searchVal)">搜索</Button>
        </Input>
      </div>
      <div class="tableContent">
        <bs-scroll ref="scroller">
          <Table border :columns="buildEditColumns" :data="buildEditList" @on-select="buildSelectOne" @on-select-all="buildSelectAll"></Table>
          <div class="tableFooter">
            <div v-if="false" class="pagingButton">
              <Button type='primary' size='small' @click="handleSelectAll(true)">全部删除</Button>
            </div>
            <div class="paging">
              <div>
                <Page size="small" :page-size-opts="$PageInfo.size" :total="buildPage.count" :page-size="buildPage.limit" :current="buildPage.cur" @on-change="changePage" @on-page-size-change="pageSizeChange" show-total></Page>
              </div>
            </div>
          </div>
        </bs-scroll>
      </div>
    </div>
    <div v-if="detail === 'edit'" class="builddetail">
      <div class="areaContent">
        <div class="areaContentHeader">
          <p class="areaContentTittle" :class="{'active': menuTag}" @click="nenuCtrolClick">样式控制</p>
          <p class="areaContentTittle" :class="{'active': !menuTag}" @click="nenuInfoClick">基本信息</p>
        </div>
        <div v-show="!menuTag" class="areaContentMain">
          <bs-scroll ref="scroller">
            <div class="areaContentInfo">
              <div class="buildEditMain">
                <div class="buildEditImg">
                  <div class="buildImg">
                    <img v-if="buileAddUrl" style="width:100%;height:100%;" :src="buileAddUrl">
                  </div>
                  <Upload action="/api/upload/file?category=building&type=image" :show-upload-list="false" :on-success="uploadEditSuccess" :multiple="false" ref="upload" :format="['jpg','jpeg','png']" :on-format-error="mapFormatError">
                    <Button type="ghost" icon="ios-cloud-upload-outline">点击上传图片</Button>
                  </Upload>
                  <P class="buildEditImgText">286px*168px,支持JPEG、PNG格式</P>
                </div>
                <Form ref="buildOneData" :rules="ruleValidate" :model="buildOneData" :label-width="70" label-position="left">
                  <Form-item label="所属网格" prop="grid">
                    <Select v-model="buildOneData.gid._id" style="width:100%" @on-change="getOneGridSel">
                      <Option v-for="item in gridSelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </Form-item>
                  <Form-item label="楼宇名称" prop="name">
                    <Input :maxlength="16" v-model="buildOneData.name" placeholder="请输入楼宇名称" />
                  </Form-item>
                  <Form-item label="楼宇编号" prop="code">
                    <Input :maxlength="16" v-model="buildOneData.code" placeholder="请输入楼宇编号" />
                  </Form-item>
                  <!-- 联系方式 -->
                  <contentWay :principal.sync="buildOneData.pid"></contentWay>
                  <Form-item label="简介">
                    <Input :maxlength="400" v-model="buildOneData.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" />
                  </Form-item>
                </Form>
                <div v-if="!isBuildAdd" class="floorClass">
                  <p class="pointTittle">楼宇区块</p>
                  <div class="floorItem" v-for="(item, index) in buildAreaArr" :key="index">
                    <p class="floorIcon" :title="item.name" @click="buildAreaEdit(item)">{{'楼宇' + ':' + buildOneData.name + '第' + (index + 1) + '块'}}</p>
                    <p v-if="buildAreaArr.length > 1" class="floorIcon iconfont icon-error" title="删除楼宇区块" @click="buildAreaRemove(index)"></p>
                  </div>
                </div>
                <div v-if="!isBuildAdd" class="floorClass">
                  <p class="pointTittle">楼层</p>
                  <div class="floorItem" v-for="(item, index) in floorArr" :key="index">
                    <p class="floorIcon" :title="item.name" @click="levelEdit(item._id)">{{item.name}}</p>
                    <p class="floorIcon iconfont icon-error" title="删除楼层" @click="levelRemove(item._id)"></p>
                  </div>
                  <div class="floorItem floorRemove" @click="levelAdd">
                    <P class="floorIcon iconfont icon-add" style="margin-top: -1px;" title="添加楼层"></P>
                    <P class="floorIcon">添加楼层</P>
                  </div>
                </div>
              </div>
            </div>
          </bs-scroll>
        </div>
        <div v-show="menuTag" class="areaContentMainForm buildEditMain">
          <styleCtrol :StyleDefeat.sync="buildOneData.style"></styleCtrol>
        </div>
      </div>
      <div v-if="!menuTag" class="areaFooter">
        <Button type="ghost" @click="mapBuildCannel('buildOneData')" style="margin-left: 8px">取消</Button>
        <Button type="primary" @click="mapBuildSave('buildOneData')" style="margin-left: 8px">保存</Button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import contentWay from 'components/map/contentWay'
import pageConfig from '../../pageConfig.js'
import { isInvalidPrincipal } from 'components/map/formCheck'
import areaUtil from 'assets/2DMap/areaUtil.js'
import styleCtrol from '../styleCtrol'
export default {
  components: {
    contentWay,
    styleCtrol
  },
  data() {
    // 楼宇名称校验
    const buildName = (rule, value, callback) => {
      let rname = /^[(\u4e00-\u9fa5)\w]{0,16}$/
      if (value === '') {
        return callback(new Error('楼宇名称不能为空'))
      }
      if (value.indexOf(' ') > -1) {
        return callback(new Error('楼层名称不能包含空格'))
      }
      let strlength = value.replace(/[\u0391-\uFFE5]/g, 'aa').length
      if (strlength > 16) {
        return callback(new Error('楼宇名称长度超过16个字符'))
      }
      if (rname.test(value)) {
        let query = { name: '', _id: '' }
        if (this.idGridAdd) {
          query = { name: value, _id: '' }
        } else {
          query = { name: value, _id: this.buildOneData._id }
        }
        this.isBuildNameApi(query)
          .then(res => {
            callback()
          })
          .catch(err => {
            console.log(err)
            callback(new Error('名称重复'))
          })
      } else {
        return callback(new Error('楼宇名称格式有误'))
      }
    }
    // 楼宇编号校验
    const buildCode = (rule, value, callback) => {
      let rcode = /^[A-Za-z0-9_(\u4e00-\u9fa5)\w]+$/
      if (value === '') {
        return callback(new Error('楼宇编号不能为空'))
      }
      if (rcode.test(value)) {
        callback()
      } else {
        return callback(new Error('楼宇编号格式有误'))
      }
    }
    return {
      buildAreaArr: [],
      menuTag: false,
      buileAddUrl: '',
      isBuildAdd: false,
      searchVal: '',
      buildEdit: '',
      gridSelList: [],
      buildOneData: JSON.parse(JSON.stringify(pageConfig.buildOneData)),
      ruleValidate: {
        name: [{ required: true, validator: buildName, trigger: 'change' }],
        code: [{ required: true, validator: buildCode, trigger: 'change' }]
      },
      floorArr: [], // 楼层
      buildEditColumns: [
        {
          type: 'selection',
          width: 30,
          align: 'center'
        },
        {
          title: '楼宇名称',
          key: 'name',
          width: 140,
          align: 'center',
          ellipsis: true,
          render: (h, params) => {
            return h('div', [h('strong', params.row.name)])
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 100,
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
                  style: { marginRight: '5px' },
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
      buildEditList: [],
      buildPage: {
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
      levelList: ({ mapArea }) => mapArea.levelList, // 楼层列表
      buildPagingList: ({ mapArea }) => mapArea.buildPagingList // 楼宇分页列表
    }),
    ...mapGetters({
      isMapOuter: 'isMapOuter', // 地图是否是楼内
      activeMapConfig: 'activeMapConfig', // 当前地图配置数据
      drawFeatureLoc: 'drawFeatureLoc', // 绘制区域的坐标
      gridResources: 'gridResourceArr', // 网格资源数据
      gridData: 'currentGrid', // 当前网格
      buildData: 'currentBuilding', // 当前楼宇
      mapProjection: 'mapProjection' // 地图投影坐标系
    }),
    ...mapGetters('map2DEditIX', ['editTreeChangeCounter']) // 编辑树计数器
  },
  watch: {
    screenHeight(val) {
      this.$refs.scroller && this.$refs.scroller.update()
    },
    // 楼宇分页列表
    buildPagingList(val) {
      this.buildEditList = JSON.parse(JSON.stringify(val))
    },
    levelList(val) {
      this.floorArr = JSON.parse(JSON.stringify(val))
    },
    // 楼宇信息
    buildData(val) {
      if (!this.isBuildAdd && val && val._id) {
        this.buildOneData = JSON.parse(JSON.stringify(val))
        this.buildAreaArr = this.buildOneData.loc.split('|')
        this.buileAddUrl = this.buildOneData.picture && this.buildOneData.picture.path ? this.buildOneData.picture.path : ''
        if (!this.buildOneData.pid || !this.buildOneData.pid.length) {
          this.buildOneData.pid = [{ name: '', mobile: '' }]
        }
        if (!this.buildOneData.gid) {
          this.buildOneData.gid = { loc: '', _id: '' }
        }
        if (!this.buildOneData.style) {
          this.buildOneData.style = JSON.parse(JSON.stringify(pageConfig.buildOneData)).style
        }
        let newGridList = [
          {
            value: '',
            label: '无'
          }
        ]
        this.gridResources.forEach(element => {
          if (areaUtil.isContainerInGrid(this.buildOneData.loc, element.loc)) {
            let gridSel = { value: element._id, label: element.name }
            newGridList.push(gridSel)
          }
        })
        this.gridSelList = newGridList
      }
    },
    // 网格选项列表
    gridResources(val) {
      let newGridList = [
        {
          value: '',
          label: '无'
        }
      ]
      this.gridResources.forEach(element => {
        if (areaUtil.isContainerInGrid(this.buildOneData.loc, element.loc)) {
          let gridSel = { value: element._id, label: element.name }
          newGridList.push(gridSel)
        }
      })
      this.gridSelList = newGridList
      // this.gridSelList = JSON.parse(JSON.stringify(val))
    },
    // 页面详情
    detail(val) {
      this.buildEdit = val
    },
    drawFeatureLoc(val) {
      let loc = JSON.parse(JSON.stringify(val))
      let newGridList = [{ value: '', label: '无' }]
      this.gridResources.forEach(element => {
        if (areaUtil.isContainerInGrid(loc, element.loc)) {
          let gridSel = { value: element._id, label: element.name }
          newGridList.push(gridSel)
        }
      })
      this.gridSelList = newGridList
      this.buildAreaArr = loc.split('|')
    }
  },
  methods: {
    ...mapMutations([
      'SET_CURRENT_GRID', // 设置当前网格数据
      'SET_CURRENT_BUILDING', // 设置当前楼宇数据
      'SET_DRAW_FEATURE_LOC', // 设置当前绘制区域的位置
      'SET_AREA_DRAW_ACTIVE',
      'SET_FEATURE_EDIT_ACTIVE',
      'SET_LOCATE_FEATURES'
    ]),
    ...mapActions('map2DEditIX', ['changeEditTreeChangeCounter']),
    ...mapActions([
      'loadGridsByMapId',
      'loadGridsByFloorId',
      'get2DAlarmHelpOrgTree',
      'getBuildPagingApi',
      'editOneBuildApi',
      'deleteOneBuildApi',
      'addOneBuildApi',
      'getFoorById',
      'setCurrentFloor',
      'deleteOneLevelApi',
      'isBuildNameApi',
      'getPatrolPointTree',
      'setIsMapOuter', // 设置地图是否在楼外
      'getGridData', // 根据id获取网格数据
      'getLevelApi', // 根据楼宇id获取楼层数据
      'loadBuildingsByMapId', // 根据地图标识加载楼宇数据
      'getBuildingData', // 根据id获取楼宇数据
      'clearAreaFeatures', // 清空区域要素
      'clearPointFeatures' // 清空点位要素
    ]),
    // 图片上传
    uploadEditSuccess(val) {
      this.buileAddUrl = val.path
      this.buildOneData.picture = val
    },
    mapFormatError(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg、jpeg 或 png 格式的图片。'
      })
    },
    // 页面默认显示
    initPage(val) {
      this.$store.commit('SET_EDIT_RIGHT_PAGE_STATE', { page: this.page, detail: val })
    },
    // 获取楼宇列表
    getBuildAllList(obj) {
      let getBuildAll = this.loadBuildingsByMapId(obj.id)
      let getBuildPage = this.getBuildPagingApi({
        page: obj.page,
        id: this.activeMapConfig.mapId,
        name: obj.name,
        limit: this.buildPage.limit
      })
      Promise.all([getBuildAll, getBuildPage])
        .then(res => {
          this.buildPage.count = res[0].length
          this.$refs.scroller && this.$refs.scroller.update()
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 添加联系人
    addLinkman() {
      this.buildData.pid.push({ name: '', mobile: '' })
    },
    // 移除联系人
    removeLinkman(index) {
      this.buildData.pid.splice(index, 1)
    },
    // 取消保存
    mapBuildCannel(name) {
      this.initPage('show')
      this.SET_AREA_DRAW_ACTIVE(false) // 关闭区域绘制
      this.SET_FEATURE_EDIT_ACTIVE(false) // 关闭要素编辑
      this.SET_LOCATE_FEATURES([]) // 清空高亮定位要素
      this.getBuildAllList({ page: this.buildPage.cur, id: this.activeMapConfig.mapId, name: '' })
      this.$refs[name].resetFields()
    },
    buildSave() {
      if (this.isBuildAdd) {
        delete this.buildOneData._id
        if (this.drawFeatureLoc) {
          // 此处进行楼宇属于网格判断
          // 楼宇位置信息 this.drawFeatureLoc
          // 网格位置信息 this.gridData.loc
          this.buildOneData.loc = this.drawFeatureLoc
          // 楼宇添加
          this.buildOneData.mapId = this.activeMapConfig.mapId
          this.buildOneData.projection = this.mapProjection
          let isContain = true
          if (this.gridData && this.buildOneData.gid._id) {
            this.buildOneData.gid.loc = this.gridData.loc
            isContain = areaUtil.isContainerInGrid(this.drawFeatureLoc.toString(), this.gridData.loc.toString())
          }
          if (isContain) {
            let parm = JSON.parse(JSON.stringify(this.buildOneData))
            if (parm.gid) {
              if (!parm.gid._id) {
                delete parm.gid
              }
            }
            this.addOneBuildApi({
              body: parm,
              mapId: this.buildOneData.mapId
            })
              .then(res => {
                let { count, limit, cur, pages } = this.buildPage
                if (count % limit === 0) {
                  if (pages.toString() === cur.toString()) {
                    cur = cur + 1
                  }
                }
                this.getBuildPagingApi({ page: cur, id: this.activeMapConfig.mapId, name: '', limit: this.buildPage.limit })
                this.isBuildAdd = false
                this.loadBuildingsByMapId(this.activeMapConfig.mapId).then(res => {
                  this.buildPage.count = res.length
                })
                this.SET_AREA_DRAW_ACTIVE(false) // 关闭区域绘制
                this.SET_FEATURE_EDIT_ACTIVE(false) // 关闭要素编辑
                this.SET_LOCATE_FEATURES([]) // 清空高亮定位要素
                this.initPage('show')
              })
              .catch(err => {
                console.log(err)
                this.errorMsg('楼宇添加失败,请检查楼宇基本信息输入')
              })
          } else {
            this.errorMsg('楼宇超出网格,请重新绘制楼宇')
            // this.$store.commit('SET_AREA_ADD', false)
            this.SET_AREA_DRAW_ACTIVE(false) // 关闭区域绘制
            this.SET_FEATURE_EDIT_ACTIVE(false) // 关闭要素编辑
            this.SET_LOCATE_FEATURES([]) // 清空高亮定位要素
            this.initPage('show')
          }
        } else {
          this.warningMsg('请绘制楼宇区域')
        }
      } else {
        let isContainer = true // 楼宇在网格内的标志
        if (this.drawFeatureLoc) {
          this.buildOneData.loc = this.drawFeatureLoc
          this.buildOneData.projection = this.mapProjection
        }
        if (isContainer) { // 楼宇在网格内
          this.gridData && (this.buildOneData.gid.loc = this.gridData.loc)
          let parmEdit = JSON.parse(JSON.stringify(this.buildOneData))
          if (parmEdit.gid) {
            if (!parmEdit.gid._id) {
              delete parmEdit.gid
            } else {
              this.gridData && (this.buildOneData.gid.loc = this.gridData.loc)
            }
          }
          this.editOneBuildApi(parmEdit)
            .then(res => {
              this.getBuildAllList({ page: this.buildPage.cur, id: this.activeMapConfig.mapId, name: '' })
              this.initPage('show')
              this.SET_AREA_DRAW_ACTIVE(false) // 关闭区域绘制
              this.SET_FEATURE_EDIT_ACTIVE(false) // 关闭要素编辑
              this.SET_LOCATE_FEATURES([]) // 清空高亮定位要素
            })
            .catch(err => {
              console.log('editOneBuildApi', err)
              this.errorMsg('楼宇修改失败')
            })
        } else {
          this.errorMsg('楼宇超出网格,请重新编辑楼宇')
        }
      }
    },
    // 保存
    mapBuildSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let result = isInvalidPrincipal(this.buildOneData.pid)
          if (result.flag && result.msg) {
            this.errorMsg(result.msg)
          } else {
            this.buildSave()
          }
        } else {
          console.log('楼宇保存校验失败')
        }
      })
    },
    // 编辑楼宇
    show(val) {
      this.getBuildingData(val)
        .then(res => {
          this.SET_CURRENT_BUILDING(res)
          this.initPage('edit')
          this.isBuildAdd = false
          this.getLevelApi(res._id)
            .then(res => {
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 删除楼宇
    remove(val) {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除所选楼宇吗？</p>',
        onOk: () => {
          this.deleteOneBuildApi(val)
            .then(res => {
              let { count, limit, cur, pages } = this.buildPage
              if (count % limit === 1) {
                if (pages.toString() === cur.toString() && count.toString() !== '1') {
                  cur = cur - 1
                }
              }
              // this.loadBuildingsByMapId(this.activeMapConfig.mapId)
              this.getBuildAllList({ page: cur, id: this.activeMapConfig.mapId, name: '' })
              this.refreshEditTree()
            })
            .catch(err => {
              this.errorMsg('楼宇删除失败')
              console.log(err)
            })
        },
        onCancel: () => {}
      })
    },
    // 添加楼宇
    buildAdd() {
      this.isBuildAdd = true
      this.menuTag = true
      // 楼宇信息
      this.buildOneData = JSON.parse(JSON.stringify(pageConfig.buildOneData))
      this.buileAddUrl = ''
      this.initPage('edit')
      this.SET_AREA_DRAW_ACTIVE(true) // 开启楼宇区域绘制
    },
    // 楼宇搜索
    buildSearch(val) {
      this.getBuildAllList({ page: 1, id: this.activeMapConfig.mapId, name: val })
    },
    // 全部删除
    handleSelectAll(val) {
      console.log(val)
    },
    changePage(val) {
      this.getBuildAllList({ page: val, id: this.activeMapConfig.mapId, name: this.searchVal })
    },
    pageSizeChange(val) {
      this.buildPage.limit = val
      this.buildPage.cur = 1
      this.getBuildAllList({ page: 1, id: this.activeMapConfig.mapId, name: this.searchVal })
    },
    // 添加楼层
    levelAdd() {
      this.$store.commit('SET_EDIT_RIGHT_PAGE_STATE', { page: 'floorEditPage', detail: 'add' })
    },
    // 编辑楼层
    levelEdit(val) {
      this.getFoorById(val)
        .then(res => {
          this.clearAreaFeatures() // 清空区域要素
          this.setCurrentFloor(res)
          this.clearPointFeatures() // 清空点位要素
          if (this.isMapOuter) {
            this.setIsMapOuter(false) // 设置地图为楼内
          }
          this.$store.commit('SET_EDIT_RIGHT_PAGE_STATE', { page: 'floorEditPage', detail: 'edit' })
          this.$store.commit('SET_ISOUTER_STATE', false)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 刷新左测资源树
    refreshEditTree() {
      let counter = {optTab: '', count: this.editTreeChangeCounter.count + 1}
      this.changeEditTreeChangeCounter(counter) // 改变编辑树计数器
      // 获取巡更资源树
      this.getPatrolPointTree()
        .then(res => {})
        .catch(err => {
          console.log(err)
        })
      this.get2DAlarmHelpOrgTree({ mapType: '2D' }).then(res => {})
        .catch(err => {
          console.log(err)
        })
    },
    // 删除楼层
    levelRemove(val) {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除所选楼层吗？</p>',
        onOk: () => {
          this.deleteOneLevelApi(val)
            .then(res => {
              this.refreshEditTree()
              this.getLevelApi(this.buildData._id)
                .then(res => {
                })
                .catch(err => {
                  console.log(err)
                })
            })
            .catch(err => {
              console.log(err)
            })
        },
        onCancel: () => {}
      })
    },
    // 动态定位
    buildAreaEdit(val) {
      let center = areaUtil.getMultiPExtentAndCenter(val).center.toString()
      const arr = center.split(',').map(item => Number(item))
      this.$context2D.map.getView().setCenter(arr)
    },
    buildAreaRemove(val) {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除所选楼宇区块吗？</p>',
        onOk: () => {
          this.buildAreaArr.splice(val, 1)
          let locString = this.buildAreaArr.join('|').toString()
          this.SET_DRAW_FEATURE_LOC(locString)
          this.mapBuildSave('buildOneData')
        },
        onCancel: () => {}
      })
    },
    buildSelectOne(selection, row) {
      console.log('buildSelectOne', selection, row)
    },
    buildSelectAll(selection) {
      console.log('buildSelectAll', selection)
    },
    getOneGridSel(val) {
      if (val) {
        this.getGridData(val)
          .then(res => {
            this.SET_CURRENT_GRID(res)
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    checkColor(val) {
      this.buildOneData.rgbcolor = val
    },
    nenuInfoClick() {
      this.menuTag = false
    },
    nenuCtrolClick() {
      this.menuTag = true
    }
  },
  created() {
    if (this.detail === 'edit') {
      // this.gridSelList = JSON.parse(JSON.stringify(this.gridResources))
      this.buildData && (this.buildOneData = JSON.parse(JSON.stringify(this.buildData)))
      if (!this.buildOneData.gid) {
        this.buildOneData.gid = { loc: '', _id: '' }
      }
    }
  },
  mounted() {
    this.buildOneData = JSON.parse(JSON.stringify(pageConfig.buildOneData))
    this.buildData && (this.buildOneData = JSON.parse(JSON.stringify(this.buildData)))
    if (!this.buildOneData.gid) {
      this.buildOneData.gid = { loc: '', _id: '' }
    }
    if (this.detail === 'edit') {
      this.buildOneData = JSON.parse(JSON.stringify(this.buildData))
      if (!this.buildOneData.gid) {
        this.buildOneData.gid = { loc: '', _id: '' }
      }
      this.floorArr = JSON.parse(JSON.stringify(this.levelList))
    }
    // this.gridSelList = JSON.parse(JSON.stringify(this.gridResources))
    this.isBuildAdd = false
    this.getBuildAllList({ page: this.buildPage.cur, id: this.activeMapConfig.mapId, name: '' })
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
.areaHome,
.areaHome .builddetail,
.areaHome .builddetail .areaContent,
.areaHome .builddetail .areaContent .areaContentMain,
.areaHome .areaContent .areaContentMain .areaContentInfo,
.areaHome .areaContent .areaContentMainForm {
  width: 300px;
  display: flex;
  flex: 1;
  flex-direction: column;
}
.areaHome .areaContent .buildEditMain {
  padding: 0px 20px;
}
.areaHome .areaHeader {
  height: 40px;
  width: 100%;
  line-height: 40px;
  text-align: center;
  clear: both;
  background-color: #0f2343;
  font-size: 14px;
  display: flex;
  flex-direction: row;
}
.areaHome .areaHeader .areaHeaderTittle {
  flex: 1;
}
.areaHome .areaHeader .areaHeaderContent {
  width: 40px;
  height: 40px;
  cursor: pointer;
}
.areaHome .areaHeader .areaHeaderContent:hover {
  color: #20adff;
}
.areaHome .areaHeader .areaHeaderContent p {
  display: inline;
  margin: 0px 10px;
}
.areaHome .buildTable {
  padding: 9px;
  display: flex;
  flex: 1;
  flex-direction: column;
}
.areaHome .buildTable .buildTableSearch {
  margin-bottom: 10px;
}
.areaHome .buildTable .tableFooter {
  padding: 10px;
  clear: both;
  width: 100%;
  height: 26px;
  line-height: 26px;
}
.areaHome .buildTable .tableFooter .pagingButton {
  float: left;
}
.areaHome .buildTable .tableFooter .paging {
  /* float: right; */
}
.areaHome .buildTable .tableFooter .paging .ivu-page-simple .ivu-page-simple-pager input {
  vertical-align: middle;
  line-height: 18px;
}
.areaHome .areaContent .areaContentHeader {
  width: 100%;
  height: 50px;
}
.areaHome .areaContent .areaContentTittle {
  height: 40px;
  line-height: 40px;
  display: inline-block;
  margin: 0 10px;
  padding: 0 10px;
  margin-bottom: 10px;
  cursor: pointer;
}
.areaHome .areaContent .active {
  border-bottom: 1px solid #fda54b;
}

.areaHome .areaContent .buildEditImg {
  clear: both;
  width: 100%;
}
.areaHome .areaContent .buildEditImg .buildImg {
  width: 265px;
  height: 168px;
  border: 1px solid #5676a9;
  border-radius: 5px;
  margin-bottom: 15px;
}
.areaHome .areaContent .buildEditImg .buildEditImgText {
  float: right;
  font-size: 13px;
  padding: 5px 0px;
  color: orangered;
}
.areaHome .areaContent .pointTittle {
  height: 40px;
  line-height: 40px;
}
.areaHome .areaContent .floorClass {
  margin-bottom: 15px;
}
.areaHome .areaContent .floorClass .floorItem {
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
.areaHome .areaContent .floorClass .floorItem .floorIcon {
  float: left;
  height: 20px;
  line-height: 20px;
  font-size: 10px;
  padding: 0 2px;
  cursor: pointer;
}
.areaHome .areaContent .floorClass .floorItem .floorIcon:hover {
  color: #20adff;
}
.areaHome .areaContent .linkMan {
  text-align: center;
}
.areaHome .areaFooter {
  height: 40px;
  width: 100%;
  line-height: 40px;
  clear: both;
  background-color: #0f2343;
  text-align: center;
}
.tableContent {
  display: flex;
  flex: 1;
  width: 102%;
}
.tableContent .bs-scroll {
  width: 100%;
}
</style>
