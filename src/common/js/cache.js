import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 12

const LOGIN_STATE_KEY = '__loginState__'

const MARKET_FAVOR_KEY = '__marketFavor__'

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200

const FAVORITE_REPORTS_KEY = '__favoriteReports__'
const FAVORITE_VIP_KEY = '__favoriteVip__'

function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function saveSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  console.log(searches)
  insertArray(searches, query, (item) => {
    return item.name === query.name
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}

export function deleteSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}

export function saveMarketFavor (data) {
  storage.set(MARKET_FAVOR_KEY, data)
  return data
}

export function loadMarketFavor () {
  return storage.get(MARKET_FAVOR_KEY, [])
}

export function saveLogin (data) {
  storage.set(LOGIN_STATE_KEY, data)
  return data
}

export function loadLogin () {
  return storage.get(LOGIN_STATE_KEY, [])
}

export function clearLogin () {
  storage.remove(LOGIN_STATE_KEY)
  return []
}

// news
export function saveFavorite (article) {
  let articles = storage.get(FAVORITE_KEY, [])
  insertArray(articles, article, (item) => {
    return article.id === item.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, articles)
  return articles
}

export function deleteFavorite (article) {
  let articles = storage.get(FAVORITE_KEY, [])
  deleteFromArray(articles, (item) => {
    return article.id === item.id
  })
  storage.set(FAVORITE_KEY, articles)
  return articles
}

export function loadFavorite () {
  return storage.get(FAVORITE_KEY, [])
}

// reports
export function saveFavoriteReports (article) {
  let articles = storage.get(FAVORITE_REPORTS_KEY, [])
  insertArray(articles, article, (item) => {
    return article.id === item.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_REPORTS_KEY, articles)
  return articles
}

export function deleteFavoriteReports (article) {
  let articles = storage.get(FAVORITE_REPORTS_KEY, [])
  deleteFromArray(articles, (item) => {
    return article.id === item.id
  })
  storage.set(FAVORITE_REPORTS_KEY, articles)
  return articles
}

export function loadFavoriteReports () {
  return storage.get(FAVORITE_REPORTS_KEY, [])
}

// reports-vip
export function saveFavoriteVip (article) {
  let articles = storage.get(FAVORITE_VIP_KEY, [])
  insertArray(articles, article, (item) => {
    return article.id === item.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_VIP_KEY, articles)
  return articles
}

export function deleteFavoriteVip (article) {
  let articles = storage.get(FAVORITE_VIP_KEY, [])
  deleteFromArray(articles, (item) => {
    return article.id === item.id
  })
  storage.set(FAVORITE_VIP_KEY, articles)
  return articles
}

export function loadFavoriteVip () {
  return storage.get(FAVORITE_VIP_KEY, [])
}
