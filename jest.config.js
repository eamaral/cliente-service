module.exports = {
  testEnvironment: 'node',
  rootDir: './',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/application/usecases/**/*.js',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  testMatch: ['**/tests/**/*.test.js'],
  moduleFileExtensions: ['js', 'json'],
};
