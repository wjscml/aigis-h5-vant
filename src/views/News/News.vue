<template>
<div class="news-wrap">
  <van-sticky>
    <van-tabs class="news-nav-bar" @click="tapTab" color="rgb(0, 122, 255)">
      <van-tab v-for="(tab, index) in navList" :key="index"
        :title="tab.name"
      />
    </van-tabs>
    <div class="more"><i class="icon-more" /></div>
  </van-sticky>
  <div class="content">
    <van-pull-refresh v-model="isLoading" @refresh="tapTab(type)">
      <news-list ref="newsList" :newsList="newsList" :finished="finished"
        @goDetail="goDetail" @onLoad="getList"
      />
    </van-pull-refresh>
  </div>
  <router-view />
</div>
</template>

<script>
import NewsList from '@/components/NewsList/NewsList'
import { getCategories, getNewsList } from '@/api'
import Vue from 'vue'
import { Tab, Tabs, PullRefresh, Sticky } from 'vant'

Vue.use(PullRefresh).use(Sticky).use(Tab).use(Tabs)
export default {
  data () {
    return {
      newsList: [],
      page: 0,
      type: 0,
      navList: [],
      finished: false,
      isLoading: false
    }
  },
  created () {
    this.getNavList()
    // this.getList(this.type)
  },
  methods: {
    getNavList () {
      getCategories().then(res => {
        if (res) {
          this.navList = res
        }
      })
    },
    getList () {
      getNewsList({
        page: this.page,
        type: this.type
      }).then((res) => {
        this.isLoading = false
        this.$refs.newsList.loadingEnd()
        if (res) {
          this.page = this.page + 1
          this.newsList = this.newsList.concat(res)
          // uni.stopPullDownRefresh()
        } else {
          this.finished = true
        }
      })
    },
    tapTab (i) {
      console.log(this.isLoading)
      this.isLoading = true
      this.newsList = []
      this.page = 0
      this.type = i
      this.getList()
    },
    goDetail (e) {
      // uni.navigateTo({
      //   url: '/pages/newsDetail/newsDetail?id=' + encodeURIComponent(JSON.stringify(detail))
      // })
      this.$router.push({
        path: `/news/${e}`
      })
    },
    dislike (tabIndex, newsIndex) {
      // uni.showModal({
      //   content: '不感兴趣？',
      //   success: (res) => {
      //     if (res.confirm) {
      //       this.newsList[tabIndex].data.splice(newsIndex, 1);
      //     }
      //   }
      // })
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
.news-wrap
  height 100%
  .van-sticky
    .news-nav-bar
      .van-tabs__wrap
        height 54px
        padding-right 35px
        background-color #fff
        .van-tab
          line-height 54px
          font-size: 15px
          font-weight 600
          color: $color-title
          &.van-tab--active
            font-size: 19px
    .more
      position absolute
      top 0
      right 0
      padding-right 10px
      width 25px
      height 54px
      text-align center
      box-shadow -0.1rem 0 1.5rem 0.5rem #fff
      .icon-more
        line-height 54px
        font-size 16px
  .content
    margin-bottom 49px
</style>
