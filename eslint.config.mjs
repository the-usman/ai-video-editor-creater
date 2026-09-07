import { config } from "@remotion/eslint-config-flat";

export default [
  ...(Array.isArray(config) ? config : [config]),
  {
    // The editor app and the helper server are plain React/Node, not Remotion
    // markup — the Remotion-specific rules (native media tags, deterministic
    // randomness, pure animations) don't apply there.
    files: ["app/**/*.{ts,tsx}", "server/**/*.ts"],
    rules: {
      "@remotion/warn-native-media-tag": "off",
      "@remotion/deterministic-randomness": "off",
      "@remotion/non-pure-animation": "off",
      "@remotion/volume-callback": "off",
      "@remotion/even-dimensions": "off",
    },
  },
];
