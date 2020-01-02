import { get, post, put, remove} from '../base.js'
export const getDictionary = (param) => {
  return post({
    url: '/business/getdict.php',
    body: param
  })
}
