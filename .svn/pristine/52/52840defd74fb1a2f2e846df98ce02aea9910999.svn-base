export default {
  data() {
    return {
      typeAheadPointer: -1
    }
  },

  watch: {
    open(open) {
      if (!open) {
        return
      }
      const options = this.filteredOptions
      if (this.mutableValue) {
        let value
        if (typeof this.mutableValue === 'string') {
          value = {}
          value[this.label] = this.mutableValue
        } else {
          value = this.mutableValue
        }
        options.forEach((item, index) => {
          if (item.label === value.label || item === value.label) {
            this.typeAheadPointer = index
            setTimeout(() => {
              this.firstAdjustScroll()
            }, 1)
            return false
          }
        })
      } else {
        this.typeAheadPointer = 0
      }
    },
    filteredOptions(options) {
    }
  },

  methods: {
    /**
     * Move the typeAheadPointer visually up the list by
     * subtracting the current index by one.
     * @return {void}
     */
    typeAheadUp() {
      if (this.typeAheadPointer > 0) {
        this.typeAheadPointer--
        if (this.maybeAdjustScroll) {
          this.maybeAdjustScroll()
        }
        this.typeAheadSelect()
      }
    },

    /**
     * Move the typeAheadPointer visually down the list by
     * adding the current index by one.
     * @return {void}
     */
    typeAheadDown() {
      if (this.typeAheadPointer < this.filteredOptions.length - 1) {
        this.typeAheadPointer++
        if (this.maybeAdjustScroll) {
          this.maybeAdjustScroll()
        }
        this.typeAheadSelect()
      }
    },

    /**
     * Select the option at the current typeAheadPointer position.
     * Optionally clear the search input on selection.
     * @return {void}
     */
    typeAheadSelect() {
      // if (this.filteredOptions[this.typeAheadPointer]) {
      //     this.select(this.filteredOptions[this.typeAheadPointer]);
      // } else if (this.taggable && this.search.length) {
      //     this.select(this.search)
      // }
      if (!this.search) {
        if (!this.mutableValue) {
          this.mutableValue = this.oldvalue
        } else {
          this.mutableValue = this.filteredOptions[this.typeAheadPointer]
        }
        this.select(this.mutableValue, false)
        return
      }
      if (this.validate(this.search)) {
        const options = this.mutableOptions.filter((option) => {
          if (typeof option === 'object') {
            return option[this.label].toLowerCase().indexOf(this.search.toLowerCase()) > -1 && option[this.label] === this.search
          }
          return option.toLowerCase().indexOf(this.search.toLowerCase()) > -1 && option === this.search
        })
        if (options[this.typeAheadPointer]) {
          this.select(options[this.typeAheadPointer], false)
        } else if (this.taggable && this.search.length) {
          this.select(this.search, false)
        } else {
          let obj = {}
          obj[this.label] = this.search
          this.mutableOptions.push(obj)
          this.mutableValue = obj
          this.select(this.mutableValue, false)
        }
        if (this.clearSearchOnSelect) {
          this.search = ''
        }
      } else {
        this.search = ''
        if (!this.mutableValue) {
          this.mutableValue = this.oldvalue
        }
        this.select(this.mutableValue, false)
      }
    }
  }
}
