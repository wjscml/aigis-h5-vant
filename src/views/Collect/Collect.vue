<template>
<div class="collect-wrap">
  <van-nav-bar
    title="我的收藏"
    :left-arrow="true"
    @click-left="onClickLeft"
  />
  <van-tabs v-model="active" color="#007AFF" :sticky="true">
    <van-tab title="新闻">
      <news-list ref="newsList" :newsList="newsList" :finished="finished"
        @goDetail="goNewsDetail" @onLoad="onNewsLoad"
      />
    </van-tab>
    <van-tab title="专享报告">
      <news-list ref="reportList" :newsList="reportList" :finished="finished"
        @goDetail="goReportDetail" @onLoad="onReportLoad"
      />
    </van-tab>
  </van-tabs>
</div>
</template>

<script>
import { loadFavorite, loadFavoriteVip } from '@/common/js/cache.js'
import NewsList from '@/components/NewsList/NewsList'
import Vue from 'vue'
import { Tabs, Tab } from 'vant'

Vue.use(Tabs).use(Tab)
export default {
  data () {
    return {
      active: 0,
      finished: false,
      newsList: (() => {
        return loadFavorite()
      })(),
      reportList: (() => {
        return loadFavoriteVip()
      })()
    }
  },
  methods: {
    onNewsLoad () {
      this.$refs.newsList.loadingEnd()
    },
    onReportLoad () {
      this.$refs.reportList.loadingEnd()
    },
    goNewsDetail () {

    },
    goReportDetail () {

    },
    onClickLeft () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    }
  },
  components: {
    NewsList
  }
}
</script>

<style lang="stylus">
@import '~@/common/style/variable.styl'
@import '~@/common/style/mixin.styl'
.collect-wrap
  overflow auto
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  background-color #fff
  z-index 100
  .van-tab
    span
      font-size: 15px
  .van-tab--active
    span
      font-size: 19px
      font-weight 600
</style>
