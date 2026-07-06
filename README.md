<p align="center" style="background-colour: #CCCCCC;">
  <a href="https://www.reactvision.xyz/">
    <img src="https://avatars.githubusercontent.com/u/74572641?s=200&v=4" alt="ReactVision logo" width="120px" height="120px">
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@reactvision/react-viro-face-tracking">
    <img src="https://img.shields.io/npm/v/@reactvision/react-viro-face-tracking" alt="npm version">
  </a>
  <a href="https://www.npmjs.com/package/@reactvision/react-viro-face-tracking">
    <img src="https://img.shields.io/npm/dm/@reactvision/react-viro-face-tracking?colour=purple" alt="downloads">
  </a>
  <a href="https://discord.gg/yqqEGUjK">
    <img src="https://img.shields.io/discord/774471080713781259?label=Discord" alt="Discord">
  </a>
</p>

# ViroReact Face Tracking, By ReactVision

Front-camera (ARKit face-tracking) AR provider for [ViroReact](https://github.com/ReactVision/viro) — the optional backing for the [`frontCameraEnabled`](https://github.com/ReactVision/viro/blob/main/docs/PLATFORM_EXTENSIONS.md) prop on `ViroARSceneNavigator`.

This is the **only** package that references the ARKit face-tracking / **TrueDepth** API. Keeping it out of the core `@reactvision/react-viro` binary lets rear-camera apps (image markers, world tracking, plane detection) pass App Store review **Guideline 2.5.1** with zero configuration. Install it only when you actually need front-camera AR.

MIT licensed and free forever.

> **Requires [`@reactvision/react-viro`](https://www.npmjs.com/package/@reactvision/react-viro) ≥ 2.57.3** (the release with the front-camera provider seam). Works with both **React Native CLI** and **Expo** projects.

> **Just want a selfie _feed_ (no face tracking)?** You don't need this package. Use [`ViroCameraTexture`](https://github.com/ReactVision/viro/blob/main/docs/ViroCameraTexture.md) with `cameraPosition="front"` from the core package — it uses AVFoundation, never touches the TrueDepth API, and passes 2.5.1 cleanly.

## How it works

- **iOS:** a plain, dynamically-linked framework. The `ViroFaceTracking` Objective-C++ class registers a front-camera configuration provider automatically via `+load` when the framework is loaded — no manual call needed. The provider builds an `ARFaceTrackingConfiguration` (or returns `nil` on a device without a TrueDepth camera). It reaches the core by locating ViroKit's `VROFrontCameraProvider` at runtime via `NSClassFromString`, so this framework keeps **no** build- or link-time dependency on ViroKit (the same pattern as [`react-viro-onnx`](https://github.com/ReactVision/react-viro-onnx)).
- **Android:** no native dependency is added. Front-camera AR (ARCore Augmented Faces) already lives in core `@reactvision/react-viro` and works **without** this package — there is no Play Store TrueDepth restriction. The Android module autolinks purely for API symmetry with iOS.

Apple's 2.5.1 TrueDepth check is a **static binary scan** for `ARFaceTrackingConfiguration`. Keeping that symbol here — out of core ViroKit — is what lets rear-camera-only apps ship without declaring TrueDepth.

## Installation

```bash
npm install @reactvision/react-viro @reactvision/react-viro-face-tracking
```

Add **both** plugins to your `app.json` (this one *after* `@reactvision/react-viro`):

```json
{
  "expo": {
    "plugins": [
      "@reactvision/react-viro",
      ["@reactvision/react-viro-face-tracking", {
        "cameraUsageDescription": "We use the front camera for AR face effects."
      }]
    ]
  }
}
```

The config plugin:
- **iOS:** inserts `pod 'ViroReactFaceTracking'` at the end of the app target's Podfile (after the React Native / ViroKit pods, so it doesn't disturb `use_react_native!`), and injects `NSCameraUsageDescription` into `Info.plist`. The `cameraUsageDescription` option is optional (a sensible default is used) and is **not** overwritten if your app already declares one.
- **Android:** no changes — the module autolinks.

Then rebuild the native app (`npx expo prebuild --clean` then `npx expo run:ios` / `run:android`). On iOS, confirm in the logs that no `[ViroFaceTracking] … not found` error appears — the provider registers silently on success.

### Local development (consuming this package from source)

If the app installs this package from a **packed tarball** (e.g. `"@reactvision/react-viro-face-tracking": "file:../path/react-viro-face-tracking-1.0.0.tgz"`), then `node_modules` holds a *snapshot* — editing the source here does **not** reach the app until you re-pack and reinstall:

```bash
# in this package (after editing native/JS or the config plugin):
npm run build        # regenerates dist/ + plugin/build/
npm pack             # regenerates react-viro-face-tracking-1.0.0.tgz

# in the app:
rm -rf node_modules/@reactvision/react-viro-face-tracking
npm install <path-to>/react-viro-face-tracking-1.0.0.tgz
```

Symptoms of a stale tarball: a config-plugin resolution error during `expo prebuild` (no `app.plugin.js` in `node_modules`), or the front camera never activating / no `ViroFaceTracking` log lines. To skip re-packing during active dev, point the dep at the **folder** (`file:../path/react-viro-face-tracking`) instead of the tarball.

## Usage

There's nothing to call — the native provider registers itself when the framework is linked. Once installed, enable the front camera on your scene navigator:

```tsx
import { ViroARSceneNavigator } from "@reactvision/react-viro";

<ViroARSceneNavigator
  frontCameraEnabled
  initialScene={{ scene: MyFaceScene }}
/>;
```

On iOS this switches the session to the front TrueDepth camera; on Android it uses ARCore Augmented Faces. World tracking, plane detection, and LiDAR are unavailable while the front camera is active.

## App Store review (Guideline 2.5.1)

Installing this package adds the ARKit face-tracking (TrueDepth) API to your iOS binary, so Apple **will** review it under 2.5.1. Ship it only if your app has a genuine front-camera face-tracking feature, and keep `NSCameraUsageDescription` accurate (the config plugin sets it for you). If you only need a selfie feed, use `ViroCameraTexture` instead — see the note at the top.

## API

The provider registers itself automatically when the native pod is linked — there's nothing to call. The only exposed helper is a support probe:

```ts
import { ViroFaceTracking } from "@reactvision/react-viro-face-tracking";

ViroFaceTracking.isSupported();  // true only on devices with a TrueDepth camera (iOS)
```

## Documentation

- `frontCameraEnabled` reference: <https://github.com/ReactVision/viro/blob/main/docs/PLATFORM_EXTENSIONS.md>
- Selfie-feed alternative (`ViroCameraTexture`): <https://github.com/ReactVision/viro/blob/main/docs/ViroCameraTexture.md>
- ViroReact docs: <https://viro-community.readme.io/docs/overview>

## Community

Discord is the best place to find the team and other developers building with ViroReact:

<a href="https://discord.gg/A6TaFNqwVc">
  <img src="https://discordapp.com/api/guilds/774471080713781259/widget.png?style=banner2" />
</a>

## Find Out More

- Website: <https://reactvision.xyz>
- ViroReact: <https://reactvision.xyz/viro-react>
- ReactVision Studio: <https://studio.reactvision.xyz>
- Blog: <https://updates.reactvision.xyz>

---

MIT licensed. © ReactVision, Inc.
