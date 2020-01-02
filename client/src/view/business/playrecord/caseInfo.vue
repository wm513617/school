<template>
  <div class="caseInfo">
    <Tabs :animated="false">
      <TabPane label="案件信息" v-if="type === 'caselist'">
          <div class="case-message">
            <div class="text">
              <p>事件名称: {{infoData.eventName}}</p>
              <p>报警人: {{infoData.person}}</p>
              <p>联系电话: {{infoData.phone}}</p>
              <p>院系/单位: {{infoData.department}}</p>
              <p>事发地点: {{infoData.incidentAddress}}</p>
              <p>案件开始时间: {{infoData.startTime?$moment(infoData.startTime * 1000).format('YYYY-MM-DD HH:mm:ss'):''}}</p>
              <p>案件结束时间: {{infoData.endTime?$moment(infoData.endTime * 1000).format('YYYY-MM-DD HH:mm:ss'):''}}</p>
              <div class="roll">
                <span>事件特征: </span><span>{{infoData.mark}}</span>
              </div>
            </div>
            <Carousel dots="none" loop>
              <CarouselItem class="demo-carousel" v-for="(item, index) in infoData.images" :key="index">
                <img :src="item.path">
              </CarouselItem>
            </Carousel>
          </div>
      </TabPane>
      <TabPane label="追踪信息" v-if="type === 'tracklist'">
        <div class="case-message">
          <div class="text">
            <p>追踪事件名称: {{infoData.name}}</p>
            <p>追踪镜头列表: </p>
            <ul>
              <li v-for="(item, index) of infoData.resource" :key="index" class="item">
                <p class="label">{{item.resource.name}}</p>
                <p class="time">{{setTimeFun(item)}}</p>
              </li>
            </ul>
            <p>追踪事件备注:</p>
            <div class="roll2">{{infoData.mark}}</div>
          </div>
        </div>
        <div class="divider" v-show="infoData.event"></div>
        <div class="case-message" v-if="infoData.event">
          <div class="text">
            <p>事件名称: {{infoData.event.eventName}}</p>
            <p>报警人: {{infoData.event.person}}</p>
            <p>联系电话: {{infoData.event.phone}}</p>
            <p>院系/单位: {{infoData.event.department}}</p>
            <p>事发地点: {{infoData.event.incidentAddress}}</p>
            <p>案件开始时间: {{infoData.event.startTime?$moment(infoData.event.startTime * 1000).format('YYYY-MM-DD HH:mm:ss'):''}}</p>
            <p>案件结束时间: {{infoData.event.endTime?$moment(infoData.event.endTime * 1000).format('YYYY-MM-DD HH:mm:ss'):''}}</p>
            <div class="roll">
              <p>事件特征:</p>
              <div class="roll2">{{infoData.event.description}}</div>
            </div>
          </div>
        </div>
      </TabPane>
    </Tabs>

  </div>
</template>

<script>
export default {
  name: 'caseInfo',
  props: {
    // 返回的数据
    infoData: {
      type: Object,
      default: () => {
        return {
          eventName: '',
          person: '',
          phone: '',
          department: '',
          incidentAddress: '',
          endTime: '',
          alarmTime: '',
          description: '',
          images: []
        }
      }
    },
    /** 显示的类型
     * caselist   案件信息
     * tracklist    追踪信息
     */
    type: {
      type: String,
      default: ''
    }
  },
  methods: {
    setTimeFun(data) {
      let { startTime, endTime } = data
      let _text = ''
      if (startTime) {
        _text += this.$moment(startTime * 1000).format('YYYY-MM-DD HH:mm:ss')
      }
      if (endTime) {
        _text += ' - ' + this.$moment(endTime * 1000).format('HH:mm:ss')
      }
      return _text
    }
  }
}
</script>

<style lang="less" scoped>
@bgc: #1b3153; // 背景颜色
.caseInfo {
  width: 100%;
  height: calc(100%);
  background: @bgc;
  .ivu-tabs /deep/ .ivu-tabs-tab-active {
    border: none;
  }
  .case-message {
    width: 100%;
    padding: 16px;
    padding-top: 0;
    .text {
      user-select: none;
      ul {
        overflow: auto;
        max-height: 486px;
      }
      p,
      div {
        font-size: 14px;
        margin-top: 12px;
      }
      .roll {
        span {
          float: left;
          margin: 0;
          width: 65px;
          & + span {
            width: calc(~'100% - 65px');
            max-height: 100px;
            word-break: break-all;
            overflow-y: auto;
            overflow-x: hidden;
          }
        }
        &::after {
          content: '';
          display: block;
          clear: both;
        }
      }
      .roll2 {
        padding-left: 16px;
        padding-right: 5px;
        max-height: 100px;
        word-break: break-all;
        overflow-y: auto;
        overflow-x: hidden;
      }
      p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .label {
        padding-left: 14px;
      }
      .time {
        margin: 0 10px 0 0;
        text-align: end;
      }
    }
    .demo-carousel {
      height: 310px;
      line-height: 310px;
      width: 100%;
      text-align: center;
      background-color: @bgc;
      img {
        vertical-align: middle;
        width: 100%;
      }
    }
  }
  .divider {
    margin: 0 10px 16px;
    height: 1px;
    box-sizing: content-box;
    border-bottom: 1px solid;
  }
}
</style>
