<template>
  <div class="table-tabs-box clearBox">
    <div class="box-tab" v-show="!tab.isHide" :class="{tabActive: tab.disabled ? false : tab.active}" v-for="(tab, index) in tabs" :key="index">
      <span @click="tab.disabled ? null : tabClick(tab, index)" class="tabNormal" :class="{tabDisabled: tab.disabled}" :title="tab.title">
        {{tab.title}}
      </span>
      <span v-if="isCount" @click="tab.disabled ? null : tabClick(tab, index)" class="tabNormal tabNormalSpan" :class="{tabDisabled: tab.disabled}">
        （{{tab.number?tab.number:0}}）
      </span>
      <span class="tab-Tip" v-if="isTip && tab.number !== 0">
        <!-- {{tab.number}} -->
      </span>
    </div>
  </div>
</template>
<script>
export default {
  components: {
  },
  props: {
    tabs: {
      type: Array
    },
    isCount: {
      type: Boolean,
      default: false
    },
    isTip: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
  },
  created() {
  },
  methods: {
    tabClick(obj, index) {
      for (let tab of this.tabs) {
        tab.active = false
      }
      obj.active = true
      this.$emit('on-tab-click', { obj, index })
    }
  }
}
</script>
<style scoped>
.table-tabs-box {
  height: 40px;
  width: 100%;
  background-color: #0f2243;
}

.table-tabs-box .box-tab {
  float: left;
  padding: 0 10px;
  height: 100%;
  line-height: 40px;
  position: relative;
  border-right: 2px solid #0f1e3b;
  /*overflow: hidden;*/
  text-overflow: ellipsis;
  max-width: 20%;
  /*white-space: nowrap;*/
}

.tabNormal {
  cursor: pointer;
  display: inline-block;
}
.tabNormalSpan{
  width: 45px;

}
.table-tabs-box .tabActive {
  background-color: #1c3054;
}

.table-tabs-box .box-tab .tabDisabled {
  cursor: not-allowed;
  color: #dedede;
}

.tab-Tip {
  position: absolute;
  height: 6px;
  width: 6px;
  background-color: #e4393c;
  border-radius: 50%;
  top: 1px;
  right: 2px;
  text-align: center;
  line-height: 18px;
  z-index: 1;
  font-size: 10px;
}

.clearBox:after {
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
</style>
