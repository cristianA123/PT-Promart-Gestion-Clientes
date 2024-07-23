<template>
  <v-row 
    justify="center"
  >
    <v-col cols="9" lg="3">
      <v-icon size="200" color="#a8a8a8">{{ icon }}</v-icon>
      <p style="color: #a8a8a8">
        {{ text }}
      </p>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    }
  }
}
</script>