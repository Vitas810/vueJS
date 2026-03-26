<template>
  <div>
    <div class="auth-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Sign Up</h1>
            <p class="text-xs-center">
              <router-link :to="{name: 'login'}">Have an account ?</router-link>
            </p>
            <mcv-validation-errors
              v-if="validationErrors"
              :validation-errors="validationErrors"
            />
            <form @submit.prevent="onSubmit">
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Name"
                  v-model="username"
                />
              </fieldset>

              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Email"
                  v-model="email"
                />
              </fieldset>

              <fieldset class="form-group">
                <input
                  type="password"
                  class="form-control form-control-lg"
                  placeholder="password"
                  v-model="password"
                />
              </fieldset>
              <button
                class="btn btn-lg btn-primary pull-xs-right"
                :disabled="isSubmiting"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
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
