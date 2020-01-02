<!--编辑模式 楼宇的右边编辑框的页面-->
<template>
  <div class="areaHome">
    <div class="areaHeader">
      <div class="areaHeaderTittle">
        <p>楼宇区域</p>
      </div>
      <div v-if="detail === 'show'" class="areaHeaderContent">
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
        <div v-if="!menuTag" class="areaContentMain">
          <bs-scroll ref="scroller">
            <div class="areaContentInfo">
              <div class="buildEditMain">
                <div class="buildEditImg">
                  <div class="buildImg">
                    <img v-if="buildOneData.picture" style="width:100%;height:100%;" :src="buileAddUrl">
                  </div>
                  <Upload action="/api/upload" :show-upload-list="false" :on-success="uploadEditSuccess" :multiple="false" ref="upload" :format="['jpg','jpeg','png']" :on-format-error="mapFormatError">
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
                  <Form-item label="负责单位" prop="charge">
                    <Input :maxlength="32" v-model="buildOneData.charge" placeholder="请输入负责单位" />
                  </Form-item>
                  <!-- 联系方式 -->
                  <contentWay :principal.sync="buildOneData.pid"></contentWay>
                  <Form-item label="简介">
                    <Input :maxlength="150" v-model="buildOneData.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" />
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
        <div v-if="menuTag" class="areaContentMainForm buildEditMain">
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
import { mapState, mapMutations, mapActions } from 'vuex'
import contentWay from '../contentWay'
import editIpc from '../../../../assets/map/edit/editIpc.js'
import editAlarmIpc from '../../../../assets/map/edit/editAlarmIpc'
import editPatrolIpc from '../../../../assets/map/edit/editPatrolIpc'
import pageConfig from '../../pageConfig.js'
import { telNumCheck, telNameCheck, peopleNameLengthCheck } from '../../formCheck'
import areaUtil from '../../../../assets/map/areaUtil.js'
import styleCtrol from '../styleCtrol'
import Scroll from '../../../../components/Scroll'
export default {
  components: {
    contentWay,
    styleCtrol,
    Scroll
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
        this.isBuildName(query)
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
      let rcode = /^[A-Za-z0-9]+$/
      if (value === '') {
        return callback(new Error('楼宇编号不能为空'))
      }
      if (rcode.test(value)) {
        callback()
      } else {
        return callback(new Error('楼宇编号格式有误'))
      }
    }
    // 楼宇负责单位长度校验
    const buildCharge = (rule, value, callback) => {
      if (value.length > 0) {
        let strlength = value.replace(/[\u0391-\uFFE5]/g, 'aa').length
        console.log(strlength)
        if (strlength > 32) {
          return callback(new Error('负责单位长度超过32个字符'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      buildAreaArr: [],
      menuTag: true,
      buileAddUrl: '',
      isBuildAdd: false,
      searchVal: '',
      buildEdit: '',
      gridSelList: [],
      buildOneData: JSON.parse(JSON.stringify(pageConfig.buildOneData)),
      ruleValidate: {
        name: [{ required: true, validator: buildName, trigger: 'change' }],
        code: [{ required: true, validator: buildCode, trigger: 'change' }],
        charge: [{ required: false, validator: buildCharge, trigger: 'change' }]
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
      buildList: ({ mapGisData }) => mapGisData.buildList, // 楼宇列表
      buildData: ({ mapGisData }) => mapGisData.buildData, // 单个楼宇信息
      gridSelectList: ({ mapGisData }) => mapGisData.gridSelectList, // 楼宇
      levelList: ({ mapGisData }) => mapGisData.levelList, // 楼层列表
      page: ({ mapPageState }) => mapPageState.mapEditRightPage.page, // 编辑模式地图右侧页面详细
      detail: ({ mapPageState }) => mapPageState.mapEditRightPage.detail,
      buildLoc: ({ mapAreaData }) => mapAreaData.buildLoc,
      oneMapInfo: ({ mapGisData }) => mapGisData.oneMapInfo, // 当前地图信息
      activeMap: ({ mapGisData }) => mapGisData.activeMap, // 当前地图id
      areaLoc: ({ mapAreaData }) => mapAreaData.areaLoc, // 区域位置信息
      editVedioIpcList: ({ mapGisData }) => mapGisData.editVedioIpcList,
      editVedioSectorList: ({ mapGisData }) => mapGisData.editVedioSectorList,
      gridData: ({ mapGisData }) => mapGisData.gridData, // 单个网格信息
      buildPagingList: ({ mapAreaData }) => mapAreaData.buildPagingList, // 楼宇分页列表
      buildPaging: ({ mapAreaData }) => mapAreaData.buildPaging, // 楼宇分页参数
      editCheckList: ({ mapVedioData }) => mapVedioData.editCheckList,
      editVedioSectorInMapList: ({ mapGisData }) => mapGisData.editVedioSectorInMapList,
      editAlarmList: ({ mapAlarmData }) => mapAlarmData.editAlarmList,
      editPatrolList: ({ patrolData }) => patrolData.editPatrolList
    })
  },
  watch: {
    screenHeight(val) {
      console.log(val)
      this.$refs.scroller.update()
    },
    // 楼宇列表
    buildList(val) {
      // this.buildEditList = JSON.parse(JSON.stringify(val))
    },
    // 楼宇分页列表
    buildPagingList(val) {
      this.buildEditList = JSON.parse(JSON.stringify(val))
      // this.buildPage = JSON.parse(JSON.stringify(this.buildPaging))
    },
    // 楼宇信息
    buildData(val) {
      if (!this.isBuildAdd) {
        this.buildOneData = JSON.parse(JSON.stringify(val))
        this.buildAreaArr = this.buildOneData.loc.split('|')
        this.buileAddUrl = '/api/upload?id=' + this.buildOneData.picture
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
        this.gridSelectList.forEach(element => {
          if (areaUtil.isContainerInGrid(this.buildOneData.loc, element.loc)) {
            newGridList.push(element)
          }
        })
        this.gridSelList = newGridList
      }
    },
    // 网格选项列表
    gridSelectList(val) {
      this.gridSelList = JSON.parse(JSON.stringify(val))
    },
    // 楼层列表
    levelList(val) {
      this.floorArr = JSON.parse(JSON.stringify(val))
    },
    // 页面详情
    detail(val) {
      this.buildEdit = val
    },
    areaLoc(val) {
      let loc = JSON.parse(JSON.stringify(val))
      let newGridList = [{ value: '', label: '无' }]
      this.gridSelectList.forEach(element => {
        if (areaUtil.isContainerInGrid(loc, element.loc)) {
          newGridList.push(element)
        }
      })
      this.gridSelList = newGridList
      this.buildAreaArr = loc.split('|')
    }
  },
  methods: {
    ...mapMutations([
      'SET_EDITVEDIOIPC_LIST',
      'SET_EDITVEDIOIPCINMAP_LIST',
      'SET_EDITVEDIOSECTOR_LIST',
      'SET_EDITVEDIOSECTORINMAP_LIST',
      'SET_ACTIVEEXTENT_DATA',
      'SET_EDITALARM_LIST',
      'SET_EDITALARMINMAP_LIST',
      'SET_PATROL_LIST',
      'SET_PATROLINMAP_LIST'
    ]),
    ...mapActions([
      'getGrid',
      'getOneGrid',
      'getBuild',
      'getBuildPaging',
      'getOneBuild',
      'editOneBuild',
      'deleteOneBuild',
      'addOneBuild',
      'getLevel',
      'getOneLevel',
      'deleteOneLevel',
      'getFloorResources',
      'isBuildName',
      'getOneFloorPatrolList',
      'getPatrolPoint',
      'getResourceOrg',
      'getAlarmOrg',
      'setModifyActiveState'
    ]),
    // 图片上传
    uploadEditSuccess(val) {
      this.buileAddUrl = '/api/upload?id=' + val.id
      this.buildOneData.picture = val.id
    },
    mapFormatError(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg、jpeg 或 png 格式的图片。'
      })
    },
    // 页面默认显示
    initPage(val) {
      this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: this.page, detail: val })
    },
    // 获取楼宇列表
    getBuildAllList(obj) {
      let getBuildAll = this.getBuild(obj.id)
      let getBuildPage = this.getBuildPaging({
        page: obj.page,
        id: this.activeMap,
        name: obj.name,
        limit: this.buildPage.limit
      })
      Promise.all([getBuildAll, getBuildPage])
        .then(res => {
          this.buildPage.count = res[0].length
          this.$refs.scroller.update()
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
      this.setModifyActiveState(false)
      this.initPage('show')
      this.$store.commit('SET_AREA_ADD', false)
      this.getBuildAllList({ page: this.buildPage.cur, id: this.activeMap, name: '' })
      this.$store.commit('SET_AREA_LOC', '')
      this.$refs[name].resetFields()
    },
    buildSave() {
      if (this.isBuildAdd) {
        delete this.buildOneData._id
        if (this.areaLoc) {
          // 此处进行楼宇属于网格判断
          // 楼宇位置信息 this.areaLoc
          // 网格位置信息 this.gridData.loc
          this.buildOneData.loc = this.areaLoc
          // 楼宇添加
          this.buildOneData.mapId = this.oneMapInfo.mapId
          let isContain = true
          if (this.buildOneData.gid._id) {
            this.buildOneData.gid.loc = this.gridData.loc
            isContain = areaUtil.isContainerInGrid(this.areaLoc.toString(), this.gridData.loc.toString())
          }
          if (isContain) {
            let parm = JSON.parse(JSON.stringify(this.buildOneData))
            if (parm.gid) {
              if (!parm.gid._id) {
                delete parm.gid
              }
            }
            this.addOneBuild(parm)
              .then(res => {
                let { count, limit, cur, pages } = this.buildPage
                if (count % limit === 0) {
                  if (pages.toString() === cur.toString()) {
                    cur = cur + 1
                  }
                }
                // let getBuildAll =
                this.getBuild(this.activeMap)
                this.getBuildPaging({ page: cur, id: this.activeMap, name: '', limit: this.buildPage.limit }).then(
                  res => {
                    this.initPage('show')
                    setTimeout(() => {
                      this.buildPage.limit = 100
                    }, 0)
                    this.buildPage.count = res.length
                  }
                )
                this.isBuildAdd = false
                this.$store.commit('SET_AREA_ADD', false)
                this.$store.commit('SET_AREA_LOC', '')
              })
              .catch(err => {
                console.log(err)
                this.errorMsg('楼宇添加失败,请检查楼宇基本信息输入')
              })
          } else {
            this.errorMsg('楼宇超出网格,请重新绘制楼宇')
            this.$store.commit('SET_AREA_ADD', false)
            this.initPage('show')
          }
        } else {
          this.warningMsg('请绘制楼宇区域')
        }
      } else {
        let isContainer = true
        if (this.areaLoc) {
          this.buildOneData.loc = this.areaLoc
          // if (this.buildOneData.gid._id) {
          //   isContainer = areaUtil.isContainerInGrid(this.areaLoc.toString(), this.buildOneData.gid.loc || this.gridData.loc.toString())
          // }
        }
        if (isContainer) {
          this.buildOneData.gid.loc = this.gridData.loc
          let parmEdit = JSON.parse(JSON.stringify(this.buildOneData))
          if (parmEdit.gid) {
            if (!parmEdit.gid._id) {
              delete parmEdit.gid
            } else {
              this.buildOneData.gid.loc = this.gridData.loc
            }
          }
          this.editOneBuild(parmEdit)
            .then(res => {
              this.getBuildAllList({ page: this.buildPage.cur, id: this.activeMap, name: '' })
              this.$store.commit('SET_AREA_LOC', '')
              this.setModifyActiveState(false)
              this.initPage('show')
            })
            .catch(err => {
              console.log('editOneBuild', err)
              this.errorMsg('楼宇修改失败')
              this.$store.commit('SET_AREA_LOC', '')
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
          let nameRepeat = telNameCheck(this.buildOneData.pid)
          if (nameRepeat) {
            this.errorMsg('负责人重复')
          } else {
            let flag = telNumCheck(this.buildOneData.pid)
            if (flag) {
              this.errorMsg('联系方式输入有误，仅支持数字和(-)')
            } else {
              let result = peopleNameLengthCheck(this.buildOneData.pid)
              if (result.flag) {
                this.errorMsg('第' + result.index + '个负责人长度超过16个字符')
              } else {
                this.buildSave()
              }
            }
          }
        } else {
          console.log('楼宇保存失败')
        }
      })
    },
    // 编辑楼宇
    show(val) {
      this.getOneBuild(val)
        .then(res => {
          this.initPage('edit')
          this.isBuildAdd = false
          this.getLevel(res._id)
            .then(res => {})
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
          this.deleteOneBuild(val)
            .then(res => {
              let { count, limit, cur, pages } = this.buildPage
              if (count % limit === 1) {
                if (pages.toString() === cur.toString() && count.toString() !== '1') {
                  cur = cur - 1
                }
              }
              this.getBuildAllList({ page: cur, id: this.activeMap, name: '' })
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
      this.$store.commit('SET_AREA_ADD', true)
      this.getGrid(this.activeMap)
        .then(res => {})
        .catch(err => {
          console.log(err)
        })
    },
    // 楼宇搜索
    buildSearch(val) {
      this.getBuildAllList({ page: 1, id: this.activeMap, name: val })
    },
    // 全部删除
    handleSelectAll(val) {
      console.log(val)
    },
    changePage(val) {
      this.getBuildAllList({ page: val, id: this.activeMap, name: this.searchVal })
    },
    pageSizeChange(val) {
      this.buildPage.limit = val
      this.buildPage.cur = 1
      this.getBuildAllList({ page: 1, id: this.activeMap, name: this.searchVal })
    },
    // 添加楼层
    levelAdd() {
      this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'floorEditPage', detail: 'edit' })
    },
    getMapPatrolTree(id) {
      if (this.isOuter) {
        this.getPatrolPoint()
          .then(res => {})
          .catch(err => {
            console.log(err)
          })
      } else {
        this.getPatrolPoint(id)
          .then(res => {})
          .catch(err => {
            console.log(err)
          })
      }
    },
    // 编辑楼层
    levelEdit(val) {
      this.clearVedioAndEditFeature()
      this.getOneLevel(val)
        .then(res => {
          this.getMapPatrolTree(val)
          this.getAlarmOrg(val)
          this.getResourceOrg(val)
          this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'floorEditPage', detail: 'show' })
          this.$store.commit('SET_ISOUTER_STATE', false)
          // 获取楼层中的视频和报警点位
          this.getFloorResources(res._id)
            .then(result => {
              console.log(result)
              this.addFloorVedioAndSector(result)
              this.addFloorAlarm(result)
            })
            .catch(err => {
              console.log(err)
            })
          this.getOneFloorPatrolList(res._id).then(result => {
            this.addFloorPatrol(result)
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 加载楼层中的所有点位
    addFloorVedioAndSector(array) {
      let vedioSectors = editIpc.addFloorFeature({
        vedioList: this.editVedioIpcList,
        sectorList: this.editVedioSectorList,
        array
      })
      this.$store.commit('SET_EDITVEDIOIPC_LIST', vedioSectors.vediolist)
      this.$store.commit('SET_EDITVEDIOIPCINMAP_LIST', vedioSectors.vediolist)
      this.addSectorToInMap(vedioSectors.sectorlist)
    },
    // 加载楼层中的报警点位
    addFloorAlarm(array) {
      let alarms = editAlarmIpc.addFloorFeature(this.editAlarmList, array)
      this.$store.commit('SET_EDITALARM_LIST', alarms)
      this.$store.commit('SET_EDITALARMINMAP_LIST', alarms)
    },
    // 加载楼层中的巡更点位
    addFloorPatrol(array) {
      let patrols = editPatrolIpc.addFloorFeature(this.editPatrolList, array)
      this.$store.commit('SET_PATROL_LIST', patrols)
      this.$store.commit('SET_PATROLINMAP_LIST', patrols)
    },
    clearVedioAndEditFeature() {
      this.$store.commit('SET_EDITVEDIOIPC_LIST', [])
      this.$store.commit('SET_EDITVEDIOIPCINMAP_LIST', [])
      this.$store.commit('SET_EDITVEDIOSECTOR_LIST', [])
      this.$store.commit('SET_EDITVEDIOSECTORINMAP_LIST', [])
      this.$store.commit('SET_EDITCURRENTVEDIO_FEATURE', null)
      this.$store.commit('SET_EDITCURRENTVEDIO_SECTOR', null)
    },
    // 保存时添加可视域（备份）
    addSectorToInMap(sectorCol) {
      let sectorlist = JSON.parse(JSON.stringify(this.editVedioSectorInMapList))
      sectorCol.forEach(element => {
        let feature = editIpc.getFeatureById(sectorlist, element.attributes.id)
        if (feature) {
          sectorlist = editIpc.deleteVedioOrSectorById(sectorlist, element.attributes.id)
        } else {
          sectorlist.push(element)
        }
      })
      this.$store.commit('SET_EDITVEDIOSECTORINMAP_LIST', sectorlist)
      if (this.editCheckList.indexOf('sector') > -1) {
        this.$store.commit('SET_EDITVEDIOSECTOR_LIST', sectorCol)
      }
    },
    // 刷新左测资源树
    refreshEditTree() {
      // 获取视频资源树
      this.getResourceOrg()
        .then(res => {})
        .catch(err => {
          console.log(err)
        })
      // 获取报警资源树
      this.getAlarmOrg()
        .then(res => {})
        .catch(err => {
          console.log(err)
        })
      // 获取巡更资源树
      this.getPatrolPoint()
        .then(res => {})
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
          this.deleteOneLevel(val)
            .then(res => {
              this.refreshEditTree()
              this.getLevel(this.buildData._id)
                .then(res => {})
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
      let obj = areaUtil.getMultiPExtentAndCenter(val)
      this.$store.commit('SET_ACTIVEEXTENT_DATA', obj)
    },
    buildAreaRemove(val) {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除所选楼宇区块吗？</p>',
        onOk: () => {
          this.buildAreaArr.splice(val, 1)
          let locString = this.buildAreaArr.join('|').toString()
          this.$store.commit('SET_AREA_LOC', locString)
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
        this.getOneGrid(val)
          .then(res => {})
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
      this.gridSelList = JSON.parse(JSON.stringify(this.gridSelectList))
      this.buildOneData = JSON.parse(JSON.stringify(this.buildData))
      if (!this.buildOneData.gid) {
        this.buildOneData.gid = { loc: '', _id: '' }
      }
      this.floorArr = JSON.parse(JSON.stringify(this.levelList))
    }
  },
  mounted() {
    this.buildOneData = JSON.parse(JSON.stringify(pageConfig.buildOneData))
    this.buildOneData = JSON.parse(JSON.stringify(this.buildData))
    if (!this.buildOneData.gid) {
      this.buildOneData.gid = { loc: '', _id: '' }
    }
    if (this.detail === 'edit') {
      this.floorArr = JSON.parse(JSON.stringify(this.levelList))
      this.buildOneData = JSON.parse(JSON.stringify(this.buildData))
      if (!this.buildOneData.gid) {
        this.buildOneData.gid = { loc: '', _id: '' }
      }
    }
    this.gridSelList = JSON.parse(JSON.stringify(this.gridSelectList))
    this.isBuildAdd = false
    this.getBuildAllList({ page: this.buildPage.cur, id: this.activeMap, name: '' })
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
  overflow-x: hidden;
  overflow-y: auto;
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
