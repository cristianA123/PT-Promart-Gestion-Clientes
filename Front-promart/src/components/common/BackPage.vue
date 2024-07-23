<template>
  <div class="d-flex align-center">
    <v-btn
      class="mx-0 px-0 text"
      text
      :loading="isLoading"
      @click="backTo()"
    >
      <v-icon>mdi-chevron-left</v-icon> Regresar
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      default: ''
    } 
  },
  data() {
    return {
      isLoading: false
    }
  },
  mounted() {
    this.isLoading = false
  },
  methods: {
    backTo() {
      this.$router.push({ name: this.to })
      this.isLoading = true
    }
  }
}
</script>
