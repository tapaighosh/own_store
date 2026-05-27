import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
        },
      },
    ],
  },
  testMatch: [
    "<rootDir>/tests/**/*.test.{ts,tsx}"
  ],
  collectCoverageFrom: [
    "app/api/**/*.{ts,tsx}",
    "lib/**/*.ts",
    "components/**/*.tsx",
    "!**/*.d.ts",
  ],
  testEnvironmentOptions: {
    customExportConditions: [""] // Often needed for React testing library in JSDOM, but this is Node env for API
  },
};

export default config;
