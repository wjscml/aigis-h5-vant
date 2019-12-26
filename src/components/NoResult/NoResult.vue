<template>
<div class="no-result-wrapper">
  <span class="icon-no_result"></span>
  <div class="text">{{tips}}</div>
</div>
</template>

<script>
export default {
  props: {
    tips: {
      type: String,
      default: '没有数据.'
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="stylus">
@import '~@/common/style/variable.styl'
.no-result-wrapper
  text-align center
  color $color-light-text
  .icon-no_result
    font-size 100px
  .text
    font-size 15px
    color $color-light-text
</style>
