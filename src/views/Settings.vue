<template>
  <section v-if="currentUser" class="settings-page">
    <div class="app-container">
      <div class="settings-card surface-card">
        <h1 class="settings-page__title">Settings</h1>
        <p class="settings-page__subtitle">
          Manage your profile in a local form without mutating store data
          directly.
        </p>

        <mcv-validation-errors
          v-if="validationErrors"
          :validation-errors="validationErrors"
        />

        <form class="form-layout" @submit.prevent="onSubmit">
          <label class="app-field">
            <span class="app-field__label">Profile picture</span>
            <input
              v-model="form.image"
              type="text"
              class="app-input"
              placeholder="URL of profile picture"
            />
          </label>

          <label class="app-field">
            <span class="app-field__label">Username</span>
            <input
              v-model="form.username"
              type="text"
              class="app-input"
              placeholder="Username"
            />
          </label>

          <label class="app-field">
            <span class="app-field__label">Short bio</span>
            <textarea
              v-model="form.bio"
              class="app-textarea"
              placeholder="Short bio about you"
            ></textarea>
          </label>

          <label class="app-field">
            <span class="app-field__label">Email</span>
            <input
              v-model="form.email"
              type="text"
              class="app-input"
              placeholder="Email"
            />
          </label>

          <label class="app-field">
            <span class="app-field__label">Password</span>
            <input
              v-model="form.password"
              type="password"
              class="app-input"
              placeholder="Password"
            />
          </label>

          <div class="form-layout__actions">
            <button class="app-button" type="submit" :disabled="isSubmitting">
              Update Settings
            </button>
          </div>
        </form>

        <div class="settings-page__logout">
          <button
            class="app-button app-button_danger"
            @click="logout"
            type="button"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  getterTypes as authGetterTypes,
  actionsTypes as authActionTypes,
} from '@/store/modules/auth'
import McvValidationErrors from '@/components/ValidationErrors.vue'
import {CurrentUser, CurrentUserInput, ValidationErrors} from '@/types/domain'
import {RootState} from '@/types/store'

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
  components: {McvValidationErrors},
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
      return this.$store.getters[
        authGetterTypes.currentUser
      ] as CurrentUser | null
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
        currentUserInput: {...this.form},
      })
    },

    // Выход пользователя
    logout(): void {
      const logoutPromise = this.$store.dispatch(
        authActionTypes.logout
      ) as Promise<void>

      logoutPromise.then(() => {
        this.$router.push({name: 'globalfeed'})
      })
    },
  },
})
</script>
