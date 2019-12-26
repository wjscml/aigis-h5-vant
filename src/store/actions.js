import * as types from './mutation-types.js'
import { saveSearch, deleteSearch, clearSearch, saveLogin, clearLogin } from '../common/js/cache.js'

export const saveSearchHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function ({ commit }) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const saveLoginState = function ({ commit }, val) {
  commit(types.SET_LOGIN_STATE, saveLogin(val))
}

export const clearLoginState = function ({ commit }) {
  commit(types.SET_LOGIN_STATE, clearLogin())
}
