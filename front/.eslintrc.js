module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'eslint:recommended',
    "prettier" // eslintルールと競合するため必ず最後に加える
  ],
  plugins: [],
  // add your custom rules here
  rules: {
    '@typescript-eslint/no-unused-vars': 'error'
  }
}
