module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: '<rootDir>/__tests__/setup/setupEnv.ts',
  roots: ['<rootDir>'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup/setupTests.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/__tests__/setup/'
  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // https://github.com/zeit/next.js/issues/8663#issue-490553899
  globals: {
    // we must specify a custom tsconfig for tests because we need the typescript transform
    // to transform jsx into js rather than leaving it jsx such as the next build requires. you
    // can see this setting in tsconfig.jest.json -> "jsx": "react"
    'ts-jest': {
      tsconfig: '<rootDir>/__tests__/setup/tsconfig.jest.json'
    }
  },
  testMatch: [
    '<rootDir>/__tests__/modules/*.spec.tsx',
    '<rootDir>/__tests__/cpu/*.spec.tsx',
    '<rootDir>/__tests__/api/*.spec.tsx'
  ]
}
