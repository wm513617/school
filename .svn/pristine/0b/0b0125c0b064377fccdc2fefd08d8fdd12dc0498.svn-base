<template>
  <div id="Transfer" @click.stop>
    <div class="editSetBox">
      <div class="header">
        <div class="left">机构</div>
      </div>
      <div class="rightGroup">
        <!-- <bs-scroll ref="scrollers">
          <Bsr-Tree :treeData="videoOrgData[0]||{}" :showCheckbox="true" ref="bstree"  @on-expand="expand" v-if="showTree">
            <template slot-scope="{ node }">
              <span :class="{'item': true, 'offline': (!node.nodeId&&(node.eid && node.status !== 1))}" :title="node.name">
                <i class="iconfont" :class="[getNodeIcon(node).class]" :title="getNodeIcon(node).title"></i>
                {{node.name}}
              </span>
            </template>
          </Bsr-Tree>
        </bs-scroll> -->
        <TreeBox ref="tree" v-if="showTree" :searchToggle="false" :resourceToggle="true" :equipmentToggle="false" :checkBox="true" :iconToggle="false" @checksData="checksData" @refreshSuc="$emit('refreshSuc')"></TreeBox>
      </div>
    </div>

    <div class="editSetCenter">
      <div class="move" @click='movePositLeft'>
        <Icon type="arrow-right-a" title="移入"></Icon>
      </div>
      <div class="move" @click='movePositRight'>
        <Icon type="arrow-left-a" title="移出"></Icon>
      </div>
    </div>

    <div class="editSetBox">
      <div class="header">
        <div class="left">组内镜头</div>
        <div class="right" @click.stop="batchDownMove">
          <Icon type="arrow-down-c"></Icon>下移</div>
        <div class="right" @click.stop="batchUpMove">
          <Icon type="arrow-up-c"></Icon>上移</div>
      </div>
      <div class="leftGroup" @dragover.prevent @drop.stop.prevent="handleDrop">
        <bs-scroll ref="scroller">
          <ul>
            <li v-for='(item,index) in groupList' :key="index">
              <!--{{item.name}}-->
              <span class="ivu-checkbox" :class="{'ivu-checkbox-checked':item.isChecked}" @click.stop="toggleChecked(index)">
                <span class="ivu-checkbox-inner"> </span>
              </span>

              <input type="checkbox" class="check" v-model='item.isChecked' style="opacity: 0;margin-left: -15px;" />&nbsp;
              <span class="title" :title="item.name">{{item.name}}</span>
              <span class="arrows">
                <span class="arrow" :class="{'none':index===groupList.length-1}" @click='movePositDown(index)'>
                  <Icon type="arrow-down-c" title="下移"></Icon>
                </span>
                <span class="arrow" :class="{'none':index===0}" @click='movePositUp(index)'>
                  <Icon type="arrow-up-c" title="上移"></Icon>
                </span>
              </span>
            </li>
          </ul>
        </bs-scroll>
      </div>
    </div>

  </div>
</template>

<script>
import TreeBox from '../BStreeNew/BStreeNewBox'
import { getNodeIcon } from 'components/BStree/commonMethods.js'
import { mapState } from 'vuex'
export default {
  name: 'Transfer',
  components: {TreeBox},
  props: {
    groupListData: {
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      groupList: [],
      options: {
        showInput: true,
        isMapDate: false
        // showFolder: false
      },
      showTree: false
    }
  },
  computed: {
    ...mapState({
      videoOrgData: ({ videoOrg }) => videoOrg.videoOrgData
    })
  },
  watch: {
    groupListData() {
      this.initGroupList()
    }
  },
  methods: {
    /**
     * 获取节点图标
     */
    getNodeIcon(item) {
      return getNodeIcon(item)
    },
    expand() {
      this.$refs.scrollers.update()
    },
    toggleChecked(index) {
      this.groupList[index].isChecked = !this.groupList[index].isChecked
      this.$emit('changeData', this.groupList)
    },
    movePositUp(i, b) {
      i = parseInt(i)
      if (i === 0) { return }
      if (this.groupList[i - 1].isChecked && b) { return }
      const item = this.groupList[i - 1]
      this.groupList.splice(i - 1, 1)
      this.groupList.splice(i, 0, item)
      this.$emit('changeData', this.groupList)
    },
    movePositDown(i, b) {
      i = parseInt(i)
      if (i === this.groupList.length - 1) { return }
      if (this.groupList[i + 1].isChecked && b) { return }
      const item = this.groupList[i]
      this.groupList.splice(i, 1)
      this.groupList.splice(i + 1, 0, item)
      this.$emit('changeData', this.groupList)
    },
    movePositLeft() {
      // const node = this.$refs.bstree.getSelectedNodes()
      const node = this.checksData1
      for (const i in node) {
        if (!node[i].children && 'eid' in node[i]) {
          if (this.hasNode(node[i])) {
            this.groupList.push({
              isChecked: false,
              ...node[i]
            })
          }
        }
      }
      this.$emit('changeData', this.groupList)
    },
    movePositRight() {
      this.groupList = this.$lodash.remove(this.groupList, n => !n.isChecked)
      for (const i in this.groupList) {
        this.groupList[i].isChecked = false
      }
      this.$emit('changeData', this.groupList)
    },
    batchUpMove() {
      for (let i = 0; i < this.groupList.length; i++) {
        // this.movePositUp(i)
        if (this.groupList[i].isChecked) {
          this.movePositUp(i, true)
        }
      }
    },
    batchDownMove() {
      for (let i = this.groupList.length - 1; i >= 0; i--) {
        if (this.groupList[i].isChecked) {
          this.movePositDown(i, true)
        }
      }
    },
    hasNode(node) {
      for (const i in this.groupList) {
        if (this.groupList[i]._id === node._id) {
          return false
        }
      }
      return true
    },
    handleDrop(e) {
      const data = e.dataTransfer.getData('Text')
      if (/^\{.*\}$/.test(data)) {
        if (this.hasNode(JSON.parse(data)) && 'eid' in JSON.parse(data)) {
          this.groupList.push({
            isChecked: false,
            ...JSON.parse(data)
          })
          this.$emit('changeData', this.groupList)
        }
      }
    },
    initGroupList() {
      this.groupList = this.groupListData.map(item => {
        if (item.isChecked) {
          return { ...item }
        } else {
          return {
            isChecked: false,
            ...item
          }
        }
      })
    },
    checksData(val) {
      this.checksData1 = val
    }
  },
  created() {
    this.initGroupList()
  },
  mounted() {
    setTimeout(() => {
      this.showTree = true
    }, 100)
  }
}
</script>

<style scoped>
#Transfer {
  width: 100%;
  height: 310px;
}
.editSetBox {
  width: 260px;
  height: 100%;
  display: inline-block;
  vertical-align: middle;
}
.editSetBox .header {
  width: 100%;
  line-height: 26px;
  height: 26px;
}
.editSetBox .header .left {
  float: left;
}
.editSetBox .header .right {
  float: right;
  width: 55px;
  cursor: pointer;
}
.editSetBox .leftGroup,
.editSetBox .rightGroup {
  border: 1px solid #0f2343;
  width: 100%;
  height: 285px;
  overflow: auto;
}
.editSetBox .leftGroup {
  padding: 20px 10px;
  line-height: 30px;
}
.editSetBox .leftGroup ul li {
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.editSetBox .leftGroup ul li .arrows {
  position: absolute;
  right: 0;
  top: 0;
  background: #1b3153;
}
.editSetBox .leftGroup ul li .arrow {
  float: right;
  font-size: 18px;
  color: #00a5e3;
  margin: 0 5px;
  display: none;
  cursor: pointer;
}
.editSetBox .leftGroup ul li .arrow.none {
  color: #999;
}
.editSetBox .leftGroup ul li:hover .arrow {
  display: inline-block;
}
.editSetBox .leftGroup ul li:hover {
  color: #00a5e3;
}

.editSetCenter {
  width: 50px;
  height: 100%;
  display: inline-block;
  padding: 120px 0;
  vertical-align: middle;
}
.editSetCenter .move {
  width: 100%;
  line-height: 40px;
  color: #00a5e3;
  text-align: center;
  font-size: 30px;
  cursor: pointer;
}
</style>
