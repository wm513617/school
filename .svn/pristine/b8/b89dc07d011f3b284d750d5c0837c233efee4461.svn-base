<template>
  <Modal :mask-closable="false" v-model="isShow" title="设备移动" width="450" @on-visible-change="$emit('close')">
    <div>
      <p>选择设备,将设备移动到当前机构下</p>
      <div class="res-model-tree">
        <bs-scroll ref="moveScroller">
          <VTree :treeData="devMoveData" :options="deviceMoveTreeOptions" @node-click="selectMoveOrg" :activeId="resMoveOrgId" @on-expand="$refs.moveScroller.update()">
          </VTree>
        </bs-scroll>
      </div>
    </div>
    <div slot="footer">
      <Button type="ghost" @click="$emit('close')">取消</Button>
      <Button type="primary" @click="sureToMove">确认</Button>
    </div>
  </Modal>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShow: this.isOpen,
      devMoveData: [],
      deviceMoveTreeOptions: {
        showInput: false
      },
      resMoveOrgId: '',
      isShareServer: true
    }
  },
  computed: {
    ...mapState({
      orgTreeData: ({ alarmManage }) => alarmManage.orgTreeData
    })
  },
  created() {
    this.devMoveData = JSON.parse(JSON.stringify(this.orgTreeData))
  },
  mounted() {
    this.$refs.moveScroller.update()
  },
  methods: {
    // 获取当前设备机构
    selectMoveOrg(ops) {
      this.resMoveOrgId = ops._id
      if (ops.shareServer) {
        this.isShareServer = false
      } else {
        this.isShareServer = true
      }
    },
    sureToMove() {
      if (!this.isShareServer) {
        this.errorMsg('该机构不可操作！')
        return
      }
      this.$emit('moveDevice', this.resMoveOrgId)
    }
  }
}
</script>

<style scoped lang=''>
.res-model-tree {
  height: 450px;
  width: 400px;
  margin-top: 20px;
  overflow: hidden;
}
</style>
