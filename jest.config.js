module.exports = {
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  passWithNoTests: true,
  modulePathIgnorePatterns: ["/dist/"],
  collectCoverageFrom: [
    "**/*.js",
    "!**/node_modules/**",
    "!**/dist/**"
  ]
};