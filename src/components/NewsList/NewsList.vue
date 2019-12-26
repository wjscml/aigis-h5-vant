<template>
<van-list class="news-list"
  v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"
>
  <div class="news-item-box" v-for="(item, index) in newsList" :key="index">
    <div class="news-item" @click="goDetail(item)">
      <div class="right">
        <div class="title">{{item.title}}</div>
        <div class="info">
          <span class="name">
            <span v-if="item.future_company">{{item.future_company}}</span>
            <span v-if="item.future_company" class="point">·</span>
            <span>{{item.author_name}}</span>
          </span>
          <span>{{item.publish_time || item.report_time}}</span>
        </div>
      </div>
      <van-image class="image" v-if="hasImg" width="120" height="120" lazy-load :src="item.thumb" fit="cover" />
    </div>
  </div>
  <!-- <div v-if="!hasData">
    <no-result />
  </div> -->
</van-list>
</template>

<script>
// import NoResult from '../NoResult/NoResult'
import Vue from 'vue'
import { Image, List, Lazyload } from 'vant'

Vue.use(Image).use(List).use(Lazyload, {
  error: 'assets/newsBg.png'
})
export default {
  props: {
    newsList: Array,
    finished: Boolean,
    hasImg: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  created () {
    // console.log(this.hasData)
  },
  methods: {
    loadingEnd () {
      this.loading = false
    },
    onLoad () {
      this.$emit('onLoad')
    },
    goDetail (item) {
      this.$emit('goDetail', item.id)
      this.$emit('getDetail', item)
    }
  }
}
</script>

<style lang="stylus">
@import '~@/common/style/variable.styl'
@import '~@/common/style/mixin.styl'
.news-list
  padding 16px 15px
  background-color $color-white
  .news-item-box
    margin 12px 0
    &:first-child
      margin 0
    &:last-child
      margin-bottom 0
    .news-item
      display flex
      padding 11px 16px
      box-shadow 0 0 12px 6px $color-shadow
      .image
        margin-left: 12px
      .right
        flex 1
        display flex
        flex-direction: column
        justify-content: space-between
        .title
          min-height 72px
          line-height: 24px
          font-size 18px
          color $color-sub-title
          display: -webkit-box
          -webkit-line-clamp: 3
          -webkit-box-orient: vertical
          overflow: hidden
        .info
          display flex
          justify-content: space-between
          margin-top 10px
          line-height: 16px
          font-size: 11px
          color $color-light-text
          .point
            margin 0 5px
          .name
            color $color-text
</style>
