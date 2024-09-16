module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['./jest.setup.ts'],// Archivo de configuración de jest
    testMatch: ['**/src/test/**/*.test.ts'],// Ubicación de los archivos de prueba
    verbose: true
  };
  