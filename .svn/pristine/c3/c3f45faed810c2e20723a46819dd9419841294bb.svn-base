import './disable.css'
export default {
  name: 'bs-disable',
  bind(el, { value }, vnode) {
    if (value) {
      add(el)
    } else {
      remove(el)
    }
  },
  componentUpdated(el, { value }) {
    if (value) {
      add(el)
    } else {
      remove(el)
    }
  }
}

function add(el) {
  el.classList.add('bs-disabled')
  const tagName = el.tagName.toLowerCase()
  if (tagName === 'input' || tagName === 'a' || tagName === 'textarea') {
    el.setAttribute('disabled', '')
  }
}

function remove(el) {
  el.classList.remove('bs-disabled')
  const tagName = el.tagName.toLowerCase()
  if (tagName === 'input' || tagName === 'a' || tagName === 'textarea') {
    el.removeAttribute('disabled')
  }
}
