<template>
<div class="message-wrap">
  <van-nav-bar
    title="消息中心"
    :left-arrow="true"
    @click-left="onClickLeft"
  />
</div>
</template>

<script>
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
