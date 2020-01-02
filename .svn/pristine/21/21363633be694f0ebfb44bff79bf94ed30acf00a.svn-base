// flow
module.exports = {
  watch: {
    typeAheadPointer() {
      // this.maybeAdjustScroll()
    }
  },

  methods: {
    /**
     * Adjust the scroll position of the dropdown list
     * if the current pointer is outside of the
     * overflow bounds.
     * @returns {*}
     */
    maybeAdjustScroll() {
      const pixelsToPointerTop = this.pixelsToPointerTop()
      const pixelsToPointerBottom = this.pixelsToPointerBottom()

      if (pixelsToPointerTop <= this.viewport().top) {
        return this.scrollTo(pixelsToPointerTop)
      } else if (pixelsToPointerBottom >= this.viewport().bottom) {
        return this.scrollTo(this.viewport().top + this.pointerHeight())
      }
    },

    firstAdjustScroll() {
      this.scrollTo(this.pixelsToPointerTop())
    },

    /**
     * The distance in pixels from the top of the dropdown
     * list to the top of the current pointer element.
     * @returns {number}
     */
    pixelsToPointerTop() {
      let pixelsToPointerTop = 0
      if (this.$refs.dropdownMenu) {
        const dom = this.$refs.dropdownMenu.querySelector('.mCSB_container')
        for (let i = 0; i < this.typeAheadPointer; i++) {
          pixelsToPointerTop += dom.children[i].offsetHeight
        }
      }
      return pixelsToPointerTop
    },

    /**
     * The distance in pixels from the top of the dropdown
     * list to the bottom of the current pointer element.
     * @returns {*}
     */
    pixelsToPointerBottom() {
      return this.pixelsToPointerTop() + this.pointerHeight()
    },

    /**
     * The offsetHeight of the current pointer element.
     * @returns {number}
     */
    pointerHeight() {
      if (this.$refs.dropdownMenu) {
        const dom = this.$refs.dropdownMenu.querySelector('.mCSB_container')
        const element = dom.children[this.typeAheadPointer]
        return element ? element.offsetHeight : 0
      }
      return 0
    },

    /**
     * The currently viewable portion of the dropdownMenu.
     * @returns {{top: (string|*|number), bottom: *}}
     */
    viewport() {
      const top = this.$refs.dropdownMenu ? Math.abs(this.$refs.dropdownMenu.querySelector('.mCSB_container').style.top.replace('px', '')) : 0
      return {
        top: top,
        bottom: this.$refs.dropdownMenu ? this.$refs.dropdownMenu.offsetHeight + top : 0
      }
    },

    /**
     * Scroll the dropdownMenu to a given position.
     * @param position
     * @returns {*}
     */
    scrollTo(position) {
      // return this.$refs.dropdownMenu ? this.$refs.dropdownMenu.scrollTop = position : null
      this.scrollToPosition && this.scrollToPosition(position)
    }
  }
}
