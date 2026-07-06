# @reactvision/react-viro-face-tracking

Front-camera (ARKit face-tracking) AR provider for [`@reactvision/react-viro`](https://www.npmjs.com/package/@reactvision/react-viro).

## Why this package exists

ARKit exposes the front camera **only** through `ARFaceTrackingConfiguration`, which uses the **TrueDepth** camera. Apple's App Store review (Guideline **2.5.1**) statically scans your binary for that API and rejects apps that include it without a matching, declared feature.

So the front-camera AR path is **not** in the core `@reactvision/react-viro` binary. Core stays free of the TrueDepth API, and apps that only use the rear camera (image markers, world tracking, plane detection) pass review with **zero configuration**.

If you actually need front-camera **face tracking**, install this package. It is the *only* place that references `ARFaceTrackingConfiguration`, and its config plugin declares the TrueDepth usage Apple expects.

> **Just want a selfie *feed* (no face tracking)?** You don't need this package. Use `ViroCameraTexture` with `cameraPosition="front"` from the core package — it uses AVFoundation, never touches the TrueDepth API, and passes 2.5.1 cleanly.

## Requirements

- `@reactvision/react-viro` **>= 2.57.3** (the release with the front-camera provider seam).
- iOS device with a TrueDepth camera (iPhone X or newer) for face tracking.

## Install

```sh
npm install @reactvision/react-viro-face-tracking
```

Add it to your `app.json` **after** `@reactvision/react-viro`:

```json
{
  "plugins": [
    "@reactvision/react-viro",
    ["@reactvision/react-viro-face-tracking", {
      "cameraUsageDescription": "We use the front camera for AR face effects."
    }]
  ]
}
```

The `cameraUsageDescription` prop is optional (a default is provided) and is skipped if your app already declares `NSCameraUsageDescription`.

Then rebuild your native project:

```sh
npx expo prebuild --clean
```

## Usage

There is nothing to call from JS — the native provider registers itself automatically (`+load` on iOS, module init on Android). Once installed, enable the front camera on your scene navigator:

```tsx
import { ViroARSceneNavigator } from "@reactvision/react-viro";

<ViroARSceneNavigator
  frontCameraEnabled
  initialScene={{ scene: MyFaceScene }}
/>;
```

Optional support check:

```tsx
import { ViroFaceTracking } from "@reactvision/react-viro-face-tracking";

if (ViroFaceTracking.isSupported()) {
  // device has a TrueDepth camera
}
```

## How it works

- **Core (`ViroKit`)** exposes an Objective-C registration host, `VROFrontCameraProvider`, that forwards to `VROARSessioniOS::setFrontCameraConfigProvider`. Core never references `ARFaceTrackingConfiguration`; it runs whatever `ARConfiguration` the provider returns via `-runWithConfiguration:`.
- **This package** locates `VROFrontCameraProvider` at runtime via `NSClassFromString` (so it needs no link-time dependency on ViroKit) and registers a block that builds an `ARFaceTrackingConfiguration`. This mirrors how [`react-viro-onnx`](https://github.com/ReactVision/react-viro-onnx) plugs an inference provider into `ViroObjectDetector`.

## App Store note

Installing this package adds the TrueDepth API to your iOS binary. Apple **will** review it under Guideline 2.5.1. Ship it only if your app has a genuine front-camera face-tracking feature, and keep the `NSCameraUsageDescription` accurate.

## Android

On Android there is no Play Store TrueDepth restriction, so front-camera AR (ARCore) remains in core `@reactvision/react-viro` and works **without** this package. The Android module here exists only for API symmetry.

## License

MIT © ReactVision
