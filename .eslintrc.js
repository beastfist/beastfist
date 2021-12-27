module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  plugins: ['import', 'svelte3'],
  overrides: [
    {
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3'
    }
  ],
  extends: ['standard'],
  // add your custom rules here
  rules: {
    'no-console': 'off',
    'multiline-ternary': 'off',
    'no-multiple-empty-lines': 'off',
    'import/first': 'off'
  }
}
