//
//  ViroFaceTracking.h
//  ViroReactFaceTracking
//
//  Copyright © 2026 ReactVision. All rights reserved.

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * ViroFaceTracking — registers the front-camera (ARKit face-tracking) AR
 * configuration with ViroReact's core (VROFrontCameraProvider in ViroKit).
 * Registration happens automatically via +load when this framework is embedded
 * in the app. No JS call is required.
 *
 * This is the ONLY place in the ReactVision ecosystem that references the ARKit
 * face-tracking / TrueDepth API (ARFaceTrackingConfiguration). The core ViroKit
 * binary stays free of it, so apps that do NOT install this package pass App
 * Store review Guideline 2.5.1 without declaring TrueDepth.
 */
@interface ViroFaceTracking : NSObject

/** Registers the front-camera config provider with ViroKit (idempotent). */
+ (void)install;

/** YES if this device supports ARKit face tracking (has a TrueDepth camera). */
+ (BOOL)isSupported;

@end

NS_ASSUME_NONNULL_END
