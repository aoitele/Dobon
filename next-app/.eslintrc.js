module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:all',
    'plugin:react/recommended',
    "prettier", // eslintルールと競合するため必ず最後に加える
  ],
  "parserOptions": {
    "ecmaVersion": 2020, 
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
    }
  },
  plugins: [],
  // Add your custom rules here
  rules: {
    "no-use-before-define": "off",
    'no-unused-vars': 'error',
    'no-magic-numbers': "off",
    'max-lines-per-function': "off",
    "sort-keys": "off",
    "sort-imports" : "off",
    "no-inline-comments": "off"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
}
