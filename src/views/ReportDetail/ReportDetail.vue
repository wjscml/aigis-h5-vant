<template>
<div class="article-detail">
  <van-nav-bar
    title="报告详情"
    fixed
    :left-arrow="true"
    @click-left="onClickLeft"
  />
  <article-detail type="_REPORTS_" :articleData="articleData"></article-detail>
</div>
</template>

<script>
import { share } from '@/common/js/share.js'
import { mapGetters } from 'vuex'
import ArticleDetail from '@/components/ArticleDetail/ArticleDetail'

export default {
  props: {
    articleData: {}
  },
  computed: {
    ...mapGetters([
      'loginState'
    ])
  },
  created () {
    share(this.articleData)
  },
  methods: {
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
