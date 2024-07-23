<template>
  <div>
    <v-card 
      color="light-blue darken-4"
      dark
    >
      <v-card-title>Cliente:</v-card-title>
      <v-card-text>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>NOMBRE:</v-list-item-title>
            <v-list-item-subtitle>{{ getName }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>APELLIDO:</v-list-item-title>
            <v-list-item-subtitle>{{ getLastName }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>ESTADO:</v-list-item-title>
            <v-list-item-subtitle>{{ getState }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>CUMPLEAÑOS:</v-list-item-title>
            <v-list-item-subtitle>{{ getBrithday }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>EMAIL:</v-list-item-title>
            <v-list-item-subtitle>{{ getEmail }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>FECHA CREACION:</v-list-item-title>
            <v-list-item-subtitle>{{ getcreated }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
    </v-card>

    <v-form
      ref="formUpdatedState"
      lazzy-validation
      @submit.prevent="submit"
    >
      <v-card class="mt-2">
        <v-card-title>Cliente:</v-card-title>
        <v-card-text>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Cambiar Estado:</v-list-item-title>
              <v-combobox
                v-model="state"
                label="Estado del cliente"
                :rules="[v => !!v || 'Estado del cliente es obligatorio']"
                :items="filteredStates"
              ></v-combobox>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            type="submit"
            :loading="isLoading"
          >
            Actualizar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>

<script>
import BackendApi from '@/services/backend.service'
import moment from 'moment'

moment.locale('es')
const ClientState = {
  PROSPECTO: 'PROSPECTO',
  ACTIVO: 'ACTIVO',
  INACTIVO: 'INACTIVO',
  BLOQUEADO: 'BLOQUEADO'
}

const validTransitions = {
  [ClientState.PROSPECTO]: [ClientState.ACTIVO],
  [ClientState.ACTIVO]: [ClientState.INACTIVO],
  [ClientState.INACTIVO]: [ClientState.ACTIVO, ClientState.BLOQUEADO],
  [ClientState.BLOQUEADO]: [ClientState.ACTIVO]
}

export default {
  data () {
    return {
      client: null,
      state: '',
      isLoading: false
    }
  },
  computed: {
    getName () {
      return this.client?.name || ''
    },
    getLastName () {
      if (!this.client) return ''
      const { firstName = '', lastName = '' } = this.client

      return `${firstName} ${lastName}`.trim()
    },
    getState () {
      return this.client?.state || ''
    },
    getBrithday () {
      return this.client?.birthDay || ''
    },
    getEmail () {
      return this.client?.email || ''
    },
    getcreated () {
      return moment(this.client?.created_at).format('Y-M-D H:M:S') || ''
    },
    isAdmin () {
      return $cookies.get('user').role
    },
    filteredStates() {
      const isAdmin = this.isAdmin === 'ADMIN'
      const currentState = this.client?.state

      if (!currentState) return []

      if (currentState === ClientState.BLOQUEADO && !isAdmin) {
        return []
      }

      return validTransitions[currentState] || []
    }
  },
  created() {
    this.getDetailUrl()
  },
  methods: {
    getDetailUrl() {
      BackendApi.get('/client/' + this.$route.params.id).then(({ data }) => {
        if (data.success) {
          this.client = data.data.client
          this.state = this.client.state
          console.log(this.client)
        }
      }).catch((error) => {
      })
    },
    canTransition(currentState, newState, isAdmin = false) {
      if (currentState === ClientState.BLOQUEADO && !isAdmin) {
        return false
      }

      return validTransitions[currentState]?.includes(newState) || false
    },
    submit () {
      console.log('rrr')
      if (this.$refs.formUpdatedState.validate()) {
        console.log('222')
        this.isLoading = true
        const payload = {
          newState: this.state,
          clientId: this.client.id
        }
  
        BackendApi.post('/client/change-state', payload)
          .then((response) => {
            if (response.data.success) {
              this.client.state = this.state
              this.isLoading = false
              this.$store.dispatch('app/showSuccess', response.data.message)
            }
          })
          .catch( (error) => {
            this.errors = error.response.data.errors
            this.isLoading = false
          } )
      }
    }
  }
}
</script>

<style>

</style>
