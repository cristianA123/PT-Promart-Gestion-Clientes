<template>
  <!--- Apertura -->
  <v-col cols="12" lg="4" xl="3">
    <v-card
      height="270px"
    >
      <v-card-title>
        {{ title }}
      </v-card-title>

      <v-card-text>
        <v-col class="d-flex justify-center d-lg-none">
          <div>
            <div class="text-h3">
              {{ value }}%
            </div>
            <div class="d-flex justify-end">
              <small>Enlances abiertos</small>
            </div>
          </div>
        </v-col>

        <div class="chart-wrap d-none d-lg-block">
          <apexchart
            type="donut"
            width="350px"
            :options="chartOptions"
            :series="[value, 100 - value]"
          ></apexchart>
        </div>

      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
      default: 0
    },
    labels: {
      type: Array,
      default: function () {
        return ['','']
      }
    },
    totalLabel: {
      type: String,
      default: ''
    }
  },
  computed: {
    chartOptions() {
      return {
        chart: {
          type: 'donut',
          animations: {
            speed: 400
          },
          background: 'transparent'
        },
        stroke: {
          show: true,
          colors: [this.$vuetify.theme.isDark ? '#333' : '#fff'],
          width: 1,
          dashArray: 0
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: '74%',
              labels: {
                show: true,
                total: {
                  show: true,
                  label: this.labels[0],
                  color: '#4CAF50',
                  formatter: () => {
                    return this.value + '%'
                  }
                }
              }
            }
          }
        },
        theme: {
          mode: this.$vuetify.theme.isDark ? 'dark' : 'light'
        },
        labels: this.labels,
        dataLabels: {
          enabled: false
        },
        colors: ['#4CAF50', '#D7CCC8'],
        fill: {
          colors: ['#4CAF50', '#D7CCC8']
        },
        legend: {
          offsetY: 40,
          fontSize: '13px',
          fontFamily: 'Quicksand',
          fontWeight: 700
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              offsetY: 0,
              position: 'bottom'
            }
          }
        }],
        ...this.options
      }
    }
  }
}
</script>