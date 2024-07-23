<template>
  <div
    class="my-2"
  >
    <vue-tags-input
      v-model="destinatarios"
      :validation="validation"
      :tags="tags"
      @tags-changed="newTags => tags = newTags"
    />
  </div>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input'

export default {
  components: {
    VueTagsInput
  },
  data() {
    return {
      tag: '',
      tags: [],
      validation: [
        {
          classes: 'min-length',
          rule: (tag) => tag.text.length !== 9
        }
      ]
    }
  }
}
</script>