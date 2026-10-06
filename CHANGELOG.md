# Changelog

## 1.0.1

### Fixed

- **`isSupported()` tells the truth on both platforms.** On iOS no React Native module was registered, so `NativeModules.ViroFaceTracking` was undefined and the call returned `false` on every device, TrueDepth ones included. A small bridge module, `ViroFaceTrackingModule`, forwards to the existing `[ARFaceTrackingConfiguration isSupported]` check; the pod now depends on `React-Core`. On Android the module returned a hard-coded `true`, so a device without ARCore support was told front-camera AR would work. It now asks ARCore (`ArCoreApk.checkAvailability`). ARCore can answer "still checking" on the first call, which reads as unsupported; asking again a moment later gives the settled answer.

## 1.0.0

First release. The front-camera (ARKit face-tracking) AR provider for `@reactvision/react-viro`, kept out of core so apps that do not use the TrueDepth camera do not reference it.
