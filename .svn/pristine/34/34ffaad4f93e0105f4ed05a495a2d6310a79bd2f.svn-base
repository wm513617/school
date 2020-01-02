<template>
  <div :class="classes">
    <div :class="[prefixCls + '-bar']">
      <div :class="[prefixCls + '-nav-container']">
        <div :class="[prefixCls + '-nav-wrap']">
          <div :class="[prefixCls + '-nav-scroll']">
            <div :class="[prefixCls + '-nav']">
              <div :class="tabCls(item)" v-for="(item, i) in navList" :key="i">
                <div :title="item.disabled?'该功能不可用':''" :class="tabItemCls(item)" @click="handleChange(item)">
                  {{ item.label }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import '../style/tabs.less'
import { getStyle } from '../../assets/common/DOMUtil'
import { findIndex } from 'lodash'
const prefixCls = 'bsr-tabs'
export default {
  name: 'BStabs',
  props: {
    active: {
      type: [String, Number]
    },
    type: {
      type: String,
      validator(value) {
        return { 'line': true, 'card': true }[value]
      },
      default: 'line'
    },
    size: {
      type: String,
      validator(value) {
        return { 'small': true, 'default': true }[value]
      },
      default: 'default'
    },
    closable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prefixCls: prefixCls,
      activeKey: this.active,
      navList: [],
      barWidth: 0,
      barOffset: 0,
      paneList: []
    }
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-card`]: this.type === 'card',
          [`${prefixCls}-mini`]: this.size === 'small' && this.type === 'line'
        }
      ]
    },
    barClasses() {
      return [
        `${prefixCls}-ink-bar`
      ]
    }
  },
  mounted() {
    this.inint()
    this.updateNav()
  },
  methods: {
    inint() {
      const childrenList = this.$children
      if (childrenList && childrenList.length > 0) {
        childrenList.forEach(item => {
          if (item.$options.name === 'BStabPane') {
            this.paneList.push({ 'key': item.id, value: item })
          }
        })
      }
    },
    updateNav() {
      this.navList = []
      this.paneList.forEach(({ key, value }, index) => {
        this.navList.push({
          label: value.label,
          icon: value.icon || '',
          key: key || index,
          index: index,
          disabled: value.disabled,
          closable: value.closable
        })
        if (index === 0) {
          if (!this.activeKey) { this.activeKey = key || index }
        }
      })
      this.updateStatus()
      this.updateBar()
    },
    updateBar() {
      this.$nextTick(() => {
        const index = findIndex(this.navList, (nav) => nav.key === this.activeKey)
        const prevTabs = this.$el.querySelectorAll(`.${prefixCls}-tab`)
        const tab = prevTabs[index]
        this.barWidth = parseFloat(getStyle(tab, 'width'))

        if (index > 0) {
          let offset = 0
          const gutter = this.size === 'small' ? 0 : 16
          for (let i = 0; i < index; i++) {
            offset += parseFloat(getStyle(prevTabs[i], 'width')) + gutter
          }

          this.barOffset = offset
        } else {
          this.barOffset = 0
        }
      })
    },
    updateStatus() {
      this.paneList.forEach(({ key, value }) => (value.show = (key === this.activeKey)))
    },
    tabCls(item) {
      return [
        `${prefixCls}-tab`,
        {
          [`${prefixCls}-tab-disabled`]: item.disabled,
          [`${prefixCls}-tab-active`]: item.key === this.activeKey
        }
      ]
    },
    tabItemCls(item) {
      return [
        `${prefixCls}-tab-item`,
        {
          [`${prefixCls}-tab-item-enable`]: item.disabled === false
        }
      ]
    },
    handleChange(item) {
      if (item.disabled) { return }
      this.activeKey = item.key
      this.$emit('on-click', { key: item.key, index: item.index })
    },
    handleRemove(index) {
      const tabs = this.paneList
      const tab = tabs[index]
      tab.$destroy(true)

      if (tab.key === this.activeKey) {
        const newTabs = this.paneList
        let activeKey = -1

        if (newTabs.length) {
          const leftNoDisabledTabs = tabs.filter((item, itemIndex) => !item.disabled && itemIndex < index)
          const rightNoDisabledTabs = tabs.filter((item, itemIndex) => !item.disabled && itemIndex > index)

          if (rightNoDisabledTabs.length) {
            activeKey = rightNoDisabledTabs[0].key
          } else if (leftNoDisabledTabs.length) {
            activeKey = leftNoDisabledTabs[leftNoDisabledTabs.length - 1].key
          } else {
            activeKey = newTabs[0].key
          }
        }
        this.activeKey = activeKey
      }
      this.$emit('on-tab-remove', tab.key)
      this.updateNav()
    },
    showClose(item) {
      if (this.type === 'card') {
        if (item.closable !== null) {
          return item.closable
        } else {
          return this.closable
        }
      } else {
        return false
      }
    }
  },
  watch: {
    activeKey() {
      this.updateBar()
      this.updateStatus()
    }
  }
}
</script>

<style scoped>

</style>
