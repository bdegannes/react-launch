// jest.config.js
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  coverageReporters: ['json', 'lcov'],
  moduleFileExtensions: ['js', 'jsx', 'json'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(js|jsx)?$': 'babel-jest',
  },
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};
