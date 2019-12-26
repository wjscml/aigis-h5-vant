<template>
<div class="market-wrap">
  <van-sticky class="market-nav-bar">
    <div class="nav-bar-box">
      <div class="nav-content">
        <div v-for="(tab, index) in marketNav" :key="index"
          :class="['nav-tab', type==index ? 'active' : '']"
          @click="change(index)"
        >{{tab.name}}</div>
      </div>
      <div class="plus-btn">
        <span class="edit" v-if="type==3" @click="goFavor">编辑</span>
        <span class="icon-search" @click="goSearch"></span>
      </div>
    </div>
  </van-sticky>
  <div class="market-main">
    <market-list ref="marketList"
      :listData="listData" :subNavData="subNavData" :subType="subType" :showNav="showNav"
      @handleSelect="subNavChange" @refresh="refresh"
    ></market-list>
    <!-- <market-favor ref="myFavor" :favorData="favorData" @deleteAll="deleteAll"></market-favor> -->
  </div>
  <router-view :favorData="favorData" @deleteAll="deleteAll" />
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import MarketList from '@/components/MarketList/MarketList'
// import MarketFavor from '@/components/MarketFavor/MarketFavor'

import { getIndicators, addFavorIndicator, getFavorIndicatorList } from '@/api'
import WebSocketClass from '@/api/socket.js'
import { toDecimal, toPercent } from '@/common/js/data.js'
// import { addClass, removeClass } from '@/common/js/dom.js'
import Vue from 'vue'
import { Sticky, Dialog } from 'vant'

Vue.use(Sticky).use(Dialog)

var socket = null
export default {
  data () {
    return {
      type: 0,
      subType: 0,
      marketNav: [],
      subNavData: [],
      originData: [],
      favorData: [],
      isFirst: true,
      listData: [],
      isLoading: null
    }
  },
  computed: {
    ...mapGetters([
      'loginState'
    ]),
    showNav () {
      if (this.type === 3) {
        return false
      }
      return true
    }
  },
  created () {
    // console.log('show')
    this.onload()
  },
  destroyed () {
    socket.closeMyself()
  },
  methods: {
    refresh () {
      socket.closeMyself()
      this.isFirst = true
      this._getIndicators()
      this.$refs.marketList.finishRefresh()
    },
    onload () {
      this.isFirst = true
      this._getIndicators()
    },
    _getIndicators () {
      this.isLoading = true
      if (!this.originData.length) {
        // console.log('fisrt')
        getIndicators().then(res => {
          let marketNav = []
          marketNav = res.map(item => ({
            name: item.cateName
          }))
          marketNav.push({ name: '自选' })

          this.marketNav = marketNav

          let originData = res.map(items => {
            if (!items.exchange) {
              return {
                indicators: items.indicators
              }
            }
            return {
              exchange: items.exchange,
              indicators: items.indicators.map(item => ({
                indicator_id: item.id,
                indicator_name: item.indicator_name,
                indicator_code: item.indicator_code,
                table_name: item.table_name,
                favor: item.favor,
                exchange_id: item.exchange_id
              }))
            }
          })
          this.originData = originData
          this._getMarketsData(this.type, this.subType)
        })
      } else {
        // console.log('notfisrt')
        this._getMarketsData(this.type, this.subType)
      }
    },
    _getMarketsData (type, subType) {
      if (type < 3) {
        let nameData = this.originData[type]
        let subNavData = []
        let addTypeAll = [{ exchange_code: '全部' }]
        subNavData = addTypeAll.concat(nameData.exchange)
        this.subNavData = subNavData

        let exchangeNameData = []
        for (let a in nameData.exchange) {
          exchangeNameData[a] = []
          for (let b in nameData.indicators) {
            if (nameData.exchange[a].id === nameData.indicators[b].exchange_id) {
              exchangeNameData[a].push(nameData.indicators[b])
            }
          }
        }
        exchangeNameData.unshift(nameData.indicators)
        // this.nameData = exchangeNameData[this.subType]
        this.sendSocketData(exchangeNameData[subType])
        this.nameData = exchangeNameData[subType]
      } else {
        if (!this.loginState || this.loginState.length === 0) {
          Dialog.confirm({
            title: '请先登录'
          }).then(() => {
            this.$router.push('/login')
          }).catch(() => {
            this.change(0)
          })
        } else {
          getFavorIndicatorList({
            session: this.loginState.session,
            isShowLoading: false
          }).then(res => {
            let favorData = res
            this.favorData = favorData
            this.sendSocketData(favorData)
            this.nameData = favorData
            this.subNavData = []
          })
        }
      }
    },
    sendSocketData (data) {
      if (data.length !== 0) {
        var agentData = []
        agentData = data.map(item => (
          item.table_name
        ))
        // console.log(agentData)
        socket = new WebSocketClass('markets', agentData, this.getConfigResult)
        socket.connect()
      } else {
        this.listData = []
        this.isLoading = false
      }
    },
    getConfigResult (res) {
      // console.log(res)
      if (res.length) {
        let valueData = res.map(item => {
          if (item !== '--') {
            return ({
              price: toDecimal(item[0]),
              high: toDecimal(item[1]),
              low: toDecimal(item[2]),
              open: toDecimal(item[3]),
              change: toDecimal(item[6]),
              changePer: toPercent(item[7])
            })
          }
          return '--'
        })
        if (this.isFirst) {
          this.isFirst = false
          let listData = []
          for (let n in this.nameData) {
            listData.push({
              table_name: this.nameData[n].table_name,
              name: this.nameData[n].indicator_name,
              code: this.nameData[n].indicator_code,
              id: this.nameData[n].indicator_id,
              favor: this.nameData[n].favor,
              value: valueData[n]
            })
          }
          this.listData = listData
        } else {
          let listData = this.listData
          for (let n in this.nameData) {
            if (valueData[n] !== '--') {
              listData[n].value = valueData[n]
              this.listData = listData
            }
          }
        }
        this.isLoading = false
      }
    },
    change (i) {
      this.listData = []
      socket.closeMyself()
      this.type = i
      this.subType = 0
      this.isFirst = true
      this._getMarketsData(i, 0)
      // document.documentElement.scrollTop = 0
    },
    subNavChange (i) {
      this.listData = []
      socket.closeMyself()
      this.subType = i
      this.isFirst = true
      this._getMarketsData(this.type, i)
      // document.documentElement.scrollTop = 0
    },
    goSearch () {
      this.$router.push({
        path: '/search'
      })
    },
    goFavor () {
      socket.closeMyself()
      // this.$refs.myFavor.show()
      this.$router.push('/market/edit')
    },
    deleteAll (ids) {
      ids.forEach(id => {
        addFavorIndicator({
          indicatorId: id,
          session: this.loginState.session,
          action: 2
        }).then(res => {
          this.refresh()
          // this.$refs.myFavor.hide()
        })
      })
    }
  },
  components: {
    MarketList
  }
}
</script>

<style lang="stylus">
@import '~@/common/style/variable.styl'
@import '~@/common/style/mixin.styl'
.market-wrap
  .market-nav-bar
    .nav-bar-box
      display flex
      align-items center
      justify-content space-between
      background-color $color-white
      border-1px($color-line)
      .nav-content
        line-height 54px
        height 54px
        font-size 0
        .nav-tab
          margin 0 15px
          display: inline-block
          text-align: center
          font-size: 15px
          font-weight 600
          color: $color-title
          &.active
            font-size: 19px
            border-2px($color-blue)
      .plus-btn
        position relative
        display flex
        align-items center
        .icon-search
          padding 0 15px 0 10px
          font-size 24px
          color $color-blue
        .edit
          padding 0 10px 0 15px
          font-size 15px
          color $color-light-span
  .market-main
    margin-bottom 49px
</style>
