<template id="organization">
  <div class="orgs">
    <div id="tree">
      <ul>
        <tree :model="rootData"
              @getSelectedNode="getSelectedNode"
              :activeNode="activeNode"
              manageOpen=true
              showOpen=true
              v-show="rootData.name"></tree>
        <li v-show="!rootData.name">
          <Button type="primary"
                  @click="establish">创建根节点</Button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import tree from './Tree'
export default {
  name: 'Organization',
  data() {
    return {
      activeNode: ''
    }
  },
  components: {
    tree
  },
  computed: {
    ...mapState({
      rootData: ({ organization }) => organization.root
    })
  },
  methods: {
    ...mapMutations(['UPROOT']),
    getSelectedNode: function(node) {
      this.activeNode = node.name
    },
    establish() {
      let _this = this
      this.$root.$http.post('/api/organizations', { name: '根节点' }).then(function(res) {
        _this.$root.$http.get('/api/organizations').then(function(res) {
          // console.log(res.data[0])
          this.$store.commit('UPROOT', res.data[0])
        })
      })
    }
  },
  mounted() {
    this.$root.$http.get('/api/organizations').then(function(res) {
      // console.log(res.data[0])
      this.$store.commit('UPROOT', res.data[0])
    })
    // .catch((err) => {
    //   console.log(err)
    // })
  },
  beforeDestroy() {
  }
}
</script>

<style scoped>
.orgs {
  width: 100%;
  height: auto;
  min-height: 800px;
  padding: 20px 0 0 50px;
}

#tree {
  width: 500px;
  transform: translateX(-20px);
}

.save {
  margin: 0 0 20px 400px;
}
</style>
