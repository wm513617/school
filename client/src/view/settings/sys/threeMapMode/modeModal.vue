<template>
        <Modal v-model="isModal" :title="isModelAdd ? '模型添加' : '模型修改'" @on-ok="determine" @on-cancel="cancel" width="1000">
            <Form ref="formModelData" :model="formModelData" :label-width="80" inline :rules="ruleValidate">
                <FormItem label="模型类型" prop="type">
                    <RadioGroup v-model="formModelData.type" @on-change="selectType">
                        <Radio v-for="(item,index) in modelTypeAdd" :key="index" :label="item.value" style="margin-right:40px">{{item.label}}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="模型名称" prop="name">
                    <Input v-model="formModelData.name" placeholder="请输入模型名称" style="width:200px"></Input>
                </FormItem>
                <FormItem label="类别" prop="sort">
                    <Select v-model="formModelData.sort" style="width:200px" placeholder='无' :disabled="isSort">
                        <Option v-for="item in sortList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <div class="form-content">
                  <div v-for="(item, index) in formModelData.model" :key="index" style="margin-bottom:0px">
                    <FormItem label="模型状态" prop="status">
                      <Select v-model="item.status" style="width:100px" :disabled="isStatus" placeholder='无'>
                         <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="模型文件" prop="file">
                      <Upload action="//jsonplaceholder.typicode.com/posts/" style="height:34px" :format="['gltf']" :on-progress="onProgress" :on-format-error="formatError" :on-success="handleSuccess">
                        <Input v-model="item.file" placeholder="选择Gltf格式模型文件" style="width: 250px;">
                          <Button slot="append" icon="ios-cloud-upload-outline">浏览</Button>
                        </Input>
                      </Upload>
                    </FormItem>
                    <FormItem label="" :label-width='20' v-if="item.status === 0 ? true : item.status ? false : true" prop="image">
                      <Upload action="//jsonplaceholder.typicode.com/posts/" style="height:34px" :format="['jpeg','png']" :on-progress="onProgress" :on-format-error="formatError" :on-success="handleSuccess">
                        <Input v-model="item.image" placeholder="选择png、jpeg格式模型图片" style="width: 250px;">
                          <Button slot="append" icon="ios-cloud-upload-outline">浏览</Button>
                        </Input>
                      </Upload>
                    </FormItem>
                    <Button type="ghost" @click="addFormModel(index)" style="margin-right:8px"><Icon type="plus" size="16" /></Button>
                    <Button type="ghost" @click="removeFromModel(index)"><Icon type="trash-a" size="16" /></Button>
                  </div>
                </div>
              </FormItem>
            </Form>
            <div slot="footer">
                <Button type='ghost' class='commonStyle ivu-btn ivu-btn-ghost' @click="cancel">取消</Button>
                <Button type='primary' class='commonStyle ivu-btn ivu-btn-ghost' @click="determine('formModelData')">保存</Button>
            </div>
        </Modal>
</template>

<script>
export default {
  data() {
    return {
      formModelData: {
        type: '',
        name: '',
        sort: '',
        model: [
          {
            status: '',
            file: '',
            image: ''
          }
        ]
      },
      // 表单验证
      ruleValidate: {
        name: [
          { required: true, message: '请输入模型名称', trigger: 'change' },
          { type: 'string', max: 64, message: '名称不能超过64字符', trigger: 'change' }
        ]
      },
      // 添加框模型类型
      modelTypeAdd: [
        {
          value: 0,
          label: '视频模型'
        },
        {
          value: 1,
          label: '报警模型'
        },
        {
          value: 2,
          label: '报警求助模型'
        },
        {
          value: 3,
          label: '巡更模型'
        },
        {
          value: 4,
          label: '单兵模型'
        },
        {
          value: 5,
          label: '辅助模型'
        }
      ],
      sortList: [], // 类别列表
      statusList: [], // 状态列表
      sortListAll: [ // 所有类别
        [
          {
            value: 'type1',
            label: '枪机'
          },
          {
            value: 1,
            label: '球机'
          },
          {
            value: 2,
            label: '快球'
          },
          {
            value: 3,
            label: '全景'
          },
          {
            value: 4,
            label: '红外枪机'
          }
        ],
        [
          {
            value: 'type2',
            label: '普通报警'
          },
          {
            value: 1,
            label: '消防报警'
          }
        ],
        [
          {
            value: 'type3',
            label: '报警柱'
          },
          {
            value: 1,
            label: '报警箱'
          }
        ],
        [
          {
            value: 'type4',
            label: '常规'
          },
          {
            value: 1,
            label: '集合'
          }
        ]
      ],
      // 所有状态
      statusListAll: [
        [
          {
            value: 0,
            label: '正常'
          },
          {
            value: 1,
            label: '离线'
          },
          {
            value: 2,
            label: '报警'
          }
        ],
        [
          {
            value: 0,
            label: '正常'
          },
          {
            value: 1,
            label: '报警'
          }
        ]
      ],
      isSort: false, // 是否有类别
      isStatus: false, // 是否有状态
      modal: false,
      uploadSuccess: false // 上传是否成功
      // isModal: false, // 弹出框显示
      // isModelAdd: true// 弹出框标题
    }
  },
  props: {
    isModal: {
      type: Boolean,
      default: true
    },
    isModelAdd: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    /**
     * 弹出框添加按钮
     */
    addFormModel(n) {
      if (this.statusList[0]) {
        this.formModelData.model.push(
          {
            status: this.statusList[0].value,
            file: '',
            image: ''
          }
        )
      } else {
        this.formModelData.model.push(
          {
            status: '',
            file: '',
            image: ''
          }
        )
      }
    },
    /**
     * 弹出框删除按钮
     */
    removeFromModel(n) {
      if (this.formModelData.model.length !== 1) {
        this.formModelData.model.splice(n, 1)
      }
    },
    /**
     * 弹出框取消按钮
     */
    cancel() {
      console.log()
      this.formModelData.model = [
        {
          status: '',
          file: '',
          image: ''
        }
      ]
      this.$refs['formModelData'].resetFields()
      this.$emit('cancel')
    },
    /**
     * 弹出框保存按钮
     */
    determine(name) {
      if (this.isModelAdd) {
        this.$refs[name].validate((valid) => {
        })
      } else {
        // 修改服务器
        this.$refs[name].validate((valid) => {
        })
      }
    },
    /**
     * 弹出框类型改变
     */
    selectType() {
      this.sortList = []
      this.formModelData.sort = ''
      this.isSort = true
      this.isStatus = false
      this.statusList = this.statusListAll[1]
      this.formModelData.model.forEach((item, index) => {
        item.status = this.statusList[0].value
      })
      if (this.formModelData.type <= 3) {
        this.isSort = false
        this.sortList = this.sortListAll[this.formModelData.type]
        this.formModelData.sort = this.sortList[0].value
      }
      if (this.formModelData.type === 0) {
        this.statusList = this.statusListAll[this.formModelData.type]
      } else if (this.formModelData.type === 5) {
        this.statusList = []
        this.formModelData.model.forEach((item, index) => {
          item.status = ''
        })
        this.isStatus = true
      }
    },
    /**
     * 文件上传时钩子
     */
    onProgress(event, file, fileList) {
      console.log(event, file, fileList)
      if (fileList.length > 1) {
        fileList.shift()
      }
    },
    /**
     * 上传文件格式错误
     */
    formatError(file, fileList) {
      this.errorMsg('文件格式错误')
    },
    /**
     * 上传成功时的钩子
     */
    handleSuccess(response, file, fileList) {
      this.uploadSuccess = true
      console.log(response, file, fileList)
    }
  },
  created() {
  },
  watch: {
    isModal(val) {
      this.modal = val
      if (this.modal === true) {
        this.isSort = false
        this.isStatus = false
        this.formModelData.type = 0
        this.sortList = this.sortListAll[0]
        this.formModelData.sort = this.sortList[0].value
        this.statusList = this.statusListAll[0]
        this.formModelData.model[0].status = this.statusList[0].value
      }
    }
  }
}
</script>

<style scoped>

</style>
