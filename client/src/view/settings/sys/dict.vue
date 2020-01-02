<template>
  <div class="dict bs-content">
    <!--按钮组，暂无事件-->
    <div class='all-button clearfix'>
      <Button type='ghost' class='commonStyle' @click="addButton">添加</Button>
      <!--添加信息-->
      <Modal title='添加' v-model="addData" @on-ok="addOk" @on-cancel="allCancel" class-name="vertical-center-modal">
        <Form :model="toAddData" :label-width="80">
          <Form-item label="代码">
            <Input v-model="toAddData.code" placeholder="请输入" style="width:80%"></Input>
          </Form-item>
          <Form-item label="名称">
            <Input v-model="toAddData.name" placeholder="请输入" style="width:80%"></Input>
          </Form-item>
          <Form-item label="类型">
            <Input v-model="toAddData.type" placeholder="请输入" style="width:80%"></Input>
          </Form-item>
        </Form>
      </Modal>
      <!--修改信息-->
      <Modal title='修改' v-model="actionData" class-name="vertical-center-modal">
        <Form :model="editData" :label-width="80">
          <Form-item label="代码">
            <Input v-model="editData.code" placeholder="请输入" style="width:80%"></Input>
          </Form-item>
          <Form-item label="名称">
            <Input v-model="editData.name" placeholder="请输入" style="width:80%"></Input>
          </Form-item>
          <Form-item label="类型">
            <Input v-model="editData.type" placeholder="请输入" style="width:80%"></Input>
          </Form-item>
        </Form>
        <Button type="ghost" slot="footer" size="large" @click="allCancel">取消</Button>
        <Button type="primary" slot="footer" size="large" @click="actionOk">确定</Button>
      </Modal>
      <!--删除提示-->
      <Modal title='删除' v-model="deleteData" @on-ok="deleteOk" @on-cancel="allCancel" class-name="vertical-center-modal">
        <div>
          <p>确认删除，请点击“确定”，否则取消</p>
        </div>
      </Modal>
      <!--查询，功能暂未实现-->
      <Input v-model="searchModel" class='commonStyle' placeholder="按类型查询" style="width: 250px;"></Input>
      <Button type='ghost' class='commonStyle' @click="searchButton">查询</Button>
    </div>
    <!--表格-->
    <div class='all-table'>
      <Table size="small" border :columns="columns1" :data="dataList" @on-selection-change="changeCheck"></Table>
    </div>

    <!--分页-->
    <div class='all-page'>
      <Page :show-total="true" :show-elevator="true" :total="count" :current="curPage" @on-change="changePage"></Page>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      // 表格数据
      columns1: [
        {
          title: '代码',
          key: 'code',
          align: 'center'
        },
        {
          title: '名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '类型',
          key: 'type',
          align: 'center',
          sortable: true
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    this.actionButton(params)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.deleteButton(params)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      // 修改信息的type下拉框的默认值
      // 查询默认值
      searchModel: '',
      // 删除弹出框的控制值
      deleteData: false,
      // 表格当前选中行默认值
      nowCheckData: '',
      // 添加弹出框的控制值
      addData: false,
      // 添加信息页面的数据
      toAddData: {},
      // 修改弹出框的控制值
      actionData: false,
      // 表格当前选中行的数据
      params: { index: 0 },
      // 备份dataList供修改使用的默认值
      copyDataList: [{
        code: '111',
        name: 'aaa',
        type: 'string'
      }],
      editData: {
        code: '',
        name: '',
        type: ''
      },
      nowPage: 1,
      selectData: {}
    }
  },
  created() {
    this.getDictList()
  },
  computed: {
    ...mapState({
      toAddDataInfo: ({ dict }) => dict.toAddData,
      dataList: ({ dict }) => dict.list,
      count: ({ dict }) => Number(dict.count),
      pages: ({ dict }) => Number(dict.pages),
      curPage: ({ dict }) => Number(dict.cur),
      limit: ({ dict }) => Number(dict.limit)
    })
  },
  methods: {
    ...mapActions(['addDict', 'getDictList', 'editDict', 'deleteDict']),
    // 添加按钮事件
    addButton() {
      this.addData = true
    },
    // 添加信息页面确认按钮的事件
    addOk() {
      console.log(this.toAddData)
      this.addDict(this.toAddData).then(res => {
        this.getDictList()
      })
    },
    // 在多选模式下有效，只要选中项发生变化时就会触发，selection已选数据
    // 删除按钮事件
    deleteButton(data) {
      this.deleteData = true
      this.selectData = data.row
    },
    // 删除信息页面确认按钮的事件
    deleteOk() {
      this.deleteData = false
      this.deleteDict(this.selectData).then(() => {
        this.getDictList({ page: this.nowPage })
      })
    },
    // 所有弹出款的取消按钮事件
    allCancel() {
      this.deleteData = false
      this.addData = false
      this.actionData = false
      this.copyDataList = JSON.parse(JSON.stringify(this.dataList))
    },
    // 修改按钮事件
    actionButton(params) {
      this.params = params
      this.editData = JSON.parse(JSON.stringify(this.params.row))
      console.log(this.editData)
      this.actionData = true
    },
    // 修改信息页面确认按钮的事件
    actionOk() {
      console.log(this.editData, 198)
      this.actionData = false
      var param = {
        page: this.nowPage
      }
      this.editDict(this.editData).then(res => {
        this.getDictList(param)
      })
    },
    // 查询按钮事件
    searchButton() {
      this.$store.commit('DICT_SEARCH_DATA', this.searchModel)
    },
    changeCheck(list) {
      this.checkList = list
    },
    changePage(n) {
      this.nowPage = n
      var param = {
        page: this.nowPage
      }
      this.getDictList(param)
    }
  }
}
</script>

<style scoped>
.dict {
  flex-direction: column;
  padding-left: 50px;
}

.all-button .commonStyle {
  margin-right: 20px;
}

.dict .all-table {
  width: 1000px;
  margin-top: 20px;
}

.dict .all-page {
  width: 1000px;
  height: 100%;
  margin-top: 20px;
  margin-left: 600px;
}
</style>
