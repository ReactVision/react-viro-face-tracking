import { ConfigPlugin, withPlugins } from "@expo/config-plugins";
import { withViroFaceTrackingIos, ViroFaceTrackingProps } from "./withViroFaceTrackingIos";
import { withViroFaceTrackingAndroid } from "./withViroFaceTrackingAndroid";

/**
 * Expo config plugin for @reactvision/react-viro-face-tracking.
 *
 * Configures the native project for front-camera (ARKit face-tracking) AR:
 * - iOS:     Adds `pod 'ViroReactFaceTracking'` and injects NSCameraUsageDescription.
 *            This is what brings the TrueDepth API into the binary — installing this
 *            package means your app WILL be reviewed for TrueDepth (Guideline 2.5.1),
 *            so it must have a genuine front-camera feature.
 * - Android: No-op (ARCore front camera lives in core react-viro; there is no Play
 *            Store TrueDepth restriction). The native module autolinks for parity.
 *
 * Usage in app.json:
 * ```json
 * {
 *   "plugins": [
 *     "@reactvision/react-viro",
 *     ["@reactvision/react-viro-face-tracking", {
 *       "cameraUsageDescription": "We use the front camera for AR face effects."
 *     }]
 *   ]
 * }
 * ```
 */
const withViroFaceTracking: ConfigPlugin<ViroFaceTrackingProps | void> = (config, props) => {
  return withPlugins(config, [
    [withViroFaceTrackingIos, props ?? {}],
    withViroFaceTrackingAndroid,
  ]);
};

export default withViroFaceTracking;
