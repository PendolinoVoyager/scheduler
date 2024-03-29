/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    // Map imports of .js files to corresponding TypeScript files. Thanks electron :)
    '^(.*)\\.js$': '$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/out/'],
};
