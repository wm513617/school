<template>
  <div class="main user">
    <div class="main-left">
      <UserList ref="userlistRef" @updateInfoData="updateUserInfo" @getUserId="getUserId"></UserList>
    </div>
    <div class="main-right">
      <div class="content-top">
        <div class="title-style">用户信息</div>
        <UserInfo ref="userInfoRef" :userId="userId" @updateListData="updateUserList"></UserInfo>
      </div>
      <div class="content-btm">
        <div class="title-style">操作日志</div>
        <OperateLog :userId="userId"></OperateLog>
      </div>
    </div>
  </div>
</template>
<script>
import UserList from './userList.vue'
import UserInfo from './userInfo.vue'
import OperateLog from './operateLog.vue'
export default {
  name: 'user',
  components: {
    UserList,
    UserInfo,
    OperateLog
  },
  data() {
    return {
      userId: ''
    }
  },
  methods: {
    /**
     * 获取当前选中用户的ID
     * @method getUserId
     * @param {string} val id
     */
    getUserId(val) {
      this.userId = val
    },
    /**
     * 当用户信息更新时更新用户列表
     * @method updateUserList
     */
    updateUserList() {
      this.$refs.userlistRef.getUserTree()
    },
    /**
     * 当用户列表更新时更新用户信息
     * @method updateUserInfo
     */
    updateUserInfo() {
      this.$refs.userInfoRef.deleteUser()
    }
  }
}
</script>
<style lang="less" scoped>
.public {
  height: 38px;
  line-height: 38px;
  padding-left: 24px;
  background-color: #0f2343;
}
.main {
  flex: 1;
  display: flex;
  .main-left {
    flex: 0 0 272px;
    margin-right: 16px;
    background-color: #1b3153;
  }
  .main-right {
    height: 100%;
    background-color: #1b3153;
    overflow: auto;
    flex: 1;
    .content-top {
      .title-style {
        .public;
      }
    }
    .content-btm {
      height: calc(~'100% - 343px');
      .title-style {
        .public;
      }
    }
  }
}
</style>
