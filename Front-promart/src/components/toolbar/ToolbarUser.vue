<template>
  <v-menu offset-y left transition="slide-y-transition">
    <template v-slot:activator="{ on }">
      <v-btn icon class="elevation-2" v-on="on">
        <v-badge
          color="success"
          dot
          bordered
          offset-x="10"
          offset-y="10"
        >
          <User-Avatar :user="user" :detail="false"/>
        </v-badge>
      </v-btn>
    </template>

    <!-- user menu list -->
    <v-list dense nav>
      <!-- <v-list-item
        v-for="(item, index) in menu"
        :key="index"
        :to="item.link"
        :exact="item.exact"
        :disabled="item.disabled"
        link
      >
        <v-list-item-icon>
          <v-icon small :class="{ 'grey--text': item.disabled }">{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.key ? $t(item.key) : item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item> -->
      <v-divider class="my-1"></v-divider>

      <v-list-item @click="$store.dispatch('logout')">
        <v-list-item-icon>
          <v-icon small>mdi-logout-variant</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Cerrar Sesión</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import config from '../../configs'
import UserAvatar from '@/components/reports/userAvatar'
/*
|---------------------------------------------------------------------
| Toolbar User Component
|---------------------------------------------------------------------
|
| Quickmenu for user menu shortcuts on the toolbar
|
*/
export default {
  components: {
    UserAvatar
  },
  data() {
    return {
      menu: config.toolbar.user
    }
  },
  computed: {
    user: function () {
      return {
        name: $cookies.get('user').email
      }
    }
  }
}
</script>
