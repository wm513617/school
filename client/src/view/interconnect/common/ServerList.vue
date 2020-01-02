<template>
  <section class="server-list">
    <header>
      <div class="title-text">{{title}}</div>
      <Button class="btn-refresh" type="primary" @click="() => $emit('refresh')">刷新</Button>
    </header>
    <article>
      <ul>
        <li v-for="(item, index) in serverList" :class="{'active': activeServer === index}" @click="$emit('update:activeServer', index)" :key="index">{{item.serverName}}</li>
      </ul>
    </article>
    <footer>
      <Button type="ghost" @click="isshow = true" :disabled="isLimit">添加</Button>&nbsp;&nbsp;
      <Button type="ghost" @click="isDel" :disabled="isLimit">删除</Button>
    </footer>
    <AddModal :isshow.sync="isshow" :title="'添加' + title" @addServer="info => $emit('addServer', info)" />
  </section>
</template>

<script>
import AddModal from './AddModal'
export default {
  components: {AddModal},
  props: ['serverList', 'activeServer', 'title', 'isLimit'],
  data() {
    return {
      isshow: false
    }
  },
  methods: {
    isDel() {
      this.$Modal.confirm({
        title: '警告',
        content: '确定删除？',
        onOk: () => {
          this.$emit('delServer', this.serverList[this.activeServer]._id)
        },
        onCancel: () => {
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  section {
    height: 100%;
    display: flex;
    flex-direction: column;
    margin-right: 40px;
    header {
      font-size: 14px;
      font-weight: bold;
      flex: 0 0 40px;
      line-height: 40px;
      display: flex;
      flex-direction: row;
      .title-text {
        flex: 1;
      }
      .btn-refresh {
        flex: 0 0 54px;
        height: 30px;
      }
    }
    article {
      flex: 1 1 auto;
      height: 100%;
      border: 1px solid #4699f9;
    }
    footer {
      height: 40px;
      padding-top: 10px;
    }
  }
  .server-list {
    flex: 0 0 300px;
    width: 300px;
    ul {
      width: 100%;
      li {
        width: 100%;
        height: 24px;
        line-height: 24px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
        &.active {
          background: #4699f9;
        }
      }
    }
  }
</style>
