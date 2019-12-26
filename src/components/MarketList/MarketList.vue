<template>
<div class="market-list">
  <van-sticky :offset-top="54">
    <sub-nav v-if="showNav" :navData="subNavData" :type="subType" @change="handleSelect" />
  </van-sticky>
  <van-pull-refresh v-model="isLoading" @refresh="refresh">
    <div class="list-content" v-if="listData.length">
      <div v-for="(item, index) in listData" :key="index" class="listItem" @click="goDetail(item)">
        <div class="item-name">
          <div class="name">{{item.name}}</div>
          <div class="code">{{item.code}}</div>
        </div>
        <div class="item-value">
          <div class="price">{{item.value.price}}</div>
          <div class="changePer" :class="item.value.change<0?'green':'red'">{{item.value.changePer}}</div>
        </div>
      </div>
    </div>
  </van-pull-refresh>
  <div class="market-no-result" v-if="!listData.length">
    <!-- <no-result ></no-result> -->
  </div>
</div>
</template>

<script>
import SubNav from '@/components/SubNav/SubNav'
// import NoResult from '@/components/noResult/noResult'
import Vue from 'vue'
import { Sticky, PullRefresh } from 'vant'

Vue.use(Sticky).use(PullRefresh)
export default {
  props: {
    listData: Array,
    subNavData: Array,
    subType: Number,
    showNav: Boolean
  },
  data () {
    return {
      isLoading: false
    }
  },
  methods: {
    finishRefresh () {
      this.isLoading = false
      console.log('is-disabled')
    },
    refresh () {
      this.$emit('refresh')
    },
    goDetail (detail) {
      this.$router.push('/site/market?name=' + detail.table_name + '&code=' + detail.id + '&description=' + detail.name + ':' + detail.code)
      // uni.navigateTo({
      //   url: '/pages/marketDetail/marketDetail?name=' + detail.table_name + '&code=' + detail.id + '&description=' + detail.name + ':' + detail.code
      // });
    },
    handleSelect (i) {
      this.$emit('handleSelect', i)
    }
  },
  components: {
    SubNav
  }
}
</script>

<style lang="stylus">
@import '~@/common/style/variable.styl'
@import '~@/common/style/mixin.styl'
.market-list
  .list-content
    padding 10px 15px
    background-color #fff
    .listItem
      display flex
      justify-content: space-between
      align-items: center
      height 60px
      .item-name
        .name
          margin-bottom: 2px
          font-size: 16px
          color $color-sub-title
        .code
          font-size: 12px
          color $color-light-text
      .item-value
        display flex
        align-items center
        .price
          margin-right 32px
          text-align right
          font-size: 16px
          color $color-sub-title
        .changePer
          width 75px
          height 28px
          line-height: 28px
          text-align: center
          font-size: 15px
          color #fff
          border-radius: 4px
          &.red
            background-color $color-red
          &.green
            background-color $color-green
  .market-no-result
    padding-top 20px
</style>
