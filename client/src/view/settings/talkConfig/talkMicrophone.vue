<template>
  <!--对讲台麦-->
  <div class="talk-mic">
    <div class="haha" style="text-align:center;width:100%;font-size:12px;height:100%;">
      <div class="feature-btn">
        <Button type="ghost" icon="plus" @click="openAddMod('添加台麦')">添加</Button>
        <Button type="ghost" icon="edit" @click="openEditMod('修改台麦')" :disabled="canUse">修改</Button>
        <Button type="ghost" icon="trash-a" @click="delAlarm" :disabled="canUse">删除</Button>
        <Input v-model="inSearchName" placeholder="按对讲台麦名称查询" style="width: 250px;" class="rt" :maxlength="64">
        <Button slot="append" @click="search">搜索</Button>
        </Input>
      </div>
      <div class="table-relative flex-1" style="margin-top:12px;" ref="tableBox">
        <div class="table-body">
          <Table size="small" :columns="centerTableTitle" :data="centerTableData" :height="tableHeight" @on-selection-change="alarmInSel"></Table>
        </div>
      </div>
      <div class="table-footer">
        <Page class="rt" show-sizer show-elevator show-total :page-size-opts="$PageInfo.size" :total="pageInfo.count" :page-size="pageInfo.limit" :current="pageInfo.cur" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
      </div>
    </div>
    <!--对讲台麦——添加、修改-->
    <div v-if="centerModelShow">
      <Modal v-model="centerModelShow" :title="centerTitle" width="500" :mask-closable="false">
        <Form label-position="left" :label-width="120" :model="centerAddData" ref="centerAddData" :rules="alarmRule"  style="padding: 0 10px;">
          <Form-item label="台麦名称" prop="name">
            <Input v-model="centerAddData.name" :maxlength="64" />
          </Form-item>
          <Form-item label="对讲IP地址" prop="ip">
            <Bsipv4 v-model="centerAddData.ip"></Bsipv4>
          </Form-item>
          <Form-item label="对讲ID号" prop="serise">
            <Input v-model="centerAddData.serise" :maxlength="8" />
          </Form-item>
          <Form-item label="联动主镜头">
            <p class="text-box">{{linkMain.label}}</p>
            <Select v-model="linkMain.label" style="width: 260px;" placeholder="">
              <TreeBox :searchToggle="false" :resourceToggle="true" :equipmentToggle="false" :equType="[0]" :orgType="0" :resType="[0]" :iconToggle="false" @clickData="handleLinkMain"></TreeBox>
            </Select>
            <Checkbox v-model="centerAddData.record">录像</Checkbox>
          </Form-item>
          <Form-item label="联动副镜头">
            <p class="text-box">{{linkVice1.label}}</p>
            <Select style="width: 260px;" placeholder="">
              <TreeBox :searchToggle="false" :resourceToggle="true" :equipmentToggle="false" :equType="[0]" :orgType="0" :resType="[0]" :iconToggle="false" @clickData="handleLinkVice1"></TreeBox>
            </Select>
          </Form-item>
          <Form-item label="联动副镜头">
            <p class="text-box">{{linkVice2.label}}</p>
            <Select style="width: 260px;" placeholder="">
              <TreeBox :searchToggle="false" :resourceToggle="true" :equipmentToggle="false" :equType="[0]" :orgType="0" :resType="[0]" :iconToggle="false" @clickData="handleLinkVice2"></TreeBox>
            </Select>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="ghost" @click="editCancel('centerAddData')">取消</Button>
          <Button type="primary" :loading="modelLoad" @click="editOk('centerAddData')">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import allPage from './allPage.js'
import Bsipv4 from 'components/BSIPV4.vue'
import TreeBox from 'components/BStreeNew/BStreeNewBox'
export default {
  components: {
    TreeBox,
    Bsipv4
  },
  mixins: [allPage],
  data() {
    return {
      canUse: true,
      centerTableTitle: [
        {
          type: 'selection',
          width: 60
        },
        {
          title: '台麦名称',
          key: 'name',
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.name
                }
              },
              params.row.name
            )
          }
        },
        {
          title: '对讲IP地址',
          key: 'ip',
          minWidth: 200,
          align: 'center',
          render: (h, params) => {
            let text = ''
            if (params.row.ip === '') {
              text = '...'
            } else {
              text = params.row.ip
            }
            return h('span', text)
          }
        },
        {
          title: '对讲ID号',
          key: 'serise',
          minWidth: 200,
          align: 'center'
        },
        {
          title: '联动镜头',
          key: 'cameraDesciption',
          minWidth: 400,
          ellipsis: true,
          align: 'center',
          render: (h, params) => {
            return h(
              'span',
              {
                domProps: {
                  title: params.row.cameraDesciption
                }
              },
              params.row.cameraDesciption
            )
          }
        }
      ],
      centerTableData: [],
      tableHeight: 500,
      centerModelShow: false,
      centerTitle: '',
      centerAddData: {
        name: '',
        ip: '0.0.0.0',
        serise: '0',
        record: true,
        _id: ''
      },
      Inselect: [],
      inSearchName: '',
      modelLoad: false,
      // 分页
      pageInfo: {
        cur: 1,
        count: 0,
        limit: this.$PageInfo.limit
      },
      inselectId: '',
      linkMain: {label: '', id: ''}, // 联动主镜头
      linkVice1: {label: '', id: ''}, // 联动副镜头1
      linkVice2: {label: '', id: ''} // 联动副镜头2
    }
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight
  },
  methods: {
    ...mapActions(['getTalkMicroPhone', 'addTalkMicroPhone', 'editTalkMicroPhone', 'deleteTalkMicroPhone']),
    getTalkCenterData() {
      this.getTalkMicroPhone({ page: this.pageInfo.cur, limit: this.pageInfo.limit, name: this.inSearchName })
        .then(res => {
          this.centerTableData = res.data
          this.pageInfo.count = Number(res.headers['x-bsc-count'])
          this.Inselect = []
        })
        .catch(() => {
          this.errorMsg('获取对讲台麦数据失败')
        })
    },
    // 列表复选
    alarmInSel(selection) {
      this.Inselect = selection
      if (selection.length !== 0) {
        this.canUse = false
      } else {
        this.canUse = true
      }
    },
    // 联动主镜头 树点击事件
    handleLinkMain(node) {
      if (node.tierType === 'res') {
        this.linkMain.label = node.name
        this.linkMain.id = node._id
      }
    },
    handleLinkVice1(node) {
      if (node.tierType === 'res') {
        this.linkVice1.label = node.name
        this.linkVice1.id = node._id
      }
    },
    handleLinkVice2(node) {
      if (node.tierType === 'res') {
        this.linkVice2.label = node.name
        this.linkVice2.id = node._id
      }
    },
    // 对讲台麦 添加、修改、删除
    openAddMod(value) {
      this.centerTitle = value
      this.centerModelShow = true
      if (this.$refs['centerAddData']) {
        this.$refs['centerAddData'].resetFields()
      }
      this.centerAddData = {
        name: '',
        ip: '0.0.0.0',
        serise: '0',
        record: true
      }
      this.linkMain = {label: '', id: ''}
      this.linkVice1 = {label: '', id: ''}
      this.linkVice2 = {label: '', id: ''}
    },
    openEditMod(value) {
      if (this.Inselect.length === 1) {
        this.centerTitle = value
        this.inselectId = this.Inselect[0]._id
        this.centerModelShow = true
        this.centerAddData = {
          name: this.Inselect[0].name,
          ip: this.Inselect[0].ip,
          serise: this.Inselect[0].serise,
          record: this.Inselect[0].record,
          _id: this.Inselect[0]._id
        }
        const cameraId = this.Inselect[0].camera || []
        const cameraNames = this.Inselect[0].cameraDesciption ? this.Inselect[0].cameraDesciption.split(',') : []
        cameraId.forEach((item, index) => {
          if (!item) {
            cameraNames.splice(index, 0, '')
          }
        })
        this.linkMain = {label: cameraNames[0] || '', id: cameraId[0] || ''}
        this.linkVice1 = {label: cameraNames[1] || '', id: cameraId[1] || ''}
        this.linkVice2 = {label: cameraNames[2] || '', id: cameraId[2] || ''}
      } else {
        this.warningMsg('请选择一项')
      }
    },
    // 确认 修改，添加
    editOk(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          const isRepeat = this.judgeLink()
          if (isRepeat) {
            this.warningMsg('联动主副镜头不能重复')
            return
          }
          this.modelLoad = true
          const camera = [this.linkMain.id, this.linkVice1.id, this.linkVice2.id]
          if (this.centerTitle === '添加台麦') {
            this.addTalkMicroPhone({...this.centerAddData, camera})
              .then(() => {
                this.getTalkCenterData()
                this.modelLoad = false
                this.centerModelShow = false
              })
              .catch(err => {
                this.modelLoad = false
                this.warningMsg(err.response.data.message)
              })
          } else if (this.centerTitle === '修改台麦') {
            let data = {
              body: {...this.centerAddData, camera},
              id: this.centerAddData._id
            }
            this.editTalkMicroPhone(data)
              .then(() => {
                this.getTalkCenterData()
                this.modelLoad = false
                this.centerModelShow = false
              })
              .catch(err => {
                this.modelLoad = false
                this.warningMsg(err.response.data.message)
              })
          }
        }
      })
    },
    // 判断主副镜头是否有相同
    judgeLink() {
      let idArr = []
      this.linkMain.label && idArr.push(this.linkMain.id)
      this.linkVice1.label && idArr.push(this.linkVice1.id)
      this.linkVice2.label && idArr.push(this.linkVice2.id)
      const noRepeatArr = [...new Set(idArr)]
      if (noRepeatArr.length === idArr.length) {
        return false
      } else {
        return true
      }
    },
    // 取消 添加、修改
    editCancel(name) {
      this.$refs[name].resetFields()
      this.modelLoad = false
      this.centerModelShow = false
    },
    delAlarm() {
      if (this.Inselect.length !== 0) {
        this.$Modal.confirm({
          title: '警告',
          content: '<p>确认删除吗?</p>',
          loading: true,
          onOk: () => {
            this.sureDel()
            setTimeout(() => {
              this.$Modal.remove()
            }, 0)
          }
        })
      }
    },
    sureDel() {
      let idList = []
      this.Inselect.map(v => {
        idList.push(v._id)
      })
      const param = {ids: idList}
      this.deleteTalkMicroPhone(param)
        .then(() => {
          this.getTalkCenterData()
        })
        .catch(() => {
          this.errorMsg('删除接警中心数据失败')
        })
    },
    // 搜索
    search() {
      this.getTalkCenterData()
    },
    pageChange(n) {
      this.pageInfo.cur = n
      this.getTalkCenterData()
    },
    pageSizeChange(n) {
      this.pageInfo.limit = n
      this.getTalkCenterData()
    }
  },
  watch: {},
  created() {
    this.getTalkCenterData()
    this.Inselect = []
    this.canUse = true
  }
}
</script>

<style scoped>
.talk-mic {
  width: 100%;
  height: 100%;
}

.haha {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1c3053;
  height: 100%;
}

.lf {
  float: left;
}

.rt {
  float: right;
}

.feature-btn {
  margin: 0 24px;
  height: 32px;
  line-height: 32px;
}

.feature-btn > button {
  margin-right: 8px;
  float: left;
  width: 100px;
  height: 32px;
}

.ivu-table-column-center .ivu-btn span {
  color: #57a3f3;
  font-size: 14px;
}

.table-relative {
  position: relative;
  height: calc(100% - 74px);
  margin: 0px;
  width: 100%;
}

.table-body {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.bottom-title {
  display: block;
  text-align: center;
  font-size: 14px;
  color: #fff;
  background-color: #0f2243;
  height: 40px;
  line-height: 40px;
  width: 100%;
}
.text-box {
  position: absolute;
  left: 1px;
  font-size: 12px;
  top: 1px;
  height: 32px;
  max-width: 200px;
  padding-left: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 32px;
  z-index: 9;
}
</style>
