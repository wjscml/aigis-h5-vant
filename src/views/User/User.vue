<template>
<div class="user-wrap">
  <div class="user-info-wrap">
    <div class="info">
      <div class="image" @click="goUserInfo">
        <img :src="userInfo.avatar" alt="" />
      </div>
      <div class="name" @click="goUserInfo">
        <span class="title">{{userInfo.nickname}}</span>
        <span class="icon-vip" :class="{'vip': userInfo.certificateType}"></span>
      </div>
    </div>
    <div class="background">
      <img :src="userInfo.avatar" alt="" />
      <div class="cover"></div>
    </div>
  </div>
  <div class="user-list-wrap">
    <div class="card">
      <div class="card-part line" >
        <div class="card-part-item" @click="goMessage">
          <img src="./icon_user_messege@3x.png" alt="" />
          <span class="text">消息中心</span>
          <span class="icon-right"></span>
        </div>
        <div class="card-part-item" @click="goCollect">
          <img src="./icon_user_draft@3x.png" alt="" />
          <span class="text">我的收藏</span>
          <span class="icon-right"></span>
        </div>
        <div class="card-part-item" @click="goForget">
          <img src="./icon_user_forget@3x.png" alt="" />
          <span class="text">修改密码</span>
          <span class="icon-right"></span>
        </div>
      </div>
      <div class="card-part" >
        <div class="card-part-item" @click="goSetting">
          <img src="./icon_user_setting@3x.png" alt="" />
          <span class="text">设置</span>
          <span class="icon-right"></span>
        </div>
      </div>
    </div>
    <div class="background"></div>
  </div>
  <router-view />
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'
import { Dialog } from 'vant'

Vue.use(Dialog)
export default {
  data () {
    return {
      userInfo: {
        nickname: '未登录',
        avatar: './assets/image/avatar.png'
      }
    }
  },
  computed: {
    ...mapGetters([
      'loginState'
    ])
  },
  created () {
    if (this.loginState && this.loginState.length !== 0) {
      this.userInfo = this.loginState
    }
  },
  methods: {
    goSetting () {
      this.$router.push('/user/setting')
    },
    goForget () {
      this.$router.push('/user/forget')
    },
    goCollect () {
      if (this.loginState && this.loginState.length !== 0) {
        this.$router.push('/user/collect')
      } else {
        Dialog.confirm({
          title: '请先登录'
        }).then(() => {
          this.$router.push('/login')
        })
      }
    },
    goMessage () {
      if (this.loginState && this.loginState.length !== 0) {
        this.$router.push('/user/message')
      } else {
        Dialog.confirm({
          title: '请先登录'
        }).then(() => {
          this.$router.push('/login')
        })
      }
    },
    goUserInfo () {
      if (this.loginState && this.loginState.length !== 0) {
        this.$router.push('/user/info')
      } else {
        this.$router.push('/login')
      }
    }
  },
  watch: {
    $route (now, old) {
      if (now.path === '/user') {
        if (this.loginState && this.loginState.length !== 0) {
          this.userInfo = this.loginState
        } else {
          this.userInfo = {
            nickname: '未登录',
            avatar: './assets/image/avatar.png'
          }
        }
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~@/common/style/variable.styl'
@import '~@/common/style/mixin.styl'
.user-wrap
  .user-info-wrap
    position relative
    height: 165px
    .info
      padding-top 41px
      margin-left 22px
      display flex
      font-size 0
      .image
        margin-right: 17px
        img
          width: 68px
          height 68px
          outline none
          border none
          border-radius: 34px
      .name
        display flex
        flex-direction column
        line-height: 0
        .title
          line-height: 34px
          font-size: 22px
          color #fff
        .icon-vip
          line-height 34px
          font-size 27px
          color $color-line
          &.vip
            color $color-red
    .background
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      z-index -1
      filter blur(10px)
      img
        width 100%
        height 100%
      .cover
        position absolute
        top 0
        bottom 0
        left 0
        right 0
        background-image linear-gradient(rgba(229,2529,229,0.2), rgba(50,50,50,0.4), rgba(20,20,20,0.7))
  .user-list-wrap
    position relative
    .background
      position fixed
      top 300px
      bottom 0
      left 0
      right 0
      background-color #fff
      z-index -1
    .card
      position absolute
      top -15px
      width 100%
      border-radius: 15px
      background-color #fff
      .card-part
        margin-top: 15px
        padding-bottom: 15px
        &.line
          border-1px($color-line)
        .card-part-item
          padding 0 22px
          display flex
          align-items center
          height 52px
          line-height: 0
          img
            width: 22px
            height 22px
          .text
            flex 1
            margin-left: 16px
            font-size: 16px
            font-weight: 600
            color $color-sub-title
          .icon-right
            font-size: 20px
            color $color-light-text
</style>
