<template>
<div id="download">
  <van-loading type="spinner" color="#007AFF" />
</div>
</template>

<script>
import Vue from 'vue'
import { Loading } from 'vant'

Vue.use(Loading)
export default {
  data () {
    return {

    }
  },
  computed: {
    isWeiXn () {
      let ua = window.navigator.userAgent.toLowerCase()
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {//eslint-disable-line
        return true
      } else {
        return false
      }
    },
    isPC () {
      var userAgentInfo = navigator.userAgent
      var Agents = ['Android', 'iPhone',
        'SymbianOS', 'Windows Phone',
        'iPad', 'iPod']
      var flag = true
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false
          break
        }
      }
      return flag
    }
  },
  created () {
    this.goDownload()
  },
  methods: {
    goDownload () {
      var u = navigator.userAgent
      // var app = navigator.appVersion
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      console.log(isAndroid, isIOS, this.isWeixn, this.isPC)
      // 这里是安卓浏览器
      if (isAndroid) {
        window.location.href = 'https://h5aigis.leadfintech.com/release/aigis-release.apk' // 跳安卓端下载地址
      }
      // 这里是iOS浏览器
      if (isIOS) {
        console.log('resss')
        window.location.href = 'http://itunes.apple.com/cn/app/id1475231419?mt=8' // 跳AppStore下载地址
      }

      // 是微信内部webView
      if (this.isWeixn) {
        alert('请点击右上角按钮, 点击使用浏览器打开')
      }

      // 是PC端
      if (this.isPC) {
        this.$router.push('/')
      }
    }
  }
}
</script>
<style lang="stylus">
#download
  position absolute
  top 50%
  left 50%
  transform translate(-50%, -50%)
</style>
