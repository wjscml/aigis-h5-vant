import * as types from './mutation-types.js'

const mutations = {
  [types.SET_AUTHOR] (state, author) {
    state.author = author
  },
  [types.SET_SEARCH_HISTORY] (state, history) {
    state.searchHistory = history
  },
  [types.SET_LOGIN_STATE] (state, loginState) {
    state.loginState = loginState
  }
}

export default mutations
