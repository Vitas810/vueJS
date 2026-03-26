const basePreset = require('@vue/cli-plugin-unit-jest/presets/default/jest-preset')

module.exports = {
  ...basePreset,
  moduleFileExtensions: [...basePreset.moduleFileExtensions, 'ts', 'tsx'],
  testMatch: ['**/tests/unit/**/*.spec.[jt]s?(x)'],
  transform: {
    ...basePreset.transform,
    '^.+\\.tsx?$': 'ts-jest',
  },
}
