import { mutationTypes } from '@/store/modules/settings'

describe('settings module', () => {
  it('имеет собственные строки мутаций без префикса auth', () => {
    expect(mutationTypes.updateSettingsFormStart).toContain('[settings]')
    expect(mutationTypes.updateSettingsFormStart).not.toContain('[auth]')
  })
})
