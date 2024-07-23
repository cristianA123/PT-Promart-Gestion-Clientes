<template>
  <v-row
    class="justify-end"
  >
      <v-btn
        class="btn"
        :loading="$store.state.credits.isLoading"
      >
        {{ new Intl.NumberFormat().format($store.state.credits.availableCredits) }} Créditos
      </v-btn>
  </v-row>
</template>

<script>

export default {
  data() {
    return {
    }
  },
  mounted() {
    this.getAvailableCredits()
  },
  methods: {
    getAvailableCredits () {
      this.$store.dispatch('availableCredits')
    } 
  }
}
</script>