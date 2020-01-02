<template>
  <dragBoxs @close="close" :title="'选择坐席'" :active="true" :index="1" modelType="2D" :canScale="false">
    <Table
      size="small"
      :columns="modelColumns"
      :data="freeSeatList"
      @on-selection-change="selectDeviceResRow"
      :highlight-row="true"
      :height="tableHeight"
      width="700"
    ></Table>
  </dragBoxs>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import dragBoxs from 'components/dragx/Dragx.vue'
export default {
  components: {
    dragBoxs
  },
  props: {
  },
  data() {
    return {
      tableHeight: '300',
      modelColumns: [
        {
          key: 'name',
          width: 150,
          title: '坐席名称',
          align: 'center'
        },
        {
          title: '分机号',
          key: 'extension',
          width: 150,
          align: 'center'
        },
        {
          title: '坐席组名',
          key: 'groupName',
          width: 150,
          align: 'center'
        },
        {
          title: '坐席状态',
          key: 'status',
          width: 150,
          align: 'center'
        },
        {
          title: '操作',
          key: 'operate',
          width: 100,
          align: 'center',
          render: (h, params) => {
            let self = this
            return h('div', [
              h('Icon', {
                attrs: {
                  title: '使用该坐席拨打电话'
                },
                class: 'icon iconfont icon-jiantou',
                style: {
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '16px'
                },
                on: {
                  click: (datainfo, e) => {
                    self.closeModel(params.row.extension)
                  }
                }
              })
            ])
          }
        }
      ]
    }
  },
  methods: {
    ...mapActions('phone', ['setSeatListShow', 'setPhoneCall', 'postDial', 'setCurrentSeat', 'setUpdateMill']),
    selectDeviceResRow() {},
    close() {
      this.setSeatListShow(false)
    },
    closeModel(call) {
      const param = {
        extension: call,
        phone: this.selectedMobile,
        prefix: this.prefix
      }
      if (!call || !this.selectedMobile || !this.prefix) {
        return self.showWarning('请重新选择电话号码或分机进行拨号')
      }
      this.postDial(param).then(result => {
        if (result.data.status === 'true') {
          this.setUpdateMill()
          this.setCurrentSeat(call)
          this.setPhoneCall(true)
        } else {
          this.errorMsg(result.data.resultText)
        }
      }).catch(err => {
        console.log(err)
      })
      this.close()
    }
  },
  computed: {
    ...mapState({
      freeSeatList: ({ phone }) => phone.freeSeatList,
      selectedMobile: ({ phone }) => phone.selectedMobile,
      currentSeat: ({ phone }) => phone.currentSeat,
      prefix: ({ phone }) => phone.prefix
    })
  }
}
</script>
