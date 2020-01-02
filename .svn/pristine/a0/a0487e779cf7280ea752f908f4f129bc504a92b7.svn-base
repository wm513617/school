::: demo
```html
<template>
  <div style="width:300px;">
    <tree ref ='tree' :treeData="treeData" :options="options" @node-click='handleNode'/>
    <button @click='getselected'>selected</button>
  </div>
</template>
<script>
import Tree from '../components/tree/tree.vue'
export default {
  name: 'test',
  methods: {
    getselected () {
      console.log(this.$refs.tree.getSelectedNodeIds())
    },
    handleNode (e) {
      console.log(e)
    }
  },
  data () {
    return {
      options: {
        showCheckbox: true,
        search: {
          useInitial: true,
          useEnglish: false,
          customFilter: null
        }
      },
      treeData: [
        {
          id: 1,
          name: '一级节点',
          open: true,
          checked: false,
          parentId: null,
          visible: true,
          searched: false,
          children: [
            {
              id: 2,
              name: '二级节点-1',
              checked: false,
              parentId: 1,
              searched: false,
              visible: true
            },
            {
              name: '二级节点-2',
              open: true,
              checked: false,
              id: 3,
              parentId: 1,
              visible: true,
              searched: false,
              children: [
                {
                  id: 4,
                  parentId: 3,
                  name: '三级节点-1',
                  visible: true,
                  searched: false,
                  checked: false
                },
                {
                  id: 5,
                  name: '三级节点-2',
                  parentId: 3,
                  searched: false,
                  visible: true,
                  checked: false
                }
              ]
            },
            {
              name: '二级节点-3',
              open: true,
              checked: false,
              id: 6,
              parentId: 1,
              visible: true,
              searched: false,
              children: [
                {
                  id: 7,
                  parentId: 6,
                  name: '三级节点-4',
                  checked: false,
                  searched: false,
                  visible: true
                },
                {
                  id: 8,
                  name: '三级节点-5',
                  parentId: 6,
                  checked: false,
                  searched: false,
                  visible: true
                }
              ]
            }
          ]
        }
      ]
    }
  },
  components: {Tree}
}
</script>
```
### props
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| options | 树数据 | Object | — | — |
| treeData | 指定节点对象数组 | Array[Object] | — | — |

```
     options: {
        showCheckbox: true,  //是否支持多选
        showInput: true,  //是否显示选择框
        showSearch: true, //是否显示搜索框
        showOpenPreview: false,  //是否显示开启预览按钮
        showOpenAllPreview: false,  //是否显示一键打开当前节点镜头视频
        showCollection: false,  //是否子元素收藏按钮
        showDelete: false,  //是否删除按钮
        showEdit: false,  //是否显示父元素编辑按钮
        search: {
          useInitial: true, //是否支持首字母搜索
          useEnglish: false, //是否是因为搜索
          customFilter: null // 自定义节点过滤函数
        }

    /* 节点元素 */
    {
      id: 1, //节点标志
      name: '一级节点', //节点名称
      open: true, // 是否打开节点
      checked: false, //是否被选中
      parentId: null, //父级节点Id
      visible: true, //是否可见
      searched: false, //是否是搜索值
      children: [] //子节点
    }
```
### 方法
`Tree` 拥有如下方法，返回目前被选中的节点数组：
| 方法名 | 说明 | 参数 |
|------|--------|------|
| getSelectedNodeIds | 若节点可被选择（即 `multiple` 为 `true`），<br>则返回目前被选中的节点Id所组成的数组 | — |
| getSelectedNodes | 若节点可被选择（即 `multiple` 为 `true`），<br>则返回目前被选中的节点所组成的数组 | — |


### Events
| 事件名称      | 说明    | 回调参数      |
|---------- |-------- |---------- |
| node-click           | 节点被点击时的回调         | 共1个参数，节点组件本身。 |
|node-dblclick         | 节点被双击时的回调         | 共1个参数，节点组件本身。 |
| openPreviewClick     | 开启预览按钮被点击时的回调  | 共1个参数，节点组件本身。 |
| openAllPreviewClick  | 一键开启预览被点击时的回调  | 共1个参数，节点组件本身。 |
| collectionClick      | 收藏按钮被点击时的回调     | 共1个参数，节点组件本身。 |
| deleteClick          | 删除按钮被点击时的回调     | 共1个参数，节点组件本身。 |
| editClick            | 编辑按钮被点击时的回调     | 共1个参数，节点组件本身。 |




