<template>
<div class="login-wrap" >
  <div class="login-title">
    <span class="title">登录</span>
    <span class="back" @click="goBack">返回</span>
  </div>
  <ValidationObserver ref="form" class="login-form">
    <div class="input-list">
      <!-- <input type="number" name="username" placeholder="请输入手机号码" /> -->
      <ValidationProvider
        name="username" rules="required|mobile" v-slot="{ errors }"
      >
        <van-field v-model="username" placeholder="请输入手机号码" :error-message="errors[0]" />
      </ValidationProvider>
    </div>
    <div class="input-list">
      <!-- <input password="true" name="password" placeholder="请输入密码" /> -->
      <ValidationProvider
        name="password" rules="required|min:6" v-slot="{ errors }"
      >
        <van-field type="password" v-model="password" placeholder="请输入密码" :error-message="errors[0]" />
      </ValidationProvider>
    </div>
    <div class="login-submit">
      <van-button class="submit-btn" type="info" size="large" color="rgb(0, 122, 255)"
        @click="formSubmit"
      >登 录</van-button>
      <div class="login-info">
        <span class="link" @click="goMobile">验证码登录</span>
        <span class="link" @click="goForget">忘记密码</span>
      </div>
    </div>
  </ValidationObserver>
</div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { getLogin } from '@/api/index.js'
import { mapActions } from 'vuex'
import Vue from 'vue'
import { Button, Field, Toast } from 'vant'

Vue.use(Button).use(Field).use(Toast)

export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  created () {
  },
  methods: {
    formSubmit () {
      this.$refs.form.validate().then(res => {
        if (res) {
          this.login({
            mobileNumber: this.username,
            password: this.password
          })
        }
      })
    },
    login (params) {
      getLogin(params).then(res => {
        if (!res.errorMessage) {
          Toast.success('成功登录！')
          this.saveLoginState(res)
          this.$router.push('/')
        } else {
          Toast.fail(res.errorMessage)
        }
      })
    },
    goMobile () {
      this.$router.push('/login/mobile')
    },
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/user')
    },
    goForget () {
      this.$router.push({
        path: '/user/forget'
      })
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
  height 100%
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
      margin-bottom 20px
      border-1px($color-dark-line)
      .van-cell
        padding-top 0
        padding-bottom 0
        input
          height 54px
          font-size 19px
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
