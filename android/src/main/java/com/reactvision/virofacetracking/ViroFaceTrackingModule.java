package com.reactvision.virofacetracking;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.util.Log;

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

    private static final String TAG = "ViroFaceTracking";

    public ViroFaceTrackingModule(ReactApplicationContext ctx) {
        super(ctx);
    }

    @Override
    public String getName() {
        return "ViroFaceTracking";
    }

    /**
     * Whether this device can run ARCore, which is what Augmented Faces needs.
     *
     * This used to return a hardcoded {@code true}, so a device with no ARCore support —
     * or without Google Play Services for AR installed — was told front-camera AR would
     * work, and the session failed later with nothing to explain it.
     *
     * ARCore is reached by reflection on purpose: it ships with @reactvision/react-viro
     * core, so this package needs no dependency of its own. That mirrors the iOS half,
     * which resolves ViroKit through NSClassFromString for the same reason.
     *
     * ARCore answers UNKNOWN_CHECKING while its first query is still in flight, and
     * {@code Availability.isSupported()} is false for it. A caller asking this early can
     * get a false negative; asking again a moment later gives the settled answer.
     */
    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean isSupported() {
        try {
            Class<?> arCoreApk = Class.forName("com.google.ar.core.ArCoreApk");
            Object instance = arCoreApk.getMethod("getInstance").invoke(null);
            Object availability = arCoreApk
                    .getMethod("checkAvailability", android.content.Context.class)
                    .invoke(instance, getReactApplicationContext());
            if (availability == null) {
                return false;
            }
            Object supported = availability.getClass().getMethod("isSupported").invoke(availability);
            return Boolean.TRUE.equals(supported);
        } catch (Throwable t) {
            // No ARCore on the classpath, or the device cannot answer: either way, not supported.
            Log.w(TAG, "ARCore availability check failed: " + t);
            return false;
        }
    }
}
