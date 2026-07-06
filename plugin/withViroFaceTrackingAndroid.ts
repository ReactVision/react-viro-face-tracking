import { ConfigPlugin } from "@expo/config-plugins";

/**
 * Android: no config changes are required.
 *
 * On Android, front-camera AR (ARCore) is provided by @reactvision/react-viro core
 * and works WITHOUT this package — there is no Play Store TrueDepth restriction that
 * warrants removing it from core. The package's Android module (ViroFaceTrackingModule)
 * autolinks for API symmetry with iOS and to report availability; it needs no Gradle
 * dependency injection.
 *
 * This plugin is a no-op kept for structural parity with the iOS side.
 */
export const withViroFaceTrackingAndroid: ConfigPlugin = (config) => config;
