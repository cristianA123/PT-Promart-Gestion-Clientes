<template>
  <div class="d-flex flex-column flex-grow-1 justify-center">
    <v-row class="align-center mx-1">
      <div class="text-h6 text-lg-h4 text-md-h4 text-sm-h6">Clientes</div>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        small
        @click="openDialogCreate(undefined)"
      >
        Clientes
      </v-btn>
      <BtnToReload />
    </v-row>
    <v-col>
      <v-data-table
        :headers="headers"
        :items="items"
        :options.sync="options"
        :server-items-length="totalItems"
        :loading="isLoading"
        @update:options="fetchData"
      >
        <template v-slot:[`item.birthDay`]="{ item }">
          {{ formatDate(item.birthDay) }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-menu offset-y>
            <template v-slot:activator="{ attrs, on }">
              <v-btn v-bind="attrs" v-on="on">Acciones</v-btn>
            </template>
            <v-list>
              <v-list-item link @click="openDialogCreate(item)">Modificar</v-list-item>
              <v-list-item link @click="deleteClient(item)">Eliminar</v-list-item>
              <v-list-item link @click="openDetail(item)">Ver detalle</v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-col>
    <DialogCreateComponent
      ref="dialogCreate"
      @onDialogCreateFinish="onDialogCreateFinish"
    />
    <v-dialog v-if="dialogConfirm" v-model="dialogConfirm" persistent max-width="450">
      <v-card>
        <v-card-title class="text-h5">Seguro de eliminar esta agenda?</v-card-title>
        <v-card-text>Una vez eliminado esta agenda, no podrá recuperarla. Las campañas que se esten procesando y que hagan uso de esta agenda se enviarán con normalidad.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="dialogConfirm = false">Cancelar</v-btn>
          <v-btn color="success" text @click="deleteItem()">Confirmo</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import DialogCreateComponent from './createClient/dialogCreateComponent.vue'
import BackendApi from '@/services/backend.service'
import BtnToReload from '@/components/common/BtnToReload.vue'

export default {
  components: {
    DialogCreateComponent,
    BtnToReload
  },
  data() {
    return {
      dialogUploadShow: false,
      clientSelected: null,
      dialogConfirm: false,
      isLoading: false,
      isUpdate: false,
      headers: [
        { text: 'Nombre', value: 'name' },
        { text: 'Apellido Paterno', value: 'firstName' },
        { text: 'Apellido Materno', value: 'lastName' },
        { text: 'Email', value: 'email' },
        { text: 'Cumpleaños', value: 'birthDay' },
        { text: 'Estado', value: 'state' },
        { text: 'Acciones', value: 'actions' }
      ],
      items: [],
      totalItems: 0,
      options: {
        page: 1,
        itemsPerPage: 5,
        sortBy: [],
        sortDesc: []
      }
    }
  },
  computed: {
    itemsEmpty: function () {
      return this.items.length === 0
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' }

      return new Date(date).toLocaleDateString('es-ES', options)
    },
    openDialogCreate(item) {
      this.$refs.dialogCreate.open(item)
    },
    onDialogCreateFinish() {
      this.fetchData()
    },
    async fetchData() {
      this.isLoading = true
      const { page, itemsPerPage } = this.options

      try {
        const response = await BackendApi.get('/client', {
          params: {
            page,
            limit: itemsPerPage
          }
        })

        if (response.data.success) {
          this.items = response.data.data.clients
          this.totalItems = response.data.data.totalPages * itemsPerPage
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    openDetail(item) {
      this.$router.push({ name: 'detail-client', params: { id: item.id, url: item } })
    },
    deleteClient(client) {
      this.dialogConfirm = true
      this.clientSelected = client
    },
    async deleteItem() {
      try {
        const response = await BackendApi.delete('/client/' + this.clientSelected.id)

        if (response.data.success) {
          this.$store.dispatch('app/showSuccess', 'Agenda eliminada exitosamente')
          this.dialogConfirm = false
          this.fetchData()
        } else {
          this.$store.dispatch('app/showError', response.data.message)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
