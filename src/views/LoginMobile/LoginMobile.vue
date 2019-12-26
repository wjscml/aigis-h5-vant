<template>
<div class="login-wrap" >
  <div class="login-title">
    <span class="title">登录</span>
    <span class="back" @click="goBack">返回</span>
  </div>
  <ValidationObserver ref="form" class="login-form">
    <div class="input-list">
      <ValidationObserver ref="usernameBox">
      <ValidationProvider
        name="username" rules="required|mobile" v-slot="{ errors }"
      >
        <van-field v-model="username" placeholder="请输入手机号码" :error-message="errors[0]" />
      </ValidationProvider>
      </ValidationObserver>
    </div>
    <div class="input-list">
      <ValidationProvider
        name="code" rules="required" v-slot="{ errors }"
      >
        <van-field v-model="code" placeholder="请输入短信验证码" :error-message="errors[0]" />
      </ValidationProvider>
      <div class="send" @click="send" v-if="!isSendCode">{{sendText}}</div>
      <div class="count" v-if="isSendCode">{{count + 's'}}</div>
    </div>
    <div class="login-submit">
      <van-button class="submit-btn" type="info" size="large" color="rgb(0, 122, 255)"
        @click="formSubmit"
      >登 录</van-button>
      <div class="login-info">
        <span class="link" @click="goLogin">密码登录</span>
        <span class="link" @click="goForget">忘记密码</span>
      </div>
    </div>
  </ValidationObserver>
</div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { getLoginByMobileCode, getMobileCode } from '@/api/index.js'
import { MD5 } from '../../common/js/md5.js'
import { mapActions } from 'vuex'
import Vue from 'vue'
import { Button, Field, Toast } from 'vant'

Vue.use(Button).use(Field).use(Toast)

const NUM_LOGIN = 2
const KEY = 'slkdjf8wekk12sdksldfl12dljdsk'
const TIME_COUNT = 60
export default {
  data () {
    return {
      username: '',
      code: '',
      sendText: '发送验证码',
      count: 60,
      isSendCode: false
    }
  },
  methods: {
    send () {
      this.$refs.usernameBox.validate().then(res => {
        if (res) {
          let sysTime = (Date.parse(new Date()) / 1000).toString()
          let mobileNumber = this.username
          let secretStr = MD5(`${KEY}${mobileNumber}${sysTime}${NUM_LOGIN}`)
          getMobileCode({
            mobileNumber: mobileNumber,
            timestamp: sysTime,
            usage: NUM_LOGIN
          }, secretStr).then(res => {
            if (res.errorMessage) {
              Toast.fail(res.errorMessage)
            } else {
              Toast.success(res)
              if (!this.timer) {
                this.count = TIME_COUNT
                this.isSendCode = true
                this.timer = setInterval(() => {
                  if (this.count > 0 && this.count <= TIME_COUNT) {
                    this.count--
                  } else {
                    this.isSendCode = false
                    clearInterval(this.timer)
                    this.timer = null
                    this.sendText = '重新发送'
                  }
                }, 1000)
              }
            }
          })
        }
      })
    },
    formSubmit () {
      this.$refs.form.validate().then(res => {
        console.log(res)
        if (res) {
          this.login()
        }
      })
    },
    login () {
      let sysTime = (Date.parse(new Date()) / 1000).toString()
      let mobileNumber = this.username
      let mobileCode = this.code
      let secretStr = MD5(`${KEY}${mobileCode}${mobileNumber}${sysTime}`)
      // console.log('login')
      getLoginByMobileCode({
        mobileNumber: mobileNumber,
        mobileCode: mobileCode,
        timestamp: sysTime
      }, secretStr).then(res => {
        if (res) {
          if (!res.errorMessage) {
            this.saveLoginState(res)
            Toast.success('成功登录！')
            this.$router.push('/')
          } else {
            Toast.fail(res.errorMessage)
          }
        }
      })
    },
    goLogin () {
      this.$router.push('/login/main')
    },
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/user')
    },
    goForget () {
      this.$router.push('/user/forget')
    },
    ...mapActions([
      'saveLoginState'
    ])
  },
  components: {
    ValidationProvider,
    ValidationObserver
  }
}
</script>

<style lang="stylus">
@import "~@/common/style/variable.styl"
@import "~@/common/style/mixin.styl"
.login-wrap
  padding 0 42px
  background-color #fff
  .login-title
    display flex
    justify-content space-between
    height 28px
    padding 54px 0
    color $color-title
    .title
      line-height 28px
      font-size: 28px
      font-weight: 600
    .back
      margin-top 14px
      line-height 14px
      font-size: 14px
      color $color-text
  .login-form
    .input-list
      position relative
      margin-bottom 20px
      border-1px($color-dark-line)
      .van-cell
        padding-top 0
        padding-bottom 0
        input
          height 54px
          font-size 19px
      .send
        position absolute
        right 6px
        bottom 20px
        line-height: 14px
        font-size: 14px
        color $color-blue
      .count
        position absolute
        right 6px
        bottom 20px
        line-height: 14px
        font-size: 14px
        color $color-text
    .login-submit
      margin-top 54px
      .submit-btn
        margin-bottom: 25px
        height 44px
        line-height 44px
        font-size 18px
      .login-info
        display flex
        justify-content: space-between
        padding 0 6px
        color $color-text
        .link
          line-height: 14px
          font-size: 14px
          color $color-text
</style>
