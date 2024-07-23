<template>
  <div
    v-shortkey="['ctrl', '/']"
    class="d-flex flex-grow-1"
  >
    <!-- Navigation -->
    <v-navigation-drawer
      v-model="drawer"
      app
      floating
      class="elevation-1"
      :right="$vuetify.rtl"
      :light="menuTheme === 'light'"
      :dark="menuTheme === 'dark'"
    >
      <!-- Navigation menu info -->
      <template v-slot:prepend>
        <img src="/logo.png" style="width: 150px; margin: 20px 45px 0px;">
      </template>

      <!-- Navigation menu -->
      <!-- <main-menu :menu="navigation.menu" /> -->
      <main-menu :menu="validateRole" />

    </v-navigation-drawer>

    <!-- Toolbar -->
    <v-app-bar
      app
      :color="isToolbarDetached ? 'surface' : undefined"
      :flat="isToolbarDetached"
      :light="toolbarTheme === 'light'"
      :dark="toolbarTheme === 'dark'"
    >
      <v-card class="flex-grow-1 d-flex" :class="[isToolbarDetached ? 'pa-1 mt-3 mx-1' : 'pa-0 ma-0']" :flat="!isToolbarDetached">
        <div class="d-flex flex-grow-1 align-center">
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          
          <v-spacer></v-spacer>

          <!-- <toolbar-apps /> -->

          <div :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']">
            <!-- <toolbar-notifications /> -->
          </div>
          <toolbar-user />
        </div>
      </v-card>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height" :fluid="!isContentBoxed">
        <v-layout>
          <slot></slot>
        </v-layout>
      </v-container>

      <v-footer app inset>
        <v-spacer></v-spacer>
        <div class="overline">
          template
        </div>
      </v-footer>
    </v-main>
    holaa
  </div>
</template>

<script>
import { mapState } from 'vuex'

// navigation menu configurations
import config from '../configs'

import MainMenu from '../components/navigation/MainMenu'
import ToolbarUser from '../components/toolbar/ToolbarUser'
// import ToolbarApps from '../components/toolbar/ToolbarApps'
// import ToolbarNotifications from '../components/toolbar/ToolbarNotifications'

export default {
  components: {
    MainMenu,
    ToolbarUser
    // ToolbarApps,
    // ToolbarNotifications
  },
  data() {
    return {
      drawer: null,
      showSearch: false,
      navigation: config.navigation
    }
  },
  computed: {
    ...mapState('app', ['product', 'isContentBoxed', 'menuTheme', 'toolbarTheme', 'isToolbarDetached']),
    // validateRole () {
    //   return ($cookies.get('user').isSuperAdmin) ? config.navigation.menu : this.filternavigation()
    // }
    validateRole () {
      return config.navigation.menu
    }
  },
  methods: {
    filternavigation () {
      return config.navigation.menu.filter( (e) => e.text !== 'Canales')
    }
  }
}
</script>

<style scoped>
.buy-button {
  box-shadow: 1px 1px 18px #ee44aa;
}
</style>
