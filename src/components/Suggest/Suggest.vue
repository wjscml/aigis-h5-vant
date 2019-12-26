<template>
<div class="suggest-wrap" v-if="query!==''">
  <div v-show="hasLoading" class="loading-box"><van-loading /></div>
  <div class="suggest-column" v-for="(item, index) in searchData" :key="index">
    <span class="name" @click="goDetail(item)">{{item.description}}</span>
    <span class="code" @click="goDetail(item)">{{item.symbol}}</span>
    <span class="icon-round_check" v-if="item.favor"></span>
    <span class="icon-round_add" v-if="!item.favor" @click="showConfirm(item, index)"></span>
  </div>
  <div v-if="!searchData.length">
    <no-result tips="没有符合您搜索条件的商品品种代码." ></no-result>
  </div>
</div>
</template>

<script>
import NoResult from '@/components/NoResult/NoResult'
// import Loading from '@/components/loading/loading'
// import Confirm from '@/components/confirm/confirm'
import { saveSearch, saveMarketFavor } from '../../common/js/cache.js'
import Vue from 'vue'
import { Loading, Dialog } from 'vant'

Vue.use(Loading)
export default {
  props: {
    searchData: Array,
    query: String,
    hasLoading: Boolean
  },
  data () {
    return {
      text: '是否加入自选列表？'
    }
  },
  methods: {
    showConfirm (item, index) {
      let userInfoLen = 1 // getApp().globalData.userInfo.length
      if (userInfoLen !== 0) {
        let param = { item, index }
        Dialog.confirm({
          message: `是否将 ${item.cn_name} 加入自选列表？`
        }).then(() => {
          this.addFavor(param)
        }).catch(() => {

        })
      } else {
        Dialog.confirm({
          title: '请您先登录'
        }).then(() => {
          this.$router.push({
            path: '/login'
          })
        }).catch(() => {

        })
      }
    },
    addFavor (param) {
      this.$emit('addFavor', param)
    },
    goDetail (item) {
      console.log(item)
      let detail = {
        table_name: item.symbol,
        id: item.indicator_id,
        name: item.description,
        code: item.symbol
      }
      saveSearch(detail)
      saveMarketFavor(item.favor)
      this.$router.push({
        path: '/site/market?name=' + detail.table_name + '&code=' + detail.id + '&description=' + detail.name + ':' + detail.code
      })
    }
  },
  components: {
    NoResult
  }
}
</script>

<style lang="stylus">
@import '~@/common/style/variable.styl'
.suggest-wrap
  background-color $color-white
  position fixed
  top 44px
  bottom 0
  left 0
  right 0
  overflow auto
  padding 15px 40px
  .loading-box
    text-align center
  .suggest-column
    display flex
    align-items: center
    height 40px
    .name
      margin-right: 20px
      font-size: 15px
      color $color-sub-title
    .code
      flex 1
      font-size: 12px
      color $color-light-text
    .icon-round_check
      font-size: 20px
      color $color-light-text
    .icon-round_add
      font-size: 20px
      color $color-blue
</style>
