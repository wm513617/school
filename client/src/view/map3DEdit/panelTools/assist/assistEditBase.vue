<!-- 辅助模型信息编辑面板--逻辑控制脚本文件 -->
<script>
import { mapActions } from 'vuex'
import utils from 'assets/3DMap/utils/index'
import { isInvalidPrincipal } from 'components/map/formCheck'

export default {
  data() {
    const nameValid = (rule, value, callback) => { // 名称校验
      value = value.replace(/(^\s*)|(\s*$)/g, '')
      if (value && value.length > 0) {
        let len = 0
        for (let i = 0; i < value.length; i++) {
          const code = Number(value[i].charCodeAt(0))
          if (code > 127) {
            len += 2
          } else {
            len++
          }
        }
        if (len > 32) {
          return callback(new Error('不能超过32位字符'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('名称不能为空'))
      }
    }
    return {
      validateRule: {
        name: [{ required: true, validator: nameValid, trigger: 'change' }]
      }
    }
  },
  methods: {
    ...mapActions([
      'set3DActiveChangePositionDraw', // 控制3D位置绘制
      'deleteAssistHoleById', // 删除辅助杆
      'updateAssistHoleById', // 更新辅助杆
      'getAssistHoleById' // 根据标识获取辅助杆数据
    ]),
    refreashFormInfo(val) { // 刷新表单信息
      if (!val[this.mapMode]) {
        this.transAssistPoleInfo(val) // 转换成表单呈现的辅助杆点位信息
        this.loadModelList(val) // 加载模型列表
      }
    },
    transAssistPoleInfo(val) { // 转换成表单呈现的辅助杆点位信息
      this.point3D = val
      this.pointInfo = this.$lodash.cloneDeep(val) // 深拷贝辅助杆点位信息
      if (!this.pointInfo.name) { // 没有名称信息时，添加默认名称
        this.pointInfo.name = ''
      }
      if (this.pointInfo.loc) { // 设置高度信息
        let coValues = this.pointInfo.loc.split(',').map(item => Number(item))
        if (coValues && coValues.length === 3) { // 坐标是三维坐标时，设置高度信息
          this.pointInfo.height = coValues[2]
        }
        this.locFormat = utils.formatLoc(this.pointInfo.loc) // 格式化经纬度高度信息
        if (!this.pointInfo.principal || this.pointInfo.principal.length === 0) {
          this.pointInfo.principal = [{name: '', mobile: ''}] // 初始化联系信息
        }
      }
    },
    changePointLoc(loc) { // 改变点位的位置信息
      this.pointInfo.loc = loc
      if (this.pointInfo.loc) {
        let coValues = this.pointInfo.loc.split(',').map(item => Number(item))
        if (coValues && coValues.length === 3) { // 坐标是三维坐标时，设置高度信息
          this.pointInfo.height = coValues[2]
        }
        this.locFormat = utils.formatLoc(this.pointInfo.loc) // 格式化经纬度高度信息
      }
    },
    deleteAssistHolePoint() { // 删除辅助模型点位
      let _pointData = JSON.parse(JSON.stringify(this.mapResource)) // 地图资源数据
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除所选辅助杆点位吗？</p>',
        onOk: () => { // 确认回调方法
          this.deleteAssistHoleById(_pointData._id) // 根据id删除辅助杆点位数据
            .then(res => {
              if (this.is3DMapOuter) { // 楼外3D地图
                this.cancel3DMapSelectedEffect() // 取消实体选中效果
                if (this.ready) { // 地图加载完成时
                  this.$context.viewer.entities.removeById(_pointData._id) // 地图实体集合中根据实体id移除实体
                }
              }
              this.successMsg('辅助杆点位删除成功')
            })
            .catch(err => {
              console.log('辅助杆点位删除失败：', err)
              this.errorMsg('辅助杆点位删除失败')
            })
        },
        onCancel: () => {}
      })
    },
    saveAssistHolePoint(name) { // 保存辅助模型点位信息
      this.$refs[name].validate(valid => {
        if (valid) { // 表单校验成功
          let result = isInvalidPrincipal(this.pointInfo.principal)
          if (result.flag && result.msg) {
            this.errorMsg(result.msg)
          } else {
            console.log('辅助杆点位信息表单校验成功！')
            this.saveAssistHolePointData() // 保存辅助杆点位数据
          }
        } else { // 表单校验失败
          console.log('保存辅助杆点位信息表单校验失败！')
          this.selectedTab = 'resource' // 跳转到资源表单信息
        }
      })
    },
    saveAssistHolePointData() { // 保存辅助杆点位数据
      this.updateAssistHoleById(this.pointInfo).then(res => {
        this.successMsg('辅助杆点位修改成功')
        if (this.is3DMapOuter) { // 楼外3D地图
          this.cancel3DMapSelectedEffect() // 取消3D视地图体选中效果
        }
      }).catch(err => {
        let data = (err.response && err.response.data) ? err.response.data : err
        console.log('辅助杆点位修改失败', data)
        let msg = data.message ? data.message : '辅助杆点位修改失败'
        this.errorMsg(msg)
      })
    },
    cancelSaveAssistHolePoint(name) { // 取消保存
      this.$refs[name].resetFields() // 重置表单
      if (this.is3DMapOuter) { // 当前地图是楼外3D地图时
        this.resetPointEntity() // 还原之前的实体效果
        this.cancel3DMapSelectedEffect() // 取消3D地图实体选中效果
      }
    },
    resetPointEntity() { // 重置点为实体
      this.getAssistHoleById(this.mapResource._id).then(res => {
        let point3D = res
        this.resetEntity(point3D) // 还原之前的实体效果
      })
    }
  }
}
</script>
