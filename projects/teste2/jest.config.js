module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverage: true,
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    testMatch: ['**/src/tests/**/*.test.js'],  // Mapeia todos os arquivos de teste dentro da pasta src/tests
    verbose: true,
};
