<template>
  <!-- 案件详情 -->
  <div v-if="openModal">
    <Modal v-model="modalToggle" width='1000' class="caseMangementModel" footer-hide @on-cancel="cancel" title="案件详情">
      <div class="eventsDel">
        <div class="eventsDelLeft roll">
          <p><span>事件名称：</span><span>{{formData.eventName}}</span></p>
          <p><span>报警人：</span><span>{{formData.person}}</span></p>
          <p><span>性别：</span><span>{{formData.gender === 2 ? '女' : '男'}}</span></p>
          <p><span>年龄：</span><span>{{formData.age}}</span></p>
          <p><span>民族/国籍：</span><span>{{formData.nationality}}</span></p>
          <p><span>院系/单位：</span><span>{{formData.department}}</span></p>
          <p><span>住址：</span><span>{{formData.address}}</span></p>
          <p><span>联系电话：</span><span>{{formData.phone}}</span></p>
          <p><span>事发地点：</span><span>{{formData.incidentAddress}}</span></p>
          <p><span>学号：</span><span>{{formData.studentNum}}</span></p>
          <p><span>身份证号：</span><span>{{formData.identityNum}}</span></p>
          <p><span>是否调取录像：</span><span>{{formData.isRecode ? '是' : '否'}}</span></p>
          <p><span>案件开始时间：</span><span>{{formData.startTime ? this.$moment(formData.startTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''}}</span></p>
          <p><span>案件结束时间：</span><span>{{formData.endTime ? this.$moment(formData.endTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''}}</span></p>
          <p><span>登记时间：</span><span>{{formData.alarmTime ? this.$moment(formData.alarmTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''}}</span></p>
          <p><span style="float: left;">事件特征：</span><span>{{formData.description}}</span></p>
          <p><span style="float: left;">备注：</span><span>{{formData.mark}}</span></p>
        </div>
        <div class="eventsDelRight">
            <div class="relateCamera">
                <p class="title">事件相关摄像机：</p>
              <div class="relateCameraTable">
                <Table height="300" :columns="columns" :data="tableData"></Table>
              </div>
            </div>
          <div class="relateImg">
            <p class="title">事件相关图片：</p>
            <div class="relateImgBox">
              <div v-for="item of formData.images" :key="item._id" class="img-div">
                <img :src="item.path" class="img-show">
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  props: {
    openModal: {
      type: Boolean,
      default: false
    },
    // 获得的参数
    formData: {
      type: Object,
      default: () => {
        return {
          address: '',
          age: '',
          alarmTime: '',
          createTime: '',
          department: '',
          description: '',
          endTime: '',
          eventName: '',
          gender: 1,
          identityNum: '',
          images: [],
          incidentAddress: '',
          isRecode: false,
          mark: '',
          nationality: '',
          person: '',
          phone: '',
          resourceList: [],
          startTime: '',
          studentNum: ''
        }
      }
    }
  },
  data() {
    return {
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 100,
          align: 'center'
        },
        {
          title: '摄像机名称',
          key: 'name',
          align: 'center'
        }
      ],
      tableData: [],
      modalToggle: false
    }
  },
  watch: {
    formData: {
      handler(val) {
        val.resourceList.map(e => {
          this.tableData.push(e.resource)
        })
      },
      deep: true
    },
    openModal: {
      handler(val) {
        if (val) {
          this.modalToggle = val
        }
      },
      immediate: true
    }
  },
  methods: {
    cancel() {
      this.$emit('cancelModal', false)
    }
  }
}
</script>

<style scoped>
.eventsDel,
.resultDel {
  padding: 0 30px;
  min-width: 1000px;
}
.eventsDelLeft {
  float: left;
  width: calc(40% - 10px);
  font-size: 14px;
  height: 627px;
  overflow-y: auto;
  margin-right: 10px;
}

.roll::-webkit-scrollbar {
  width: 4px;
}
.roll::-webkit-scrollbar-track {
  border-radius: 5px;
}
.roll::-webkit-scrollbar-track-piece {
  background-color: #14284b;
}
.roll::-webkit-scrollbar-thumb {
  background-color: #657ca8;
  border-radius: 5px;
}
.eventsDelLeft > p {
  padding-top: 15px;
}
.eventsDelLeft > p:last-child {
  padding-bottom: 15px;
}
.eventsDelLeft > p > span:first-child {
  display: inline-block;
  width: 100px;
}
.eventsDelLeft > p > span:last-child {
  display: inline-block;
  width: 200px;
  word-wrap: break-word;
}
.eventsDelRight {
  float: left;
  width: 58%;
  padding-top: 15px;
}
.eventsDel::after {
  clear: both;
  content: '';
  display: block;
}
.relateCamera > .title,
.relateImg > .title {
  font-size: 14px;
  margin-bottom: 15px;
}
.relateImg > .title {
  margin-top: 15px;
}

.relateCameraTable >>> .ivu-table th:first-child,
.relateCameraTable >>> .ivu-table td:first-child {
  border-right: 1px solid #203863;
}
.relateCameraTable >>> .ivu-table {
  border: 1px solid #203863;
}
.relateImgBox {
  overflow-x: auto;
  width: 100%;
  height: 220px;
  white-space: nowrap;
}
.relateImgBox div {
  display: inline-block;
  width: 200px;
  height: 200px;
  background: #000000;
}
.relateImgBox div:not(:first-child) {
  margin-left: 15px;
}
.img-div .img-show {
  width: 100%;
  height: 100%;
}
.eventsDelRight >>> .ivu-tabs-bar {
  margin-bottom: 0;
}

.eventsDelRight >>> .ivu-tabs-tab-active {
  border: none !important;
}

.eventsDelRight >>> .ivu-tabs-tabpane {
  border: 1px solid #0f2343;
  padding: 15px;
}
.cameraInfo,
.cameraTime {
  margin-top: 15px;
}
.selectCamera > span:first-child,
.cameraInfo > span:first-child,
.cameraTime > span:first-child {
  display: inline-block;
  width: 100px;
}
.timeLine {
  margin-top: 15px;
}
.timeLine >>> .ivu-timeline-item-tail {
  border-left-color: #5676a9;
}
</style>
