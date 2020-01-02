<!--编辑模式 楼层的编辑框的页面-->
<template>
  <div class="areaHome">
    <div class="areaHeader">
      <p>楼层</p>
    </div>
    <div class="areaContent">
      <Form ref="floorData" :model="floorData" :rules="ruleValidate" :label-width="70" label-position="left">
        <Form-item label="楼层名称" prop="name">
          <Input :maxlength="16" v-model="floorData.name" placeholder="请输入" />
        </Form-item>
        <FormItem label="楼层文件" prop="picture.id">
          <Row>
            <Col span="15">
            <Input v-model="floorData.picture.id" disabled placeholder="请选择地图文件" style="float:left" />
            </Col>
            <Col span="4">
            <Upload :show-upload-list="false" action="/api/upload" :on-success="uploadEditSuccess" :multiple="false" ref="upload" :format="['jpg','jpeg','png']" :on-format-error="mapFormatError">
              <Button type="ghost" icon="ios-cloud-upload-outline">浏览</Button>
            </Upload>
            </Col>
          </Row>
        </FormItem>
        <Form-item label='联系人'>
          <Input :maxlength='8' v-model="floorData.pid.name" placeholder="请输入联系人" />
        </Form-item>
        <Form-item label='联系电话'>
          <Input :maxlength='18' v-model="floorData.pid.mobile" placeholder="请输入联系人电话" />
        </Form-item>
        <Form-item label="简介">
          <Input :maxlength='150' v-model="floorData.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" />
        </Form-item>
      </Form>
    </div>
    <div class="areaFooter">
      <Button type="ghost" @click="mapFloorCannel" style="margin-left: 8px">取消</Button>
      <Button type="primary" @click="mapFloorSave('floorData')" style="margin-left: 8px">保存</Button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  components: {},
  data() {
    const floorName = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('楼层名称不能为空'))
      }
      if (value.indexOf(' ') > -1) {
        return callback(new Error('楼层名称不能包含空格'))
      }
      let strlength = value.replace(/[\u0391-\uFFE5]/g, 'aa').length
      if (strlength > 16) {
        return callback(new Error('楼层名称长度超过16个字符'))
      } else {
        callback()
      }
    }
    return {
      floorData: {
        name: '', // 楼层名称
        // 地图文件
        picture: {
          id: '',
          name: ''
        },
        desc: '', // 楼层简介
        class: 1, // 楼层级别
        bid: '', // 所属楼宇
        // 联系人
        pid: {
          name: '',
          mobile: ''
        }
      },
      ruleValidate: {
        name: [{ required: true, validator: floorName, trigger: 'change' }],
        'picture.id': [{ required: true, message: '楼层文件不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      buildData: ({ mapGisData }) => mapGisData.buildData, // 单个楼宇信息
      levelData: ({ mapGisData }) => mapGisData.levelData, // 单个楼层信息
      detail: ({ mapPageState }) => mapPageState.mapEditRightPage.detail
    })
  },
  watch: {
    levelData(val) {
      this.floorData = val
    }
  },
  methods: {
    ...mapMutations([
      'SET_EDITRIGHTPAGE_STATE',
      'SET_ISOUTER_STATE',
      'SET_EDITVEDIOIPC_LIST',
      'SET_EDITVEDIOIPCINMAP_LIST',
      'SET_EDITVEDIOSECTOR_LIST',
      'SET_EDITCURRENTVEDIO_FEATURE',
      'SET_EDITCURRENTVEDIO_SECTOR',
      'SET_EDITFLOOR_ZOOM'
    ]),
    ...mapActions([
      'addOneLevel',
      'editOneLevel',
      'getOneBuild',
      'getLevel',
      'getResourceOrg',
      'getAlarmOrg',
      'getPatrolPoint'
    ]),
    // 图片上传
    uploadEditSuccess(val) {
      this.floorData.picture.id = val.id
      this.floorData.picture.name = val.name
    },
    mapFormatError(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg、jpeg 或 png 格式的图片。'
      })
    },
    initPage() {
      this.getResourceOrg()
      this.getAlarmOrg()
      this.getPatrolPoint()
      this.$store.commit('SET_ISOUTER_STATE', true)
      this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'buildEditPage', detail: 'edit' })
      this.getOneBuild(this.buildData._id)
        .then(res => {
          this.getLevel(res._id)
            .then(res => {})
            .catch(err => {
              console.log(err)
            })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 取消保存
    mapFloorCannel() {
      this.initPage()
      this.$store.commit('SET_EDITVEDIOIPC_LIST', [])
      this.$store.commit('SET_EDITVEDIOIPCINMAP_LIST', [])
      this.$store.commit('SET_EDITVEDIOSECTOR_LIST', [])
      this.$store.commit('SET_EDITCURRENTVEDIO_FEATURE', null)
      this.$store.commit('SET_EDITCURRENTVEDIO_SECTOR', null)
    },
    floorSave() {
      if (this.detail === 'show') {
        let playod = null
        if (this.floorData.name === this.levelData.name) {
          playod = {
            picture: this.floorData.picture,
            desc: this.floorData.desc,
            class: this.floorData.class,
            bid: this.floorData.bid,
            pid: this.floorData.pid,
            _id: this.floorData._id
          }
        } else {
          playod = this.floorData
        }
        this.editOneLevel(playod)
          .then(res => {
            this.initPage()
            this.$store.commit('SET_EDITRIGHTPAGE_DEFAULTACTIVE', 'buildingInfo')
          })
          .catch(err => {
            console.log(err)
            this.errorMsg(err.response.data.message)
          })
      } else {
        this.floorData.bid = this.buildData._id
        this.addOneLevel(this.floorData)
          .then(res => {
            this.initPage()
            this.$store.commit('SET_EDITRIGHTPAGE_DEFAULTACTIVE', 'buildingInfo')
          })
          .catch(err => {
            console.log(err)
            this.errorMsg(err.response.data.message)
          })
      }
    },
    // 保存
    mapFloorSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let value = this.floorData.pid.mobile
          if (value) {
            let patrn = /^([0-9]|[-])+$/g
            if (patrn.test(value)) {
              this.floorSave()
            } else {
              this.errorMsg('联系方式输入有误，仅支持数字和(-)')
            }
          } else {
            this.floorSave()
          }
        }
      })
    }
  },
  mounted: function() {
    if (this.detail === 'show') {
      this.floorData = JSON.parse(JSON.stringify(this.levelData))
    }
  }
}
</script>
<style scoped>
.areaHome {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.areaHome .areaHeader {
  height: 40px;
  width: 100%;
  line-height: 40px;
  text-align: center;
  clear: both;
  background-color: #0f2343;
}
.areaHome .areaContent {
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 10px;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 300px;
}
.areaHome .areaContent .ivu-upload-list {
  margin: none !important;
}
.areaHome .areaContent .pointTittle {
  height: 40px;
  line-height: 40px;
}
.areaHome .areaContent .floorClass p {
  display: inline-block;
  padding: 5px 10px;
}
.areaHome .areaContent .linkMan {
  text-align: center;
}
.areaHome .areaFooter {
  height: 40px;
  width: 100%;
  line-height: 40px;
  clear: both;
  background-color: #0f2343;
  text-align: center;
}
.uplodeImg {
  width: 100%;
  height: 100%;
  border: 1px solid red;
}
</style>
