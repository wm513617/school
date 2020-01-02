<template>
  <div class="intergratedQuery">
    <div ref="mainContent" class="main-content">
      <div class="toolbar">
        <div class="left-bar" style="width: 100%;">
          <p>
            <span class="label">检索分类</span>
            <Select  v-model="searchType" class="select-data-style"  @on-change="chooseType">
              <Option v-for="item in searchTypeDatas"
                      :value="item.Code"
                      :key="item.Code">
                {{ item.Name }}
              </Option>
            </Select>
          </p>
          <p>
           <span  class="label">开始日期</span>
           <BSdateRange :datetime="startTime" @timeChange="startChange" :width='320' :height='32' style="margin-left:2px; display: inline-block"></BSdateRange>
         </p>
          <p style="margin-left: 15px">
            <span  class="label">结束日期</span>
            <BSdateRange :datetime="endTime" @timeChange="endChange" :width='320' :height='32' style="margin-left:2px;display: inline-block"></BSdateRange>
          </p>
          <div style="float: left;margin-bottom: 15px;margin-left: 14px">
            <span class="label">选择通道</span>
            <div style=" display: inline-block;">
              <div class="search">
                <input v-model="orgTreeSearch" @focus="isExpand = true; orgTreeSearch = ''" @blur="isSelect? '': isExpand = false" :icon="isExpand ? 'arrow-up-b' : 'arrow-down-b'" type="text" class="input" placeholder="请输入..." ></input>
                <button class="btn" @click.stop="isExpand = !isExpand; if (isExpand) { orgTreeSearch = '' }">
                  <Icon :type="isExpand?'arrow-up-b':'arrow-down-b'"></Icon>
                </button>
              </div>
              <div :class="['search-tree-info', isExpand? '':'hidden']" @mouseenter.stop="isSelect = true" @mouseleave.stop="isSelect = false" >
                <VTree ref="channelTrees"
                       :searchVal="orgTreeSearch"
                       :treeData="devList"
                       :options="{showInput: true}"></VTree>
              </div>
            </div>
          </div>
          <p style="margin-right: 0;margin-left: 16px">
            <Button @click="queryDataBtn" :loading="searching" style="margin-right: 20px">
              <i v-if="!searching" class="iconfont icon-jiansuozhong" style="font-size:14px;"></i>
              &nbsp;检索
            </Button>
            <Button  @click="exportQuery" :disabled="!queryResList.length" style="margin-right: 20px">
              <i class="ivu-icon iconfont icon-export"></i>&nbsp;导出
            </Button>
            <Button  @click="clearSelects" style="margin-right: 20px">
              <i class="ivu-icon iconfont icon-refresh"></i>&nbsp;清空条件
            </Button>
            <Button  @click="openMore" :class="{isactiveMore:isMore?true:false}" style="margin-right: 0">
              <i class="ivu-icon iconfont icon-details"></i>&nbsp;高级
            </Button>
          </p>

        </div>
      </div>
      <div  class="serach-condition" >
        <div class="left-bar" v-if="selectType==='person'" key="person">
          <p style="margin-left: 27px">
            <span class="label">性别</span>
            <Select  v-model="sex"  placeholder='全部' class="select-data-style" >
              <Option v-for="item in sexListDatas"
                      :value="item.Code"
                      :key="item.Code">
                {{ item.Name }}
              </Option>
            </Select>
          </p>
          <p style="margin-left: 39px">
            <span class="label">年龄</span>
            <Select  v-model="age" placeholder='全部'  :max-tag-count="1"  :multiple='true'   class="select-data-style" >
              <Option v-for="item in ageListDatas"
                      :value="item.Code"
                      :key="item.Code">
                {{ item.Name }}
              </Option>
            </Select>
          </p>
          <p style="margin-left: 29px;">
            <span class="label">口罩</span>
            <Select  v-model="mask" class="select-data-style" >
              <Option v-for="item in maskListDatas"
                      :value="item.Code"
                      :key="item.Code">
                {{ item.Name }}
              </Option>
            </Select>
          </p>
          <p style="margin-left: 36px;">
            <span class="label" style="padding-right: 18px">朝向</span>
            <Select  v-model="direction" placeholder='全部' :max-tag-count="1" :multiple='true'   class="select-data-style" >
              <Option v-for="item in directionListDatas"
                      :value="item.Code"
                      :key="item.Code">
                {{ item.Name }}
              </Option>
            </Select>
          </p>
          <p  style="margin-left: 27px;">
            <span class="label">打伞</span>
            <Select  v-model="umbrella" placeholder='全部'  class="select-data-style" >
              <Option v-for="item in umbrellaListDatas"
                      :value="item.Code"
                      :key="item.Code">
                {{ item.Name }}
              </Option>
            </Select>
          </p>
          <p style="margin-left: 43px">
            <span class="label">发型</span>
            <Select  v-model="hair" placeholder='全部' :max-tag-count="1" :multiple='true'   class="select-data-style" >
              <Option v-for="item in hairListDatas"
                      :value="item.Code"
                      :key="item.Code">
                {{ item.Name }}
              </Option>
            </Select>
          </p>
          <p style="margin-left: 29px">
            <span class="label">帽子</span>
            <Select  v-model="hat" placeholder='全部'  class="select-data-style" >
              <Option v-for="item in hatListDatas"
                      :value="item.Code"
                      :key="item.Code">
                {{ item.Name }}
              </Option>
            </Select>
          </p>
          <p style="margin-left: 48px">
            <span class="label">背包</span>
            <Select  v-model="big" placeholder='全部'  class="select-data-style" >
              <Option v-for="item in bigListDatas"
                      :value="item.Code"
                      :key="item.Code">
                {{ item.Name }}
              </Option>
            </Select>

          </p>
          <p style="margin-left: 31px;margin-right: 0">
            <span class="label">拎物</span>
            <Select  v-model="takeGoods" placeholder='全部'  class="select-data-style" >
              <Option v-for="item in takeGoodsListDatas"
                      :value="item.Code"
                      :key="item.Code">
                {{ item.Name }}
              </Option>
            </Select>
          </p>
          <div v-if="isMore" key="person_more">
            <p style="margin-left: 27px">
              <span class="label">眼镜</span>
              <Select  v-model="glasses" placeholder= '全部'  class="select-data-style" >
                <Option v-for="item in glassesListDatas"
                        :value="item.Code"
                        :key="item.Code">
                  {{ item.Name }}
                </Option>
              </Select>
            </p>
            <p style="margin-left: 26px;">
              <span class="label">拉杆箱</span>
              <Select  v-model="drawBox" placeholder= '全部'  class="select-data-style" >
                <Option v-for="item in drawBoxListDatas"
                        :value="item.Code"
                        :key="item.Code">
                  {{ item.Name }}
                </Option>
              </Select>
            </p>
            <p style="margin-left: 14px;">
              <span class="label">手推车</span>
              <Select  v-model="drawCar" placeholder= '全部'   class="select-data-style" >
                <Option v-for="item in drawCarListDatas"
                        :value="item.Code"
                        :key="item.Code">
                  {{ item.Name }}
                </Option>
              </Select>
            </p>
            <p style="margin-left: 33px">
              <span class="label">抱小孩</span>
              <Select  v-model="hugKid" placeholder= '全部'  class="select-data-style" >
                <Option v-for="item in hugKidListDatas"
                        :value="item.Code"
                        :key="item.Code">
                  {{ item.Name }}
                </Option>
              </Select>
            </p>
            <p style="margin-left: 0;">
              <span class="label">上装纹理</span>
              <Select  v-model="makeUpStyle1" placeholder= '全部' :max-tag-count="1" :multiple ='true'   class="select-data-style" >
                <Option v-for="item in makeUpStyle1ListDatas"
                        :value="item.Code"
                        :key="item.Code">
                  {{ item.Name }}
                </Option>
              </Select>
            </p>
            <p style="margin-left: 14px">
              <span class="label">上装款式</span>
              <Select  v-model="makeUpStyle2" placeholder= '全部' :max-tag-count="1" :multiple ='true'   class="select-data-style" >
                <Option v-for="item in makeUpStyle2ListDatas"
                        :value="item.Code"
                        :key="item.Code">
                  {{ item.Name }}
                </Option>
              </Select>
            </p>
            <p style="margin-left: 1px;">
              <span class="label">上装颜色</span>
              <Select  v-model="makeUpStyle3" placeholder= '全部' :max-tag-count="1" :multiple ='true'   class="select-data-style" >
                <Option v-for="item in makeUpStyle3ListDatas"
                        :value="item.Code"
                        :key="item.Code">
                  {{ item.Name }}
                </Option>
              </Select>
            </p>
            <p style="margin-left: 20px">
              <span class="label">下装款式</span>
              <Select  v-model="makeDownStyle1" placeholder= '全部' :max-tag-count="1" :multiple ='true'  class="select-data-style" >
                <Option v-for="item in makeDownStyle1ListDatas"
                        :value="item.Code"
                        :key="item.Code">
                  {{ item.Name }}
                </Option>
              </Select>
            </p>
            <p style="margin-left: 3px;margin-right: 0">
              <span class="label">下装颜色</span>
              <Select  v-model="makeDownStyle2" placeholder= '全部' :max-tag-count="1" :multiple ='true'  class="select-data-style" >
                <Option v-for="item in makeDownStyle2ListDatas"
                        :value="item.Code"
                        :key="item.Code">
                  {{ item.Name }}
                </Option>
              </Select>
            </p>
          </div>
          <div style="clear: both"></div>
        </div>
        <div class="left-bar" v-else-if="selectType==='car'" key="car">
          <div v-if="searchType==='4'" key="car1">  <!--轿车-->
            <p style="margin-left: 15px;">
              <span class="label">车牌号</span>
              <Poptip trigger="focus"  content="*替多位,?代替一位（京*12、京A1?3?5）">
                <Input v-model="carNumber" :class="{carNumberClass:carNumberValid}"  placeholder="请输入车牌号" style="width: 120px" />
              </Poptip><br/>
              <span v-if="carNumberValid" style="color: red; position: relative;left: 65px;line-height: 19px;" >输入格式错误</span>
            </p>
            <p style="margin-left: 9px;">
              <span class="label">车辆颜色</span>
              <Select  v-model="carColor" placeholder= '全部' :max-tag-count="1"  :multiple ='true'  class="select-data-style" >
                <Option v-for="item in carColorListDatas"
                        :value="item.Code"
                        :key="item.Code">
                  {{ item.Name }}
                </Option>
              </Select>
            </p>
            <p style="margin-left: 1px;">
              <span class="label">车辆类型</span>
              <Select  v-model="carType" placeholder= '全部' class="select-data-style"  :max-tag-count="1"  :multiple='true' >
                <Option v-for="item in carTypeListDatas"
                        :value="item.CarKindCode"
                        :key="item.CarKindCode">
                  {{ item.CarKindName }}
                </Option>
              </Select>
            </p>
            <p style="margin-left: 18px;">
              <span class="label">车辆品牌</span>
              <!--:filterable="true"   @on-query-change="searchLogos" -->
              <Select  ref="carLogoSelect" v-model="carLogo"  :filterable="true"  :max-tag-count="3"  @on-query-change="searchLogos"  placeholder= '请搜索'  :multiple ='true' :label-in-value="true"   class="  car-select-data-style" style="width:320px"  @on-change = 'selectCarLogo'>
                <OptionGroup  v-for="(item) in carLogoOptions" :label="item.letter" :key="item.letter">
                  <Option v-for="(item1,index1) in item.data"
                          :value="item1.CarFamily + '-' + item1.queryText"
                          :key="index1" :label="item1.CarFamilyName">
                  </Option>
                </OptionGroup>
              </Select>
            </p>
            <p style="margin-left: 13px;">
              <span class="label">车辆型号</span>
              <Select  ref="carBrandSelect"   style="width:320px" v-model="carModel" :filterable="true"  :max-tag-count="3"  @on-query-change="searchBrands" :disabled="selectCarLogoList.length < 1"  placeholder= '全部'  :multiple ='true'  :label-in-value="true" class="car-select-data-style"  @on-change = 'selectCarBrand' >
                <OptionGroup  v-for="(item,index) in carBrandOptions" :label="item.label" :key="index">
                  <Option v-for="(item1,index1) in item.CarBrandList"
                          :value="item1.CarFamily+','+item1.CarBrand + '-' + item1.queryText"
                          :key="index1" :label="item1.CarBrandName">
                  </Option>
                </OptionGroup>
              </Select>
            </p>
            <p style="margin-left: 19px;margin-right: 0">
              <span class="label">车辆年款</span>
              <Select ref="carPatternSelect" v-model="carBirthday" style="width:323px" :filterable="true" :max-tag-count="3"  @on-query-change="searchPatterns" :disabled="selectCarBrandList.length < 1" placeholder= '全部'  :multiple ='true'  :label-in-value="true"  class="car-select-data-style"  @on-change = 'selectCarPattern'>
                <OptionGroup  v-for="(item,index) in carPatternOptions" :label="item.label" :key="index">
                  <Option v-for="(item1,index1) in item.CarPatternList"
                          :value="item1.CarFamily+','+item1.CarBrand+','+item1.CarPattern + '-' + item1.queryText"
                          :key="index1" :label="item1.CarStyleName">
                  </Option>
                </OptionGroup>
              </Select>
            </p>
            <div v-if="isMore" key="car1_more">
              <p style="margin-left: 2px;">
                <span class="label">号牌类型</span>
                <Select  v-model="carNumberType" placeholder= '全部' :max-tag-count="1" :multiple ='true'  class="select-data-style" >
                  <Option v-for="item in carNumberTypeListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 8px;">
                <span class="label">号牌颜色</span>
                <Select  v-model="carNumberColor" placeholder= '全部'  :max-tag-count="1" :multiple ='true'  class="select-data-style" >
                  <Option v-for="item in carNumberColorListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left:2px;">
                <span class="label">副驾乘客</span>
                <Select  v-model="vicePassenger" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in vicePassengerListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 32px;">
                <span class="label">打电话</span>
                <Select  v-model="callUp" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in callUpListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 13px;">
                <span class="label">行李架</span>
                <Select  v-model="roofRack" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in roofRackListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 44px;">
                <span class="label">备胎</span>
                <Select  v-model="spare" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in spareListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: -1px;">
                <span class="label">主安全带</span>
                <Select  v-model="safetyBelt" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in safetyBeltListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 48px;">
                <span class="label">天窗</span>
                <Select  v-model="windowUp" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in windowUpListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 2px;margin-right: 0">
                <span class="label">副安全带</span>
                <Select  v-model="viceSafetyBelt" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in viceSafetyBeltListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 16px;">
                <span class="label">年检标</span>
                <Select  v-model="ASFlag" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in ASFlagListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 23px;">
                <span class="label">纸巾盒</span>
                <Select  v-model="paperBox" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in paperBoxListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 15px;">
                <span class="label">遮阳板</span>
                <Select  v-model="sunShield" placeholder= '全部'    class="select-data-style" >
                  <Option v-for="item in sunShieldListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 47px;">
                <span class="label">吊坠</span>
                <Select  v-model="pendant"  placeholder= '全部'   class="select-data-style" >
                  <Option v-for="item in pendantListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 27px;">
                <span class="label">撞损</span>
                <Select  v-model="damage" placeholder= '全部'    class="select-data-style" >
                  <Option v-for="item in damageListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 31px;">
                <span class="label">渣土车</span>
                <Select  v-model="slagCar"  placeholder= '全部'   class="select-data-style" >
                  <Option v-for="item in slagCarListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 12px;">
                <span class="label">危化品</span>
                <Select  v-model="dangerous"  placeholder= '全部'   class="select-data-style" >
                  <Option v-for="item in dangerousListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
            </div>
            <div style="clear: both"></div>
          </div>
          <div v-else-if="searchType==='6'" key="car2"><!--大客车-->
            <p style="margin-left: 15px;">
              <span class="label">车牌号</span>
              <Poptip trigger="focus"  content="*替多位,?代替一位（京*12、京A1?3?5）">
                <Input v-model="carNumber" :class="{carNumberClass:carNumberValid}"  placeholder="请输入车牌号" style="width: 120px" />
              </Poptip><br/>
              <span v-if="carNumberValid" style="color: red; position: relative;left: 65px;line-height: 19px;" >输入格式错误</span>
            </p>
            <p style="margin-left: 9px;">
              <span class="label">车辆颜色</span>
              <Select  v-model="carColor" placeholder= '全部' :max-tag-count="1"  :multiple ='true'  class="select-data-style" >
                <Option v-for="item in carColorListDatas"
                        :value="item.Code"
                        :key="item.Code">
                  {{ item.Name }}
                </Option>
              </Select>
            </p>
            <p style="margin-left: 1px;">
              <span class="label">车辆类型</span>
              <Select  v-model="carType" placeholder= '全部' class="select-data-style"  :max-tag-count="1"  :multiple='true' >
                <Option v-for="item in carTypeListDatas"
                        :value="item.CarKindCode"
                        :key="item.CarKindCode">
                  {{ item.CarKindName }}
                </Option>
              </Select>
            </p>
            <p style="margin-left: 18px;">
              <span class="label">车辆品牌</span>
              <!--:filterable="true"   @on-query-change="searchLogos" -->
              <Select  ref="carLogoSelect" v-model="carLogo"  :filterable="true"  :max-tag-count="3"  @on-query-change="searchLogos"  placeholder= '请搜索'  :multiple ='true' :label-in-value="true"   class="  car-select-data-style" style="width:320px"  @on-change = 'selectCarLogo'>
                <OptionGroup  v-for="(item) in carLogoOptions" :label="item.letter" :key="item.letter">
                  <Option v-for="(item1,index1) in item.data"
                          :value="item1.CarFamily + '-' + item1.queryText"
                          :key="index1" :label="item1.CarFamilyName">
                  </Option>
                </OptionGroup>
              </Select>
            </p>
            <p style="margin-left: 13px;">
              <span class="label">车辆型号</span>
              <Select  ref="carBrandSelect"   style="width:320px" v-model="carModel" :filterable="true"  :max-tag-count="3"  @on-query-change="searchBrands" :disabled="selectCarLogoList.length < 1"  placeholder= '全部'  :multiple ='true'  :label-in-value="true" class="car-select-data-style"  @on-change = 'selectCarBrand' >
                <OptionGroup  v-for="(item,index) in carBrandOptions" :label="item.label" :key="index">
                  <Option v-for="(item1,index1) in item.CarBrandList"
                          :value="item1.CarFamily+','+item1.CarBrand + '-' + item1.queryText"
                          :key="index1" :label="item1.CarBrandName">
                  </Option>
                </OptionGroup>
              </Select>
            </p>
            <p style="margin-left: 19px;margin-right: 0">
              <span class="label">车辆年款</span>
              <Select ref="carPatternSelect" v-model="carBirthday" style="width:323px" :filterable="true" :max-tag-count="3"  @on-query-change="searchPatterns" :disabled="selectCarBrandList.length < 1" placeholder= '全部'  :multiple ='true'  :label-in-value="true"  class="car-select-data-style"  @on-change = 'selectCarPattern'>
                <OptionGroup  v-for="(item,index) in carPatternOptions" :label="item.label" :key="index">
                  <Option v-for="(item1,index1) in item.CarPatternList"
                          :value="item1.CarFamily+','+item1.CarBrand+','+item1.CarPattern + '-' + item1.queryText"
                          :key="index1" :label="item1.CarStyleName">
                  </Option>
                </OptionGroup>
              </Select>
            </p>
            <div v-if="isMore" key="car2_more">
              <p style="margin-left: 2px;">
                <span class="label">号牌类型</span>
                <Select  v-model="carNumberType" placeholder= '全部' :max-tag-count="1" :multiple ='true'  class="select-data-style" >
                  <Option v-for="item in carNumberTypeListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 8px;">
                <span class="label">号牌颜色</span>
                <Select  v-model="carNumberColor" placeholder= '全部'  :max-tag-count="1" :multiple ='true'  class="select-data-style" >
                  <Option v-for="item in carNumberColorListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left:2px;">
                <span class="label">副驾乘客</span>
                <Select  v-model="vicePassenger" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in vicePassengerListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 32px;">
                <span class="label">打电话</span>
                <Select  v-model="callUp" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in callUpListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 13px;">
                <span class="label">行李架</span>
                <Select  v-model="roofRack" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in roofRackListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 44px;">
                <span class="label">备胎</span>
                <Select  v-model="spare" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in spareListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: -1px;">
                <span class="label">主安全带</span>
                <Select  v-model="safetyBelt" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in safetyBeltListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 48px;">
                <span class="label">天窗</span>
                <Select  v-model="windowUp" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in windowUpListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 2px;margin-right: 0">
                <span class="label">副安全带</span>
                <Select  v-model="viceSafetyBelt" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in viceSafetyBeltListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 16px;">
                <span class="label">年检标</span>
                <Select  v-model="ASFlag" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in ASFlagListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 23px;">
                <span class="label">纸巾盒</span>
                <Select  v-model="paperBox" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in paperBoxListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 15px;">
                <span class="label">遮阳板</span>
                <Select  v-model="sunShield" placeholder= '全部'    class="select-data-style" >
                  <Option v-for="item in sunShieldListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 47px;">
                <span class="label">吊坠</span>
                <Select  v-model="pendant"  placeholder= '全部'   class="select-data-style" >
                  <Option v-for="item in pendantListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 27px;">
                <span class="label">撞损</span>
                <Select  v-model="damage" placeholder= '全部'    class="select-data-style" >
                  <Option v-for="item in damageListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 31px;">
                <span class="label">渣土车</span>
                <Select  v-model="slagCar"  placeholder= '全部'   class="select-data-style" >
                  <Option v-for="item in slagCarListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 12px;">
                <span class="label">危化品</span>
                <Select  v-model="dangerous"  placeholder= '全部'   class="select-data-style" >
                  <Option v-for="item in dangerousListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
            </div>
            <div style="clear: both"></div>
          </div>
          <div  v-else-if="searchType==='7'" key="car3"><!--面包车-->
            <p style="margin-left: 15px;">
              <span class="label">车牌号</span>
              <Poptip trigger="focus"  content="*替多位,?代替一位（京*12、京A1?3?5）">
                <Input v-model="carNumber" :class="{carNumberClass:carNumberValid}"  placeholder="请输入车牌号" style="width: 120px" />
              </Poptip><br/>
              <span v-if="carNumberValid" style="color: red; position: relative;left: 65px;line-height: 19px;" >输入格式错误</span>
            </p>
            <p style="margin-left: 9px;">
              <span class="label">车辆颜色</span>
              <Select  v-model="carColor" placeholder= '全部' :max-tag-count="1"  :multiple ='true'  class="select-data-style" >
                <Option v-for="item in carColorListDatas"
                        :value="item.Code"
                        :key="item.Code">
                  {{ item.Name }}
                </Option>
              </Select>
            </p>
            <p style="margin-left: 1px;">
              <span class="label">车辆类型</span>
              <Select  v-model="carType" placeholder= '全部' class="select-data-style"  :max-tag-count="1"  :multiple='true' >
                <Option v-for="item in carTypeListDatas"
                        :value="item.CarKindCode"
                        :key="item.CarKindCode">
                  {{ item.CarKindName }}
                </Option>
              </Select>
            </p>
            <p style="margin-left: 18px;">
              <span class="label">车辆品牌</span>
              <!--:filterable="true"   @on-query-change="searchLogos" -->
              <Select  ref="carLogoSelect" v-model="carLogo"  :filterable="true"  :max-tag-count="3"  @on-query-change="searchLogos"  placeholder= '请搜索'  :multiple ='true' :label-in-value="true"   class="  car-select-data-style" style="width:320px"  @on-change = 'selectCarLogo'>
                <OptionGroup  v-for="(item) in carLogoOptions" :label="item.letter" :key="item.letter">
                  <Option v-for="(item1,index1) in item.data"
                          :value="item1.CarFamily + '-' + item1.queryText"
                          :key="index1" :label="item1.CarFamilyName">
                  </Option>
                </OptionGroup>
              </Select>
            </p>
            <p style="margin-left: 13px;">
              <span class="label">车辆型号</span>
              <Select  ref="carBrandSelect"   style="width:320px" v-model="carModel" :filterable="true"  :max-tag-count="3"  @on-query-change="searchBrands" :disabled="selectCarLogoList.length < 1"  placeholder= '全部'  :multiple ='true'  :label-in-value="true" class="car-select-data-style"  @on-change = 'selectCarBrand' >
                <OptionGroup  v-for="(item,index) in carBrandOptions" :label="item.label" :key="index">
                  <Option v-for="(item1,index1) in item.CarBrandList"
                          :value="item1.CarFamily+','+item1.CarBrand + '-' + item1.queryText"
                          :key="index1" :label="item1.CarBrandName">
                  </Option>
                </OptionGroup>
              </Select>
            </p>
            <p style="margin-left: 19px;margin-right: 0">
              <span class="label">车辆年款</span>
              <Select ref="carPatternSelect" v-model="carBirthday" style="width:323px" :filterable="true" :max-tag-count="3"  @on-query-change="searchPatterns" :disabled="selectCarBrandList.length < 1" placeholder= '全部'  :multiple ='true'  :label-in-value="true"  class="car-select-data-style"  @on-change = 'selectCarPattern'>
                <OptionGroup  v-for="(item,index) in carPatternOptions" :label="item.label" :key="index">
                  <Option v-for="(item1,index1) in item.CarPatternList"
                          :value="item1.CarFamily+','+item1.CarBrand+','+item1.CarPattern + '-' + item1.queryText"
                          :key="index1" :label="item1.CarStyleName">
                  </Option>
                </OptionGroup>
              </Select>
            </p>
            <div v-if="isMore" key="car3_more">
              <p style="margin-left: 2px;">
                <span class="label">号牌类型</span>
                <Select  v-model="carNumberType" placeholder= '全部' :max-tag-count="1" :multiple ='true'  class="select-data-style" >
                  <Option v-for="item in carNumberTypeListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 8px;">
                <span class="label">号牌颜色</span>
                <Select  v-model="carNumberColor" placeholder= '全部'  :max-tag-count="1" :multiple ='true'  class="select-data-style" >
                  <Option v-for="item in carNumberColorListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left:2px;">
                <span class="label">副驾乘客</span>
                <Select  v-model="vicePassenger" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in vicePassengerListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 32px;">
                <span class="label">打电话</span>
                <Select  v-model="callUp" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in callUpListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 13px;">
                <span class="label">行李架</span>
                <Select  v-model="roofRack" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in roofRackListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 44px;">
                <span class="label">备胎</span>
                <Select  v-model="spare" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in spareListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: -1px;">
                <span class="label">主安全带</span>
                <Select  v-model="safetyBelt" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in safetyBeltListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 48px;">
                <span class="label">天窗</span>
                <Select  v-model="windowUp" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in windowUpListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 2px;margin-right: 0">
                <span class="label">副安全带</span>
                <Select  v-model="viceSafetyBelt" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in viceSafetyBeltListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 16px;">
                <span class="label">年检标</span>
                <Select  v-model="ASFlag" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in ASFlagListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 23px;">
                <span class="label">纸巾盒</span>
                <Select  v-model="paperBox" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in paperBoxListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 15px;">
                <span class="label">遮阳板</span>
                <Select  v-model="sunShield" placeholder= '全部'    class="select-data-style" >
                  <Option v-for="item in sunShieldListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 47px;">
                <span class="label">吊坠</span>
                <Select  v-model="pendant"  placeholder= '全部'   class="select-data-style" >
                  <Option v-for="item in pendantListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 27px;">
                <span class="label">撞损</span>
                <Select  v-model="damage" placeholder= '全部'    class="select-data-style" >
                  <Option v-for="item in damageListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 31px;">
                <span class="label">渣土车</span>
                <Select  v-model="slagCar"  placeholder= '全部'   class="select-data-style" >
                  <Option v-for="item in slagCarListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 12px;">
                <span class="label">危化品</span>
                <Select  v-model="dangerous"  placeholder= '全部'   class="select-data-style" >
                  <Option v-for="item in dangerousListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
            </div>
            <div style="clear: both"></div>
          </div>
          <div v-else key="car4"><!--卡车-->
            <p style="margin-left: 15px;">
              <span class="label">车牌号</span>
              <Poptip trigger="focus"  content="*替多位,?代替一位（京*12、京A1?3?5）">
                <Input v-model="carNumber" :class="{carNumberClass:carNumberValid}"  placeholder="请输入车牌号" style="width: 120px" />
              </Poptip><br/>
              <span v-if="carNumberValid" style="color: red; position: relative;left: 65px;line-height: 19px;" >输入格式错误</span>
            </p>
            <p style="margin-left: 9px;">
              <span class="label">车辆颜色</span>
              <Select  v-model="carColor" placeholder= '全部' :max-tag-count="1"  :multiple ='true'  class="select-data-style" >
                <Option v-for="item in carColorListDatas"
                        :value="item.Code"
                        :key="item.Code">
                  {{ item.Name }}
                </Option>
              </Select>
            </p>
            <p style="margin-left: 1px;">
              <span class="label">车辆类型</span>
              <Select  v-model="carType" placeholder= '全部' class="select-data-style"  :max-tag-count="1"  :multiple='true' >
                <Option v-for="item in carTypeListDatas"
                        :value="item.CarKindCode"
                        :key="item.CarKindCode">
                  {{ item.CarKindName }}
                </Option>
              </Select>
            </p>
            <p style="margin-left: 18px;">
              <span class="label">车辆品牌</span>
              <!--:filterable="true"   @on-query-change="searchLogos" -->
              <Select  ref="carLogoSelect" v-model="carLogo"  :filterable="true"  :max-tag-count="3"  @on-query-change="searchLogos"  placeholder= '请搜索'  :multiple ='true' :label-in-value="true"   class="  car-select-data-style" style="width:320px"  @on-change = 'selectCarLogo'>
                <OptionGroup  v-for="(item) in carLogoOptions" :label="item.letter" :key="item.letter">
                  <Option v-for="(item1,index1) in item.data"
                          :value="item1.CarFamily + '-' + item1.queryText"
                          :key="index1" :label="item1.CarFamilyName">
                  </Option>
                </OptionGroup>
              </Select>
            </p>
            <p style="margin-left: 13px;">
              <span class="label">车辆型号</span>
              <Select  ref="carBrandSelect"   style="width:320px" v-model="carModel" :filterable="true"  :max-tag-count="3"  @on-query-change="searchBrands" :disabled="selectCarLogoList.length < 1"  placeholder= '全部'  :multiple ='true'  :label-in-value="true" class="car-select-data-style"  @on-change = 'selectCarBrand' >
                <OptionGroup  v-for="(item,index) in carBrandOptions" :label="item.label" :key="index">
                  <Option v-for="(item1,index1) in item.CarBrandList"
                          :value="item1.CarFamily+','+item1.CarBrand + '-' + item1.queryText"
                          :key="index1" :label="item1.CarBrandName">
                  </Option>
                </OptionGroup>
              </Select>
            </p>
            <p style="margin-left: 19px;margin-right: 0">
              <span class="label">车辆年款</span>
              <Select ref="carPatternSelect" v-model="carBirthday" style="width:323px" :filterable="true" :max-tag-count="3"  @on-query-change="searchPatterns" :disabled="selectCarBrandList.length < 1" placeholder= '全部'  :multiple ='true'  :label-in-value="true"  class="car-select-data-style"  @on-change = 'selectCarPattern'>
                <OptionGroup  v-for="(item,index) in carPatternOptions" :label="item.label" :key="index">
                  <Option v-for="(item1,index1) in item.CarPatternList"
                          :value="item1.CarFamily+','+item1.CarBrand+','+item1.CarPattern + '-' + item1.queryText"
                          :key="index1" :label="item1.CarStyleName">
                  </Option>
                </OptionGroup>
              </Select>
            </p>
            <div v-if="isMore" key="car4_more">
              <p style="margin-left: 2px;">
                <span class="label">号牌类型</span>
                <Select  v-model="carNumberType" placeholder= '全部' :max-tag-count="1" :multiple ='true'  class="select-data-style" >
                  <Option v-for="item in carNumberTypeListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 8px;">
                <span class="label">号牌颜色</span>
                <Select  v-model="carNumberColor" placeholder= '全部'  :max-tag-count="1" :multiple ='true'  class="select-data-style" >
                  <Option v-for="item in carNumberColorListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left:2px;">
                <span class="label">副驾乘客</span>
                <Select  v-model="vicePassenger" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in vicePassengerListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 32px;">
                <span class="label">打电话</span>
                <Select  v-model="callUp" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in callUpListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 13px;">
                <span class="label">行李架</span>
                <Select  v-model="roofRack" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in roofRackListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 44px;">
                <span class="label">备胎</span>
                <Select  v-model="spare" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in spareListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: -1px;">
                <span class="label">主安全带</span>
                <Select  v-model="safetyBelt" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in safetyBeltListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 48px;">
                <span class="label">天窗</span>
                <Select  v-model="windowUp" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in windowUpListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 2px;margin-right: 0">
                <span class="label">副安全带</span>
                <Select  v-model="viceSafetyBelt" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in viceSafetyBeltListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 16px;">
                <span class="label">年检标</span>
                <Select  v-model="ASFlag" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in ASFlagListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 23px;">
                <span class="label">纸巾盒</span>
                <Select  v-model="paperBox" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in paperBoxListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 15px;">
                <span class="label">遮阳板</span>
                <Select  v-model="sunShield" placeholder= '全部'    class="select-data-style" >
                  <Option v-for="item in sunShieldListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 47px;">
                <span class="label">吊坠</span>
                <Select  v-model="pendant"  placeholder= '全部'   class="select-data-style" >
                  <Option v-for="item in pendantListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 27px;">
                <span class="label">撞损</span>
                <Select  v-model="damage" placeholder= '全部'    class="select-data-style" >
                  <Option v-for="item in damageListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 31px;">
                <span class="label">渣土车</span>
                <Select  v-model="slagCar"  placeholder= '全部'   class="select-data-style" >
                  <Option v-for="item in slagCarListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 12px;">
                <span class="label">危化品</span>
                <Select  v-model="dangerous"  placeholder= '全部'   class="select-data-style" >
                  <Option v-for="item in dangerousListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
            </div>
            <div style="clear: both"></div>
          </div>
        </div>
        <div class="left-bar" v-else-if="selectType==='towMoto'"  key="towMoto">
          <div v-if="searchType==='2'" key="towMoto1"> <!-- 自行车-->
            <p style="margin-left: 15px">
              <span class="label">骑车人</span>
              <Select  v-model="cycler" placeholder= '全部'  class="select-data-style" @on-change="selectCycler">
                <Option v-for="item in pedestrainListDatas"
                        :value="item.Code"
                        :key="item.Code">
                  {{ item.Name }}
                </Option>
              </Select>
            </p>
            <div v-if="isShowCyclers" key="towMoto1_showCyclers">
              <p style="margin-left: 37px">
                <span class="label">性别</span>
                <Select  v-model="cyclerSex" placeholder= '全部'  class="select-data-style"  >
                  <Option v-for="item in sexListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 29px">
                <span class="label">年龄</span>
                <Select  v-model="cyclerAge" placeholder= '全部' :max-tag-count="1"  :multiple ='true'  class="select-data-style" >
                  <Option v-for="item in ageListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 46px">
                <span class="label">口罩</span>
                <Select  v-model="cyclerMask" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in maskListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 28px">
                <span class="label">朝向</span>
                <Select  v-model="cyclerDirection" placeholder= '全部' :max-tag-count="1" :multiple ='true'  class="select-data-style"  >
                  <Option v-for="item in directionListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 42px">
                <span class="label">打伞</span>
                <Select  v-model="cyclerUmbrella" placeholder= '全部'  class="select-data-style"  >
                  <Option v-for="item in umbrellaListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 29px">
                <span class="label">发型</span>
                <Select  v-model="cyclerHair" placeholder= '全部' :max-tag-count="1" :multiple ='true'  class="select-data-style"  >
                  <Option v-for="item in hairListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 50px">
                <span class="label">帽子</span>
                <Select  v-model="cyclerHat" placeholder= '全部'  class="select-data-style"  >
                  <Option v-for="item in hatListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 28px;margin-right: 0">
                <span class="label">背包</span>
                <Select  v-model="cyclerBig" placeholder= '全部'  class="select-data-style"  >
                  <Option v-for="item in bigListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>

              </p>
              <div v-if="isMore" key="towMoto1_more">
                <p style="margin-left: 29px">
                  <span class="label">拎物</span>
                  <Select  v-model="cyclerTakeGoods" placeholder= '全部'  class="select-data-style"  >
                    <Option v-for="item in takeGoodsListDatas"
                            :value="item.Code"
                            :key="item.Code">
                      {{ item.Name }}
                    </Option>
                  </Select>
                </p>
                <p style="margin-left: 37px">
                  <span class="label">眼镜</span>
                  <Select  v-model="cyclerGlasses" placeholder= '全部'  class="select-data-style"  >
                    <Option v-for="item in glassesListDatas"
                            :value="item.Code"
                            :key="item.Code">
                      {{ item.Name }}
                    </Option>
                  </Select>
                </p>
                <p style="margin-left: 15px">
                  <span class="label">拉杆箱</span>
                  <Select  v-model="cyclerDrawBox" placeholder= '全部'  class="select-data-style"  >
                    <Option v-for="item in drawBoxListDatas"
                            :value="item.Code"
                            :key="item.Code">
                      {{ item.Name }}
                    </Option>
                  </Select>
                </p>
                <p style="margin-left: 33px">
                  <span class="label">手推车</span>
                  <Select  v-model="cyclerDrawCar" placeholder= '全部'  class="select-data-style"  >
                    <Option v-for="item in drawCarListDatas"
                            :value="item.Code"
                            :key="item.Code">
                      {{ item.Name }}
                    </Option>
                  </Select>
                </p>
                <p style="margin-left: 14px">
                  <span class="label">抱小孩</span>
                  <Select  v-model="cyclerHugKid" placeholder= '全部'  class="select-data-style"  >
                    <Option v-for="item in hugKidListDatas"
                            :value="item.Code"
                            :key="item.Code">
                      {{ item.Name }}
                    </Option>
                  </Select>
                </p>
                <p style="margin-left: 15px">
                  <span class="label">上装纹理</span>
                  <Select  v-model="cyclerMakeUpStyle1" placeholder= '全部' :max-tag-count="1"  :multiple ='true'   class="select-data-style"  >
                    <Option v-for="item in makeUpStyle1ListDatas"
                            :value="item.Code"
                            :key="item.Code">
                      {{ item.Name }}
                    </Option>
                  </Select>
                </p>
                <p style="margin-left: 0px;">
                  <span class="label">上装款式</span>
                  <Select  v-model="cyclerMakeUpStyle2" placeholder= '全部' :max-tag-count="1" :multiple ='true'  class="select-data-style"  >
                    <Option v-for="item in makeUpStyle2ListDatas"
                            :value="item.Code"
                            :key="item.Code">
                      {{ item.Name }}
                    </Option>
                  </Select>
                </p>
                <p style="margin-left: 21px">
                  <span class="label">上装颜色</span>
                  <Select  v-model="cyclerMakeUpStyle3" placeholder= '全部' :max-tag-count="1" :multiple ='true'   class="select-data-style"  >
                    <Option v-for="item in makeUpStyle3ListDatas"
                            :value="item.Code"
                            :key="item.Code">
                      {{ item.Name }}
                    </Option>
                  </Select>
                </p>
                <p style="margin-left: 1px;margin-right: 0">
                  <span class="label">下装款式</span>
                  <Select  v-model="cyclerMakeDownStyle1" placeholder= '全部' :max-tag-count="1" :multiple ='true'  class="select-data-style"  >
                    <Option v-for="item in makeDownStyle1ListDatas"
                            :value="item.Code"
                            :key="item.Code">
                      {{ item.Name }}
                    </Option>
                  </Select>
                </p>
                <p style="margin-left: 0px">
                  <span class="label">下装颜色</span>
                  <Select  v-model="cyclerMakeDownStyle2" placeholder= '全部' :max-tag-count="1" :multiple ='true'  class="select-data-style"  >
                    <Option v-for="item in makeDownStyle2ListDatas"
                            :value="item.Code"
                            :key="item.Code">
                      {{ item.Name }}
                    </Option>
                  </Select>
                </p>
              </div>
            </div>
            <div style="clear: both"></div>
          </div>
          <div v-else key="towMoto2"> <!-- 两轮摩托-->
            <p style="margin-left: 15px">
              <span class="label">骑车人</span>
              <Select  v-model="cycler" placeholder= '全部'  class="select-data-style" @on-change="selectCycler">
                <Option v-for="item in pedestrainListDatas"
                        :value="item.Code"
                        :key="item.Code">
                  {{ item.Name }}
                </Option>
              </Select>
            </p>
            <div v-if="isShowCyclers" key="towMoto2_showCyclers">
              <p style="margin-left: 37px">
                <span class="label">性别</span>
                <Select  v-model="cyclerSex" placeholder= '全部'  class="select-data-style"  >
                  <Option v-for="item in sexListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 29px">
                <span class="label">年龄</span>
                <Select  v-model="cyclerAge" placeholder= '全部' :max-tag-count="1"  :multiple ='true'  class="select-data-style" >
                  <Option v-for="item in ageListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 46px">
                <span class="label">口罩</span>
                <Select  v-model="cyclerMask" placeholder= '全部'  class="select-data-style" >
                  <Option v-for="item in maskListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 28px">
                <span class="label">朝向</span>
                <Select  v-model="cyclerDirection" placeholder= '全部' :max-tag-count="1" :multiple ='true'  class="select-data-style"  >
                  <Option v-for="item in directionListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 42px">
                <span class="label">打伞</span>
                <Select  v-model="cyclerUmbrella" placeholder= '全部'  class="select-data-style"  >
                  <Option v-for="item in umbrellaListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 29px">
                <span class="label">发型</span>
                <Select  v-model="cyclerHair" placeholder= '全部' :max-tag-count="1" :multiple ='true'  class="select-data-style"  >
                  <Option v-for="item in hairListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 50px">
                <span class="label">帽子</span>
                <Select  v-model="cyclerHat" placeholder= '全部'  class="select-data-style"  >
                  <Option v-for="item in hatListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>
              </p>
              <p style="margin-left: 28px;margin-right: 0">
                <span class="label">背包</span>
                <Select  v-model="cyclerBig" placeholder= '全部'  class="select-data-style"  >
                  <Option v-for="item in bigListDatas"
                          :value="item.Code"
                          :key="item.Code">
                    {{ item.Name }}
                  </Option>
                </Select>

              </p>
              <div v-if="isMore" key="towMoto2_more">
                <p style="margin-left: 29px">
                  <span class="label">拎物</span>
                  <Select  v-model="cyclerTakeGoods" placeholder= '全部'  class="select-data-style"  >
                    <Option v-for="item in takeGoodsListDatas"
                            :value="item.Code"
                            :key="item.Code">
                      {{ item.Name }}
                    </Option>
                  </Select>
                </p>
                <p style="margin-left: 37px">
                  <span class="label">眼镜</span>
                  <Select  v-model="cyclerGlasses" placeholder= '全部'  class="select-data-style"  >
                    <Option v-for="item in glassesListDatas"
                            :value="item.Code"
                            :key="item.Code">
                      {{ item.Name }}
                    </Option>
                  </Select>
                </p>
                <p style="margin-left: 15px">
                  <span class="label">拉杆箱</span>
                  <Select  v-model="cyclerDrawBox" placeholder= '全部'  class="select-data-style"  >
                    <Option v-for="item in drawBoxListDatas"
                            :value="item.Code"
                            :key="item.Code">
                      {{ item.Name }}
                    </Option>
                  </Select>
                </p>
                <p style="margin-left: 33px">
                  <span class="label">手推车</span>
                  <Select  v-model="cyclerDrawCar" placeholder= '全部'  class="select-data-style"  >
                    <Option v-for="item in drawCarListDatas"
                            :value="item.Code"
                            :key="item.Code">
                      {{ item.Name }}
                    </Option>
                  </Select>
                </p>
                <p style="margin-left: 14px">
                  <span class="label">抱小孩</span>
                  <Select  v-model="cyclerHugKid" placeholder= '全部'  class="select-data-style"  >
                    <Option v-for="item in hugKidListDatas"
                            :value="item.Code"
                            :key="item.Code">
                      {{ item.Name }}
                    </Option>
                  </Select>
                </p>
                <p style="margin-left: 15px">
                  <span class="label">上装纹理</span>
                  <Select  v-model="cyclerMakeUpStyle1" placeholder= '全部' :max-tag-count="1"  :multiple ='true'   class="select-data-style"  >
                    <Option v-for="item in makeUpStyle1ListDatas"
                            :value="item.Code"
                            :key="item.Code">
                      {{ item.Name }}
                    </Option>
                  </Select>
                </p>
                <p style="margin-left: 0px;">
                  <span class="label">上装款式</span>
                  <Select  v-model="cyclerMakeUpStyle2" placeholder= '全部' :max-tag-count="1" :multiple ='true'  class="select-data-style"  >
                    <Option v-for="item in makeUpStyle2ListDatas"
                            :value="item.Code"
                            :key="item.Code">
                      {{ item.Name }}
                    </Option>
                  </Select>
                </p>
                <p style="margin-left: 21px">
                  <span class="label">上装颜色</span>
                  <Select  v-model="cyclerMakeUpStyle3" placeholder= '全部' :max-tag-count="1" :multiple ='true'   class="select-data-style"  >
                    <Option v-for="item in makeUpStyle3ListDatas"
                            :value="item.Code"
                            :key="item.Code">
                      {{ item.Name }}
                    </Option>
                  </Select>
                </p>
                <p style="margin-left: 1px;margin-right: 0">
                  <span class="label">下装款式</span>
                  <Select  v-model="cyclerMakeDownStyle1" placeholder= '全部' :max-tag-count="1" :multiple ='true'  class="select-data-style"  >
                    <Option v-for="item in makeDownStyle1ListDatas"
                            :value="item.Code"
                            :key="item.Code">
                      {{ item.Name }}
                    </Option>
                  </Select>
                </p>
                <p style="margin-left: 0px">
                  <span class="label">下装颜色</span>
                  <Select  v-model="cyclerMakeDownStyle2" placeholder= '全部' :max-tag-count="1" :multiple ='true'  class="select-data-style"  >
                    <Option v-for="item in makeDownStyle2ListDatas"
                            :value="item.Code"
                            :key="item.Code">
                      {{ item.Name }}
                    </Option>
                  </Select>
                </p>
              </div>
            </div>
            <div style="clear: both"></div>
          </div>
        </div>
        <div class="left-bar" v-else  key="threeMoto">
          <div  v-if="isMore" key="threeMoto_more">
            <p style="margin-left: 29px">
              <span class="label">带篷</span>
              <Select  v-model="threeMotoCeil" placeholder= '全部'  class="select-data-style" >
                <Option v-for="item in threeMotoCeilListDatas"
                        :value="item.Code"
                        :key="item.Code">
                  {{ item.Name }}
                </Option>
              </Select>
            </p>
            <p style="margin-left: 38px">
              <span class="label">载人</span>
              <Select  v-model="threeMotoManned" placeholder= '全部'  class="select-data-style" >
                <Option v-for="item in threeMotoMannedListDatas"
                        :value="item.Code"
                        :key="item.Code">
                  {{ item.Name }}
                </Option>
              </Select>
            </p>
          </div>
        </div>
      </div>
      <div  class="queryList">
        <div class="no-result" v-if="!queryResList.length">暂无数据</div>
        <div class="result" v-else>
          <imageCard :isTrackPage='false'   v-for="(item,index) in queryResList" :key="index"  :targetType='item.type' :info="item" ></imageCard>
        </div>
      </div>
      <div class="paging-footer">
        <Page :total="tablePage.totalCount" :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" show-sizer :page-size="tablePage.limit" :current="tablePage.curPage"  @on-change="handlePageChange" :show-total="true" :show-elevator="true"></Page>
      </div>
    </div>
    <ExportList :isShow="isExportShow" :downType="'strucIntegrate'" :downInfo="exportInfo" @cancel='closeExport'></ExportList>
  </div>
</template>

<script>
import {mapActions, mapState, mapMutations} from 'vuex'
import personQuery from '../../../static/videoStructureEnum/queryDictionary'
import imageCard from '@src/view/videoStructured/common/ImageCard'
import toTreeData from '@src/assets/js/toTreeData.js'
import ExportList from './common/ExportList'
import PY from 'tiny-pinyin'
let bodyEle

export default {
  data() {
    return {
      // 初始化检索类型值
      searchType: '1',
      selectType: 'person',
      startTime: '',
      endTime: '',
      /** *********行人选项*****************/
      // 性别值
      sex: 'all',
      // 年龄
      age: [],
      mask: 'all', // 口罩
      direction: [], // 朝向列表
      umbrella: 'all', // 是否打伞列表
      hair: [], // 发型列表
      hat: 'all', // 帽子列表
      big: 'all', // 背包列表
      takeGoods: 'all', // 拎东西
      glasses: 'all', // 眼镜
      drawBox: 'all', // 拉杆箱
      drawCar: 'all', // 手推车
      hugKid: 'all', // 抱小孩
      makeUpStyle1: [], // 上装纹理
      makeUpStyle2: [], // 上装款式
      makeUpStyle3: [], // 上装颜色
      makeDownStyle1: [], // 下装款式
      makeDownStyle2: [], // 下装颜色
      /** *********轿车、卡车、面包车、大客车选项*****************/
      carNumber: '', // 车牌号
      carColor: [], // 车辆颜色
      carType: [], // 车辆类型
      carLogo: [], // 品牌
      carLogoListDatas: [], // 从字典中查询出的车辆品牌列表
      //  searchCarLogoListDatas: [], // 搜索出来的品牌列表
      carModel: [], // 型号
      carBirthday: [], // 年款
      carNumberType: [], // 号牌类型
      carNumberColor: [], // 号牌颜色

      vicePassenger: 'all', // 副驾乘客
      callUp: 'all', // 打电话
      roofRack: 'all', // 行李架
      spare: 'all', // 备胎
      safetyBelt: 'all', // 主安全带
      windowUp: 'all', // 天窗
      viceSafetyBelt: 'all', // 副安全带
      ASFlag: 'all', // 年检标
      paperBox: 'all', // 纸巾盒
      sunShield: 'all', // 遮阳板
      pendant: 'all', // 吊坠
      damage: 'all', // 撞损
      slagCar: 'all', // 渣土车
      dangerous: 'all', // 危化品
      /** *********摩托车或自行车选项*****************/
      cycler: 'all', // 骑车人
      isShowCyclers: true, // 是否显示骑车人相关
      cyclerSex: 'all', // 骑车人性别
      cyclerAge: [], // 骑车人年龄
      cyclerMask: 'all', // 骑车人口罩
      cyclerDirection: [], // 骑车人朝向
      cyclerUmbrella: 'all', // 骑车人打伞
      cyclerHair: [], // 骑车人发型
      cyclerHat: 'all', // 骑车人帽子列表
      cyclerBig: 'all', // 骑车人背包列表
      cyclerTakeGoods: 'all', // 骑车人拎东西
      cyclerGlasses: 'all', // 骑车人眼镜
      cyclerDrawBox: 'all', // 骑车人拉杆箱
      cyclerDrawCar: 'all', // 骑车人手推车
      cyclerHugKid: 'all', // 骑车人抱小孩
      cyclerMakeUpStyle1: [], // 骑车人上装纹理
      cyclerMakeUpStyle2: [], // 骑车人上装款式
      cyclerMakeUpStyle3: [], // 骑车人上装颜色
      cyclerMakeDownStyle1: [], // 骑车人下装款式
      cyclerMakeDownStyle2: [], // 骑车人下装颜色
      /** *********三轮车选项*****************/
      threeMotoCeil: 'all', // 带篷
      threeMotoManned: 'all', // 载人
      /*************************/
      isMore: false,
      // 初始化检索通道值
      orgTreeSearch: '全部',
      isExpand: false,
      isSelect: false,
      devList: toTreeData([]),
      treeOptionNum: 0,
      /** **********分页配置项*************/
      tablePage: {
        curPage: 1,
        limit: this.$PageInfo.limit,
        totalCount: 0 // 总数
      },
      selectCarLogoList: [], // 选中的车辆品牌
      selectCarBrandList: [], // 选中的车辆型号
      queryResList: [], // 查询出来的数据

      /** ********是否点击导出***************/
      isExportShow: false,
      exportInfo: {}, // 导出参数
      searching: false,
      queryText: '', // 搜索品牌
      brandQueryText: '', // 搜索型号
      patternQueryText: '', // 搜索年款
      /** *******判断浏览器类型************/
      // browserName: 'chrome',
      carNumberValid: false
    }
  },
  components: {
    imageCard,
    ExportList
  },
  methods: {
    ...mapMutations(['SET_SEARCH_TYPE']),
    ...mapMutations('synthesizeQuery', ['setOldQueryParams']),
    ...mapActions('synthesizeQuery', ['getDictionary', 'getQueryDatas']),
    // ...mapActions('videoStructuredSetting', ['getVideoStructuredTree']),
    ...mapActions(['getVideoStructTree']),
    setDate() {
      this.startTime = new Date(this.$moment(new Date()).format('YYYY-MM-DD') + ' 00:00:00')
      this.endTime = new Date()
    },
    // 选择检索类型时 清空高级选项中所有数据
    chooseType(val) {
      // 初始化数据
      Object.assign(this.$data, {
        /** *********行人选项*****************/
        // 性别值
        sex: 'all',
        // 年龄
        age: [],
        mask: 'all', // 口罩
        direction: [], // 朝向列表
        umbrella: 'all', // 是否打伞列表
        hair: [], // 发型列表
        hat: 'all', // 帽子列表
        big: 'all', // 背包列表
        takeGoods: 'all', // 拎东西
        glasses: 'all', // 眼镜
        drawBox: 'all', // 拉杆箱
        drawCar: 'all', // 手推车
        hugKid: 'all', // 抱小孩
        makeUpStyle1: [], // 上装纹理
        makeUpStyle2: [], // 上装款式
        makeUpStyle3: [], // 上装颜色
        makeDownStyle1: [], // 下装款式
        makeDownStyle2: [], // 下装颜色
        /** *********轿车、卡车、面包车、大客车选项*****************/
        carNumber: '', // 车牌号
        carColor: [], // 车辆颜色
        carType: [], // 车辆类型
        carLogo: [], // 品牌
        carModel: [], // 型号
        carBirthday: [], // 年款
        carNumberType: [], // 号牌类型
        carNumberColor: [], // 号牌颜色
        vicePassenger: 'all', // 副驾乘客
        callUp: 'all', // 打电话
        roofRack: 'all', // 行李架
        spare: 'all', // 备胎
        safetyBelt: 'all', // 主安全带
        windowUp: 'all', // 天窗
        viceSafetyBelt: 'all', // 副安全带
        ASFlag: 'all', // 年检标
        paperBox: 'all', // 纸巾盒
        sunShield: 'all', // 遮阳板
        pendant: 'all', // 吊坠
        damage: 'all', // 撞损
        slagCar: 'all', // 渣土车
        dangerous: 'all', // 危化品
        /** *********摩托车或自行车选项*****************/
        cycler: 'all', // 骑车人
        isShowCyclers: true, // 是否显示骑车人相关
        cyclerSex: 'all', // 骑车人性别
        cyclerAge: [], // 骑车人年龄
        cyclerMask: 'all', // 骑车人口罩
        cyclerDirection: [], // 骑车人朝向
        cyclerUmbrella: 'all', // 骑车人打伞
        cyclerHair: [], // 骑车人发型
        cyclerHat: 'all', // 骑车人帽子列表
        cyclerBig: 'all', // 骑车人背包列表
        cyclerTakeGoods: 'all', // 骑车人拎东西
        cyclerGlasses: 'all', // 骑车人眼镜
        cyclerDrawBox: 'all', // 骑车人拉杆箱
        cyclerDrawCar: 'all', // 骑车人手推车
        cyclerHugKid: 'all', // 骑车人抱小孩
        cyclerMakeUpStyle1: [], // 骑车人上装纹理
        cyclerMakeUpStyle2: [], // 骑车人上装款式
        cyclerMakeUpStyle3: [], // 骑车人上装颜色
        cyclerMakeDownStyle1: [], // 骑车人下装款式
        cyclerMakeDownStyle2: [], // 骑车人下装颜色
        /** *********三轮车选项*****************/
        threeMotoCeil: 'all', // 带篷
        threeMotoManned: 'all', // 载人
        carNumberValid: false
      })
      if (val === '1') { // 行人类型
        this.selectType = 'person'
      } else if (val === '4' || val === '6' || val === '7' || val === '8') { // 汽车分类
        this.selectType = 'car'
        // console.log(this.queryText)
        setTimeout(() => {
          // console.log(this.$refs.carLogoSelect)
          if (this.$refs.carLogoSelect) {
            this.$refs.carLogoSelect.query = ''
            this.searchLogos('')
          }
          if (this.$refs.carBrandSelect) {
            this.$refs.carBrandSelect.query = ''
            this.searchBrands('')
          }
          if (this.$refs.carPatternSelect) {
            this.$refs.carPatternSelect.query = ''
            this.searchPatterns('')
          }
        }, 1)
      } else if (val === '2' || val === '3') { // 自行车或两轮摩托分类
        this.selectType = 'towMoto'
      } else { // 三轮摩托分类
        this.selectType = 'threeMoto'
      }
    },
    changeCamera() {
      const selectTree = this.$refs.channelTrees ? this.$refs.channelTrees.getSelectedDeepNameIds() : {}
      if (selectTree.name.length === 0 || selectTree.name.length === this.treeOptionNum) {
        return '全部'
      } else {
        return selectTree.name.join(';')
      }
    },
    listenerClick(e) {
      if (e.target.classList.contains('input') || e.target.classList.contains('item') || e.target.classList.contains('treeliBox') || e.target.classList.contains('search-tree-info') || e.target.classList.contains('search')) {
        this.isExpand = true
      } else {
        this.isExpand = false
      }
    },
    startChange(val) {
      this.startTime = val.dateTimes
      if (this.startTime.getTime() > this.endTime.getTime()) {
        this.endTime = this.startTime
      }
      this.checkTime('s')
    },
    endChange(val) {
      this.endTime = val.dateTimes
      if (this.startTime.getTime() > this.endTime.getTime()) {
        this.startTime = this.endTime
      }
      this.checkTime('v')
    },
    checkTime(s) {
      if (s === 's') {
        const curend = this.$moment(this.endTime).unix('X')
        const end = this.$moment(this.$moment(this.startTime).add(7, 'days')).unix('X')
        if (curend > end) {
          this.endTime = new Date(end * 1000)
          this.warningMsg('时间段最大间隔为7天!')
        }
      } else {
        const curstart = this.$moment(this.startTime).unix('X')
        const start = this.$moment(this.$moment(this.endTime).subtract(7, 'days')).unix('X')
        if (curstart < start) {
          this.startTime = new Date(start * 1000)
          this.warningMsg('时间段最大间隔为7天!')
        }
      }
    },
    handlePageChange(page) {
      this.tablePage.curPage = page
      this.queryData('query')
    },
    selectCarLogo(val) { // 选择品牌
      this.selectCarLogoList = JSON.parse(JSON.stringify(val))
      let setCarMode = []
      let setCarBirthday = []
      // 设置初始化各品牌的check状态
      for (let item0 of this.carLogoOptions) {
        for (let item00 of item0.data) {
          item00.isChecked = false
          for (let item1 of item00.CarBrandList) {
            item1.isChecked = false
            for (let item2 of item1.CarPatternList) {
              item2.isChecked = false
            }
          }
        }
      }
      // 设置选中品牌对应的check状态
      for (let item1 of this.selectCarLogoList) { // 遍历选中的品牌数组
        for (let item2 of this.carLogoOptions) { // 遍历总品牌数组
          for (let item22 of item2.data) {
            if (item1.value === item22.CarFamily + '-' + item22.queryText) { // 如果选中品牌数组中某对象与总品牌数组中某对象值相同
              item22.isChecked = true // 将此对象check设置为true
              item1.CarBrandList = item22.CarBrandList // 将此对象设置型号列表为对应总品牌对象中的型号列表
              if (this.carModel.length > 0) {
                for (let item3 of item1.CarBrandList) { // 遍历选中对象的型号列表
                  for (let item4 of this.carModel) { // 匹配选中的型号
                    if (item4 === (item3.CarFamily + ',' + item3.CarBrand + '-' + item3.queryText)) { // 如果选中则把型号check置为true
                      item3.isChecked = true
                      setCarMode.push(item3.CarFamily + ',' + item3.CarBrand + '-' + item3.queryText)
                      for (let item5 of item3.CarPatternList) {
                        for (let item6 of this.carBirthday) {
                          if (item6 === (item5.CarFamily + ',' + item5.CarBrand + ',' + item5.CarPattern + '-' + item5.queryText)) {
                            item5.isChecked = true
                            setCarBirthday.push(item5.CarFamily + ',' + item5.CarBrand + ',' + item5.CarPattern + '-' + item5.queryText)
                          }
                        }
                      }
                    }
                  }
                }
              }

              break
            }
          }
        }
      }
      this.carModel = setCarMode // 型号
      this.carBirthday = setCarBirthday // 年款
    },
    selectCarBrand(val) { // 选择型号
      this.selectCarBrandList = JSON.parse(JSON.stringify(val))
      let setCarBirthday = []
      // 设置初始化各型号和年款的check状态
      for (let item of this.carLogoListDatas) {
        for (let item0 of item.data) {
          for (let item1 of item0.CarBrandList) {
            item1.isChecked = false
            for (let item2 of item1.CarPatternList) {
              item2.isChecked = false
            }
          }
        }
      }
      for (let item of this.selectCarBrandList) {
        for (let item1 of this.carLogoListDatas) {
          for (let item11 of item1.data) {
            for (let item2 of item11.CarBrandList) {
              if (item.value === (item2.CarFamily + ',' + item2.CarBrand + '-' + item2.queryText)) { // 匹配选中的型号
                item2.isChecked = true
                item.CarPatternList = item2.CarPatternList
                for (let item3 of item.CarPatternList) {
                  for (let item4 of this.carBirthday) { // 匹配选中的年款
                    if (item4 === (item3.CarFamily + ',' + item3.CarBrand + ',' + item3.CarPattern + '-' + item3.queryText)) {
                      item3.isChecked = true
                      setCarBirthday.push(item3.CarFamily + ',' + item3.CarBrand + ',' + item3.CarPattern + '-' + item3.queryText)
                    }
                  }
                }
                break
              }
            }
          }
        }
      }
      this.carBirthday = setCarBirthday
    },
    selectCarPattern(val) { // 年款
      let selectCarBirthdayList = JSON.parse(JSON.stringify(val))
      // 初始化年款checked状态
      for (let item of this.carLogoListDatas) {
        for (let item00 of item.data) {
          for (let item1 of item00.CarBrandList) {
            for (let item2 of item1.CarPatternList) {
              item2.isChecked = false
            }
          }
        }
      }
      for (let item of selectCarBirthdayList) {
        for (let item1 of this.carLogoListDatas) {
          for (let item11 of item1.data) {
            for (let item2 of item11.CarBrandList) {
              for (let item3 of item2.CarPatternList) {
                if (item.value === (item3.CarFamily + ',' + item3.CarBrand + ',' + item3.CarPattern + '-' + item3.queryText)) {
                  item3.isChecked = true
                  break
                }
              }
            }
          }
        }
      }
    },
    openMore() {
      if (this.isMore) {
        this.isMore = false
      } else {
        this.isMore = true
      }
    },
    queryData(flag) {
      const moment = this.$moment
      const selectTree = this.$refs.channelTrees ? this.$refs.channelTrees.getSelectedDeepIps() : {}
      let params = {
        searchType: null, // 检索大类型
        type: this.searchType, // 检索小类型
        startTime: null, // 检索开始时间
        endTime: null, // 检索结束时间
        limit: this.tablePage.limit, // 每页检索条数
        page: this.tablePage.curPage,
        videoChannel: ''
      }
      params.startTime = moment(this.startTime).unix() * 1000
      params.endTime = moment(this.endTime).unix() * 1000 + 999
      if (selectTree.name.length === 0 || selectTree.name.length === this.treeOptionNum) { // 全选或者默认状态
        params.videoChannel = ''
      } else {
        const reqSelectTree = this.$refs.channelTrees ? this.$refs.channelTrees.getSelectedDeepIds().toString() : ''
        params.videoChannel = reqSelectTree
      }
      if (this.searchType === '1') { // 行人类型
        params.searchType = 'pedestrain'
        if (this.sex !== 'all') {
          params.sexCode = this.sex
        }
        if (this.age.length !== 0) {
          params.ageCode = this.age.join()
        }
        if (this.mask !== 'all') {
          params.maskCode = this.mask
        }
        if (this.direction.length !== 0) {
          params.orientationCode = this.direction.join()
        }
        if (this.umbrella !== 'all') {
          params.umbrellaCode = this.umbrella
        }
        if (this.hair.length !== 0) {
          params.hairCode = this.hair.join()
        }
        if (this.hat !== 'all') {
          params.hatCode = this.hat
        }
        if (this.big !== 'all') {
          params.knapsackCode = this.big
        }
        if (this.takeGoods !== 'all') {
          params.bagCode = this.takeGoods
        }
        if (this.glasses !== 'all') {
          params.glassesCode = this.glasses
        }
        if (this.drawBox !== 'all') {
          params.trolleyCaseCode = this.drawBox
        }
        if (this.drawCar !== 'all') {
          params.barrowCode = this.drawCar
        }
        if (this.hugKid !== 'all') {
          params.babyCode = this.hugKid
        }
        if (this.makeUpStyle1.length !== 0) {
          params.upperTextureCode = this.makeUpStyle1.join()
        }
        if (this.makeUpStyle2.length !== 0) {
          params.upperTypeCode = this.makeUpStyle2.join()
        }
        if (this.makeUpStyle3.length !== 0) {
          params.upperColorCode = this.makeUpStyle3.join()
        }
        if (this.makeDownStyle1.length !== 0) {
          params.bottomTypeCode = this.makeDownStyle1.join()
        }
        if (this.makeDownStyle2.length !== 0) {
          params.bottomColorCode = this.makeDownStyle2.join()
        }
      } else if (this.searchType === '4' || this.searchType === '5' || this.searchType === '6' || this.searchType === '7' || this.searchType === '8') { // 机动车
        params.searchType = 'vehicle'
        if (this.searchType === '4' || this.searchType === '6' || this.searchType === '7' || this.searchType === '8') { // 轿车 大客车 面包车 卡车
          if (this.carNumber !== '') { // 车牌号码
            params.plateLicence = this.carNumber
          }
          if (this.carColor.length !== 0) { // 车辆颜色
            params.colorCode = this.carColor.join()
          }
          if (this.carType.length !== 0) { // 车辆类型
            params.carKindCode = this.carType.join()
          }
          /** *********车辆品牌型号年款***************/
          if (this.carLogo.length !== 0) {
            let arr = []
            let arrIndex = 0 // arr checked状态的下标
            this.carLogoListDatas.forEach((item0) => {
              item0.data.forEach(item => {
                if (item.isChecked) { // 递归品牌
                  let arr1 = [] // 存储品牌下面被选中的型号
                  arr.push(item.CarFamily + '')
                  let arr1Index = 0 // arr1 checked状态的下标
                  item.CarBrandList.forEach(item1 => {
                    if (item1.isChecked) { // 递归型号
                      let arr2 = [] // 存储型号下面选中的年份
                      arr1.push((item1.CarFamily + ',' + item1.CarBrand))
                      item1.CarPatternList.forEach(item2 => {
                        if (item2.isChecked) { // 递归年份
                          arr2.push((item2.CarFamily + ',' + item2.CarBrand + ',' + item2.CarPattern))
                        }
                      })
                      if (arr2.length > 0) { // 如果当前存储年份有选中的年份
                        arr1.splice(arr1Index, 1, arr2) // 替换当前对象
                      }
                      arr1Index++
                    }
                  })
                  if (arr1.length > 0) {
                    arr.splice(arrIndex, 1, arr1)
                    // item.reqValue = arr1
                  }
                  arrIndex++
                }
              })
            })
            let str = ''
            for (let item of arr) {
              if (item instanceof Array) {
                for (let item1 of item) {
                  if (item1 instanceof Array) {
                    str += item1.join(';') + ';'
                  } else {
                    str += item1 + ';'
                  }
                }
              } else {
                str += item + ';'
              }
            }
            if (str) {
              params.style = str.slice(0, str.length - 1)
            }
          }
          /** *********************end**********************/
          if (this.carNumberType.length !== 0) { // 车牌类型
            params.plateTypeCode = this.carNumberType.join()
          }
          if (this.carNumberColor.length !== 0) { // 车牌颜色
            params.plateColorCode = this.carNumberColor.join()
          }
          if (this.vicePassenger !== 'all') { // 副驾乘客
            params.coDriverPersonCode = this.vicePassenger
          }
          if (this.callUp !== 'all') { // 打电话
            params.callCode = this.callUp
          }
          if (this.roofRack !== 'all') { // 行李架
            params.rackCode = this.roofRack
          }
          if (this.spare !== 'all') { // 备胎
            params.spareTireCode = this.spare
          }
          if (this.safetyBelt !== 'all') { // 主安全带
            params.mainDriverBeltCode = this.safetyBelt
          }
          if (this.windowUp !== 'all') { // 天窗
            params.sunroofCode = this.windowUp
          }
          if (this.viceSafetyBelt !== 'all') { // 副安全带
            params.coDriverBeltCode = this.viceSafetyBelt
          }
          if (this.ASFlag !== 'all') { // 年检标
            params.tagNum = this.ASFlag
          }
          if (this.paperBox !== 'all') { // 纸巾盒
            params.paperCode = this.paperBox
          }
          if (this.sunShield !== 'all') { // 遮阳板
            params.sunCode = this.sunShield
          }
          if (this.pendant !== 'all') { // 吊坠
            params.dropCode = this.pendant
          }
          if (this.damage !== 'all') { // 撞损
            params.crashCode = this.damage
          }
          if (this.slagCar !== 'all') { // 渣土车
            params.slagCode = this.slagCar
          }
          if (this.dangerous !== 'all') { // 危化品
            params.dangerCode = this.dangerous
          }
        } else { // 三轮车
          if (this.threeMotoCeil !== 'all') { // 带篷
            params.convertibleCode = this.threeMotoCeil
          }
          if (this.threeMotoManned !== 'all') { // 载人
            params.mannedCode = this.threeMotoManned
          }
        }
      } else if (this.searchType === '2' || this.searchType === '3') { // 非机动车
        params.searchType = 'nonMotorVehicle'

        if (this.isShowCyclers) { //  识别
          if (this.cycler !== 'all') { // 骑车人
            params.isPedestrain = this.cycler
          }
          if (this.cyclerSex !== 'all') { // 骑车人性别
            params.sexCode = this.cyclerSex
          }
          if (this.cyclerAge.length !== 0) { // 骑车人年龄
            params.ageCode = this.cyclerAge.join()
          }
          if (this.cyclerMask !== 'all') { // 骑车人口罩
            params.maskCode = this.cyclerMask
          }
          if (this.cyclerDirection.length !== 0) { // 骑车人朝向
            params.orientationCode = this.cyclerDirection.join()
          }
          if (this.cyclerUmbrella !== 'all') { // 骑车人打伞
            params.umbrellaCode = this.cyclerUmbrella
          }
          if (this.cyclerHair.length !== 0) { // 骑车人发型
            params.hairCode = this.cyclerHair.join()
          }
          if (this.cyclerHat !== 'all') { // 骑车人帽子列表
            params.hatCode = this.cyclerHat
          }
          if (this.cyclerBig !== 'all') { // 骑车人背包列表
            params.knapsackCode = this.cyclerBig
          }
          if (this.cyclerTakeGoods !== 'all') { // 骑车人拎东西
            params.bagCode = this.cyclerTakeGoods
          }
          if (this.cyclerGlasses !== 'all') { // 骑车人眼镜
            params.glassesCode = this.cyclerGlasses
          }
          if (this.cyclerDrawBox !== 'all') { // 骑车人拉杆箱
            params.trolleyCaseCode = this.cyclerDrawBox
          }
          if (this.cyclerDrawCar !== 'all') { // 骑车人手推车
            params.barrowCode = this.cyclerDrawCar
          }
          if (this.cyclerHugKid !== 'all') { // 骑车人抱小孩
            params.babyCode = this.cyclerHugKid
          }
          if (this.cyclerMakeUpStyle1.length !== 0) { // 骑车人上装纹理
            params.upperTextureCode = this.cyclerMakeUpStyle1.join()
          }
          if (this.cyclerMakeUpStyle2.length !== 0) { // 骑车人上装款式
            params.upperTypeCode = this.cyclerMakeUpStyle2.join()
          }
          if (this.cyclerMakeUpStyle3.length !== 0) { // 骑车人上装颜色
            params.upperColorCode = this.cyclerMakeUpStyle3.join()
          }
          if (this.cyclerMakeDownStyle1.length !== 0) { // 骑车人下装款式
            params.bottomTypeCode = this.cyclerMakeDownStyle1.join()
          }
          if (this.cyclerMakeDownStyle2.length !== 0) { // 骑车人下装颜色
            params.bottomColorCode = this.cyclerMakeDownStyle2.join()
          }
        } else { // 未识别
          params.isPedestrain = this.cycler
        }
      }
      if (flag === 'query') {
        for (let key in params) {
          if (key !== 'page' && key !== 'limit') { // 过滤page&&limit属性
            if (params[key] !== this.oldQueryParamObj[key]) {
              this.tablePage.curPage = 1
              params.page = 1
              break
            }
          }
        }
        this.setOldQueryParams(params) // 存入参数至vuex内
        this.getQueryDatas(params).then(res => {
          this.searching = false
          this.queryResList = JSON.parse(JSON.stringify(res.data.data))
          // console.log(this.queryResList)
          this.tablePage.totalCount = res.data.totalNum
          if (!this.queryResList.length) {
            this.warningMsg('查询无结果！')
          }
        }, err => {
          this.searching = false
          this.errorMsg('检索失败！')
        })
      } else {
        this.exportInfo = params
        this.isExportShow = true // 开始导出
      }
    },
    selectCycler(val) {
      if (val === '1' || val === 'all') { // 识别
        this.isShowCyclers = true
      } else {
        this.isShowCyclers = false
      }
    },

    // 清空条件时，清空所有高级选项及通道选项的数据
    clearSelects() {
      Object.assign(this.$data, {
        // 性别值
        searchType: '1',
        selectType: 'person',
        sex: 'all',
        // 年龄
        age: [],
        mask: 'all', // 口罩
        direction: [], // 朝向列表
        umbrella: 'all', // 是否打伞列表
        hair: [], // 发型列表
        hat: 'all', // 帽子列表
        big: 'all', // 背包列表
        takeGoods: 'all', // 拎东西
        glasses: 'all', // 眼镜
        drawBox: 'all', // 拉杆箱
        drawCar: 'all', // 手推车
        hugKid: 'all', // 抱小孩
        makeUpStyle1: [], // 上装纹理
        makeUpStyle2: [], // 上装款式
        makeUpStyle3: [], // 上装颜色
        makeDownStyle1: [], // 下装款式
        makeDownStyle2: [], // 下装颜色
        /** *********轿车、卡车、面包车、大客车选项*****************/
        carNumber: '', // 车牌号
        carColor: [], // 车辆颜色
        carType: [], // 车辆类型
        carLogo: [], // 品牌
        carModel: [], // 型号
        carBirthday: [], // 年款
        carNumberType: [], // 号牌类型
        carNumberColor: [], // 号牌颜色

        vicePassenger: 'all', // 副驾乘客
        callUp: 'all', // 打电话
        roofRack: 'all', // 行李架
        spare: 'all', // 备胎
        safetyBelt: 'all', // 主安全带
        windowUp: 'all', // 天窗
        viceSafetyBelt: 'all', // 副安全带
        ASFlag: 'all', // 年检标
        paperBox: 'all', // 纸巾盒
        sunShield: 'all', // 遮阳板
        pendant: 'all', // 吊坠
        damage: 'all', // 撞损
        slagCar: 'all', // 渣土车
        dangerous: 'all', // 危化品
        cycler: 'all', // 骑车人
        isShowCyclers: true, // 是否显示骑车人相关
        cyclerSex: 'all', // 骑车人性别
        cyclerAge: [], // 骑车人年龄
        cyclerMask: 'all', // 骑车人口罩
        cyclerDirection: [], // 骑车人朝向
        cyclerUmbrella: 'all', // 骑车人打伞
        cyclerHair: [], // 骑车人发型
        cyclerHat: 'all', // 骑车人帽子列表
        cyclerBig: 'all', // 骑车人背包列表
        cyclerTakeGoods: 'all', // 骑车人拎东西
        cyclerGlasses: 'all', // 骑车人眼镜
        cyclerDrawBox: 'all', // 骑车人拉杆箱
        cyclerDrawCar: 'all', // 骑车人手推车
        cyclerHugKid: 'all', // 骑车人抱小孩
        cyclerMakeUpStyle1: [], // 骑车人上装纹理
        cyclerMakeUpStyle2: [], // 骑车人上装款式
        cyclerMakeUpStyle3: [], // 骑车人上装颜色
        cyclerMakeDownStyle1: [], // 骑车人下装款式
        cyclerMakeDownStyle2: [], // 骑车人下装颜色
        /** *********三轮车选项*****************/
        threeMotoCeil: 'all', // 带篷
        threeMotoManned: 'all', // 载人
        /*************************/
        // 初始化检索通道值
        orgTreeSearch: '全部',
        isExpand: false,
        isSelect: false,
        devList: toTreeData([]),
        treeOptionNum: 0,
        selectCarLogoList: [], // 选中的车辆品牌
        selectCarBrandList: [], // 选中的车辆型号
        queryText: '', // 搜索品牌
        brandQueryText: '', // 搜索型号
        patternQueryText: '', // 搜索年款
        carNumberValid: false
      })
      setTimeout(() => {
        // console.log(this.$refs.carLogoSelect)
        this.$refs.carLogoSelect.query = ''
        this.$refs.carBrandSelect.query = ''
        this.$refs.carPatternSelect.query = ''
        this.searchLogos('')
        this.searchBrands('')
        this.searchPatterns('')
      }, 1)
      this.setDate()
    },
    closeExport() { // 点击关闭导出
      this.isExportShow = false
      this.exportInfo = {}
    },
    exportQuery() { // 点击开始导出
      this.queryData('export') // 获取导出参数
    },
    queryDataBtn() {
      if (this.carNumber.length > 16) {
        this.carNumberValid = true
        return
      } else {
        this.carNumberValid = false
      }
      this.searching = true
      this.queryData('query')
    },
    searchLogos(query) {
      this.queryText = query
    },
    searchBrands(query) {
      this.brandQueryText = query
    },
    searchPatterns(query) {
      this.patternQueryText = query
    },
    pageSizeChange(n) {
      this.tablePage.limit = n
      this.tablePage.curPage = 1
      this.queryData('query')
    },
    isChinese(temp) { // 检测中文
      var re = /[^\u4E00-\u9FA5]/g
      if (re.test(temp)) { return false }
      return true
    },
    isChar(char) { // 检测英文
      let reg = /^[a-zA-Z]+$/ig
      if (!reg.test(char)) { return false }
      return true
    }
  },
  created() {
    if (this.integrateSearchType !== -1) { // 从实时结构化进入
      this.searchType = String(this.integrateSearchType)
      if (this.searchType === '1') { // 行人类型
        this.selectType = 'person'
      } else if (this.searchType === '4' || this.searchType === '6' || this.searchType === '7' || this.searchType === '8') { // 汽车分类
        this.selectType = 'car'
      } else if (this.searchType === '2' || this.searchType === '3') { // 自行车或两轮摩托分类
        this.selectType = 'towMoto'
      } else { // 三轮摩托分类
        this.selectType = 'threeMoto'
      }
    }
  },
  mounted() {
    this.setDate()
    // this.browserName = this.checkBrowser()
    this.getVideoStructTree().then(res => {
      // 获取设备树
      this.devList = toTreeData([res.data])
      // this.carLogoListDatas = JSON.parse(window.localStorage.getItem('carLogoLists'))
      // console.log(this)
      let IDBRequest = window.indexedDB.open('carDB', 2) // 打开数据库
      IDBRequest.onsuccess = event => {
        let db = event.target.result
        let getData = db.transaction(['carData']).objectStore('carData').get(1)
        getData.onsuccess = event => {
          this.carLogoListDatas = JSON.parse(JSON.stringify(event.target.result.carLogoLists))
        }
        getData.onerror = event => {
          console.log('获取表数据失败')
        }
        console.log('数据库打开成功')
      }
      IDBRequest.onerror = event => {
        console.log('数据库打开报错')
      }
      this.$nextTick(() => {
        const selectTree = this.$refs.channelTrees ? this.$refs.channelTrees.getSelectedDeepNameIds() : {}
        this.treeOptionNum = selectTree.count // 节点数量
        bodyEle = document.getElementsByTagName('body')[0]
        bodyEle.addEventListener('click', this.listenerClick)
        // 默认查询
        if (this.integrateSearchType !== -1) { // 从实时结构化进入
          this.queryData('query')
        }
      })
    })
      .catch(err => {
        console.log('获取设备树出错', err)
      })
    // 默认获取行人相关字典数据
    for (let key in personQuery) {
      this.getDictionary({type: key, data: personQuery[key]})
    }
  },
  computed: {
    ...mapState({
      searchTypeDatas: ({synthesizeQuery}) => synthesizeQuery.searchTypes, // 检索分类
      sexListDatas: ({synthesizeQuery}) => synthesizeQuery.sexLists, // 性别表
      ageListDatas: ({synthesizeQuery}) => synthesizeQuery.ageLists, // 年龄
      takeGoodsListDatas: ({synthesizeQuery}) => synthesizeQuery.takeGoodsLists, // 拎包表
      makeDownStyle1ListDatas: ({synthesizeQuery}) => synthesizeQuery.makeDownStyle1Lists, // 下衣类型表
      makeDownStyle2ListDatas: ({synthesizeQuery}) => synthesizeQuery.makeDownStyle2Lists, // 裤子颜色表
      hairListDatas: ({synthesizeQuery}) => synthesizeQuery.hairLists, // 发型表
      hatListDatas: ({synthesizeQuery}) => synthesizeQuery.hatLists, // 帽子表
      bigListDatas: ({synthesizeQuery}) => synthesizeQuery.bigLists, // 双肩包
      directionListDatas: ({synthesizeQuery}) => synthesizeQuery.directionLists, // 行人方向表
      makeUpStyle1ListDatas: ({synthesizeQuery}) => synthesizeQuery.makeUpStyle1Lists, // 上身纹理
      makeUpStyle2ListDatas: ({synthesizeQuery}) => synthesizeQuery.makeUpStyle2Lists, // 上衣类型表
      makeUpStyle3ListDatas: ({synthesizeQuery}) => synthesizeQuery.makeUpStyle3Lists, // 上衣颜色表
      umbrellaListDatas: ({synthesizeQuery}) => synthesizeQuery.umbrellaLists, // 是否打伞
      hugKidListDatas: ({synthesizeQuery}) => synthesizeQuery.hugKidLists, // 抱小孩
      maskListDatas: ({synthesizeQuery}) => synthesizeQuery.maskLists, // 口罩
      glassesListDatas: ({synthesizeQuery}) => synthesizeQuery.glassesLists, // 眼镜
      drawBoxListDatas: ({synthesizeQuery}) => synthesizeQuery.drawBoxLists, // 拉杆箱
      drawCarListDatas: ({synthesizeQuery}) => synthesizeQuery.drawCarLists, // 手推车
      pedestrainListDatas: ({synthesizeQuery}) => synthesizeQuery.pedestrainLists, // 手推车
      /** ****汽车相关*****/
      carColorListDatas: ({synthesizeQuery}) => synthesizeQuery.carColorLists,
      carTypeListDatas: ({synthesizeQuery}) => synthesizeQuery.carTypeLists, // 车辆类型, // 车辆品牌
      carNumberTypeListDatas: ({synthesizeQuery}) => synthesizeQuery.carNumberTypeLists, // 车牌类型
      carNumberColorListDatas: ({synthesizeQuery}) => synthesizeQuery.carNumberColorLists, // 车牌颜色
      vicePassengerListDatas: ({synthesizeQuery}) => synthesizeQuery.vicePassengerLists, // 副驾乘客
      callUpListDatas: ({synthesizeQuery}) => synthesizeQuery.callUpLists, // 打电话
      roofRackListDatas: ({synthesizeQuery}) => synthesizeQuery.roofRackLists, // 行李架
      spareListDatas: ({synthesizeQuery}) => synthesizeQuery.spareLists, // 备胎
      safetyBeltListDatas: ({synthesizeQuery}) => synthesizeQuery.safetyBeltLists, // 主安全带
      windowUpListDatas: ({synthesizeQuery}) => synthesizeQuery.windowUpLists, // 天窗
      viceSafetyBeltListDatas: ({synthesizeQuery}) => synthesizeQuery.viceSafetyBeltLists, // 副安全带
      ASFlagListDatas: ({synthesizeQuery}) => synthesizeQuery.ASFlagLists, // 年检标
      paperBoxListDatas: ({synthesizeQuery}) => synthesizeQuery.paperBoxLists, // 纸巾盒
      sunShieldListDatas: ({synthesizeQuery}) => synthesizeQuery.sunShieldLists, // 遮阳板
      pendantListDatas: ({synthesizeQuery}) => synthesizeQuery.pendantLists, // 吊坠
      damageListDatas: ({synthesizeQuery}) => synthesizeQuery.damageLists, // 撞损
      slagCarListDatas: ({synthesizeQuery}) => synthesizeQuery.slagCarLists, // 渣土车
      dangerousListDatas: ({synthesizeQuery}) => synthesizeQuery.dangerousLists, // 危化品
      /** *******三轮相关***********/
      threeMotoCeilListDatas: ({synthesizeQuery}) => synthesizeQuery.threeMotoCeilLists, // 带棚
      threeMotoMannedListDatas: ({synthesizeQuery}) => synthesizeQuery.threeMotoMannedLists, // 载人
      /** **********检索类型值*************/
      integrateSearchType: ({videoStructured}) => videoStructured.integrateSearchType,
      oldQueryParamObj: ({synthesizeQuery}) => synthesizeQuery.oldQueryParams, // 载人
      db: ({synthesizeQuery}) => synthesizeQuery.db
    }),
    carLogoOptions() {
      let options = []
      if (this.queryText === '') {
        options = this.carLogoListDatas
      } else {
        this.carLogoListDatas.forEach(item => {
          /* if (item.letter.indexOf(this.queryText.toUpperCase()) !== -1) {
            for (let item1 of item.data) {
              item1.queryText = this.queryText
            }
            options.push(item)
          } */
          /* for (let item1 of item.data) {
            let itemPY = PY.convertToPinyin(item1.CarFamilyName, '', true)

          } */
          let obj = {}
          obj.letter = item.letter
          obj.data = item.data.filter(item1 => {
            if (this.isChar(this.queryText)) { // 纯英文
              let item1PY
              let queryTextToLowerCase = this.queryText.toUpperCase() // 转换为大写拼音
              if (this.isChar(item1.CarFamilyName)) {
                item1PY = item1.CarFamilyName.toUpperCase()
                if (item1PY.indexOf(queryTextToLowerCase) !== -1) {
                  item1.queryText = this.queryText
                  return item1
                }
              } else {
                item1PY = PY.convertToPinyin(item1.CarFamilyName, '|') // 转换为大写拼音
                let arr = item1PY.split('|')
                let str = ''
                let repArr = []
                for (let it of arr) {
                  str += it
                  repArr.push(str)
                }
                item1PY = item1PY + '|' + repArr.join('|')
                let rep = new RegExp('\\b(' + item1PY + ')\\b', 'g')
                if (rep.test(queryTextToLowerCase)) {
                  item1.queryText = this.queryText
                  return item1
                }
              }
            } else {
              if (item1.CarFamilyName.indexOf(this.queryText) !== -1) {
                item1.queryText = this.queryText
                return item1
              }
            }
          })
          if (obj.data.length) {
            options.push(obj)
          }
        })
      }
      return options
    },
    carBrandOptions() {
      let options = []
      if (this.brandQueryText === '') {
        options = this.selectCarLogoList
      } else {
        this.selectCarLogoList.forEach((item) => {
          let obj = {}
          obj.label = item.label
          obj.value = item.value
          obj.CarBrandList = item.CarBrandList.filter((item1) => {
            if (this.isChar(this.brandQueryText)) { // 纯英文
              let item1PY
              let queryTextToLowerCase = this.brandQueryText.toUpperCase() // 转换为大写拼音
              if (this.isChar(item1.CarBrandName)) {
                item1PY = item1.CarBrandName.toUpperCase()
              } else {
                item1PY = PY.convertToPinyin(item1.CarBrandName) // 转换为大写拼音
                /* let replaceItem = item1.CarBrandName.replace(/\(|\)/g, '')
                item1PY = PY.convertToPinyin(replaceItem, '|') // 转换为大写拼音
                let arr = item1PY.split('|')
                let str = ''
                let repArr = []
                for (let it of arr) {
                  if (this.isChar(it)) {
                    str += it
                  }
                }
                let rep = new RegExp('\\b(' + item1PY + ')\\b', 'g')
                if (rep.test(queryTextToLowerCase)) {
                  item1.queryText = this.brandQueryText
                  return item1
                } */
              }
              if (item1PY.indexOf(queryTextToLowerCase) !== -1) {
                item1.queryText = this.brandQueryText
                return item1
              }
            } else {
              if (item1.CarBrandName.indexOf(this.brandQueryText.toUpperCase()) !== -1) {
                item1.queryText = this.brandQueryText
                return item1
              }
            }
          })
          if (obj.CarBrandList.length) {
            options.push(obj)
          }
        })
      }
      return options
    },
    carPatternOptions() {
      let options = []
      if (this.patternQueryText === '') {
        options = this.selectCarBrandList
        /* this.selectCarBrandList.forEach(item => {
          item.CarPatternList.forEach(item1 => {
            item1.queryText =''
          })
        }) */
      } else {
        this.selectCarBrandList.forEach((item) => {
          let obj = {value: item.value, label: item.label}
          obj.CarPatternList = item.CarPatternList.filter(item1 => {
            if (this.isChar(this.patternQueryText)) { // 纯英文
              let item1PY
              let queryTextToLowerCase = this.patternQueryText.toUpperCase() // 转换为大写拼音
              if (this.isChar(item1.CarStyleName)) {
                item1PY = item1.CarStyleName.toUpperCase()
              } else {
                item1PY = PY.convertToPinyin(item1.CarStyleName) // 转换为大写拼音
              }
              if (item1PY.indexOf(queryTextToLowerCase) !== -1) {
                item1.queryText = this.patternQueryText
                return item1
              }
            } else {
              if (item1.CarStyleName.indexOf(this.patternQueryText.toUpperCase()) !== -1) {
                item1.queryText = this.patternQueryText
                return item1
              }
            }
            /**/
          })
          if (obj.CarPatternList.length) {
            options.push(obj)
          }
        })
        // options = this.selectCarBrandList
      }
      return options
    }
  },
  beforeDestroy() {
    // this.SET_ALARM_LIST([])
    this.SET_SEARCH_TYPE(-1)
    if (bodyEle) {
      bodyEle.removeEventListener('click', this.listenerClick)
    }
  },
  watch: {
    isExpand(val) {
      if (val) {
        this.orgTreeSearch = ''
      } else {
        this.orgTreeSearch = this.changeCamera()
      }
    }
  }
}
</script>

<style lang="less">
  .intergratedQuery {
    width: 100%;
    margin-top: 16px;
    margin-bottom: 16px;
    display: flex;
    .main-content {

      flex-grow: 1;
      display: flex;
      flex-direction: column;
      .toolbar {
        display: flex;
        padding: 12px 24px 0;
        min-height: 54px;
        flex: 0 1 auto;
        background-color: #1b3153;
        .left-bar {
          .iview-input,
          .ivu-select {
            margin-right: 8px;
          }
          p{
            float: left;
            margin-bottom: 15px;
          }
          span.label {
            padding-right: 8px;
            font-size: 14px;
            vertical-align: middle;
          }
        }
        /*button {
          margin-right: 19px;
        }*/
      }

      .paging-footer {
        flex: 1 1 auto;
        min-height: 38px;
        display: flex;
        justify-content: flex-end;
        background-color: #244575;
        padding: 2px 16px 0;
      }
    }

  }
  .left-bar p{
    float: left;
    margin-bottom: 15px;
    margin-right: 12px;
    /deep/.ivu-icon-ios-close-empty:before{
      color: #fff;
    }
    height: 32px;
  }
  .left-bar p.button{
    float: right;
  }
  .left-bar span.label {
    padding-right: 8px;
    font-size: 14px;
    vertical-align: middle;
  }
  .search-result>li{
    width: 230px;
    height: 300px;
    float: left;
    border: 1px solid #ffffff;
    padding: 5px;
  }
  .location{
    display: inline-block;
    width: 150px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    position: relative;
    top: 2px;
  }
  .search .input {
    width: 320px;
    display: inline-block;
    height: 32px;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 12px;
    border: 1px solid #5676a9;
    border-radius: 4px;
    color: #ffffff;
    background-color: #1b3153;
    background-image: none;
    position: relative;
    cursor: text;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .input:focus {
    border-color: #6badfa;
    outline: 0;
    box-shadow: 0 0 0 0 #6badfa;
  }
  .search .btn {
    border: none;
    font-size: 14px;
    background: transparent;
    color: #fff;
    outline: none;
    cursor: pointer;
    position: relative;
    right: 19px;
    top: 1px;
  }
  .search-tree-info {
    position: absolute;
    border: #4699f9 1px solid;
    border-radius: 4px;
    padding: 5px;
    margin-top: 8px;
    background-color: #1b3153;
    width: 320px;
    max-height: 372px;
    overflow-y: auto;
    z-index: 100;
  }
  .search-tree-info.hidden {
    display: none;
  }
  .serach-condition{
    padding: 0 24px;
    height: auto;
    background-color: #1b3153;
  }
  .isactiveMore{
    background-color: #2b7bd6;
  }
  .content1{
    padding: 0;
    height: 100%;
  }
  .queryList{
    width: 100%;
    flex: 1 1 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 16px 0 0;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -ms-flex-line-pack: start;
    align-content: start;
    -ms-flex-align: start;
    align-items: start;
  }
  .no-result{
    width: 100%;
    height: 100%;
    background-color: #1b3153;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: center;
    justify-content: center;
  }
  .result{
    width: 100%;
    height: 100%;
    background-color: #1b3153;
    display: flex;
    flex-flow: wrap;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 12px 40px;
    align-items: flex-start;
  }
  .carNumberClass  input, .carNumberClass  input:hover,.carNumberClass  input:focus{
    border:1px solid red;
  }
 .select-data-style{
   width: 120px;
   height: 100%;
 }
 .car-select-data-style{
   height: 100%;
 }
  .select-data-style /deep/ .ivu-select-selection{
    height: 100%;
  }
  .select-data-style  /deep/ .ivu-select-selection>div> .ivu-tag>.ivu-tag-text{
    display: inline-block;
    max-width: 28px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
 .car-select-data-style /deep/ .ivu-select-selection>div{
  /* overflow-x: auto;
   overflow-y: hidden;*/
   display: inline-block;
   white-space: nowrap;
 }
  .car-select-data-style /deep/ .ivu-select-selection>div> .ivu-tag>.ivu-tag-text{
    /*max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;*/
    display: inline-block;
    max-width: 36px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .car-select-data-style /deep/ .ivu-select-selection>div> .ivu-tag> .ivu-icon-ios-close-empty,.select-data-style /deep/ .ivu-select-selection>div> .ivu-tag> .ivu-icon-ios-close-empty{
    top: -5px;
  }
  .select-data-style /deep/ .ivu-select-selection>div{
    display: inline-block;
 /*   max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;*/
    white-space: nowrap;
  }
  .select-data-style /deep/ .ivu-tag,.car-select-data-style /deep/ .ivu-tag{
    padding: 0 5px;
    margin-right: 0;
  }
  .select-data-style /deep/ .ivu-select-selection>div>.ivu-select-arrow,.car-select-data-style /deep/.ivu-select-selection>div>.ivu-select-arrow{
    right: 4px;
  }
  //.ivu-select-arrow
</style>
