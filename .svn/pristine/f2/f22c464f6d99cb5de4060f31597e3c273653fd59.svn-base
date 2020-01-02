import { readObject, saveObject, clearMulti } from '../../storage/index.js'
import { STORE_KEY_USERNAME, STORE_KEY_SESSION } from '../../constants.js'

export function read() {
  const user = readObject([STORE_KEY_USERNAME, STORE_KEY_SESSION])
  return user
}

export function save(user) {
  return saveObject(user, [STORE_KEY_USERNAME, STORE_KEY_SESSION])
}

export function clear() {
  return clearMulti([STORE_KEY_USERNAME, STORE_KEY_SESSION])
}
