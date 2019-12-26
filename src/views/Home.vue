<template>
  <div class="home">
    <van-tabbar route class="tabbar-wrap">
      <van-tabbar-item v-for="(item, index) in tabbarList" :key="index"
        :to="item.url"
      >
        <span>{{item.name}}</span>
        <!-- <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? item.icon.active : item.icon.normal"
        > -->
        <i slot="icon" :class="item.className" />
      </van-tabbar-item>
    </van-tabbar>
    <router-view/>
  </div>
</template>

<script>
import Vue from 'vue'
import { Tabbar, TabbarItem } from 'vant'

Vue.use(Tabbar).use(TabbarItem)
export default {
  name: 'home',
  data () {
    return {
      active: this.$route.path,
      tabbarList: [
        {
          url: '/',
          name: '新闻',
          className: 'icon-calendar'
        },
        {
          url: '/market',
          name: '行情',
          className: 'icon-market'
        },
        {
          url: '/report',
          name: '报告',
          className: 'icon-report'
        },
        {
          url: '/talk',
          name: '咨询',
          className: 'icon-news'
        },
        {
          url: '/user',
          name: '我的',
          className: 'icon-user'
        }
      ]
    }
  }
}
</script>
<style lang="stylus">
@import '~@/common/style/variable.styl'
@import '~@/common/style/mixin.styl'
.home
  height 100%
  .van-tabbar-item__icon
    margin-bottom 0
    font-size 26px
</style>
