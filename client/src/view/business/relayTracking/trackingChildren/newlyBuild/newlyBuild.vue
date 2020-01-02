<template>
  <!-- 新建/修改 弹框 -->
  <div v-if="openModal">
    <Modal v-model="openModal" :title="status? '新建追踪事件' : '修改追踪事件'" width="1100px" :closable="false" :mask-closable="false" class="caseMangementModel">
      <div class="modal-main">
        <!-- tab -->
        <div class="tab">
          <span @click="toggle(0)" :class="{activeTab:isActiveTab0}" style=" border-radius: 4px 0px 0px 4px;">追踪事件信息</span>
          <span @click="toggle(1)" :class="{activeTab:isActiveTab1}" style="border-right: 1px solid #5676a9; border-radius: 0px 4px 4px 0px;">选择摄像头</span>
          <div style="clear: both"></div>
        </div>
        <!-- 追踪事件信息 -->
        <div class="eventInfoBox" v-if="isActiveTab0">
          <Form label-position="left" :label-width="120" :model="modalData" ref="formValidate" :rules="ruleValidate" style="padding-left: 130px; margin-top: 25px;">
            <FormItem label="追踪事件名称" prop="name" style="width: 80%;">
              <Input v-model="modalData.name" placeholder="追踪事件名称"></Input>
            </FormItem>
            <FormItem label="追踪镜头列表">
              <ul style="width: auto; height: auto;">
                <li v-for="(item, index) in receiveData" :key="index">{{item.name}}&nbsp;&nbsp;&nbsp;{{item.startTime ? $moment(item.startTime * 1000).format('YYYY-MM-DD HH:mm:ss') : '开始标记时间'}}&nbsp;-&nbsp;{{item.endTime ? $moment(item.endTime * 1000).format('YYYY-MM-DD HH:mm:ss') : '结束标记时间'}}</li>
              </ul>
            </FormItem>
            <FormItem label="追踪事件备注"  prop="mark" style="width: 80%;">
              <Input v-model="modalData.mark" placeholder="备注详情" type="textarea"></Input>
            </FormItem>
          </Form>
        </div>
        <!-- 选择摄像头 -->
        <div class="chooseCameraBox" v-if="isActiveTab1">
          <span>请选择事件追踪摄像机：</span>
          <div class="choose-box">
            <div class="choose-tree">
              <BStreeNewBox :resourceToggle="true" :searchToggle="false" :searchType="1" :iconToggle="false" @clickData="handleNode"></BStreeNewBox>
            </div>
            <div class="choose-video">
              <div class="video-top">
                <VideoRelayTrack :markTime="markTime" :videoNode="videoNode" :isEdit="status" @caseTime="caseTime" @isOpenFlow="isOpenFlow"></VideoRelayTrack>
              </div>
              <div class="video-bottom" style="height: 180px;">
                <span style="font-size: 14px; line-height: 36px">摄像机追踪列表：</span>
                <div class="tables">
                  <Table size="small" :columns="receiveTitle" :data="receiveData" height="146" @on-row-click="clickTable" :highlight-row="!status"></Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div class="eventsDel" style="text-align: center">
          <Button type="primary" style="margin-left: 16px;" @click="cancel(1)">取消</Button>
          <Button type="primary" style="margin-left: 16px;" @click="cancel(2)">{{status ? '开始追踪' : '确定'}}</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import BStreeNewBox from '@src/components/BStreeNew/BStreeNewBox'
import VideoRelayTrack from '../../ViedoRelayTrack'
import { setTracking, putTracking } from '@src/http/business/tracking.api'
export default {
  name: 'newlyBuild',
  components: { VideoRelayTrack, BStreeNewBox },
  props: {
    // 是否打开弹窗
    openModal: {
      type: Boolean,
      default: false
    },
    // 是 新建 / 修改
    status: {
      type: Boolean,
      default: true
    },
    // 修改时传过来的参数
    buildList: {
      type: Object
    }
  },
  data() {
    // 事件名称字数限制
    const textNumber = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写追踪事件'))
        return false
      }
      if (value.length > 64) {
        callback(new Error('追踪事件名称不能超过64个字符'))
      } else {
        callback()
      }
    }
    // 事件备注字数限制
    const markNumber = (rule, value, callback) => {
      if (value.length > 200) {
        callback(new Error('追踪事件备注不能超过200个字符'))
      } else {
        callback()
      }
    }
    return {
      isActiveTab0: true,
      isActiveTab1: false,
      // 追踪事件信息
      modalData: {
        name: '',
        mark: ''
      },
      // 正则
      ruleValidate: {
        name: [{ required: true, validator: textNumber }],
        mark: [{ validator: markNumber }]
      },
      // 表格数据
      receiveTitle: [
        { title: '摄像机名称',
          key: 'name',
          minWidth: 120,
          align: 'center',
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
          } },
        { title: '开始时间',
          key: 'startTime',
          minWidth: 150,
          align: 'center',
          render: (h, params) => {
            let text = params.row.startTime ? this.$moment(params.row.startTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
            return h('span', text)
          } },
        { title: '结束时间',
          key: 'endTime',
          minWidth: 150,
          align: 'center',
          render: (h, params) => {
            let text = params.row.endTime ? this.$moment(params.row.endTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
            return h('span', text)
          } },
        { title: '删除',
          key: 'config',
          minWidth: 80,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  icon: 'ios-trash-outline',
                  disabled: !this.status
                },
                style: {
                  marginRight: '0px',
                  width: '50px'
                },
                on: {
                  click: () => {
                    // 只有在【新建】时才可用
                    if (this.status) {
                      this.receivedispose(params.index, params.row, '删除')
                    }
                  }
                }
              })
            ])
          } }
      ],
      receiveData: [], // 表格数据
      videoNode: {}, // 给录像的参数
      acitveId: '',
      markTime: []
    }
  },
  watch: {
    buildList: {
      handler(val) {
        this.modalData.name = val.name
        this.modalData.mark = val.mark
        this.receiveData = []
        val.mapList.map(e => {
          let _rd = {
            resource: e.resource._id,
            name: e.resource.name,
            startTime: e.startTime
          }
          if (e.endTime) {
            _rd.endTime = e.endTime
          }
          this.receiveData.push(_rd)
        })
      },
      deep: true
    }
  },
  methods: {
    // 点击table
    clickTable(data, index) {
      if (this.status) {
        return
      }
      let _data = this.buildList.mapList.filter(e => e.resource._id === data.id)
      this.markTime = [
        {
          resource: _data[0].resource._id,
          startTime: _data[0].startTime,
          endTime: _data[0].endTime
        }
      ]
      this.videoNode = _data[0].resource
    },
    // 确认取消
    cancel(row, name) {
      if (row === 1) {
        this.$emit('openmodal', false)
      } else {
        if (this.isActiveTab0 === true) {
          this.$refs['formValidate'].validate(valid => {
            if (valid) {
              this.newBuild()
            } else {
              return false
            }
          })
        } else {
          if (this.modalData.name !== '') {
            this.newBuild()
          } else {
            this.$Notice.warning({ title: '警告', desc: '请将追踪事件信息填写完整' })
          }
        }
      }
    },
    // 创建
    newBuild() {
      let resourceList = this.$lodash.cloneDeep(this.receiveData)
      resourceList.forEach(item => {
        delete item.name
        if (!item.startTime) {
          delete item.startTime
        }
        if (!item.endTime) {
          delete item.endTime
        }
      })
      resourceList.sort((a, b) => a.startTime - b.startTime)
      const param = {
        name: this.modalData.name,
        mark: this.modalData.mark,
        mapList: resourceList,
        resourceList: resourceList
      }
      // 新建追踪
      if (this.status) {
        setTracking(param).then(res => {
          if (res.statusText === 'Created') {
            this.$emit('openmodal', false)
            this.$parent.getTableList()
            this.$router.push({
              name: '/map/2D',
              params: {
                id: res.data._id,
                path: '/business/relayTracking'
              }
            })
          }
        })
        //  修改追踪
      } else {
        putTracking(this.buildList._id, param).then(res => {
          this.$emit('openmodal', false)
          this.$parent.getTableList()
        })
      }
    },
    // tab切换
    toggle(flag) {
      if (flag === 0) {
        this.isActiveTab0 = true
        this.isActiveTab1 = false
      } else if (flag === 1) {
        this.isActiveTab0 = false
        this.isActiveTab1 = true
      }
    },
    // 单击摄像头选择
    handleNode(data) {
      // 修改状态不可点击
      if (!this.status) {
        return
      }
      // 如果点击的是资源
      if (data.tierType !== 'res') {
        return
      }
      this.markTime = []
      this.acitveId = ''
      this.videoNode = {}
      // 查重，判断选中项之前是否选中
      let repetition = this.receiveData.filter(e => e.resource === data._id)
      if (repetition.length || this.receiveData.length < 5) {
        this.acitveId = data._id
        this.videoNode = data
      }
      if (repetition.length) {
        // 有重复
        let _d = {}
        if (repetition[0].startTime) {
          _d.startTime = repetition[0].startTime
        }
        if (repetition[0].endTime) {
          _d.endTime = repetition[0].endTime
        }
        if (JSON.stringify(_d) !== '{}') {
          this.markTime.push(_d)
        }
      } else {
        // 无重复
        if (this.receiveData.length < 5) {
          this.receiveData.push({
            resource: data._id,
            name: data.name,
            endTime: null,
            startTime: null
          })
        } else {
          this.$Notice.warning({ title: '警告', desc: '摄像机最多能选择五个' })
        }
      }
    },
    // 录像开始和结束时间返回
    caseTime(data) {
      this.receiveData.forEach(item => {
        if (item.resource === this.acitveId) {
          item.endTime = data.end
          item.startTime = data.start
        }
      })
    },
    // 表格删除行
    receivedispose(index, row) {
      this.receiveData.forEach(item => {
        if (row.resource === item.resource) {
          this.receiveData.splice(index, 1)
        }
      })
    },
    // 监听是否开流
    isOpenFlow(val) {
      // 若关流
      if (!val) {
        // let repetition = this.receiveData.filter(e => e.resource === this.acitveId)
        // this.markTime = [
        //   {
        //     resource: this.acitveId,
        //     startTime: repetition[0].startTime,
        //     endTime: repetition[0].endTime
        //   }
        // ]
      }
    }
  },
  beforeDestroy() {
    this.modalData = {
      name: '',
      mark: ''
    }
    this.markTime = []
    this.receiveData = []
  }
}
</script>

<style scoped lang="less">
.modal-main {
  min-width: 100%;
}
.tab {
  padding: 0 5px;
  margin: 15px 0;
  text-align: center;
}
.tab > span {
  float: left;
  background: #3c5073;
  width: 200px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  border: 1px solid #5676a9;
  border-right: none;
}
.tab > span:first-child {
  margin-left: 300px;
}
.tab > span.activeTab {
  background: #4699f9;
}
.choose-box {
  width: 100%;
  height: 550px;
  margin-top: 12px;
}
.choose-tree {
  width: 22%;
  height: 105%;
  margin-right: 5px;
  border: 1px solid #5676a9;
  float: left;
}
.choose-video {
  width: 77%;
  height: 100%;
  float: left;
  .video-top {
    width: 100%;
    height: 387px;
    background-color: #1b3153;
  }
  .viedo-bottom {
    width: 100%;
    height: 200px;
    .tables {
      width: 100%;
    }
  }
}
</style>
