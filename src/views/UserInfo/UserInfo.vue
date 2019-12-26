<template>
<div class="userInfo-wrap">
  <van-nav-bar
    title="修改个人信息"
    :left-arrow="true"
    @click-left="onClickLeft"
  />
  <van-uploader class="avatar-wrap" preview-image :before-read="beforeRead" :after-read="afterRead">
    <div class="avatar-box">
      <van-image class="avatar" :src="loginState.avatar" fit="cover" />
      <img class="camera" src="./btn_avatar@3x.png" />
    </div>
  </van-uploader>
  <div class="name-column" @click="openPopup">
    <span class="item">昵称</span>
    <span class="value">{{loginState.nickname}}</span>
  </div>
  <van-dialog
    v-model="show"
    title="编辑昵称"
    show-cancel-button
    @confirm="submitName"
  >
    <van-field class="confirm-text" v-model="nickname" clearable />
  </van-dialog>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { changeUserInfo } from '@/api'
import { getLength } from '@/common/js/data.js'
import Vue from 'vue'
import { Image, Dialog, Field, Toast, Uploader } from 'vant'

Vue.use(Image).use(Dialog).use(Field).use(Toast).use(Uploader)
export default {
  data () {
    return {
      nickname: '',
      show: false
    }
  },
  computed: {
    ...mapGetters([
      'loginState'
    ])
  },
  created () {
    console.log(this.loginState)
    this.nickname = this.loginState.nickname
  },
  methods: {
    beforeRead (file) {
      if (file.size > 2097152) {
        Toast.fail('请上传小于2M的图片')
        return false
      }
      return true
    },
    afterRead (file) {
      console.log(file)
      let userParam = new FormData()
      userParam.append('session', this.loginState.session)
      userParam.append('User[avatar]', file.file)
      changeUserInfo(userParam).then(res => {
        console.log(res)
        if (!res.errorMessage) {
          let userInfo = res
          userInfo.session = this.loginState.session
          this.saveLoginState(userInfo)
          Toast.success('修改成功')
        } else {
          Toast.fail(res.errorMessage.avatar)
        }
      })
    },
    submitName () {
      if (getLength(this.nickname) < 21) {
        let userParam = new FormData()
        userParam.append('session', this.loginState.session)
        userParam.append('nickname', this.nickname)
        changeUserInfo(userParam).then(res => {
          // console.log(res)
          if (!res.errorMessage) {
            let userInfo = res
            userInfo.session = this.loginState.session
            this.saveLoginState(userInfo)
            Toast.success('修改成功')
          } else {
            Toast.fail(res.errorMessage)
          }
        })
      } else {
        Toast.fail('昵称不要超过20个字符')
      }
    },
    openPopup () {
      this.nickname = this.loginState.nickname
      this.show = true
    },
    onClickLeft () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    },
    ...mapActions([
      'saveLoginState'
    ])
  }
}
</script>

<style lang="stylus">
@import '~@/common/style/variable.styl'
@import '~@/common/style/mixin.styl'
.userInfo-wrap
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  background-color #f5f5f5
  z-index 100
  .avatar-wrap
    margin 40px 0
    display flex
    justify-content: center
    .avatar-box
      position relative
      width: 110px
      height 110px
      border-radius 55px
      background-color #fff
      .avatar
        img
          width: 110px
          height 110px
          border-radius 55px
      .camera
        position absolute
        right 0
        bottom 0
        width: 30px
        height 30px
  .name-column
    display flex
    align-items center
    justify-content space-between
    padding 0 15px
    height 52px
    background-color #fff
    .item
      color $color-sub-title
    .value
      color $color-light-text
  .van-dialog
    .confirm-text
      padding 20px
      line-height 24px
      font-size 19px
      color $color-text
</style>
