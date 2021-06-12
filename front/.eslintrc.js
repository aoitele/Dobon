module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'eslint:all',
    "prettier", // eslintルールと競合するため必ず最後に加える
  ],
  plugins: [],
  // Add your custom rules here
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    "sort-keys": "off",
    "sort-imports" : "off",
    "no-inline-comments": "off"
  }
}
