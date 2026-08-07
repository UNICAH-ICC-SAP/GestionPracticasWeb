/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  coverageProvider: 'v8',
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/main.tsx', '!src/vite-env.d.ts'],
  coverageReporters: ['cobertura'],
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { module: 'CommonJS' } }],
  },
  moduleNameMapper: {
    '^@api/(.*)$': '<rootDir>/src/Api/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@utilities/(.*)$': '<rootDir>/src/utilities/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@root/(.*)$': '<rootDir>/src/$1',
  },
};
