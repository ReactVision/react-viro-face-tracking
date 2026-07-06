import { NativeModules } from "react-native";

/**
 * ViroFaceTracking — front-camera (ARKit face-tracking / TrueDepth) AR provider
 * for @reactvision/react-viro.
 *
 * The provider registers itself automatically when the native pod (iOS) or AAR
 * (Android) is linked — via `+load` on iOS and React Native module init on
 * Android. There is nothing to call from JS: installing the package and adding
 * the config plugin is enough. Once installed, set `frontCameraEnabled` on
 * `ViroARSceneNavigator` to run the session on the front camera.
 *
 * ⚠️ App Store note: installing this package adds the ARKit face-tracking
 * (TrueDepth) API to your iOS binary. Apple will reject the app under Guideline
 * 2.5.1 unless it (a) declares `NSCameraUsageDescription` — the bundled Expo
 * config plugin does this automatically — and (b) has a genuine front-camera
 * feature. If you only need a selfie *feed* (no face tracking), do NOT use this
 * package: use `ViroCameraTexture` with `cameraPosition="front"` from the core
 * package instead — it uses AVFoundation and never touches the TrueDepth API.
 */
export const ViroFaceTracking = {
  /**
   * Whether this device supports front-camera face tracking.
   * iOS: true only on devices with a TrueDepth camera.
   * Backed by a native module; returns false if the package is not linked.
   */
  isSupported(): boolean {
    return NativeModules.ViroFaceTracking?.isSupported?.() ?? false;
  },
};
