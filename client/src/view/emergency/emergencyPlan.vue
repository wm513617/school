<template>
  <div class="emergencyPlan">
    <div class="left-menu">
      <Menu theme="dark" width="auto">
        <MenuGroup title="全部预案">
        </MenuGroup>
      </Menu>
      <!-- <Tree :data="MenuItemList" @on-select-change="openMenuname"></Tree> -->
        <bsr-tree :treeData="MenuItemList" @node-click="openMenuname">
          <template slot-scope="{ node }">
            <span :title="node.name">
              {{node.name}}
            </span>
          </template>
        </bsr-tree>
    </div>
    <div class="right-content">
      <AllEmergency ref="menunameRef" :isShow="isShow" :plan="plan"></AllEmergency>
    </div>
  </div>
</template>
<script>
import AllEmergency from './pages/AllEmergency'

import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  components: {
    AllEmergency
  },
  data() {
    return {
      isShow: false,
      plan: '',
      planName: '',
      MenuItemList:
        {
          _id: 1,
          name: '应急预案',
          children: [
            {
              _id: 2,
              name: '普通报警',
              children: [
                {
                  _id: 3,
                  name: '报警输入'
                },
                {
                  _id: 4,
                  name: '报警防区'
                }
              ]
            },
            {
              _id: 5,
              name: '视频报警',
              children: [
                {
                  _id: 6,
                  name: '监控点报警'
                },
                {
                  _id: 7,
                  name: '重点关注'
                }
              ]
            },
            {
              _id: 8,
              name: '智能报警',
              children: [
                {
                  _id: 9,
                  name: '智能报警'
                },
                {
                  _id: 10,
                  name: '违章报警'
                },
                {
                  _id: 11,
                  name: '人像布控'
                }
              ]
            },
            {
              _id: 12,
              name: '消防报警',
              children: [
                {
                  _id: 13,
                  name: '消防报警'
                }
              ]
            },
            {
              _id: 14,
              name: '报警求助',
              children: [
                {
                  _id: 15,
                  name: '报警求助'
                }
              ]
            },
            {
              _id: 16,
              name: '单兵报警',
              children: [
                {
                  _id: 17,
                  name: '单兵一键报警'
                },
                {
                  _id: 18,
                  name: '巡更异常上报'
                }
              ]
            },
            {
              _id: 19,
              name: '手工报警',
              children: [
                {
                  _id: 20,
                  name: '手工报警'
                }
              ]
            }
          ]
        }
    }
  },
  computed: {
    ...mapState({}),
    ...mapGetters([])
  },
  watch: {
  },
  methods: {
    ...mapActions([]),
    openMenuname(val) {
      let planList = []
      if (val._id === 1) {
        planList = []
        for (let i = 1; i <= 20; i++) {
          planList.push(i)
          this.plan = planList.join(',')
        }
      } else if (val._id === 2) {
        this.plan = '3,4'
      } else if (val._id === 5) {
        this.plan = '6,7'
      } else if (val._id === 8) {
        this.plan = '9,10,11'
      } else if (val._id === 12) {
        this.plan = '13'
      } else if (val._id === 14) {
        this.plan = '15'
      } else if (val._id === 16) {
        this.plan = '17,18'
      } else if (val._id === 19) {
        this.plan = '20'
      } else {
        this.plan = String(val._id)
      }
      this.isShow = !this.isShow
    }
  },
  created() {
    this.openMenuname({_id: 2})
  }
}
</script>
<style lang="less" scoped>
.emergencyPlan {
  display: flex;
  width: 100%;
  padding: 16px 0;
  .left-menu {
    background-color: #1b3153;
    width: 272px;
    text-align: center;
  }
  .right-content {
    margin-left: 16px;
    flex: 1;
    flex-direction: column;
  }
}
</style>
