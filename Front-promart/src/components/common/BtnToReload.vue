<template>
  <div>
    <v-btn
      outlined
      color="primary"
      class="ml-2"
      small
      @click="reoad"
    >
      <v-icon>
        mdi-reload
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false
    }
  },
  methods: {
    reoad() {
      window.location.reload()
    }
  }

}
</script>

<style>

</style>