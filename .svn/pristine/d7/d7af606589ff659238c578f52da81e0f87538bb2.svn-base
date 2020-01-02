<template>
  <div class="share-resource">
    <section class="server-resource">
      <header>
        共享资源
        <Select :value="selectResource" @on-change="(v) => $emit('update:selectResource', v)" style="width:200px;float: right;">
          <Option value="video">视频资源</Option>
          <Option value="alarm">报警资源</Option>
        </Select>
      </header>
      <article>
        <bs-scroll ref="treeScroller-1">
          <bsr-tree :treeData="showLocal ? shareTree[0] || {} : treeData[0] || {}" ref="tree-1"  @on-expand="$refs['treeScroller-1'].update()" @handlechecked="handlecheckedChange" :showCheckbox="!isLimit" :selectNode="checkedList" isHalfCheck>
            <template slot-scope="{ node }">
              <span :class="{'item': true}" :title="node.name">
                <i class="iconfont" :class="[getNodeIcon(node).class]" :title="getNodeIcon(node).title"></i>
                {{node.name}}
              </span>
            </template>
          </bsr-tree>
        </bs-scroll>
      </article>
      <footer></footer>
    </section>
    <section class="local-resource" v-if="showLocal">
      <header>
        映射到本级机构
      </header>
      <article>
        <bs-scroll ref="treeScroller-2">
          <bsr-tree :treeData="treeData[0] || {}" ref="tree-2"  @on-expand="$refs['treeScroller-2'].update()" @node-click="(n) => treeActiveId = n.isOrg ? n._id : null">
            <template slot-scope="{ node }">
              <span :class="{'item': true}" :title="node.name">
                <i class="iconfont" :class="[getNodeIcon(node).class]" :title="getNodeIcon(node).title"></i>
                {{node.name}}
              </span>
            </template>
          </bsr-tree>
        </bs-scroll>
      </article>
      <footer>
        <Button type="primary" @click="save" :disabled="isLimit">保存</Button>
      </footer>
    </section>
  </div>
</template>
<script>
import {getNodeIcon} from 'components/BStree/commonMethods.js'
export default {
  props: ['videoTree', 'alarmTree', 'videoCheckedList', 'alarmCheckedList', 'shareTree', 'showLocal', 'selectResource', 'activeServer', 'isLimit'],
  data() {
    return {
      treeActiveId: null
    }
  },
  computed: {
    treeData() {
      switch (this.selectResource) {
        case 'video':
          return this.videoTree
        case 'alarm':
          return this.alarmTree
      }
    },
    checkedList() {
      switch (this.selectResource) {
        case 'video':
          return this.videoCheckedList
        case 'alarm':
          return this.alarmCheckedList
      }
    }
  },
  methods: {
    getNodeIcon(item) {
      return getNodeIcon(item)
    },
    save() {
      const activeTrees = this.$refs['tree-1'].getSelectedNodes()
      this.$emit('save', {orgId: this.treeActiveId, orgs: activeTrees})
    },
    handlecheckedChange() {
      const activeTrees = this.$refs['tree-1'].getSelectedNodes()
      this.$emit('checkedChange', activeTrees)
    }
  }
}
</script>
<style lang="less" scoped>
  .share-resource {
    flex: auto;
    display: flex;
    height: 100%;
    flex-direction: row;
  }
  section {
    flex: 0 0 420px;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin-right: 40px;
    header {
      font-size: 14px;
      font-weight: bold;
      flex: 0 0 40px;
      line-height: 40px;
    }
    article {
      flex: 1 1 100%;
      border: 1px solid #4699f9;
    }
    footer {
      flex: 0 0 40px;
      padding-top: 10px;
    }
  }
</style>
