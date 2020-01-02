<template>
  <div class="panel-search">
    <div class="tab">
      <section class="content">
        <ul class="point-control">
          <li class="line">
            <div class="item">
              <Checkbox v-model="fireFilterState.flag">消防报警</Checkbox>
            </div>
            <div class="item title-icon">
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber :disabled="disabledFir" class="numberInput" size="small" :max="9" :min="1" v-model="fireFilterState.level"></InputNumber>
            </div>
          </li>
          <li class="line">
            <div class="item">
              <Checkbox v-model="fireFilterState.isShowConfirmed">显示已确认报警</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item">
              <Button type="primary" style="margin-right:20px" @click="confirm">确认</Button>
              <Button type="primary" @click="cancel">取消</Button>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
const localStorage = window.localStorage
export default {
  data() {
    return {
      fireFilterState: {
        flag: true,
        level: 1,
        isShowConfirmed: false
      }
    }
  },
  computed: {
    ...mapState({
      filterState: ({firecontrol}) => firecontrol.fireAlarmFilter
    }),
    disabledFir() {
      return !this.fireFilterState.flag
    }
  },
  watch: {},
  created() {
    for (let key in this.filterState) {
      this.$set(this.fireFilterState, key, this.filterState[key])
    }
  },
  methods: {
    ...mapMutations(['SET_FIRE_ALARM_FILTER']),
    cancel() {
      this.$emit('getPoints')
    },
    confirm() {
      this.SET_FIRE_ALARM_FILTER(JSON.parse(JSON.stringify(this.fireFilterState)))
      this.$emit('setalarmFilters')
      this.$emit('setCount')
      this.$emit('getPoints')
      localStorage.setItem('fireFilterState', JSON.stringify(this.fireFilterState))
    }
  }
}
</script>
<style lang="less" scoped>
  .panel-search {
    width: 272px;
    position: absolute;
    top: 56px;
    right: 4px;
    z-index: 9;
    .search {
      width: 100%;
      height: 32px;
      line-height: 32px;
      display: flex;
      background: rgba(15, 35, 67, .8);
      .input {
        flex: 1;
      }
    }
    .tab {
      width: 100%;
      // transition: all .3s ease;
      display: flex;
      flex-direction: column;
      .tab-list {
        display: flex;
        height: 32px;
        line-height: 32px;
        margin: 8px 0;
        flex-direction: row;
        background: rgba(15, 35, 67, .8);
        align-items: center;
        li {
          flex: auto;
          height: 26px;
          line-height: 26px;
          text-align: center;
          color: rbga(200, 200, 200, .8);
          cursor: pointer;
          &.active {
            color: #4699f9;
          }
          &:first-child {
            border-right: 1px solid rgba(58, 90, 139, 0.4);
          }
        }
      }
      .content {
        width: 100%;
        height: 100px;
        padding: 0 0 12px 14px;
        color: #fff;
        background: rgba(15, 35, 67, 1);
        & > * {
          height: 100%;
        }
        .point-control {
          height: 100%;
          display: flex;
          flex-direction: column;
          .line {
            flex: 1 0 auto;
            display: flex;
            flex-direction: row;
            justify-content: center;
            .item {
              flex: 1;
              display: flex;
              align-items: center;
              .numberInput {
                width: 50px;
              }
            }
            .title-icon {
              flex: 0 0 32px;
              .iconfont {
                font-size: 24px;
              }
            }
          }
        }
      }
    }
  }
.iconIsOuter i {
  color: #25790f;
}
</style>
