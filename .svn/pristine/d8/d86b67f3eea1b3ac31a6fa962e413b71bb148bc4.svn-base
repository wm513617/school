<template>
  <div type="x/template" id="modal-template" class="popup">
    <transition name="modal">
      <div class="modal-mask" :style="indexNum">
        <iframe style="position:absolute;width:100%;height: 100%" frameborder="0"></iframe>
        <div class="modal-wrapper">
          <div class="modal-container" :style="classStyle">
            <div class="modal-header clearfix">
              <h1>{{title}}</h1>
              <button type="button" class="closeBtn icon iconfont icon-close1" id="no" @click="onClose"></button>
            </div>
            <div class="modal-body">
              <slot name="body"></slot>
            </div>
            <div class="modal-footer">
              <slot name="footer">
                <button class="sure-btn" id="yes" @click="onOK" v-if="ok">{{ok}}</button>
                <button class="delt-btn" id="no" @click="onClose">{{cancel}}</button>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Popup',
  props: {
    classStyle: {
      default: ''
    },
    indexNum: {
      default: ''
    },
    title: {
      default: ''
    },
    ok: {
      default: ''
    },
    cancel: {
      default: '关闭'
    }
  },
  methods: {
    onOK: function(e) {
      const id = e.target.id
      this.$emit('on-ok', id)
    },
    onClose: function(e) {
      const id = e.target.id
      this.$emit('on-close', id)
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 14px;
  display: inline-block;
  margin: 0;
  line-height: 46px;
}
.popup .modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.popup .modal-mask .closeBtn {
  float: right;
  line-height: 46px;
  height: 46px;
  font-size: 10px;
  color: #a8a8a8 !important;
  outline: none;
  opacity: 1 !important;
  border: none;
  background: none;
  padding: 0;
}

.popup .modal-mask .modal-wrapper {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}

.popup .modal-mask .modal-wrapper .modal-container {
  display: inline-block;
  text-align: left;
  border-radius: 2px;
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  position: relative;
  background: #fff;
}

.popup .modal-mask .modal-wrapper .modal-container .modal-container-list {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  position: absolute;
  left: 50%;
  top: 50%;
}

.popup .modal-mask .modal-wrapper .modal-container .modal-header {
  height: 46px;
  padding: 0 20px;
  line-height: 46px;
  font-size: 14px;
}

.popup .modal-mask .modal-wrapper .modal-container .modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.popup .modal-mask .modal-wrapper .modal-container .modal-body {
  margin: 0;
  padding: 20px 40px;
}

.popup .modal-mask .modal-wrapper .modal-container .modal-footer {
  padding: 0 40px 20px 20px;
  text-align: right;
  border-top: none;
}

.modal-default-button {
  float: right;
  height: 34px;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.modal-default-button {
  font-size: 16px;
  color: #000;
  background-color: #eee;
  border-color: #eee;
}

.btn-primary {
  color: #fff;
  background-color: #428bca;
  border-color: #357ebd;
  border-radius: 2px;
}

.popup .modal-mask .modal-wrapper .modal-container .modal-footer .sure-btn {
  color: #fff;
  background-color: #20a0ff;
  border: none;
  height: 28px;
  line-height: 28px;
  padding: 0 20px;
  font-size: 12px;
  text-align: center;
  margin-right: 20px;
  border-radius: 2px;
}

.popup .modal-mask .modal-wrapper .modal-container .modal-footer .sure-btn:hover {
  background-color: #217ebd;
}

.popup .modal-mask .modal-wrapper .modal-container .modal-footer .delt-btn {
  color: #414141;
  border: 1px solid #d1d1d1;
  height: 28px;
  line-height: 28px;
  padding: 0 20px;
  background: #fff;
  font-size: 12px;
  text-align: center;
  border-radius: 2px;
}

.popup .modal-mask .modal-wrapper .modal-container .modal-footer .delt-btn:hover {
  color: #20a0ff;
  border: 1px solid #20a0ff;
}
</style>
