import {
  ConfigPlugin,
  withDangerousMod,
  withInfoPlist,
  withPlugins,
} from "@expo/config-plugins";
import fs from "fs";
import { withViroFaceTrackingAppDelegate } from "./withViroFaceTrackingAppDelegate";

export type ViroFaceTrackingProps = {
  /**
   * NSCameraUsageDescription text shown in the iOS permission prompt. Front-camera
   * AR uses the TrueDepth camera, so this string is required for App Store review.
   * Only set if the app doesn't already declare one.
   */
  cameraUsageDescription?: string;
};

const DEFAULT_CAMERA_USAGE =
  "This app uses the front camera for face-tracking augmented reality.";

// 2-space indented (inside the target), no leading/trailing newline.
const POD_BLOCK =
  "  # Front-camera (ARKit face-tracking) AR provider for @reactvision/react-viro.\n" +
  "  # Brings the ARKit TrueDepth API into the binary — NSCameraUsageDescription is required.\n" +
  "  pod 'ViroReactFaceTracking', :path => '../node_modules/@reactvision/react-viro-face-tracking/ios'";

// Declare the front-camera usage string so Apple sees a TrueDepth feature. Only set it
// if the app hasn't already provided one (don't clobber a hand-written description).
const withCameraUsage: ConfigPlugin<ViroFaceTrackingProps> = (config, props) =>
  withInfoPlist(config, (newConfig) => {
    if (!newConfig.modResults.NSCameraUsageDescription) {
      newConfig.modResults.NSCameraUsageDescription =
        props.cameraUsageDescription ?? DEFAULT_CAMERA_USAGE;
    }
    return newConfig;
  });

// Add the ViroReactFaceTracking pod. Inserted at the very END of the target (before its
// closing `end`) so it always lands after the ViroReact/ViroKit pods regardless of the
// order in which the two plugins' dangerous mods run — identical strategy to react-viro-onnx.
const withFaceTrackingPod: ConfigPlugin = (config) =>
  withDangerousMod(config, [
    "ios",
    async (newConfig) => {
      const podfilePath = `${newConfig.modRequest.platformProjectRoot}/Podfile`;
      const data = fs.readFileSync(podfilePath, "utf-8");

      // Idempotent: skip if already present.
      if (data.includes("ViroReactFaceTracking")) {
        return newConfig;
      }

      const lines = data.split("\n");
      const targetIdx = lines.findIndex((l) => /^target\s+['"].*\bdo\b/.test(l));
      // The first column-0 `end` after the target line is the target's own closing `end`
      // (the post_install `end` is indented).
      let endIdx = -1;
      for (let i = targetIdx >= 0 ? targetIdx + 1 : 0; i < lines.length; i++) {
        if (/^end\s*$/.test(lines[i])) {
          endIdx = i;
          break;
        }
      }

      if (endIdx < 0) {
        console.warn(
          "[react-viro-face-tracking] Could not find the target's closing `end` in the " +
            "Podfile; the ViroReactFaceTracking pod was not added."
        );
        return newConfig;
      }

      lines.splice(endIdx, 0, "", ...POD_BLOCK.split("\n"));
      fs.writeFileSync(podfilePath, lines.join("\n"), "utf-8");

      return newConfig;
    },
  ]);

export const withViroFaceTrackingIos: ConfigPlugin<ViroFaceTrackingProps> = (config, props = {}) =>
  withPlugins(config, [
    [withCameraUsage, props],
    withFaceTrackingPod,
    withViroFaceTrackingAppDelegate,
  ]);
