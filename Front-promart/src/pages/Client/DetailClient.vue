<template>
  <div class="d-flex flex-column flex-grow-1">
      
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Detalle de cliente</div>
      </div>
      <v-spacer></v-spacer>
      <BtnToReload />
      <BackPage
        class="ml-2"
        to="client"
      />
    </div>
  
    <v-row>
      <v-col
        cols="12"
        xs="12"
        sm="12"
        lg="12"
      >
        <DetailShortUrlComponent/>
      </v-col>

    </v-row>
  
  </div>
</template>
  
<script>
  
import BackPage from '@/components/common/BackPage.vue'
import BtnToReload from '@/components/common/BtnToReload.vue'

import DetailShortUrlComponent from './components/DetailShortUrlComponent.vue'
  
export default {
  name:'DetailSmsReport',
  components:{
    DetailShortUrlComponent,
    BackPage,
    BtnToReload
  },
  data () {
    return {
      url: null
    }
  },
  computed:{
  
  },
  created() {
    this.existUrl()
  },
  mounted() {
    console.log(this.$route.params)
    this.url = this.$route.params.url
  },
  methods: {
    file_to_json () {
    },
    existUrl() {
      if (!this.$route.params.url) {
        this.$router.push({ name: 'client' })
      }
    }
   
  }
}
</script>
