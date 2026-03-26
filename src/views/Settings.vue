<template>
    <div class="settings-page" v-if="currentUser">
        <div class="container page">
            <div class="row">
                <div class="col-md-6 offset-md-3 col-xs-12">
                    <h1 class="text-xs-center">Settings</h1>
                    <mcv-validation-errors
                        v-if="validationErrors"
                        :validation-errors="validationErrors"
                    />
                    <form @submit.prevent="onSubmit">
                        <fieldset>
                            <fieldset class="form-group">
                                <input type="text"
                                       class="form-control from-control-lg"
                                       v-model="form.image"
                                       placeholder="URL of profile picture"
                                >
                            </fieldset>

                            <fieldset class="form-group">
                                <input type="text"
                                       class="form-control from-control-lg"
                                       v-model="form.username"
                                       placeholder="Username"
                                >
                            </fieldset>

                            <fieldset class="form-group">
                                <textarea class="form-control from-control-lg"
                                       v-model="form.bio"
                                       placeholder="Short bio about you"
                                > </textarea>
                            </fieldset>

                            <fieldset class="form-group">
                                <input type="text"
                                       class="form-control from-control-lg"
                                       v-model="form.email"
                                       placeholder="Email"
                                >
                            </fieldset>

                            <fieldset class="form-group">
                                <input type="password"
                                       class="form-control from-control-lg"
                                       v-model="form.password"
                                       placeholder="Password"
                                >
                            </fieldset>
                            <button type="submit"
                                    class="btn btn-lg btn-primary pull-xs-right"
                                    :disabled="isSubmitting"
                            >Update settings</button>
                        </fieldset>
                    </form>
                    <hr/>
                    <button class="btn btn-outline-danger"
                            @click="logout"
                            type="submit"
                    >Or click here to logout</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  getterTypes as authGetterTypes,
  actionsTypes as authActionTypes,
} from '@/store/modules/auth'
import McvValidationErrors from '@/components/ValidationErrors.vue'
import {
  CurrentUser,
  CurrentUserInput,
  ValidationErrors,
} from '@/types/domain'
import { RootState } from '@/types/store'

interface SettingsData {
  form: CurrentUserInput
}

function createEmptySettingsForm(): CurrentUserInput {
  return {
    username: '',
    bio: '',
    image: '',
    email: '',
    password: '',
  }
}

export default Vue.extend({
  name: 'McvSettings',
  components: { McvValidationErrors },
  data(): SettingsData {
    return {
      form: createEmptySettingsForm(),
    }
  },
  computed: {
    // Флаг отправки формы
    isSubmitting(): boolean {
      return (this.$store.state as RootState).settings.isSubmitting
    },

    // Ошибки валидации формы
    validationErrors(): ValidationErrors | null {
      return (this.$store.state as RootState).settings.validationErrors
    },

    // Текущий пользователь
    currentUser(): CurrentUser | null {
      return this.$store.getters[authGetterTypes.currentUser] as CurrentUser | null
    },
  },
  watch: {
    // Синхронизация локальной формы без мутации store
    currentUser: {
      immediate: true,
      handler(currentUser: CurrentUser | null): void {
        if (!currentUser) {
          this.form = createEmptySettingsForm()
          return
        }

        this.form = {
          username: currentUser.username,
          bio: currentUser.bio ?? '',
          image: currentUser.image ?? '',
          email: currentUser.email,
          password: '',
        }
      },
    },
  },
  methods: {
    // Отправка формы настроек
    onSubmit(): void {
      this.$store.dispatch(authActionTypes.updateCurrentUser, {
        currentUserInput: { ...this.form },
      })
    },

    // Выход пользователя
    logout(): void {
      const logoutPromise = this.$store.dispatch(
        authActionTypes.logout
      ) as Promise<void>

      logoutPromise.then(() => {
        this.$router.push({ name: 'globalfeed' })
      })
    },
  },
})
</script>