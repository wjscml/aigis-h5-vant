<template>
<van-tabs class="market-sub-nav"
  v-model="type" @click="tapTab"
  line-height="0" color="#f5f5f5"
  background="#f5f5f5"  title-active-color="rgb(0, 122, 255)"
>
  <van-tab v-for="(tab, index) in navData" :key="index"
    :title="tab.name||tab.exchange_code"
  ></van-tab>
</van-tabs>
</template>

<script>
import Vue from 'vue'
import { Tab, Tabs } from 'vant'

Vue.use(Tab).use(Tabs)
export default {
  props: {
    navData: Array
  },
  data () {
    return {
      type: 0
    }
  },
  methods: {
    tapTab (name) {
      this.$emit('change', name)
    }
  }
}
</script>

<style lang="stylus" scoped>
.van-tab
  span
    font-size: 12px
.van-tab--active
  span
    font-size: 15px
    font-weight 600
</style>
