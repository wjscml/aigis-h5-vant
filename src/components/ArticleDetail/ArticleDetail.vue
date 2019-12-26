<template>
<div>
  <div class="report-detail-wrap" v-if="type === '_REPORTS_'">
    <div class="main">
      <div class="report-info">
        <div class="title">{{articleData.title}}</div>
        <div class="info">
          <span>{{articleData.report_time || articleData.publish_time}}</span> · <span>{{articleData.author_name}}</span>
        </div>
      </div>
      <div class="report-content">
        <span class="pdf-tips">研报内容请查看附件</span>
        <div class="pdf-box" @click="openPdf(articleData.attach_url)">
          <span class="icon-pdf"></span>
          <span class="text">{{articleData.attach_name}}</span>
        </div>
        <div class="notice">免责声明：此信息由各大期货研究机构提供，与本产品立场无关。本产品不保证该信息的准确性、真实性、完整性、及时性、原创性等，不对您构成任何的投资建议，据此操作，风险自担。</div>
      </div>
    </div>
  </div>

  <div class="report-detail-wrap" v-if="show">
    <div class="main" v-show="finished">
      <div class="report-info">
        <div class="title">{{articleData.title}}</div>
        <div class="info">
          <span class="time">{{articleData.report_time || articleData.publish_time}}</span>
          <span>{{articleData.author_name || 'Aigis研究'}}</span>
          <div class="focus-btn" @click="toggleFavorite">
            <van-button size="mini" :plain="!favorite" :hairline="!favorite" type="info">{{favoriteText}}</van-button>
          </div>
        </div>
      </div>
      <div class="report-content" v-html="articleData.content"></div>
    </div>

    <div class="download-wrap">
      <div class="download-content">
        <img class="logo" src="./logo.png">
        <div class="text">
          <div class="title">Aigis</div>
          <div class="desc">埃癸斯风险控制系统</div>
        </div>
        <van-button type="info" size="small" url="/download">打开</van-button>
      </div>
    </div>
  </div>
  <!-- <div class="bgcover"></div> -->
</div>
</template>

<script>
import Vue from 'vue'
import { ImagePreview, Button, Divider } from 'vant'

Vue.use(ImagePreview).use(Button).use(Divider)
export default {
  props: {
    articleData: {},
    finished: Boolean,
    type: String,
    content: String,
    favorite: Boolean
  },
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
    openPdf (url) {
      window.open(url)
    },
    toggleFavorite () {
      this.$emit('toggleFavorite')
    }
  },
  computed: {
    show () {
      if (this.type === '_NEWS_') {
        return true
      }
      if (this.type === '_REPORTS_VIP_') {
        return true
      }
      return false
    },
    favoriteText () {
      return this.favorite ? '已收藏' : '收藏'
    }
  }
}
</script>

<style lang="stylus">
@import '~@/common/style/variable.styl'
@import '~@/common/style/mixin.styl'
.report-detail-wrap
  margin 46px 0
  background-color $color-white
  .main
    padding 0 15px
    .report-info
      padding 15px 0
      border-1px($color-line)
      .title
        margin-bottom: 24px
        line-height: 1.3
        font-size: 24px
        font-weight: 600
        color: $color-title
      .info
        position relative
        font-size 14px
        line-height 1
        color $color-light-text
        .time
          margin-right 10px
        .focus-btn
          position absolute
          right 0
          bottom 0
    .report-content
      padding 10px 0 20px
      line-height 1.7
      font-size 18px
      color $color-text
      .pdf-tips
        color $color-text
      .pdf-box
        margin-top 16px
        display flex
        align-items: center
        font-size 0
        .icon-pdf
          margin-right: 12px
          font-size: 28px
          color $color-red
        .text
          font-size 12px
          line-height 1.4
          color $color-blue
      .notice
        position fixed
        bottom 0
        left 0
        right 0
        padding 0 15px 20px
        font-size 12px
        color $color-light-text
      img
        width 100%
  .download-wrap
    position fixed
    bottom 0
    left 0
    right 0
    height 66px
    background-color #fff
    border-top 1px solid $color-line
    .download-content
      display flex
      align-items center
      margin 13px 15px
      .logo
        width 40px
        height 40px
      .text
        flex 1
        margin-left 10px
        .title
          color $color-title
        .desc
          font-size 12px
          color $color-text
.bgcover
  position fixed
  top 182px
  bottom 0
  left 0
  right 0
  background-color $color-white
  z-index -1
</style>
