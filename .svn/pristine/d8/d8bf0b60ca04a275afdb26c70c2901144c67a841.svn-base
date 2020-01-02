<style scoped>
iframe {
  position: absolute;
  background-color: transparent;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  border: 0 none;
  z-index: 100;
  margin: 0;
  padding: 0;
}

ul li a {
  margin: 0;
  padding: 0;
  text-decoration: none;
}

.v-select {
  position: relative;
  color: #fff;
  font-size: 12px;
}

.v-select .open-indicator {
  position: absolute;
  top: 13px;
  right: 8px;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid #fff;
  z-index: 1;
}

.v-select .open-indicator:before {
  display: none;
}

.form-control {
  cursor: default;
  font-size: 12px;
}

.v-select.loading .open-indicator {
  opacity: 0;
}

.v-select .dropdown-toggle {
  height: 26px;
  display: block;
  padding: 0;
  background: #1c3053;
  border: 1px solid #5676a9;
  border-radius: 4px;
  white-space: normal;
  position: relative;
  z-index: 500;
}

.v-select.searchable .dropdown-toggle {
  height: 22px;
  padding: 0px 7px;
  box-sizing: content-box;
  cursor: text;
}

.v-select.searchable .dropdown-toggle:hover {
  border-color: #4699f9;
}

.v-select .divCss {
  box-sizing: border-box;
  border-color: #4699f9;
  -ms-box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0 0 8px rgba(102, 175, 233, 0.5);
  -webkit-box-shadow: 0 0 8px rgba(102, 175, 233, 0.5);
  box-shadow: 0 0 8px rgba(102, 175, 233, 0.5);
  -webkit-transition: border-color ease-in-out 0.15s,
    -webkit-box-shadow ease-in-out 0.15s;
  -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
}

.v-select.searchable .dropdown-toggle .form-control {
  height: 26px;
  position: absolute;
  left: 0;
}

.v-select.open .dropdown-toggle {
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
}

.v-select > .dropdown-menu {
  margin: 0;
  width: 100%;
  border: 1px solid #4699f9;
  border-radius: 2px;
  overflow: auto;
  margin-top: 2px;
  z-index: 9999999;
  background: #3c5073;
  padding: 0;
}

.v-select > .dropdown-menu > li {
  font-size: 12px;
  margin-top: 0;
  margin: 0;
  padding: 0;
}

.v-select > .dropdown-menu > li > a {
  padding: 0;
  padding-left: 10px;
  height: 26px;
  line-height: 26px;
  font-size: 12px;
}

.v-select .selected-tag {
  color: #fff;
  margin-top: 1px;
  padding: 0;
  font-size: 12px;
  float: left;
  line-height: 1.7em;
  border: 0;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.v-select .selected-tag .close {
  float: none;
  margin-right: 0;
  font-size: 20px;
}

.v-select input[type='search'],
.v-select input[type='search']:focus {
  display: inline-block;
  border: none;
  outline: none;
  margin: 0;
  padding: 0 0.5em;
  width: 10em;
  height: 26px;
  max-width: 100%;
  background: none;
  position: relative;
  box-shadow: none;
}

.v-select input[type='search']:disabled {
  cursor: pointer;
}

.v-select li {
  width: 100%;
}

.v-select li a {
  cursor: pointer;
  height: 26px;
  line-height: 26px;
  color: #fff;
  display: block;
  font-size: 12px;
  padding-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.v-select ul {
  z-index: 90;
}

.v-select ul li {
  position: relative;
  z-index: 105;
}

.v-select ul li.active a {
  background: #4699f9;
}

.v-select .spinner {
  opacity: 0;
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: 5px;
  text-indent: -9999em;
  overflow: hidden;
  border-top: 0.9em solid rgba(100, 100, 100, 0.1);
  border-right: 0.9em solid rgba(100, 100, 100, 0.1);
  border-bottom: 0.9em solid rgba(100, 100, 100, 0.1);
  border-left: 0.9em solid rgba(60, 60, 60, 0.45);
  transform: translateZ(0);
  animation: vSelectSpinner 1.1s infinite linear;
  transition: opacity 0.1s;
}

.v-select.loading .spinner {
  opacity: 1;
}

.v-select .spinner,
.v-select .spinner:after {
  border-radius: 50%;
  width: 5em;
  height: 5em;
}

input:focus {
  outline-offset: 0;
}

input {
  outline: none;
  color: #fff;
}

.dropdown-toggle.selectdisabled {
  background: #eee;
  cursor: not-allowed;
}

.dropdown-toggle.selectdisabled .selected-tag {
  color: #fff;
}
::-moz-placeholder {
  color: #eee;
}

::-webkit-input-placeholder {
  color: #eee;
}

:-ms-input-placeholder {
  color: #eee;
}
</style>

<template>
  <div class="dropdown v-select" :class="[dropdownClasses]">
    <iframe v-if="addiFrame"></iframe>
    <div ref="toggle" @mousedown.prevent="toggleDropdown($event)" class="dropdown-toggle" :class="{divCss: divCss, selectdisabled:disabled}" :tabindex="tabindex">
      <span v-if="!integarte" class="selected-tag" ref="spans" v-for="option in valueAsArray" v-bind:key="option.index">
        {{ getOptionLabel(option) ? getOptionLabel(option) : "请选择" }}
        <button v-if="multiple" @click="deselect(option)" type="button" class="close">
          <span aria-hidden="true">&times;</span>
        </button>
      </span>
      <input ref="search" :debounce="debounce" v-model="search" @keydown.delete="maybeDeleteValue" @keyup.esc="onEscape" @keydown.up.left.prevent="typeAheadUp" @keydown.down.right.prevent="typeAheadDown" @keyup.enter.prevent="onSearchBlur" @blur="onSearchBlur($event)" @focus="onSearchFocus" type="search" class="form-control" :placeholder="searchPlaceholder" :readonly="!editable" :style="{ width: isValueEmpty ? '100%' : 'auto' }">
      <i v-if="!noDrop" ref="openIndicator" role="presentation" class="open-indicator"></i>
      <slot name="spinner">
        <div class="spinner" v-show="mutableLoading">Loading...</div>
      </slot>
    </div>
    <ul ref="dropdownMenu" v-if="dropdownOpen" :transition="transition" class="dropdown-menu" :style="{ 'max-height': maxHeight + 'px', 'min-width': minWidth, 'position':place, 'top': getTop + 'px', 'left': left + 'px' }">
      <iframe v-if="addiFrame"></iframe>
      <li v-for="(option, index) in filteredOptions" v-bind:key="index" :class="{ active: typeAheadPointer === index }" @mouseenter="typeAheadPointer = index">
        <a @mousedown.prevent="select(option)" :title="getOptionLabel(option)">
          {{ getOptionLabel(option) }}
        </a>
      </li>
      <transition name="fade">
        <li v-if="!filteredOptions.length" class="divider"></li>
      </transition>
      <transition name="fade">
        <li v-if="!filteredOptions.length" class="text-center">
          <slot name="no-options"></slot>
        </li>
      </transition>
    </ul>
  </div>
</template>

<script type="text/babel">
import $ from 'jquery'
import pointerScroll from './mixins/pointerScroll.js'
import typeAheadPointer from './mixins/typeAheadPointer'
import '../Scroll.vue'
export default {
  mixins: [pointerScroll, typeAheadPointer],
  name: 'VSelect',
  props: {
    parentNode: {
      type: String,
      default: ''
    },
    place: {
      type: String,
      default: 'absolute'
    },
    top: {
      type: String,
      // -172 下拉列表显示在上方
      default: 'top'
    },
    left: {
      type: Number,
      default: 0
    },
    /**
     * Contains the currently selected value. Very similar to a
     * `value` attribute on an <input>. You can listen for changes
     * using 'change' event using v-on
     * @type {Object||String||null}
     */
    value: {
      default: null
    },

    /**
     * An array of strings or objects to be used as dropdown choices.
     * If you are using an array of objects, vue-select will look for
     * a `label` key (ex. [{label: 'This is Foo', value: 'foo'}]). A
     * custom label key can be set with the `label` prop.
     * @type {Object}
     */
    options: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      default: false,
      type: Boolean
    },
    /**
     * Sets the max-height property on the dropdown list.
     * @deprecated
     * @type {String}
     */
    maxHeight: {
      type: Number,
      default: 400
    },
    minWidth: {
      type: String,
      default: '10px'
    },
    /**
     * Enable/disable filtering the options.
     * @type {Boolean}
     */
    searchable: {
      type: Boolean,
      default: true
    },
    editable: {
      type: Boolean,
      default: false
    },
    /**
     * Equivalent to the `multiple` attribute on a `<select>` input.
     * @type {Object}
     */
    multiple: {
      type: Boolean,
      default: false
    },

    /**
     * Equivalent to the `placeholder` attribute on an `<input>`.
     * @type {Object}
     */
    placeholder: {
      type: String,
      default: ''
    },

    /**
     * Sets a Vue transition property on the `.dropdown-menu`. vue-select
     * does not include CSS for transitions, you'll need to add them yourself.
     * @type {String}
     */
    transition: {
      type: String,
      default: 'expand'
    },

    /**
     * Enables/disables clearing the search text when an option is selected.
     * @type {Boolean}
     */
    clearSearchOnSelect: {
      type: Boolean,
      default: true
    },

    /**
     * Tells vue-select what key to use when generating option
     * labels when each `option` is an object.
     * @type {String}
     */
    label: {
      type: String,
      default: 'label'
    },

    /**
     * Callback to generate the label text. If {option}
     * is an object, returns option[this.label] by default.
     * @param  {Object || String} option
     * @return {String}
     */
    getOptionLabel: {
      type: Function,
      default(option) {
        if (typeof option === 'object') {
          if (this.label && option[this.label]) {
            return option[this.label].toString()
          } else {
            return false
          }
        }
        return option
      }
    },

    /**
     * An optional callback function that is called each time the selected
     * value(s) change. When integrating with Vuex, use this callback to trigger
     * an action, rather than using :value.sync to retreive the selected value.
     * @type {Function}
     * @default {null}
     */
    onChange: {
      type: Function,
      default: function(val) {
        this.$emit('input', val)
      }
    },

    /**
     * Enable/disable creating options from searchInput.
     * @type {Boolean}
     */
    taggable: {
      type: Boolean,
      default: false
    },

    /**
     * When true, newly created tags will be added to
     * the options list.
     * @type {Boolean}
     */
    pushTags: {
      type: Boolean,
      default: false
    },

    /**
     * User defined function for adding Options
     * @type {Function}
     */
    createOption: {
      type: Function,
      default(newOption) {
        if (typeof this.mutableOptions[0] === 'object') {
          newOption = { [this.label]: newOption }
        }
        this.$emit('option:created', newOption)
        return newOption
      }
    },

    /**
     * When false, updating the options will not reset the select value
     * @type {Boolean}
     */
    resetOnOptionsChange: {
      type: Boolean,
      default: false
    },

    /**
     * Disable the dropdown entirely.
     * @type {Boolean}
     */
    noDrop: {
      type: Boolean,
      default: false
    },
    // 输入的值是否能加入下拉列表
    validate: {
      type: Function,
      default() {
        return true
      }
    },
    // input输入的值
    valival: {
      type: Function,
      default() {
        return this.search
      }
    },
    tabindex: {
      type: String,
      default: 'none'
    },
    addiFrame: { // 是否加载iframe
      type: Boolean,
      default: false
    },
    isStream: { // 点击选中文本
      type: Boolean,
      default: false
    },
    //  输入框选择并且展示
    integarte: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      search: '',
      open: false,
      mutableValue: null,
      mutableOptions: [],
      mutableLoading: false,
      divCss: false,
      debounce: 100,
      oldvalue: '',
      getTop: ''
    }
  },

  watch: {
    search(value) {
      this.search = this.valival(value)
      if (this.integarte) {
        this.mutableValue = {
          'label': this.search,
          'value': this.search
        }
      }
    },
    /**
     * When the value prop changes, update
     * the internal mutableValue.
     * @param  {mixed} val
     * @return {void}
     */
    value(val) {
      this.mutableValue = val
      if (this.integarte && val !== null && val !== undefined) {
        if (val.label !== this.search) { this.search = val.label }
      }
    },
    /**
     * Maybe run the onChange callback.
     * @param  {string|object} val
     * @param  {string|object} old
     * @return {void}
     */
    mutableValue(val, old) {
      if (this.multiple) {
        if (this.onChange) { this.onChange(val) }
      } else {
        if (this.onChange && val !== old) { this.onChange(val) }
      }
    },

    /**
     * When options change, update
     * the internal mutableOptions.
     * @param  {array} val
     * @return {void}
     */
    options(val) {
      this.mutableOptions = val
    },

    /**
     * Maybe reset the mutableValue
     * when mutableOptions change.
     * @return {[type]} [description]
     */
    mutableOptions() {
      if (!this.taggable) {
        if (this.multiple) {
          this.mutableValue = []
        } else {
          if (this.value && this.optionExists(this.value.label)) {
            this.mutableValue = this.value
          } else if (this.mutableOptions.length) {
            this.mutableValue = this.value ? this.value : ''
          } else {
            this.mutableValue = null
          }
          if (this.mutableValue && this.integarte) {
            this.search = this.mutableValue.label
          }
        }
      }
    },

    /**
     * Always reset the mutableValue when
     * the multiple prop changes.
     * @param  {Boolean} val
     * @return {void}
     */
    multiple(val) {
      this.mutableValue = val ? [] : null
    }
  },

  /**
   * Clone props into mutable values,
   * attach any event listeners.
   */
  created() {
    this.getTop = this.top
    this.mutableOptions = [...this.options]
    if (this.value && this.optionExists(this.value.label)) {
      this.mutableValue = this.value
    } else if (this.mutableOptions.length) {
      this.mutableValue = this.value ? this.value : this.mutableOptions[0]
    } else {
      this.mutableValue = null
    }
    this.mutableLoading = this.loading

    this.$on('option:created', this.maybePushTag)
  },

  methods: {

    /**
     * Select a given option.
     * @param  {Object|String} option
     * @return {void}
     */
    select(option, close = true) {
      if (this.isOptionSelected(option)) {
        this.deselect(option)
      } else {
        if (this.taggable && !this.optionExists(option)) {
          option = this.createOption(option)
          this.$emit('getOption', option)
        }
        if (this.multiple && !this.mutableValue) {
          this.mutableValue = [option]
          this.$emit('getOption', this.mutableValue)
        } else if (this.multiple) {
          this.mutableValue.push(option)
          this.$emit('getOption', this.mutableValue)
        } else {
          this.mutableValue = option
          this.$emit('getOption', this.mutableValue)
        }
      }

      if (close) {
        this.onAfterSelect(option)
      }
    },

    /**
     * De-select a given option.
     * @param  {Object|String} option
     * @return {void}
     */
    deselect(option) {
      if (this.multiple) {
        let ref = -1
        this.mutableValue.forEach((val) => {
          if (val === option || (typeof val === 'object' && val[this.label] === option[this.label])) {
            ref = val
          }
        })
        const index = this.mutableValue.indexOf(ref)
        this.mutableValue.splice(index, 1)
      } else {
        // 改变重复选择一个选项会值空的问题
        // this.mutableValue = null
      }
    },

    /**
     * Called from this.select after each selection.
     * @param  {Object|String} option
     * @return {void}
     */
    onAfterSelect(option) {
      if (!this.multiple) {
        this.open = !this.open
        this.$refs.search.blur()
      }
      if (this.clearSearchOnSelect) {
        this.search = ''
      }
    },

    /**
     * Toggle the visibility of the dropdown menu.
     * @param  {Event} e
     * @return {void}
     */
    toggleDropdown(e) {
      if (!this.disabled) {
        if ((this.$refs.spans && e.target === this.$refs.spans[0]) || e.target === this.$refs.openIndicator || e.target === this.$refs.search || e.target === this.$refs.toggle || e.target === this.$el) {
          if (this.open) {
            if (this.isStream) {
              this.$refs.search.selectionStart = 0
              this.$refs.search.selectionEnd = 0
            }
            this.$refs.search.blur() // dropdodwn will close on blur
          } else {
            this.open = true
            this.$refs.search.focus()
          }
        }
      }
      if (this.parentNode === '') {
        return
      }
      // 所选元素到底部的距离
      const elBottom = window.innerHeight - e.target.getBoundingClientRect().bottom
      // console.log(e.target.getBoundingClientRect().bottom)
      // table到底部的距离
      // console.log($('.' + this.parentNode).height())
      const tableBottom = window.innerHeight - $('.' + this.parentNode).height() - $('.' + this.parentNode).offset().top
      // console.log(tableBottom)
      const setData = elBottom - tableBottom
      // console.log(setData)
      const ulHeight = this.filteredOptions.length * 34
      // 距离差值
      console.log(this.maxHeight, ulHeight, setData, elBottom, tableBottom)
      if (this.maxHeight > ulHeight && setData < ulHeight) {
        this.getTop = '-' + (ulHeight + 16)
      } else if (this.maxHeight < ulHeight && setData < this.maxHeight) {
        this.getTop = '-' + (this.maxHeight + 4)
      }
    },

    /**
     * Check if the given option is currently selected.
     * @param  {Object|String}  option
     * @return {Boolean}        True when selected | False otherwise
     */
    isOptionSelected(option) {
      if (this.multiple && this.mutableValue) {
        let selected = false
        this.mutableValue.forEach(opt => {
          if (typeof opt === 'object' && opt[this.label] === option[this.label]) {
            selected = true
          } else if (typeof opt === 'object' && opt[this.label] === option) {
            selected = true
          } else if (opt === option) {
            selected = true
          }
        })
        return selected
      }
      if (!this.mutableValue) {
        return false
      }
      return typeof option === 'object' ? this.mutableValue[this.label] === option[this.label] : this.mutableValue === option
    },

    /**
     * If there is any text in the search input, remove it.
     * Otherwise, blur the search input to close the dropdown.
     * @return {void}
     */
    onEscape() {
      if (!this.search.length) {
        this.$refs.search.blur()
      } else {
        this.search = ''
      }
    },

    /**
     * Close the dropdown on blur.
     * @emits  {search:blur}
     * @return {void}
     */
    onSearchBlur() {
      // this.typeAheadSelect()
      this.open = false
      this.divCss = false
      this.$emit('search:blur')
      this.$emit('searchdata', { search: this.mutableValue, mutableOptions: this.mutableOptions })
      this.$emit('blurMin')
    },

    /**
     * Open the dropdown on focus.
     * @emits  {search:focus}
     * @return {void}
     */
    onSearchFocus() {
      if (this.isStream) {
        this.$refs.search.selectionStart = 0
        this.$refs.search.selectionEnd = this.$refs.search.value.length
      }
      this.oldvalue = this.mutableValue
      this.divCss = true
      this.open = true
      this.$emit('search:focus')
    },
    /**
     * Delete the value on Delete keypress when there is no
     * text in the search input, & there's tags to delete
     * @return {this.value}
     */
    maybeDeleteValue() {
      if (!this.editable) { return }
      if (!this.$refs.search.value.length && this.mutableValue) {
        if (this.multiple) {
          return this.mutableValue.pop()
        } else {
          this.mutableValue = null
          return this.mutableValue
        }
        // return this.multiple ? this.mutableValue.pop() : this.mutableValue = null
      }
    },

    scrollToPosition(position) {
      if (this.$refs.dropdownMenu) { $(this.$refs.dropdownMenu).mCustomScrollbar('scrollTo', position, { scrollInertia: 0 }) } // scrollInertia: 滚动持续时间
    },

    /**
     * Determine if an option exists
     * within this.mutableOptions array.
     *
     * @param  {Object || String} option
     * @return {boolean}
     */
    optionExists(option) {
      let exists = false

      this.mutableOptions.forEach(opt => {
        if (typeof opt === 'object' && opt[this.label] === option) {
          exists = true
        } else if (opt === option) {
          exists = true
        }
      })

      return exists
    },

    /**
     * If push-tags is true, push the
     * given option to mutableOptions.
     *
     * @param  {Object || String} option
     * @return {void}
     */
    maybePushTag(option) {
      if (this.pushTags) {
        this.mutableOptions.push(option)
      }
    }
  },

  computed: {

    /**
     * Classes to be output on .dropdown
     * @return {Object}
     */
    dropdownClasses() {
      return {
        open: this.dropdownOpen,
        searchable: this.searchable,
        loading: this.mutableLoading
      }
    },

    /**
     * Return the current state of the
     * dropdown menu.
     * @return {Boolean} True if open
     */
    dropdownOpen() {
      return this.noDrop ? false : this.open
    },

    /**
     * Return the placeholder string if it's set
     * & there is no value selected.
     * @return {String} Placeholder text
     */
    searchPlaceholder() {
      if (this.isValueEmpty && this.placeholder) {
        return this.placeholder
      } else {
        return this.search ? '' : this.placeholder
      }
    },

    /**
     * The currently displayed options, filtered
     * by the search elements value. If tagging
     * true, the search text will be prepended
     * if it doesn't already exist.
     *
     * @return {array}
     */
    filteredOptions() {
      // const options = this.mutableOptions.filter((option) => {
      //   if (typeof option === 'object') {
      //     return option[this.label].toLowerCase().indexOf(this.search.toLowerCase()) > -1
      //   }
      //   return option.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      // })
      const options = this.mutableOptions
      if (this.taggable && this.search.length && !this.optionExists(this.search)) {
        options.unshift(this.search)
      }
      return options
    },

    /**
     * Check if there aren't any options selected.
     * @return {Boolean}
     */
    isValueEmpty() {
      if (this.mutableValue) {
        if (typeof this.mutableValue === 'object') {
          return !Object.keys(this.mutableValue).length
        }
        return !this.mutableValue.length
      }

      return true
    },

    /**
     * Return the current value in array format.
     * @return {Array}
     */
    valueAsArray() {
      if (this.multiple) {
        return this.mutableValue
      } else if (this.mutableValue) {
        return [this.mutableValue]
      }

      return []
    }
  }

}
</script>
