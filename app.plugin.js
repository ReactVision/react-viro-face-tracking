// Expo config plugin entry point.
// Expo resolves `app.plugin.js` at the package root when
// "@reactvision/react-viro-face-tracking" is listed in the app's plugins array.
// It delegates to the compiled plugin, which adds the ViroReactFaceTracking pod
// (iOS) and injects NSCameraUsageDescription for the TrueDepth camera.
module.exports = require("./plugin/build/withViroFaceTracking").default;
