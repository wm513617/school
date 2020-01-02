<template>
    <div class="intercomManage">
        <div class="intercom-left">
          <h2>台麦列表</h2>
          <div class="box">
            <div class="row" v-for='(item, index) in requestList' :key="index + 'a'">
              <div class="row-name">
                <div class="row-name-icon">
                  <i class="icon iconfont icon-maikefeng"></i>
                </div>
                <div class="row-name-con" :title="item.name1">{{item.name1}}</div>
              </div>
              <div class="row-switch">
                <div class="row-open" :style="item.terminal !== '' ? 'cursor:no-drop' : ''" style="color:#31A58E;" @click="item.terminal === '' ? answer(item, index) : ''">
                  <i class="icon iconfont icon-jieting"></i>
                </div>
                <div class="row-close" style='color:red' @click='requestHangUp(item, index)'>
                  <i class="icon iconfont icon-guaduan1"></i>
                </div>
              </div>
            </div>
            <div class="row" v-for='(item, index) in microphoneList' :key='index'>
              <div class="row-name">
                <div class="row-name-icon">
                  <i class="icon iconfont icon-maikefeng"></i>
                </div>
                <div class="row-name-con" :title="item.name">{{item.name}}</div>
              </div>
              <div class="row-switch">
                <div class="row-open" style="color:#fff;" :style="item.terminal !== '' ? 'cursor:no-drop' : ''" @click="item.terminal === '' ? sponsor(item, index) : ''">
                  <i class="icon iconfont icon-guaji"></i>
                </div>
                <div class="row-close" :style="item.terminal !== '' ? 'cursor:pointer; color: red' : 'cursor:no-drop; color: #999'" @click="item.terminal !== '' ? hangUpTerminal(item, index) : ''">
                  <i class="icon iconfont icon-guaduan1"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="intercom-con">
          <previewPlugin ref='plugin' :iconShow='iconShow' :panesArr='panesArr' :defaultPane='defaultPane'></previewPlugin>
        </div>
        <div class="intercom-right">
          <h2>对讲请求</h2>
          <div class="table" ref="height">
            <Table :height='tableHeight' :columns="columns1" :data="data1"></Table>
          </div>
        </div>
        <Modal v-model="modal1" title="选择终端" width='200' footer-hide>
          <bs-cover v-if="modal1" v-model="modal1">
              <RadioGroup v-model="vertical" vertical>
                <Radio :label="index" v-for='(item, index) in terminalList' :disabled='item.disabled' :key='index'>{{item.name}}</Radio>
              </RadioGroup>
              <div class="footer" style="padding: 20px 0 0 20px;">
                <Button style='margin-right: 8px' @click="cancel">取消</Button>
                <Button @click="ok">确认</Button>
              </div>
          </bs-cover>
        </Modal>
    </div>
</template>

<script>
import alarm from 'src/socket/alarm.js'
import previewPlugin from '../../components/videoComponentsNew/previewPlugin'
import { mapActions } from 'vuex'
export default {
  components: {
    previewPlugin
  },
  data() {
    return {
      vertical: '',
      modal1: false,
      sponsorItem: '', // 台麦发起项
      sponsorIndex: '', // 台麦发起index
      previewArr: [], // 保存当前预览所有视频的数据
      tableHeight: '',
      defaultPane: 9,
      panesArr: [{ value: 1, label: '单画面' }, { value: 4, label: '四画面' }, { value: 9, label: '九画面' }],
      iconShow: {
        stopAll: false,
        stop: false,
        screenshot: false,
        speech: false,
        volume: true,
        fullScreen: false,
        multiScreen: true
      },
      microphoneList: [],
      requestList: [],
      terminalList: [],
      columns1: [
        {
          title: '终端名称',
          key: 'name2',
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
                  title: params.row.name2
                }
              },
              params.row.name2
            )
          }
        },
        {
          title: '对讲IP地址',
          key: 'ip2'
        },
        {
          title: '对讲ID号',
          key: 'serise2'
        },
        {
          title: '对讲台麦',
          key: 'name1',
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
                  title: params.row.name1
                }
              },
              params.row.name1
            )
          }
        },
        {
          title: '操作',
          render: (h, params) => {
            let con = params.row.terminal !== '' ? 'no-drop' : ''
            return h(
              'div',
              [
                h('span', {
                  style: {
                    width: '50%',
                    display: 'inline-block',
                    color: 'red'
                  },
                  class: 'icon iconfont icon-guaduan',
                  on: {
                    click: () => {
                      this.hangUp(params)
                    }
                  }
                }),
                h('span', {
                  style: {
                    width: '50%',
                    display: 'inline-block',
                    color: '#31A58E',
                    cursor: con
                  },
                  class: 'icon iconfont icon-dianhua',
                  on: {
                    click: () => {
                      params.row.terminal === '' && this.dial(params)
                    }
                  }
                })
              ],
              {
                style: {
                  width: '100%'
                }
              }
            )
          }
        }
      ],
      data: [],
      data1: []
    }
  },
  created() {
    alarm.on('talkback', this.interruptRequest)
    this.getMicroPhoneList().then(res => {
      this.microphoneList = res.data
      this.microphoneList.forEach((item, index) => {
        item.terminal = ''
      })
      let val = JSON.parse(sessionStorage.getItem('list'))
      if (val) {
        this.microphoneList.forEach((item, index) => {
          val.forEach((v, n) => {
            if (item.serise === v.serise) {
              v.terminal = ''
              this.microphoneList[index] = v
            }
          })
        })
        // this.microphoneList = JSON.parse(sessionStorage.getItem('list'))
      }
      this.microphoneList = JSON.parse(JSON.stringify(this.microphoneList))
      console.log(this.microphoneList, '88888888888')
      this.getTerminalList().then(res => {
        this.terminalList = res.data
        this.terminalList.forEach((item, index) => {
          item.disabled = false
        })
        // let con = JSON.parse(sessionStorage.getItem('terminal'))
        // if (con) {
        //   this.terminalList.forEach((item, index) => {
        //     con.forEach((v, n) => {
        //       if (item.serise === v.serise) {
        //         this.terminalList[index] = v
        //       }
        //     })
        //   })
        //   // this.terminalList = JSON.parse(sessionStorage.getItem('terminal'))
        // }
        this.terminalList = JSON.parse(JSON.stringify(this.terminalList))
        this.microphoneList.forEach((item, index) => {
          if (item.terminal !== '') {
            const body = {
              initiator: item.serise,
              receiver: this.terminalList[item.terminal].serise
            }
            this.postTalkbackHangup(body).then(res => {
              this.terminalList[item.terminal].disabled = false
              this.microphoneList[index].terminal = ''
            })
          }
        })
        let sum = JSON.parse(sessionStorage.getItem('data'))
        if (sum) {
          this.data = sum
          this.data.forEach((item, index) => {
            if (item.terminal !== '') {
              const body = {
                initiator: item.serise2,
                receiver: item.serise1
              }
              this.postTalkbackHangup(body).then(res => {
                // this.data1.splice(params.index, 1)
                this.data.splice(index, 1)
                this.terminalList.forEach((v, n) => {
                  if (v.serise === item.serise2) {
                    this.terminalList[n].disabled = false
                  }
                })
              })
            }
          })
        }
        console.log(this.terminalList)
        // let arr = [
        //   {
        //     noticeInfo: {
        //       modelInfo: {
        //         eventType: 'accept',
        //         askId: '9',
        //         ackId: '1'
        //       }
        //     }
        //   },
        //   {
        //     noticeInfo: {
        //       modelInfo: {
        //         eventType: 'accept',
        //         askId: '45',
        //         ackId: '1'
        //       }
        //     }
        //   },
        //   {
        //     noticeInfo: {
        //       modelInfo: {
        //         eventType: 'accept',
        //         askId: '15',
        //         ackId: '2'
        //       }
        //     }
        //   },
        //   {
        //     noticeInfo: {
        //       modelInfo: {
        //         eventType: 'accept',
        //         askId: '14',
        //         ackId: '22'
        //       }
        //     }
        //   }
        // ]
        // arr.forEach(item => {
        //   this.interruptRequest(item)
        // })
      })
    })
  },
  methods: {
    ...mapActions([
      'getMicroPhoneList',
      'getTerminalList',
      'postTalkbackAnswer',
      'postTalkbackHangup',
      'getSingleResource',
      'postMicrophoneAnswer'
    ]),
    // 请求列表里接通
    dial(params) {
      const body = {
        initiator: params.row.serise2,
        receiver: params.row.serise1
      }
      this.postMicrophoneAnswer(body).then(res => {
        // this.data1[params.index].terminal = params.row.serise2
        this.data[params.index].terminal = params.row.serise2
        this.preview(params.row.camera2, params.row.camera1)
      })
    },
    // 请求列表里挂断
    hangUp(params) {
      const body = {
        initiator: params.row.serise2,
        receiver: params.row.serise1
      }
      this.postTalkbackHangup(body).then(res => {
        // this.data1.splice(params.index, 1)
        this.data.splice(params.index, 1)
        this.terminalList.forEach((v, n) => {
          if (v.serise === params.row.serise2) {
            this.terminalList[n].disabled = false
          }
        })
        this.closePreview(params.row.camera2, params.row.camera1)
      })
    },
    // 台麦发起
    sponsor(item, index) {
      this.modal1 = true
      this.sponsorItem = item
      this.sponsorIndex = index
      console.log(this.defaultPane, this.$refs.plugin.videoStatusArr, '555555555')
    },
    // 终端弹框取消
    cancel() {
      this.modal1 = false
      this.vertical = ''
    },
    // 台麦挂断终端请求
    requestHangUp(item, index) {
      const body = {
        initiator: item.serise2,
        receiver: item.serise1
      }
      this.postTalkbackHangup(body).then(res => {
        // this.requestList[index].terminal = ''
        this.data1.forEach((v, n) => {
          if (v.serise2 === item.serise2) {
            // this.data1.splice(n, 1)
            this.data.splice(n, 1)
          }
        })
        this.terminalList.forEach((v, n) => {
          if (v.serise === item.serise2) {
            this.terminalList[n].disabled = false
          }
        })
        this.closePreview(item.camera2, item.camera1)
      })
    },
    // 台麦接收终端请求
    answer(item, index) {
      console.log(item, index, '363636')
      const body = {
        initiator: item.serise2,
        receiver: item.serise1
      }
      this.postMicrophoneAnswer(body).then(res => {
        this.requestList[index].terminal = item.serise2
        this.preview(item.camera2, item.camera1)
      })
    },
    // 台麦呼叫终端确认
    ok() {
      const body = {
        initiator: this.sponsorItem.serise,
        receiver: this.terminalList[this.vertical].serise
      }
      this.postTalkbackAnswer(body).then(res => {
        this.modal1 = false
        this.microphoneList[this.sponsorIndex].terminal = this.vertical
        this.terminalList[this.vertical].disabled = true
        this.preview(this.sponsorItem.camera, this.terminalList[this.vertical].camera)
        this.vertical = ''
      })
      console.log(this.microphoneList, '555555')
    },
    // 预览
    async preview(a, b) {
      // this.previewArr.push({a: a, b: b})
      if (this.defaultPane === 1) {
        a[0] &&
          this.getSingleResource(a[0]).then(res => {
            let data = {
              devIp: res.ip,
              devPort: res.eid.cport,
              channel: res.chan,
              streamType: res.stream,
              resId: res._id
            }
            this.$refs.plugin.openPreview(data)
          })
        b[0] &&
          this.getSingleResource(b[0]).then(res => {
            let data = {
              devIp: res.ip,
              devPort: res.eid.cport,
              channel: res.chan,
              streamType: res.stream,
              resId: res._id
            }
            this.$refs.plugin.openPreview(data)
          })
      }
      if (this.defaultPane === 4) {
        await a.forEach((item, index) => {
          if (item && index < 2) {
            this.getSingleResource(item).then(res => {
              console.log(res, '2522222222222')
              let data = {
                devIp: res.ip,
                devPort: res.eid.cport,
                channel: res.chan,
                streamType: res.stream,
                resId: res._id
              }
              this.$refs.plugin.openPreview(data)
            })
          }
        })
        await b.forEach((item, index) => {
          if (item && index < 2) {
            this.getSingleResource(item).then(res => {
              let data = {
                devIp: res.ip,
                devPort: res.eid.cport,
                channel: res.chan,
                streamType: res.stream,
                resId: res._id
              }
              this.$refs.plugin.openPreview(data)
            })
          }
        })
      }
      if (this.defaultPane === 9) {
        await a.forEach((item, index) => {
          if (item) {
            this.getSingleResource(item).then(res => {
              let data = {
                devIp: res.ip,
                devPort: res.eid.cport,
                channel: res.chan,
                streamType: res.stream,
                resId: res._id
              }
              this.$refs.plugin.openPreview(data)
            })
          }
        })
        await b.forEach((item, index) => {
          if (item) {
            this.getSingleResource(item).then(res => {
              let data = {
                devIp: res.ip,
                devPort: res.eid.cport,
                channel: res.chan,
                streamType: res.stream,
                resId: res._id
              }
              this.$refs.plugin.openPreview(data)
            })
          }
        })
      }
    },
    // 关闭预览
    closePreview(a, b) {
      a.forEach((item, index) => {
        if (item) {
          this.getSingleResource(item).then(res => {
            this.$refs.plugin.videoStatusArr.forEach((v, n) => {
              if (v.source && v.source.resId === res._id) {
                this.$refs.plugin.stopPreview(n)
              }
            })
          })
        }
      })
      b.forEach((item, index) => {
        if (item) {
          this.getSingleResource(item).then(res => {
            this.$refs.plugin.videoStatusArr.forEach((v, n) => {
              if (v.source && v.source.resId === res._id) {
                this.$refs.plugin.stopPreview(n)
              }
            })
          })
        }
      })
    },
    // 挂断台麦请求
    hangUpTerminal(item, index) {
      console.log(item, this.microphoneList, '6666666666')
      const body = {
        initiator: item.serise,
        receiver: this.terminalList[item.terminal].serise
      }
      this.postTalkbackHangup(body).then(res => {
        this.terminalList[item.terminal].disabled = false
        this.closePreview(item.camera, this.terminalList[item.terminal].camera)
        this.microphoneList[index].terminal = ''
      })
    },
    // 接收终端请求消息
    interruptRequest(data) {
      console.log(data, '4545454')
      if (data.noticeInfo && data.noticeInfo.modelInfo.eventType === 'accept') {
        let a = data.noticeInfo.modelInfo.askId
        let b = data.noticeInfo.modelInfo.ackId
        let obj = {
          camera1: [],
          cameraDesciption1: '',
          ip1: '',
          name1: '',
          record1: '',
          serise1: '',
          camera2: [],
          cameraDesciption2: '',
          ip2: '',
          name2: '',
          record2: '',
          serise2: '',
          terminal: ''
        }
        console.log(this.terminalList, '14141414')
        this.terminalList.forEach((item, index) => {
          if (Number(item.serise) === Number(a)) {
            obj.camera2 = item.camera
            obj.cameraDesciption2 = item.cameraDesciption
            obj.ip2 = item.ip
            obj.name2 = item.name
            obj.record2 = item.record
            obj.serise2 = item.serise
            this.terminalList[index].disabled = true
          }
        })
        this.microphoneList.forEach((item, index) => {
          if (Number(item.serise) === Number(b)) {
            obj.camera1 = item.camera
            obj.cameraDesciption1 = item.cameraDesciption
            obj.ip1 = item.ip
            obj.name1 = item.name
            obj.record1 = item.record
            obj.serise1 = item.serise
          }
        })
        if (obj.serise1 && obj.serise2) {
          this.data.unshift(JSON.parse(JSON.stringify(obj)))
        }
      }
      if (data.noticeInfo && data.noticeInfo.modelInfo.eventType === 'end') {
        let askId = data.noticeInfo.modelInfo.askId
        let ackId = data.noticeInfo.modelInfo.ackId
        this.data.forEach((item, index) => {
          if (Number(item.serise2) === Number(askId) && Number(item.serise1) === Number(ackId)) {
            this.data.splice(index, 1)
          }
        })
      }
    },
    resizefun() {
      this.tableHeight = this.$refs['height'].offsetHeight
    }
  },
  mounted() {
    // table表格高度只适应
    this.tableHeight = this.$refs['height'].offsetHeight
    window.addEventListener('resize', this.resizefun)
  },
  watch: {
    data() {
      this.data1 = this.data
      if (this.data1.length > 20) {
        this.data1.length = 20
      }
      this.requestList = []
      this.getMicroPhoneList().then(res => {
        this.microphoneList = res.data
        this.microphoneList.forEach((item, index) => {
          item.terminal = ''
        })
        this.microphoneList = JSON.parse(JSON.stringify(this.microphoneList))
        this.data1.forEach((item, index) => {
          let sm = this.requestList.every(v => {
            return item.serise1 !== v.serise1
          })
          if (sm) {
            this.requestList.push(item)
          }
        })
        this.requestList.forEach((item, index) => {
          this.microphoneList.forEach((v, n) => {
            if (item.serise1 === v.serise) {
              this.microphoneList.splice(n, 1)
            }
          })
        })
      })
    },
    deep: true
  },
  beforeDestroy() {
    if (this.microphoneList.length > 0) {
      sessionStorage.setItem('list', JSON.stringify(this.microphoneList))
      // sessionStorage.setItem('terminal', JSON.stringify(this.terminalList))
      sessionStorage.setItem('data', JSON.stringify(this.data))
    }
    window.removeEventListener('resize', this.resizefun)
    this.resizefun = null
  },
  destroyed() {
    alarm.remove('talkback', this.interruptRequest)
  }
}
</script>

<style lang='less' scoped>
.intercomManage {
  width: 100%;
  height: 100%;
  padding: 16px 0;
  display: flex;
  h2 {
    width: 100%;
    background: #0f2243;
    height: 38px;
    line-height: 38px;
    text-align: center;
    font-size: 14px;
  }
  .intercom-left {
    width: 272px;
    height: 100%;
    margin-right: 16px;
    background: #1b3153;
    .box {
      width: 100%;
      height: ~'calc(100% - 38px)';
      overflow-y: auto;
      .row {
        height: 86px;
        width: 116px;
        float: left;
        margin: 12px 0px 0px 12px;
        background: #434f65;
        border-radius: 5px;
        display: flex;
        .row-name {
          flex: 2;
          padding: 5px;
          .row-name-icon {
            width: 100%;
            height: 70%;
            text-align: center;
            line-height: 53px;
            color: #fff;
            i {
              font-size: 50px;
            }
          }
          .row-name-con {
            width: 66px;
            height: 30%;
            text-align: center;
            line-height: 22px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .row-switch {
          width: 40px;
          height: 100%;
          padding: 5px 0;
          .row-open {
            width: 100%;
            height: 50%;
            border-left: 1px solid #797979;
            border-bottom: 1px solid #797979;
            text-align: center;
            line-height: 38px;
            i {
              font-size: 18px;
            }
          }
          .row-open:hover {
            background: rgba(121, 121, 121, 0.5);
            border-radius: 5px;
          }
          .row-close:hover {
            background: rgba(121, 121, 121, 0.5);
            border-radius: 5px;
          }
          .row-close {
            width: 100%;
            height: 50%;
            border-left: 1px solid #797979;
            text-align: center;
            line-height: 38px;
            i {
              font-size: 18px;
            }
          }
        }
      }
    }
  }
  .intercom-con {
    flex: 2;
    background: #1b3153;
  }
  .intercom-right {
    width: 442px;
    height: 100%;
    margin-left: 16px;
    background: #1b3153;
    .table {
      width: 100%;
      height: ~'calc(100% - 38px)';
    }
  }
  /deep/ .ivu-table th .ivu-table-cell {
    padding: 0 12px;
  }
}
</style>
