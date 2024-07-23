<template>
  <v-col cols="12" lg="4" xl="6" >
    <v-card
      height="270px"
    >
      <v-card-title>
        Crédito inicial
      </v-card-title>

      <v-card-text>
        <v-col class="d-flex justify-center">
          <div>
            <div class="text-h3">
              {{ value | formatCurrency(configFormat) }}
            </div>
            <div class="d-flex justify-end">
              <small>Créditos</small>
            </div>
          </div>
        </v-col>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
export default ({
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  computed: {
    configFormat: function () {

      return {
        decimalDigits: 0,
        decimalSeparator: '.',
        thousandsSeparator: ',',
        currencySymbol: '',
        currencySymbolNumberOfSpaces: 0,
        currencySymbolPosition: 'left'
      }
    }
  }
})
</script>
