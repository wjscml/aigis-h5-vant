<template>
<div class="answer-detail-wrap">
  <div class="main">
    <div class="content-wrap">
      <div class="time">
        <img class="icon-time" src="./icon_point.png" alt="icon_point" />
        <span>{{mainData.date}} {{mainData.time}}</span>
      </div>
      <div class="text">
        {{  mainData.content }}
        <div class="images-content" v-if="mainData.images && mainData.images.length == 1">
          <van-image class="picOne"
            :src="mainData.images[0].image"
            fit="cover"
            @click="goImgDetail(mainData.images)"
          />
        </div>
        <div class="images-content" v-if="mainData.images && mainData.images.length > 1">
          <van-image class="pic"
            v-for="(image, index) in mainData.images" :key="index"
            :src="image.image"
            fit="cover"
            @click="goImgDetail(mainData.images)"
          />
        </div>
      </div>
    </div>
    <div class="qusetion-wrap" v-if="mainData.ask">
      <div class="title">
        <img class="icon-time" src="./icon_point.png" alt="icon_point" />
        <span>咨询问题</span>
      </div>
      <div class="text">
        {{mainData.ask.content}}
      </div>
      <div class="time">{{mainData.ask.date}} {{mainData.ask.time}}</div>
    </div>
  </div>
</div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getPostContent } from '@/api'
import Vue from 'vue'
import { Image, ImagePreview } from 'vant'

Vue.use(Image).use(ImagePreview)
export default {
  data () {
    return {
      mainData: {}
    }
  },
  computed: {
    ...mapGetters([
      'loginState'
    ])
  },
  created () {
    this.$emit('titleValue', '咨询详情')
    this.getContent()
  },
  methods: {
    onClickRight () {
      console.log('ClickRight')
    },
    getContent () {
      getPostContent({
        session: this.loginState.session,
        postId: this.$route.params.id
      }).then(res => {
        this.mainData = res
      })
    },
    goImgDetail (e) {
      let images = e.map(item => (
        item.image
      ))
      ImagePreview(images)
    }
  }
}
</script>
<style lang="stylus">
@import '~@/common/style/variable.styl'
.answer-detail-wrap
  height 100%
  display: flex
  flex-direction: column
  .main
    margin-top 46px
    .content-wrap
      margin-bottom 15px
      padding 0 15px 14px
      background-color #fff
      .time
        padding 20px 0
        display flex
        align-items center
        height 12px
        font-size: 12px
        line-height: 0
        color $color-blue
        .icon-time
          margin-right 15px
          width: 7px
          height 7px
      .text
        margin-left: 22px
        line-height: 24px
        font-size 16px
        color $color-text
        .images-content
          display flex
          flex-wrap wrap
          .pic
            font-size 0
            margin-top 12px
            margin-right: 12px
            background: no-repeat center
            background-size cover
            width: 94px
            height: 94px
            &:nth-child(3),&:nth-child(6)
              margin-right: 0
          .picOne
            font-size 0
            margin-top 13px
            background: no-repeat center
            background-size cover
            width 211px
            height 211px
    .qusetion-wrap
      padding 0 15px 14px
      background-color #fff
      .title
        padding 20px 0
        display flex
        align-items center
        height 12px
        font-size: 12px
        line-height: 0
        color $color-blue
        .icon-time
          margin-right 15px
          width: 7px
          height 7px
      .text
        margin-left 22px
        margin-bottom 14px
        line-height: 21px
        font-size: 14px
        color $color-text
      .time
        margin-left 22px
        height 12px
        font-size: 12px
        color $color-light-text
</style>
