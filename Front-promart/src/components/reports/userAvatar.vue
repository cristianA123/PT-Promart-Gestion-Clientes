<template>
  <div class="d-flex align-center py-1">
    <v-avatar
      color="primary"
      size="40"
    >
      <span class="white--text text-h6">{{ computedAvatarName }}</span>
    </v-avatar>
    <v-col v-if="detail" class="py-0 my-0">
      <v-row>
        <div class="ml-1 caption font-weight-bold">
          {{ user.name }}
        </div>
      </v-row>
      <v-row>
        <div class="ml-1 caption">
          {{ user.email }}
        </div>
      </v-row>
      <v-row>
        <div class="ml-1 caption">
          {{ user.company }}
        </div>
      </v-row>
    </v-col>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {}
    },
    detail: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    computedAvatarName : function () {
      let first = ''
      let second = ''
      let text = ''

      if (this.user && this.user.name.search(' ') !== -1) {
        const array = this.user.name.split(' ')

        if (array.length > 1) {
          first = array[0].slice(0, 1)
          second = array[1].slice(0, 1)

          text = first + second
        } else {
          first = array[0].slice(0, 1)

          text = first
        }
      } else {
        text = this.user.name.slice(0, 1)

      }

      return text.toUpperCase()
    }
  }
}
</script>
