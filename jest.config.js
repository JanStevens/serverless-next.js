module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/packages/**/*.{js,ts}"],
  moduleNameMapper: {
    "fs-extra": "<rootDir>/node_modules/fs-extra",
    "@sls-next-n5/core/package.json": "<rootDir>/packages/libs/core/package.json",
    "@sls-next-n5/core/dist/module(.*)": "<rootDir>/packages/libs/core/src$1",
    "@sls-next-n5/core/dist(.*)": "<rootDir>/packages/libs/core/src$1",
    "@sls-next-n5/core(.*)": "<rootDir>/packages/libs/core/src$1"
  },
  coverageDirectory: "<rootDir>/coverage/",
  coveragePathIgnorePatterns: [
    "<rootDir>/packages/deprecated/serverless-plugin/utils/yml/cfSchema.js",
    "<rootDir>/packages/deprecated/serverless-plugin/utils/test",
    "/.serverless_nextjs/",
    "/fixtures/",
    "/fixture/",
    "/examples/",
    "/dist/",
    "/e2e-tests/",
    "/tests/",
    "/scripts/",
    "babel.config.js",
    "jest.config.js",
    "<rootDir>/packages/serverless-components/aws-s3",
    "<rootDir>/packages/libs/serverless-patched",
    "<rootDir>/packages/libs/lambda-at-edge/src/render/renderStaticPage.ts",
    "<rootDir>/packages/libs/lambda-at-edge/src/default-handler-v2.ts",
    "<rootDir>/packages/libs/lambda-at-edge/src/regeneration-handler-v2.ts",
    "<rootDir>/packages/libs/core/src/defaultHandler.ts",
    "<rootDir>/packages/libs/core/src/regenerationHandler.ts",
    "<rootDir>/packages/libs/core/src/platform/platformClient.ts",
    "<rootDir>/packages/libs/core/src/build/builder.ts",
    "<rootDir>/packages/libs/aws-common/src/awsPlatformClient.ts",
    "<rootDir>/packages/libs/lambda/"
  ],
  watchPathIgnorePatterns: ["/fixture/", "/fixtures/"],
  testPathIgnorePatterns: [
    "<rootDir>/packages/deprecated/serverless-plugin/*",
    "/.next/",
    "/node_modules/",
    "/fixtures/",
    "/fixture/",
    "/examples/",
    "/integration/",
    "/cypress/",
    "/sharp_node_modules/",
    "aws-sdk.mock.ts"
  ],
  setupFiles: ["<rootDir>/jest.setup.js"],
  modulePathIgnorePatterns: ["/sharp_node_modules/"],
  testSequencer: "<rootDir>/jest-sequencer.js",
  modulePaths: ["<rootDir>/packages/libs/lambda"], // this allows us to use absolute imports from these packages
  reporters: ["default", "jest-junit"]
};
