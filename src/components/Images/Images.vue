<template>
  <van-image-preview
    v-model="show"
    :images="images"
    @change="onChange"
  >
    <template>第1页</template>
  </van-image-preview>
</template>
<script>
import Vue from 'vue'
import { ImgePreview, ImagePreview } from 'vant'

Vue.use(ImagePreview)
export default {
  props: {
    images: []
  },
  data () {
    return {
      show: false,
      index: 0
    }
  },
  methods: {
    onChange(index) {
      this.index = index
    }
  }
}
</script>
<style lang="stylus">

</style>
