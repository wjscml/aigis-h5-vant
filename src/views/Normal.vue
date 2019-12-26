<template>
<div class="normal">
  <van-nav-bar
    :title="title"
    left-text=""
    :right-text="rightText"
    fixed
    :left-arrow="true"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  />
  <router-view
    @titleValue="titleValue"
    @rightValue="rightValue"
    ref="childView"
  />
</div>
</template>

<script>
import Vue from 'vue'
import { NavBar } from 'vant'

Vue.use(NavBar)
export default {
  name: 'normal',
  data () {
    return {
      title: '',
      rightText: ''
    }
  },
  methods: {
    titleValue (value) {
      this.title = value
    },
    rightValue (value) {
      this.rightText = value
    },
    onClickLeft () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    },
    onClickRight () {
      this.$refs.childView.onClickRight()
    }
  }
}
</script>
<style lang="stylus">
.normal
  height 100%
  .van-nav-bar__title
    font-weight 600
</style>
