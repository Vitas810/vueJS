<template>
  <section class="auth-page">
    <div class="app-container">
      <div class="auth-card surface-card">
        <h1 class="auth-page__title">Sign In</h1>
        <p class="auth-page__subtitle">
          <router-link class="auth-page__link" :to="{name: 'register'}">
            Need an account?
          </router-link>
        </p>

        <mcv-validation-errors
          v-if="validationErrors"
          :validation-errors="validationErrors"
        />

        <form class="form-layout" @submit.prevent="onSubmit">
          <label class="app-field">
            <span class="app-field__label">Email</span>
            <input
              v-model="email"
              type="text"
              class="app-input"
              placeholder="Enter your email"
            />
          </label>

          <label class="app-field">
            <span class="app-field__label">Password</span>
            <input
              v-model="password"
              type="password"
              class="app-input"
              placeholder="Enter your password"
            />
          </label>

          <div class="form-layout__actions">
            <button class="app-button" :disabled="isSubmiting">Sign In</button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import McvValidationErrors from '@/components/ValidationErrors.vue'
import { actionsTypes } from '@/store/modules/auth'
import { CurrentUser, ValidationErrors } from '@/types/domain'
import { RootState } from '@/types/store'

interface LoginData {
  email: string
  password: string
}

export default Vue.extend({
  name: 'McvLogin',
  components: {
    McvValidationErrors,
  },
  data(): LoginData {
    return {
      email: '',
      password: '',
    }
  },
  computed: {
    // Флаг отправки формы
    isSubmiting(): boolean {
      return (this.$store.state as RootState).auth.isSubmiting
    },

    // Ошибки валидации
    validationErrors(): ValidationErrors | null {
      return (this.$store.state as RootState).auth.validationErrors
    },
  },
  methods: {
    // Отправка формы логина
    onSubmit(): void {
      const loginPromise = this.$store.dispatch(actionsTypes.login, {
        email: this.email,
        password: this.password,
      }) as Promise<CurrentUser>

      loginPromise.then(() => {
        this.$router.push({ name: 'globalfeed' })
      })
    },
  },
})
</script>
