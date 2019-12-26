<template>
<div class="setting-wrap">
  <van-nav-bar
    title="设置"
    :left-arrow="true"
    @click-left="onClickLeft"
  />
  <div class="setting-list-wrap">
    <div class="list-item" @click="goAbout">
      <img src="./icon_setting_about@3x.png" alt="" />
      <span class="text">关于我们</span>
      <span class="icon-right"></span>
    </div>
    <div class="list-item" @click="confirm" v-if="loginState && loginState.length !== 0">
      <img src="./icon_setting_exit@3x.png" alt="" />
      <span class="text">退出登录</span>
      <span class="icon-right"></span>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Vue from 'vue'
import { Dialog } from 'vant'

Vue.use(Dialog)
export default {
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'loginState'
    ])
  },
  methods: {
    confirm () {
      Dialog.confirm({
        title: '是否确认要退出？'
      }).then(() => {
        // getApp().globalData.userInfo = []
        this.clearLoginState()
        this.$router.push('/user')
      })
    },
    onClickLeft () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    },
    goAbout () {
      this.$router.push('/user/about')
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
.setting-wrap
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  background-color #fff
  z-index 100
  .setting-list-wrap
    padding 0 22px
    .list-item
      display flex
      align-items center
      padding 15px 0
      height 52px
      line-height: 0
      border-1px($color-line)
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
