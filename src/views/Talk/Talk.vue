<template>
  <div class="index-wrap">
    <van-sticky class="index-top">
      <div class="nav-bar">
        <span class="icon icon-message" @click="goMessage"></span>
        <div class="search-box" @click="goSearch">
          <span class="icon-search"></span>
        </div>
        <span class="icon icon-edit" @click="goEdit"></span>
      </div>
      <div class="van-hairline--top"></div>
    </van-sticky>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list class="index-list" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div v-for="(items, indexs) in indexList" :key="indexs">
          <div class="column-wrap">
            <span class="date">{{items[0].date}}</span>
            <router-link :to='`/site/message/${item.id}`' tag="div" class="content"
              v-for="(item, index) in items" :key="index"
            >
              <div class="time">
                <img class="icon-time" src="./icon_point.png" alt="" />
                <span>{{item.time}}</span>
              </div>
              <div class="text" :class="{'text-b': item.ask_time}">
                <span class="tips" v-if="item.ask_time">—— Aigis【回复】</span>
                <span>{{item.content}}</span>
                <div class="images-content" v-if="item.images.length == 1">
                  <div class="picOne"
                    v-lazy:background-image="item.images[0].image"
                    @click.stop="goImgDetail(item.images)"
                  ></div>
                </div>
                <div class="images-content" v-if="item.images.length > 1">
                  <div class="pic" v-for="(image, i) in item.images" :key="i"
                    v-lazy:background-image="image.image"
                    @click.stop="goImgDetail(item.images)"
                  ></div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { getPostList } from '@/api'
import Vue from 'vue'
import { List, ImagePreview, Lazyload, PullRefresh, Dialog, Sticky } from 'vant'

Vue.use(List).use(ImagePreview).use(Lazyload).use(PullRefresh).use(Dialog).use(Sticky)

export default {
  data () {
    return {
      originList: [],
      indexList: [],
      page: 0,
      isLoading: false,
      loading: false,
      finished: false
    }
  },
  computed: {
    ...mapGetters([
      'loginState'
    ])
  },
  created () {
    // console.log(this.loginState)
    if (!this.loginState || this.loginState.length === 0) {
      Dialog.confirm({
        title: '请先登录'
      }).then(() => {
        this.$router.push('/login')
      }).catch(() => {

      })
    }
  },
  methods: {
    onRefresh () {
      this.page = 0
      this.originList = []
      this.indexList = []
      this.onLoad()
    },
    onLoad () {
      getPostList({
        session: this.loginState.session,
        page: this.page,
        isShowLoading: false
      }).then(res => {
        this.loading = false
        this.isLoading = false
        if (res.length) {
          this.page = this.page + 1
          this.originList = this.originList.concat(res)
          this.indexList = this.formatDate(this.originList)
        } else {
          this.finished = true
        }
      })
    },
    formatDate (res) {
      let dateO = res.map(item => {
        return item.date
      })
      // 返回去重之后的数组
      let date = []
      dateO.forEach(item => {
        !(date.indexOf(item) > -1) && date.push(item)
      })

      let list = []
      date.forEach(dateItem => {
        list.push(res.filter(item => {
          return item.date === dateItem
        }))
      })
      return list
    },
    goMessage () {
      this.$router.push('/user/message')
    },
    goEdit () {
      console.log('edit')
      if (!this.loginState || this.loginState.length === 0) {
        Dialog.confirm({
          title: '请先登录'
        }).then(() => {
          this.$router.push('/login')
        }).catch(() => {

        })
      } else {
        this.$router.push('/edit')
      }
    },
    goSearch () {
      // uni.navigateTo({
      //   url: '/pages/search/search'
      // });
      this.$router.push({
        path: '/search'
      })
    },
    goImgDetail (e) {
      let images = e.map(item => (
        item.image
      ))
      ImagePreview(images)
    },
    ...mapActions([
      'clearLoginState'
    ])
  }
}
</script>
<style lang="stylus">
@import '~@/common/style/variable.styl'
@import '~@/common/style/mixin.styl'
.index-wrap
  height 100%
  .index-top
    background-color $color-white
    .nav-bar
      display: flex
      align-items: center
      justify-content: space-between
      height 54px
      padding 0 15px
      background-color $color-white
      .icon
        font-size 24px
        color $color-blue
      .search-box
        flex 1
        display: flex;
        align-items: center;
        height 24px
        margin 0 24px
        border-radius 12px
        background-color $color-background
        .icon-search
          margin-left 12px
          color $color-light-span
  .index-list
    padding-bottom 50px
    .column-wrap
      position relative
      margin-top 44px
      padding 0 15px
      background-color $color-white
      .date
        position absolute
        left 0
        top -33px
        width: 60px
        height 22px
        line-height 22px
        text-align: center
        font-size: 12px
        background-color $color-blue
        color $color-white
      .content
        &:last-child
          .text
            border-1px(#fff)
        .time
          padding 15px 0
          display flex
          align-items center
          height 12px
          font-size: 12px
          color $color-light-text
          .icon-time
            margin-right 15px
            width: 7px
            height 7px
        .text
          padding-bottom 15px
          margin-left: 22px
          line-height: 21px
          font-size: 14px
          color $color-text
          border-1px($color-line)
          &.text-b
            font-weight 600
          .tips
            color $color-light-text
          .ask-time
            font-weight: normal
          .images-content
            display flex
            flex-wrap wrap
            .pic
              margin-top 12px
              margin-right: 12px
              background: no-repeat center
              background-size cover
              width: calc((100% / 3) - 8px)
              height: 0
              padding-top calc((100% / 3) - 8px)
              &:nth-child(3),&:nth-child(6)
                margin-right: 0
            .picOne
              margin-top 13px
              background: no-repeat center
              background-size cover
              width calc((200% / 3) - 13px)
              height 0
              padding-top calc((200% / 3) - 13px)

</style>
