//
//  ViroFaceTracking.mm
//  ViroReactFaceTracking
//
//  Copyright © 2026 ReactVision. All rights reserved.
//
//  Plain iOS framework — no React Native module registration. +load fires when
//  the dynamic framework is embedded and loaded by iOS, which installs the
//  front-camera config provider into ViroKit before any AR session is created.
//
//  ARFaceTrackingConfiguration (the TrueDepth API) is referenced ONLY in this
//  file. Keeping it here — rather than in core ViroKit — is what lets apps that
//  don't need front-camera AR pass App Store review 2.5.1.

#import "ViroFaceTracking.h"
#import <ARKit/ARKit.h>
#import <objc/message.h>

@implementation ViroFaceTracking

+ (void)install {
    static dispatch_once_t once;
    dispatch_once(&once, ^{
        // ViroKit exposes VROFrontCameraProvider as the registration host. Locate it
        // at runtime (mirrors react-viro-onnx) so this framework needs no link-time
        // dependency on ViroKit — React/Viro symbols resolve from the host app.
        Class host = NSClassFromString(@"VROFrontCameraProvider");
        if (!host) {
            NSLog(@"[ViroFaceTracking] VROFrontCameraProvider not found — is @reactvision/react-viro (ViroKit) linked, and >= 2.57.3?");
            return;
        }
        SEL sel = NSSelectorFromString(@"registerConfigProvider:");
        if (![host respondsToSelector:sel]) {
            NSLog(@"[ViroFaceTracking] registerConfigProvider: not found — ViroKit too old (requires >= 2.57.3).");
            return;
        }

        // The provider builds a ready-to-run front-camera configuration, or returns
        // nil on devices without a TrueDepth camera (core then falls through to world
        // tracking). Returned as the ARConfiguration base class — ViroKit runs it via
        // -runWithConfiguration: without ever naming the face-tracking subclass.
        ARConfiguration * _Nullable (^provider)(void) = ^ARConfiguration * _Nullable {
            if (@available(iOS 11.0, *)) {
                if (![ARFaceTrackingConfiguration isSupported]) {
                    NSLog(@"[ViroFaceTracking] ARFaceTrackingConfiguration not supported on this device.");
                    return nil;
                }
                ARFaceTrackingConfiguration *config = [[ARFaceTrackingConfiguration alloc] init];
                config.lightEstimationEnabled = YES;
                return config;
            }
            return nil;
        };

        void (*fn)(id, SEL, id) = (void (*)(id, SEL, id))objc_msgSend;
        fn(host, sel, provider);
        NSLog(@"[ViroFaceTracking] front-camera AR provider registered with ViroKit.");
    });
}

+ (BOOL)isSupported {
    if (@available(iOS 11.0, *)) {
        return [ARFaceTrackingConfiguration isSupported];
    }
    return NO;
}

// +load fires when the dynamic framework is embedded and loaded by iOS, before main().
+ (void)load {
    [self install];
}

@end
