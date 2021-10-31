module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    'jest/globals': true
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:all',
    'plugin:react/recommended',
    'prettier' // eslintルールと競合するため必ず最後に加える
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['jest'],
  // Add your custom rules here
  rules: {
    'no-use-before-define': 'off',
    'no-console': 'off',
    'no-unused-vars': 'error',
    'no-magic-numbers': 'off',
    'max-lines-per-function': 'off',
    'sort-keys': 'off',
    'sort-imports': 'off',
    'no-inline-comments': 'off',
    'one-var': 'off',
    'line-comment-position': 'off',
    'id-length': 'off',
    'no-ternary': 'off',
    'no-nested-ternary': 'off',
    'camelcase': 'off',
    'react/prop-types': 'off',
    'max-statements': 'off',
    'prefer-destructuring': 'off',
    'max-params': 'off',
    'no-undef': 'off',
    'max-statements-per-line': 'off',
    'no-undefined': 'off',
    'no-alert': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
