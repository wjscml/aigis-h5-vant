<template>
<div class="search-bar">
  <div class="backBtn" @click="goBack"><span class="icon-back"></span></div>
  <div class="inputBox">
    <input type="text"
      placeholder="请输入商品代码"
      v-model="value"
    />
  </div>
  <span class="icon-dismiss" @click="clearValue" v-if="value"></span>
</div>
</template>

<script>
export default {
  data () {
    return {
      value: '',
      timeout: null
    }
  },
  methods: {
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    },
    clearValue () {
      this.value = ''
      this.$emit('search', this.value)
    },
    search (v) {
      if (this.value === v) {
        this.$emit('search', v)
      }
    }
  },
  watch: {
    value (curVal, oldVal) {
      // 实现input连续输入，只发一次请求
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.search(curVal)
      }, 300)
    }
  }
}
</script>

<style lang="stylus">
@import '~@/common/style/variable.styl'
@import '~@/common/style/mixin.styl'
.search-bar
  display flex
  align-items center
  height 44px
  padding 0 15px
  border-1px($color-line)
  background-color $color-white
  .inputBox
    margin-left 15px
    flex 1
    line-height: 15px
    font-size: 15px
    input
      color $color-sub-title
      border none
      outline none
  .icon-dismiss
    padding: 0 5px
    color $color-light-text
    font-size: 16px
  .backBtn
    extend-click()
    font-size 0
    .icon-back
      color $color-blue
      font-size: 16px

</style>
