<template>
<div class="myFavor-wrap" v-if="showMyFavor">
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
import Vue from 'vue'
import { NavBar, Checkbox, CheckboxGroup, Cell, CellGroup, Dialog } from 'vant'

Vue.use(NavBar).use(Checkbox).use(CheckboxGroup).use(Cell).use(CellGroup).use(Dialog)
export default {
  props: {
    favorData: Array
  },
  data () {
    return {
      showMyFavor: null,
      listId: [],
      result: []
    }
  },
  created () {

  },
  methods: {
    toggle (index) {
      this.$refs.checkboxes[index].toggle()
    },
    show () {
      this.showMyFavor = true
    },
    hide () {
      this.showMyFavor = false
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
  left 0
  right 0
  bottom 0
  background-color $color-white
  z-index: 101
  .edit-box
    padding-top 46px
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
      position absolute
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
