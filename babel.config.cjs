module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
      [
        "module-resolver",
        {
          root: ["./src"],
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
          alias: {
            "@assets": "./src/assets",
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@utils": "./src/utils",
            "@hooks": "./src/hooks",
            "@services": "./src/services",
            "@navigation": "./src/navigation",
            "@config": "./src/config",
            "@contexts": "./src/contexts",
            "@asyncStorageData": "./src/asyncStorageData",
            "@functions": "./src/functions",
          },
        },
      ],

      // ⚠️ reanimated SEMPRE por último
      "react-native-reanimated/plugin",
    ],
  };
};
