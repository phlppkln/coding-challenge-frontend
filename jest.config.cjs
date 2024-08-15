module.exports = {
    transform: {
      '^.+\\.[t|j]sx?$': 'babel-jest',
    },
    moduleNameMapper: {
      '^.+\\.(jpg|jpeg|png|gif|webp|svg|css)$': 'jest-transform-stub',
        '^../helpers/(.*)$': '<rootDir>/src/helpers/$1',
    },
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ["<rootDir>/node_modules/"]
  };
  