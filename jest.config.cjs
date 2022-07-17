/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

const { defaults: { transform } } = require('ts-jest/presets')

module.exports = {
  transform,
  resolver: 'ts-jest-resolver',
  rootDir: './',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  modulePaths: ['<rootDir>/src'],
  coverageDirectory: './coverage',
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,js}'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
}
