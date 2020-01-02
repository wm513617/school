<template>
  <div class="container">
    <!-- 身份证读卡器控件 -->
    <div>
      <OBJECT ID="CertCtl"  name="CertCtl" CLASSID="CLSID:10946843-7507-44FE-ACE8-2B3483D179B7" width="0" height="0"></OBJECT>
    </div>
    <Row class="bs-content">
      <div class="bs-left">
        <div class="sidebar">
          <span>人员机构</span>
          <div class="tree-org">
            <BStreeNewBox ref="treebox" :iconToggle="false" :searchToggle="true" :searchType="0" :equipmentToggle="false" :resourceToggle="false" :btnGroup="true" :orgType="10" :resType="[0]" @clickData="getDevicesDataClick" @delData="delTreeData" @getOrgData="(data)=>{formData = { code: data.code, name: data.name }}">
              <template slot="dialog" slot-scope="orgName">
                <el-dialog class="dialog" width="400px" :visible="orgName.visible" :title="orgName.title" @close="orgCancel">
                  <el-form :model="formData" label-position="left" label-width="100px" ref="orgFormData" :rules="orgFormRole">
                    <el-fotmitem label="上级底库">
                      <div class="ivu-form-item-content-span">{{orgName.orgName}}</div>
                    </el-fotmitem>
                    <el-fotmitem label="底库编号" prop="code">
                      <el-input v-model="formData.code" placeholder="范围：0-65535" :maxlength="5" size="small"></el-input>
                    </el-fotmitem>
                    <el-fotmitem label="底库名称" prop="name">
                      <el-input v-model="formData.name" :maxlength="64" placeholder="请输入" size="small"></el-input>
                    </el-fotmitem>
                    <!-- <el-fotmitem label="底库类型" prop="libraryType">
                      <Select v-model="formData.libraryType" style="width:260px">
                        <Option v-for="item in libraryTypeArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </el-fotmitem> -->
                  </el-form>
                  <div slot="footer">
                    <el-button type="ghost" @click="orgCancel" size="small">取消</el-button>
                    <el-button type="primary" @click="orgSave" size="small">确认</el-button>
                  </div>
                </el-dialog>
              </template>
            </BStreeNewBox>
          </div>
        </div>
      </div>
      <div class="bs-main">
        <!-- 资源添加弹出框 -->
        <div v-if="resAddModal" class="iviewVisible">
          <Modal :mask-closable="false" v-model="resAddModal" :title="isAdd ? '人员添加' : '人员修改'" width="700">
            <div class="res-add-model">
              <div class="res-model-tree" v-if="resAddModal === true">
                <div class="res-edit-form">
                  <div class="content-left">
                    <div style="width：260px;height:270px;"  id="my_camera" v-show="picStatus">
                    </div>
                    <div class="mPhoto">
                      <span class="iconfont icon-screenshot" @click="photoFn" v-if="photoButton"></span>
                    </div>
                    <!-- <Button :disabled='picIcon' type="ghost" class="photo" @click="photoFn">{{screenshots?'重拍':'拍照'}}</Button> -->
                    <!-- <Button :disabled='!screenshots' type="ghost" class="capture" @click="uploadCapture" icon="ios-cloud-upload-outline">上传</Button> -->
                    </div>
                  <Form label-position="left" :label-width="80" :model="resEditFormData" ref="resEditForm"
                        :rules="resFormRole">
                    <Form-item label="*姓名" prop="name">
                      <Input v-model="resEditFormData.name" :maxlength="32" placeholder="请输入" style="width:200px"></Input>
                    </Form-item>
                    <Form-item label="性别" prop="sex">
                      <Select v-model="resEditFormData.sex" style="width:200px">
                        <Option v-for="opt in sexDict" :value="opt.value" :key="opt.label">{{ opt.label }}</Option>
                      </Select>
                    </Form-item>
                    <Form-item label="*人员编号" prop="uid">
                      <Input v-model="resEditFormData.uid" :disabled="peopleCard" :maxlength="32" placeholder="请输入" style="width:200px"></Input>
                    </Form-item>
                    <Form-item label="民族" prop="national">
                      <Input v-model="resEditFormData.national" placeholder="请输入" style="width:200px"></Input>
                    </Form-item>
                    <Form-item label="联系方式" prop="phone">
                      <Input v-model="resEditFormData.phone" placeholder="请输入" style="width:200px"></Input>
                    </Form-item>
                    <Form-item label="身份证地址" prop="codeAddress">
                      <Input v-model="resEditFormData.codeAddress" placeholder="请输入" style="width:330px"></Input>
                    </Form-item>
                    <Form-item label="居住地址" prop="liveAddress">
                      <Input v-model="resEditFormData.liveAddress" placeholder="请输入" style="width:330px"></Input>
                    </Form-item>
                    <div class="form-right">
                      <Form-item label="人员卡号" prop="card">
                      <Input v-model="resEditFormData.card" :maxlength="32" placeholder="请输入" style="width:200px"></Input>
                    </Form-item>
                    <Form-item label="失效时间">
                      <DatePicker type="datetime" :options="options3" placeholder="Select date" style="width: 200px" :value="resEditFormData.failure" @on-change="handleChange"></DatePicker>
                    </Form-item>
                    <Form-item label="人员类型" prop="type">
                      <Select v-model="resEditFormData.type" style="width:200px" @on-change="checkUserType">
                        <Option v-for="opt in userTypeAdd" :value="opt.value" :key="opt.label">{{ opt.label }}</Option>
                      </Select>
                    </Form-item>
                    <Form-item label="门禁权限" prop="permission" v-if="peopleEdit">
                      <Select v-model="resEditFormData.permission" style="width:200px" multiple>
                        <Option v-for="opt in doorAccess" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>
                      </Select>
                    </Form-item>
                    <Form-item label="人脸权限" prop="faceAccess" v-if="peopleEdit">
                      <Select  v-model="resEditFormData.facePermission" style="width:200px" :max-tag-count="1" :max-tag-placeholder="maxTagPlaceholder" multiple @on-change="checkFaceAccess">
                        <Option v-for="opt in faceAccessArr" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>
                      </Select>
                    </Form-item>
                    </div>
                    <!--                                        <Form-item label="权限组" prop="permissionId">-->
                    <!--                                          <Select v-model="resEditFormData.permissionId">-->
                    <!--                                            <Option v-for="opt in authorityArray" :value="opt._id" :key="opt.name">{{ opt.name }}</Option>-->
                    <!--                                          </Select>-->
                    <!--                                        </Form-item>-->
                  </Form>
                </div>
                <div class="content-right" >
                  <div class="user-logo">
                    <img ref="userLogo" :src="logoImgSrc" v-if="logoImgSrc !== ''">
                  </div>
                  <Upload action="/api/upload/file?type=image&category=peopleDir" :headers="headerObj" name="file"
                          style="margin:16px; position: absolute; top:170px; right:35px"
                          :show-upload-list="false"
                          :format="['jpg','png','bmp','jpeg']"
                          :on-success="importSuccess"
                          :on-format-error="formatError"
                          :on-exceeded-size="exceededSize">
                          <div class="uploadPhoto">
                            <span class="iconfont icon-add" v-if="logoImgSrc == ''"></span>
                          </div>
                    <!-- <Button type="ghost" icon="ios-cloud-upload-outline">上传本地图片</Button> -->
                  </Upload>
                  <!-- <div style="position: absolute; top:180px">
                    支持JPG、JPEG、PNG、BMP格式的图片，建议有效人脸像素80-200，图片分辨率请勿过大。
                  </div> -->
                </div>
              </div>
            </div>
            <div slot="footer">
              <Button type="ghost" style="float:left" @click="readCard">读卡</Button>
              <Button type="ghost" @click="resAddCancel">取消</Button>
              <Button type="primary" @click="resAddSave" :loading="modalloading">确认</Button>
            </div>
          </Modal>
        </div>
        <!-- 资源移动弹出框 -->
        <div>
          <Modal :mask-closable="false" v-model="devMoveModal" title="设备移动" width="500">
            <div class="res-add-model">
              <p>选择机构,将人员移动到当前机构下</p>
              <div class="res-move-model">
                <div style="width:100%;">
                  <BStreeNewBox :iconToggle="false" :searchToggle="false" :searchType="0" :equipmentToggle="false"
                         :scroll="true"  :resourceToggle="false" :btnGroup="false" :orgType="10" :resType="[0]"
                              @clickData="selectMoveOrg"></BStreeNewBox>
                </div>
              </div>
            </div>
            <div slot="footer">
              <Button type="ghost" @click="devMoveModal=false">取消</Button>
              <Button type="primary" @click="resMoveSave">确认</Button>
            </div>
          </Modal>
        </div>
        <div class="resource-right-table">
          <div class="table-header">
            <!--            <TableTab @on-tab-click="resTabClick" :tabs="resTabs" :isCount="true"></TableTab>-->
            <div class="table-header-actions clear">
              <div class="actions-btn">
                <Button type="ghost" icon="plus" @click="resAddOpen" v-if="resTabs[resActiveTab].btnShow.add">添加
                </Button>
                <Button type="ghost" icon="trash-a" @click="resDelPerson" v-if="resTabs[resActiveTab].btnShow.delete"
                        :disabled="ModifyPerson.length==0">删除
                </Button>
                <Button type="ghost" icon="edit" @click="resModifyOpen" v-if="resTabs[resActiveTab].btnShow.modify"
                        :disabled="ModifyPerson.length!==1">修改
                </Button>
                <Button type="ghost" icon="arrow-move" @click="resMoveOpen" v-if="resTabs[resActiveTab].btnShow.move"
                        :disabled="ModifyPerson.length!==1">移动
                </Button>
                <Button type="ghost" icon="" @click="resTablegetOneCard" v-if="resTabs[resActiveTab].btnShow.Obtain">
                  获取
                </Button>

                <Poptip placement="bottom-start" width="200">
                  <Button type="ghost" icon="ios-copy" v-if="resTabs[resActiveTab].btnShow.copy">复制到</Button>
                  <div class="api" slot="content">
                    <ul style="width:100%;" class="bottomBank">
                      <li v-for="item in OrgainGroup" @click="addBottomBank(item)">{{item.name}}</li>
                    </ul>
                  </div>
                </Poptip>
                <template>

                </template>
                <Button type="ghost" icon=" ivu-icon iconfont ios-sync" @click=""
                        v-if="resTabs[resActiveTab].btnShow.synchronization">同步到
                </Button>

                <Poptip placement="bottom-start" width="120">
                  <Button type="ghost" icon="ivu-icon iconfont icon-import" v-if="resTabs[resActiveTab].btnShow.input">
                    导入
                  </Button>
                  <div class="api" slot="content">
                    <ul style="width:100%;" class="bottomBank">
                      <li @click="downloadModule">下载模版</li>
                      <Upload style="display:inline-block;width: 100%" ref="upload" name="file" :headers="headerObj"
                              :action="`/api/through/users/importExcel?org=${getListParams.orgId}`" :format="['xls','xlsx']"
                              :on-success="uploadSuc"
                              :on-error="uploadError" :on-format-error="formatError" :show-upload-list="false"
                              :on-progress="progressExcel">
                        <li>导入表格</li>
                      </Upload>

                      <li @click="showUpload=true">导入照片</li>
                    </ul>
                  </div>
                </Poptip>
                <Poptip placement="bottom-start" width="120">
                  <Button type="ghost" icon="ivu-icon iconfont icon-export" v-if="resTabs[resActiveTab].btnShow.output">
                    导出
                  </Button>
                  <div class="api" slot="content">
                    <ul style="width:100%;" class="bottomBank">
                      <li @click="exportExcelUserFuc">导出Excel</li>
                      <li @click="resOutput">导出照片</li>
                    </ul>
                  </div>
                </Poptip>
                <!-- 选择权限 -->
                <Poptip placement="bottom-start" width="120">
                  <Button type="ghost" v-if="resTabs[resActiveTab].btnShow.output" :disabled="ModifyPerson.length==0">
                    修改权限
                  </Button>
                  <div class="api" slot="content">
                    <ul style="width:100%;" class="bottomBank">
                      <li @click="openDoorAccess">门禁权限</li>
                      <li @click="openFaceAccess">人脸权限</li>
                    </ul>
                  </div>
                </Poptip>
                <Button type="ghost" icon="refresh" @click="resTableFresh" v-if="resTabs[resActiveTab].btnShow.resfesh">
                  刷新
                </Button>
                <Checkbox v-model="getListParams.showChildren" @on-change="showChildRefresh"
                          v-if="resTabs[resActiveTab].btnShow.equipment">显示子机构设备
                </Checkbox>

              </div>
              <div class="actions-search">
                <div v-if="resTabs[resActiveTab].btnShow.personType">
                  <label>人员类型</label>
                  <Select style="width:100px;" placeholder="人员类型" @on-change="selectChannelName"
                          v-model="getListParams.type">
                    <Option v-for="opt in userType" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>
                  </Select>
                </div>
                <div v-if="resTabs[resActiveTab].btnShow.synchronizationStatus">
                  <label>通行方式</label>
                  <Select style="width:100px" placeholder="通行方式" v-model="getListParams.guard">
                    <Option @click.native="selectBatchStream(opt.value)" v-for="opt in batchStreamOpts"
                            :value="opt.value" :key="opt.value">{{ opt.label }}
                    </Option>
                  </Select>

                </div>
                <Input placeholder="请输入姓名或人员编号" style="width: 220px" v-model="getListParams.keyWord"
                       @keyup.enter.native="seekResData()">
                <Button slot="append" @click="seekResData()">搜索</Button>
                </Input>
              </div>
              <!--            </div>-->
            </div>
            <div class="table-relative" ref="tableBox" >
              <div class="table-body table-cover">
                <Table size="small" :columns="resColumns[resActiveTab]" :data="resourceTableData" :highlight-row="true"
                      :height="tableHeight" @on-selection-change="selectResRow" width="100%" ref="personTable"></Table>
              </div>
            </div>
            <div class="table-footer">
              <div style="float:left">
                <Button @click="deleteAllUserFuc">全部删除</Button>
                <Button @click="handleSelectAll(true)">全部选中</Button>
              </div>
              <div style="float: right;">
                <Page show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange"
                      :total="page.total" :current="pageCur" :page-size="page.pageSize" show-total show-elevator
                      @on-change="changeResPage"></Page>
              </div>
            </div>
          </div>
        </div>

        <!-- 文件上传进度条 -->
        <div>
          <Modal :mask-closable="false" v-model="progressModal" :title="importTitle" width="450"
                 @on-cancel="modalCancel">
            <div class="res-add-model">
              <div style="height: 100px;width: 100%;line-height: 100px;">
                <Progress :percent="percentPer" v-show="importTitle==='数据导入'"/>
                <div style="width: 100%;height:40px;display: flex;justify-content:flex-start "
                     v-show="importTitle==='导入结果'">
                  <div style="padding-right:20px;line-height: 40px">
                    <b>全部数据：</b>
                    <b>{{importSaveData.success.length + importSaveData.fail.length}}</b>
                  </div>
                  <div style="padding-right:20px;;line-height: 40px">
                    <b>导入成功：</b>
                    <b>{{importSaveData.successLength}}</b>
                  </div>
                  <div style="padding-right:20px;;line-height: 40px">
                    <b>导入失败：</b>
                    <b>{{importSaveData.failLength}}</b>
                  </div>
                  <div style="padding-right:0px;;line-height: 40px">
                    <b v-if="importForm.group=='c'">导入成功，等待下发</b>
                  </div>
                </div>
                <div style="width: 100%;height:40px;display: flex;justify-content:flex-start "
                     v-show="importTitle==='导入结果'">
                  <Button type="ghost" @click="downLoadImportFile">下载导入结果</Button>
                </div>
              </div>
            </div>
            <div slot="footer">
              <Button type="ghost" @click="importTitle='导入结果'" v-show="importTitle==='数据导入'">取消</Button>
              <Button type="primary" @click="progressModalOk" v-show="importTitle==='导入结果'">确认</Button>
            </div>
          </Modal>
        </div>

        <!-- 图片导入-->
        <Modal title="批量导入" v-model="showUpload" :percentPermask-closable="false" @on-visible-change="closeUploadModel">
          <Form ref="batUploadForm" :label-width="85" label-position="left" :model="importForm" :rules="batUpload">
            <p style="fontSize:'12px';color: red;">请先导入excel数据，然后在导入照片</p>
            <FormItem label="识别信息">
              <RadioGroup v-model="importForm.group" @on-change="importFormGroupChange">
                <Radio label="a">卡号</Radio>
                <Radio label="b">人员编号</Radio>
                <Radio label="c">不匹配(新建)</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="识别图片">
              <!--              :data="importForm"-->
              <Upload class="btn" ref="importUpload" name="file" :headers="headerObj"
                      multiple
                      :max-size="512"
                      :action="'/api/upload/file?type=image&category=peopleDir'"
                      :on-success="uploadPicSuc"
                      :on-error="uploadPicError"
                      :on-exceeded-size="importExceededSize"
                      :before-upload="importBefore"
                      :show-upload-list="false">
                <Button type="ghost" icon="ios-cloud-upload-outline">上传</Button>
              </Upload>
              <p v-show="importFileNewList.length || importTypeErrorList.length" style="color: darkgray;">
                已选择{{importFileNewList.length || 0}}张 &nbsp;&nbsp;
                <span v-if="importTypeErrorList.length">
                <i class="ivu-icon ivu-icon-android-alert" style="font-size: 16px; color: #855f23;"></i>
                错误格式文件{{importTypeErrorList.length || 0}}个
              </span>
              </p>
              <div class="upload-tips" v-if="importForm.group=='c'">
                为确保正确解析，文件名请以勾选信息格式顺序命名!
                <br/>&nbsp;&nbsp;如：姓名_性别_卡号_人员编号.jpg
              </div>
              <div v-show="importStatus" class="import-result">
                <!--                <div class="result-count">-->
                <!--                  <span>成功：{{importMatchingFileSucList.length}}</span>-->
                <!--                  <span>失败: {{importErrorPic.length + importMaxSizeFiles.length}}</span>-->
                <!--                </div>-->
                <!--                <fieldset class="import-error-list"-->
                <!--                          v-show="importMaxSizeFiles.length">-->
                <!--                  <legend>{{importMaxSizeFiles.length}}个文件大小超过限制:</legend>-->
                <!--                  <bs-scroll ref="scroll" style="height: 70px;">-->
                <!--                    <p v-for="(item,index) in importMaxSizeFiles" :key="index">{{item.name}}</p>-->
                <!--                  </bs-scroll>-->
                <!--                </fieldset>-->
                <!--                <fieldset class="import-error-list"-->
                <!--                          v-show="importErrorPic.length">-->
                <!--                  <legend>{{importErrorPic.length}}个文件上传失败:</legend>-->
                <!--                  <bs-scroll ref="scroll2" style="height: 70px;">-->
                <!--                    <p v-for="(item,index) in importErrorPic" :key="index">{{item.name}}</p>-->
                <!--                  </bs-scroll>-->
                <!--                </fieldset>-->
                <fieldset class="import-error-list"
                          v-show="importMatchingNameFailList.length">
                  <legend>{{importMatchingNameFailList.length}}个文件名匹配失败:</legend>
                  <bs-scroll ref="scroll2" style="height: 70px;">
                    <p v-for="(item,index) in importMatchingNameFailList" :key="index">{{item.name}}</p>
                  </bs-scroll>
                </fieldset>

              </div>
            </FormItem>
            <FormItem v-if="importPicProcess">
              <Progress :percent="importPicProcessNum" status="active"/>
            </FormItem>

          </Form>
          <div slot="footer" style="position:relative;z-index:99">
            <Button type="ghost" @click="datchCancal">取消</Button>
            <Button type="primary" @click="batchSure" :disabled='batchSureDisable'>确定</Button>
          </div>
        </Modal>

        <!--导出弹窗-->
        <Modal title="导出" v-model="showExportModel" :percentPermask-closable="false">
          <div>
            <Table border :columns="exportDataColumns" :data="exportData"></Table>
          </div>
        </Modal>
        <!-- 门禁权限弹框 -->
        <Modal title="门禁权限" v-model="doorAccessModel" :percentPermask-closable="false" @on-ok="resdoorAccess" @on-cancel="resdoorAccessCancel">
          <Form label-position="left" :label-width="100" :model="resEditFormData" ref="resDoorEditForm" :mask-closable="false">
          <Form-item label="添加门禁权限" prop="facePermission">
              <Select  v-model="resEditFormData.facePermission"  style="width:200px" :max-tag-count="1"   multiple @on-change="addDoorAccess">
                <Option v-for="opt in doorAccess" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>
            </Select>
          </Form-item>
          </Form>
        </Modal>
        <!-- 人脸权限弹框 -->
        <Modal title="人脸权限" v-model="faceAccessModel" :percentPermask-closable="false" @on-ok="resfaceAccess" @on-cancel="faceAccessModelCancel">
          <span style="color:red">*设置人脸权限须设置失效时间并且有人员照片，否则该人员设置权限失败！</span>
          <div>
            <Form label-position="left" :label-width="100" :model="resEditFormData" ref="resFaceEditForm" :mask-closable="false">
            <Form-item label="添加人脸权限" prop="permission">
            <Select  v-model="resEditFormData.permission"  style="width:200px"  :max-tag-count="1"  multiple @on-change="addFaceAccess">
                <Option v-for="opt in faceAccessArr" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>
            </Select>
            </Form-item>
            </Form>
          </div>
        </Modal>
        <div v-if="detailModal" class="iviewVisible">
          <Modal :mask-closable="false" title="人员信息" v-model="detailModal"  width="700">
            <div class="res-model-tree" v-if="detailModal === true">
            <Form label-position="left" :label-width="80" :model="peopleDetail">
              <div class="detail-user-logo">
                  <img ref="userLogo" :src="peopleImgSrc" >
              </div>
              <div class="detail-user-left">
                <Form-item label="姓名:">
                <div style="width:100px">{{peopleDetailModal[0].name}}</div>
              </Form-item>
              <Form-item label="性别:">
                <div style="width:200px">{{peopleDetailModal[0].sex == 1 ? '男' : '女'}}</div>
              </Form-item>
              <Form-item label="人员编号:">
                <div style="width:200px">{{peopleDetailModal[0].uid}}</div>
              </Form-item>
              <Form-item label="民族:">
                <div style="width:200px">{{peopleDetailModal[0].national}}</div>
              </Form-item>
              <Form-item label="联系方式:">
                <div style="width:200px">{{peopleDetailModal[0].phone}}</div>
              </Form-item>
              <Form-item label="身份证地址:">
                <div style="width:230px">{{peopleDetailModal[0].codeAddress}}</div>
              </Form-item>
              <Form-item label="居住地址:">
                <div style="width:200px">{{peopleDetailModal[0].liveAddress}}</div>
              </Form-item>
              </div>
              <div class="detail-user-right">
                <Form-item label="人员卡号:">
                <div style="width:200px">{{peopleDetailModal[0].card}}</div>
              </Form-item>
              <Form-item label="失效时间:">
                <div style="width:200px">{{peopleDetailModal[0].failure}}</div>
              </Form-item>
              <Form-item label="用户类型:">
                <div style="width:200px">{{peopleDetailModal[0].type === 2 ? '白名单': peopleDetailModal[0].type === 1 ?  '黑名单' : '灰名单'}}</div>
              </Form-item>
              <Form-item label="门禁权限:">
                <div style="width:200px">{{detailDoorAccess + ''}}</div>
              </Form-item>
              <Form-item label="人脸权限:">
                <div style="width:200px">{{detailFaceAccess + ''}}</div>
              </Form-item>
              </div>
            </Form>
            </div>
          </Modal>
        </div>
      </div>
    </Row>
  </div>
</template>
<script>
import BStreeNewBox from '../../../components/BStreeNew/BStreeNewBox'
import TableTab from '../../settings/equipment/tableTab'
import { download } from '../../../common/download'
import { mapState, mapActions, mapGetters } from 'vuex'
// import { save } from '../../../../storage'
// import './facePage/tree.css'
import { JSONToExcelConvertor } from '../jsonToExcel'
import { getPermissionGroup, getFaceBase, readCardMessage, addPermissionUser, addLibraryUser } from './api'
import axios from 'axios'
import Webcam from 'webcamjs'
import JSZip from 'jszip'
export default {
  name: 'personnelManagement',
  components: {
    BStreeNewBox,
    TableTab
  },
  data() {
    const validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('名称不能为空'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback()
        // return
      } else {
        var phoneReg = /^1(3|4|5|7|8)\d{9}$/
        if (!phoneReg.test(value)) {
          callback(new Error('电话号输入有误'))
        } else {
          callback()
        }
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value === undefined) {
        callback(new Error('人员编号不能为空'))
      } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
        callback(new Error('人员编号只支持字母和数字'))
      } else {
        callback()
      }
    }
    const verifyName = (rule, value, callback) => {
      let nativecode = value.split('')
      let len = 0
      for (let i = 0; i < nativecode.length; i++) {
        let code = Number(nativecode[i].charCodeAt(0))
        if (code > 127) {
          len += 2
        } else {
          len++
        }
      }
      if (len > 64) {
        return callback(new Error('不能超过64位字符'))
      } else {
        callback()
      }
    }
    const verifyCode = (rule, value, callback) => {
      if (value > 65535) {
        return callback(new Error('底库编号范围0-65535'))
      } else {
        callback()
      }
    }
    const verifyNumber = (rule, value, callback) => {
      let r = /(^[1-9]([0-9]*)$|^[0-9]$)/
      if (value === '') {
        return callback(new Error('不可以为空'))
      }
      if (r.test(value)) {
        if (Number(value) > 65535) {
          return callback(new Error('超过最大值'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('请输入有效数字'))
      }
    }
    const noSpace = (rule, value, callback) => {
      let r = /\s+/g
      if (r.test(value)) {
        return callback(new Error('不可以输入空格！'))
      } else {
        callback()
      }
    }
    return {
      picStatus: false, // 摄像
      isAdd: true, // 添加还是修改
      picIcon: true, // 摄像图标
      screenshots: false, //
      AccessArr: [], // 获取到的权限数组
      capture: '', // 拍照
      photoButton: false, // 拍照按钮
      imgFile: '',
      roleId: '',
      peopleCard: false,
      faceNum: 0,
      peopleEdit: true,
      addDoorAccessArr: [], // 要设置的人脸
      addFaceAccessArr: [], // 要设置的门禁
      selectAll: false, // 是否全选
      selectePeople: [], // 选中的人
      detailFaceAccess: [], // 人员详情展示的人脸权限
      detailDoorAccess: [], // 人员详情展示的门禁权限
      formData: {
        code: '', // 底库编号
        name: '' // 底库名称
        // libraryType: 2 // 底库类型
      },
      orgFormRole: { // 验证规则
        name: [
          { required: true, message: '底库名称不能为空', trigger: 'change' },
          { validator: noSpace, trigger: 'change' },
          { validator: verifyName, trigger: 'change' }
        ],
        code: [
          { required: true, message: '底库编号不能为空', trigger: 'blur' },
          { validator: noSpace, trigger: 'change' },
          { validator: verifyCode, trigger: 'change' }
        ],
        libraryCode: [{ required: true, validator: verifyNumber, trigger: 'change' }]
      },
      showExportModel: false, // 导出
      doorAccessModel: false, // 门禁权限弹框
      faceAccessModel: false, // 人脸权限弹框
      detailModal: false, // 人员管理详情弹框
      logoImgSrc: '', // 上传图片成后，显示的图片地址
      peopleImgSrc: '', // 点击人员详情的图片地址
      uploadPicPutPersonCount: 0, // 匹配图片和表格向后台请求次数
      downLoadIsPic: false, // 下载导入结果开关，true 下载图片导入结果，false 下载表格导入数据
      batchSureDisable: false,
      showUpload: false, // 图片导入弹窗
      importSaveData: {
        successLength: 0,
        failLength: 0,
        success: [],
        fail: []
      },
      // 添加人员日期选择范围
      options3: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now()
        }
      },
      importTitle: '数据导入',
      percentTimer: '',
      percentPer: 0,
      progressModal: false, // 进度条弹窗
      OrgainGroup: [], // 底库列表
      headerObj: { Authorization: '' },
      page: {
        total: 0,
        current: 1,
        pageSize: this.$PageInfo.limit
      },
      peopleDetailModal: [], // 人员详情弹框展示的数据
      modalloading: false,
      isEdit: false,
      resourceTableData: [],
      ModifyPerson: [],
      deleteArr: [], // 选中人员的ID
      orgId: '', // 选中的机构id
      // 新增表单验证
      resFormRole: {
        name: [{ validator: validateName, trigger: 'change' }],
        phone: [{ validator: validatePhone, trigger: 'change' }],
        uid: [{ validator: validateCode, trigger: 'change' }]
        // card: [{ validator: validateCard, trigger: 'blur' }],
        // code: [{ validator: validateUid, trigger: 'blur' }]
      },
      // 新增表单数据
      resEditFormData: {
        orgId: '',
        name: '',
        sex: 1,
        phone: '',
        type: 2,
        url: '',
        card: '',
        code: '',
        // permissionId:'',
        faceAccess: '',
        codeAddress: '', // 身份证地址
        uid: '',
        national: '', // 民族
        liveAddress: '', // 居住地址
        permission: [], // 门禁权限
        failure: '', // 失效时间
        // 已选中人脸权限对应库的ID
        facePermission: []
      },
      // 获取表格数据参数
      getListParams: {
        pageNum: 1,
        pageSize: this.$PageInfo.limit,
        orgId: '',
        type: 3,
        guard: 5, // 同步状态 1 暂不能刷卡或刷脸 2 仅可刷卡 3 仅可刷脸 4 都可以
        showChildren: true, // 是否显示子机构下的数据 true 是 false 否
        keyWord: '' // 关键字搜索姓名或人员编号
      },
      // 获取权限参数
      assignAccessParams: {
        roleId: '',
        resId: this.orgId,
        type: 10
      },
      // 用户类型字典
      userType: [
        {
          label: '黑名单',
          value: 0
        },
        {
          label: '灰名单',
          value: 1
        },
        {
          label: '白名单',
          value: 2
        },
        {
          label: '全部',
          value: 3
        }
      ],
      userTypeAdd: [
        {
          label: '黑名单',
          value: 0
        },
        {
          label: '灰名单',
          value: 1
        },
        {
          label: '白名单',
          value: 2
        }
        //          {
        //            label:'全部',
        //            value:3
        //          }
      ],
      // 底库类型
      // libraryTypeArr: [
      //   {
      //     label: '黑名单类型',
      //     value: 0
      //   },
      //   {
      //     label: '灰名单类型',
      //     value: 1
      //   },
      //   {
      //     label: '白名单类型',
      //     value: 2
      //   }
      // ],
      // 性别
      sexDict: [
        {
          label: '男',
          value: 1
        },
        {
          label: '女',
          value: 2
        }
      ],
      // 门禁权限
      doorAccess: [],
      // 人脸权限总数组
      faceAccess: [],
      // 人脸权限黑、白名单数组
      faceAccessArr: [],
      resAddModal: false,
      route: '',
      isSearch: false,
      tableHeight: 435,
      pageLimit: this.$PageInfo.limit,
      pageCur: 1,
      filterKey: '',
      resActiveTab: 0,
      isShowSubecMhanismEquipment: [true, true, true, true, true],
      batchStreamOpts: [
        // 同步状态字典
        {
          label: '未同步',
          value: 1
        },
        {
          label: '仅可刷卡',
          value: 2
        },
        {
          label: '仅可刷脸',
          value: 3
        },
        {
          label: '全部',
          value: 5
        }
      ], // 同步状态字典
      resTabs: [
        {
          title: '人员',
          value: 0,
          disabled: false,
          active: true,
          number: 5,
          btnShow: {
            add: true,
            delete: true,
            modify: true,
            move: true,
            Obtain: false, // 获取
            copy: true,
            synchronization: false,
            resfesh: true,
            equipment: true,
            personType: true,
            synchronizationStatus: true,
            input: true,
            output: true
          }
        },
        {
          title: '权限组',
          value: 1,
          disabled: false,
          active: false,
          number: 5,
          btnShow: {
            add: false,
            delete: false,
            modify: false,
            move: true,
            Obtain: false, // 获取
            synchronization: false, // 同步
            copy: true,
            resfesh: true,
            equipment: true,
            personType: false,
            synchronizationStatus: false
          }
        }
      ],
      // 人员详情弹框数据
      peopleDetail: {
        name: '',
        sex: '',
        uid: '',
        national: '',
        phone: '',
        codeAddress: '',
        liveAddress: '',
        card: '',
        failure: '',
        type: ''
      }, // 人员详情数据
      resColumns: [
        [
          {
            type: 'selection',
            width: 60,
            align: 'left'
          },
          {
            title: 'ID',
            type: 'index',
            align: 'left',
            width: 60
          },
          {
            title: '用户名称',
            key: 'name',
            align: 'left',
            minWidth: 50
          },
          {
            title: '性别',
            key: 'sex',
            align: 'left',
            minWidth: 50,
            render: (h, params) => {
              let text = ''
              if (params.row.sex == 1) {
                text = '男'
              } else {
                text = '女'
              }
              return h('span', text)
            }
          },
          {
            title: '人员编号',
            key: 'uid',
            align: 'left',
            minWidth: 80
          },
          {
            title: '卡号',
            key: 'card',
            align: 'left',
            minWidth: 60
          },

          {
            title: '人像库',
            key: 'orgName',
            align: 'left',
            minWidth: 80
          },
          {
            title: '联系电话',
            key: 'phone',
            align: 'left',
            minWidth: 80
          },
          {
            title: '人员类型',
            key: 'type',
            align: 'left',
            minWidth: 60,
            render: (h, params) => {
              let text = ''
              switch (params.row.type) {
                case 2:
                  text = '白名单'
                  break
                case 1:
                  text = '灰名单'
                  break
                case 0:
                  text = '黑名单'
                  break
              }
              return h('span', text)
            }
          },
          {
            title: '操作',
            key: 'action',
            minWidth: 60,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'ghost',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: e => {
                        this.detailFaceAccess = []
                        this.detailDoorAccess = []
                        this.peopleDetailModal = []
                        this.detailModal = true
                        this.peopleImgSrc = params.row.image
                        this.peopleDetailModal.push(params.row)
                        getFaceBase().then(res => { // 获取人脸权限渲染到人员详情
                          if (res.data.code === 200) {
                            this.faceAccess = res.data.list
                            if (this.peopleDetailModal[0].type == 0) {
                              this.faceAccess.blacklists.forEach(item => {
                                this.faceAccessArr.push({
                                  value: item.libraryId,
                                  label: item.libraryName
                                })
                              })
                            } else {
                              this.faceAccessArr = []
                              this.faceAccess.whitelists.forEach(item => {
                                this.faceAccessArr.push({
                                  value: item.libraryId,
                                  label: item.libraryName
                                })
                              })
                            }
                            this.peopleDetailModal[0].facePermission.forEach((item) => {
                              this.faceAccessArr.forEach((j) => {
                                if (Number(item) === j.value) {
                                  this.detailFaceAccess.push(j.label)
                                }
                              })
                            })
                            this.detailFaceAccess = this.detailFaceAccess.join(',')
                          }
                        })
                        getPermissionGroup().then(res => { // 获取门禁权限渲染到人员详情
                          if (res.data.code === 200) {
                            res.data.data.forEach((item) => {
                              params.row.permission.forEach((i) => {
                                if (item._id === i) {
                                  this.detailDoorAccess.push(item.name)
                                }
                              })
                            })
                            this.detailDoorAccess = this.detailDoorAccess.join(',')
                          }
                        })
                      }
                    }
                  },
                  '详情'
                )
              ])
            }
          },
          {
            title: '通行方式',
            key: 'type',
            align: 'left',
            minWidth: 60,
            render: (h, params) => {
              let text = []
              switch (params.row.guard) {
                case 1:
                  break
                case 2:
                  text = [
                    h('span', {
                      props: {},
                      style: {},
                      class: 'iconfont icon-yikatong'
                    })
                  ]
                  break
                case 3:
                  text = [
                    h('span', {
                      props: {},
                      class: 'iconfont icon-renlianshibie'
                    })
                  ]
                  break
                case 4:
                  text = [
                    h('span', {
                      props: {},
                      class: 'iconfont icon-renlianshibie',
                      style: {
                        display: 'inline-block',
                        marginRight: ' 5px'
                      }
                    }),
                    h('span', {
                      props: {},
                      style: {},
                      class: 'iconfont icon-yikatong'
                    })
                  ]
                  break
              }
              return h('span', text)
            }
          }
        ],
        [
          {
            type: 'selection',
            width: 60,
            align: 'left'
          },
          {
            title: '序号',
            type: 'index',
            align: 'left',
            width: 60
          },
          {
            title: '通道名称',
            key: 'name',
            align: 'left',
            minWidth: 165
          },
          {
            title: 'IP地址',
            key: 'type',
            align: 'left',
            minWidth: 60,
            render: (h, params) => {
              let text = ''
              switch (params.row.type) {
                case 0:
                  text = '视频通道'
                  break
                case 1:
                  text = '报警输入'
                  break
                case 2:
                  text = '输出通道'
                  break
                case 3:
                  text = '对讲通道'
                  break
                case 4:
                  text = '门禁通道'
                  break
              }
              return h('span', text)
            }
          },
          {
            title: '所属设备',
            key: 'device',
            minWidth: 60,
            align: 'left',
            render: (h, params) => {
              let text = ''
              if (params.row.eid) {
                text = params.row.eid.name
              } else {
                text = '...'
              }
              return h('span', text)
            }
          },
          {
            title: '设备IP',
            key: 'ip',
            align: 'left',
            minWidth: 110,
            render: (h, params) => {
              let text = params.row.ip
              return h('span', text)
            }
          },
          {
            title: '通道号',
            key: 'chan',
            align: 'left',
            minWidth: 50
          },
          {
            title: '状态',
            key: 'monitortype',
            align: 'left',
            minWidth: 75,
            render: (h, params) => {
              let text = ''
              switch (params.row.monitortype) {
                case 0:
                  text = '枪机'
                  break
                case 1:
                  text = '红外枪机'
                  break
                case 2:
                  text = '半球'
                  break
                case 3:
                  text = '快球'
                  break
                case 4:
                  text = '全景'
                  break
              }
              return h('span', text)
            }
          },
          {
            title: '分析服务器',
            key: 'passway',
            minWidth: 65,
            align: 'left',
            render: (h, params) => {
              let text = ''
              let n = params.row.passway
              if (n === 0) {
                text = '普通'
              } else if (n === 1) {
                text = '入口'
              } else if (n === 2) {
                text = '出口'
              }
              return h('span', text)
            }
          },
          {
            title: '流地址',
            key: 'stream',
            align: 'left',
            minWidth: 60,
            render: (h, params) => {
              let text = ''
              let t = params.row.stream
              if (t === 'main') {
                text = '主码流'
              } else if (t === 'sub1') {
                text = '子码流'
              } else if (t === 'sub2') {
                text = '第三码流'
              }
              return h('span', text)
            }
          },
          {
            title: '分析地址',
            key: 'rtsp',
            align: 'left',
            minWidth: 145,
            ellipsis: true,
            render: (h, params) => {
              let text = ''
              text = params.row.rtsp ? params.row.rtsp.main : '......'
              return h(
                'span',
                {
                  attrs: {
                    title: text
                  }
                },
                text
              )
            }
          },
          {
            title: '操作',
            key: 'action',
            minWidth: 160,
            align: 'center',
            render: (h, params) => {
              if (this.$BShasPower('BS-SETTING-FACE-CHANNEL-MANAGE')) {
                return h('div', [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'ghost',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: e => {
                          e.stopPropagation()
                          this.resActiceId = params.row._id
                          this.resEditOpen(this.resActiceId)
                        }
                      }
                    },
                    '编辑'
                  ),
                  h(
                    'Button',
                    {
                      props: {
                        type: 'ghost',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: e => {
                          e.stopPropagation()
                          this.resSelectIds = [params.row._id]
                          this.createResDelModel()
                        }
                      }
                    },
                    '删除'
                  ),
                  h(
                    'Button',
                    {
                      props: {
                        type: 'ghost',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: e => {
                          e.stopPropagation()
                          this.resSelectIds = [params.row._id]
                          this.resMoveOpen()
                        }
                      }
                    },
                    '移动'
                  )
                ])
              }
            }
          }
        ]
      ],
      devMoveModal: false, // 资源移动
      modifyOryId: '', // 修改移动组织机构的机构Id;

      // 导入图片
      batUpload: {
        group: [{ required: true, message: '请选择匹配方式', trigger: 'change' }]
      },
      importForm: {
        group: 'a',
        discernType: ['a', 'b', 'c']
      },
      uploadTypes: ['jpg', 'png', 'bmp', 'jpeg'],
      importFileList: [], // 上传成功的图片
      importMaxSizeFiles: [],
      importFileNewList: [], // 已选中需要上传的图片
      importTypeErrorList: [],
      importFileErrorList: [], // 上传失败的图片
      importMatchingFileErrorList: [], // 上传成功匹配失败的图片
      importErrorPic: [], // 上传成功匹配失败的图片+上传失败的图片;
      importMatchingFileSucList: [], // 上传成功匹配成功的图片
      importMatchingNameFailList: [], // 上传的图片未匹配名称的图片

      importStatus: false,
      importPicProcess: false, // 是否显示进度条
      importPicProcessNum: 0, // 进度条大小
      importPicProcessTimer: '', // 进度条定时器
      elemIF: null,
      ExcelProgress: null, //      excel 定时器
      exportDataColumns: [
        {
          title: '时间',
          key: 'timeMS',
          align: 'center',
          render: (h, params) => {
            let text = this.$moment(params.row.timeMS).format('YYYY-MM-DD HH:mm:ss')
            return h('span', text)
          }
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          render: (h, params) => {
            let text
            if (params.row.status && params.row.url != '开始') {
              text = '导出成功'
            } else if (!params.row.status) {
              text = '正在导出'
            } else {
              text = ''
            }
            return h('span', text)
          }
        },

        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: !params.row.status
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      if (params.row.url == '开始') {
                        this.exportData[0].status = false
                        this.exportData[0].url = ''

                        let param = Object.assign({}, this.getListParams)
                        delete param.pageNum
                        delete param.pageSize
                        delete param.keyWord
                        this.zipUser(param).then(res => {
                          if (res) {
                            this.exportData.splice(0, 1, res.data)
                            let data = JSON.parse(JSON.stringify(this.exportData))
                            this.exportData = data
                            // this.exportData.unshift(res.data)
                            // this.exportData = { ...this.exportData }
                            // this.exportData[0].status=false;
                          }
                        })
                      } else {
                        let name = this.exportData[params.index].url
                        var eleLink = document.createElement('a')
                        // target="_blank"
                        eleLink.target = '_blank'
                        eleLink.style.display = 'none'
                        // 下载内容转变成blob地址
                        eleLink.href = '/api/through/users/downZip/' + name
                        // 触发点击
                        document.body.appendChild(eleLink)
                        eleLink.click()
                        // 然后移除
                        document.body.removeChild(eleLink)
                        // this.downZip(name).then(res=>{
                        // })
                      }
                    }
                  }
                },
                params.row.url == '开始' ? '开始' : '下载'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small',
                    disabled: !params.row.status || params.row.url === '开始'
                  },
                  on: {
                    click: () => {
                      let id = this.exportData[params.index]._id
                      this.deleteZip({ id: id }).then(res => {
                        this.exportData.splice(params.index, 1)
                      })
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ], // 图片导出列表行
      exportData: [] // 图片导出数据
    }
  },
  computed: {
    ...mapState({
      controlAuthorityGroup: ({ personnelManagementStatus }) => personnelManagementStatus.controlAuthorityGroup,
      authorityArray: ({ accessControlAuthorityStatus }) => accessControlAuthorityStatus.authorityArray
    }),
    ...mapGetters(['accessToken'])
    // logoImgSrc:function() {
    //   return this.resEditFormData.url === '' ? '' :this.resEditFormData.url
    // }
  },
  watch: {
    importFileNewList(arr) {
      if (arr.length < 1 || this.importMatchingNameFailList > 0) {
        this.batchSureDisable = true
      } else {
        this.batchSureDisable = false
      }
    },
    importMatchingNameFailList(arr) {
      if (arr.length > 0 || this.importFileNewList < 1) {
        this.batchSureDisable = true
      } else {
        this.batchSureDisable = false
      }
      if (arr.length > 0) {
        this.importStatus = true
      } else {
        this.importStatus = false
      }
    }
  },
  methods: {
    ...mapActions([
      'addPersonManagement',
      'getPersonManagementList',
      'deletePersonManagement',
      'orgModify',
      'getOneCard',
      'getGroup',
      'addBottomBankFuc',
      'accessControlAuthority',
      'batchImportUser',
      'getexportData', // 导出
      'deleteAllUser',
      'deleteFileImage', // 刪除圖片
      'setUserVeriFace', // 底库数据同步后后台的同步
      'zipList',
      'zipUser',
      'downZip',
      'exportExcelUser', // 导出execl
      'assignAccess' // 获取权限
    ]),
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    resizefun() {
      this.tableHeight = this.$refs['tableBox'].offsetHeight
    },
    // 摄像头拍照、上传
    photoFn() {
      Webcam.snap(data_uri => {
        this.capture = data_uri
        this.logoImgSrc = this.capture
        this.imgFile = this.dataURLtoFile(this.logoImgSrc, 'default.png')
        let fileFormData = new FormData()
        fileFormData.append('file', this.imgFile)
        axios
          .create({
            baseURL: '',
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          .post('/api/upload/file?type=image&category=peopleDir', fileFormData)
          .then(res => {
            this.successMsg('上传成功')
            this.resEditFormData.url = res.data.path
          })
          .catch(() => {
            this.$Message.error('Fail!')
          })
      })
      // 上传拍照
    },
    // 读取身份证信息
    readCard() {
      readCardMessage().then(res => {
        if (res.ret === 0) {
          this.resEditFormData.name = res.Certificate.Name
          this.resEditFormData.national = res.Certificate.Nation
          this.resEditFormData.codeAddress = res.Certificate.Address
          this.resEditFormData.uid = res.Certificate.IDNumber
          if (res.Certificate.Sex == '男') {
            this.resEditFormData.sex = 1
          } else if (res.Certificate.Sex == '女') {
            this.resEditFormData.sex = 2
          }
        }
      })
    },
    // 人脸权限下拉框
    maxTagPlaceholder(num) {
      return '已选' + (num + 1) + '条'
    },
    // 选择人脸权限时把对应的人像库O
    checkFaceAccess(value) {
      this.resEditFormData.facePermission = value
    },
    // 选择用户类型修改人脸权限下拉框对应数据
    checkUserType() {
      if (this.resEditFormData.type == 0) {
        this.faceAccessArr = []
        this.faceAccess.blacklists.map(item => {
          this.faceAccessArr.push({
            value: item.libraryId,
            label: item.libraryName
          })
        })
      } else {
        this.faceAccessArr = []
        this.faceAccess.whitelists.map(item => {
          this.faceAccessArr.push({
            value: item.libraryId,
            label: item.libraryName
          })
        })
      }
    },
    openDoorAccess() {
      this.doorAccess = []
      this.doorAccessModel = true
      getPermissionGroup().then(res => {
        if (res.data.code === 200) {
          res.data.data.map(item => {
            this.doorAccess.push({
              value: item._id,
              label: item.name
            })
          })
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 打开人脸设置弹框
    openFaceAccess() {
      this.faceAccessArr = []
      this.faceAccessModel = true
      getFaceBase().then(res => {
        if (res.data.code === 200) {
          this.faceAccess = res.data.list
          this.faceAccess.whitelists.map(item => {
            this.faceAccessArr.push({
              value: item.libraryId,
              label: item.libraryName
            })
          })
          this.faceAccess.blacklists.map(item => {
            this.faceAccessArr.push({
              value: item.libraryId,
              label: item.libraryName
            })
          })
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    handleChange(date) {
      this.resEditFormData.failure = date
    },
    handleSelectAll(status) {
      this.$refs.personTable.selectAll(status)
      this.selectAll = true
    },
    // 选择添加门禁权限
    addDoorAccess(value) {
      this.addDoorAccessArr = value
    },
    addFaceAccess(value) {
      this.addFaceAccessArr = value
    },
    // 门禁权限取消按钮
    resdoorAccessCancel() {
      this.doorAccessModel = false
      this.$refs.resDoorEditForm.resetFields()
    },
    // 门禁设置确定按钮
    resdoorAccess() {
      let obj = {
        userId: this.selectAll ? 'all' : [],
        permissionId: []
      }
      if (!this.selectAll) {
        this.selectePeople.forEach((item) => {
          obj.userId.push(item._id)
        })
      }
      obj.permissionId = this.addDoorAccessArr.join(',').split(',')
      if (this.addDoorAccessArr.length === 0) {
        this.errorMsg('未选择门禁权限')
        return
      }
      addPermissionUser(obj).then(res => {
        if (res.data.code === 200 && res.data.success > 0) {
          this.getPersonManagementListRender()
          this.successMsg('权限设置成功' + res.data.success + '个')
        } else {
          this.errorMsg('权限设置失败')
        }
      })
        .catch(err => {
          console.log(err)
        })
      this.$refs.resDoorEditForm.resetFields()
    },
    // 人脸权限设置确定按钮
    resfaceAccess() {
      let obj = {
        userId: this.selectAll ? 'all' : [],
        permissionId: []
      }
      if (!this.selectAll) {
        this.selectePeople.forEach((item) => {
          obj.userId.push(item._id)
        })
      }
      obj.permissionId = this.addFaceAccessArr.join(',').split(',')
      if (this.addFaceAccessArr.length === 0) {
        this.errorMsg('未选择人脸权限')
        return
      }
      addLibraryUser(obj).then(res => {
        if (res.data.code === 200) {
          this.getPersonManagementListRender() // 设置成功后刷新列表
          this.successMsg('权限设置成功')
        }
      })
        .catch(err => {
          console.log(err)
        })
      this.$refs.resFaceEditForm.resetFields()
    },
    // 人脸权限取消按钮
    faceAccessModelCancel() {
      this.faceAccessModel = false
      this.$refs.resFaceEditForm.resetFields()
    },
    orgCancel() { // 取消
      this.$refs.treebox.orgCancel() // 关闭弹窗
      this.$refs.orgFormData.resetFields() // 清空form表单内容
    },
    orgSave() { // 确认
      this.$refs.orgFormData.validate(valid => { // form表单验证成功
        if (valid) {
          this.$refs.treebox.save(this.formData) // 调接口
          // var param = {
          //   type: this.formData.libraryType,
          //   name: this.formData.name,
          //   extractFeature: '1'
          // }
          // createLibrary(param).then(res => {
          //   if (res.data.code === 200) {
          //     this.formData.libraryIds = res.data.list.libraryId
          //   }
          // })
          //   .catch(err => {
          //     console.log(err)
          //   })
        }
      })
    },
    // 文件上传导入
    progressExcel(event, file, fileList) {
      this.progressModal = true
      // //        this.percentPer = (event.loaded / event.total)*100
      let time = 0
      this.ExcelProgress = setInterval(() => {
        if (time < 100) {
          time += 5
        }
        this.percentPer = time
      }, 300)

      // console.log(this.percentPer)
    },
    // 导入成功回调
    uploadSuc(res) {
      clearInterval(this.ExcelProgress)
      this.percentPer = 100
      this.importTitle = '导入结果'
      this.importSaveData = res
      this.successMsg(res.message)
    },
    // 导入失败
    uploadError(res) {
      this.$Notice.warning(res.message)
    },
    // 导入失败
    formatError(res) {},
    // 导出
    resOutput() {
      this.exportData = []
      this.zipList('').then(res => {
        if (res) {
          this.exportData = res.data
          let obj = {
            status: true,
            timeMS: new Date(),
            url: '开始'
          }
          this.exportData.unshift(obj)
        }
      })
      this.showExportModel = true
    },
    // 导出excel
    exportExcelUserFuc() {
      let param = Object.assign({}, this.getListParams)
      delete param.pageNum
      delete param.pageSize
      delete param.keyWord
      this.exportExcelUser(param).then(res => {
        if (res) {
          res.data.map(item => {
            if (item.org) {
              item['orgName'] = item.org.name
            }
            if (Number(item.sex) === 1) {
              item.sex = '男'
            } else if (Number(item.sex) === 2) {
              item.sex = '女'
            } else {
              item.sex = ''
            }
          })
          var headerData = [
            { value: '姓名*', type: 'name' },
            { value: '性别', type: 'sex' },
            { value: '人员编号*', type: 'uid' },
            { value: '人员卡号*', type: 'card' },
            { value: '机构名称', type: 'orgName' },
            { value: '手机号', type: 'phone' },
            { value: '人员类型', type: 'typeName' },
            { value: '注："*" 为必填项', type: '' }
          ]
          var bodyData = res.data
          JSONToExcelConvertor(bodyData, '人员表', headerData)
        }
      })
    },
    uploadPicError(file, err, fileList) {
      this.importStatus = true
      this.importFileErrorList.push(fileList)
    },
    uploadPicSuc(response, file, fileList) {
      this.importFileList = fileList
      this.uploadPicPutPersonCount++
      if (this.uploadPicPutPersonCount == fileList.length - this.importFileErrorList.length) {
        this.uploadPicPutPerson(fileList)
      }

      // this.importFileList.forEach(oldFile => {
      //   this.importFileNewList = this.importFileNewList.filter(newFile => {
      //     return oldFile.name !== newFile.name
      //   })
      // })
    },

    uploadPicPutPerson(fileList) {
      var params = {
        type: this.importForm.group,
        data: [],
        org: this.orgId
      }
      fileList.forEach(item => {
        var obj = {}
        if (this.importForm.group == 'a') {
          // 卡号
          obj['url'] = item.response.path
          obj['card'] = item.name.split('.')[0]
          params.data.push(obj)
        } else if (this.importForm.group == 'b') {
          // 手机号
          obj['url'] = item.response.path
          obj['uid'] = item.name.split('.')[0]
          params.data.push(obj)
        } else if (this.importForm.group == 'c') {
          // 不匹配
          obj['url'] = item.response.path
          obj['name'] = item.name.split('.')[0].split('_')[0]
          obj['sex'] = item.name.split('.')[0].split('_')[1]
          obj['card'] = item.name.split('.')[0].split('_')[2]
          obj['uid'] = item.name.split('.')[0].split('_')[3]
          params.data.push(obj)
        }
      })
      console.log(params)
      this.batchImportUser(params).then(res => {
        if (res) {
          // this.importMatchingFileSucList = res.success;
          this.importFileList.forEach(item => {
            res.success.forEach(it => {
              if (item.response.path == it.url) {
                this.importMatchingFileSucList.push(item)
              }
            })
            res.file.forEach(it => {
              if (item.response.path == it.url) {
                this.importMatchingFileErrorList.push(item)
              }
            })
          })
          this.importErrorPic = this.importMatchingFileErrorList.concat(this.importFileErrorList)
          this.importStatus = true
          this.downLoadIsPic = true
          clearInterval(this.importPicProcessTimer)
          var timer = setInterval(() => {
            this.importPicProcessNum += 20
            console.log(this.importPicProcessNum)
            if (this.importPicProcessNum > 99) {
              clearInterval(timer)
              this.importPicProcess = false
              this.showUpload = false // 上传图片弹窗关闭，
              this.importSaveData.fail = this.importErrorPic.concat(this.importMaxSizeFiles)
              this.importSaveData.success = this.importMatchingFileSucList // 匹配成功的数据
              this.importSaveData.failLength = this.importSaveData.fail.length
              this.importSaveData.successLength = this.importSaveData.success.length
              this.importTitle = '导入结果'
              this.progressModal = true // 结果弹窗显示
            }
          }, 300)

          //  刪除掉匹配失败的图片
          var delPic = this.importMatchingFileErrorList.map(item => {
            return item.request.name
          })
          this.deleteFileImage({ list: delPic }).then(res => {
            if (res) {
              debugger
            }
          })
        }
      })
    },

    // 上传相关钩子
    importBefore(file) {
      const types = file.type.split('/')
      if (!types[1] || !this.uploadTypes.includes(types[1])) {
        this.importTypeErrorList.push(file)
        return false
      }
      if (this.importFileNewList.length > 10000) {
        this.$Notice.warning({
          title: '最多上传10000张图片！'
        })
        return false
      }
      this.importFileNewList.push(file)
      var notRulesReg = /^.+[_].{1,2}[_].+[_].*$/
      if (this.importForm.group == 'c') {
        if (!notRulesReg.test(file.name.split('.')[0])) {
          this.importMatchingNameFailList.push(file)
        }
      }
      console.log(file)
      return false
    },
    // 图片匹配类型变化时
    importFormGroupChange(event) {
      var notRulesReg = /^.+[_].{1,2}[_].+[_].*$/
      this.importMatchingNameFailList = []
      if (event == 'c') {
        for (var i = 0; i < this.importFileNewList.length; i++) {
          var item = this.importFileNewList[i]
          var namepic = item.name.split('.')[0]
          if (!notRulesReg.test(namepic)) {
            this.importMatchingNameFailList.push(item)
          }
        }
      } else {
        this.importMatchingNameFailList = []
      }
    },
    importExceededSize(file, fileList) {
      this.importStatus = true
      this.importMaxSizeFiles.push(file)
    },
    batchSure(type) {
      this.importPicProcess = true
      this.importPicProcessTimer = setInterval(() => {
        this.importPicProcessNum += 20
        if (this.importPicProcessNum === 100) {
          clearInterval(this.importPicProcessTimer)
          this.importPicProcess = false
          this.showUpload = false // 上传图片弹窗关闭
          this.progressModal = true // 结果弹窗显示
          this.importSaveData.fail = this.importErrorPic.concat(this.importMaxSizeFiles)
          this.importSaveData.success = this.importMatchingFileSucList // 匹配成功的数据
          this.importSaveData.failLength = this.importSaveData.fail.length
          this.importSaveData.successLength = this.importSaveData.success.length
          this.importTitle = '导入结果'
        }
      }, 300)
      this.importFileNewList.forEach(item => {
        console.log(item)
        this.$refs.importUpload.post(item)
      })

      // this.$refs.batUploadForm.validateField('group', valid => {
      //   if (!valid) {
      //
      //   }
      // })
    },
    datchCancal() {
      this.uploadPicPutPersonCount = 0
      this.$refs.batUploadForm.resetFields()
      clearInterval(this.importPicProcessTimer)
      this.importFileList = [] // 上传成功的图片
      this.importMatchingFileErrorList = [] // 上传成功匹配失败的图片
      this.importErrorPic = [] // 上传成功匹配失败的图片+上传失败的图片;
      this.importMatchingFileSucList = [] // 上传成功匹配成功的图片
      this.importMatchingNameFailList = [] // 上传的图片未匹配名称的图片
      this.importStatus = false
      this.importPicProcess = false // 是否显示进度条
      this.importPicProcessNum = 0 // 进度条大小
      this.importFileErrorList = []
      this.importTypeErrorList = []
      this.importMaxSizeFiles = []
      this.importFileNewList = []
      this.importSaveData.successLength = 0
      this.importSaveData.failLength = 0
      this.importSaveData.success = []
      this.importSaveData.fail = []
      this.$refs.importUpload.clearFiles()
      this.showUpload = false // 上传图片弹窗关闭，
    },
    delTreeData(del) {
      console.log(del)
    },
    modalCancel() {
      this.uploadPicPutPersonCount = 0
      this.percentPer = 0
      clearInterval(this.importPicProcessTimer)
      this.importTitle = '数据导入'
      this.importPicProcess = false
      this.progressModal = false
      this.getPersonManagementListRender()
      this.$refs.batUploadForm.resetFields()
      this.importFileList = [] // 上传成功的图片
      this.importMatchingFileErrorList = [] // 上传成功匹配失败的图片
      this.importErrorPic = [] // 上传成功匹配失败的图片+上传失败的图片;
      this.importMatchingFileSucList = [] // 上传成功匹配成功的图片
      this.importMatchingNameFailList = [] // 上传的图片未匹配名称的图片
      this.importStatus = false
      this.importPicProcess = false // 是否显示进度条
      this.importPicProcessNum = 0 // 进度条大小
      this.importFileErrorList = []
      this.importTypeErrorList = []
      this.importMaxSizeFiles = []
      this.importFileNewList = []
      this.importSaveData.successLength = 0
      this.importSaveData.failLength = 0
      this.importSaveData.success = []
      this.importSaveData.fail = []
      this.$refs.importUpload.clearFiles()
      this.showUpload = false // 上传图片弹窗关闭，
    },
    progressModalOk() {
      this.uploadPicPutPersonCount = 0
      this.percentPer = 0
      clearInterval(this.importPicProcessTimer)
      this.importTitle = '数据导入'
      this.importPicProcess = false
      this.progressModal = false
      this.getPersonManagementListRender()
      this.$refs.batUploadForm.resetFields()
      this.importFileList = [] // 上传成功的图片
      this.importMatchingFileErrorList = [] // 上传成功匹配失败的图片
      this.importErrorPic = [] // 上传成功匹配失败的图片+上传失败的图片;
      this.importMatchingFileSucList = [] // 上传成功匹配成功的图片
      this.importMatchingNameFailList = [] // 上传的图片未匹配名称的图片
      this.importStatus = false
      this.importPicProcess = false // 是否显示进度条
      this.importPicProcessNum = 0 // 进度条大小
      this.importFileErrorList = []
      this.importTypeErrorList = []
      this.importMaxSizeFiles = []
      this.importFileNewList = []
      this.importSaveData.successLength = 0
      this.importSaveData.failLength = 0
      this.importSaveData.success = []
      this.importSaveData.fail = []
      this.$refs.importUpload.clearFiles()
      this.showUpload = false // 上传图片弹窗关闭，
    },
    // 获取底库列表
    getGroupData() {
      this.getGroup()
        .then(res => {
          this.OrgainGroup = res.data.filter(item => {
            return item.type == 'defense'
          })
          console.log(this.OrgainGroup)
        })
        .catch(err => this.errorMsg(err.response.data.message))
    },
    // 将人员增加到底库
    async addBottomBank(event) {
      if (this.ModifyPerson.length < 1) {
        this.$Notice.error({
          title: '错误提示！',
          desc: '请选择需要增加到底库的人员'
        })
        return
      }

      var saveBootom = []
      var obj = {
        image: '',
        age: '',
        code: '',
        gender: '',
        name: '',
        remark: '',
        group: event._id,
        _id: ''
      }
      this.ModifyPerson.forEach(item => {
        obj.name = item.name
        obj.age = item.age
        obj.gender = item.sex == '男' ? 2 : 1
        obj.image = item.image
        obj._id = item._id // 下个请求使用
        obj.name = item.name // 下个请求失败时使用
        saveBootom.push(Object.assign({}, obj))
      })
      let successBottom = await Promise.all(
        saveBootom.map(async item => {
          var item_ = Object.assign({}, item)
          var id = item_._id
          var name = item_.name

          delete item._id
          let veriface_ = await this.addBottomBankFuc(item)
          let message = await this.setUserVeriFace({
            param: { _id: id, veriface: veriface_ },
            name: name
          })
          return message
        })
      ).catch(err => {
        console.log(err)
      })
      console.log(successBottom)
      this.ModifyPerson = []
      let errName = successBottom.filter(item => {
        return typeof item === 'string'
      })
      if (errName.length == 0) {
        this.successMsg('增加底库成功')
      } else {
        this.errorMsg(errName.join(',') + '增加底库失败')
      }
      this.getPersonManagementListRender()
      // this.addBottomBankFuc(obj).then(res=>{
      //   if(res){
      //     this.successMsg('增加底库成功');
      //
      //
      //   }
      // })
      console.log(this.ModifyPerson)
    },
    // 获取当前机构的权限
    assignAccessFuc() {
      this.assignAccess(this.assignAccessParams).then(res => {
        console.log(res, res.properties)
        this.AccessArr = res.properties
      })
    },
    // 左侧菜单回调传值
    getDevicesDataClick(event) {
      this.roleId = window.sessionStorage.getItem('roleId')
      this.orgId = event._id
      this.getListParams.orgId = event._id
      this.getPersonManagementListRender()
      console.log(event)
      this.assignAccessParams.resId = event._id
      this.assignAccessParams.roleId = this.roleId
      this.assignAccessFuc()
    },
    // 获取数据渲染表格
    getPersonManagementListRender() {
      this.getPersonManagementList(this.getListParams).then(res => {
        this.resourceTableData = res.data
        this.page.total = res.length
        this.resTabs[this.resActiveTab].number = res.length
      })
    },
    // 全部删除
    deleteAllUserFuc() {
      this.DeleteAllconfirm()
    },
    // 全部删除弹框
    DeleteAllconfirm() {
      this.$Modal.confirm({
        title: '',
        content: '<p>确认删除？</p>',
        onOk: () => {
          this.deleteAllUser('').then(res => {
            if (res) {
              this.successMsg('全部删除成功')
              this.getPersonManagementListRender()
            }
          })
        },
        onCancel: () => {
          // this.$Message.info('Clicked cancel');
        }
      })
    },
    // 删除人员
    resDelPerson() {
      this.Deleteconfirm()
    },
    // 删除人员弹框
    Deleteconfirm() {
      this.$Modal.confirm({
        title: '',
        content: '<p>确认删除？</p>',
        onOk: () => {
          this.deletePersonManagement(this.deleteArr).then(res => {
            if (res.code === 200) {
              this.getPersonManagementListRender() // 删除成功后刷新列表
              this.successMsg('删除成功')
            } else {
              this.errorMsg(res.message)
            }
          })
        },
        onCancel: () => {
          // this.$Message.info('Clicked cancel');
        }
      })
    },
    // 修改人员信息
    resModifyOpen() {
      this.isAdd = false
      this.picStatus = true
      this.picIcon = false
      Webcam.on('error', function(err) {
        console.log(err)
      })
      setTimeout(() => {
        Webcam.set({ // 拍照参数设置
          width: 260,
          height: 230,
          dest_width: 960,
          dest_height: 540,
          force_flash: true,
          image_format: 'png',
          jpeg_quality: 90,
          swfURL: '../../../../static/plugin/webcam.swf'
        })
        Webcam.attach('#my_camera')
        this.photoButton = true
      }, 3000)
      if (this.ModifyPerson.length === 0) {
        this.$Notice.error({
          title: '错误提示！',
          desc: '请选择需要修改人员'
        })
      } else if (this.ModifyPerson.length > 1) {
        this.$Notice.error({
          title: '错误提示！',
          desc: '一次只能修改一个人的信息'
        })
      } else {
        Object.assign(this.resEditFormData, this.ModifyPerson[0])
        delete this.resEditFormData.orgId
        delete this.resEditFormData.org
        delete this.resEditFormData.__v
        this.resEditFormData.sex = Number(this.resEditFormData.sex)
        console.log(this.resEditFormData)
        this.logoImgSrc = this.resEditFormData.image
        this.isEdit = true
        this.resAddModal = true
        this.peopleCard = true
        this.peopleEdit = false
        this.photoButton = false
        // this.resEditFormData.facePermission = []
      }
    },
    selectChannelName(event) {
      this.getListParams.type = event
      this.getPersonManagementListRender()
    }, // 同步状态
    selectBatchStream(event) {
      this.getListParams.guard = event
      this.getPersonManagementListRender()
    }, // 搜索类型
    seekResData() {
      this.getPersonManagementListRender()
    }, // 搜索
    showChildRefresh() {
      // console.log(this.getListParams)
      this.getPersonManagementListRender()
    },
    selectResRow(event) {
      // 选中的人
      this.selectePeople = event
      this.deleteArr = []
      this.ModifyPerson = []
      event.forEach(item => {
        this.deleteArr.push(item._id)
        this.ModifyPerson.push(item)
      })
      console.log(this.ModifyPerson)
    },
    pageSizeChange(event) {
      this.getListParams.pageSize = event
      this.getPersonManagementListRender()
    },
    changeResPage(event) {
      this.getListParams.pageNum = event
      this.getPersonManagementListRender()
    },
    // 添加人员弹窗
    resAddOpen() {
      this.peopleCard = false
      this.peopleEdit = true
      this.doorAccess = []
      this.faceAccess = []
      this.logoImgSrc = ''
      this.faceAccessArr = []
      this.resAddModal = true
      this.isEdit = false
      this.screenshots = false
      this.photoButton = false
      this.resEditFormData = {
        orgId: '',
        name: '',
        sex: 1,
        phone: '',
        type: 2,
        url: '',
        codeAddress: '',
        permission: [],
        failure: '',
        card: '',
        uid: '',
        national: '',
        liveAddress: '',
        facePermission: []
      }
      this.picStatus = true
      this.picIcon = false
      Webcam.on('error', function(err) {
        console.log(err)
      })
      setTimeout(() => {
        Webcam.set({ // 拍照参数设置
          width: 260,
          height: 230,
          dest_width: 960,
          dest_height: 540,
          force_flash: true,
          image_format: 'png',
          jpeg_quality: 90,
          swfURL: '../../../../static/plugin/webcam.swf'
        })
        Webcam.attach('#my_camera')
        this.photoButton = true
      }, 3000)
      // 人脸权限
      getFaceBase().then(res => {
        if (res.data.code === 200) {
          this.faceAccess = res.data.list
          console.log(this.faceAccess)
          this.faceAccess.whitelists.map(item => {
            this.faceAccessArr.push({
              value: item.libraryId,
              label: item.libraryName
            })
          })
        }
      })
      // 门禁权限
      getPermissionGroup().then(res => {
        if (res.data.code === 200) {
          res.data.data.map(item => {
            this.doorAccess.push({
              value: item._id,
              label: item.name
            })
          })
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    resDelOpen() {},
    resMoveOpen() {
      this.devMoveModal = true
    },
    resTableFresh() {
      this.getPersonManagementListRender()
    },
    // 弹窗窗关闭
    resAddCancel() {
      this.resAddModal = false
      this.isEdit = false // 数据保存成功后将是否修改false;
      Webcam.reset()
      this.modalloading = false
      this.picIcon = true
      this.picStatus = false
      this.$refs.resEditForm.resetFields()
    },
    // 用户头像上传
    importSuccess(response) {
      this.resEditFormData.url = response.path
      this.logoImgSrc = response.path
    },
    // 图片上传失败的回调
    formatError(file) {
      this.$Notice.warning({
        title: '图片格式不正确',
        desc: '图片 ' + file.name + ' 格式不正确，请上传 jpg, png, bmp 或 jpeg 格式的图片。'
      })
    },
    // 弹窗确认回调
    exceededSize(file) {
      this.$Notice.warning({
        title: '图片大小超过限制',
        desc: '图片 ' + file.name + ' 大小超过限制，请上传小于2M的图片。'
      })
    },
    resAddSave() {
      this.$refs.resEditForm.validate(valid => {
        if (valid) {
          Webcam.reset()
          this.modalloading = true
          this.resEditFormData.orgId = this.orgId
          this.addPersonManagement({ param: this.resEditFormData, isEdit: this.isEdit })
            .then(res => {
              this.ModifyPerson = []
              this.deleteArr = []
              if (res.code == 200) {
                this.isEdit = false // 数据保存成功后将是否修改false;
                this.modalloading = false
                this.logoImgSrc = ''
                this.picIcon = true
                this.picStatus = false
                this.$refs.resEditForm.resetFields()
                this.getPersonManagementListRender()
                this.resAddModal = false
              } else {
                this.errorMsg(res.message)
                this.logoImgSrc = ''
                this.modalloading = false
                // this.resAddModal = false;
              }
            })
            .catch(err => {
              this.errorMsg(err)
              console.log(err)
              this.modalloading = false
            })
        }
      })
    },
    resTabClick(event) {
      this.resActiveTab = event.index
      // console.log(this.resTabs[this.resActiveTab])
      // this.resTabs.map(item=>{
      //   item.active = false;
      // });
      // this.resTabs[event.index].active = true;
    },
    // 移动弹窗选择机构传值
    selectMoveOrg(event) {
      this.modifyOryId = event._id
      console.log(this.ModifyPerson)
    },
    // 移动弹窗选择回调
    resMoveSave() {
      this.orgModify({ org: this.modifyOryId, _id: this.ModifyPerson[0]._id })
        .then(res => {
          if (res) {
            this.successMsg('移动成功')
            this.devMoveModal = false
            this.getPersonManagementListRender()
          }
        })
        .catch(err => {
          this.$Notice.error({
            title: '错误提示！',
            desc: err
          })
        })
    },
    // 用户同步
    resTablegetOneCard() {
      this.getOneCard()
        .then(res => {
          if (res) {
            this.successMsg('同步成功')
          }
        })
        .catch(err => {
          this.$Notice.error({
            title: '错误提示！',
            desc: err
          })
        })
    },
    // 下载模块
    downloadModule() {
      download('/api/through/users/downTemplete', '人员模板.xlsx', '', '', '', 'post')
      // var headerData = [
      //   { value: '姓名*', type: 'name' },
      //   { value: '性别', type: 'sex' },
      //   { value: '人员编号*', type: 'uid' },
      //   { value: '民族', type: 'national ' },
      //   { value: '联系方式', type: 'phone' },
      //   { value: '身份证地址', type: 'address' },
      //   { value: '居住地址', type: 'liveAddress' },
      //   { value: '人员卡号', type: 'card' },
      //   { value: '失效时间', type: 'failure' },
      //   // { value: '机构名称', type: 'orgName' },
      //   // { value: '人员类型', type: 'typeName' },
      //   // { value: '门禁权限', type: 'permission' },
      //   { value: '注："*" 为必填项', type: '' }
      // ]
      // var bodyData = this.resourceTableData.slice(0, 3)
      // bodyData.forEach(item => {
      //   if (item.sex === 1) {
      //     item.sex = '男'
      //   } else if (item.sex === 2) {
      //     item.sex = '女'
      //   }
      // })
      // JSONToExcelConvertor(bodyData, '人员模板', headerData)
    },
    // 下载导入结果
    downLoadImportFile() {
      if (this.downLoadIsPic) {
        var headerData = [{ value: '照片文件名', type: 'name' }, { value: '导入结果', type: 'resultCode' }]
        this.importSaveData.success.map(item => {
          item.resultCode = '成功'
        })
        this.importSaveData.fail.map(item => {
          item.resultCode = '失败'
        })
        var bodyData = this.importSaveData.success.concat(this.importSaveData.fail)
        JSONToExcelConvertor(bodyData, '照片导入结果', headerData)
      } else {
        var headerData = [
          { value: '人员编号*', type: 'uid' },
          { value: '姓名*', type: 'name' },
          { value: '人员卡号', type: 'card' },
          { value: '机构名称', type: 'orgName' },
          { value: '性别', type: 'sex' },
          { value: '手机号', type: 'phone' },
          { value: '人员类型', type: 'typeName' },
          { value: '导入结果', type: 'resultCode' }
        ]
        this.importSaveData.success.map(item => {
          item.resultCode = '成功'
        })
        this.importSaveData.fail.map(item => {
          item.resultCode = '失败'
        })
        var bodyData = this.importSaveData.success.concat(this.importSaveData.fail)
        JSONToExcelConvertor(bodyData, 'EXCEL导入结果', headerData)
      }
    },
    // 关闭批量上传弹出框
    closeUploadModel(val) {
      this.importPicProcess = false
      if (!val) {
        this.$refs.batUploadForm.resetFields()
        this.importFileErrorList = []
        this.importTypeErrorList = []
        this.importMaxSizeFiles = []
        this.importFileNewList = []
        this.$refs.importUpload.clearFiles()
        // this.getPeopleData()
      }
    },
    // 关闭导出弹出框
    closeExportModel(val) {
      if (val) {
        this.showExportModel = false
      } else {
        this.showExportModel = true
      }
    },
    // 关闭门禁权限弹框
    closeDoorAccessModel(val) {
      if (val) {
        this.doorAccessModel = false
        this.$refs.resDoorEditForm.resetFields()
        this.doorAccess = []
      } else {
        this.doorAccessModel = true
      }
    },
    // 关闭人脸权限弹框
    closeFaceAccessModel(val) {
      if (val) {
        this.faceAccessModel = false
        this.faceAccessArr = []
      } else {
        this.faceAccessModel = true
      }
    }
  },
  created() {
    this.route = this.$route.path
    this.headerObj.Authorization = `Bearer ${this.accessToken}`
    this.getGroupData() // 获取底库列表
    this.accessControlAuthority().then(res => {})
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight
    window.addEventListener('resize', this.resizefun)
  },
  beforeDestroy() {
    Webcam.reset()
    window.removeEventListener('resize', this.resizefun)
    this.resizefun = null
  }
}
</script>
<style scoped lang='less'>
/*/deep/.bigImg{*/
/*cursor: pointer;*/
/*}*/
/*/deep/.bigImg:hover {*/
/*transform: scale(1.5);*/
/*cursor: pointer;*/
/*!*width: 60px;*!*/
/*!*height:60px;*!*/
/*}*/

.container {
  width: 100%;
  height: auto;
  position: relative;
  display: flex;
}
.content-left {
  margin: 0 0 30px 15px;
  width: 260px;
  height: 230px;
  background: #081426;
  // border: 1px solid #fff;
}
.sidebar {
  width: 100%;
  height: 100%;
}

.bottomBank {
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
}

.bottomBank /deep/ .ivu-upload-select {
  width: 100%;
}
.form-right {
  position: relative;
  top: -357px;
  left: 330px;
  height: 215px;
  width: 300px;
}
.bottomBank li {
  width: 100%;
  height: 30px;
  line-height: 30px;
  padding-left: 15px;
  text-align: left;
  cursor: pointer;
}

.bottomBank li:hover {
  background: #1d8ce0;
  color: #fff;
}

.sidebar > a {
  display: block;
  height: 38px;
  line-height: 38px;
  font-size: 14px;
  color: #fff;
  padding-left: 20px;
  background-color: #0f2243;
}

.tree-org {
  height: 100%;
}

.config-list li {
  position: relative;
  cursor: pointer;
  border-bottom: 1px solid #5d5d5d;
  font-size: 14px;
  color: #80848f;
  border-right: 2px solid transparent;
}

.config-list li:hover {
  color: #fff;
}

.sidebar > .config-list > .active {
  color: #2d8cf0;
  border-right: 2px solid #2d8cf0;
  background-color: #444;
  z-index: 2;
}

li > div {
  padding: 14px 40px;
}

.bs-main {
  padding: 0;
  background-color: #1c3053;
  overflow: hidden;
}

.resource-right-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.resource-right-table .table-header {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.resource-right {
  height: 100%;
}

/*按钮和inpu框*/

.table-header-actions {
  /* height: 50px; */
  margin: 12px 10px 12px 12px;
  background-color: #1c3054;
}
.ivu-form-item {
  margin-bottom: 18px;
}
/*按钮和inpu框*/
.actions-btn {
  float: left;
  /* margin-top: 10px; */
}

.actions-btn span span {
  display: inline-block;
  margin: 0 10px;
}

.actions-search {
  float: right;
  display: flex;
  width: 550px;
  justify-content: flex-end;
  /* margin-top: 9px; */
}

.actions-search div {
  margin-right: 5px;
}

.actions-btn .ivu-btn {
  margin-right: 8px;
}

.actions-btn .ivu-select {
  margin-right: 8px;
}

/* table样式 */

.table-relative {
  position: relative;
  flex: 1;
}

.table-body {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

/*修改弹出框内容样式*/

.res-add-model {
  padding: 0px 10px;
}

.res-edit-form {
  padding: 0px 10px;
}

.res-edit-form .check-input .ivu-col-span-8 {
  width: 100px;
  height: 32px;
  line-height: 32px;
}

.res-edit-form .check-input .ivu-col-span-16 {
  width: calc(100% - 100px);
  height: 56px;
}

.formTip {
  display: inline-block;
  color: red;
  height: 24px;
  line-height: 24px;
}

.check-input .ivu-col-span-16 input {
  display: inline-block;
  width: 100%;
  height: 32px;
  line-height: 1.5;
  padding: 0px 7px;
  font-size: 12px;
  border: 1px solid #5676a9;
  border-radius: 4px;
  color: #ffffff;
  background-color: #1c3053;
  cursor: text;
  outline: none;
}

.check-input .ivu-col-span-16 input:hover {
  border: 1px solid #33b7e9;
}

.check-input .ivu-col-span-16 input:focus {
  border: 1px solid #33b7e9;
}

.check-input .ivu-col-span-16 .redBorder {
  border: 1px solid red;
}

.check-input .ivu-col-span-16 .redBorder:hover {
  border: 1px solid red;
}

.check-input .ivu-col-span-16 .redBorder:focus {
  border: 1px solid red;
}

.check-input .redBorderDis {
  cursor: not-allowed;
}

.check-input .redBorderDis:hover {
  cursor: not-allowed;
}

.res-model-tree {
  height: 640px;
  width: 650px;
  margin-top: 10px;
  display: flex;
}
.res-move-model {
  height: 450px;
  width: 430px;
  margin-top: 20px;
  display: flex;
}
.iviewVisible > .ivu-select-dropdown {
  z-index: 99999;
}

.clear:after {
  content: '';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.content-right {
  position: relative;
  right: 65px;
  height: 230px;
  /* margin-left: 80px; */
  width: 260px;
  cursor: pointer;
  background: #081426;
}

.user-logo {
  width: 260px;
  height: 230px;
}
.detail-user-logo {
  position: relative;
  left: 30px;
  top: -15px;
  width: 260px;
  height: 270px;
  border: 1px dashed #fff;
}
.detail-user-logo img {
  width: 100%;
  height: 100%;
}
.detail-user-left {
  position: absolute;
  left: 50px;
  top: 360px;
}
.detail-user-right {
  position: absolute;
  right: 50px;
  top: 360px;
}
.user-logo img {
  width: 100%;
  height: 100%;
}
.mPhoto {
  width: 260px;
  height: 270px;
  position: absolute;
  span {
    position: absolute;
    left: 50%;
    top: -6%;
    transform: translate(-50%, -50%);
    font-size: 40px;
    cursor: pointer;
  }
}
.uploadPhoto {
  width: 260px;
  height: 230px;
  position: absolute;
  bottom: -27px;
  right: -51px;
  cursor: pointer;
  span {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 50px;
  }
}
.photo {
  position: absolute;
  top: 230px;
  left: 125px;
}
.capture {
  position: absolute;
  top: 230px;
  left: 205px;
}
.detail {
  height: 600px !important;
}
</style>
