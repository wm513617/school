<template>
    <div class="table-tabs-box clearBox">
      <div class="box-tab" :class="{tabActive: tab.isActive}" v-for="(tab, index) in tabs" :key="index" @click="toggleTabs({index,tabs})">
        <span  class="tabNormal"  :title="tab.value">
          {{tab.value}}
        </span>
      </div>
    </div>
</template>

<script>
export default {

  data() {
    return {

    }
  },
  methods: {
    toggleTabs(obj) {
      this.$emit('toggles', obj)
    }
  },
  props: ['tabs']
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
    padding: 0 16px;
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
  .table-tabs-box .tabActive {
    background-color: #1c3054;
  }

  .table-tabs-box .box-tab .tabDisabled {
    cursor: not-allowed;
    color: #dedede;
  }

  .tab-Tip {
    position: absolute;
    height: 18px;
    width: 18px;
    background-color: #e4393c;
    border-radius: 50%;
    top: 1px;
    right: 10px;
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
