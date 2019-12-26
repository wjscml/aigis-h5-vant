<template>
<div class="message-wrap">
  <van-nav-bar
    title="关于我们"
    :left-arrow="true"
    @click-left="onClickLeft"
  />
  <van-divider>
    山东第八识信息技术有限公司<br>
    Email：alaya@leadfintech.com<br>
  </van-divider>
  <van-divider>©2018 aigis.leadfintech 京ICP备12019798号</van-divider>
</div>
</template>

<script>
import Vue from 'vue'
import { Divider } from 'vant'

Vue.use(Divider)
export default {
  data () {
    return {

    }
  },
  methods: {
    onClickLeft () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    }
  }
}
</script>

<style lang="stylus">
@import '~@/common/style/variable.styl'
@import '~@/common/style/mixin.styl'
.message-wrap
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  background-color #fff
  z-index 100
</style>
