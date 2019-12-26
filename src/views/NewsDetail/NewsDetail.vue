<template>
<div class="article-detail">
  <van-nav-bar
    title="新闻详情"
    fixed
    :left-arrow="true"
    @click-left="onClickLeft"
  />
  <article-detail type="_NEWS_" :articleData="articleData" :finished="finished" :favorite="favorite"
    @toggleFavorite="toggleFavorite"
  />
</div>
</template>

<script>
import { saveFavorite, deleteFavorite, loadFavorite } from '@/common/js/cache.js'
import { share } from '@/common/js/share.js'
import { mapGetters } from 'vuex'
import ArticleDetail from '@/components/ArticleDetail/ArticleDetail'
import { getNewsDetail } from '@/api'
import Vue from 'vue'
import { Toast } from 'vant'

Vue.use(Toast)
export default {
  data () {
    return {
      articleData: {},
      finished: false,
      favorite: null,
      favoriteList: (() => {
        return loadFavorite()
      })()
    }
  },
  computed: {
    ...mapGetters([
      'loginState'
    ])
  },
  created () {
    this.getContent()
  },
  methods: {
    getContent () {
      getNewsDetail({
        session: this.loginState.session,
        articleId: this.$route.params.id
      }).then(res => {
        if (res.errorMessage) {
          Toast.fail(res.errorMessage)
        } else {
          this.finished = true
          this.articleData = res
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
        deleteFavorite(this.articleData)
      } else {
        this.favorite = !this.favorite
        saveFavorite(this.articleData)
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
