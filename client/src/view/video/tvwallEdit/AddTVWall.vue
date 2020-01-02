<template>
  <div style="flex:1;height:100%" class="add-tv">
    <div class="tv-con theme-pane">
      <i class="icon iconfont icon-close1" @click="cancel"></i>
      <h2 class="theme-title">添加电视墙</h2>
      <div class="form">
        <div style="width: 500px;">
          <Form ref="formValidate" :model="formValidate" :rules="validateRule" :label-width="110">
            <Form-item label="电视墙名称" prop="tvName">
              <Input v-model="formValidate.tvName"></Input>
            </Form-item>
            <Form-item label="电视墙位置" prop="tvPosition" :width="100" class="notRequire">
              <Input v-model="formValidate.tvPosition"></Input>
            </Form-item>
            <Form-item label="启用拼接控制器" :width="135" class="notRequire" style="text-align: left;">
              <Checkbox v-model="isChecked" style="padding-left:0;"></Checkbox>
            </Form-item>
            <div v-if="isChecked">
              <Form-item label="品牌">
                <VSelect class="tvwall-select" :options="controllerInfo" v-model="manufacturer" @getOption="manuChange" style="width:100%;float:left;" :maxHeight="200"></VSelect>
              </Form-item>
              <Form-item label="拼接控制器地址">
                <VSelect class="tvwall-select" :options="IPList" v-model="manuIP" @getOption="IPchange" style="width:100%;float:left;" :maxHeight="200"></VSelect>
              </Form-item>
              <!-- <Form-item label="拼接屏数量">
                <Input v-model="screenNum"></Input>
              </Form-item> -->
            </div>
            <div v-else>
              <Form-item label="监视器数量" :width="100" class="notRequire" style="text-align: left;">
                <div style="display:inline-block;margin-right:20px;">
                  <Input :class="{invalid: !columnvalid}" v-model="column" style="width: 100px;" @on-blur="blurcheck('column')">
                  <span slot="append">横向</span>
                  </Input>
                </div>
                <div style="display:inline-block;">
                  <Input :class="{invalid: !rowvalid}" v-model="row" style="width: 100px;" @on-blur="blurcheck('row')">
                  <span slot="append">纵向</span>
                  </Input>
                </div>
              </Form-item>
            </div>
          </Form>
        </div>
        <div>
          <Button type="ghost" @click="cancel">取消</Button>
          <Button type="primary" @click="validate">确认</Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import VSelect from 'components/common/VSelect'
export default {
  components: {
    VSelect
  },
  data() {
    return {
      selected: 0,
      row: '',
      column: '',
      rowvalid: true,
      columnvalid: true,
      formValidate: {
        tvName: '',
        tvPosition: ''
      },
      validateRule: {
        tvName: [
          {
            required: true,
            message: '电视墙名称不能为空',
            trigger: 'blur'
          },
          {
            type: 'string',
            max: 256,
            message: '0-256个字符',
            trigger: 'blur'
          }
        ],
        tvPosition: [
          {
            type: 'string',
            max: 256,
            message: '0-256个字符',
            trigger: 'blur'
          }
        ]
      },
      isSave: false,
      isChecked: false,
      manufacturer: '',
      manuIP: '',
      // screenNum: 0,
      IPList: [],
      cport: 0
    }
  },
  computed: {
    ...mapState({
      allLayoutList: ({ tvwall }) => tvwall.allLayoutList,
      controllerInfo: ({ tvwall }) => tvwall.controllerInfo,
      wallNames: ({ tvwall }) => tvwall.wallNames,
      allTvWallList: ({ tvwall }) => tvwall.allTvWallList
    })
  },
  watch: {
    controllerInfo: {
      handler: function() {
        this.manufacturer = this.controllerInfo[0] ? this.controllerInfo[0].value : ''
        this.initControl(this.controllerInfo[0])
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(['addTVWall', 'getTVList', 'getDeviceInfos']),
    catchLayoutId(name) {
      const item = this.$lodash.find(this.allLayoutList, item => item.name === name)
      return item ? item._id : null
    },
    validate() {
      if (!this.validCount()) {
        return
      }
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.save()
        } else {
          this.$Notice.error({
            title: '错误',
            desc: '请输入正确格式',
            duration: 2
          })
        }
      })
    },
    validCount() {
      if (!this.rowvalid) {
        this.$Notice.error({
          title: '错误',
          desc: '纵向必须为数字',
          duration: 2
        })
      } else if (!this.columnvalid) {
        this.$Notice.error({
          title: '错误',
          desc: '横向必须为数字',
          duration: 2
        })
      } else {
        const row = this.row
        const column = this.column
        if (row > 64) {
          this.$Notice.error({
            title: '错误',
            desc: '纵向不能超过64个',
            duration: 2
          })
        } else if (column > 64) {
          this.$Notice.error({
            title: '错误',
            desc: '横向不能超过64个',
            duration: 2
          })
        } else if (row === 0) {
          this.$Notice.error({
            title: '错误',
            desc: '纵向不能为0',
            duration: 2
          })
        } else if (column === 0) {
          this.$Notice.error({
            title: '错误',
            desc: '横向不能为0',
            duration: 2
          })
        } else {
          return true
        }
      }
      return false
    },
    save() {
      if (this.isSave) {
        return
      }
      this.isSave = true
      const row = this.row || 0
      const column = this.column || 0
      let param = {}
      if (this.isChecked) {
        param = {
          name: this.formValidate.tvName,
          position: this.formValidate.tvPosition,
          jointcontroller: {
            checked: this.isChecked,
            info: {
              manufacturer: this.manufacturer, // 厂商
              ip: this.manuIP, // ip
              // screencount: this.screenNum, // 拼接屏数量
              port: this.cport
            }
          }
        }
      } else {
        param = {
          name: this.formValidate.tvName,
          position: this.formValidate.tvPosition,
          row: row,
          column: column,
          layout: this.catchLayoutId(row + '*' + column)
        }
      }
      this.addTVWall(param)
        .then(suc => {
          return this.getTVList()
        })
        .then(() => {
          this.$emit('update:isAddTVWall', false)
          this.isSave = false
          this.$parent.changeTabIndex(this.allTvWallList.length - 1)
        })
        .catch(err => {
          this.isSave = false
          console.log('addTVWall', err)
          this.$Notice.error({
            title: '错误',
            desc: err.response.data.message,
            duration: 3
          })
        })
    },
    cancel() {
      this.$emit('cancel')
      // this.$router.replace('/navigation')
    },
    blurcheck(type) {
      const reg = /^\d*$/
      if (type === 'row') {
        if (reg.test(this.row)) {
          this.rowvalid = true
        } else {
          this.rowvalid = false
        }
      } else {
        if (reg.test(this.column)) {
          this.columnvalid = true
        } else {
          this.columnvalid = false
        }
      }
    },
    initControl(item) {
      if (item) {
        const list = this.$lodash.cloneDeep(item.ip)
        this.IPList = list
        this.manuIP = list[0].value
        // this.screenNum = list[0].num
        this.cport = list[0].cport
      }
    },
    manuChange(v) {
      this.manufacturer = v.value
      for (const i in this.controllerInfo) {
        const item = this.controllerInfo[i]
        if (item.value === v.value) {
          this.initControl(item)
        }
      }
    },
    IPchange(item) {
      this.manuIP = item.value
      for (const i in this.IPList) {
        if (item.value === this.IPList[i].value) {
          this.cport = this.IPList[i].cport
        }
      }
    }
  },
  created() {
    this.getDeviceInfos()
    this.formValidate.tvName = '监控中心' + (this.wallNames.length + 1)
  }
}
</script>
<style lang="less" scoped>
.icon-close1 {
  position: absolute;
  right: 12px;
  cursor: pointer;
  top: 10px;

  &:hover {
    color: #fff;
  }
}

.ivu-input-type {
  width: 390px;
}

.tv-con {
  width: 800px;
  // height: 430px;
  z-index: 100;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -390px;
  transform: translateY(-50%);

  h2 {
    height: 40px;
    line-height: 40px;
    font-weight: normal;
    font-size: 16px;
    padding-left: 20px;
  }

  .form .ivu-form .ivu-form-item-label {
    font-size: 14px;
    color: red;
  }

  .form {
    margin: 40px auto 0 auto;

    > div {
      margin: 20px auto;
      text-align: center;
    }

    label {
      font-size: 14px;
      height: 30px;
      margin-right: 20px;
      line-height: 30px;
      display: inline-block;
      width: 90px;
      padding-left: 18px;
    }

    button {
      padding: 0 50px;
      height: 30px;
      font-size: 14px;
      cursor: pointer;
      margin: 20px;
      border-radius: 2px;
    }
  }
}
</style>
<style>
.notRequire .ivu-form-item-label {
  padding-right: 22px;
}
.v-select.searchable.tvwall-select .dropdown-toggle,
.v-select.searchable.tvwall-select .dropdown-toggle .form-control {
  height: 32px !important;
}
.v-select.tvwall-select .selected-tag {
  line-height: 32px !important;
}
</style>
