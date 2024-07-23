<template>
  <v-card class="d-flex flex-grow-1 primary darken-4" dark>

    <!-- loading spinner -->
    <div v-if="loading" class="d-flex flex-grow-1 align-center justify-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <!-- information -->
    <div v-else class="d-flex flex-column flex-grow-1">
      <v-card-title>
        <template>
          <div
            class="col-12 my-0 py-0"
          >
            <div
              class="d-flex justify-center mb-6"
            >
              Consumo de créditos
            </div>
          </div>
        </template>
      </v-card-title>

      <v-spacer></v-spacer>

      <div class="d-flex flex-column flex-grow-1">
        <div 
          v-for="credit in credits"
          :key="credit.id"
          class="px-2"
        >
          <div class="text-h5">
            {{ credit.service }}: {{ credit.credits | formatCurrency(configFormat) }}
          </div>
        </div>

        <br/>
        <v-spacer></v-spacer>

        <div class="px-2 pb-2">
          <div class="title mb-1">Total de créditos</div>
          <div class="d-flex align-center">
            <div class="text-h4">
              {{ computedTotalCredits | formatCurrency(configFormat) 
              }}
            </div>
          </div>
        </div>
      </div>

      <apexchart
        type="area"
        height="120"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
  </v-card>
</template>

<script>
import moment from 'moment'
import VueApexCharts from 'vue-apexcharts'

function formatDate(date) {
  return date ? moment(date).format('D MMM') : ''
}

/*
|---------------------------------------------------------------------
| DEMO Dashboard Card Component
|---------------------------------------------------------------------
|
| Demo card component to be used to gather some ideas on how to build
| your own dashboard component
|
*/
export default {
  mounted() {
  },
  data() {
    return {
      interval: 'Todos',
      intervals: ['Todos', 'Este mes']
    }
  },
  props: {
    credits: {
      type: Array,
      default: () => [{
        service: '',
        credits: 0
      }]
    },
    series: {
      type: Array,
      default: () => [{
        name: 'Sales',
        data: [100,12,12302]
      }]
    },
    xaxis: {
      type: Object,
      default: () => ({
        type: 'datetime',
        categories: [
          '2018-01-19T00:00:00.000Z',
          '2018-01-20T00:00:00.000Z',
          '2018-01-31T00:00:00.000Z'
        ]
      })
    },
    label: {
      type: String,
      default: 'dashboard.sales'
    },
    actionLabel: {
      type: String,
      default: 'View Report'
    },
    options: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
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
    },
    computedTotalCredits: function () {
      let total = 0

      this.credits.forEach((credit) => {
        total = credit.credits + total
      })

      return total
    },
    chartOptions() {
      const primaryColor = this.$vuetify.theme.isDark
        ? this.$vuetify.theme.themes.dark.primary
        : this.$vuetify.theme.themes.light.primary

      return {
        chart: {
          height: 120,
          type: 'area',
          sparkline: {
            enabled: true
          },
          animations: {
            speed: 400
          }
        },
        colors: [primaryColor],
        fill: {
          type: 'solid',
          colors: [primaryColor],
          opacity: 0.15
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        xaxis: this.xaxis,
        tooltip: {
          followCursor: true,
          theme: 'dark',
          custom: function({ ctx, series, seriesIndex, dataPointIndex, w }) {
            const seriesName = w.config.series[seriesIndex].name

            return `<div class="rounded-lg pa-1 caption">
              <div class="font-weight-bold">${formatDate(w.globals.labels[dataPointIndex])}</div>
              <div>${series[seriesIndex][dataPointIndex]} Créditos</div>
            </div>`
          }
        },
        ...this.options
      }
    }
  }
}
</script>
