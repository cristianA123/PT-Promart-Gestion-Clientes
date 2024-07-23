<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-form
        ref="formUploadFile"
        lazzy-validation
        @submit.prevent="submit"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ isEdit ? "Editar Cliente corta" : "Crear Cliente corta" }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="name"
                    label="Nombre del Cliente"
                    :rules="[v => !!v || 'Nombre es obligatorio']"
                    :error-messages="isValidName"
                  ></v-text-field>
                  <v-text-field
                    v-model="firstName"
                    label="Apellido Paterno"
                    :rules="[v => !!v || 'Apellido Paterno es obligatorio']"
                    :error-messages="isValidName"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="lastName"
                    label="Apellido Materno"
                    :error-messages="isValidName"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="email"
                    label="Correo Electrónico"
                    :rules="[
                      v => !!v || 'Correo Electrónico es obligatorio',
                      v => /.+@.+\..+/.test(v) || 'Email no es válido'
                    ]"
                    :error-messages="isValidName"
                    required
                  ></v-text-field>
                  <v-dialog
                    ref="dialogStart"
                    v-model="modelBirthDay"
                    :return-value.sync="dateStart"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="dateStart"
                        append-icon="mdi-calendar-start"
                        class="flex-grow-1 mr-md-2"
                        label="Fecha Nacimiento"
                        outlined
                        readonly
                        dense
                        clearable
                        placeholder="Fecha Nacimiento"
                        v-bind="attrs"
                        :rules="[
                          (v) => !!v || 'Fecha de Nacimiento es obligatoria', 
                          (v) => isValidDate(v) || 'La fecha no es válida', 
                          (v) => isNotFutureDate(v) || 'La fecha no puede estar en el futuro',
                          (v) => isAtLeast18YearsOld(v) || 'Debes tener al menos 18 años'
                        ]"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker 
                      v-model="dateStart" 
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="modelBirthDay = false">Cancelar</v-btn>
                      <v-btn text color="primary" @click="saveDateStart()" >OK</v-btn>
                    </v-date-picker>
                  </v-dialog>
                  <v-combobox
                    v-model="state"
                    label="Estado del cliente"
                    :rules="[v => !!v || 'Estado del cliente es obligatorio']"
                    :items="['ACTIVO', 'PROSPECTO', 'INACTIVO', 'BLOQUEADO']"
                  ></v-combobox>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="close()"
            >
              Cerrar
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              type="submit"
              :loading="isLoading"
            >
              {{ isEdit ? "Editar" : "Crear" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-row>
</template>

<script>

import BackendApi from '@/services/backend.service'

export default {
  props: {
  },
  data: () => ({
    errors: {
      long_url:'',
      name:''
    },
    isLoading: false,
    item : null,
    name : '',
    firstName: '',
    lastName: '',
    email: '',
    dateStart: null,
    state: '',
    birthDay: '',
    modelBirthDay: false,
    maxDateStart: null,
    url: '',
    dialog: false
  }),
  computed: {
    isEdit: function () {
      return this.item === undefined ? false : true
    },
    isValidName: function () {
      return this.errors.name === undefined ? '' : this.errors.name[0]
    },
    isValidUrl: function () {
      return this.errors.long_url === undefined ? '' : this.errors.long_url[0]
    }
  },
  methods: {
    open(item) {
      this.item = item
      console.log(this.item)
      if ( this.isEdit ) {
        this.name = item.name
        this.firstName = item.firstName
        this.lastName = item.lastName
        this.email = item.email
        this.dateStart = item.birthDay
        this.state = item.state
      } else {
        this.name = null
        this.url = null
      }
      this.dialog = true
    },
    close () {
      this.$refs.formUploadFile.reset()
      this.isLoading = false
      this.dialog = false
      this.$emit('onDialogCreateFinish')
    },
    isValidDate(date) {
      return !isNaN(Date.parse(date))
    },
    isAtLeast18YearsOld(date) {
      const today = new Date()
      const birthDate = new Date(date)
      let age = today.getFullYear() - birthDate.getFullYear()
      const month = today.getMonth() - birthDate.getMonth()

      if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      return age >= 18
    },
    isNotFutureDate(date) {
      const today = new Date()
      const inputDate = new Date(date)

      return inputDate <= today
    },
    saveDateStart () {
      this.$refs.dialogStart.save(this.dateStart)
      this.maxDateStart = new Date(this.dateStart).toISOString()
    },
    async submit () {
      if (this.$refs.formUploadFile.validate()) {
        this.isLoading = true
        const payload = {
          name: this.name,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          birthDay: this.dateStart,
          state: this.state
        }
  
        if ( !this.isEdit ) {
          await BackendApi.post('/client', payload)
            .then((response) => {
              if (response.data.success) {
                this.close()
                this.$store.dispatch('app/showSuccess', response.data.message)
              }
            })
            .catch( (error) => {
              this.errors = error.response.data.errors
              this.isLoading = false
            } )
        } else {
  
          BackendApi.put('/client/' + this.item.id, payload)
            .then((response) => {
              if (response.data.success) {
                this.close()
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
}
</script>
