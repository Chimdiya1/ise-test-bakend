/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  roots: [
    '<rootDir>/src'
  ],
  testEnvironment: 'node',
  moduleNameMapper: {
    "@exmpl/(.*)": "<rootDir>/src/$1"
  },
};