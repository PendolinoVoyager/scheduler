/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    // Map imports of .js files to corresponding TypeScript files
    '^(.*)\\.js$': '$1',
  },
};
