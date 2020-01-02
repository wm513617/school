module.exports = {
  root: true,
  extends: ['standard'],
  parserOptions: {
    ecmaVersion: 2018
  },
  env: {
    node: true
  },
  rules: {
    'space-before-function-paren': ['error', 'always'],
    'init-declarations': 0,
    curly: ['error', 'all']
  },
  globals: {
    mongoose: true,
    Schema: true,
    _: true,
    moment: true,
    router: true,
    fs: true,
    path: true
  }
}
