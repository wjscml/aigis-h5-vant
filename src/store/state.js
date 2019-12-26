import { loadSearch, loadLogin } from '../common/js/cache.js'

const state = {
  author: {},
  searchHistory: loadSearch(),
  loginState: loadLogin()
}

export default state
