<template>
<div class="edit-wrap">
  <van-nav-bar
    title="问题咨询"
    left-arrow
    fixed
    @click-left="onClickLeft"
  />
  <div class="content-wrap">
    <textarea class="text-box"
      autofocus
      placeholder="请输入您要咨询的问题..."
      v-model="content"
    />

    <van-uploader v-model="imgList" multiple :max-count="9"
      :before-read="beforeRead"
    />
  </div>
  <div class="submit-btn" v-if="content!==''">
    <van-button type="primary" size="large" color="#007AFF" @click="send" >发 送</van-button>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { submitQuestion } from '@/api'
import Vue from 'vue'
import { NavBar, Button, Uploader, Dialog, Toast } from 'vant'

Vue.use(NavBar).use(Button).use(Uploader).use(Dialog).use(Toast)
export default {
  data () {
    return {
      imgList: [],
      content: ''
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
        this.$router.push('/')
      })
    }
  },
  methods: {
    beforeRead (file) {
      if (file.size > 2097152) {
        Toast.fail('请上传小于2M的图片')
        return false
      }
      return true
    },
    send () {
      if (this.content !== '') {
        Dialog.confirm({
          title: '是否提交问题？'
        }).then(() => {
          this.submit()
        }).catch(() => {

        })
      } else {
        Toast.fail('内容不能为空')
      }
    },
    submit () {
      let formData = new FormData()
      formData.append('session', this.loginState.session)
      formData.append('content', this.content)
      this.imgList.map(item => {
        return formData.append('image[]', item.file)
      })
      submitQuestion(formData).then(res => {
        if (!res.errorCode) {
          Toast.success('提交成功，请等待回复')
          setTimeout(() => {
            this.$router.push('/talk')
          }, 2000)
        }
      })
    },
    onClickLeft () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    }
  }
}
</script>

<style lang="stylus">
@import '~@/common/style/variable.styl'
.edit-wrap
  display flex
  flex-direction column
  box-sizing border-box
  padding-top 46px
  height 100%
  background-color #FFF
  .text-box
    border none
    outline none
    margin 20px 0
    width 100%
    height 120px
    font-size 15px
    color $color-text
    overflow scroll
  .content-wrap
    flex 1
    padding 0 24px
    .van-uploader
      .van-uploader__preview
        .van-uploader__preview-image
          width 96px
          height 96px
      .van-uploader__upload
        width 96px
        height 96px
  .submit-btn

    margin 20px 24px
</style>
