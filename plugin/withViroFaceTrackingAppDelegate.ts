import { ConfigPlugin, withAppDelegate } from "@expo/config-plugins";

const IMPORT_LINE = "import ViroReactFaceTracking";
const INSTALL_CALL = "ViroFaceTracking.install()";

/**
 * Adds an explicit reference to the ViroReactFaceTracking framework in the app's
 * AppDelegate so it is linked and loaded at launch.
 *
 * Why this is needed: the provider registers itself via the framework's `+load`,
 * but under `use_frameworks! :linkage => :dynamic` the host app references no
 * symbol from this framework (it's reached only through VROFrontCameraProvider at
 * runtime via NSClassFromString). Xcode 15+'s linker then omits the load command
 * and `+load` never runs. Importing the module and calling `+install` from the
 * AppDelegate is a hard reference that forces the framework to load and registers
 * the front-camera provider deterministically — no linker-flag guesswork.
 */
export const withViroFaceTrackingAppDelegate: ConfigPlugin = (config) =>
  withAppDelegate(config, (cfg) => {
    if (cfg.modResults.language !== "swift") {
      console.warn(
        "[react-viro-face-tracking] AppDelegate is not Swift — add " +
          "`#import <ViroReactFaceTracking/ViroFaceTracking.h>` and " +
          "`[ViroFaceTracking install];` to didFinishLaunchingWithOptions manually."
      );
      return cfg;
    }

    let contents = cfg.modResults.contents;

    // 1) Import the framework module (idempotent). Insert after the first `import`
    //    line (the template's first line is `internal import Expo`, which the
    //    `^import ` anchor deliberately skips).
    if (!contents.includes(IMPORT_LINE)) {
      contents = contents.replace(/^(import .+\n)/m, `$1${IMPORT_LINE}\n`);
    }

    // 2) Register the provider before didFinishLaunching returns (idempotent).
    if (!contents.includes(INSTALL_CALL)) {
      const anchor =
        "return super.application(application, didFinishLaunchingWithOptions: launchOptions)";
      if (contents.includes(anchor)) {
        contents = contents.replace(anchor, `${INSTALL_CALL}\n    ${anchor}`);
      } else {
        console.warn(
          "[react-viro-face-tracking] Could not find the didFinishLaunching return " +
            "in AppDelegate.swift; add `ViroFaceTracking.install()` there manually."
        );
      }
    }

    cfg.modResults.contents = contents;
    return cfg;
  });
