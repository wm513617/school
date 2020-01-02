import $ from 'jquery'
const queueList = []
export function prompt(title = '', message = '', type = 'success') {
  if (queueList.length >= 3) {
    const item = queueList.shift()
    // const item = queueList.pop()
    if (item) {
      item.close()
    }
  }
  const notify = $.notify({
    icon: 'icon iconfont icon-' + type,
    title: title,
    message: message
  }, {
    element: 'body',
    position: null,
    type: type, // type: danger,success,warning
    allow_dismiss: true,
    newest_on_top: true,
    showProgressbar: false,
    placement: {
      from: 'bottom',
      align: 'right'
    },
    offset: 3,
    z_index: 1031,
    spacing: 10,
    letterSspacing: '1px',
    delay: 3000,
    timer: 1000,
    mouse_over: null,
    animate: {
      enter: 'animated fadeInDown',
      exit: 'animated fadeOutUp'
    }
  })
  queueList.push(notify)
}
