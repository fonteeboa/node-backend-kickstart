module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverage: true,
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    testMatch: ['**/src/tests/**/*.test.js'],
    verbose: true,
};
