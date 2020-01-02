
<style scoped>
.page-wrap {
  text-align: center;
  font-size: 18px;
}

.page-wrap ul {
  display: inline-block;
  list-style: none;
  overflow: hidden;
}

.page-wrap ul li {
  float: left;
  color: #1e5a6b;
  padding: 1px 10px;
  margin: 0 5px;
  border-radius: 50%;
  user-select: none;
  border: 1px solid transparent;
}

.page-wrap .pointer {
  cursor: pointer;
}

.page-wrap .hover:hover {
  border-color: #7ba6b3;
}

.page-wrap .li-page {
  line-height: 1.5;
  cursor: pointer;
  color: #1e5a6b;
}

.page-wrap .li-page:hover {
  color: #7ba6b3;
}

.page-wrap .active {
  border-color: #246c81;
}
</style>
<template>
  <div class="page-wrap">
    <ul class="li-page"
        @click="goPrePage">上一页</ul>
    <ul>
      <li v-for="i in showPageBtn"
          :key="i"
          :class="{active: i === currentPage, pointer: i, hover: i && i !== currentPage}"
          @click="pageOffset(i)">
        <a v-if="i"
           class="notPointer">{{i}}</a>
        <a v-else>···</a>
      </li>
    </ul>
    <ul class="li-page"
        @click="goNextPage">下一页</ul>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
// import _ from 'lodash'
export default {
  name: 'Pagination',
  data() {
    return {
      limit: 10
    }
  },
  created() {
    // console.log(this.page)
  },
  props: {
    page: {
      type: Object,
      default() {
        return { toatal: 10 }
      }
      // default: {
      //   total: 10,
      //   limit: 1
      // }
    }
  },
  computed: {
    ...mapState({
      offset: ({ pagination }) => pagination.offset
    }),
    // offset() {
    //   return this.$store.state.offset
    // },
    // prePage() {
    //   return this.offset !== 0 && this.page.total
    // },
    // nextPage() {
    //   return (this.offset + this.limit < this.page) && this.page.total
    // },
    totalPage() {
      return Math.ceil(this.page.total / this.limit)
    },
    currentPage() {
      return Math.ceil(this.offset / this.limit) + 1
    },
    showPageBtn() {
      let pagetotal = this.totalPage
      let index = this.currentPage
      let arr = []
      if (pagetotal <= 5) {
        for (let i = 1; i <= pagetotal; i++) {
          arr.push(i)
        }
        return arr
      }
      if (index <= 2) { return [1, 2, 3, 0, pagetotal] }
      if (index >= pagetotal - 1) { return [1, 0, pagetotal - 2, pagetotal - 1, pagetotal] }
      if (index === 3) { return [1, 2, 3, 4, 0, pagetotal] }
      if (index === pagetotal - 2) { return [1, 0, pagetotal - 3, pagetotal - 2, pagetotal - 1, pagetotal] }
      return [1, 0, index - 1, index, index + 1, 0, pagetotal]
    }
  },
  methods: {
    ...mapMutations(['GO_PAGE', 'PRE_PAGE', 'NEXT_PAGE']),
    pageOffset(i) {
      console.log(this.page.total)
      if (i === 0 || i === this.currentPage) { return }
      this.$store.commit('GO_PAGE', (i - 1) * this.limit)
      this.$emit('getNew', this.currentPage)
    },
    goPrePage() {
      if (!this.offset || !this.page.total || this.currange < 1) {
        return
      }
      // console.log(this.page.total)
      this.$store.commit('PRE_PAGE', this.limit)
      this.$emit('getNew', this.currentPage)
    },
    goNextPage() {
      // console.log(Math.ceil(this.page.total / this.page.limit))
      //  当前页码超过总页码
      if (this.currentPage >= Math.ceil(this.page.total / this.page.limit)) { return }
      if (this.offset + this.limit > this.num || !this.page.total) {
        return
      }
      this.$store.commit('NEXT_PAGE', this.limit)
      this.$emit('getNew', this.currentPage)
    }
  }
}
</script>
