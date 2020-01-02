<!-- 巡更点位编辑面板 -->
<template>
  <div class="panel">
    <div class="panel_top">
      <span class="top_title">巡更点位</span>
      <div class="btn_group">
        <span title="删除" @click="deletePatrolPoint()" class="top_button iconfont icon-delete"></span>
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
            <Col span="18"><Slider v-model="pointInfo.scale" :title="pointInfo.scale" :step="0.01" :min="0" :max="10" show-input @on-change="changeModelSacle" @on-input="changeModelSacle"></Slider></Col>
          </Row>
          <Row type="flex" justify="center" align="middle">
            <Col span="6">高度</Col>
            <Col span="18"><Slider v-model="pointInfo.height" :title="pointInfo.height" :step="0.1" :min="0" :max="50" show-input @on-change="changeModelHeight" @on-input="changeModelHeight"></Slider></Col>
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
            <Col span="18"><Slider v-model="pointInfo.heading" :title="pointInfo.heading" :step="1" :min="0" :max="360" show-input @on-change="changeModelHeadingPitchRoll" @on-input="changeModelHeadingPitchRoll"></Slider></Col>
          </Row>
          <Row type="flex" justify="center" align="middle">
            <Col span="6">俯仰角</Col>
            <Col span="18"><Slider v-model="pointInfo.pitch" :title="pointInfo.pitch" :step="1" :min="0" :max="360" show-input @on-change="changeModelHeadingPitchRoll" @on-input="changeModelHeadingPitchRoll"></Slider></Col>
          </Row>
          <Row type="flex" justify="center" align="middle">
            <Col span="6">滚动角</Col>
            <Col span="18"><Slider v-model="pointInfo.roll" :title="pointInfo.roll" :step="1" :min="0" :max="360" show-input @on-change="changeModelHeadingPitchRoll" @on-input="changeModelHeadingPitchRoll"></Slider></Col>
          </Row>
        </div>
      </div>
      <div v-show="!is3DMapOuter || selectedTab==='resource'" class="subPanel">
        <div class="resourceForm">
          <p>基本信息</p>
          <Form ref="patrolData" :rules="validateRule" :model="patrolData" :label-width="75" label-position="left">
            <FormItem label="点位名称" prop="devName">
              <Input v-model="patrolData.devName" :title="patrolData.devName" :maxlength="16" placeholder="" style="width:175px;"/>
            </FormItem>
            <FormItem label="设备ID" prop="devId">
              <Input v-model="patrolData.devId" :title="patrolData.devId" placeholder="" style="width:175px;" readonly disabled/>
            </FormItem>
            <FormItem label="设备编码" prop="devCode">
              <Input v-model="patrolData.devCode" :title="patrolData.devCode" placeholder="" style="width:175px;" readonly disabled/>
            </FormItem>
            <FormItem label="经纬度" prop="geo">
              <Input v-model="geoFormat" :title="geoFormat" placeholder="" style="width:175px;" readonly disabled/>
            </FormItem>
            <FormItem label="负责人" prop="charger">
              <Input v-model="patrolData.charger" :title="patrolData.charger" :maxlength="16" placeholder="请输入负责人" style="width:175px;"/>
            </FormItem>
            <FormItem label="电话" prop="phone">
              <Input v-model="patrolData.phone" :title="patrolData.phone" :maxlength="18" placeholder="请输入联系电话" style="width:175px;"/>
            </FormItem>
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
      <Button @click="cancelSave('patrolData')" title="点击取消保存点位信息">取消</Button>
      <Button type="primary" @click="savePatrolPoint('patrolData')" title="点击保存点位信息">保存</Button>
    </div>
  </div>
</template>
<script>
import patrolEditBase from './patrolEditBase'
import pointEdit from '../pointEdit'

export default {
  name: 'patrolEditPanel',
  mixins: [ pointEdit, patrolEditBase ]
}
</script>
