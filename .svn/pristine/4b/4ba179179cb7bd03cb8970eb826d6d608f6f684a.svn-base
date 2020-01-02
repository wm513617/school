// const storage = window.localStorage
const storage = window.sessionStorage

export function save(key, value) {
  storage.setItem(key, value)
}

export function readObject(keys) {
  var user = {
  }
  keys.map(key => {
    const rk = key.slice(key.indexOf('.') + 1)
    user[rk] = read(key)
  })
  return user
}

export function saveObject(obj, keys) {
  keys.forEach((key) => {
    const rk = key.slice(key.indexOf('.') + 1)
    save(key, obj[rk])
  })
}

export function saveMulti(datas) {
  datas.forEach(data => save(data.key, data.value))
}

export function read(key) {
  return storage.getItem(key)
}

export function readMulti(keys) {
  return keys.map(key => read(key))
}

export function clear(key, clearAll = false) {
  if (clearAll) {
    storage.clear()
  } else {
    storage.removeItem(key)
  }
}

export function clearMulti(keys) {
  keys.forEach(key => clear(key))
}
