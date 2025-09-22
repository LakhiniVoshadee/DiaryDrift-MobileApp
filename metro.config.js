const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Make metro more resilient to missing modules
const originalResolveRequest = config.resolver.resolveRequest;
if (originalResolveRequest) {
  config.resolver.resolveRequest = (context, moduleName, platform) => {
    try {
      return originalResolveRequest(context, moduleName, platform);
    } catch (e) {
      // If the error is about lightningcss, provide a more friendly error
      if (e.message && e.message.includes("lightningcss")) {
        console.warn(
          `Warning: Missing lightningcss module. Try running 'npm install lightningcss'`
        );
        return { type: "empty" };
      }
      throw e;
    }
  };
}

module.exports = withNativeWind(config, { input: "./global.css" });
