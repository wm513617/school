<!-- 报警求助点位编辑面板 -->
<template>
  <div class="panel">
    <div class="panel_top">
      <span class="top_title">报警求助</span>
      <div class="btn_group">
        <span title="预览" @click="preViewVideo()" class="top_button iconfont icon-videotape"></span>
        <span title="删除" @click="deleteAlarmHelpPoint()" class="top_button iconfont icon-delete"></span>
      </div>
    </div>
    <div class="panel_content">
      <ul v-show="is3DMapOuter">
        <li @click="changTab('resource')" :class="{'active':selectedTab==='resource'}">资源</li>
        <li @click="changTab( 'model')" :class="{'active':selectedTab==='model'}">模型</li>
      </ul>
      <div v-show="is3DMapOuter && selectedTab==='model'" class="subPanel">
        <Carousel v-if="selectedTab==='model' && modelList.length > 0" v-model="selectedModelIndex" :height="210" :dots="null" arrow="always" loop @on-change="changeModelURI">
          <CarouselItem v-for="(item, index) in modelList" :key="index">
              <div class="carouselItem"><img :src="item.picture.path"></div>
          </CarouselItem>
        </Carousel>
        <div class="modelEdit">
          <p>模型编辑<Button size="small" style="float: right;" title="点击标注点位位置" @click="active3DDraw()">位置</Button></p>
          <Row type="flex" justify="center" align="middle">
            <Col span="6">大小</Col>
            <Col span="18"><Slider v-model="pointInfo.scale" :step="0.01" :min="0" :max="10" show-input @on-change="changeModelSacle" @on-input="changeModelSacle"></Slider></Col>
          </Row>
          <Row type="flex" justify="center" align="middle">
            <Col span="6">高度</Col>
            <Col span="18"><Slider v-model="pointInfo.height" :step="0.1" :min="0" :max="50" show-input @on-change="changeModelHeight" @on-input="changeModelHeight"></Slider></Col>
          </Row>
          <Row type="flex" justify="center" align="middle">
            <Col span="6">X偏移</Col>
            <Col span="18"><Slider v-model="xDelta" :step="0.1" :min="-15" :max="15" show-input @on-change="changeModelMoveXDelta"></Slider></Col>
          </Row>
          <Row type="flex" justify="center" align="middle">
            <Col span="6">Y偏移</Col>
            <Col span="18"><Slider v-model="yDelta" :step="0.1" :min="-15" :max="15" show-input @on-change="changeModelMoveYDelta"></Slider></Col>
          </Row>
          <Row type="flex" justify="center" align="middle">
            <Col span="6">朝向角</Col>
            <Col span="18"><Slider v-model="pointInfo.heading" :step="1" :min="0" :max="360" show-input @on-change="changeModelHeadingPitchRoll" @on-input="changeModelHeadingPitchRoll"></Slider></Col>
          </Row>
          <Row type="flex" justify="center" align="middle">
            <Col span="6">俯仰角</Col>
            <Col span="18"><Slider v-model="pointInfo.pitch" :step="1" :min="0" :max="360" show-input @on-change="changeModelHeadingPitchRoll" @on-input="changeModelHeadingPitchRoll"></Slider></Col>
          </Row>
          <Row type="flex" justify="center" align="middle">
            <Col span="6">滚动角</Col>
            <Col span="18"><Slider v-model="pointInfo.roll" :step="1" :min="0" :max="360" show-input @on-change="changeModelHeadingPitchRoll" @on-input="changeModelHeadingPitchRoll"></Slider></Col>
          </Row>
        </div>
      </div>
      <div v-show="!is3DMapOuter || selectedTab==='resource'" class="subPanel">
        <div class="resourceForm">
          <p>基本信息</p>
          <Form ref="alarmHelpData" :rules="validateRule" :model="alarmHelpData" :label-width="75" label-position="left">
            <FormItem label="终端名称" prop="name">
              <Input v-model="alarmHelpData.name" :title="alarmHelpData.name" :maxlength="64" placeholder="" style="width:175px;"/>
            </FormItem>
            <FormItem label="编号" prop="chan">
              <Input v-model="alarmHelpData.chan" :title="alarmHelpData.chan" :maxlength="64" placeholder="" style="width:175px;"/>
            </FormItem>
            <FormItem label="经纬度" prop="loc">
              <Input v-model="locFormat" :title="locFormat" placeholder="" style="width:175px;" readonly disabled/>
            </FormItem>
             <!-- 联系人 -->
            <contentWay :principal.sync="pointInfo.principal"></contentWay>
          </Form>
        </div>
        <Carousel v-if="!is3DMapOuter && iconList.length > 0" v-model="selectedIconIndex" :height="210" :dots="null" arrow="always" loop @on-change="changeIconURI">
          <CarouselItem v-for="(item, index) in iconList" :key="index">
              <div class="carouselItem"><img :src="item.imgUrl"></div>
          </CarouselItem>
        </Carousel>
      </div>
    </div>
    <div class="panel_foot">
      <Button @click="cancelSave('alarmHelpData')" title="点击取消保存点位信息">取消</Button>
      <Button type="primary" @click="saveAlarmHelpPoint('alarmHelpData')" title="点击保存点位信息">保存</Button>
    </div>
  </div>
</template>
<script>
import alarmHelpEditBase from './alarmHelpEditBase'
import pointEdit from '../pointEdit'
import contentWay from 'components/map/contentWay'

export default {
  name: 'alarmHelpEditBase',
  mixins: [ pointEdit, alarmHelpEditBase ],
  components: { contentWay }
}
</script>
