package com.reactvision.virofacetracking;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * ViroFaceTrackingModule — parity module for @reactvision/react-viro-face-tracking.
 *
 * NOTE: On Android, front-camera AR (ARCore Augmented Faces) is provided by
 * @reactvision/react-viro core and works WITHOUT this package — Android has no
 * App Store TrueDepth restriction, so there is no reason to gate it behind an
 * optional package. This module exists purely for API symmetry with iOS (where
 * the package IS required) and to back ViroFaceTracking.isSupported() in JS.
 */
public class ViroFaceTrackingModule extends ReactContextBaseJavaModule {

    public ViroFaceTrackingModule(ReactApplicationContext ctx) {
        super(ctx);
    }

    @Override
    public String getName() {
        return "ViroFaceTracking";
    }

    /**
     * Reported for parity with iOS. ARCore Augmented Faces support depends on the
     * device being ARCore-capable; the actual session is managed by react-viro core.
     */
    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean isSupported() {
        return true;
    }
}
