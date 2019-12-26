<template>
<div class="marketDetail">
  <div class="name-wrap">
    <div class="info">
      <span class="name">{{name}}</span>
      <span class="description">{{description}}</span>
    </div>
    <div class="focus">
      <van-button v-show="!favor" size="small" @click="addFocus">关注</van-button>
      <van-button v-show="favor" size="small" type="primary" color="#007AFF" @click="clearFocus">已关注</van-button>
    </div>
  </div>
  <div class="lastData-wrap">
    <span class="price">{{valueData[0].price}}</span>
    <span class="change" :class="getColor(valueData[0].change)">{{valueData[0].change}}</span>
    <span class="changePer" :class="getColor(valueData[0].change)">{{valueData[0].changePer}}</span>
  </div>
  <charts-box :code="code" :description="description" :currentPrice="valueData[0].price"></charts-box>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { loadMarketFavor } from '../../common/js/cache.js'
import ChartsBox from '@/components/ChartsBox/ChartsBox.vue'
import { addFavorIndicator } from '@/api'
import WebSocketClass from '@/api/socket.js'
import { toDecimal, toPercent } from '@/common/js/data.js'
import Vue from 'vue'
import Viser from 'viser-vue'
import { Button, Toast } from 'vant'

Vue.use(Viser).use(Button).use(Toast)

var socket = null
export default {
  data () {
    return {
      code: '',
      tableName: '',
      description: '',
      name: '',
      isFirst: true,
      valueData: [{
        price: '',
        high: '',
        low: '',
        open: '',
        change: '',
        changePer: ''
      }],
      favor: (() => {
        return loadMarketFavor()
      })()
    }
  },
  computed: {
    ...mapGetters([
      'loginState'
    ])
  },
  created () {
    let options = this.$route.query
    this.code = Number(options.code)
    this.tableName = options.name
    let splitData = options.description.split(/[:/]/)
    this.name = splitData[0]
    this.description = splitData[1]

    this.$emit('titleValue', splitData[0])

    this.refresh()
  },
  destroyed () {
    // console.log('关闭')
    socket.closeMyself()
  },
  methods: {
    getColor (value) {
      if (value > 0) {
        return 'red'
      }
      if (value < 0) {
        return 'green'
      }
      return ''
    },
    refresh () {
      this.isFirst = true
      this.sendSocketData()
    },
    sendSocketData () {
      socket = new WebSocketClass('markets', [this.tableName], this.getConfigResult)
      socket.connect()
    },
    getConfigResult (res) {
      if (res.length) {
        let valueData = res.map(item => {
          if (item !== '--') {
            return {
              price: toDecimal(item[0]),
              high: toDecimal(item[1]),
              low: toDecimal(item[2]),
              open: toDecimal(item[3]),
              change: toDecimal(item[6]),
              changePer: toPercent(item[7])
            }
          }
          return '--'
        })

        if (this.isFirst) {
          this.isFirst = false
          this.valueData = valueData
        } else {
          if (valueData[0] !== '--') {
            this.valueData = valueData
          }
        }
      }
    },
    addFocus () {
      addFavorIndicator({
        indicatorId: this.code,
        session: this.loginState.session,
        action: 1
      }).then(res => {
        if (res.favor === 1) {
          this.favor = true
          Toast.success('关注成功')
        }
      })
    },
    clearFocus () {
      addFavorIndicator({
        indicatorId: this.code,
        session: this.loginState.session,
        action: 2
      }).then(res => {
        if (res.favor === 2) {
          this.favor = false
        }
      })
    }
  },
  components: {
    ChartsBox
  }
}
</script>

<style lang="stylus">
@import '~@/common/style/variable.styl'
.marketDetail
  height 100%
  display: flex
  flex-direction: column
  padding 0 15px
  background-color #fff
  .name-wrap
    margin-top 66px
    display flex
    align-items center
    .info
      flex 1
      .name
        margin-right 15px
        font-size 19px
        font-weight 600
        color $color-sub-title
      .description
        font-size 16px
        color $color-light-text
  .lastData-wrap
    margin 10px 0 30px
    display flex
    align-items baseline
    justify-content space-between
    font-weight 600
    .price
      font-size 32px
    .change,.changePer
      font-size 16px
      line-height 32px
    .red
      color $color-red
    .green
      color $color-green
</style>
