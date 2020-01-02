<!--编辑模式 巡更点位的右边编辑页面-->
<template>
  <div class="videoPoint">
    <div class="videoPointHeader">
      <div class="pointHeaderTittle">
        <p>巡更点位</p>
      </div>
      <div class="pointHeaderContent iconfont">
        <p @click="delPoint">
          <i class="icon-delete" title="删除"></i>
        </p>
      </div>
    </div>
    <div class="videoPointContent">
      <div class="pointContentHeader pointMain">
        <p class="pointTittle">基本信息</p>
      </div>
      <bs-scroll ref="scroller">
        <div class="buildEditImg">
          <div class="buildImg">
            <img v-if="patrolPoint.photo" style="height:100%;width:100%;" :src="'/api/upload?id=' + patrolPoint.photo">
          </div>
          <Upload action="/api/upload" :show-upload-list="false" :on-success="uploadEditSuccess" :multiple="false" ref="upload" :format="['jpg','jpeg','png']" :on-format-error="mapFormatError">
            <Button type="ghost" icon="ios-cloud-upload-outline">点击上传图片</Button>
          </Upload>
          <P class="buildEditImgText">286px*168px,支持JPEG、PNG格式</P>
        </div>
        <Form ref="patrolPoint" :rules="ruleValidate" :model="patrolPoint" :label-width="80" label-position="left">
          <Form-item label="点位名称" prop="devName">
            <Input v-model="patrolPoint.devName" />
          </Form-item>
          <Form-item label="设备ID" prop="">
            <Input v-model="patrolPoint.devId" disabled/>
          </Form-item>
          <Form-item label="设备编码" prop="devCode">
            <Input v-model="patrolPoint.devCode" disabled/>
          </Form-item>
          <Form-item label="所属机构" prop="">
            <Input v-model="patrolPoint.orgName" disabled/>
          </Form-item>
          <!-- 联系方式 -->
          <Form-item label='负责人' prop="charger">
            <Input v-model="patrolPoint.charger" placeholder="请输入负责人" />
          </Form-item>
          <Form-item label='电话' prop="phone">
            <Input v-model="patrolPoint.phone" placeholder="请输入负责人电话" />
          </Form-item>
          <Form-item label="备注" prop="remark">
            <Input v-model="patrolPoint.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" />
          </Form-item>
        </Form>
      </bs-scroll>
    </div>
    <div class="videoPointFooter">
      <Button type="ghost" @click="mapPointCannel('patrolPoint')" style="margin-right: -3px">取消</Button>
      <Button type="primary" @click="mapPointSave('patrolPoint')" style="margin-left: 16px">保存</Button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import editPatrolIpc from '../../../../assets/map/edit/editPatrolIpc'
export default {
  data() {
    // 名称
    const valiDevName = (rule, value, callback) => {
      if (value) {
        let strlength = value.replace(/[\u0391-\uFFE5]/g, 'aa').length
        if (strlength > 64) {
          return callback(new Error('名称超过64个字符'))
        } else if (value.indexOf(' ') > -1) {
          return callback(new Error('名称不可包含空格'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('设备名称不能为空'))
      }
    }
    // 负责人：64位字符
    const verifyName = (rule, value, callback) => {
      let strlength = value.replace(/[\u0391-\uFFE5]/g, 'aa').length
      if (strlength > 64) {
        return callback(new Error('负责人超过64个字符'))
      } else if (value.indexOf(' ') > -1) {
        return callback(new Error('名称不可包含空格'))
      } else {
        callback()
      }
    }
    // 备注:512字符
    const verifyNameRemark = (rule, value, callback) => {
      let strlength = value.replace(/[\u0391-\uFFE5]/g, 'aa').length
      if (strlength > 512) {
        return callback(new Error('备注超过512个字符'))
      } else {
        callback()
      }
    }
    // 电话号码
    const validateTelephone = (rule, value, callback) => {
      let reg = /^1[34578]\d{9}$/
      if (!value || reg.test(value)) {
        callback()
      } else {
        return callback(new Error('请输入正确的电话号码'))
      }
    }
    return {
      // 点位信息
      patrolPoint: {},
      ruleValidate: {
        devName: [{ required: true, validator: valiDevName, trigger: 'change' }],
        devCode: [{ required: true, message: '设备编码不能为空', trigger: 'change' }],
        charger: [{ validator: verifyName, trigger: 'change' }],
        phone: [{ validator: validateTelephone, trigger: 'change' }],
        remark: [{ validator: verifyNameRemark, trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapState({
      onePartrol: ({ patrolData }) => patrolData.onePartrol, // 单个巡更点位
      editPatrolList: ({ patrolData }) => patrolData.editPatrolList,
      isOuter: ({ mapAreaData }) => mapAreaData.isOuter, // 楼层内还是楼层外
      levelData: ({ mapGisData }) => mapGisData.levelData
    })
  },
  watch: {
    onePartrol(val) {
      this.patrolPoint = JSON.parse(JSON.stringify(val))
    }
  },
  methods: {
    ...mapActions(['getPatrolPoint', 'editOnePatrol', 'removeOnePatrol']),
    ...mapMutations([
      'SET_EDITRIGHTPAGE_STATE', // 电子地图页面控制
      'SET_MODIFYACTIVE_STATE',
      'SET_PATROL_LIST',
      'SET_PATROLINMAP_LIST',
      'SET_CURRENT_PATROL'
    ]),
    // 图片上传
    uploadEditSuccess(val) {
      this.patrolPoint.photo = val.id.toString()
      this.patrolPoint = JSON.parse(JSON.stringify(this.patrolPoint))
    },
    mapFormatError(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg、jpeg 或 png 格式的图片。'
      })
    },
    // 取消保存
    mapPointCannel(name) {
      this.savePatrol(this.patrolPoint._id)
      this.closeEditVePoCon()
      this.$refs[name].resetFields()
    },
    // 保存
    mapPointSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.editOnePatrol(this.patrolPoint)
            .then(res => {
              this.savePatrol(this.patrolPoint._id)
              this.successMsg('巡更点位信息修改成功')
              this.getMapPatrolTree()
              this.closeEditVePoCon()
            })
            .catch(err => {
              this.errorMsg(err.response.data.message)
            })
        }
      })
    },
    // 删除点位
    delPoint() {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除所选巡更点位吗？</p>',
        onOk: () => {
          this.removeOnePatrol(this.patrolPoint._id)
            .then(res => {
              this.deletePatrol(this.patrolPoint._id)
              this.successMsg('巡更点位信息删除成功')
              this.getMapPatrolTree()
              this.closeEditVePoCon()
            })
            .catch(err => {
              console.log(err)
              this.errorMsg('巡更点位信息删除失败')
            })
        },
        onCancel: () => {
          this.savePatrol(this.patrolPoint._id)
        }
      })
    },
    getMapPatrolTree() {
      if (this.isOuter) {
        this.getPatrolPoint()
          .then(res => {})
          .catch(err => {
            console.log(err)
          })
      } else {
        this.getPatrolPoint(this.levelData._id)
          .then(res => {})
          .catch(err => {
            console.log(err)
          })
      }
    },
    deletePatrol(id) {
      let patrols = editPatrolIpc.deletePatrol({
        patrolList: this.editPatrolList,
        id
      })
      this.$store.commit('SET_PATROL_LIST', patrols)
      this.$store.commit('SET_PATROLINMAP_LIST', patrols)
      this.closeEditVePoCon()
    },
    savePatrol(id) {
      let patrols = editPatrolIpc.savePatrol({
        patrolList: this.editPatrolList,
        id
      })
      this.$store.commit('SET_PATROL_LIST', patrols)
      this.$store.commit('SET_PATROLINMAP_LIST', patrols)
      this.closeEditVePoCon()
    },
    // 关闭视频点位编辑位置的控件
    closeEditVePoCon() {
      this.$store.commit('SET_CURRENT_PATROL', null)
      this.$store.commit('SET_MODIFYACTIVE_STATE', false) // 关闭编辑视频点位的控件
      if (this.isOuter) {
        this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'gridEditPage', detail: 'show' }) // 隐藏点位编辑弹框，显示网格列表
      } else {
        this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'floorEditPage', detail: 'show' }) // 隐藏点位编辑弹框，显示楼宇编辑页面
      }
    }
  },
  mounted() {
    this.patrolPoint = JSON.parse(JSON.stringify(this.onePartrol))
  }
}
</script>
<style scoped>
.videoPoint,
.videoPoint .videoPointContent {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.videoPoint .videoPointHeader {
  height: 38px;
  width: 100%;
  line-height: 38px;
  clear: both;
  background-color: #0f2343;
  font-size: 14px;
}

.videoPoint .videoPointHeader .pointHeaderTittle {
  float: left;
  margin-left: 20px;
}

.videoPoint .videoPointHeader .pointHeaderContent {
  float: right;
  margin-right: 20px;
  cursor: pointer;
}
.videoPoint .videoPointHeader .pointHeaderContent:hover {
  color: #20adff;
}

.videoPoint .videoPointHeader .pointHeaderContent p {
  display: inline;
}

.videoPoint .videoPointHeader .pointHeaderContent p i {
  display: inline;
  margin-right: 5px;
  font-style: normal;
}

.videoPointContent {
  padding-left: 20px;
  padding-right: 20px;
}
.videoPointContent .pointContentHeader {
  width: 100%;
  /* height: 50px; */
}
.videoPointContent .pointTittle {
  height: 40px;
  line-height: 40px;
  display: inline-block;
  margin: 0 10px;
  padding: 0 10px;
  margin-bottom: 10px;
  cursor: pointer;
  border-bottom: 1px solid #4996f9
}

.videoPoint .videoPointFooter {
  height: 40px;
  width: 100%;
  line-height: 40px;
  clear: both;
  text-align: center;
}
.videoPoint .buildEditImg {
  clear: both;
  width: 100%;
}
.videoPoint .buildEditImg .buildImg {
  width: 244px;
  height: 168px;
  border: 1px solid #5676a9;
  border-radius: 5px;
  margin-bottom: 15px;
}
.videoPoint .buildEditImg .buildEditImgText {
  float: right;
  font-size: 13px;
  padding: 5px 0px;
  color: orangered;
}
</style>
