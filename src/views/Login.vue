<template>
  <div>
    <div class="auth-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Sign In</h1>
            <p class="text-xs-center">
              <router-link :to="{name: 'register'}"
                >Need an account ?</router-link
              >
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
                Sign In
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
