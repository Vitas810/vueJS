<template>
  <section class="auth-page">
    <div class="app-container">
      <div class="auth-card surface-card">
        <h1 class="auth-page__title">Sign Up</h1>
        <p class="auth-page__subtitle">
          <router-link class="auth-page__link" :to="{name: 'login'}">
            Have an account?
          </router-link>
        </p>

        <mcv-validation-errors
          v-if="validationErrors"
          :validation-errors="validationErrors"
        />

        <form class="form-layout" @submit.prevent="onSubmit">
          <label class="app-field">
            <span class="app-field__label">Name</span>
            <input
              v-model="username"
              type="text"
              class="app-input"
              placeholder="Enter your name"
            />
          </label>

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
              placeholder="Create a password"
            />
          </label>

          <div class="form-layout__actions">
            <button class="app-button" :disabled="isSubmiting">Sign Up</button>
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

interface RegisterData {
  email: string
  password: string
  username: string
}

export default Vue.extend({
  name: 'McvRegister',
  components: {
    McvValidationErrors,
  },
  data(): RegisterData {
    return {
      email: '',
      password: '',
      username: '',
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
    // Отправка формы регистрации
    onSubmit(): void {
      const registerPromise = this.$store.dispatch(actionsTypes.register, {
        username: this.username,
        email: this.email,
        password: this.password,
      }) as Promise<CurrentUser>

      registerPromise.then(() => {
        this.$router.push({ name: 'globalfeed' })
      })
    },
  },
})
</script>
