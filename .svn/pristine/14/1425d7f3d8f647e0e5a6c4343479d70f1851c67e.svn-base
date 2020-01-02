::: demo
```html
<template>
  <div>
    <bsr-tree :treeData="treeData" ref="bstree">
      <template slot-scope="{ node }">
        <span :class="{'item': true, 'offline': (!node.nodeId && node.eid && node.status !== 1)}" :title="node.name">
          <i class="iconfont" :class="[getNodeIcon(node).class]" :title="getNodeIcon(node).title"></i>
          {{node.name}}
        </span>
      </template>
    </bsr-tree>
    <!-- 可搜索tree (数据量过大时不建议使用，搜索功能比较耗时)-->
    <input type="text" v-model="searchVal">
    <Tree-Search :treeData="treeNode" ref="bstree" :searchVal="searchVal" isSearch isOnlyLeaf isFuzzy>
      <template slot-scope="{ node }">
        <span class="item" :title="node.name"><i class=" iconfont" :class="[getNodeIcon(node).class]" :title="getNodeIcon(node).title"></i>{{node.name}}</span>
      </template>
    </Tree-Search>
  </div>
</template>
<script>
export default {
  name: 'test',
  methods: {
    getselected () {
      console.log(this.$refs.bstree.getSelectedNodes())
    }
  },
  data () {
    return {
      treeData: {
          id: 1,
          name: '一级节点'
          children: [
            {
              id: 2,
              name: '二级节点-1'
            },
            {
              name: '二级节点-2',
              id: 3
              children: [
                {
                  id: 4,
                  name: '三级节点-1'
                },
                {
                  id: 5,
                  name: '三级节点-2'
                }
              ]
            },
            {
              name: '二级节点-3',
              id: 6
              children: [
                {
                  id: 7,
                  name: '三级节点-4'
                },
                {
                  id: 8,
                  name: '三级节点-5'
                }
              ]
            }
          ]
        }
    },
    getNodeIcon: () => {}
  },
  created() {
    import('components/BStree/commonMethods.js').then(({getNodeIcon}) => {
      this.getNodeIcon = getNodeIcon
    })
  }
}
</script>
```
### props
| 参数      | 说明          | 类型      | 可选值              | 默认值  |
|---------- |-------------- |---------- |------------------  |-------- |
| treeData | 指定节点对象数组 | Object | — | — |
| selectNode|选中节点的id集合|Array|-|显示标题
|showCheckbox|是否显示checkbox|Boolean|-|false
|label|要显示的字段|String|-|name

#### TreeSearch特有props

| 参数      | 说明          | 类型      | 可选值              | 默认值  |
|---------- |-------------- |---------- |------------------  |-------- |
| isSearch | 是否可搜索 | Boolean | — | true |
| showNoData|是否显示无结果|Boolean|-|true
|searchVal|是否显示checkbox|String|-|空
|isOnlyLeaf|是否仅搜索枝叶(不包含组织)|Boolean|-|false
|isFuzzy|是否可模糊搜索|Boolean|-|false

```
  /* 节点元素 */
  {
    _id: 1, //节点标志
    name: '一级节点', //节点名称
    children: [] //子节点
  }
```
### 方法
`Tree` 拥有如下方法，返回目前被选中的节点数组：
| 方法名 | 说明 | 参数 |
|------|--------|------|
| getSelectedNodes | 若节点可被选择（即 `showCheckbox` 为 `true`），<br>则返回目前被选中的节点所组成的数组 | — |


### Events
| 事件名称      | 说明    | 回调参数      |
|---------- |-------- |---------- |
| node-click           | 节点被点击时的回调         | 共1个参数，节点组件本身。 |
| node-dblclick         | 节点被双击时的回调         | 共1个参数，节点组件本身。 |
| on-expand     | 节点展开事件  | 无参数 |
| handlechecked  | checkbox变化事件  | 选中节点的id集合 |




