<template>
<div class="report-wrap">
  <van-sticky class="nav-bar">
    <div class="nav-bar-box">
      <div class="nav-content">
        <div v-for="(tab, index) in navList" :key="index"
          :class="['nav-tab', type==index ? 'active' : '']"
          @click="tapTab(index)"
        >{{tab.name}}</div>
      </div>
      <div class="plus-btn" v-show="type==1">
        <span class="icon-filter" @click="showPicker = true"></span>
        <van-popup v-model="showPicker" position="bottom">
          <van-datetime-picker
            v-model="currentDate"
            type="year-month"
            :formatter="formatter"
            :min-date="minDate"
            :max-date="maxDate"
            @cancel="cancel"
            @confirm="select"
          />
        </van-popup>
      </div>
    </div>
    <div class="normal-list-nav" v-show="type === 0">
      <sub-nav :navData="subNavData" :type="subType-1" @change="tapSubTab" ></sub-nav>
      <div class="more"><i class="icon-more" /></div>
    </div>
  </van-sticky>
  <div class="normal-list" v-show="type === 0">
    <van-pull-refresh v-model="isLoading" @refresh="tapTab(0)">
      <news-list ref="normalList" :hasImg="false" :newsList="list" :finished="finished"
        @getDetail="goDetail" @onLoad="getNormalReportData"
      ></news-list>
    </van-pull-refresh>
  </div>
  <div class="special-list" v-show="type === 1">
    <van-pull-refresh v-model="isLoading" @refresh="tapTab(1)">
      <news-list ref="specialList" :newsList="list" :finished="finished"
        @goDetail="goDetailSpecial" @onLoad="getSpecialReportData"
      ></news-list>
    </van-pull-refresh>
  </div>
  <router-view :articleData="reportContent" />
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import NewsList from '@/components/NewsList/NewsList'
import SubNav from '@/components/SubNav/SubNav'
import { getReportCategories, getReportList, getSpecialList } from '@/api'
import { formatDate } from '@/common/js/data.js'
import Vue from 'vue'
import { Toast, Popup, DatetimePicker, PullRefresh, Dialog, Sticky } from 'vant'

Vue.use(Toast).use(Popup).use(DatetimePicker).use(PullRefresh).use(Dialog).use(Sticky)
const LIMIT = 10
export default {
  data () {
    return {
      navList: [
        { name: '公开研报' },
        { name: '专享研报' }
      ],
      type: 0,
      list: [],
      listO: {},
      finished: false,
      isLoading: false,
      page1: 0,
      page2: 0,
      subType: 1,
      subNavData: [],
      showPicker: false,
      currentDate: new Date(),
      minDate: new Date(2019, 1),
      maxDate: new Date(),
      reportContent: {}
    }
  },
  computed: {
    ...mapGetters([
      'loginState'
    ])
  },
  created () {
    if (this.type === 0) {
      this.getSubNavData()
    }
  },
  methods: {
    cancel () {
      this.showPicker = false
    },
    select (value) {
      this.showPicker = false
      let date = formatDate(value)
      if (this.listO[date]) {
        let list = this.listO[date]
        this.list = list
      } else {
        this.list = []
        this.finished = true
        Toast(`没有 ${date} 的内容`)
      }
    },
    formatter (type, value) {
      if (type === 'year') {
        return `${value}年`
      } else if (type === 'month') {
        return `${value}月`
      }
      return value
    },
    tapTab (i) {
      this.isLoading = true
      this.finished = false
      this.list = []
      this.page1 = 0
      this.page2 = 0
      this.type = i
      this.getReportData(i)
      // uni.pageScrollTo({
      //   scrollTop: 0,
      //   duration: 100
      // })
    },
    tapSubTab (i) {
      this.isLoading = true
      this.finished = false
      this.list = []
      this.page1 = 0
      this.subType = i + 1
      this.getNormalReportData()
      // uni.pageScrollTo({
      //   scrollTop: 0,
      //   duration: 100
      // })
    },
    getReportData (type) {
      if (type === 0) {
        // this.getSubNavData()
        this.getNormalReportData()
      }
      if (type === 1) {
        this.getSpecialReportData()
      }
    },
    getNormalReportData () {
      // console.log(this.page1, this.subType)
      getReportList({
        page: this.page1,
        cateId: this.subType
      }).then(res => {
        this.isLoading = false
        this.$refs.normalList.loadingEnd()
        if (res && res.length !== 0) {
          this.page1 = this.page1 + 1
          // console.log('hasData', this.hasData)
          this.list = this.list.concat(res)
        } else {
          this.finished = true
        }
      })
    },
    getSpecialReportData () {
      if (!this.loginState || this.loginState.length === 0) {
        Dialog.confirm({
          title: '请先登录'
        }).then(() => {
          this.$router.push('/login')
        }).catch(() => {
          this.tapTab(0)
        })
      } else {
        getSpecialList({
          session: this.loginState.session,
          page: this.page2,
          limit: LIMIT
        }).then((res) => {
          this.isLoading = false
          this.$refs.specialList.loadingEnd()
          if (!res.length && res.length !== 0) {
            this.page2 = this.page2 + 1
            this.listO = Object.assign(this.listO, this.listO, res) // 对象合并 该方法有问题
            // 如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性
            // console.log(res)
            let list = []
            for (let i in res) {
              list = list.concat(res[i])
            }

            this.list = this.list.concat(list)
          } else {
            this.finished = true
          }
        })
      }
    },
    getSubNavData () {
      getReportCategories().then(res => {
        let subNavData = []
        for (let i in res) {
          let o = {}
          o.name = res[i]
          o.cateId = i
          subNavData.push(o)
        }
        this.subNavData = subNavData
      })
    },
    goDetail (e) {
      console.log(e)
      this.reportContent = e
      this.$router.push('/report/site')
    },
    goDetailSpecial (e) {
      this.$router.push({
        path: `/report/special/${e}`
      })
    }
  },
  components: {
    NewsList,
    SubNav
  }
}
</script>

<style lang="stylus">
@import '~@/common/style/variable.styl'
@import '~@/common/style/mixin.styl'
.report-wrap
  .nav-bar
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
          margin 0 20px
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
        .icon-filter
          padding-right 15px
          font-size 24px
          color $color-blue
        .date-picker
          position absolute
          top 0
          width 100%
          height 100%
    .normal-list-nav
      .more
        position absolute
        top 0
        right 0
        padding-right 10px
        width 25px
        height 54px
        text-align center
        .icon-more
          line-height 54px
          font-size 16px
  .special-list
    margin-bottom 49px
  .normal-list
    margin-bottom 49px
</style>
