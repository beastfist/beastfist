let files = ['**/*.spec.js']
if (process.env.TEST === 'api') {
  files = ['api/**/*.spec.js']
}
if (process.env.TEST === 'stress') {
  files = ['stress/**/*.spec.js']
}
if (process.env.TEST === 'ui') {
  files = ['ui/**/*.spec.js']
}

export default {
  files,
  cache: true,
  concurrency: 64,
  failFast: true,
  failWithoutAssertions: false,
  verbose: true,
  environmentVariables: {
    UI_URL: 'http://localhost:3000',
    API_URL: 'http://localhost:4001'
  }
}
