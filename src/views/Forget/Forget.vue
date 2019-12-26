<template>
<div class="forget-wrap" >
  <van-nav-bar
    title="找回登录密码"
    :left-arrow="true"
    @click-left="onClickLeft"
  />
  <div class="login-form">
    <ValidationObserver ref="form" v-show="step===0">
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
          @click="next"
        >下一步</van-button>
      </div>
    </ValidationObserver>

    <ValidationObserver ref="submitForm" v-show="step===1">
      <div class="title">请设置一个新密码</div>
      <div class="input-list">
        <ValidationProvider
          name="password" rules="required" v-slot="{ errors }"
        >
          <van-field v-model="password" placeholder="请设置8-16位（数字+字母）" :error-message="errors[0]" />
        </ValidationProvider>
      </div>
      <div class="login-submit">
        <van-button class="submit-btn" type="info" size="large" color="rgb(0, 122, 255)"
          @click="submit"
        >保存新密码</van-button>
        <div class="login-info">
          <span class="link" @click="goBack">上一步</span>
        </div>
      </div>
    </ValidationObserver>
  </div>
</div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { getForget, getMobileCode } from '@/api/index.js'
import { MD5 } from '../../common/js/md5.js'
import { mapActions } from 'vuex'
import Vue from 'vue'
import { Button, Field, Toast } from 'vant'

Vue.use(Button).use(Field).use(Toast)

const NUM_FORGET = 3
const KEY = 'slkdjf8wekk12sdksldfl12dljdsk'
const TIME_COUNT = 60
export default {
  data () {
    return {
      username: '',
      code: '',
      password: '',
      sendText: '获取验证码',
      count: 60,
      isSendCode: false,
      step: 0
    }
  },
  methods: {
    next () {
      this.$refs.form.validate().then(res => {
        if (res) {
          this.step = 1
        }
      })
    },
    send () {
      this.$refs.usernameBox.validate().then(res => {
        if (res) {
          let sysTime = (Date.parse(new Date()) / 1000).toString()
          let mobileNumber = this.username
          let secretStr = MD5(`${KEY}${mobileNumber}${sysTime}${NUM_FORGET}`)
          getMobileCode({
            mobileNumber: mobileNumber,
            timestamp: sysTime,
            usage: NUM_FORGET
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
    submit () {
      this.$refs.submitForm.validate().then(res => {
        console.log(res)
        if (res) {
          getForget({
            mobileNumber: this.username,
            mobileCode: this.code,
            password: this.password
          }).then(res => {
            console.log(res)
            if (!res.errorMessage) {
              Toast.success('密码修改成功！')
              this.saveLoginState(res)
              this.$router.push('/')
            } else {
              Toast.fail(res.errorMessage)
              if (res.errorCode === '1') {
                setTimeout(() => {
                  this.step = 0
                }, 2500)
              }
            }
          })
        }
      })
    },
    goBack () {
      this.step = 0
    },
    goLogin () {
      this.$router.push('/login')
    },
    goMarket () {
      this.$router.push('/market')
    },
    goForget () {
      this.$router.push('/user/forget')
    },
    onClickLeft () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
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
.forget-wrap
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  background-color #fff
  z-index 100
  .login-form
    margin 79px 42px 0
    .title
      margin-bottom 54px
      line-height 19px
      font-size 19px
      color $color-text
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
