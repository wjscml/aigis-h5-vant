<template>
<div class="article-detail">
  <van-nav-bar
    title="报告详情"
    fixed
    :left-arrow="true"
    @click-left="onClickLeft"
  />
  <article-detail type="_REPORTS_VIP_" :articleData="articleData" :finished="finished" :favorite="favorite"
    @toggleFavorite="toggleFavorite"
  />
</div>
</template>

<script>
import { saveFavoriteVip, deleteFavoriteVip, loadFavoriteVip } from '@/common/js/cache.js'
import { share } from '@/common/js/share.js'
import { mapGetters } from 'vuex'
import ArticleDetail from '@/components/ArticleDetail/ArticleDetail'
import { getReportContent } from '@/api'
import Vue from 'vue'
import { Dialog, Toast } from 'vant'

Vue.use(Dialog).use(Toast)

export default {
  data () {
    return {
      articleData: [],
      finished: false,
      favorite: null,
      favoriteList: (() => {
        return loadFavoriteVip()
      })()
    }
  },
  computed: {
    ...mapGetters([
      'loginState'
    ])
  },
  created () {
    if (!this.loginState || this.loginState.length === 0) {
      Dialog.confirm({
        title: '请先登录',
        message: '暂无权限查看'
      }).then(() => {
        this.$router.push('/login')
      }).catch(() => {
        this.$router.push('/report')
      })
    } else {
      this.getContent()
    }
  },
  methods: {
    getContent () {
      getReportContent({
        session: this.loginState.session,
        reportId: this.$route.params.id
      }).then(res => {
        if (res.length === 0) {
          Toast.fail('文章不存在')
        } else {
          this.articleData = res
          this.finished = true
          this.favorite = this.isFavorite()
          share(this.articleData)
        }
      })
    },
    isFavorite () {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === this.articleData.id
      })
      return index > -1
    },
    toggleFavorite () {
      if (this.favorite) {
        this.favorite = !this.favorite
        deleteFavoriteVip(this.articleData)
      } else {
        this.favorite = !this.favorite
        saveFavoriteVip(this.articleData)
      }
    },
    onClickLeft () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    }
  },
  components: {
    ArticleDetail
  }
}
</script>

<style lang="stylus">
.article-detail
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  background-color #fff
  z-index 100
  overflow auto
</style>
