export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss|less)$': 'identity-obj-proxy',
    '\\.svg$': 'identity-obj-proxy',
    '\\.(css|sass|scss|less)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: ['<rootDir>/__test__/setupJestDom.ts'],
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/__test__/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['@swc/jest']
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules/(?!(antd)/)[/\\\\].+\\.(js|jsx|ts|tsx)$'
  ]

}