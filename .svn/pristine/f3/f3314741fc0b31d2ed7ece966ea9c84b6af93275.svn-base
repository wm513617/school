<template>
  <Modal v-model="modalShow" :title="'设备在线详情'" :width="ModalWidth" :mask-closable="false" :closable='false' @mousedown.stop @mouseup.stop class="Vmodel">
    <p slot="header" class="header">
      <span>设备在线详情</span>
      <span class="full-style rt" @click="fullscreen">全屏</span>
    </p>
    <div class="modol-header">
      <div class='lf'>
        <Button type="primary" @click="amplification">放大</Button>
        <Button type="dashed" @click="shrink">缩小</Button>
      </div>
      <div class="rt">
        <Select v-model="dataType" style="width:200px">
          <Option v-for="item in dataTypesArray" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
    </div>
    <div class="modol-body" ref='modelBody'>
      <div class="modol-body-left lf" ref='modolBodyLeft'>
        <div class="modol-body-left-title">
          日期
        </div>
        <ul class="modol-body-left-details" ref='modolBodyLeftDetails'>
          <li v-for='(item, index) in showTimeData' :key='index' class="modol-body-left-details-list">
            {{item.time}}
          </li>
        </ul>
      </div>
      <div class="modol-body-right rt">
        <OnlineCanvas v-if='modalShow' ref="child" :canvasHeight='canvasHeight' :detailData='showDetailData' :headerShow='true' :basicColor='basicColor' :onlineColor='onlineColor'></OnlineCanvas>
      </div>
    </div>
    <div slot="footer" class="footer">
      <!-- <Select v-model="pageNum" style="width:125px" class="lf">
        <Option v-for="item in pageNumArray" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select> -->
      <div>
        <div class="lf garden-box">
          <span class="lf">在线：</span>
          <div class="lf garden" ref='online'></div>
        </div>
        <div class="lf garden-box">
          <span class="lf">离线：</span>
          <div class="lf garden" ref='offline'></div>
        </div>
      </div>
      <Button type="error" @click="cancel" class="cancel rt">关闭</Button>
      <Page class="rt" @on-change='changeCurrent' @on-page-size-change='changePageSize' :current='page' :total='detailData.length' :show-sizer='showSizer' :page-size='pageNum' :page-size-opts='pageNumArray'></Page>
    </div>
  </Modal>
</template>

<script>
import OnlineCanvas from './onlineCanvas.vue'
export default {
  name: 'OnlineDetails',
  components: {
    OnlineCanvas
  },
  props: {
    modalShow: {
      type: Boolean,
      default: false
    },
    onlineColor: {
      type: String,
      default: '#4699f9'
    },
    basicColor: {
      type: String,
      default: '#0f2343'
    },
    offlineColor: {
      type: String,
      default: '#ddd'
    },
    ModalWidth: {
      type: Number,
      default: 1200
    },
    ModalHeight: {
      type: Number,
      default: 800
    }
  },
  data() {
    return {
      dataType: 0,
      canvasHeight: 600,
      afterFullscreen: 600,
      isFullscreen: false,
      page: 1,
      showSizer: true,
      pageNum: 15,
      pageNumArray: [15, 30],
      pages: 1,
      dataTypesArray: [
        {
          value: 0,
          label: '全部日期'
        },
        {
          value: 1,
          label: '异常日期'
        },
        {
          value: 2,
          label: '正常日期'
        }
      ],
      timeData: [
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' },
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' },
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' },
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' },
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' },
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' },
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' },
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' },
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' },
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' },
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' },
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' },
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' },
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' },
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' },
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' },
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' },
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' },
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' },
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' },
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' },
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' },
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' },
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' },
        { time: '2018-8-15' },
        { time: '2018-8-14' },
        { time: '2018-8-13' }
      ],
      detailData: [
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534420800000',
            endTime: '1534435199000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534406400000',
            endTime: '1534410000000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534420800000',
            endTime: '1534435199000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534406400000',
            endTime: '1534410000000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534420800000',
            endTime: '1534435199000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534406400000',
            endTime: '1534410000000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534420800000',
            endTime: '1534435199000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534406400000',
            endTime: '1534410000000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534348800000',
            endTime: '1534359600000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534420800000',
            endTime: '1534435199000'
          },
          {
            startTime: '1534384800000',
            endTime: '1534395884000'
          },
          {
            startTime: '1534405884000',
            endTime: '1534415884000'
          }
        ],
        [
          {
            startTime: '1534406400000',
            endTime: '1534410000000'
          }
        ]
      ],
      showTimeData: [],
      showDetailData: []
    }
  },
  computed: {
  },
  watch: {
    modalShow(newVal, oldVal) {
      if (!newVal) { return }
      this.$refs.modelBody.style.height = '445px'
      setTimeout(() => {
        this.canvasHeight = this.$refs.modolBodyLeftDetails.offsetHeight + 26 * 2
      }, 0)
    },
    pageNum(newVal, oldVal) {
      if (!newVal) { return }
      setTimeout(() => {
        this.canvasHeight = this.$refs.modolBodyLeftDetails.offsetHeight + 26 * 2
      }, 0)
    },
    isFullscreen(newVal, oldVal) {
      if (newVal === oldVal) { return }
      this.$refs.child.resizeFn()
      this.$refs.child.repaint()
    }
  },
  created() {
  },
  mounted() {
    this.$refs.online.style.backgroundColor = this.onlineColor
    this.$refs.offline.style.backgroundColor = this.basicColor
    this.showTimeData = this.timeData.slice(this.pageNum * (this.page - 1), this.pageNum * this.page)
    this.showDetailData = this.detailData.slice(this.pageNum * (this.page - 1), this.pageNum * this.page)
    document.onkeydown = (event) => {
      if (event.keyCode === 27 && this.isFullscreen) {
        this.fullscreen()
      }
    }
  },
  beforeDestroy() {
    window.onresize = null
    document.onkeydown = null
  },
  methods: {
    cancel() {
      this.$emit('cancel', false)
      if (this.isFullscreen) {
        this.isFullscreen = !this.isFullscreen
        document.querySelector('.Vmodel .ivu-modal').style.width = '1200px'
        document.querySelector('.Vmodel .ivu-modal').style.top = '100px'
        document.querySelector('.Vmodel .ivu-modal-body').style.height = '100%'
      }
    },
    fullscreen() {
      this.isFullscreen = !this.isFullscreen
      if (this.isFullscreen) {
        this.afterFullscreen = this.$refs.modelBody.offsetHeight
        document.querySelector('.Vmodel .ivu-modal').style.width = '100%'
        document.querySelector('.Vmodel .ivu-modal').style.top = '0'
        document.querySelector('.Vmodel .ivu-modal-body').style.height = document.body.offsetHeight - 112 + 'px'
        this.$refs.modelBody.style.height = '98%'
      } else {
        this.$refs.modelBody.style.height = '445px'
        document.querySelector('.Vmodel .ivu-modal').style.width = '1200px'
        document.querySelector('.Vmodel .ivu-modal').style.top = '100px'
        document.querySelector('.Vmodel .ivu-modal-body').style.height = this.afterFullscreen + 122 + 'px'
      }
    },
    amplification() {
      this.$refs.child.amplification()
    },
    shrink() {
      this.$refs.child.shrink()
    },
    changeCurrent(val) {
      this.page = val
      this.showTimeData = this.timeData.slice(this.pageNum * (this.page - 1), this.pageNum * this.page)
      this.showDetailData = this.detailData.slice(this.pageNum * (this.page - 1), this.pageNum * this.page)
      setTimeout(() => {
        this.canvasHeight = this.$refs.modolBodyLeftDetails.offsetHeight + 26 * 2
      }, 0)
    },
    changePageSize(val) {
      this.pageNum = val
      this.showTimeData = this.timeData.slice(this.pageNum * (this.page - 1), this.pageNum * this.page)
      this.showDetailData = this.detailData.slice(this.pageNum * (this.page - 1), this.pageNum * this.page)
      setTimeout(() => {
        this.canvasHeight = this.$refs.modolBodyLeftDetails.offsetHeight + 26 * 2
      }, 0)
    }
  }

}
</script>

<style scoped>
.Vmodel {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}
.lf {
  float: left;
}
.rt {
  float: right;
}
.header {
  color: #fff;
}
.modol-header {
  overflow: hidden;
  margin-bottom: 12px;
}
.modol-body {
  overflow-y: auto;
  overflow-x: hidden;
  height: 445px;
}
.modol-body-left {
  width: 100px;
  text-align: center;
}
.modol-body-left-title {
  background-color: #0f2343;
  height: 32px;
  line-height: 32px;
}
.modol-body-right {
  width: calc(100% - 100px);
  height: 100%;
}
.modol-body-left-details-list {
  height: 16px;
  margin-top: 10px;
  line-height: 23px;
}
.full-style {
  cursor: pointer;
  color: #8597ad;
  transition: all 0.25s linear;
}
.full-style:hover {
  color: #fff;
}
.footer {
  /* overflow: hidden; */
  height: 32px;
  clear: both;
}
.cancel {
  margin-left: 24px;
}
.garden {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #fff;
  margin: 8px;
}
.garden-box {
  line-height: 32px;
  margin-left: 12px;
}
</style>
