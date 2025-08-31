require('@vue/eslint-config-prettier')
require('@vue/eslint-config-typescript')

module.exports = {
  root: true,
  extends: [
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
  ],
  plugins: ['oxlint'],
  rules: {
    'oxlint/oxlint': 'error'
  }
}