<template>
  <v-row
    class="mb-4"
  >
    <v-icon
      class="ml-3 mr-1"
    >
      mdi-cloud-upload-outline</v-icon>
    <v-card
      width="93%"
      :class="{ 'grey lighten-2': dragover }"
      outlined
      @click="click()"
      @drop.prevent="onDrop($event)"
      @dragover.prevent="dragover = true"
      @dragenter.prevent="dragover = true"
      @dragleave.prevent="dragover = false" 
    >
      <v-card-text>
        <v-file-input
          id="file_input"
          v-model="uploadedFiles" 
          :rules="[v=>!!v || 'Excel']"
          style="display:none"
          outlined
          @change="onDrop()"
        />
          
        {{ uploadedFiles !== null ? uploadedFiles.name : 'Arrastrar o dar click aquí para cargar su archivo.' }}

      </v-card-text>
    </v-card>
  </v-row>
</template>

<script>
export default {
  name: 'Upload',
  props: {
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dragover: false,
      uploadedFiles: null
    }
  },
  methods: {
    closeDialog() {
      // Remove all the uploaded files
      this.uploadedFiles = []
      // Close the dialog box
      this.$emit('update:dialog', false)
    },
    removeFile(fileName) {
      // Find the index of the
      const index = this.uploadedFiles.findIndex(
        (file) => file.name === fileName
      )
      // If file is in uploaded files remove it

      if (index > -1) {
        this.uploadedFiles.splice(index, 1)
      }
    },
    onDrop(e) {

      if (e) {
        this.uploadedFiles = e.dataTransfer.files[0]
      }
      
      this.dragover = false

      if (this.uploadedFiles.length > 0) this.uploadedFiles = []

      //this.uploadedFiles[0].push(element)
      
    },
    submit() {
      // If there aren't any files to be uploaded throw error
      if (!this.uploadedFiles.length > 0) {
        this.$store.dispatch('addNotification', {
          message: 'There are no files to upload',
          colour: 'error'
        })
      } else {
        // Send uploaded files to parent component
        this.$emit('filesUploaded', this.uploadedFiles)
        // Close the dialog box
        this.closeDialog()
      }
    },
    click() {
      document.getElementById('file_input').click()
    }
  }
}
</script>