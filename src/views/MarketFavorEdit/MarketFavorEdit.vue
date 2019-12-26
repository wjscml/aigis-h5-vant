<template>
<div class="myFavor-wrap">
  <van-nav-bar
    title="我的自选"
    left-text="返回"
    right-text="添加"
    fixed
    @click-left="hide"
    @click-right="goSearch"
  />
  <div class="edit-box">
    <div class="list-content">
      <van-checkbox-group v-model="result" @change="checkboxChange">
        <van-cell-group>
          <van-cell class="list-item" v-for="(item, index) in favorData" :key="index" :title="item.indicator_name" @click="toggle(index)">
            <span class="code">{{item.indicator_code}}</span>
            <van-checkbox :name="item.indicator_id" ref="checkboxes" slot="right-icon" />
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
    </div>
    <div class="delete-bar" @click="showConfirm" v-if="listId.length">
      <span class="icon-delete"></span>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getFavorIndicatorList } from '@/api'
import Vue from 'vue'
import { NavBar, Checkbox, CheckboxGroup, Cell, CellGroup, Dialog } from 'vant'

Vue.use(NavBar).use(Checkbox).use(CheckboxGroup).use(Cell).use(CellGroup).use(Dialog)
export default {
  data () {
    return {
      listId: [],
      result: [],
      favorData: []
    }
  },
  computed: {
    ...mapGetters([
      'loginState'
    ])
  },
  created () {
    if (!this.loginState || this.loginState.length === 0) {
      Dialog.confirm({
        title: '请先登录'
      }).then(() => {
        this.$router.push('/login')
      }).catch(() => {
        this.$router.push('/market')
      })
    } else {
      this.getFavorData()
    }
  },
  methods: {
    getFavorData () {
      getFavorIndicatorList({
        session: this.loginState.session
      }).then(res => {
        this.favorData = res
      })
    },
    toggle (index) {
      this.$refs.checkboxes[index].toggle()
    },
    checkboxChange (e) {
      // console.log(e)
      this.listId = e
    },
    showConfirm () {
      // this.$refs.comfirmWrap.openPopup()
      Dialog.confirm({
        message: '确定取消关注所选项？'
      }).then(() => {
        this.$emit('deleteAll', this.listId)
      }).catch(() => {

      })
    },
    goSearch () {
      this.$router.push({
        path: '/search'
      })
    },
    hide () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    }
  }
}
</script>

<style lang="stylus">
@import '~@/common/style/variable.styl'
@import '~@/common/style/mixin.styl'
.myFavor-wrap
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  background-color #fff
  z-index 100
  overflow auto
  .edit-box
    padding-top 46px
    margin-bottom 49px
    .list-content
      .list-item
        height 44px
        .van-cell__value
          text-align left
        .name
          font-size 15px
          color $color-sub-title
        .code
          font-size 12px
          color $color-light-span
    .delete-bar
      position fixed
      left 0
      bottom 0
      width 100%
      height 49px
      text-align: center
      background-color $color-blue
      .icon-delete
        line-height: 49px
        font-size: 24px
        color #fff
</style>
