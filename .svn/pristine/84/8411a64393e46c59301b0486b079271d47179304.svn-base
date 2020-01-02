<template>
  <div id="editGroup" v-if='openEditGroup' @click.stop>
    <iframe>
    </iframe>
    <div class="editGroupBox">
      <div class="editheader">
        <div class="title">编辑当前组</div>
        <div class="flag" @click='cancel'>
          <Icon type="close"></Icon>
        </div>
      </div>
      <div class="content">
        <div class="editName">
          <table>修改组名称</table>
          <input type="text" class="ivu-input editInput" v-model="groupName" placeholder="请输入..." style="width: 200px;">
          <Checkbox v-model="setOpen" style='margin-left: 28px'>&nbsp;将该组设定为轮巡组</Checkbox>
        </div>
        <div class="editName">
          <table :class="{'disabled':!setOpen}">轮巡时间间隔</table>
          <input type="text" class="ivu-input editInput" v-model="turningTime" placeholder="请输入..." :disabled='!setOpen' style="width: 200px;">
          </Input>
          <span style="padding:3px;">秒</span>
        </div>

        <div class="editSet">
          <Transfers :groupListData="groupList" @changeData="changeData"></Transfers>
        </div>

        <div class="editBtnBox">
          <Button @click='cancel' type="ghost">取消</Button>
          <Button type="primary" @click='save'>保存</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Transfers from './Transfers.vue'
export default {
  name: 'editGroup',
  components: { Transfers },
  props: {
    openEditGroup: {
      default: false
    },
    groupData: {
      default: {}
    }
  },
  data() {
    return {
      groupName: '',
      setOpen: false,
      turningTime: 10,
      groupList: [],
      groupListData: [],
      options: {
        showInput: true
      }
    }
  },
  computed: {
  },
  watch: {
    openEditGroup(val) {
      if (!val) { return }
      this.groupName = this.groupData.name
      this.setOpen = this.groupData.ispolling === 'true'
      this.turningTime = this.groupData.pollingtime
      this.groupList = this.deepCopy(this.groupData.children)
      this.groupListData = this.deepCopy(this.groupData.children)
    },
    turningTime(newval, oldval) {
      // newval = parseInt(newval) ? parseInt(newval) : 0
      // this.turningTime = newval
      // console.log(parseInt(newval))
      if (!/^[0-9]{0,21}$/.test(newval + '')) { this.turningTime = oldval }
    }
  },
  methods: {
    deepCopy(obj) {
      let newobj = (obj && obj.constructor === Array) ? [] : {}
      for (let i in obj) {
        if (typeof obj[i] === 'object') {
          newobj[i] = this.deepCopy(obj[i])
        } else {
          newobj[i] = obj[i]
        }
      }
      return newobj
    },
    changeData(data) {
      this.groupListData = data
    },
    cancel() {
      this.$emit('editCancel')
      this.groupName = ''
      this.groupList = []
    },
    save() {
      const obj = {}
      obj._id = this.groupData._id
      obj.name = this.groupName
      obj.ispolling = this.setOpen
      obj.pollingtime = this.turningTime
      obj.creator = this.groupData.creator
      obj.owners = this.groupData.owners
      obj.resources = []
      for (const i in this.groupListData) {
        obj.resources.push(this.groupListData[i]._id.split('_')[0])
      }
      this.$emit('editSave', obj)
      this.cancel()
    }
  }
}
</script>

<style scoped>
#editGroup {
  width: 620px;
  height: 550px;
  position: absolute;
  background: #1b3153;
  top: 40vh;
  left: 50vw;
  margin-left: -310px;
  margin-top: -275px;
  z-index: 999999999;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  color: #fff;
  border-radius: 8px;
}
iframe {
  background-color: transparent;
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 0 none;
}
.editGroupBox {
  position: absolute;
  z-index: 99999999;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.editheader {
  width: 100%;
  height: 36px;
  line-height: 36px;
  border-bottom: 1px solid #0f2343;
  padding: 0 10px;
  background: #0f2343;
  border-radius: 8px 8px 0 0;
}
.editheader .title {
  float: left;
}
.editheader .flag {
  float: right;
  cursor: pointer;
}
.content {
  width: 100%;
  height: 512px;
  padding: 15px 12px;
}
.editName {
  margin: 10px 0;
}
.editName table {
  line-height: 26px;
  width: 85px;
  display: inline-block;
}
.editName table.disabled {
  color: #999;
}
.editName .editInput {
  height: 26px;
  /* line-height: 26px; */
}
.content {
  border-bottom: 1px solid #203863;
}
.editBtnBox {
  width: 135px;
  position: absolute;
  right: 20px;
  bottom: 12px;
}
.editBtnBox * {
  margin: 0 4px;
}
</style>
