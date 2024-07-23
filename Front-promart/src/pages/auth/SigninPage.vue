<template>
  <div>
    <v-card class="text-center pa-1">
      <v-card-title class="justify-center display-1 mb-2">Bienvenido</v-card-title>
      <v-card-subtitle>Inicia sesión con tu cuenta</v-card-subtitle>

      <!-- sign in form -->
      <v-card-text>
        <v-form ref="form" v-model="isFormValid" lazy-validation>
          <v-text-field
            v-model="email"
            :rules="[
              v => !!v || 'Ingrese Email',
              v => /.+@.+\..+/.test(v) || 'El Email ingresado es inválido',
            ]"
            :validate-on-blur="false"
            :error="error"
            :error-messages="$store.state.authenticate.errorMessages"
            :label="$t('login.email')"
            name="email"
            outlined
            @keyup.enter="submit"
            @change="resetErrors"
          ></v-text-field>

          <v-text-field
            v-model="password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[
              v => !!v || 'Ingrese password',
            ]"
            :type="showPassword ? 'text' : 'password'"
            :error="error"
            :error-messages="$store.state.authenticate.errorMessages"
            :label="$t('login.password')"
            name="password"
            outlined
            @change="resetErrors"
            @keyup.enter="submit"
            @click:append="showPassword = !showPassword"
          ></v-text-field>

          <v-btn
            :loading="$store.state.authenticate.loadingAuth"
            block
            x-large
            color="#235696"
            @click="submit"
            dark
          >Iniciar Sesión</v-btn>

          <div v-if="errorProvider" class="error--text">{{ errorProviderMessages }}</div>

        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
/*
|---------------------------------------------------------------------
| Sign In Page Component
|---------------------------------------------------------------------
|
| Sign in template for user authentication into the application
|
*/
export default {
  data() {
    return {
      // sign in buttons
      isLoading: false,
      isSignInDisabled: false,

      // form
      isFormValid: true,
      email: '',
      password: '',

      // form error
      error: false,
      errorMessages: '',

      errorProvider: false,
      errorProviderMessages: '',

      // show password field
      showPassword: false,

      providers: [{
        id: 'google',
        label: 'Google',
        isLoading: false
      }, {
        id: 'facebook',
        label: 'Facebook',
        isLoading: false
      }]
    }
  },
  mounted() {
    this.$store.commit('setLoadingAuth', false)
  },
  methods: {
    ...mapMutations(['setLoadingAuth']),
    submit() {
      if (this.$refs.form.validate()) {
        this.isLoading = true
        this.isSignInDisabled = true
        this.$store.dispatch('login', { email: this.email, password: this.password })
      }
    },
    signInProvider(provider) {},
    resetErrors() {
      this.error = false
      this.errorMessages = ''

      this.errorProvider = false
      this.errorProviderMessages = ''
    }
  }
}
</script>
