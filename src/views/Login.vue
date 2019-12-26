<template>
<router-view/>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'loginState'
    ])
  },
  created () {
    if (!this.loginState || this.loginState.length === 0) {

    } else {
      this.$router.push('/')
    }
  },
  methods: {

  }
}
</script>
