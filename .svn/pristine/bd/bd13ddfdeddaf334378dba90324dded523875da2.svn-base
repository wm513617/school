<script>
import $ from 'jquery'
let innerns = 'VirtualScrollList'

export default {
  name: innerns,
  props: {
    startState: { type: Boolean, required: true },
    size: { type: Number, required: true },
    remain: { type: Number, required: true },
    rtag: { type: String, default: 'div' },
    wtag: { type: String, default: 'div' },
    start: { type: Number, default: 0 },
    totop: Function,
    tobottom: Function,
    onscroll: Function
  },

  // 一个帮助计算的对象。
  delta: {
    start: 0, // Start index. 开始
    end: 0, // End index. 结束
    total: 0, // All items count. 所有items
    keeps: 0, // Nums of item keeping in real dom.在实际的dom中保持数字的Nums
    viewHeight: 0, // Container wrapper viewport height.  容器高度
    allPadding: 0, // All padding of not-render-yet doms.
    paddingTop: 0, // Container wrapper real padding-top.
    scrollTop: 0, // Store scrollTop.
    scrollDirect: 'd', // Scroll direction.
    fireTime: 0 // Store last event time avoiding compact fire.
  },

  watch: {
    startState: function() {
      this.$forceUpdate()
    },
    start: function(index) {
      let delta = this.$options.delta

      if (index !== parseInt(index, 10)) {
        return console.warn(innerns + ': start ' + index + ' is not integer.')
      }
      if (index < 0 || index > delta.total - 1) {
        return console.warn(innerns + ': start ' + index + ' is overflow.')
      }

      let start, end, scrollTop

      if (this.isOverflow(index)) {
        let zone = this.getLastZone()
        end = zone.end
        start = zone.start
        scrollTop = delta.total * this.size
      } else {
        start = index
        end = start + delta.keeps
        scrollTop = start * this.size
      }

      delta.end = end
      delta.start = start >= this.remain ? start : 0

      this.$forceUpdate()
      this.$nextTick(this.setScrollTop.bind(this, scrollTop))
    },
    remain: function(newVal, oldVal) {
      // console.log(newVal + ": " + oldVal + ": " + this.remain)
      this.recalcSize(newVal)
      this.$forceUpdate()
    }
  },

  methods: {
    recalcSize: function(remain) {
      let remains = remain || this.remain
      let delta = this.$options.delta
      let benchs = Math.round(remains / 2)

      delta.start = this.start >= remains ? this.start : 0
      delta.end = this.start + remains + benchs
      delta.keeps = remains + benchs
      delta.viewHeight = this.size * remains
    },
    // 处理滚动的事件
    handleScroll: function(e) {
      let scrollTop = this.$refs.container.scrollTop
      this.updateZone(scrollTop)

      if (this.onscroll) {
        this.onscroll(e, scrollTop)
      }
    },

    updateZone: function(offset) {
      let delta = this.$options.delta
      let overs = Math.floor(offset / this.size)

      if (!offset && delta.total) {
        this.fireEvent('totop')
      }

      delta.scrollDirect = delta.scrollTop > offset ? 'u' : 'd'
      delta.scrollTop = offset

      // Need moving items at lease one unit height.
      // @todo: consider prolong the zone range size.
      let start = overs || 0
      let end = overs ? (overs + delta.keeps) : delta.keeps

      if (this.isOverflow(start)) {
        let zone = this.getLastZone()
        end = zone.end
        start = zone.start
      }

      delta.end = end
      delta.start = start

      // Call component to update shown items.
      this.$forceUpdate()
    },

    // Avoid overflow range.
    isOverflow: function(start) {
      let delta = this.$options.delta
      let overflow = delta.total - delta.keeps > 0 && (start + this.remain >= delta.total)
      if (overflow && delta.scrollDirect === 'd') {
        this.fireEvent('tobottom')
      }
      return overflow
    },

    // Fire a props event to parent.
    fireEvent: function(event) {
      let cb = this[event]
      let now = +new Date()
      let delta = this.$options.delta
      if (cb && (now - delta.fireTime > 35)) {
        cb()
        delta.fireTime = now
      }
    },

    // If overflow range return the last zone.
    getLastZone: function() {
      let delta = this.$options.delta
      return {
        end: delta.total,
        start: delta.total - delta.keeps
      }
    },

    // Set manual scrollTop
    setScrollTop: function(scrollTop) {
      this.$refs.container.scrollTop = scrollTop
    },

    filter: function(slots) {
      let delta = this.$options.delta

      if (!slots) {
        slots = []
        delta.start = 0
      }

      delta.total = slots.length
      delta.paddingTop = this.size * delta.start
      delta.allPadding = this.size * (slots.length - delta.keeps)

      return slots.filter(function(slot, index) {
        return index >= delta.start && index <= delta.end
      })
    }
  },

  beforeMount: function() {
    let remains = this.remain
    let delta = this.$options.delta
    let benchs = Math.round(remains / 2)
    delta.start = this.start >= remains ? this.start : 0
    delta.end = this.start + remains + benchs
    delta.keeps = remains + benchs
    delta.viewHeight = this.size * remains
  },

  mounted: function() {
    let that = this
    this.$nextTick(() => {
      this.setScrollTop(this.start * this.size)
      $(this.$el).mCustomScrollbar({
        mouseWheel: true,
        theme: 'dark',
        // 设置滚动条滚动时触发的事件
        callbacks: {
          // 滚动时间开始的时候执行
          // onScrollStart: function(){},
          // 滚动中执行
          onScroll: function() {
            that.updateZone(-this.mcs.top)
          },
          // 滚动到底部的时调用
          // onTotalScroll: function(){},
          // 正在滚动时调用
          whileScrolling: function() {
            that.updateZone(-this.mcs.top)
          }
        }
      })
    })
  },
  render: function(createElement) {
    let showList = this.filter(this.$slots.default)
    let delta = this.$options.delta

    return createElement(this.rtag, {
      'ref': 'container',
      'style': {
        'display': 'block',
        'overflow-y': 'auto',
        'height': delta.viewHeight + 'px',
        'position': 'relative',
        'z-index': 2
      },
      'on': {
        'scroll': this.handleScroll
      }
    }, [createElement(this.wtag, {
      'style': {
        'display': 'block',
        'padding-top': delta.paddingTop + 'px',
        'padding-bottom': delta.allPadding - delta.paddingTop + 'px'
      }
    }, showList)])
  }
}
</script>
