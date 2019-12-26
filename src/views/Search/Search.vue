<template>
<div class="search-wrap">
  <search-bar @search="getSearchData"></search-bar>
  <suggest :searchData="searchData" :query="query" :hasLoading="hasLoading"
    @addFavor="toggleFavor">
  </suggest>
  <div class="search-history" v-if="searchHistory.length">
    <div class="top">
      <div class="title">历史搜索</div >
      <span class="icon-delete" @click="showConfirm"></span>
    </div >
    <div class="main">
      <div class="main-item" v-for="(item, index) in searchHistory" :key="index" @click="goDetail(item)">
        <div class="name">{{item.name}}</div>
        <div class="code">{{item.code}}</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSearch, getFavorIndicatorList, addFavorIndicator } from '@/api/index.js'
import SearchBar from '@/components/SearchBar/SearchBar'
import Suggest from '@/components/Suggest/Suggest'
import { loadSearch, clearSearch } from '@/common/js/cache.js'

import { Dialog } from 'vant'
export default {
  data () {
    return {
      query: '',
      searchData: [],
      favorList: [],
      searchHistory: [],
      hasLoading: null
    }
  },
  computed: {
    ...mapGetters([
      'loginState'
    ])
  },
  created () {
    this.getSearchHistory()

    getFavorIndicatorList({
      session: this.loginState.session
    }).then(res => {
      this.favorList = res
    })
  },
  methods: {
    goDetail (detail) {
      // console.log(detail)
      this.$router.push({
        path: '/site/market?name=' + detail.table_name + '&code=' + detail.id + '&description=' + detail.name + ':' + detail.code
      })
    },
    getSearchData (query) {
      this.searchData = []
      this.hasLoading = true
      getSearch({
        q: query,
        isShowLoading: false
      }).then(res => {
        this.hasLoading = false
        if (res) {
          let searchData = res
          let favorList = this.favorList
          // console.log(searchData, favorList)
          for (let n in searchData) {
            searchData[n].favor = false
            for (let m in favorList) {
              if (searchData[n].symbol === favorList[m].indicator_code) {
                searchData[n].favor = true
              }
            }
          }
          this.searchData = searchData
          this.query = query
        }
      })
      if (query === '') {
        this.query = ''
        this.getSearchHistory()
      }
    },
    toggleFavor (param) {
      addFavorIndicator({
        indicatorId: param.item.indicator_id,
        session: this.loginState.session,
        action: 1
      }).then(res => {
        // item.favor = res.favor
        this.searchData[param.index].favor = res.favor
      })
    },
    getSearchHistory () {
      this.searchHistory = loadSearch()
      // console.log(this.searchHistory)
    },
    showConfirm () {
      Dialog.confirm({
        message: '确定清空全部历史记录？'
      }).then(() => {
        this.deleteAll()
      }).catch(() => {

      })
    },
    deleteAll () {
      clearSearch()
      this.searchHistory = []
    }
  },
  components: {
    Suggest,
    SearchBar
  }
}
</script>

<style lang="stylus">
@import '~@/common/style/variable.styl'
.search-wrap
  height 100%
  background-color #fff
  .search-history
    padding 0 15px
    .top
      display flex
      justify-content: space-between
      align-items: center
      height 54px
      .title
        font-size: 14px
        color $color-title
      .icon-delete
        padding 0 5px
        font-size: 19px
        color $color-light-text
    .main
      display flex
      flex-wrap: wrap
      .main-item
        padding 9px 5px
        margin 0 5px 10px
        width: calc(33.3% - 20px - 2px)
        border 1px solid $color-light-blue
        border-radius: 6px
        text-align: center
        .name
          margin-bottom 4px
          font-size: 15px
          color $color-blue
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        .code
          font-size: 12px
          color $color-light-text
</style>
