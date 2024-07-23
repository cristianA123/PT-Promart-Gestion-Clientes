<template>
  <div>
    <v-icon color="red" class="mr-1 pb-0 mb-0">mdi-cloud-download-outline</v-icon>
    <a :href="path" style="text-decoration: none;">
      <v-btn  
        outlined
        color="red"
      >
        Descargar Formato
      </v-btn>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    path: {
      type: String,
      default: ''
    }
  }
}
</script>