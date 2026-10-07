//
//  ViroFaceTrackingModule.mm
//  ViroReactFaceTracking
//
//  Copyright © 2026 ReactVision. All rights reserved.
//
//  The React Native half of the package. ViroFaceTracking itself stays a plain framework whose
//  +load installs the front-camera provider, because that path must not depend on the bridge
//  being up. This module exists only so JS can reach +[ViroFaceTracking isSupported].
//
//  Without it, NativeModules.ViroFaceTracking was undefined and ViroFaceTracking.isSupported()
//  in JS fell through to its `?? false`, reporting "unsupported" on every device including the
//  TrueDepth ones the package exists for.

#import <React/RCTBridgeModule.h>

#import "ViroFaceTracking.h"

@interface ViroFaceTrackingModule : NSObject <RCTBridgeModule>
@end

@implementation ViroFaceTrackingModule

RCT_EXPORT_MODULE(ViroFaceTracking)

/*
 Synchronous, because the JS surface is a plain `isSupported(): boolean`. The answer is a device
 capability that never changes while the app runs, so there is nothing to await.
 */
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(isSupported)
{
  return @([ViroFaceTracking isSupported]);
}

/* The provider is installed from +load; nothing here touches the UI. */
+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
