import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    testMatch: ['**/__tests__/**/*.test.ts'], // Onde procurar os arquivos de teste
    setupFilesAfterEnv: ['./jest.setup.ts'], //Arquivos de setup
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};

export default config;