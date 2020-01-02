<!-- 报警点位编辑面板 -->
<template>
  <div class="panel">
    <div class="panel_top">
      <span class="top_title">报警点位</span>
      <div class="btn_group">
        <span title="删除" @click="deleteAlarmPoint()" class="top_button iconfont icon-delete"></span>
      </div>
    </div>
    <div class="panel_content">
      <ul v-show="is3DMapOuter">
        <li @click="changTab('resource')" :class="{'active':selectedTab==='resource'}">资源</li>
        <li @click="changTab( 'model')" :class="{'active':selectedTab==='model'}">模型</li>
      </ul>
      <ul v-show="!is3DMapOuter" style="display: block;padding: 0px 10px;">
        <li @click="changMapTab('basic')" :class="{'active':selectedMapTab==='basic'}">基本信息</li>
        <li v-if="menuTag" @click="changMapTab('style')" :class="{'active':selectedMapTab==='style'}">样式控制</li>
        <li v-if="!menuTag"></li>
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
          <Form ref="alarmData" :rules="validateRule" :model="alarmData" :label-width="75" label-position="left" v-if="(!is3DMapOuter && selectedMapTab==='basic') || (is3DMapOuter && selectedTab==='resource')">
            <FormItem label="报警名称" prop="name">
              <Input v-model="alarmData.name" :maxlength="64" :title="alarmData.name"  placeholder="请输入名称" style="width:175px;"/>
            </FormItem>
            <FormItem label="编号" prop="chan">
              <Input v-model="alarmData.chan" :maxlength="64" :title="alarmData.chan" placeholder="请输入编号" style="width:175px;"/>
            </FormItem>
            <FormItem label="级别" prop="level">
              <Input v-model="alarmData.level"  placeholder="无" :title="alarmData.level" style="width:175px;" readonly disabled/>
            </FormItem>
            <Form-item label="地图标识" v-if="!is3DMapOuter && selectedMapTab==='basic'">
              <Select v-model="mapsignType" style="width:100%" @on-change="getMapsign">
                <Option v-for="item in mapsignList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Form-item>
            <FormItem label="布撤防时间" prop="alarmTemplate">
              <Input v-model="alarmData.alarmTemplate" placeholder="无" :title="alarmData.alarmTime" style="width:175px;" readonly disabled/>
            </FormItem>
            <FormItem label="经纬度" prop="loc">
              <Input v-model="locFormat" :title="locFormat" placeholder="" style="width:175px;" readonly disabled/>
            </FormItem>
            <!-- 联系人 -->
            <contentWay :principal.sync="pointInfo.principal"></contentWay>
          </Form>
        </div>
        <div v-if="!is3DMapOuter && menuTag && selectedMapTab==='style'" style="display: flex; flex: 1; flex-direction: column;padding: 0px 20px;height: 100%;">
          <styleCtrol :styleDefault.sync="alarmData.style" :isLineCantShow="isLineCantShow" :isAreaCantShow="isAreaCantShow"></styleCtrol>
        </div>
        <Carousel v-if="!is3DMapOuter && iconList.length > 0 && selectedMapTab==='basic' && !menuTag" v-model="selectedIconIndex" :height="210" :dots="null" arrow="always" loop @on-change="changeIconURI">
          <CarouselItem v-for="(item, index) in iconList" :key="index">
              <div class="carouselItem"><img :src="item.imgUrl"></div>
          </CarouselItem>
        </Carousel>
      </div>
    </div>
    <div class="panel_foot">
      <Button @click="cancelSave('alarmData')" title="点击取消保存点位信息">取消</Button>
      <Button type="primary" @click="saveAlarmPoint('alarmData')" title="点击保存点位信息">保存</Button>
    </div>
  </div>
</template>
<script>
import alarmEditBase from './alarmEditBase'
import pointEdit from '../pointEdit'
import contentWay from 'components/map/contentWay'
import styleCtrol from '../map3DGrid/Map3DStyleControl'

export default {
  name: 'alarmEditPanel',
  mixins: [ pointEdit, alarmEditBase ],
  components: { contentWay, styleCtrol }
}
</script>
