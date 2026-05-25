// @ts-check
import nextConfig from "eslint-config-next";

/**
 * ESLint flat config for Own Store.
 * eslint-config-next v16 ships as a native flat config array.
 */
const eslintConfig = [
  ...nextConfig,
  {
    rules: {
      // Prohibit console.log in production code (warn is fine for errors/warnings)
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];

export default eslintConfig;
