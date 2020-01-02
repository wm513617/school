<template>
  <div id="TVwallMenu">
    <div class="input">
      <Input v-model="searchVal" icon="ios-search-strong" placeholder="请输入..." />
    </div>
    <div class="list-item" v-show="searchEmpty&&fsearchEmpty">无结果</div>
    <!-- <bs-scroll ref="scroller"> -->

    <div style="height:calc(100% - 10px);overflow:hidden; padding-left: 10px">
      <div class="scroller">
        <!-- <div v-show="searchVal===''"> -->
          <div class="org-coll">
            <div class="title" @click="showOrg=!showOrg" v-show="!searchEmpty">
              <Icon type="arrow-down-b" v-if='showOrg'></Icon>
              <Icon type="arrow-right-b" v-if='!showOrg'></Icon>
              机构
            </div>
            <!-- <Organization @on-expand="expand" @loadMore="expand" :options="orgOptions" v-show="showOrg" :scroll="false" @searchCount="count => searchEmpty = !count" ref="org"></Organization> -->
          </div>
          <Organization @on-expand="expand" @loadMore="expand" :options="orgOptions" v-show="showOrg" :scroll="false" ref="org" :searchVal="searchVal" :iconToggle="false" @refreshSuc="$emit('refreshSuc')"></Organization>
          <div class="title" @click="showFav=!showFav" v-show="!fsearchEmpty">
            <Icon type="arrow-down-b" v-if='showFav'></Icon>
            <Icon type="arrow-right-b" v-if='!showFav'></Icon>
            收藏夹
          </div>
          <Favorites @on-expand="expand" :options="favOptions"  v-show="showFav" :scroll="false" @searchCount="count => fsearchEmpty = !count"></Favorites>
      </div>
    </div>
    <!-- </bs-scroll> -->
        <!-- <SearchResList :oid="orgId" ref="SearchResList" v-show="searchVal!==''"></SearchResList> -->
  </div>
</template>

<script>
import Organization from './Organization.vue'
import Favorites from './Favorites.vue'
// import SearchResList from './SearchResList'
import { mapState } from 'vuex'
export default {
  name: 'TVwallMenu',
  components: {
    Organization,
    Favorites
    // SearchResList
  },
  data() {
    return {
      searchVal: '',
      searchEmpty: false,
      fsearchEmpty: false,
      showOrg: true,
      showFav: true,
      orgOptions: {
        showNoneData: false,
        isMapDate: false,
        search: {
          onlyLeaf: true
        }
      },
      favOptions: {
        showNoneData: false,
        search: {
          onlyLeaf: true
        }
      }
    }
  },
  computed: {
    ...mapState({
      videoOrgData: ({ videoOrg }) => videoOrg.videoOrgData
    }),
    orgId() {
      return this.videoOrgData[0] ? this.videoOrgData[0]._id : ''
    }
  },
  watch: {
    showOrg() {
      this.expand()
    },
    showFav() {
      this.expand()
    },
    searchVal(value) {
      // this.$refs.SearchResList.isSearching = true
      // this.$refs.SearchResList.searchRes(value)
    }
  },
  methods: {
    expand() {
      // this.$refs.scroller.update()
    }
  }
}
</script>

<style scoped>
#TVwallMenu {
  width: 100%;
  height: 100%;
}
#TVwallMenu > .input {
  padding: 10px;
}

#TVwallMenu .title {
  line-height: 32px;
  font-size: 14px;
  cursor: pointer;
  padding-left: 5px;
}
#TVwallMenu .ivu-icon {
  width: 12px;
  font-size: 18px;
}
.scroller{
  width: 100%;
  height: calc(100% - 52px);
  overflow-y: auto;
}
</style>
