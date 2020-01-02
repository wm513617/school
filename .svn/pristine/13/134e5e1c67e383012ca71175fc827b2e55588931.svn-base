<template>
    <div class="video-copy">
        <div class="video-head">
            <div class="row">
                <Input v-model="username" placeholder="请输入值班人/拷贝人" style="width: 200px" />
            </div>
            <div class="row">
                <DatePicker type="date" v-model="date" placeholder="请输入日期" style="width: 200px"></DatePicker>
            </div>
            <Button icon="search" @click='search'>检索</Button>
            <Button icon="plus" @click='addVideo'>添加</Button>
            <Button icon="edit" @click='updateVideo' :disabled="isVideoChecked">修改</Button>
            <Button icon="trash-a" @click='deleteVideo' :disabled="isVideoChecked">删除</Button>
        </div>
        <div class="table">
            <div class="table-box">
                <Table :columns="columns1" :data="videiLogList" @on-selection-change="selectServeRow"></Table>
            </div>
        </div>
        <div class="foot-page">
            <Page class="rt" show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :current='Number(startNum)' :total="Number(inPageNum)" :page-size="Number(pageLimit)" @on-change="pageChange" show-elevator show-total></Page>
        </div>
        <div class="modal" v-if='addModal'>
            <div class="add-modal">
                <div class="modal-top">
                    <span v-if='isAddVideo'>添加录像拷贝纪录</span>
                    <span v-if='!isAddVideo'>修改录像拷贝纪录</span>
                    <span style="display: block; float:right; cursor:pointer" @click="closeModal">
                        <Icon type="close-round" size="16" color="#ccc"></Icon>
                    </span>
                </div>
                <div style="padding: 12px 24px">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="110" inline>
                        <FormItem label='录像拷贝时间' prop='copyTime'>
                            <DatePicker v-model="formValidate.copyTime" type="date" placeholder="Select date" style="width: 200px"></DatePicker>
                        </FormItem>
                        <FormItem label='拷贝人' prop='user'>
                            <Input style="width: 200px" v-model="formValidate.user" placeholder="请输入拷贝人"/>
                        </FormItem>
                        <FormItem label='拷贝原因' prop='cause'>
                            <Input v-model="formValidate.cause" style="width:400px" type="textarea" :rows="3" placeholder="请输入拷贝原因" />
                        </FormItem>
                        <FormItem label='拷贝的录像镜头' prop='facility'>
                            <Select v-model="formValidate.facility" filterable style="width:400px" placeholder="请选择录像镜头">
                                <Option v-for="item in facilityList" :value="item.id" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label='拷贝的录像时间'>
                            <!-- <BSdateRange style='display: inline-block;'  @timeChange="startTimeChange" :datetime="startDate" :width='200' :height='32'></BSdateRange> -->
                            <DatePicker type="datetime" placeholder="请输入开始时间" @on-change="startTimeChange" v-model="startDate" style="width: 200px"></DatePicker>
                            至
                            <DatePicker type="datetime" placeholder="请输入结束时间" @on-change="endTimeChange" v-model="endDate" style="width: 200px"></DatePicker>
                            <!-- <BSdateRange style='display: inline-block;'  @timeChange="endTimeChange" :datetime="endDate" :width='200' :height='32'></BSdateRange> -->
                            <Button style="margin-left: 10px" @click='addList'>+</Button>
                        </FormItem>
                        <FormItem label='拷贝的录像列表'>
                            <Table width='550' height='232' border :columns="columns2" :data="modalList"></Table>
                        </FormItem>
                        <FormItem label='下班前是否交接' prop='connect'>
                            <RadioGroup v-model="formValidate.connect" style="width: 200px">
                                <Radio style='margin-right: 10px' label="是">是</Radio>
                                <Radio label="否">否</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label='录像是否正常' prop='normal'>
                            <RadioGroup v-model="formValidate.normal" style="width: 200px">
                                <Radio style='margin-right: 10px' label="是"></Radio>
                                <Radio label="否"></Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label='备注' prop='remark'>
                            <Input v-model="formValidate.remark" style="width:400px" type="textarea" :rows="3" placeholder="请输入内容" />
                        </FormItem>
                    </Form>
                </div>
                <div class="modal-footer">
                    <Button style='width: 54px;' type="primary" @click="confirm('formValidate')">确定</Button>
                    <Button style='width: 54px;' @click="cancel('formValidate')">取消</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      username: '',
      startNum: 1,
      inPageNum: '',
      date: new Date(),
      pageLimit: this.$PageInfo.limit,
      addModal: false,
      isAddVideo: true,
      formValidate: {
        user: '',
        facility: '',
        copyTime: new Date(),
        cause: '',
        connect: '是',
        normal: '是',
        remark: ''
      },
      ruleValidate: {
        user: [
          { required: true, message: '请输入拷贝人', trigger: 'blur' },
          { max: 64, message: '取值范围0-64个字符', trigger: 'blur' }
        ],
        cause: [{ max: 100, message: '取值范围0-100个字符', trigger: 'blur' }],
        remark: [{ max: 200, message: '取值范围0-200个字符', trigger: 'blur' }],
        facility: [{ required: true, message: '请选择拷贝录像镜头', trigger: 'change' }]
      },
      modalList: [],
      facilityList: [],
      startDate: this.$moment(this.$moment(new Date()).format('YYYY-MM-DD')).format('YYYY-MM-DD HH:mm:ss'),
      endDate: this.$moment(this.$moment(new Date()).format('YYYY-MM-DD')).format('YYYY-MM-DD HH:mm:ss'),
      selectedIndex: [],
      isVideoChecked: true,
      selectItem: '',
      columns1: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '日期',
          width: 150,
          key: 'date'
        },
        {
          title: '值班人',
          width: 150,
          key: 'watch',
          render: (h, params) => {
            return h(
              'div',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.watch
                }
              },
              params.row.watch
            )
          }
        },
        {
          title: '拷贝人',
          width: 150,
          key: 'copy',
          render: (h, params) => {
            return h(
              'div',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.copy
                }
              },
              params.row.copy
            )
          }
        },
        {
          title: '拷贝原因',
          width: 250,
          key: 'cause',
          render: (h, params) => {
            return h(
              'div',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.cause
                }
              },
              params.row.cause
            )
          }
        },
        {
          title: '拷贝的录像镜头名称、录像时间',
          key: 'details',
          render: (h, params) => {
            console.log(params)
            return h(
              'div',
              params.row.details.map((item, index) => {
                return h('p', {}, item)
              })
            )
          }
        },
        // {
        //   title: '下班前是否交接',
        //   width: 150,
        //   key: 'connect'
        // },
        // {
        //   title: '录像是否正常',
        //   width: 150,
        //   key: 'normal'
        // },
        {
          title: '备注',
          key: 'remark',
          width: 300,
          render: (h, params) => {
            return h(
              'div',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.remark
                }
              },
              params.row.remark
            )
          }
        }
      ],
      videiLogList: [],
      columns2: [
        {
          title: '录像镜头',
          key: 'name',
          width: 180,
          render: (h, params) => {
            return h(
              'div',
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
          title: '录像时间',
          key: 'videoTime'
        },
        {
          title: '',
          width: 80,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  on: {
                    click: () => {
                      this.delectParams(params.index)
                    }
                  }
                },
                '-'
              )
            ])
          }
        }
      ]
    }
  },
  created() {
    this.getVideoLogList()
    this.getResourceVideo()
      .then(res => {
        console.log(res)
        res.data.forEach((item, index) => {
          this.facilityList.push({
            value: String(index),
            label: item.name,
            id: item._id
          })
        })
      })
      .catch(err => {
        console.log(err + '获取镜头列表错误')
      })
  },
  methods: {
    ...mapActions([
      'getVideoCopyLog',
      'postAddViodeCopyLog',
      'deleteViodeCopyLog',
      'updateVideoCopyLog',
      'getResourceVideo'
    ]),
    pageSizeChange() {
      this.getVideoLogList()
    },
    pageChange() {
      this.getVideoLogList()
    },
    addVideo() {
      this.addModal = true
      this.isAddVideo = true
    },
    confirm(name) {
      console.log(this.formValidate.facility, 'formValidate.facility')
      let user = window.sessionStorage.getItem('user.username')
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.modalList.length <= 0) {
            this.addList()
          }
          let resourceList = []
          this.modalList.forEach((item, index) => {
            resourceList.push({
              resource: item.resource,
              startTime: item.startTime,
              endTime: item.endTime
            })
          })
          const body = {
            time: this.$moment(this.formValidate.copyTime).valueOf(),
            name: this.formValidate.user,
            info: this.formValidate.cause,
            resourceList: resourceList,
            associate: this.formValidate.connect === '是',
            recodeStatus: this.formValidate.normal === '是',
            mark: this.formValidate.remark,
            user: user
          }
          if (this.isAddVideo) {
            this.postAddViodeCopyLog(body)
              .then(res => {
                this.cancel()
                this.successMsg('添加成功')
                this.getVideoLogList()
              })
              .catch(err => {
                console.log(err + '添加失败')
                this.warningMsg('添加失败')
              })
          } else {
            this.updateVideoCopyLog({ id: this.selectItem[0].id, content: body })
              .then(() => {
                this.cancel()
                this.successMsg('修改成功')
                this.getVideoLogList()
              })
              .catch(err => {
                console.log(err + '修改失败')
                this.warningMsg('修改失败')
              })
          }
        } else {
        }
      })
    },
    cancel() {
      this.modalList = []
      this.$refs['formValidate'].resetFields()
      this.addModal = false
      this.formValidate = {
        user: '',
        facility: '',
        copyTime: new Date(),
        cause: '',
        connect: '是',
        normal: '是',
        remark: ''
      }
    },
    closeModal() {
      this.cancel()
    },
    search() {
      this.getVideoLogList()
    },
    getVideoLogList() {
      const body = {
        seek: this.username,
        time: this.$moment(this.date).valueOf(),
        page: this.startNum,
        limit: this.pageLimit
      }
      this.getVideoCopyLog(body)
        .then(res => {
          this.videiLogList = []
          res.data.forEach((item, index) => {
            let details = []
            item.resourceList.forEach((val, index) => {
              details.push(
                val.resource.name +
                  ':' +
                  this.$moment(val.startTime).format('YYYY-MM-DD HH:mm:ss') +
                  '至' +
                  this.$moment(val.endTime).format('YYYY-MM-DD HH:mm:ss')
              )
            })
            this.videiLogList.push({
              date: this.$moment(item.time).format('YYYY-MM-DD'),
              watch: 'admin',
              copy: item.name,
              cause: item.info,
              details: details,
              connect: item.associate ? '是' : '否',
              normal: item.recodeStatus ? '是' : '否',
              remark: item.mark,
              resourceList: item.resourceList,
              id: item._id
            })
          })
          this.inPageNum = res.data.length
        })
        .catch(err => {
          console.log(err + '获取录像拷贝日志列表失败')
        })
    },
    addList() {
      if (this.formValidate.facility !== '') {
        let itemObj = this.facilityList.filter(item => {
          if (item.id === this.formValidate.facility) {
            return item || {}
          }
        })
        this.modalList.push({
          // name: this.facilityList[Number(this.formValidate.facility)].label,
          name: itemObj[0] && itemObj[0].label,
          videoTime:
            this.$moment(this.startDate).format('YYYY-MM-DD HH:mm:ss') +
            '至' +
            this.$moment(this.endDate).format('YYYY-MM-DD HH:mm:ss'),
          startTime: this.$moment(this.startDate).valueOf(),
          endTime: this.$moment(this.endDate).valueOf(),
          resource: itemObj[0] && itemObj[0].id
          // resource: this.facilityList[Number(this.formValidate.facility)].id
        })
      } else {
        this.warningMsg('请选择录像镜头')
      }
    },
    delectParams(index) {
      this.modalList.splice(index, 1)
    },
    startTimeChange(val) {
      // this.startDate = val.dateTimes
      if (this.startDate.getTime() > this.endDate.getTime()) {
        this.endDate = this.startDate
      }
    },
    endTimeChange(val) {
      console.log('45454545454545')
      // this.endDate = val.dateTimes
      if (this.startDate.getTime() > this.endDate.getTime()) {
        this.startDate = this.endDate
      }
    },
    deleteVideo() {
      if (this.selectedIndex.length === 0) {
        this.warningMsg('请选择需要删除的记录')
        return
      }
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除所选维修单位吗？</p>',
        onOk: () => {
          this.videoDelete()
        },
        onCancel: () => {}
      })
    },
    selectServeRow(sel) {
      this.selectedIndex = []
      if (sel.length === 0) {
        this.isVideoChecked = true
      } else {
        this.isVideoChecked = false
      }
      sel.forEach((v, n) => {
        this.selectedIndex.push(v.id)
      })
      this.selectItem = sel
    },
    videoDelete() {
      console.log(this.selectedIndex)
      this.deleteViodeCopyLog(this.selectedIndex)
        .then(() => {
          this.successMsg('删除成功')
          // this.isServeChecked = false
          this.getVideoLogList()
        })
        .catch(() => {
          this.errorMsg('删除失败')
        })
    },
    updateVideo() {
      if (this.selectedIndex.length !== 1) {
        this.$Modal.confirm({
          title: '提示',
          content: '一次只能修改一个！'
        })
      } else {
        this.addModal = true
        this.isAddVideo = false
        console.log(this.selectItem[0], '555555')
        this.formValidate.user = this.selectItem[0].copy
        this.formValidate.copyTime = this.selectItem[0].date
        this.formValidate.cause = this.selectItem[0].cause
        this.formValidate.connect = this.selectItem[0].connect
        this.formValidate.normal = this.selectItem[0].normal
        this.formValidate.remark = this.selectItem[0].remark
        this.selectItem[0].resourceList.forEach((item, index) => {
          this.modalList.push({
            name: item.resource.name,
            videoTime:
              this.$moment(this.startTime).format('YYYY-MM-DD HH:mm:ss') +
              '至' +
              this.$moment(this.endTime).format('YYYY-MM-DD HH:mm:ss'),
            startTime: item.startTime,
            endTime: item.endTime,
            resource: item.resource._id
          })
        })
        this.formValidate.facility = this.modalList[0].resource
      }
    }
  }
}
</script>

<style lang='less' scoped>
.video-copy {
  width: 100%;
  height: 100%;
  position: relative;
  .video-head {
    width: 100%;
    padding: 12px 24px;
    .row {
      display: inline-block;
      margin-right: 8px;
    }
    button {
      margin-right: 8px;
    }
  }
  .table {
    position: relative;
    width: 100%;
    .table-box {
      width: 100%;
      position: absolute;
    }
  }
  .foot-page {
    width: 100%;
    border-top: none;
    padding: 3px 24px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: #244575;
  }
  .rt {
    float: right;
  }
  .modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(8, 21, 38, 0.8);
    z-index: 10000;
    .add-modal {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -300px;
      margin-top: -328px;
      width: 700px;
      // height: 656px;
      background-color: #1b3153;
      z-index: 99999;
      border-radius: 10px;
      border: 1px solid #1b3153;
      .modal-top {
        font-size: 14px;
        height: 38px;
        padding: 10px 24px;
        border-radius: 8px 8px 0 0;
        background-color: #0f2343;
      }
      .modal-footer {
        width: 100%;
        padding: 24px;
        padding-top: 16px;
        // text-align: right;
        border-top: 1px solid #203863;
      }
    }
  }
}
</style>
